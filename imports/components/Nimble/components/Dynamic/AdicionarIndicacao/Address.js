import React, { Component } from 'react';
import { connect } from 'react-redux';
const { Select } = Mongoloid.Components;
import cep from 'cep-promise';

const Schema = new SimpleSchema({
  CEP: {
    type: String,
    label: 'CEP',
    regEx: Regex.CEP,
  },
  logradouro: {
    type: String,
    label: 'Logradouro',
  },
  numero: {
    type: String,
    label: 'Número',
  },
  complemento: {
    type: String,
    label: 'Complemento',
    optional: true,
  },
  bairro: {
    type: String,
    label: 'Bairro',
  },
  cidade: {
    type: String,
    label: 'Cidade',
  },
  uf: {
    type: String,
    regEx: /[A-Z]{2}/,
    label: 'UF',
  },
});


class Address extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.handleChangeCEP = this.handleChangeCEP.bind(this);

    const mongoloidOptions = {
      self: this,
      schema: Schema,
      opType: 'nimble',
    };

    Mongoloid(mongoloidOptions);
  }

  _handleChange(ev){
    console.log(ev);
  }

  handleChangeCEP(event) {
    const cepValue = event.target.value;
    if (Regex.CEP.test(cepValue) == true) {
      cep(cepValue).then((address) => {
        if (address.cep) {
          this.setState({
            "uf": address.state,
            "cidade": address.city,
            "logradouro": address.street,
            "bairro": address.neighborhood
          })
        }
      });
    }
    this._handleChange(event, "cep");
  }

  render() {
    const {
      CEP = '',
      logradouro = '',
      numero = '',
      complemento = '',
      bairro = '',
      cidade = '',
      uf = '',
    } = this.state;

    return (
      <div className={"Address address-wrapper " + this.props.className}>
        <label className="col-md-4 numero label-wrapper">
          <span>CEP:</span>
          <input type="text" name="CEP" onChange={this.handleChangeCEP}
                 value={CEP} />
        </label>

        <label className="col-md-8 numero label-wrapper">
          <span>Logradouro:</span>
          <input type="text" name="logradouro" onChange={this._handleChange} value={logradouro} />
        </label>

        <label className="col-md-2 numero label-wrapper">
          <span>Número:</span>
          <input type="text" name="numero" onChange={this._handleChange} value={numero} />
        </label>

        <label className="col-md-2 complemento label-wrapper">
          <span>Compl:</span>
          <input type="text" name="complemento" onChange={this._handleChange} value={complemento} />
        </label>

        <label className="col-md-4 bairro label-wrapper">
          <span>Bairro:</span>
          <input type="text" name="bairro label-wrapper" onChange={this._handleChange} value={bairro} />
        </label>

        <label className="col-md-4 cidade label-wrapper">
          <span>Cidade:</span>
          <input type="text" name="cidade" onChange={this._handleChange} value={cidade} />
        </label>

        <label className="col-md-4 UF label-wrapper">
          <span style={{marginBottom: '-15px'}}>Estado/UF:</span>
          <Select
            self={this}
            name="uf"
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
            value={uf}
          />
        </label>
      </div>

    );
  }
}

export default Address;
