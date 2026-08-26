import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');
  const [isThemeChanging, setIsThemeChanging] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#101114' : '#f2f3f5',
    );
  }, [theme]);

  function toggleTheme() {
    setIsThemeChanging(true);
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
    window.setTimeout(() => setIsThemeChanging(false), 520);
  }

  return { theme, isThemeChanging, toggleTheme };
}
