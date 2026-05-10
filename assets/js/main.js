/* ============================================================
   Main Interactive JS — Academic Portfolio
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme Toggle ──────────────────────────────────────────── */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const current = root.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── Mobile Menu ───────────────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Header Scroll Effect ──────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── Back to Top ───────────────────────────────────────────── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', function () {
      btt.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Active Nav Link ───────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Scroll Reveal (Intersection Observer) ─────────────────── */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .timeline-item').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ── Stat Counters ─────────────────────────────────────────── */
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.getAttribute('data-suffix') || '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ── Tab System ────────────────────────────────────────────── */
  document.querySelectorAll('[data-tab-group]').forEach(function (group) {
    const groupId = group.getAttribute('data-tab-group');
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel[data-tab-group="' + groupId + '"]');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-tab');
        buttons.forEach(function (b) {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          const show = p.getAttribute('data-tab') === target;
          p.classList.toggle('active', show);
          show ? p.removeAttribute('hidden') : p.setAttribute('hidden', '');
        });
      });
    });
  });

  /* ── Publication Search & Filter ───────────────────────────── */
  const pubSearch = document.getElementById('pubSearch');
  if (pubSearch) {
    function filterPubs() {
      const query = pubSearch.value.toLowerCase().trim();
      const activeTab = document.querySelector('.tab-panel.active[data-tab-group="pubs"]');
      if (!activeTab) return;

      const items = activeTab.querySelectorAll('.pub-item');
      let visible = 0;
      items.forEach(function (item) {
        const text = item.textContent.toLowerCase();
        const match = !query || text.includes(query);
        item.classList.toggle('hidden', !match);
        if (match) visible++;
      });

      const noRes = activeTab.querySelector('.no-results');
      if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';

      const countEl = document.getElementById('pubCountNum');
      if (countEl) countEl.textContent = visible;
    }

    pubSearch.addEventListener('input', filterPubs);

    document.querySelectorAll('.tab-btn[data-tab-group="pubs"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTimeout(filterPubs, 10);
      });
    });
  }

  /* ── Project Accordion ──────────────────────────────────────── */
  document.querySelectorAll('.project-card-header').forEach(function (hdr) {
    hdr.addEventListener('click', function () {
      const body = hdr.nextElementSibling;
      const open = body.classList.toggle('open');
      hdr.classList.toggle('open', open);
    });
  });

  /* ── Typing animation for hero role ────────────────────────── */
  const typingEl = document.getElementById('typingRole');
  if (typingEl) {
    const roles = [
      'Associate Professor',
      'AI Researcher',
      'Computer Vision Expert',
      'Knowledge Graph Engineer',
    ];
    let ri = 0, ci = 0, deleting = false, paused = false;

    function typeStep() {
      const word = roles[ri];
      if (paused) {
        paused = false;
        deleting = true;
        setTimeout(typeStep, 800);
        return;
      }
      if (!deleting) {
        typingEl.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) { paused = true; setTimeout(typeStep, 1800); return; }
      } else {
        typingEl.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
        }
      }
      setTimeout(typeStep, deleting ? 60 : 90);
    }
    setTimeout(typeStep, 600);
  }

})();
