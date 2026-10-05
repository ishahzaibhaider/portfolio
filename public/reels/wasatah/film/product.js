// Wasatah: a blockchain + AI-inspired real-estate proof of concept for Saudi Arabia (verified identity, offers, deed
// transfer on a ledger). The PoC runs fully in the browser on its own fictional seed data; verification is simulated.
// @caps projects/wasatah/captures/web  @fonts projects/wasatah/captures/brand  @icon projects/wasatah/captures/brand/icon-tile.png
// @face Display 800 Inter-latin-var-300-900.woff2
// @face UI 500 Inter-latin-var-300-900.woff2
// @face UI 700 Inter-latin-var-300-900.woff2
window.PRODUCT = {
  slug: 'wasatah',
  device: 'web',
  domain: 'wasatah.app',
  name: 'Wasatah',
  kicker: 'Real estate · blockchain · proof of concept',
  line: ['Saudi property deals,', [['verified on a ledger.', true]]],
  displayLs: -0.035,
  pal: {
    wallBg: '#D3D7EE', bg: '#EEF0F8', bg2: '#FFFFFF', ink: '#0F172A', title: '#0F172A', muted: '#64748B',
    accent: '#4F46E5', accentText: '#4338CA', dots: '#0F172A1F',
    shapes: ['#D8D5FB', '#E1E4F0', '#E6E8F2', '#EAB308'],
    shadow: 'rgba(15,23,42,.24)', pillBg: '#4F46E5', pillInk: '#FFFFFF',
  },
  screenBg: '#F8FAFC',
  wall: ['buyer', 'explorer_transfer', 'role', 'kyc_review', 'seller', 'broker_kpis', 'kyc_face', 'about_zk', 'seller_history', 'broker_security', 'landing', 'buyer_offer', 'explorer', 'kyc_documents'],
  hero: {
    seq: [
      { at: 9, shot: 'kyc_review' },
      { at: 10.5, shot: 'role', push: true },
      { at: 11.75, shot: 'buyer', push: true, tap: { x: 209, y: 747, w: 281, h: 48 } },
      { at: 13.25, shot: 'buyer_offer' },
      { at: 14.75, shot: 'buyer_offer_locked', tap: { x: 948, y: 562, w: 291, h: 44 } },
    ],
    say: [
      { at: 9.3, kick: 'Identity first', lines: ['Every party,', [['verified before a deal.', true]]] },
      { at: 12.6, kick: 'Buyer · seller · broker', lines: ['Offers, signed', [['and on the record.', true]]] },
    ],
  },
  explode: {
    shot: 'buyer',
    title: ['Deeds, identities and offers,', [['all verifiable.', true]]],
    cards: [
      { x: 176, y: 197, w: 715, h: 501, r: 18, label: 'SAR 2,800,000', sub: 'One listing, one verified deed', side: -1 },
      { x: 201, y: 302, w: 378, h: 20, r: 8, label: 'Deed · ZKP · Low risk', sub: 'Checks shown on every listing', side: 1 },
    ],
  },
  trio: ['explorer_transfer', 'broker_security', 'seller_accepted'],
  end: { line: 'An investor-ready proof of concept, built in two weeks.', pills: ['Ledger explorer', 'KYC', 'Risk flags'] },
};
