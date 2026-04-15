# 🦅 PHINGO — Kurdish-to-English AI Learning App
### Master Project Plan & Progress Tracker
> **READ THIS FIRST** — Any AI agent starting a new conversation on this project must read this document in full before making any suggestions or changes. This is the single source of truth for the project vision, architecture, and progress.

---

## 🎯 Project Vision

**Phingo** is the **first AI-powered Kurdish-to-English language learning mobile app** — built for the Kurdish community (Sorani dialect). Think Duolingo, but reimagined specifically for Kurds learning real, practical English — including street slang, AI conversation roleplay, and a cultural context that Duolingo completely ignores.

### Why It Matters
- No existing app teaches English specifically for Kurdish speakers
- Duolingo Kurdish support is extremely limited
- Kurds learning English today rely on generic tools with no cultural context
- This fills a real, unserved gap in the Kurdish community

### Target Users
- Kurdish young adults (15–35) in Kurdistan Region of Iraq
- Students preparing for university or international work
- Community members wanting practical conversational English

### Deployment Goals
1. **Festival / Tech Expo** — demo-ready APK for showcasing
2. **Community distribution** — free app for Kurdish learners
3. **University graduation project** — academic documentation + working product

---

## 🏗️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Expo (managed workflow) | ~55.0.11 |
| React Native | react-native | 0.83.4 |
| React | react | 19.2.0 |
| Navigation | expo-router (file-based) | ~55.0.10 |
| Animations | react-native-reanimated | 4.2.1 |
| Animations (secondary) | react-native-ease, moti | latest |
| Gestures | react-native-gesture-handler | ~2.30.0 |
| State Management | zustand | ^5.0.12 |
| Storage (mobile) | @react-native-async-storage/async-storage | 3.0.2 |
| Graphics | @rive-app/react-native | ^0.4.0 |
| UI Icons | lucide-react-native | ^1.7.0 |
| Native Modules | react-native-nitro-modules | ^0.35.3 |
| Worklets | react-native-worklets | 0.7.2 |
| Build | EAS Build (Expo Application Services) | CLI >= 18.0 |
| Package Manager | **bun** (NOT npm/yarn) | 1.3.11 |
| Language | TypeScript | ~5.9.2 |

### Package Manager Rules
- Always use `bun add`, `bun remove`, `bun install`
- NEVER use `npm install` or `yarn add`
- `trustedDependencies` in package.json must include any native package with postinstall scripts

### Architecture Pattern
- **File-based routing** via expo-router inside `src/app/`
- **Screens** live in `src/screens/` (not directly in app/)
- **State** managed by Zustand stores in `src/stores/`
- **Custom hooks** in `src/hooks/`
- **Data / content** in `src/data/` and `src/data/units/`

---

## 🗺️ Curriculum — Current Content

**12 beginner units** (unit-00 through unit-11), each with **10 lessons x ~10 questions** = ~1,200 questions total.
Theme: **"Street English"** — practical, real-world English for daily life situations.

---

## 🎮 Game Engine — 6 Game Types

| Type | Description | Status |
|---|---|---|
| `multiple_choice` | Kurdish prompt, pick correct English answer | Built |
| `pair_match` | Match Kurdish words to English equivalents | Built |
| `sentence_builder` | Arrange English word tiles into correct sentence | Built |
| `fill_blank` | English sentence with a gap, pick the right word | Built |
| `voice` | Read a phrase, record yourself speaking | Built |
| `conversation_pick` | Social situation, pick the best English response | Built |

---

## 🌐 Kurdish Language Implementation

- **Script**: Sorani Kurdish (Arabic-based script, RTL)
- **RTL forced**: `I18nManager.forceRTL(true)` in `_layout.tsx`
- **Fonts**: 62 Rabar Kurdish TTF fonts (Rabar_011 to Rabar_072) loaded via `expo-font`
- **Font Selection**: User picks preferred font in Settings (More tab)
- **Font Persistence**: Saved to AsyncStorage on mobile, localStorage on web
- **Font Application**: `Text.defaultProps` updated globally — applies instantly to ALL screens
- **NEVER hardcode** `fontFamily: "DINNextRoundedBold"` in StyleSheet — use `useKurdishFont()` hook

---

## 🚀 Full Roadmap

### Phase 1 — Foundation (DONE - Day 1-2)
- Game engine with 6 game types
- 12 beginner curriculum units (~1,200 questions)
- Kurdish RTL + 62 font support
- Custom animated tab bar
- EAS build pipeline

### Phase 2 — Intermediate & Expert Content
- 12+ Intermediate units (travel, work, university English)
- 8+ Expert units (formal writing, presentations, idioms)
- Spaced repetition review system (SRS)
- Vocabulary tracking / personal word bank

