# Twino - Architecture & Debugging Guide

## Directory Structure & Delegation Pattern
- **`src/app/`**: Expo Router routes. **Must be thin wrappers**. All business logic and UI should be delegated to screens.
- **`src/screens/`**: Main screen components (e.g., `src/screens/auth/AuthScreen.tsx`).
- **`src/stores/`**: Zustand stores. Follow simple, minimal state patterns (ponytail skill).
- **`src/types/`**: All active TypeScript interfaces and types.
- **`assets/`**: Static assets like audio, images, fonts.

## Key Native Platform Rules
- **RTL**: Right-to-Left layouts must be respected for Arabic/Kurdish locales.
- **Font Loading**: Use `useFontStore` for custom font management.
- **Android Immersive Chrome**: Support edge-to-edge screens appropriately on Android devices.

## Debugging & Verification
- **TypeScript Check**: `npx tsc --noEmit`
- **Tests**: Check test suites before finalizing changes. Ensure no regressions occur in existing screen delegation or store patterns.
