import type { RoleDef } from '../../types';
import cardImages from '../../data/cardImages';

interface Props {
  role: RoleDef;
  active: boolean;
  count: number;
  onToggle: () => void;
  onCountChange: (delta: 1 | -1) => void;
}

const groupColors: Record<string, string> = {
  wolf: '#e05555',
  special: '#7aaad4',
  neutral: 'var(--gold)',
};

export function RoleToggle({ role, active, count, onToggle, onCountChange }: Props) {
  const color = groupColors[role.group] ?? 'var(--gold)';
  const img = cardImages[role.id];

  return (
    <div style={{
      background: active
        ? `rgba(${role.group === 'wolf' ? '139,0,0' : role.group === 'special' ? '74,111,165' : '201,168,76'},.1)`
        : 'rgba(0,0,0,.5)',
      border: `1px solid ${active ? color : 'rgba(201,168,76,.18)'}`,
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'border-color .2s, background .2s',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      userSelect: 'none',
    }}>
      {/* Card image thumbnail */}
      {img && (
        <div style={{ width: '100%', height: '150px', overflow: 'hidden', flexShrink: 0 }}
          onClick={onToggle}>
          <img
            src={img} alt={role.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top',
              opacity: active ? 1 : 0.55,
              transition: 'opacity .2s',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px' }}
        onClick={onToggle}>
        {!img && <span style={{ fontSize: '1.1rem' }}>{role.icon}</span>}
        <span style={{
          fontSize: '.78rem',
          fontFamily: "'Cinzel Decorative', serif",
          flex: 1,
          color: active ? color : 'var(--moon)',
          transition: 'color .2s',
          lineHeight: 1.2,
        }}>
          {role.name}
        </span>
      </div>

      {/* Count controls — only when active */}
      {active && role.max > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 10px 10px' }}>

          {role.max > 1 && <>
            <button
              onClick={(e) => { e.stopPropagation(); onCountChange(-1); }}
              style={{
                width: '22px', height: '22px', borderRadius: '3px',
                background: 'rgba(255,255,255,.07)', border: '1px solid rgba(201,168,76,.3)',
                color: 'var(--gold)', cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, lineHeight: 1,
              }}
            >−</button>

            <span style={{
              fontFamily: "'Cinzel Decorative', serif", fontSize: '.75rem',
              color: 'var(--moon)', minWidth: '18px', textAlign: 'center', flex: 1,
            }}>
              {count}
            </span>

            <button
              onClick={(e) => { e.stopPropagation(); onCountChange(1); }}
              style={{
                width: '22px', height: '22px', borderRadius: '3px',
                background: 'rgba(255,255,255,.07)', border: '1px solid rgba(201,168,76,.3)',
                color: 'var(--gold)', cursor: 'pointer', fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, lineHeight: 1,
              }}
            >+</button>
          </>
          }
        </div>
      )}
    </div>
  );
}
