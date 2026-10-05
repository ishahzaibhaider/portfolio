// AiEpisode: an AI pipeline that writes, draws, animates and voices character-consistent episodes (BOBO & SHROOMI).
// Every artefact is real: frames from the 5 finished renders (10.2 min total), the character sheets, a keyframe,
// verbatim script/QC excerpts (captures/script.json). Claims kept to what the repo proves (see captures/NOTES.md).
// @caps projects/aiepisode/captures  @fonts projects/portfolio-reels/fonts-ai  @icon projects/aiepisode/captures/art/icon.png
// @face Display 800 bricolage.woff2
// @face UI 500 jakarta.woff2
// @face UI 700 jakarta.woff2
// @face Mono 500 JetBrainsMono-Variable-latin.woff2
window.PRODUCT = {
  slug: 'aiepisode',
  kind: 'pipeline',
  name: 'AiEpisode',
  kicker: 'AI pipeline · animated episodes',
  line: ['Characters that stay themselves,', [['shot after shot.', true]]],
  pal: {
    bg: '#0D0E1F', bg2: '#221C47', ink: '#F4F2FF', title: '#FFFFFF', muted: '#A7A4C9',
    accent: '#FFC531', accentText: '#FFC531', line: '#FFFFFF24', card: '#FFFFFF0D', cardSolid: '#17163A',
    pillBg: '#FFFFFF14', pillInk: '#F4F2FF',
  },
  open: ['f01.jpg', 'f09.jpg', 'f19.jpg', 'f13.jpg', 'f25.jpg', 'f06.jpg', 'f17.jpg', 'f22.jpg', 'f07.jpg', 'f26.jpg', 'f15.jpg', 'f10.jpg', 'f18.jpg', 'f03.jpg', 'f24.jpg', 'f16.jpg'],
  pipeTitle: ['From a line of lore', [['to a finished episode.', true]]],
  stages: [
    { name: 'Script', tool: 'Claude', art: { type: 'code', lines: ['{ "location": "Forest path",', '  "time_of_day": "dawn",', '  "action": "BOBO gently pulls', '    SHROOMI back.",', '  "dialogue": [{ "speaker": "BOBO",', '    "line": "Stay close." }] }'] } },
    { name: 'Characters', tool: 'reference sheets', art: { type: 'image', src: 'a01_shroomi_sheet.png', caption: '7 characters, one sheet each' } },
    { name: 'Keyframe', tool: 'gpt-image-1', art: { type: 'image', src: 'a11_keyframe_whispering_shadows_shot001.png', caption: 'First frame, drawn from the sheets' } },
    { name: 'Vision QC', tool: 'GPT-4o vision', art: { type: 'score', text: '8–10 / 10', sub: 'Character match on every keyframe. Below 7, it redraws.' } },
    { name: 'Animate', tool: 'Kling v3', art: { type: 'frames', srcs: ['f19.jpg', 'f20.jpg', 'f22.jpg', 'f24.jpg'] } },
    { name: 'Voices + mix', tool: 'ElevenLabs · ffmpeg', art: { type: 'wave', text: 'BOBO: “Stay close.”' } },
  ],
  endFrames: ['f01.jpg', 'f09.jpg', 'f13.jpg', 'f17.jpg', 'f19.jpg', 'f25.jpg', 'f27.jpg'],
  end: { line: '26-shot episodes, written, drawn, animated and voiced by the pipeline. 10 minutes rendered so far.', pills: ['Claude', 'gpt-image-1', 'Kling', 'ElevenLabs', 'ffmpeg'] },
};
