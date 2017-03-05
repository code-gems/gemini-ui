// =============================================================================== DEPENDENCY

var gulp 			= require('gulp'),
	dest 			= require('gulp-dest'),
	debug 			= require('gulp-debug'),
	del 			= require('del'),
	sass 			= require('gulp-sass'),
	sourcemaps 		= require('gulp-sourcemaps'),
	bulkSass 		= require('gulp-sass-bulk-import'),
	cleanCSS 		= require('gulp-clean-css'),
	concat 			= require('gulp-concat'),
	minify 			= require('gulp-minify'),
	uglify 			= require("gulp-uglify"),
	rename 			= require('gulp-rename'),
	gutil 			= require('gulp-util'),
	vinylPaths 		= require('vinyl-paths');

// =============================================================================== PROJECT STRUCTURE

var proj = {
		root			: "..",

		js_in			: "../src/js",
		js_out			: "../www/js",

		sass_in			: "../src/scss",
		sass_out		: "../www/css",

		fonts_in		: "../src/fonts",
		fonts_out		: "../www/fonts"
	},
	production_build 	= false;

// =============================================================================== TASKS

gulp.task("clear_fonts", [], function() {
	return del([
		proj.fonts_out + "/**",
		"!" + proj.fonts_out + "/fonts/"
	], { force: true } );
});

gulp.task('copy_fonts', [], function() {
	gulp.src( proj.fonts_in + "/**.*" )
		.pipe( gulp.dest( proj.fonts_out ) )
		.pipe( debug() );
});

gulp.task('sass', [], function() {
	var options = {
		outputStyle	: 'compressed',
		verbose 	: true
	}

	gulp.src( proj.sass_in + "/style.scss" )
		.pipe( bulkSass() )
		.pipe( sourcemaps.init() )
		.pipe( sass( options ).on('error', sass.logError) )
		.pipe( cleanCSS() )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.sass_out ));
});

gulp.task('default', function() {
	gulp.src([
			proj.sass_in + "/**/*.scss"
		])
		.pipe( debug() );

	// watch fonts
	gulp.watch([
			proj.fonts_in + "/**/*.*"
		], ["clear_fonts", "copy_fonts"]);

	// watch sass
	gulp.watch([
			proj.sass_in + "/**/*.scss"
		], ["sass"]);

});
