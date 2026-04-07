import { useGame }          from '../../hooks/useGame';
import type { Player }      from '../../types';

import { StatusBar }        from './StatusBar';
import { NightAnnounce }    from './NightAnnounce';
import { NightGirlHint }    from './NightGirlHint';
import { NightPerroLobo }   from './NightPerroLobo';
import { NightGemelas }     from './NightGemelas';
import { NightNinoSalvaje } from './NightNinoSalvaje';
import { NightCupido }      from './NightCupido';
import { NightWolves }      from './NightWolves';
import { NightFerozLobo }   from './NightFerozLobo';
import { NightPadreLobos }  from './NightPadreLobos';
import { NightVidente }     from './NightVidente';
import { NightBruja }       from './NightBruja';
import { NightProtector }   from './NightProtector';
import { NightZorro }       from './NightZorro';
import { DayAnnounce }      from './DayAnnounce';
import { HunterShot }       from './HunterShot';
import { DayCaballero }     from './DayCaballero';
import { DayDebate }        from './DayDebate';
import { DayVote }          from './DayVote';
import { DayJudge }         from './DayJudge';
import { DayEliminate }     from './DayEliminate';

interface Props {
  players: Player[];
  onRestart: () => void;
}

export function GamePage({ players, onRestart }: Props) {
  const {
    gs,
    confirmNightAnnounce,
    confirmGirlHint, confirmGirlHint2,
    perroLoboChoose,
    cupidSetLovers, confirmGemelas, wildChildPickModel,
    wolvesPickVictim,
    ferozPickVictim, padreInfect, padrePasa,
    confirmVidente, witchAction, protectorProtect, zorroCheck, skipNightRole,
    goAfterAnnounce, hunterShoot, caballeroResolve,
    startDebate, startVote, confirmLynch, skipLynch,
    judgeActivate, judgeSecondVoteConfirm,
    nextNight,
  } = useGame(players);

  const {
    phase, players: gp, round,
    witchLifeUsed, witchDeathUsed, protectorLastProtected,
    cupidLovers, zorroActive,
    nightResult, padreUsed,
    caballeroDied, caballeroAdjacentWolf,
    eliminatedToday, winner, pendingHunterShot,
    judgeUsed,
  } = gs;

  function getName(roleId: string) {
    return (
      gp.find(p => p.alive && p.role?.id === roleId)?.name ??
      gp.find(p => p.role?.id === roleId)?.name ??
      roleId
    );
  }

  const judgeAvailable = !judgeUsed && gp.some(p => p.alive && p.role?.id === 'juez');

  const screen = (() => {

    // ── Night announce ────────────────────────────────────────
    if (phase === 'night-announce')
      return <NightAnnounce round={round} onConfirm={confirmNightAnnounce} />;

    // ── First-night special roles ─────────────────────────────
    if (phase === 'night-role-perrolobo')
      return <NightPerroLobo playerName={getName('perrolobo')} onChoose={perroLoboChoose} />;

    if (phase === 'night-role-cupido')
      return (
        <NightCupido
          players={gp} cupidName={getName('cupido')}
          onConfirm={cupidSetLovers} onSkip={skipNightRole}
        />
      );

    if (phase === 'night-role-gemelas')
      return <NightGemelas players={gp} onConfirm={confirmGemelas} />;

    if (phase === 'night-role-nino')
      return (
        <NightNinoSalvaje
          players={gp} ninoName={getName('nino')}
          onConfirm={wildChildPickModel}
        />
      );

    // ── Girl hint ─────────────────────────────────────────────
    if (phase === 'night-girl-hint')
      return <NightGirlHint girlName={getName('ninia')} onConfirm={confirmGirlHint2} />;

    // ── Wolves ────────────────────────────────────────────────
    if (phase === 'night-wolves')
      return <NightWolves players={gp} round={round} onConfirm={wolvesPickVictim} />;

    // ── Lobo Feroz solo attack ────────────────────────────────
    if (phase === 'night-role-feroz')
      return (
        <NightFerozLobo
          players={gp}
          wolfVictim={nightResult.wolfVictim}
          onConfirm={ferozPickVictim}
          onSkip={() => ferozPickVictim(null)}
        />
      );

    // ── Padre de los Lobos ────────────────────────────────────
    if (phase === 'night-role-padre')
      return (
        <NightPadreLobos
          players={gp} padreName={getName('padre')}
          wolfVictim={nightResult.wolfVictim}
          onInfect={padreInfect} onPass={padrePasa}
        />
      );

    // ── Recurring night roles ─────────────────────────────────
    if (phase === 'night-role-vidente')
      return (
        <NightVidente
          players={gp} videnteName={getName('vidente')}
          onConfirm={confirmVidente}
        />
      );

    if (phase === 'night-role-bruja')
      return (
        <NightBruja
          players={gp} brujaName={getName('bruja')}
          lifeUsed={witchLifeUsed} deathUsed={witchDeathUsed}
          onAction={witchAction}
        />
      );

    if (phase === 'night-role-protector')
      return (
        <NightProtector
          players={gp} protectorName={getName('protector')}
          lastProtected={protectorLastProtected}
          onConfirm={protectorProtect} onSkip={skipNightRole}
        />
      );

    if (phase === 'night-role-zorro')
      return (
        <NightZorro
          players={gp} zorroName={getName('zorro')}
          zorroActive={gs.zorroActive}
          onConfirm={zorroCheck} onSkip={skipNightRole}
        />
      );

    // ── Day announce ──────────────────────────────────────────
    // goAfterAnnounce routes to: hunter → caballero → debate
    if (phase === 'day-announce')
      return (
        <DayAnnounce
          players={gp}
          eliminatedToday={eliminatedToday}
          cupidLovers={cupidLovers}
          round={round}
          pendingHunterShot={pendingHunterShot}
          caballeroDied={caballeroDied}
          onContinue={goAfterAnnounce}
        />
      );

    // ── Hunter fires at night (after day-announce) ────────────
    if (phase === 'day-hunter-night' && pendingHunterShot !== null)
      return (
        <HunterShot
          players={gp} hunterIndex={pendingHunterShot}
          context="night" onShoot={hunterShoot}
        />
      );

    // ── Caballero: adjacent wolf dies ─────────────────────────
    if (phase === 'day-caballero')
      return (
        <DayCaballero
          players={gp}
          adjacentWolfIdx={caballeroAdjacentWolf}
          onConfirm={caballeroResolve}
        />
      );

    // ── Debate ────────────────────────────────────────────────
    if (phase === 'day-debate')
      return <DayDebate key={round} round={round} onEndDebate={startVote} />;

    // ── Vote ──────────────────────────────────────────────────
    if (phase === 'day-vote')
      return (
        <DayVote
          players={gp} round={round} cupidLovers={cupidLovers}
          judgeAvailable={judgeAvailable}
          onConfirmLynch={confirmLynch} onSkipLynch={skipLynch}
          onJudgeActivate={judgeActivate}
        />
      );

    // ── Judge second vote ─────────────────────────────────────
    if (phase === 'day-judge-second-vote')
      return (
        <DayJudge
          players={gp} round={round} cupidLovers={cupidLovers}
          judgeName={getName('juez')}
          onConfirm={judgeSecondVoteConfirm}
          onSkip={() => judgeSecondVoteConfirm(-1)}
        />
      );

    // ── Eliminate (linchamiento + card reveal) ────────────────
    if (phase === 'day-eliminate')
      return (
        <DayEliminate
          players={gp}
          eliminatedToday={eliminatedToday}
          winner={winner}
          cupidLovers={cupidLovers}
          pendingHunterShot={pendingHunterShot}
          round={round}
          onHunterShoot={hunterShoot}
          onNextNight={nextNight}
          onRestart={onRestart}
        />
      );

    // Safety fallback
    return <NightAnnounce round={round} onConfirm={confirmNightAnnounce} />;
  })();

  return (
    <>
      <StatusBar players={gp} round={round} phase={phase} cupidLovers={cupidLovers} />
      <div style={{ paddingTop: '48px' }}>{screen}</div>
    </>
  );
}
