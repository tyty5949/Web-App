const Mongoose = require('mongoose');
const { Schema } = require('mongoose');

const VisionBoardSchema = new Schema(
  {
    /* Owner User of the board  */
    owner: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    /* Title of the board */
    title: {
      type: String,
      required: true
    },

    /* Date of the board's event */
    eventDate: {
      type: Date
    },

    /* Whether or not the board is flagged as a favorite */
    favorite: {
      type: Boolean
    },

    /* The image icon URL for the board icon */
    iconImage: {
      type: String
    },

    /* Sub-document array for storing information for the vendor directory */
    vendorDirectoryEntries: {
      type: [{ type: Schema.ObjectId, ref: 'VendorDirectoryEntry' }]
    }
  },
  { collection: 'visionboards', timestamps: true }
);

/**
 * Query helper function which finds a vision board by it's id only if the specified user
 * has access to it.
 *
 * @param {*} userId
 * @param {*} boardId
 * @returns {(DocumentQuery<T | null, T> & QueryHelpers) | Query}
 */
VisionBoardSchema.statics.findForUser = function findForUser(userId, boardId) {
  return this.findById(boardId).where({ owner: userId });
};

Mongoose.model('VisionBoard', VisionBoardSchema);
