module.exports = function () {
  this.Before(() => {
    server.execute(() => {
    });
  });

  this.Given(/^Entrando no site da aceleradora de corretores$/, () => {
    browser.url('http://localhost:3000');

	// var value = browser.getValue('#a');

	// console.log(value);

   // browser.click('.btn');

	// <a class="btn btn-default fade-in">
  });
};
