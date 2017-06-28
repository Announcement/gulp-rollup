'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sourcemap = _interopDefault(require('vinyl-sourcemaps-apply'));

var exists = function (it) {
// module.exports = function (it) {
  return it !== undefined && it !== null
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

module.exports = trace;
