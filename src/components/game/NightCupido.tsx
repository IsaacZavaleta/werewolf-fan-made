import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  cupidName: string;
  onConfirm: (a: number, b: number) => void;
  onSkip: () => void;
}

export function NightCupido({ players, cupidName, onConfirm, onSkip }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const alive = players.filter(p => p.alive);

  function toggleSelect(idx: number) {
    setSelected(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, idx];
    });
  }

  const ready = selected.length === 2;

  return (
    <PhaseShell
      icon="❤️"
      label="Primera Noche · Cupido"
      labelColor="#e05555"
      title="Cupido despierta"
      subtitle={`Solo cupido abre los ojos. Elige a los dos enamorados.`}
    >
      <div style={{
        background: 'rgba(139,0,0,.1)',
        border: '1px solid rgba(224,85,85,.2)',
        borderRadius: '8px',
        padding: '14px 24px',
        maxWidth: '480px',
        fontSize: '.9rem',
        color: 'rgba(245,230,200,.7)',
        lineHeight: 1.6,
      }}>
        ❤️ Selecciona exactamente <strong style={{ color: '#e05555' }}>2 jugadores</strong>.
        Si uno de ellos muere, el otro morirá de amor inmediatamente.
        <br />
        <span style={{ opacity: .6, fontSize: '.82rem' }}>
          Cupido puede elegirse a sí mismo como uno de los enamorados.
        </span>
      </div>

      {/* Player selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '12px',
        width: '100%',
        maxWidth: '680px',
      }}>
        {alive.map(p => {
          const isSelected = selected.includes(p.index);
          const order = selected.indexOf(p.index);
          return (
            <button
              key={p.index}
              onClick={() => toggleSelect(p.index)}
              disabled={!isSelected && selected.length >= 2}
              style={{
                border: `1px solid ${isSelected ? '#e05555' : 'rgba(201,168,76,.2)'}`,
                borderRadius: '8px',
                padding: '14px 10px',
                background: isSelected ? 'rgba(139,0,0,.2)' : 'rgba(10,6,8,.85)',
                color: 'var(--moon)',
                fontFamily: "'Crimson Text', serif",
                cursor: selected.length >= 2 && !isSelected ? 'not-allowed' : 'pointer',
                opacity: selected.length >= 2 && !isSelected ? 0.35 : 1,
                transition: 'all .2s',
                position: 'relative',
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '6px', right: '8px',
                  fontSize: '.7rem', color: '#e05555',
                  fontFamily: "'Cinzel Decorative', serif",
                }}>
                  {order === 0 ? '❤️' : '💛'}
                </div>
              )}
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                {isSelected ? (order === 0 ? '❤️' : '💛') : '👤'}
              </div>
              <div style={{ fontSize: '.95rem' }}>{p.name}</div>
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      {ready && (
        <div style={{
          background: 'rgba(139,0,0,.15)',
          border: '1px solid rgba(224,85,85,.3)',
          borderRadius: '8px',
          padding: '14px 24px',
          fontSize: '.9rem',
          color: 'rgba(245,230,200,.8)',
        }}>
          ❤️ <strong style={{ color: '#e05555' }}>{players[selected[0]].name}</strong>
          {' '}&amp;{' '}
          <strong style={{ color: '#e05555' }}>{players[selected[1]].name}</strong>
          {' '}están enamorados para siempre
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="ghost" onClick={onSkip}>
          No enamorar a nadie
        </Button>
        <Button
          variant="danger"
          disabled={!ready}
          onClick={() => ready && onConfirm(selected[0], selected[1])}
        >
          ❤️ Confirmar enamorados
        </Button>
      </div>
    </PhaseShell>
  );
}
