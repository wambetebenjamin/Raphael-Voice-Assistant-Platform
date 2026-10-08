# Reduced-motion fallbacks — all 31 effects

Every animated effect in this build is switched off, frozen or restructured when the visitor
sets **prefers-reduced-motion: reduce**. Nothing decorative keeps moving, no parallax or
auto-advancing content remains, and no information is lost — the static state always carries
the same meaning as the animation.

CSS fallbacks live in one place: [`app/effects.css`](../app/effects.css), block
`@media (prefers-reduced-motion: reduce)`. JS fallbacks use
[`useReducedMotion()`](../lib/voice/useReducedMotion.ts) (SSR-safe, via `useSyncExternalStore`).

| # | Effect | Where | Fallback under reduced motion |
|---|---|---|---|
| 01 | WebGL audio waveform sphere | Hero (`WaveformSphere.tsx`) | Three.js never initialises; a static SVG sphere poster is rendered instead. Canvas hidden by CSS as a second guard. |
| 02 | Pinned scrollytelling (4 beats) | `Scrollytelling.tsx` | Pin removed (`position: static`), beats become a plain stacked article, the sr-only scroll markers are removed, progress rail hidden, and the beat micro-verse is not spoken. |
| 03 | Voice demo bay / WebXR | `VoiceDemo.tsx` | No motion is core here: opt-in prompt, text-command fallback and the immutable Exit control all remain. Immersive overlay renders without transitions. |
| 04 | Headline per-letter stagger + “Voice” glitch | `Headline.tsx` / CSS | Letters render fully visible with no stagger; the glitch pass and its pseudo-elements are disabled (`content: none`). |
| 05 | Live usage board pulses | `LiveBoard.tsx` | Coloured dots stop pulsing (static dots); counts continue to update as text. |
| 06 | Ambient sound-wave particles | `AmbientParticles.tsx` | Single frozen frame drawn once, opacity lowered; the rAF loop never starts. |
| 07 | Looping line-art waveform | Gallery card 1 | Translation animation off → static waveform frame. |
| 08 | Self-drawing RAPHAEL wordmark | Preloader, navbar, gallery card 2, footer | Paths are measured but drawn instantly (`stroke-dashoffset: 0`, no transition) — the mark is simply present. |
| 09 | Morphing mic → ear → bubble | Gallery card 3 | JS morph loop disabled; the three shapes crossfade by opacity instead (matched points are kept). |
| 10 | Logo replay-on-click | Navbar | Click still navigates home; the draw replay is instant rather than animated. |
| 11 | Nav icon hover/focus/click motion | Navbar | Icon transforms and the click “pop” are disabled; colour and background changes remain (they are the actual state cues). |
| 12 | Pricing motion states | `PricingSection.tsx` | Hover/active transforms removed; colour, focus ring and `aria-pressed` states remain at 0ms. |
| 13 | Robot mascot reaction | Gallery card 4, CTA band | Arm wave and eye shift disabled → static pose. |
| 14 | Faux-3D phone tilt | Gallery card 5 | Layer transforms removed (`transform: none`) → flat stacked illustration. |
| 15 | Command rail scroll-snap | `CommandRail.tsx` | Rail becomes a plain responsive grid; `scroll-snap-type: none`; arrow-key navigation still works. |
| 16 | Mixed-media collage grain/parallax | Gallery card 6 | Card lift on hover removed; the image, wave vector and grain render as a static composition. |
| 17 | Liquid blob transition | Gallery card 7, 404 page | Blobs stay in their resting positions (no re-shaping transition). |
| 18 | Animated gradient backdrop | Hero, page headers | Animation stopped at a fixed background-position. |
| 19 | Isometric ecosystem assembly | Gallery card 8 | Tiles render immediately in the fully assembled state. |
| 20 | Rail card hover motion | `CommandRail.tsx` | Card hover transform removed; focus outline unchanged. |
| 21 | Hand-drawn doodle strokes | Gallery card 9, mobile menu | Dash offset animation off → static doodle. |
| 22 | Preloader progress easing | `Preloader.tsx` | Progress bar width transition removed; the numeric percentage still updates. |
| 23 | Sequenced hero entrance | `Hero.tsx` | All entrance elements are visible immediately at their final position (CTA focusable at first paint either way). |
| 24 | Demo bay overlays | `VoiceDemo.tsx` | Immersive overlay appears/disappears instantly. |
| 25 | Waveform preloader bars | `Preloader.tsx` | Three pulsing bars hidden; the plain percentage text and progress rail remain (never a blank screen). |
| 26 | Neumorphic pressed-state animation | `NeumorphicCluster.tsx` | Press states apply instantly (shadow swap) with no transition; controls unchanged functionally. |
| 27 | Live waveform display | `NeumorphicCluster.tsx` | Bars are drawn at a fixed low amplitude instead of reacting to audio. |
| 28 | Glassmorphic nav blur transition | `Navbar.tsx` / CSS | Transition removed; the opaque/solid fallback background is used, so blur is never animated (blur itself stays ≤ 20px). |
| 29 | Claymorphic press deformation | Pricing buttons | Deformation animation removed; button states remain distinguishable by shadow and label. |
| 30 | Flipbook page flip | `DevApiSection.tsx` | Page turn is instant with no 3D rotation; page numbers are still announced. |
| 31 | Stop-motion sprite (10fps) | Gallery card 10 | Animation stopped on the first sprite frame — a static level meter. |

## Verification

```bash
# DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion: reduce
npm run dev
```

Checklist used during review: no element moves on its own; the preloader still communicates
progress; the hero CTA is focusable immediately; the scrollytelling article reads top-to-bottom
without a pinned stage; every gallery card still communicates its feature.

## Notes

- Voice **output** is not motion: speech synthesis is unaffected by this media query, so
  visually impaired users keep audio feedback.
- The `.scrolly-markers` spacer elements and the sticky offsets are removed under reduced
  motion so no empty scroll regions remain.
- `useTabVisible()` pauses the sphere and particle rAF loops whenever the tab is hidden,
  independent of the user's motion preference.
