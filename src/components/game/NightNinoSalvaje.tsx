import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  ninoName: string;
  onConfirm: (modelIdx: number) => void;
}

export function NightNinoSalvaje({ players, ninoName, onConfirm }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const candidates = players.filter(p => p.alive && p.role?.id !== 'nino');

  return (
    <PhaseShell
      icon="🌿"
      label="Primera Noche · Niño Salvaje"
      labelColor="#7ab87a"
      title="El Niño Salvaje despierta"
      subtitle={`Solo el niño salvaje abre los ojos. Elige a tu modelo a seguir.`}
    >
      <div style={{
        background: 'rgba(77,122,77,.1)', border: '1px solid rgba(122,184,122,.2)',
        borderRadius: '8px', padding: '14px 24px', maxWidth: '460px',
        fontSize: '.9rem', color: 'rgba(245,230,200,.7)', lineHeight: 1.65, textAlign: 'center',
      }}>
        🌿 Mientras tu modelo esté vivo, eres un aldeano normal.
        <br />Si tu modelo <strong style={{ color: '#e05555' }}>muere</strong>, te convertirás en <strong style={{ color: '#e05555' }}>Hombre Lobo</strong>.
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px', width: '100%', maxWidth: '680px',
      }}>
        {candidates.map(p => (
          <button
            key={p.index}
            onClick={() => setSelected(p.index)}
            style={{
              border: `1px solid ${selected === p.index ? '#7ab87a' : 'rgba(201,168,76,.2)'}`,
              borderRadius: '8px', padding: '12px 8px',
              background: selected === p.index ? 'rgba(77,122,77,.2)' : 'rgba(10,6,8,.85)',
              color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
              cursor: 'pointer', transition: 'all .2s', fontSize: '.9rem',
            }}
          >
            {selected === p.index ? '⭐ ' : ''}{p.name}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div style={{
          fontSize: '.9rem', color: '#7ab87a',
          fontStyle: 'italic',
        }}>
          Modelo elegido: <strong>{players[selected]?.name}</strong>
        </div>
      )}

      <Button
        variant="primary"
        disabled={selected === null}
        onClick={() => selected !== null && onConfirm(selected)}
      >
        El Niño Salvaje cierra los ojos →
      </Button>
    </PhaseShell>
  );
}
