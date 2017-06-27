import { PluginError } from 'gulp-util'

/**
 * Catch the error and push it down the pipeline.
 *
 * @function catch
 *
 * @param {Error} it - Gulp Error.
 */
export default function (callback) {
  var name

  name = 'gulp-rollup'

  return method

  function method (it) {
    var error
    var message

    message = it.message
    error = new PluginError(name, message)

    callback(error)
  }
}
