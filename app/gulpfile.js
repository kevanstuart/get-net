/**
 * File: gulpfile.js
 * Author: Kevan Stuart (kevan.jedi@gmail.com)
 *
 * Build process for minifying and concatenating
 * Javascript and CSS files
 */


/**
 * Require
 */
var gulp    = require('gulp'),
    utils   = require('gulp-util')
    uglify  = require('gulp-uglify'),
    rename  = require('gulp-rename'),
    concat  = require('gulp-concat'),
    notify  = require('gulp-notify'),
    cssnano = require('gulp-cssnano');


/**
 * Specify files to minify / uglify
 */
let files = {
    minify   : ['./public/css/rangeslider.css', './public/css/rangeslider-skin.css'],
    uglify   : ['./public/js/wi_custom.js'],
    concatjs : ['./public/js/jquery-1.12.3.min.js', './public/js/rangeslider.min.js', 
                './public/js/wi_custom.min.js'],
    concatcss: ['./public/css/bootstrap.min.css', './public/css/bootstrap-reboot.min.css', 
                 './public/css/rangeslider.min.css', './public/css/rangeslider-skin.min.css']
};

/**
 * Minify CSS
 */
gulp.task('css-minify', function() 
{
    
    return gulp.src(specificFiles.minify)
        .pipe( rename({ suffix: '.min' }) )
        .pipe( gulp.dest('./public/css') )
        .pipe( cssnano() )
        .pipe( gulp.dest('./public/css') );

});


/**
 * Uglify Javascript
 */
gulp.task('js-uglify', function() 
{

    return gulp.src(files.uglify)
        .pipe( rename({ suffix: '.min' }) )
        .pipe( uglify() )
        .pipe( gulp.dest('./public/js') );

});


/**
 * Concatenate CSS
 */
gulp.task('css-concat', function()
{

    return gulp.src(files.concatcss)
        .pipe( concat('wi_main.min.css') )
        .pipe( gulp.dest('./public/css') );

});


/**
 * Concatenate JS
 */
gulp.task('js-concat', function()
{

    return gulp.src(files.concatjs)
        .pipe( concat('wi_main.min.js') )
        .pipe( gulp.dest('./public/js') );

});


/**
 * Default task
 */
gulp.task('default', function() 
{
    gulp.start('js-uglify', 'css-concat', 'js-concat');
});

//.on('error', function (err) { utils.log(utils.colors.red('[Error]'), err.toString()); })
