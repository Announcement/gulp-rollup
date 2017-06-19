import through from 'through2'
import rollup from 'rollup'
import memory from 'rollup-plugin-memory'
import sourcemap from 'vinyl-sourcemaps-apply'
import util from 'gulp-util'

// all options in rollup.rollup({options})
// all options in bundle.generate({options})
//
// sourcemaps out are supported, sourcemaps in are not
// included files probably won't bump on watch.
//
// rollup.rollup has the following defaults that deviate from stock
//  - entry-point comes from vinyl
//  - cache is set to a local cache object inside the function per filename
//  - onwarn is set to an empty function
//  - plugins are loaded by default
//
// plugins loaded by default (to allow a vinyl entry point)
//  - memory()
//
// bundle.generate has an extra default
//  - format is now common js
//
// disclaimer:
//  this file might be a bit *over* formatted and verbose
//  few things aren't dry (the generators particularly)
//  but over all the code should very readable and relatively easy to maintain

 /**
  * Generates a gulp-rollup pipeline.
  *
  * @function rollup
  *
  * @param {Object} options - Piped properly to rollup.rollup & bundle.generate.
  *
  * @returns {Stream} Ready for gulp.
  */
export default function (options) {
  var cache

  let exists = it => it !== undefined && it !== null

  function select () {
    var parameters

    parameters = Array.prototype.slice.call(arguments, 0)

    return function (it) {
      var object

      object = {}

      parameters.forEach(key => {
        object[key] = it[key]
      })

      return object
    }
  }

  function onwarn (it) {
    // util.log(it)
  }

  /**
   * Get configuration with optionals+defualts for rollup.rollup({options}) method.
   *
   * @function getRollupConfiguration
   *
   * @param {File} it - The Vinyl file configuring for.
   *
   * @returns {Object} Configuration for use with rollup.
   */
  function getRollupConfiguration (it) {
    var defaults
    var possible

    defaults = {
      entry: {
        path: it.path,
        contents: it.contents
      },
      cache: cache[it.path],
      onwarn,
      plugins: [
        memory()
      ]
    }

    possible = select(
      'entry',
      'cache',
      'external',
      'paths',
      'onwarn',
      'plugins',
      'treeshake',
      'acorn',
      'context',
      'moduleContext',
      'legacy'
    )

    return Object.assign(defaults, possible(options))
  }

  /**
   * Get configuration with optionals and defaults.
   *
   * @function getGenerateConfiguration
   *
   * @param {File} it - The Vinyl file configuring for.
   *
   * @returns {Object} Configuration for use with bundle.generate({options}).
   */
  function getGenerateConfiguration (it) {
    var defaults
    var possible

    // defaults that deviate from stock rollup
    defaults = {
      format: 'cjs'
    }

    // list of possible properties
    possible = select(
      'format',
      'exports',
      'moduleId',
      'moduleName',
      'globals',
      'indent',
      'banner',
      'footer',
      'sourceMap',
      'sourceMapFile',
      'useStrict'
    )

    return Object.assign(defaults, possible(options))
  }

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

    configuration.rollup = getRollupConfiguration(file)
    configuration.generate = getGenerateConfiguration(file)

    rollup.rollup(configuration.rollup).then(compile).catch(error)

    /**
     * Catch the error and push it down the pipeline.
     *
     * @function catch
     *
     * @param {Error} it - Gulp Error.
     */
    function error (it) {
      var error

      error = new util.PluginError('rollup-stream', it.message)

      callback(error)
    }

    /**
     * Compile the bundle with rollup.
     *
     * @function compile
     *
     * @param {Bundle} bundle - Rollup bundle.
     */
    function compile (bundle) {
      var result

      /**
       * If a sourcemap is provided than register it to the file.
       *
       * @function trace
       *
       * @param {Object} it - Sourcemap.
       */
      let trace = it => exists(it) && sourcemap(file, it)

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
