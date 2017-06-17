var through = require('through2')
var rollup = require('rollup')
var memory = require('rollup-plugin-memory')
var sourcemap = require('vinyl-sourcemaps-apply')
var util = require('gulp-util')

module.exports = function () {
  var cache

  cache = {}

  return through.obj(function (file, encoding, callback) {
    var plugins
    var options
    var configuration
    var entry

    plugins = [memory()]

    entry = {
      path: file.path,
      contents: file.contents
    }

    options = {
      entry,
      cache: cache[file.path],
      sourceMap: file.sourceMap,
      onwarn,
      // external,
      plugins
    }

    configuration = {
      format: 'cjs'
    }

    rollup.rollup(options).then(compile).catch(error)

    function onwarn (it) {
      // util.log(it)
    }

    function error (it) {
      var error

      error = new util.PluginError('rollup-stream', it.message)

      callback(error)
    }

    function compile (bundle) {
      var result

      result = bundle.generate(configuration)
      cache[file.path] = bundle

      if (result.map !== null && result.map !== undefined) {
        sourcemap(file, result.map)
      }

      file.contents = Buffer.from(result.code)

      callback(null, file)
    }
  })
}
