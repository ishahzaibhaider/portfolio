// History / Science Explainer: an automated YouTube channel (Shorts + a daily long compilation), GitHub Actions cron.
// No rendered video exists on the Mac, so the frames are the repo's own Remotion templates re-rendered locally with its
// built-in sample script ("Why is the Sky Blue?"). Facts on screen are the ones the repo/Actions history proves.
// @caps projects/historychannel/captures  @fonts projects/portfolio-reels/fonts-ai  @icon projects/historychannel/captures/art/icon.png
// @face Display 800 bricolage.woff2
// @face UI 500 jakarta.woff2
// @face UI 700 jakarta.woff2
// @face Mono 500 JetBrainsMono-Variable-latin.woff2
window.PRODUCT = {
  slug: 'historychannel',
  kind: 'pipeline',
  aspect: 'portrait',
  name: 'Mind Blown',
  kicker: 'History & science explainer · automated',
  line: ['A science channel', [['that makes its own videos.', true]]],
  pal: {
    bg: '#070C16', bg2: '#13213A', ink: '#EEF3FA', title: '#FFFFFF', muted: '#93A3BC',
    accent: '#F5B53D', accentText: '#F5B53D', line: '#FFFFFF22', card: '#FFFFFF0C', cardSolid: '#0F1A2E',
    pillBg: '#FFFFFF14', pillInk: '#EEF3FA',
  },
  open: ['a01_thumbnail_sky_blue.png', 'f01.jpg', 'a02_thumbnail_why_do_we_dream.png', 'f07.jpg', 'a03_thumbnail_roman_empire.png', 'f11.jpg', 'a04_thumbnail_space_silent.png', 'f06.jpg', 'a05_thumbnail_animal_never_dies.png', 'f04.jpg'],
  pipeTitle: ['A cron job wakes up,', [['a video goes live.', true]]],
  stages: [
    { name: 'Schedule', tool: 'GitHub Actions', art: { type: 'stat', big: true, text: '3 + 1', sub: 'Shorts and one long video, every day' } },
    { name: 'Topic', tool: 'TypeScript', art: { type: 'code', lines: ['{ "topics": [', '  "Why do we dream?",', '  "The quantum computer explained",', '  "Why do we have fingerprints?",', '  "Why did the Roman Empire', '    really fall?" ] }'] } },
    { name: 'Script', tool: 'GPT-4o', art: { type: 'code', lines: ['{ "type": "statistic",', '  "text": "Blue light has a', '    shorter wavelength…",', '  "statValue": "450",', '  "statLabel": "nanometers', '    wavelength" }'] } },
    { name: 'Narration', tool: 'edge-tts', art: { type: 'wave', text: 'Documentary voice, per segment' } },
    { name: 'Render', tool: 'Remotion', art: { type: 'frames', srcs: ['f01.jpg', 'f04.jpg', 'f07.jpg', 'f11.jpg'] } },
    { name: 'Publish', tool: 'YouTube Data API', art: { type: 'stat', big: true, text: '48 runs', sub: 'published on schedule, Feb–Mar 2026' } },
  ],
  endFrames: ['f01.jpg', 'f03.jpg', 'f04.jpg', 'f06.jpg', 'f07.jpg', 'f09.jpg', 'f11.jpg'],
  end: { line: '25 long videos and 23 Shorts went out on schedule, with nobody at the controls.', pills: ['GitHub Actions', 'GPT-4o', 'edge-tts', 'Remotion', 'YouTube API'] },
};
