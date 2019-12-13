import React from 'react';
import { execFetch } from '../util/FetchUtil';

/**
 * Registration component which displays the user registration form.
 */
export default class RegisterForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      /* The resulting status of the attempted registration */
      result: null,

      /* The error message that comes from a failed registration attempt */
      err: null,

      /* The error field which caused the registration attempt to fail */
      errField: null,

      /* The form data to attempt registration with */
      formData: {
        name: '',
        email: '',
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
    const { formData } = this.state;

    // Reset registration attempt variables
    this.setState({
      result: null,
      err: null,
      errField: null
    });

    // Execute registration attempt
    execFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.result === true) {
          // If registration succeeds, redirect to /app route
          window.location.replace('/app');
        } else {
          // If registration fails, capture error
          this.setState({
            result: false,
            err: res.errorMessage,
            errField: res.errorField
          });
        }
      })
      .catch(() => {
        this.setState({
          result: false,
          err: 'Internal error!'
        });
      });

    // Prevent default submit functionality of form
    event.preventDefault();
  }

  render() {
    const { result, err, errField, formData } = this.state;
    return (
      <div>
        {/* Login form */}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            id="name"
            className="fadeIn second"
            name="name"
            placeholder="Name"
            onChange={event => {
              this.setState({ formData: { ...formData, name: event.target.value } });
            }}
          />
          <input
            type="text"
            id="email"
            className={`fadeIn third ${errField === 'email' ? 'field-error' : ''}`}
            name="email"
            placeholder="E-Mail"
            onChange={event => {
              this.setState({ formData: { ...formData, email: event.target.value } });
            }}
            required
          />
          <input
            type="text"
            id="username"
            className={`fadeIn fourth ${errField === 'username' ? 'field-error' : ''}`}
            name="username"
            placeholder="Username"
            onChange={event => {
              this.setState({ formData: { ...formData, username: event.target.value } });
            }}
            required
          />
          <input
            type="password"
            id="password"
            className="fadeIn fifth"
            name="login"
            placeholder="Password"
            onChange={event => {
              this.setState({ formData: { ...formData, password: event.target.value } });
            }}
            required
          />

          {/* Login error */}
          {result === false && (
            <div className="notification error">
              <p>{err}</p>
            </div>
          )}

          <input
            type="submit"
            className="fadeIn sixth"
            value="Register"
            disabled={
              formData.email.length < 1 ||
              formData.password.length < 1 ||
              formData.username.length < 1 ||
              formData.name.length < 1
            }
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
