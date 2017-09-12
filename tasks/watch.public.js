'use strict';

// -------------------------------------
//   Task: Watch: Public
// -------------------------------------

module.exports = function(gulp) {
  return function() {
    gulp.watch(['public/styles/**/*.scss', 'public/*.scss', 'public/elements/**/*.scss', 'public/elements/*.scss'], ['compile:sass']);
    gulp.watch(['./public/index.html'],
    ['compile:index']);
  };
};
