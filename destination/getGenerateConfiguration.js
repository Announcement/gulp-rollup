'use strict';

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

module.exports = getGenerateConfiguration;
