(function() {
  'use strict';

  /**
   * Lazy Loader utility for optimizing resource loading
   * @constructor
   */
  var LazyLoader = function() {
    this.intersectionObserver = null;
    this.loadedScripts = new Set();
    this.loadedStyles = new Set();
    this.initIntersectionObserver();
  };

  LazyLoader.prototype = {
    /**
     * Initialize Intersection Observer for lazy loading
     */
    initIntersectionObserver: function() {
      var self = this;
      
      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              self.loadElement(entry.target);
              self.intersectionObserver.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });
      }
    },

    /**
     * Load an element (image, script, etc.)
     * @param {Element} element
     */
    loadElement: function(element) {
      if (element.dataset.src) {
        element.src = element.dataset.src;
        element.removeAttribute('data-src');
      }
      
      if (element.dataset.srcset) {
        element.srcset = element.dataset.srcset;
        element.removeAttribute('data-srcset');
      }
      
      element.classList.remove('lazy');
      element.classList.add('loaded');
    },

    /**
     * Lazy load images
     */
    loadImages: function() {
      var images = document.querySelectorAll('img[data-src]');
      var self = this;
      
      if (this.intersectionObserver) {
        images.forEach(function(img) {
          img.classList.add('lazy');
          self.intersectionObserver.observe(img);
        });
      } else {
        // Fallback for browsers without Intersection Observer
        images.forEach(function(img) {
          self.loadElement(img);
        });
      }
    },

    /**
     * Lazy load JavaScript files
     * @param {string} src - Script source URL
     * @param {Function} callback - Optional callback
     */
    loadScript: function(src, callback) {
      if (this.loadedScripts.has(src)) {
        if (callback) callback();
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      var self = this;
      script.onload = function() {
        self.loadedScripts.add(src);
        if (callback) callback();
      };
      
      script.onerror = function() {
        console.warn('Failed to load script:', src);
      };
      
      document.head.appendChild(script);
    },

    /**
     * Lazy load CSS files
     * @param {string} href - CSS file URL
     * @param {Function} callback - Optional callback
     */
    loadStylesheet: function(href, callback) {
      if (this.loadedStyles.has(href)) {
        if (callback) callback();
        return;
      }

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      
      var self = this;
      link.onload = function() {
        self.loadedStyles.add(href);
        if (callback) callback();
      };
      
      link.onerror = function() {
        console.warn('Failed to load stylesheet:', href);
      };
      
      document.head.appendChild(link);
    },

    /**
     * Load non-critical JavaScript features on user interaction
     */
    loadFeaturesOnInteraction: function() {
      var self = this;
      var featuresLoaded = false;
      
      function loadFeatures() {
        if (featuresLoaded) return;
        featuresLoaded = true;
        
        // Load features bundle
        self.loadScript('/static/js/features.min.js', function() {
          console.log('Features loaded');
        });
      }
      
      // Load on first user interaction
      var events = ['click', 'scroll', 'keydown', 'touchstart'];
      events.forEach(function(event) {
        document.addEventListener(event, loadFeatures, { once: true, passive: true });
      });
      
      // Fallback: load after 3 seconds
      setTimeout(loadFeatures, 3000);
    },

    /**
     * Preload critical resources
     */
    preloadCritical: function() {
      var criticalResources = [
        { href: '/static/css/critical.min.css', as: 'style' },
        { href: '/static/js/core.min.js', as: 'script' }
      ];
      
      criticalResources.forEach(function(resource) {
        var link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
      });
    },

    /**
     * Initialize lazy loading
     */
    init: function() {
      var self = this;
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          self.run();
        });
      } else {
        self.run();
      }
    },

    /**
     * Run all lazy loading features
     */
    run: function() {
      this.preloadCritical();
      this.loadImages();
      this.loadFeaturesOnInteraction();
    }
  };

  // Auto-initialize
  var lazyLoader = new LazyLoader();
  lazyLoader.init();

  // Export for manual usage
  window.LazyLoader = lazyLoader;
})();