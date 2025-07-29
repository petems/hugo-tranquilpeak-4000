const {nanoid} = require('nanoid');

module.exports = function(grunt) {
  var token = nanoid(60).toLocaleLowerCase().replace(/[_-]+/g, '');
  
  grunt.config.set('cssmin', {
    options: {
      // Global options for all targets
      level: 2, // Use level 2 optimizations for better compression
      sourceMap: true,
      compatibility: 'ie9',
      advanced: true,
      aggressiveMerging: false, // Safer merging to avoid breaking styles
      rebase: false, // Don't rebase URLs
      specialComments: 0 // Remove all comments
    },
    // Minify `style.css` file into `style.min.css`
    prod: {
      files: [{
        expand: true,
        cwd: 'static/css',
        src: ['style.css'],
        dest: 'static/css',
        ext: '-' + token + '.min.css'
      }]
    },
    // Minify critical CSS separately for faster loading
    critical: {
      options: {
        level: 2,
        sourceMap: false, // Critical CSS doesn't need source maps
        inline: ['local']
      },
      files: [{
        expand: true,
        cwd: 'static/css',
        src: ['critical.css'],
        dest: 'static/css',
        ext: '-' + nanoid(60).toLocaleLowerCase().replace(/[_-]+/g, '') + '.min.css'
      }]
    },
    // Minify deferred CSS
    deferred: {
      files: [{
        expand: true,
        cwd: 'static/css',
        src: ['deferred.css'],
        dest: 'static/css',
        ext: '-' + nanoid(60).toLocaleLowerCase().replace(/[_-]+/g, '') + '.min.css'
      }]
    },
    // Development build with less aggressive optimization
    dev: {
      options: {
        level: 1,
        sourceMap: true,
        specialComments: 1, // Keep some comments in development
        advanced: false
      },
      files: [{
        expand: true,
        cwd: 'static/css',
        src: ['*.css', '!*.min.css'],
        dest: 'static/css',
        ext: '.min.css'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
};
