/* modal.js — project modal: open/close, tab content builders
   Depends on: data.js (PROJECTS, CONNECTIONS) loaded first        */


/* ── HELPERS ────────────────────────────────────────────────── */
function getRelated(key) {
  return CONNECTIONS
    .filter(c => c[0] === key || c[1] === key)
    .map(c => ({
      other: c[0] === key ? c[1] : c[0],
      rel:   c[2],
      label: c[3]
    }));
}


/* ── CONTENT BUILDERS ───────────────────────────────────────── */
function buildOverview(key) {
  const p       = PROJECTS[key];
  const related = getRelated(key);

  const quoteHTML = p.quote
    ? `<div class="quote-block">
         <div class="quote-text">${p.quote.text}</div>
         <div class="quote-attr">${p.quote.attr}</div>
       </div>`
    : '';

  const resultsHTML = p.results
    ? `<div class="section-rule">Classification Results</div>
       <table class="rt">
         <thead><tr><th>Class</th><th>Precision</th><th>Recall</th><th>F-1</th></tr></thead>
         <tbody>${p.results.map(r =>
           `<tr><td>${r.cls}</td><td>${r.precision}</td><td>${r.recall}</td><td>${r.f1}</td></tr>`
         ).join('')}</tbody>
       </table>`
    : '';

  const relatedHTML = related.length
    ? `<div class="section-rule">Connected Projects</div>
       <div class="related-row">
         ${related.map(r => {
           const safeKey = r.other.replace(/'/g, "\\'");
           const dot     = PROJECTS[r.other]?.color || '#888';
           return `<div class="related-badge" onclick="openModal('${safeKey}')">
                     <div class="related-badge-dot" style="background:${dot}"></div>
                     <span class="related-badge-text">${r.other}</span>
                     <span class="related-badge-rel">· ${r.label}</span>
                   </div>`;
         }).join('')}
       </div>`
    : '';

  return `
    ${p.images && p.images.length > 0
  ? `<img class="project-hero-img" src="${p.images[p.images.length - 1].src}" alt="${p.images[p.images.length - 1].label}">`
  : `<div class="project-hero-ph">[ Add project photograph here ]</div>`
}
    <div class="meta-row">
      <div class="meta-cell"><div class="meta-label">Discipline</div><div class="meta-value">${p.cat}</div></div>
      <div class="meta-cell"><div class="meta-label">Context</div><div class="meta-value">${p.sub}</div></div>
      <div class="meta-cell"><div class="meta-label">Timeline</div><div class="meta-value">${p.date}</div></div>
    </div>
    ${quoteHTML}
    ${p.overview.map(t => `<p class="project-body-text">${t}</p>`).join('')}
    <div class="section-rule">Skills &amp; Methods</div>
    <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    ${resultsHTML}
    ${relatedHTML}
  `;
}

function buildProcess(key) {
  const steps = PROJECTS[key].process.map((s, i) => `
    <div class="step-row">
      <div class="step-num">0${i + 1}</div>
      <div>
        <div class="step-title">${s.title}</div>
        <div class="step-text">${s.text}</div>
      </div>
    </div>`).join('');
  return `<div class="section-rule">Process Documentation</div><div class="steps-list">${steps}</div>`;
}

function buildVisuals(key) {
  const p = PROJECTS[key];

  // If no images array yet, fall back to the old placeholder grid
  if (!p.images || p.images.length === 0) {
    return `<div class="section-rule">Visual Documentation</div>
            <p style="font-size:11px;color:var(--muted);font-family:'Space Mono',monospace;">
              No images added yet.
            </p>`;
  }

  const pairs = [];
  for (let i = 0; i < p.images.length; i += 2) {
    pairs.push([p.images[i], p.images[i + 1]]);
  }

  return `
    <div class="section-rule">Visual Documentation</div>
    ${pairs.map(pair => `
      <div class="img-grid-2">
        ${pair.filter(Boolean).map(img => `
          <figure class="img-card">
            <img src="${img.src}" alt="${img.label}" loading="lazy">
            <figcaption class="img-caption">${img.label}</figcaption>
          </figure>
        `).join('')}
        ${pair.length === 1 ? '<div class="img-card img-card--empty"></div>' : ''}
      </div>
    `).join('')}
  `;
}


/* ── OPEN MODAL ─────────────────────────────────────────────── */
function openModal(key) {
  const p = PROJECTS[key];

  document.getElementById('modal-pin-dot').style.background = p.color;
  document.getElementById('modal-eyebrow').textContent      = `${p.cat} — ${p.sub}`;
  document.getElementById('modal-title').textContent        = key;
  document.getElementById('modal-date').textContent         = p.date;

  // Reset tabs to Overview
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="overview"]').classList.add('active');

  // Inject content
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <div class="tab-panel active" id="tab-overview">${buildOverview(key)}</div>
    <div class="tab-panel"        id="tab-process">${buildProcess(key)}</div>
    <div class="tab-panel"        id="tab-visuals">${buildVisuals(key)}</div>`;

  // Dynamic tab-indicator colour per project
  let st = document.getElementById('tab-dyn');
  if (!st) { st = document.createElement('style'); st.id = 'tab-dyn'; document.head.appendChild(st); }
  st.textContent = `.tab-btn.active::after { background: ${p.color}; }`;

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      body.querySelectorAll('.tab-panel').forEach(pp => pp.classList.remove('active'));
      btn.classList.add('active');
      body.querySelector('#tab-' + btn.dataset.tab).classList.add('active');
      body.scrollTop = 0;
    });
  });

  document.getElementById('modal-overlay').classList.add('open');
}


/* ── CLOSE MODAL ────────────────────────────────────────────── */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
