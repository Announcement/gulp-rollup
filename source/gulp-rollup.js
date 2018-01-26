const PluginError = require('plugin-error');
const through = require('through2')

const rollup = require('rollup')
const memory = require('rollup-plugin-memory')
const virtual = require('rollup-plugin-virtual')

const PLUGIN_NAME = 'gulp-rollup';

module.exports = gulpRollup;

/**
 * Configure a gulp plugin for usage in the pipeline.
 * 
 * @param {object} options - options to pass to rollup.
 * 
 * @returns {Function} A gulp pipeline-ready plugin.
 */
function gulpRollup (options) {
  // is options even being used, because it doesn't seem like it?
  //
  // rollup-plugin-memory deprecated?
  // rollup-plugin-virtual has no obvious way of simulating this behavior.


  let stream

  stream = through.obj(transformFunction)

  return stream
  /**
   * A stream transformation intended for use with the gulp pipeline.
   * 
   * @param {*} chunk 
   * @param {*} encoding 
   * @param {*} callback 
   * 
   * @returns {Promise} Resolve a bundled chunk, provided by rollup.
   */
  function transformFunction (chunk, encoding, callback) {
    let path
    let contents
    let entry
    let plugins
    let format
    let configuration
  
    configuration = {}
  
    path = chunk.path
    contents = chunk.contents
    format = 'cjs'
  
    entry = {
      path,
      contents
    }
  
    plugins = [
      memory()
    ]
  
    configuration.rollup = {
      entry,
      plugins,
      onwarn
    }
  
    configuration.generate = {
      format
    }
  
    rollup.rollup(configuration.rollup)
      .then(onFulfilled)
      .catch(onRejected)
  
    function onFulfilled(bundle) {
      let result
  
      result = bundle.generate(configuration.generate)
      chunk.contents = Buffer.from(result.code)
  
      callback(null, chunk)
    }
  
    function onRejected(it) {
      let pluginError
  
      let plugin
      let message
  
      plugin = PLUGIN_NAME
      message = it.message || it
  
      pluginError = new PluginError(plugin, message)
  
      callback(pluginError)
    }
  
    function onwarn(it) {
      run([
        missingCode,
        unresolvedImport,
        unusedExternalImport,
        nonExistentExport,
        other
      ])
  
      function run(it) {
        it.find(it => it())
      }
  
      function missingCode() {
        return it.code === null || it.code === undefined
      }
  
      function unresolvedImport() {
        return it.code === 'UNRESOLVED_IMPORT'
      }
  
      function unusedExternalImport() {
        return it.code === 'UNUSED_EXTERNAL_IMPORT'
      }
  
      function nonExistentExport() {
        return it.code === 'NON_EXISTENT_EXPORT'
      }
  
      function other() {
        // rollup is too inconsistent and verbose with it's warnings to even consider this.
        // additionally some things don't even have an option
        // console.log(it.message)
      }
    }
  }
}