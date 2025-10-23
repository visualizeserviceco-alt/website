/**
 * VISUALIZE WEBSITE - MAIN JAVASCRIPT
 * Modern, modular JavaScript with error handling and performance optimization
 */

class VisualizeWebsite {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeModules());
    } else {
      this.initializeModules();
    }
  }

  initializeModules() {
    try {
      this.setupScrollAnimations();
      this.setupSmoothScrolling();
      this.setupHoverEffects();
      this.setupNavigation();
      this.setupMobileMenu();
      console.log('✓ Visualize Website initialized successfully');
    } catch (error) {
      console.error('✗ Error initializing website:', error);
    }
  }

  /**
   * Scroll-triggered animations using Intersection Observer
   */
  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(`
      section, header, footer, .project-card, .vh-hero .copy, 
      .vh-hero .visual img, .vh-services .card, .vh-pricing .card, 
      .vh-process .step, .vh-faq .item, .vh-testimonials .card, 
      .vh-showcase .tile, .vh-section, .section-card, .payment-methods li
    `);

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(el => el.classList.add('visible'));
      console.warn('IntersectionObserver not supported, falling back to immediate visibility');
      return;
    }

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        
        // Staggered animation delay
        setTimeout(() => {
          entry.target.classList.add('visible');
          entry.target.classList.remove('hidden');
          
          // Optimize performance by removing will-change after animation
          setTimeout(() => {
            entry.target.style.willChange = 'auto';
          }, 800);
        }, index * 120);

        observer.unobserve(entry.target);
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      el.classList.add('hidden');
      el.style.willChange = 'transform, opacity';
      observer.observe(el);
    });
  }

  /**
   * Smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        if (targetId.length <= 1) return;
        
        const target = document.querySelector(targetId);
        
        if (target) {
          e.preventDefault();
          
          // Add offset for sticky header
          const headerHeight = document.querySelector('.vh-header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  /**
   * Hover effects for interactive elements
   */
  setupHoverEffects() {
    // Only add hover effects on devices that support hover
    if (!window.matchMedia('(hover: hover)').matches) return;

    const hoverableElements = document.querySelectorAll(`
      .project-card, .vh-services .card, .vh-pricing .card, 
      .vh-testimonials .card, .vh-showcase .tile, .btn, .pay-btn
    `);

    hoverableElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.classList.add('hovered');
      });
      
      el.addEventListener('mouseleave', () => {
        el.classList.remove('hovered');
      });
    });
  }

  /**
   * Navigation setup and global functions
   */
  setupNavigation() {
    // Ensure navigation functions are globally available
    window.navigateToHome = () => {
      if (window.location.pathname.includes('/pages/')) {
        window.location.href = '../index.html';
      } else {
        window.location.href = 'index.html';
      }
    };

    window.navigateToProcess = () => {
      if (window.location.pathname.includes('/pages/')) {
        window.location.href = 'Process.html';
      } else {
        window.location.href = 'pages/Process.html';
      }
    };

    window.navigateToPayments = () => {
      if (window.location.pathname.includes('/pages/')) {
        window.location.href = 'Payments.html';
      } else {
        window.location.href = 'pages/Payments.html';
      }
    };

    // Add active state to current page
    this.highlightCurrentPage();
  }

  /**
   * Mobile menu functionality
   */
  setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.vh-header nav');

    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
        }
      });
    }
  }

  /**
   * Highlight current page in navigation
   */
  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.vh-header nav a, .vh-footer nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.includes(href.replace('../', '').replace('.html', ''))) {
        link.classList.add('active');
      }
    });
  }
}

// Performance monitoring
const perfStart = performance.now();

// Initialize the website
new VisualizeWebsite();

// Log performance
window.addEventListener('load', () => {
  const perfEnd = performance.now();
  console.log(`🚀 Website loaded in ${Math.round(perfEnd - perfStart)}ms`);
});

// Handle uncaught errors gracefully
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});