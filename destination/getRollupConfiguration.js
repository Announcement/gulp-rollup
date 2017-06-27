'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var memory = _interopDefault(require('rollup-plugin-memory'));
var resolve = _interopDefault(require('rollup-plugin-node-resolve'));
var commonjs = _interopDefault(require('rollup-plugin-commonjs'));
var gulpUtil = require('gulp-util');

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

module.exports = getRollupConfiguration;

//# sourceMappingURL=getRollupConfiguration.js.map
