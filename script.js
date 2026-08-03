/**
 * HATIM DRIF — HOME PORTFOLIO ENGINE (2026)
 * Custom Cursor · Magnetic Buttons · Scroll Reveal · Premium Page Transitions
 * Role Rotator · Skills Filter · Modal System
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ── UTILITIES ─────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const isFine    = window.matchMedia('(pointer: fine)').matches;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js-ready');

  /* ── 0. PREMIUM PAGE TRANSITION CONTROLLER ──────────────── */
  const pageTransition = $('#page-transition');
  
  const navigateWithTransition = (targetUrl) => {
    if (pageTransition) {
      pageTransition.classList.add('active');
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 600);
    } else {
      window.location.href = targetUrl;
    }
  };

  $$('.casro-transition-link, a[href*="casro"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetUrl = link.getAttribute('href');
      navigateWithTransition(targetUrl);
    });
  });

  /* ── 0b. SESSION INTRO LOADING SCREEN CONTROLLER ─────────── */
  const introScreen = $('#intro-screen');
  if (introScreen) {
    const introViewed = sessionStorage.getItem('casro_intro_viewed');
    if (introViewed || isReduced) {
      introScreen.style.display = 'none';
      introScreen.remove();
    } else {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        introScreen.classList.add('fade-out');
        document.body.style.overflow = '';
        sessionStorage.setItem('casro_intro_viewed', 'true');
        setTimeout(() => { introScreen.remove(); }, 850);
      }, 1400);
    }
  }

  /* ── 1. CUSTOM MAGNETIC CURSOR ─────────────────────────── */
  if (isFine) {
    const ring = $('#cursor-ring');
    const dot  = $('#cursor-dot');
    const text = $('#cursor-text');
    let mX = 0, mY = 0, rX = 0, rY = 0, dX = 0, dY = 0;
    let alive = false;

    window.addEventListener('mousemove', e => {
      mX = e.clientX; mY = e.clientY;
      if (!alive) {
        alive = true;
        ring.classList.add('visible');
        dot.classList.add('visible');
      }
    });

    const tick = () => {
      rX += (mX - rX) * 0.14; rY += (mY - rY) * 0.14;
      dX += (mX - dX) * 0.55; dY += (mY - dY) * 0.55;
      ring.style.left = `${rX}px`; ring.style.top = `${rY}px`;
      dot.style.left  = `${dX}px`; dot.style.top  = `${dY}px`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const targets = $$('[data-cursor-label], a, button, .portrait-card, .project-media-wrap');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('expand');
        if (text) text.textContent = el.dataset.cursorLabel || '';
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('expand');
        if (text) text.textContent = '';
      });
    });
  }

  /* ── 2. MAGNETIC BUTTON EFFECT ─────────────────────────── */
  if (isFine && !isReduced) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 18;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 18;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ── 3. SCROLL PROGRESS + HEADER ───────────────────────── */
  const progressFill = $('#scroll-progress-fill');
  const header = $('#site-header');

  const onScroll = () => {
    const scrolled = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progressFill) progressFill.style.width = `${docH > 0 ? (scrolled / docH) * 100 : 0}%`;
    if (header) header.classList.toggle('scrolled', scrolled > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 4. SCROLL-SPY ACTIVE NAV ───────────────────────────── */
  const navLinks = $$('.nav-link[data-nav]');
  const sections = $$('section[id]');
  const updateSpy = () => {
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 200) current = sec.id; });
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.nav === current));
  };
  window.addEventListener('scroll', updateSpy, { passive: true });

  /* ── 5. MOBILE NAVIGATION ───────────────────────────────── */
  const burgerBtn   = $('#burger-btn');
  const mobileNav   = $('#mobile-nav');
  const mobileClose = $('#mobile-nav-close');

  const openMobile = () => {
    mobileNav.classList.add('open'); mobileNav.setAttribute('aria-hidden', 'false');
    burgerBtn.setAttribute('aria-expanded', 'true'); burgerBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMobile = () => {
    mobileNav.classList.remove('open'); mobileNav.setAttribute('aria-hidden', 'true');
    burgerBtn.setAttribute('aria-expanded', 'false'); burgerBtn.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (burgerBtn) burgerBtn.addEventListener('click', openMobile);
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  $$('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMobile));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMobile(); closeModal(); } });

  /* ── 6. HERO PARALLAX ───────────────────────────────────── */
  const heroImg = $('#hero-img');
  if (heroImg && !isReduced) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.2)
        heroImg.style.transform = `translate3d(0, ${(window.scrollY * 0.32).toFixed(2)}px, 0)`;
    }, { passive: true });
  }

  /* ── 7. ROLE ROTATOR ────────────────────────────────────── */
  const rotator = $('#role-rotator');
  if (rotator) {
    const items = $$('.role-item', rotator);
    let current = 0;
    setInterval(() => {
      items[current].classList.remove('active');
      current = (current + 1) % items.length;
      items[current].classList.add('active');
    }, 3000);
  }

  /* ── 8. SMOOTH SCROLL ───────────────────────────────────── */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = $(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      }
    });
  });

  /* ── 9. SCROLL REVEAL ───────────────────────────────────── */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !isReduced) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = $$('.reveal', entry.target.parentElement);
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.07}s`;
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ── 10. SKILLS FILTER ──────────────────────────────────── */
  const filterTabs = $$('.filter-tab');
  const skillCards = $$('.skill-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.filter;
      filterTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
      skillCards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.opacity = '0'; card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .4s var(--ease-out), transform .4s var(--ease-out)';
            card.style.opacity = '1'; card.style.transform = 'translateY(0)';
          });
        }
      });
    });
  });

  /* ── 11. PROJECT MODAL ──────────────────────────────────── */
  const modal         = $('#project-modal');
  const modalBody     = $('#modal-body');
  const modalClose    = $('#modal-close');
  const modalBackdrop = $('#modal-backdrop');

  const PROJECTS = {
    mediqueue: {
      title: 'MediQueue',
      category: 'Healthcare · Mobile Systems · 2024',
      overview: 'MediQueue is a full-stack clinic queue management and patient workflow platform engineered to modernize healthcare administration. It streamlines patient appointments, eliminates physical overcrowding, and optimizes multi-clinic scheduling with real-time status updates delivered over a Laravel REST API.',
      features: ['Real-time patient queue management dashboard','Multi-clinic scheduling and appointment routing','Laravel Sanctum-authenticated REST API','Cross-platform React Native mobile client (iOS & Android)','MySQL relational database with normalized schema','Role-based access for doctors, admins, and receptionists'],
      stack: ['PHP','Laravel','Sanctum','React Native','Expo','MySQL','REST API'],
    },
    manilla: {
      title: 'MANILLA App',
      category: 'Digital Product · Application · 2025',
      overview: 'MANILLA is a mobile-first digital product interface engineered for intuitive content discovery and seamless navigation. Built with a modular component architecture, the application features custom UI transition frameworks and REST API data integration, designed with a refined visual system at its core.',
      features: ['Mobile-first responsive design system','Custom UI transition and animation framework','Modular component architecture for scalability','REST API data fetching and integration','Intuitive content discovery UX patterns','Cross-device compatibility'],
      stack: ['JavaScript','React','REST API','Design System','CSS Animations'],
    },
  };

  const openModal = id => {
    const data = PROJECTS[id];
    if (!data || !modal || !modalBody) return;
    modalBody.innerHTML = `
      <h2>${data.title}</h2>
      <p style="font-family:var(--font-head);font-size:.78rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-lo);margin-bottom:2rem;">${data.category}</p>
      <div class="modal-section"><span class="modal-section-label">Overview</span><p>${data.overview}</p></div>
      <div class="modal-section"><span class="modal-section-label">Key Features</span>
        <ul style="display:flex;flex-direction:column;gap:.5rem;list-style:none;margin-top:.4rem;">
          ${data.features.map(f => `<li style="font-size:.9rem;color:var(--text-mid);padding-left:1rem;position:relative;"><span style="position:absolute;left:0;color:var(--text-lo);">→</span>${f}</li>`).join('')}
        </ul>
      </div>
      <div class="modal-section"><span class="modal-section-label">Technology Stack</span><div class="modal-tags">${data.stack.map(t => `<span>${t}</span>`).join('')}</div></div>
    `;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  $$('.open-modal').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.project)));
  if (modalClose)    modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  /* ── 12. CONTACT FORM ───────────────────────────────────── */
  const form     = $('#contact-form');
  const formResp = $('#form-response');
  if (form && formResp) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      if (btn) btn.textContent = 'Sending…';
      setTimeout(() => {
        formResp.textContent = '✓ Message sent! I will get back to you shortly.';
        form.reset();
        if (btn) btn.innerHTML = 'Send Message <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
        setTimeout(() => { formResp.textContent = ''; }, 6000);
      }, 1200);
    });
  }

  /* ── 13. CV BUTTON ──────────────────────────────────────── */
  const cvBtn = $('#download-cv-btn');
  if (cvBtn) { cvBtn.addEventListener('click', e => { e.preventDefault(); alert('Hatim Drif — CV download initiated.'); }); }

  /* ── 14. FOOTER YEAR ────────────────────────────────────── */
  const fy = $('#footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

});
