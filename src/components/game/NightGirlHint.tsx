import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';

interface Props {
  girlName: string;
  onConfirm: () => void;
}

export function NightGirlHint({ girlName, onConfirm }: Props) {
  return (
    <PhaseShell
      icon="👧"
      label="Primera Noche · La Niña"
      labelColor="#7aaad4"
      title="Recordatorio a la Niña"
      subtitle={`Solo el narrador lee esto en voz baja a ${girlName}`}
    >
      <div style={{
        background: 'rgba(74,111,165,.08)',
        border: '1px solid rgba(122,170,212,.25)',
        borderRadius: '8px',
        padding: '24px 32px',
        maxWidth: '460px',
        lineHeight: 1.8,
        fontSize: '1rem',
        color: 'rgba(245,230,200,.8)',
        textAlign: 'left',
      }}>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: '#7aaad4', marginBottom: '12px' }}>
          👧 Para: {girlName}
        </div>
        <p style={{ margin: 0 }}>
          Cuando los Hombres Lobo se despierten, <strong>puedes entreabrír los ojos muy discretamente</strong> para intentar verlos.
          <br /><br />
          Si te descubren, morirás en silencio esa misma noche en lugar de la víctima elegida.
          <br /><br />
          <em>Procede con cautela.</em>
        </p>
      </div>

      <Button variant="primary" onClick={onConfirm}>
        Continuar → Turno de los Lobos
      </Button>
    </PhaseShell>
  );
}
