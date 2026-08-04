# Normal-path redesign

Duolingo-faithful redesign of the in-lesson game screens **and** the learning
path screen, matching the reference screenshots. **Scope: normal path only,
light + dark.** Street and kids are paused and their code is untouched.

Status: typecheck clean, all 79 tests pass. Not yet run on a device — see
[Needs device verification](#needs-device-verification).

---

## System colour: orange

The accent is orange (`#FF9600`), not blue. Canonical tokens live in
`lesson-light-design.ts`:

```ts
Duo.accent       // #FF9600  selection, speaker, active rails, CTAs
Duo.accentDark   // #E08600  pressed rim
Duo.accentBg     // #FFF3DE  selected tile fill
Duo.accentBorder // #FFCE7A  selected tile border
```

`Duo.blue*` still exists as an **alias of the orange values** so street/kids call
sites keep compiling without being restyled. Don't add new `blue*` usage.

Two knock-on decisions worth knowing:

- **Hearts moved orange → red** (`Duo.heart` = `#FF4B4B`). With an orange system
  accent, orange hearts stopped reading as "lives" and started reading as
  another accent element.
- **The unit banner no longer takes the section's colour.** It was cycling
  blue/purple/green per unit; it is chrome, so it now sits on the accent while
  the nodes below it keep their per-unit hues.

Note: most `L.blue` references across the codebase are **not blue** —
`HomePalette.blue` is `#0F172A`, near-black navy. Only `Duo.blue*` was a real
blue. Don't mass-replace `L.blue`.

---

## Paths: street and kids are paused

Single source of truth: **`src/constants/path-availability.ts`**

```ts
PATH_AVAILABILITY = { normal: true, street: false, kids: false }
```

To bring a path back, flip its flag. Everything else follows:

| Consumer | Behaviour when a path is off |
| --- | --- |
| `useSettingsStore` | Coerces a stale persisted `pathMode` on load, and again in `setPathMode` |
| `LearningPathScreen` | `resolvePathMode()` rewrites the active mode; paused screens never mount |
| `PathModeTabs` | Returns `null` when fewer than two paths are live |
| `OnboardingPathPicker` | Filters paused options; hides itself if fewer than two remain |

Three separate doors led into a paused path — a persisted preference, a
`?mode=street` deep link, and in-app navigation — so the coercion is applied at
each rather than at one choke point.

`PathMode` now lives in `path-availability.ts` and is re-exported from
`useSettingsStore` (the store calls `resolvePathMode` at module scope, so
importing the type from the store would close an import cycle).

### Reclaimed vertical space

With one path live there is no switcher, so `PATH_TOP_CHROME_HEIGHT` drops from
`114` to `8` — roughly one extra lesson node visible without scrolling.

---

## Nodes sit on the surface

The nodes read as flat stickers because the rim was `size * 0.09` (~6px) and the
contact shadow was a 4px line. Three changes, no colour or shape change:

1. **Rim depth `0.09` → `0.155`** (~10px at 62px) — the visible side wall.
2. **Ground shadow** — a soft ellipse at 82% of node width sitting below it.
   This is what detaches the node from the background; a deep rim without it
   just looks like a thick border.
3. **Darker rim base** (`borderBottomColor` at 22% black) so the wall reads as a
   lit surface rather than a flat band.

Press travels the full rim minus 2px, and the ground shadow **tightens rather
than vanishing** — a pressed object still touches the surface, it just casts
less.

Slot height went `96 → 104` (compact web `82 → 90`) to fit the taller node, and
`ListItem`'s centring now accounts for rim + shadow (`lessonButtonSize * 1.16`)
instead of the face alone. `path-metrics.test.ts` asserts these numbers.

---

## Old-device performance

`src/utils/native-perf.ts` resolves a device tier **once at module load** — OS
version can't change at runtime, so re-deriving per render is waste.

```
IS_LOW_END_DEVICE = Android API ≤ 28  ||  iOS ≤ 13
```

Proxies for GPU/CPU capability, not API features: Android 9 and below is
overwhelmingly 2–4 GB RAM with weak fill rate, and predates the RenderNode work
that makes layered alpha cheap.

Read these flags instead of branching on `Platform` at call sites:

| Flag | Off on low-end because |
| --- | --- |
| `FX_ALLOW_BLUR` | Gaussian blur resamples everything beneath it every frame — the most expensive effect in the app |
| `FX_ALLOW_GRADIENTS` | Cheap once, costly when many overlap in a scroller |
| `FX_ALLOW_SOFT_SHADOWS` | Android composites these on the CPU per frame in lists |
| `FX_ALLOW_DECORATION` | Sparkles, shine sweeps, ambient orbs |

`PATH_LIST_TUNING` scales the virtualization window (`initialNumToRender` 10→5,
`windowSize` 5→3). On old hardware a smaller render window beats any single
effect optimisation: fewer mounted nodes means less to measure, composite, and
retain.

Already-good news found while auditing: path nodes **already** skipped their
gradient stack on native via `isNativeNode` — the glassy layers only ever ran on
web.

---

## Bugs fixed along the way

- **`ImageMultipleChoiceGame.tsx` could not compile.** Missing `useState`,
  `useI18n`, `useTTS` declarations and a duplicated `style` prop. Pre-existing
  damage in the working tree, not introduced here.
- **Path empty-state was invisible in light mode** — hardcoded `#F8FAFC` text on
  a themed background. Now uses `colors.foreground` / `colors.mutedForeground`.
- **Section headers hardcoded** `#E2E8F0` / `#6B7280`, ignoring the theme.

Dead code found and left alone (not routed anywhere): `PhingoHomeScreen`,
`TwinoHomeScreen`, `MainDashboardScreen`, `header.tsx`,
`header-overlay-content.tsx`, `OnboardingPathPicker`. Only
`src/app/(tabs)/index.tsx` → `LearningPathScreen` is live.

---

## Lesson screens

### Where things live

| File | Role |
| --- | --- |
| `games/duo-normal.tsx` | **New.** Design + motion system for the normal path. |
| `games/lesson-light-design.ts` | `Duo` colours, `DuoMotion` springs. |
| `games/lesson-light-primitives.tsx` | Delegates to `duo-normal` on the normal path. |
| `LessonScreen.tsx` | Full-bleed sheet, correct-answer plumbing, spring progress. |

Each `Light*` primitive checks `useIsNormalPath()` and returns early; street and
kids code paths are byte-identical to before. **Adding a game screen? Call the
existing `Light*` primitives — they route themselves.**

### Motion

Tuning constants are in `DuoMotion`. Change them there, not at call sites.

| What | Behaviour | Why |
| --- | --- | --- |
| Tile press | Rim 4px→2px, face drops 2px | Top edge never moves, so it reads as a physical key. **Scale is deliberately unused** — it visibly thins borders. |
| Correct | One spring overshoot | Bounce on success reads as reward. |
| Wrong | Damped shake, 8→5→2 | Bounce on failure reads as a toy. |
| Heart spent | Squeeze, then colour drains | Two stacked SVGs cross-fading — animating an SVG `fill` isn't worklet-safe. |
| Feedback sheet | Springs in, **times** out | A spring's tail would linger over the next question. |

### The AppText trap

`AppText` runs `StyleSheet.flatten()` on its style prop, which **destroys a
Reanimated animated style** — no error, the text just freezes at its first
colour. Tile and button label colours are therefore resolved in plain JS; the
200ms surface fade underneath carries the transition. For genuinely animated
text colour, use a raw `<Animated.Text>`.

---

## RTL — Kurdish Sorani is the primary audience

`useLocaleStore.ts` calls `I18nManager.forceRTL(true)` for RTL languages, and
`app/_layout.tsx` sets `document.dir` on web. **Both platforms already mirror
`flexDirection: "row"`.**

**Do not add `row-reverse`.** It double-flips and lands back in LTR order. An
earlier draft of this work had exactly that bug.

What the engine does *not* mirror, handled by hand:

- **Physical `left`/`right`** — the bubble tail uses `bubbleTailLtr` / `bubbleTailRtl`.
- **`transform`** — the tail rotates 45° in LTR, 225° in RTL.

Layout mirrors on the **UI** language; text direction comes from the **content**
language via `AppText languageCode`. A Kurdish UI showing an English answer is
normal and both must be right.

---

## New i18n keys

Added to `en.json`, `ku.json`, `ar.json` (`es`/`ru` have no `lessons` block and
fall back to `en`):

| Key | en | ku |
| --- | --- | --- |
| `lessons.gotIt` | `GOT IT` | `تێگەیشتم` |
| `lessons.correctAnswerLabel` | `Correct Answer:` | `وەڵامی ڕاست:` |

`src/i18n/locales/*.ts` is dead code — `src/i18n/index.ts` loads the JSON.

---

## Deviations from the reference

- **CHECK button stays coral** (`PRIMARY_ACTION.face`) per instruction.
- **Feedback CONTINUE / GOT IT are green / red** as shown, so two primary-action
  colours exist in one flow. Two-line change in `DuoFeedbackPanel` to unify.
- **Status bar** untouched.
- **Share and flag icons render but have no `onPress`.** Follow-up.

---

## Onboarding

### Design system

`screens/onboarding/components/onboarding-design.ts` now carries a real scale
instead of per-file magic numbers.

**Colour.** One accent hue at two luminances, because a cream canvas cannot
carry a single orange for both jobs:

| Token | Value | Use | Contrast on canvas |
| --- | --- | --- | --- |
| `accent` | `#FF9600` | fills, dots, graphic marks | ~2.0:1 — graphics only |
| `accentInk` | `#A24E05` | any accent **type** | ~5.4:1 — AA |

`#FF9600` at 13px on `#FAF7F1` is effectively illegible. Two onboarding screens
were doing exactly that (the pet-picker eyebrow and the language step number);
both now use `accentInk`. **Do not collapse these two tokens.**

`mutedInk` also moved `#74736F` → `#6B6A66`: the old value measured 4.44:1,
just under AA for body text. It is now 5.0:1.

The accent is imported from `Duo.accent`, so onboarding and the in-app UI can
never drift apart.

**Type.** A modular scale (~1.28 per step) across five breakpoints, so the ratio
between display and body stays fixed as the screen shrinks — the page keeps its
proportions instead of getting smaller in unrelated places. Line heights are
ratios of their own size (display 1.07, body 1.45), and tracking scales with
size at `-0.022em`. The previous `letterSpacing: -1.8` was applied at every
size, which made 33px titles collide.

RTL display type is set one step smaller than Latin with looser leading:
Kurdish and Arabic glyphs carry taller ascenders and deeper descenders, so
matching Latin point sizes overflowed the Kurdish title where English fit.

**Breakpoints and spacing.** `resolveOnboardingSize()` is the single splitter
(`xs`/`sm`/`md`/`lg`/`xl`); every file previously re-derived its own
`isCompactPhone` from raw pixel comparisons and they had drifted. Spacing is a
4pt grid (`ONBOARDING_SPACE`), with gutters and hero heights per breakpoint.

### Step model — `screens/onboarding/onboarding-steps.ts`

The flow spans three components that don't import each other, and each
hardcoded `total={9}` plus its own offset into that 9. `LanguageSelectionFlow`
carried a literal `stepIndex + 3`, where `3` meant "however many slides
`OnboardingFlow` happens to have" — adding a slide would silently desync the
progress bar across two files that give no hint they're coupled.

`ONBOARDING_STEPS` is now the source of truth; every screen calls
`onboardingStepNumber()`. `onboarding-steps.test.ts` locks in the relationship
the old offset assumed.

`generating` deliberately reports the same number as `goal` — it's a transient
state, and advancing the bar to a page the user can't navigate to is a lie.

### Progress bar

Nine discrete dots became one continuous spring-filled track. Nine is past the
point where anyone counts segments, and on a 360dp screen the inter-dot gaps
consumed more width than the dots. A track answers the only question the user
has ("how much is left?") and scales to any step count.

### Fixes

- **RTL double-flip, three sites.** `languageRowRtl` / `selectionRowRtl` applied
  `row-reverse` on top of the layout engine's own mirroring — the same bug class
  as the lesson screens. Kurdish rows were rendering in LTR order. Styles
  deleted.
- **Slide order no longer alternates.** `artworkFirst` put the artwork above the
  copy on `welcome` only, so the title sat at a different height on each page
  and paging read as the layout jumping rather than content advancing.
- **`selectedPath` could persist a paused path** through onboarding and drop the
  user on a path that no longer renders. Now goes through `resolvePathMode()`.
- **Skip link** was 14px `mutedInk`. It's a real escape route, not fine print —
  now 15px at full `ink`.
- Hardcoded `#FFF7ED` selection tints replaced with `accentWash`.

---

## Needs device verification

Typecheck and tests can't catch layout.

1. **Node depth on a real screen** — the rim/shadow values are tuned by eye.
   Check they don't crowd at the top and bottom of the 104px slot.
2. **Kurdish RTL, every game** — header order, bubble tail direction, word-bank flow.
3. **SentenceBuilder fly animation.** The answer area was rewritten from a fixed
   slot grid to a wrapping row on rails; the landing target is now a zero-width
   anchor and the flying tile keeps its own width. Check where words settle,
   especially on a second row.
4. **Long words** — `fitLabel` shrink-to-fit was removed on the normal path so
   text wraps and tiles grow.
5. **Dark mode** across all ten games and the path.
6. **A real low-end Android** (API ≤ 28) — confirm the tier flags actually engage
   and the path scrolls cleanly.
7. **Onboarding on a 360dp screen and in Kurdish** — the type scale and RTL
   display sizes are tuned by measurement, not by eye. Check the Kurdish title
   doesn't overflow at `xs` and that selection rows read right-to-left.

---

## Not done

- Share / flag button behaviour.
- End-of-lesson summary still uses the old liquid-glass cards (outside the
  reference screens).
- Street and kids — paused by design.

