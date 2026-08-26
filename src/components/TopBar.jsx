import React from 'react';
import { Clapperboard, Moon, Sun } from 'lucide-react';

function TopBar({ theme, onToggleTheme }) {
  return (
    <header className="top-bar">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          <Clapperboard size={22} strokeWidth={2.2} />
        </span>
        <span className="brand-copy">
          <strong className="brand-name">MovieMatch</strong>
          <span className="brand-tagline">Sua próxima boa escolha</span>
        </span>
      </div>

      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        {theme === 'dark'
          ? <Sun size={18} aria-hidden="true" />
          : <Moon size={18} aria-hidden="true" />}
        <span className="toggle-label">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
      </button>
    </header>
  );
}

export default TopBar;
