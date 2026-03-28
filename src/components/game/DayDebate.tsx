import { useState, useEffect, useRef, useCallback } from 'react';
import { PhaseShell } from './PhaseShell';
import { Button } from '../shared/Button';

const INITIAL_SECONDS = 120;

interface Props {
  round: number;
  onEndDebate: () => void;
}

export function DayDebate({ round, onEndDebate }: Props) {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(intervalRef.current!); intervalRef.current = null; setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
  }, []);

  const pause = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setRunning(false);
  }, []);

  const toggle = useCallback(() => {
    running ? pause() : (() => { setRunning(true); start(); })();
  }, [running, pause, start]);

  const addTime = useCallback(() => {
    setSeconds(s => s + 30);
    if (!running) { setRunning(true); start(); }
  }, [running, start]);

  // auto-start
  useEffect(() => { start(); return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, [start]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = (seconds / INITIAL_SECONDS) * 100;
  const urgent = seconds <= 30;
  const timerColor = seconds === 0 ? '#e05555' : urgent ? '#f39c12' : 'var(--gold)';

  return (
    <PhaseShell
      icon="☀️"
      label="Fase Diurna · Debate"
      labelColor="var(--gold)"
      title="El pueblo delibera"
      subtitle="Acusen, defiendan, deduzcan. El tiempo corre."
      round={round}
    >
      {/* Timer circle */}
      <div style={{ position: 'relative', width: '160px', height: '160px', cursor: 'pointer' }} onClick={toggle}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
          <circle
            cx="80" cy="80" r="70" fill="none"
            stroke={timerColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - pct / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke .5s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '2px',
        }}>
          <div style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '2rem', color: timerColor,
            transition: 'color .5s',
            lineHeight: 1,
          }}>
            {mins}:{String(secs).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '.65rem', color: 'rgba(245,230,200,.4)', letterSpacing: '.1em' }}>
            {running ? 'TAP PARA PAUSAR' : seconds === 0 ? 'TIEMPO' : 'PAUSADO'}
          </div>
        </div>
      </div>

      {seconds === 0 && (
        <div style={{
          background: 'rgba(224,85,85,.1)', border: '1px solid rgba(224,85,85,.3)',
          borderRadius: '8px', padding: '12px 24px',
          fontFamily: "'Cinzel Decorative', serif", fontSize: '.85rem', color: '#e05555',
          animation: 'pulse 1s infinite',
        }}>
          ⏰ ¡Tiempo agotado! Es hora de votar.
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="ghost" onClick={addTime}>
          +30 segundos
        </Button>
        <Button variant="primary" onClick={onEndDebate}>
          Terminar debate → Votar
        </Button>
      </div>
    </PhaseShell>
  );
}
