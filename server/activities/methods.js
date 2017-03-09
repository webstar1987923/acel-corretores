import Future from 'fibers/future';

Meteor.methods({

  /**
   * @memberOf Activity
   * @name findClickLeadAndInsert
   * @summary Get best lead from Machine Learning service
   * @param {String} BrokerId BrokerId to be passed to service
   */
  'activities.findClickLeadAndInsert': function (brokerId) {
    const future = new Future();

    getClickLead(brokerId, (err, res) => {
      if (err) return future.throw(err);
      return future.return(res);
    });

    return future.wait();
  },

  /**
   * @memberOf Activity
   * @name insert
   * @summary Checks if the docs exists for the index (customerCode, brokerId and productName)
   *          If not, inserts the doc into Activities collection
   * @param {Customer} customer - Data from customer to be inserted
   * @param {String} brokerId - BrokerId associated to the activity
   * @param {String} productName - Product name associated to the activity
   * @param {String} phase - Initial phase of the activity
   * @param {Number} timeToExpireMin - Time in minutes for the activity to be expired
   */
  'activities.insert': function (customer, brokerId, productName, phase, timeToExpireMin) {
    const timeToExpire = new Date((new Date()).getTime() + timeToExpireMin * 60000);

    return (Activities.update({
      customerId: customer._id,
      brokerId,
      productName,
    }, {
      customerId: customer._id,
      brokerId,
      productName,

      customerName: customer.name,
      phase,
      source: customer.originId,
      timeToExpire,
      timeToExpireMin,
    }, {
      upsert: true,
    }));
  },

  /**
   * @memberOf Activity
   * @name checkTimeToExpire
   * @summary Removes all activities which time to expire has passed
   */
  'activities.checkTimeToExpire': function () {
    const activsExpired = Activities.find({ timeToExpire: { $lte: new Date() } });

    activsExpired.forEach((activ) => {
      Activities.remove({ _id: activ._id });
      unlockClickLead(activ.customerId);
    });
  },

  /**
   * @memberOf Activity
   * @name updateTimeToExpire
   * @summary Updates / removes all activities with current minutes to expire
   */
  'activities.updateTimeToExpire': function () {
    const allActivities = Activities.find({}).fetch();

    allActivities.forEach((activ) => {
      const diffMins = Utils.getDiffsMins(activ.timeToExpire);

      if (diffMins == 0) {
        Activities.remove({ _id: activ._id });
        unlockClickLead(activ.customerId);
      } else { Activities.update({ _id: activ._id }, { $set: { timeToExpireMin: diffMins } }); }
    });
  },

});

/**
 * @memberOf Activity
 * @summary Unlocks lead in Recomendation engine database
 * @param {String} customerId - Customer to be unlocked from Recomendation engine database
 */
async function unlockClickLead(customerId) {
  try {
    const url = GLOBAL.activities.urlRecomendLeadUnlock;
    const urlUnlockLead = url.replace('{customerId}', customerId);

    const response = await fetch(urlUnlockLead, {
      method: 'POST',
      headers: { "Accept": 'application/json',
        'Content-Type': 'application/json' },
      body: {},
    }).then(function(response) {
      console.error('OK: ' + JSON.stringify(response.statusText, null, 2));
    }).catch(function(err) {
      console.error('Error: ' + JSON.stringify(err, null, 2));
    });

  } catch (error) {
    console.error(error);
  }
}

/**
 * @memberOf Activity
 * @summary Insert activity and history into collection
 * @param {String} BrokerId - Broker Id associated to the activity
 * @param {String} customerId - Customer Id associated to the activity
 * @param {String} prodName - Product name associated to the activity
 */
function insertActivity(brokerId, customerId, prodName, cb) {
  try {
    const customer = Customers.findOne(customerId);
    if (!customer) throw new Meteor.Error('404', `Cliente ${customerId} não existe.`);

    Meteor.call('activities.insert', customer, brokerId, prodName, GLOBAL.initPhaseQuot, GLOBAL.activities.mongoTimeInitExpire);
    Meteor.call('custProdHistory.insertUpd', customer._id, brokerId, prodName, GLOBAL.initPhaseQuot, GLOBAL.initStatusQuot);

    cb(null, customer);
  } catch (error) {
    cb(error);
  }
}

const binded = Meteor.bindEnvironment(insertActivity);

/**
 * @memberOf Activity
 * @summary Get best lead from Machine Learning service,
 *          Gets data from Customer collection and
 *          Insert doc into Activities collection
 * @param {String} BrokerId - Broker Id to be passed to service
 */
async function getClickLead(brokerId, cb) {
  try {
    const urlClickLead = GLOBAL.activities.urlRecomendClickLead;

    console.error('urlClickLead : ' + JSON.stringify(urlClickLead, null, 2));

    // var urlClickLead = url.replace('{customerId}', brokerId);

    //----------------------------------------------------------------------------
    // Gets Click Lead only in production. When in DEV it gets customer radomly
    //----------------------------------------------------------------------------
    let clickLead;
    // if (process.env.NODE_ENV == 'production') {
    //   const response = await fetch(urlClickLead);
    //
    //   clickLead = await response.json();
    // } else {
      // It gets customer radomly
      Customers.aggregate([{ $sample: { size: 1 } }]).forEach((customer) => {
        clickLead = {
          "click-lead": {
            customer_id: customer._id,
            product: faker.random.arrayElement(GLOBAL.products),
          },
        };
      });
    // }

    console.error(JSON.stringify(clickLead, null, 2));

    // Calls "insertActivity" function
    binded(brokerId, clickLead['click-lead'].customer_id, clickLead['click-lead'].product, (err, res) => {
      if (err) return cb(err);
      cb(null, res);
    });
  } catch (error) {
    return cb(error);
  }
}

