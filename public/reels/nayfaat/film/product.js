// Nayfaat: one private desert house near Riyadh, booked in the app.
// @caps projects/nayfaat/captures/en  @fonts projects/nayfaat/fonts  @icon projects/nayfaat/videos/nayfaat-en/assets/brand/icon.png
// @face Display 500 newsreader-500Medium.woff2
// @face UI 500 albert-sans-500Medium.woff2
// @face UI 700 albert-sans-600SemiBold.woff2
window.PRODUCT = {
  slug: 'nayfaat',
  name: 'Nayfaat',
  kicker: 'iOS · Android · Riyadh',
  line: ['A desert house,', [['yours alone.', true]]],          // the client's own line (web/_src/content_en.py)
  displayWeight: 500, displayLs: -0.02,
  // src/theme/tokens.ts: bone, ink, one ember accent
  pal: {
    bg: '#EFEBE4', bg2: '#F8F5F0', ink: '#163035', title: '#163035', muted: '#3A5C60',
    accent: '#C46237', accentText: '#974C2A', dots: '#16303533',
    shapes: ['#E7B597', '#DED5C9', '#E6DED3', '#C46237'],
    shadow: 'rgba(22,48,53,.42)', pillBg: '#163035', pillInk: '#EFEBE4',
  },
  screenBg: '#EFEBE4',
  wall: ['home', 'gallery', 'cal2', 'review', 'details', 'payA0', 'confirmed', 'detail_open', 'notify', 'guests', 'bank', 'home_s', 'gallery_pool', 'payB'],
  hero: {
    // real taps from captures/en/meta.json (taps.cta / d15 / d17)
    seq: [
      { at: 9, shot: 'home' },
      { at: 11, shot: 'cal0', push: true, tap: { x: 236.8, y: 710, w: 179.2, h: 48 } },
      { at: 12.75, shot: 'cal1', tap: { x: 248, y: 414, w: 56, h: 64 } },
      { at: 14, shot: 'cal2', tap: { x: 360, y: 414, w: 56, h: 64 } },
    ],
    say: [
      { at: 9.3, kick: '45 min from Riyadh', lines: ['One house.', [['One family at a time.', true]]] },
      { at: 11.3, kick: 'Live availability', lines: ['Pick your nights,', [['Gregorian or Hijri.', true]]] },
    ],
  },
  explode: {
    shot: 'detail_open',
    title: ['Your gate code,', [['three hours before check-in.', true]]],
    cards: [
      { x: 24, y: 225, w: 392, h: 208, r: 22, label: 'Gate code 4471', sub: 'Keyless, works offline', side: -1 },
      { x: 24, y: 459, w: 392, h: 90, r: 18, label: '15 → 17 Oct', sub: 'Two nights, both calendars', side: 1 },
      { x: 292, y: 705, w: 124, h: 48, r: 12, label: 'Directions', sub: '45 min from Riyadh', side: -1 },
    ],
  },
  trio: ['confirmed', 'gallery_pool', 'review'],
  end: { line: 'A desert house, yours alone.', pills: ['iOS', 'Android', 'Arabic + English'] },
};
