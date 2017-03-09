import React, { Component } from 'react';
import { connect } from 'react-redux';
const { Date, Select } = Mongoloid.Components;


const ValidationSchema = new SimpleSchema({});

class _Component extends Component {
  constructor(props) {
    super(props);

    const mongoloidOptions = {
      self: this,
      mongoloidStateKey: '',
      schema: ValidationSchema,
      opType: 'update'
    };

    Mongoloid(mongoloidOptions);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleSubmit() {
    let data = this.state;
  }

  render() {
    const {  } = this.state;
    console.log(this.props);

    return (
      <label className="col-md-6">
        <span>Tem Filhos:</span>

        <label className="radio-inline control-label">
          <input type="radio" name="temFilhos" defaultValue="sim" onChange={this._handleChange} />
          Sim
        </label>

        <label className="radio-inline control-label">
          <input type="radio" name="temFilhos" defaultValue="não" onChange={this._handleChange} />
          Não
        </label>

        <label className="qtdn-v select-label-wrapper">
          <Select
            self={this}
            name="quantidaDeFilhos"
            options={[
              {value: 1, label: '1'},
              {value: 2, label: '2'},
              {value: 3, label: '3'},
            ]}
            onChange={this._handleChange}
            value={1}
          />
        </label>
      </label>
    );
  }
}

export default connect(state => state.nimble, { })(_Component);
