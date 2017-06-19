# gulp-rollup

A gulp rollup extension good enough for me.

## usage

Install this plugin with `npm i -D Announcement/gulp-rollup`

This is a complete `gulpfile.js` which can be invoked with `gulp rollup`

~~~ javascript
// var gulp = require('gulp')
// var rollup = require('gulp-rollup')

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

- no input [source-map](https://github.com/mozilla/source-map)
- input is not tested
- code is *completely* **untested** in general

## notes

- only *valid* rollup options at the time of writing will be passed.
- defaults deviate from the main [rollup](https://github.com/rollup/rollup) module slightly.
- sourcemaps out are supported, sourcemaps in are not.
- included files probably won't bump on watch.
- entry **will** be over written, and there is nothing you can do about it
- memory plugin can not be removed.

## deviations from rollup

### rollup.rollup()

- **entry** comes from vinyl
- **cache** is set to a local cache object inside the function per filename
- **onwarn** is set to an empty function

### rollup plugins being used

- [memory](https://github.com/TrySound/rollup-plugin-memory)

### bundle.generate()

- **format** is now `umd`

## disclaimer

-  this module's code might be a bit *over* formatted and verbose
-  few things aren't **D.R.Y.** (the generators particularly)
-  but over all the code should very *readable* and _relatively easy_ to maintain

## changelog

> ###  v3.2.0
>
> - internal select function now takes an array instead of a splat.
> - **entry** is now forced
> - **memory** is now forced
