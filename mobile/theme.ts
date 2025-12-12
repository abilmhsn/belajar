import { MD3LightTheme } from "react-native-paper"

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#10b981",
    secondary: "#059669",
    tertiary: "#34d399",
    background: "#f0fdf4",
    surface: "#ffffff",
    error: "#ef4444",
    onPrimary: "#ffffff",
    onSecondary: "#ffffff",
    onBackground: "#1f2937",
    onSurface: "#1f2937",
  },
}

export const colors = {
  primary: "#10b981",
  primaryDark: "#059669",
  primaryLight: "#34d399",
  background: "#f0fdf4",
  surface: "#ffffff",
  text: "#1f2937",
  textSecondary: "#6b7280",
  border: "#d1d5db",
  error: "#ef4444",
  success: "#10b981",
  warning: "#f59e0b",
  info: "#3b82f6",

  // Kategori Sampah
  organik: "#f59e0b",
  plastik: "#3b82f6",
  kertas: "#8b5cf6",
  logam: "#6b7280",
  b3: "#ef4444",
  residu: "#78716c",
}
