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
  const tracker = document.createElement('div');
  tracker.className = 'cursor-tracker';

  const dot = document.createElement('div');
  dot.className = 'cursor-dot-inner';

  const ring = document.createElement('div');
  ring.className = 'cursor-ring-inner';

  tracker.appendChild(dot);
  tracker.appendChild(ring);
  document.body.appendChild(tracker);

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;
  let isVisible = false;

  addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      tracker.classList.add('visible');
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    tracker.classList.remove('visible');
  });

  // Fast lerp loop - sets position ONLY on parent tracker
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.55;
    cursorY += (mouseY - cursorY) * 0.55;

    tracker.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover triggers
  const hoverTargets = 'a, button, .project-card, .service, .toolkit-card, .fact-card, .timeline-card, .why-card, .process-step, summary, [data-copy], .shorts-showcase-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      tracker.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      tracker.classList.remove('hovering');
    }
  });

  // Mousedown click & hold
  document.addEventListener('mousedown', (e) => {
    tracker.classList.add('clicking');

    // Create click ripple shockwave animation
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 550);
  });

  document.addEventListener('mouseup', () => {
    tracker.classList.remove('clicking');
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

