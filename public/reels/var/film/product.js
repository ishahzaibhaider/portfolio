// VAR: laundry-shop operations for Saudi Arabia (owner / staff / driver), live on both stores. Demo shop "Central Laundry".
// @caps projects/var/captures/en  @fonts projects/var/captures/brand  @icon projects/var/captures/brand/icon-1024.png
// @face Display 800 Tajawal-800ExtraBold.woff2
// @face UI 500 Tajawal-500Medium.woff2
// @face UI 700 Tajawal-700Bold.woff2
window.PRODUCT = {
  slug: 'var',
  name: 'VAR',
  kicker: 'iOS · Android · Saudi Arabia',
  line: ['Laundry operations for owners,', [['staff and drivers.', true]]],
  displayLs: -0.01,
  // apps/mobile/lib/theme.ts, the 1.1.0 "Sky" theme (Nov 2026): deep blue #02041C, UI blue #0090D4, brand blue #00B6FE
  pal: {
    bg: '#02041C', bg2: '#0B2A44', ink: '#EAF6FD', title: '#FFFFFF', muted: '#8FB3CC',
    accent: '#00B6FE', accentText: '#33C5FE', dots: '#8FB3CC40',
    shapes: ['#0090D4', '#0B2A44', '#071A30', '#00B6FE'],
    shadow: 'rgba(0,4,16,.65)', rim: 'rgba(160,220,255,.38)', pillBg: '#00B6FE', pillInk: '#02041C',
  },
  screenBg: '#F4F8FB',
  wall: ['o01_dashboard', 'o03_order', 'd01_home', 'o11_reports', 's01_queue', 'o08_wizard_cart', 'o02_orders', 'o05_customer', 'd02_order', 'o07_wizard_type', 'o04_customers', 'd03_map', 'o10_statistics_30d', 's02_order', 'o12_menu'],
  hero: {
    // real taps recorded by projects/var/tools/capture.mjs (meta.json); each tap is on the screen before
    seq: [
      { at: 9, shot: 'o01_dashboard' },
      { at: 10.25, shot: 'o06_wizard_customer', push: true, tap: { x: 14, y: 321.9, w: 412, h: 53.1 } },
      { at: 11.25, shot: 'o07_wizard_type', push: true, tap: { x: 31, y: 736.6, w: 378, h: 18 } },
      { at: 12.25, shot: 'o07_wizard_type_pickup', tap: { x: 31, y: 290.8, w: 168.8, h: 18 } },
      { at: 13.25, shot: 'o08_wizard_products', push: true, tap: { x: 31, y: 459.2, w: 168.8, h: 18 } },
      { at: 14.5, shot: 'o08_wizard_cart', tap: { x: 31, y: 695.1, w: 288.2, h: 18 } },
    ],
    say: [
      { at: 9.3, kick: 'Owner app', lines: ['A new order', [['in four taps.', true]]] },
      { at: 12.5, kick: 'Home delivery', lines: ['Pick the clothes,', [['the driver does the rest.', true]]] },
    ],
  },
  explode: {
    shot: 'o03_order',
    title: ['Every bag tracked,', [['pickup to delivery.', true]]],
    cards: [
      { x: 132, y: 205.6, w: 176, h: 176, r: 8, label: 'A QR on every order', sub: 'Scan to move it along', side: -1 },
      { x: 157.5, y: 433.5, w: 125, h: 36.8, r: 12, label: 'Print receipt', sub: 'The QR goes on the bag', side: 1 },
      { x: 16, y: 500.8, w: 408, h: 159.7, r: 16, label: 'Fatima Al-Qahtani', sub: 'Call or message in one tap', side: -1 },
    ],
  },
  trio: ['d01_home', 's01_queue', 'o11_reports'],
  end: { line: 'The whole laundry, in one app.', pills: ['iOS', 'Android', '3 roles', 'Arabic + English'] },
};
