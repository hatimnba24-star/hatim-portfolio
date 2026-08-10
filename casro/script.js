/**
 * CASRO BRAND HOUSE — INTERACTION ENGINE (2026)
 * Custom Cursor · Magnetic Buttons · Scroll Reveal · Campaign Lookbook
 * Role Rotator · Page Transition to Home · 3D Interactive T-Shirt Viewer
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

    const targets = $$('[data-cursor-label], a, button, .portrait-card, .casro-card, .casro-gallery-item, .casro-3d-viewer-container');
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

  /* ── 13. 3D INTERACTIVE T-SHIRT VIEWER ──────────────────── */
  const init3DViewer = () => {
    const viewport = $('#casro-3d-viewport');
    const canvas   = $('#casro-3d-canvas');
    if (!viewport || !canvas) return;

    const loadingOverlay  = $('#casro-3d-loading');
    const loadingProgress = $('#casro-3d-loading-progress');
    const errorOverlay    = $('#casro-3d-error');
    const fallbackOverlay = $('#casro-2d-fallback');
    const fallbackBtn     = $('#casro-3d-fallback-btn');
    const retryBtn        = $('#casro-3d-retry-btn');
    const btnFront        = $('#btn-view-front');
    const btn360          = $('#btn-view-360');
    const btnBack         = $('#btn-view-back');

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const rect = viewport.getBoundingClientRect();
    const aspect = (rect.width || 400) / (rect.height || 420);
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0.1, 3.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(rect.width || 400, rect.height || 420, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 4. Studio Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdfe6e9, 1.0);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // 5. Orbit Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 4.5;
    controls.minPolarAngle = Math.PI * 0.25; // Limit vertical rotation (~45°)
    controls.maxPolarAngle = Math.PI * 0.58; // Limit vertical rotation (~104°, no upside-down flips)
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.target.set(0, 0, 0);

    // 6. Model Loading
    const modelUrl = '../assets/models/casro-tshirt.glb';
    let loadedModel = null;
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      modelUrl,
      (gltf) => {
        loadedModel = gltf.scene;

        loadedModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = child.material.roughness ?? 0.65;
              child.material.metalness = child.material.metalness ?? 0.1;
            }
          }
        });

        // Center & scale model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.0 / (maxDim || 1);

        loadedModel.scale.set(scale, scale, scale);
        loadedModel.position.x = -center.x * scale;
        loadedModel.position.y = -center.y * scale;
        loadedModel.position.z = -center.z * scale;

        // Shadow floor plane
        const shadowPlaneGeo = new THREE.PlaneGeometry(10, 10);
        const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.22 });
        const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = box.min.y * scale - 0.05;
        shadowPlane.receiveShadow = true;
        scene.add(shadowPlane);

        scene.add(loadedModel);

        if (loadingOverlay) loadingOverlay.classList.add('hidden');
      },
      (xhr) => {
        if (xhr.lengthComputable && loadingProgress) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          loadingProgress.textContent = `${percent}%`;
        }
      },
      (error) => {
        console.warn('CASRO 3D Viewer Notice: Model file missing at ../assets/models/casro-tshirt.glb.', error);
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        if (errorOverlay) errorOverlay.classList.remove('hidden');
      }
    );

    // 7. Camera angle controls (FRONT, 360°, BACK)
    let isTransitioning = false;
    let transitionStartTime = 0;
    let startAngle = 0;
    let targetAngle = 0;
    const duration = 750;

    const setActiveControl = (activeBtn) => {
      [btnFront, btn360, btnBack].forEach(btn => {
        if (btn) btn.classList.toggle('active', btn === activeBtn);
      });
    };

    const animateAngleTo = (targetAzimuth) => {
      controls.autoRotate = false;
      startAngle = controls.getAzimuthalAngle();

      let delta = targetAzimuth - startAngle;
      while (delta < -Math.PI) delta += Math.PI * 2;
      while (delta > Math.PI) delta -= Math.PI * 2;

      targetAngle = startAngle + delta;
      isTransitioning = true;
      transitionStartTime = performance.now();
    };

    if (btnFront) {
      btnFront.addEventListener('click', () => {
        setActiveControl(btnFront);
        animateAngleTo(0);
      });
    }

    if (btnBack) {
      btnBack.addEventListener('click', () => {
        setActiveControl(btnBack);
        animateAngleTo(Math.PI);
      });
    }

    if (btn360) {
      btn360.addEventListener('click', () => {
        setActiveControl(btn360);
        isTransitioning = false;
        controls.autoRotate = true;
      });
    }

    if (fallbackBtn && fallbackOverlay) {
      fallbackBtn.addEventListener('click', () => {
        fallbackOverlay.classList.remove('hidden');
      });
    }

    if (retryBtn && fallbackOverlay) {
      retryBtn.addEventListener('click', () => {
        fallbackOverlay.classList.add('hidden');
      });
    }

    // 8. Optimized Render Loop with Viewport IntersectionObserver
    let isVisible = false;
    let animId = null;

    const tick = (now) => {
      if (!isVisible) return;
      animId = requestAnimationFrame(tick);

      if (isTransitioning) {
        const elapsed = now - transitionStartTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentAngle = startAngle + (targetAngle - startAngle) * ease;

        const radius = camera.position.distanceTo(controls.target);
        const polar = controls.getPolarAngle();
        camera.position.x = controls.target.x + radius * Math.sin(polar) * Math.sin(currentAngle);
        camera.position.z = controls.target.z + radius * Math.sin(polar) * Math.cos(currentAngle);

        if (progress >= 1) {
          isTransitioning = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              animId = requestAnimationFrame(tick);
            }
          } else {
            isVisible = false;
            if (animId) cancelAnimationFrame(animId);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(viewport);
    } else {
      isVisible = true;
      animId = requestAnimationFrame(tick);
    }

    // 9. Resize Observer
    const onResize = () => {
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      }
    };

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => onResize());
      ro.observe(viewport);
    } else {
      window.addEventListener('resize', onResize);
    }
  };

  // Initialize 3D Viewer
  init3DViewer();

});
