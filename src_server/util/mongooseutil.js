/**
 * Mongoose utility function which parses a writeOpResult and returns success or fail data if the
 * operation modified at least one document.
 *
 *    if (writeOpResult.n === 0)
 *      return fail
 *    else
 *      return success
 *
 * This is especially useful to return a statusCode when a mongoose query modifies data.
 *
 * NOTE: Only certain mongoose query functions which perform an atomic MongoDB query actually
 * produce a writeOpResult.
 *
 * @see https://stackoverflow.com/questions/31808786/mongoose-difference-of-findoneandupdate-and-update/31809167
 *
 * @param writeOpResult - Mongoose writeOpResult object
 * @param {*} success - What to return on success
 * @param {*} fail - What to return on failure
 * @returns {*}
 */
const writeOpResultDidModify = (writeOpResult, success, fail) =>
  writeOpResult.n === 0 ? fail : success;

module.exports = {
  writeOpResultDidModify
};
