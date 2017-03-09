import React, { Component } from 'react';
import {getElementAtDOMNode} from 'react-dom';
import { connect } from 'react-redux';
import { next, goToForm, init } from '../../../../redux/modules/nimble';
import cep from 'cep-promise';

const { Date, Select } = Mongoloid.Components;


const ValidationSchema = new SimpleSchema({
  name: {
    type: String,
    min: 2,
    max: 150,
    label: "Nome"
  },
  nascimento: {
    type: String,
    min: 2,
    max: 150,
  },
  sexo: {
    type: String,
  },
  estadoCivil: {
    label: `Estado Civil`,
    type: String,
  },
  CPF: {
    type: String,
    regEx: Regex.CPF,
  },
  RG: {
    type: String,
  },
  dataEmissaoRG: {
    label: `Data de Emissão do RG`,
    type: String,
  },
  orgaoEmissorRG: {
    label: `Orgão Emissor do RG`,
    type: String,
  },
  CNH: {
    type: String,
  },
  validadeCNH: {
    label: `Validade CNH`,
    type: String,
  },
  primeiraHabilitacao: {
    label: `Primeira Habilitação`,
    type: String,
  },
  CEP: {
    type: String,
    regEx: Regex.CEP,
  },
  logradouro: {
    type: String,
    min: 2,
    max: 200,
  },
  numero: {
    type: String,
    min: 1,
    max: 10,
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
  },
  cidade: {
    type: String,
    min: 1,
    max: 200,
  },
  UF: {
    type: String,
    regEx: /[A-Z]{2}/,
  },
  empresa: {
    type: String,
  },
  profissao: {
    type: String,
  },
  telefoneComercial: {
    label: `Telefone Comercial`,
    type: String,
    regEx: Regex.telefone,
  },
  telefoneResidencial: {
    label: `Telefone Residencial`,
    type: String,
    regEx: Regex.telefone,
  },
  ramal: {
    type: String,
    optional: true,
  },
  celular: {
    type: String,
    regEx: Regex.celular,
  },
  email: {
    type: String,
    regEx: Regex.Email,
  },
});

class _Component extends Component {

  constructor(props) {
    super(props);
    const mongoloidOptions = {
      self: this,
      mongoloidStateKey: 'AdicionarCondutores',
      schema: ValidationSchema,
      opType: 'nimble',
    };
    Mongoloid(mongoloidOptions);
    this.handleChangeCEP = this.handleChangeCEP.bind(this);
  }

  handleChangeCEP(event) {
    const cepValue = event.target.value;
    if (Regex.CEP.test(cepValue) == true) {
      cep(cepValue).then((address) => {
        if (address.cep) {
          this._setMongoloidValue({"UF": address.state}, event.target);
          this._setMongoloidValue({"cidade": address.city}, event.target);
          this._setMongoloidValue({"logradouro": address.street}, event.target);
          this._setMongoloidValue({"bairro": address.neighborhood}, event.target);
        }
      });
    }
    this._handleChange(event, "CEP");
  }

