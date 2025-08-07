const grunt = require('grunt');
const path = require('path');

grunt.file.setBase(__dirname);
grunt.tasks(['buildProd'], {}, function() {
  grunt.log.ok('Grunt buildProd task completed.');
});
