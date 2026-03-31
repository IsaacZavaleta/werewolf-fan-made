import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  hunterIndex: number;
  /** 'night' = murió de noche, 'day' = fue linchado */
  context: 'night' | 'day';
  onShoot: (targetIdx: number) => void;
}

export function HunterShot({ players, hunterIndex, context, onShoot }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  const hunter = players[hunterIndex];
  const targets = players.filter(p => p.alive && p.index !== hunterIndex);

  if (confirming && selected !== null) {
    const target = players[selected];
    return (
      <PhaseShell
        icon="🏹"
        label="El Cazador dispara"
        labelColor="#f39c12"
        title="¿Confirmar disparo?"
      >
        <div style={{
          background: 'rgba(139,0,0,.15)',
          border: '1px solid rgba(224,85,85,.3)',
          borderRadius: '8px', padding: '24px 36px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        }}>
          <div style={{ fontSize: '2.5rem' }}>🏹</div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.85rem', color: 'rgba(245,230,200,.55)' }}>
            {hunter.name} se lleva a:
          </div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.1rem', color: '#e05555' }}>
            {target.name}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="ghost" onClick={() => setConfirming(false)}>← Cambiar</Button>
          <Button variant="danger" onClick={() => onShoot(selected)}>
            🏹 ¡Disparar!
          </Button>
        </div>
      </PhaseShell>
    );
  }

  return (
    <PhaseShell
      icon="🏹"
      label={context === 'night' ? 'El Cazador murió esta noche' : 'El Cazador fue linchado'}
      labelColor="#f39c12"
      title="El Cazador dispara"
      subtitle={`${hunter.name} fue eliminado pero puede llevarse a alguien con él.`}
    >
      <div style={{
        background: 'rgba(243,156,18,.08)',
        border: '1px solid rgba(243,156,18,.2)',
        borderRadius: '8px', padding: '14px 24px',
        maxWidth: '440px', fontSize: '.9rem',
        color: 'rgba(245,230,200,.7)', lineHeight: 1.6,
        textAlign: 'center',
      }}>
        🏹 <strong style={{ color: '#f39c12' }}>{hunter.name}</strong> tiene un último disparo.
        Elige a quién se llevará consigo.
      </div>

      {/* Target selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '12px', width: '100%', maxWidth: '680px',
      }}>
        {targets.map(p => (
          <button
            key={p.index}
            onClick={() => setSelected(p.index)}
            style={{
              border: `1px solid ${selected === p.index ? '#f39c12' : 'rgba(201,168,76,.2)'}`,
              borderRadius: '8px', padding: '16px 10px',
              background: selected === p.index ? 'rgba(243,156,18,.15)' : 'rgba(10,6,8,.85)',
              color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
              cursor: 'pointer', transition: 'all .2s',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: selected === p.index ? 'rgba(243,156,18,.2)' : 'rgba(201,168,76,.1)',
              border: `1px solid ${selected === p.index ? 'rgba(243,156,18,.5)' : 'rgba(201,168,76,.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cinzel Decorative', serif", fontSize: '.85rem',
              color: selected === p.index ? '#f39c12' : 'var(--gold)',
            }}>
              {p.name.charAt(0)}
            </div>
            <div style={{ fontSize: '.95rem' }}>{p.name}</div>
          </button>
        ))}
      </div>

      <Button
        variant="danger"
        disabled={selected === null}
        onClick={() => setConfirming(true)}
      >
        🏹 Seleccionar objetivo
      </Button>
    </PhaseShell>
  );
}
