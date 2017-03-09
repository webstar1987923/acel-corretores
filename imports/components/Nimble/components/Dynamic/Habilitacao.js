import React, { Component } from 'react';
import { connect } from 'react-redux';
import { next, goToForm, init } from '../../../../redux/modules/nimble';
const { Date } = Mongoloid.Components;

const HabilitacaoSchema = new SimpleSchema({
  cnh: {
    type: String,
    label: 'CNH',
    max: 11,
  },
  validity: {
    type: String,
    label: 'Validade da CNH',
  },
  firstCnh: {
    type: String,
    label: 'Data da 1º Habilitação',
  },
});


class _Component extends Component {
  constructor(props) {
    super(props);

    const mongoloidOptions = {
      self: this,
      mongoloidStateKey: 'habilitacao',
      schema: HabilitacaoSchema,
      opType: 'nimble',
    };

    Mongoloid(mongoloidOptions);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  render() {
    const { cnh = '', validity = '', firstCnh = '' } = this.state;

    console.log(cnh, validity, firstCnh, typeof cnh);

    return (

      <div className="form-group carros">
        <label className="col-md-4">
          <span>CNH:</span>
          <input
            data-autocomplete-query="nimble.values.infosHabilitacao.cnh"
            style={{marginTop:5}} type="text" name="cnh" onChange={this._handleChange} value={cnh} />
        </label>

        <label className="col-md-4">
          <span>Validade da CNH:</span>
          <Date
            data-autocomplete-query="nimble.values.infosHabilitacao.validity"
            name="validity" value={validity} self={this} />
        </label>

        <label className="col-md-4">
          <span>Data da 1ª habilitação:</span>
          <Date
            data-autocomplete-query="nimble.values.infosHabilitacao.firstCnh"
            name="firstCnh" value={firstCnh} self={this} />
        </label>

        <div className="col-md-12">
          <button type="button" className="btn btn-primary pull-right" onClick={this._handleSubmit}>
            Seguir
          </button>
        </div>
      </div>

    );
  }
}

export default connect(state => state.nimble, {
  next, init, goToForm,
})(_Component);