### Phase 3 — AI Roleplay (KEY DIFFERENTIATOR)
- AI conversation partner (Gemini API)
- Scenario-based roleplays: job interview, shopping, doctor visit, airport
- AI evaluates user responses in real-time
- Kurdish explanation of why an answer is correct/incorrect

### Phase 4 — Slang & Street Dictionary
- Searchable Kurdish to English slang dictionary
- Categorized: social media slang, work slang, youth culture
- Example sentences with audio
- "Word of the Day" feature

### Phase 5 — Social & Gamification
- League system (leaderboard already scaffolded)
- Daily quests / streaks
- XP system with proper progression
- User profiles and Rive character avatars

### Phase 6 — Audio & Pronunciation
- Native speaker audio for all Kurdish prompts
- Text-to-speech for English answers
- Pronunciation scoring in VoiceGame (AI-powered)

### Phase 7 — Distribution
- Play Store submission
- App Store (iOS)
- Website landing page

---

## Key Technical Gotchas

### Bun Package Manager
- Project uses **bun**, NOT npm/yarn
- Packages with postinstall scripts MUST be in `"trustedDependencies"` in package.json
- Currently trusted: `@rive-app/react-native`, `react-native-reanimated`, `react-native-worklets`
- `@shopify/react-native-skia` was REMOVED — it was never used and caused EAS build failures

### EAS Build
- Profile `preview` generates APK for testing
- Profile `production` generates AAB for Play Store
- Project ID: `f45df7ff-4701-4664-8ff9-657886a45c18`
- Package name: `com.hewad.mubariz.duolingoclone`
- Build command: `eas build --platform android --profile preview`

### RTL / English Mix
- English text inside games must use `direction: "ltr"` as an **inline style** (not in StyleSheet — web validator rejects it)
- Example: `<View style={{ direction: "ltr" as any }}>` for English word tiles

### Lesson Navigation
- Navigate to lesson: `router.push({ pathname: "/lesson", params: { id, q, li } })`
- `id` = unit index, `q` = global dot index, `li` = lesson within unit
- Questions loaded via `getLessonQuestions(unitIndex, lessonIndex)`

---

## To-Do List

### CRITICAL — Before Any Demo
- [x] Fix EAS build (removed unused @shopify/react-native-skia)
- [x] Add trustedDependencies to package.json
- [ ] Run EAS build and verify APK installs on real device

### HIGH PRIORITY — This Week
- [x] Fix Kurdish font not applying in game screens
- [x] Create useKurdishFont hook for global font access
- [x] AsyncStorage font persistence on mobile
- [ ] Add intermediate units 12-20
- [ ] Implement global XP progression with AsyncStorage
- [ ] Add daily streak tracking

### MEDIUM PRIORITY — Next 2 Weeks
- [ ] AI Roleplay screen — Gemini API integration
- [ ] Slang Dictionary screen
- [ ] Audio playback for prompts (expo-av)
- [ ] VoiceGame — real speech recognition
- [ ] League screen with real leaderboard data
- [ ] Quest screen with daily challenges

### NICE TO HAVE — Before Submission
- [ ] Onboarding flow
- [ ] Dark mode toggle
- [ ] Offline-first architecture
- [ ] Play Store screenshots and metadata
- [ ] Privacy policy page
- [ ] Academic thesis documentation

---

## Progress Snapshot — Day 2

| Area | Done | Notes |
|---|---|---|
| Project Setup | 100% | Expo 55, RN 0.83, EAS configured |
| Navigation | 100% | 6 tabs, file-based routing |
| Game Engine | 100% | All 6 game types working |
| Beginner Curriculum | 100% | 12 units, ~1,200 questions |
| Kurdish Font System | 100% | 62 fonts, persistent, global |
| Settings Screen | 100% | Font picker with live preview |
| Home Map Screen | 90% | Works, minor polish needed |
| Custom Tab Bar | 100% | Animated bottom nav |
| RTL Support | 100% | Forced RTL, Sorani Kurdish |
| EAS Build Pipeline | 80% | Config done, APK not yet verified |
| XP / Progression | 40% | Per-question XP works, no global tracking |
| League System | 20% | Screen scaffolded, no real data |
| Quest System | 10% | Screen exists, no logic |
| AI Roleplay | 0% | Planned Phase 3 |
| Slang Dictionary | 0% | Planned Phase 4 |
| Audio/Pronunciation | 0% | Planned Phase 6 |
| Streak System | 0% | Planned |
| User Profiles | 0% | Planned |

---

## Developer

- **Name**: Abdulla
- **Project started**: April 8-9, 2026
- **Context**: Graduation project + community tool for Kurdistan Region of Iraq
- **Stack experience**: React Native, TypeScript, Expo, modern animations

---

> Last updated: April 10, 2026 — Day 2 of development
