import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import './style.scss';

class MessagesList extends Component {

  constructor(props) {
    super(props);
  }

  // Messages
  onClickMessagesLink(message) {
    event.preventDefault();
    switch (message.type) {
      case 'prospect':
          // "Ligue agora";
        break;
      case 'campaign':
          // "Incluir na agenda";
        break;
      case 'facebook':
          // "Ver perfil de ";
        break;
      case 'warning':
          // "nao_definido";
        break;
      case 'alert':
          // "nao_definido";
        break;
      case 'information':
        if (message.additionalInfo == 'information_expand') {
          message.additionalInfo = 'information_hide';
        } else if (message.additionalInfo == 'information_hide') {
          message.additionalInfo = 'information_expand';
        } else {
          message.additionalInfo = 'information_expand';
        }
        break;
      default:
          // "nao_definido";
    }
      // this.props.messagesListList.listOfMessages.
    Meteor.call('messages.setIsRead', message);
  }

  helperMessagesGetLinkLabel(message) {
    let linkLabel;
    switch (message.type) {
      case 'prospect':
        linkLabel = 'Ligue agora';
        break;
      case 'campaign':
        linkLabel = 'Incluir na agenda';
        break;
      case 'facebook':
        linkLabel = 'Ver perfil';
        	if (message.additionalInfo)          	{ linkLabel = `Ver perfil de ${message.additionalInfo}`; }
        break;
      case 'warning':
        linkLabel = 'nao_definido';
        break;
      case 'alert':
        linkLabel = 'nao_definido';
        break;
      case 'information':
        if (message.additionalInfo == 'information_expand') {
          linkLabel = 'Ver mais';
        } else if (message.additionalInfo == 'information_hide') {
          linkLabel = 'Fechar';
        } else {
          linkLabel = 'Ver mais';
        }
        break;
      default:
        linkLabel = 'nao_definido';
    }
    return (linkLabel);
  }

  renderMessagesHeader() {
    return (
      <div className="div-mensagens-header">
        <div className="div-mensagens-header-envelope">
          <i className="fa fa-envelope" aria-hidden="true" />
          <div className="quantidade-mensagens">{this.props.notReadCounter}</div>
        </div>
      </div>
    );
  }

  renderMessagesItens() {
    return (
      <div className="MessagesList__container div-mensagens-itens">
        <ul>
          {this.props.messagesList.map((message, index) => (
            <li className="animated fadeInDown" key={index}>
              <div className="mensagem-item">
                <p>{message.body.substring(250, 0)}</p>
              </div>
              <div className="mensagem-link">
                <a
                  href="#"
                  onClick={this.onClickMessagesLink.bind(message)}
                >
                  {this.helperMessagesGetLinkLabel(message)}
                </a>
              </div>
            </li>
            ))}
        </ul>
      </div>
    );
  }

  renderMessagesContent() {
    return (
      <div className="div-mensagens-content">
        { this.renderMessagesHeader() }
        { this.renderMessagesItens() }
      </div>
    );
  }

  render() {
    return (this.renderMessagesContent());
  }
}

export default createContainer((props) => {
  const messagesHandle = Meteor.subscribe('messages.all');

  const messagesList = Messages.find().fetch().reverse();

  const notReadCounter = messagesList.filter(message => (message.category == 'message' && message.readAt == null)).length;

  return {
    messagesList,
    notReadCounter,
    loading: !messagesHandle.ready(),
    user: Meteor.user(),
  };
}, MessagesList);
