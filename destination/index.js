'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var through = _interopDefault(require('through2'));
var rollup = _interopDefault(require('rollup'));
var gulpUtil = require('gulp-util');
var sourcemap = _interopDefault(require('vinyl-sourcemaps-apply'));
var memory = _interopDefault(require('rollup-plugin-memory'));
var resolve = _interopDefault(require('rollup-plugin-node-resolve'));
var commonjs = _interopDefault(require('rollup-plugin-commonjs'));

var exists = function (it) {
// module.exports = function (it) {
  return it !== undefined && it !== null
};

function string (it) {
  return exists(it) && valid(it)

  function valid (it) {
    return it instanceof String && it.length > 0
  }
}

/**
 * Catch the error and push it down the pipeline.
 *
 * @function catch
 *
 * @param {Error} it - Gulp Error.
 */
var error = function (callback) {
  var name;

  name = 'gulp-rollup';

  return method

  function method (it) {
    var error;
    var message;

    message = it.message;
    error = new gulpUtil.PluginError(name, message);

    callback(error);
  }
};

/**
 * If a sourcemap is provided than register it to the file.
 *
 * @function trace
 *
 * @param {Object} it - Sourcemap.
 */
var trace = function (it, file) {
  return exists(it) && sourcemap(file, it)
};

var onwarn = function (it) {
  gulpUtil.log(it);
};

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
var select = function (parameters) {
  return function (it) {
    var object;

    object = {};

    parameters.forEach(forEach);

    return object

    function forEach (key) {
      if (it.hasOwnProperty(key)) {
        object[key] = it[key];
      }
    }
  }
};

/**
 * Get configuration with optionals+defualts for rollup.rollup({options}) method.
 *
 * @function getRollupConfiguration
 *
 * @param {File} it - The Vinyl file configuring for.
 *
 * @returns {Object} Configuration for use with rollup.
 */
var getRollupConfiguration = function (it, cacheObject, options) {
  var defaults;
  var possible;
  var entry;
  var cache;
  var plugins;
  var object;

  entry = {
    path: it.path,
    contents: it.contents
  };

  cache = cacheObject[it.path];

  plugins = [memory(), resolve(), commonjs({ sourceMap: false })];

  defaults = {
    entry,
    cache,
    onwarn,
    plugins
  };

  possible = select([
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
  ]);

  assign();
  repair();

  return possible(object)

  function assign () {
    object = Object.assign(defaults, options);
  }

  function repair () {
    repairEntry();
    repairPlugins();
  }

  function repairEntry () {
    object.entry = entry;
  }

  function repairPlugins () {
    object.plugins = plugins.concat(options.plugins || []);
  }
};

/**
 * Get configuration with optionals and defaults.
 *
 * @function getGenerateConfiguration
 *
 * @param {File} it - The Vinyl file configuring for.
 *
 * @returns {Object} Configuration for use with bundle.generate({options}).
 */
var getGenerateConfiguration = function (it, options) {
  var defaults;
  var possible;
  var format;

  format = 'cjs';

  // defaults that deviate from stock rollup
  defaults = {
    format
  };

  // list of possible properties
  possible = select([
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
  ]);

  return Object.assign(defaults, possible(options))
};

var index = function (options) {
  var cache;

  cache = {};

  return through.obj(obj)

  function obj (file, encoding, callback) {
    var configuration;

    configuration = {};

    configuration.rollup = getRollupConfiguration(file, cache, options);
    configuration.generate = getGenerateConfiguration(file, options);

    rollup.rollup(configuration.rollup).then(compile).catch(error(callback));

    function compile (bundle) {
      var result;

      result = bundle.generate(configuration.generate);
      cache[file.path] = bundle;

      trace(result.map, file);
      debuffer(result);

      validate() && success();
    }

    function debuffer (it) {
      file.contents = Buffer.from(it.code);
    }

    function success () {
      callback(null, file);
    }

    function validate (it) {
      return string(file.contents)
    }
  }
};

module.exports = index;
