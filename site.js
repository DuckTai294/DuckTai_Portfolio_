/* Modern Atmospheric Loading Screen Engine */
(function initAppLoader() {
  if (document.getElementById('app-loader')) return;
  const loader = document.createElement('div');
  loader.id = 'app-loader';
  loader.className = 'app-loader';
  loader.innerHTML = '<div class="loader-content"><div class="loader-logo">DUCKTAI<span class="loader-dot">.</span></div><div class="loader-bar-wrap"><div class="loader-bar"></div></div><div class="loader-info"><span>CREATIVE TIMELINE</span><span class="loader-num">0%</span></div></div>';

  if (document.body) {
    document.body.prepend(loader);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.body.prepend(loader));
  }

  const bar = loader.querySelector('.loader-bar');
  const num = loader.querySelector('.loader-num');
  let pct = 0;

  const finishLoader = () => {
    pct = 100;
    if (bar) bar.style.width = '100%';
    if (num) num.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('is-loaded');
    }, 280);
  };

  const timer = setInterval(() => {
    pct += Math.floor(Math.random() * 22) + 14;
    if (pct >= 100) {
      pct = 100;
      clearInterval(timer);
      finishLoader();
    } else {
      if (bar) bar.style.width = pct + '%';
      if (num) num.textContent = pct + '%';
    }
  }, 45);

  window.addEventListener('load', finishLoader);
})();

