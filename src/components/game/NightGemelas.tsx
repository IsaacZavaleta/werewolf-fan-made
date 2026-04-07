import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  onConfirm: () => void;
}

export function NightGemelas({ players, onConfirm }: Props) {
  const twins = players.filter(p => p.alive && p.role?.id === 'gemelas');

  return (
    <PhaseShell
      icon="👯"
      label="Primera Noche · Gemelas"
      labelColor="#a78bfa"
      title="Las Gemelas despiertan"
      subtitle="Solo las gemelas abren los ojos y se reconocen mutuamente."
    >
      <div style={{
        background: 'rgba(167,139,250,.08)', border: '1px solid rgba(167,139,250,.2)',
        borderRadius: '8px', padding: '20px 32px', maxWidth: '440px',
        fontSize: '.9rem', color: 'rgba(245,230,200,.75)', lineHeight: 1.7, textAlign: 'center',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👯</div>
        {twins.length >= 2 ? (
          <>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.85rem', color: '#a78bfa', marginBottom: '8px' }}>
              {twins[0].name} &amp; {twins[1].name}
            </div>
            <div>
              Se reconocen. Deberán votar siempre a la misma persona y pueden coordinarse en silencio algunas noches.
              <br /><br />
              <span style={{ opacity: .6, fontSize: '.83rem' }}>
                Si una muere, la otra puede elegir sobrevivir o morir junto a su hermana.
              </span>
            </div>
          </>
        ) : (
          <div style={{ opacity: .6 }}>Solo hay una gemela activa en la partida.</div>
        )}
      </div>

      <Button variant="primary" onClick={onConfirm}>
        Las Gemelas cierran los ojos →
      </Button>
    </PhaseShell>
  );
}
