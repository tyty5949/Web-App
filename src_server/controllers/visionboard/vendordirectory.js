/**
 * Controllers for Vision Boards Vendor Directory module.
 */
const Express = require('express');
const Mongoose = require('mongoose');
const { isApiAuthenticated } = require('../../authentication');

const router = Express.Router({ mergeParams: true });

/**
 *
 */
router.get('/vendors/:vendorId', isApiAuthenticated, (req, res, next) => {
  Mongoose.model('VisionBoard')
    .findForUser(req.user.id, req.params.boardId)
    .select('vendorDirectoryEntries')
    .populate({
      path: 'vendorDirectoryEntries',
      match: { _id: { $eq: req.params.vendorId } }
    })
    .lean()
    .exec()
    .then(visionBoard => {
      if (
        !visionBoard ||
        !visionBoard.vendorDirectoryEntries ||
        visionBoard.vendorDirectoryEntries.length === 0
      ) {
        res.sendStatus(404);
      } else {
        res.json(visionBoard.vendorDirectoryEntries[0]);
      }
    })
    .catch(err => {
      res.sendStatus(500);
      next(err);
    });
});

module.exports = router;
