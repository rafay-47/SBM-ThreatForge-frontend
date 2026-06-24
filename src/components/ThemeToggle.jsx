import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { colorMode, effectiveTheme, setThemeMode } = useTheme();

  const cycleTheme = () => {
    const nextMode =
      colorMode === "system" ? effectiveTheme : colorMode === "dark" ? "light" : "dark";
    setThemeMode(nextMode);
  };

  const getLabel = () => {
    if (colorMode === "system") return "System theme";
    return colorMode === "dark" ? "Dark theme" : "Light theme";
  };

  const Icon = colorMode === "system" ? Monitor : colorMode === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={cycleTheme}
      aria-label={`Switch theme. Current mode: ${getLabel()}`}
      title={`Theme: ${getLabel()}`}
    >
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
      <span className="theme-toggle__label">{getLabel()}</span>
    </button>
  );
};

export default ThemeToggle;
