import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { PlayerGrid } from './PlayerGrid';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  round: number;
  cupidLovers: [number, number] | null;
  onConfirmLynch: (index: number) => void;
  onSkipLynch: () => void;
}

export function DayVote({ players, round, cupidLovers, onConfirmLynch, onSkipLynch }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  const alivePlayers = players.filter(p => p.alive);
  const target = selected !== null ? players[selected] : null;

  // Warn if a lover will die too
  const loverWillDie = selected !== null && cupidLovers
    ? (cupidLovers[0] === selected && players[cupidLovers[1]]?.alive)
      || (cupidLovers[1] === selected && players[cupidLovers[0]]?.alive)
    : false;

  const partnerName = loverWillDie && cupidLovers && selected !== null
    ? players[selected === cupidLovers[0] ? cupidLovers[1] : cupidLovers[0]]?.name
    : null;

  if (confirming && target) {
    return (
      <PhaseShell
        icon="⚖️"
        label="Fase Diurna · Linchamiento"
        labelColor="#f39c12"
        title="¿Confirmar linchamiento?"
        round={round}
      >
        <div style={{
          background: 'rgba(139,0,0,.15)',
          border: '1px solid rgba(224,85,85,.3)',
          borderRadius: '8px', padding: '24px 36px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ fontSize: '3rem' }}>⚖️</div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1rem', color: '#e05555' }}>
            {target.name}
          </div>
          <div style={{ fontSize: '.9rem', color: 'rgba(245,230,200,.6)', fontStyle: 'italic' }}>
            será linchado por el pueblo
          </div>
          {loverWillDie && partnerName && (
            <div style={{
              background: 'rgba(139,0,0,.2)', border: '1px solid rgba(224,85,85,.3)',
              borderRadius: '6px', padding: '10px 20px',
              fontSize: '.85rem', color: '#e05555',
            }}>
              💔 <strong>{partnerName}</strong> también morirá de amor
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="ghost" onClick={() => setConfirming(false)}>← Cambiar voto</Button>
          <Button variant="danger" onClick={() => onConfirmLynch(target.index)}>
            ⚖️ Confirmar
          </Button>
        </div>
      </PhaseShell>
    );
  }

  return (
    <PhaseShell
      icon="🗳️"
      label="Fase Diurna · Votación"
      labelColor="var(--gold)"
      title="El pueblo vota"
      subtitle={`${alivePlayers.length} supervivientes. ¿A quién linchar?`}
      round={round}
    >
      <PlayerGrid
        players={players}
        selected={selected}
        onSelect={setSelected}
      />

      {loverWillDie && partnerName && selected !== null && (
        <div style={{
          fontSize: '.85rem', color: '#e05555',
          background: 'rgba(139,0,0,.12)', border: '1px solid rgba(224,85,85,.2)',
          borderRadius: '6px', padding: '8px 18px',
        }}>
          ⚠️ Linchar a <strong>{players[selected].name}</strong> también matará a <strong>{partnerName}</strong> (enamorado/a)
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="ghost" onClick={onSkipLynch}>
          Sin consenso — nadie muere
        </Button>
        <Button
          variant="danger"
          disabled={selected === null}
          onClick={() => setConfirming(true)}
        >
          ⚖️ Linchar
        </Button>
      </div>
    </PhaseShell>
  );
}
