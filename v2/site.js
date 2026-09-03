// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// Auto current year
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

// Intersection Observer Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Live Timecode Clock (Studio Clock)
const timecodeEl = document.getElementById('live-timecode');
if (timecodeEl) {
  function updateTimecode() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(now.getMilliseconds() / 40)).padStart(2, '0');
    timecodeEl.textContent = `${h}:${m}:${s}:${ms}`;
  }
  setInterval(updateTimecode, 40);
  updateTimecode();
}

// Clipboard copy handler
const toast = document.querySelector('.toast');
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const val = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(val);
      if (toast) {
        toast.textContent = 'COPIED TO CLIPBOARD: ' + val;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }
    } catch {
      location.href = 'mailto:' + val;
    }
  });
});

// Video Modal Player
const videoModal = document.getElementById('video-modal');
if (videoModal) {
  const videoFrame = videoModal.querySelector('[data-video-frame]');
  const videoTitle = document.getElementById('video-modal-title');
  const closeVideo = videoModal.querySelector('[data-close-video]');
  let lastTrigger;

  document.querySelectorAll('[data-video]').forEach(card => {
    card.addEventListener('click', () => {
      lastTrigger = card;
      const vidId = card.dataset.video;
      const title = card.dataset.title || 'Xem project';
      if (videoTitle) videoTitle.textContent = 'PLAYING // ' + title.toUpperCase();
      if (videoFrame) videoFrame.src = `https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0`;
      videoModal.showModal();
      if (closeVideo) closeVideo.focus();
    });
  });

  const stopVideo = () => {
    if (!videoModal.open) return;
    if (videoFrame) videoFrame.src = '';
    videoModal.close();
    lastTrigger?.focus();
  };

  if (closeVideo) closeVideo.addEventListener('click', stopVideo);
  videoModal.addEventListener('cancel', e => { e.preventDefault(); stopVideo(); });
  videoModal.addEventListener('click', e => { if (e.target === videoModal) stopVideo(); });
}
