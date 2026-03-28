import type { CSSProperties } from 'react';
import { Button } from '../shared/Button';
import type { Screen } from '../../types';

interface Props {
  onNext: (s: Screen) => void;
  onGoRules: () => void;
}

export function LandingScreen({ onNext, onGoRules }: Props) {
  return (
    <div style={container}>
      <div style={eyebrow}>🐺 Hombres Lobo de Castronegro</div>

      <h1 style={titleStyle}>Preparar Partida</h1>

      <p style={subtitleStyle}>Configura y reparte roles al instante</p>

      <Button
        variant="primary"
        style={{ fontSize: '1rem', padding: '16px 48px' }}
        onClick={() => onNext('setup-players')}
      >
        ⚔️ &nbsp; Comenzar configuración
      </Button>

      <Button
        variant="ghost"
        style={{ marginTop: '12px', fontSize: '.8rem', opacity: .6 }}
        onClick={onGoRules}
      >
        ← Ver reglas del juego
      </Button>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────

const container: CSSProperties = {
  minHeight: '100vh',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  textAlign: 'center', padding: '40px 20px',
  animation: 'fadeIn .4s ease',
  gap: '8px',
};

const eyebrow: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(.65rem, 2vw, .9rem)',
  color: 'var(--gold)', letterSpacing: '.2em',
  opacity: .6, marginBottom: '8px',
};

const titleStyle: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(1.4rem, 5vw, 2.8rem)',
  background: 'linear-gradient(160deg, var(--gold), var(--moon), var(--gold))',
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  filter: 'drop-shadow(0 0 20px rgba(201,168,76,.3))',
  marginBottom: '6px',
};

const subtitleStyle: CSSProperties = {
  fontStyle: 'italic', color: 'rgba(245,230,200,.5)',
  fontSize: '1rem', marginBottom: '24px',
};
