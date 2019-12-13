/**
 * API endpoints for the Vision Boards service.
 */
const Express = require('express');
const Mongoose = require('mongoose');
const { isApiAuthenticated } = require('../../authentication');
const ObjectUtil = require('../../util/objectutil');
const MongooseUtil = require('../../util/mongooseutil');

/* Express Router to handle routes */
const router = Express.Router();

/**
 * REST method for creating a Vision Boards.
 */
router.post('/', isApiAuthenticated, (req, res, next) => {
  const createDoc = ObjectUtil.buildConditionalObject({
    title: req.body.title,
    eventDate: req.body.eventDate,
    favorite: req.body.favorite
  });

  Mongoose.model('VisionBoard')
    .create({ ...createDoc, owner: req.user.id })
    .then(visionBoard => {
      // Add vision board ref to user
      Mongoose.model('User')
        .findById(req.user.id)
        .addVisionBoard(visionBoard)
        .exec()
        .then(writeOpResult =>
          res.sendStatus(MongooseUtil.writeOpResultDidModify(writeOpResult, 201, 500))
        )
        .catch(err => {
          res.sendStatus(500);
          next(err);
        });
    })
    .catch(err => {
      res.sendStatus(500);
      next(err);
    });
});

/**
 * REST method for retrieving a list of vision boards associated to the session user.
 *
 * NOTE: Not all vision board data is populated into list. Use /boards/:id to get full object.
 */
router.get('/', isApiAuthenticated, (req, res, next) => {
  Mongoose.model('User')
    .findById(req.user.id)
    .select('visionBoards')
    .lean()
    .populate('visionBoards', 'title eventDate favorite')
    .exec()
    .then(user => {
      if (!user.visionBoards) {
        // If user has not vision boards
        res.json([]);
      } else {
        res.json(user.visionBoards);
      }
    })
    .catch(err => {
      res.sendStatus(500);
      next(err);
    });
});

/**
 * REST method for getting a specific vision board.
 *
 * NOTE: Not all data for populated paths is included. Fetch GET for the path to get full object.
 */
router.get('/:id', isApiAuthenticated, (req, res) => {
  Mongoose.model('VisionBoard')
    .findForUser(req.user.id, req.params.id)
    .populate({
      path: 'vendorDirectoryEntries',
      select: 'name primaryContact type status'
    })
    .lean()
    .exec()
    .then(visionBoard => {
      if (!visionBoard) {
        // If no vision board is found
        res.sendStatus(404);
      } else {
        res.json(visionBoard);
      }
    });
});

/**
 * REST method for updating data for a specific vision board.
 */
router.put('/:id', isApiAuthenticated, (req, res, next) => {
  const updateDoc = ObjectUtil.buildConditionalObject({
    title: req.body.title,
    eventDate: req.body.eventDate,
    favorite: req.body.favorite
  });

  Mongoose.model('VisionBoard')
    .findForUser(req.user.id, req.params.id)
    .updateOne(updateDoc)
    .exec()
    .then(writeOpResult =>
      res.sendStatus(MongooseUtil.writeOpResultDidModify(writeOpResult, 200, 404))
    )
    .catch(err => {
      res.sendStatus(500);
      next(err);
    });
});

/**
 * REST method for deleting a specific vision board.
 */
router.delete('/:id', isApiAuthenticated, (req, res, next) => {
  Mongoose.model('VisionBoard')
    .findByIdAndDelete(req.params.id)
    .where({ owner: req.user.id })
    .exec()
    .then(visionBoard => {
      if (!visionBoard) {
        // If no vision board is found for deletion
        res.sendStatus(404);
      } else {
        // Remove vision board ref from user
        Mongoose.model('User')
          .findById(req.user.id)
          .removeVisionBoard(visionBoard)
          .exec()
          .then(writeOpResult =>
            res.sendStatus(MongooseUtil.writeOpResultDidModify(writeOpResult, 200, 500))
          )
          .catch(err => {
            res.sendStatus(500);
            next(err);
          });
      }
    })
    .catch(err => {
      res.sendStatus(500);
      next(err);
    });
});

module.exports = router;
