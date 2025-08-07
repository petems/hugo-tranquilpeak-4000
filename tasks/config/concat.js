module.exports = function(grunt) {
  grunt.config.set('concat', {
    vendorJs: {
      src: require('../pipeline').vendorJsFiles,
      dest: 'static/js/vendor.js'
    },
    appJs: {
      src: require('../pipeline').tranquilpeakJsFilesToInject,
      dest: 'static/js/app.js',
      options: {
        separator: ';'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};
