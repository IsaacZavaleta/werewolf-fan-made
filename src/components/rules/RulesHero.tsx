import type { CSSProperties } from 'react';

interface Props {
  onGoSetup: () => void;
}

export function RulesHero({ onGoSetup }: Props) {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', gap: '16px', paddingTop: '60px',
    }}>

      <h1 style={titleStyle}>
        Hombres Lobo
      </h1>
      <div style={{
        background: 'linear-gradient(135deg, rgba(26, 15, 15, 0.31) 0%, rgba(10, 6, 8, 0.33) 100%)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '10px',
        padding: '5px',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 4px 40px rgba(0,0,0,.6), inset 0 1px 0 rgba(201,168,76,0.08)',
      }}>
        <div style={subtitleStyle}>Fan made sin fines de lucro.</div>
      </div>

      <button onClick={onGoSetup} style={ctaStyle}>
        ⚔️ &nbsp; Preparar partida
      </button>

      <div style={scrollHint}>▼ &nbsp; Descubre las reglas &nbsp; ▼</div>
    </section>
  );
}

// ── Styles ────────────────────────────────────────────────────

const titleStyle: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(2rem, 7vw, 5rem)',
  fontWeight: 900, lineHeight: 1.05,
  background: 'linear-gradient(160deg, var(--gold) 0%, var(--moon) 50%, var(--gold) 100%)',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.35))',
};

const subtitleStyle: CSSProperties = {
  fontSize: '1.2rem', fontStyle: 'italic',
  color: 'rgba(245,230,200,0.65)', maxWidth: '520px',
};

const ctaStyle: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: '.85rem', padding: '14px 36px',
  borderRadius: '4px', cursor: 'pointer',
  background: 'linear-gradient(135deg, #c9a84c, #a07830)',
  color: '#0a0608', border: 'none',
  boxShadow: '0 4px 18px rgba(201,168,76,.3)',
  letterSpacing: '.1em', marginTop: '8px',
  transition: 'all .2s',
};

const scrollHint: CSSProperties = {
  marginTop: '32px', fontSize: '.8rem',
  letterSpacing: '.2em', textTransform: 'uppercase',
  color: 'rgba(201,168,76,0.5)',
  animation: 'bounce 2s infinite',
};
