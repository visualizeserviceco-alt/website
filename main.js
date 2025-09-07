document.addEventListener("DOMContentLoaded", () => {
  // Animate sections, cards, hero elements, and site-wide components
  const animatedElements = document.querySelectorAll(
    "section, header, footer, .project-card, .vh-hero .copy, .vh-hero .visual img, .vh-services .card, .vh-pricing .card, .vh-process .step, .vh-faq .item, .vh-testimonials .card, .vh-showcase .tile, .vh-section, .section-card, .payment-methods li"
  );

  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -20px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      // Add a small delay for staggered effects
      setTimeout(() => {
        entry.target.classList.add("visible");
        entry.target.classList.remove("hidden");
        entry.target.style.willChange = "transform, opacity";
      }, index * 120);
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  animatedElements.forEach(el => {
    el.classList.add("hidden");
    appearOnScroll.observe(el);
  });

  // Smooth scroll for internal links including buttons
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", e => {
      const targetID = link.getAttribute("href");
      if (targetID.length > 1) {
        e.preventDefault();
        const target = document.querySelector(targetID);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Hover animations for cards and buttons, only if device supports hover
  if (window.matchMedia("(hover: hover)").matches) {
    const hoverables = document.querySelectorAll(".project-card, .vh-services .card, .vh-pricing .card, .vh-testimonials .card, .vh-showcase .tile, .btn, .pay-btn");
    hoverables.forEach(el => {
      el.addEventListener("mouseenter", () => el.classList.add("hovered"));
      el.addEventListener("mouseleave", () => el.classList.remove("hovered"));
    });
  }
});