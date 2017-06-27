const memory = require('rollup-plugin-memory')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

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
    memory(),
    resolve(),
    commonjs({sourceMap: false})
  ]

  defaults = {
    entry,
    cache,
    onwarn,
    plugins
  }

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
  ])

  assign()
  repair()

  return possible(object)

  function assign () {
    object = Object.assign(defaults, options)
  }

  function repair () {
    repairEntry()
    repairPlugins()
  }

  function repairEntry () {
    object.entry = entry
  }

  function repairPlugins () {
    object.plugins = plugins.concat(options.plugins || [])
  }
}
