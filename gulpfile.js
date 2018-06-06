"use strict";
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var postcss = require("gulp-postcss");
var autoprefixer = require("gulp-autoprefixer");

function style() {
  return gulp.src("src/style/index.scss")
              .pipe(postcss())
              .pipe(autoprefixer())
              .pipe(gulp.dest("dist"))
}

gulp.task("style", style);
