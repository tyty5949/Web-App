/**
 * Object utility function which strips out any null values for { key: value } pairs from the given
 * object.
 *
 * Ex.
 *    buildConditionObject({
 *      a: 'a',
 *      b: null,
 *      c: undefined,
 *      d: 1
 *    })
 *    returns => { a: 'a', d: 1 }
 *
 * @param obj - An object with no null values
 */
const buildConditionalObject = obj => {
  const condObj = {};
  Object.keys(obj).forEach(key => {
    Object.assign(condObj, obj[key] != null && { [key]: obj[key] });
  });
  return condObj;
};

module.exports = {
  buildConditionalObject
};
