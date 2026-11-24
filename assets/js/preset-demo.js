/* Demo kéo thả preset vào timeline (trang Preset)
   - Tự chạy: con trỏ kéo từng preset thả lên clip, màn hình phát hiệu ứng
   - Người xem có thể tự kéo thả (chuột hoặc cảm ứng), hoặc bấm/Enter để áp dụng
   - Tạm dừng khi khung demo khuất màn hình hoặc khi người xem đang tự thử */
(() => {
  'use strict';
  const pp = document.getElementById('pp');
  if (!pp) return;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Dải tên hiệu ứng */
  const names = ['Zoom Punch', 'Camera Shake', 'RGB Glitch', 'Whip Pan', 'Flash White', 'Light Leak', 'Film Burn', 'Speed Ramp', 'Smooth Zoom', 'Spin Transition', 'Lens Distortion', 'VHS Retro', 'Pixel Sort', 'Strobe', 'Echo Trail', 'Typewriter', 'Bounce Title', 'Subtitle Pop', 'Text Shake', 'Glow Pulse'];
  const fill = (id, list) => { const el = document.getElementById(id); if (el) el.innerHTML = [...list, ...list].map(n => `<span>${n}</span>`).join(''); };
  fill('fx-track-1', names.slice(0, 10));
  fill('fx-track-2', names.slice(10));

  /* Danh sách preset trong bảng Effects */
  const fx = [
    { id: 'zoom', name: 'Zoom Punch', ab: 'ZP', c1: '#9a82d6', c2: '#9a82d6' },
    { id: 'shake', name: 'Camera Shake', ab: 'SH', c1: '#d98a35', c2: '#d98a35' },
    { id: 'glitch', name: 'RGB Glitch', ab: 'GL', c1: '#d0688f', c2: '#d0688f' },
    { id: 'whip', name: 'Whip Pan', ab: 'WP', c1: '#7a8bd6', c2: '#7a8bd6' },
    { id: 'flash', name: 'Flash White', ab: 'FL', c1: '#8a8a8a', c2: '#8a8a8a' },
    { id: 'speed', name: 'Speed Blur', ab: 'SB', c1: '#2fb592', c2: '#2fb592' }
  ];
  const list = $('#pp-list');
  fx.forEach((f, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="pp-item" data-i="${i}" style="--c1:${f.c1};--c2:${f.c2}" aria-label="Áp dụng preset ${f.name} lên Clip_01"><i>${f.ab}</i>${f.name}</button>`;
    list.append(li);
  });
  const items = $$('.pp-item', list);

  const screen = $('#pp-screen'), clip = $('#pp-clip'), badge = $('#pp-badge'), applied = $('#pp-applied');
  const steps = $$('#pp-steps li'), cursor = $('#pp-cursor'), ghost = $('#pp-ghost'), ph = $('#pp-ph'), tl = $('#pp-tl'), tc = $('#pp-tc'), mode = $('#pp-mode');
  const setStep = n => steps.forEach((s, i) => s.classList.toggle('on', i === n));

  /* Playhead + timecode chạy trong timeline */
  let phRaf = 0;
  const playSweep = (dur = 1600) => {
    cancelAnimationFrame(phRaf);
    const t0 = performance.now(), left = 52, width = tl.clientWidth - left - 14;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      ph.style.transform = `translateX(${p * width}px)`;
      const sec = p * 4, f = Math.floor((sec % 1) * 25);
      tc.textContent = `00:00:${String(Math.floor(sec)).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
      if (p < 1) phRaf = requestAnimationFrame(step);
    };
    phRaf = requestAnimationFrame(step);
  };

  /* Áp dụng hiệu ứng */
  let fxTimer;
  const apply = i => {
    const f = fx[i];
    clip.classList.remove('dropped'); void clip.offsetWidth; clip.classList.add('dropped', 'has-fx');
    badge.textContent = 'fx · ' + f.name;
    applied.textContent = '✓ ' + f.name + ' đã áp dụng';
    applied.classList.add('show');
    screen.className = 'pp-screen'; void screen.offsetWidth;
    screen.classList.add('fx-' + f.id);
    setStep(2);
    playSweep();
    clearTimeout(fxTimer);
    fxTimer = setTimeout(() => { applied.classList.remove('show'); }, 2200);
  };

  /* ---------- Tự chạy ---------- */
  const center = (el, dx = 0, dy = 0) => {
    const a = el.getBoundingClientRect(), b = pp.getBoundingClientRect();
    return [a.left - b.left + a.width * .5 + dx, a.top - b.top + a.height * .5 + dy];
  };
  let auto = !reduced, visible = false, idx = 0, timers = [], resumeT, pos = [40, 40];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; };
  const moveTo = (xy, dur) => {
    const from = pos; pos = xy;
    cursor.animate([{ transform: `translate(${from[0]}px, ${from[1]}px)` }, { transform: `translate(${xy[0]}px, ${xy[1]}px)` }], { duration: dur, easing: 'cubic-bezier(.45, 0, .2, 1)', fill: 'forwards' });
  };
  const cycle = () => {
    clearAll();
    if (!auto || !visible) return;
    const i = idx % 5, item = items[i];
    idx++;
    cursor.classList.add('on');
    setStep(0);
    moveTo(center(item, -30, 0), 700);
    later(() => { item.classList.add('hover'); }, 650);
    later(() => {
      setStep(1);
      cursor.classList.add('grab');
      ghost.textContent = 'fx · ' + fx[i].name;
      ghost.classList.add('on');
      moveTo(center(clip, -10, -4), 1100);
    }, 1000);
    later(() => {
      item.classList.remove('hover');
      clip.classList.add('drop-target');
    }, 1900);
    later(() => {
      clip.classList.remove('drop-target');
      ghost.classList.remove('on');
      cursor.classList.remove('grab');
      apply(i);
    }, 2250);
    later(cycle, 4600);
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => {
      visible = e.isIntersecting;
      if (visible && auto) { if (!timers.length) later(cycle, 400); } else { clearAll(); }
    }), { threshold: .35 }).observe(pp);
  }

  const goManual = () => {
    auto = false; clearAll();
    cursor.classList.remove('on', 'grab'); ghost.classList.remove('on');
    items.forEach(it => it.classList.remove('hover'));
    pp.classList.add('manual'); mode.textContent = '● BẠN ĐANG THỬ';
    clearTimeout(resumeT);
    if (!reduced) resumeT = setTimeout(() => { auto = true; pp.classList.remove('manual'); mode.textContent = '● AUTO DEMO'; if (visible) later(cycle, 200); }, 9000);
  };

  /* ---------- Người xem tự kéo thả ---------- */
  let drag = null;
  const overClip = (x, y) => { const r = clip.getBoundingClientRect(); return x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 10 && y <= r.bottom + 10; };
  list.addEventListener('pointerdown', e => {
    const it = e.target.closest('.pp-item');
    if (!it || e.button > 0) return;
    goManual();
    drag = { it, x: e.clientX, y: e.clientY, moved: false, el: null };
    it.setPointerCapture(e.pointerId);
  });
  list.addEventListener('pointermove', e => {
    if (!drag) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
    if (!drag.moved) {
      drag.moved = true;
      drag.it.classList.add('dragging');
      drag.el = document.createElement('div');
      drag.el.className = 'pp-drag-ghost';
      drag.el.textContent = 'fx · ' + fx[+drag.it.dataset.i].name;
      document.body.append(drag.el);
      setStep(1);
    }
    drag.el.style.left = e.clientX + 'px';
    drag.el.style.top = e.clientY + 'px';
    clip.classList.toggle('drop-target', overClip(e.clientX, e.clientY));
  });
  const endDrag = e => {
    if (!drag) return;
    const { it, moved, el } = drag;
    drag = null;
    it.classList.remove('dragging');
    el?.remove();
    clip.classList.remove('drop-target');
    if (!moved || (e && overClip(e.clientX, e.clientY))) apply(+it.dataset.i); // bấm (không kéo) cũng áp dụng
    else setStep(0);
  };
  list.addEventListener('pointerup', endDrag);
  list.addEventListener('pointercancel', () => endDrag(null));
  /* Bàn phím: Enter/Space trên nút preset → áp dụng */
  list.addEventListener('keydown', e => {
    const it = e.target.closest('.pp-item');
    if (it && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); goManual(); apply(+it.dataset.i); }
  });
})();
