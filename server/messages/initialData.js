import Messages from '../../lib/collections/messages';

// const types = ['prospect', 'campaign', 'facebook', 'warning', 'alert', 'information'];
// const categorias = ['alert', 'message'];

const types = ['prospect', 'campaign', 'facebook', 'information'];
const categorias = ['message'];

const userId = (Meteor.users.findOne() || {})._id;
const usersCreate = ['ADM', 'SYS'];

const _createFakeMessage = () => ({
  category: faker.random.arrayElement(categorias),
  type: faker.random.arrayElement(types),
  to: userId,
  title: faker.lorem.paragraph().substr(0, 19),
  body: faker.lorem.text(),
  additionalInfo: faker.name.firstName(),
  action: 'Informar',
  createdBy: faker.random.arrayElement(usersCreate),
  createdAt: faker.date.recent(),
  readAt: null,
});

let intervaloParty;

Meteor.methods({
  'messages.createFake': function () {
    Messages.remove({});
    const messages = [
      {
        category: 'message',
        type: 'facebook',
        to: userId,
        title: '',
        body: 'Maria curtiu sua campanha do Conecta no Facebook.',
        additionalInfo: '',
        action: 'Informar',
        createdBy: faker.random.arrayElement(usersCreate),
        createdAt: faker.date.recent(),
        readAt: null,
      },
      {
        category: 'message',
        type: 'facebook',
        to: userId,
        title: '',
        body: 'Hoje é aniversário do João Martins.',
        additionalInfo: '',
        action: 'Informar',
        createdBy: faker.random.arrayElement(usersCreate),
        createdAt: faker.date.recent(),
        readAt: null,
      },
      {
        category: 'message',
        type: 'prospect',
        to: userId,
        title: '',
        body: 'O Cliente Marcelo da Silva tem uma propensão alta no produto Auto.',
        additionalInfo: '',
        action: 'Informar',
        createdBy: faker.random.arrayElement(usersCreate),
        createdAt: faker.date.recent(),
        readAt: null,
      },
      {
        category: 'message',
        type: 'information',
        to: userId,
        title: '',
        body: 'A campanha do Conecta Day encerra no dia 21/05...',
        additionalInfo: '',
        action: 'Informar',
        createdBy: faker.random.arrayElement(usersCreate),
        createdAt: faker.date.recent(),
        readAt: null,
      },
    ];

    if (!Messages.findOne()) {
      // Array.apply(null, Array(30)).map(() => {
      //   const message = _createFakeMessage();
      //   console.log(message);
      //   Messages.insert(message);
      // });
      messages.map((m) => {
        Messages.insert(m);
      });
    }
  },

  'messages.goParty': function () {
    if (intervaloParty) clearInterval(intervaloParty);
    intervaloParty = Meteor.setInterval(() => {
      const message = _createFakeMessage();
      console.log(message);
      Messages.insert(message);
    }, 1000);
  },

  'messages.clearAll': function () {
    Messages.remove({});
  },

  'messages.stopParty': function () {
    if (intervaloParty) clearInterval(intervaloParty);
  },
});

if (!Messages.findOne()) {
  Meteor.call('messages.createFake');
}
