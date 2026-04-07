import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { PlayerGrid } from './PlayerGrid';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  round: number;
  cupidLovers: [number, number] | null;
  judgeName: string;
  onConfirm: (idx: number) => void;
  onSkip: () => void;
}

export function DayJudge({ players, round, cupidLovers, judgeName, onConfirm, onSkip }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  const loverWillDie = selected !== null && cupidLovers
    ? (cupidLovers[0] === selected || cupidLovers[1] === selected)
    : false;
  const partnerName = loverWillDie && cupidLovers && selected !== null
    ? players[selected === cupidLovers[0] ? cupidLovers[1] : cupidLovers[0]]?.name
    : null;

  if (confirming && selected !== null) {
    return (
      <PhaseShell
        icon="⚖️⚖️"
        label="Juez Tartamudo · Segundo Linchamiento"
        labelColor="#f39c12"
        title="¿Confirmar segundo linchamiento?"
        round={round}
      >
        <div style={{
          background: 'rgba(139,0,0,.15)', border: '1px solid rgba(224,85,85,.3)',
          borderRadius: '8px', padding: '24px 36px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
        }}>
          <div style={{ fontSize: '2.5rem' }}>⚖️</div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1rem', color: '#e05555' }}>
            {players[selected].name}
          </div>
          {loverWillDie && partnerName && (
            <div style={{ fontSize: '.85rem', color: '#e05555', background: 'rgba(139,0,0,.2)', borderRadius: '6px', padding: '8px 16px' }}>
              💔 <strong>{partnerName}</strong> también morirá de amor
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="ghost" onClick={() => setConfirming(false)}>← Cambiar</Button>
          <Button variant="danger" onClick={() => onConfirm(selected)}>⚖️ Confirmar</Button>
        </div>
      </PhaseShell>
    );
  }

  return (
    <PhaseShell
      icon="⚖️"
      label="Juez Tartamudo · Segundo Linchamiento"
      labelColor="#f39c12"
      title="El Juez activa un segundo linchamiento"
      subtitle={`${judgeName} ha levantado el pulgar. Hay un segundo voto inmediato.`}
      round={round}
    >
      <div style={{
        background: 'rgba(243,156,18,.08)', border: '1px solid rgba(243,156,18,.2)',
        borderRadius: '8px', padding: '14px 24px', maxWidth: '440px',
        fontSize: '.9rem', color: 'rgba(245,230,200,.7)', lineHeight: 1.6,
      }}>
        ⚖️ Se vota de inmediato a un segundo jugador para linchar. Esto ocurre solo una vez por partida.
      </div>

      <PlayerGrid
        players={players}
        selected={selected}
        onSelect={setSelected}
      />

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="ghost" onClick={onSkip}>Sin segundo voto</Button>
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
