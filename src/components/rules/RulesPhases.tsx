import type { CSSProperties } from 'react';
import type { PhaseStep } from '../../types/rules';
import { SectionDivider } from '../shared/SectionDivider';
import { Card } from '../shared/Card';
import { PHASE_STEPS } from '../../data/rulesData';

function PhaseItem({ step, isLast }: { step: PhaseStep; isLast: boolean }) {
  const dotColor = step.isNight ? 'var(--blood)' : 'var(--gold)';
  const dotShadow = step.isNight
    ? '0 0 10px rgba(139,0,0,.6)'
    : '0 0 10px rgba(201,168,76,.5)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: '0 20px' }}>
      {/* Timeline column */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '16px', height: '16px', borderRadius: '50%',
          background: dotColor, border: '2px solid var(--dark)',
          boxShadow: dotShadow, flexShrink: 0, marginTop: '4px',
        }} />
        {!isLast && (
          <div style={{
            flex: 1, width: '2px', minHeight: '30px',
            background: 'linear-gradient(to bottom, rgba(201,168,76,.3), transparent)',
          }} />
        )}
      </div>

      {/* Content column */}
      <div style={{ paddingBottom: isLast ? 0 : '28px' }}>
        <div style={{
          fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem',
          color: step.isNight ? '#e05555' : 'var(--gold)', marginBottom: '4px',
        }}>
          {step.label}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px', color: 'var(--moon)' }}>
          {step.title}
        </div>
        <div style={{ fontSize: '.95rem', color: 'rgba(245,230,200,.75)', lineHeight: 1.65 }}>
          {step.text}
        </div>
      </div>
    </div>
  );
}

export function RulesPhases() {
  return (
    <>
      <SectionDivider icon="🌙" />
      <h2 style={h2}>Cómo se juega una ronda</h2>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PHASE_STEPS.map((step, i) => (
            <PhaseItem key={i} step={step} isLast={i === PHASE_STEPS.length - 1} />
          ))}
        </div>
      </Card>
    </>
  );
}

const h2: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(1.2rem, 4vw, 2rem)',
  color: 'var(--gold)', marginBottom: '20px',
};
