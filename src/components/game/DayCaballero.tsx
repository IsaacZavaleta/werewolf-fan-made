import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  adjacentWolfIdx: number | null;
  onConfirm: () => void;
}

export function DayCaballero({ players, adjacentWolfIdx, onConfirm }: Props) {
  const wolf = adjacentWolfIdx !== null ? players[adjacentWolfIdx] : null;

  return (
    <PhaseShell
      icon="⚔️"
      label="El Caballero cayó"
      labelColor="var(--gold)"
      title="La espada oxidada hace efecto"
      subtitle="El Hombre Lobo más cercano al Caballero enferma de roña y cae."
    >
      {wolf ? (
        <div style={{
          background: 'rgba(139,0,0,.15)', border: '1px solid rgba(224,85,85,.3)',
          borderRadius: '8px', padding: '20px 36px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        }}>
          <div style={{ fontSize: '2.5rem' }}>⚔️🐺</div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.85rem', color: 'rgba(245,230,200,.5)' }}>
            Muere por la roña:
          </div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.1rem', color: '#e05555' }}>
            {wolf.name}
          </div>
          <div style={{ fontSize: '.8rem', color: 'rgba(245,230,200,.4)', fontStyle: 'italic' }}>
            Era un {wolf.role?.name ?? 'Lobo'} {wolf.role?.icon}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(10,6,8,.6)', border: '1px solid rgba(201,168,76,.15)',
          borderRadius: '8px', padding: '20px 32px',
          color: 'rgba(245,230,200,.5)', fontSize: '.9rem', fontStyle: 'italic',
        }}>
          No había ningún Lobo adyacente al Caballero. Nadie enferma.
        </div>
      )}

      <Button variant="primary" onClick={onConfirm}>
        Continuar al debate →
      </Button>
    </PhaseShell>
  );
}
