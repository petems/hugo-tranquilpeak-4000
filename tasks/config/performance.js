const fs = require('fs');
const path = require('path');

module.exports = function(grunt) {
  grunt.config.set('performance', {
    options: {
      thresholds: {
        js: 250000,    // 250KB max for JS files
        css: 150000,   // 150KB max for CSS files
        image: 500000  // 500KB max for images
      }
    }
  });

  // Custom task to monitor build performance
  grunt.registerTask('perf-monitor', 'Monitor build performance and file sizes', function() {
    var done = this.async();
    var startTime = Date.now();
    
    function formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    function checkFileSize(filePath, threshold, type) {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const size = stats.size;
        const status = size > threshold ? 'WARN' : 'OK';
        const color = size > threshold ? 'yellow' : 'green';
        
        grunt.log.writeln(`[${status}] ${type}: ${path.basename(filePath)} - ${formatBytes(size)}`);
        
        if (size > threshold) {
          grunt.log.warn(`File exceeds recommended size threshold of ${formatBytes(threshold)}`);
        }
        
        return { file: filePath, size: size, status: status };
      }
      return null;
    }
    
    grunt.log.writeln('Performance Monitoring Report');
    grunt.log.writeln('================================');
    
    // Check static assets
    const staticDir = 'static';
    const results = [];
    
    // Check JavaScript files
    if (fs.existsSync(path.join(staticDir, 'js'))) {
      const jsFiles = fs.readdirSync(path.join(staticDir, 'js'))
        .filter(file => file.endsWith('.min.js'));
      
      grunt.log.writeln('\nJavaScript Files:');
      jsFiles.forEach(file => {
        const result = checkFileSize(
          path.join(staticDir, 'js', file), 
          grunt.config.get('performance.options.thresholds.js'), 
          'JS'
        );
        if (result) results.push(result);
      });
    }
    
    // Check CSS files
    if (fs.existsSync(path.join(staticDir, 'css'))) {
      const cssFiles = fs.readdirSync(path.join(staticDir, 'css'))
        .filter(file => file.endsWith('.min.css'));
      
      grunt.log.writeln('\nCSS Files:');
      cssFiles.forEach(file => {
        const result = checkFileSize(
          path.join(staticDir, 'css', file), 
          grunt.config.get('performance.options.thresholds.css'), 
          'CSS'
        );
        if (result) results.push(result);
      });
    }
    
    // Check image files
    if (fs.existsSync('assets/images')) {
      const imageFiles = fs.readdirSync('assets/images')
        .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
      
      grunt.log.writeln('\nImage Files:');
      imageFiles.forEach(file => {
        const result = checkFileSize(
          path.join('assets/images', file), 
          grunt.config.get('performance.options.thresholds.image'), 
          'IMG'
        );
        if (result) results.push(result);
      });
    }
    
    // Summary
    const warnings = results.filter(r => r.status === 'WARN').length;
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    
    grunt.log.writeln('\n================================');
    grunt.log.writeln(`Total files checked: ${results.length}`);
    grunt.log.writeln(`Files with warnings: ${warnings}`);
    grunt.log.writeln(`Total size: ${formatBytes(totalSize)}`);
    grunt.log.writeln(`Build completed in: ${Date.now() - startTime}ms`);
    
    done();
  });
};