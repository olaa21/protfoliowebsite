/* map.js — legend, ruled lines, architectural SVG map, project pins
   Depends on: data.js (REL_TYPES, PROJECTS, CONNECTIONS) loaded first  */

const projKeys = Object.keys(PROJECTS);

/* ── LEGEND ─────────────────────────────────────────────────── */
const legendBox    = document.getElementById('legend-box');
const legendToggle = document.getElementById('legend-toggle');

const usedTypes = [...new Set(CONNECTIONS.map(c => c[2]))];
usedTypes.forEach(type => {
  const rt   = REL_TYPES[type];
  const item = document.createElement('div');
  item.className = 'legend-item';

  const sw = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sw.setAttribute('width', '26');
  sw.setAttribute('height', '10');
  sw.style.cssText = 'overflow:visible;flex-shrink:0';

  const swL = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  swL.setAttribute('x1', '0');   swL.setAttribute('y1', '5');
  swL.setAttribute('x2', '26');  swL.setAttribute('y2', '5');
  swL.setAttribute('stroke', 'rgba(28,28,26,0.65)');
  swL.setAttribute('stroke-width', String(Math.min(rt.w, 2)));
  if (rt.dash !== 'none') swL.setAttribute('stroke-dasharray', rt.dash);
  sw.appendChild(swL);

  item.appendChild(sw);
  item.appendChild(document.createTextNode(rt.label));
  legendBox.appendChild(item);
});

