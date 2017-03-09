Meteor.publish(
	'customers.all', () => (Customers.find({})),
);
