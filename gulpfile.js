var gulp = require('gulp');
var install = require("gulp-install");
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['start', 'watch']);

gulp.task('install', function() {
    gulp.src(['./public/bower.json', './package.json'])
        .pipe(install());

});

gulp.task('copyJs', function() {
    // copy any html files in source/ to public/
    gulp.src('./public/shared/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('generated.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/desktop/js/'))
        .pipe(gulp.dest('./public/mobile/www/js/'))


});

gulp.task('watch', function() {
    gulp.watch('./public/shared/js/**/*.js', ['copyJs']);
});

gulp.task('start', function() {
    nodemon({
        script: 'server.js'
    })
})
