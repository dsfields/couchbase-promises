const gulp = require('gulp');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const jsvalidate = require('gulp-jsvalidate')
const mocha = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['./**/*.js', '!./node_modules/**', '!./coverage/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('test', function() {
  return gulp.src('./tests/unit/**/*.js')
    .pipe(mocha({ reporter: 'spec' }))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

gulp.task('jsvalidate', function() {
  return gulp.src(['./**/*.js', '!./node_modules/**', '!./coverage/**'])
    .pipe(jsvalidate());
});

gulp.task('default', ['test']);
