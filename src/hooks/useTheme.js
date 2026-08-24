import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    setIsThemeChanging(true);
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
    window.setTimeout(() => setIsThemeChanging(false), 520);
  }

  return { theme, isThemeChanging, toggleTheme };
}
