/**
 * Created by josemariohg on 2/1/17.
 */
module.exports = function () {
  this.When(/^Inserir "([^"]*)" no campo consulta nome$/, (arg1) => {

		// browser.url('http://google.com'); // SETUP

		// var title = browser.getTitle();   // EXECUTE

		// expect(title).to.equal('Google'); // VERIFY

		// browser.timeout('page load', 60 * 1000);

		// browser.pause(100);

		// browser.setValue('input[name="name"]', arg1);
  });

  this.When(/^Enviar o formulario$/, () => {
  });

  this.Then(/^Visualizar lista de nomes do dashboard contendo "([^"]*)"$/, (arg1) => {

  });
};
