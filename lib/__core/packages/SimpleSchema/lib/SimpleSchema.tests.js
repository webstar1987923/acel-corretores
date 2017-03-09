/* eslint-disable func-names, prefer-arrow-callback */

import { SimpleSchema } from './SimpleSchema';
import expect from 'expect';
import testSchema from './testHelpers/testSchema';
import expectValid from './testHelpers/expectValid';
import expectErrorOfTypeLength from './testHelpers/expectErrorOfTypeLength';

class CustomObject {
  constructor(obj) {
    Object.assign(this, obj);
  }

  bar() {
    return 20;
  }
}

describe('SimpleSchema', function () {
  it('throws error if a key is missing type', function () {
    expect(function () {
      return new SimpleSchema({
        foo: {},
      });
    }).toThrow('foo key is missing "type"');
  });

  describe('nesting', function () {
    it('throws an error if a nested schema defines a field that its parent also defines', function () {
      expect(function () {
        return new SimpleSchema({
          "foo": new SimpleSchema({
            bar: String,
          }),
          'foo.bar': String,
        });
      }).toThrow();
    });

    it('expects a field with SimpleSchema type to be an object', function () {
      const schema = new SimpleSchema({
        foo: new SimpleSchema({
          bar: String,
        }),
      });

      const context = schema.newContext();
      context.validate({
        foo: 'string',
      });

      expect(context.validationErrors()).toEqual([
        {
          dataType: 'Object',
          name: 'foo',
          type: SimpleSchema.ErrorTypes.EXPECTED_TYPE,
          value: 'string',
        },
      ]);
    });

    it('includes type validation errors from nested schemas', function () {
      const schema = new SimpleSchema({
        foo: new SimpleSchema({
          bar: String,
        }),
      });

      const context = schema.newContext();
      context.validate({
        foo: {
          bar: 12345,
        },
      });

      expect(context.validationErrors()).toEqual([
        {
          dataType: 'String',
          name: 'foo.bar',
          type: SimpleSchema.ErrorTypes.EXPECTED_TYPE,
          value: 12345,
        },
      ]);
    });

    it('includes allowed value validation errors from nested schemas', function () {
      const schema = new SimpleSchema({
        foo: new SimpleSchema({
          bar: {
            type: String,
            allowedValues: ['hot'],
          },
        }),
      });

      const context = schema.newContext();
      context.validate({
        foo: {
          bar: 'cold',
        },
      });

      expect(context.validationErrors()).toEqual([
        {
          name: 'foo.bar',
          type: SimpleSchema.ErrorTypes.VALUE_NOT_ALLOWED,
          value: 'cold',
        },
      ]);
    });

    it('includes validation errors from nested schemas when validating modifiers', function () {
      const schema = new SimpleSchema({
        foo: new SimpleSchema({
          bar: String,
        }),
      });

      const context = schema.newContext();
      context.validate({
        $set: {
          'foo.bar': 12345,
        },
      }, { modifier: true });

      expect(context.validationErrors()).toEqual([
        {
          dataType: 'String',
          name: 'foo.bar',
          type: SimpleSchema.ErrorTypes.EXPECTED_TYPE,
          value: 12345,
        },
      ]);
    });

    it('validates nested requiredness', function () {
      const schema = new SimpleSchema({
        a: {
          type: new SimpleSchema({
            b: {
              type: new SimpleSchema({
                c: {
                  type: String,
                },
              }),
            },
          }),
        },
      });

      let context = schema.newContext();
      context.validate({ a: {} });

      expect(context.validationErrors()).toEqual([
        {
          name: 'a.b',
          type: SimpleSchema.ErrorTypes.REQUIRED,
          value: undefined,
        },
        {
          name: 'a.b.c',
          type: SimpleSchema.ErrorTypes.REQUIRED,
          value: undefined,
        },
      ]);

      context = schema.newContext();
      context.validate({ a: { b: {} } });

      expect(context.validationErrors()).toEqual([
        {
          name: 'a.b.c',
          type: SimpleSchema.ErrorTypes.REQUIRED,
          value: undefined,
        },
      ]);
    });
  });

  it('Issue #123', function () {
    // With $set
    const userSchema = new SimpleSchema({
      "profile": {
        type: Object,
      },
      'profile.name': {
        type: String,
      },
    });

    const context = userSchema.namedContext();

    expect(context.validate({
      $set: {
        profile: {},
      },
    }, { modifier: true })).toEqual(false);

    // With $push
    const userSchema2 = new SimpleSchema({
      "profile": {
        type: Array,
      },
      'profile.$': {
        type: Object,
      },
      'profile.$.name': {
        type: String,
      },
    });

    const context2 = userSchema2.namedContext();

    expect(context2.validate({
      $push: {
        profile: {},
      },
    }, { modifier: true })).toEqual(false);
  });

  it('validate object with prototype', function () {
    const schema = new SimpleSchema({
      foo: { type: SimpleSchema.Integer },
    });

    const testObj = new CustomObject({ foo: 1 });

    const context = schema.namedContext();
    expect(context.validate(testObj)).toBe(true);
    expect(testObj instanceof CustomObject).toBe(true);

    testObj.foo = 'not a number';
    expect(context.validate(testObj)).toBe(false);
  });

  it('validate object with prototype within normal object', function () {
    const schema = new SimpleSchema({
      "customObject": Object,
      'customObject.foo': SimpleSchema.Integer,
    });

    const customObject = new CustomObject({ foo: 1 });
    const testObj = {
      customObject,
    };

    const context = schema.namedContext();
    expect(context.validate(testObj)).toBe(true);
    expect(testObj.customObject instanceof CustomObject).toBe(true);

    testObj.customObject.foo = 'not a number';
    expect(context.validate(testObj)).toBe(false);
  });

  it('allowsKey', function () {
    function run(key, allowed) {
      expect(testSchema.allowsKey(key)).toEqual(allowed);
    }

    run('minMaxString', true);
    run('minMaxString.$', false);
    run('minMaxString.$.foo', false);
    run('minMaxString.$foo', false);
    run('minMaxString.foo', false);
    run('sub', true);
    run('sub.number', true);
    run('sub.number.$', false);
    run('sub.number.$.foo', false);
    run('sub.number.$foo', false);
    run('sub.number.foo', false);
    run('minMaxStringArray', true);
    run('minMaxStringArray.$', true);
    run('minMaxStringArray.$.foo', false);
    run('minMaxStringArray.foo', false);
    run('customObject', true);
    run('customObject.$', false);
    run('customObject.foo', true);
    run('customObject.foo.$', true);
    run('customObject.foo.$foo', true);
    run('customObject.foo.$.$foo', true);
    run('blackBoxObject', true);
    run('blackBoxObject.$', false);
    run('blackBoxObject.foo', true);
    run('blackBoxObject.foo.$', true);
    run('blackBoxObject.foo.$foo', true);
    run('blackBoxObject.foo.$.$foo', true);
    run('blackBoxObject.foo.bar.$.baz', true);
  });

  it('allowsKey in subschema', function () {
    const schema = new SimpleSchema({
      foo: new SimpleSchema({
        "bar": Object,
        'bar.baz': String,
      }),
    });

    expect(schema.allowsKey('foo.bar')).toEqual(true);
    expect(schema.allowsKey('foo.bar.baz')).toEqual(true);
    expect(schema.allowsKey('foo.bar.bum')).toEqual(false);
    expect(schema.allowsKey('foo.bar.baz.bum')).toEqual(false);
  });

  it('keyIsInBlackBox in subschema', function () {
    const schema = new SimpleSchema({
      foo: new SimpleSchema({
        bar: {
          type: Object,
          blackbox: true,
        },
      }),
    });

    expect(schema.keyIsInBlackBox('foo.bar')).toEqual(false);
    expect(schema.keyIsInBlackBox('foo.bar.baz')).toEqual(true);
    expect(schema.keyIsInBlackBox('foo.bar.baz.$.bum')).toEqual(true);
  });

  describe('blackboxKeys from subschema', function () {
    const schema = new SimpleSchema({
      apple: {
        type: Object,
        blackbox: true,
      },
      pear: new SimpleSchema({
        info: {
          type: Object,
          blackbox: true,
        },
      }),
    });

    it('are correct', function () {
      expect(schema.blackboxKeys()).toEqual(['apple', 'pear.info']);
    });

    it('are updated after extending', function () {
      schema.extend({
        pear: String,
      });

      expect(schema.blackboxKeys()).toEqual(['apple']);
    });
  });


  describe('extend', function () {
    it('works for plain object', function () {
      const schema = new SimpleSchema({
        firstName: {
          type: String,
          label: 'First name',
          optional: false,
        },
        lastName: {
          type: String,
          label: 'Last name',
          optional: false,
        },
      });

      schema.extend({
        firstName: {
          optional: true,
        },
      });

      expect(schema.schema()).toEqual({
        firstName: {
          type: SimpleSchema.oneOf(String),
          label: 'First name',
          optional: true,
        },
        lastName: {
          type: SimpleSchema.oneOf(String),
          label: 'Last name',
          optional: false,
        },
      });
    });

    it('works for another SimpleSchema instance and copies validators', function () {
      const schema1 = new SimpleSchema({
        firstName: {
          type: String,
          label: 'First name',
          optional: false,
        },
        lastName: {
          type: String,
          label: 'Last name',
          optional: false,
        },
      });

      const schema2 = new SimpleSchema({
        age: {
          type: Number,
          label: 'Age',
        },
      });
      schema2.addValidator(() => {});
      schema2.addDocValidator(() => {});

      expect(schema1.schema()).toEqual({
        firstName: {
          type: SimpleSchema.oneOf(String),
          label: 'First name',
          optional: false,
        },
        lastName: {
          type: SimpleSchema.oneOf(String),
          label: 'Last name',
          optional: false,
        },
      });
      expect(schema1._validators.length).toBe(0);
      expect(schema1._docValidators.length).toBe(0);

      schema1.extend(schema2);

      expect(schema1.schema()).toEqual({
        firstName: {
          type: SimpleSchema.oneOf(String),
          label: 'First name',
          optional: false,
        },
        lastName: {
          type: SimpleSchema.oneOf(String),
          label: 'Last name',
          optional: false,
        },
        age: {
          type: SimpleSchema.oneOf(Number),
          label: 'Age',
          optional: false,
        },
      });
      expect(schema1._validators.length).toBe(1);
      expect(schema1._docValidators.length).toBe(1);
    });
  });

  it('empty required array is valid', function () {
    const schema = new SimpleSchema({
      "names": { type: Array },
      'names.$': { type: String },
    });

    expectValid(schema, {
      names: [],
    });
  });

  it('null in array is not valid', function () {
    const schema = new SimpleSchema({
      "names": { type: Array },
      'names.$': { type: String },
    });

    expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, schema, {
      names: [null],
    });
  });

  it('null is valid for optional', function () {
    const schema = new SimpleSchema({
      test: { type: String, optional: true },
    });

    expectValid(schema, {
      test: null,
    });
  });

  it('issue 360', function () {
    const schema = new SimpleSchema({
      "emails": {
        type: Array,
      },
      'emails.$': {
        type: Object,
      },
      'emails.$.address': {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
      },
      'emails.$.verified': {
        type: Boolean,
      },
    });

    expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, schema, {
      emails: [
        {
          address: 12321,
          verified: 'asdasd',
        },
      ],
    }, { keys: ['emails'] }).toEqual(2);

    expectErrorOfTypeLength(SimpleSchema.ErrorTypes.EXPECTED_TYPE, schema, {
      emails: [
        {
          address: 12321,
          verified: 'asdasd',
        },
      ],
    }, { keys: ['emails.0'] }).toEqual(2);
  });

  it('ignore option', function () {
    const schema = new SimpleSchema({
      foo: { type: String, optional: true },
    });

    expectValid(schema, {
      foo: 'bar',
    });

    expectValid(schema, {
      foo: 'bar',
    }, {
      ignore: [SimpleSchema.ErrorTypes.KEY_NOT_IN_SCHEMA],
    });

    expectValid(schema, {
      foo: 'bar',
    }, {
      keys: ['foo'],
      ignore: [SimpleSchema.ErrorTypes.KEY_NOT_IN_SCHEMA],
    });

    expectErrorOfTypeLength(SimpleSchema.ErrorTypes.KEY_NOT_IN_SCHEMA, schema, {
      bar: 'foo',
    });

    expectValid(schema, {
      bar: 'foo',
    }, {
      ignore: [SimpleSchema.ErrorTypes.KEY_NOT_IN_SCHEMA],
    });

    expectValid(schema, {
      bar: 'foo',
    }, {
      keys: ['bar'],
      ignore: [SimpleSchema.ErrorTypes.KEY_NOT_IN_SCHEMA],
    });
  });

  it('ClientError', function () {
    const schema = new SimpleSchema({
      int: SimpleSchema.Integer,
      string: String,
    });

    function verify(error) {
      expect(error.name).toEqual('ClientError');
      expect(error.errorType).toEqual('ClientError');
      expect(error.error).toEqual('validation-error');
      expect(error.details.length).toEqual(2);
      expect(error.details[0].name).toEqual('int');
      expect(error.details[0].type).toEqual(SimpleSchema.ErrorTypes.EXPECTED_TYPE);
      expect(error.details[1].name).toEqual('string');
      expect(error.details[1].type).toEqual(SimpleSchema.ErrorTypes.REQUIRED);

      // In order for the message at the top of the stack trace to be useful,
      // we set it to the first validation error message.
      expect(error.reason, 'Int must be of type Integer');
      expect(error.message, 'Int must be of type Integer [validation-error]');
    }

    try {
      schema.validate({ int: '5' });
    } catch (error) {
      verify(error);
    }

    try {
      SimpleSchema.validate({ int: '5' }, schema);
    } catch (error) {
      verify(error);
    }

    try {
      SimpleSchema.validate({ int: '5' }, {
        int: SimpleSchema.Integer,
        string: String,
      });
    } catch (error) {
      verify(error);
    }

    try {
      schema.validator()({ int: '5' });
    } catch (error) {
      verify(error);
    }

    expect(function () {
      schema.validator({ clean: true })({ int: '5', string: 'test' });
    }).toNotThrow();
  });

  it('validate takes an array', function () {
    const schema = new SimpleSchema({
      int: SimpleSchema.Integer,
      string: String,
    });

    function verify(error) {
      expect(error.name).toEqual('ClientError');
      expect(error.errorType).toEqual('ClientError');
      expect(error.error).toEqual('validation-error');
      expect(error.details.length).toEqual(2);
      expect(error.details[0].name).toEqual('int');
      expect(error.details[0].type).toEqual(SimpleSchema.ErrorTypes.EXPECTED_TYPE);
      expect(error.details[1].name).toEqual('string');
      expect(error.details[1].type).toEqual(SimpleSchema.ErrorTypes.REQUIRED);

      // In order for the message at the top of the stack trace to be useful,
      // we set it to the first validation error message.
      expect(error.reason, 'Int must be of type Integer');
      expect(error.message, 'Int must be of type Integer [validation-error]');
    }

    try {
      schema.validate([{ int: 5, string: 'test' }, { int: '5' }]);
    } catch (error) {
      verify(error);
    }

    try {
      SimpleSchema.validate([{ int: 5, string: 'test' }, { int: '5' }], schema);
    } catch (error) {
      verify(error);
    }

    try {
      SimpleSchema.validate([{ int: 5, string: 'test' }, { int: '5' }], {
        int: SimpleSchema.Integer,
        string: String,
      });
    } catch (error) {
      verify(error);
    }

    try {
      schema.validator()([{ int: 5, string: 'test' }, { int: '5' }]);
    } catch (error) {
      verify(error);
    }
  });

  it('validationErrorTransform', function () {
    const schema = new SimpleSchema({
      string: String,
    });

    SimpleSchema.defineValidationErrorTransform((error) => {
      error.message = 'validationErrorTransform';
      return error;
    });

    try {
      schema.validate({});
    } catch (e) {
      expect(e.message).toBe('validationErrorTransform');
    }

    // Don't mess up other tests
    SimpleSchema.validationErrorTransform = null;
  });

  it('SimpleSchema.addDocValidator', function () {
    const schema = new SimpleSchema({
      string: String,
    });

    const errorArray = [
      { name: 'firstName', type: 'TOO_SILLY', value: 'Reepicheep' },
    ];
    const validatedObject = {
      string: 'String',
    };

    SimpleSchema.addDocValidator((obj) => {
      expect(obj).toEqual(validatedObject);
      return errorArray;
    });

    const context = schema.newContext();
    context.validate(validatedObject);

    expect(context.validationErrors()).toEqual(errorArray);

    // Don't mess up other tests
    SimpleSchema._docValidators = [];
  });

  it('addDocValidator', function () {
    const schema = new SimpleSchema({
      string: String,
    });

    const errorArray = [
      { name: 'firstName', type: 'TOO_SILLY', value: 'Reepicheep' },
    ];
    const validatedObject = {
      string: 'String',
    };

    schema.addDocValidator((obj) => {
      expect(obj).toEqual(validatedObject);
      return errorArray;
    });

    const context = schema.newContext();
    context.validate(validatedObject);

    expect(context.validationErrors()).toEqual(errorArray);
  });

  it('sets _objectKeys', function () {
    const schema = new SimpleSchema({
      "a": Object,
      'a.b': Object,
      'a.b.c': Array,
      'a.b.c.$': Object,
      'a.b.c.$.d': Object,
      'a.b.c.$.d.e': String,
    });

    expect(schema._objectKeys).toEqual({
      'a.': ['b'],
      'a.b.': ['c'],
      'a.b.c.$.': ['d'],
      'a.b.c.$.d.': ['e'],
    });
  });

  it('gets subschema objectKeys', function () {
    const schema = new SimpleSchema({
      a: {
        type: new SimpleSchema({
          b: {
            type: new SimpleSchema({
              c: {
                type: String,
              },
            }),
          },
        }),
      },
    });

    expect(schema.objectKeys('a')).toEqual(['b']);
    expect(schema.objectKeys('a.b')).toEqual(['c']);
  });
});
