# Portfolio design process

## Where we are (updated 2026-07-06: the film era)
The site is now a scroll-scrubbed film trilogy of HIM. He generated three
10s 1080p Veo 3 clips himself (his face, real Amber, our navy night world
with green aurora), dropped them in `genereated scenes/`, and the build
turned them into the site:
- Pipeline: ffmpeg delogo (Veo sparkle at x1580,y735,w225,h175) -> 10fps
  PNG -> sharp -> webp frames in public/film/{arrival,builder,closer}/{d,m}
  (d=1280w ~14MB total, m=640w ~4.6MB, lazy per section).
- Engine: src/components/film/FilmSection.tsx — tall section + sticky
  full-viewport canvas, scroll progress -> lerped frame index (0.38
  catch-up), cover-fit with per-clip focalX, wave loading (poster,
  keyframes, trickle) with nearest-loaded fallback, reduced-motion holds
  the settled last frame, grain + vignette treatment.
- Acts: HeroFilm (320vh, name tracks in letter by letter, clears as he
  sits, caption "He builds. She supervises."), StatsStrip (count-up
  receipts), BuilderFilm (300vh, three pillars over the film), Work (the
  one-screen index + stage archive, unchanged), CloserFilm (300vh, id
  #contact, title card clears by p=.85, settle = him + Amber + live CTAs),
  footer. Nav "Start a project" is now a direct mailto.
- Retired from render, kept on disk: Scene.tsx (SVG night hero),
  CatGuide.tsx, Journey.tsx, WaypointRail.tsx, SummitCat.tsx, Contact.tsx.
- Known blemishes for his review: faint delogo smear on rocks at the
  right edge in some frames; the laptop has an Apple logo (his generation,
  he may not care); 640w mobile frames are slightly soft on high-dpr
  phones.
NEXT: his review pass of the film site, then commit and push under his
name and deploy.

## Earlier status (2026-07-05: the journey was retired)
His verdict on the chapter-scroll journey: "It's my own portfolio and I
myself don't wanna see it." Diagnosis he was right about: 8,000px of forced
linear scroll, alternating left/right cards with no system, mountaineering
copy that served the metaphor instead of the visitor ("the next flag up
here is yours" means nothing to a founder). Research agreed: hiring-side
visitors skim in under two minutes; long storytelling case studies are a
documented portfolio killer; the current high-end pattern for a large body
of work is a dense work index with instant hover preview on a sticky stage.

Built to replace it (2026-07-05): the site is now three beats, ~3,200px
total instead of ~8,000+.
1. The hero (frozen, untouched): night scene + hybrid cat.
2. Work.tsx: "Seventy shipped. Fourteen up close." All fourteen products in
   one index (three groups: In the stores / Platforms / Agents), each row
   name + meta. Hover or focus a row and the product appears instantly on a
   settled sticky stage (phones staged center, wide shots as billboards,
   products without screenshots as big-number outcome cards: 4,000+
   appointments, Zero hands, 100+). Pointer tilt on the stage. Mobile:
   each group is a swipeable snap shelf of cards.
3. Contact.tsx: plain language ("Have something to build?"), same three
   CTAs, footer. No summit poetry.
Journey.tsx / WaypointRail.tsx / SummitCat.tsx are unreferenced (kept on
disk until the new direction is approved, then delete).

## Previous state (2026-07-06, superseded same week)
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
