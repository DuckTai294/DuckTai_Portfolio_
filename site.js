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

const toggle = document.querySelector('.nav-toggle'); const links = document.querySelector('.nav-links'); if (toggle && links) { toggle.addEventListener('click', () => { const open = links.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)) }); links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open'))) }
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
/* Navbar Scroll Glass Watcher */
const siteNav = document.querySelector('.site-nav');
if (siteNav) {
  const updateNav = () => {
    if (window.scrollY > 40) siteNav.classList.add('scrolled');
    else siteNav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

/* Staggered Scroll Reveal System */
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    const childCards = entry.target.querySelectorAll('.service, .project-card, .toolkit-card, .fact-card, .why-card, .process-step, .shorts-showcase-card');
    childCards.forEach((card, index) => {
      card.style.setProperty('--stagger', index);
    });
    observer.unobserve(entry.target);
  }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const toast = document.querySelector('.toast'); document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => { try { await navigator.clipboard.writeText(button.dataset.copy); if (toast) { toast.textContent = 'Đã sao chép: ' + button.dataset.copy; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800) } } catch { location.href = 'mailto:' + button.dataset.copy } }));
const videoModal = document.getElementById('video-modal');
if (videoModal) {
  const videoFrame = videoModal.querySelector('[data-video-frame]'),
    videoTitle = document.getElementById('video-modal-title'),
    closeVideo = videoModal.querySelector('[data-close-video]'),
    closeDelay = matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 240;
  let lastTrigger;

  document.querySelectorAll('[data-video]').forEach(card => card.addEventListener('click', () => {
    lastTrigger = card;
    videoModal.classList.remove('is-closing');
    const isPortrait = card.dataset.format === 'portrait' || card.classList.contains('shorts-showcase-card');
    if (isPortrait) {
      videoModal.classList.add('is-portrait');
    } else {
      videoModal.classList.remove('is-portrait');
    }
    videoTitle.textContent = card.dataset.title || 'Xem project';
    videoFrame.src = `https://www.youtube.com/embed/${card.dataset.video}?autoplay=1&rel=0`;
    videoModal.showModal();
    closeVideo.focus();
  }));

  const stopVideo = () => {
    if (!videoModal.open || videoModal.classList.contains('is-closing')) return;
    videoModal.classList.add('is-closing');
    setTimeout(() => {
      videoFrame.src = '';
      videoModal.close();
      videoModal.classList.remove('is-closing');
      videoModal.classList.remove('is-portrait');
      lastTrigger?.focus();
    }, closeDelay);
  };
  closeVideo.addEventListener('click', stopVideo);
  videoModal.addEventListener('cancel', event => { event.preventDefault(); stopVideo(); });
  videoModal.addEventListener('click', event => { if (event.target === videoModal) stopVideo(); });
}
/* Bulletproof Cursor Engine & Tactile Click Ripple Wave */
if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const dotEl = document.createElement('div');
  dotEl.className = 'cursor-dot';
  const ringEl = document.createElement('div');
  ringEl.className = 'cursor-ring';
  document.body.appendChild(dotEl);
  document.body.appendChild(ringEl);

  let mouseX = -100, mouseY = -100;
  let dotX = -100, dotY = -100;
  let ringX = -100, ringY = -100;
  let isVisible = false;
  let isHovering = false;

  const hoverTargets = 'a, button, .project-card, .gallery-card, .service, .toolkit-card, .fact-card, .timeline-card, .why-card, .process-step, summary, [data-copy], .shorts-showcase-card, iframe, dialog';

  addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const openDialog = document.querySelector('dialog[open]');
    if (openDialog) {
      document.documentElement.classList.add('has-open-dialog');
      dotEl.classList.remove('visible');
      ringEl.classList.remove('visible');
      return;
    } else {
      document.documentElement.classList.remove('has-open-dialog');
      if (!isVisible) {
        isVisible = true;
      }
      dotEl.classList.add('visible');
      ringEl.classList.add('visible');
    }

    // Clean hover state check on move
    const hoveredNow = !!e.target.closest(hoverTargets);
    if (hoveredNow !== isHovering) {
      isHovering = hoveredNow;
      dotEl.classList.toggle('hovering', isHovering);
      ringEl.classList.toggle('hovering', isHovering);
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    isHovering = false;
    dotEl.classList.remove('visible', 'hovering');
    ringEl.classList.remove('visible', 'hovering');
  });

  function renderCursor() {
    dotX += (mouseX - dotX) * 0.65;
    dotY += (mouseY - dotY) * 0.65;
    dotEl.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Click ripple wave (only on main page, not inside open dialog)
  document.addEventListener('mousedown', (e) => {
    if (document.querySelector('dialog[open]')) return;

    dotEl.classList.add('clicking');
    ringEl.classList.add('clicking');

    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.setProperty('--x', `${e.clientX}px`);
    ripple.style.setProperty('--y', `${e.clientY}px`);
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 520);
  });

  document.addEventListener('mouseup', () => {
    dotEl.classList.remove('clicking');
    ringEl.classList.remove('clicking');
  });
}
document.querySelectorAll('.faq-list details').forEach(detail => { const summary = detail.querySelector('summary'), answer = detail.querySelector('p'); if (!summary || !answer) return; summary.addEventListener('click', event => { event.preventDefault(); if (detail.open) { detail.classList.add('faq-closing'); answer.style.maxHeight = answer.scrollHeight + 'px'; requestAnimationFrame(() => answer.style.maxHeight = '0px'); setTimeout(() => { detail.open = false; detail.classList.remove('faq-closing'); answer.style.maxHeight = '' }, 300) } else { detail.open = true; detail.classList.add('faq-opening'); answer.style.maxHeight = '0px'; requestAnimationFrame(() => answer.style.maxHeight = answer.scrollHeight + 'px'); setTimeout(() => { detail.classList.remove('faq-opening'); answer.style.maxHeight = '' }, 320) } }) });

/* Shorts Showcase Scroll Autoplay Observer */
const shortsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const iframe = entry.target.querySelector('iframe');
    if (!iframe) return;
    const dataSrc = iframe.getAttribute('data-src');
    if (entry.isIntersecting) {
      if (dataSrc && (!iframe.src || iframe.src === 'about:blank' || iframe.src === location.href)) {
        iframe.src = dataSrc;
      } else if (iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    } else {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.shorts-showcase-card').forEach(card => shortsObserver.observe(card));

