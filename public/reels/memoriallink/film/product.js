// MemorialLink: helps grieving families memorialize or close a loved one's social accounts through each platform's
// official channel. Local build on fictional seeded cases (real uploads/outbox were never opened).
// @caps projects/memoriallink/captures/web  @fonts projects/memoriallink/captures/brand  @icon projects/memoriallink/captures/brand/icon-tile.png
// @face Display 650 SchibstedGrotesk-Variable-latin.woff2
// @face UI 500 SchibstedGrotesk-Variable-latin.woff2
// @face UI 700 SchibstedGrotesk-Variable-latin.woff2
window.PRODUCT = {
  slug: 'memoriallink',
  device: 'web',
  domain: 'memoriallink.app',
  name: 'MemorialLink',
  kicker: 'For families, after a loss',
  line: ['Their accounts, closed or kept,', [['the right way.', true]]],
  displayWeight: 650, displayLs: -0.03,
  // 'Stillwater' (src/app/globals.css): quiet paper, deep green, one warm gold
  pal: {
    wallBg: '#CBD5CD', bg: '#F1F1EC', bg2: '#FBFBF8', ink: '#181C1A', title: '#181C1A', muted: '#5C6B62',
    accent: '#1E4D3F', accentText: '#1E4D3F', dots: '#181C1A1F',
    shapes: ['#D5E2DA', '#E3E5DE', '#E8EAE3', '#9A7B2E'],
    shadow: 'rgba(24,28,26,.24)', pillBg: '#1E4D3F', pillInk: '#F7F7F4',
  },
  screenBg: '#F7F7F4',
  wall: ['landing', 'start_accounts_selected', 'track_result', 'how_platforms', 'start_documents_added', 'admin_case_preview', 'start_review', 'admin_cases', 'how_it_works', 'track_timeline', 'start_done', 'admin_case_accounts', 'landing_platforms', 'start_details'],
  hero: {
    seq: [
      { at: 9, shot: 'landing' },
      { at: 10.5, shot: 'start_accounts', push: true },
      { at: 12, shot: 'start_accounts_selected', tap: { x: 424, y: 288, w: 593, h: 61 } },
      { at: 13.5, shot: 'start_documents_added', push: true },
      { at: 15, shot: 'start_done', push: true },
    ],
    say: [
      { at: 9.3, kick: 'Six platforms, one request', lines: ['Every platform', [['has its own rules.', true]]] },
      { at: 12.6, kick: 'Guided, one step at a time', lines: ['Keep the profile', [['or close it, per account.', true]]] },
    ],
  },
  explode: {
    shot: 'track_result',
    title: ['Families see where things stand,', [['without chasing anyone.', true]]],
    cards: [
      { x: 380, y: 184, w: 680, h: 238, r: 16, label: 'Where things stand', sub: 'One reference, one page', side: -1 },
      { x: 380, y: 454, w: 680, h: 150, r: 16, label: 'Every account', sub: 'Its own status, its own reply', side: 1 },
    ],
  },
  trio: ['admin_case_preview', 'admin_cases', 'how_platforms'],
  end: { line: 'Closing the door, gently.', pills: ['6 platforms', 'Family tracker', 'Operator desk'] },
};
