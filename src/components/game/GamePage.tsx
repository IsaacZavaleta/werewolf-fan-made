import { useGame }       from '../../hooks/useGame';
import type { Player }   from '../../types';

import { StatusBar }     from './StatusBar';
import { NightAnnounce } from './NightAnnounce';
import { NightGirlHint } from './NightGirlHint';
import { NightWolves }   from './NightWolves';
import { NightVidente }  from './NightVidente';
import { NightBruja }    from './NightBruja';
import { NightProtector }from './NightProtector';
import { NightCupido }   from './NightCupido';
import { NightZorro }    from './NightZorro';
import { DayAnnounce }   from './DayAnnounce';
import { DayDebate }     from './DayDebate';
import { DayVote }       from './DayVote';
import { DayEliminate }  from './DayEliminate';

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
    cupidSetLovers,
    zorroCheck,
    skipNightRole,
    startDebate,
    startVote,
    confirmLynch,
    skipLynch,
    nextNight,
  } = useGame(players);

  const {
    phase, players: gp, round,
    nightResult,
    witchLifeUsed, witchDeathUsed,
    protectorLastProtected,
    cupidLovers, zorroActive,
    eliminatedToday, winner,
  } = gs;

  function getName(roleId: string) {
    return gp.find(p => p.alive && p.role?.id === roleId)?.name ?? roleId;
  }

  const screenContent = (() => {
    // ── Night ────────────────────────────────────────────────
    if (phase === 'night-announce')
      return <NightAnnounce round={round} onConfirm={confirmNightAnnounce} />;

    if (phase === 'night-girl-hint')
      return <NightGirlHint girlName={getName('ninia')} onConfirm={confirmGirlHint} />;

    if (phase === 'night-wolves')
      return <NightWolves players={gp} round={round} onConfirm={wolvesPickVictim} />;

    if (phase === 'night-role-vidente')
      return (
        <NightVidente
          players={gp}
          videnteName={getName('vidente')}
          onConfirm={confirmVidente}
        />
      );

    if (phase === 'night-role-bruja')
      return (
        <NightBruja
          players={gp}
          brujaName={getName('bruja')}
          wolfVictim={nightResult.wolfVictim}
          lifeUsed={witchLifeUsed}
          deathUsed={witchDeathUsed}
          onSave={witchSave}
          onKill={witchKill}
          onPass={witchPass}
        />
      );

    if (phase === 'night-role-protector')
      return (
        <NightProtector
          players={gp}
          protectorName={getName('protector')}
          lastProtected={protectorLastProtected}
          onConfirm={protectorProtect}
          onSkip={skipNightRole}
        />
      );

    if (phase === 'night-role-cupido')
      return (
        <NightCupido
          players={gp}
          cupidName={getName('cupido')}
          onConfirm={cupidSetLovers}
          onSkip={skipNightRole}
        />
      );

    if (phase === 'night-role-zorro')
      return (
        <NightZorro
          players={gp}
          zorroName={getName('zorro')}
          zorroActive={zorroActive}
          onConfirm={(centerIdx, hadWolf) => zorroCheck(centerIdx, hadWolf)}
          onSkip={skipNightRole}
        />
      );

    // ── Day ──────────────────────────────────────────────────
    if (phase === 'day-announce')
      return (
        <DayAnnounce
          players={gp}
          eliminatedToday={eliminatedToday}
          cupidLovers={cupidLovers}
          round={round}
          onContinue={startDebate}
        />
      );

    if (phase === 'day-debate')
      return <DayDebate key={round} round={round} onEndDebate={startVote} />;

    if (phase === 'day-vote')
      return (
        <DayVote
          players={gp}
          round={round}
          cupidLovers={cupidLovers}
          onConfirmLynch={confirmLynch}
          onSkipLynch={skipLynch}
        />
      );

    if (phase === 'day-eliminate')
      return (
        <DayEliminate
          players={gp}
          eliminatedToday={eliminatedToday}
          winner={winner}
          cupidLovers={cupidLovers}
          round={round}
          onNextNight={nextNight}
          onRestart={onRestart}
        />
      );

    // Safety fallback
    return <NightAnnounce round={round} onConfirm={confirmNightAnnounce} />;
  })();

  return (
    <>
      <StatusBar
        players={gp}
        round={round}
        phase={phase}
        cupidLovers={cupidLovers}
      />
      {/* Padding top so content clears the fixed StatusBar */}
      <div style={{ paddingTop: '48px' }}>
        {screenContent}
      </div>
    </>
  );
}
