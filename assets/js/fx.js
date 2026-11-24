/* ============================================================
   FX — hiệu ứng & UI phần mềm dựng phim
   - Intro "cắt mở" ~1 giây, 1 lần mỗi phiên
   - Con trỏ công cụ + thanh Tools: V (chọn) · C (dao cắt) · H (bàn tay kéo trang)
   - Phím tắt J / K / L để tua trang như tua video
   - Đồng hồ âm lượng (VU) nhảy theo tốc độ cuộn
   - Đèn rọi theo chuột, nghiêng 3D, đếm số, chip chuyển cảnh
   ============================================================ */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const typing = el => !!(el && el.closest && el.closest('input, textarea, select, [contenteditable="true"]'));
  const tcNow = () => ($('.dock-tc') || {}).textContent || '00:00:00:00';
  const icon = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  /* ---------- Bộ lọc SVG cho liquid glass (khúc xạ nền phía sau) ---------- */
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('aria-hidden', 'true');
  defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
  defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  const filt = (id, freq, scale, blur) => `<filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="5" result="n"/><feGaussianBlur in="n" stdDeviation="${blur}" result="s"/><feDisplacementMap in="SourceGraphic" in2="s" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  defs.innerHTML = filt('lg-refract', '0.012 0.02', 24, 2.5) + filt('lg-refract-strong', '0.008 0.014', 55, 3) + filt('lg-lens', '0.02 0.02', 70, 4);
  document.body.prepend(defs);

  /* Viền tối quanh màn hình */
  const vignette = document.createElement('div');
  vignette.className = 'vignette'; vignette.setAttribute('aria-hidden', 'true');
  document.body.append(vignette);

  /* ---------- Lớp nền: cực quang + hạt phim ---------- */
  if (!reduced) {
    const aurora = document.createElement('div');
    aurora.className = 'aurora'; aurora.setAttribute('aria-hidden', 'true');
    aurora.innerHTML = '<i></i><i></i><i></i><i></i>';
    const grain = document.createElement('div');
    grain.className = 'grain'; grain.setAttribute('aria-hidden', 'true');
    document.body.append(aurora, grain);
  }

  /* ---------- Chỉ chạy vệt sáng chữ kim loại khi đang thấy ---------- */
  if ('IntersectionObserver' in window) {
    const vis = new IntersectionObserver(es => es.forEach(e => { e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'; }));
    $$('.chrome').forEach(el => vis.observe(el));
  }

  /* ---------- Intro "cắt mở": clip bật vào track → playhead quét → Razor cắt → hai nửa tách ra (~1 giây) ---------- */
  const runIntro = () => {
    if (!document.body.dataset.intro || reduced) return;
    try { if (sessionStorage.getItem('dt-intro')) return; sessionStorage.setItem('dt-intro', '1'); } catch { /* bỏ qua */ }
    root.classList.add('intro-on');
    const el = document.createElement('div');
    el.className = 'cutin'; el.setAttribute('role', 'presentation');
    const widths = [1.4, .8, 1.8, 1, 1.2, .7];
    el.innerHTML = '<div class="half l"></div><div class="half r"></div>' +
      '<div class="core"><div class="top"><span>DUCK//TAI · SEQ 01</span><b>00:00:00:00</b></div>' +
      '<div class="trk">' + widths.map((w, k) => `<span style="flex:${w};--k:${k}"></span>`).join('') + '<i class="ph"></i></div></div>' +
      '<i class="flashlay"></i><i class="slash"></i><span class="cut-skip">BẤM ĐỂ BỎ QUA</span>';
    document.body.append(el);

    // Một "đồng hồ" duy nhất điều khiển playhead + timecode → chạy mượt theo từng khung hình
    const tc = $('.top b', el), trk = $('.trk', el), ph = $('.ph', el);
    const SWEEP_START = 140, SWEEP_DUR = 620, CUT_AT = 800; // mili-giây
    const ease = p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2); // easeInOutCubic
    const t0 = performance.now();
    let raf = 0, done = false, lastF = -1;
    const tick = now => {
      const t = now - t0;
      const p = ease(Math.min(1, Math.max(0, (t - SWEEP_START) / SWEEP_DUR)));
      const w = trk.clientWidth - 2;
      ph.style.transform = `translate3d(${(p * w).toFixed(1)}px, 0, 0)`;
      trk.style.setProperty('--pw', `${(p * (w - 4)).toFixed(1)}px`);
      if (t > SWEEP_START - 60) ph.classList.add('on');
      const f = Math.round(p * 25);
      if (f !== lastF) { lastF = f; tc.textContent = f === 25 ? '00:00:01:00' : `00:00:00:${String(f).padStart(2, '0')}`; }
      if (t >= CUT_AT) { open(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const open = () => {
      if (done) return; done = true;
      cancelAnimationFrame(raf);
      el.classList.add('cutting');                       // phần giữa mờ dần, vạch cắt vẽ ra, mép sáng lên
      setTimeout(() => {                                 // hai nửa tách ra
        el.classList.add('open');
        root.classList.remove('intro-on');
      }, 140);
      setTimeout(() => el.remove(), 1000);
      removeEventListener('keydown', onKey);
    };
    const onKey = e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') open(); };
    el.addEventListener('click', open);
    addEventListener('keydown', onKey);
  };
  runIntro();

  /* ---------- Đèn rọi theo chuột ---------- */
  if (fine && !reduced) {
    let raf = 0, last;
    addEventListener('pointermove', e => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const t = last.target.closest && last.target.closest('.glass, .clip, .service, .nav-pill, .btn, .tile, .mail-box, .tools-panel, .toolbar .wrap, .lm-luts button, .chip');
        if (!t) return;
        const r = t.getBoundingClientRect();
        t.style.setProperty('--mx', `${last.clientX - r.left}px`);
        t.style.setProperty('--my', `${last.clientY - r.top}px`);
      });
    }, { passive: true });
  }

  /* ---------- Giọt kính lỏng đi theo chuột trong hero ---------- */
  const hero = $('.hero');
  if (hero && fine && !reduced) {
    const lens = document.createElement('div');
    lens.className = 'lens'; lens.setAttribute('aria-hidden', 'true');
    hero.append(lens);
    let lx = 0, ly = 0, tx = 0, ty = 0, lr = 0;
    const move = () => {
      lx += (tx - lx) * .16; ly += (ty - ly) * .16;
      lens.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      lr = Math.abs(tx - lx) + Math.abs(ty - ly) > .3 ? requestAnimationFrame(move) : 0;
    };
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      // Ẩn giọt kính khi rê lên nút/chữ để không che nội dung cần bấm
      lens.classList.toggle('on', !e.target.closest('a, button, .mini-tl, p'));
      if (!lens.dataset.init) { lx = tx; ly = ty; lens.dataset.init = 1; }
      if (!lr) lr = requestAnimationFrame(move);
    });
  }

  /* ---------- Nghiêng 3D ---------- */
  if (fine && !reduced) {
    $$('.viewer, .mini-tl, .price-card, .photo, .monitor').forEach(el => {
      el.classList.add('tilt');
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.classList.add('is-tilting');
        el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-tilting');
        el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* ---------- Đếm số ---------- */
  const countUp = el => {
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m || reduced) return;
    const end = +m[1], suffix = m[2], start = end >= 1000 ? end - 40 : 0, t0 = performance.now(), dur = 1300;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (end - start) * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { countUp(e.target); co.unobserve(e.target); } }), { threshold: .6 });
    $$('.stat strong').forEach(el => co.observe(el));
  }

  /* ---------- Chip chuyển cảnh giữa các phần ---------- */
  const fxNames = ['Cross Dissolve', 'Dip to Black', 'Film Dissolve', 'Whip Pan', 'Morph Cut', 'Glitch', 'Additive Dissolve', 'Zoom Blur'];
  const xo = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); xo.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' }) : null;
  $$('main [data-clip]').slice(1).forEach((sec, i) => {
    if (sec.hidden) return;
    const x = document.createElement('div');
    x.className = 'xfade'; x.setAttribute('aria-hidden', 'true');
    x.innerHTML = `<span class="xfade-inner">${fxNames[i % fxNames.length]} <b>00:00:0${(i % 3) + 1}:00</b></span>`;
    sec.before(x);
    xo ? xo.observe(x) : x.classList.add('in');
  });

  /* ---------- HUD + tua J/K/L ---------- */
  const hud = document.createElement('div');
  hud.className = 'shuttle'; hud.setAttribute('role', 'status'); hud.setAttribute('aria-live', 'polite');
  document.body.append(hud);
  let hudT;
  const showHud = html => { hud.innerHTML = html; hud.classList.add('show'); clearTimeout(hudT); hudT = setTimeout(() => hud.classList.remove('show'), 1400); };

  const levels = [0, 380, 900, 1900];
  let speed = 0, shuttleRaf = 0, lastT = 0;
  const loop = t => {
    const dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
    const max = root.scrollHeight - innerHeight;
    if ((speed > 0 && scrollY >= max - 1) || (speed < 0 && scrollY <= 0)) { setSpeed(0); return; }
    scrollBy({ top: speed * dt, behavior: 'instant' });
    shuttleRaf = requestAnimationFrame(loop);
  };
  const setSpeed = v => {
    speed = v;
    cancelAnimationFrame(shuttleRaf); shuttleRaf = 0;
    const lv = levels.indexOf(Math.abs(v));
    if (v === 0) showHud('■ STOP <small>K</small>');
    else showHud(`${v > 0 ? '▶▶' : '◀◀'} ${[0, 1, 2, 4][lv]}x <small>${v > 0 ? 'L' : 'J'} · K để dừng</small>`);
    if (v !== 0) { lastT = performance.now(); shuttleRaf = requestAnimationFrame(loop); }
  };
  const shuttle = dir => {
    const cur = Math.sign(speed) === dir ? levels.indexOf(Math.abs(speed)) : 0;
    setSpeed(dir * levels[Math.min(levels.length - 1, cur + 1)]);
  };
  ['wheel', 'touchstart'].forEach(ev => addEventListener(ev, () => { if (speed) setSpeed(0); }, { passive: true }));

  /* ---------- Công cụ: V / C / H ---------- */
  let tool = 'select';
  const tools = {
    select: { key: 'V', tip: 'Selection Tool (V)', svg: icon('<path d="M5 3l14 8-6 2-2 6z"/>') },
    razor: { key: 'C', tip: 'Razor Tool (C) — bấm để cắt', svg: icon('<path d="M4 20 20 4"/><path d="M14 4h6v6"/><path d="M4 14v6h6"/>') },
    hand: { key: 'H', tip: 'Hand Tool (H) — kéo để cuộn', svg: icon('<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/>') }
  };
  const panel = document.createElement('div');
  panel.className = 'tools-panel'; panel.setAttribute('role', 'toolbar'); panel.setAttribute('aria-label', 'Công cụ');
  panel.innerHTML = '<span class="tp-title">TOOLS</span>' +
    Object.entries(tools).map(([id, t]) => `<button type="button" data-tool="${id}" data-tip="${t.tip}" aria-label="${t.tip}" aria-pressed="${id === 'select'}">${t.svg}<span class="k">${t.key}</span></button>`).join('') +
    `<button type="button" data-keys data-tip="Phím tắt (?)" aria-label="Xem phím tắt">${icon('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>')}<span class="k">?</span></button>`;
  document.body.append(panel);

  const setTool = id => {
    tool = id;
    root.classList.toggle('tool-razor', id === 'razor');
    root.classList.toggle('tool-hand', id === 'hand');
    $$('[data-tool]', panel).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === id)));
    cur.classList.toggle('mode-razor', id === 'razor');
    cur.classList.toggle('mode-hand', id === 'hand');
    showHud(`${tools[id].key} · ${tools[id].tip}`);
  };
  panel.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.tool) setTool(b.dataset.tool);
    if (b.hasAttribute('data-keys')) openKeys();
  });

  /* Razor: bấm để "cắt" */
  addEventListener('click', e => {
    if (tool !== 'razor' || e.target.closest('.tools-panel, dialog')) return;
    const s = document.createElement('div');
    s.className = 'slice';
    s.style.left = `${e.clientX - 1}px`;
    s.style.setProperty('--y', `${Math.max(10, e.clientY - 30)}px`);
    s.dataset.tc = 'CUT ' + tcNow();
    document.body.append(s);
    setTimeout(() => s.remove(), 750);
  }, true);

  /* Hand: kéo để cuộn trang */
  let drag = null;
  addEventListener('pointerdown', e => {
    if (tool !== 'hand' || e.button !== 0 || e.target.closest('a, button, input, textarea, select, summary, .tools-panel, dialog')) return;
    drag = { y: e.clientY, s: scrollY };
    root.classList.add('dragging');
    e.preventDefault();
  });
  addEventListener('pointermove', e => { if (drag) scrollTo({ top: drag.s - (e.clientY - drag.y) * 1.4, behavior: 'instant' }); }, { passive: true });
  addEventListener('pointerup', () => { drag = null; root.classList.remove('dragging'); });

  /* ---------- Con trỏ ---------- */
  const cur = document.createElement('div');
  cur.className = 'cur'; cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<span class="cur-ring"></span><span class="cur-label"></span>';
  if (fine && !reduced) document.body.append(cur);
  const label = $('.cur-label', cur);
  let cx = -100, cy = -100, rx = -100, ry = -100, curRaf = 0;
  const drawCur = () => {
    rx += (cx - rx) * .28; ry += (cy - ry) * .28;
    cur.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    curRaf = Math.abs(cx - rx) + Math.abs(cy - ry) > .3 ? requestAnimationFrame(drawCur) : 0;
  };
  if (fine && !reduced) {
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      cx = e.clientX; cy = e.clientY;
      if (!cur.classList.contains('on')) { rx = cx; ry = cy; cur.classList.add('on'); }
      const play = e.target.closest('[data-play], #showreel-btn, [data-tr="play"]');
      const link = !play && e.target.closest('a, button, summary, [role="tab"], label, select');
      cur.classList.toggle('is-play', !!play);
      cur.classList.toggle('is-link', !!link);
      let text = '';
      if (tool === 'razor') text = 'C · RAZOR';
      else if (tool === 'hand') text = 'H · HAND';
      else if (play) text = '▶ PLAY';
      else if (e.target.closest('.grade-view')) text = '◀ KÉO SO SÁNH ▶';
      label.textContent = text;
      cur.classList.toggle('has-label', !!text);
      if (!curRaf) curRaf = requestAnimationFrame(drawCur);
    }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    addEventListener('blur', () => cur.classList.remove('on'));
  }

  /* ---------- Bảng phím tắt ---------- */
  let keysDlg;
  const openKeys = () => {
    if (!keysDlg) {
      keysDlg = document.createElement('dialog');
      keysDlg.className = 'keys';
      keysDlg.setAttribute('aria-label', 'Phím tắt');
      keysDlg.innerHTML = `<div class="window-bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span>KEYBOARD_SHORTCUTS.kys</span><button class="btn btn-sm" type="button" data-x>Đóng</button></div>
        <div class="keys-body">
          <div class="keys-row"><div><kbd>J</kbd><kbd>K</kbd><kbd>L</kbd></div><span>Tua trang lùi / dừng / tới — bấm nhiều lần để tua nhanh 1x → 2x → 4x</span></div>
          <div class="keys-row"><div><kbd>V</kbd></div><span>Selection Tool — con trỏ bình thường</span></div>
          <div class="keys-row"><div><kbd>C</kbd></div><span>Razor Tool — bấm vào đâu cũng “cắt” tại timecode hiện tại</span></div>
          <div class="keys-row"><div><kbd>H</kbd></div><span>Hand Tool — giữ chuột và kéo để cuộn trang</span></div>
          <div class="keys-row"><div><kbd>Home</kbd><kbd>End</kbd></div><span>Về đầu / cuối sequence</span></div>
          <div class="keys-row"><div><kbd>?</kbd></div><span>Mở bảng này</span></div>
        </div>`;
      document.body.append(keysDlg);
      $('[data-x]', keysDlg).addEventListener('click', () => keysDlg.close());
      keysDlg.addEventListener('click', e => { if (e.target === keysDlg) keysDlg.close(); });
    }
    if (!keysDlg.open) keysDlg.showModal();
  };

  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target) || root.classList.contains('intro-on')) return;
    if ($('dialog[open]') && e.key !== '?') return;
    const k = e.key.toLowerCase();
    if (k === 'l') { e.preventDefault(); shuttle(1); }
    else if (k === 'j') { e.preventDefault(); shuttle(-1); }
    else if (k === 'k') { e.preventDefault(); setSpeed(0); }
    else if (k === 'v') setTool('select');
    else if (k === 'c') setTool('razor');
    else if (k === 'h') setTool('hand');
    else if (e.key === '?') { e.preventDefault(); openKeys(); }
  });

  /* ---------- Nút transport (nếu trang có) ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-tr]');
    if (!b) return;
    const a = b.dataset.tr;
    if (a === 'top') scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    else if (a === 'end') ($('#lien-he') || document.body).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    else if (a === 'rew') shuttle(-1);
    else if (a === 'ff') shuttle(1);
    else if (a === 'play') $('#showreel-btn')?.click();
  });

  /* ---------- VU meter trong dock ---------- */
  const dockTc = $('.dock-tc');
  if (dockTc) {
    const vu = document.createElement('span');
    vu.className = 'vu'; vu.setAttribute('aria-hidden', 'true');
    vu.innerHTML = '<i></i><i></i>';
    dockTc.before(vu);
    const [L, R] = $$('i', vu);
    let lastY = scrollY, lastTime = performance.now(), lv = [.1, .1];
    const tick = now => {
      const dt = Math.max(1, now - lastTime); lastTime = now;
      const vel = Math.abs(scrollY - lastY) / dt * 1000; lastY = scrollY;
      const base = Math.min(.95, .08 + vel / 2600);
      [L, R].forEach((bar, i) => {
        const target = reduced ? .15 : Math.min(1, base + Math.random() * (.08 + base * .25));
        lv[i] = target > lv[i] ? target : lv[i] * .92 + target * .08;
        bar.style.setProperty('--lv', lv[i].toFixed(3));
      });
      if (!document.hidden) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { lastTime = performance.now(); requestAnimationFrame(tick); } });
  }
})();
