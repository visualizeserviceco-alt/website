/**
 * BLACK FRIDAY SALE COUNTDOWN & BANNER MANAGEMENT
 * Handles countdown timer, banner visibility, and sale expiry
 */

class BlackFridaySale {
  constructor() {
    // Set sale end time: Today at 11:59 PM local time
    const now = new Date();
    this.saleEndTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    // Check if sale has already expired
    if (now >= this.saleEndTime) {
      // Sale expired - set to tomorrow for testing, or keep expired
      this.saleEndTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999);
    }
    
    this.discountCode = 'BLACKFRIDAY50';
    this.discountPercent = 50;
    this.init();
  }

  init() {
    // Check if sale is active
    if (this.isSaleExpired()) {
      this.hideSaleElements();
      return;
    }

    // Setup banner
    this.setupBanner();
    
    // Setup countdown timers
    this.setupCountdowns();
    
    // Update prices
    this.updatePrices();
    
    // Start countdown interval
    this.startCountdown();
  }

  isSaleExpired() {
    return new Date() >= this.saleEndTime;
  }

  setupBanner() {
    const banner = document.getElementById('blackfriday-banner');
    if (!banner) return;

    // Check if user dismissed banner in this session
    const dismissed = sessionStorage.getItem('blackfriday-banner-dismissed');
    if (dismissed === 'true') {
      banner.classList.remove('active');
      document.body.classList.remove('has-blackfriday-banner');
      this.updateHeaderPosition(false);
      return;
    }

    // Show banner
    banner.classList.add('active');
    document.body.classList.add('has-blackfriday-banner');
    this.updateHeaderPosition(true);

    // Setup close button
    const closeBtn = banner.querySelector('.banner-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        banner.classList.remove('active');
        document.body.classList.remove('has-blackfriday-banner');
        this.updateHeaderPosition(false);
        sessionStorage.setItem('blackfriday-banner-dismissed', 'true');
      });
    }
  }

  updateHeaderPosition(hasBanner) {
    // Header positioning is handled by CSS, but we ensure the class is set
    // This is mainly for ensuring proper initialization
    const header = document.querySelector('.vh-header');
    if (header) {
      if (hasBanner) {
        header.style.top = window.matchMedia('(max-width: 768px)').matches ? '80px' : '60px';
      } else {
        header.style.top = '0';
      }
    }
  }

  setupCountdowns() {
    // Update all countdown elements
    const countdownElements = document.querySelectorAll('.blackfriday-countdown');
    countdownElements.forEach(el => {
      this.updateCountdownDisplay(el);
    });
  }

  updateCountdownDisplay(element) {
    const now = new Date();
    const timeLeft = this.saleEndTime - now;

    if (timeLeft <= 0) {
      element.innerHTML = '<span>Sale Ended</span>';
      return;
    }

    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Format for banner (compact)
    if (element.classList.contains('banner-countdown')) {
      element.innerHTML = `
        <div class="countdown-item">
          <span class="countdown-number">${String(hours).padStart(2, '0')}</span>
          <span class="countdown-label">h</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${String(minutes).padStart(2, '0')}</span>
          <span class="countdown-label">m</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${String(seconds).padStart(2, '0')}</span>
          <span class="countdown-label">s</span>
        </div>
      `;
    } else {
      // Format for service cards (detailed)
      element.innerHTML = `
        <span class="countdown-label">Sale ends in:</span>
        <div class="countdown-time">
          <div class="countdown-item">
            <span class="countdown-number">${String(hours).padStart(2, '0')}</span>
            <span class="countdown-label-small">hours</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${String(minutes).padStart(2, '0')}</span>
            <span class="countdown-label-small">min</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${String(seconds).padStart(2, '0')}</span>
            <span class="countdown-label-small">sec</span>
          </div>
        </div>
      `;
    }
  }

  startCountdown() {
    // Update every second
    this.countdownInterval = setInterval(() => {
      if (this.isSaleExpired()) {
        this.handleSaleExpiry();
        return;
      }

      this.setupCountdowns();
    }, 1000);

    // Initial update
    this.setupCountdowns();
  }

  handleSaleExpiry() {
    clearInterval(this.countdownInterval);
    this.hideSaleElements();
    
    // Update countdown displays
    const countdownElements = document.querySelectorAll('.blackfriday-countdown');
    countdownElements.forEach(el => {
      el.innerHTML = '<span>Sale Ended</span>';
    });
  }

  hideSaleElements() {
    // Hide banner
    const banner = document.getElementById('blackfriday-banner');
    if (banner) {
      banner.classList.remove('active');
      banner.classList.add('blackfriday-expired');
      document.body.classList.remove('has-blackfriday-banner');
      this.updateHeaderPosition(false);
    }

    // Hide all sale elements
    const saleElements = document.querySelectorAll('.blackfriday-sale');
    saleElements.forEach(el => {
      el.classList.add('blackfriday-expired');
    });
  }

  updatePrices() {
    // Update pricing display with discounts
    const prices = [
      { original: 50, selector: '.price-starter' },
      { original: 200, selector: '.price-branding' },
      { original: 500, selector: '.price-full' }
    ];

    prices.forEach(({ original, selector }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const discounted = original * (1 - this.discountPercent / 100);
        el.innerHTML = `
          <span class="price-original">$${original}</span>
          <span class="price-discounted">$${discounted}</span>
          <span class="price-savings">Save ${this.discountPercent}%</span>
        `;
      });
    });
  }

  getDiscountCode() {
    return this.discountCode;
  }

  getDiscountPercent() {
    return this.discountPercent;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.blackFridaySale = new BlackFridaySale();
  });
} else {
  window.blackFridaySale = new BlackFridaySale();
}

