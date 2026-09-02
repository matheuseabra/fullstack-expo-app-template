# Mobile visual system

Daymark’s mobile app should feel like the product shown in the marketing hero: a quiet, precise task companion that gives the next action a clear place. The generated reference board lives at [`desings/daymark-mobile-screen-grid.png`](../desings/daymark-mobile-screen-grid.png).

## Look and feel

- Light grey `#F7F7F7` is the canvas; white `#FFFFFF` is reserved for task surfaces and controls.
- Use black `#000000` only for the primary action, active navigation state, and strong emphasis.
- Use `#111111` for primary text, `#666666` for secondary text, and `#888888` for placeholders or supporting metadata.
- Use 1px `#DEDEDE` rules to separate content. Add a soft, close shadow only when a surface needs lift.
- Keep corners restrained: 6px for compact controls and 10px for larger surfaces. Avoid pill-shaped decoration except for circular task marks.
- Use the system sans-serif with regular and semibold weights only. Headings are semibold; body copy and supporting labels are regular.

## Screen composition

The canonical screen is a 9:16 portrait layout with a safe-area-aware top bar, a compact brand mark, a page title, one calm summary surface, and a list of task rows. The Today screen follows this order:

1. Brand row: `daymark` wordmark at left and a quiet menu affordance at right.
2. Context: `Today` title, date/greeting, and a short progress summary.
3. Task list: 48–56px rows, outlined check circles, 1px dividers, and one completed state using a black filled circle.
4. Primary action: full-width black `Add a task` control near the lower content edge.
5. Navigation: four equal destinations—Today, Week, Tasks, Settings—with the active destination black and the others muted.

## Shared measurements

- Base spacing unit: 4px; preferred values are 4, 8, 12, 16, 24, and 32.
- Page horizontal inset: 24px on standard phones.
- Page title: 28/34px semibold.
- Section title: 20/26px semibold.
- Body: 15/22px regular.
- Small/helper: 13/18px regular.
- Button and field label: 14/20px semibold.
- Task row minimum height: 56px.
- Touch targets: at least 44px, including icon buttons and bottom navigation.

## Native implementation

Use `apps/mobile/constants/daymark.ts` as the source of truth for native colors, spacing, radii, and type sizes. Prefer explicit `StyleSheet` values for the product surfaces so the Simulator rendering stays aligned with the web hero. Uniwind remains available for utility composition, but product-critical layout should not depend on theme defaults from a component library.

The product is intentionally light-only for this first cohesive pass. Do not introduce gradients, saturated accents, dark-mode-only variants, decorative illustrations, or unrelated card treatments without updating this document and the marketing hero together.
