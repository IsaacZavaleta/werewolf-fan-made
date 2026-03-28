import type { CSSProperties } from 'react';
import { SectionDivider } from '../shared/SectionDivider';
import { Card } from '../shared/Card';
import { TIPS } from '../../data/rulesData';

export function RulesTips() {
  return (
    <>
      <SectionDivider icon="🕯️" />
      <h2 style={h2}>Consejos para jugadores</h2>
      <Card>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {TIPS.map((tip, i) => (
            <li key={i} style={{ display: 'flex', gap: '14px', fontSize: '1rem', lineHeight: 1.65, color: 'rgba(245,230,200,.82)' }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, fontSize: '1.1rem', marginTop: '2px' }}>❧</span>
              {tip.text}
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

const h2: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(1.2rem, 4vw, 2rem)',
  color: 'var(--gold)', marginBottom: '20px',
};
