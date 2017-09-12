var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var plugins = require('gulp-load-plugins')();
var gulpSequence = require('gulp-sequence');

var jsFiles = ['*.js', '*.json', 'server/**/*.js', '!*-state.json'];

// -----------------------------------------------------------------------------
// getTask() loads external gulp task script functions by filename
// -----------------------------------------------------------------------------
function getTask(task) {
	return require('./tasks/' + task)(gulp, plugins);
}

// -----------------------------------------------------------------------------
// Task: Compile : Scripts, Sass, EJS, All
// -----------------------------------------------------------------------------
gulp.task('compile:sass', getTask('compile.sass'));
gulp.task('compile:index', ['compile:sass'], getTask('compile.index'));

// -----------------------------------------------------------------------------
// Task: Serve : Start
// -----------------------------------------------------------------------------
gulp.task('serve:dev:start', getTask('serve.dev.start'));
gulp.task('serve:dist:start', ['dist'], getTask('serve.dist.start'));

// -----------------------------------------------------------------------------
// Task: Watch : Source, Public, All
// -----------------------------------------------------------------------------
gulp.task('watch:public', getTask('watch.public'));

// -----------------------------------------------------------------------------
// Task: Dist (Build app ready for deployment)
// 	clean, compile:sass, compile:index, copy, bundle
// -----------------------------------------------------------------------------
gulp.task('dist', ['dist:copy']);

// -----------------------------------------------------------------------------
// Task: Dist : Copy source files for deploy to dist/
// -----------------------------------------------------------------------------
gulp.task('dist:copy', ['dist:clean', 'compile:index'], getTask('dist.copy'));

// -----------------------------------------------------------------------------
// Task: Dist : Clean 'dist/'' folder
// -----------------------------------------------------------------------------
gulp.task('dist:clean', getTask('dist.clean'));


gulp.task('serve', [], function () {
    var options = {
        script: 'server/app.js',
        delayTime: 1,
        env: {
            'PORT': 5000,
        },
        watch: jsFiles
    };
    return nodemon(options)
        .on('restart', function (ev) {
            console.log('Restarting...');
        });
});

gulp.task('runtime', [], function () {
    var options = {
        script: 'server/runtimeEngine.js',
        delayTime: 1,
        env: {
            'PORT': 6309,
        },
        watch: jsFiles
    };
    return nodemon(options)
        .on('restart', function (ev) {
            console.log('Restarting runtime engine...');
        });
});
