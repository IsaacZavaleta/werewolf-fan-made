import { Card } from '../shared/Card';
import { SectionDivider } from '../shared/SectionDivider';

export function RulesIntro() {
  return (
    <>
      <SectionDivider icon="🌕" />
      <h2 style={h2}>¿Qué es este juego?</h2>
      <Card>
        <p style={p}>
          <strong>Hombres Lobo de Castronegro</strong> es un juego de deducción social para{' '}
          <strong>8 a 18 jugadores</strong> en el que un pueblo medieval intenta descubrir y eliminar
          a los Hombres Lobo escondidos entre sus habitantes.
        </p>
        <p style={p}>
          Hay dos bandos ocultos: los <strong>Aldeanos</strong>, que son mayoría pero desconocen
          quién es quién, y los <strong>Hombres Lobo</strong>, que conocen a sus compinches.
          Cada ronda alterna una fase de <em>noche</em> —los lobos actúan en secreto— y una fase
          de <em>día</em> —todos debaten y votan para linchar a un sospechoso.
        </p>
        <p style={{ ...p, marginBottom: 0 }}>
          Uno de los jugadores actúa como <strong>Narrador</strong>: no juega activamente, sino
          que dirige la partida, anuncia los eventos y mantiene el secreto de los roles.
        </p>
      </Card>

      <SectionDivider icon="🃏" />
      <h2 style={h2}>Preparación de la partida</h2>
      <Card>
        <p style={p}>
          <strong>1. El Narrador</strong> selecciona las cartas de rol según el número de
          jugadores y las baraja boca abajo. Se recomienda 1 Hombre Lobo por cada 3–4 aldeanos.
        </p>
        <p style={p}>
          <strong>2. Reparto secreto.</strong> Cada jugador toma una carta y la mira en privado
          sin revelarla a nadie más.
        </p>
        <p style={p}>
          <strong>3. Primera noche.</strong> El Narrador pide a todos cerrar los ojos y va llamando
          a cada rol especial para que se identifiquen. Los Lobos se reconocen entre sí en este momento.
        </p>
        <p style={{ ...p, marginBottom: 0 }}>
          <strong>4. Amanecer.</strong> Todos abren los ojos y comienza el primer día de debate.
        </p>
      </Card>
    </>
  );
}

const h2: React.CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(1.2rem, 4vw, 2rem)',
  color: 'var(--gold)', marginBottom: '20px',
};

const p: React.CSSProperties = {
  fontSize: '1.1rem', lineHeight: 1.75,
  color: 'rgba(245,230,200,0.85)', marginBottom: '12px',
};
