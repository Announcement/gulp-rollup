const through = require('through2')
const rollup = require('rollup')
const memory = require('rollup-plugin-memory')
const sourcemap = require('vinyl-sourcemaps-apply')
const util = require('gulp-util')

const select = require('./select')
const exists = require('./exists')
const trace = require('./trace')
const getRollupConfiguration = require('./getRollupConfiguration')
const getGenerateConfiguration = require('./getGenerateConfiguration')
const error = require('./error')
const onwarn = require('./onawrn')

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
