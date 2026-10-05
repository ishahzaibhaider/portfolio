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
  // apps/mobile/lib/theme.ts: the night gradient (#1e1b4b → #312e81) with indigo #4f46e5 and cyan #22d3ee
  pal: {
    bg: '#14123A', bg2: '#2A2672', ink: '#F1F0FF', title: '#FFFFFF', muted: '#A5A8D6',
    accent: '#22D3EE', accentText: '#22D3EE', dots: '#A5A8D640',
    shapes: ['#4F46E5', '#2B286E', '#25235F', '#22D3EE'],
    shadow: 'rgba(5,4,20,.6)', rim: 'rgba(180,190,255,.35)', pillBg: '#22D3EE', pillInk: '#14123A',
  },
  screenBg: '#F6F7FB',
  wall: ['o01_dashboard', 'o03_order', 'd01_home', 'o10_statistics_30d', 's01_queue', 'o08_wizard_cart', 'o02_orders', 'o05_customer', 'd02_order', 'o07_wizard_type', 'o04_customers', 'd03_map', 'o09_wizard_schedule', 's02_order', 'o08_wizard_products'],
  hero: {
    seq: [
      { at: 9, shot: 'o01_dashboard' },
      { at: 10.5, shot: 'o06_wizard_customer', push: true, tap: { x: 16, y: 578, w: 320, h: 46 } },
      { at: 11.75, shot: 'o07_wizard_type', push: true, tap: { x: 33, y: 776, w: 374, h: 17 } },
      { at: 13, shot: 'o08_wizard_products', push: true, tap: { x: 101, y: 234, w: 302, h: 17 } },
      { at: 14.25, shot: 'o08_wizard_cart', tap: { x: 33, y: 733, w: 281.7, h: 17 } },
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
      { x: 136, y: 206, w: 184, h: 192, r: 12, label: 'A QR on every order', sub: 'Scan to move it along', side: -1 },
      { x: 160, y: 440, w: 128, h: 40, r: 20, label: 'Print receipt', sub: 'The QR goes on the bag', side: 1 },
      { x: 16, y: 524, w: 408, h: 140, r: 18, label: 'Fatima Al-Qahtani', sub: 'Call or message in one tap', side: -1 },
    ],
  },
  trio: ['d01_home', 's01_queue', 'o10_statistics_30d'],
  end: { line: 'The whole laundry, in one app.', pills: ['iOS', 'Android', '3 roles', 'Arabic + English'] },
};
