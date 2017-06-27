import through from 'through2'
import rollup from 'rollup'

import * as valid from './valid'

import error from './error'
import trace from './trace'
import getRollupConfiguration from './getRollupConfiguration'
import getGenerateConfiguration from './getGenerateConfiguration'

export default function (options) {
  var cache

  cache = {}

  return through.obj(obj)

  function obj (file, encoding, callback) {
    var configuration

    configuration = {}

    configuration.rollup = getRollupConfiguration(file, cache, options)
    configuration.generate = getGenerateConfiguration(file, options)

    rollup.rollup(configuration.rollup).then(compile).catch(error(callback))

    function compile (bundle) {
      var result

      result = bundle.generate(configuration.generate)
      cache[file.path] = bundle

      trace(result.map, file)
      debuffer(result)

      validate() && success()
    }

    function debuffer (it) {
      file.contents = Buffer.from(it.code)
    }

    function success () {
      callback(null, file)
    }

    function validate (it) {
      return valid.string(file.contents)
    }
  }
}