legendToggle.addEventListener('click', () => {
  const open = legendBox.classList.toggle('open');
  legendToggle.classList.toggle('open', open);
  legendToggle.setAttribute('aria-expanded', open);
  // Close CV panel if legend opens
  if (open) {
    cvPanel.classList.remove('open');
    cvToggle.classList.remove('open');
    cvToggle.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('click', e => {
  if (!legendToggle.contains(e.target) && !legendBox.contains(e.target)) {
    legendBox.classList.remove('open');
    legendToggle.classList.remove('open');
    legendToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ── CV ACCORDION ────────────────────────────────────────────── */
const cvToggle = document.getElementById('cv-toggle');
const cvPanel  = document.getElementById('cv-panel');

if (cvToggle && cvPanel) {
  cvToggle.addEventListener('click', () => {
    const open = cvPanel.classList.toggle('open');
    cvToggle.classList.toggle('open', open);
    cvToggle.setAttribute('aria-expanded', open);
  });
}


/* ── RULED LINES (bio panel) ────────────────────────────────── */
const ruledLinesEl = document.getElementById('ruled-lines');
const bioSide      = document.querySelector('.bio-side');

function buildRuledLines() {
  ruledLinesEl.innerHTML = '';
  const h = bioSide.offsetHeight || window.innerHeight;
  for (let y = 28; y < h - 20; y += 38) {
    const ln = document.createElement('div');
    ln.className  = 'rule-line';
    ln.style.top  = y + 'px';
    ruledLinesEl.appendChild(ln);
  }
}


/* ── SVG HELPERS ────────────────────────────────────────────── */
const mapSvg = document.getElementById('map-svg');

function nsEl(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}
function svgEl(tag, attrs, text) {
  const e = nsEl(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  if (text !== undefined) e.textContent = text;
  return e;
}


/* ── DRAW MAP ───────────────────────────────────────────────── */
function drawMap() {
  const mapEl = document.getElementById('map-side');
  const w = mapEl.clientWidth;
  const h = mapEl.clientHeight;
  if (!w || !h) return; // not laid out yet

  mapSvg.innerHTML = '';
  mapSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  // White background
  mapSvg.appendChild(svgEl('rect', { x: 0, y: 0, width: w, height: h, fill: '#FAFAF8' }));

  // ── Rotated city-plan coordinate system ──────────────────────
  // Local coordinates are rotated ~18° and scaled to fill the map.
  const deg   = -18;
  const rad   = deg * Math.PI / 180;
  const cos   = Math.cos(rad);
  const sin   = Math.sin(rad);
  const scale = Math.min(w, h) / 520; // ~500 local units = map width
  const ox    = w * 0.09;             // left anchor
  const oy    = h * 0.60;             // vertical anchor

  function toScreen(lx, ly) {
    return {
      x: ox + (lx * cos - ly * sin) * scale,
      y: oy + (lx * sin + ly * cos) * scale
    };
  }

  function rectPath(lx, ly, rw, rh) {
    const tl = toScreen(lx,      ly);
    const tr = toScreen(lx + rw, ly);
    const br = toScreen(lx + rw, ly + rh);
    const bl = toScreen(lx,      ly + rh);
    return [
      `M${tl.x.toFixed(1)},${tl.y.toFixed(1)}`,
      `L${tr.x.toFixed(1)},${tr.y.toFixed(1)}`,
      `L${br.x.toFixed(1)},${br.y.toFixed(1)}`,
      `L${bl.x.toFixed(1)},${bl.y.toFixed(1)}`,
      'Z'
    ].join(' ');
  }

  // ── Roads ────────────────────────────────────────────────────
  const majorRoads = [
    [[-20,-200],[500,-200]], [[0,-220],[0,380]],     [[120,-230],[120,380]],
    [[240,-230],[240,380]],  [[-20,-80],[500,-80]],  [[-20,60],[500,60]],
    [[-20,190],[500,190]],   [[-20,310],[500,310]],
    [[-30,-260],[80,-200]],  [[-50,-260],[40,-200]], [[-70,-270],[20,-200]],
  ];
  majorRoads.forEach(([[x1,y1],[x2,y2]]) => {
    const a = toScreen(x1, y1), b = toScreen(x2, y2);
    mapSvg.appendChild(svgEl('line', {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: 'rgba(28,28,26,0.12)',
      'stroke-width': 3 * scale,
      'stroke-linecap': 'round',
      fill: 'none'
    }));
  });

  const minorRoads = [
    [[60,-230],[60,380]],   [[180,-230],[180,380]], [[300,-230],[300,380]],
    [[-20,0],[500,0]],      [[-20,130],[500,130]],  [[-20,250],[500,250]],
  ];
  minorRoads.forEach(([[x1,y1],[x2,y2]]) => {
    const a = toScreen(x1, y1), b = toScreen(x2, y2);
    mapSvg.appendChild(svgEl('line', {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      stroke: 'rgba(28,28,26,0.07)',
      'stroke-width': 1.5 * scale,
      'stroke-linecap': 'round',
      fill: 'none'
    }));
  });

  // ── City blocks ──────────────────────────────────────────────
  // Each building: [localX, localY, w, h, variant]
  // variant 0 = outline, 1 = light fill
  const cityBlocks = [
    { bx:4,   by:-195, buildings:[[2,2,18,22,1],[22,2,14,16,0],[38,2,20,22,1],[60,2,12,18,0],[74,2,18,22,1],[2,26,14,14,0],[18,26,20,14,1],[40,26,16,14,0],[58,26,22,14,1]] },
    { bx:64,  by:-195, buildings:[[2,2,22,20,0],[26,2,14,20,1],[42,2,18,20,0],[2,24,30,12,1],[34,24,24,12,0]] },
    { bx:124, by:-195, buildings:[[2,2,14,18,1],[18,2,20,18,0],[40,2,14,18,1],[2,22,28,14,0],[32,22,20,14,1]] },
    { bx:4,   by:-76,  buildings:[[2,2,24,20,0],[28,2,16,20,1],[46,2,24,20,0],[2,24,18,16,1],[22,24,22,16,0],[46,24,20,16,1],[2,42,28,12,0],[32,42,34,12,1]] },
    { bx:64,  by:-76,  buildings:[[2,2,18,22,1],[22,2,22,22,0],[46,2,14,22,1],[2,26,30,14,0],[34,26,26,14,1]] },
    { bx:124, by:-76,  buildings:[[2,2,16,18,0],[20,2,20,18,1],[42,2,12,18,0],[2,22,24,16,1],[28,22,26,16,0]] },
    { bx:184, by:-76,  buildings:[[2,2,20,20,1],[24,2,16,20,0],[42,2,18,20,1],[2,24,22,14,0],[26,24,30,14,1]] },
    { bx:4,   by:64,   buildings:[[2,2,22,18,1],[26,2,18,18,0],[46,2,22,18,1],[2,22,16,14,0],[20,22,24,14,1],[46,22,18,14,0],[2,38,30,12,1],[34,38,30,12,0]] },
    { bx:64,  by:64,   buildings:[[2,2,20,20,0],[24,2,14,20,1],[40,2,18,20,0],[2,24,26,14,1],[30,24,26,14,0]] },
    { bx:124, by:64,   buildings:[[2,2,14,18,1],[18,2,22,18,0],[42,2,16,18,1],[2,22,20,14,0],[24,22,30,14,1]] },
    { bx:184, by:64,   buildings:[[2,2,18,20,0],[22,2,20,20,1],[44,2,14,20,0],[2,24,26,14,1],[30,24,22,14,0]] },
    { bx:4,   by:194,  buildings:[[2,2,16,22,0],[20,2,22,22,1],[44,2,16,22,0],[2,26,28,14,1],[32,26,26,14,0]] },
    { bx:64,  by:194,  buildings:[[2,2,20,20,1],[24,2,16,20,0],[42,2,18,20,1],[2,24,24,14,0],[28,24,28,14,1]] },
    { bx:124, by:194,  buildings:[[2,2,14,18,0],[18,2,20,18,1],[40,2,16,18,0],[2,22,28,14,1],[32,22,22,14,0]] },
    { bx:184, by:194,  buildings:[[2,2,22,20,1],[26,2,16,20,0],[44,2,14,20,1],[2,24,30,14,0],[34,24,22,14,1]] },
    { bx:4,   by:314,  buildings:[[2,2,18,18,1],[22,2,20,18,0],[44,2,16,18,1],[2,22,26,12,0],[30,22,28,12,1]] },
    { bx:64,  by:314,  buildings:[[2,2,16,20,0],[20,2,18,20,1],[40,2,20,20,0],[2,24,22,12,1],[26,24,30,12,0]] },
    { bx:124, by:314,  buildings:[[2,2,20,18,1],[24,2,14,18,0],[40,2,18,18,1],[2,22,24,12,0],[28,22,26,12,1]] },
    { bx:-45, by:-260, buildings:[[0,0,12,16,0],[14,2,9,14,1],[25,0,10,12,0]] },
    { bx:-30, by:-238, buildings:[[0,0,8,10,1],[10,2,10,8,0]] },
    { bx:20,  by:-235, buildings:[[0,0,14,18,0],[16,2,10,14,1]] },
    { bx:184, by:314,  buildings:[[2,2,20,16,0],[24,2,14,16,1],[2,20,28,12,0]] },
  ];

  cityBlocks.forEach(block => {
    block.buildings.forEach(([lx, ly, bw, bh, v]) => {
      const d = rectPath(block.bx + lx, block.by + ly, bw, bh);
      mapSvg.appendChild(svgEl('path', { d, class: v === 1 ? 'bld-fill' : 'bld' }));
    });
  });

  // ── Semantic connection lines ─────────────────────────────────
  CONNECTIONS.forEach(([nA, nB, relType]) => {
    const pA = PROJECTS[nA], pB = PROJECTS[nB];
    if (!pA || !pB) return;
    const rt = REL_TYPES[relType];
    const x1 = pA.mx / 100 * w,  y1 = pA.my / 100 * h;
    const x2 = pB.mx / 100 * w,  y2 = pB.my / 100 * h;
    const pathD = `M${x1},${y1} Q${x2},${y1} ${x2},${y2}`;

    // Halo (softens line against map texture)
    mapSvg.appendChild(svgEl('path', {
      d: pathD,
      stroke: 'rgba(250,250,248,0.85)',
      'stroke-width': rt.w + 3,
      fill: 'none',
      'stroke-linecap': 'round'
    }));

    // Relationship line
    const line = svgEl('path', {
      d: pathD,
      stroke: rt.stroke,
      'stroke-width': rt.w,
      fill: 'none',
      'stroke-linecap': 'round'
    });
    if (rt.dash !== 'none') line.setAttribute('stroke-dasharray', rt.dash);
    mapSvg.appendChild(line);
  });

  // ── Project pins ─────────────────────────────────────────────
  projKeys.forEach(key => {
    const p  = PROJECTS[key];
    const cx = p.mx / 100 * w;
    const cy = p.my / 100 * h;
    const g  = nsEl('g');
    g.setAttribute('class', 'pin-group');

    // Pulsing outer glow ring (CSS animation)
    const pulseRing = svgEl('circle', {
      cx, cy, r: 18,
      fill: 'none',
      stroke: p.color,
      'stroke-width': 1.2,
      opacity: 0,
      class: 'pin-pulse'
    });
    // Inline animation via style attribute so it works without a stylesheet rule
    pulseRing.style.animation = `pinPulse 2.4s ease-out infinite`;
    pulseRing.style.animationDelay = `${projKeys.indexOf(key) * 0.5}s`;
    g.appendChild(pulseRing);

    // Filled colour background circle — the main visible hit target
    g.appendChild(svgEl('circle', {
      cx, cy, r: 16,
      fill: p.color,
      opacity: 0.18
    }));

    // White ring with coloured stroke
    g.appendChild(svgEl('circle', {
      cx, cy, r: 13,
      fill: '#FAFAF8',
      stroke: p.color,
      'stroke-width': 2,
      class: 'pin-ring'
    }));

    // Solid filled centre dot
    g.appendChild(svgEl('circle', {
      cx, cy, r: 6,
      fill: p.color,
      opacity: 1
    }));

    // "Click" cursor hint — tiny arrow icon at top-right of pin
    g.appendChild(svgEl('text', {
      x: cx + 11, y: cy - 11,
      'text-anchor': 'middle',
      'font-family': 'sans-serif',
      'font-size': 11,
      fill: p.color,
      opacity: 0.85,
      'pointer-events': 'none'
    }, '↗'));

    // Label callout (appears on hover)
    const isRight = p.mx > 50;
    const lDir    = isRight ? -1 : 1;
    const lx      = cx + lDir * 32;
    const lw      = 160;
    const lbgX    = lDir < 0 ? lx - lw : lx;

    g.appendChild(svgEl('rect', {
      x: lbgX, y: cy - 20, width: lw, height: 40, rx: 2,
      fill: '#FAFAF8',
      stroke: p.color,
      'stroke-width': 1.2,
      class: 'pin-lbl-bg'
    }));
    g.appendChild(svgEl('line', {
      x1: lDir < 0 ? cx - 13 : cx + 13, y1: cy,
      x2: lDir < 0 ? lx      : lx,      y2: cy,
      stroke: p.color, 'stroke-width': 0.8,
      class: 'pin-lbl-bg'
    }));

    const tX          = lDir < 0 ? lx - lw / 2 : lx + lw / 2;
    const displayName = key.length > 22 ? key.slice(0, 21) + '…' : key;

    g.appendChild(svgEl('text', {
      x: tX, y: cy - 5,
      'text-anchor': 'middle',
      'font-family': 'EB Garamond, serif',
      'font-size': 13, 'font-weight': '600',
      fill: p.color, class: 'pin-lbl-txt'
    }, displayName));
    g.appendChild(svgEl('text', {
      x: tX, y: cy + 9,
      'text-anchor': 'middle',
      'font-family': 'Space Mono, monospace',
      'font-size': 8.5,
      fill: 'rgba(28,28,26,0.5)', class: 'pin-lbl-txt'
    }, p.cat));

    g.addEventListener('click', () => openModal(key));
    g.addEventListener('mouseenter', () => {
      document.getElementById('coord-display').textContent =
        `${(40.7 + p.my * 0.001).toFixed(4)}° N, ${(74.0 - p.mx * 0.001).toFixed(4)}° W`;
    });

    mapSvg.appendChild(g);
  });

  // Inject pulse keyframe once into the document
  if (!document.getElementById('pin-pulse-style')) {
    const s = document.createElement('style');
    s.id = 'pin-pulse-style';
    s.textContent = `
      @keyframes pinPulse {
        0%   { r: 14; opacity: 0.6; }
        70%  { r: 26; opacity: 0; }
        100% { r: 26; opacity: 0; }
      }
      .pin-group:hover .pin-ring { r: 16; }
      .pin-group:hover .pin-pulse { animation: none; opacity: 0; }
    `;
    document.head.appendChild(s);
  }
}


/* ── INIT ───────────────────────────────────────────────────── */
function init() {
  buildRuledLines();
  drawMap();
}

// ResizeObserver redraws whenever the map container changes size
const ro = new ResizeObserver(() => { drawMap(); buildRuledLines(); });
ro.observe(document.getElementById('map-side'));

// Wait two animation frames so CSS layout is applied before first draw
requestAnimationFrame(() => requestAnimationFrame(init));