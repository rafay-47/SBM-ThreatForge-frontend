export const electricViolet = {
  50: "#f5f3ff",
  100: "#ede9fe",
  200: "#ddd6fe",
  300: "#c4b5fd",
  400: "#a78bfa",
  500: "#8b5cf6",
  600: "#7c3aed",
  700: "#6d28d9",
  800: "#5b21b6",
  900: "#4c1d95",
  950: "#2e1065",
};

export const brandColors = {
  primary: electricViolet[600],
  secondary: electricViolet[500],
  hover: electricViolet[700],
  active: electricViolet[800],
};

export const themeColors = {
  dark: {
    background: "#1D1D20",
    surface: "#18191B",
    elevated: "#141836",
    text: "#FFFFFF",
    mutedText: "#A1A1AA",
    border: "rgba(255,255,255,0.08)",
    input: "#111111",
    hover: "rgba(255,255,255,0.06)",
    sidebar: "#16171A",
    sidebarForeground: "#F8FAFC",
    sidebarMuted: "#A1A1AA",
    sidebarAccent: "rgba(139,92,246,0.14)",
    sidebarAccentForeground: "#EDE9FE",
    sidebarPrimary: "#7c3aed",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarBorder: "rgba(255,255,255,0.08)",
    sidebarRing: "rgba(139,92,246,0.35)",
  },
  light: {
    background: "#F5F5F4",
    surface: "#FFFFFF",
    elevated: "#FFFFFF",
    text: "#111111",
    mutedText: "#475569",
    border: "#E5E7EB",
    input: "#FFFFFF",
    hover: "rgba(15,23,42,0.04)",
    sidebar: "#FFFFFF",
    sidebarForeground: "#0F172A",
    sidebarMuted: "#64748B",
    sidebarAccent: "rgba(124,58,237,0.10)",
    sidebarAccentForeground: "#4C1D95",
    sidebarPrimary: "#7c3aed",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarBorder: "#E5E7EB",
    sidebarRing: "rgba(124,58,237,0.35)",
  },
};

export const gradients = {
  brand: `linear-gradient(90deg, ${brandColors.primary}, ${brandColors.secondary}, ${brandColors.primary})`,
  hero: "linear-gradient(180deg, #0a0c1f, #141836)",
  content: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(109,40,217,0.9))",
  button: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`,
  buttonHover: `linear-gradient(135deg, ${brandColors.hover}, ${brandColors.primary})`,
};

export const shadows = {
  card: "0 12px 40px rgba(0,0,0,0.35)",
  cardLight: "0 12px 30px rgba(15,23,42,0.08)",
  glow: "0 0 80px rgba(124,58,237,0.24)",
  button: "0 10px 24px rgba(124,58,237,0.35)",
};

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

export const typography = {
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyMono: "Avenue Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};
