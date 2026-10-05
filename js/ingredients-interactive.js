/* ==========================================================================
   THE RUDRAYYA OIL MILL — SECTION 6: INGREDIENTS COME TO LIFE
   Interactive Central Bottle with Orbiting Ingredients & Bezier Connectors
   ========================================================================== */

class IngredientsInteractive {
  constructor() {
    this.section = document.querySelector('.ingredients-interactive-section');
    this.stage = document.querySelector('.ingredients-stage');
    this.centralBottle = document.querySelector('.central-bottle-container');
    this.nodes = document.querySelectorAll('.ingredient-node');
    this.svg = document.querySelector('.connecting-svg-canvas');
    this.detailCard = document.querySelector('.ingredient-detail-card');
    this.titleEl = document.getElementById('botanicalTitle');
    this.quoteEl = document.getElementById('botanicalQuote');
    this.originEl = document.getElementById('botanicalOrigin');
    this.yieldEl = document.getElementById('botanicalYield');
    this.fatEl = document.getElementById('botanicalFat');
    this.aura = document.querySelector('.central-bottle-aura');

    this.activeNode = null;

    this.ingredientsData = {
      coconut: {
        title: "Malabar Coastal Coconut",
        quote: "Rich, natural and carefully selected for traditional wood-press oil making.",
        origin: "Calicut & Kasaragod, Kerala",
        yield: "62% Pure Virgin Oil",
        fat: "High in Lauric Acid & MCTs",
        bgColor: "#F3ECE1",
        auraColor: "radial-gradient(circle, rgba(235, 220, 200, 0.6) 0%, transparent 70%)"
      },
      groundnut: {
        title: "Saurashtra Heirloom Groundnut",
        quote: "Selected for its wholesome natural flavour, golden clarity, and authentic nutty aroma.",
        origin: "Junagadh & Rajkot, Gujarat",
        yield: "48% Golden Cold-Pressed",
        fat: "Rich in MUFA & Vitamin E",
        bgColor: "#F7EFE1",
        auraColor: "radial-gradient(circle, rgba(245, 195, 80, 0.45) 0%, transparent 70%)"
      },
      sesame: {
        title: "Wild Black & Golden Sesame",
        quote: "Deep aroma. Traditional taste. Naturally crafted with natural palm karupatti.",
        origin: "Guntur & Madurai, Tamil Nadu",
        yield: "42% Wood-Pressed Gingelly",
        fat: "Sesamol & Natural Antioxidants",
        bgColor: "#EBE3D7",
        auraColor: "radial-gradient(circle, rgba(190, 125, 45, 0.4) 0%, transparent 70%)"
      },
      jaggery: {
        title: "Organic Palm Jaggery (Karupatti)",
        quote: "Added exclusively to cold-pressed sesame to balance natural bitterness and enhance digestion.",
        origin: "Tirunelveli, Tamil Nadu",
        yield: "Traditional Heritage Blend",
        fat: "Natural Iron & Mineral Rich",
        bgColor: "#EBE0D2",
        auraColor: "radial-gradient(circle, rgba(160, 95, 40, 0.35) 0%, transparent 70%)"
      }
    };

    this.init();
  }

  init() {
    if (!this.stage || !this.centralBottle || !this.nodes.length) return;

    this.renderConnectionLines();
    window.addEventListener('resize', () => this.renderConnectionLines());

    this.nodes.forEach(node => {
      const type = node.dataset.ingredient;

      node.addEventListener('mouseenter', () => this.selectIngredient(type, node));
      node.addEventListener('click', () => this.selectIngredient(type, node));
    });

    // Default to coconut
    this.selectIngredient('coconut', this.nodes[0]);
  }

  selectIngredient(type, nodeEl) {
    const data = this.ingredientsData[type];
    if (!data) return;

    this.activeNode = type;

    // Node active states
    this.nodes.forEach(n => n.classList.remove('active'));
    if (nodeEl) nodeEl.classList.add('active');

    // Update text
    if (this.titleEl) this.titleEl.textContent = data.title;
    if (this.quoteEl) this.quoteEl.textContent = `“${data.quote}”`;
    if (this.originEl) this.originEl.textContent = data.origin;
    if (this.yieldEl) this.yieldEl.textContent = data.yield;
    if (this.fatEl) this.fatEl.textContent = data.fat;

    // Shift section background color and aura
    if (this.section) this.section.style.backgroundColor = data.bgColor;
    if (this.aura) this.aura.style.background = data.auraColor;

    // Update SVG connection lines
    this.updateActivePath(type);

    if (typeof SoundManager !== 'undefined') SoundManager.playChime();
  }

  renderConnectionLines() {
    if (!this.svg) return;

    const stageRect = this.stage.getBoundingClientRect();
    const bottleRect = this.centralBottle.getBoundingClientRect();

    const bottleCenterX = bottleRect.left + bottleRect.width / 2 - stageRect.left;
    const bottleCenterY = bottleRect.top + bottleRect.height / 2 - stageRect.top;

    let svgHtml = '';

    this.nodes.forEach(node => {
      const type = node.dataset.ingredient;
      const nodeRect = node.getBoundingClientRect();
      const nodeX = nodeRect.left + nodeRect.width / 2 - stageRect.left;
      const nodeY = nodeRect.top + nodeRect.height / 2 - stageRect.top;

      // Control points for organic curved bezier
      const cpX = (nodeX + bottleCenterX) / 2;
      const cpY = (nodeY + bottleCenterY) / 2 - 40;

      const pathData = `M ${nodeX} ${nodeY} Q ${cpX} ${cpY} ${bottleCenterX} ${bottleCenterY}`;
      svgHtml += `<path id="path-${type}" class="connection-path ${this.activeNode === type ? 'active' : ''}" d="${pathData}" />`;
    });

    this.svg.innerHTML = svgHtml;
  }

  updateActivePath(activeType) {
    const paths = this.svg.querySelectorAll('.connection-path');
    paths.forEach(p => {
      if (p.id === `path-${activeType}`) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }
}

window.IngredientsInteractive = IngredientsInteractive;
