'use strict';

var gulpUtil = require('gulp-util');

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

module.exports = error;

//# sourceMappingURL=error.js.map
