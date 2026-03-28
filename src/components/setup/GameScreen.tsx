import { Button } from '../shared/Button';

interface Props {
  onRestart: () => void;
}

export function GameScreen({ onRestart }: Props) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px 20px',
      animation: 'fadeIn .4s ease',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'pulse 2s infinite' }}>
        🌕
      </div>
      <div style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 'clamp(1.4rem, 5vw, 2.4rem)',
        color: 'var(--gold)',
        marginBottom: '12px',
      }}>
        ¡La partida comienza!
      </div>
      <p style={{
        fontStyle: 'italic',
        color: 'rgba(245,230,200,.6)',
        maxWidth: '420px',
        lineHeight: 1.7,
        fontSize: '1rem',
      }}>
        Que caiga la oscuridad sobre Castronegro.<br />
        Narrador, es tu turno de dar las instrucciones.
      </p>
      <Button
        variant="ghost"
        style={{ marginTop: '40px' }}
        onClick={onRestart}
      >
        ↺ Nueva partida
      </Button>
    </div>
  );
}
