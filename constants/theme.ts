/**
 * Premium CricScore Design System
 * Curated color palette, spacing, and typography tokens
 */

import { Platform } from "react-native";

// ==================== COLOR PALETTE ====================

export const CricketColors = {
  // Primary Brand Colors
  primary: {
    50: "#E8F5EE",
    100: "#C6E6D4",
    200: "#A0D6B8",
    300: "#7AC69C",
    400: "#5DBA87",
    500: "#00A651", // Main brand green
    600: "#009548",
    700: "#00823E",
    800: "#006F34",
    900: "#004F22",
  },

  // Accent / Highlight
  accent: {
    gold: "#FFB800",
    amber: "#F59E0B",
    coral: "#FF6B6B",
    teal: "#0EA5E9",
    purple: "#8B5CF6",
    pink: "#EC4899",
  },

  // Status Colors
  status: {
    live: "#EF4444",
    liveGlow: "#FCA5A5",
    upcoming: "#3B82F6",
    completed: "#6B7280",
    won: "#10B981",
  },

  // Match Type Badge Colors
  matchType: {
    t20: "#8B5CF6",
    odi: "#3B82F6",
    test: "#DC2626",
    t10: "#F97316",
    default: "#6B7280",
  },

  // Gradient Presets
  gradients: {
    header: ["#059669", "#047857", "#065F46"] as const,
    headerDark: ["#0F172A", "#1E293B", "#334155"] as const,
    liveCard: ["#DC2626", "#EF4444"] as const,
    goldBadge: ["#F59E0B", "#D97706"] as const,
    premiumCard: ["#1E293B", "#0F172A"] as const,
    greenShine: ["#10B981", "#059669", "#047857"] as const,
  },

  // Dark Mode
  dark: {
    bg: "#0A0E17",
    card: "#111827",
    cardElevated: "#1F2937",
    surface: "#1A2332",
    border: "#1F2937",
    borderLight: "#374151",
    textPrimary: "#F9FAFB",
    textSecondary: "#9CA3AF",
    textMuted: "#6B7280",
  },

  // Light Mode
  light: {
    bg: "#F0F4F8",
    card: "#FFFFFF",
    cardElevated: "#FFFFFF",
    surface: "#F8FAFC",
    border: "#E5E7EB",
    borderLight: "#F3F4F6",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
  },
};

// Legacy exports for compatibility
const tintColorLight = "#00A651";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#111827",
    background: "#F0F4F8",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#F9FAFB",
    background: "#0A0E17",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
