var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var template = require('gulp-template');
var fs = require('fs');

gulp.task('sass', function() {
  return gulp
    .src('scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
});

gulp.task('templates', ['sass'], function () {
  var templates = {};
  var files = fs.readdirSync('./pages/partials')
    .filter(function(file) {
      // return filename
      if (file.charAt(0) === '_') {
        return file;
      }

    })
    // add them to the templates object
    .forEach(function(template) {
      var slug = template.replace('_', '').replace('.html', '');
      templates[slug] = fs.readFileSync("./pages/partials/" + template, "utf8");
    });

  return gulp
    .src(['./pages/*.html'])
    .pipe(template(templates)).on('error', function (err) {
      console.error('Error:', err.message);
    })
    .pipe(gulp.dest('./app'));
});

gulp.task('serve', ['templates'], function() {
  browserSync.init({
    server: './app',
    index: 'home.html'
  });

  gulp.watch('scss/*.scss', ['sass']);
  gulp.watch('pages/**/*.html', ['templates']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
