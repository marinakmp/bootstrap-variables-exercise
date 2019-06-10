const { src, dest, watch, series, parallel } = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create();

//File path variables
const files = {
    htmlPath: './**/*.html',
    scssPath: 'assets/scss/**/*.scss',
    cssPath: './dist/**/*.css'
}

//Sass task
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))       
            .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

//Css Prefixers Task
function prefixTask() {
    return src(files.cssPath)
        .pipe(autoprefixer({cascade: false}))
        .pipe(dest('dist'))
}

//Minify CSS
function minifyCSSTask() {
    return src(files.cssPath)
        .pipe(csso())
        .pipe(dest('./dist'))
}

//Cachebusting task
const cbstring = new Date().getTime();
function cacheBustTask() {
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbstring))
        .pipe(dest('.'))
}

//Watch task
function watchTask() {
    browserSync.init({
        server: {
          baseDir: '.'
        }
    })
    watch(files.scssPath, scssTask);
    watch(files.htmlPath).on('change', browserSync.reload);
}

//Default task
exports.build = series(prefixTask, minifyCSSTask, cacheBustTask);
exports.default = series(scssTask, watchTask);