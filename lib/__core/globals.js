import { createContainer as _createContainer } from 'meteor/react-meteor-data';

global.GLOBAL = {
  createContainer: _createContainer,

  products: ['carro-facil', 'seguro-auto', 'alarme-mais'],

  phases: ['Novo Negócio', 'Negociação', 'Proposta', 'Transmitida', 'Emitida', 'Recusa'],

  custOrigin: ['face', 'link', 'goog', 'clou', 'sky', 'soci'],

  initPhaseQuot: 'Novo Negócio',
  initStatusQuot: 'Primeiro contato',

  UFs: [{ value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' }],

  mapCustOrigCode: {
    face: 'Facebook',
    link:	'Linkedin',
    goog:	'Google',
    clou:	'iCloud',
    sky:	'Skype',
    soci:	'Pessoal',
    ext:	'Externo',
  },

  mapProdNames: {
    'alarme-mais': 'Alarme Mais',
    'seguro-auto': 'Seguro Auto',
    'carro-facil': 'Carro Fácil',
    "conecta":	'Conecta',
  },

  images: {
    mapProductIcons: {
      'seguro-auto': 'fa fa-credit-card-alt',
      'carro-facil': 'fa fa-car',
      'alarme-mais': 'fa fa-bell-o',
      "conecta": 'fa fa-mobile',
    },

    mapProductImages: {
      'alarme-mais': '/icons/alarme_monitoramento_b.png',
      'seguro-auto': '/icons/auto_b.png',
      'carro-facil': '/icons/carro_facil_b.png',
      "conecta":	'/icons/conecta_b.png',
    },
  },

  activities: {
    lblHeaderActivities: 'Atividades do dia',
    btnClickLead: 'Click lead',

    lblColTitleProduct: 'Produto',
    lblColTitleName: 'Nome',
    lblColTitlePhase: 'Fase',
    lblColTitleSource: 'Origem',
    lblColTitleContactTime: 'Tempo para contato',

    urlRecomendLeadUnlock: `${process.env.RECOMMENDATION_ENGINE_API_URL}/customers/{customer_id}/unlock`,
    urlRecomendClickLead: `${process.env.RECOMMENDATION_ENGINE_API_URL}/recommendations/3/click-lead`,

    mongoTimeInitExpire: 60,
    expireMinutes: [1, 15, 30, 45, 60]
  },

  customers: {
    urlServiceMLTopCustomers: `${process.env.RECOMMENDATION_ENGINE_API_URL}/recommendations/{customerId}/top-customers/{productName}`
  },

  communications: {
    lblHeaderCommunications: 'Comunicações',
  },

  gameficication: {
    lblHeaderSuperProtector: 'Super protetor',
    lblNextGoal: 'Atinja sua próxima meta!',
  },

  prodAdmin: {
    lblName: 'Nome',
    lblSystName: 'Nome de Sistema',
    lblDesc: 'Descrição',
    lblBenef: 'Benefícios',
    lblServices: 'Serviços',
    lblActualGoal: 'Objetivo atual',
    lblMonthlyGoal: 'Objetivo mensal',
    lblStartDate: 'Início da Vigência',
    lblEndDate: 'Término da Vigência',

    btnEditRow: 'Editar',
    btnRemoveRow: 'Remover',

    btnUpdate: 'Atualizar',
    btnCancel: 'Cancelar',
    btnSubmit: 'Cadastrar',
  },

  quotations: {
    lblHeaderProduct: 'Produto',
    lblColTitleName: 'Nome',
    lblColTitleSource: 'Origem',
    lblColTitleAquiredProds: 'Produtos já adquiridos',
  },

  uploads: {
    lblHeaderUpload: 'Upload',
  },

};
