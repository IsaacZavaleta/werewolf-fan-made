import { useState } from 'react';
import { Button } from '../shared/Button';
import type { Screen } from '../../types';

interface Props {
  playerCount: number;
  playerNames: string[];
  onSetCount: (n: number) => void;
  onInitNames: (n: number) => void;
  onSetName: (i: number, v: string) => void;
  onBack: (s: Screen) => void;
  onNext: (s: Screen) => void;
}

const cardStyle: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '28px 30px',
  width: '100%',
  maxWidth: '640px',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 8px 40px rgba(0,0,0,.6)',
  marginBottom: '20px',
};

export function SetupPlayersScreen({
  playerCount,
  playerNames,
  onSetCount,
  onInitNames,
  onSetName,
  onBack,
  onNext,
}: Props) {
  const [localCount, setLocalCount] = useState<string>(String(playerCount));
  const [error, setError] = useState<string>('');
  const [generated, setGenerated] = useState<boolean>(false);

  function handleGenerate() {
    const n = parseInt(localCount, 10);
    if (isNaN(n) || n < 4 || n > 18) {
      setError('Debe ser entre 4 y 18 jugadores.');
      return;
    }
    setError('');
    onSetCount(n);
    onInitNames(n);
    setGenerated(true);
  }

  function handleNext() {
    if (!generated || playerNames.length === 0) return;
    onNext('setup-roles');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px 80px',
      animation: 'fadeIn .4s ease',
    }}>
      <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: 'var(--gold)', opacity: .55, marginBottom: '8px', marginTop: '20px' }}>
        Paso 1 de 2
      </div>
      <h1 style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 'clamp(1.4rem, 5vw, 2.4rem)',
        background: 'linear-gradient(160deg, var(--gold), var(--moon), var(--gold))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        marginBottom: '4px',
      }}>Jugadores</h1>
      <p style={{ fontStyle: 'italic', color: 'rgba(245,230,200,.5)', fontSize: '1rem', marginBottom: '32px' }}>
        ¿Cuántos juegan y cómo se llaman?
      </p>

      {/* Count card */}
      <div style={cardStyle}>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.95rem', color: 'var(--gold)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>👥</span> Número de jugadores
        </div>
        <label style={{ fontSize: '.9rem', color: 'rgba(245,230,200,.7)', display: 'block', marginBottom: '6px' }}>
          Participantes (4–18)
        </label>
        <input
          type="number"
          min={4}
          max={18}
          value={localCount}
          onChange={(e) => { setLocalCount(e.target.value); setError(''); setGenerated(false); }}
          style={{
            width: '100%', background: 'rgba(0,0,0,.5)',
            border: '1px solid rgba(201,168,76,.25)', borderRadius: '4px',
            color: 'var(--moon)', fontFamily: "'Crimson Text', serif", fontSize: '1.05rem',
            padding: '10px 14px', outline: 'none',
          }}
        />
        {error && <div style={{ color: '#e05555', fontSize: '.88rem', marginTop: '6px' }}>{error}</div>}
        <Button variant="ghost" style={{ marginTop: '14px', width: '100%' }} onClick={handleGenerate}>
          Generar lista →
        </Button>
      </div>

      {/* Names card */}
      {generated && playerNames.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.95rem', color: 'var(--gold)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✍️</span> Nombres
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {playerNames.map((name, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn .25s ease' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.8rem', color: 'var(--gold)', flexShrink: 0,
                  fontFamily: "'Cinzel Decorative', serif",
                }}>
                  {i + 1}
                </div>
                <input
                  type="text"
                  placeholder={`Jugador ${i + 1}`}
                  value={name.startsWith('Jugador ') ? '' : name}
                  onChange={(e) => onSetName(i, e.target.value || `Jugador ${i + 1}`)}
                  maxLength={22}
                  style={{
                    flex: 1, background: 'rgba(0,0,0,.5)',
                    border: '1px solid rgba(201,168,76,.25)', borderRadius: '4px',
                    color: 'var(--moon)', fontFamily: "'Crimson Text', serif", fontSize: '1.05rem',
                    padding: '10px 14px', outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
        <Button variant="ghost" onClick={() => onBack('landing')}>← Volver</Button>
        {generated && (
          <Button variant="primary" onClick={handleNext}>Siguiente → Roles</Button>
        )}
      </div>
    </div>
  );
}
