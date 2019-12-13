/**
 * Routes for the auth service for use in a dev environment.
 *
 * NOTE: These routes should only be made available when using NODE_ENV=development
 */
const path = require('path');
const Express = require('express');
const { isNotAuthenticated } = require('../../authentication');

/* Express Router to handle routes */
const router = Express.Router();

/**
 * Serves the login page.
 *
 * NOTE: This route is only accessible to users who do not have an active session open.
 *
 * @route GET /login
 * @access Public
 */
router.get('/login', isNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../build/login.html'));
});

/**
 * Serves the register page.
 *
 * NOTE: This route is only accessible to users who do not have an active session open.
 *
 * @route GET /register
 * @access Public
 */
router.get('/register', isNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../build/login.html'));
});

module.exports = router;
