/**
 * CASRO BRAND HOUSE — INTERACTION ENGINE (2026)
 * Custom Cursor · Magnetic Buttons · Scroll Reveal · Campaign Lookbook
 * Role Rotator · Page Transition to Home · Color Swap Tee
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

  $$('.home-transition-link, a[href*="index.html"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetUrl = link.getAttribute('href');
      navigateWithTransition(targetUrl);
    });
  });

  /* ── 0b. SESSION INTRO LOADING SCREEN CONTROLLER ─────────── */
  const introScreen = $('#intro-screen');
  if (introScreen) {
    const introViewed = sessionStorage.getItem('casro_brand_intro_viewed');
    if (introViewed || isReduced) {
      introScreen.style.display = 'none';
      introScreen.remove();
    } else {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        introScreen.classList.add('fade-out');
        document.body.style.overflow = '';
        sessionStorage.setItem('casro_brand_intro_viewed', 'true');
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

    const targets = $$('[data-cursor-label], a, button, .portrait-card, .casro-card, .casro-gallery-item, .tshirt-swap');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMobile(); } });

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

  /* ── 10. CASRO LOOKBOOK CAROUSEL ────────────────────────── */
  const lbTrack = $('#lookbook-track');
  const lbDots  = $('#lookbook-dots');
  const lbPrev  = $('#lb-prev');
  const lbNext  = $('#lb-next');

  if (lbTrack) {
    const SLIDES = 9;
    let lbIndex = 0;

    for (let i = 1; i <= SLIDES; i++) {
      const card = document.createElement('div');
      card.className = 'lookbook-card';
      const img = document.createElement('img');
      img.src = `../assets/images/${i}.png`; 
      img.alt = `CASRO Campaign Look ${i}`; 
      img.loading = 'lazy';
      card.appendChild(img); 
      lbTrack.appendChild(card);
    }

    const dots = [];
    if (lbDots) {
      for (let i = 0; i < SLIDES; i++) {
        const btn = document.createElement('button');
        btn.className = 'lb-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', `Go to look ${i + 1}`);
        btn.addEventListener('click', () => goTo(i));
        lbDots.appendChild(btn); 
        dots.push(btn);
      }
    }

    const goTo = idx => {
      lbIndex = (idx + SLIDES) % SLIDES;
      lbTrack.style.transform = `translateX(-${lbIndex * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === lbIndex));
    };

    if (lbPrev) lbPrev.addEventListener('click', () => goTo(lbIndex - 1));
    if (lbNext) lbNext.addEventListener('click', () => goTo(lbIndex + 1));

    let startX = 0;
    if (lbTrack.parentElement) {
      lbTrack.parentElement.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      lbTrack.parentElement.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) goTo(lbIndex + (dx < 0 ? 1 : -1));
      });
    }

    let autoLB = setInterval(() => goTo(lbIndex + 1), 4000);
    [lbPrev, lbNext, ...dots].forEach(el => {
      if (el) el.addEventListener('click', () => { clearInterval(autoLB); autoLB = setInterval(() => goTo(lbIndex + 1), 4000); });
    });
  }

  /* ── 11. CONTACT FORM ───────────────────────────────────── */
  const form     = $('#contact-form');
  const formResp = $('#form-response');
  if (form && formResp) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      if (btn) btn.textContent = 'Sending…';
      setTimeout(() => {
        formResp.textContent = '✓ Inquiry sent! CASRO Studio will reply shortly.';
        form.reset();
        if (btn) btn.innerHTML = 'Send Inquiry <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
        setTimeout(() => { formResp.textContent = ''; }, 6000);
      }, 1200);
    });
  }

  /* ── 12. FOOTER YEAR ────────────────────────────────────── */
  const fy = $('#footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

});
