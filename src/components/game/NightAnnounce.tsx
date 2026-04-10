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
      <Button variant="primary" style={{ marginTop: '8px' }} onClick={onConfirm}>
        Todos han cerrado los ojos →
      </Button>
    </PhaseShell>
  );
}
