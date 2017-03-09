const _Customers = new Mongo.Collection('customers');
export default _Customers;
global.Customers = _Customers;

// Schemas.Customers = new SimpleSchema({
//   ...SchemaBase,
//
//   code: {
//     type: Number,
//     label: 'Código',
//     optional: true
//   },
//   name: {
//     type: String,
//     label: 'Nome',
//     optional: true
//   },
//   document: {
//     type: Number,
//     label: 'Documento',
//     optional: true
//   },
//   gender: {
//     type: String,
//     label: 'Sexo',
//     optional: true
//   },
//   birthday: {
//     type: Date,
//     label: 'Data de nascimento',
//     optional: true
//   },
//   website: {
//     type: String,
//     label: 'Website',
//     optional: true
//   },
//   mobilePhone: {
//     type: String,
//     label: 'Website',
//     optional: true
//   },
//   homeEmail: {
//     type: String,
//     label: 'homeEmail',
//     optional: true
//   },
//   homePhone: {
//     type: String,
//     label: 'homePhone',
//     optional: true
//   },
//   homeAddress: {
//     type: String,
//     label: 'homeAddress',
//     optional: true
//   },
//   homeZipcode: {
//     type: String,
//     label: 'homeZipcode',
//     optional: true
//   },
//   homeCity: {
//     type: String,
//     label: 'homeCity',
//     optional: true
//   },
//   homeState: {
//     type: String,
//     label: 'homeState',
//     optional: true
//   },
//   homeCountry: {
//     type: String,
//     label: 'homeCountry',
//     optional: true
//   },
//   company: {
//     type: String,
//     label: 'company',
//     optional: true
//   },
//   position: {
//     type: String,
//     label: 'position',
//     optional: true
//   },
//   workEmail: {
//     type: String,
//     label: 'workEmail',
//     optional: true
//   },
//   workPhone: {
//     type: String,
//     label: 'workPhone',
//     optional: true
//   },
//   workAddress: {
//     type: String,
//     label: 'workAddress',
//     optional: true
//   },
//   workZipcode: {
//     type: String,
//     label: 'workZipcode',
//     optional: true
//   },
//   workCity: {
//     type: String,
//     label: 'workCity',
//     optional: true
//   },
//   workState: {
//     type: String,
//     label: 'workState',
//     optional: true
//   },
//   workCountry: {
//     type: String,
//     label: 'workCountry',
//     optional: true
//   },
//   originId: {
//     type: String,
//     label: 'originId',
//     optional: true
//   },
//   brokerId: {
//     type: String,
//     label: 'brokerId',
//     optional: true
//   },
//   children: {
//     type: String,
//     label: 'children',
//     optional: true
//   },
//   maritalStatus: {
//     type: String,
//     label: 'maritalStatus',
//     optional: true
//   },
//   pet: {
//     type: String,
//     label: 'pet',
//     optional: true
//   },
//   mobileOperator: {
//     type: String,
//     label: 'mobileOperator',
//     optional: true
//   },
//   income: {
//     type: String,
//     label: 'income',
//     optional: true
//   }
//
//
//   // arguments: {
//   //   type: Array,
//   //   label: 'Argumentos'
//   // },
//   // 'arguments.$': {
//   //   type: Schemas.Arguments,
//   //   label: 'Argumento'
//   // },
//
// });
//
// Customers.attachSchema(Schemas.Customers);

