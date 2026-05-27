# Duolingo Clone (Expo + React Native)

A Duolingo-inspired mobile app built with Expo, React Native, Expo Router, Uniwind, Reanimated, and SVG-based custom UI components.

## Tech Stack

- Expo + React Native
- Expo Router (file-based navigation)
- TypeScript
- Uniwind (Tailwind-style utility classes)
- React Native Reanimated
- `@legendapp/list` for performant lists
- `react-native-svg` + SVG transformer for custom icons

## Project Structure

- `src/app` - Expo Router route files
- `src/screens` - screen-level UI and logic
- `src/components` - shared/reusable components
- `src/data` - local mocked app data
- `src/constants` - icons, colors, and static constants
- `assets` - images, SVGs, and animation assets

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start Metro

```bash
npx expo start
```

### 3) Run on iOS Simulator (dev build)

```bash
npx expo run:ios
```

### 4) Run on Android Emulator (dev build)

```bash
npx expo run:android
```

## Common Commands

- `npx expo start` - start Metro bundler
- `npx expo run:ios` - build and run iOS app
- `npx expo run:android` - build and run Android app

## Notes

- This project uses custom SVG assets heavily, including tab icons, lesson icons, and reward/medal icons.
- UI behavior for lesson lists and popups is data-driven from `src/data/list-items.ts`.
- Some screens are still mock-first and evolve rapidly during UI iteration.

## Liquid home — iOS vs Android (not web)

The **Games** and **Home** dashboards share the same layout, colors, and typography on iOS and Android. The **native glass effect is not identical**:

| Platform | What you get |
|----------|----------------|
| **iOS 26+** (dev build with `expo-glass-effect`) | Native **Liquid Glass** via `GlassView` in `src/components/ui/ios-liquid-home.tsx` |
| **Android** (and older iOS) | **Frosted blur** (`expo-blur`) + light specular sheen + soft shadow — same structure, different material |

Implementation: `useNativeLiquidGlass()` is `true` only when `Platform.OS === "ios"` and `isGlassEffectAPIAvailable()` from `expo-glass-effect`. Android always uses the blur fallback so the app feels consistent without requiring iOS 26 APIs.

## Games tab

The **GAMES** tab (`src/app/feed.tsx` → `src/screens/games/GamesScreen.tsx`) lists practice mini-games and **AI Role Play**:

- **Order Words / Pair Words / Listen Up / Speak Up** — open the lesson engine at the matching question via `src/data/game-practice.ts` (`buildPracticeLessonParams`).
- **AI Role Play** — `src/app/roleplay.tsx` → `RolePlayScreen`.

Star counts and “Best: XX%” on the Games hub are **placeholder UI** until progress persistence is wired.

---

## Next conversation: build **AI Teacher** (not implemented yet)

**Do not add this screen until explicitly requested in a follow-up chat.** Use this checklist when implementing:

### Product goal

An **AI Teacher** flow that checks the learner’s English (spoken or typed), gives **IELTS-style band-style feedback** (e.g. Fluency, Lexical resource, Grammar, Pronunciation), and an overall indicative score — similar in spirit to IELTS speaking/writing rubrics, not an official IELTS product.

### Suggested route & files

1. Add `src/app/ai-teacher.tsx` (Expo Router, `href: null` in tabs like `lesson`).
2. Add `src/screens/ai-teacher/AiTeacherScreen.tsx` — light shell matching `GamesScreen` / `lesson-light-primitives` (white background, `HomeMeshBackground`, rounded cards).
3. Optional entry from **Games** tab: second row under “AI experiences” (alongside Role Play), or a banner on Home.

### UI sections (mockup-aligned)

1. **Prompt** — scenario text (“Describe your hometown…”) or free topic.
2. **Input** — reuse patterns from `VoiceGame` / roleplay for record + transcript; allow paste/type for writing mode.
3. **Submit** — primary `HomeLiquidButton`-style CTA.
4. **Results** — four criterion cards (0–9 band or 1–5 stars), short quotes from the model, overall band, “Try again” / “Save attempt”.
5. **History** (later) — list past attempts in AsyncStorage or Supabase if the project adds a backend.

### API / AI integration

- Add env: `EXPO_PUBLIC_AI_TEACHER_URL` or reuse the same provider/config as `RolePlayScreen` if one exists.
- Request body: `{ text, mode: "speaking" | "writing", promptId? }`.
- Response JSON schema, e.g. `{ overallBand, criteria: { fluency, lexical, grammar, pronunciation }, strengths[], improvements[], sampleRewrite? }`.
- Show loading skeleton; handle offline and rate limits with friendly copy.

### Implementation steps for the agent

1. Read `src/screens/roleplay/RolePlayScreen.tsx` for chat/voice patterns.
2. Read `src/screens/lesson/games/VoiceGame.tsx` for microphone UX.
3. Create types in `src/data/ai-teacher-types.ts`.
4. Build `AiTeacherScreen` with mock results first, then wire real API.
5. Add navigation from `GamesScreen` (`AI_TILES`) when ready.
6. Add unit tests or manual test plan in PR description.

### Out of scope for v1 (unless asked)

- Official IELTS branding or certificate PDFs.
- Proctoring or exam timer.
- Web-specific layouts (mobile-first only per product direction).

## Demo

[Demo Video](https://github.com/user-attachments/assets/5b4c3578-6f0c-4722-833f-722cb7078573)
