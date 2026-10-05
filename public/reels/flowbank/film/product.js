// FlowBank: a visual workflow builder for bank operations. Local production build with the repo's fictional seeded bank.
// @caps projects/flowbank/captures/web  @fonts projects/flowbank/captures/brand  @icon projects/flowbank/captures/brand/icon-tile.png
// @face Display 700 BricolageGrotesque-Variable-latin.woff2
// @face UI 500 Inter-Variable-latin.woff2
// @face UI 700 Inter-Variable-latin.woff2
window.PRODUCT = {
  slug: 'flowbank',
  device: 'web',
  domain: 'flowbank.app',
  name: 'FlowBank',
  kicker: 'Workflow automation for banks',
  line: ['The operating layer', [['for bank operations.', true]]],
  displayWeight: 700, displayLs: -0.03,
  // the console's own 'Parchment & Gold' theme
  pal: {
    bg: '#F2EFE7', bg2: '#FFFDF8', ink: '#201F1B', title: '#201F1B', muted: '#585C64',
    accent: '#8A682B', accentText: '#8A682B', dots: '#201F1B22',
    shapes: ['#E8D9B8', '#E5E0D3', '#EBE6DA', '#9E7834'],
    shadow: 'rgba(32,31,27,.28)', pillBg: '#201F1B', pillInk: '#F2EFE7',
  },
  screenBg: '#F5F3ED',
  wall: ['canvas_mid', 'dashboard', 'approvals', 'workflows', 'run_live', 'bank_ledger', 'node_config', 'canvas_dark', 'runs_list', 'run_detail', 'canvas_overview', 'bank_customers', 'run_waiting_end', 'editor'],
  hero: {
    seq: [
      { at: 9, shot: 'workflows' },
      { at: 10.5, shot: 'editor', push: true, tap: { x: 1041.3, y: 88, w: 374.7, h: 256.8 } },
      { at: 12, shot: 'run_launcher', tap: { x: 1355.6, y: 15.5, w: 68.4, h: 32 } },
      { at: 13.25, shot: 'run_live', tap: { x: 456, y: 315.4, w: 528, h: 93.6 } },
      { at: 14.75, shot: 'run_waiting_end' },
    ],
    say: [
      { at: 9.3, kick: 'Five processes, ready to run', lines: ['Bank processes,', [['drawn on a canvas.', true]]] },
      { at: 12.6, kick: 'High-value wire transfer', lines: ['It runs every step,', [['then waits for four eyes.', true]]] },
    ],
  },
  explode: {
    shot: 'dashboard',
    title: ['Straight-through,', [['with controls a regulator knows.', true]]],
    cards: [
      { x: 651, y: 88, w: 179, h: 151, r: 14, label: 'Straight-through rate', sub: 'Routine cases never touch a desk', side: -1 },
      { x: 260, y: 259, w: 375, h: 276, r: 16, label: 'Runs by status', sub: 'Every process, live', side: -1 },
      { x: 1041, y: 259, w: 375, h: 276, r: 16, label: 'Throughput', sub: 'Automation, measured', side: 1 },
    ],
  },
  trio: ['node_config', 'approvals', 'bank_ledger'],
  end: { line: 'Banking processes, built and run in one place.', pills: ['Workflow canvas', 'Approvals', 'Audit trail'] },
};
