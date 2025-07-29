const sass = require('sass');

module.exports = function(grunt) {
  grunt.config.set('sass', {
    options: {
      implementation: sass,
      outputStyle: 'expanded', // Use expanded for better post-processing
      precision: 8,
      includePaths: ['assets/scss', 'node_modules']
    },
    // Compile `tranquilpeak.scss` file into `tranquilpeak.css`
    dev: {
      options: {
        sourceMap: true,
        sourceMapEmbed: true,
        outputStyle: 'expanded'
      },
      files: {
        'static/css/tranquilpeak.css': 'assets/scss/tranquilpeak.scss'
      }
    },
    // Production build with optimized output
    prod: {
      options: {
        sourceMap: false,
        outputStyle: 'compressed'
      },
      files: {
        'static/css/tranquilpeak.css': 'assets/scss/tranquilpeak.scss'
      }
    },
    // Compile critical styles separately
    critical: {
      options: {
        sourceMap: false,
        outputStyle: 'compressed'
      },
      files: {
        'static/css/critical.css': 'assets/scss/critical.scss'
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
};
