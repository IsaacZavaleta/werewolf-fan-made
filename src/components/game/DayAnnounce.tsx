import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  eliminatedToday: number[];
  cupidLovers: [number, number] | null;
  round: number;
  pendingHunterShot: number | null;
  caballeroDied: boolean;
  // What to do next — GamePage decides the step order
  onContinue: () => void;          // → hunter fires (if pending) OR debate
  continueLabel?: string;
}

export function DayAnnounce({
  players, eliminatedToday, cupidLovers, round,
  pendingHunterShot, caballeroDied,
  onContinue, continueLabel,
}: Props) {
  const dead = eliminatedToday.map(i => players[i]).filter(Boolean);

  function deathReason(p: Player): string {
    if (cupidLovers) {
      const [a, b] = cupidLovers;
      const partner = p.index === a ? b : p.index === b ? a : -1;
      if (partner !== -1 && eliminatedToday.includes(partner)) return '💔 Murió de amor';
    }
    return 'Eliminado esta noche';
  }

  // Decide what button label to show
  const btnLabel = continueLabel ?? (
    pendingHunterShot !== null
      ? '🏹 El Cazador dispara →'
      : caballeroDied
      ? '⚔️ El Caballero actúa →'
      : 'Iniciar debate →'
  );

  return (
    <PhaseShell
      icon="🌅"
      label="Amanecer"
      labelColor="var(--gold)"
      title="El sol sale sobre Castronegro"
      subtitle="El pueblo abre los ojos y descubre lo que ocurrió durante la noche."
      round={round}
    >
      {dead.length === 0 ? (
        <div style={{
          background: 'rgba(30,80,30,.15)', border: '1px solid rgba(100,180,100,.2)',
          borderRadius: '8px', padding: '20px 32px', color: '#7ab87a',
          fontFamily: "'Cinzel Decorative', serif", fontSize: '.9rem',
        }}>
          ✨ Esta noche no ha muerto nadie
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '440px' }}>
          {dead.map(p => (
            <div key={p.index} style={{
              background: 'rgba(139,0,0,.15)', border: '1px solid rgba(224,85,85,.25)',
              borderRadius: '8px', padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(139,0,0,.3)', border: '1px solid rgba(224,85,85,.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Cinzel Decorative', serif", fontSize: '.9rem', color: '#e05555', flexShrink: 0,
              }}>
                {p.name.charAt(0)}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.85rem', color: '#e05555' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '.8rem', color: 'rgba(245,230,200,.45)', marginTop: '2px' }}>
                  {deathReason(p)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        maxWidth: '440px', padding: '14px 24px',
        background: 'rgba(0,0,0,.3)', borderRadius: '8px',
        fontStyle: 'italic', color: 'rgba(245,230,200,.5)', fontSize: '.9rem', lineHeight: 1.65,
      }}>
        <em>"{
          pendingHunterShot !== null
            ? 'Pero el Cazador tiene un último disparo.'
            : caballeroDied
            ? 'La espada oxidada del Caballero aún tiene efecto.'
            : 'Es hora de que el pueblo delibere.'
        }"</em>
      </div>

      <Button
        variant={pendingHunterShot !== null || caballeroDied ? 'danger' : 'primary'}
        onClick={onContinue}
      >
        {btnLabel}
      </Button>
    </PhaseShell>
  );
}
