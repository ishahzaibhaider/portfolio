// PIPELINE FILM: the portfolio's chapter type for software that makes things by itself (AI media pipelines).
// Same 14 s / 28-beat frame as the app reels, different grammar:
//   OPEN      0–8    rows of the pipeline's real output slide past; name + promise
//   PIPELINE  8–22   the real stages as nodes on a track; a line runs through them and each stage's real artefact
//                    (a script excerpt, a character sheet, a keyframe, a QC score, the clip, the voice) rises out of it
//   END      22–28   the finished output plays in a player; name, what's true, the tools
// Every artefact is real (captured from the repo or its renders); products are data (window.PRODUCT, kind: 'pipeline').
(() => {
  const { W, H, FMT, pick, put, reg, el, scene, sp, spHit, seg, clamp, lerp, ease, beatOf, noise1 } = C;
  const P = window.PRODUCT, PAL = P.pal, WIDE = FMT === '16x9';
  C.fonts = ['800 100px Display', '500 40px UI', '700 40px UI', '500 30px Mono'];
  const EXT = window.REEL_EXT || 'png';
  const img = (n) => `../assets/cap/${EXT === 'png' ? n : n.replace(/\.(png|jpe?g)$/, '.webp')}`;   // names carry their extension
  const stage = document.getElementById('stage');
  stage.style.background = PAL.bg;
  const NZ = Array.from({ length: 8 }, (_, i) => noise1(31 + i * 13));

  // ---------------------------------------------------------------- type (same grammar as the app reels)
  let MEAS = null;
  const widthAt100 = (txt, font, weight, ls = -0.03) => {
    if (!MEAS) MEAS = el('div', { style: 'position:absolute;left:-9999px;top:0;font-size:100px;white-space:nowrap;visibility:hidden' }, stage);
    MEAS.style.fontFamily = font; MEAS.style.fontWeight = weight; MEAS.style.letterSpacing = ls + 'em';
    MEAS.textContent = txt; return MEAS.scrollWidth;
  };
  function block(parent, lines, o = {}) {
    const font = o.font || 'Display', weight = o.weight || (font === 'Display' ? 800 : 700), ls = o.ls ?? (font === 'Display' ? -0.03 : -0.01);
    const rows = lines.map((ln) => (Array.isArray(ln) ? ln : [[ln, false]]));
    const wOf = (r) => widthAt100(r.map((p) => p[0]).join(' '), font, weight, ls) / 100;
    const size = Math.min(o.size || 120, (o.w || 900) / Math.max(...rows.map(wOf))), gap = size * (o.lh || 1.06);
    const B = { lines: [], size, gap, h: rows.length * gap };
    rows.forEach((r, ri) => {
      const L = el('div', { class: 'cap', style: `left:${o.x}px;top:${o.y + ri * gap}px;font-size:${size}px;font-family:${font};font-weight:${weight};letter-spacing:${ls}em;color:${o.color || PAL.ink}` }, parent);
      const words = [];
      r.forEach(([p, acc], pi) => p.split(' ').forEach((w, wi, arr) => {
        const s = el('span', { class: 'w' }, L, w);
        if (acc) s.style.color = PAL.accentText || PAL.accent;
        words.push(reg(s, { y: 0 }));
        if (wi < arr.length - 1 || pi < r.length - 1) L.appendChild(document.createTextNode(' '));
      }));
      B.lines.push({ el: reg(L), words });
    });
    return B;
  }
  function rise(t, B, inAt, outAt, o = {}) {
    const below = B.size * 1.4, above = -B.size * 1.4, st = o.stagger ?? 0.06;
    let k = 0;
    B.lines.forEach((L, li) => L.words.forEach((w, wi) => {
      let y = inAt == null ? 0 : below * (1 - spHit(t, beatOf(inAt) + li * 0.4 + wi * st, 'heavy'));
      if (outAt != null) y += above * sp(t, beatOf(outAt) + k * 0.02, 'snappy');
      put(w, { y, hide: y >= below * 0.999 || y <= above * 0.999 }); k++;
    }));
  }
  const TX = pick(150, 90, 90);
  const TALLF = P.aspect === 'portrait';                       // output is vertical (Shorts) instead of 16:9

  // ---------------------------------------------------------------- 1. OPEN: the real output, sliding past
  scene({
    name: 'open', from: 0, to: 8.6,
    build(root, S) {
      root.style.background = `radial-gradient(120% 90% at 70% 40%, ${PAL.bg2} 0%, ${PAL.bg} 70%)`;
      const fh0 = pick(520, 420, 520) * 9 / 16, fh = TALLF ? pick(470, 400, 470) : fh0, fw = TALLF ? fh * 9 / 16 : fh * 16 / 9, gap = 26;
      const band = reg(el('div', { class: 'abs', style: `width:${W * 2.2}px;height:${(fh + gap) * 4}px` }, root));
      S.band = band;
      S.rows = [0, 1, 2, 3].map((r) => {
        const row = reg(el('div', { class: 'abs', style: `top:${r * (fh + gap)}px;left:0;display:flex;gap:${gap}px` }, band));
        const pool = P.open;
        for (let i = 0; i < 9; i++) {
          const n = pool[(i * 3 + r * 5) % pool.length];
          el('div', { style: `width:${fw}px;height:${fh}px;border-radius:16px;overflow:hidden;flex:none;box-shadow:0 30px 60px -24px rgba(0,0,0,.6)` }, row,
            `<img src="${img(n)}" style="width:100%;height:100%;object-fit:cover;display:block">`);
        }
        return { row, dir: r % 2 ? 1 : -1 };
      });
      S.scrim = el('div', { class: 'abs', style: `width:${W}px;height:${H}px;background:${WIDE ? `linear-gradient(90deg, ${PAL.bg} 0%, ${PAL.bg}F0 30%, ${PAL.bg}99 48%, ${PAL.bg}10 70%)` : `linear-gradient(180deg, ${PAL.bg} 0%, ${PAL.bg}F0 34%, ${PAL.bg}99 46%, ${PAL.bg}10 64%)`}` }, root);
      const ic = pick(150, 130, 150), ty = pick(240, 110, 200);
      S.icon = reg(el('img', { src: `../assets/brand/icon.${EXT === 'png' ? 'png' : 'webp'}`, class: 'abs', style: `left:${TX}px;top:${ty}px;width:${ic}px;height:${ic}px;border-radius:${ic * 0.225}px;box-shadow:0 24px 50px -18px rgba(0,0,0,.7)` }, root));
      S.kick = reg(el('div', { class: 'abs', style: `left:${TX}px;top:${ty - pick(56, 50, 56)}px;font-family:UI;font-weight:700;font-size:${pick(24, 22, 24)}px;letter-spacing:.16em;text-transform:uppercase;color:${PAL.accentText || PAL.accent};white-space:nowrap` }, root, P.kicker), { o: 0 });
      S.name = block(root, [P.name], { x: TX, y: ty + ic + 24, size: pick(140, 120, 140), w: pick(820, 900, 900), color: PAL.title || PAL.ink });
      S.line = block(root, P.line, { x: TX, y: ty + ic + 24 + S.name.h + 14, size: pick(54, 48, 54), w: pick(760, 880, 880), font: 'UI', weight: 500, lh: 1.25, color: PAL.muted });
    },
    run(t, b, S) {
      // the rows slide in opposite directions on a slight tilt; at the end they sweep away to the left
      const out = ease.inOut(seg(t, 7, 8.6));
      put(S.band, { x: pick(560, 60, 60) - out * W * 1.2, y: pick(-40, 520, 760) + (WIDE ? 0 : 0), r: -8 });
      S.rows.forEach((R, i) => put(R.row, { x: (R.dir > 0 ? -420 : -60) + R.dir * (t / C.DUR) * 900 }));
      rise(t, S.name, null, 7.4);
      rise(t, S.line, 0.6, 7.45, { stagger: 0.05 });
      put(S.icon, { o: 1 - sp(t, 7.2, 'snappy'), s: 1 - 0.2 * sp(t, 7.2, 'snappy') });
      put(S.kick, { o: clamp(sp(t, 0.2, 'default')) * (1 - sp(t, 7.2, 'snappy')) });
    },
  });

  // ---------------------------------------------------------------- 2. PIPELINE: stages on a track, artefacts rise
  const N = P.stages.length;
  const B0 = 9.2, STEP = (21.2 - B0) / N;                          // beat each stage lights
  scene({
    name: 'pipe', from: 8.6, to: 22.4,
    build(root, S) {
      root.style.background = `radial-gradient(120% 90% at 60% 55%, ${PAL.bg2} 0%, ${PAL.bg} 72%)`;
      S.title = block(root, P.pipeTitle, { x: TX, y: pick(110, 100, 130), size: pick(64, 56, 64), w: pick(1300, 900, 900), color: PAL.ink });
      // geometry: a horizontal track on wide, a vertical one on tall
      const nx = (i) => (WIDE ? 180 + i * ((W - 360) / (N - 1)) : 150), ny = (i) => (WIDE ? 730 : 330 + i * ((H - 430) / (N - 1)));
      S.nx = nx; S.ny = ny;
      S.track = reg(el('div', { class: 'abs', style: WIDE ? `left:${nx(0)}px;top:${ny(0) - 2}px;width:${nx(N - 1) - nx(0)}px;height:4px;border-radius:2px;background:${PAL.line || '#ffffff22'}` : `left:${nx(0) - 2}px;top:${ny(0)}px;width:4px;height:${ny(N - 1) - ny(0)}px;border-radius:2px;background:${PAL.line || '#ffffff22'}` }, root));
      S.fill = reg(el('div', { class: 'abs', style: WIDE ? `left:${nx(0)}px;top:${ny(0) - 2}px;width:${nx(N - 1) - nx(0)}px;height:4px;border-radius:2px;background:${PAL.accent};transform-origin:0 50%;box-shadow:0 0 18px ${PAL.accent}` : `left:${nx(0) - 2}px;top:${ny(0)}px;width:4px;height:${ny(N - 1) - ny(0)}px;border-radius:2px;background:${PAL.accent};transform-origin:50% 0;box-shadow:0 0 18px ${PAL.accent}` }, root));
      S.nodes = P.stages.map((st, i) => {
        const g = reg(el('div', { class: 'abs', style: `left:${nx(i)}px;top:${ny(i)}px` }, root));
        const dot = reg(el('div', { class: 'abs', style: `left:-15px;top:-15px;width:30px;height:30px;border-radius:50%;background:${PAL.bg};border:4px solid ${PAL.line || '#ffffff33'};box-sizing:border-box` }, g));
        const on = reg(el('div', { class: 'abs', style: `left:-15px;top:-15px;width:30px;height:30px;border-radius:50%;background:${PAL.accent};box-shadow:0 0 0 8px ${PAL.accent}33, 0 0 30px ${PAL.accent}` }, g), { o: 0 });
        const lab = el('div', { class: 'abs', style: WIDE ? `left:-140px;top:34px;width:280px;text-align:center` : `left:34px;top:-22px;width:240px` }, g,
          `<div style="font-family:UI;font-weight:700;font-size:${pick(28, 26, 30)}px;color:${PAL.ink};white-space:nowrap">${st.name}</div><div style="font-family:Mono;font-weight:500;font-size:${pick(19, 18, 20)}px;color:${PAL.muted};margin-top:6px;white-space:nowrap">${st.tool}</div>`);
        const lb = reg(lab, { o: 0.35 });
        // the artefact card: above the node on wide, to the right on tall
        const cw = pick(470, 520, 560), ch = pick(330, 360, 380);
        const ax = WIDE ? Math.min(W - cw - 60, Math.max(60, nx(i) - cw / 2)) : 450, ay = WIDE ? ny(i) - ch - 64 : Math.min(H - ch - 40, Math.max(300, ny(i) - ch / 2));
        const card = reg(el('div', { class: 'abs', style: `left:${ax}px;top:${ay}px;width:${cw}px;height:${ch}px;border-radius:18px;overflow:hidden;background:${PAL.cardSolid || PAL.bg2};box-shadow:0 0 0 1px ${PAL.line || '#ffffff22'}, 0 40px 70px -30px rgba(0,0,0,.7);transform-origin:50% 100%` }, root), { hide: true });
        const A = st.art, inner = { card, cw, ch, type: A.type };
        if (A.type === 'code') {
          el('div', { style: `position:absolute;inset:0;padding:22px 24px;font-family:Mono;font-size:${pick(21, 22, 23)}px;line-height:1.55;color:${PAL.ink};white-space:pre;overflow:hidden` }, card,
            A.lines.map((l) => l.replace(/("[^"]*")(\s*:)/g, `<span style="color:${PAL.accentText || PAL.accent}">$1</span>$2`)).join('\n'));
          inner.mask = reg(el('div', { class: 'abs', style: `left:0;top:0;width:${cw}px;height:${ch}px;background:${PAL.cardSolid || PAL.bg2};transform-origin:50% 100%` }, card));
        } else if (A.type === 'image') {
          el('img', { src: img(A.src), style: `position:absolute;inset:0;width:100%;height:100%;object-fit:cover` }, card);
        } else if (A.type === 'frames') {
          inner.frames = A.srcs.map((n) => reg(el('img', { src: img(n), style: `position:absolute;inset:0;width:100%;height:100%;object-fit:cover` }, card), { hide: true }));
        } else if (A.type === 'score' || A.type === 'stat') {
          el('div', { style: `position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 28px` }, card,
            `<div style="font-family:Display;font-weight:800;font-size:${pick(A.big ? 66 : 48, 44, 52)}px;color:${PAL.ink};letter-spacing:-0.02em;line-height:1.02">${A.text}</div><div style="font-family:UI;font-weight:500;font-size:${pick(22, 20, 22)}px;color:${PAL.muted};margin-top:12px;line-height:1.3">${A.sub || ''}</div>`);
        } else if (A.type === 'wave') {
          const bars = Array.from({ length: 34 }, (_, k) => reg(el('div', { class: 'abs', style: `left:${24 + k * ((cw - 48) / 34)}px;top:${ch * 0.42}px;width:${(cw - 48) / 34 - 3}px;height:4px;border-radius:2px;background:${PAL.accent};transform-origin:50% 50%` }, card)));
          el('div', { style: `position:absolute;left:24px;right:24px;bottom:22px;font-family:UI;font-weight:700;font-size:${pick(22, 20, 22)}px;color:${PAL.ink}` }, card, A.text || '');
          inner.bars = bars;
        }
        if (A.caption) el('div', { style: `position:absolute;left:0;right:0;bottom:0;padding:10px 16px;font-family:UI;font-weight:700;font-size:${pick(18, 17, 18)}px;color:#fff;background:linear-gradient(0deg, rgba(0,0,0,.7), transparent)` }, card, A.caption);
        return { g, dot, on, lb, ...inner };
      });
    },
    run(t, b, S) {
      rise(t, S.title, 9, 21.9);
      const k = clamp(seg(t, B0 - 0.2, B0 + STEP * (N - 1)));
      put(S.fill, { css: { transform: WIDE ? `scaleX(${k.toFixed(4)})` : `scaleY(${k.toFixed(4)})` } });
      put(S.track, { o: clamp(sp(t, 8.8, 'default')) });
      S.nodes.forEach((nd, i) => {
        const at = B0 + i * STEP;
        const lit = sp(t, at, 'snappy');
        const appear = sp(t, 8.8 + i * 0.12, 'default');
        put(nd.g, { o: clamp(appear * 1.5), s: 0.6 + 0.4 * appear });
        put(nd.on, { o: clamp(lit) });
        put(nd.lb, { o: 0.35 + 0.65 * clamp(lit) });
        // card: rises at its stage, stays while the next one plays, then sinks back to make room
        const upA = spHit(t, at + 0.1, 'default'), down = sp(t, at + STEP * 0.9, 'default');
        const vis = upA > 0.003 && down < 0.997;
        const yy = (1 - upA) * 60 + down * 40;
        put(nd.card, { hide: !vis, o: clamp(upA * 1.4) * (1 - down), y: yy, s: 0.9 + 0.1 * upA - 0.06 * down });
        if (nd.mask) put(nd.mask, { css: { transform: `scaleY(${(1 - clamp(seg(t, at + 0.2, at + 1.4))).toFixed(4)})` } });
        if (nd.frames) { const f = Math.floor(Math.max(0, C.beatAt(t) - at) * 1.6) % nd.frames.length; nd.frames.forEach((e, j) => put(e, { hide: j !== f })); }
        if (nd.bars) nd.bars.forEach((e, j) => put(e, { sy: 1 + 18 * Math.abs(NZ[j % 8](t * 3 + j * 0.37)) * clamp(upA) }));
      });
    },
  });

  // ---------------------------------------------------------------- 3. END: the finished output, playing
  scene({
    name: 'end', from: 22.4, to: 28,
    build(root, S) {
      root.style.background = `radial-gradient(120% 90% at 65% 45%, ${PAL.bg2} 0%, ${PAL.bg} 72%)`;
      const ph = TALLF ? pick(800, 700, 900) : pick(1040, 900, 940) * 9 / 16, pw = TALLF ? ph * 9 / 16 : ph * 16 / 9;
      const px = TALLF ? pick(1180, 343, 600) : pick(780, 90, 70), py = TALLF ? pick(110, 560, 900) - pick(0, 0, 0) : pick(200, 560, 860);
      S.player = reg(el('div', { class: 'abs', style: `left:${px}px;top:${py}px;width:${pw}px;height:${ph + 54}px;border-radius:20px;overflow:hidden;background:#0b0b0e;box-shadow:0 0 0 1.5px rgba(255,255,255,.12), 0 60px 110px -40px rgba(0,0,0,.8);transform-origin:50% 50%` }, root));
      S.frames = P.endFrames.map((n) => reg(el('img', { src: img(n), style: `position:absolute;left:0;top:0;width:${pw}px;height:${ph}px;object-fit:cover` }, S.player), { hide: true }));
      el('div', { class: 'abs', style: `left:0;top:${ph}px;width:${pw}px;height:54px;background:#111216` }, S.player);
      S.prog = reg(el('div', { class: 'abs', style: `left:20px;top:${ph + 24}px;width:${pw - 40}px;height:6px;border-radius:3px;background:${PAL.accent};transform-origin:0 50%` }, S.player));
      el('div', { class: 'abs', style: `left:20px;top:${ph + 24}px;width:${pw - 40}px;height:6px;border-radius:3px;background:rgba(255,255,255,.15)` }, S.player);
      S.player.appendChild(S.prog);
      const ic = pick(120, 100, 120), ex = WIDE ? TX : 90, ey = pick(250, 110, 170);
      S.icon = reg(el('img', { src: `../assets/brand/icon.${EXT === 'png' ? 'png' : 'webp'}`, class: 'abs', style: `left:${ex}px;top:${ey}px;width:${ic}px;height:${ic}px;border-radius:${ic * 0.225}px` }, root), { o: 0 });
      S.name = block(root, [P.name], { x: ex, y: ey + ic + 22, size: pick(100, 92, 110), w: pick(560, 900, 900), color: PAL.title || PAL.ink });
      S.facts = reg(el('div', { class: 'abs', style: `left:${ex}px;top:${ey + ic + 22 + S.name.h + 18}px;width:${pick(560, 900, 900)}px;font-family:UI;font-weight:500;font-size:${pick(30, 28, 32)}px;line-height:1.4;color:${PAL.muted}` }, root, P.end.line), { o: 0 });
      S.pills = reg(el('div', { class: 'abs', style: `left:${ex}px;top:${ey + ic + 22 + S.name.h + pick(150, 130, 140)}px;width:${pick(600, 900, 900)}px;display:flex;flex-wrap:wrap;gap:12px` }, root,
        P.end.pills.map((p) => `<span style="font-family:Mono;font-weight:500;font-size:${pick(21, 20, 22)}px;padding:10px 18px;border-radius:999px;background:${PAL.pillBg};color:${PAL.pillInk};white-space:nowrap">${p}</span>`).join('')), { o: 0 });
    },
    run(t, b, S) {
      const inn = sp(t, 22.4, 'heavy');
      put(S.player, { s: 0.86 + 0.14 * inn, o: clamp(inn * 1.6), y: (1 - inn) * 40 });
      const f = Math.floor(Math.max(0, b - 22.4) * 1.25) % S.frames.length;
      S.frames.forEach((e, j) => put(e, { hide: j !== f }));
      put(S.prog, { sx: clamp(seg(t, 22.4, 28)) });
      put(S.icon, { o: clamp(sp(t, 23, 'snappy') * 1.4), s: 0.7 + 0.3 * spHit(t, 23.2, 'default') });
      rise(t, S.name, 23.4, null);
      put(S.facts, { o: sp(t, 24.2, 'default'), y: (1 - sp(t, 24.2, 'default')) * 18 });
      put(S.pills, { o: sp(t, 25, 'default'), y: (1 - sp(t, 25, 'default')) * 18 });
    },
  });

  Promise.all(C.fonts.map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(() => {
    C.start();
    const q = new URLSearchParams(location.search);
    if (q.has('live') || q.has('scrub')) {   // same embedding contract as reel.js
      document.documentElement.style.background = document.body.style.background = PAL.bg;
      const fit = () => { const k = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `scale(${k})`; stage.style.marginLeft = `${(innerWidth - W * k) / 2}px`; stage.style.marginTop = `${(innerHeight - H * k) / 2}px`; };
      fit(); addEventListener('resize', fit);
      window.READY.then(() => { window.seek(0); if (parent !== window) parent.postMessage({ reel: 'ready', dur: C.DUR, slug: P.slug }, '*'); });
    }
  });
})();
