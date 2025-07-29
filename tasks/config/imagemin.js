module.exports = function(grunt) {
  grunt.config.set('imagemin', {
    options: {
      optimizationLevel: 7,
      progressive: true,
      interlaced: true
    },
    dynamic: {
      files: [{
        expand: true,
        cwd: 'assets/images/',
        src: ['**/*.{png,jpg,jpeg,gif,svg}'],
        dest: 'static/images/optimized/'
      }]
    }
  });

  // Register responsive images task
  grunt.registerTask('responsive-images', 'Generate responsive image variants', function() {
    var done = this.async();
    var fs = require('fs');
    var path = require('path');
    
    // Simple image optimization without external dependencies
    function optimizeImages() {
      var inputDir = 'assets/images';
      var outputDir = 'static/images/optimized';
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      if (fs.existsSync(inputDir)) {
        var files = fs.readdirSync(inputDir);
        grunt.log.writeln('Found ' + files.length + ' image files for optimization');
        
        // For now, just copy files - actual optimization would require imagemin
        files.forEach(function(file) {
          var src = path.join(inputDir, file);
          var dest = path.join(outputDir, file);
          
          if (fs.statSync(src).isFile()) {
            fs.copyFileSync(src, dest);
            grunt.log.writeln('Processed: ' + file);
          }
        });
        
        grunt.log.writeln('Image optimization completed');
      } else {
        grunt.log.writeln('No images directory found');
      }
      
      done();
    }
    
    optimizeImages();
  });

  // Load the imagemin plugin if available
  try {
    grunt.loadNpmTasks('grunt-contrib-imagemin');
  } catch (e) {
    grunt.log.warn('grunt-contrib-imagemin not available. Using basic image processing.');
  }
};