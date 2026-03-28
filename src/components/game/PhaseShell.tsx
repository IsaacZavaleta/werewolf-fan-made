import type { CSSProperties, ReactNode } from 'react';

interface Props {
  icon: string;
  label: string;
  labelColor?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  round?: number;
}

export function PhaseShell({ icon, label, labelColor = 'var(--gold)', title, subtitle, children, round }: Props) {
  return (
    <div style={outer}>
      {round !== undefined && (
        <div style={roundBadge}>Ronda {round}</div>
      )}
      <div style={{ fontSize: '3.5rem', marginBottom: '10px', filter: 'drop-shadow(0 0 20px rgba(201,168,76,.3))' }}>
        {icon}
      </div>
      <div style={{ ...phaseLabel, color: labelColor }}>{label}</div>
      <h2 style={titleStyle}>{title}</h2>
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      <div style={body}>{children}</div>
    </div>
  );
}

const outer: CSSProperties = {
  minHeight: '100vh',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  textAlign: 'center', padding: '40px 20px 60px',
  animation: 'fadeIn .35s ease',
};

const roundBadge: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: '.7rem', color: 'rgba(201,168,76,.45)',
  letterSpacing: '.2em', marginBottom: '16px',
};

const phaseLabel: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: '.72rem', letterSpacing: '.25em',
  textTransform: 'uppercase', marginBottom: '8px',
};

const titleStyle: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(1.3rem, 5vw, 2.2rem)',
  color: 'var(--moon)',
  marginBottom: '10px',
  lineHeight: 1.15,
};

const subtitleStyle: CSSProperties = {
  fontStyle: 'italic',
  color: 'rgba(245,230,200,.5)',
  fontSize: '1rem', maxWidth: '500px',
  lineHeight: 1.65, marginBottom: '0',
};

const body: CSSProperties = {
  marginTop: '32px',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', gap: '16px',
  width: '100%',
};
