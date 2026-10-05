// Thikana: hostel management for Pakistan (web + mobile). The web app on the live demo hostel (Al-Falah, 118 seats).
// @caps projects/thikana/captures/web  @fonts projects/thikana/fonts  @icon projects/thikana/videos/thikana-en/assets/brand/icon.png
// @face Display 800 bricolage.woff2
// @face UI 500 jakarta.woff2
// @face UI 700 jakarta.woff2
window.PRODUCT = {
  slug: 'thikana',
  device: 'web',
  domain: 'thikana.app',
  name: 'Thikana',
  kicker: 'Web · Android · iOS · Pakistan',
  line: ['Hostel management:', [['every rupee, every room.', true]]],
  // apps/web globals.css: pine + lime, used as accents on a paper ground (the owner asked for less green)
  pal: {
    bg: '#F1EFE7', bg2: '#FBFAF5', ink: '#14201A', title: '#14201A', muted: '#5F6B61',
    accent: '#0C3B2A', accentText: '#0C3B2A', dots: '#14201A26',
    shapes: ['#D9EDBB', '#E2E0D5', '#E8E6DC', '#B7F04B'],
    shadow: 'rgba(20,32,26,.30)', pillBg: '#0C3B2A', pillInk: '#B7F04B',
  },
  screenBg: '#EDF1EC',
  // full-page captures that scroll inside the window
  strips: { pre_rooms: { src: 'pre_rooms_full', h: 2601 } },
  wall: ['pre_dashboard', 'pre_collect', 'pre_rooms', 'post_payments', 'pre_tenants', 'pre_expenses', 'post_dashboard', 'pre_staff', 'post_collect', 'pre_reports', 'pre_payments', 'post_rooms'],
  hero: {
    seq: [
      { at: 9, shot: 'pre_dashboard' },
      { at: 10.75, shot: 'pre_collect', push: true, tap: { x: 1111, y: 290, w: 276, h: 38 } },
      { at: 12.5, shot: 'pre_rooms', tap: { x: 16, y: 138, w: 200, h: 32 } },
      { at: 15.25, shot: 'post_dashboard', tap: { x: 16, y: 92, w: 200, h: 38 } },
    ],
    say: [
      { at: 9.3, kick: 'For hostel owners', lines: ['Who paid,', [['who didn’t, in one look.', true]]] },
      { at: 12.4, kick: '118 seats · 11 rooms', lines: ['Every room,', [['every seat, live.', true]]] },
    ],
  },
  explode: {
    shot: 'post_dashboard',
    title: ['Collect on the phone,', [['the books update here.', true]]],
    cards: [
      { x: 264, y: 172, w: 477, h: 178, r: 18, label: 'Rs 10,98,000 collected', sub: 'Up the moment rent is paid', side: -1 },
      { x: 1091, y: 172, w: 317, h: 178, r: 18, label: 'Rs 4,48,000 to collect', sub: 'Worst first, one tap to remind', side: 1 },
      { x: 929, y: 375, w: 478, h: 460, r: 20, label: 'Every rupee audited', sub: 'Who took it, and when', side: -1 },
    ],
  },
  trio: ['post_payments', 'pre_tenants', 'pre_expenses'],
  end: { line: 'Every rupee, accounted for.', pills: ['Web', 'Android', 'iOS', 'Urdu + English'] },
};
