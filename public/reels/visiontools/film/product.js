// Vision Tools: a stationery store in Syria, Arabic-first shopping app with cash on delivery. Live catalogue, browsed as a guest.
// @caps projects/visiontools/captures/en  @fonts projects/visiontools/captures/brand  @icon projects/visiontools/captures/brand/icon-1024.png
// @face Display 800 Tajawal-800ExtraBold.woff2
// @face UI 500 Tajawal-500Medium.woff2
// @face UI 700 Tajawal-700Bold.woff2
window.PRODUCT = {
  slug: 'visiontools',
  name: 'Vision Tools',
  kicker: 'iOS · Android · Syria',
  line: ['A stationery store in Syria,', [['open in one app.', true]]],
  displayLs: -0.02,
  // src/constants/theme.ts: white + teal (the client rejected cream/serif)
  pal: {
    bg: '#EEF2F4', bg2: '#FFFFFF', ink: '#16181D', title: '#16181D', muted: '#5B6270',
    accent: '#0F766E', accentText: '#0F766E', dots: '#16181D22',
    shapes: ['#B9E2DB', '#DDE3E8', '#E3F1EE', '#0F766E'],
    shadow: 'rgba(22,24,29,.30)', pillBg: '#0F766E', pillInk: '#FFFFFF',
  },
  screenBg: '#FFFFFF',
  wall: ['home', 'product_ramadan', 'home_grid', 'cart', 'product_business', 'home_ar', 'search_ramadan', 'product_annual', 'home_planners', 'product_ar', 'search_results', 'cart_ar', 'product_ramadan_added', 'signin'],
  hero: {
    seq: [
      { at: 9, shot: 'home' },
      { at: 10.75, shot: 'product_ramadan', push: true, tap: { x: 228, y: 668, w: 196, h: 262 } },
      { at: 12.25, shot: 'product_ramadan_qty2', tap: { x: 101, y: 867, w: 32, h: 32 } },
      { at: 13.25, shot: 'product_ramadan_added', tap: { x: 249.8, y: 876, w: 78.5, h: 24 } },
      { at: 14.75, shot: 'cart', push: true },
    ],
    say: [
      { at: 9.3, kick: 'Planners · gifts · stationery', lines: ['A whole store', [['in your pocket.', true]]] },
      { at: 12.2, kick: 'Cart', lines: ['Add to cart,', [['pay when it arrives.', true]]] },
    ],
  },
  explode: {
    shot: 'cart',
    title: ['Cash on delivery,', [['to every governorate.', true]]],
    cards: [
      { x: 16, y: 253, w: 408, h: 122, r: 16, label: 'Planner Ramadan', sub: 'SYP 59,000', side: -1 },
      { x: 8, y: 515, w: 424, h: 139, r: 16, label: 'SYP 281,000', sub: 'Delivery fee included', side: 1 },
      { x: 16, y: 779, w: 408, h: 52, r: 14, label: 'Checkout', sub: 'Pay the courier in cash', side: -1 },
    ],
  },
  trio: ['home_ar', 'product_ar', 'cart_ar'],
  end: { line: 'Arabic first. English too.', pills: ['iOS', 'Android', 'Cash on delivery'] },
};
