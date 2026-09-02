---
name: shared-ui
description: Extend the shared UI primitives and neutral visual language used by the web and mobile surfaces.
---

# Shared UI

Use this skill for reusable components, Tailwind tokens, component API changes, accessibility, or visual consistency across clients.

## Project conventions

- Shared primitives live in `packages/ui/src/components`; utility helpers live in `packages/ui/src/lib`.
- Keep component APIs small and composable. Prefer existing primitives before adding another abstraction.
- Follow `docs/DESIGN.md`: regular/semibold sans typography, light grey/white/black palette, restrained borders, and accessible focus states.
- Keep platform-specific behavior in the consuming app when the primitive does not need to know about the platform.

## Verification

```bash
cd packages/ui && bun run check-types
bun run check-types
```

For visual changes, inspect the affected web or native surface and verify keyboard/focus behavior where applicable.
