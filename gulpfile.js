var gulp = require("gulp"),
	concat = require("gulp-concat"),
	filter = require("gulp-filter"),
	mainBowerFiles = require("main-bower-files");

// execute both js and css tasks
gulp.task("build", ["combine-js", "combine-css"]);

// just combine all third party javascript files
gulp.task("combine-js", function () {

	return gulp.src("public/app/**/*.js")
		.pipe(concat("application.js"))
		.pipe(gulp.dest("public/app"));

});

// just combine all third party css
gulp.task("combine-css", function () {

	return gulp.src("bower_components/**/*.css")
		.pipe(concat("vendors.css"))
		.pipe(gulp.dest("public/app"));
		
});