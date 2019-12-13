import React from 'react';
import 'semantic-ui-theme/semantic.less';
import 'less/Login.less';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

/**
 * Component wrapper for the login page. Serves either LoginForm page or RegisterForm based upon
 * pathname entered in browser.
 */
class LoginContainer extends React.PureComponent {
  render() {
    const onLoginRoute = window.location.pathname.startsWith('/login');
    const onRegisterRoute = window.location.pathname.startsWith('/register');

    return (
      <div className="wrapper fadeInDown">
        <div id="formContent">
          {/* Title */}
          <a id="title" href="/">
            <h1>App</h1>
          </a>

          <br />

          {/* Tabs titles */}
          <a className="tabs" href="/login">
            <h2 className={onLoginRoute ? 'active' : 'inactive underlineHover'}>Sign In</h2>
          </a>
          <a className="tabs" href="/register">
            <h2 className={onLoginRoute ? 'inactive underlineHover' : 'active'}>Sign Up</h2>
          </a>

          {/* Login or Register form body */}
          {onLoginRoute && <LoginForm />}
          {onRegisterRoute && <RegisterForm />}
        </div>
      </div>
    );
  }
}

export default LoginContainer;