/* Shared interactions. Content stays visible without JavaScript. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const ease = 'cubic-bezier(.16, 1, .3, 1)';
  const animations = new Set();
  const animate = (element, frames, options) => {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    return animation;
  };
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Menu labels, keyboard focus and visual state always agree.
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    links.id ||= 'main-navigation';
    toggle.setAttribute('aria-controls', links.id);
    const setMenu = open => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
      if (open) animate(links, [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: ease });
    };
    toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
    links.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('click', event => { if (!nav?.contains(event.target)) setMenu(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && links.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });
    nav?.addEventListener('focusout', event => { if (!nav.contains(event.relatedTarget)) setMenu(false); });
    matchMedia('(max-width: 700px)').addEventListener('change', () => setMenu(false));
  }

  // Reading timeline follows the actual scroll position.
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  let scrollFrame = 0;
  const updateScroll = () => {
    scrollFrame = 0;
    nav?.classList.toggle('scrolled', scrollY > 40);
    const range = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0})`;
  };
  const queueScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(queueScroll).observe(document.body);
  updateScroll();

  // Reveal items once, including cards created later by the gallery filters.
  const motionSelector = '.hero-copy > *, .page-hero > *, .preset-hero-header > *, .checkout-hero > *, .section-head > *, .work-chapter-head > *, .service, .project-card, .gallery-card, .toolkit-card, .fact-card, .why-card, .process-step, .timeline-card, .contact-card, .contact-profile-compact, .shorts-showcase-card, .preset-feature-item, .preset-info-card, .preset-price-card, .checkout-step, .checkout-order-summary, .checkout-qr-card, .cta > *, .faq-list details, .footer > *';
  const registered = new WeakSet();
  const reveal = element => {
    const index = [...element.parentElement.children].indexOf(element);
    const delay = Math.min(Number(element.style.getPropertyValue('--stagger')) || index, 4) * 65;
    animate(element, [{ opacity: 0, transform: 'translate3d(0, 22px, 0)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay, easing: ease, fill: 'backwards' });
  };
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.06 }) : null;
  const registerMotion = scope => {
    const elements = [...scope.querySelectorAll(motionSelector)];
    if (scope.matches?.(motionSelector)) elements.unshift(scope);
    elements.forEach(element => {
      if (registered.has(element)) return;
      registered.add(element);
      element.classList.add('motion-item');
      if (!element.parentElement.closest('.motion-item')) observer?.observe(element);
    });
  };
  registerMotion(document);
  ['featured-work', 'landscape-work', 'portrait-work'].forEach(id => {
    const grid = document.getElementById(id);
    if (grid) new MutationObserver(() => registerMotion(grid)).observe(grid, { childList: true });
  });

  // Copy fallback for file:// and browsers without clipboard permission.
  let toast = document.querySelector('.toast');
  let toastTimer;
  const notify = message => {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.append(toast);
    }
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  };
  const legacyCopy = text => {
    const focus = document.activeElement;
    const selection = getSelection();
    const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
    const input = document.createElement('textarea');
    input.value = text; input.readOnly = true; input.className = 'clipboard-helper';
    document.body.append(input); input.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* Show manual-copy feedback. */ }
    input.remove();
    focus?.focus({ preventScroll: true });
    if (selection) { selection.removeAllRanges(); ranges.forEach(range => selection.addRange(range)); }
    return copied;
  };
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const text = button.dataset.copy;
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch { copied = legacyCopy(text); }
    notify(copied ? 'Đã sao chép: ' + text : 'Hãy sao chép thủ công: ' + text);
  }));

  const modal = document.getElementById('video-modal');
  if (modal) {
    const frame = modal.querySelector('[data-video-frame]');
    const title = document.getElementById('video-modal-title');
    const close = modal.querySelector('[data-close-video]');
    let lastTrigger;
    const stopVideo = () => {
      if (!modal.open || modal.classList.contains('is-closing')) return;
      modal.classList.add('is-closing');
      setTimeout(() => {
        frame.removeAttribute('srcdoc'); frame.src = 'about:blank';
        modal.close(); modal.classList.remove('is-closing', 'is-portrait');
        lastTrigger?.focus();
      }, reduced.matches ? 0 : 240);
    };
    document.querySelectorAll('[data-video]').forEach(card => card.addEventListener('click', () => {
      lastTrigger = card;
      modal.classList.toggle('is-portrait', card.dataset.format === 'portrait');
      title.textContent = card.dataset.title || 'Xem project';
      frame.src = `https://www.youtube.com/embed/${encodeURIComponent(card.dataset.video)}?autoplay=1&rel=0`;
      modal.showModal(); close.focus();
    }));
    close?.addEventListener('click', stopVideo);
    modal.addEventListener('cancel', event => { event.preventDefault(); stopVideo(); });
    modal.addEventListener('click', event => {
      const r = modal.getBoundingClientRect();
      if (event.target === modal && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) stopVideo();
    });
  }

  // Interruptible FAQ animation: rapid clicks settle to the latest intent.
  const faqStates = [];
  document.querySelectorAll('.faq-list details').forEach(detail => {
    const summary = detail.querySelector('summary');
    if (!summary) return;
    let animation, desiredOpen = detail.open;
    const settle = () => {
      animation?.cancel(); animation = null;
      detail.open = desiredOpen; detail.classList.remove('faq-animating');
    };
    faqStates.push(() => { if (animation) settle(); });
    summary.addEventListener('click', event => {
      if (reduced.matches || !detail.animate) return;
      event.preventDefault();
      const start = detail.getBoundingClientRect().height;
      desiredOpen = animation ? !desiredOpen : !detail.open;
      animation?.cancel(); detail.open = desiredOpen;
      const end = detail.getBoundingClientRect().height;
      detail.open = true; detail.classList.add('faq-animating');
      animation = detail.animate([{ height: `${start}px` }, { height: `${end}px` }], { duration: 300, easing: ease });
      animation.onfinish = settle;
    });
  });

  // Pause offscreen previews and respect reduced motion without disabling controls.
  const previews = new Map();
  const syncPreviews = () => {
    const allowed = !reduced.matches && !document.hidden && !document.querySelector('dialog[open]');
    previews.forEach((visible, frame) => {
      if (frame.hasAttribute('src')) frame.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: allowed && visible ? 'playVideo' : 'pauseVideo', args: [] }), 'https://www.youtube.com');
    });
  };
  const loadPreview = frame => {
    if (frame.hasAttribute('src')) return;
    const url = new URL(frame.dataset.src);
    const canAutoplay = !reduced.matches && !document.hidden && !document.querySelector('dialog[open]');
    url.searchParams.set('autoplay', canAutoplay ? '1' : '0');
    url.searchParams.set('playsinline', '1');
    if (location.protocol !== 'file:') url.searchParams.set('origin', location.origin);
    frame.src = url.href;
  };
  const shortsObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { previews.set(entry.target, entry.isIntersecting); if (entry.isIntersecting) loadPreview(entry.target); });
    syncPreviews();
  }, { threshold: 0.15 }) : null;
  document.querySelectorAll('.shorts-iframe[data-src]').forEach(frame => {
    previews.set(frame, false); frame.addEventListener('load', syncPreviews);
    if (shortsObserver) shortsObserver.observe(frame); else loadPreview(frame);
  });

  // Cursor trail sleeps when stationary, outside the page or behind a dialog.
  const dot = document.createElement('div'), ring = document.createElement('div');
  dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);
  let cursorFrame = 0, x = 0, y = 0, ringX = 0, ringY = 0;
  const hideCursor = () => {
    root.classList.remove('custom-cursor-active');
    [dot, ring].forEach(el => el.classList.remove('visible', 'hovering', 'clicking'));
    cancelAnimationFrame(cursorFrame); cursorFrame = 0;
  };
  const drawCursor = () => {
    ringX += (x - ringX) * .2; ringY += (y - ringY) * .2;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    cursorFrame = Math.abs(x - ringX) + Math.abs(y - ringY) > .25 ? requestAnimationFrame(drawCursor) : 0;
  };
  addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || event.pointerType !== 'mouse' || document.querySelector('dialog[open]') || event.target.closest('iframe')) { hideCursor(); return; }
    x = event.clientX; y = event.clientY;
    if (!root.classList.contains('custom-cursor-active')) { ringX = x; ringY = y; }
    root.classList.add('custom-cursor-active');
    const hovering = !!event.target.closest('a, button, summary, [data-copy]');
    [dot, ring].forEach(el => { el.classList.add('visible'); el.classList.toggle('hovering', hovering); });
    if (!cursorFrame) cursorFrame = requestAnimationFrame(drawCursor);
  }, { passive: true });
  document.addEventListener('pointerleave', hideCursor);
  document.addEventListener('pointerover', event => { if (event.target.closest('iframe')) hideCursor(); });
  addEventListener('blur', hideCursor);
  document.addEventListener('keydown', event => { if (event.key === 'Tab') hideCursor(); });
  document.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !root.classList.contains('custom-cursor-active')) return;
    [dot, ring].forEach(el => el.classList.add('clicking'));
    const ripple = document.createElement('div'); ripple.className = 'cursor-ripple'; ripple.setAttribute('aria-hidden', 'true');
    ripple.style.setProperty('--x', `${event.clientX}px`); ripple.style.setProperty('--y', `${event.clientY}px`);
    document.body.append(ripple); setTimeout(() => ripple.remove(), 550);
  });
  const release = () => [dot, ring].forEach(el => el.classList.remove('clicking'));
  document.addEventListener('pointerup', release); document.addEventListener('pointercancel', release);
  document.querySelectorAll('dialog').forEach(dialog => new MutationObserver(() => {
    root.classList.toggle('has-open-dialog', !!document.querySelector('dialog[open]'));
    hideCursor(); syncPreviews();
  }).observe(dialog, { attributes: true, attributeFilter: ['open'] }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) hideCursor(); syncPreviews(); });
  fine.addEventListener('change', hideCursor);
  reduced.addEventListener('change', () => {
    if (reduced.matches) { animations.forEach(animation => animation.cancel()); faqStates.forEach(settle => settle()); }
    hideCursor(); syncPreviews();
  });
})();
