import { useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('light');
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  function toggleTheme() {
    setIsThemeChanging(true);
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
    window.setTimeout(() => setIsThemeChanging(false), 520);
  }

  return { theme, isThemeChanging, toggleTheme };
}
