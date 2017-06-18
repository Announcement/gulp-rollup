# gulp-rollup

A gulp rollup extension good enough for me.

## usage

This is a complete `gulpfile.js` which can be invoked with `gulp rollup`

~~~ javascript
import gulp from 'gulp'
import rollup from 'gulp-rollup'

let source = 'source/**/*.js'
let destination = 'destination'
let configuration = { rollup: {}, babel: {} }

gulp.task('rollup', () =>
  gulp.src(source)
    .pipe(sourcemaps.init())
    .pipe(rollup(configuration.rollup))
    .pipe(babel(configuration.babel))
    .pipe(sourcemaps.write(destination.sourcemap))
    .pipe(gulp.dest(destination))
)
~~~

## limitations

- no input source-maps
- input is not tested
