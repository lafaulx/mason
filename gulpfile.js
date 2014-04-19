var gulp = require('gulp'),
	uglify = require('gulp-uglify');

var paths = {
	scripts: 'src/mason.js'
};

gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
    			.pipe(uglify())
    			.pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts']);