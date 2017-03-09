import React, { Component } from 'react';
import { connect } from 'react-redux';
const { Date, Select } = Mongoloid.Components;

import PossuiVeiculo from './PossuiVeiculo';
import TemFilhos from './TemFilhos';
import Address from './Address';

import Schema from './Schema';

class AdicionarIndicacaoForm extends Component {
  constructor(props) {
    super(props);

    const mongoloidOptions = {
      self: this,
      mongoloidStateKey: 'AdicionarIndicacaoForm',
      schema: Schema,
      opType: 'nimble',
    };

    Mongoloid(mongoloidOptions);
  }

  render(){
    const {
      nome,
      timeDeFutebol,
      telefone,
      estadoCivil,
      bairro,
      profissao,
      produto,
      agendar
    } = this.state;

    return (
      <div className="nimble-acel col-sm-3 col-md-7 nova-indicacao-form-wr">
        <div id="tile4" className="tile carros purple">
          <div className="form-group col-md-12">
            <img className="icon-p" src="/icones/usuario/noun_574395_cc_03_b.png" /><p>Indicações do cliente</p>

            <label className="col-md-6">
              <span>Nome:</span>
              <input type="text" name="nome" onChange={this._handleChange} value={nome} />
            </label>

            <label className="col-md-6">
              <span>Telefone:</span>
              <input type="text" name="telefone" onChange={this._handleChange} value={telefone} />
            </label>

            <label className="col-md-6">
              <span>Profissão:</span>
              <input type="text" name="profissao" onChange={this._handleChange} value={profissao} />
            </label>

            <label className="col-md-6">
              <span>Estado Civil:</span>
              <input type="text" name="estadoCivil" onChange={this._handleChange} value={estadoCivil} />
            </label>

            <TemFilhos />

            <PossuiVeiculo />

            <label className="col-md-6">
              <span>Time de futebol:</span>
              <input type="text" name="timeDeFutebol" onChange={this._handleChange} value={timeDeFutebol} />
            </label>

            <div className="address-wrapper">
              <Address />
            </div>

            <label className="col-md-12">
              <span>Anotações:</span>
              <textarea className="col-md-12 anot-ind" />
            </label>

            <label className="col-md-6">
              <span style={{marginBottom: '20px'}}>Agendar:</span>

              <Date self={this} name="agendar" value={agendar} />

            </label>

            <label className="col-md-6">
              <span>Produto:</span>
              <Select
                self={this}
                name="produto"
                options={[
                  {value: 'auto', label: 'Auto'},
                  {value: 'carroFacil', label: 'Carro Fácil'},
                  {value: 'alarme', label: 'Alarme'},
                ]}
                onChange={this._handleChange}
                value={produto}
              />
            </label>

            <div className="col-md-12">
              <button type="button"
                      className="btn btn-primary pull-left"
                      style={{ background: '#525252', border: 'none' }}
                      onClick={this._handleEnd}>
                Ignorar
              </button>

              <button type="button" className="btn btn-primary pull-right" onClick={this._handleAdd}>
                Adicionar
              </button>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => state.nimble, { })(AdicionarIndicacaoForm);