  render() {
    const {
      name,
      nascimento,
      sexo,
      estadoCivil,
      CPF,
      RG,
      dataEmissaoRG,
      orgaoEmissorRG,
      CNH,
      validadeCNH,
      primeiraHabilitacao,
      CEP,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      UF,
      empresa,
      profissao,
      telefoneComercial,
      telefoneResidencial,
      ramal,
      celular,
      email,
    } = this.state;
    return (
      <div className="adicionar-condutores-wrapper">
        <div className="row card condutores-card">
          <div id="form111" className="nimble-acel col-sm-3 col-md-3 animate-transition-2 concluido">
            <div className="tile purple">
              <div className="icons">
                <img id="form81-img" src="/icones/usuario/usuario_condutor_add_b_480.png" className="img-card" />
                <span className="span-b">Adicionar Condutores</span>
              </div>
            </div>
          </div>
          <div className="nimble-acel col-sm-3 animate-transition-2 col-md-7 active">
            <div className="tile">
              <div className="col-md-12 form-group carros">
                <img className="icon-p" src="/icones/usuario/seguro_auto_b_480.png" />
                <p>Dados do condutor</p>

                {/*<label className="col-md-12">*/}
                  {/*<input type="checkbox" style={{ float: 'left' }} />*/}
                  {/*<b style={{ marginLeft: 5, fontSize: 12 }}>*/}
                    {/*Os dados do condutor são os mesmo do cliente*/}
                  {/*</b>*/}
                {/*</label>*/}

                <label className="col-md-6">
                  <span>Nome:</span>
                  <input
                    data-autocomplete-query="nimble.customer.name"
                    type="text"
                    name="name"
                    onChange={this._handleChange}
                    value={name} />
                </label>

                <label className="col-md-6">
                  <span>Data de nascimento:</span>
                  <div className="clear-span-margin">
                    <Date
                      data-autocomplete-query="nimble.customer.birthday"
                      self={this} name="nascimento" value={nascimento} />
                  </div>
                </label>

                <label className="col-md-3 select-col">
                  <span>Sexo:</span>
                  <div className="clear-span-margin">
                    <Select
                      data-autocomplete-query="nimble.customer.gender"
                      self={this}
                      name="sexo"
                      options={[
                              // {value: "", label: 'Sexo'},
                              { value: 'masculino', label: 'Masculino' },
                              { value: 'feminino', label: 'Feminino' },
                      ]}
                      value={sexo}
                    />
                  </div>
                </label>
                <label className="col-md-3 select-col">
                  <span>Estado Civil:</span>
                  <div className="clear-span-margin">
                    <Select
                      self={this}
                      data-autocomplete-query="nimble.customer.maritalStatus"
                      name="estadoCivil"
                      options={[
                              // {value: "", label: 'Estado Civil'},
                              { value: 'solteiro', label: 'Solteiro' },
                              { value: 'casado', label: 'Casado' },
                              { value: 'divorciado', label: 'Divorciado' },
                            ]}
                            value={estadoCivil}/>
                  </div>
                </label>

                <label className="col-md-6">
                  <span>CPF:</span>
                  <input data-autocomplete-query="nimble.customer.document" className="cpf" type="text" name="CPF" onChange={this._handleChange} value={CPF} />
                </label>

                <label className="col-md-4">
                  <span>RG:</span>
                  <input data-autocomplete-query="nimble.customer.RG" type="text" name="RG" onChange={this._handleChange} value={RG} />
                </label>

                <label className="col-md-4">
                  <span>Data emissão:</span>
                  <div className="clear-span-margin">
                    <Date data-autocomplete-query="nimble.customer.dataEmissaoRG"
                          self={this} name="dataEmissaoRG" value={dataEmissaoRG} />
                  </div>
                </label>

                <label className="col-md-4">
                  <span>Órgão emissor:</span>
                  <input data-autocomplete-query="nimble.customer.orgaoEmissorRG"
                         type="text" name="orgaoEmissorRG" onChange={this._handleChange} value={orgaoEmissorRG} />
                </label>

                <div className="cnh-container float-full padded-top-bottom">
                <label className="col-md-4">
                    <span>CNH:</span>
                    <input
                      data-autocomplete-query="nimble.values.infosHabilitacao.cnh"
                      className="cnh" type="text" name="CNH" onChange={this._handleChange} value={CNH} />
                  </label>

                  <label className="col-md-4">
                    <span>Validade:</span>
                    <div className="clear-span-margin">
                      <Date
                        data-autocomplete-query="nimble.values.infosHabilitacao.validity"
                        self={this} name="validadeCNH" value={validadeCNH} />
                    </div>
                  </label>

                  <label className="col-md-4">
                    <span>1º Habilitação:</span>
                    <div className="clear-span-margin">
                      <Date data-autocomplete-query="nimble.values.infosHabilitacao.firstCnh"
                            self={this} name="primeiraHabilitacao" value={primeiraHabilitacao} />
                    </div>
                  </label>
                </div>

                <label className="col-md-4">
                  <span>CEP:</span>
                  <input data-autocomplete-query="nimble.customer.homeZipcode"
                         className="cep" type="text" name="CEP" onChange={this._handleChange} value={CEP} />
                </label>

                <label className="col-md-6">
                  <span>Logradouro:</span>
                  <input data-autocomplete-query="nimble.customer.homeAddress"
                         type="text" name="logradouro" onChange={this._handleChange} value={logradouro} />
                </label>

                <label className="col-md-2">
                  <span>Número:</span>
                  <input data-autocomplete-query="nimble.customer.homeNumber"
                         type="text" name="numero" onChange={this._handleChange} value={numero} />
                </label>

                <label className="col-md-2">
                  <span>Compl:</span>
                  <input data-autocomplete-query="nimble.customer.homeComplemento"
                         type="text" name="complemento" onChange={this._handleChange} value={complemento} />
                </label>

                <label className="col-md-4">
                  <span>Bairro:</span>
                  <input data-autocomplete-query="nimble.customer.homeBairro"
                         type="text" name="bairro" onChange={this._handleChange} value={bairro} />
                </label>

                <label className="col-md-4">
                  <span>Cidade:</span>
                  <input data-autocomplete-query="nimble.customer.homeCity"
                         type="text" name="cidade" onChange={this._handleChange} value={cidade} />
                </label>

                <label className="col-md-2 select-col">
                  <span>Estado/UF:</span>
                  <div className="clear-span-margin">
                    <Select
                      data-autocomplete-query="nimble.customer.homeState"
                      self={this}
                      className=""
                      name="UF"
                      options={[
                              { value: 'AC', label: 'AC' },
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
                              { value: 'TO', label: 'TO' },
                            ]}
                            value={UF}/>
                  </div>
                </label>

                <label className="col-md-3">
                  <span>Empresa:</span>
                  <input data-autocomplete-query="nimble.customer.company"
                         type="text" name="empresa" onChange={this._handleChange} value={empresa} />
                </label>

                <label className="col-md-3">
                  <span>Profissão:</span>
                  <input data-autocomplete-query="nimble.customer.position"
                         type="text" name="profissao" onChange={this._handleChange} value={profissao} />
                </label>

                <label className="col-md-4">
                  <span>Telefone Comercial:</span>
                  <input data-autocomplete-query="nimble.customer.workPhone"
                         className="phone" type="text" name="telefoneComercial" onChange={this._handleChange} value={telefoneComercial} />
                </label>

                <label className="col-md-2">
                  <span>Ramal:</span>
                  <input data-autocomplete-query="nimble.customer.ramal"
                         type="text" name="ramal" onChange={this._handleChange} value={ramal} />
                </label>

                <label className="col-md-4">
                  <span>Telefone Residencial:</span>
                  <input data-autocomplete-query="nimble.customer.homePhone"
                         className="phone" type="text" name="telefoneResidencial" onChange={this._handleChange} value={telefoneResidencial} />
                </label>

                <label className="col-md-4">
                  <span>Telefone Celular:</span>
                  <input data-autocomplete-query="nimble.customer.mobilePhone"
                         className="phone" type="text" name="celular" onChange={this._handleChange} value={celular} />
                </label>

                <label className="col-md-4">
                  <span>E-Mail:</span>
                  <input data-autocomplete-query="nimble.customer.homeEmail"
                         className="email" type="text" name="email" onChange={this._handleChange} value={email} />
                </label>

                <div className="col-md-12">
                  <button type="button" className="btn btn-primary pull-right" onClick={this._handleSubmit}>
                    Seguir
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(state => state.nimble, { next })(_Component);
