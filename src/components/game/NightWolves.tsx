import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { PlayerGrid } from './PlayerGrid';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  round: number;
  onConfirm: (victimIndex: number) => void;
}

export function NightWolves({ players, round, onConfirm }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const wolves = players.filter(p => p.alive && p.role?.group === 'wolf');
  const wolfIndices = wolves.map(p => p.index);

  return (
    <PhaseShell
      icon="🐺"
      label="Fase Nocturna · Lobos"
      labelColor="#e05555"
      title="Los Hombres Lobo se despiertan"
      subtitle="Solo los lobos abren los ojos. Elijan en silencio a su víctima."
      round={round}
    >
      {/* Remind who the wolves are */}
      <div style={{
        background: 'rgba(139,0,0,.15)',
        border: '1px solid rgba(224,85,85,.2)',
        borderRadius: '8px',
        padding: '14px 24px',
        maxWidth: '460px',
        fontSize: '.9rem',
        color: 'rgba(245,230,200,.7)',
      }}>
        🐺 <strong style={{ color: '#e05555' }}>Lobos esta noche:</strong>{' '}
        {wolves.length > 0
          ? wolves.length
          : <em>ninguno vivo</em>}
      </div>

      <p style={{ color: 'rgba(245,230,200,.55)', fontSize: '.9rem', margin: 0 }}>
        Selecciona la víctima elegida por los lobos:
      </p>

      <PlayerGrid
        players={players}
        selected={selected}
        onSelect={setSelected}
        disabled={wolfIndices}
      />

      <Button
        variant="danger"
        disabled={selected === null}
        style={{ marginTop: '8px' }}
        onClick={() => selected !== null && onConfirm(selected)}
      >
        🐺 Confirmar víctima
      </Button>
    </PhaseShell>
  );
}
