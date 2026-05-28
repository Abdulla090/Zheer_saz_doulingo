# Duolingo Clone (Expo + React Native)

**UI gallery (all screens):** [open gallery](https://raw.githack.com/Abdulla090/Zheer_saz_doulingo/main/artifacts/screenshots/index.html) · [markdown version](UI_GALLERY.md)

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
- `npm run verify` - pre-release checks (routes, security, native perf flags)
- `npm run build:apk` - EAS cloud APK (`preview` profile) — requires `eas login` or `EXPO_TOKEN`

## Production readiness

See **[PRODUCTION.md](./PRODUCTION.md)** for the full store checklist.

- Shop/subscriptions are **hidden** until IAP is added (`src/constants/feature-flags.ts`).
- Legal: **Settings → Privacy Policy / AI & practice info / Terms** (also `docs/PRIVACY.md` for hosting).
- Progress is saved on-device (`useProgressStore`).

## Release verification

Before shipping, run:

```bash
npm run verify
```

This checks:

- All Expo Router screens exist (`index`, `dashboard`, `feed`, `lesson`, `roleplay`, `ai-teacher`, …)
- Tab bar hides on modal routes (`lesson`, `roleplay`, `ai-teacher`, …)
- AI Teacher API URL must be **HTTPS**; answers capped at 4000 chars
- Android path optimizations (`LessonPathIcons`, no `AnimatedG` in path buttons)

## EAS Android APK (cloud)

Project ID: `57df22e9-341f-4e45-a08d-fb5ca28d69c5` (in `app.json`).

**Option A — local / CI with token**

1. Create an [Expo access token](https://expo.dev/accounts/settings#access-tokens).
2. `export EXPO_TOKEN=your_token` (PowerShell: `$env:EXPO_TOKEN="your_token"`).
3. `npm ci && npm run verify && npm run build:apk`

**Option B — GitHub Actions**

1. Add repository secret `EXPO_TOKEN` with your Expo token.
2. Run workflow **EAS Android APK** (`.github/workflows/eas-android-apk.yml`) or push to `main` / `cursor/phingo-home-dashboard-bb74`.
3. Download the APK from the [Expo builds dashboard](https://expo.dev/accounts/abdulla001/projects/duolingo-clone/builds).

Profiles in `eas.json`:

- `preview` — internal APK (`buildType: apk`)
- `production` — store-ready APK

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

Implementation: `useNativeLiquidGlass()` is `true` only when `Platform.OS === "ios"` and `isGlassEffectAPIAvailable()` from `expo-glass-effect`. On Android, home cards use a **lightweight frosted surface** (solid glass + sheen, no `BlurView`) for smoother scrolling while keeping the liquid look. iOS keeps native glass or blur.

### Native performance (Android / iOS)

- Path lesson nodes use **Lucide overlays** instead of nested SVG imports (`LessonPathIcons`) — fixes white/missing icons on Android release APKs.
- `SvgButton` animates with `Animated.View` (not `AnimatedG` inside SVG).
- `removeClippedSubviews` is **iOS-only** on path lists (`PATH_LIST_REMOVE_CLIPPED` in `src/utils/native-perf.ts`).
- Lesson games skip `BlurView` (`USE_GAME_BLUR = false` in `game-design.ts`).

## Games tab

The **GAMES** tab (`src/app/feed.tsx` → `src/screens/games/GamesScreen.tsx`) lists practice mini-games and **AI Role Play**:

- **Order Words / Pair Words / Listen Up / Speak Up** — open the lesson engine at the matching question via `src/data/game-practice.ts` (`buildPracticeLessonParams`).
- **AI Teacher** — `src/app/ai-teacher.tsx` → `AiTeacherScreen` (IELTS-style indicative bands).
- **AI Role Play** — `src/app/roleplay.tsx` → `RolePlayScreen`.

Star counts and “Best: XX%” on the Games hub are **placeholder UI** until progress persistence is wired.

### AI Teacher

- Route: `/ai-teacher` (also linked from **Games → AI experiences**).
- Mock scoring: `src/services/ai-teacher-service.ts` (set `EXPO_PUBLIC_AI_TEACHER_URL` for a real API).
- Last saved attempt stored in AsyncStorage key `phingo.ai-teacher.last-attempt`.
- Screenshot demo results: `/ai-teacher?demo=results`.

## Demo

[Demo Video](https://github.com/user-attachments/assets/5b4c3578-6f0c-4722-833f-722cb7078573)
