import { useState } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';
import { HunterShot } from './HunterShot';
import type { Player } from '../../types';
import cardImages from '../../data/cardImages';

interface Props {
  players: Player[];
  eliminatedToday: number[];
  winner: 'villagers' | 'wolves' | 'lovers' | 'angel' | 'albino' | null;
  cupidLovers: [number, number] | null;
  pendingHunterShot: number | null;
  round: number;
  onHunterShoot: (targetIdx: number) => void;
  onNextNight: () => void;
  onRestart: () => void;
}

const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

const faceStyle: React.CSSProperties = {
  position: 'absolute', inset: 0, borderRadius: '10px',
  backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden',
};

// ── Win screen ────────────────────────────────────────────────
function WinScreen({ players, winner, cupidLovers, onRestart }: {
  players: Player[];
  winner: 'villagers' | 'wolves' | 'lovers' | 'angel' | 'albino';
  cupidLovers: [number, number] | null;
  onRestart: () => void;
}) {
  const cfg: Record<string, { icon: string; color: string; title: string; sub: string }> = {
    villagers: { icon: '🏘️', color: '#7ab87a', title: '¡El pueblo triunfa!',         sub: 'La luz vence a las tinieblas. Castronegro sobrevive.' },
    wolves:    { icon: '🐺', color: '#e05555', title: '¡Los Lobos ganan!',             sub: 'La oscuridad se adueña de Castronegro para siempre.' },
    lovers:    { icon: '❤️', color: '#e05555', title: '¡Los enamorados ganan!',        sub: 'El amor todo lo puede, incluso en Castronegro.' },
    angel:     { icon: '😇', color: '#a78bfa', title: '¡El Ángel asciende!',          sub: 'Fue el primero en ser linchado. Gana en solitario.' },
    albino:    { icon: '🐺❄️', color: '#93c5fd', title: '¡El Lobo Albino triunfa!',   sub: 'Eliminó a todos, lobos y aldeanos. Gana en solitario.' },
  };
  const c = cfg[winner] ?? cfg['wolves'];
  return (
    <PhaseShell icon={c.icon} label="Fin de la partida" labelColor={c.color} title={c.title} subtitle={c.sub}>
      {winner === 'lovers' && cupidLovers && (
        <div style={{
          background: 'rgba(139,0,0,.15)', border: '1px solid rgba(224,85,85,.3)',
          borderRadius: '8px', padding: '14px 28px',
          fontFamily: "'Cinzel Decorative', serif", fontSize: '.85rem', color: '#e05555',
        }}>
          ❤️ {players[cupidLovers[0]]?.name} &amp; {players[cupidLovers[1]]?.name}
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '10px', width: '100%', maxWidth: '680px',
      }}>
        {players.map(p => (
          <div key={p.index} style={{
            background: p.alive ? 'rgba(10,6,8,.85)' : 'rgba(0,0,0,.4)',
            border: `1px solid ${p.alive ? 'rgba(201,168,76,.25)' : 'rgba(255,255,255,.06)'}`,
            borderRadius: '8px', padding: '12px 8px', opacity: p.alive ? 1 : 0.4, textAlign: 'center',
          }}>
            {p.role && cardImages[p.role.id] ? (
              <img src={cardImages[p.role.id]} alt={p.role.name}
                style={{ width: '100%', height: '90px', objectFit: 'cover', objectPosition: 'top', borderRadius: '4px', marginBottom: '6px' }} />
            ) : (
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{p.role?.icon ?? '❓'}</div>
            )}
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.68rem', color: p.role?.group === 'wolf' ? '#e05555' : 'var(--gold)', marginBottom: '4px' }}>
              {p.role?.name ?? '?'}
            </div>
            <div style={{ fontSize: '.88rem', color: p.alive ? 'var(--moon)' : 'rgba(245,230,200,.4)' }}>{p.name}</div>
            {cupidLovers && (cupidLovers[0] === p.index || cupidLovers[1] === p.index) && (
              <div style={{ fontSize: '.7rem', color: '#e05555', marginTop: '3px' }}>❤️</div>
            )}
            {!p.alive && <div style={{ fontSize: '.68rem', color: 'rgba(245,230,200,.3)', marginTop: '3px' }}>eliminado</div>}
          </div>
        ))}
      </div>
      <Button variant="primary" style={{ marginTop: '16px' }} onClick={onRestart}>↺ Nueva partida</Button>
    </PhaseShell>
  );
}

