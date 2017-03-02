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
		app			: "../source/app",
		sass			: "../source/scss",
		vendor			: "../source/vendor",

		output			: "../www"
	},
	production_build = false;

// angular 
proj.angular		= proj.vendor + "/angular";
proj.angular_ui		= proj.vendor + "/angular-ui";
proj.angular_output 	= proj.output + "/js";

//ionic framework
proj.ionic_sass		= proj.sass 	+ "/ionic-framework/scss";
proj.ionic_sass_output	= proj.output 	+ "/css";
proj.ionic_fonts	= proj.sass 	+ "/ionic-framework/fonts";
proj.ionic_js		= proj.vendor 	+ "/ionic";
proj.ionic_js_output	= proj.output 	+ "/js";

//priscilla framework
proj.priscilla_fonts	= proj.sass 	+ "/priscilla-framework/fonts";

//priscilla app
proj.priscilla_sass		= proj.sass 	+ "/priscilla-framework/";
proj.priscilla_sass_output	= proj.output 	+ "/css";

// project output
proj.fonts_output	= proj.output 	+ "/fonts";
proj.app_output		= proj.output 	+ "/app";
proj.app_temp_output	= proj.output 	+ "/page";

// =============================================================================== TASKS

gulp.task("clear_fonts", [], function() {
	return del([ 
		proj.fonts_output + "/**", 
		"!" + proj.fonts_output + "/fonts/" 
	], { force: true } );
});
	
gulp.task("copy_priscilla_templates", [], function() {
	gulp.src( proj.app + "/templates/**/*" )
		.pipe( gulp.dest( proj.app_temp_output ) );
		
	gulp.src( proj.app + "/templates/**/*.htm" )
		.pipe( gulp.dest( proj.app_temp_output ) )
		.pipe( debug() );
});
	
gulp.task("copy_ionic_fonts", [], function() {
	gulp.src( proj.ionic_fonts + "/**/*.*" )
		.pipe( gulp.dest( proj.ionic_fonts_output ) )
		.pipe( debug() );
});

gulp.task('copy_priscilla_fonts', [], function() {
	gulp.src( proj.priscilla_fonts + "/**.*" )
		.pipe( gulp.dest( proj.priscilla_fonts_output ) )
		.pipe( debug() );
});

gulp.task('ionic_sass', [], function() {
	var options = {
		outputStyle	: 'compressed',
		verbose 	: true
	}

	gulp.src( proj.ionic_sass + "/ionic.scss" )
		.pipe( bulkSass() )
		// .pipe( sourcemaps.init() )
		.pipe( sass( options ).on('error', sass.logError) )
		.pipe( cleanCSS() )
		// .pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.ionic_sass_output ));


	gulp.src( proj.ionic_sass + "/ionic-harris.scss" )
		.pipe( bulkSass() )
		.pipe( sourcemaps.init() )
		.pipe( sass( options ).on('error', sass.logError) )
		.pipe( cleanCSS() )
		.pipe( sourcemaps.write('./') )
		.pipe( gulp.dest( proj.ionic_sass_output ));


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
