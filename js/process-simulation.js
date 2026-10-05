/* ==========================================================================
   THE RUDRAYYA OIL MILL — SECTION 4: "WATCH NATURE BECOME OIL"
   Interactive Canvas Physics & Mechanical Extraction Simulation
   Seeds/Copra -> Cleaning -> Crushing -> Cold-Press -> Filtering -> Bottle
   ========================================================================== */

class OilProcessSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.activeStep = 0;
    this.speed = 1.0;
    this.isPlaying = true;
    this.time = 0;

    // Simulation components
    this.seeds = [];
    this.oilDrops = [];
    this.bottleFill = 0; // 0 to 1
    this.pestleAngle = 0;

    // UI elements
    this.tabs = document.querySelectorAll('.process-tab');
    this.tempDisplay = document.getElementById('simTemp');
    this.rpmDisplay = document.getElementById('simRpm');
    this.yieldDisplay = document.getElementById('simYield');
    this.stepTitle = document.getElementById('processCurrentTitle');
    this.stepDesc = document.getElementById('processCurrentDesc');
    this.stepNum = document.getElementById('processCurrentNum');
    this.stepBadge = document.getElementById('processCurrentBadge');

    this.stepsData = [
      {
        num: "01",
        title: "Seed & Copra Feeding",
        desc: "Raw sun-cured copra and heirloom groundnuts enter the tapered feeding hopper. Only clean, unblemished ingredients pass the initial sensor gate.",
        badge: "Moisture Content: 4.8%",
        temp: "28.5°C",
        rpm: "0 RPM",
        yield: "0.0 L"
      },
      {
        num: "02",
        title: "Natural Air & Sieve Cleaning",
        desc: "Gentle vibratory airflow removes fine dust, micro-husks, and debris without washing, preserving the natural enzymes and aromatic oils.",
        badge: "Purity Index: 99.9%",
        temp: "29.2°C",
        rpm: "6 RPM",
        yield: "0.2 L"
      },
      {
        num: "03",
        title: "Vaagai Wood Pestle Crushing",
        desc: "The heavy Vaagai wood pestle turns in a seasoned granite mortar at slow, gentle speeds, gently breaking cell walls without generating heat.",
        badge: "Timber: Aged Vaagai Hardwood",
        temp: "34.1°C",
        rpm: "12 RPM",
        yield: "1.4 L"
      },
      {
        num: "04",
        title: "Cold-Press Friction Extraction",
        desc: "Under traditional slow mechanical pressure, natural golden oil begins to seep through microscopic channels, completely free of chemical solvents.",
        badge: "Press Temp: Max 38.2°C",
        temp: "37.8°C",
        rpm: "14 RPM",
        yield: "4.8 L"
      },
      {
        num: "05",
        title: "Unbleached Cotton Muslin Filtering",
        desc: "The warm raw oil gravity-drips through 4 layers of organic unbleached cotton muslin cloth. Zero chemical bleach or artificial clarification.",
        badge: "Sediment Retention: 100%",
        temp: "32.0°C",
        rpm: "8 RPM",
        yield: "8.6 L"
      },
      {
        num: "06",
        title: "Pure Apothecary Glass Bottling",
        desc: "The crystal clear golden elixir fills UV-shielded apothecary glass bottles, capped with natural cork stoppers to lock in farm-fresh vitality.",
        badge: "Status: Finished Master Batch",
        temp: "28.0°C",
        rpm: "0 RPM",
        yield: "12.5 L"
      }
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.setupTabs();
    this.setupControls();
    this.setupScrollTrigger();

    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = this.canvas.width = parent.clientWidth;
    this.height = this.canvas.height = parent.clientHeight;
  }

  setupTabs() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        this.setStep(index);
        if (typeof SoundManager !== 'undefined') SoundManager.playClick();
      });
    });
  }

  setupControls() {
    const playBtn = document.getElementById('simPlayBtn');
    const speedBtn = document.getElementById('simSpeedBtn');

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.isPlaying = !this.isPlaying;
        playBtn.innerHTML = this.isPlaying 
          ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`
          : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume`;
      });
    }

    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        this.speed = this.speed === 1.0 ? 2.0 : (this.speed === 2.0 ? 0.5 : 1.0);
        speedBtn.textContent = `${this.speed}x Speed`;
      });
    }
  }

  setupScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
      trigger: '.process-section',
      start: 'top 60%',
      end: 'bottom 40%',
      onUpdate: (self) => {
        const step = Math.min(
          this.stepsData.length - 1,
          Math.floor(self.progress * this.stepsData.length)
        );
        if (step !== this.activeStep) {
          this.setStep(step);
        }
      }
    });
  }

  setStep(index) {
    if (index < 0 || index >= this.stepsData.length) return;
    this.activeStep = index;

    // Update tab classes
    this.tabs.forEach((t, i) => t.classList.toggle('active', i === index));

    // Update data telemetry
    const data = this.stepsData[index];
    if (this.stepNum) this.stepNum.textContent = data.num;
    if (this.stepTitle) this.stepTitle.textContent = data.title;
    if (this.stepDesc) this.stepDesc.textContent = data.desc;
    if (this.stepBadge) this.stepBadge.textContent = data.badge;

    if (this.tempDisplay) this.tempDisplay.textContent = data.temp;
    if (this.rpmDisplay) this.rpmDisplay.textContent = data.rpm;
    if (this.yieldDisplay) this.yieldDisplay.textContent = data.yield;
  }

  animate() {
    if (this.isPlaying) {
      this.time += 0.02 * this.speed;
      this.updatePhysics();
    }

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  updatePhysics() {
    const W = this.width;
    const H = this.height;

    // 1. Spawning raw ingredients (copra & groundnuts)
    if (this.activeStep <= 2 && Math.random() < 0.25 * this.speed) {
      this.seeds.push({
        x: W * 0.18 + (Math.random() - 0.5) * 40,
        y: H * 0.1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 2 + 1.5,
        size: Math.random() * 7 + 5,
        type: Math.random() > 0.5 ? 'coconut' : 'groundnut',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1
      });
    }

    // Update seeds
    for (let i = this.seeds.length - 1; i >= 0; i--) {
      const s = this.seeds[i];
      s.x += s.vx;
      s.y += s.vy;
      s.rotation += s.rotSpeed;

      // Seed entering pestle mortar zone
      if (s.y > H * 0.45 && s.x > W * 0.28 && s.x < W * 0.52) {
        // Crushed into oil!
        if (this.activeStep >= 2) {
          for (let k = 0; k < 3; k++) {
            this.oilDrops.push({
              x: s.x,
              y: s.y,
              vx: (Math.random() - 0.5) * 1.2,
              vy: Math.random() * 2 + 1,
              size: Math.random() * 5 + 3,
              alpha: 0.9,
              stage: 'extract'
            });
          }
        }
        this.seeds.splice(i, 1);
        continue;
      }

      if (s.y > H + 20) this.seeds.splice(i, 1);
    }

    // 2. Pestle rotation
    if (this.activeStep >= 2) {
      this.pestleAngle += 0.03 * this.speed;
    }

    // 3. Oil droplets fluid simulation
    if (this.activeStep >= 3 && Math.random() < 0.4 * this.speed) {
      this.oilDrops.push({
        x: W * 0.48 + (Math.random() - 0.5) * 15,
        y: H * 0.55,
        vx: 1.2 + Math.random() * 0.8,
        vy: 0.5,
        size: Math.random() * 6 + 4,
        alpha: 0.95,
        stage: 'pipe'
      });
    }

    // Update oil drops
    for (let i = this.oilDrops.length - 1; i >= 0; i--) {
      const d = this.oilDrops[i];

      if (d.stage === 'pipe') {
        // Travel through golden conduit towards filter
        d.x += d.vx * this.speed;
        d.y += d.vy * this.speed;

        if (d.x > W * 0.65) {
          d.stage = 'filter';
          d.vx = 0;
          d.vy = 2.2;
        }
      } else if (d.stage === 'filter') {
        // Gravity drip through cotton cloth
        d.y += d.vy * this.speed;

        // Drip into bottle
        if (d.y > H * 0.72) {
          d.stage = 'bottle';
          d.vx = 0;
          d.vy = 2.5;
        }
      } else if (d.stage === 'bottle') {
        d.y += d.vy * this.speed;

        // Reached bottle bottom / liquid level
        const bottleBottomY = H * 0.88;
        if (d.y >= bottleBottomY - this.bottleFill * 80) {
          this.bottleFill = Math.min(1.0, this.bottleFill + 0.003 * this.speed);
          this.oilDrops.splice(i, 1);
          continue;
        }
      }

      if (d.y > H + 20) this.oilDrops.splice(i, 1);
    }
  }

  render() {
    const W = this.width;
    const H = this.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, W, H);

    // Grid lines for high-precision engineering blueprint feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // 1. HOPPER (Left Stage)
    ctx.save();
    ctx.fillStyle = '#2A2722';
    ctx.strokeStyle = '#484036';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W * 0.1, H * 0.08);
    ctx.lineTo(W * 0.26, H * 0.08);
    ctx.lineTo(W * 0.21, H * 0.32);
    ctx.lineTo(W * 0.15, H * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hopper Label
    ctx.fillStyle = '#C2B6A6';
    ctx.font = '10px Plus Jakarta Sans, sans-serif';
    ctx.fillText('01: RAW HOPPER', W * 0.12, H * 0.06);
    ctx.restore();

    // 2. SEEDS / COPRA PARTICLES
    for (const s of this.seeds) {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      if (s.type === 'coconut') {
        ctx.fillStyle = '#E8E2D8'; // Coconut meat ivory
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4A2E1B'; // Coconut shell rim
        ctx.beginPath();
        ctx.arc(0, 0, s.size, 0, Math.PI);
        ctx.fill();
      } else {
        // Groundnut oval
        ctx.fillStyle = '#D69D4A';
        ctx.beginPath();
        ctx.ellipse(0, 0, s.size * 1.3, s.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. TRADITIONAL VAAGAI WOOD MORTAR & ROTATING PESTLE (Center Stage)
    ctx.save();
    const mortarX = W * 0.40;
    const mortarY = H * 0.52;
    const mortarRadius = 75;

    // Outer Granite / Wood Base
    const mortarGrad = ctx.createLinearGradient(mortarX - 80, mortarY - 20, mortarX + 80, mortarY + 60);
    mortarGrad.addColorStop(0, '#3A2E26');
    mortarGrad.addColorStop(1, '#1A1410');

    ctx.fillStyle = mortarGrad;
    ctx.strokeStyle = '#685140';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(mortarX, mortarY, mortarRadius, 0, Math.PI);
    ctx.lineTo(mortarX + mortarRadius + 15, mortarY + 50);
    ctx.lineTo(mortarX - mortarRadius - 15, mortarY + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Vaagai Wood pestle (Rotating angled beam)
    ctx.save();
    ctx.translate(mortarX, mortarY - 10);
    ctx.rotate(Math.sin(this.pestleAngle) * 0.25);

    const pestleGrad = ctx.createLinearGradient(-15, -90, 15, 30);
    pestleGrad.addColorStop(0, '#5A3D28');
    pestleGrad.addColorStop(1, '#2E1C12');

    ctx.fillStyle = pestleGrad;
    ctx.strokeStyle = '#8E6746';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-18, -90, 36, 120, 8);
    ctx.fill();
    ctx.stroke();

    // Pestle wood grain rings
    ctx.strokeStyle = 'rgba(214, 151, 38, 0.3)';
    ctx.beginPath();
    ctx.arc(0, -60, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Mortar Label
    ctx.fillStyle = '#D69726';
    ctx.font = '10px Plus Jakarta Sans, sans-serif';
    ctx.fillText('03: VAAGAI MARACHEKKU (14 RPM)', mortarX - 80, mortarY + 75);
    ctx.restore();

    // 4. TRANSPARENT GOLDEN OIL CONDUIT / SPOUT
    ctx.save();
    ctx.strokeStyle = 'rgba(214, 151, 38, 0.4)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(mortarX + 60, mortarY + 15);
    ctx.lineTo(W * 0.65, mortarY + 15);
    ctx.stroke();

    // Glowing core
    ctx.strokeStyle = 'rgba(255, 220, 120, 0.7)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(mortarX + 60, mortarY + 15);
    ctx.lineTo(W * 0.65, mortarY + 15);
    ctx.stroke();
    ctx.restore();

    // 5. COTTON MUSLIN FILTER CHAMBER
    ctx.save();
    const filterX = W * 0.65;
    const filterY = H * 0.60;

    // Muslin conical fabric
    ctx.fillStyle = 'rgba(240, 235, 225, 0.85)';
    ctx.strokeStyle = '#C2B6A6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(filterX - 35, filterY);
    ctx.lineTo(filterX + 35, filterY);
    ctx.lineTo(filterX, filterY + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Filter mesh pattern
    ctx.strokeStyle = 'rgba(180, 150, 110, 0.4)';
    ctx.lineWidth = 1;
    for (let j = -20; j <= 20; j += 8) {
      ctx.beginPath();
      ctx.moveTo(filterX + j, filterY + 10);
      ctx.lineTo(filterX, filterY + 45);
      ctx.stroke();
    }

    ctx.fillStyle = '#C2B6A6';
    ctx.font = '10px Plus Jakarta Sans, sans-serif';
    ctx.fillText('05: ORGANIC MUSLIN FILTER', filterX - 60, filterY - 12);
    ctx.restore();

    // 6. APOTHECARY GLASS BOTTLE & LIQUID MENISCUS (Right Stage)
    ctx.save();
    const bottleX = W * 0.82;
    const bottleY = H * 0.65;
    const bottleW = 70;
    const bottleH = 120;

    // Bottle outline (Glass)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Neck
    ctx.roundRect(bottleX + 22, bottleY - 25, 26, 25, 4);
    // Body
    ctx.roundRect(bottleX, bottleY, bottleW, bottleH, 8);
    ctx.fill();
    ctx.stroke();

    // Cork Stopper
    ctx.fillStyle = '#8B6543';
    ctx.roundRect(bottleX + 24, bottleY - 38, 22, 14, 3);
    ctx.fill();

    // Filled Oil in Bottle
    const currentLiquidH = bottleH * this.bottleFill;
    if (currentLiquidH > 0) {
      const liquidGrad = ctx.createLinearGradient(bottleX, bottleY + bottleH - currentLiquidH, bottleX, bottleY + bottleH);
      liquidGrad.addColorStop(0, 'rgba(255, 215, 90, 0.95)');
      liquidGrad.addColorStop(1, 'rgba(214, 151, 38, 0.95)');

      ctx.fillStyle = liquidGrad;
      ctx.beginPath();
      ctx.roundRect(bottleX + 2, bottleY + bottleH - currentLiquidH, bottleW - 4, currentLiquidH - 2, 6);
      ctx.fill();

      // Liquid meniscus wave
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bottleX + 2, bottleY + bottleH - currentLiquidH);
      ctx.lineTo(bottleX + bottleW - 2, bottleY + bottleH - currentLiquidH);
      ctx.stroke();
    }

    // Label on Bottle
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(bottleX + 12, bottleY + 30, bottleW - 24, 45);
    ctx.fillStyle = '#26160F';
    ctx.font = 'bold 5px Plus Jakarta Sans, sans-serif';
    ctx.fillText('THE RUDRAYYA', bottleX + 14, bottleY + 45);
    ctx.fillText('OIL MILL', bottleX + 22, bottleY + 53);
    ctx.fillStyle = '#D69726';
    ctx.fillText('PURE COLD-PRESSED', bottleX + 13, bottleY + 64);

    // Bottle Label Title
    ctx.fillStyle = '#D69726';
    ctx.font = '10px Plus Jakarta Sans, sans-serif';
    ctx.fillText('06: THE RUDRAYYA BOTTLE', bottleX - 25, bottleY + bottleH + 25);
    ctx.restore();

    // 7. RENDER OIL DROPLETS
    for (const d of this.oilDrops) {
      ctx.save();
      const dropGrad = ctx.createRadialGradient(d.x - 2, d.y - 2, 1, d.x, d.y, d.size);
      dropGrad.addColorStop(0, 'rgba(255, 240, 180, 0.95)');
      dropGrad.addColorStop(0.7, 'rgba(214, 151, 38, 0.85)');
      dropGrad.addColorStop(1, 'rgba(180, 110, 20, 0.6)');

      ctx.fillStyle = dropGrad;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

window.OilProcessSimulation = OilProcessSimulation;
