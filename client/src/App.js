import React, { Component } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

var ip = require('ip')

const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const DELAY = 1500;

class App extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      name: null,
      username: null,
      password: null,
      registered: false,
      loggedin: false,
      error: null,
      callback: "not fired",
      value: "[empty]",
      load: false,
      expired: "false"
    };
    this._reCaptchaRef = React.createRef();
  }


  componentDidMount() {
    axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
  }


  login = (username, password) => {
    axios.post("http://localhost:3001/api/login", { 
      username: username,
      password: password,
      ip: ip.address()
    })
    .then(res=> {
      if(res.data.success)
        this.setState({ 
          loggedin: true,
          error: null,
          load: res.data.showCaptcha
        })
      else
        this.setState({ error: res.data.message })
    })
  }

  signup = (name, username, password) => {
    axios.post("http://localhost:3001/api/signup", { 
      name: name,
      username: username,
      password: password
    })
    .then(res=> {
      console.log("signup: "+JSON.stringify(res))
      if(res.data.success)
        this.setState({ 
          loggedin: true,
          error: null
        })
      else
        this.setState({ error: res.data.message })
    })
  }

  handleChange = value => {
    console.log("Captcha value:", value);
    this.setState({ 
      value: value,
      load: false
    });
    if (value === null) this.setState({ expired: "true" });
  }

  asyncScriptOnLoad = () => {
    this.setState({ callback: "called!" });
    console.log("scriptLoad - reCaptcha Ref-", this._reCaptchaRef);
  }

  render() {
    const { data } = this.state;
    if(!this.state.registered && !this.state.loggedin) {
      return (
        <div>
          <div style={{ padding: "10px" }}>
            <div>
              <input
                type="text"
                onChange={e => this.setState({ name: e.target.value })}
                placeholder="name"
                style={{ width: "200px" }}
              />
            </div>
            <div>
              <input
                type="text"
                onChange={e => this.setState({ username: e.target.value })}
                placeholder="username"
                style={{ width: "200px" }}
              />
            </div>
            <div>
              <input
                type="text"
                onChange={e => this.setState({ password: e.target.value })}
                placeholder="password"
                style={{ width: "200px" }}
              />
            </div>
            <h4>{this.state.error}</h4>
            <button onClick={() => this.signup(this.state.name, this.state.username, this.state.password)}>
              Signup
            </button>
            <button onClick={() => this.setState({ registered: true }) }>
              Have an account
            </button>
            </div>
        </div>
      )
    }

    else if(this.state.registered && !this.state.loggedin) {
      return (
        <div>
          <div style={{ padding: "10px" }}>
            <div>
              <input
                type="text"
                onChange={e => this.setState({ username: e.target.value })}
                placeholder="username"
                style={{ width: "200px" }}
              />
            </div>
            <div>
              <input
                type="text"
                onChange={e => this.setState({ password: e.target.value })}
                placeholder="password"
                style={{ width: "200px" }}
              />
            </div>
            <h4>{this.state.error}</h4>
            <button onClick={() => this.login(this.state.username, this.state.password)}>
              Login
            </button>
            <button onClick={() => this.setState({ registered: !this.state.registered }) }>
              Create an account
            </button>
            </div>
        </div>
      )
    }

    else{
      if(this.state.load){
        return(
          <div>
            {this.state.load && (
              <ReCAPTCHA
                style={{ display: "inline-block" }}
                theme="dark"
                ref={this._reCaptchaRef}
                sitekey={TEST_SITE_KEY}
                onChange={this.handleChange}
                asyncScriptOnLoad={this.asyncScriptOnLoad}
              />
            )}
          </div>
        )
      }
      else{
        return (
          <div>
            <h1>HOME</h1>
            <button 
              onClick={() => 
                this.setState({ 
                  loggedin: false,
                  name: null,
                  username: null,
                  password: null
                }) }>
                Signout
            </button>
          </div>
        )
      }
    }

  }
}

export default App;
