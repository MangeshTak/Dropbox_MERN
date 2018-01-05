import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestLogin, requestRegister } from '../actions/allActions';

const mapStateToProps = (state) => {
  return {
    loginFailed: state.actionReducer.loginFailed,
    loginMsg: state.actionReducer.loginMsg,
    registerMsg: state.actionReducer.registerMsg,
    registerFailed: state.actionReducer.registerFailed,
    isloggedIn: state.actionReducer.isloggedIn,
    currentFileId: state.actionReducer.currentFileId
  }
}

const mapDispatchToProps = (dispatch) => {
  let actions = { requestLogin, requestRegister };
  return { ...actions, dispatch };
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName:"",
      lastName:"",
      username:"admin@admin.com",
      password:"admin",
      showsignIn:true,
      showsAgreementError:true
    };

    this.handleFNChange = this.handleFNChange.bind(this);
    this.handleLNChange = this.handleLNChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePWChange = this.handlePWChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleShowHide = this.handleShowHide.bind(this);
    this.handleAgreement = this.handleAgreement.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  handleFNChange(event) {
    this.setState({firstName: event.target.value});
  }

  handleLNChange(event) {
    this.setState({lastName: event.target.value});
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePWChange(event) {
    this.setState({password: event.target.value});
  }

  handleAgreement(event){
    this.setState({showsAgreementError: !this.state.showsAgreementError});
  }

  validateEmail(elementValue){      
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(elementValue); 
  }

  handleLogin(event) {
    if(this.validateEmail(this.state.username) && this.state.password){
      this.props.dispatch(this.props.requestLogin(this.state));
      event.preventDefault();
    }
    //() => this.props.history.push('/home')
  }

  handleRegister(event) {
    if(!this.state.showsAgreementError && this.validateEmail(this.state.username) && this.state.password && this.state.firstName && this.state.lastName){
      this.props.dispatch(this.props.requestRegister(this.state));
      event.preventDefault();
    } else if(this.state.showsAgreementError) {
      event.preventDefault();      
    }
  }

  handleShowHide(event){
    this.setState({showsignIn: !this.state.showsignIn});
  }

  componentWillMount(){
    if(sessionStorage.getItem('jwtToken')){
      this.props.history.push('/home');
    }    
  }

  componentWillReceiveProps(){
    if(sessionStorage.getItem('jwtToken')){
      this.props.history.push('/home');
    }    
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img className="dropbox_logo" src="images/dropbox_logo.svg" alt="dropbox_logo"/>
          <img className="dropbox_logo" src="images/dropbox_title.svg" alt="dropbox_title"/>
        </header>
        <div className="row mainBox">
          <div className="col-md-6">
            <img className="dropbox_logo big_logo" src="images/dropbox_logo.svg" alt="dropbox_logo"/>
          </div>
          { this.state.showsignIn ? <div className="col-md-4">
            <div className="row">
              <div className="login-register-header">Sign in</div>
              <div className="login-register-switch">"Or "
                <a className="login-register-switch-link" onClick={this.handleShowHide}>create an account</a>
              </div>
            </div>
            <form>
              <div className="row">
                <div className="login-field">
                  <input required placeholder="Email" className="text-input-input autofocus" type="email" name="username" value={this.state.username} onChange={this.handleUsernameChange} />
                </div>
                <div className="login-field">
                  <input required placeholder="Password" className="text-input-input autofocus" type="password" name="password" value={this.state.password} onChange={this.handlePWChange} />
                </div>
                <div className="remember-me">
                  <input type="checkbox" id="rememberMe" name="rememberMe" value="rememberMe"/>Remember me
                </div>
                <div className={this.props.loginFailed ? 'text-input-error-wrapper' : 'text-input-error-wrapper success'}>{this.props.loginMsg}</div>
                <input type="submit" className="btn login-button" value="login" onClick={this.handleLogin}/>
                <a href="" className="ForgotPass" onClick={this.showRegister}>Forgot your password?</a>
              </div>
            </form>
          </div> : null}
          { this.state.showsignIn ? null : <div className="col-md-4">
            <div className="row">
              <div className="login-register-header">Create an account</div>
              <div className="login-register-switch">"Or "
                <a className="login-register-switch-link" onClick={this.handleShowHide}>log in</a>
              </div>
            </div>
            <form>
            <div className="row">
              <div className="login-field">
                <input required placeholder="Email" className="text-input-input autofocus" type="email" name="username" value={this.state.username} onChange={this.handleUsernameChange} />
              </div>
              <div className="login-field">
                <input required placeholder="Password" className="text-input-input autofocus" type="password" name="password" value={this.state.password} onChange={this.handlePWChange} />
              </div>
              <div className="login-field">
                <input required placeholder="First Name" className="text-input-input autofocus" type="text" name="firstName" value={this.state.firstName} onChange={this.handleFNChange} />
              </div>
              <div className="login-field">
                <input required placeholder="Last Name" className="text-input-input autofocus" type="text" name="lastName" value={this.state.lastName} onChange={this.handleLNChange} />
              </div>
              <div className="remember-me">
                { this.state.showsAgreementError ? <div className="text-input-error-wrapper">Please agree to the terms of service</div> : null}
                <input type="checkbox" value={this.state.showsAgreementError?'FALSE':'TRUE'} id="rememberMe" name="agreementCheck" onChange={this.handleAgreement}/>I agree to <a target="_blank" href="html/agreement.html">Dropbox terms.</a>
              </div>
              <div className={this.props.registerFailed ? 'text-input-error-wrapper' : 'text-input-error-wrapper success'}>{this.props.registerMsg}</div>
              <input type="submit" className="btn login-button" value="Create an account" onClick={this.handleRegister}/>
            </div></form>
          </div>}
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Login);