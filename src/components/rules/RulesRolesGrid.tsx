import type { CSSProperties } from 'react';
import type { RuleRole } from '../../types/rules';
import { SectionDivider } from '../shared/SectionDivider';
import { RULE_ROLES } from '../../data/rulesData';

const borderColors: Record<RuleRole['type'], string> = {
  wolf:    'var(--blood)',
  special: '#4a6fa5',
  neutral: '#4d7a4d',
};

const nameColors: Record<RuleRole['type'], string> = {
  wolf:    '#e05555',
  special: '#7aaad4',
  neutral: 'var(--gold)',
};

function RoleCard({ role }: { role: RuleRole }) {
  return (
    <div style={{
      background: 'rgba(10,6,8,.92)',
      borderRadius: '4px',
      padding: '22px 20px',
      borderLeft: `3px solid ${borderColors[role.type]}`,
      position: 'relative', overflow: 'hidden',
      transition: 'transform .25s, box-shadow .25s',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{role.icon}</div>
      <div style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '.85rem',
        color: nameColors[role.type],
        marginBottom: '6px',
      }}>
        {role.name}
      </div>
      <div style={{ fontSize: '.95rem', lineHeight: 1.6, color: 'rgba(245,230,200,.75)' }}>
        {role.desc}
      </div>
    </div>
  );
}

export function RulesRolesGrid() {
  return (
    <>
      <SectionDivider icon="🐺" />
      <h2 style={h2}>Roles principales</h2>
      <div style={gridStyle}>
        {RULE_ROLES.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </div>
    </>
  );
}

const h2: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(1.2rem, 4vw, 2rem)',
  color: 'var(--gold)', marginBottom: '20px',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '18px', marginBottom: '24px',
};
