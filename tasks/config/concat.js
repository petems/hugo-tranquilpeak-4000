module.exports = function(grunt) {
  grunt.config.set('concat', {
    // Concat all javascript file into `tranquilpeak.js`
    devJs: {
      src: ['src/js/**/*.js'],
      dest: 'static/js/tranquilpeak.js',
      options: {
        separator: ';',
        sourceMap: true
      }
    },
    // Critical CSS for above-the-fold content
    criticalCss: {
      src: [
        'static/css/base.css',
        'static/css/header.css',
        'static/css/main.css'
      ],
      dest: 'static/css/critical.css'
    },
    // Non-critical CSS for below-the-fold content
    deferredCss: {
      src: [
        'static/css/components.css',
        'static/css/widgets.css',
        'static/css/extras.css'
      ],
      dest: 'static/css/deferred.css'
    },
    // Concat all stylesheets file into `style.css`
    prodCss: {
      src: ['static/css/*.css'],
      dest: 'static/css/style.css'
    },
    // Core JavaScript (critical functionality)
    coreJs: {
      src: [
        'assets/js/header.js',
        'assets/js/sidebar.js',
        'assets/js/smartresize.js'
      ],
      dest: 'static/js/core.js',
      options: {
        separator: ';',
        sourceMap: true
      }
    },
    // Feature JavaScript (non-critical functionality)
    featuresJs: {
      src: [
        'assets/js/search-modal.js',
        'assets/js/image-gallery.js',
        'assets/js/categories-filter.js',
        'assets/js/archives-filter.js',
        'assets/js/tags-filter.js',
        'assets/js/tabbed-codeblocks.js',
        'assets/js/share-options.js',
        'assets/js/post-bottom-bar.js',
        'assets/js/about.js',
        'assets/js/codeblock-resizer.js',
        'assets/js/fancybox.js'
      ],
      dest: 'static/js/features.js',
      options: {
        separator: ';',
        sourceMap: true
      }
    },
    // Concat all javascript file in `script.js`
    prodJs: {
      src: require('../pipeline').tranquilpeakJsFilesToInject,
      dest: 'static/js/script.js',
      options: {
        separator: ';'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};
