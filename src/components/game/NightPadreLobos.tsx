import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  padreName: string;
  wolfVictim: number | null; // who the wolves chose to eat
  onInfect: (idx: number) => void;
  onPass: () => void;
}

export function NightPadreLobos({ players, padreName, wolfVictim, onInfect, onPass }: Props) {
  const [confirming, setConfirming] = useState(false);

  const victim = wolfVictim !== null ? players[wolfVictim] : null;

  return (
    <PhaseShell
      icon="🐺👑"
      label="Fase Nocturna · Padre de los Lobos"
      labelColor="#e05555"
      title="El Padre de los Lobos decide"
      subtitle={`Solo ${padreName} abre los ojos. Puede usar su poder una única vez.`}
    >
      <div style={{
        background: 'rgba(139,0,0,.12)', border: '1px solid rgba(224,85,85,.2)',
        borderRadius: '8px', padding: '14px 24px', maxWidth: '460px',
        fontSize: '.9rem', color: 'rgba(245,230,200,.7)', lineHeight: 1.65,
      }}>
        🐺👑 Si usa su poder: la víctima elegida por los lobos <strong style={{ color: '#e05555' }}>no muere</strong>, sino que se convierte en Hombre Lobo en secreto.
        <br /><br />
        <span style={{ opacity: .65, fontSize: '.83rem' }}>Este poder solo puede usarse una vez en toda la partida.</span>
      </div>

      {victim ? (
        <>
          <div style={{
            background: 'rgba(139,0,0,.15)', border: '1px solid rgba(224,85,85,.3)',
            borderRadius: '8px', padding: '16px 28px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '.8rem', color: 'rgba(245,230,200,.5)', marginBottom: '6px' }}>Víctima elegida por los lobos:</div>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1rem', color: '#e05555' }}>
              {victim.name}
            </div>
          </div>

          {!confirming ? (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button variant="ghost" onClick={onPass}>No usar el poder →</Button>
              <Button variant="danger" onClick={() => setConfirming(true)}>
                🐺👑 Infectar a {victim.name}
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                fontSize: '.9rem', color: '#e05555', fontFamily: "'Cinzel Decorative', serif',",
                textAlign: 'center',
              }}>
                ¿Confirmar? {victim.name} se convertirá en lobo esta noche (nadie lo sabrá).
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="ghost" onClick={() => setConfirming(false)}>← Volver</Button>
                <Button variant="danger" onClick={() => onInfect(wolfVictim!)}>
                  ✅ Confirmar infección
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ color: 'rgba(245,230,200,.45)', fontSize: '.9rem', fontStyle: 'italic' }}>
            No hay víctima esta noche — el poder no puede usarse.
          </div>
          <Button variant="ghost" onClick={onPass}>Continuar →</Button>
        </>
      )}
    </PhaseShell>
  );
}
