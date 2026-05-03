'use strict';

// Skill checkbox -> enable/disable proficiency select
document.querySelectorAll('.skill-checkbox').forEach(cb => {
  cb.addEventListener('change', function () {
    const row = this.closest('.skill-row');
    const select = row?.querySelector('.proficiency-select');
    if (select) {
      select.disabled = !this.checked;
      if (!this.checked) select.value = 'beginner';
    }
  });
});

// Delete confirmation
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.matches('form[action*="_method=DELETE"]') && !confirm('Delete this skill? This cannot be undone.')) {
    e.preventDefault();
  }
});

// Skills catalogue: search + category + difficulty filter
(function () {
  const searchInput = document.getElementById('skillSearch');
  const catSelect   = document.getElementById('catFilter');
  const diffBtns    = document.querySelectorAll('.diff-btn');
  const cards       = Array.from(document.querySelectorAll('.skill-card'));
  const countEl     = document.getElementById('skillCount');
  const noResults   = document.getElementById('noResults');
  const grid        = document.getElementById('skillGrid');
  if (!cards.length) return;

  let activeDiff = '';

  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('diff-btn--active'));
      btn.classList.add('diff-btn--active');
      activeDiff = btn.dataset.diff;
      applyFilters();
    });
  });

  [searchInput, catSelect].forEach(el => el?.addEventListener('input', applyFilters));

  function applyFilters() {
    const q   = (searchInput?.value || '').toLowerCase().trim();
    const cat = catSelect?.value || '';
    let shown = 0;
    cards.forEach(card => {
      const nameMatch = !q   || card.dataset.name.includes(q);
      const catMatch  = !cat || card.dataset.category === cat;
      const diffMatch = !activeDiff || card.dataset.difficulty === activeDiff;
      const visible   = nameMatch && catMatch && diffMatch;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (countEl) countEl.textContent = `${shown} skill${shown !== 1 ? 's' : ''} shown`;
    if (noResults) noResults.hidden = shown > 0;
    if (grid) grid.hidden = shown === 0;
  }
})();

// Password strength meter
(function () {
  const pw    = document.getElementById('regPassword');
  const bar   = document.getElementById('pwStrengthBar');
  const label = document.getElementById('pwStrengthLabel');
  if (!pw || !bar) return;
  const levels = [
    { max: 0,        pct: 0,   color: '',         text: '' },
    { max: 5,        pct: 25,  color: '#ef4444',  text: 'Too short' },
    { max: 7,        pct: 50,  color: '#f97316',  text: 'Weak' },
    { max: 9,        pct: 75,  color: '#eab308',  text: 'Fair' },
    { max: Infinity, pct: 100, color: '#22c55e',  text: 'Strong' }
  ];
  pw.addEventListener('input', () => {
    const lvl = levels.find(l => pw.value.length <= l.max);
    bar.style.width = lvl.pct + '%';
    bar.style.backgroundColor = lvl.color;
    if (label) label.textContent = lvl.text;
  });
})();

// Scroll flash into view
const flash = document.getElementById('flashToast');
if (flash) flash.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
