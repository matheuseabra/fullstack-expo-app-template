# Design system

This project uses a quiet, neutral interface: light grey page surfaces, white content surfaces, black primary text, and restrained borders. The visual system should feel clear and dependable before it feels decorative.

## Principles

- Prefer hierarchy, spacing, and typography over ornament.
- Use the smallest visual treatment that communicates state or action.
- Keep screens light by default; do not introduce gradients, textures, or saturated accent palettes without a product reason.
- Reuse shared UI primitives and tokens instead of creating one-off equivalents.
- Every interactive element needs a visible focus state, a readable label, and an appropriate disabled/loading state.

## Typography

Use a clean sans-serif stack with only two weights in normal UI:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
font-weight: 400; /* regular: body, labels, controls */
font-weight: 600; /* semibold: headings, emphasis, primary actions */
```

If Inter is unavailable, the system fallback is intentional. Avoid introducing display fonts or more than these two weights.

| Role | Size / line height | Weight |
| --- | --- | --- |
| Page title | 28 / 34px | 600 |
| Section title | 20 / 26px | 600 |
| Body | 15 / 22px | 400 |
| Small / helper | 13 / 18px | 400 |
| Button and field label | 14 / 20px | 600 |

## Color tokens

These tokens define the light theme. Use semantic names in code so the palette can evolve without rewriting components.

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#F7F7F7` | App/page background |
| `surface` | `#FFFFFF` | Cards, panels, inputs |
| `surface-muted` | `#F0F0F0` | Secondary fills and selected neutral states |
| `border` | `#DEDEDE` | Dividers and control borders |
| `border-strong` | `#BDBDBD` | Focused or emphasized borders |
| `text` | `#111111` | Primary content |
| `text-muted` | `#666666` | Secondary content |
| `text-subtle` | `#888888` | Placeholder and supporting content |
| `black` | `#000000` | Primary button or high-contrast emphasis |
| `white` | `#FFFFFF` | Text on black and surface content |

Semantic feedback colors should be muted and paired with text or icons; they are not part of the base brand palette.

## Spacing and shape

- Use a 4px base spacing unit: `4, 8, 12, 16, 24, 32, 48`.
- Use `6px` for compact controls and `10px` for cards or larger surfaces.
- Use a 1px border before adding a shadow.
- Keep shadows soft and close to the surface: `0 1px 2px rgb(0 0 0 / 6%)`.
- Keep content widths readable; avoid full-bleed text blocks on desktop.

## Components

- **Buttons:** black fill for the primary action, white surface with border for secondary, text-only for tertiary.
- **Inputs:** white surface, neutral border, black text, explicit label, and a strong black focus ring or border.
- **Cards:** white surface on `canvas`, subtle border, consistent internal padding.
- **Navigation:** use text hierarchy and spacing; reserve filled treatment for the active destination.
- **Loading:** use neutral skeletons or inline progress text; avoid flashing layout changes.
- **Errors:** state what happened and how to recover. Keep error styling restrained and accessible.

## Implementation

- Shared web primitives and tokens belong in `packages/ui`.
- Web application styles belong in `apps/web/src/index.css` and route components.
- Native styles use Uniwind utilities and `apps/mobile/global.css`.
- When a component needs a new token, add it here first, then implement it in the relevant shared style layer.
