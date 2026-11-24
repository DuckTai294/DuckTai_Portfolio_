/* DUCK//TAI — tương tác dùng chung cho mọi trang */
(() => {
  'use strict';
  const D = window.PORTFOLIO || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const colorOf = cat => (D.categories && D.categories[cat]) || '#46dcff';

  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------- Menu mobile ---------- */
  const toggle = $('.nav-toggle'), pill = $('.nav-pill');
  if (toggle && pill) {
    const set = open => {
      pill.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    };
    toggle.addEventListener('click', () => set(!pill.classList.contains('open')));
    pill.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && pill.classList.contains('open')) { set(false); toggle.focus(); } });
  }

  /* ---------- Thumbnail ---------- */
  const thumb = (id, q = 'hqdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`;
  const safeThumb = (img, id) => {
    const fb = () => { if (!img.dataset.fb) { img.dataset.fb = 1; img.src = thumb(id); } };
    img.addEventListener('error', fb);
    img.addEventListener('load', () => { if (img.naturalWidth <= 120) fb(); });
  };

  /* ---------- Thẻ clip ---------- */
  const clipCard = ([name, id, category, platform = 'youtube', custom = ''], format) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `clip ${format}`;
    b.style.setProperty('--c', colorOf(category));
    b.dataset.play = '';
    Object.assign(b.dataset, { id, title: name, platform, format });
    b.innerHTML = '<span class="clip-thumb"><img alt="" loading="lazy" decoding="async"><span class="badge"></span></span><span class="clip-body"><span class="clip-cat"></span><span class="clip-title"></span></span>';
    const img = $('img', b);
    img.src = custom || thumb(id, format === 'landscape' ? 'mqdefault' : 'hqdefault');
    if (!custom) safeThumb(img, id);
    $('.badge', b).textContent = platform === 'tiktok' ? 'TIKTOK · 9:16' : format === 'portrait' ? '9:16' : '16:9';
    $('.clip-cat', b).textContent = category;
    $('.clip-title', b).textContent = name;
    b.setAttribute('aria-label', 'Xem video: ' + name);
    return b;
  };

  /* ---------- Trình phát ---------- */
  let player, lastTrigger;
  const ensurePlayer = () => {
    if (player) return player;
    player = document.createElement('dialog');
    player.className = 'player';
    player.setAttribute('aria-labelledby', 'player-title');
    player.innerHTML = '<header><span id="player-title"></span><span style="display:flex;gap:8px;flex:none"><a class="btn close ext" target="_blank" rel="noopener">Mở gốc ↗</a><button class="btn btn-primary close" type="button" data-close>Đóng</button></span></header><div class="frame"><iframe title="Trình phát video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
    document.body.append(player);
    const close = () => player.close();
    $('[data-close]', player).addEventListener('click', close);
    player.addEventListener('click', e => { if (e.target === player) close(); });
    player.addEventListener('close', () => { $('iframe', player).src = 'about:blank'; lastTrigger?.focus(); });
    return player;
  };
  const openPlayer = ({ id, title = 'Video', platform = 'youtube', format = 'landscape' }) => {
    const p = ensurePlayer();
    const tt = platform === 'tiktok';
    p.classList.toggle('is-portrait', tt || format === 'portrait');
    $('#player-title', p).textContent = title;
    $('.ext', p).href = tt ? `https://www.tiktok.com/video/${id}` : `https://www.youtube.com/watch?v=${id}`;
    $('iframe', p).src = tt ? `https://www.tiktok.com/embed/v2/${id}` : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&playsinline=1`;
    p.showModal();
    $('[data-close]', p).focus();
  };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-play]');
    if (!t) return;
    lastTrigger = t;
    openPlayer(t.dataset);
  });

  /* ---------- Toast + sao chép ---------- */
  let toastEl, toastTimer;
  const toast = msg => {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite');
      document.body.append(toastEl);
    }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  };
  const copy = async text => {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;opacity:0'; document.body.append(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch { /* bỏ qua */ }
      ta.remove(); return ok;
    }
  };
  document.addEventListener('click', async e => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    toast((await copy(b.dataset.copy)) ? 'Đã sao chép: ' + b.dataset.copy : 'Hãy sao chép thủ công: ' + b.dataset.copy);
  });

  /* ---------- Hiện dần ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .08, rootMargin: '0px 0px -40px 0px' }) : null;
  const observeReveal = scope => $$('.reveal', scope).forEach(el => {
    if (!io) return el.classList.add('in');
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) setTimeout(() => el.classList.add('in'), 40);
    else io.observe(el);
  });

  /* ---------- Timecode, thanh tiến độ, scrollspy, dock ---------- */
  const FPS = 25, TOTAL = 150;
  const fmt = sec => {
    const f = Math.floor((sec % 1) * FPS), s = Math.floor(sec);
    return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, f].map(n => String(n).padStart(2, '0')).join(':');
  };
  const top = el => el.getBoundingClientRect().top + scrollY;

  const buildDock = () => {
    const sections = $$('[data-clip]').filter(s => !s.hidden);
    const bar = $('.nav-bar');
    const progress = document.createElement('div');
    progress.className = 'progress'; progress.setAttribute('aria-hidden', 'true');
    document.body.append(progress);
    const spyLinks = $$('.nav-pill a[href^="#"]');

    let clips = [], head, track;
    if (sections.length) {
      const dock = document.createElement('nav');
      dock.className = 'dock';
      dock.setAttribute('aria-label', 'Timeline các phần của trang');
      dock.innerHTML = `<div class="dock-inner"><div class="dock-label"><b>${document.body.dataset.seq || 'SEQ 01'}</b>V1 · DUCK//TAI</div><div class="dock-track"></div><div class="dock-tc" aria-hidden="true">00:00:00:00</div></div>`;
      track = $('.dock-track', dock);
      clips = sections.map(sec => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'dock-clip';
        b.textContent = sec.dataset.clip;
        b.setAttribute('aria-label', 'Tới phần ' + sec.dataset.clip);
        b.addEventListener('click', () => sec.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' }));
        track.append(b);
        return b;
      });
      head = document.createElement('i');
      head.className = 'playhead';
      track.append(head);
      document.body.append(dock);
    }
    const readouts = [...$$('.dock-tc'), ...$$('.tc-readout')];
    const sizeClips = () => sections.forEach((s, i) => { clips[i].style.flexGrow = Math.max(1, s.offsetHeight / 200).toFixed(2); });

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      progress.style.transform = `scaleX(${p})`;
      bar?.classList.toggle('scrolled', scrollY > 30);
      const tc = fmt(p * TOTAL);
      readouts.forEach(r => { r.textContent = tc; });
      if (!sections.length) return;
      const line = scrollY + innerHeight * p;
      let idx = 0;
      sections.forEach((s, i) => { if (top(s) <= line + 1) idx = i; });
      const t0 = top(sections[idx]);
      const t1 = sections[idx + 1] ? top(sections[idx + 1]) : document.documentElement.scrollHeight;
      const frac = Math.min(1, Math.max(0, (line - t0) / Math.max(1, t1 - t0)));
      head.style.transform = `translateX(${Math.min(clips[idx].offsetLeft + frac * clips[idx].offsetWidth, track.clientWidth - 2)}px)`;
      clips.forEach((c, i) => c.classList.toggle('is-active', i === idx));
      const id = sections[idx].id;
      spyLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    if (sections.length) sizeClips();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', () => { if (sections.length) sizeClips(); queue(); }, { passive: true });
    if ('ResizeObserver' in window && sections.length) new ResizeObserver(() => { sizeClips(); queue(); }).observe(document.body);
    update();
  };

  window.DT = { D, $, $$, colorOf, thumb, safeThumb, clipCard, openPlayer, toast, copy, observeReveal };
  window.DT.ready = () => { observeReveal(document); buildDock(); };
})();
