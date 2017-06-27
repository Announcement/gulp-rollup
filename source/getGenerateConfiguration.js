import select from './select'

/**
 * Get configuration with optionals and defaults.
 *
 * @function getGenerateConfiguration
 *
 * @param {File} it - The Vinyl file configuring for.
 *
 * @returns {Object} Configuration for use with bundle.generate({options}).
 */
export default function (it, options) {
  var defaults
  var possible
  var format

  format = 'cjs'

  // defaults that deviate from stock rollup
  defaults = {
    format
  }

  // list of possible properties
  possible = select([
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
  ])

  return Object.assign(defaults, possible(options))
}
