var through = require('through2')
var rollup = require('rollup')
var memory = require('rollup-plugin-memory')
var sourcemap = require('vinyl-sourcemaps-apply')
var util = require('gulp-util')

var error = require('./error')
var onwarn = require('./onwarn')
var select = require('./select')
var exists = require('./exists')
var trace = require('./trace')
var getRollupConfiguration = require('./getRollupConfiguration')
var getGenerateConfiguration = require('./getGenerateConfiguration')

 /**
  * Generates a gulp-rollup pipeline.
  *
  * @function rollup
  *
  * @param {Object} options - Piped properly to rollup.rollup & bundle.generate.
  *
  * @returns {Stream} Ready for gulp.
  */
module.exports = function (options) {
  var cache

  cache = {}

  return through.obj(obj)

  /**
   * The through2 object pipe generator.
   *
   * @function obj
   *
   * @param {Buffer|string} file - Vinyl.
   * @param {string} [encoding] - Ignored if file contains a Buffer.
   * @param {throughCallback} callback - Call this function when done processing.
   */
  function obj (file, encoding, callback) {
    var configuration

    configuration = {}

    configuration.rollup = getRollupConfiguration(file, cache)
    configuration.generate = getGenerateConfiguration(file)

    console.log(file)

    rollup
      .rollup(configuration.rollup)
      .then(compile)
      .catch(error)

    /**
     * Compile the bundle with rollup.
     *
     * @function compile
     *
     * @param {Bundle} bundle - Rollup bundle.
     */
    function compile (bundle) {
      var result

      result = bundle.generate(configuration.generate)
      cache[file.path] = bundle

      trace(result.map)

      file.contents = Buffer.from(result.code)

      callback(null, file)
    }
    /**
     * @typedef Bundle
     * @property {Array.<String>} imports - List of module.id.
     * @property {Array.<Object>} exports - List of all the exported content.
     * @property {Array.<String>} modules - List of module.json.
     * @property {Function} generate - Generate the bundle.
     * @property {Function} write - Write the bundle to the file system.
     */
  }
  /**
   * @callback throughCallback
   * @param {Error} [error]
   * @param {object} [output]
   */
}
