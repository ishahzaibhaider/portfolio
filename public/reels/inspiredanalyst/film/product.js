// Inspired Analyst: research, Shariah screening, mentorship and a Binance-linked portfolio for traders.
// Public pages from production (signed-out visitor); signed-in pages from a local copy answering /api with invented data.
// Gilroy (the brand face) is commercial, so Plus Jakarta Sans stands in.
// @caps projects/inspiredanalyst/captures/web  @fonts projects/inspiredanalyst/captures/brand  @icon projects/inspiredanalyst/captures/brand/icon-tile.png
// @face Display 800 jakarta.woff2
// @face UI 500 jakarta.woff2
// @face UI 700 jakarta.woff2
window.PRODUCT = {
  slug: 'inspiredanalyst',
  device: 'web',
  domain: 'inspired-analyst.vercel.app',
  name: 'Inspired Analyst',
  kicker: 'Research · portfolios · mentorship',
  line: ['Finance, AI and tech,', [['made clear with data.', true]]],
  displayLs: -0.03,
  // the site's own dark theme with its iridescent violet → teal → pink glow
  pal: {
    bg: '#0A0A0A', bg2: '#1B1438', ink: '#FFFFFF', title: '#FFFFFF', muted: '#9A9AA6',
    accent: '#DE50EC', accentText: '#E879F9', dots: '#FFFFFF26',
    shapes: ['#3813F3', '#1C1C22', '#21193A', '#05B0B3'],
    shadow: 'rgba(0,0,0,.7)', rim: 'rgba(255,255,255,.22)', chromeDark: true, pillBg: '#DE50EC', pillInk: '#0A0A0A',
  },
  screenBg: '#0A0A0A',
  wall: ['home', 'portfolio', 'research_list', 'pricing', 'shariah', 'admin_dashboard', 'bootcamp_list', 'calculator_filled', 'research_detail', 'about_team', 'portfolio_holdings', 'meetings', 'admin_research', 'shariah_detail'],
  hero: {
    seq: [
      { at: 9, shot: 'home' },
      { at: 10.5, shot: 'research_list', push: true },
      { at: 12, shot: 'research_detail', push: true, tap: { x: 104, y: 562, w: 366, h: 36 } },
      { at: 13.5, shot: 'portfolio', push: true },
      { at: 14.75, shot: 'portfolio_1d', tap: { x: 808, y: 340, w: 39, h: 29 } },
    ],
    say: [
      { at: 9.3, kick: 'For traders and investors', lines: ['Research you can', [['actually act on.', true]]] },
      { at: 12.6, kick: 'Binance-linked', lines: ['Then your own', [['portfolio, live.', true]]] },
    ],
  },
  explode: {
    shot: 'portfolio_1d',
    title: ['Holdings, allocation,', [['every move in one view.', true]]],
    cards: [
      { x: 80, y: 315, w: 847, h: 344, r: 16, label: 'Portfolio value', sub: 'Any range, one tap', side: -1 },
      { x: 947, y: 315, w: 413, h: 344, r: 16, label: 'Allocation', sub: 'Across every asset', side: 1 },
    ],
  },
  trio: ['pricing', 'shariah', 'admin_dashboard'],
  end: { line: 'Research, portfolios, mentors.', pills: ['Research', 'Shariah screening', 'Mentorship'] },
};
