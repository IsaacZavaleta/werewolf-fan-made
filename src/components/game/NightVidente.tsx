import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';
import cardImages from '../../data/cardImages';

const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

interface Props {
  players: Player[];
  videnteName: string;
  onConfirm: () => void;
}

export function NightVidente({ players, videnteName, onConfirm }: Props) {
  const [inspected, setInspected] = useState<number | null>(null);
  const [revealed,  setRevealed]  = useState(false);

  const target  = inspected !== null ? players[inspected] : null;
  const isWolf  = target?.role ? WOLF_IDS.has(target.role.id) : false;
  const roleImg = target?.role ? (cardImages as Record<string, string>)[target.role.id] : undefined;

  const alive = players.filter(p => p.alive && p.role?.id !== 'vidente');

  return (
    <PhaseShell
      icon="🔮"
      label="Fase Nocturna · Vidente"
      labelColor="#7aaad4"
      title="La Vidente despierta"
      subtitle={`Solo ${videnteName} abre los ojos. Señala a quien quieras inspeccionar.`}
    >
      {/* Player grid */}
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
              {inspected === p.index && revealed
                ? (isWolf ? '🐺' : (target?.role?.icon ?? '🌾'))
                : '❓'}
            </div>
            {p.name}
          </button>
        ))}
      </div>

      {/* Reveal button */}
      {inspected !== null && !revealed && (
        <Button
          variant="ghost"
          style={{ borderColor: '#7aaad4', color: '#7aaad4' }}
          onClick={() => setRevealed(true)}
        >
          🔮 Revelar al narrador
        </Button>
      )}

      {/* Full role reveal — card image + role name + description */}
      {revealed && target && target.role && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn .35s ease',
        }}>
          {/* Card */}
          <div style={{
            width: '140px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: `2px solid ${isWolf ? 'rgba(224,85,85,.6)' : '#7aaad4'}`,
            boxShadow: `0 0 28px ${isWolf ? 'rgba(139,0,0,.5)' : 'rgba(74,111,165,.4)'}`,
          }}>
            {roleImg ? (
              <img
                src={roleImg}
                alt={target.role.name}
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%', aspectRatio: '3/4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', background: 'rgba(10,6,8,.9)',
              }}>
                {target.role.icon}
              </div>
            )}
          </div>

          {/* Role info */}
          <div style={{
            background: isWolf ? 'rgba(139,0,0,.2)' : 'rgba(74,111,165,.15)',
            border: `1px solid ${isWolf ? 'rgba(224,85,85,.4)' : 'rgba(122,170,212,.3)'}`,
            borderRadius: '8px', padding: '14px 24px',
            textAlign: 'center', maxWidth: '320px',
          }}>
            <div style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '.85rem',
              color: isWolf ? '#e05555' : '#7aaad4',
              marginBottom: '6px',
            }}>
              {target.role.icon} {target.role.name}
            </div>
            <div style={{ fontSize: '.82rem', color: 'rgba(245,230,200,.7)', lineHeight: 1.55 }}>
              {target.role.desc}
            </div>
            <div style={{
              marginTop: '8px', fontSize: '.78rem',
              color: isWolf ? '#e05555' : '#7ab87a',
              fontFamily: "'Cinzel Decorative', serif",
            }}>
              {isWolf ? '⚠️ ES UN HOMBRE LOBO' : '✓ No es un lobo'}
            </div>
          </div>
        </div>
      )}

      <Button variant="primary" onClick={onConfirm}>
        La Vidente cierra los ojos →
      </Button>
    </PhaseShell>
  );
}
