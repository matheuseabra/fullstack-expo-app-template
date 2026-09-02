---
name: expo-mobile
description: Build and maintain the Expo Router mobile app, native auth flow, Uniwind styling, and iOS simulator workflow in apps/mobile.
---

# Expo mobile

Use this skill for changes under `apps/mobile` or when a task involves Expo, React Native, Expo Router, Uniwind, or the iOS simulator.

## Project conventions

- Screens and layouts live under `apps/mobile/app` and follow Expo Router file-based routing.
- Native API calls use `apps/mobile/utils/orpc.ts`; Better Auth uses `apps/mobile/lib/auth-client.ts` with SecureStore.
- `EXPO_PUBLIC_SERVER_URL` is public client configuration and belongs in `apps/mobile/.env`.
- Reuse existing Uniwind utilities and shared primitives where possible. Follow `DESIGN.md` for new visual work.
- Treat `ios/`, `android/`, `.expo/`, `expo-env.d.ts`, and generated Uniwind types as generated or local output.

## Commands

```bash
bun run dev:native -- --ios
cd apps/mobile && bun run check-types
```

The iOS command starts Metro and opens the available simulator. Run `bun run dev:server` separately when the screen needs the API. Use `expo prebuild` or `expo run:ios` only when a task specifically requires a native project or development build.

## Guardrails

- Do not put server secrets in `EXPO_PUBLIC_*` variables.
- Keep client/server calls typed through the shared API router.
- Preserve the existing auth cookie/storage behavior when changing request code.
- Check both iOS simulator behavior and the mobile type check for navigation or native API changes.
