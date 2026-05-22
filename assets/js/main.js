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

  /* Self-supervised learning page interactions */
  const sslModels = {
    dinov2: {
      family: 'Teacher-student',
      name: 'DINOv2',
      source: 'https://arxiv.org/abs/2304.07193',
      idea: 'DINOv2 trains robust visual features without supervision by scaling self-distillation, curated data, and ViT backbones, then distilling strong teachers into smaller models.',
      learnsBy: 'Matching student features to a teacher representation from augmented image views.',
      detectionUse: 'Use the encoder as a pretrained backbone, then fine-tune a detection head on labeled boxes.',
      torchFocus: 'Teacher network, student network, centering/sharpening, and feature extraction.',
      steps: [
        ['Image views', 'Global and local crops'],
        ['Student ViT', 'Learns online'],
        ['Teacher ViT', 'EMA target network'],
        ['Feature loss', 'Match distributions'],
        ['Backbone', 'Transfer to detector']
      ]
    },
    byol: {
      family: 'Negative-free Siamese',
      name: 'BYOL',
      source: 'https://papers.nips.cc/paper_files/paper/2020/hash/f3ada80d5c4ee70142b17b8192b2958e-Abstract.html',
      idea: 'BYOL learns from two augmented views without negative samples. An online network predicts the target network representation, while the target is updated by moving average.',
      learnsBy: 'Predicting a target representation from another view of the same image.',
      detectionUse: 'The learned encoder can initialize a detector backbone when labels are limited.',
      torchFocus: 'Online encoder, target encoder, predictor head, stop-gradient, and EMA updates.',
      steps: [
        ['Two views', 'Different augmentations'],
        ['Online net', 'Encoder + predictor'],
        ['Target net', 'EMA encoder'],
        ['L2 loss', 'No negatives'],
        ['Encoder', 'Reuse features']
      ]
    },
    dinov3: {
      family: 'Scaled SSL backbone',
      name: 'DINOv3',
      source: 'https://ai.meta.com/dinov3/',
      idea: 'DINOv3 scales self-supervised vision training to produce universal backbones for dense and global visual tasks across domains such as web and satellite imagery.',
      learnsBy: 'Large-scale self-supervised training with strong dense visual features for downstream transfer.',
      detectionUse: 'Use DINOv3 features as a high-quality backbone or feature source for detection and segmentation pipelines.',
      torchFocus: 'Loading pretrained backbones, freezing/unfreezing stages, and extracting dense patch features.',
      steps: [
        ['Large corpus', 'Unlabeled images'],
        ['ViT backbone', 'Scaled training'],
        ['Dense features', 'Patch-level signal'],
        ['Post-hoc use', 'Flexible adaptation'],
        ['Detector', 'Fine-tuned boxes']
      ]
    },
    jepa: {
      family: 'Joint embedding prediction',
      name: 'I-JEPA',
      source: 'https://arxiv.org/abs/2301.08243',
      idea: 'I-JEPA predicts target block representations from context block representations in embedding space, avoiding direct pixel reconstruction.',
      learnsBy: 'Predicting missing target embeddings from visible context embeddings in the same image.',
      detectionUse: 'Its semantic ViT features can initialize downstream dense tasks after supervised fine-tuning.',
      torchFocus: 'Context encoder, target encoder, predictor, masking blocks, and embedding-space loss.',
      steps: [
        ['Context block', 'Visible image area'],
        ['Target blocks', 'Masked regions'],
        ['Encoders', 'Context + target'],
        ['Predictor', 'Embedding target'],
        ['Semantic ViT', 'Transfer learning']
      ]
    },
    mae: {
      family: 'Masked reconstruction',
      name: 'MAE',
      source: 'https://arxiv.org/abs/2111.06377',
      idea: 'MAE masks a high percentage of image patches, encodes only visible patches, and trains a lightweight decoder to reconstruct the missing pixels.',
      learnsBy: 'Reconstructing masked image patches from visible image patches.',
      detectionUse: 'After pretraining, discard the decoder and fine-tune the encoder inside a detection architecture.',
      torchFocus: 'Patchify, random masking, visible-token encoder, lightweight decoder, and reconstruction loss.',
      steps: [
        ['Patchify', 'Split image'],
        ['Mask 75%', 'Hide patches'],
        ['Encoder', 'Visible patches only'],
        ['Decoder', 'Reconstruct pixels'],
        ['Encoder', 'Fine-tune detector']
      ]
    }
  };

  function renderSslModel(key) {
    const model = sslModels[key];
    if (!model) return;
    const family = document.getElementById('sslModelFamily');
    const name = document.getElementById('sslModelName');
    const source = document.getElementById('sslModelSource');
    const idea = document.getElementById('sslModelIdea');
    const learnsBy = document.getElementById('sslLearnsBy');
    const detectionUse = document.getElementById('sslDetectionUse');
    const torchFocus = document.getElementById('sslTorchFocus');
    const architecture = document.getElementById('sslArchitecture');
    if (!family || !name || !source || !idea || !learnsBy || !detectionUse || !torchFocus || !architecture) return;

    family.textContent = model.family;
    name.textContent = model.name;
    source.href = model.source;
    idea.textContent = model.idea;
    learnsBy.textContent = model.learnsBy;
    detectionUse.textContent = model.detectionUse;
    torchFocus.textContent = model.torchFocus;
    architecture.innerHTML = model.steps.map(function (step) {
      return '<div class="arch-step"><strong>' + step[0] + '</strong><span>' + step[1] + '</span></div>';
    }).join('');
  }

  document.querySelectorAll('.ssl-model-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.getAttribute('data-ssl-model');
      document.querySelectorAll('.ssl-model-button').forEach(function (item) {
        const active = item === btn;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderSslModel(key);
    });
  });
  renderSslModel('dinov2');

  const pipelineTexts = [
    'Start with many class-relevant images. They do not need bounding boxes for SSL pretraining.',
    'Train the encoder with an SSL objective such as teacher-student matching, masked reconstruction, or embedding prediction.',
    'Attach a detection neck and head so feature maps can become boxes, objectness scores, and class probabilities.',
    'Fine-tune with labeled bounding boxes. Freeze the backbone at first if the dataset is small, then unfreeze carefully.',
    'Report mAP, precision, recall, confidence thresholds, and failure cases before deployment.'
  ];
  const pipelineOutput = document.getElementById('pipelineOutput');
  document.querySelectorAll('.pipeline-step').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const index = parseInt(btn.getAttribute('data-step'), 10);
      document.querySelectorAll('.pipeline-step').forEach(function (item) {
        item.classList.toggle('active', item === btn);
      });
      if (pipelineOutput) pipelineOutput.textContent = pipelineTexts[index] || pipelineTexts[0];
    });
  });

  document.querySelectorAll('[data-code-tabs]').forEach(function (wrap) {
    const buttons = wrap.querySelectorAll('[data-code-tab]');
    const panels = wrap.querySelectorAll('[data-code-panel]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-code-tab');
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === btn);
        });
        panels.forEach(function (panel) {
          const show = panel.getAttribute('data-code-panel') === target;
          panel.classList.toggle('active', show);
          show ? panel.removeAttribute('hidden') : panel.setAttribute('hidden', '');
        });
      });
    });
  });

})();
