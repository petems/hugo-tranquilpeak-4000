module.exports = function(grunt) {
  var pipeline = require('../pipeline');
  var util = require('util');
  grunt.config.set('sails-linker', {
    devJs: {
      options: {
        startTag: '<!--SCRIPTS-->',
        endTag: '<!--SCRIPTS END-->',
        fileRef: function(filepath) {
          var tmpl = '<script src="{{ "%s" | absURL }}"></script>';
          return util.format(tmpl, filepath.substring(filepath.indexOf('/')));
        },
        appRoot: 'src/'
      },
      files: {
        'layouts/partials/script.html': require('../pipeline').tranquilpeakJsFilesToInject
      }
    },
    devCss: {
      options: {
        startTag: '<!--STYLES-->',
        endTag: '<!--STYLES END-->',
        fileRef: function(filepath) {
          var cssTmpl = '<link rel="stylesheet" href="{{ "%s" | absURL }}" />';
          var preloadTmpl = '<link rel="preload" href="{{ "%s" | absURL }}" as="style" />';
          var path = filepath.substring(filepath.indexOf('/') + 1);
          return util.format(preloadTmpl, path) + '\n' + util.format(cssTmpl, path);
        },
        appRoot: 'src/'
      },
      files: {
        'layouts/partials/head.html': pipeline.tranquilpeakCssFilesToInject
      }
    },
    prodVendorJs: {
      options: {
        startTag: '<!--VENDOR SCRIPTS-->',
        endTag: '<!--VENDOR SCRIPTS END-->',
        fileRef: function(filepath) {
          var tmpl = '<script src="{{ "%s" | absURL }}"></script>';
          return util.format(tmpl, filepath.substring(filepath.indexOf('/')));
        },
        appRoot: 'src/'
      },
      files: {
        'layouts/partials/script.html': 'static/js/vendor.js'
      }
    },
    prodAppJs: {
      options: {
        startTag: '<!--APP SCRIPTS-->',
        endTag: '<!--APP SCRIPTS END-->',
        fileRef: function(filepath) {
          var tmpl = '<script src="{{ "%s" | absURL }}"></script>';
          return util.format(tmpl, filepath.substring(filepath.indexOf('/')));
        },
        appRoot: 'src/'
      },
      files: {
        'layouts/partials/script.html': 'static/js/app-*.min.js'
      }
    },
    prodCss: {
      options: {
        startTag: '<!--STYLES-->',
        endTag: '<!--STYLES END-->',
        fileRef: function(filepath) {
          var tmpl = '<link rel="stylesheet" href="{{ "%s" | absURL }}" />';
          return util.format(tmpl, filepath.substring(filepath.indexOf('/') + 1));
        },
        appRoot: 'src/'
      },
      files: {
        'layouts/partials/head.html': 'static/css/*.min.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-sails-linker');
};
