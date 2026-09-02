export const DAYMARK_COLORS = {
  canvas: "#F7F7F7",
  surface: "#FFFFFF",
  surfaceMuted: "#F0F0F0",
  border: "#DEDEDE",
  borderStrong: "#BDBDBD",
  text: "#111111",
  textMuted: "#666666",
  textSubtle: "#888888",
  danger: "#8A1C1C",
  black: "#000000",
  white: "#FFFFFF",
} as const;

export const DAYMARK_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const DAYMARK_RADII = {
  control: 6,
  surface: 10,
  round: 999,
} as const;

export const DAYMARK_TYPE = {
  pageTitle: { fontSize: 28, lineHeight: 34, fontWeight: "600" as const },
  sectionTitle: { fontSize: 20, lineHeight: 26, fontWeight: "600" as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  small: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "600" as const },
};
