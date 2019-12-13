/**
 * Our authentication service for the application. Provides custom middleware,
 * authentication strategies, and passport configuration.
 */
const Passport = require('passport');
const { isAuthenticated, isNotAuthenticated, isApiAuthenticated } = require('./middleware');
const { localStrategy } = require('./strategies');

// Configure serialization process for session users
Passport.serializeUser((user, done) => {
  done(null, { id: user.id, username: user.username });
});

// Configure deserialization process for session users
Passport.deserializeUser((userData, done) => {
  done(null, { id: userData.id, username: userData.username });
});

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isApiAuthenticated,
  localStrategy
};
