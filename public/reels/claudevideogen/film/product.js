// ClaudeVideoGen: the studio that made every film on this page. Agents run each real app, capture it, and the films are
// written as code (seek(t)), critiqued, and shipped live to the web. Frames are stills from those films.
// @caps projects/claudevideogen/captures  @fonts projects/portfolio-reels/fonts-ai  @icon projects/claudevideogen/captures/art/icon.png
// @face Display 800 bricolage.woff2
// @face UI 500 jakarta.woff2
// @face UI 700 jakarta.woff2
// @face Mono 500 JetBrainsMono-Variable-latin.woff2
window.PRODUCT = {
  slug: 'claudevideogen',
  kind: 'pipeline',
  name: 'ClaudeVideoGen',
  kicker: 'The studio behind these films',
  line: ['Real apps in,', [['product films out.', true]]],
  pal: {
    bg: '#060E18', bg2: '#13263A', ink: '#EEF1EE', title: '#FFFFFF', muted: '#9AA9BC',
    accent: '#74C69D', accentText: '#8FDDB4', line: '#FFFFFF22', card: '#FFFFFF0C', cardSolid: '#0F1E2E',
    pillBg: '#FFFFFF14', pillInk: '#EEF1EE',
  },
  open: ['f01.jpg', 'f04.jpg', 'f07.jpg', 'f10.jpg', 'f13.jpg', 'f16.jpg', 'f19.jpg', 'f22.jpg', 'f25.jpg', 'f28.jpg', 'f02.jpg', 'f05.jpg', 'f08.jpg', 'f11.jpg', 'f14.jpg', 'f17.jpg'],
  pipeTitle: ['Every film on this page', [['was made here.', true]]],
  stages: [
    { name: 'Run the app', tool: 'Playwright', art: { type: 'image', src: 'cap_nayfaat_cal1.png', caption: 'The real app, really tapped' } },
    { name: 'Capture', tool: 'agents + write guard', art: { type: 'image', src: 'captures_grid.png', caption: '340+ real screens, captured by agents' } },
    { name: 'Write the film', tool: 'code · seek(t)', art: { type: 'code', lines: ['hero: { seq: [', '  { at: 9, shot: "home" },', '  { at: 11, shot: "cal0",', '    tap: { x: 237, y: 710 } },', '  { at: 12.75, shot: "cal1" } ] }'] } },
    { name: 'Critique', tool: 'Claude', art: { type: 'frames', srcs: ['f02.jpg', 'f05.jpg', 'f08.jpg', 'f11.jpg'] } },
    { name: 'Ship', tool: 'live in the browser', art: { type: 'stat', big: true, text: '0.6 MB', sub: 'per film: code + real screens, no video' } },
  ],
  endFrames: ['f02.jpg', 'f05.jpg', 'f08.jpg', 'f11.jpg', 'f14.jpg', 'f17.jpg', 'f20.jpg', 'f23.jpg', 'f26.jpg', 'f29.jpg'],
  end: { line: 'You just scrolled through its work. The same studio can make yours.', pills: ['Claude agents', 'Playwright', 'Chromium', 'ffmpeg'] },
};
