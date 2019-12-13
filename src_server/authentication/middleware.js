/**
 * Middleware for our authentication service.
 */

// Verifies that the user is authenticated with an active session.
// If not, the redirects to the /login route.
// This is useful for pages with a front-end as it will redirect to the login view.
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
  return undefined;
};

// Verifies that the user is NOT authenticated with an active session.
// If they are, redirects to the /app route.
// This is useful in many cases, mainly to prevent multiple active sessions for each user.
const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
  return undefined;
};

// Verifies that the user is authenticated with an active session.
// If not, sends a 403 Forbidden error.
// This is useful for API endpoints as they shouldn't have a redirect, only an error
const isApiAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
  return undefined;
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  isApiAuthenticated
};
