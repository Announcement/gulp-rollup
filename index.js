'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  var cache;

  var exists = function exists(it) {
    return it !== undefined && it !== null;
  };

  function select() {
    var parameters;

    parameters = Array.prototype.slice.call(arguments, 0);

    return function (it) {
      var object;

      object = {};

      parameters.forEach(function (key) {
        object[key] = it[key];
      });

      return object;
    };
  }

  function onwarn(it) {}
  // util.log(it)


  /**
   * Get configuration with optionals+defualts for rollup.rollup({options}) method.
   *
   * @function getRollupConfiguration
   *
   * @param {File} it - The Vinyl file configuring for.
   *
   * @returns {Object} Configuration for use with rollup.
   */
  function getRollupConfiguration(it) {
    var defaults;
    var possible;

    defaults = {
      entry: {
        path: it.path,
        contents: it.contents
      },
      cache: cache[it.path],
      onwarn: onwarn,
      plugins: [(0, _rollupPluginMemory2.default)()]
    };

    possible = select('entry', 'cache', 'external', 'paths', 'onwarn', 'plugins', 'treeshake', 'acorn', 'context', 'moduleContext', 'legacy');

    return Object.assign(defaults, possible(options));
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
  function getGenerateConfiguration(it) {
    var defaults;
    var possible;

    // defaults that deviate from stock rollup
    defaults = {
      format: 'cjs'

      // list of possible properties
    };possible = select('format', 'exports', 'moduleId', 'moduleName', 'globals', 'indent', 'banner', 'footer', 'sourceMap', 'sourceMapFile', 'useStrict');

    return Object.assign(defaults, possible(options));
  }

  cache = {};

  return _through2.default.obj(obj

  /**
   * The through2 object pipe generator.
   *
   * @function obj
   *
   * @param {Buffer|string} file - Vinyl.
   * @param {string} [encoding] - Ignored if file contains a Buffer.
   * @param {throughCallback} callback - Call this function when done processing.
   */
  );function obj(file, encoding, callback) {
    var configuration;

    configuration = {};

    configuration.rollup = getRollupConfiguration(file);
    configuration.generate = getGenerateConfiguration(file);

    _rollup2.default.rollup(configuration.rollup).then(compile).catch(error

    /**
     * Catch the error and push it down the pipeline.
     *
     * @function catch
     *
     * @param {Error} it - Gulp Error.
     */
    );function error(it) {
      var error;

      error = new _gulpUtil2.default.PluginError('rollup-stream', it.message);

      callback(error);
    }

    /**
     * Compile the bundle with rollup.
     *
     * @function compile
     *
     * @param {Bundle} bundle - Rollup bundle.
     */
    function compile(bundle) {
      var result;

      /**
       * If a sourcemap is provided than register it to the file.
       *
       * @function trace
       *
       * @param {Object} it - Sourcemap.
       */
      var trace = function trace(it) {
        return exists(it) && (0, _vinylSourcemapsApply2.default)(file, it);
      };

      result = bundle.generate(configuration.generate);
      cache[file.path] = bundle;

      trace(result.map);

      file.contents = Buffer.from(result.code);

      callback(null, file);
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
};

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _rollup = require('rollup');

var _rollup2 = _interopRequireDefault(_rollup);

var _rollupPluginMemory = require('rollup-plugin-memory');

var _rollupPluginMemory2 = _interopRequireDefault(_rollupPluginMemory);

var _vinylSourcemapsApply = require('vinyl-sourcemaps-apply');

var _vinylSourcemapsApply2 = _interopRequireDefault(_vinylSourcemapsApply);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
