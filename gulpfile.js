var gulp = require('gulp')
var chalk = require('chalk')
var watch = require('gulp-watch')
var sourcemaps = require('gulp-sourcemaps')
var rollup = require('./bootstrap/index.js')

let source = {
  rollup: 'source/**.js'
}
let destination = {
  rollup: 'destination',
  sourcemap: '.'
}
let configuration = {
  rollup: {
    interop: false,
    external: [
      'gulp-util',
      'through2',
      'vinyl-sourcemaps-apply',
      'rollup',
      'rollup-plugin-memory',
      'rollup-plugin-node-resolve',
      'rollup-plugin-commonjs'
    ]
  }
}

gulp.task('rollup', () =>
  gulp.src(source.rollup)
    .pipe(sourcemaps.init())
    .pipe(rollup(configuration.rollup))
    .pipe(sourcemaps.write(destination.sourcemap))
    .pipe(gulp.dest(destination.rollup))
)
gulp.task('rollup:watch', () => {
  watch(source.rollup)
    .pipe(sourcemaps.init())
    .pipe(rollup(configuration.rollup))
    .pipe(sourcemaps.write(destination.sourcemap))
    .pipe(gulp.dest(destination.rollup))
})

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason.plugin, chalk.gray('>'), reason.message)
})
