import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * ThemeSwitcher
 * Toggles between light/dark/clinical themes by adding classes to document.documentElement.
 * Persists selection in localStorage.
 *
 * Tailwind should have darkMode: 'class' configured.
 */
const THEMES = {
  dark: 'dark',       // your default Neon dark theme
  light: 'light',     // light
  clinical: 'clinical' // an alternate clinical theme (you can style via CSS)
};

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(localStorage.getItem('ui_theme') || 'dark');

  useEffect(() => {
    const el = document.documentElement;
    // remove all theme classes then add
    Object.values(THEMES).forEach((t) => el.classList.remove(t));
    el.classList.add(THEMES[theme] || THEMES.dark);
    localStorage.setItem('ui_theme', theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme((s) => (s === 'dark' ? 'light' : 'dark'))}
        title="Toggle Light/Dark"
        className="p-2 rounded-md bg-slate-900/30 border border-cyan-500/10 hover:bg-slate-900/50"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4 text-cyan-300" /> : <Moon className="w-4 h-4 text-cyan-700" />}
      </button>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="text-xs bg-transparent border border-cyan-500/10 rounded px-2 py-1"
      >
        <option value="dark">Neon (Dark)</option>
        <option value="clinical">Clinical</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
}