import type { CSSProperties } from 'react';

interface Props {
  icon?: string;
}

export function SectionDivider({ icon = '🌕' }: Props) {
  const lineStyle: CSSProperties = {
    flex: 1, height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: '16px', margin: '60px 0 40px',
    }}>
      <div style={lineStyle} />
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      <div style={lineStyle} />
    </div>
  );
}
