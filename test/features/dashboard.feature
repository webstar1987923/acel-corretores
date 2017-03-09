Feature: Consultando informacoes no dashboard

  Como corretor no site da aceleradora,
  Para que eu possa consultar informacoes das minhas operacoes,
  Quero inserir um nome e clicar em um botão
  E veja essa nova informacao na minha tela.

  Background:
    Given Entrando no site da aceleradora de corretores

  @watch
  Scenario: Consultar o dashboard 
    When Inserir "teste" no campo consulta nome
    And Enviar o formulario
    Then Visualizar lista de nomes do dashboard contendo "teste"

  # @focus @dev
# /tests/features/dashboard.feature
#  ./node_modules/.bin/chimp --ddp=http://localhost:3000 --browser=phantomjs --watch --path=tests
#  ./node_modules/.bin/chimp --ddp=http://localhost:3000 --watch --path=tests

