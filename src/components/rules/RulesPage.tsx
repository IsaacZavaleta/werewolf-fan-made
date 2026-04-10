import { useThreeBackground } from '../../hooks/useThreeBackground';
import { RulesHero } from './RulesHero';
import { RulesIntro } from './RulesIntro';
import { RulesRolesGrid } from './RulesRolesGrid';
import { RulesPhases } from './RulesPhases';
import { RulesVictory } from './RulesVictory';
import { RulesTips } from './RulesTips';

interface Props {
  onGoSetup: () => void;
}

export function RulesPage({ onGoSetup }: Props) {
  const canvasRef = useThreeBackground();


  const verifyPasswordToAccess = () => {
    const password = prompt("Bloqueo fast para evitar reclamos de derecho de autor.\n\nIngresa la contraseña para acceder a la preparación de la partida:");
    if (password === "lorem ipsum") {
      onGoSetup();
    } else {
      alert("Contraseña incorrecta. No puedes acceder a la preparación de la partida.");
    }
  }

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
        <RulesHero onGoSetup={verifyPasswordToAccess} />
        <RulesIntro />
        <RulesRolesGrid />
        <RulesPhases />
        <RulesVictory />
        <RulesTips />

        <footer style={{
          textAlign: 'center', padding: '40px 0 20px',
          fontSize: '.85rem', color: 'rgba(201,168,76,0.3)', letterSpacing: '.1em',
        }}>
          <div>

            © Game fan — Basado en el juego original de Philippe des Pallières y Hervé Marly.
          </div>
          <div>
            Favor de no denunciarm, solo lo hice para practicar y las denuncias me dan amsiedad 😢
          </div>
        </footer>
      </div>
    </>
  );
}
