import React from 'react';
import { Link, DefaultRoute } from 'react-router';
import Dropzone from 'react-dropzone';

// Brokers Manager API for development tests
const FORM5_TEST_AREA_BROKERS_API = false;

// File input component
class FileInputDropzone extends React.Component {
  
  constructor(props) {
    // Super props
    super(props);
    
    // Set the html component
    this.state = {
      unlock: true,
      label: 'Selecionar arquivo',
      fileId: null,
      socialBoxInformation: this.props.input || false,
      output: this.props.output || false,
    };
    
    // Bind the functions
    this.onOpenClick = this.onOpenClick.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.output) {
      this.setState({
        output: nextProps.output,
      });
    }
  }
  
  onDrop(acceptedFiles, rejectedFiles) {
    // Lock the operation
    this.setState({
      unlock: false,
    });
    
    // Check for the file receveid in the client side
    if (acceptedFiles != null) {
      // File receveid in client side is ok
      console.log(`Filename to upload: ${acceptedFiles[0].name}`);
      
      // Create file to upload
      const uploadFile = new FS.File(acceptedFiles[0]);
      uploadFile.creatorId = '1366189566747952';
      
      // Upload the file to server
      console.log('Uploading...');
      Uploads.insert(uploadFile, (err, fileObj) => {
        // check for the response of upload status
        if (err) {
          // Erro in file upload
          console.log('Error in upload: ', err);
        } else {
          // Flush with name of the file in the label and set file id of upload
          this.setState({
            label: fileObj.name(),
            fileId: fileObj._id,
            unlock: false,
          });
          
          // Call callback to set file id in external state
          this.state.output(this.state.socialBoxInformation.socialCode, fileObj._id);
          
          // Successfull in upload
          console.log(`Sucessfull upload:${fileObj._id}`);
        }
      });
    }
    
    // Unlock the operation
    this.setState({
      unlock: true,
    });
  }
  
  onOpenClick(event) {
    // Prevent default
    event.preventDefault();
    
    // check if unlock
    if (this.state.unlock == true) {
      // Open dropzone (pipestream) with file
      this.refs.dropzone.open();
    }
  }
  
  render() {
    // Check if upload is done or not
    let isUploadDone = <i className="hidden fa fa-check" aria-hidden="true" />;
    if (this.state.socialBoxInformation.uploadIsDone == true) {
      isUploadDone = <i className="fa fa-check" />;
    }
    
    // Check if is Lock or unlock box
    let isDisabled = 'disabled';
    let isDisabledInput = <input disabled type="file" onClick={this.onOpenClick} />;
    if (this.state.socialBoxInformation.inputEnable == true) {
      isDisabled = '';
      isDisabledInput = <input type="file" onClick={this.onOpenClick} />;
    }
    
    // Return the html component
    return (
      <div className="col-md-4">
        <div className="upload-line">
          <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} style={{ borderStyle: '' }} />
          <span className={`btn btn-upload btn-${this.state.socialBoxInformation.nameInCSS} btn-file upload-secundario ${isDisabled}`}>
            <div className="upload-progress" />
            {isUploadDone} <span className="upload-line-name" style={{ display: 'inline-block' }}>{this.state.label}</span>
            <div className="icon-btn">
              <i className={`fa fa-${this.state.socialBoxInformation.nameInCSS}`} aria-hidden="true" />
            </div>
            {isDisabledInput}
          </span>
        </div>
      </div>
    );
  }
}

// Form5 component
class Form5 extends React.Component {
  
  constructor(props) {
    // Super props
    super(props);

    // Set states
    this.state = {
      step: 5,
      totalSteps: 5,
      previousStep: '/register/4',
      nextStep: GLOBAL.DASHBOARD_ROUTE,
      readyToNextStep: false,
      totalBaseToUpload: 0,
      uploadStatus: '',
      uploads: [
        {
          name: 'facebook',
          socialName: 'facebook',
          socialCode: 'face',
          inputEnable: true,
          nameInCSS: 'facebook',
          uploadFileId: null,
          uploadIsDone: false,
        },
        {
          name: 'linkedin',
          socialName: 'linkedin',
          socialCode: 'link',
          inputEnable: false,
          nameInCSS: 'linkedin',
          uploadFileId: null,
          uploadIsDone: false,
        },
        {
          name: 'googleplus',
          socialName: 'google-plus',
          socialCode: 'goog',
          inputEnable: false,
          nameInCSS: 'google-plus',
          uploadFileId: null,
          uploadIsDone: false,
        },
        {
          name: 'skype',
          socialName: 'skype',
          socialCode: 'skyp',
          inputEnable: false,
          nameInCSS: 'skype',
          uploadFileId: null,
          uploadIsDone: false,
        },
        {
          name: 'cloud',
          socialName: 'cloud',
          socialCode: 'clou',
          inputEnable: false,
          nameInCSS: 'cloud',
          uploadFileId: null,
          uploadIsDone: false,
        },
        {
          name: 'excel',
          socialName: 'file-excel-o',
          socialCode: 'excl',
          inputEnable: false,
          nameInCSS: 'file-excel-o',
          uploadFileId: null,
          uploadIsDone: false,
        },
      ],
    };
    
    // Setting self for this
    global.self = this;
    
    // Bind the functions
    this._callbackInputUploadBox = this._callbackInputUploadBox.bind(this);
    this._renderInputUploadBox = this._renderInputUploadBox.bind(this);
    this._renderTotalBasesToUpload = this._renderTotalBasesToUpload.bind(this);
    this._onClickBasesToUploadButtons = this._onClickBasesToUploadButtons.bind(this);
    this._renderBasesToUploadButtons = this._renderBasesToUploadButtons.bind(this);
    this._renderNextStepButton = this._renderNextStepButton.bind(this);
  }
  
