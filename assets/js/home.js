/* Trang chủ: dựng nội dung từ data.js */
(() => {
  'use strict';
  const { D, $, $$, thumb, safeThumb, openPlayer, copy, toast } = window.DT;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const long = D.longForm || [], short = D.shortForm || [];
  const total = long.length + short.length;
  $$('[data-count]').forEach(el => { el.textContent = total; });

  /* Showreel */
  $('#showreel-btn').addEventListener('click', () => openPlayer({ id: D.showreel.id, title: D.showreel.title || 'Showreel' }));

  /* Dải chữ chạy trong hero */
  const words = ['Long-form edit', 'Shorts · Reels', 'Podcast', 'Color grading', 'Motion graphics', 'Sound design', 'Retention edit', 'Event recap'];
  $('#marquee').innerHTML = [...words, ...words].map(w => `<span>${w}</span>`).join('');

  /* Timecode chạy trong mini timeline (dừng khi người dùng muốn giảm chuyển động) */
  const miniTc = $('#mini-tc');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let f = 0;
    setInterval(() => {
      f = (f + 1) % (9 * 25);
      const s = Math.floor(f / 25), fr = f % 25;
      miniTc.textContent = `01:00:${String(s).padStart(2, '0')}:${String(fr).padStart(2, '0')}`;
    }, 40);
  }

  /* Phần mềm (tab) */
  const tools = [
    ['Pr', 'Premiere Pro', 'Dựng chính & pacing', 'Phần mềm dựng chính: cắt nhịp, sắp cấu trúc và hoàn thiện timeline cho mọi video dài.'],
    ['Ae', 'After Effects', 'Motion & hiệu ứng', 'Motion graphics, chữ động, chuyển cảnh và hiệu ứng làm nổi bật điểm nhấn.'],
    ['Cc', 'CapCut PC', 'Short-form tốc độ cao', 'Shorts/Reels bắt trend nhanh, caption sinh động, xuất nhiều bản cùng lúc.'],
    ['Au', 'Audition', 'Âm thanh', 'Lọc tạp âm, cân bằng giọng nói, phối nhạc và SFX cho rõ và cuốn.'],
    ['Ps', 'Photoshop', 'Thumbnail & asset', 'Thiết kế thumbnail tăng lượt bấm và các asset hình ảnh dùng trong video.'],
    ['Ai', 'Illustrator', 'Đồ hoạ vector', 'Logo, typography và các yếu tố nhận diện dùng trong motion.']
  ];
  const row = $('#tool-row'), panel = $('#tool-panel'), toolName = $('#tool-name');
  const selectTool = i => {
    $$('.tool-btn', row).forEach((b, j) => { b.setAttribute('aria-selected', String(i === j)); b.tabIndex = i === j ? 0 : -1; });
    toolName.textContent = tools[i][1];
    $('b', panel).textContent = tools[i][2];
    $('p', panel).textContent = tools[i][3];
  };
  tools.forEach(([abbr, name], i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tool-btn'; b.textContent = abbr;
    b.setAttribute('role', 'tab'); b.setAttribute('aria-label', name); b.setAttribute('aria-controls', 'tool-panel');
    b.addEventListener('click', () => selectTool(i));
    b.addEventListener('keydown', e => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!k) return;
      const n = (i + k + tools.length) % tools.length;
      selectTool(n); row.children[n].focus();
    });
    row.append(b);
  });
  selectTool(0);

  /* Media bin: thư mục theo nhóm thể loại */
  const all = [...long.map(v => ({ v, format: 'landscape' })), ...short.map(v => ({ v, format: 'portrait' }))];
  const groups = [
    { name: 'Gaming', cat: 'Gaming', test: c => c === 'Gaming' || c === 'Gaming Shorts' },
    { name: 'Sự kiện & Ads', cat: 'Sự kiện', test: c => c === 'Sự kiện' || c === 'Quảng cáo' },
    { name: 'Bất động sản', cat: 'Bất động sản', test: c => c === 'Bất động sản' },
    { name: 'Podcast', cat: 'Podcast', test: c => c === 'Podcast' },
    { name: 'Khoá học', cat: 'Khóa học', test: c => c === 'Khóa học' || c === 'Giáo dục' },
    { name: 'Vlog & Review', cat: 'Review', test: c => c === 'Review' }
  ].map(g => ({ ...g, items: all.filter(x => g.test(x.v[2])) })).filter(g => g.items.length);

  const slug = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 42) || 'clip';
  const folderPath = (g, i) => `D:/DUCKTAI/BIN/${String(i + 1).padStart(2, '0')}_${slug(g.name).toUpperCase()}`;
  $('#bin-summary').textContent = `${groups.length} thư mục · ${total} clip`;

  const folders = $('#folders');
  groups.forEach((g, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'folder';
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', `Mở thư mục ${g.name}, ${g.items.length} clip`);
    const imgs = g.items.slice(0, 2).map(x => x.v[4] || thumb(x.v[1], 'mqdefault'));
    b.innerHTML = `<span class="tab"></span><span class="back"></span><span class="peek">${imgs.map(src => `<img src="${esc(src)}" alt="" loading="lazy">`).join('')}</span><span class="front"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="meta"><strong>${esc(g.name)}</strong><small>${g.items.length} clip</small></span></span>`;
    b.addEventListener('click', () => openFolder(i));
    folders.append(b);
  });

  const list = $('#file-list');
  const SHOW = 8;
  const openFolder = i => {
    const g = groups[i];
    $$('.folder', folders).forEach((f, j) => f.setAttribute('aria-pressed', String(i === j)));
    $('#bin-path').textContent = folderPath(g, i);
    $('#bin-count').textContent = `${g.items.length} clip`;
    $('#bin-foot').textContent = g.items.length > SHOW ? `Hiển thị ${SHOW}/${g.items.length} clip` : `${g.items.length} clip`;
    $('#bin-more').href = 'works.html?cat=' + encodeURIComponent(g.cat);
    list.replaceChildren(...g.items.slice(0, SHOW).map(({ v: [name, id, cat, platform = 'youtube', custom = ''], format }) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'file';
      b.dataset.play = '';
      Object.assign(b.dataset, { id, title: name, platform, format });
      b.setAttribute('aria-label', 'Xem video: ' + name);
      b.innerHTML = `<img alt="" loading="lazy" src="${esc(custom || thumb(id, 'mqdefault'))}"><span class="fname">${esc(slug(name))}.mp4</span><span class="fcat">${esc(cat)}</span><span class="ffmt">${platform === 'tiktok' ? 'TIKTOK' : format === 'portrait' ? '9:16' : '16:9'}</span><span class="go" aria-hidden="true">▶</span>`;
      li.append(b);
      return li;
    }));
  };
  openFolder(0);

  /* Selected cuts */
  const cases = D.cases || [];
  $('#cuts').innerHTML = cases.map((c, i) => {
    const portrait = c.format === 'portrait';
    const media = portrait
      ? `<img class="bg" alt="" loading="lazy" src="${thumb(c.id)}"><img class="main" alt="" loading="lazy" src="${thumb(c.id)}">`
      : `<img class="main" alt="" loading="lazy" data-max src="${thumb(c.id, 'maxresdefault')}">`;
    const meta = [
      ['Khách hàng', c.client],
      ['Vai trò', 'Video editor'],
      c.result ? ['Kết quả', c.result] : ['Định dạng', portrait ? '9:16 · Short' : '16:9 · Long-form']
    ];
    return `<article class="cut">
      <div class="cut-media reveal">
        <button class="viewer brackets ${portrait ? 'portrait' : ''}" type="button" data-play data-id="${esc(c.id)}" data-title="${esc(c.title)}" data-format="${c.format}" aria-label="Xem video ${esc(c.title)}">
          ${media}<span class="safe" aria-hidden="true"></span>
          <span class="hud tl" aria-hidden="true">TC 01:00:00:00</span>
          <span class="hud tr" aria-hidden="true">${portrait ? '9:16 · 1080×1920' : '16:9 · 4K UHD'}</span>
          <span class="hud bl" aria-hidden="true">${esc(c.category)}</span>
          <span class="playbtn" aria-hidden="true"></span>
        </button>
        <div class="scrubber" aria-hidden="true"><span class="ticks"></span><span class="range"></span><span class="head"></span></div>
        <div class="scrub-meta" aria-hidden="true"><span>IN 01:00:02:10</span><span>CLIP ${String(i + 1).padStart(2, '0')} · V1</span><span>OUT 01:00:48:16</span></div>
      </div>
      <div class="cut-copy reveal" style="--i:1">
        <p class="idx">${String(i + 1).padStart(2, '0')} <span>/ ${String(cases.length).padStart(2, '0')}</span></p>
        <h3 class="chrome">${esc(c.title)}</h3>
        <p class="kind">${esc(c.category)} · ${portrait ? 'Short-form' : 'Long-form'}</p>
        <p class="desc">${esc(c.brief)} ${esc(c.role)}</p>
        <dl class="cut-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        ${(c.tags || []).length ? `<div class="tags">${c.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
      </div>
    </article>`;
  }).join('');
  $$('#cuts img[data-max]').forEach(img => safeThumb(img, img.closest('[data-id]').dataset.id));

  /* Lumetri Color: chỉnh màu tương tác + so sánh trước/sau */
  (() => {
    // Các clip để thử chỉnh màu — thêm/đổi ảnh tại đây (ảnh 16:9, nên dùng ảnh không có chữ)
    const clips = [
      { name: 'A001_GYM_RUN.mov', src: 'assets/img/grade-gym.webp' },
      { name: 'A002_SEA_OF_CLOUDS.mov', src: 'assets/img/grade-mountain.webp' }
    ];
    const before = $('#grade-before'), after = $('#grade-img'), pick = $('#clip-pick');
    const useClip = i => {
      [before, after].forEach(img => { img.src = clips[i].src; });
      $('#grade-name').textContent = 'Program · ' + clips[i].name;
      $$('button', pick).forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
    };
    clips.forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<img src="${esc(c.src)}" alt="" loading="lazy"><span>${esc(c.name.split('.')[0])}</span>`;
      b.setAttribute('aria-label', 'Chỉnh màu clip ' + c.name);
      b.addEventListener('click', () => useClip(i));
      pick.append(b);
    });
    useClip(0);
    const view = $('#grade-view'), tint = $('#grade-tint'), look = $('#grade-look'), vig = $('#grade-vig');
    const inputs = $$('#lumetri input[data-k]');
    const st = { exp: 0, con: 0, sat: 100, temp: 0, vig: 0 };
    const luts = {
      'Gốc': { exp: 0, con: 0, sat: 100, temp: 0, vig: 0, look: '' },
      'Teal & Orange': { exp: -.2, con: 20, sat: 118, temp: 10, vig: 40, look: 'linear-gradient(135deg, #00a3a3, #ff7a1a)', lo: .2 },
      'Cinematic': { exp: -.3, con: 32, sat: 85, temp: -12, vig: 55, look: 'linear-gradient(180deg, #1b3a6b, #c98a4b)', lo: .22 },
      'Vintage': { exp: .2, con: -22, sat: 70, temp: 38, vig: 45, look: '#c8a26b', lo: .25 },
      'Đen trắng': { exp: 0, con: 28, sat: 0, temp: 0, vig: 35, look: '' },
      'Neon': { exp: .1, con: 18, sat: 175, temp: -25, vig: 20, look: 'linear-gradient(90deg, #ff4fd8, #46dcff)', lo: .32 }
    };
    const lutBox = $('#luts');
    Object.keys(luts).forEach(name => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = name; b.setAttribute('aria-pressed', String(name === 'Gốc'));
      b.addEventListener('click', () => applyLut(name));
      lutBox.append(b);
    });
    // Dữ liệu "scope" giả lập — phản ứng theo thanh trượt cho cảm giác như Lumetri Scopes
    const N = 22, seed = [...Array(N)].map((_, i) => 50 + 26 * Math.sin(i * .7) * Math.cos(i * .23));
    const scopes = ['r', 'g', 'b'].map(c => { const el = $('#sc-' + c); for (let i = 0; i < N; i++) el.append(document.createElement('i')); return $$('i', el); });
    const render = () => {
      after.style.filter = `brightness(${(1 + st.exp * .35).toFixed(2)}) contrast(${(1 + st.con / 100).toFixed(2)}) saturate(${(st.sat / 100).toFixed(2)})`;
      tint.style.background = st.temp >= 0 ? '#ff9a3c' : '#3c7bff';
      tint.style.opacity = (Math.abs(st.temp) / 100 * .85).toFixed(2);
      vig.style.opacity = (st.vig / 100).toFixed(2);
      inputs.forEach(inp => { const o = inp.nextElementSibling; const v = st[inp.dataset.k]; o.textContent = inp.dataset.k === 'exp' ? (+v).toFixed(1) : Math.round(v); });
      for (let i = 0; i < N; i++) {
        const base = 50 + (seed[i] - 50) * (1 + st.con / 100) + st.exp * 18;
        const ch = [base + st.temp * .28, base + (seed[(i + 5) % N] - 50) * .3, base - st.temp * .28];
        const luma = (ch[0] + ch[1] + ch[2]) / 3;
        ch.forEach((v, c) => {
          const h = Math.max(3, Math.min(97, luma + (v - luma) * (st.sat / 100) * 1.6));
          scopes[c][i].style.setProperty('--h', h.toFixed(1));
        });
      }
    };
    const applyLut = name => {
      const l = luts[name];
      Object.keys(st).forEach(k => { st[k] = l[k]; });
      inputs.forEach(inp => { inp.value = st[inp.dataset.k]; });
      look.style.background = l.look || 'none';
      look.style.opacity = l.look ? l.lo : 0;
      $$('button', lutBox).forEach(b => b.setAttribute('aria-pressed', String(b.textContent === name)));
      render();
    };
    inputs.forEach(inp => inp.addEventListener('input', () => {
      st[inp.dataset.k] = +inp.value;
      $$('button', lutBox).forEach(b => b.setAttribute('aria-pressed', 'false'));
      render();
    }));
    $('#grade-split').addEventListener('input', e => view.style.setProperty('--split', e.target.value + '%'));
    applyLut('Cinematic');
  })();

  /* Dịch vụ */
  const kinds = ['Short-form', 'Long-form', 'Audio-first', 'Brand & event'];
  $('#services').innerHTML = (D.services || []).map((s, i) => `
    <div class="service reveal" style="--i:${i}">
      <span class="no">${String(i + 1).padStart(2, '0')}</span>
      <h3>${esc(s.name)}<small>${kinds[i] || ''}</small></h3>
      <p>${esc(s.desc)}</p>
      <span class="time"><small>Bàn giao</small>${esc(s.time)}</span>
      <span class="price"><small>Chi phí</small>${esc(s.price || 'Báo giá theo brief')}</span>
    </div>`).join('');

  /* Dải thể loại */
  const play = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
  const genres = ['GAMING', 'PODCAST', 'BẤT ĐỘNG SẢN', 'SỰ KIỆN', 'QUẢNG CÁO', 'KHOÁ HỌC', 'VLOG'];
  $('#genres').innerHTML = [...genres, ...genres].map(g => `<span class="chrome">${g}</span>${play}`).join('');

  /* Feedback */
  if ((D.testimonials || []).length) {
    $('#feedback').hidden = false;
    $('#quotes').innerHTML = D.testimonials.map(t => `<figure class="quote glass"><blockquote>“${esc(t.quote)}”</blockquote><figcaption><b>${esc(t.name)}</b>${esc(t.role || '')}</figcaption></figure>`).join('');
  }

  /* Liên hệ */
  const C = D.contact || {};
  $('#mail-text').textContent = C.email;
  $('#mail-box').dataset.copy = C.email;
  $('#phone-text').textContent = C.phoneLabel;
  const links = { zalo: C.zalo, phone: 'tel:' + C.phone, facebook: C.facebook, instagram: C.instagram, tiktok: C.tiktok };
  $$('#tiles [data-k]').forEach(a => { a.href = links[a.dataset.k]; });

  /* Form brief */
  const form = $('#brief');
  const typeSel = $('#f-type');
  [...(D.services || []).map(s => s.name), 'Khác'].forEach(n => typeSel.append(new Option(n, n)));
  const setErr = (k, msg) => { $('#e-' + k).textContent = msg; form.elements[k].setAttribute('aria-invalid', msg ? 'true' : 'false'); };
  ['name', 'type'].forEach(k => form.elements[k].addEventListener('input', () => setErr(k, '')));
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(form));
    let ok = true;
    if (!v.name.trim()) { setErr('name', 'Nhập tên để mình biết gọi bạn là gì.'); ok = false; }
    if (!v.type) { setErr('type', 'Chọn loại video bạn cần.'); ok = false; }
    if (!ok) { form.querySelector('[aria-invalid="true"]').focus(); return; }
    const text = [
      `Chào DuckTai, mình là ${v.name.trim()}.`,
      `Loại video: ${v.type}`,
      v.length && `Thời lượng: ${v.length}`,
      v.deadline && `Deadline: ${v.deadline}`,
      v.budget && `Ngân sách: ${v.budget}`,
      v.link && `Footage / video mẫu: ${v.link}`,
      v.note && `\n${v.note}`
    ].filter(Boolean).join('\n');
    const viaZalo = e.submitter?.dataset.via === 'zalo';
    const send = () => {
      if (!viaZalo) location.href = `mailto:${C.email}?subject=${encodeURIComponent('[Brief] ' + v.type + ' — ' + v.name.trim())}&body=${encodeURIComponent(text)}`;
    };
    if (viaZalo) {
      // Sao chép và mở Zalo ngay trong cú bấm (trình duyệt chặn nếu làm sau)
      await copy(text);
      window.open(C.zalo, '_blank', 'noopener');
    }
    exportAnim(viaZalo ? 'Đã sao chép brief — dán vào Zalo nhé' : 'Đang mở ứng dụng email…', send);
  });

  /* Hiệu ứng "export" kiểu Media Encoder */
  const exp = $('#export'), bar = $('#export-bar'), meta = $('#export-meta'), title = $('#export-title');
  const exportAnim = (doneMsg, then) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { toast(doneMsg); then(); return; }
    exp.classList.add('show'); title.textContent = 'EXPORTING BRIEF…';
    const t0 = performance.now(), dur = 1100;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      const pct = Math.round(p * 100);
      bar.style.setProperty('--pct', pct + '%');
      meta.textContent = `H.264 · 1080p · NEW_PROJECT.brief · ${pct}%`;
      if (p < 1) return requestAnimationFrame(step);
      title.textContent = 'EXPORT COMPLETE ✓';
      toast(doneMsg); then();
      setTimeout(() => exp.classList.remove('show'), 900);
    };
    requestAnimationFrame(step);
  };

  window.DT.ready();
})();
