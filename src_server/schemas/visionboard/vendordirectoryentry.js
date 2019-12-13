const Mongoose = require('mongoose');
const { Schema } = require('mongoose');

const VendorDirectoryEntrySchema = new Schema(
  {
    name: {
      type: String
    },

    primaryContact: {
      type: String
    },

    type: {
      type: String
    },

    status: {
      type: String
    }
  },
  { collection: 'visionboard-vendordirectoryentries', timestamps: true }
);

Mongoose.model('VendorDirectoryEntry', VendorDirectoryEntrySchema);
