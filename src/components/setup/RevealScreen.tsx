import { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  currentIndex: number;
  onMove: (dir: 1 | -1) => void;
}

export function RevealScreen({ players, currentIndex, onMove }: Props) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip whenever the player changes
  useEffect(() => {
    setFlipped(false);
  }, [currentIndex]);

  const player = players[currentIndex];
  const role = player?.role;
  const total = players.length;
  const isLast = currentIndex === total - 1;

  if (!player || !role) return null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
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
          fontSize: 'clamp(1.6rem, 6vw, 2.8rem)',
          color: 'var(--moon)',
          filter: 'drop-shadow(0 0 16px rgba(201,168,76,.3))',
          marginBottom: '8px',
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
          width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
        }}>
          {/* Back face */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1a0a10 0%, #0d0507 100%)',
            border: '2px solid rgba(201,168,76,.3)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}>
            <div style={{ fontSize: '4rem', opacity: .4 }}>🌙</div>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.65rem', letterSpacing: '.18em', color: 'rgba(201,168,76,.4)', textTransform: 'uppercase' }}>
              Mantén pulsado para revelar
            </div>
          </div>

          {/* Front face */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '10px',
            border: '2px solid rgba(201,168,76,.5)',
            background: '#0d0507',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Emoji illustration area */}
            <div style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '5rem',
              background: 'linear-gradient(160deg, #1a0a10, #0d0507)',
            }}>
              {role.icon}
            </div>
            {/* Label area */}
            <div style={{
              padding: '10px 8px 12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              background: 'linear-gradient(to bottom, rgba(13,5,7,0) 0%, #0d0507 25%)',
            }}>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.72rem', color: 'var(--gold)', letterSpacing: '.1em' }}>
                {role.name}
              </div>
              <div style={{ fontSize: '.7rem', color: 'rgba(245,230,200,.6)', lineHeight: 1.3, textAlign: 'center', padding: '0 4px' }}>
                {role.desc}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reveal button */}
      <div style={{ marginBottom: '28px' }}>
        <button
          onMouseDown={() => setFlipped(true)}
          onTouchStart={() => setFlipped(true)}
          onMouseUp={() => setFlipped(false)}
          onTouchEnd={() => setFlipped(false)}
          onMouseLeave={() => setFlipped(false)}
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '.85rem',
            padding: '14px 32px',
            borderRadius: '4px',
            cursor: 'pointer',
            border: '1px solid rgba(201,168,76,.5)',
            background: flipped ? 'rgba(201,168,76,.2)' : 'rgba(201,168,76,.1)',
            color: 'var(--gold)',
            letterSpacing: '.1em',
            userSelect: 'none',
            transition: 'all .15s',
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
