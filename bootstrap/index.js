var through = require('through2')
var rollup = require('rollup')

var error = require('./error')
var trace = require('./trace')
var valid = require('./valid')
var getRollupConfiguration = require('./getRollupConfiguration')
var getGenerateConfiguration = require('./getGenerateConfiguration')

module.exports = function (options) {
  var cache

  cache = {}

  return through.obj(obj)

  function obj (file, encoding, callback) {
    var configuration

    configuration = {}

    configuration.rollup = getRollupConfiguration(file, cache, options)
    configuration.generate = getGenerateConfiguration(file, options)

    rollup
      .rollup(configuration.rollup)
      .then(compile)
      .catch(error(callback))

    function compile (bundle) {
      var result

      result = bundle.generate(configuration.generate)
      cache[file.path] = bundle

      trace(result.map, file)
      debuffer(result)

      return complete()
    }

    function debuffer (it) {
      file.contents = Buffer.from(it.code)
    }

    function complete () {
      return validate() ? success() : failure()
    }

    function success () {
      callback(null, file)
    }

    function failure () {
    }

    function validate () {
      return valid.string(file.contents)
    }
  }
}
