const {nanoid} = require('nanoid');

module.exports = function(grunt) {
  var website = {};
  var token = nanoid(60).toLocaleLowerCase().replace(/[_-]+/g, '');
  website['static/js/script-' + token + '.min.js'] = ['static/js/script.js'];
  
  // Core JavaScript bundle
  var coreToken = nanoid(60).toLocaleLowerCase().replace(/[_-]+/g, '');
  website['static/js/core-' + coreToken + '.min.js'] = ['static/js/core.js'];
  
  // Features JavaScript bundle  
  var featuresToken = nanoid(60).toLocaleLowerCase().replace(/[_-]+/g, '');
  website['static/js/features-' + featuresToken + '.min.js'] = ['static/js/features.js'];
  
  grunt.config.set('uglify', {
    options: {
      // Global options for all targets
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        unsafe: false,
        unsafe_comps: false,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        reserved: [
          'jQuery',
          'fancybox',
          '$'
        ]
      },
      sourceMap: {
        filename: function(dest) {
          return dest.replace('.min.js', '.min.js.map');
        }
      },
      output: {
        comments: false
      }
    },
    // Minify `script.js` file into `script.min.js`
    prod: {
      files: website
    },
    // Development build with less aggressive optimization
    dev: {
      options: {
        compress: {
          drop_console: false,
          drop_debugger: false
        },
        mangle: false,
        beautify: true
      },
      files: {
        'static/js/script.min.js': ['static/js/script.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
