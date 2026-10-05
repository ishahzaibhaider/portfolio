// Retaj: home services for Saudi Arabia (cleaning, maintenance, pest control), four roles in one app. Live demo accounts.
// @caps projects/retaj/captures/en  @fonts projects/retaj/captures/brand  @icon projects/retaj/captures/brand/app-icon-1024.png
// @face Display 800 Tajawal_800ExtraBold.woff2
// @face UI 500 Tajawal_500Medium.woff2
// @face UI 700 Tajawal_700Bold.woff2
window.PRODUCT = {
  slug: 'retaj',
  name: 'Retaj',
  kicker: 'iOS · Android · Saudi Arabia',
  line: ['Cleaning, maintenance, pest control,', [['booked in one app.', true]]],
  displayLs: -0.02,
  // freshvan/src/theme.ts (light canvas, cobalt hero, ice accent)
  pal: {
    bg: '#E7F1F1', bg2: '#F4F9F9', ink: '#0B2E33', title: '#0B2E33', muted: '#4F7C82',
    accent: '#0D518C', accentText: '#0D518C', dots: '#0B2E3326',
    shapes: ['#A9D8DF', '#CFE3E5', '#D6E6E7', '#0D518C'],
    shadow: 'rgba(11,46,51,.36)', pillBg: '#0B2E33', pillInk: '#E7F1F1',
  },
  screenBg: '#E7F1F1',
  wall: ['c01_home', 'a01_dashboard', 'c03_service', 't01_jobs', 'c06_schedule_picked', 's01_queue', 'c11_invoice', 'c13_home_dark', 'c08_summary', 'c09_bookings', 'a03_services', 'c02_category', 'c10_booking', 'c04_cart_promo', 's03_assign_panel', 't02_jobs_done'],
  hero: {
    seq: [
      { at: 9, shot: 'c01_home' },
      { at: 10.5, shot: 'c03_service', push: true, tap: { x: 18, y: 515, w: 208, h: 211 } },
      { at: 12, shot: 'c04_cart_promo', push: true, tap: { x: 205, y: 822, w: 205, h: 48 } },
      { at: 13.5, shot: 'c05_schedule', push: true, tap: { x: 20, y: 737, w: 390, h: 46 } },
      { at: 14.75, shot: 'c06_schedule_picked', tap: { x: 335.7, y: 259.5, w: 42, h: 18 } },
    ],
    say: [
      { at: 9.3, kick: 'Customer app', lines: ['Home services,', [['booked in three taps.', true]]] },
      { at: 12.6, kick: 'Cash on completion', lines: ['Pick a time,', [['pay when it’s done.', true]]] },
    ],
  },
  explode: {
    shot: 'a01_dashboard',
    title: ['Four roles,', [['one live system.', true]]],
    cards: [
      { x: 20, y: 133, w: 400, h: 173, r: 22, label: 'Revenue', sub: 'Collected this month', side: -1, anchor: 0.25 },
      { x: 38, y: 227, w: 364, h: 61, r: 10, label: 'Seven-day trend', sub: 'Every paid job', side: 1 },
      { x: 20, y: 322, w: 194, h: 85, r: 18, label: 'Open orders', sub: 'Live from the field', side: -1 },
    ],
  },
  trio: ['t01_jobs', 's01_queue', 'c13_home_dark'],
  end: { line: 'Home services, on demand.', pills: ['iOS', 'Android', 'Arabic + English', '4 roles'] },
};
