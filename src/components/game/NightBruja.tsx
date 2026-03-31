import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  brujaName: string;
  lifeUsed: boolean;
  deathUsed: boolean;
  // Single callback: usedLife + optional kill target
  onAction: (usedLife: boolean, killIdx: number | null) => void;
}

function potionBtn(
  color: string, bg: string, border: string, active: boolean,
): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: '14px',
    background: active ? bg.replace('.2', '.35') : 'rgba(0,0,0,.4)',
    border: `1px solid ${active ? color : 'rgba(201,168,76,.12)'}`,
    borderRadius: '8px', padding: '14px 20px',
    cursor: 'pointer', transition: 'all .2s', textAlign: 'left',
    color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
    width: '100%',
  };
}

export function NightBruja({ players, brujaName, lifeUsed, deathUsed, onAction }: Props) {
  const [wantsLife,  setWantsLife]  = useState(false);
  const [killTarget, setKillTarget] = useState<number | null>(null);
  const [pickingTarget, setPickingTarget] = useState(false);

  const noneLeft = lifeUsed && deathUsed;
  const canConfirm = wantsLife || killTarget !== null;

  function handleConfirm() {
    onAction(wantsLife && !lifeUsed, deathUsed ? null : killTarget);
  }

  // Cancel death potion selection
  function cancelDeath() {
    setKillTarget(null);
    setPickingTarget(false);
  }

  return (
    <PhaseShell
      icon="🧪"
      label="Fase Nocturna · Bruja"
      labelColor="#a78bfa"
      title="La Bruja despierta"
      subtitle={`Solo ${brujaName} abre los ojos.`}
    >
      {/* Info — bruja doesn't know who was attacked */}
      <div style={{
        background: 'rgba(167,139,250,.08)',
        border: '1px solid rgba(167,139,250,.2)',
        borderRadius: '8px', padding: '14px 24px',
        maxWidth: '460px', fontSize: '.9rem',
        color: 'rgba(245,230,200,.7)', lineHeight: 1.65,
        textAlign: 'center',
      }}>
        🧪 La Bruja <strong>no sabe quién fue atacado</strong> esta noche.
        {!lifeUsed && !deathUsed && (
          <><br /><span style={{ opacity: .65, fontSize: '.83rem' }}>Puedes usar las dos pociones en la misma noche.</span></>
        )}
      </div>

      {noneLeft ? (
        <div style={{
          fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem',
          color: 'rgba(245,230,200,.35)', padding: '12px',
        }}>
          La Bruja ha agotado sus pociones.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '460px' }}>

          {/* ── Poción de vida ───────────────────────────────── */}
          {!lifeUsed && (
            <button
              onClick={() => setWantsLife(v => !v)}
              style={potionBtn('#7ab87a', 'rgba(30,80,30,.2)', 'rgba(100,180,100,.3)', wantsLife)}
            >
              <span style={{ fontSize: '1.5rem' }}>{wantsLife ? '✅' : '💚'}</span>
              <div>
                <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: '#7ab87a' }}>
                  Poción de vida
                </div>
                <div style={{ fontSize: '.82rem', color: 'rgba(245,230,200,.55)', marginTop: '3px' }}>
                  {wantsLife
                    ? 'Seleccionada — salvará a quien atacaron'
                    : 'Salva a la víctima de los lobos (sin saber quién es)'}
                </div>
              </div>
            </button>
          )}

          {/* ── Poción de muerte ─────────────────────────────── */}
          {!deathUsed && !pickingTarget && (
            <button
              onClick={() => setPickingTarget(true)}
              style={potionBtn('#e05555', 'rgba(139,0,0,.2)', 'rgba(224,85,85,.3)', killTarget !== null)}
            >
              <span style={{ fontSize: '1.5rem' }}>{killTarget !== null ? '✅' : '💀'}</span>
              <div>
                <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: '#e05555' }}>
                  Poción de muerte
                </div>
                <div style={{ fontSize: '.82rem', color: 'rgba(245,230,200,.55)', marginTop: '3px' }}>
                  {killTarget !== null
                    ? `Matará a: ${players[killTarget]?.name}`
                    : 'Seleccionar a quién matar esta noche'}
                </div>
              </div>
            </button>
          )}

          {/* ── Selector de objetivo ─────────────────────────── */}
          {!deathUsed && pickingTarget && (
            <div style={{
              background: 'rgba(139,0,0,.08)',
              border: '1px solid rgba(224,85,85,.2)',
              borderRadius: '8px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              <div style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '.75rem', color: '#e05555', marginBottom: '4px',
              }}>
                💀 Elige a quién matar:
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '8px',
              }}>
                {players.filter(p => p.alive && p.role?.id !== 'bruja').map(p => (
                  <button
                    key={p.index}
                    onClick={() => { setKillTarget(p.index); setPickingTarget(false); }}
                    style={{
                      border: `1px solid ${killTarget === p.index ? '#e05555' : 'rgba(224,85,85,.2)'}`,
                      borderRadius: '6px', padding: '10px 8px',
                      background: killTarget === p.index ? 'rgba(139,0,0,.25)' : 'rgba(10,6,8,.7)',
                      color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
                      cursor: 'pointer', fontSize: '.9rem', transition: 'all .15s',
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              <Button variant="ghost" style={{ fontSize: '.8rem', padding: '8px 16px' }} onClick={cancelDeath}>
                ← Cancelar
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Confirm row ──────────────────────────────────────── */}
      {!pickingTarget && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="ghost" onClick={() => onAction(false, null)}>
            No usar pociones →
          </Button>
          {canConfirm && (
            <Button variant="primary" onClick={handleConfirm}>
              Confirmar pociones →
            </Button>
          )}
        </div>
      )}
    </PhaseShell>
  );
}
