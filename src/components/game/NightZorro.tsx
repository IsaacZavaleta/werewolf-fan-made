import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

interface Props {
  players: Player[];
  zorroName: string;
  zorroActive: boolean;
  onConfirm: (hadWolf: boolean) => void;
  onSkip: () => void;
}

export function NightZorro({ players, zorroName, zorroActive, onConfirm, onSkip }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  const alive = players.filter(p => p.alive);

  function toggle(idx: number) {
    setSelected(prev => {
      if (prev.includes(idx)) return prev.filter(i => i !== idx);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, idx];
    });
    setRevealed(false); // reset reveal when selection changes
  }

  const selectedPlayers = selected.map(i => players[i]);
  const hasWolf = selectedPlayers.some(p => p.role && WOLF_IDS.has(p.role.id));
  const ready = selected.length === 3;

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
      subtitle={`Solo ${zorroName} abre los ojos. Elige exactamente 3 jugadores para inspeccionar.`}
    >
      <div style={{
        background: 'rgba(243,156,18,.08)',
        border: '1px solid rgba(243,156,18,.2)',
        borderRadius: '8px', padding: '14px 24px',
        maxWidth: '480px', fontSize: '.9rem',
        color: 'rgba(245,230,200,.7)', lineHeight: 1.6,
      }}>
        🦊 Selecciona <strong style={{ color: '#f39c12' }}>3 jugadores</strong> de cualquier lugar.
        El narrador asiente si hay un lobo entre ellos.
        Si no hay ninguno, el Zorro <strong style={{ color: '#f39c12' }}>pierde su poder</strong> para siempre.
      </div>

      {/* Player grid — free selection of 3 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px', width: '100%', maxWidth: '680px',
      }}>
        {alive.map(p => {
          const isSelected = selected.includes(p.index);
          const order = selected.indexOf(p.index); // 0,1,2
          const isDisabled = !isSelected && selected.length >= 3;
          return (
            <button
              key={p.index}
              onClick={() => !isDisabled && toggle(p.index)}
              disabled={isDisabled}
              style={{
                border: `1px solid ${isSelected ? '#f39c12' : 'rgba(201,168,76,.2)'}`,
                borderRadius: '8px', padding: '12px 8px',
                background: isSelected ? 'rgba(243,156,18,.15)' : 'rgba(10,6,8,.85)',
                color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.35 : 1,
                transition: 'all .2s', fontSize: '.9rem',
                position: 'relative',
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '5px', right: '7px',
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: '.65rem', color: '#f39c12',
                }}>
                  {order + 1}
                </div>
              )}
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Selected summary */}
      {selected.length > 0 && (
        <div style={{
          display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {selectedPlayers.map((p, i) => (
            <div key={p.index} style={{
              padding: '6px 14px', borderRadius: '20px',
              background: 'rgba(243,156,18,.12)',
              border: '1px solid rgba(243,156,18,.35)',
              fontSize: '.85rem', color: 'var(--moon)',
            }}>
              <span style={{ color: '#f39c12', fontSize: '.7rem', marginRight: '5px' }}>{i + 1}</span>
              {p.name}
            </div>
          ))}
          {selected.length < 3 && (
            <div style={{
              padding: '6px 14px', borderRadius: '20px',
              border: '1px dashed rgba(243,156,18,.2)',
              fontSize: '.85rem', color: 'rgba(245,230,200,.3)',
            }}>
              {3 - selected.length} más…
            </div>
          )}
        </div>
      )}

      {/* Reveal button — only when 3 selected */}
      {ready && !revealed && (
        <Button
          variant="ghost"
          style={{ borderColor: '#f39c12', color: '#f39c12' }}
          onClick={() => setRevealed(true)}
        >
          🦊 El narrador revela el resultado
        </Button>
      )}

      {/* Result */}
      {revealed && (
        <div style={{
          background: hasWolf ? 'rgba(139,0,0,.2)' : 'rgba(30,80,30,.2)',
          border: `1px solid ${hasWolf ? 'rgba(224,85,85,.4)' : 'rgba(100,180,100,.3)'}`,
          borderRadius: '8px', padding: '16px 28px',
          fontFamily: "'Cinzel Decorative', serif", fontSize: '.9rem',
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
          disabled={!ready || !revealed}
          onClick={() => onConfirm(hasWolf)}
        >
          El Zorro cierra los ojos →
        </Button>
      </div>
    </PhaseShell>
  );
}
