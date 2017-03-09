export default new SimpleSchema({
  nome: {
    type: String,
    min: 2,
    max: 150,
    optional: true,
  },
  agendar: {
    type: String,
    optional: true,
  },
  produto: {
    type: String,
    optional: true,
  },
  nascimento: {
    type: String,
    min: 2,
    max: 150,
    optional: true,
  },
  sexo: {
    type: String,
    optional: true,
  },
  estadoCivil: {
    type: String,
    optional: true,
  },
  CPF: {
    type: String,
    regEx: Regex.CPF,
    optional: true,
  },
  RG: {
    type: String,
    optional: true,
  },
  logradouro: {
    type: String,
    min: 2,
    max: 200,
    optional: true,
  },
  numero: {
    type: String,
    min: 1,
    max: 10,
    optional: true,
  },
  complemento: {
    type: String,
    min: 1,
    max: 200,
    optional: true,
  },
  bairro: {
    type: String,
    min: 1,
    max: 200,
    optional: true,
  },
  cidade: {
    type: String,
    min: 1,
    max: 200,
    optional: true,
  },
  UF: {
    type: String,
    regEx: /[A-Z]{2}/,
    optional: true,
  },
  empresa: {
    type: String,
    optional: true,
  },
  profissao: {
    type: String,
    optional: true,
  },
  telefoneComercial: {
    type: String,
    regEx: Regex.telefone,
    optional: true,
  },
  telefoneResidencial: {
    type: String,
    regEx: Regex.telefone,
    optional: true,
  },
  ramal: {
    type: String,
    optional: true,
  },
  celular: {
    type: String,
    regEx: Regex.celular,
    optional: true,
  },
  email: {
    type: String,
    regEx: Regex.Email,
    optional: true,
  },
});
