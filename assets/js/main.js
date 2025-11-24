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
      this.optimizeScrollPerformance();
      console.log('✓ Visualize Website initialized successfully');
    } catch (error) {
      console.error('✗ Error initializing website:', error);
    }
  }

  /**
   * Optimize scroll performance on mobile
   */
  optimizeScrollPerformance() {
    // Add passive scroll listeners for better performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Any scroll-based updates can go here
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Add loading optimization
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      // Prevent layout shift
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }

  /**
   * Scroll-triggered animations using Intersection Observer
   * Optimized for mobile with better performance and smoother animations
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

    // Detect mobile device for optimized settings
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile-optimized observer options
    const observerOptions = {
      threshold: isMobile ? 0.1 : 0.15,
      rootMargin: isMobile ? '0px 0px -10px 0px' : '0px 0px -20px 0px'
    };

    // Use requestAnimationFrame for smoother animations
    const animateWithRAF = (element, callback) => {
      requestAnimationFrame(() => {
        callback();
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        
        // Reduced delay on mobile and for reduced motion
        const staggerDelay = prefersReducedMotion ? 0 : (isMobile ? index * 60 : index * 120);
        
        animateWithRAF(entry.target, () => {
          setTimeout(() => {
            entry.target.classList.add('visible');
            entry.target.classList.remove('hidden');
            
            // Optimize performance by removing will-change after animation
            setTimeout(() => {
              entry.target.style.willChange = 'auto';
            }, isMobile ? 600 : 800);
          }, staggerDelay);
        });

        observer.unobserve(entry.target);
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      el.classList.add('hidden');
      // Use transform3d for better GPU acceleration on mobile
      el.style.willChange = 'transform, opacity';
      el.style.transform = 'translate3d(0, 0, 0)';
      observer.observe(el);
    });
  }

  /**
   * Smooth scrolling for anchor links
   * Optimized for mobile with iOS Safari compatibility
   */
  setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    // Smooth scroll polyfill for better mobile support
    const smoothScrollTo = (element, offset = 0) => {
      const targetPosition = element.offsetTop - offset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = isMobile ? 400 : 600;
      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function for smooth animation
        const ease = percentage < 0.5
          ? 2 * percentage * percentage
          : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (progress < duration) {
          requestAnimationFrame(step);
        }
      };
      
      requestAnimationFrame(step);
    };
    
    anchorLinks.forEach(link => {
      // Use passive listener for better scroll performance
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        if (targetId.length <= 1) return;
        
        const target = document.querySelector(targetId);
        
        if (target) {
          e.preventDefault();
          
          // Add offset for sticky header
          const headerHeight = document.querySelector('.vh-header')?.offsetHeight || 0;
          const offset = headerHeight + (isMobile ? 10 : 20);
          
          // Use native smooth scroll if available, otherwise use polyfill
          if ('scrollBehavior' in document.documentElement.style && !isMobile) {
            window.scrollTo({
              top: target.offsetTop - offset,
              behavior: 'smooth'
            });
          } else {
            smoothScrollTo(target, offset);
          }
          
          // Update URL without jumping
          history.pushState(null, null, targetId);
          
          // Close mobile menu if open
          const nav = document.querySelector('.vh-header nav');
          const hamburger = document.querySelector('.hamburger');
          if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
          }
        }
      }, { passive: false });
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
    // Ensure navigation functions are globally available for clean URLs
    window.navigateToHome = () => {
      window.location.href = '/';
    };

    window.navigateToProcess = () => {
      window.location.href = '/process';
    };

    window.navigateToPayments = () => {
      window.location.href = '/payments';
    };

    // Add active state to current page
    this.highlightCurrentPage();
  }

  /**
   * Mobile menu functionality
   * Optimized with smooth animations and touch-friendly interactions
   */
  setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.vh-header nav');
    const body = document.body;

    if (hamburger && nav) {
      const toggleMenu = () => {
        const isActive = nav.classList.contains('active');
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Prevent body scroll when menu is open (mobile)
        if (window.matchMedia('(max-width: 768px)').matches) {
          if (!isActive) {
            body.style.overflow = 'hidden';
            body.style.position = 'fixed';
            body.style.width = '100%';
          } else {
            body.style.overflow = '';
            body.style.position = '';
            body.style.width = '';
          }
        }
      };

      hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      }, { passive: true });

      // Close menu when clicking on nav links
      const navLinks = nav.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (nav.classList.contains('active')) {
            toggleMenu();
          }
        }, { passive: true });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !hamburger.contains(e.target) && 
            !nav.contains(e.target)) {
          toggleMenu();
        }
      }, { passive: true });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
          toggleMenu();
        }
      }, { passive: true });

      // Handle window resize - close menu if switching to desktop
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (window.innerWidth > 768 && nav.classList.contains('active')) {
            toggleMenu();
          }
        }, 250);
      }, { passive: true });
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