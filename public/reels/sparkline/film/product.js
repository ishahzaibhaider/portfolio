// Sparkline: campus events pinned to a live map, with realtime chat (iOS + Android). Real app, web-exported; every backend
// call answered in the browser with an invented campus (real FSU places, fictional people).
// @caps projects/sparkline/captures/en  @fonts projects/sparkline/captures/brand  @icon projects/sparkline/captures/brand/app-icon-1024.png
// @face Display 800 Manrope_800ExtraBold.woff2
// @face UI 500 Manrope_500Medium.woff2
// @face UI 700 Manrope_700Bold.woff2
window.PRODUCT = {
  slug: 'sparkline',
  name: 'Sparkline',
  kicker: 'iOS · Android · campus life',
  line: ['Campus events,', [['pinned to a live map.', true]]],
  displayLs: -0.03,
  pal: {
    bg: '#EAF0FB', bg2: '#FFFFFF', ink: '#1F1F1F', title: '#1F1F1F', muted: '#5F6672',
    accent: '#0564F9', accentText: '#0451CC', dots: '#1F1F1F1F',
    shapes: ['#C9DBFD', '#DCE4F2', '#E1E8F4', '#22C55E'],
    shadow: 'rgba(31,31,31,.26)', pillBg: '#0564F9', pillInk: '#FFFFFF',
  },
  screenBg: '#FFFFFF',
  wall: ['s01_map', 's04_feed', 's10_chat', 'd01_map', 's03_event_detail', 's15_profile', 's09_chats', 'd02_feed', 's08_detail_joined', 's17_create_filled', 's18_notifications', 'd03_chat', 's14_dm_thread', 's05_filter'],
  hero: {
    seq: [
      { at: 9, shot: 's01_map' },
      { at: 10.5, shot: 's02_map_pin', tap: { x: 253, y: 401, w: 40, h: 40 } },
      { at: 12, shot: 's03_event_detail', push: true, tap: { x: 172, y: 809, w: 96, h: 18 } },
      { at: 13.5, shot: 's11_chat_typing', push: true },
      { at: 15, shot: 's12_chat_sent', tap: { x: 373, y: 864, w: 40, h: 40 } },
    ],
    say: [
      { at: 9.3, kick: 'What’s on tonight', lines: ['Every campus event,', [['on one map.', true]]] },
      { at: 12.6, kick: 'Realtime', lines: ['Join it, and the chat', [['is already going.', true]]] },
    ],
  },
  explode: {
    shot: 's01_map',
    title: ['Your campus,', [['live right now.', true]]],
    cards: [
      { x: 253, y: 401, w: 40, h: 40, r: 20, label: 'Sunset Pickup Soccer', sub: 'Happening now', side: -1 },
      { x: 325, y: 385, w: 40, h: 40, r: 20, label: 'Open Mic at the Union', sub: 'Tonight', side: 1 },
      { x: 189, y: 376, w: 40, h: 40, r: 20, label: 'Hack the Hills', sub: '24-hour hackathon', side: -1 },
    ],
  },
  trio: ['d01_map', 's04_feed', 's15_profile'],
  end: { line: 'Find the people doing what you love, nearby.', pills: ['iOS', 'Android', 'Realtime chat'] },
};
