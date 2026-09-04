export const DAYMARK_COLORS = {
  canvas: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceMuted: "#EEEEEF",
  border: "#E8E8EA",
  borderStrong: "#111111",
  text: "#0A0A0A",
  textMuted: "#8A8A8F",
  textSubtle: "#B0B0B5",
  danger: "#8A1C1C",
  black: "#000000",
  white: "#FFFFFF",
} as const;

export const DAYMARK_DARK_COLORS = {
  canvas: "#0A0A0B",
  surface: "#151516",
  surfaceMuted: "#202022",
  border: "#2D2D30",
  borderStrong: "#F5F5F5",
  text: "#F5F5F5",
  textMuted: "#9A9AA0",
  textSubtle: "#68686E",
  danger: "#F08A8A",
  black: "#F5F5F5",
  white: "#0A0A0B",
} as const;

export type DaymarkColors = { [Key in keyof typeof DAYMARK_COLORS]: string };

export const DAYMARK_FONT_FAMILY = Platform.select({ ios: "System", android: "sans-serif", default: "System" }) ?? "System";

export const DAYMARK_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const DAYMARK_RADII = {
  control: 16,
  surface: 20,
  round: 999,
} as const;

export const DAYMARK_TYPE = {
  pageTitle: { fontFamily: DAYMARK_FONT_FAMILY, fontSize: 36, lineHeight: 43, fontWeight: "600" as const },
  sectionTitle: { fontFamily: DAYMARK_FONT_FAMILY, fontSize: 17, lineHeight: 23, fontWeight: "600" as const },
  body: { fontFamily: DAYMARK_FONT_FAMILY, fontSize: 16, lineHeight: 22, fontWeight: "400" as const },
  small: { fontFamily: DAYMARK_FONT_FAMILY, fontSize: 12, lineHeight: 17, fontWeight: "400" as const },
  label: { fontFamily: DAYMARK_FONT_FAMILY, fontSize: 12, lineHeight: 16, fontWeight: "600" as const },
};
import { Platform } from "react-native";
