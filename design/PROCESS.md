# Portfolio design process

## Where we are (updated 2026-07-06)
The hero is FROZEN by his order: approved SVG night scene + hybrid cat
(striped Meshy cat owns the walk-in, mehbilli owns idle/jumps/head-tracking)
+ foreground ledge. The full-3D hero experiment was rejected ("flat,
colorless") and reverted; art direction beats technology; WebGL exists only
for the cat.

Forward work built since: (1) camps seated into the world (moonlight pool
above each screenshot, contact shadow below), ridge dividers between
chapters, per-chapter atmospheric tints, summit sky; (2) the story arc
closed: SummitCat.tsx puts the guide at the summit, idle and head-tracking,
lazy-mounted when the summit nears; (3) WaypointRail.tsx: fixed altitude
navigation (chapter dots + summit flag, click to jump), left margin on
desktop, right edge on mobile, hidden during the hero; (4) every chapter
header carries an altitude reading (1,100 m up to 8,849 m at the summit);
(5) all camp images now ship intrinsic width/height so the page never
layout-shifts (this also made anchor jumps land exactly).

Lesson recorded 2026-07-06: near-invisible polish (5%-alpha tints, subtle
glows) reads to him as "nothing changed". Progress must be a new visible
capability or a new part of the story, verified on both viewports.

NEXT: his review of the journey + rail + summit cat; the paw-swipe + claw
marks surprise (hand-keyed, or from optional AA clips if he ever runs
cat-for-animation/amber2-upload.glb); then commit and push under his name
and deploy.

## Earlier status (2026-07-05)
Phases 0 and 1 are done: identity converged on Deep Sea navy, handcrafted
mountains, Bricolage Grotesque, lavender steel provisional. "The Climb" is
built in the repo as the real site: Scene, Journey with self-drawing trail,
four chapters, Summit. Hero last scored 6.5/10.

## The road to finalized
1. Shahzaib walks the built site (npm run dev) and scores it: the scene, the
   descent, each chapter, the words. Refinements happen per his notes.
2. The cat guide prototype: hand-rigged walk cycle, own checkpoint. If it
   passes, it becomes the guide that walks the trail ahead of the visitor.
3. Feel-tuning session: entrance timing, parallax weight, mist, scroll feel,
   judged live by hand, not by spec.
4. Decisions still open: final accent (lavender steel is provisional), mobile
   trail treatment, store links for live apps, sustained-cinema pass so the
   scene never goes static.
5. Finalize: commit under his name (never a Claude co-author), push, deploy
   on Vercel.


The portfolio is Shahzaib's second self. It gets built the way a designer builds:
identity first, structure second, pixels last. Each phase ends with an artifact
Shahzaib approves before the next phase starts. No phase is skipped, no phase is
rushed into code.

## Phase 0: Discovery (now)
Deep questions about taste, identity, references, and feeling. Output: a filled
`BRAND_BRIEF.md` that every later decision traces back to.

## Phase 1: Brand identity
Three genuinely different identity directions, presented as visual boards
(palette, type pairing, texture, motion language, sample composition). Not
descriptions. Shahzaib reacts, we iterate until one direction feels like him.
Output: one approved identity board + design tokens.

## Phase 2: Sitemap and story
What a visitor goes through from first paint to contact: the narrative, the
pages or spaces, what each moment is for. Output: an approved sitemap and
content outline.

## Phase 3: Design before code
Key screens designed as images or Figma frames in the approved identity,
reviewed and revised as designs. Code starts only when a screen is approved.
Output: approved designs for hero plus two key sections.

## Phase 4: Build in slices
One section at a time, each built to match its approved design, reviewed in the
browser, tuned until it feels right. Weeks, not hours.

## Phase 5: Polish pass
Motion feel, loading, responsiveness, accessibility, performance, SEO.

## Standing rules learned so far
- The zinc-dark + ember-orange theme, Space Grotesk, and the standard
  dark-portfolio presentation are rejected. Do not reuse them by default.
- Structure novelty without identity is theatre. Identity comes first.
- Real product imagery stays central: the work is the strongest asset.
- No em-dashes in any copy.
