// Js files to inject in `layouts/partials/script.html`
var vendorJsFiles = [
  'vendor/jquery.min.js',
  'vendor/jquery.fancybox.min.js',
];

var tranquilpeakJsFilesToInject = [
  'about.js',
  'archives-filter.js',
  'categories-filter.js',
  'codeblock-resizer.js',
  'fancybox.js',
  'header.js',
  'image-gallery.js',
  'post-bottom-bar.js',
  'search-modal.js',
  'share-options.js',
  'sidebar.js',
  'smartresize.js',
  'tabbed-codeblocks.js',
  'tags-filter.js'
];

// Css files to inject in `layouts/partials/head.html`
var tranquilpeakCssFilesToInject = [
  'tranquilpeak.css'
];

module.exports.tranquilpeakCssFilesToInject = tranquilpeakCssFilesToInject.map(function(path) {
  return 'static/css/' + path;
});

module.exports.vendorJsFiles = vendorJsFiles.map(function(path) {
  return 'assets/js/' + path;
});

module.exports.tranquilpeakJsFilesToInject = tranquilpeakJsFilesToInject.map(function(path) {
  return 'assets/js/' + path;
});
