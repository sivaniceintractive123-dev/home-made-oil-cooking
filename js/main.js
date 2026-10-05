/* ==========================================================================
   THE RUDRAYYA OIL MILL — CORE APPLICATION CONTROLLER
   "From Seed to Pure Oil"
   Smooth Scroll (Lenis), GSAP ScrollTrigger, Audio Synthesizer,
   Magnetic Cursor, Batch Tracker, Counters & Interactions
   ========================================================================== */

// --- 1. Synthesized Audio System (Zero external files needed) ---
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.ambientOsc = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Gentle wooden marachekku click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playChime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    // Pure droplet chime tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  toggleSound() {
    this.ensureContext();
    this.isMuted = !this.isMuted;

    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
      btn.classList.toggle('sound-playing', !this.isMuted);
      btn.setAttribute('aria-label', this.isMuted ? 'Unmute Sound' : 'Mute Sound');
    }

    if (!this.isMuted) {
      this.playChime();
      showToast('Sound enabled: Atmospheric wood press tones active');
    } else {
      showToast('Sound muted');
    }
  }
}

const SoundManager = new AudioSynthesizer();
window.SoundManager = SoundManager;

// --- 2. Toast Notification Helper ---
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D69726" stroke-width="2">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}
window.showToast = showToast;

// --- 3. Magnetic Custom Cursor ---
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states on interactive elements
  const hoverElements = document.querySelectorAll('a, button, .product-card, .journey-card, .ingredient-node, .showcase-item, .benefit-card');
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      const customText = el.dataset.cursorText || '';
      cursor.setAttribute('data-cursor-text', customText);
      follower.style.transform = 'translate(-50%, -50%) scale(1.4)';
    });

    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      cursor.removeAttribute('data-cursor-text');
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // Hide when mouse leaves document
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

