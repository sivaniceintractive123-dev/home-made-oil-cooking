/* ==========================================================================
   THE RUDRAYYA OIL MILL — SECTION 9: PRODUCT SHOWCASE 3D INTERACTIONS
   3D Rotational Tilt, Specular Light Reflection & Lab Dossier Modal
   ========================================================================== */

class ProductShowcase3D {
  constructor() {
    this.items = document.querySelectorAll('.showcase-item');
    this.modal = document.getElementById('oilDossierModal');
    this.modalTitle = document.getElementById('modalOilTitle');
    this.modalDesc = document.getElementById('modalOilDesc');
    this.modalAcid = document.getElementById('modalAcidVal');
    this.modalPeroxide = document.getElementById('modalPeroxideVal');
    this.modalSmoke = document.getElementById('modalSmokeVal');
    this.modalCoords = document.getElementById('modalCoordsVal');
    this.modalBatch = document.getElementById('modalBatchVal');

    this.dossierData = {
      coconut: {
        name: "The Rudrayya Oil Mill — Raw Virgin Coconut Oil",
        desc: "Extracted solely by slow-turning Vaagai wood press from natural sun-cured Kerala copra. Retains delicate tropical sweetness, natural Lauric acid, and pure unheated nutrients.",
        acid: "0.18% (Standard max 0.5%)",
        peroxide: "0.42 meq/kg (Extremely fresh)",
        smoke: "177°C (350°F) • Ideal for sautéing, baking, raw drizzle & skin nourishment",
        coords: "11.2588° N, 75.7804° E (Malabar Coast)",
        batch: "RUD-2026-OCT-COC09"
      },
      groundnut: {
        name: "The Rudrayya Oil Mill — Heritage Cold-Pressed Groundnut Oil",
        desc: "Slow-pressed from naturally sun-dried heirloom Saurashtra peanuts. High smoke point, rich nutty aroma, ideal for traditional Indian tempering, deep frying, and daily curries.",
        acid: "0.24% (Standard max 0.8%)",
        peroxide: "0.68 meq/kg",
        smoke: "227°C (440°F) • High heat cooking, deep frying, curries",
        coords: "21.5222° N, 70.4579° E (Gir Somnath, Saurashtra)",
        batch: "RUD-2026-OCT-GND14"
      },
      sesame: {
        name: "The Rudrayya Oil Mill — Traditional Wood-Pressed Gingelly (Sesame) Oil",
        desc: "Wild black & golden sesame cold-pressed with palm karupatti (organic palm jaggery). Distinctive golden-bronze color, rich nutty aroma, packed with sesamol and sesamolin.",
        acid: "0.29% (Standard max 1.0%)",
        peroxide: "0.55 meq/kg",
        smoke: "210°C (410°F) • Traditional South Indian cooking, idli podi, gravies",
        coords: "9.9252° N, 78.1198° E (Madurai Mills)",
        batch: "RUD-2026-OCT-SES03"
      }
    };

    this.init();
  }

  init() {
    this.items.forEach(item => {
      const box = item.querySelector('.showcase-3d-box');
      const light = item.querySelector('.showcase-specular-light');
      const type = item.dataset.product;

      // Mouse Move 3D Tilt
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
        const rotateY = ((x - centerX) / centerX) * 14;

        if (box) {
          box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
        }

        if (light) {
          const lightPercentX = (x / rect.width) * 100;
          light.style.background = `linear-gradient(${115 + rotateY}deg, transparent ${lightPercentX - 25}%, rgba(255, 255, 255, 0.35) ${lightPercentX}%, transparent ${lightPercentX + 25}%)`;
        }
      });

      item.addEventListener('mouseleave', () => {
        if (box) {
          box.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
      });

      // Discover button click
      const btn = item.querySelector('.btn-discover');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openDossier(type);
        });
      }
    });

    // Close modal listener
    if (this.modal) {
      const closeBtn = this.modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeDossier());
      }
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeDossier();
      });
    }
  }

  openDossier(type) {
    const data = this.dossierData[type];
    if (!data || !this.modal) return;

    if (this.modalTitle) this.modalTitle.textContent = data.name;
    if (this.modalDesc) this.modalDesc.textContent = data.desc;
    if (this.modalAcid) this.modalAcid.textContent = data.acid;
    if (this.modalPeroxide) this.modalPeroxide.textContent = data.peroxide;
    if (this.modalSmoke) this.modalSmoke.textContent = data.smoke;
    if (this.modalCoords) this.modalCoords.textContent = data.coords;
    if (this.modalBatch) this.modalBatch.textContent = data.batch;

    this.modal.classList.add('open');
    if (typeof SoundManager !== 'undefined') SoundManager.playClick();
  }

  closeDossier() {
    if (this.modal) this.modal.classList.remove('open');
  }
}

window.ProductShowcase3D = ProductShowcase3D;
