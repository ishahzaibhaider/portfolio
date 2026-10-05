// PORTFOLIO REEL: one shared ~14 s silent film for every product on the portfolio.
// Grammar (beats @120 bpm, 0.5 s each):
//   WALL     0–9    an isometric wall of the app's real screens drifts; icon + name + promise; the camera dives into one
//                   screen, the wall falls away, and that screen becomes the phone
//   HERO     9–17   the phone turns a little in 3D while the real flow plays: scrolls, finger taps, real state swaps
//   EXPLODE 17–23   the phone tips into an isometric view; real UI cards lift off the glass with labels; they land back
//   END     23–28   two more phones slide in beside it; icon + name + where it lives
// Products are data (window.PRODUCT, see products/*.js). Every pixel of UI is a real capture; shapes and type are ours.
// "3D" is orthographic: each plane is a 2D affine matrix (deterministic seek(t), no CSS 3D layers).
(() => {
  const { W, H, FMT, pick, put, reg, el, scene, sp, spHit, seg, clamp, lerp, ease, bt, beatOf, noise1 } = C;
  const P = window.PRODUCT, CAPS = window.CAPS || { shots: {} };
  const PAL = P.pal;
  C.fonts = [`${P.displayWeight || 800} 100px Display`, '500 40px UI', '700 40px UI'];
  const DW = P.displayWeight || 800, DLS = P.displayLs ?? -0.03;
  // device: 'phone' (440×956 pt iPhone) or 'web' (1440×900 browser window with an address bar)
  const WEB = P.device === 'web';
  const SW = WEB ? 1440 : 440, SH = WEB ? 900 : 956;   // capture space (CSS px)
  const BZ = WEB ? 0 : 15, TOP = WEB ? 54 : 0, RAD = WEB ? 18 : 66;
  const PW = SW + 2 * BZ, PH = SH + 2 * BZ + TOP;
  const WIDE = FMT === '16x9';
  const NZ = Array.from({ length: 12 }, (_, i) => noise1(101 + i * 17));   // smooth seeded noise, one stream per user
  // the web bundle (tools/webexport.mjs) swaps the render PNGs for lighter WebP copies
  const EXT = window.REEL_EXT || 'png', TEXT = window.REEL_THUMB_EXT || 'jpg';
  const capUrl = (n, k = '') => `../assets/cap/${n}${k}.${EXT}`;
  const thumbUrl = (n) => `../assets/cap/thumb/${n}.${TEXT}`;
  const stage = document.getElementById('stage');
  stage.style.background = PAL.bg;

  // ================================================================ orthographic planes
  const DEG = Math.PI / 180;
  /** basis of a plane rotated by rz (in-plane), then ry (yaw), then rx (tilt back). Screen y points down. */
  function basis(rx = 0, ry = 0, rz = 0) {
    const cx = Math.cos(rx * DEG), sx = Math.sin(rx * DEG), cy = Math.cos(ry * DEG), sy = Math.sin(ry * DEG), cz = Math.cos(rz * DEG), sz = Math.sin(rz * DEG);
    const rot = ([x, y, z]) => {
      let X = x * cz - y * sz, Y = x * sz + y * cz, Z = z;
      const X2 = X * cy + Z * sy, Z2 = -X * sy + Z * cy; X = X2; Z = Z2;
      const Y2 = Y * cx - Z * sx, Z3 = Y * sx + Z * cx; Y = Y2; Z = Z3;
      return [X, Y, Z];
    };
    return { u: rot([1, 0, 0]), v: rot([0, 1, 0]), n: rot([0, 0, 1]) };
  }
  /** A plane = basis + scale k + the screen point O where local (0,0,0) lands. */
  const plane = (B, k, O) => ({ B, k, O });
  /** plane whose local point (lx, ly) lands on screen point (sx, sy) */
  const planeAt = (B, k, lx, ly, sx, sy) => plane(B, k, [sx - k * (B.u[0] * lx + B.v[0] * ly), sy - k * (B.u[1] * lx + B.v[1] * ly)]);
  const proj = (Q, x, y, z = 0) => [Q.O[0] + Q.k * (Q.B.u[0] * x + Q.B.v[0] * y + Q.B.n[0] * z), Q.O[1] + Q.k * (Q.B.u[1] * x + Q.B.v[1] * y + Q.B.n[1] * z)];
  function onPlane(e, Q, x, y, z = 0, extra = {}, s = 1) {
    const { B, k } = Q, [ex, ey] = proj(Q, x, y, z);
    const a = B.u[0] * k * s, b = B.u[1] * k * s, c = B.v[0] * k * s, d = B.v[1] * k * s;
    put(e, { ...extra, css: { transform: `matrix(${a.toFixed(5)},${b.toFixed(5)},${c.toFixed(5)},${d.toFixed(5)},${ex.toFixed(2)},${ey.toFixed(2)})`, ...(extra.css || {}) } });
  }
  const mix = (a, b, u) => a + (b - a) * u;
  const geo = (a, b, u) => a * Math.pow(b / a, u);

  // ================================================================ type
  let MEAS = null;
  const widthAt100 = (txt, font, weight, ls = -0.03) => {
    if (!MEAS) MEAS = el('div', { style: 'position:absolute;left:-9999px;top:0;font-size:100px;white-space:nowrap;visibility:hidden' }, stage);
    MEAS.style.fontFamily = font; MEAS.style.fontWeight = weight; MEAS.style.letterSpacing = ls + 'em';
    MEAS.textContent = txt; return MEAS.scrollWidth;
  };
  /** lines: strings or [[text, accent], ...]; fits the widest line into o.w (never above o.size); wraps words when o.min is hit */
  function block(parent, lines, o = {}) {
    const font = o.font || 'Display', weight = o.weight || (font === 'Display' ? DW : 700), ls = o.ls ?? (font === 'Display' ? DLS : -0.01);
    let rows = lines.map((ln) => (Array.isArray(ln) ? ln : [[ln, false]]));
    const txt = (r) => r.map((p) => p[0]).join(' ');
    const wOf = (r) => widthAt100(txt(r), font, weight, ls) / 100;
    let fit = (o.w || 900) / Math.max(...rows.map(wOf));
    if (o.min && fit < o.min) {
      const words = (r) => r.flatMap(([p, acc]) => p.split(' ').map((w) => [w, acc]));
      const re = rows.flatMap((r) => { const out = []; let cur = []; for (const wd of words(r)) { if (cur.length && wOf([...cur, wd]) * o.min > (o.w || 900)) { out.push(cur); cur = []; } cur.push(wd); } if (cur.length) out.push(cur); return out; });
      if (re.length !== rows.length) rows = re;
      fit = (o.w || 900) / Math.max(...rows.map(wOf));
    }
    const size = Math.min(o.size || 120, fit), gap = size * (o.lh || 1.06);
    const B = { lines: [], size, gap, x: o.x, y: o.y, h: rows.length * gap, widths: rows.map((r) => wOf(r) * size) };
    rows.forEach((r, ri) => {
      const L = el('div', { class: 'cap', style: `left:${o.x}px;top:${o.y + ri * gap}px;font-size:${size}px;font-family:${font};font-weight:${weight};letter-spacing:${ls}em;color:${o.color || PAL.ink}` }, parent);
      const words = [];
      r.forEach(([p, acc], pi) => p.split(' ').forEach((w, wi, arr) => {
        const s = el('span', { class: 'w' }, L, w);
        if (acc) s.style.color = o.accentColor || PAL.accentText || PAL.accent;
        words.push(reg(s, { y: 0 }));
        if (wi < arr.length - 1 || pi < r.length - 1) L.appendChild(document.createTextNode(' '));
      }));
      B.lines.push({ el: reg(L), words });
    });
    return B;
  }
  /** masked word rise: in on inAt (+0.5 beat per line), out upward on outAt */
  function rise(t, B, inAt, outAt, o = {}) {
    const below = B.size * 1.4, above = -B.size * 1.4, st = o.stagger ?? 0.07;
    let k = 0;
    B.lines.forEach((L, li) => L.words.forEach((w, wi) => {
      const base = beatOf(inAt) + li * (o.lineGap ?? 0.5) + wi * st;
      let y = inAt == null ? 0 : below * (1 - spHit(t, base, o.preset || 'heavy'));
      if (outAt != null) y += above * sp(t, beatOf(outAt) + k * 0.02, 'snappy');
      put(w, { y, hide: y >= below * 0.999 || y <= above * 0.999 }); k++;
    }));
  }
  const fadeB = (B, o) => B.lines.forEach((L) => put(L.el, { o }));

  // ================================================================ shapes (the film's own graphic layer, brand palette)
  function shapes(root) {
    const S = PAL.shapes;
    const mk = (css) => reg(el('div', { class: 'abs', style: css }, root));
    return [
      mk(`width:900px;height:900px;margin:-450px 0 0 -450px;border-radius:50%;background:radial-gradient(circle at 35% 35%, ${S[0]} 0%, ${S[0]}00 70%)`),
      mk(`width:560px;height:560px;margin:-280px 0 0 -280px;border-radius:50%;border:44px solid ${S[1]};box-sizing:border-box`),
      mk(`width:620px;height:190px;margin:-95px 0 0 -310px;border-radius:95px;background:${S[2]}`),
      mk(`width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:76px;background:${S[3] || S[1]}`),
      mk(`width:360px;height:360px;margin:-180px 0 0 -180px;background-image:radial-gradient(${PAL.dots || PAL.muted} 3.2px, transparent 3.6px);background-size:36px 36px;opacity:.55`),
    ];
  }
  // per-scene layouts [x, y, s, r] for the five shapes; springs between them keep the ground alive
  const LAYOUT = {
    hero: pick(
      [[1380, 300, 1.1, 0], [1660, 820, 1, 0], [1500, 1010, 1, -18], [1750, 210, 0.34, 14], [260, 900, 1, 0]],
      [[820, 560, 1.0, 0], [930, 1180, 0.8, 0], [180, 1260, 0.8, -18], [960, 140, 0.26, 14], [960, 380, 0.8, 0]],
      [[820, 760, 1.0, 0], [930, 1600, 0.8, 0], [180, 1720, 0.8, -18], [960, 200, 0.26, 14], [960, 520, 0.8, 0]]),
    explode: pick(
      [[1150, 640, 1.3, 0], [300, 900, 0.7, 0], [1700, 180, 0.9, 24], [1760, 930, 0.36, -10], [820, 130, 1, 0]],
      [[560, 820, 1.25, 0], [140, 1240, 0.6, 0], [950, 170, 0.7, 24], [990, 1250, 0.26, -10], [150, 300, 0.8, 0]],
      [[560, 1100, 1.25, 0], [140, 1720, 0.6, 0], [950, 220, 0.7, 24], [990, 1750, 0.26, -10], [150, 400, 0.8, 0]]),
    end: pick(
      [[1280, 600, 1.4, 0], [1770, 240, 0.8, 0], [380, 980, 0.9, 12], [1800, 1000, 0.3, -20], [1660, 960, 1, 0]],
      [[540, 900, 1.3, 0], [990, 260, 0.6, 0], [140, 1280, 0.8, 12], [990, 1290, 0.24, -20], [940, 1240, 0.8, 0]],
      [[540, 1200, 1.3, 0], [990, 360, 0.6, 0], [140, 1760, 0.8, 12], [990, 1800, 0.24, -20], [940, 1700, 0.8, 0]]),
  };
  function driveShapes(t, SH_, keys) {
    SH_.forEach((e, i) => {
      const k = keys.map(([b, L]) => [b, { x: L[i][0], y: L[i][1], s: L[i][2], r: L[i][3] }]);
      const v = C.trkObj(t, k, 'heavy');
      const dr = NZ[i](t * 0.35) * 18;
      const g = sp(t, 8.6 + i * 0.22, 'heavy');
      put(e, { x: v.x + dr, y: v.y + NZ[i + 5](t * 0.3) * 14, s: v.s * g, r: v.r + dr * 0.1 - (1 - g) * 30, o: clamp(g * 1.5) });
    });
  }

  // ================================================================ screens (real captures as layered views)
  const lumCache = {};
  function lum(name, y0, y1) {
    const key = name + y0;
    if (key in lumCache) return lumCache[key];
    const img = document.querySelector(`img[data-cap="${name}"]`);
    if (!img || !img.complete || !img.naturalWidth) return 1;
    const cv = document.createElement('canvas'); cv.width = 44; cv.height = 8;
    const g = cv.getContext('2d'); g.drawImage(img, 0, img.naturalHeight * y0, img.naturalWidth, img.naturalHeight * (y1 - y0), 0, 0, 44, 8);
    const d = g.getImageData(0, 0, 44, 8).data; let s = 0;
    for (let i = 0; i < d.length; i += 4) s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    return (lumCache[key] = s / (d.length / 4) / 255);
  }
  const SBAR = (c) => `<div style="position:absolute;left:44px;top:19px;font-family:-apple-system,'SF Pro Text',UI,sans-serif;font-weight:600;font-size:17px;letter-spacing:-0.02em;color:${c}">9:41</div>
    <svg style="position:absolute;right:30px;top:21px" width="78" height="14" viewBox="0 0 78 14" fill="${c}">
      <rect x="0" y="9" width="3.4" height="5" rx="1"/><rect x="5" y="6.5" width="3.4" height="7.5" rx="1"/><rect x="10" y="4" width="3.4" height="10" rx="1"/><rect x="15" y="1" width="3.4" height="13" rx="1"/>
      <path d="M31.5 3.2c2.5 0 4.8 1 6.5 2.6l1.2-1.2C37.2 2.6 34.5 1.5 31.5 1.5s-5.7 1.1-7.7 3.1L25 5.8c1.7-1.6 4-2.6 6.5-2.6zm0 3.4c1.6 0 3 .6 4.1 1.6l1.2-1.2c-1.4-1.3-3.3-2.1-5.3-2.1s-3.9.8-5.3 2.1l1.2 1.2c1.1-1 2.5-1.6 4.1-1.6zm0 3.3c.7 0 1.3.3 1.8.7l-1.8 1.8-1.8-1.8c.5-.4 1.1-.7 1.8-.7z"/>
      <rect x="46" y="1.5" width="25" height="12" rx="3.6" fill="none" stroke="${c}" stroke-opacity=".4"/><rect x="48" y="3.5" width="19" height="8" rx="2"/><path d="M73 5.5v4c.9-.3 1.5-1.1 1.5-2s-.6-1.7-1.5-2z" fill-opacity=".45"/>
    </svg>`;
  /** a screen view: base state + (if it scrolls) the strip under the fixed chrome + iOS status bar/indicator */
  function view(parent, name, o = {}) {
    const m = (CAPS.shots && CAPS.shots[name]) || {};
    const v = reg(el('div', { class: 'abs', style: `width:${SW}px;height:${SH}px;overflow:hidden;background:${P.screenBg || '#fff'}` }, parent), { hide: true });
    el('img', { src: capUrl(name), 'data-cap': name, class: 'abs', style: `width:${SW}px;height:${SH}px` }, v);
    let strip = null;
    const full = P.strips && P.strips[name];          // a full-page capture that scrolls under nothing
    if (o.scroll && full) {
      strip = reg(el('img', { src: capUrl(full.src), class: 'abs', style: `width:${SW}px;height:${full.h}px` }, v));
    } else if (o.scroll && m.strip && m.scroller) {
      const sc = m.scroller;
      const win = el('div', { class: 'abs', style: `left:${sc.left}px;top:${sc.top}px;width:${sc.w}px;height:${sc.h}px;overflow:hidden` }, v);
      strip = reg(el('img', { src: capUrl(name, '_strip'), class: 'abs', style: `width:${sc.w}px;height:${m.strip.h}px` }, win));
      el('img', { src: capUrl(name, '_chrome'), class: 'abs', style: `width:${SW}px;height:${SH}px` }, v);
    }
    if (WEB) { const V = { v, strip, m, name, styled: true, style() {} }; return V; }
    const sbar = el('div', { class: 'abs', style: `width:${SW}px;height:54px` }, v);
    const ind = el('div', { class: 'abs', style: `left:${(SW - 150) / 2}px;top:${SH - 13}px;width:150px;height:5px;border-radius:3px` }, v);
    el('div', { class: 'island', style: `left:${(SW - 124) / 2}px;top:11px` }, v);
    const V = { v, strip, m, name, sbar, ind, styled: false };
    V.style = () => { // colour the OS chrome by the real pixels under it (needs the image decoded → first run)
      if (V.styled) return; V.styled = true;
      const top = lum(name, 0, 0.055), bot = lum(name, 0.97, 1);
      sbar.innerHTML = SBAR(top < 0.55 ? '#fff' : '#000');
      ind.style.background = bot < 0.55 ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.8)';
    };
    return V;
  }

  // ================================================================ device (one phone object, flat elements on a plane)
  function phone(root, screens, o = {}) {
    const D = { screens: {} };
    D.shadow = reg(el('div', { class: 'abs', style: `width:${PW}px;height:${PH}px;border-radius:${RAD}px;background:${PAL.shadow || 'rgba(8,12,20,.55)'};filter:blur(34px)` }, root));
    D.edges = [0, 1, 2, 3, 4, 5, 6].map((i) => reg(el('div', { class: 'abs', style: `width:${PW}px;height:${PH}px;border-radius:${RAD}px;background:${i === 6 ? '#3a3f47' : `hsl(220 6% ${14 + i * 2.2}%)`}` }, root)));
    if (WEB) {
      const dark = PAL.chromeDark, bar = dark ? '#1c1f26' : '#eef0f3', ink = dark ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.5)', pill = dark ? '#2a2e37' : '#ffffff';
      D.body = reg(el('div', { class: 'abs', style: `width:${PW}px;height:${PH}px;border-radius:${RAD}px;background:${bar};box-shadow:inset 0 0 0 1.5px ${PAL.rim || 'rgba(0,0,0,.08)'}` }, root,
        `<div style="position:absolute;left:24px;top:20px;display:flex;gap:9px">${['#ff5f57', '#febc2e', '#28c840'].map((c) => `<span style="width:14px;height:14px;border-radius:50%;background:${c}"></span>`).join('')}</div>
         <div style="position:absolute;left:${PW / 2 - 300}px;top:11px;width:600px;height:32px;border-radius:10px;background:${pill};display:flex;align-items:center;justify-content:center;gap:9px;font-family:-apple-system,'SF Pro Text',UI,sans-serif;font-size:17px;font-weight:500;color:${ink};box-shadow:0 1px 2px rgba(0,0,0,.06)">
           <svg width="12" height="14" viewBox="0 0 12 14" fill="${ink}"><rect x="1" y="6" width="10" height="8" rx="2"/><path d="M3 6V4a3 3 0 0 1 6 0v2" fill="none" stroke="${ink}" stroke-width="1.6"/></svg>${P.domain || ''}</div>`));
      D.glass = reg(el('div', { class: 'abs', style: `width:${SW}px;height:${SH}px;border-radius:0 0 ${RAD}px ${RAD}px;overflow:hidden;background:${P.screenBg || '#fff'}` }, root));
    } else {
      D.body = reg(el('div', { class: 'abs', style: `width:${PW}px;height:${PH}px;border-radius:${RAD}px;background:#0b0d10;box-shadow:inset 0 0 0 1.5px ${PAL.rim || 'rgba(255,255,255,.14)'}, inset 0 0 0 5px #15181c` }, root));
      D.glass = reg(el('div', { class: 'abs', style: `width:${SW}px;height:${SH}px;border-radius:${RAD - BZ}px;overflow:hidden;background:#000` }, root));
    }
    for (const [name, so] of screens) D.screens[name] = view(D.glass, name, so);
    D.dim = reg(el('div', { class: 'abs', style: `width:${SW}px;height:${SH}px;background:#000` }, D.glass), { o: 0 });
    D.sheen = reg(el('div', { class: 'abs', style: `width:${SW}px;height:${SH}px;background:linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.10) 46%, rgba(255,255,255,0) 60%)` }, D.glass), { o: 0 });
    D.finger = reg(WEB ? el('div', { class: 'cursor' }, root, `<svg width="34" height="46" viewBox="0 0 34 46"><path d="M3 2 L3 37 L11.5 29 L17.5 43 L23.5 40.5 L17.5 27 L29 27 Z" fill="#111" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/></svg>`) : el('div', { class: 'finger' }, root), { hide: true });
    D.ring = reg(el('div', { class: 'ring' }, root), { hide: true });
    return D;
  }
  /** draw the phone on plane Q (local origin = top-left of the glass) */
  function drawPhone(D, Q, o = {}) {
    const lift = o.lift ?? (WEB ? 14 : 34);  // thickness in local px
    onPlane(D.shadow, Q, -BZ + 30, -BZ - TOP + 60, -lift - 10, { o: o.shadowO ?? 0.9 });
    D.edges.forEach((e, i) => onPlane(e, Q, -BZ, -BZ - TOP, -lift + (i / 6) * lift, { o: o.bodyO ?? 1 }));
    onPlane(D.body, Q, -BZ, -BZ - TOP, 0, { o: o.bodyO ?? 1 });
    onPlane(D.glass, Q, 0, 0, 0.5);
  }
  function showScreen(D, name, st = {}) {
    for (const [n, V] of Object.entries(D.screens)) {
      if (n === name) { V.style(); put(V.v, { hide: false, x: st.x || 0, o: st.o ?? 1 }); if (V.strip) put(V.strip, { y: -(st.scroll || 0) }); }
      else if (st.under === n) { V.style(); put(V.v, { hide: false, x: st.underX || 0 }); }
      else put(V.v, { hide: true });
    }
  }
  /** finger on the glass: approach, press, release, leave */
  function drawFinger(D, Q, tap, at, t) {
    if (!tap) return put(D.finger, { hide: true });
    const cx = tap.x + tap.w / 2, cy = tap.y + tap.h / 2;
    const tb = C.beatAt(t), a = beatOf(at);
    if (tb < a - 1.1 || tb > a + 0.9) { put(D.finger, { hide: true }); put(D.ring, { hide: true }); return; }
    const inn = sp(t, a - 1.1, 'default'), out = sp(t, a + 0.4, 'default');
    const press = clamp(sp(t, a - 0.12, 'snappy') - sp(t, a + 0.1, 'snappy'));
    const dx = (1 - inn) * (WEB ? 260 : 90) + out * (WEB ? 120 : 70), dy = (1 - inn) * (WEB ? 180 : 120) + out * (WEB ? 90 : 110);
    const o = clamp(inn * 1.4) * (1 - clamp(out * 1.3));
    const s = (WEB ? 1.25 : 1) * (1 - press * 0.16);
    onPlane(D.finger, Q, cx + dx, cy + dy, 6, { o, hide: o < 0.01, css: { } }, s);
    const r = sp(t, a, 'default');
    const ro = tb >= a ? (1 - r) * 0.9 : 0;
    onPlane(D.ring, Q, cx, cy, 5, { o: ro, hide: ro < 0.01 }, 1 + r * 0.9);
  }

  // ================================================================ layout numbers per format
  const L = WEB ? {
    hero: { c: pick([1290, 590], [540, 900], [540, 1180]), k: pick(0.72, 0.66, 0.66) },
    explode: { c: pick([1220, 640], [560, 720], [560, 1000]), k: pick(0.6, 0.5, 0.6), rx: 54, rz: -32 },
    end: { c: pick([1380, 600], [540, 980], [540, 1280]), k: pick(0.44, 0.46, 0.5), side: pick(330, 250, 250), ks: 0.78 },
    wall: { k: pick(0.17, 0.15, 0.2), rx: 52, rz: -34, c: pick([1180, 560], [560, 760], [560, 1100]) },
    tx: pick(150, 90, 90), tw: pick(560, 900, 900),
  } : {
    hero: { c: pick([1300, 540], [540, 870], [540, 1150]), k: pick(0.84, 0.72, 0.86) },
    explode: { c: pick([1180, 600], [560, 860], [560, 1120]), k: pick(0.8, 0.68, 0.8), rx: 54, rz: -32 },
    end: { c: pick([1360, 560], [540, 930], [540, 1240]), k: pick(0.66, 0.56, 0.66), side: pick(360, 300, 300), ks: 0.82 },
    wall: { k: pick(0.36, 0.3, 0.42), rx: 52, rz: -34, c: pick([1180, 560], [560, 760], [560, 1100]) },
    tx: pick(150, 90, 90), tw: pick(760, 900, 900),
  };
  const HERO_SEQ = P.hero.seq;              // [{ at, shot, scroll:[from,to,b0,b1], tap:{rect}, push }]
  const FIRST = HERO_SEQ[0].shot;

  // ================================================================ 1. WALL (0–9)
  scene({
    name: 'wall', from: 0, to: 9,
    build(root, S) {
      // light products can set a deeper wall ground so white screens don't vanish into it
      root.style.background = PAL.wallBg ? `radial-gradient(120% 90% at 75% 45%, ${PAL.wallBg} 0%, ${PAL.wallBg} 45%, ${PAL.bg} 85%)` : `radial-gradient(120% 90% at 70% 40%, ${PAL.bg2} 0%, ${PAL.bg} 70%)`;
      // grid of real screens: columns drift in opposite directions; the hero screen sits at the centre tile
      const cols = WEB ? 7 : 9, rows = WEB ? 7 : 5, gx = SW + (WEB ? 110 : 70), gy = SH + (WEB ? 110 : 70);
      const pool = P.wall;
      S.tiles = [];
      let n = 0;
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
        const isHero = c === (WEB ? 3 : 4) && r === (WEB ? 3 : 2);
        const name = isHero ? FIRST : pool[(n++ * 7 + c) % pool.length];
        const e = reg(el('div', { class: 'abs', style: WEB ? `width:${SW}px;height:${SH}px;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 0 0 3px ${PAL.chromeDark ? '#2a2e37' : 'rgba(0,0,0,.16)'}, 0 40px 70px -24px ${PAL.shadow || 'rgba(0,0,0,.4)'}` : `width:${SW}px;height:${SH}px;border-radius:${RAD - BZ}px;overflow:hidden;background:#000;box-shadow:0 0 0 ${BZ}px #0b0d10, 0 0 0 ${BZ + 1.5}px rgba(255,255,255,.1)` }, root));
        el('img', { src: isHero ? capUrl(name) : thumbUrl(name), class: 'abs', style: `width:${SW}px;height:${SH}px` }, e);
        S.tiles.push({ e, c, r, isHero, x: c * gx - (cols - 1) / 2 * gx, y: r * gy - (rows - 1) / 2 * gy + (c % 2 ? gy * 0.5 : 0) });
      }
      // depth shadows for the wall plane come from one big soft vignette
      S.vig = reg(el('div', { class: 'abs', style: `width:${W}px;height:${H}px;background:${WIDE ? `linear-gradient(90deg, ${PAL.bg} 0%, ${PAL.bg} 28%, ${PAL.bg}E6 40%, ${PAL.bg}80 50%, ${PAL.bg}00 64%)` : `linear-gradient(180deg, ${PAL.bg} 0%, ${PAL.bg}F2 30%, ${PAL.bg}B3 40%, ${PAL.bg}00 56%)`}` }, root));
      // title: icon + name (on screen from frame 0: it is the thumbnail), then the promise rises
      const ic = pick(150, 130, 150), tx = L.tx, ty = pick(250, 120, 210);
      S.icon = reg(el('img', { src: `../assets/brand/icon.${EXT === 'png' ? 'png' : 'webp'}`, class: 'abs', style: `left:${tx}px;top:${ty}px;width:${ic}px;height:${ic}px;border-radius:${ic * 0.225}px;box-shadow:0 24px 50px -18px rgba(0,0,0,.6)` }, root));
      S.name = block(root, [P.name], { x: tx, y: ty + ic + pick(26, 20, 24), size: pick(150, 130, 150), w: L.tw, color: PAL.title || PAL.ink });
      S.line = block(root, P.line, { x: tx, y: ty + ic + pick(26, 20, 24) + S.name.h + pick(14, 10, 14), size: pick(56, 50, 56), w: pick(700, 880, 880), font: 'UI', weight: 500, lh: 1.25, ls: -0.01, color: PAL.muted, accentColor: PAL.accentText || PAL.accent });
      S.kick = reg(el('div', { class: 'abs', style: `left:${tx}px;top:${ty - pick(56, 50, 56)}px;font-family:UI;font-weight:700;font-size:${pick(24, 22, 24)}px;letter-spacing:.16em;text-transform:uppercase;color:${PAL.accentText || PAL.accent};white-space:nowrap` }, root, P.kicker), { o: 0 });
    },
    run(t, b, S) {
      const u = ease.inOut(seg(t, 6.2, 9));                  // the dive
      const B = basis(mix(L.wall.rx, 0, u), 0, mix(L.wall.rz, 0, u));
      const k = geo(L.wall.k, L.hero.k, u);
      const drift = (c) => (c % 2 ? 1 : -1) * C.lerp(0, 1, t / C.DUR) * (WEB ? 420 : 260);
      // hero tile centre (local) → its wall screen spot moves to the hero phone spot
      const heroT = S.tiles.find((x) => x.isHero);
      const hx = heroT.x + SW / 2, hy = heroT.y + drift(heroT.c) * (1 - u) + SH / 2;
      const B0 = basis(L.wall.rx, 0, L.wall.rz);
      const Q0 = planeAt(B0, L.wall.k, 0, 0, L.wall.c[0], L.wall.c[1]);
      const p0 = proj(Q0, hx, hy);
      const Q = planeAt(B, k, hx, hy, mix(p0[0], L.hero.c[0], u), mix(p0[1], L.hero.c[1], u));
      for (const T of S.tiles) {
        const fall = T.isHero ? 0 : u;
        const z = -fall * (300 + ((T.c * 3 + T.r * 5) % 7) * 90);
        onPlane(T.e, Q, T.x, T.y + drift(T.c) * (T.isHero ? 1 - u : 1), z, { o: 1 - clamp(fall * 1.6) });
      }
      // title: present at frame 0; promise rises; all of it lifts out as the dive starts
      rise(t, S.name, null, 6.1);
      put(S.icon, { s: 1 - 0.25 * sp(t, 6.0, 'snappy'), o: 1 - sp(t, 6.0, 'snappy') });
      rise(t, S.line, 0.6, 6.15, { stagger: 0.05, lineGap: 0.35 });
      put(S.kick, { o: clamp(sp(t, 0.2, 'default')) * (1 - sp(t, 6.0, 'snappy')) });
      put(S.vig, { o: 1 - clamp(u * 1.8) });
    },
  });

  // ================================================================ 2–4. DEVICE (9–28): one phone through hero → explode → end
  const allShots = new Map();
  HERO_SEQ.forEach((s) => allShots.set(s.shot, { scroll: !!s.scroll }));
  allShots.set(P.explode.shot, allShots.get(P.explode.shot) || {});
  P.trio.forEach((n) => allShots.set(n, allShots.get(n) || {}));

  scene({
    name: 'device', from: 9, to: 28,
    build(root, S) {
      root.style.background = `radial-gradient(120% 90% at 70% 40%, ${PAL.bg2} 0%, ${PAL.bg} 70%)`;
      S.shapes = shapes(root);
      // the two side phones of the end card (behind the main one)
      S.sides = [P.trio[1], P.trio[2]].map((n) => phone(root, [[n, {}]]));
      S.D = phone(root, [...allShots.entries()]);
      // exploded cards: crops of the real capture + their shadows on the glass
      const ex = P.explode;
      S.cards = ex.cards.map((c, i) => {
        const sh = reg(el('div', { class: 'abs', style: `width:${c.w}px;height:${c.h}px;border-radius:${c.r || 16}px;background:rgba(0,0,0,.55);filter:blur(16px)` }, root), { o: 0 });
        const e = reg(el('div', { class: 'abs', style: `width:${c.w}px;height:${c.h}px;border-radius:${c.r || 16}px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.08)` }, root), { hide: true });
        el('img', { src: capUrl(ex.shot), class: 'abs', style: `left:${-c.x}px;top:${-c.y}px;width:${SW}px;height:${SH}px` }, e);
        // cards higher on the screen lift higher, so lifted cards fan out instead of covering each other
        const rank = ex.cards.filter((o) => o.y > c.y).length;
        return { ...c, e, sh, z: 110 + rank * 90 };
      });
      S.labels = ex.cards.map((c, i) => {
        const g = reg(el('div', { class: 'abs', style: `white-space:nowrap` }, root), { o: 0 });
        el('div', { style: `font-family:UI;font-weight:700;font-size:${pick(38, 34, 38)}px;color:${PAL.ink};letter-spacing:-0.01em` }, g, c.label);
        if (c.sub) el('div', { style: `font-family:UI;font-weight:500;font-size:${pick(26, 24, 26)}px;color:${PAL.muted};margin-top:6px` }, g, c.sub);
        const line = reg(el('div', { class: 'abs', style: `height:2px;background:${PAL.accent};transform-origin:0 50%` }, root), { o: 0 });
        const dot = reg(el('div', { class: 'abs', style: `width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:${PAL.accent};box-shadow:0 0 0 5px ${PAL.accent}40` }, root), { o: 0 });
        return { g, line, dot, w: g.offsetWidth, h: g.offsetHeight };
      });
      // captions (hero beats)
      const cy = pick(330, 120, 200);
      S.says = P.hero.say.map((s) => block(root, s.lines, { x: L.tx, y: cy, size: WEB ? pick(70, 66, 80) : pick(86, 70, 84), w: L.tw - pick(WEB ? 0 : 60, 0, 0), min: WEB ? pick(50, 52, 60) : pick(64, 56, 66), color: PAL.ink, accentColor: PAL.accentText || PAL.accent }));
      S.sayKick = P.hero.say.map((s) => reg(el('div', { class: 'abs', style: `left:${L.tx}px;top:${cy - pick(52, 46, 52)}px;font-family:UI;font-weight:700;font-size:${pick(22, 20, 22)}px;letter-spacing:.16em;text-transform:uppercase;color:${PAL.accentText || PAL.accent}` }, root, s.kick || ''), { o: 0 }));
      S.exTitle = block(root, P.explode.title, { x: L.tx, y: pick(150, 90, 150), size: pick(70, 58, 70), w: pick(760, 900, 900), min: 50, color: PAL.ink, accentColor: PAL.accentText || PAL.accent });
      // end lockup
      const ic = pick(130, 110, 130), ex0 = WIDE ? L.tx : (W - 0) / 2, ey = pick(330, 110, 170);
      S.endIcon = reg(el('img', { src: `../assets/brand/icon.${EXT === 'png' ? 'png' : 'webp'}`, class: 'abs', style: `left:${WIDE ? ex0 : ex0 - ic / 2}px;top:${ey}px;width:${ic}px;height:${ic}px;border-radius:${ic * 0.225}px;box-shadow:0 24px 50px -18px rgba(0,0,0,.55)` }, root), { o: 0 });
      const nameW = widthAt100(P.name, 'Display', DW, DLS) / 100;
      const nsz = Math.min(pick(120, 96, 120), (WIDE ? 540 : 900) / nameW);
      S.endName = block(root, [P.name], { x: WIDE ? ex0 : (W - nameW * nsz) / 2, y: ey + ic + 22, size: nsz, w: nameW * nsz + 2, color: PAL.title || PAL.ink });
      S.endTag = reg(el('div', { class: 'abs', style: `${WIDE ? `left:${ex0}px;width:${WEB ? 520 : 600}px` : `left:${(W - 900) / 2}px;width:900px;text-align:center`};top:${ey + ic + 22 + S.endName.h + 12}px;font-family:UI;font-weight:500;font-size:${pick(38, 36, 40)}px;line-height:1.3;color:${PAL.muted}` }, root, P.end.line), { o: 0 });
      const tagH = S.endTag.offsetHeight;   // fonts are loaded at build: the real wrapped height
      S.pills = reg(el('div', { class: 'abs', style: `${WIDE ? `left:${ex0}px` : `left:0;width:${W}px;justify-content:center`};top:${ey + ic + 22 + S.endName.h + 12 + tagH + 26}px;display:flex;flex-wrap:wrap;gap:14px;${WIDE ? `width:${WEB ? 540 : 620}px` : ''}` }, root,
        P.end.pills.map((p) => `<span style="font-family:UI;font-weight:700;font-size:${pick(27, 25, 27)}px;padding:14px 26px;border-radius:999px;background:${PAL.pillBg || PAL.ink};color:${PAL.pillInk || PAL.bg};white-space:nowrap">${p}</span>`).join('')), { o: 0 });
    },
    run(t, b, S) {
      const D = S.D;
      driveShapes(t, S.shapes, [[9, LAYOUT.hero], [17, LAYOUT.explode], [23, LAYOUT.end]]);
      // ---------- phone pose: hero (gentle 3D turn) → explode (isometric) → end (front, slightly turned)
      const turn = sp(t, 9.2, 'heavy');
      const xE = sp(t, 17, 'heavy'), back = sp(t, 22.6, 'heavy');
      const ryH = -16 * turn + NZ[11](t * 0.4) * 1.5, rxH = 7 * turn;
      const rx = mix(mix(rxH, L.explode.rx, xE), 4, back), ry = mix(mix(ryH, 0, xE), -6, back), rz = mix(mix(0, L.explode.rz, xE), 0, back);
      const k = mix(mix(L.hero.k, L.explode.k, xE), L.end.k, back);
      const cx = mix(mix(L.hero.c[0], L.explode.c[0], xE), L.end.c[0], back), cy = mix(mix(L.hero.c[1], L.explode.c[1], xE), L.end.c[1], back);
      const B = basis(rx, ry, rz), Q = planeAt(B, k, SW / 2, SH / 2, cx, cy);
      const bodyIn = sp(t, 9, 'default');
      drawPhone(D, Q, { bodyO: clamp(bodyIn * 1.2), shadowO: 0.85 * bodyIn });
      put(D.sheen, { o: 0.9 * clamp(xE - back * 0.5) });
      // ---------- screen content
      const tb = b;
      let cur = HERO_SEQ[0], prev = null;
      for (const s of HERO_SEQ) if (tb >= beatOf(s.at)) { prev = cur === s ? prev : cur; cur = s; }
      if (tb >= 17) {
        // explode shows its own screen (pushed in like a navigation)
        const pIn = sp(t, 16.6, 'default');
        const ex = P.explode.shot;
        if (ex === cur.shot) showScreen(D, ex, { scroll: 0 });
        else showScreen(D, ex, { x: (1 - pIn) * SW, under: cur.shot, underX: -pIn * SW * 0.3 });
        if (tb >= 22.6) { const q = sp(t, 22.6, 'default'); showScreen(D, P.trio[0], { x: (1 - q) * SW, under: ex, underX: -q * SW * 0.3 }); }
      } else {
        const scr = cur.scroll ? mix(cur.scroll[0], cur.scroll[1], ease.inOut(seg(t, cur.scroll[2], cur.scroll[3]))) : 0;
        if (cur.push && prev) {
          const pIn = sp(t, beatOf(cur.at), 'default');
          showScreen(D, cur.shot, { scroll: scr, x: (1 - pIn) * SW, under: prev.shot, underX: -pIn * SW * 0.3 });
        } else showScreen(D, cur.shot, { scroll: scr });
      }
      // finger: next tap in the sequence
      const tapS = HERO_SEQ.find((s) => s.tap && tb >= beatOf(s.at) - 1.2 && tb <= beatOf(s.at) + 1);
      drawFinger(D, Q, tapS && tapS.tap, tapS ? beatOf(tapS.at) : 0, t);
      // ---------- explode: cards lift off the glass and land back
      const exOn = tb >= 16.5 && tb < 23.5;
      put(D.dim, { o: exOn ? 0.35 * clamp(sp(t, 18, 'default') - sp(t, 21.8, 'default')) : 0 });
      const cardPts = S.cards.map((c, i) => {
        const up = sp(t, 18 + i * 0.4, 'default') - sp(t, 21.6 + i * 0.12, 'snappy');
        const [px, py] = proj(Q, c.x + (c.anchor ?? 0.5) * c.w, c.y + c.h / 2, c.z * up + 1);
        return { i, px, py, right: !WIDE && !WEB && (c.side ?? -1) > 0 };
      });
      for (const side of [false, true]) {          // stack labels per column: keep their order, never overlap
        const col = cardPts.filter((q) => q.right === side).sort((a, b) => a.py - b.py);
        let floor = WEB && !WIDE ? pick(0, 1010, 1380) : S.exTitle.y + S.exTitle.h + pick(46, 40, 40);   // never under the title (4:5 web: under the window)
        for (const q of col) { const h = S.labels[q.i].h; q.ly = Math.max(q.py - h / 2, floor); floor = q.ly + h + 22; }
      }
      S.cards.forEach((c, i) => {
        const up = sp(t, 18 + i * 0.4, 'default') - sp(t, 21.6 + i * 0.12, 'snappy');
        const z = c.z * up;
        const vis = exOn && up > 0.004;
        onPlane(c.e, Q, c.x, c.y, z + 1, { hide: !vis }, 1);
        onPlane(c.sh, Q, c.x + 6, c.y + 14, 1, { o: vis ? 0.5 * clamp(up) : 0 });
        // labels sit in screen space beside the lifted card, a dot on the card, a leader line between
        const lb = S.labels[i];
        const [px, py] = proj(Q, c.x + (c.anchor ?? 0.5) * c.w, c.y + c.h / 2, z + 1);
        const lo = exOn ? clamp(sp(t, 18.6 + i * 0.4, 'default') - sp(t, 21.4, 'snappy')) : 0;
        const right = !WIDE && !WEB && (c.side ?? -1) > 0;
        const lx = WIDE ? L.tx : right ? W - 56 - lb.w : 56, ly = cardPts[i].ly, lyc = ly + lb.h * 0.36;
        const slide = (1 - lo) * 30 * (right ? 1 : -1);
        put(lb.g, { o: lo, css: { transform: `translate(${(lx + slide).toFixed(1)}px, ${ly.toFixed(1)}px)` } });
        const x0 = right ? px + 12 : lx + lb.w + 16, x1 = right ? lx - 16 : px - 12;
        // leader: from the label's first line to the dot on the card (a straight segment, any angle)
        const lsx = right ? x1 : x0, dxL = right ? px + 12 - x1 : x1 - x0, ang = Math.atan2(py - lyc, right ? (px - x1) : (px - x0));
        const len = Math.hypot(right ? px - x1 : px - x0, py - lyc) - 12;
        put(lb.line, { o: lo * (len > 8 ? 1 : 0), css: { transform: `translate(${(right ? x1 : x0).toFixed(1)}px, ${(lyc - 1).toFixed(1)}px) rotate(${(right ? Math.atan2(py - lyc, px - x1) : ang).toFixed(4)}rad) scaleX(${Math.max(0, len * lo).toFixed(2)})`, width: '1px' } });
        put(lb.dot, { o: lo, css: { transform: `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) scale(${lo.toFixed(3)})` } });
      });
      // ---------- end: side phones slide in behind
      S.sides.forEach((Dp, i) => {
        const s = i ? 1 : -1;
        const inn = sp(t, 23.4 + i * 0.25, 'heavy');
        const Bs = basis(4, s * 10, s * 4 * inn);
        const Qs = planeAt(Bs, L.end.k * L.end.ks, SW / 2, SH / 2, L.end.c[0] + s * L.end.side * inn + s * (1 - inn) * 80, L.end.c[1] + 40 + (1 - inn) * 300);
        drawPhone(Dp, Qs, { bodyO: clamp(inn * 2), shadowO: 0.7 * inn });
        showScreen(Dp, P.trio[i + 1], {});
        put(Dp.glass, { o: clamp(inn * 2) });
        if (inn < 0.002) { [Dp.shadow, ...Dp.edges, Dp.body, Dp.glass].forEach((e) => put(e, { hide: true })); }
      });
      // ---------- type
      P.hero.say.forEach((s, i) => {
        const a = beatOf(s.at), z = i + 1 < P.hero.say.length ? beatOf(P.hero.say[i + 1].at) - 0.3 : 16.6;
        rise(t, S.says[i], a, z);
        put(S.sayKick[i], { o: clamp(sp(t, a - 0.2, 'default')) * (1 - sp(t, z, 'snappy')) });
      });
      rise(t, S.exTitle, 17.6, 22.6);
      const eo = sp(t, 24.4, 'default');
      put(S.endIcon, { o: clamp(sp(t, 23.8, 'snappy') * 1.5), s: 0.6 + 0.4 * spHit(t, 24, 'default') });
      rise(t, S.endName, 24.3, null);
      put(S.endTag, { o: eo, y: (1 - eo) * 20 });
      put(S.pills, { o: sp(t, 25.2, 'default'), y: (1 - sp(t, 25.2, 'default')) * 20 });
    },
  });

  Promise.all(C.fonts.map((f) => document.fonts.load(f))).then(() => document.fonts.ready).then(() => {
    C.start();
    const q = new URLSearchParams(location.search);
    if (q.has('live') || q.has('scrub')) live(q.has('scrub'));
  });

  // ================================================================ live mode (?live): the film runs in the page that embeds it
  // Plays on the wall clock, fits the window, and talks to its parent with postMessage:
  //   in:  { reel: 'play' | 'pause' | 'restart' }      out: { reel: 'ready' | 'progress' | 'ended', t, dur }
  //   ?scrub: no clock at all; the parent drives frames itself through contentWindow.seek(t) (scroll-scrubbed chapters)
  function live(scrub) {
    document.documentElement.style.background = document.body.style.background = PAL.bg;
    const fit = () => { const k = Math.min(innerWidth / W, innerHeight / H); stage.style.transform = `scale(${k})`; stage.style.marginLeft = `${(innerWidth - W * k) / 2}px`; stage.style.marginTop = `${(innerHeight - H * k) / 2}px`; };
    fit(); addEventListener('resize', fit);
    const send = (m) => parent !== window && parent.postMessage({ ...m, slug: P.slug }, '*');
    let playing = false, t = 0, last = 0, done = false, sent = 0;
    addEventListener('message', (e) => {
      const c = e.data && e.data.reel;
      if (c === 'play') { playing = !done; last = performance.now(); }
      else if (c === 'pause') playing = false;
      else if (c === 'restart') { t = 0; done = false; playing = true; last = performance.now(); }
    });
    window.READY.then(() => {
      window.seek(0);
      send({ reel: 'ready', dur: C.DUR });
      if (scrub) return;
      const loop = (now) => {
        if (playing) {
          t += Math.min(0.1, (now - last) / 1000);
          if (t >= C.DUR) { t = C.DUR - 1e-3; playing = false; done = true; send({ reel: 'ended', t, dur: C.DUR }); }
          window.seek(t);
          if (now - sent > 90) { send({ reel: 'progress', t, dur: C.DUR }); sent = now; }
        }
        last = now;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  }
})();
