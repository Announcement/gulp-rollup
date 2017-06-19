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
module.exports = function (it, cache, options) {
  var defaults
  var possible

  defaults = {
    entry: {
      path: it.path,
      contents: it.contents
    },
    cache: cache[it.path],
    onwarn,
    plugins: [
      memory()
    ]
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

  return Object.assign(defaults, possible(options))
}
