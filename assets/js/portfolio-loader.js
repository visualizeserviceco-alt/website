/**
 * Portfolio Image Loader
 * Automatically loads images from the media folder structure
 * 
 * Usage:
 * 1. Add images to assets/media/portfolio/[category]/
 * 2. Images will automatically appear in the portfolio sections
 * 3. Use data-portfolio-category attribute on containers to specify category
 */

(function() {
  'use strict';

  // Portfolio categories mapping
  const categories = {
    'logos': 'assets/media/portfolio/logos/',
    'websites': 'assets/media/portfolio/websites/',
    'print': 'assets/media/portfolio/print/',
    'packaging': 'assets/media/portfolio/packaging/',
    'merch': 'assets/media/portfolio/merch/',
    'social-media': 'assets/media/portfolio/social-media/'
  };

  /**
   * Load portfolio images for a specific category
   * Note: This requires a backend API to list files
   * For now, manually add images to HTML or use the placeholder system
   */
  function loadPortfolioImages(category, container) {
    // This would require a backend endpoint to list files
    // For static sites, manually add images to HTML
    console.log(`Portfolio loader: Add images to ${categories[category]} and reference them in HTML`);
  }

  /**
   * Initialize portfolio sections
   */
  function initPortfolio() {
    // Hide placeholder images that fail to load
    document.querySelectorAll('img[onerror]').forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
  } else {
    initPortfolio();
  }

  // Export for use in other scripts
  window.visualizePortfolio = {
    loadImages: loadPortfolioImages,
    categories: categories
  };

})();


