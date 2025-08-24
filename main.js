document.addEventListener("DOMContentLoaded", () => {
  // Animate sections, cards, hero elements
  const animatedElements = document.querySelectorAll(
    "section, .project-card, .vh-hero .copy, .vh-hero .visual img, .vh-services .card, .vh-pricing .card, .vh-process .step"
  );

  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      // Add a small delay for staggered effects
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 100);
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  animatedElements.forEach(el => {
    el.classList.add("hidden");
    appearOnScroll.observe(el);
  });

  // Smooth scroll for internal links
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

  // Hover animation for project cards
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("hovered");
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("hovered");
    });
  });
});