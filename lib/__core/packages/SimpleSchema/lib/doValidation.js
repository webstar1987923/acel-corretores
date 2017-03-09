import MongoObject from 'mongo-object';
import _ from 'underscore';
import { SimpleSchema } from './SimpleSchema';
import { appendAffectedKey, getParentOfKey, looksLikeModifier, isObjectWeShouldTraverse } from './utility.js';
import typeValidator from './validation/typeValidator';
import requiredValidator from './validation/requiredValidator';
import allowedValuesValidator from './validation/allowedValuesValidator';

function shouldCheck(key) {
  if (key === '$pushAll') throw new Error('$pushAll is not supported; use $push + $each');
  return ['$pull', '$pullAll', '$pop', '$slice'].indexOf(key) === -1;
}

function doValidation({
  extendedCustomContext,
  ignoreTypes,
  isModifier,
  isUpsert,
  keysToValidate,
  mongoObject,
  obj,
  schema,
  validationContext,
}) {
  // First do some basic checks of the object, and throw errors if necessary
  if (!_.isObject(obj)) {
    throw new Error('The first argument of validate() must be an object');
  }

  if (!isModifier && looksLikeModifier(obj)) {
    throw new Error('When the validation object contains mongo operators, you must set the modifier option to true');
  }

  let validationErrors = [];

  // Validation function called for each affected key
  function validate(val, affectedKey, affectedKeyGeneric, def, op, isInArrayItemObject, isInSubObject) {
    // Get the schema for this key, marking invalid if there isn't one.
    if (!def) {
      validationErrors.push({
        name: affectedKey,
        type: SimpleSchema.ErrorTypes.KEY_NOT_IN_SCHEMA,
        value: val,
      });
      return;
    }

    // For $rename, make sure that the new name is allowed by the schema
    if (op === '$rename' && !schema.allowsKey(val)) {
      validationErrors.push({
        name: val,
        type: SimpleSchema.ErrorTypes.KEY_NOT_IN_SCHEMA,
        value: null,
      });
      return;
    }

    // Prepare the context object for the validator functions
    const fieldParentName = getParentOfKey(affectedKey, true);

    function getFieldInfo(key) {
      // Create mongoObject if necessary, cache for speed
      if (!mongoObject) mongoObject = new MongoObject(obj, schema.blackboxKeys());

      const keyInfo = mongoObject.getInfoForKey(key) || {};
      return {
        isSet: (keyInfo.value !== undefined),
        value: keyInfo.value,
        operator: keyInfo.operator || null,
      };
    }

    const fieldValidationErrors = [];

    const validatorContext = {
      addValidationErrors(errors) {
        for (const error of errors) {
          fieldValidationErrors.push(error);
        }
      },
      field(fName) {
        return getFieldInfo(fName);
      },
      genericKey: affectedKeyGeneric,
      isInArrayItemObject,
      isInSubObject,
      isModifier,
      isSet: (val !== undefined),
      key: affectedKey,
      obj,
      operator: op,
      siblingField(fName) {
        return getFieldInfo(fieldParentName + fName);
      },
      validationContext,
      value: val,
      // Value checks are not necessary for null or undefined values,
      // except for null array items, or for $unset or $rename values
      valueShouldBeChecked: (
        op !== '$unset' && op !== '$rename' &&
        ((val !== undefined && val !== null) || (affectedKeyGeneric.slice(-2) === '.$' && val === null))
      ),
      ...(extendedCustomContext || {}),
    };

    const builtInValidators = [
      requiredValidator,
      typeValidator,
      allowedValuesValidator,
    ];
    const validators = builtInValidators
      .concat(schema._validators)
      .concat(SimpleSchema._validators);

    // Loop through each of the definitions in the SimpleSchemaGroup.
    // If any return true, we're valid.
    const fieldIsValid = _.some(def.type, (typeDef) => {
      const finalValidatorContext = {
        ...validatorContext,

        // Take outer definition props like "optional" and "label"
        // and add them to inner props like "type" and "min"
        definition: {
          ..._.omit(def, 'type'),
          ...typeDef,
        },
      };

      // Add custom field validators to the list after the built-in
      // validators but before the schema and global validators.
      const fieldValidators = validators.slice(0);
      if (typeof typeDef.custom === 'function') {
        fieldValidators.splice(builtInValidators.length, 0, typeDef.custom);
      }

      // We use _.every just so that we don't continue running more validator
      // functions after the first one returns false or an error string.
      return _.every(fieldValidators, (validator) => {
        const result = validator.call(finalValidatorContext);

        // If the validator returns a string, assume it is the
        // error type.
        if (typeof result === 'string') {
          fieldValidationErrors.push({
            name: affectedKey,
            type: result,
            value: val,
          });
          return false;
        }

        // If the validator returns an object, assume it is an
        // error object.
        if (typeof result === 'object' && result !== null) {
          fieldValidationErrors.push({
            name: affectedKey,
            value: val,
            ...result,
          });
          return false;
        }

        // If the validator returns false, assume they already
        // called this.addValidationErrors within the function
        if (result === false) return false;

        // Any other return value we assume means it was valid
        return true;
      });
    });

    if (!fieldIsValid) {
      validationErrors = validationErrors.concat(fieldValidationErrors);
    }
  }

  // The recursive function
  function checkObj({
    val,
    affectedKey,
    operator,
    isInArrayItemObject = false,
    isInSubObject = false,
  }) {
    let affectedKeyGeneric;
    let def;

    if (affectedKey) {
      // When we hit a blackbox key, we don't progress any further
      if (schema.keyIsInBlackBox(affectedKey)) return;

      // Make a generic version of the affected key, and use that
      // to get the schema for this key.
      affectedKeyGeneric = MongoObject.makeKeyGeneric(affectedKey);
      def = schema.getDefinition(affectedKey);

      const shouldValidateKey = !keysToValidate || _.any(keysToValidate, keyToValidate => (
        keyToValidate === affectedKey ||
        keyToValidate === affectedKeyGeneric ||
        affectedKey.startsWith(`${keyToValidate}.`) ||
        affectedKeyGeneric.startsWith(`${keyToValidate}.`)
      ));

      // Perform validation for this key
      if (shouldValidateKey) {
        validate(val, affectedKey, affectedKeyGeneric, def, operator, isInArrayItemObject, isInSubObject);
      }
    }

    // If affectedKeyGeneric is undefined due to this being the first run of this
    // function, objectKeys will return the top-level keys.
    const childKeys = schema.objectKeys(affectedKeyGeneric);

    // Temporarily convert missing objects to empty objects
    // so that the looping code will be called and required
    // descendent keys can be validated.
    if ((val === undefined || val === null) && (!def || (!def.optional && childKeys && childKeys.length > 0))) {
      val = {};
    }

    // Loop through arrays
    if (Array.isArray(val)) {
      _.each(val, (v, i) => {
        checkObj({
          val: v,
          affectedKey: `${affectedKey}.${i}`,
          operator,
        });
      });
    } else if (isObjectWeShouldTraverse(val) && (!def || !def.blackbox)) {
      // Loop through object keys

      // Get list of present keys
      const presentKeys = Object.keys(val);

      // Check all present keys plus all keys defined by the schema.
      // This allows us to detect extra keys not allowed by the schema plus
      // any missing required keys, and to run any custom functions for other keys.
      const keysToCheck = _.union(presentKeys, childKeys);

      // If this object is within an array, make sure we check for
      // required as if it's not a modifier
      isInArrayItemObject = (affectedKeyGeneric && affectedKeyGeneric.slice(-2) === '.$');

      // Check all keys in the merged list
      _.each(keysToCheck, (key) => {
        checkObj({
          val: val[key],
          affectedKey: appendAffectedKey(affectedKey, key),
          operator,
          isInArrayItemObject,
          isInSubObject: true,
        });
      });
    }
  }

  function checkModifier(mod) {
    // If this is an upsert, add all the $setOnInsert keys to $set;
    // since we don't know whether it will be an insert or update, we'll
    // validate upserts as if they will be an insert.
    if ('$setOnInsert' in mod) {
      if (isUpsert) {
        mod.$set = mod.$set || {};
        mod.$set = Object.assign(mod.$set, mod.$setOnInsert);
      }
      delete mod.$setOnInsert;
    }

    // Loop through operators
    _.each(mod, (opObj, op) => {
      // If non-operators are mixed in, throw error
      if (op.slice(0, 1) !== '$') {
        throw new Error(`Expected '${op}' to be a modifier operator like '$set'`);
      }
      if (shouldCheck(op)) {
        // For an upsert, missing props would not be set if an insert is performed,
        // so we check them all with undefined value to force any 'required' checks to fail
        if (isUpsert && op === '$set') {
          const presentKeys = Object.keys(opObj);
          schema.objectKeys().forEach((schemaKey) => {
            if (!Array.includes(presentKeys, schemaKey)) {
              checkObj({
                val: undefined,
                affectedKey: schemaKey,
                operator: op,
              });
            }
          });
        }
        _.each(opObj, (v, k) => {
          if (op === '$push' || op === '$addToSet') {
            if (typeof v === 'object' && '$each' in v) {
              v = v.$each;
            } else {
              k = `${k}.0`;
            }
          }
          checkObj({
            val: v,
            affectedKey: k,
            operator: op,
          });
        });
      }
    });
  }

  // Kick off the validation
  if (isModifier) {
    checkModifier(obj);
  } else {
    checkObj({ val: obj });
  }

  // Custom whole-doc validators
  const docValidators = schema._docValidators.concat(SimpleSchema._docValidators);
  docValidators.forEach((func) => {
    const errors = func(obj);
    if (!Array.isArray(errors)) throw new Error('Custom doc validator must return an array of error objects');
    if (errors.length) validationErrors = validationErrors.concat(errors);
  });

  const addedFieldNames = [];
  validationErrors = _.filter(validationErrors, (errObj) => {
    // Remove error types the user doesn't care about
    if (Array.includes(ignoreTypes, errObj.type)) return false;
    // Make sure there is only one error per fieldName
    if (Array.includes(addedFieldNames, errObj.name)) return false;

    addedFieldNames.push(errObj.name);
    return true;
  });
  return validationErrors;
}

export default doValidation;
