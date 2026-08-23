import React from 'react';

function TopBar({ theme, onToggleTheme }) {
  return (
    <header className="top-bar">
      <div>
        <span className="brand-mark">MM</span>
        <span className="brand-name">MovieMatch</span>
      </div>

      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        <span className="toggle-track" aria-hidden="true">
          <span className="toggle-thumb" />
        </span>
        <span className="toggle-label">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
      </button>
    </header>
  );
}

export default TopBar;
