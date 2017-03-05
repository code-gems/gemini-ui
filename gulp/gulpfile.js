// =============================================================================== DEPENDENCY

var gulp 		= require('gulp'),
	dest 		= require('gulp-dest'),
	debug 		= require('gulp-debug'),
	rename 		= require('gulp-rename'),
	del 		= require('del'),
	sass 		= require('gulp-sass'),
	sourcemaps 	= require('gulp-sourcemaps'),
	bulkSass 	= require('gulp-sass-bulk-import'),
	cleanCSS 	= require('gulp-clean-css'),
	concat 		= require('gulp-concat'),
	minify 		= require('gulp-minify'),
	uglify 		= require("gulp-uglify"),
	gutil 		= require('gulp-util'),
	vinylPaths 	= require('vinyl-paths');

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

gulp.task('priscilla_sass', [], function() {
	var options = {
		outputStyle	: 'compressed',
		verbose 	: true
	}

	gulp.src( proj.priscilla_sass + "/styles.scss" )
		.pipe( bulkSass() )
		.pipe( sourcemaps.init() )
		.pipe( sass( options ).on('error', sass.logError) )
		.pipe( cleanCSS() )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.priscilla_sass_output ));
});

gulp.task('harris_theme_sass', [], function() {
	var options = {
		outputStyle	: 'compressed',
		verbose 	: true
	}

	gulp.src( proj.priscilla_sass + "/styles-harris.scss" )
		.pipe( bulkSass() )
		.pipe( sourcemaps.init() )
		.pipe( sass().on('error', sass.logError) )
		.pipe( cleanCSS() )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.priscilla_sass_output ));
});

gulp.task('concat_angular', [], function() {
	gulp.src([
				  proj.angular + "/angular.js",
				  proj.angular + "/*.js",
				  proj.angular_ui + "/*.js",
			"!" + proj.angular + "/*.min.js",
			"!" + proj.angular_ui + "/*.min.js"
		])
		.pipe( debug() )
		.pipe( concat({ path: 'angular.bundle.js' }) )
		.pipe( gulp.dest( proj.angular_output ) );
});

gulp.task('concat_ionic', [], function() {
	gulp.src([
				  proj.ionic_js + "/ionic.js",
				  proj.ionic_js + "/ionic-angular.js",
				  proj.ionic_js + "/*.js",
			"!" + proj.ionic_js + "/*.min.js"
		])
		.pipe( debug() )
		.pipe( concat({ path: 'ionic.bundle.js' }) )
		.pipe( gulp.dest( proj.ionic_js_output ) );
});

gulp.task('concat_app', [], function() {
	gulp.src([
				  proj.app + "/core/app.js",
				  proj.app + "/core/config.js",
				  
				  proj.app + "/controllers/**/*.js",
				  proj.app + "/directives/*.js",
				  proj.app + "/filters/*.js",
				  proj.app + "/services/*.js"
		])
		.pipe( debug() )
		.pipe( concat({ path: 'priscilla-app.js' }) )
		.pipe( gulp.dest( proj.app_output ) );
});


gulp.task('default', function() {
	gulp.src([
			proj.priscilla_sass + "/**/*.scss"
		])
		.pipe( debug() );
	
	// watch for changes inside font directory in Ionic & Priscilla framework
	gulp.watch([
			proj.ionic_fonts + "/**/*.*",
			proj.priscilla_fonts + "/**/*.*"
		], ["clear_fonts", "copy_ionic_fonts", "copy_priscilla_fonts"]);

	// watch angular js files and modules
	gulp.watch([
				  proj.angular + "/*.js",
			"!" + proj.angular + "/*.min.js",
				  proj.angular_ui + "/*.js",
			"!" + proj.angular_ui + "/*.min.js"
		], ["concat_angular"]);

	// watch ionic js files
	gulp.watch([
				  proj.ionic_js + "/*.js",
			"!" + proj.ionic_js + "/*.min.js"
		], ["concat_ionic"]);

	
	// watch priscilla app files
	gulp.watch([
			proj.app + "/core/*.js",
			proj.app + "/controllers/**/*.js",
			proj.app + "/directives/*.js",
			proj.app + "/filters/*.js",
			proj.app + "/services/*.js"
		], ["concat_app"]);

	// watch priscilla app templates
	gulp.watch([
			proj.app + "/templates/**/*.htm"
		], ["copy_priscilla_templates"]);


	// watch ionic sass files
	gulp.watch([
			proj.ionic_sass + "/**/*.scss"
		], ["ionic_sass"]);

	// watch priscilla sass files
	gulp.watch([
			proj.priscilla_sass + "/**/*.scss"
		], ["priscilla_sass", "harris_theme_sass"]
	);

});
