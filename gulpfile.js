var gulp = require('gulp');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');
var jsvalidate = require('gulp-jsvalidate')
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['./**/*.js', '!./node_modules/**', '!./coverage/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('test', function() {
  return gulp.src('tests/unit/**/*.js')
    .pipe(mocha({ reporter: 'spec' }))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

gulp.task('jsvalidate', function() {
  return gulp.src('**/*.js')
    .pipe(jsvalidate());
});

gulp.task('default', ['lint', 'test']);
