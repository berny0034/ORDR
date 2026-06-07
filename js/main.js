/* ORDR.AI — Main JS */

// ── Language ──────────────────────────────────────────────
let currentLang = 'fr';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('visible', el.dataset.lang === lang);
  });
  document.querySelectorAll('[data-lang-inline]').forEach(el => {
    el.classList.toggle('visible', el.dataset.langInline === lang);
  });
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.l === lang);
  });
  document.documentElement.lang = lang;
}

// ── Sidebar collapse ──────────────────────────────────────
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  const mc = document.getElementById('mainContent');
  sb.classList.toggle('collapsed');
  mc.classList.toggle('expanded');
}

// ── Sidebar active on scroll ──────────────────────────────
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const items = document.querySelectorAll('.sidebar-item[data-target]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        items.forEach(i => i.classList.remove('active'));
        const active = document.querySelector(`.sidebar-item[data-target="${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => obs.observe(s));
}

// ── Smooth scroll ─────────────────────────────────────────
function navTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Phase tabs ────────────────────────────────────────────
function initPhaseTabs() {
  document.querySelectorAll('.phase-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const phase = tab.dataset.phase;
      document.querySelectorAll('.phase-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.phase-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.phase-content[data-phase="${phase}"]`).classList.add('active');
    });
  });
}

// ── Counter animation ─────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = target * ease;
    el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.kpi-value[data-target]').forEach(el => obs.observe(el));
}

// ── Fade-in on scroll ─────────────────────────────────────
function initFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ── Form submit ───────────────────────────────────────────
function initForm() {
  const form = document.getElementById('demoForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = currentLang === 'fr' ? '✓ Demande envoyée !' : '✓ Request sent!';
    btn.style.background = 'var(--green)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = currentLang === 'fr' ? 'Demander une démo' : 'Request a demo';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setLang('fr');
  initPhaseTabs();
  initScrollSpy();
  initCounters();
  initFadeIn();
  initForm();
});
