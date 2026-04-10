import { useGameSetup } from '../../hooks/useGameSetup';
import { LandingScreen }      from './LandingScreen';
import { SetupPlayersScreen } from './SetupPlayersScreen';
import { SetupRolesScreen }   from './SetupRolesScreen';
import { RevealScreen }       from './RevealScreen';
import { StartDialog }        from './StartDialog';
import { GamePage }           from '../game/GamePage';

interface Props {
  onGoRules: () => void;
}

// ── Original starfield background ────────────────────────────
function StarField() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at 70% 20%, #1a0a20 0%, #0a0608 60%)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: [
          'radial-gradient(1px 1px at 10% 15%, rgba(245,230,200,.7) 0%, transparent 100%)',
          'radial-gradient(1px 1px at 25% 40%, rgba(245,230,200,.5) 0%, transparent 100%)',
          'radial-gradient(1.5px 1.5px at 40% 8%, rgba(201,168,76,.6) 0%, transparent 100%)',
          'radial-gradient(1px 1px at 60% 25%, rgba(245,230,200,.6) 0%, transparent 100%)',
          'radial-gradient(1px 1px at 75% 55%, rgba(245,230,200,.4) 0%, transparent 100%)',
          'radial-gradient(1.5px 1.5px at 88% 12%, rgba(245,230,200,.7) 0%, transparent 100%)',
          'radial-gradient(1px 1px at 15% 70%, rgba(245,230,200,.5) 0%, transparent 100%)',
          'radial-gradient(1px 1px at 50% 80%, rgba(201,168,76,.4) 0%, transparent 100%)',
          'radial-gradient(1.5px 1.5px at 92% 75%, rgba(245,230,200,.6) 0%, transparent 100%)',
          'radial-gradient(1px 1px at 33% 90%, rgba(245,230,200,.4) 0%, transparent 100%)',
        ].join(', '),
      }} />
    </div>
  );
}

export function SetupApp({ onGoRules }: Props) {
  const game = useGameSetup();

  return (
    <>
      <StarField />

      <div style={{ position: 'relative', zIndex: 10 }}>

        {game.screen === 'landing' && (
          <LandingScreen onNext={game.goTo} onGoRules={onGoRules} />
        )}

        {game.screen === 'setup-players' && (
          <SetupPlayersScreen
            playerCount={game.playerCount}
            playerNames={game.playerNames}
            onSetCount={game.setPlayerCount}
            onInitNames={game.initPlayerNames}
            onSetName={game.setPlayerName}
            onBack={game.goTo}
            onNext={game.goTo}
          />
        )}

        {game.screen === 'setup-roles' && (
          <SetupRolesScreen
            playerCount={game.playerCount}
            roleStates={game.roleStates}
            assignedCount={game.assignedCount}
            rolesError={game.rolesError}
            onToggle={game.toggleRole}
            onCountChange={game.changeRoleCount}
            onDeal={game.dealRoles}
            onBack={game.goTo}
          />
        )}

        {game.screen === 'reveal' && (
          <RevealScreen
            players={game.players}
            currentIndex={game.currentIndex}
            onMove={game.movePlayer}
          />
        )}

        {game.screen === 'game' && (
          <GamePage
            players={game.players}
            onRestart={game.resetAll}
          />
        )}

      </div>

      <StartDialog
        visible={game.showStartDialog}
        onClose={() => game.setShowStartDialog(false)}
        onConfirm={game.startGame}
      />
    </>
  );
}
