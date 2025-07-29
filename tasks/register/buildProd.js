module.exports = function(grunt) {
  // Build (environment : production)
  grunt.registerTask('buildProd', [
    'clean:build',
    'syncAssets',
    'sass:prod',
    'replace:cssTranquilpeak',
    'concat:coreJs',
    'concat:featuresJs',
    'concat:criticalCss',
    'concat:deferredCss',
    'concat:prodCss',
    'cssmin:critical',
    'cssmin:deferred',
    'cssmin:prod',
    'uglify:prod',
    'linkAssetsProd',
    'perf-monitor'
  ]);
  
  // Development build with performance monitoring
  grunt.registerTask('buildDev', [
    'clean:build',
    'syncAssets',
    'sass:dev',
    'replace:cssTranquilpeak',
    'concat:devJs',
    'concat:coreJs',
    'concat:featuresJs',
    'cssmin:dev',
    'uglify:dev',
    'linkAssets',
    'perf-monitor'
  ]);
  
  // Fast build for development (minimal optimization)
  grunt.registerTask('buildFast', [
    'clean:build',
    'syncAssets',
    'sass:dev',
    'replace:cssTranquilpeak',
    'concat:devJs',
    'linkAssets'
  ]);
};
