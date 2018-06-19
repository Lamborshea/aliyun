module.exports = function(grunt) {
  "use strict";
  var sassStyle = 'expanded';
  var scriptsGlob = 'src/script/*.js';
  var styleGlob = 'src/style/*.scss';
  var imageGlob = 'src/image/*.{png,jpg,gif,ico}'
  var scriptDist = "dist/js";
  var styleDist = "dist/css";
  var imageDist = "dist/img"；

  grunt.initConfig({
    uglify: {
      options: {
        banner: "/*! This is uglify test - <%= grunt.template.today("yyyy-mm-dd") %> */",
        beautify: true, // 是否压缩
        mangle: false,  // 不混淆变量名
        compress: true  // 打开使用默认选项源压缩
      }
    },

    sass: {
      output : {
        options: {
          style: sassStyle
        },
        files: {
          styleDist: styleGlob
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ["uglify", "sass"]);
}
