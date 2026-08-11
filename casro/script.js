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
  const introViewed = sessionStorage.getItem('casro_brand_intro_viewed');
  if (introScreen) {
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

  /* ── 0c. HERO ENTRANCE ANIMATION CONTROLLER ─────────────── */
  const heroSection = $('#hero');
  const triggerHeroEntrance = () => {
    if (heroSection) {
      heroSection.classList.add('hero-entrance-active');
    }
  };

  if (introScreen && !introViewed && !isReduced) {
    setTimeout(triggerHeroEntrance, 1300);
  } else {
    requestAnimationFrame(() => {
      setTimeout(triggerHeroEntrance, 60);
    });
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

  /* ── 10. CINEMATIC FULL-SCREEN RUNWAY LOOKBOOK ──────────── */
  const runwayViewport = $('#lookbook-runway-viewport');
  const runwayTrack    = $('#lookbook-runway-track');

  if (runwayViewport && runwayTrack) {
    const LOOK_CAPTIONS = [
      'STRUCTURAL STREETWEAR SILHOUETTES',
      'HIGH-DENSITY MONOCHROME PRINT',
      'MINIMAL CREST TAILORED FIT',
      'ARCHITECTURAL DROP-SHOULDER CUT',
      'TACTILE COTTON CONTEMPORARY FIT',
      'HIGH-CONTRAST VECTOR GRAPHICS',
      'ATELIER EDITORIAL FORM',
      'TACTILE TEXTILE DETAIL CLOSE-UP',
      'SIGNATURE CAPSULE LOOKBOOK'
    ];
    const TOTAL_LOOKS = 9;

    const createSlide = (index) => {
      const lookNum = (index % TOTAL_LOOKS) + 1;
      const slide = document.createElement('div');
      slide.className = 'runway-slide';
      slide.dataset.index = index % TOTAL_LOOKS;

      const img = document.createElement('img');
      img.src = `../assets/images/${lookNum}.png`;
      img.alt = `CASRO Campaign Look 0${lookNum}`;
      img.loading = index < TOTAL_LOOKS ? 'eager' : 'lazy';

      const badge = document.createElement('div');
      badge.className = 'runway-slide-badge';
      badge.textContent = `LOOK 0${lookNum}`;

      slide.appendChild(img);
      slide.appendChild(badge);
      return slide;
    };

    // Populate 3 repetitions of slides for seamless loop
    const REPEATS = 3;
    for (let r = 0; r < REPEATS; r++) {
      for (let i = 0; i < TOTAL_LOOKS; i++) {
        runwayTrack.appendChild(createSlide(i));
      }
    }

    const slides = $$('.runway-slide', runwayTrack);
    const lbCounter = $('#lb-counter');
    const lbCaption = $('#lb-caption');
    const btnPrev   = $('#lb-runway-prev');
    const btnNext   = $('#lb-runway-next');

    let currentPos = 0;
    let autoSpeed = -0.75; // Left to right continuous motion
    let isDragging = false;
    let startX = 0;
    let dragStartPos = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let autoResumeTimer = null;
    let isHovered = false;

    let slideWidth = 0;
    let gap = 0;
    let setWidth = 0;

    const measureSizes = () => {
      if (!slides.length) return;
      const r0 = slides[0].getBoundingClientRect();
      const r1 = slides[1].getBoundingClientRect();
      slideWidth = r0.width;
      gap = r1.left - r0.right;
      if (gap <= 0 || isNaN(gap)) gap = 32;
      setWidth = (slideWidth + gap) * TOTAL_LOOKS;
    };

    setTimeout(measureSizes, 50);
    window.addEventListener('resize', measureSizes);

    currentPos = -setWidth;

    const updateFocalEffects = () => {
      const viewportRect = runwayViewport.getBoundingClientRect();
      const viewportCenter = viewportRect.left + viewportRect.width / 2;

      let minDistance = Infinity;
      let activeIndex = 0;

      slides.forEach((slide) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const dist = Math.abs(slideCenter - viewportCenter);
        const maxDist = viewportRect.width / 1.8;

        const normDist = Math.min(dist / maxDist, 1.0);
        const focusFactor = (1 + Math.cos(normDist * Math.pi)) / 2;

        const scale = 0.85 + focusFactor * 0.15;
        const opacity = 0.48 + focusFactor * 0.52;
        const brightness = 0.65 + focusFactor * 0.35;

        slide.style.transform = `scale(${scale.toFixed(3)})`;
        slide.style.opacity = opacity.toFixed(3);
        const img = slide.querySelector('img');
        if (img) img.style.filter = `brightness(${brightness.toFixed(3)})`;

        if (dist < minDistance) {
          minDistance = dist;
          activeIndex = parseInt(slide.dataset.index, 10);
        }
      });

      if (lbCounter) lbCounter.textContent = `LOOK 0${activeIndex + 1} / 0${TOTAL_LOOKS}`;
      if (lbCaption) lbCaption.textContent = LOOK_CAPTIONS[activeIndex] || '';
    };

    let animId = null;
    const animateTrack = (now) => {
      if (!isDragging) {
        if (Math.abs(velocity) > 0.05) {
          currentPos += velocity;
          velocity *= 0.94;
        } else {
          velocity = 0;
          if (!isHovered) {
            currentPos += autoSpeed;
          }
        }
      }

      if (setWidth > 0) {
        if (currentPos < -setWidth * 2) {
          currentPos += setWidth;
        } else if (currentPos > 0) {
          currentPos -= setWidth;
        }
      }

      runwayTrack.style.transform = `translate3d(${currentPos.toFixed(2)}px, 0, 0)`;
      updateFocalEffects();

      animId = requestAnimationFrame(animateTrack);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animId) animId = requestAnimationFrame(animateTrack);
          } else {
            if (animId) {
              cancelAnimationFrame(animId);
              animId = null;
            }
          }
        });
      }, { threshold: 0.02 });
      observer.observe(runwayViewport);
    } else {
      animId = requestAnimationFrame(animateTrack);
    }

    const pauseAuto = () => {
      if (autoResumeTimer) clearTimeout(autoResumeTimer);
    };

    const resumeAuto = () => {
      autoResumeTimer = setTimeout(() => {
        isDragging = false;
      }, 1800);
    };

    runwayViewport.addEventListener('mouseenter', () => { isHovered = true; });
    runwayViewport.addEventListener('mouseleave', () => {
      isHovered = false;
      if (isDragging) {
        isDragging = false;
        resumeAuto();
      }
    });

    const onPointerDown = (clientX) => {
      isDragging = true;
      startX = clientX;
      dragStartPos = currentPos;
      lastX = clientX;
      lastTime = performance.now();
      velocity = 0;
      pauseAuto();
    };

    const onPointerMove = (clientX) => {
      if (!isDragging) return;
      const dx = clientX - startX;
      currentPos = dragStartPos + dx;

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        velocity = (clientX - lastX) * (16 / dt);
      }
      lastX = clientX;
      lastTime = now;
    };

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false;
        resumeAuto();
      }
    };

    runwayViewport.addEventListener('mousedown', (e) => { onPointerDown(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (isDragging) onPointerMove(e.clientX); });
    window.addEventListener('mouseup', () => { onPointerUp(); });

    runwayViewport.addEventListener('touchstart', (e) => { onPointerDown(e.touches[0].clientX); }, { passive: true });
    runwayViewport.addEventListener('touchmove', (e) => { if (isDragging) onPointerMove(e.touches[0].clientX); }, { passive: true });
    runwayViewport.addEventListener('touchend', () => { onPointerUp(); });

    const stepSlide = (direction) => {
      pauseAuto();
      const itemWidth = (slideWidth || 400) + (gap || 32);
      velocity = direction * (itemWidth * 0.12);
      resumeAuto();
    };

    if (btnPrev) btnPrev.addEventListener('click', () => stepSlide(1));
    if (btnNext) btnNext.addEventListener('click', () => stepSlide(-1));
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
