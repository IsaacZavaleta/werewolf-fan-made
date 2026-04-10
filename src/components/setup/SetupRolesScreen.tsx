import { ROLES } from '../../data/roles';
import { RoleToggle } from './RoleToggle';
import { Button } from '../shared/Button';
import type { RoleStates, Screen } from '../../types';

interface Props {
  playerCount: number;
  roleStates: RoleStates;
  assignedCount: number;
  rolesError: string;
  onToggle: (id: string) => void;
  onCountChange: (id: string, delta: 1 | -1) => void;
  onDeal: () => void;
  onBack: (s: Screen) => void;
}

const cardStyle: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '28px 30px',
  width: '100%',
  maxWidth: '700px',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 8px 40px rgba(0,0,0,.6)',
  marginBottom: '20px',
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      margin: '20px 0 16px', color: 'rgba(201,168,76,.35)', fontSize: '.8rem',
    }}>
      <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,.15)' }} />
      {label}
      <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,.15)' }} />
    </div>
  );
}

function RolesGrid({ ids, roleStates, onToggle, onCountChange }: {
  ids: string[];
  roleStates: RoleStates;
  onToggle: (id: string) => void;
  onCountChange: (id: string, delta: 1 | -1) => void;
}) {
  const roles = ROLES.filter((r) => ids.includes(r.id));
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '12px',
    }}>
      {roles.map((role) => (
        <RoleToggle
          key={role.id}
          role={role}
          active={roleStates[role.id]?.active ?? false}
          count={roleStates[role.id]?.count ?? role.default}
          onToggle={() => onToggle(role.id)}
          onCountChange={(delta) => onCountChange(role.id, delta)}
        />
      ))}
    </div>
  );
}

export function SetupRolesScreen({
  playerCount,
  roleStates,
  assignedCount,
  rolesError,
  onToggle,
  onCountChange,
  onDeal,
  onBack,
}: Props) {
  const pct = playerCount ? Math.min(100, (assignedCount / playerCount) * 100) : 0;

  const wolfIds    = ROLES.filter((r) => r.group === 'wolf').map((r) => r.id);
  const specialIds = ROLES.filter((r) => r.group === 'special').map((r) => r.id);
  const neutralIds = ROLES.filter((r) => r.group === 'neutral').map((r) => r.id);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 20px 80px',
      animation: 'fadeIn .4s ease',
    }}>
      <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.8rem', color: 'var(--gold)', opacity: .55, marginBottom: '8px', marginTop: '20px' }}>
        Paso 2 de 2
      </div>
      <h1 style={{
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 'clamp(1.4rem, 5vw, 2.4rem)',
        background: 'linear-gradient(160deg, var(--gold), var(--moon), var(--gold))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        marginBottom: '4px',
      }}>Roles</h1>
      <p style={{ fontStyle: 'italic', color: 'rgba(245,230,200,.5)', fontSize: '1rem', marginBottom: '32px' }}>
        Activa los roles y ajusta la cantidad
      </p>

      <div style={cardStyle}>
        {/* Slot bar */}
        <div style={{ fontSize: '.9rem', textAlign: 'center', color: 'rgba(245,230,200,.6)', marginBottom: '4px' }}>
          Roles asignados: {assignedCount} / {playerCount}
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,.08)', borderRadius: '2px', marginBottom: '18px' }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--gold), #e05555)',
            width: `${pct}%`, transition: 'width .3s',
          }} />
        </div>

        {/* Wolves */}
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '.95rem', color: '#e05555', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🐺</span> Sirvientes de la luna
        </div>
        <RolesGrid ids={wolfIds} roleStates={roleStates} onToggle={onToggle} onCountChange={onCountChange} />

        <SectionDivider label="Defensores" />
        <RolesGrid ids={specialIds} roleStates={roleStates} onToggle={onToggle} onCountChange={onCountChange} />

        <SectionDivider label="Aldeanos & Otros" />
        <RolesGrid ids={neutralIds} roleStates={roleStates} onToggle={onToggle} onCountChange={onCountChange} />
      </div>

      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="ghost" onClick={() => onBack('setup-players')}>← Volver</Button>
        <Button variant="primary" onClick={onDeal}>🃏 Repartir roles</Button>
      </div>

      {rolesError && (
        <div style={{ color: '#e05555', fontSize: '.88rem', marginTop: '12px', textAlign: 'center' }}>
          {rolesError}
        </div>
      )}
    </div>
  );
}
