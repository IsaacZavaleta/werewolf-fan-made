import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

interface Props {
  players: Player[];
  zorroName: string;
  zorroActive: boolean;
  onConfirm: (centerIdx: number, hadWolf: boolean) => void;
  onSkip: () => void;
}

export function NightZorro({ players, zorroName, zorroActive, onConfirm, onSkip }: Props) {
  const [centerIdx, setCenterIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const alive = players.filter(p => p.alive);

  // Build the group of 3: center ± 1 in alive list order
  function getGroup(center: number): Player[] {
    const pos = alive.findIndex(p => p.index === center);
    if (pos === -1) return [];
    const prev = alive[(pos - 1 + alive.length) % alive.length];
    const next = alive[(pos + 1) % alive.length];
    return [prev, alive[pos], next];
  }

  const group = centerIdx !== null ? getGroup(centerIdx) : [];
  const hasWolf = group.some(p => p.role && WOLF_IDS.has(p.role.id));

  if (!zorroActive) {
    return (
      <PhaseShell
        icon="🦊"
        label="Fase Nocturna · Zorro"
        labelColor="#f39c12"
        title="El Zorro ya no tiene poderes"
        subtitle="Falló en una inspección anterior. Solo puede observar en silencio."
      >
        <Button variant="primary" onClick={onSkip}>Continuar →</Button>
      </PhaseShell>
    );
  }

  return (
    <PhaseShell
      icon="🦊"
      label="Fase Nocturna · Zorro"
      labelColor="#f39c12"
      title="El Zorro despierta"
      subtitle={`Solo ${zorroName} abre los ojos. Señala al jugador central de un grupo de 3.`}
    >
      <div style={{
        background: 'rgba(243,156,18,.08)',
        border: '1px solid rgba(243,156,18,.2)',
        borderRadius: '8px',
        padding: '14px 24px',
        maxWidth: '480px',
        fontSize: '.9rem',
        color: 'rgba(245,230,200,.7)',
        lineHeight: 1.6,
      }}>
        🦊 El narrador asiente si hay un lobo entre los 3 señalados.
        Si no hay ninguno, el Zorro <strong style={{ color: '#f39c12' }}>pierde su poder</strong> para siempre.
      </div>

      {/* Pick center player */}
      <p style={{ color: 'rgba(245,230,200,.5)', fontSize: '.9rem', margin: 0 }}>
        Elige el jugador central del grupo:
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px', width: '100%', maxWidth: '680px',
      }}>
        {alive.map(p => (
          <button
            key={p.index}
            onClick={() => { setCenterIdx(p.index); setRevealed(false); }}
            style={{
              border: `1px solid ${centerIdx === p.index ? '#f39c12' : 'rgba(201,168,76,.2)'}`,
              borderRadius: '8px', padding: '12px 8px',
              background: centerIdx === p.index ? 'rgba(243,156,18,.12)' : 'rgba(10,6,8,.85)',
              color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
              cursor: 'pointer', transition: 'all .2s', fontSize: '.9rem',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Show the group of 3 */}
      {centerIdx !== null && group.length === 3 && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {group.map((p, i) => (
            <div
              key={p.index}
              style={{
                padding: '12px 18px', borderRadius: '8px',
                background: i === 1 ? 'rgba(243,156,18,.15)' : 'rgba(10,6,8,.7)',
                border: `1px solid ${i === 1 ? 'rgba(243,156,18,.5)' : 'rgba(201,168,76,.15)'}`,
                textAlign: 'center', minWidth: '90px',
              }}
            >
              <div style={{ fontSize: '.7rem', color: 'rgba(245,230,200,.4)', marginBottom: '4px' }}>
                {i === 0 ? 'izquierda' : i === 1 ? '⭐ centro' : 'derecha'}
              </div>
              <div style={{ fontSize: '.95rem', color: 'var(--moon)' }}>{p.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* Narrador reveal result */}
      {centerIdx !== null && !revealed && (
        <Button
          variant="ghost"
          style={{ borderColor: '#f39c12', color: '#f39c12' }}
          onClick={() => setRevealed(true)}
        >
          🦊 El narrador revela el resultado
        </Button>
      )}

      {revealed && (
        <div style={{
          background: hasWolf ? 'rgba(139,0,0,.2)' : 'rgba(30,80,30,.2)',
          border: `1px solid ${hasWolf ? 'rgba(224,85,85,.4)' : 'rgba(100,180,100,.3)'}`,
          borderRadius: '8px', padding: '16px 28px',
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '.9rem',
          color: hasWolf ? '#e05555' : '#7ab87a',
        }}>
          {hasWolf
            ? '🐺 Sí — hay al menos un Hombre Lobo entre esos tres'
            : '🌾 No — ningún lobo en ese grupo (el Zorro pierde su poder)'}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="ghost" onClick={onSkip}>No usar el poder</Button>
        <Button
          variant="primary"
          disabled={centerIdx === null || !revealed}
          onClick={() => centerIdx !== null && onConfirm(centerIdx, hasWolf)}
        >
          El Zorro cierra los ojos →
        </Button>
      </div>
    </PhaseShell>
  );
}
