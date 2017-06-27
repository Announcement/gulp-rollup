import sourcemap from 'vinyl-sourcemaps-apply'
import exists from './exists'

/**
 * If a sourcemap is provided than register it to the file.
 *
 * @function trace
 *
 * @param {Object} it - Sourcemap.
 */
export default function (it, file) {
  return exists(it) && sourcemap(file, it)
}
