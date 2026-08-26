import React from 'react';
import { Bookmark, SlidersHorizontal, Sparkles } from 'lucide-react';

const views = [
  { id: 'filters', label: 'Filtros', icon: SlidersHorizontal },
  { id: 'discover', label: 'Escolher', icon: Sparkles },
  { id: 'saved', label: 'Salvos', icon: Bookmark },
];

function MobileFlowNav({ activeView, onChangeView, savedCount }) {
  return (
    <nav className="mobile-flow-nav" aria-label="Etapas do MovieMatch">
      {views.map((view) => {
        const Icon = view.icon;

        return (
          <button
            key={view.id}
            type="button"
            className={activeView === view.id ? 'is-active' : ''}
            onClick={() => onChangeView(view.id)}
            aria-current={activeView === view.id ? 'page' : undefined}
            aria-controls={`${view.id}-view`}
          >
            <Icon size={20} strokeWidth={2} aria-hidden="true" />
            <span>{view.label}</span>
            {view.id === 'saved' && savedCount > 0 && (
              <span className="nav-count" aria-label={`${savedCount} conteúdos salvos`}>
                {savedCount > 99 ? '99+' : savedCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default MobileFlowNav;
