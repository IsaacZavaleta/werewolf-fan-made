import type { CSSProperties } from 'react';
import { SectionDivider } from '../shared/SectionDivider';
import { Card } from '../shared/Card';

export function RulesVictory() {
  return (
    <>
      <SectionDivider icon="⚔️" />
      <h2 style={h2}>Condiciones de victoria</h2>

      <div style={gridStyle}>
        <VictoryCard
          icon="🏘️"
          title="Aldeanos ganan"
          text="Cuando todos los Hombres Lobo han sido eliminados. Roles especiales y aldeanos básicos comparten la victoria."
          variant="villagers"
        />
        <VictoryCard
          icon="🐺"
          title="Lobos ganan"
          text="Cuando los Lobos igualan o superan en número a los aldeanos restantes y el pueblo ya no puede defenderse."
          variant="wolves"
        />
      </div>

      <Card>
        <p style={p}>
          ⚠️ <strong>Excepción — Los Amantes:</strong> Si Cupido unió a dos jugadores de bandos
          distintos, forman un tercer bando. Ganan si son los dos últimos supervivientes,
          sin importar lobos ni aldeanos.
        </p>
      </Card>
    </>
  );
}

// ── Victory card ──────────────────────────────────────────────
type VictoryVariant = 'villagers' | 'wolves';

const variantStyles: Record<VictoryVariant, { bg: string; border: string; color: string }> = {
  villagers: { bg: 'rgba(30,60,30,.5)',  border: 'rgba(100,180,100,.25)', color: '#7ab87a' },
  wolves:    { bg: 'rgba(80,10,10,.5)',  border: 'rgba(200,50,50,.25)',   color: '#e05555' },
};

function VictoryCard({ icon, title, text, variant }: {
  icon: string; title: string; text: string; variant: VictoryVariant;
}) {
  const v = variantStyles[variant];
  return (
    <div style={{
      padding: '22px', borderRadius: '4px', textAlign: 'center',
      background: v.bg, border: `1px solid ${v.border}`,
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '.95rem', marginBottom: '10px', color: v.color,
      }}>
        {title}
      </h3>
      <p style={{ fontSize: '.95rem', color: 'rgba(245,230,200,.8)', lineHeight: 1.6, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

const h2: CSSProperties = {
  fontFamily: "'Cinzel Decorative', serif",
  fontSize: 'clamp(1.2rem, 4vw, 2rem)',
  color: 'var(--gold)', marginBottom: '20px',
};

const gridStyle: CSSProperties = {
  display: 'grid', gridTemplateColumns: '1fr 1fr',
  gap: '18px', marginBottom: '18px',
};

const p: CSSProperties = {
  fontSize: '1.1rem', lineHeight: 1.75,
  color: 'rgba(245,230,200,0.85)', margin: 0,
};
