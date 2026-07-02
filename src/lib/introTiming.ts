// Shared intro timeline, in seconds from first frame.
// rings (loading)  ->  revealAt  ->  disperse  ->  sphere  ->  fall  ->  ambient
export const INTRO = {
  revealAt: 2.0, // rings finish, site opens, rings burst into scatter
  disperse: 2.55, // scatter cloud reached
  sphere: 3.75, // particles collide into a sphere
  fall: 5.4, // sphere dissolves into the ambient field
} as const;

export const REVEAL_MS = INTRO.revealAt * 1000;
