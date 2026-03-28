import { useThreeBackground } from '../../hooks/useThreeBackground';
import { RulesHero }      from './RulesHero';
import { RulesIntro }     from './RulesIntro';
import { RulesRolesGrid } from './RulesRolesGrid';
import { RulesPhases }    from './RulesPhases';
import { RulesVictory }   from './RulesVictory';
import { RulesTips }      from './RulesTips';

interface Props {
  onGoSetup: () => void;
}

export function RulesPage({ onGoSetup }: Props) {
  const canvasRef = useThreeBackground();

  return (
    <>
      {/* Three.js background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          width: '100%', height: '100%',
        }}
      />

      {/* Scrollable content */}
      <div style={{
        position: 'relative', zIndex: 10,
        maxWidth: '900px', margin: '0 auto',
        padding: '0 24px 120px',
      }}>
        <RulesHero onGoSetup={onGoSetup} />
        <RulesIntro />
        <RulesRolesGrid />
        <RulesPhases />
        <RulesVictory />
        <RulesTips />

        <footer style={{
          textAlign: 'center', padding: '40px 0 20px',
          fontSize: '.85rem', color: 'rgba(201,168,76,0.3)', letterSpacing: '.1em',
        }}>
          © Diseño fan — Basado en el juego original de Philippe des Pallières y Hervé Marly
        </footer>
      </div>
    </>
  );
}
