import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  brujaName: string;
  wolfVictim: number | null;
  lifeUsed: boolean;
  deathUsed: boolean;
  onSave: () => void;
  onKill: (index: number) => void;
  onPass: () => void;
}

export function NightBruja({ players, brujaName, wolfVictim, lifeUsed, deathUsed, onSave, onKill, onPass }: Props) {
  const [mode, setMode] = useState<'choose' | 'kill-select'>('choose');
  const [killTarget, setKillTarget] = useState<number | null>(null);

  const victim = wolfVictim !== null ? players[wolfVictim] : null;

  return (
    <PhaseShell
      icon="🧪"
      label="Fase Nocturna · Bruja"
      labelColor="#a78bfa"
      title="La Bruja despierta"
      subtitle={`Solo ${brujaName} abre los ojos. Decide si usar tus pociones.`}
    >
      {/* Show who the wolves attacked */}
      <div style={{
        background: 'rgba(139,0,0,.12)',
        border: '1px solid rgba(224,85,85,.2)',
        borderRadius: '8px', padding: '14px 24px',
        maxWidth: '420px', fontSize: '.95rem',
        color: 'rgba(245,230,200,.75)',
      }}>
        {victim
          ? <>🐺 Los lobos han atacado a <strong style={{ color: '#e05555' }}>{victim.name}</strong></>
          : <>🐺 No hay víctima esta noche</>
        }
      </div>

      {mode === 'choose' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '420px' }}>
          {/* Life potion */}
          {!lifeUsed && victim && wolfVictim !== null && (
            <button
              onClick={() => onSave()}
              style={potionBtn('#7ab87a', 'rgba(30,80,30,.2)', 'rgba(100,180,100,.3)')}
            >
              <span style={{ fontSize: '1.4rem' }}>💚</span>
              <div>
                <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: '#7ab87a' }}>
                  Poción de vida
                </div>
                <div style={{ fontSize: '.85rem', color: 'rgba(245,230,200,.6)', marginTop: '3px' }}>
                  Salvar a {victim.name}
                </div>
              </div>
            </button>
          )}

          {/* Death potion */}
          {!deathUsed && (
            <button
              onClick={() => setMode('kill-select')}
              style={potionBtn('#e05555', 'rgba(139,0,0,.2)', 'rgba(224,85,85,.3)')}
            >
              <span style={{ fontSize: '1.4rem' }}>💀</span>
              <div>
                <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: '#e05555' }}>
                  Poción de muerte
                </div>
                <div style={{ fontSize: '.85rem', color: 'rgba(245,230,200,.6)', marginTop: '3px' }}>
                  Matar a alguien esta noche
                </div>
              </div>
            </button>
          )}

          <Button variant="ghost" onClick={onPass}>
            No usar pociones →
          </Button>
        </div>
      )}

      {mode === 'kill-select' && (
        <>
          <p style={{ color: 'rgba(245,230,200,.55)', fontSize: '.9rem' }}>
            Elige a quién matar con la poción de muerte:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '12px', width: '100%', maxWidth: '680px',
          }}>
            {players.filter(p => p.alive && p.role?.id !== 'bruja').map(p => (
              <button
                key={p.index}
                onClick={() => setKillTarget(p.index)}
                style={{
                  border: `1px solid ${killTarget === p.index ? '#e05555' : 'rgba(201,168,76,.2)'}`,
                  borderRadius: '8px', padding: '14px 10px',
                  background: killTarget === p.index ? 'rgba(139,0,0,.2)' : 'rgba(10,6,8,.85)',
                  color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
                  cursor: 'pointer', transition: 'all .2s', fontSize: '.95rem',
                }}
              >
                <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>💀</div>
                {p.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button variant="ghost" onClick={() => { setMode('choose'); setKillTarget(null); }}>
              ← Volver
            </Button>
            <Button
              variant="danger"
              disabled={killTarget === null}
              onClick={() => killTarget !== null && onKill(killTarget)}
            >
              💀 Confirmar muerte
            </Button>
          </div>
        </>
      )}
    </PhaseShell>
  );
}

function potionBtn(color: string, bg: string, border: string): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: '14px',
    background: bg, border: `1px solid ${border}`,
    borderRadius: '8px', padding: '14px 20px',
    cursor: 'pointer', transition: 'all .2s', textAlign: 'left',
    color, fontFamily: "'Crimson Text', serif",
  };
}
