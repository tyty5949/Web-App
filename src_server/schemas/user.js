const Mongoose = require('mongoose');
const { Schema } = require('mongoose');
const BCrypt = require('bcrypt');
const UniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema(
  {
    /* Name of the user */
    name: String,

    /* Email address of the user */
    email: {
      type: String,
      required: true,
      unique: true
    },

    /* The username for the user to login with */
    username: {
      type: String,
      required: true,
      unique: true
    },

    /* Password hash for password of the user */
    passwordHash: {
      type: String,
      required: true
    },

    /* List of Vision Boards accessible to the user */
    visionBoards: {
      type: [
        {
          type: Schema.ObjectId,
          ref: 'VisionBoard'
        }
      ]
    }
  },
  { collection: 'users', timestamps: true }
);

// Validates that unique fields are unique in the database
// Throws ValidationError if unique field value already exists in database
UserSchema.plugin(UniqueValidator);

/**
 * Hashes and compares the given password to the hashed password stored in the database.
 *
 * @param {string} password - Password to check if valid for user
 */
UserSchema.methods.validPassword = function validPassword(password) {
  return BCrypt.compareSync(password, this.passwordHash);
};

// Hash and save the password to the database
UserSchema.virtual('password').set(function(value) {
  const saltRounds = 12;
  this.passwordHash = BCrypt.hashSync(value, saltRounds);
});

/**
 * Query helper function to add a vision board ref to the user using $push.
 *
 * @param visionBoard
 * @returns {(DocumentQuery<T | null, T> & QueryHelpers) | Query}
 */
UserSchema.query.addVisionBoard = function addVisionBoard(visionBoard) {
  return this.updateOne({ $push: { visionBoards: visionBoard.id } });
};

/**
 * Query helper function to remove a vision board ref from the user using $pull.
 *
 * @param visionBoard
 * @returns {(DocumentQuery<T | null, T> & QueryHelpers) | Query}
 */
UserSchema.query.removeVisionBoard = function removeVisionBoard(visionBoard) {
  return this.updateOne({ $pull: { visionBoards: visionBoard.id } });
};

Mongoose.model('User', UserSchema);
