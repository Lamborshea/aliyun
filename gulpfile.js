"use strict";
var gulp = require("gulp");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var postcss = require("gulp-postcss");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var jshint = require("gulp-jshint");
var cache = require("gulp-cache");
var imagemin = require("gulp-imagemin");
var watch = require("gulp-watch")  // 只编译更改过的文件
var livereload = require("gulp-livereload")
var minimist = require("minimist")
var gulpif = require("gulp-if")
var knownOptions = {
  string: "env",
  default: {
    env: process.env.NODE_ENV || 'dev'
  }
}

var scriptsGlob = 'src/script/*.js';
var styleGlob = 'src/style/*.scss';
var imageGlob = 'src/image/*.{png,jpg,gif,ico}'
var scriptDist = "dist/js";
var styleDist = "dist/css"
var imageDist = "dist/img"

var options = minimist(process.argv.slice(2), knownOptions);

// postcss 插件模式
// function style() {
//   return gulp.src("src/style/*.scss")
//     .pipe(sass())
//     .pipe(postcss([autoprefixer()]))
//     .pipe(gulp.dest("dist/style"))
// }

// postcss 配置文件模式 postcss.config.js | .postcssrc.json | .postcssrc.yaml
function style() {
  return gulp.src(styleGlob)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(livereload());
}


// 检查脚本
function lint() {
  return gulp.src(scriptsGlob)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

// 合并，压缩文件
function script() {
  return gulp.src(scriptsGlob)
    .pipe(gulp.dest(scriptDist))
    .pipe(gulpif(options.env === 'production', uglify()))
    .pipe(gulp.dest(scriptDist));
}

function image() {
  return gulp.src(imageGlob)
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({
      message: 'Images task complete'
    }));
}

function clean() {
  return del(["dist/**/*"])
}


// 构建样式文件
gulp.task("style", style);

gulp.task("script", script);

gulp.task('lint', lint);

gulp.task('clean', clean);

// 默认任务
gulp.task('default', function() {
  livereload.listen();
  // 监听文件变化
  var watcher = gulp.watch(scriptsGlob, ['lint', 'script'])
      watcher.on("change", livereload.changed);
  var styleWatcher = gulp.watch(styleGlob, ["style"]);
  styleWatcher.on("change", livereload.changed)
  gulp.watch(imageGlob, ["image"])
});
