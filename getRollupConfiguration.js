const memory = require('rollup-plugin-memory')

const onwarn = require('./onwarn')
const select = require('./select')

/**
 * Get configuration with optionals+defualts for rollup.rollup({options}) method.
 *
 * @function getRollupConfiguration
 *
 * @param {File} it - The Vinyl file configuring for.
 *
 * @returns {Object} Configuration for use with rollup.
 */
module.exports = function (it, cacheObject, options) {
  var defaults
  var possible
  var entry
  var cache
  var plugins
  var object

  entry = {
    path: it.path,
    contents: it.contents
  }

  cache = cacheObject[it.path]

  plugins = [
    memory()
  ]

  defaults = {
    entry,
    cache,
    onwarn,
    plugins
  }

  possible = select(
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
  )

  object = Object.assign(defaults, options)

  console.log(object)
  console.log(possible(object))

  return possible(object)
}
