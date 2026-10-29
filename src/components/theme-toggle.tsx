"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0c0d0c" : "#f8f6f1");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("carnet-theme");
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
        applyTheme(saved);
      }
    } catch {
      // The dark default still works when browser storage is unavailable.
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try { localStorage.setItem("carnet-theme", next); } catch { /* Keep the current page usable. */ }
  }

  return (
    <button type="button" onClick={toggleTheme} className="theme-toggle min-h-10 rounded-lg border border-line bg-surface px-3 text-xs font-medium text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      <span aria-hidden="true" className="mr-2">{theme === "dark" ? "☼" : "◐"}</span>
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
