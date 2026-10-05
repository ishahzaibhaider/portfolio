// TabibFinder: every doctor in Saudi Arabia on one map. Live Saudi data (109 doctors), browsed as a guest, dark theme.
// @caps projects/tabibfinder/captures/en  @fonts projects/tabibfinder/captures/brand  @icon projects/tabibfinder/captures/brand/icon-1024.png
// @face Display 800 Nunito-800ExtraBold.woff2
// @face UI 500 Nunito-600SemiBold.woff2
// @face UI 700 Nunito-800ExtraBold.woff2
window.PRODUCT = {
  slug: 'tabibfinder',
  name: 'TabibFinder',
  kicker: 'iOS · Live on the App Store',
  line: ['Every doctor in Saudi Arabia,', [['one tap away.', true]]],
  displayLs: -0.02,
  // src/constants/theme.ts (dark is the default)
  pal: {
    bg: '#0B1222', bg2: '#16233D', ink: '#F1F5F9', title: '#F1F5F9', muted: '#94A3B8',
    accent: '#00D4C4', accentText: '#2DE2D3', dots: '#94A3B840',
    shapes: ['#0E6F68', '#1B2943', '#18243B', '#00D4C4'],
    shadow: 'rgba(0,0,0,.65)', rim: 'rgba(160,230,225,.38)', pillBg: '#00D4C4', pillInk: '#0B1222',
  },
  screenBg: '#0F172A',
  wall: ['map', 'dashboard', 'search_specialty', 'profile_verified', 'categories', 'map_riyadh', 'profile_reviews', 'search_all', 'dashboard_nearby', 'map_popup', 'profile', 'search_query', 'saved', 'me'],
  hero: {
    // real taps recorded by tools/capture.mjs (meta.json)
    seq: [
      { at: 9, shot: 'map' },
      { at: 11, shot: 'map_riyadh', tap: { x: 71, y: 88, w: 328, h: 23 } },
      { at: 12.75, shot: 'map_popup', tap: { x: 213.2, y: 597.4, w: 16, h: 16 } },
      { at: 14.25, shot: 'profile_from_map', push: true, tap: { x: 120, y: 479.6, w: 201, h: 111.4 }, scroll: [0, 280, 15.2, 16.6] },
    ],
    say: [
      { at: 9.3, kick: '109 doctors · live', lines: ['Every clinic', [['on one map.', true]]] },
      { at: 12.4, kick: 'Riyadh · Jeddah · Makkah', lines: ['Tap a pin,', [['meet the doctor.', true]]] },
    ],
  },
  explode: {
    shot: 'profile_verified',
    title: ['Real profiles,', [['one tap to call.', true]]],
    cards: [
      { x: 16, y: 133, w: 408, h: 320, r: 20, label: 'Dr. Hani Al-Hammad', sub: 'Ophthalmology · Riyadh', side: -1 },
      { x: 16, y: 469, w: 408, h: 131, r: 18, label: 'Verified', sub: 'Ratings from real patients', side: 1 },
      { x: 16, y: 616, w: 408, h: 48, r: 14, label: 'Call', sub: 'Straight to the clinic', side: -1 },
    ],
  },
  trio: ['dashboard', 'search_specialty', 'categories'],
  end: { line: 'Find your doctor.', pills: ['iOS', 'App Store', '34 specialties'] },
};
