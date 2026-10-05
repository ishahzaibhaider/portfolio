// Tulip ATS: the hiring pipeline built for Ideofuzion (React + Node/Express). Front-end run locally, every /api call
// answered in the browser with invented candidates (no real people); the server's remote MongoDB was never touched.
// @caps projects/hiringpipeline/captures/web  @fonts projects/hiringpipeline/captures/brand  @icon projects/hiringpipeline/captures/brand/icon-tile.png
// @face Display 800 Nunito-Variable.woff2
// @face UI 500 Inter-Variable.woff2
// @face UI 700 Inter-Variable.woff2
window.PRODUCT = {
  slug: 'hiringpipeline',
  device: 'web',
  domain: 'tulipats.site',
  name: 'Tulip ATS',
  kicker: 'Hiring pipeline · built for Ideofuzion',
  line: ['From first touch', [['to signed hire.', true]]],
  displayLs: -0.02,
  pal: {
    wallBg: '#D3DFEE', bg: '#EEF3F9', bg2: '#FFFFFF', ink: '#29282A', title: '#29282A', muted: '#4B5563',
    accent: '#2F8CF0', accentText: '#1F78DA', dots: '#29282A1F',
    shapes: ['#CFE4FC', '#E3E8EF', '#E8ECF2', '#F87315'],
    shadow: 'rgba(41,40,42,.24)', pillBg: '#29282A', pillInk: '#FFFFFF',
  },
  screenBg: '#FFFFFF',
  wall: ['dashboard', 'pipeline', 'live_analysis', 'calendar', 'candidates', 'jobs', 'live_interview', 'candidate_profile', 'forms_jobforms', 'pipeline_moved', 'calendar_link', 'landing', 'job_detail', 'candidates_filtered'],
  hero: {
    seq: [
      { at: 9, shot: 'dashboard' },
      { at: 10.5, shot: 'pipeline', push: true },
      { at: 12, shot: 'pipeline_moved', tap: { x: 125, y: 310, w: 266, h: 174 } },
      { at: 13.5, shot: 'live_interview', push: true },
      { at: 15, shot: 'live_analysis', push: true },
    ],
    say: [
      { at: 9.3, kick: 'One funnel', lines: ['Every candidate,', [['every stage, in one view.', true]]] },
      { at: 12.6, kick: 'Live interview AI', lines: ['Interviews summarised', [['while they happen.', true]]] },
    ],
  },
  explode: {
    shot: 'dashboard',
    title: ['Hiring, measured', [['stage by stage.', true]]],
    cards: [
      { x: 112, y: 246, w: 286, h: 192, r: 16, label: 'Total candidates', sub: 'Across every open job', side: -1 },
      { x: 422, y: 246, w: 286, h: 192, r: 16, label: 'Hiring rate', sub: 'Live, not end of quarter', side: 1 },
      { x: 553, y: 592, w: 334, h: 98, r: 14, label: 'Next interview', sub: 'With its calendar link', side: -1 },
    ],
  },
  trio: ['calendar', 'candidates', 'jobs'],
  end: { line: 'Recruiting tools wired into one hiring funnel.', pills: ['Kanban pipeline', 'Calendar links', 'Interview AI'] },
};
