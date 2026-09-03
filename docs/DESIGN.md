# Design system

Daymark is a quiet, white-canvas task companion. Its visual language follows the Inbox reference: large editorial headings, generous task rows, black circular controls, floating white navigation, and barely-there shadows. The interface should feel like a considered native iOS surface rather than a collection of cards.

## Principles

- Give the content room to breathe. A title, a task list, and a few controls are enough.
- Use pure white as the primary canvas; reserve pale grey for input and quiet grouping surfaces.
- Use floating controls and soft shadows to establish hierarchy instead of hard borders.
- Use black for primary emphasis and quiet grey for secondary content and inactive navigation.
- Keep screens light; gradients, textures, and saturated accents are outside the system.
- Reuse shared tokens instead of creating one-off equivalents.
- Every interactive element needs a visible focus state, a readable label, and an appropriate disabled/loading state.

## Typography

Use the native clean sans-serif stack. On iOS this resolves to San Francisco; web uses the equivalent system fallbacks. Use only regular and semibold weights in normal UI:

```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
font-weight: 400; /* regular: body, labels, controls */
font-weight: 600; /* semibold: headings, emphasis, primary actions */
```

If Inter is unavailable, the system fallback is intentional. Avoid introducing display fonts or more than these two weights.

| Role | Size / line height | Weight |
| --- | --- | --- |
| Page title | 36 / 43px | 600 |
| Section title | 17 / 23px | 600 |
| Body / task | 16 / 22px | 400 |
| Small / helper | 12 / 17px | 400 |
| Button and field label | 12 / 16px | 600 |

The Inbox reference uses a large title and large, calm task rows. Titles are not decorative marketing type: they are the primary orientation cue on each screen. Keep the system sans stack and use only regular and semibold weights.

## Color tokens

These tokens define the light theme. Use semantic names in code so the palette can evolve without rewriting components.

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#FFFFFF` | App/page background |
| `surface` | `#FFFFFF` | Cards, panels, inputs |
| `surface-muted` | `#F5F5F6` | Inputs and quiet grouping surfaces |
| `border` | `#E8E8EA` | Very light dividers only |
| `border-strong` | `#111111` | Open checkbox and focused borders |
| `text` | `#0A0A0A` | Primary content |
| `text-muted` | `#8A8A8F` | Secondary content and completed tasks |
| `text-subtle` | `#B0B0B5` | Placeholder and supporting content |
| `black` | `#000000` | Primary button or high-contrast emphasis |
| `white` | `#FFFFFF` | Text on black and surface content |

Semantic feedback colors should be muted and paired with text or icons; they are not part of the base brand palette.

## Spacing and shape

- Use a 4px base spacing unit: `4, 8, 12, 16, 24, 32, 40, 48`.
- Use 44px circular icon controls and a 68px floating navigation pill.
- Keep 24px horizontal screen gutters and generous vertical space around page titles.
- Use shadows sparingly: black at roughly 6–8% opacity, 3–5px vertical offset, and 12–16px blur.
- Use borders only for task checkboxes and quiet list dividers; do not outline every surface.

## Components

- **Icons:** the native app uses `phosphor-react-native`; the marketing site uses `@phosphor-icons/react`. Keep icons one step smaller than surrounding text, with 21–23px navigation/header icons, filled active tab variants, and a slightly heavier weight for primary actions.
- **Floating controls:** white circular back and overflow buttons, 44px square, with a soft shadow and black line icons.
- **Buttons:** black fill for the primary action, white or pale-grey surfaces for secondary controls, and text-only for tertiary actions.
- **Inputs:** pale-grey rounded field with black text and no heavy outline; the submit affordance is a small black circle.
- **Task rows:** calm rows with a 28–30px open circular checkbox, 2px black stroke, regular black text, and no card outline. Completed tasks use a black outer control with a small white center and muted grey text.
- **Navigation:** use four Expo Router bottom tabs inside one wide white rounded pill. Inactive icons are muted grey; the active icon is black. On task-oriented screens, float a single 68px black add-task FAB above the pill at the lower right.
- **Settings:** use generous grouped white controls with soft shadows, pale dividers, and right-aligned values/icons.
- **Legal links:** Terms of Service and Privacy Policy belong in a grouped Legal section and open in the system browser.
- **Onboarding:** a quiet three-step introduction uses the same canvas, centered copy and progress dots, a 64px Daymark icon above the first headline, larger centered headlines, a top-left circular chevron for Back, a full-width Continue action, and a bold “Get started” final action.
- **Color mode:** native and web surfaces follow the operating-system appearance by default. Light mode uses a white canvas and black ink; dark mode inverts the same hierarchy with a near-black canvas, soft-white ink, and restrained gray surfaces. The light and dark Daymark marks preserve the same geometry.
- **Splash:** use the light or dark Daymark app icon centered on the matching canvas background with no additional artwork or copy.
- **Loading:** use neutral skeletons or inline progress text; avoid flashing layout changes.
- **Errors:** state what happened and how to recover. Keep error styling restrained and accessible.
- **Interaction feedback:** use subtle selection/light impacts for navigation and reversible actions, a success notification for completed or created tasks and onboarding completion, and a warning notification before destructive actions. Haptics should reinforce a state change, never accompany every tap.

## Marketing parity

The marketing site is the product’s visual preview, not a separate brand system. Keep the hero phone aligned with the mobile Inbox surface:

- Use the same white canvas, black primary controls, muted grey secondary text, and soft shadows.
- Show a simple Inbox task list with circular completion controls, a floating add button, and a rounded bottom navigation pill inside the phone.
- Keep the surrounding page calm and spacious, using pale grey only for preview framing or quiet grouping.
- Use the same clean system sans stack and regular/semibold weight discipline. Marketing headings may be larger, but they should remain restrained and readable rather than decorative.

## Implementation

- Shared web primitives and tokens belong in `packages/ui`.
- Web application styles belong in `apps/web/src/index.css` and route components.
- Native styles use Uniwind utilities and `apps/mobile/global.css`.
- When a component needs a new token, add it here first, then implement it in the relevant shared style layer.
