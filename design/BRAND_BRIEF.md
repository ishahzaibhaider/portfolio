# Brand brief: Shahzaib Rizvi, the second self

Extracted from discovery, 2026-07-05. Every later decision traces back to this
document. If something here is wrong, fix it here first.

## The person a visitor should meet
Someone who has clearly spent his life building. A designer-developer whose page
is indistinguishable from the work of a senior human craftsman. Four words:
**precise, priceless, expensive, royal.**

## The first five seconds
Cinema. Elements enter, align, and compose themselves like a theater opening or
a film title sequence. The visitor feels the effort and the choreography and
gets the urge to scroll. Motion is the medium of the first impression.

## The craft bar (what impresses him)
Not the AI scroll-transformation trend (seen everywhere: product assembles or
disassembles on scroll from generated video frames). What lands is the
hand-coded kind of impressive: **lighting, spatial depth, elements that move
with intent and connect to each other, sections that each mean something.**
The impressiveness must come from base craft, not borrowed effects.

## Color world
- Anchor image: **mountains at dawn.** Ink sky, slate ridges, first warm light.
  His current wallpaper; his previous one was a galaxy. Skies, depth, light.
- Three palettes he shared and likes (the common thread: deep atmospheric
  blue-family worlds with light glowing out of darkness):
  1. **Deep Sea**: #0d1b2a ink, #1b263b Prussian, #415a77 dusk, #778da9
     lavender grey, #e0e1dd alabaster. Serene power, mystery.
  2. **Electric slate**: #242C3B / #353F54 / #222834 slates with #37B6E9
     cyan and #4B4CED indigo as charged accents.
  3. **Royal Glow**: deep purples #2D005A to #9864C8 on #2B215A, ambient
     radial glows, gradient typography, soft glass, luxury-dark. Reference
     font in that system: Preahvihear.
- Banned: orange, and the REFLEX choices: default AI purple, basic blue,
  first-reach gradients. Deliberate royal purple (palette 3) is welcome.
- Light vs dark is an outcome of the design, not an upfront pick.
- His proudest palette in shipped work: Retaj's teal-cobalt glass world.

## Typography
- Never technical or precise-engineered.
- Between **handcrafted and monumental**: sculptural display letters with a
  human hand behind them. Reference: signature artists (the simple hand, the
  bold hand, the sculpted double-stroke construction).

## Personal texture
- **The cat.** He built a living lock-screen pet years ago: walks with
  attitude, yawns, stretches, cracks its back, says hi, reports notifications.
  He wants it back ONLY if it is genuinely good: "a real animated cat that
  looks really good." Approach: hand-rigged vector character, keyed walk
  cycle, spring tail/ear physics, state machine, tuned against real cat
  footage. Gets its own prototype checkpoint; ships only if it passes.
- Islamic-architecture pattern angle: REJECTED (2026-07-05). Not his idea of
  himself. Do not bring it back.
- Hand-drawn artist strokes / underlines: REJECTED. "Looks bad."
- Islamabad / Urdu / music textures: open in principle, no concrete idea yet.

## Proudest shipped aesthetics
Retaj, Inspired Analyst, DocoMedo, the AI trading agent.

## Phase 1 round 1 verdicts (2026-07-05)
- Board 01 First Light: KEPT the background and lighting. Enter motion: unsure.
  Scroll: okay. Hover: no.
- Board 02 Signal: killed entirely.
- Board 03 Royal Glow: colors and look killed. Hover (glass lifts, glow
  tightens): interesting, keep. Scroll (light follows the reader): keep.
- Companion cat idea: APPROVED.

## Round 2 palette signals (his picks that "stopped" him)
- Fresh Greens: mint through sea green to hunter, pine teal #1b4332, carbon
  black-green #081c15. Deep organic greens ending near black.
- Deep Blue Sea: twilight indigo #1d3461, dusk #1f487e, baltic #376996, blue
  grey #6290c8, steel #829cbc.
- Sunset Gradient: antique white #ffedd8, apricot #f3d5b5, tan #e7bc91, bronze
  #d4a276, camel #bc8a5f, copper #a47148 into walnut. Warm caramel gold is IN
  TASTE when earthy; the earlier orange ban was about neon/UI orange.
- Synthesis: the three are the layers of his dawn-mountain wallpaper. Working
  direction "Alpenglow": pine-carbon ground, twilight-steel sky, caramel-gold
  light.

## Phase 1 round 2 verdicts (2026-07-05, Alpenglow board)
- REJECTED hard. Never again: serif display on his name ("never in my life"),
  the gold-dawn lighting, the pine-green ground. The navy backgrounds from
  round 1 remain the only liked world.
- Color psychology matters to him: blue-family trust, but generic
  blue/white/black/orange reads as AI slop. Wants lighter colors added to the
  Deep Sea world (its own description names foggy teal and arctic white).
- He retracted the motion teardown spec: his extension inferred it from
  screenshots, never experienced it. Do not treat the lerp numbers as gospel.
  Motion gets judged by feel on prototypes.
- Round 3 method change: an interactive identity mixer (type x world x accent)
  so he assembles the combination himself instead of judging my synthesis.

## Phase 1 round 3 verdicts (2026-07-05, identity mixer)
- Type: **Bricolage Grotesque is good.** First type approval of the project.
- World: Deep Sea navy "kinda good"; he explicitly invited handcrafted
  mountains as scenery.
- Accent: lavender steel "okay, not final." Keep exploring gently.
- He wants RICHNESS: "I want things on my website. Things, scenes, story."
  Empty minimalism reads as nothing to him.
- Cadence correction from him: stop shipping fast thin artifacts; spend real
  effort deepening what he already likes. Fewer, heavier iterations.
- Response: "Scene One" vertical slice built (night mountains in Deep Sea
  navy, moon, drifting mist, Bricolage, the climb-story device, chapter one
  with real screenshots, chapter map: stores / platforms / agents / summit).

## Scene One verdicts (2026-07-05)
- Hero scene: 6.5/10, up from 3/10. Direction confirmed, push the craft.
- Chapter One as a flat section (heading + paragraph + three cards): "big fat
  no." THE LESSON: the world must never break into template sections. Once the
  site is a scene, everything stays inside the scene.
- Response ("The Climb" v2): 7 ridge layers, galaxy band, rare shooting stars,
  faint mint aurora, pointer-tilt depth on the whole scene, and the descent
  rebuilt as a continuous landscape where a trail draws itself with scroll and
  each product is a lit camp along it.

## The story device (working, pending his approval)
The site is a night climb through his five years: Scene One at the base, one
chapter per altitude (stores, platforms, agents), the summit is contact. Real
screenshots appear as artifacts lit inside the landscape.

## The hook insight (Phase 2 material)
He described an Instagram reel: "before buying property you need to know these
ten things... [pause] ...hire us, and we'll take care of the rest nine." He
loves conversion hooks with a twist. The site's narrative needs one genuine
hook device of this class, in his voice, not a generic hero headline.

## Motion bar (from a site teardown he sent)
Weighted, viscous scroll feel: lerp-chased scroll with ~0.11 damping per frame,
expo ease-out. Choreography scrubbed linearly against scroll (easing lives in
the scroll layer, not the tween). Organic light rendered on canvas/WebGL tied
to scroll progress. Layered constant-speed drift for ambient motion. Four
systems composed, not one CSS transition. He thinks in this vocabulary; motion
quality is judged at this level.

## Standing bans carried forward
Zinc-dark + ember portfolio look, Space Grotesk, template section-scroll
structure, cosmetic personalization, em-dashes in copy.
