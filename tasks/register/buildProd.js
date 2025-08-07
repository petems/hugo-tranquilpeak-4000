module.exports = function(grunt) {
  // Build (environment : production)
  grunt.registerTask('buildProd', [
    'clean:build',
    'syncAssets',
    'replace:cssTranquilpeak',
    'concat:vendorJs',
    'concat:appJs',
    'cssmin',
    'uglify',
    'sails-linker:prodVendorJs',
    'sails-linker:prodAppJs',
    'sails-linker:prodCss'
  ]);
};
