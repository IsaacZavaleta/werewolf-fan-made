import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  eliminatedToday: number[];
  winner: 'villagers' | 'wolves' | null;
  round: number;
  onNextNight: () => void;
  onRestart: () => void;
}

export function DayEliminate({ players, eliminatedToday, winner, round, onNextNight, onRestart }: Props) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const eliminated = eliminatedToday.map(i => players[i]).filter(Boolean);

  function toggleReveal(idx: number) {
    setRevealed(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  if (winner) {
    return (
      <PhaseShell
        icon={winner === 'wolves' ? '🐺' : '🏘️'}
        label="Fin de la partida"
        labelColor={winner === 'wolves' ? '#e05555' : '#7ab87a'}
        title={winner === 'wolves' ? '¡Los Hombres Lobo ganan!' : '¡El pueblo triunfa!'}
        subtitle={winner === 'wolves'
          ? 'La oscuridad se adueña de Castronegro para siempre.'
          : 'La luz vence a las tinieblas. Castronegro sobrevive.'}
      >
        {/* Show all surviving players with roles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px', width: '100%', maxWidth: '680px',
        }}>
          {players.map(p => (
            <div key={p.index} style={{
              background: p.alive ? 'rgba(10,6,8,.85)' : 'rgba(0,0,0,.4)',
              border: `1px solid ${p.alive ? 'rgba(201,168,76,.25)' : 'rgba(255,255,255,.06)'}`,
              borderRadius: '8px', padding: '14px 10px',
              opacity: p.alive ? 1 : 0.45,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{p.role?.icon ?? '❓'}</div>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.72rem', color: 'var(--gold)', marginBottom: '4px' }}>
                {p.role?.name}
              </div>
              <div style={{ fontSize: '.9rem', color: p.alive ? 'var(--moon)' : 'rgba(245,230,200,.4)' }}>
                {p.name}
              </div>
              {!p.alive && <div style={{ fontSize: '.7rem', color: 'rgba(245,230,200,.3)', marginTop: '4px' }}>eliminado</div>}
            </div>
          ))}
        </div>

        <Button variant="primary" style={{ marginTop: '16px' }} onClick={onRestart}>
          ↺ Nueva partida
        </Button>
      </PhaseShell>
    );
  }

  return (
    <PhaseShell
      icon="⚰️"
      label="Fase Diurna · Eliminación"
      labelColor="#e05555"
      title={eliminated.length === 0 ? 'Sin linchamiento' : 'Carta revelada'}
      subtitle={eliminated.length === 0
        ? 'El pueblo no llegó a un acuerdo. Nadie fue linchado hoy.'
        : 'El eliminado revela su rol ante todos.'}
      round={round}
    >
      {eliminated.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {eliminated.map(p => {
            const isRevealed = revealed.has(p.index);
            return (
              <div
                key={p.index}
                style={{ width: '180px', perspective: '700px', cursor: 'pointer' }}
                onClick={() => toggleReveal(p.index)}
              >
                <div style={{
                  width: '100%', height: '260px',
                  position: 'relative', transformStyle: 'preserve-3d',
                  transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
                  transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>
                  {/* Back */}
                  <div style={{
                    ...faceStyle,
                    background: 'linear-gradient(135deg, #1a0a10, #0d0507)',
                    border: '2px solid rgba(201,168,76,.2)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '10px',
                  }}>
                    <div style={{ fontSize: '3rem', opacity: .4 }}>⚰️</div>
                    <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.62rem', color: 'rgba(201,168,76,.4)', letterSpacing: '.1em' }}>
                      TAP PARA REVELAR
                    </div>
                    <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: 'rgba(245,230,200,.6)' }}>
                      {p.name}
                    </div>
                  </div>

                  {/* Front */}
                  <div style={{
                    ...faceStyle,
                    transform: 'rotateY(180deg)',
                    background: '#0d0507',
                    border: `2px solid ${p.role?.group === 'wolf' ? 'rgba(224,85,85,.5)' : 'rgba(201,168,76,.4)'}`,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '10px',
                  }}>
                    <div style={{ fontSize: '4rem' }}>{p.role?.icon ?? '❓'}</div>
                    <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.72rem', color: p.role?.group === 'wolf' ? '#e05555' : 'var(--gold)' }}>
                      {p.role?.name}
                    </div>
                    <div style={{ fontSize: '.85rem', color: 'rgba(245,230,200,.7)' }}>{p.name}</div>
                    <div style={{ fontSize: '.72rem', color: 'rgba(245,230,200,.4)', padding: '0 12px', textAlign: 'center', lineHeight: 1.4 }}>
                      {p.role?.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button variant="primary" style={{ marginTop: '12px' }} onClick={onNextNight}>
        🌑 Comenzar siguiente noche
      </Button>
    </PhaseShell>
  );
}

const faceStyle: React.CSSProperties = {
  position: 'absolute', inset: 0,
  borderRadius: '10px',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  overflow: 'hidden',
};
