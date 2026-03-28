import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

interface Props {
  players: Player[];
  videnteName: string;
  onConfirm: () => void;
}

export function NightVidente({ players, videnteName, onConfirm }: Props) {
  const [inspected, setInspected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const target = inspected !== null ? players[inspected] : null;
  const isWolf = target?.role ? WOLF_IDS.has(target.role.id) : false;

  const alive = players.filter(p => p.alive && p.role?.id !== 'vidente');

  return (
    <PhaseShell
      icon="🔮"
      label="Fase Nocturna · Vidente"
      labelColor="#7aaad4"
      title="La Vidente despierta"
      subtitle={`Solo ${videnteName} abre los ojos. Señala a quien quieras inspeccionar.`}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '12px', width: '100%', maxWidth: '680px',
      }}>
        {alive.map(p => (
          <button
            key={p.index}
            onClick={() => { setInspected(p.index); setRevealed(false); }}
            style={{
              border: `1px solid ${inspected === p.index ? '#7aaad4' : 'rgba(201,168,76,.2)'}`,
              borderRadius: '8px', padding: '14px 10px',
              background: inspected === p.index ? 'rgba(74,111,165,.15)' : 'rgba(10,6,8,.85)',
              color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
              cursor: 'pointer', transition: 'all .2s', fontSize: '.95rem',
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
              {inspected === p.index && revealed ? (isWolf ? '🐺' : '🌾') : '❓'}
            </div>
            {p.name}
          </button>
        ))}
      </div>

      {inspected !== null && !revealed && (
        <Button
          variant="ghost"
          style={{ borderColor: '#7aaad4', color: '#7aaad4' }}
          onClick={() => setRevealed(true)}
        >
          🔮 Revelar al narrador
        </Button>
      )}

      {revealed && target && (
        <div style={{
          background: isWolf ? 'rgba(139,0,0,.2)' : 'rgba(30,80,30,.2)',
          border: `1px solid ${isWolf ? 'rgba(224,85,85,.4)' : 'rgba(100,180,100,.3)'}`,
          borderRadius: '8px', padding: '16px 28px',
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '.9rem',
          color: isWolf ? '#e05555' : '#7ab87a',
        }}>
          {isWolf ? '🐺 ¡ES UN HOMBRE LOBO!' : '🌾 Es aldeano / inocente'}
        </div>
      )}

      <Button variant="primary" onClick={onConfirm}>
        La Vidente cierra los ojos →
      </Button>
    </PhaseShell>
  );
}
