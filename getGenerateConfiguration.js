const select = require('./select')

/**
 * Get configuration with optionals and defaults.
 *
 * @function getGenerateConfiguration
 *
 * @param {File} it - The Vinyl file configuring for.
 *
 * @returns {Object} Configuration for use with bundle.generate({options}).
 */
module.exports = function (it) {
  var defaults
  var possible

  // defaults that deviate from stock rollup
  defaults = {
    format: 'cjs'
  }

  // list of possible properties
  possible = select(
    'format',
    'exports',
    'moduleId',
    'moduleName',
    'globals',
    'indent',
    'banner',
    'footer',
    'sourceMap',
    'sourceMapFile',
    'useStrict'
  )

  return Object.assign(defaults, possible(options))
}
