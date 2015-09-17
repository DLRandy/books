var path = require('path'),
	gulp = require('gulp'),
	less = require('gulp-less'),
	rename = require('gulp-rename'),
	minifyCSS = require('gulp-minify-css'),
	browserify = require('gulp-browserify'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util');

var onError = function (err) {
	gutil.beep();
	console.log(err);
};

gulp.task('css', function () {
	gulp.src('./frontend/less/styles.less')
	.pipe(less({
		paths: [path.join(__dirname, 'frontend/less', 'includes')]
	}))
	.pipe(gulp.dest('./static/css'))
	.pipe(minifyCSS({keepBreak: true}))
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./static/css'));
});

gulp.task('watchers', function () {
	gulp.watch('frontend/less/**/*.less',['css']);
	gulp.watch('frontend/js/**/*.js', ['js']);
	gulp.watch('frontend/tpl/**/*.html',['html','js'])
});

gulp.task('js', function () {
	gulp.src(['./frontend/js/app.js'])
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(browserify())
	.pipe(gulp.dest('./static/js'))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./static/js'))
});

var Ractive = require('ractive'),
	tap = require('gulp-tap');
gulp.task('templates', function () {
	gulp.src('./frontend/tpl/**/*.html')
	.pipe(tap(function (file, t) {
		var precompiled = Ractive.parse(file.contents.toString());
		precompiled = JSON.stringify(precompiled);
		file.contents = new Buffer('module.exports=' + precompiled);
	}))
	.pipe(rename(function (path) {
		path.extname = '.js';
	}))
	.pipe(gulp.dest('./frontend/tpl'))
});

gulp.task('default',['css','templates','js','watchers']);
























