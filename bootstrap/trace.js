const sourcemap = require('vinyl-sourcemaps-apply')

const exists = require('./exists')

/**
 * If a sourcemap is provided than register it to the file.
 *
 * @function trace
 *
 * @param {Object} it - Sourcemap.
 */
module.exports = function (it, file) {
  return exists(it) && sourcemap(file, it)
}
