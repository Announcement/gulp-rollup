'use strict';

var through = require('through2');
var memory = require('rollup-plugin-memory');
var {rollup} = require('rollup');

var {PluginError} = require('gulp-util');

module.exports = function (options) {
  function gulpRollup (options) {
    var stream;

    stream = through.obj(transformFunction);

    return stream

    function transformFunction (chunk, encoding, callback) {
      var path;
      var contents;
      var entry;
      var plugins;
      var format;
      var configuration;

      configuration = {};

      path = chunk.path;
      contents = chunk.contents;
      format = 'cjs';
      entry = {path, contents};
      plugins = [memory()];

      configuration.rollup = {entry, plugins, onwarn};
      configuration.generate = {format};

      rollup(configuration.rollup)
        .then(then)
        .catch(error);

      function then (bundle) {
        var result;

        result = bundle.generate(configuration.generate);
        chunk.contents = Buffer.from(result.code);

        callback(null, chunk);
      }

      function error (it) {
        var error;

        error = new PluginError({
          plugin: 'gulp-rollup',
          message: it.message
        });

        callback(error);

        console.log('error');
      }
      function onwarn (it) {
        run([
          missingCode,
          unresolvedImport,
          unusedExternalImport,
          nonExistentExport,
          other
        ]);

        function run (it) {
          it.find(it => it());
        }

        function missingCode () {
          return it.code === null || it.code === undefined
        }

        function unresolvedImport () {
          return it.code === 'UNRESOLVED_IMPORT'
        }

        function unusedExternalImport () {
          return it.code === 'UNUSED_EXTERNAL_IMPORT'
        }

        function nonExistentExport () {
          return it.code === 'NON_EXISTENT_EXPORT'
        }

        function other () {
          console.log(it.message);
        }
      }
    }
  }

  return gulpRollup(options)
};
