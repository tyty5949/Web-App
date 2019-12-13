import React from 'react';
import { execFetch } from '../util/FetchUtil';

/**
 * Login component which displays the user login form.
 */
export default class LoginForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      /* Error message to display if login fails */
      errorMessage: null,

      /* Form data to attempt login with */
      formData: {
        username: '',
        password: ''
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Callback function for form submission.
   */
  handleSubmit(event) {
    // Reset login attempt variables
    this.setState({
      errorMessage: null
    });

    const { formData } = this.state;

    // Execute login attempt
    execFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          // If login is successful, redirect to success page
          window.location.replace(res.url);
        }
      })
      .catch(err => {
        if (err.status === 401) {
          // If login fails with 401 Unauthorized
          this.setState({
            errorMessage: 'Invalid username/password!'
          });
        } else {
          this.setState({
            errorMessage: err.message
          });
        }
      });

    // Prevent default submit functionality of form
    event.preventDefault();
  }

  render() {
    const { errorMessage, formData } = this.state;
    return (
      <div>
        {/* Login form */}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            id="username"
            className="fadeIn second"
            name="username"
            placeholder="Username or E-Mail"
            onChange={event => {
              this.setState({ formData: { ...formData, username: event.target.value } });
            }}
            required
          />
          <input
            type="password"
            id="password"
            className="fadeIn third"
            name="login"
            placeholder="Password"
            onChange={event => {
              this.setState({ formData: { ...formData, password: event.target.value } });
            }}
            required
          />

          {/* Login error */}
          {errorMessage && (
            <div className="notification error">
              <p>{errorMessage}</p>
            </div>
          )}

          <input
            type="submit"
            className="fadeIn fourth"
            value="Log In"
            disabled={formData.username.length < 1 || formData.password.length < 1}
          />
        </form>

        {/* Forgot password */}
        <div id="formFooter">
          <a className="underlineHover" href="/forgotPassword">
            Forgot Password?
          </a>
        </div>
      </div>
    );
  }
}
