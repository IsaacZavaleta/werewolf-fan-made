import { Button } from '../shared/Button';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function StartDialog({ visible, onClose, onConfirm }: Props) {
  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn .3s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a10 0%, #0d0507 100%)',
        border: '1px solid rgba(201,168,76,.35)',
        borderRadius: '8px',
        padding: '36px 40px',
        maxWidth: '420px', width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,.8)',
        animation: 'popIn .3s cubic-bezier(.4,0,.2,1)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌑</div>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: '1.3rem', color: 'var(--gold)', marginBottom: '10px' }}>
          ¿Comenzar la partida?
        </div>
        <p style={{ color: 'rgba(245,230,200,.75)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '28px' }}>
          Todos los jugadores han recibido su rol. Que el narrador tome el control y comience la primera noche.
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="ghost" onClick={onClose}>← Revisar</Button>
          <Button variant="danger" onClick={onConfirm}>🐺 ¡Comenzar!</Button>
        </div>
      </div>
    </div>
  );
}
