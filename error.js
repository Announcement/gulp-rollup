const util = require('gulp-util')

/**
 * Catch the error and push it down the pipeline.
 *
 * @function catch
 *
 * @param {Error} it - Gulp Error.
 */
module.exports = function (it) {
  var error

  error = new util.PluginError('gulp-rollup', it.message)

  callback(error)
  console.log(it)
}
