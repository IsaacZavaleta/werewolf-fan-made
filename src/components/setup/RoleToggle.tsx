import type { RoleDef } from '../../types';

interface Props {
  role: RoleDef;
  active: boolean;
  count: number;
  onToggle: () => void;
  onCountChange: (delta: 1 | -1) => void;
}

const groupColors: Record<string, string> = {
  wolf:    '#e05555',
  special: '#7aaad4',
  neutral: 'var(--gold)',
};

export function RoleToggle({ role, active, count, onToggle, onCountChange }: Props) {
  const color = groupColors[role.group] ?? 'var(--gold)';

  return (
    <div
      style={{
        background: active ? `rgba(${role.group === 'wolf' ? '139,0,0' : role.group === 'special' ? '74,111,165' : '201,168,76'},.1)` : 'rgba(0,0,0,.5)',
        border: `1px solid ${active ? color : 'rgba(201,168,76,.18)'}`,
        borderRadius: '5px',
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'border-color .2s, background .2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        userSelect: 'none',
      }}
    >
      {/* Header row — clicking toggles active */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={onToggle}
      >
        <span style={{ fontSize: '1.1rem' }}>{role.icon}</span>
        <span style={{
          fontSize: '.82rem',
          fontFamily: "'Cinzel Decorative', serif",
          flex: 1,
          color: active ? color : 'var(--moon)',
          transition: 'color .2s',
        }}>
          {role.name}
        </span>
      </div>

      {/* Count controls — only visible when active */}
      {active && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
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
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '.75rem',
            color: 'var(--moon)',
            minWidth: '18px',
            textAlign: 'center',
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

          <span style={{ fontSize: '.7rem', color: 'rgba(245,230,200,.4)', marginLeft: '2px' }}>×</span>
        </div>
      )}
    </div>
  );
}
