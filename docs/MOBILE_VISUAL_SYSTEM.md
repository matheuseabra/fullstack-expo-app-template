# Mobile visual system

Daymark’s mobile app should feel like the product shown in the marketing hero: a quiet, precise task companion that gives the next action a clear place. The generated reference board lives at [`desings/daymark-mobile-screen-grid.png`](../desings/daymark-mobile-screen-grid.png).

## Look and feel

- White `#FFFFFF` is the canvas; light grey `#EEEEEF` is reserved for task inputs and quiet grouping surfaces.
- Use black `#000000` only for the primary action, active navigation state, and strong emphasis.
- Use `#0A0A0A` for primary text, `#8A8A8F` for secondary text, and `#B0B0B5` for placeholders or supporting metadata.
- Use 1px `#E8E8EA` rules to separate content. Add a soft, close shadow only when a surface needs lift.
- Use a consistent 24px corner radius for surfaces and rounded controls. Fully round pills and circles are intentional exceptions.
- Use Inter as the primary sans family, with a restrained serif accent only when needed. Use 400, 500, and 600 weights at most; headings are semibold and body copy is regular.

## Screen composition

The canonical screen is a 9:16 portrait layout with a safe-area-aware top bar, a compact page title, one calm summary surface, and a list of task rows. The Today screen follows this order:

1. Context: `Today` title, date/greeting, and a short progress summary.
2. Task list: 48–56px rows, outlined check circles, 1px dividers, and one completed state using a black filled circle.
3. Primary action: a compact black FAB opens a small bottom-sheet task composer.
4. Navigation: four equal destinations—Today, Week, Search, Settings—with the active destination black and the others muted.

Onboarding uses the same canvas with centered copy. Its first screen places the Daymark icon and name above the headline. After the three steps, a separate soft-paywall view presents the benefit bullets, a high-intent primary CTA, and a quiet Daymark Plus note marked “Coming soon”; its top-right close control leads to Today.

## Shared measurements

- Base spacing unit: 8px; preferred values are 8, 16, 24, 32, 40, and 48.
- Page horizontal inset: 24px on standard phones.
- Surface and control radius: 24px; use fully round geometry for pills and circles.
- Page title: 36/43px semibold.
- Section title: 17/23px semibold.
- Body: 16/22px regular.
- Small/helper: 12/17px regular or medium.
- Button and field label: 12/16px semibold.
- Task row minimum height: 56px.
- Touch targets: at least 44px, including icon buttons and bottom navigation.

## Native implementation

Use `apps/mobile/constants/daymark.ts` as the source of truth for native colors, spacing, radii, and type sizes. Prefer explicit `StyleSheet` values for the product surfaces so the Simulator rendering stays aligned with the web hero. Uniwind remains available for utility composition, but product-critical layout should not depend on theme defaults from a component library.

The product follows the operating-system light/dark appearance using the same neutral hierarchy. Do not introduce gradients, saturated accents, decorative illustrations, or unrelated card treatments without updating this document and the marketing hero together.
