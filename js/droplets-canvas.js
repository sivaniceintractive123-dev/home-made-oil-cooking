/* ==========================================================================
   THE RUDRAYYA OIL MILL — GOLDEN OIL DROPLETS CANVAS SIMULATION
   Ambient viscous liquid particles with soft caustics and cursor gravity
   ========================================================================== */

class OilDropletsCanvas {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.options = Object.assign({
      particleCount: 28,
      color: 'rgba(214, 151, 38, ',
      minSize: 4,
      maxSize: 18,
      speed: 0.4,
      interactive: true
    }, options);

    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 120 };
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    if (this.options.interactive) {
      window.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      window.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });
    }

    this.createParticles();
    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.width = this.canvas.width = parent.clientWidth;
      this.height = this.canvas.height = parent.clientHeight;
    } else {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: -(Math.random() * this.options.speed + 0.15), // Gently drift upwards like light oil in water
        opacity: Math.random() * 0.4 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2,
        wobble: Math.random() * 2 + 1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx + Math.sin(p.pulseAngle) * 0.25;
      p.y += p.vy;
      p.pulseAngle += p.pulseSpeed;

      // Mouse gentle interaction
      if (this.options.interactive) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }
      }

      // Wrap around bounds
      if (p.y < -p.size) {
        p.y = this.height + p.size;
        p.x = Math.random() * this.width;
      }
      if (p.x < -p.size) p.x = this.width + p.size;
      if (p.x > this.width + p.size) p.x = -p.size;

      // Draw droplet with radial caustic gradient
      const currentOpacity = p.opacity * (0.8 + 0.2 * Math.sin(p.pulseAngle));
      const grad = this.ctx.createRadialGradient(
        p.x - p.size * 0.25, 
        p.y - p.size * 0.25, 
        p.size * 0.1, 
        p.x, 
        p.y, 
        p.size
      );
      grad.addColorStop(0, 'rgba(255, 235, 175, ' + (currentOpacity * 1.4) + ')');
      grad.addColorStop(0.5, this.options.color + currentOpacity + ')');
      grad.addColorStop(1, this.options.color + '0)');

      this.ctx.beginPath();
      // Slightly squished teardrop shape
      this.ctx.ellipse(p.x, p.y, p.size, p.size * (1 + 0.12 * Math.sin(p.pulseAngle * 1.5)), 0, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Delicate specular highlight
      this.ctx.beginPath();
      this.ctx.arc(p.x - p.size * 0.35, p.y - p.size * 0.35, p.size * 0.22, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, ' + (currentOpacity * 1.6) + ')';
      this.ctx.fill();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
}

window.OilDropletsCanvas = OilDropletsCanvas;
