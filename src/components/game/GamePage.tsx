import { useGame } from '../../hooks/useGame';
import type { Player } from '../../types';

import { NightAnnounce }  from './NightAnnounce';
import { NightGirlHint }  from './NightGirlHint';
import { NightWolves }    from './NightWolves';
import { NightVidente }   from './NightVidente';
import { NightBruja }     from './NightBruja';
import { NightProtector } from './NightProtector';
import { DayAnnounce }    from './DayAnnounce';
import { DayDebate }      from './DayDebate';
import { DayVote }        from './DayVote';
import { DayEliminate }   from './DayEliminate';

interface Props {
  players: Player[];
  onRestart: () => void;
}

export function GamePage({ players, onRestart }: Props) {
  const {
    gs,
    confirmNightAnnounce,
    confirmGirlHint,
    wolvesPickVictim,
    confirmVidente,
    witchSave, witchKill, witchPass,
    protectorProtect,
    skipNightRole,
    startDebate,
    startVote,
    selectLynch,
    confirmLynch,
    skipLynch,
    nextNight,
  } = useGame(players);

  const {
    phase, players: gp, round, nightResult,
    witchLifeUsed, witchDeathUsed,
    protectorLastProtected,
    eliminatedToday, winner,
  } = gs;

  function playerName(roleId: string) {
    return gp.find(p => p.alive && p.role?.id === roleId)?.name ?? roleId;
  }

  switch (phase) {

    case 'night-announce':
      return <NightAnnounce round={round} onConfirm={confirmNightAnnounce} />;

    case 'night-girl-hint':
      return <NightGirlHint girlName={playerName('ninia')} onConfirm={confirmGirlHint} />;

    case 'night-wolves':
      return <NightWolves players={gp} round={round} onConfirm={wolvesPickVictim} />;

    case 'night-role-vidente':
      return (
        <NightVidente
          players={gp}
          videnteName={playerName('vidente')}
          onConfirm={confirmVidente}
        />
      );

    case 'night-role-bruja':
      return (
        <NightBruja
          players={gp}
          brujaName={playerName('bruja')}
          wolfVictim={nightResult.wolfVictim}
          lifeUsed={witchLifeUsed}
          deathUsed={witchDeathUsed}
          onSave={witchSave}
          onKill={witchKill}
          onPass={witchPass}
        />
      );

    case 'night-role-protector':
      return (
        <NightProtector
          players={gp}
          protectorName={playerName('protector')}
          lastProtected={protectorLastProtected}
          onConfirm={protectorProtect}
          onSkip={skipNightRole}
        />
      );

    case 'night-role-cupido':
    case 'night-role-zorro':
    case 'day-resolve':
      // day-resolve is transient — should never render; fallthrough to announce
      return <NightAnnounce round={round} onConfirm={skipNightRole} />;

    case 'day-announce':
      return (
        <DayAnnounce
          players={gp}
          eliminatedToday={eliminatedToday}
          round={round}
          onDebate={startDebate}
        />
      );

    case 'day-debate':
      return <DayDebate round={round} onEndDebate={startVote} />;

    case 'day-vote':
      return (
        <DayVote
          players={gp}
          round={round}
          onConfirmLynch={(idx) => { selectLynch(idx); confirmLynch(); }}
          onSkipLynch={skipLynch}
        />
      );

    case 'day-eliminate':
      return (
        <DayEliminate
          players={gp}
          eliminatedToday={eliminatedToday}
          winner={winner}
          round={round}
          onNextNight={nextNight}
          onRestart={onRestart}
        />
      );

    default:
      return <NightAnnounce round={round} onConfirm={confirmNightAnnounce} />;
  }
}