  _callbackInputUploadBox(socialCode, fileId) {
    if (fileId != undefined) {
      const uploadInfo = this.state.uploads.find(upload => (upload.socialCode == socialCode));
      if (uploadInfo != undefined) {
        uploadInfo.uploadFileId = fileId;
        this.setState({
          ...this.state.uploads,
          uploadInfo,
          totalBaseToUpload: this.state.totalBaseToUpload + 1,
          uploadStatus: 'ready',
        });
      }
    }
  }
  
  _renderInputUploadBox(uploadInfoName) {
    const uploadInfo = this.state.uploads.find(upload => (upload.name == uploadInfoName));
    if (uploadInfo != undefined) {
      return (
        <FileInputDropzone input={uploadInfo}
                           output={(socialCode, fileId) => (self._callbackInputUploadBox(socialCode, fileId))}/>
      );
    }
  }
  
  _renderBrokersManagerAPITests() {
    if (FORM5_TEST_AREA_BROKERS_API == true) {
      const _brokerId = '1366189566747952';
      const _brokerName = 'Mohamad Jameh';
      let _social;
      let _fileId;
      return (
        <div className="Ramires-Test">
          <div className="Ramires-Test-Import">
            <FileInputDropzone context={function (socialCode, fileId) {
                _social = socialCode;
                _fileId = fileId;
              }
            }/>
            <button id="btnHandleSubmit" type="button" className="btn-md-lg finalizar-dash principal"
                    onClick={() => Meteor.call('brokerscontacts.services.importCustomers', _brokerId, _brokerName, _social, _fileId)}>
              Upload the file and generate Customers Collection
            </button>
          </div>
          <div><p /></div>
          <div><p /></div>
          <div className="Ramires-Test-Driver">
            <button id="btnHandleSubmit" type="button" className="btn-md-lg finalizar-dash principal"
                    onClick={() => Meteor.call('brokerscontacts.connector.brokers')}>
              brokerscontacts.brokers
            </button>
            <button id="btnHandleSubmit" type="button" className="btn-md-lg finalizar-dash principal"
                    onClick={() => Meteor.call('brokerscontacts.connector.createbroker', _brokerId, _brokerName)}>
              brokerscontacts.createbroker
            </button>
            <button id="btnHandleSubmit" type="button" className="btn-md-lg finalizar-dash principal"
                    onClick={() => Meteor.call('brokerscontacts.connector.contacts', _brokerId)}>
              brokerscontacts.contacts
            </button>
            <button id="btnHandleSubmit" type="button" className="btn-md-lg finalizar-dash principal"
                    onClick={() => Meteor.call('brokerscontacts.connector.loadcontacts', _brokerId)}>
              brokerscontacts.loadcontacts
            </button>
            <button id="btnHandleSubmit" type="button" className="btn-md-lg finalizar-dash principal"
                    onClick={() => Meteor.call('brokerscontacts.connector.savecontacts', _brokerId)}>
              brokerscontacts.savecontacts
            </button>
          </div>
          <div><p /></div>
          <div><p /></div>
        </div>
      );
    }
  }
  
  _renderTotalBasesToUpload() {
    let totalBasesToUploadInformation = (<p />);
    if (this.state.totalBaseToUpload > 0) {
      totalBasesToUploadInformation = (<p>{this.state.totalBaseToUpload} base(s) a ser carregada(s)</p>);
    }
    return totalBasesToUploadInformation;
  }
  
