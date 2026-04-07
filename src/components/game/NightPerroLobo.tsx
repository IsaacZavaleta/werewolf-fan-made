import { PhaseShell } from './PhaseShell';

interface Props {
  playerName: string;
  onChoose: (side: 'wolf' | 'villager') => void;
}

export function NightPerroLobo({ playerName, onChoose }: Props) {
  return (
    <PhaseShell
      icon="🐕🌙"
      label="Primera Noche · Perro Lobo"
      labelColor="#e05555"
      title="El Perro Lobo despierta"
      subtitle={`Solo ${playerName} abre los ojos. Elige tu bando para toda la partida.`}
    >
      <div style={{
        background: 'rgba(139,0,0,.1)', border: '1px solid rgba(224,85,85,.2)',
        borderRadius: '8px', padding: '14px 24px', maxWidth: '440px',
        fontSize: '.9rem', color: 'rgba(245,230,200,.7)', lineHeight: 1.65, textAlign: 'center',
      }}>
        🐕 Esta decisión es permanente. El Perro Lobo nunca puede cambiar de bando.
        <br /><span style={{ opacity: .6, fontSize: '.83rem' }}>El narrador recordará tu elección en secreto.</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => onChoose('wolf')} style={sideBtn('rgba(139,0,0,.2)', 'rgba(224,85,85,.3)')}>
          <span style={{ fontSize: '2rem' }}>🐺</span>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: '#e05555' }}>Bando Lobo</div>
          <div style={{ fontSize: '.8rem', color: 'rgba(245,230,200,.55)', lineHeight: 1.4 }}>
            Me uno a los Hombres Lobo.<br />Gano si ganan ellos.
          </div>
        </button>

        <button onClick={() => onChoose('villager')} style={sideBtn('rgba(30,80,30,.2)', 'rgba(100,180,100,.3)')}>
          <span style={{ fontSize: '2rem' }}>🌾</span>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: '#7ab87a' }}>Bando Aldeano</div>
          <div style={{ fontSize: '.8rem', color: 'rgba(245,230,200,.55)', lineHeight: 1.4 }}>
            Defiendo al pueblo.<br />Gano si ganan los aldeanos.
          </div>
        </button>
      </div>
    </PhaseShell>
  );
}

function sideBtn(bg: string, border: string): React.CSSProperties {
  return {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    background: bg, border: `1px solid ${border}`,
    borderRadius: '10px', padding: '20px 28px',
    cursor: 'pointer', transition: 'all .2s',
    color: 'var(--moon)', fontFamily: "'Crimson Text', serif",
    minWidth: '160px',
  };
}
