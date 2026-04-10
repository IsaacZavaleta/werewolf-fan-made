import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { RuleRole } from '../../types/rules';
import { SectionDivider } from '../shared/SectionDivider';
import { RULE_ROLES } from '../../data/rulesData';
import cardImages from '../../data/cardImages';

// Map rule role name → card id
const nameToId: Record<string, string> = {
  'Hombre Lobo':        'lobo',
  'Aldeano':            'aldeano',
  'Vidente':            'vidente',
  'Bruja':              'bruja',
  'Cazador':            'cazador',
  'Cupido':             'cupido',
  'Niña':               'ninia',
  'Protector':          'protector',
  'Padre de los Lobos': 'padre',
  'Lobo Albino':        'albino',
  'Ángel':              'angel',
  'Zorro':              'zorro',
};

const typeColors: Record<RuleRole['type'], { border: string; name: string; bg: string }> = {
  wolf:    { border: 'rgba(224,85,85,.5)',   name: '#e05555',  bg: 'rgba(139,0,0,.15)' },
  special: { border: 'rgba(122,170,212,.4)', name: '#7aaad4',  bg: 'rgba(74,111,165,.12)' },
  neutral: { border: 'rgba(201,168,76,.35)', name: 'var(--gold)', bg: 'rgba(201,168,76,.06)' },
};

function RoleCard({ role }: { role: RuleRole }) {
  const [hovered, setHovered] = useState(false);
  const roleId = nameToId[role.name];
  const img    = roleId ? (cardImages as Record<string, string>)[roleId] : undefined;
  const col    = typeColors[role.type];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '8px',
        border: `1px solid ${hovered ? col.border.replace('.5', '.9').replace('.4', '.8').replace('.35', '.7') : col.border}`,
        background: hovered ? col.bg.replace('.15', '.25').replace('.12', '.2').replace('.06', '.12') : col.bg,
        overflow: 'hidden',
        transition: 'transform .25s, border-color .25s, box-shadow .25s',
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'none',
        boxShadow: hovered ? `0 12px 32px rgba(0,0,0,.6), 0 0 20px ${col.border}` : '0 2px 8px rgba(0,0,0,.3)',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Card image */}
      <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', flexShrink: 0 }}>
        {img ? (
          <img
            src={img} alt={role.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top',
              display: 'block',
              transition: 'transform .4s',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', background: 'rgba(10,6,8,.8)',
          }}>
            {role.icon}
          </div>
        )}
      </div>

      {/* Text info */}
      <div style={{ padding: '12px 14px 14px', flex: 1 }}>
        <div style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '.78rem', color: col.name,
          marginBottom: '6px', letterSpacing: '.05em',
        }}>
          {role.icon} {role.name}
        </div>
        <div style={{
          fontSize: '.82rem', lineHeight: 1.55,
          color: 'rgba(245,230,200,.72)',
          overflow: 'hidden',
          maxHeight: hovered ? '200px' : '54px',
          transition: 'max-height .35s',
        }}>
          {role.desc}
        </div>
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
        {RULE_ROLES.map(role => (
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '20px', marginBottom: '24px',
};
