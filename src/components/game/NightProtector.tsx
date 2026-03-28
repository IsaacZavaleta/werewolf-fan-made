import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { PlayerGrid } from './PlayerGrid';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  protectorName: string;
  lastProtected: number | null;
  onConfirm: (index: number) => void;
  onSkip: () => void;
}

export function NightProtector({ players, protectorName, lastProtected, onConfirm, onSkip }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <PhaseShell
      icon="🛡️"
      label="Fase Nocturna · Protector"
      labelColor="#7aaad4"
      title="El Protector despierta"
      subtitle={`Solo ${protectorName} abre los ojos. Elige a quién proteger esta noche.`}
    >
      {lastProtected !== null && (
        <div style={{
          fontSize: '.85rem', color: 'rgba(245,230,200,.45)',
          fontStyle: 'italic',
        }}>
          No puedes repetir a <strong style={{ color: 'rgba(245,230,200,.65)' }}>
            {players[lastProtected]?.name}
          </strong> (última noche)
        </div>
      )}

      <PlayerGrid
        players={players}
        selected={selected}
        onSelect={setSelected}
        disabled={lastProtected !== null ? [lastProtected] : []}
      />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="ghost" onClick={onSkip}>No proteger esta noche</Button>
        <Button
          variant="primary"
          disabled={selected === null}
          onClick={() => selected !== null && onConfirm(selected)}
        >
          🛡️ Confirmar protección
        </Button>
      </div>
    </PhaseShell>
  );
}
