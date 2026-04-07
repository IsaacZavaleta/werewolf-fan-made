import { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import type { Player } from '../../types';
import cardImages from '../../data/cardImages';

interface Props {
  players: Player[];
  currentIndex: number;
  onMove: (dir: 1 | -1) => void;
}

export function RevealScreen({ players, currentIndex, onMove }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { setFlipped(false); }, [currentIndex]);

  const player = players[currentIndex];
  const role   = player?.role;
  const total  = players.length;
  const isLast = currentIndex === total - 1;
  const img    = role ? cardImages[role.id] : undefined;

  if (!player || !role) return null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', textAlign: 'center',
      animation: 'fadeIn .4s ease',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: 'var(--gold)', opacity: .55, marginBottom: '4px' }}>
          🃏 Distribución de roles
        </div>
        <div style={{ fontSize: '.85rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,.55)', marginBottom: '4px' }}>
          Jugador {currentIndex + 1} de {total}
        </div>
        <div style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 'clamp(1.6rem, 6vw, 2.8rem)', color: 'var(--moon)',
          filter: 'drop-shadow(0 0 16px rgba(201,168,76,.3))', marginBottom: '8px',
        }}>
          {player.name}
        </div>
        <div style={{ fontStyle: 'italic', color: 'rgba(245,230,200,.45)', fontSize: '.95rem' }}>
          Asegúrate de que nadie más vea la pantalla
        </div>
      </div>

      {/* Card flip */}
      <div style={{ width: '200px', height: '290px', perspective: '800px', marginBottom: '36px' }}>
        <div style={{
          width: '100%', height: '100%', position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '10px',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1a0a10, #0d0507)',
            border: '2px solid rgba(201,168,76,.3)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}>
            <div style={{ fontSize: '4rem', opacity: .4 }}>🌙</div>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.65rem', letterSpacing: '.18em', color: 'rgba(201,168,76,.4)', textTransform: 'uppercase' }}>
              Mantén pulsado para revelar
            </div>
          </div>

          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '10px',
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: '#0d0507',
            border: `2px solid ${role.group === 'wolf' ? 'rgba(224,85,85,.5)' : 'rgba(201,168,76,.4)'}`,
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Card image or emoji */}
            {img ? (
              <img
                src={img}
                alt={role.name}
                style={{ width: '100%', height: '75%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            ) : (
              <div style={{
                height: '75%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '5rem', background: 'linear-gradient(160deg, #1a0a10, #0d0507)',
              }}>
                {role.icon}
              </div>
            )}
            {/* Label */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '3px', padding: '6px 8px',
              background: 'linear-gradient(to bottom, rgba(13,5,7,0), #0d0507 30%)',
            }}>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.72rem', color: role.group === 'wolf' ? '#e05555' : 'var(--gold)', letterSpacing: '.08em' }}>
                {role.name}
              </div>
              <div style={{ fontSize: '.68rem', color: 'rgba(245,230,200,.6)', lineHeight: 1.3, textAlign: 'center' }}>
                {role.desc}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hold-to-reveal button */}
      <div style={{ marginBottom: '28px' }}>
        <button
          onMouseDown={() => setFlipped(true)}
          onTouchStart={() => setFlipped(true)}
          onMouseUp={() => setFlipped(false)}
          onTouchEnd={() => setFlipped(false)}
          onMouseLeave={() => setFlipped(false)}
          style={{
            fontFamily: "'Cinzel Decorative', serif", fontSize: '.85rem',
            padding: '14px 32px', borderRadius: '4px', cursor: 'pointer',
            border: '1px solid rgba(201,168,76,.5)',
            background: flipped ? 'rgba(201,168,76,.2)' : 'rgba(201,168,76,.1)',
            color: 'var(--gold)', letterSpacing: '.1em', userSelect: 'none', transition: 'all .15s',
          }}
        >
          👁 Mantener presionado para ver rol
        </button>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {currentIndex > 0 && (
          <Button variant="ghost" onClick={() => onMove(-1)}>← Anterior</Button>
        )}
        <Button variant="primary" onClick={() => onMove(1)}>
          {isLast ? '¿Comenzar? →' : 'Siguiente →'}
        </Button>
      </div>
    </div>
  );
}
