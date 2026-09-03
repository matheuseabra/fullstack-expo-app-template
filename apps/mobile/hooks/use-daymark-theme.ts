import { useColorScheme } from "react-native";
import { DAYMARK_COLORS, DAYMARK_DARK_COLORS, type DaymarkColors } from "@/constants/daymark";

export function useDaymarkColors(): DaymarkColors {
  return useColorScheme() === "dark" ? DAYMARK_DARK_COLORS : DAYMARK_COLORS;
}