// ── Flip card ────────────────────────────────────────────────
function FlipCard({ p, isLover }: { p: Player; isLover: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const isWolf = p.role ? WOLF_IDS.has(p.role.id) : false;

  return (
    <div style={{ width: '180px', perspective: '700px', cursor: 'pointer' }} onClick={() => setFlipped(v => !v)}>
      <div style={{
        width: '100%', height: '265px', position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Back */}
        <div style={{
          ...faceStyle,
          background: 'linear-gradient(135deg, #1a0a10, #0d0507)',
          border: '2px solid rgba(201,168,76,.2)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}>
          <div style={{ fontSize: '3rem', opacity: .35 }}>⚰️</div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.62rem', color: 'rgba(201,168,76,.4)', letterSpacing: '.1em' }}>
            TOCA PARA REVELAR
          </div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: 'rgba(245,230,200,.6)' }}>
            {p.name}
          </div>
          {isLover && <div style={{ fontSize: '.75rem', color: '#e05555' }}>❤️ enamorado/a</div>}
        </div>

        {/* Front */}
        <div style={{
          ...faceStyle, transform: 'rotateY(180deg)',
          background: '#0d0507',
          border: `2px solid ${isWolf ? 'rgba(224,85,85,.5)' : 'rgba(201,168,76,.4)'}`,
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {p.role && cardImages[p.role.id] ? (
            <img src={cardImages[p.role.id]} alt={p.role.name}
              style={{ width: '100%', height: '65%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          ) : (
            <div style={{ height: '65%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.5rem', background: 'linear-gradient(160deg, #1a0a10, #0d0507)' }}>
              {p.role?.icon ?? '❓'}
            </div>
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '4px', padding: '8px 8px 10px',
            background: 'linear-gradient(to bottom, rgba(13,5,7,0), #0d0507 20%)' }}>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.68rem', color: isWolf ? '#e05555' : 'var(--gold)' }}>
              {p.role?.name ?? '?'}
            </div>
            <div style={{ fontSize: '.82rem', color: 'rgba(245,230,200,.8)' }}>{p.name}</div>
            <div style={{ fontSize: '.67rem', color: 'rgba(245,230,200,.5)', textAlign: 'center', lineHeight: 1.35 }}>
              {p.role?.desc}
            </div>
            {isLover && <div style={{ fontSize: '.72rem', color: '#e05555', marginTop: '2px' }}>❤️ enamorado/a</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export function DayEliminate({
  players, eliminatedToday, winner, cupidLovers,
  pendingHunterShot, round, onHunterShoot, onNextNight, onRestart,
}: Props) {
  const [cardsRevealed, setCardsRevealed] = useState(false);

  if (winner) {
    return <WinScreen players={players} winner={winner} cupidLovers={cupidLovers} onRestart={onRestart} />;
  }

  const eliminated = eliminatedToday.map(i => players[i]).filter(Boolean);

  function isLover(idx: number) {
    return !!cupidLovers && (cupidLovers[0] === idx || cupidLovers[1] === idx);
  }

  // Check if hunter is among the eliminated (day lynch context)
  const hunterEliminated = pendingHunterShot !== null
    && eliminatedToday.includes(pendingHunterShot);

  // After cards are shown and hunter needs to fire
  if (cardsRevealed && hunterEliminated && pendingHunterShot !== null) {
    return (
      <HunterShot
        players={players}
        hunterIndex={pendingHunterShot}
        context="day"
        onShoot={onHunterShoot}
      />
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
        : 'Toca cada carta para revelar el rol.'}
      round={round}
    >
      {eliminated.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {eliminated.map(p => (
            <FlipCard key={p.index} p={p} isLover={isLover(p.index)} />
          ))}
        </div>
      )}

      {/* If hunter was lynched, show "hunter fires" button after cards */}
      {hunterEliminated && !cardsRevealed ? (
        <Button variant="ghost" style={{ borderColor: '#f39c12', color: '#f39c12' }} onClick={() => setCardsRevealed(true)}>
          🏹 El Cazador dispara ahora →
        </Button>
      ) : (
        <Button variant="primary" style={{ marginTop: '12px' }} onClick={onNextNight}>
          🌑 Comenzar siguiente noche
        </Button>
      )}
    </PhaseShell>
  );
}
