import React from 'react';

const views = [
  { id: 'filters', label: 'Filtros' },
  { id: 'discover', label: 'Escolher' },
  { id: 'saved', label: 'Salvos' },
];

function MobileFlowNav({ activeView, onChangeView }) {
  return (
    <nav className="mobile-flow-nav" aria-label="Etapas do MovieMatch">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          className={activeView === view.id ? 'is-active' : ''}
          onClick={() => onChangeView(view.id)}
        >
          {view.label}
        </button>
      ))}
    </nav>
  );
}

export default MobileFlowNav;
