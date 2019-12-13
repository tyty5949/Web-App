/**
 * File which holds all API routers for the application.
 *
 * Folders with an index.js should be created within this folder for new services. They should return
 * only a single router to simplify usage within this file.
 *
 * All API routes should follow the naming convention /api/<service> where <service> is the name of
 * the service folder for the new service.
 */
const Express = require('express');
const DevRoutes = require('./auth/devroutes');

/* Express Router to handle routes */
const router = Express.Router();

// Serve development auth routes
if (process.env.NODE_ENV === 'development') {
  router.use(DevRoutes);
}

// Serve auth api
router.use('/api/auth', require('./auth'));

// Serve vision board api
router.use('/api/visionboard', require('./visionboard'));

// Reject non-registered /api routes
router.all('/api**', (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
