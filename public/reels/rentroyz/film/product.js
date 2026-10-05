// RentRoyz: property management in Saudi Arabia (leasing, furnishing, Airbnb), plus its inspection portal with owner approvals.
// Site browsed locally; the portal runs on a local mock with fictional owners (the real backup holds real owners).
// @caps projects/rentroyz/captures/web  @fonts projects/rentroyz/captures/brand  @icon projects/rentroyz/captures/brand/icon-tile.png
// @face Display 600 space-grotesk-variable-latin.woff2
// @face UI 500 inter-variable-latin.woff2
// @face UI 700 inter-variable-latin.woff2
window.PRODUCT = {
  slug: 'rentroyz',
  device: 'web',
  domain: 'rentroyz.com',
  name: 'RentRoyz',
  kicker: 'Property management · Saudi Arabia',
  line: ['Leasing, furnishing and Airbnb,', [['run end to end.', true]]],
  displayWeight: 600, displayLs: -0.03,
  // brand guideline p31: dark green teal, deep teal, warm sand, burnt orange
  pal: {
    bg: '#0F1F24', bg2: '#1C383D', ink: '#E4E0D8', title: '#F3EFE9', muted: '#A9A69F',
    accent: '#C46237', accentText: '#E3804F', dots: '#D3CDC333',
    shapes: ['#2C5256', '#1C3539', '#22393D', '#C46237'],
    shadow: 'rgba(0,0,0,.55)', rim: 'rgba(211,205,195,.28)', chromeDark: true, pillBg: '#C46237', pillInk: '#0F1F24',
  },
  screenBg: '#163035',
  wall: ['site_hero', 'portal_dashboard', 'site_estimate_result', 'portal_report_maint', 'site_ownerapp', 'portal_owner', 'site_how', 'portal_report_summary', 'site_about', 'portal_apartment', 'site_faq_open', 'portal_owner_approved', 'site_operations', 'site_evaluate'],
  hero: {
    seq: [
      { at: 9, shot: 'site_hero' },
      { at: 10.5, shot: 'site_estimate', push: true, tap: { x: 64, y: 428, w: 200, h: 40 } },
      { at: 12, shot: 'site_estimate_result', tap: { x: 249, y: 709, w: 280, h: 56 } },
      { at: 13.5, shot: 'portal_owner_decision', push: true },
      { at: 14.9, shot: 'portal_owner_approved', tap: { x: 391, y: 694.8, w: 145, h: 37.5 } },
    ],
    say: [
      { at: 9.3, kick: 'For property owners', lines: ['We manage.', [['You earn.', true]]] },
      { at: 12.6, kick: 'Inspection portal', lines: ['Repairs priced,', [['owner approves.', true]]] },
    ],
  },
  explode: {
    shot: 'portal_owner_decision',
    title: ['Inspections become', [['owner approvals.', true]]],
    cards: [
      { x: 375, y: 523.1, w: 690, h: 247.6, r: 16, label: 'SAR 10,340 estimate', sub: 'Furniture and repairs, itemised', side: -1 },
      { x: 391, y: 694.8, w: 145, h: 37.5, r: 10, label: 'Approve', sub: 'The owner decides, in writing', side: 1 },
    ],
  },
  trio: ['portal_dashboard', 'site_ownerapp', 'portal_report_maint'],
  end: { line: 'We manage. You earn.', pills: ['Website', 'Inspection portal', 'Owner app'] },
};
