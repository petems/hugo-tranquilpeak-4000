const {nanoid} = require('nanoid');

module.exports = function(grunt) {
  grunt.config.set('cssmin', {
    // Minify `tranquilpeak.css` file into `style.min.css`
    prod: {
      files: [{
        expand: true,
        cwd: 'static/css',
        src: ['tranquilpeak.css'],
        dest: 'static/css',
        ext: '-' + nanoid(60).toLocaleLowerCase().replace(/[_-]+/g, '') + '.min.css'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
