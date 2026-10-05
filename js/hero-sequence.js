/* ==========================================================================
   THE RUDRAYYA OIL MILL — HERO AMBIENT TRANSFORMATION SHOWCASE
   Autonomous Cinematic Stages:
   1. Whole coconut slowly rotates
   2. Coconut cracks/opens revealing fresh white coconut meat
   3. Coconut pieces transition into traditional Vaagai wood press
   4. Natural golden oil begins flowing slowly (<45°C)
   5. Viscous amber stream filtered through pure cotton muslin
   6. The Rudrayya pure bottle settled in center
   (Cleaned: Scroll pinning removed for natural, smooth page scrolling)
   ========================================================================== */

class HeroSequenceManager {
  constructor() {
    this.layers = document.querySelectorAll('.hero-story-layer');
    this.stageDots = document.querySelectorAll('.stage-dot');
    this.stageNameEl = document.getElementById('telemetryStageName');
    this.stageDescEl = document.getElementById('telemetryStageDesc');
    this.stageStepEl = document.getElementById('telemetryStepNum');
    this.currentStage = 0;
    this.autoTimer = null;
    this.isPaused = false;

    this.stagesData = [
      {
        num: "01 / 06",
        title: "Selected Whole Coconut",
        desc: "Handpicked mature Malabar coastal coconuts, harvested at peak richness and balanced moisture."
      },
      {
        num: "02 / 06",
        title: "Cracking & Pure Meat",
        desc: "Split naturally by hand to reveal pristine snow-white coconut meat, cured under clean morning sunlight."
      },
      {
        num: "03 / 06",
        title: "Traditional Wood Press",
        desc: "Sun-dried copra slices placed into the heavy Vaagai wood Marachekku mortar, rotating at under 14 RPM."
      },
      {
        num: "04 / 06",
        title: "Golden Oil Flowing",
        desc: "Natural friction extracts pure unheated oil at ambient temperature (<45°C) preserving live nutrients."
      },
      {
        num: "05 / 06",
        title: "Viscous Amber Stream",
        desc: "Liquid gold pours smoothly through unbleached cotton muslin filters, sediment-free and crystal clear."
      },
      {
        num: "06 / 06",
        title: "The Rudrayya Pure Bottle",
        desc: "Artisanal glass bottle filled and sealed with natural cork, preserving 100% natural aroma and freshness."
      }
    ];

    this.init();
  }

  init() {
    if (!this.layers.length) return;

    this.setupDotClicks();
    this.setStage(0);
    this.startAutoCycle();
    this.setupHoverPause();
  }

  setStage(index) {
    if (index < 0 || index >= this.stagesData.length) return;
    this.currentStage = index;

    // Update active visual layers with smooth crossfade
    this.layers.forEach((layer, i) => {
      layer.classList.toggle('active', i === index);
    });

    // Update progress dots
    this.stageDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    // Update telemetry text
    const data = this.stagesData[index];
    if (this.stageNameEl) this.stageNameEl.textContent = data.title;
    if (this.stageDescEl) this.stageDescEl.textContent = data.desc;
    if (this.stageStepEl) this.stageStepEl.textContent = data.num;
  }

  startAutoCycle() {
    if (this.autoTimer) clearInterval(this.autoTimer);
    this.autoTimer = setInterval(() => {
      if (!this.isPaused) {
        const nextStage = (this.currentStage + 1) % this.stagesData.length;
        this.setStage(nextStage);
      }
    }, 4200);
  }

  setupHoverPause() {
    const stageContainer = document.querySelector('.hero-stage-container');
    const telemetryPanel = document.querySelector('.hero-telemetry-panel');
    [stageContainer, telemetryPanel].forEach(el => {
      if (!el) return;
      el.addEventListener('mouseenter', () => { this.isPaused = true; });
      el.addEventListener('mouseleave', () => { this.isPaused = false; });
    });
  }

  setupDotClicks() {
    this.stageDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.setStage(index);
        if (typeof SoundManager !== 'undefined') {
          SoundManager.playClick();
        }
      });
    });
  }
}

window.HeroSequenceManager = HeroSequenceManager;