// --- 4. Clumsy Handwritten Headline Entrance Animation ---
function initClumsyHandwrittenHeadline() {
  const heading = document.querySelector('.hero-main-heading');
  if (!heading || typeof gsap === 'undefined') return;

  // Remove settled class if replayed
  heading.classList.remove('clumsy-settled');

  const line1 = heading.querySelector('.clumsy-line[data-line="1"]');
  const line2 = heading.querySelector('.clumsy-line[data-line="2"]');
  if (!line1 || !line2) return;

  const word1 = line1.querySelector('[data-word="Pure"]');
  const word2 = line1.querySelector('[data-word="Ingredients."]');
  const word3 = line2.querySelector('[data-word="Pure"]');
  const word4 = line2.querySelector('[data-word="Process."]');

  const chars1_1 = word1 ? Array.from(word1.querySelectorAll('.clumsy-char')) : [];
  const chars1_2 = word2 ? Array.from(word2.querySelectorAll('.clumsy-char')) : [];
  const chars2_1 = word3 ? Array.from(word3.querySelectorAll('.clumsy-char')) : [];
  const chars2_2 = word4 ? Array.from(word4.querySelectorAll('.clumsy-char')) : [];

  const allWords = [word1, word2, word3, word4].filter(Boolean);
  const allChars = [...chars1_1, ...chars1_2, ...chars2_1, ...chars2_2];
  const oilText = heading.querySelector('.hero-oil-text');
  const supporting = document.querySelector('.hero-supporting');
  const ctas = document.querySelector('.hero-ctas');

  // Immediately prepare initial states
  gsap.set(allChars, { opacity: 0, willChange: 'transform, opacity' });
  gsap.set(allWords, { willChange: 'transform' });
  if (oilText) gsap.set(oilText, { opacity: 0, y: 16 });
  if (supporting) gsap.set(supporting, { opacity: 0, y: 14 });
  if (ctas) gsap.set(ctas, { opacity: 0, y: 12 });

  // Master timeline for the clumsy handwritten entrance
  const masterTl = gsap.timeline({
    delay: 0.1,
    onComplete: () => {
      // FREEZE COMPLETELY STATIC:
      // No looping. No continuous movement. No shaking after the animation finishes.
      gsap.set(allWords, { clearProps: 'transform,willChange' });
      gsap.set(allChars, { clearProps: 'transform,willChange', opacity: 1 });
      heading.classList.add('clumsy-settled');
    }
  });

  // --- LINE 1: WORD 1 ("Pure") ---
  if (word1) {
    // Word rotates, wobbles, and moves a few pixels
    masterTl.fromTo(word1,
      { rotation: -3.2, y: 8, x: -3 },
      { rotation: 1.8, y: -1.6, x: 1.2, duration: 0.15, ease: 'power2.out' },
      0.04
    );
    masterTl.to(word1, { rotation: -0.6, y: 0.6, x: -0.5, duration: 0.14, ease: 'sine.inOut' }, 0.19);
    masterTl.to(word1, { rotation: 0, y: 0, x: 0, duration: 0.14, ease: 'power2.out' }, 0.33);
  }

  // Word 1 characters: P, u, r, e
  const chars1_1_meta = [
    { delay: 0.040, y: 18, x: -3.5, rot: -5.5, scale: 0.92, overY: -4.0, overX: 0.8, overRot: 2.0 },  // P
    { delay: 0.082, y: 15, x: 2.2,  rot: 4.5,  scale: 1.06, overY: -3.6, overX: -0.6, overRot: -1.6 }, // u
    { delay: 0.120, y: 17, x: -2.0, rot: -4.0, scale: 0.95, overY: -4.2, overX: 0.5, overRot: 1.5 },  // r
    { delay: 0.162, y: 14, x: 3.0,  rot: 5.2,  scale: 1.08, overY: -3.5, overX: -0.7, overRot: -1.8 }  // e
  ];

  chars1_1.forEach((charEl, idx) => {
    const m = chars1_1_meta[idx] || { delay: 0.04 + idx * 0.04, y: 16, x: 0, rot: 0, scale: 1, overY: -4, overX: 0, overRot: 0 };
    // Phase 1: Letter appears, overshooting slightly past resting line
    masterTl.fromTo(charEl,
      { opacity: 0, y: m.y, x: m.x, rotation: m.rot, scale: m.scale },
      { opacity: 1, y: m.overY, x: m.overX, rotation: m.overRot, scale: 1.04, duration: 0.14, ease: 'power2.out' },
      m.delay
    );
    // Phase 2: Softly settles into true alignment
    masterTl.to(charEl,
      { y: 0, x: 0, rotation: 0, scale: 1, duration: 0.15, ease: 'power2.out' },
      m.delay + 0.14
    );
  });

  // --- LINE 1: WORD 2 ("Ingredients.") ---
  if (word2) {
    masterTl.fromTo(word2,
      { rotation: 2.8, y: 9, x: 3 },
      { rotation: -1.5, y: -1.8, x: -1.2, duration: 0.20, ease: 'power2.out' },
      0.22
    );
    masterTl.to(word2, { rotation: 0.6, y: 0.6, x: 0.5, duration: 0.16, ease: 'sine.inOut' }, 0.42);
    masterTl.to(word2, { rotation: 0, y: 0, x: 0, duration: 0.16, ease: 'power2.out' }, 0.58);
  }

  // Word 2 characters: I, n, g, r, e, d, i, e, n, t, s, .
  const chars1_2_meta = [
    { delay: 0.225, y: 19, x: 3.2,  rot: 4.8,  scale: 0.90, overY: -4.5, overX: -0.8, overRot: -1.8 }, // I
    { delay: 0.260, y: 16, x: -2.6, rot: -4.2, scale: 1.04, overY: -3.8, overX: 0.6,  overRot: 1.5 },  // n
    { delay: 0.298, y: 18, x: 2.8,  rot: 5.0,  scale: 0.94, overY: -4.2, overX: -0.7, overRot: -1.6 }, // g
    { delay: 0.334, y: 15, x: -2.0, rot: -3.6, scale: 1.07, overY: -3.5, overX: 0.5,  overRot: 1.4 },  // r
    { delay: 0.372, y: 17, x: 2.2,  rot: 4.2,  scale: 0.96, overY: -3.9, overX: -0.5, overRot: -1.5 }, // e
    { delay: 0.408, y: 17, x: -3.2, rot: -4.6, scale: 1.05, overY: -4.1, overX: 0.7,  overRot: 1.6 },  // d
    { delay: 0.440, y: 14, x: 1.6,  rot: 3.0,  scale: 0.92, overY: -3.2, overX: -0.4, overRot: -1.2 }, // i
    { delay: 0.474, y: 16, x: -2.2, rot: -4.0, scale: 1.05, overY: -3.7, overX: 0.5,  overRot: 1.4 },  // e
    { delay: 0.510, y: 15, x: 2.5,  rot: 3.8,  scale: 0.98, overY: -3.5, overX: -0.6, overRot: -1.3 }, // n
    { delay: 0.546, y: 17, x: -2.4, rot: -3.5, scale: 1.04, overY: -3.8, overX: 0.5,  overRot: 1.3 },  // t
    { delay: 0.580, y: 14, x: 2.8,  rot: 4.4,  scale: 0.95, overY: -3.4, overX: -0.7, overRot: -1.5 }, // s
    { delay: 0.630, y: 15, x: -1.2, rot: -5.2, scale: 1.14, overY: -4.0, overX: 0.3,  overRot: 1.8 }   // . (natural pause before dot)
  ];

  chars1_2.forEach((charEl, idx) => {
    const m = chars1_2_meta[idx] || { delay: 0.22 + idx * 0.035, y: 16, x: 0, rot: 0, scale: 1, overY: -4, overX: 0, overRot: 0 };
    masterTl.fromTo(charEl,
      { opacity: 0, y: m.y, x: m.x, rotation: m.rot, scale: m.scale },
      { opacity: 1, y: m.overY, x: m.overX, rotation: m.overRot, scale: 1.04, duration: 0.14, ease: 'power2.out' },
      m.delay
    );
    masterTl.to(charEl,
      { y: 0, x: 0, rotation: 0, scale: 1, duration: 0.14, ease: 'power2.out' },
      m.delay + 0.14
    );
  });

  // --- LINE 2: WORD 3 ("Pure") ---
  if (word3) {
    masterTl.fromTo(word3,
      { rotation: 3.0, y: 8, x: -2.5 },
      { rotation: -1.5, y: -1.3, x: 1.0, duration: 0.16, ease: 'power2.out' },
      0.36
    );
    masterTl.to(word3, { rotation: 0.5, y: 0.4, x: -0.4, duration: 0.14, ease: 'sine.inOut' }, 0.52);
    masterTl.to(word3, { rotation: 0, y: 0, x: 0, duration: 0.14, ease: 'power2.out' }, 0.66);
  }

  // Word 3 characters: P, u, r, e
  const chars2_1_meta = [
    { delay: 0.365, y: 18, x: -3.0, rot: 5.0,  scale: 0.92, overY: -4.0, overX: 0.7,  overRot: -1.8 }, // P
    { delay: 0.405, y: 15, x: 2.4,  rot: -4.2, scale: 1.05, overY: -3.6, overX: -0.6, overRot: 1.5 },  // u
    { delay: 0.442, y: 16, x: -2.2, rot: 3.8,  scale: 0.96, overY: -3.9, overX: 0.5,  overRot: -1.4 }, // r
    { delay: 0.482, y: 14, x: 2.8,  rot: -4.5, scale: 1.08, overY: -3.5, overX: -0.7, overRot: 1.6 }   // e
  ];

  chars2_1.forEach((charEl, idx) => {
    const m = chars2_1_meta[idx] || { delay: 0.36 + idx * 0.04, y: 16, x: 0, rot: 0, scale: 1, overY: -4, overX: 0, overRot: 0 };
    masterTl.fromTo(charEl,
      { opacity: 0, y: m.y, x: m.x, rotation: m.rot, scale: m.scale },
      { opacity: 1, y: m.overY, x: m.overX, rotation: m.overRot, scale: 1.04, duration: 0.14, ease: 'power2.out' },
      m.delay
    );
    masterTl.to(charEl,
      { y: 0, x: 0, rotation: 0, scale: 1, duration: 0.14, ease: 'power2.out' },
      m.delay + 0.14
    );
  });

  // --- LINE 2: WORD 4 ("Process.") ---
  if (word4) {
    masterTl.fromTo(word4,
      { rotation: -2.6, y: 10, x: 3.2 },
      { rotation: 1.4, y: -1.5, x: -1.0, duration: 0.18, ease: 'power2.out' },
      0.52
    );
    masterTl.to(word4, { rotation: -0.5, y: 0.4, x: 0.4, duration: 0.14, ease: 'sine.inOut' }, 0.70);
    masterTl.to(word4, { rotation: 0, y: 0, x: 0, duration: 0.14, ease: 'power2.out' }, 0.84);
  }

  // Word 4 characters: P, r, o, c, e, s, s, .
  const chars2_2_meta = [
    { delay: 0.528, y: 19, x: 3.4,  rot: -5.2, scale: 0.92, overY: -4.4, overX: -0.8, overRot: 1.8 },  // P
    { delay: 0.564, y: 15, x: -2.6, rot: 4.0,  scale: 1.06, overY: -3.6, overX: 0.6,  overRot: -1.5 }, // r
    { delay: 0.600, y: 17, x: 2.2,  rot: -3.8, scale: 0.95, overY: -4.0, overX: -0.5, overRot: 1.4 },  // o
    { delay: 0.635, y: 14, x: -2.8, rot: 4.8,  scale: 1.08, overY: -3.4, overX: 0.7,  overRot: -1.7 }, // c
    { delay: 0.670, y: 16, x: 2.2,  rot: -4.0, scale: 0.96, overY: -3.8, overX: -0.5, overRot: 1.4 },  // e
    { delay: 0.704, y: 15, x: -2.0, rot: 3.5,  scale: 1.04, overY: -3.5, overX: 0.5,  overRot: -1.3 }, // s
    { delay: 0.738, y: 16, x: 2.4,  rot: -4.2, scale: 0.98, overY: -3.7, overX: -0.6, overRot: 1.5 },  // s
    { delay: 0.785, y: 14, x: -1.2, rot: 5.0,  scale: 1.15, overY: -4.0, overX: 0.3,  overRot: -1.8 }   // . (settles at ~1.06s)
  ];

  chars2_2.forEach((charEl, idx) => {
    const m = chars2_2_meta[idx] || { delay: 0.52 + idx * 0.035, y: 16, x: 0, rot: 0, scale: 1, overY: -4, overX: 0, overRot: 0 };
    masterTl.fromTo(charEl,
      { opacity: 0, y: m.y, x: m.x, rotation: m.rot, scale: m.scale },
      { opacity: 1, y: m.overY, x: m.overX, rotation: m.overRot, scale: 1.04, duration: 0.14, ease: 'power2.out' },
      m.delay
    );
    masterTl.to(charEl,
      { y: 0, x: 0, rotation: 0, scale: 1, duration: 0.14, ease: 'power2.out' },
      m.delay + 0.14
    );
  });

  // --- THIRD LINE: "Pure Oil." ---
  // Soft, luxurious golden reveal as clumsy lines complete their handmade settling
  if (oilText) {
    masterTl.fromTo(oilText,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' },
      0.82
    );
  }

  // Supporting paragraph and CTA buttons entrance
  if (supporting) {
    masterTl.to(supporting, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.90);
  }
  if (ctas) {
    masterTl.to(ctas, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.98);
  }
}
window.initClumsyHandwrittenHeadline = initClumsyHandwrittenHeadline;

