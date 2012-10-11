/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    requirejs: {
      js: {
        mainConfigFile: "js-src/config.js",
        name: "app",
        out: "js/app.build.js"
      },
      css: {
        cssIn: "css-src/style.css",
        out: "css/style.build.css",
        optimizeCss: "standard"
      }
    },

    watch: {
      files: ["css-src/**/*.css", "js-src/**/*.js"],
      tasks: "requirejs:js requirejs:css"
    }
  });

  grunt.loadNpmTasks("grunt-requirejs");

  grunt.registerTask("default", "requirejs:js requirejs:css");
};