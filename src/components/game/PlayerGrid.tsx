import type { CSSProperties } from 'react';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  selected: number | null;
  onSelect: (index: number) => void;
  /** If provided, these indices cannot be selected */
  disabled?: number[];
  /** Show role badge on cards */
  showRole?: boolean;
}

export function PlayerGrid({ players, selected, onSelect, disabled = [], showRole = false }: Props) {
  return (
    <div style={grid}>
      {players.map((p) => {
        if (!p.alive) return null;
        const isDisabled = disabled.includes(p.index);
        const isSelected = selected === p.index;

        return (
          <button
            key={p.index}
            onClick={() => !isDisabled && onSelect(p.index)}
            disabled={isDisabled}
            style={{
              ...card,
              borderColor: isSelected
                ? 'var(--gold)'
                : isDisabled
                ? 'rgba(255,255,255,.05)'
                : 'rgba(201,168,76,.2)',
              background: isSelected
                ? 'rgba(201,168,76,.12)'
                : isDisabled
                ? 'rgba(255,255,255,.02)'
                : 'rgba(10,6,8,.85)',
              opacity: isDisabled ? 0.35 : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transform: isSelected ? 'translateY(-3px)' : 'none',
              boxShadow: isSelected ? '0 8px 24px rgba(201,168,76,.2)' : 'none',
            }}
          >
            <div style={avatar}>{p.name.charAt(0).toUpperCase()}</div>
            <div style={nameStyle}>{p.name}</div>
            {showRole && p.role && (
              <div style={roleTag}>{p.role.icon} {p.role.name}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
  gap: '12px',
  width: '100%',
  maxWidth: '680px',
};

const card: CSSProperties = {
  border: '1px solid',
  borderRadius: '8px',
  padding: '16px 12px',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', gap: '8px',
  fontFamily: "'Crimson Text', serif",
  transition: 'all .2s',
};

const avatar: CSSProperties = {
  width: '40px', height: '40px',
  borderRadius: '50%',
  background: 'rgba(201,168,76,.15)',
  border: '1px solid rgba(201,168,76,.3)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: '.9rem', color: 'var(--gold)',
};

const nameStyle: CSSProperties = {
  fontSize: '.95rem', color: 'var(--moon)',
  textAlign: 'center', lineHeight: 1.2,
};

const roleTag: CSSProperties = {
  fontSize: '.7rem', color: 'rgba(245,230,200,.5)',
  textAlign: 'center',
};