// --- 4B. Universal Clumsy Handwritten Animation for All Section Main Headings ---
function initSectionClumsyHeadings() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const headings = document.querySelectorAll('.clumsy-heading');
  if (!headings.length) return;

  headings.forEach(heading => {
    // Preserve full plain text for screen readers & SEO
    if (!heading.hasAttribute('aria-label')) {
      heading.setAttribute('aria-label', heading.textContent.replace(/\s+/g, ' ').trim());
    }

    // Step 1: Dynamically parse and split into lines, words, and clumsy-char elements if not pre-split
    if (!heading.querySelector('.clumsy-char')) {
      let rawLines = [];
      const childSpans = Array.from(heading.children).filter(c => c.tagName === 'SPAN');
      if (childSpans.length > 0 && !heading.innerHTML.includes('<br')) {
        rawLines = childSpans.map(s => s.innerHTML.trim());
      } else {
        rawLines = heading.innerHTML.split(/<br\s*\/?>/i).map(l => l.trim()).filter(Boolean);
      }

      function splitLineContent(lineText) {
        let inEm = false;
        let processed = lineText.replace(/<em>/gi, ' ___EM_START___ ').replace(/<\/em>/gi, ' ___EM_END___ ');
        let rawWords = processed.split(/\s+/).filter(Boolean);

        const wordsOut = [];
        rawWords.forEach(w => {
          if (w === '___EM_START___') {
            inEm = true;
            return;
          }
          if (w === '___EM_END___') {
            inEm = false;
            return;
          }
          const isEm = inEm;
          const chars = Array.from(w).map(ch => {
            const isDot = (ch === '.' || ch === '?' || ch === '!' || ch === ':') ? ' clumsy-dot' : '';
            const content = isEm ? `<em>${ch}</em>` : ch;
            return `<span class="clumsy-char${isDot}">${content}</span>`;
          }).join('');
          wordsOut.push(`<span class="clumsy-word" data-word="${w.replace(/"/g, '')}">${chars}</span>`);
        });

        return wordsOut.join('<span class="clumsy-space">&nbsp;</span>');
      }

      const formattedHtml = rawLines.map((line, lIdx) => {
        return `<span class="hero-title-line clumsy-line" data-line="${lIdx + 1}">${splitLineContent(line)}</span>`;
      }).join('');

      heading.innerHTML = formattedHtml;
    }

    const words = Array.from(heading.querySelectorAll('.clumsy-word'));
    const chars = Array.from(heading.querySelectorAll('.clumsy-char'));
    if (!chars.length) return;

    // Initially prepare characters and words
    gsap.set(chars, { opacity: 0, willChange: 'transform, opacity' });
    gsap.set(words, { willChange: 'transform' });

    // Target ~1.05s total duration for letter entrance and settle
    const targetEnd = 1.05;
    const letterDuration = 0.28;
    const maxStartTime = targetEnd - letterDuration; // ~0.77s
    const avgInterval = maxStartTime / Math.max(chars.length - 1, 1);

    // Master Timeline for this section heading (paused until triggered by ScrollTrigger)
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // FREEZE COMPLETELY STATIC:
        // No looping. No continuous movement. No shaking after the animation finishes.
        gsap.set(words, { clearProps: 'transform,willChange' });
        gsap.set(chars, { clearProps: 'transform,willChange', opacity: 1 });
        heading.classList.add('clumsy-settled');
      }
    });

    // Word entrance: gentle organic rotation, wobble, and slight pixel movement
    words.forEach((wEl, wIdx) => {
      const firstCharInWord = wEl.querySelector('.clumsy-char');
      const charIndex = chars.indexOf(firstCharInWord);
      const wordStartTime = Math.max(0, (charIndex >= 0 ? charIndex : wIdx * 4) * avgInterval - 0.02);

      const isEven = wIdx % 2 === 0;
      const initRot = isEven ? -3.0 : 2.8;
      const initY = 8 + (wIdx % 3);
      const initX = isEven ? -3 : 3;
      const counterRot = isEven ? 1.6 : -1.5;
      const counterY = -1.5;
      const counterX = isEven ? 1.2 : -1.0;

      tl.fromTo(wEl,
        { rotation: initRot, y: initY, x: initX },
        { rotation: counterRot, y: counterY, x: counterX, duration: 0.16, ease: 'power2.out' },
        wordStartTime
      );
      tl.to(wEl, { rotation: -counterRot * 0.35, y: 0.5, x: -counterX * 0.4, duration: 0.14, ease: 'sine.inOut' }, wordStartTime + 0.16);
      tl.to(wEl, { rotation: 0, y: 0, x: 0, duration: 0.14, ease: 'power2.out' }, wordStartTime + 0.30);
    });

    // Character entrance: letter-by-letter with uneven timing, overshoot past baseline, and soft settle
    chars.forEach((cEl, cIdx) => {
      // Slightly uneven timing per character
      const jitter = ((cIdx % 3) - 1) * (avgInterval * 0.22);
      const charStart = Math.min(maxStartTime, Math.max(0, cIdx * avgInterval + jitter));

      const rot = ((cIdx % 5) - 2) * 2.2; // -4.4° to +4.4°
      const xOffset = (((cIdx * 3) % 7) - 3) * 1.0; // -3px to +3px
      const yOffset = 15 + ((cIdx % 4) * 2); // 15px to 21px
      const scaleVal = 0.94 + ((cIdx % 3) * 0.08); // 0.94 to 1.10
      const overY = -3.5 - ((cIdx % 3) * 0.5); // -3.5px to -4.5px overshoot above baseline
      const overX = -xOffset * 0.25;
      const overRot = -rot * 0.35;

      // Phase 1: Letter appears and overshoots final resting position
      tl.fromTo(cEl,
        { opacity: 0, y: yOffset, x: xOffset, rotation: rot, scale: scaleVal },
        { opacity: 1, y: overY, x: overX, rotation: overRot, scale: 1.04, duration: 0.14, ease: 'power2.out' },
        charStart
      );

      // Phase 2: Softly settles into true alignment
      tl.to(cEl,
        { y: 0, x: 0, rotation: 0, scale: 1, duration: 0.14, ease: 'power2.out' },
        charStart + 0.14
      );
    });

    // ScrollTrigger: Play once when the section heading enters the viewport
    ScrollTrigger.create({
      trigger: heading,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        tl.play();
      }
    });
  });
}
window.initSectionClumsyHeadings = initSectionClumsyHeadings;

