import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';

interface Props {
  round: number;
  onConfirm: () => void;
}

export function NightAnnounce({ round, onConfirm }: Props) {
  return (
    <PhaseShell
      icon="🌑"
      label="Fase Nocturna"
      labelColor="#9b59b6"
      title={round === 1 ? 'Comienza la primera noche' : `Noche ${round}`}
      subtitle="El pueblo duerme. Nadie puede hablar ni abrir los ojos."
      round={round}
    >
      <div style={{
        background: 'rgba(0,0,0,.5)',
        border: '1px solid rgba(150,100,200,.2)',
        borderRadius: '8px',
        padding: '24px 32px',
        maxWidth: '460px',
        fontStyle: 'italic',
        color: 'rgba(245,230,200,.65)',
        lineHeight: 1.8,
        fontSize: '1rem',
      }}>
        🎙️ <em>"Castronegro se sumerge en la oscuridad. Que todos cierren los ojos y bajen la cabeza."</em>
      </div>

      <Button variant="primary" style={{ marginTop: '8px' }} onClick={onConfirm}>
        Todos han cerrado los ojos →
      </Button>
    </PhaseShell>
  );
}
