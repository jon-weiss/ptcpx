'use strict';
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
gulp.task('serve', function () {
    browserSync.init({
        port: 8080,
        notify: false,
        reloadOnRestart: true,
        //logPrefix: `${pkg.name}`,
        https: false,
        files: ['*.*'],
        server: ['./'],
    });

});
gulp.task('watch', function () {
    gulp.watch(['*.html', 'css/*.css']).on('change', browserSync.reload);
});
gulp.task('default', ['serve', 'watch']);
