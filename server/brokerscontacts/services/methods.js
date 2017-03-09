// Methods for Services Interface
Meteor.methods({

  // ========================================================================================= //
  // Register a broker, upload and merge social files and import result in database
  // ========================================================================================= //
  'brokerscontacts.services.importCustomers': function (broker, brokerName, social, uploadFileId) {
    // Starting service
    console.log('[INF] [BUS] Service.brokerscontacts.adapter.importCustomers-> starting...');
    const result = Meteor.call('brokerscontacts.adapter.importCustomers', broker, brokerName, social, uploadFileId);

    // Only for information
    console.log('[DBG] [BUS] Service.brokerscontacts.adapter.importCustomers-> result ', result);

    // Return service result
    console.log('[INF] [BUS] Service.brokerscontacts.adapter.importCustomers-> finished!!!');
    return result;
  },
});
