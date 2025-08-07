const {nanoid} = require('nanoid');

module.exports = function(grunt) {
  var website = {};
  var token = nanoid(60).toLocaleLowerCase().replace(/[_-]+/g, '');
  website['static/js/app-' + token + '.min.js'] = ['static/js/app.js'];
  grunt.config.set('uglify', {
    // Minify `app.js` file into `app.min.js`
    prod: {
      options: {
        mangle: false
      },
      files: website
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
