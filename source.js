import through from 'through2'
import rollup from 'rollup'
import memory from 'rollup-plugin-memory'
import sourcemap from 'vinyl-sourcemaps-apply'
import util from 'gulp-util'

export default function () {
  var cache

  cache = {}

  return through.obj(transform)

  function transform (file, encoding, callback) {
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
      plugins
    }

    configuration = {
      format: 'cjs'
    }

    rollup.rollup(options).then(compile).catch(error)

    function onwarn (it) {}

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
  }
}