// --- 5. Main App Initialization on DOM Load ---
document.addEventListener('DOMContentLoaded', () => {
  // 0A. Hero Clumsy Handwritten Headline Entrance
  initClumsyHandwrittenHeadline();

  // 0B. Section Main Headings Clumsy Handwritten Entrance
  initSectionClumsyHeadings();

  // 1. Lenis Smooth Scroll
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // 2. Custom Cursor
  initCustomCursor();

  // 3. Ambient Canvas Initializations
  if (typeof OilDropletsCanvas !== 'undefined') {
    new OilDropletsCanvas('heroCanvas', { particleCount: 22, color: 'rgba(214, 151, 38, ' });
    new OilDropletsCanvas('ctaCanvas', { particleCount: 30, color: 'rgba(214, 151, 38, ' });
  }

  // 4. Hero Scroll Sequence
  if (typeof HeroSequenceManager !== 'undefined') {
    new HeroSequenceManager();
  }

  // 5. Horizontal Scroll Storytelling (Section 2)
  if (typeof HorizontalStoryScroll !== 'undefined') {
    new HorizontalStoryScroll();
  }

  // 6. Section 4 Oil Process Simulation
  if (typeof OilProcessSimulation !== 'undefined') {
    new OilProcessSimulation('processSimCanvas');
  }

  // 7. Section 6 Ingredients Come To Life
  if (typeof IngredientsInteractive !== 'undefined') {
    new IngredientsInteractive();
  }

  // 8. Section 9 3D Showcase
  if (typeof ProductShowcase3D !== 'undefined') {
    new ProductShowcase3D();
  }

  // 9. Sticky Header Navigation Scroll Effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 10. Sound Toggle Button
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      SoundManager.toggleSound();
    });
  }

  // 11. Animated Metrics Counters (Section 11)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const metricElements = document.querySelectorAll('.metric-number');
    metricElements.forEach((el) => {
      const targetVal = parseInt(el.dataset.target || '0', 10);
      const suffix = el.dataset.suffix || '';

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(el, 
            { innerText: 0 }, 
            {
              innerText: targetVal,
              duration: 2.2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function() {
                el.innerText = Math.floor(this.targets()[0].innerText) + suffix;
              }
            }
          );
        }
      });
    });
  }

  // 12. Batch Traceability Widget Handler
  const traceBtn = document.getElementById('traceSearchBtn');
  const traceInput = document.getElementById('traceBatchInput');
  const traceStatus = document.getElementById('traceStatusText');
  const traceMill = document.getElementById('traceMillText');
  const traceHarvest = document.getElementById('traceHarvestText');
  const traceTemp = document.getElementById('traceTempText');
  const traceAcid = document.getElementById('traceAcidText');

  if (traceBtn && traceInput) {
    traceBtn.addEventListener('click', () => {
      const code = traceInput.value.trim().toUpperCase() || 'RUD-2026-OCT';
      SoundManager.playClick();

      traceStatus.textContent = "Verifying Batch Ledger...";
      setTimeout(() => {
        traceStatus.innerHTML = `<span style="color: #264632; font-weight: 600;">✓ Authenticated: The Rudrayya Oil Mill Certified</span>`;
        traceMill.textContent = "The Rudrayya Heritage Wooden Ghani Unit #1";
        traceHarvest.textContent = "Single Estate Harvest, October 2026";
        traceTemp.textContent = "38.2°C (Cold-Press Verified)";
        traceAcid.textContent = "0.22% FFA (Ultra-Pure Quality)";
        showToast(`Batch ${code} verified at The Rudrayya Oil Mill`);
      }, 500);
    });
  }

  // 13. Newsletter Form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      SoundManager.playChime();
      showToast('Thank you! You are now subscribed to The Rudrayya Harvest Gazette.');
      newsletterForm.reset();
    });
  }

  // 14. Add to Pantry / Quick Action Buttons
  document.querySelectorAll('.btn-add-pantry').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.dataset.productName || 'The Rudrayya Pure Oil';
      SoundManager.playChime();
      showToast(`${product} added to your pantry order.`);
    });
  });

  // 15. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#FAF6F0';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '2rem';
        navLinks.style.borderBottom = '1px solid var(--border-light)';
        navLinks.style.boxShadow = 'var(--shadow-dark)';
      }
    });
  }
});
