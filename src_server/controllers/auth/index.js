/**
 * API endpoints for the auth service.
 */
const Express = require('express');
const Passport = require('passport');
const Mongoose = require('mongoose');
const { isAuthenticated, isNotAuthenticated } = require('../../authentication');

/* Express Router to handle routes */
const router = Express.Router();

/**
 * Route which attempts to execute a user login. If the login is a success, express creates a
 * session, redirects to /app route and sends a cookie.
 *
 * If login is a failure, sends a 401 Unauthorized status.
 *
 * NOTE: This route is only accessible to users who do not have an active session open.
 */
router.post('/login', isNotAuthenticated, Passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

/**
 * Logs the user out by terminating their active session if they have one. Once complete,
 * redirects to the /login route.
 */
router.all('/logout', isAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/login');
});

// TODO - Remove this function
/**
 * Helper function for generating errors associated with registration.
 *
 * @param err
 * @param res
 */
const generateRegisterError = (err, res) => {
  if (err.errors.email) {
    res.json({
      result: false,
      errorMessage: 'Account with E-Mail already exists!',
      errorField: 'email'
    });
  } else if (err.errors.username) {
    res.json({
      result: false,
      errorMessage: 'Username is taken!',
      errorField: 'username'
    });
  } else {
    res.status(500).end();
  }
};

// TODO - Fix this functionality for production
/**
 * Attempts to register a user. If the registration fails, a response body of schema:
 *
 * {
 *   result: false,
 *   errorMessage: '<message>',
 *   errorField: '<field>'
 * }
 *
 * is returned. Message describes the register failure and the field points to which field
 * caused the error.
 *
 * Currently, if the registration completed a response body of schema:
 *
 * {
 *   result: true,
 *   user
 * }
 *
 * is returned. User is the user object that was created and stored in the database.
 *
 * WARNING: !! This functionality is NOT suitable for production !!
 *
 * NOTE: This route is only accessible to users who do not have an active session open.
 *
 * @route GET /api/auth/register
 * @access Public
 */
router.post('/api/register', isNotAuthenticated, (req, res) => {
  const { name, email, username, password } = req.body;

  // Attempt to create new user
  Mongoose.model('User')
    .create({ name, email, username, password })
    .then(user => {
      // User creation success
      res.send({
        result: true,
        user
      });
    })
    .catch(err => {
      // User creation failure
      generateRegisterError(err, res);
    });
});

module.exports = router;
