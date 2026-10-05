/* ==========================================================================
   THE RUDRAYYA OIL MILL — HORIZONTAL STORYTELLING SCROLL (SECTION 2)
   "From Nature to Your Kitchen" (01 to 05)
   ========================================================================== */

class HorizontalStoryScroll {
  constructor() {
    this.section = document.querySelector('.horizontal-scroll-section');
    this.track = document.querySelector('.horizontal-track');
    this.progressFill = document.querySelector('.journey-track-fill');
    this.indicators = document.querySelectorAll('.journey-step-indicator');
    this.cards = document.querySelectorAll('.journey-card');

    this.init();
  }

  init() {
    if (!this.section || !this.track || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Check screen width for desktop horizontal pin vs mobile swipe
    this.setupAnimation();
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }

  setupAnimation() {
    if (window.innerWidth <= 800) {
      // Mobile touch-friendly scroll with intersection observer
      this.setupMobileObserver();
      return;
    }

    const totalScroll = this.track.scrollWidth - window.innerWidth + 200;

    const horizontalTween = gsap.to(this.track, {
      x: () => -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: this.section,
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // Update progress fill bar
          if (this.progressFill) {
            this.progressFill.style.width = `${Math.max(15, progress * 100)}%`;
          }

          // Active indicator highlight
          const activeIndex = Math.min(
            this.indicators.length - 1,
            Math.floor(progress * this.indicators.length)
          );

          this.indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === activeIndex);
          });
        }
      }
    });

    // Parallax on card images
    this.cards.forEach((card) => {
      const img = card.querySelector('img');
      if (img) {
        gsap.fromTo(img, 
          { scale: 1.15, x: 20 },
          {
            scale: 1,
            x: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalTween,
              start: 'left right',
              end: 'right left',
              scrub: true
            }
          }
        );
      }
    });
  }

  setupMobileObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(entry.target.dataset.step || '0', 10);
          this.indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === stepIndex);
          });
          if (this.progressFill) {
            this.progressFill.style.width = `${((stepIndex + 1) / 5) * 100}%`;
          }
        }
      });
    }, { threshold: 0.6 });

    this.cards.forEach(card => observer.observe(card));
  }
}

window.HorizontalStoryScroll = HorizontalStoryScroll;
