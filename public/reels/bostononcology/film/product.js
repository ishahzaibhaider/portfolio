// Boston Oncology: purchase order → goods receipt automation PoC (Next.js). Run locally on a local MongoDB with the
// repo's seed + fictional POs; four demo roles (procurement, logistics, warehouse, admin).
// @caps projects/bostononcology/captures/web  @fonts projects/bostononcology/captures/brand  @icon projects/bostononcology/captures/brand/icon-tile.png
// @face Display 800 Urbanist-Variable-latin.woff2
// @face UI 500 Urbanist-Variable-latin.woff2
// @face UI 700 Urbanist-Variable-latin.woff2
window.PRODUCT = {
  slug: 'bostononcology',
  device: 'web',
  domain: 'bostononcology.poc',
  name: 'Boston Oncology',
  kicker: 'Purchase-to-receipt automation',
  line: ['Every order, from PO', [['to goods received.', true]]],
  displayLs: -0.03,
  pal: {
    wallBg: '#D2DCEC', bg: '#EEF0F3', bg2: '#FFFFFF', ink: '#1A191C', title: '#1A191C', muted: '#5E6066',
    accent: '#0461F7', accentText: '#0350D6', dots: '#1A191C1F',
    shapes: ['#CFDFFD', '#E2E4E8', '#E7E9EC', '#34C759'],
    shadow: 'rgba(26,25,28,.24)', pillBg: '#0461F7', pillInk: '#FFFFFF',
  },
  screenBg: '#F0F0F0',
  wall: ['dash_procurement', 'po_list', 'grn_match', 'audit', 'dash_logistics', 'shipment_records', 'dash_warehouse', 'po_timeline', 'dash_admin', 'grn_history', 'po_create_filled', 'report_procurement', 'incoming', 'dash_admin_dark'],
  hero: {
    seq: [
      { at: 9, shot: 'login_roles' },
      { at: 10.5, shot: 'dash_procurement', push: true, tap: { x: 509, y: 458, w: 422, h: 48 } },
      { at: 12, shot: 'po_list', push: true },
      { at: 13.5, shot: 'grn_submit', push: true },
      { at: 15, shot: 'grn_done', tap: { x: 307, y: 846, w: 429, h: 48 } },
    ],
    say: [
      { at: 9.3, kick: 'Four roles, one order', lines: ['Procurement to', [['warehouse, in one place.', true]]] },
      { at: 12.6, kick: 'Goods receipt', lines: ['Every delivery checked', [['against its order.', true]]] },
    ],
  },
  explode: {
    shot: 'dash_procurement',
    title: ['Every handover,', [['on the audit trail.', true]]],
    cards: [
      { x: 282, y: 228, w: 252, h: 159, r: 16, label: 'Orders created', sub: 'Draft to confirmed', side: -1 },
      { x: 1156, y: 228, w: 252, h: 159, r: 16, label: 'Total value', sub: 'Live across vendors', side: 1 },
      { x: 1264, y: 141, w: 144, h: 52, r: 12, label: 'Create PO', sub: 'One form, every line item', side: -1 },
    ],
  },
  trio: ['audit', 'grn_history', 'dash_admin_dark'],
  end: { line: 'Purchase orders, shipments and receipts, audited end to end.', pills: ['4 roles', 'GRN matching', 'Audit trail'] },
};
