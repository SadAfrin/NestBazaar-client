"use client";

import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`p-2 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all duration-200 ${className}`}
    >
      <FaSun size={16} className="theme-icon-sun" />
      <FaMoon size={16} className="theme-icon-moon" />
    </button>
  );
}