  _onClickBasesToUploadButtons(event) {
    let totalUploadWithSuccess = 0;
    for (let indexPosition = 0; indexPosition < this.state.uploads.length; indexPosition++) {
      const socialInformations = this.state.uploads[indexPosition];
      if (socialInformations.uploadFileId != null) {
        const brokerId = (this.props.facebookProfile).id;
        const brokerName = (this.props.facebookProfile).name;
        const socialCode = socialInformations.socialCode;
        const uploadId = socialInformations.uploadFileId;
        self.setState({
          uploadStatus: 'loading',
        });
        Meteor.call('brokerscontacts.services.importCustomers', brokerId, brokerName, socialCode, uploadId,
          (error, result) => {
            if (error) {
              sweetAlert('Erro de sistema', `Descrição do erro: ${error}`, 'error');
            } else if (result.status == false) {
              sweetAlert('Erro de sistema', `Erro apresentando em: ${result.errorFunction}`, 'error');
            } else {
              socialInformations.uploadIsDone = true;
              totalUploadWithSuccess++;
              if (totalUploadWithSuccess == self.state.totalBaseToUpload) {
                self.setState({
                  ...self.state.uploads,
                  socialInformations,
                  uploadStatus: 'ready',
                  readyToNextStep: true,
                });
              } else {
                self.setState({
                  ...self.state.uploads,
                  socialInformations,
                  uploadStatus: 'ready',
                });
              }
            }
          },
        );
      }
    }
  }

  _renderBasesToUploadButtons() {
    let uploadButton;
    switch (this.state.uploadStatus) {
      case ('ready'):
        uploadButton = (
          <button ref="btnUparBases" type="button" className="btn btn-uparbases"
                  onClick={() => this._onClickBasesToUploadButtons()}>
            <i className="fa fa-upload" /> Upar bases
          </button>
        );
        break;
      case ('loading'):
        uploadButton = (
          <button ref="btnCarregandoBases" type="button" disabled className="btn disabled btn-carregando">
            <i className="fa fa-upload" /> Carregando...
          </button>
        );
        break;
      default:
        uploadButton = (
          <button ref="btnCarregandoBases" type="button" disabled className="hidden disabled btn btn-carregando">
            <i className="fa fa-upload" aria-hidden="true" /> Waiting
          </button>
        );
    }
    return uploadButton;
  }
  
  _renderNextStepButton() {
    let nextStepButton;
    if (this.state.readyToNextStep == true) {
      nextStepButton = (
        <button id="btnHandleSubmit" type="button" className="pull-right btn-md-lg finalizar-dash principal">
          Finalizar
        </button>
      );
    } else {
      nextStepButton = (
        <button id="btnHandleSubmit" type="button" className="hidden pull-right btn-md-lg finalizar-dash principal">
          Waiting
        </button>
      );
    }
    return nextStepButton;
  }
  
  render() {
    const userPic = `https://graph.facebook.com/${(this.props.facebookProfile).id}/picture?type=large`;
    return (
      <div className="step5 div-form-cadastro">
        <div className="container-fluid">
          <div className="header-form col-md-12">
            <div className="photo-cadastro" style={{ background: `url(${userPic})` }} />
            <div>
              <span>Etapa {this.state.step}/{this.state.totalSteps}</span>
              <h1 className="cadastro-titulo">Upload de bases</h1>
            </div>
          </div>
          <div className="content-form col-md-12">
            <div className="form-group">
              <div className="contenedor-formulario">
                <div className="formulario">
                  <p></p>
                  <p></p>
                  <div className="row">
                    <div className="div-upload">
                      <div className="col-md-12">
                        {this._renderInputUploadBox('facebook')}
                        {this._renderInputUploadBox('linkedin')}
                        {this._renderInputUploadBox('googleplus')}
                        {this._renderInputUploadBox('skype')}
                        {this._renderInputUploadBox('cloud')}
                        {this._renderInputUploadBox('excel')}
                        <div className="col-md-12">
                          <div className="upload-info">
                            {this._renderTotalBasesToUpload()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12 div-infos-upload">
                      <p className="info-upload">Selecione os arquivos para upload</p>
                      <div className="col-md-12 div-infos-upload">
                        {this._renderBasesToUploadButtons()}
                      </div>
                    </div>
                  </div>
                  <div className="row footer-form">
                    <div className="col-md-12 text-right">
                      <Link id="previousStep" className="pull-left" to={this.state.previousStep}>
                        <button type="button" className="pull-left btn-md-lg">
                          Voltar
                        </button>
                      </Link>
                      <Link id="nextStep" className="pull-right" to={this.state.nextStep}>
                        {this._renderNextStepButton()}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this._renderBrokersManagerAPITests()}
        </div>
      </div>
    );
  }
}

// Form5 Container
export default GLOBAL.createContainer(() => {
  // Subscribe the collections
  const subUser = Meteor.subscribe('user.selfProfile');
  const uploads = Meteor.subscribe('Uploads');
  
  // Return the container
  return {
    user: (Meteor.user() || {}),
    facebookProfile: (((Meteor.user() || {}).services || {}).facebook) || {},
    loading: !subUser.ready(),
    uploads,
  };
}, Form5);

