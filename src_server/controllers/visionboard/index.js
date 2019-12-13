/**
 * Controllers for Vision Boards service.
 */
const Express = require('express');

/* Express Router to handle routes */
const router = Express.Router();

/* Boards module */
router.use('/boards', require('./boards'));

/* Vendor Directory module */
router.use('/boards/:boardId', require('./vendordirectory'));

module.exports = router;
