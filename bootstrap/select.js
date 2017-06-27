/**
 * Intended to be used with Array.prototype.map
 *
 * @function select
 *
 * @version 1.0.0
 * @variation 2
 *
 * @param {Array.<String>} it - Properties to pull from each object.
 *
 * @returns {Function} A callback function for reducing objects to similar objects with only specified properties.
 */
module.exports = function (parameters) {
  return function (it) {
    var object

    object = {}

    parameters.forEach(forEach)

    return object

    function forEach (key) {
      if (it.hasOwnProperty(key)) {
        object[key] = it[key]
      }
    }
  }
}
