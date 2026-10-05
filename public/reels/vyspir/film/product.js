// Vyspir: the product studio's own site (dark home hub, light product spokes). Captured from the newest working tree.
// @caps projects/vyspir/captures/web  @fonts projects/vyspir/captures/brand  @icon projects/vyspir/captures/brand/icon-tile.png
// @face Display 600 Geist-Variable.woff2
// @face UI 500 Geist-Variable.woff2
// @face UI 700 Geist-Variable.woff2
window.PRODUCT = {
  slug: 'vyspir',
  device: 'web',
  domain: 'vyspir.com',
  name: 'Vyspir',
  kicker: 'Product studio · Riyadh',
  line: ['Your idea,', [['shipped as a real product.', true]]],
  displayWeight: 600, displayLs: -0.04,
  // home hub: black, one signal orange
  pal: {
    bg: '#0A0A0A', bg2: '#21130B', ink: '#F2F2F2', title: '#FFFFFF', muted: '#8F8F8F',
    accent: '#FF5C1A', accentText: '#FF7A42', dots: '#FFFFFF1F',
    shapes: ['#5A2610', '#171717', '#1C1C1C', '#FF5C1A'],
    shadow: 'rgba(0,0,0,.7)', rim: 'rgba(255,255,255,.18)', chromeDark: true, pillBg: '#FF5C1A', pillInk: '#0A0A0A',
  },
  screenBg: '#000000',
  wall: ['home_hero', 'uniramp', 'home_work_2', 'apps', 'var', 'home_capabilities', 'arab_btc', 'home_work_3', 'home_cta', 'uniramp_features', 'lang_ar', 'home_approach', 'apps_row2', 'var_features'],
  hero: {
    seq: [
      { at: 9, shot: 'home_hero' },
      { at: 10.5, shot: 'home_work_1', push: true },
      { at: 11.75, shot: 'home_work_2' },
      { at: 13, shot: 'home_work_3' },
      { at: 14.5, shot: 'uniramp', push: true },
    ],
    say: [
      { at: 9.3, kick: 'The studio site', lines: ['A dark hub,', [['a page per product.', true]]] },
      { at: 12.6, kick: 'The work', lines: ['Ten products,', [['live and in hands.', true]]] },
    ],
  },
  explode: {
    shot: 'home_capabilities',
    title: ['A studio that ships', [['products people use.', true]]],
    cards: [
      { x: 48, y: 156, w: 420, h: 144, r: 12, label: 'What we do', sub: 'Product and web3 engineering', side: -1 },
      { x: 48, y: 380, w: 1344, h: 177, r: 14, label: 'The numbers', sub: 'As the studio states them', side: 1 },
    ],
  },
  trio: ['uniramp', 'var', 'apps'],
  end: { line: 'Arabic and English, dark hub, light product pages.', pills: ['Next.js', 'EN / AR', 'Product spokes'] },
};
