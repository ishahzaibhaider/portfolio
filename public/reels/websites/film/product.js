// Websites: the client sites and small-business demo sites he built and shipped (40 live, captured read-only as a visitor).
// One browser window flips through the best of them; the address bar follows each site.
// @caps projects/websites/captures/web  @fonts projects/portfolio-reels/fonts-ai  @icon projects/websites/captures/icon-tile.png
// @face Display 800 bricolage.woff2
// @face UI 500 jakarta.woff2
// @face UI 700 jakarta.woff2
window.PRODUCT = {
  slug: 'websites',
  device: 'web',
  domain: 'retaj.vyspir.com',
  domains: { retaj: 'retaj.vyspir.com', var: 'var.vyspir.com', rawabit: 'rawabitfm.com', vyspir: 'vyspir.com', 'zera-henna': 'demo-zera-henna.vercel.app', sstech: 'sstech-jet.vercel.app', almahinazahra: 'almahinazahra.vercel.app', chefkev: 'demo-chefkev.vercel.app' },
  name: 'Websites',
  kicker: '7 client sites · 33 small-business demos',
  line: ['Forty live websites,', [['for big and small businesses.', true]]],
  pal: {
    bg: '#0B0F17', bg2: '#1A2233', ink: '#EEF1EE', title: '#FFFFFF', muted: '#9AA6B8',
    accent: '#F2B544', accentText: '#F5C566', dots: '#FFFFFF1F',
    shapes: ['#3A2C12', '#151B27', '#192131', '#F2B544'],
    shadow: 'rgba(0,0,0,.65)', rim: 'rgba(255,255,255,.2)', chromeDark: true, pillBg: '#F2B544', pillInk: '#0B0F17',
  },
  screenBg: '#0B0F17',
  strips: { retaj: { src: 'retaj_full', h: 3900 }, var: { src: 'var_full', h: 5000 } },   // heights of the captured images (capped), not of the live pages
  wall: ['retaj', 'zera-henna', 'var', 'chefkev', 'rawabit', 'marina-kitchen', 'sstech', 'cakeoholic-dubai', 'almahinazahra', 'bigbrothers-tattoo', 'vyspir', 'mrclipper-barber', 'butteredmama-bakes', 'pawpals-grooming', 'dunkndulge', 'sarah-nails'],
  hero: {
    seq: [
      { at: 9, shot: 'retaj', scroll: [0, 1400, 9.6, 10.6] },
      { at: 10.75, shot: 'var', push: true, scroll: [0, 1900, 11.2, 12.3] },
      { at: 12.5, shot: 'rawabit', push: true },
      { at: 13.75, shot: 'sstech', push: true },
      { at: 15, shot: 'zera-henna', push: true },
    ],
    say: [
      { at: 9.3, kick: 'Client sites', lines: ['Arabic and English,', [['built to convert.', true]]] },
      { at: 12.6, kick: 'Small businesses', lines: ['Bakeries, barbers, henna,', [['each one its own.', true]]] },
    ],
  },
  explode: {
    shot: 'zera-henna',
    title: ['Each one designed', [['like it’s the only one.', true]]],
    cards: [
      { x: 130, y: 300, w: 600, h: 190, r: 10, label: 'Type with character', sub: 'Not a template', side: -1 },
      { x: 905, y: 160, w: 370, h: 560, r: 18, label: 'Real photography', sub: 'From the owner’s own work', side: 1 },
      { x: 130, y: 640, w: 360, h: 50, r: 10, label: 'Book on WhatsApp', sub: 'Where their customers already are', side: -1 },
    ],
  },
  trio: ['almahinazahra', 'chefkev', 'vyspir'],
  end: { line: 'From facility management to a henna artist’s bookings.', pills: ['Next.js', 'EN / AR', 'Vercel'] },
};
