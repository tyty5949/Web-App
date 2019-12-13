/**
 * Passport authentication strategies for our authentication service.
 */
const Mongoose = require('mongoose');
const LocalStrategy = require('passport-local');

/**
 * Defines local username/password strategy for passport.
 *
 * Will attempt to find User that matches specified username or email.
 * @see /models/user
 *
 * If login is a failure, the authentication will fail with a 401 Unauthorized status and no other
 * middleware logic will execute.
 */
const localStrategy = new LocalStrategy.Strategy(
  { usernameField: 'username', passwordField: 'password' },
  function authenticate(username, password, done) {
    Mongoose.model('User')
      .findOne()
      .or([{ username: username.toLowerCase() }, { email: username.toLowerCase() }])
      .exec()
      .then(user => {
        // Attempt to validate password on user if one was found
        if (!user || !user.validPassword(password)) {
          // If no user was found or password was incorrect, include error message
          return done(null, false, { message: 'Invalid username/password!' });
        }
        // If user is validated and authenticated
        return done(null, user);
      })
      .catch(err => {
        done(err);
      });
  }
);

module.exports = {
  localStrategy
};
