import type { CSSProperties } from 'react';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  round: number;
  phase: string;
  cupidLovers: [number, number] | null;
}

const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

export function StatusBar({ players, round, phase, cupidLovers }: Props) {
  const alive = players.filter(p => p.alive);
  const dead  = players.filter(p => !p.alive);
  const wolves     = alive.filter(p => p.role && WOLF_IDS.has(p.role.id)).length;
  const villagers  = alive.filter(p => !p.role || !WOLF_IDS.has(p.role.id)).length;
  const isNight    = phase.startsWith('night');

  return (
    <div style={bar}>
      {/* Phase pill */}
      <div style={{
        ...pill,
        background: isNight ? 'rgba(100,50,150,.25)' : 'rgba(201,168,76,.15)',
        borderColor: isNight ? 'rgba(150,80,220,.35)' : 'rgba(201,168,76,.3)',
        color: isNight ? '#c084fc' : 'var(--gold)',
      }}>
        {isNight ? '🌑' : '☀️'} Ronda {round}
      </div>

      {/* Alive counts */}
      <div style={counters}>
        <span style={{ color: 'rgba(245,230,200,.7)', fontSize: '.8rem' }}>
          👥 {alive.length} vivos
        </span>
        <span style={{ color: '#e05555', fontSize: '.8rem' }}>
          🐺 {wolves}
        </span>
        <span style={{ color: '#7ab87a', fontSize: '.8rem' }}>
          🌾 {villagers}
        </span>
        {cupidLovers && (
          <span style={{ color: '#e05555', fontSize: '.8rem' }}>
            ❤️ amantes
          </span>
        )}
      </div>

      {/* Dead players */}
      {dead.length > 0 && (
        <div style={deadRow}>
          {dead.map(p => (
            <div key={p.index} style={deadBadge} title={p.role?.name ?? '?'}>
              <span style={{ opacity: .5 }}>{p.name.charAt(0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const bar: CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
  background: 'rgba(10,6,8,.88)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(201,168,76,.12)',
  display: 'flex', alignItems: 'center',
  gap: '12px', padding: '8px 16px',
  flexWrap: 'wrap',
};

const pill: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: '.7rem', letterSpacing: '.1em',
  padding: '4px 12px', borderRadius: '20px',
  border: '1px solid',
  flexShrink: 0,
};

const counters: CSSProperties = {
  display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
};

const deadRow: CSSProperties = {
  display: 'flex', gap: '4px', marginLeft: 'auto',
};

const deadBadge: CSSProperties = {
  width: '22px', height: '22px', borderRadius: '50%',
  background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(255,255,255,.1)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '.7rem', color: 'rgba(245,230,200,.4)',
};
