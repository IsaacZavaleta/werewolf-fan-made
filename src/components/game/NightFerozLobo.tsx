import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { PlayerGrid } from './PlayerGrid';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  wolfVictim: number | null;
  onConfirm: (idx: number | null) => void;
  onSkip: () => void;
}

export function NightFerozLobo({ players, wolfVictim, onConfirm }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  // Feroz can't pick the same victim already chosen (already handled, but mark it)
  const disabled = wolfVictim !== null ? [wolfVictim] : [];

  return (
    <PhaseShell
      icon="🐺🔥"
      label="Fase Nocturna · Lobo Feroz"
      labelColor="#e05555"
      title="El Lobo Feroz ataca solo"
      subtitle="Solo el Lobo Feroz abre los ojos. Elige una segunda víctima independiente."
    >
      <div style={{
        background: 'rgba(139,0,0,.12)', border: '1px solid rgba(224,85,85,.2)',
        borderRadius: '8px', padding: '14px 24px', maxWidth: '460px',
        fontSize: '.9rem', color: 'rgba(245,230,200,.7)', lineHeight: 1.6,
      }}>
        🐺🔥 Esta es su <strong>segunda caza independiente</strong>. El protector no cubre esta víctima.
        {wolfVictim !== null && (
          <><br /><span style={{ opacity: .65, fontSize: '.82rem' }}>No puede elegir al mismo objetivo que los demás lobos.</span></>
        )}
      </div>

      <PlayerGrid
        players={players}
        selected={selected}
        onSelect={setSelected}
        disabled={disabled}
      />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="ghost" onClick={() => onConfirm(null)}>Pasar esta noche</Button>
        <Button
          variant="danger"
          disabled={selected === null}
          onClick={() => onConfirm(selected)}
        >
          🐺🔥 Confirmar segunda víctima
        </Button>
      </div>
    </PhaseShell>
  );
}
