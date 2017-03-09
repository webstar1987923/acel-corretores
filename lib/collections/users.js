function custom() {
  const value = this.value;
  const services = this.field('services').value;
  const fb = (services || {}).facebook;
  const profile = this.field('profile').value || {};
  const tipoPessoa = this.field('tipoPessoa').value || profile.tipoPessoa;
  const createdAt = this.field('createdAt').value;
  const name = this.field('name').value || profile.name;
  const updatedAt = this.field('updatedAt').value;

  /**
   * 1) Cadastrado pelo Admin
   * 2) Dados pessoais (ja logou com fb)
   * 3) Dados profissionais (corretora)
   * 4) Dados de localização
   * 5) Preferências
   * @type {number}
   */
  let step = this.field('step').value || profile.step;

  if (!step && fb) step = 1;
  if (typeof step !== 'number') step = -1;

  switch (this.key) {
    case 'nascimento':
      if (step > 0 && tipoPessoa == 'pf') {
        console.log('nascimento', value);
        if (!value) return 'required';
      }
      break;

    case 'estadoCivil':
      if (step > 0 && tipoPessoa == 'pf') {
        if (!value) return 'required';
      }
      break;

    case 'sexo':
      if (step > 0 && tipoPessoa == 'pf') {
        if (!value) return 'required';
      }
      break;

    case 'CPF':
      if (tipoPessoa == 'pf') {
        if (!value) return 'required';
        if (!value.match(Regex.CPF)) return 'regEx';
      }
      break;

    case 'CNPJ':
      if (tipoPessoa == 'pj') {
        if (!value) return 'required';
        if (!value.match(Regex.CNPJ)) return 'regEx';
      }
      break;

    case 'razaoSocial':
      if (tipoPessoa == 'pj') {
        if (!value) return 'required';
      }
      break;

    case 'celular':
      if (step > 0) {
        if (!value) return 'required';
        if (!value.match(Regex.telefone)) return 'regEx';
      }
      break;

    case 'telefone':
      if (!value) return 'required';
      if (!value.match(Regex.telefone)) return 'regEx';
      break;

    // case 'corretora':
    //   if(step > 1) {
    //     if (!value) return 'required';
    //   }
    //   break;

    case 'SUSEP':
      if (!value) return 'required';
      return;
      break;

    case 'susepinha':
      if (!value) return 'required';
      return;
      break;

    case 'address':
      if (step > 2) {
        if (!value) return 'required';
      }
      break;

    case 'tipoPessoa':
      if (!value) return 'required';

      break;
  }
}

// Schemas.Corretora = new SimpleSchema({
//   CNPJ: {
//     type: String,
//     label: 'CNPJ da Corretora',
//     optional: true
//   },
//   SUSEP: {
//     type: String,
//     label: 'SUSEP da Corretora',
//   },
//   susepinha: {
//     type: String,
//     label: 'Susepinha da Corretora',
//   },
//   razaoSocial: {
//     type: String,
//     label: 'Razão Social da Corretora',
//     optional: true
//   },
// });

Schemas.Email = new SimpleSchema({
  address: {
    type: String,
    regEx: Regex.Email,
    label: 'E-Mail',
  },
  verified: {
    type: Boolean,
    label: 'Verificado',
    optional: true,
  },
});

Schemas.AddressSchema = new SimpleSchema({
  logradouro: {
    type: String,
    label: 'Logradouro',
    min: 2,
    max: 100,
  },
  complemento: {
    type: String,
    label: 'Complemento',
    max: 100,
    optional: true,
  },
  bairro: {
    type: String,
    label: 'Bairro',
    min: 2,
    max: 100,
  },
  CEP: {
    type: String,
    label: 'CEP',
    regEx: Regex.CEP,
  },
  numero: {
    type: String,
    label: 'Número',
    min: 1,
    max: 100,
  },
  cidade: {
    type: String,
    min: 2,
    max: 100,
    label: 'Cidade',
  },
  UF: {
    type: String,
    regEx: /[A-Z]{2}/,
    label: 'UF',
  },
  pais: {
    type: String,
    defaultValue: 'BR',
    label: 'País',
    regEx: /[A-Z]{2}/,
    optional: true,
  },
});

Schemas.ProfileSchema = new SimpleSchema({
  ...SchemaBase,
  preferencias: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  name: {
    type: String,
    label: 'Nome',
    min: 2,
    max: 100,
  },
  apelido: {
    type: String,
    label: 'Apelido',
    min: 2,
    max: 100,
    optional: true,
  },
  razaoSocial: {
    type: String,
    label: 'Razão Social',
    min: 2,
    max: 100,
    optional: true,
    custom,
  },
  SUSEP: {
    type: String,
    label: 'SUSEP',
    min: 2,
    max: 100,
    optional: true,
    //custom
  },
  susepinha: {
    type: String,
    label: 'Susepinha',
    min: 2,
    max: 100,
    optional: true,
    //custom
  },
  tipoPessoa: {
    type: String,
    allowedValues: ['pf', 'pj'],
    label: 'Tipo de Pessoa (PF ou PJ)',
    optional: true,
    custom,
  },
  sexo: {
    type: String,
    allowedValues: ['f', 'm'],
    label: 'Sexo',
    optional: true,
    custom,
  },
  estadoCivil: {
    type: String,
    allowedValues: ['casado', 'solteiro', 'divorciado'],
    label: 'Estado Civil',
    optional: true,
    custom,
  },
  nascimento: {
    type: Date,
    label: 'Data de Nascimento',
    optional: true,
    custom,
  },
  CPF: {
    type: String,
    regEx: Regex.CPF,
    optional: true,
    custom,
    label: 'CPF',
  },
  CNPJ: {
    type: String,
    optional: true,
    label: 'CNPJ',
    regEx: Regex.CNPJ,
    //custom
  },
  telefone: {
    type: String,
    regEx: Regex.telefone,
    optional: true,
    custom,
  },
  celular: {
    type: String,
    regEx: Regex.telefone,
    optional: true,
    custom,
  },
  address: {
    type: Schemas.AddressSchema,
    optional: true,
    label: 'Endereço',
    custom,
  },
});

Schemas.Users = new SimpleSchema({
  ...SchemaBase,
  // corretora: {
  //   type: Schemas.Corretora,
  //   label: 'Dados da Corretora',
  //   optional: true,
  //   custom
  // },
  "services": {
    type: Object,
    blackbox: true,
    optional: true,
  },
  "emails": {
    type: Array,
    label: 'E-Mails',
  },
  'emails.$': {
    type: Schemas.Email,
    label: 'E-Mail',
  },
  "username": {
    type: String,
    optional: true,
  },
  "roles": {
    type: Object,
    blackbox: true,
    optional: true,
  },
  "status": {
    // adicionado pelo pacote mizzao:user-status
    type: Object,
    blackbox: true,
    optional: true,
  },
  "profile": {
    type: Schemas.ProfileSchema,
    optional: true,
    custom,
  },
});

// Meteor.users.attachSchema(Schemas.Users);
