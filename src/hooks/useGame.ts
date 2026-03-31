import { useState, useCallback } from 'react';
import type { Player, GameState, GamePhase, NightResult } from '../types';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

const NIGHT_ROLE_ORDER = [
  'vidente', 'bruja', 'protector', 'cupido', 'zorro',
] as const;

// ─────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────
function buildPendingRoles(players: Player[], isFirst: boolean): string[] {
  const aliveIds = new Set(players.filter(p => p.alive).map(p => p.role?.id));
  return NIGHT_ROLE_ORDER.filter(id => {
    if (!aliveIds.has(id)) return false;
    if (id === 'cupido' && !isFirst) return false;
    return true;
  });
}

function emptyNightResult(): NightResult {
  return { wolfVictim: null, savedByWitch: false, killedByWitch: null, protectedIndex: null };
}

function checkWinner(
  players: Player[],
  lovers: [number, number] | null,
): GameState['winner'] {
  const alive = players.filter(p => p.alive);

  // Lovers win: only the two lovers remain
  if (lovers) {
    const [a, b] = lovers;
    if (players[a]?.alive && players[b]?.alive && alive.length === 2) return 'lovers';
  }

  const wolves    = alive.filter(p => p.role && WOLF_IDS.has(p.role.id));
  const villagers = alive.filter(p => !p.role || !WOLF_IDS.has(p.role.id));
  if (wolves.length === 0) return 'villagers';
  if (wolves.length >= villagers.length) return 'wolves';
  return null;
}

function hasRole(players: Player[], id: string): boolean {
  return players.some(p => p.alive && p.role?.id === id);
}

function isHunter(p: Player): boolean {
  return p.role?.id === 'cazador';
}

/** Kill a player and handle cupid heartbreak. Returns updated players + killed indices. */
function killPlayer(
  players: Player[],
  idx: number,
  killed: number[],
  lovers: [number, number] | null,
): { players: Player[]; killed: number[] } {
  const next = [...players];
  if (!next[idx].alive) return { players: next, killed }; // already dead
  next[idx] = { ...next[idx], alive: false };
  const newKilled = [...killed, idx];

  // Cupid heartbreak
  if (lovers) {
    const [a, b] = lovers;
    const partner = idx === a ? b : idx === b ? a : -1;
    if (partner !== -1 && next[partner].alive) {
      next[partner] = { ...next[partner], alive: false };
      newKilled.push(partner);
    }
  }

  return { players: next, killed: newKilled };
}

/** Pop the next alive pending night role; if none remain, resolve night deaths. */
function advanceNightRole(prev: GameState): GameState {
  const aliveIds = new Set(prev.players.filter(p => p.alive).map(p => p.role?.id));
  let remaining = [...prev.pendingNightRoles];
  let next = remaining.shift();
  while (next && !aliveIds.has(next)) next = remaining.shift();

  if (next) {
    return { ...prev, pendingNightRoles: remaining, phase: `night-role-${next}` as GamePhase };
  }
  return resolveNight({ ...prev, pendingNightRoles: [] });
}

/** Resolve night deaths → day-announce (or day-hunter-night if cazador died). */
function resolveNight(prev: GameState): GameState {
  const { wolfVictim, savedByWitch, killedByWitch, protectedIndex } = prev.nightResult;
  let players = [...prev.players];
  let killed: number[] = [];

  // Wolf victim (unless saved or protected)
  if (wolfVictim !== null && !savedByWitch && protectedIndex !== wolfVictim) {
    ({ players, killed } = killPlayer(players, wolfVictim, killed, prev.cupidLovers));
  }

  // Witch death potion
  if (killedByWitch !== null) {
    ({ players, killed } = killPlayer(players, killedByWitch, killed, prev.cupidLovers));
  }

  // Check if hunter died and hasn't fired yet
  const hunterDied = killed.find(i => isHunter(players[i])) ?? null;
  const pendingHunterShot = hunterDied !== undefined && hunterDied !== null ? hunterDied : null;

  const winner = checkWinner(players, prev.cupidLovers);
  return {
    ...prev,
    players,
    eliminatedToday: killed,
    pendingHunterShot,
    phase: pendingHunterShot !== null ? 'day-hunter-night' : 'day-announce',
    winner,
  };
}

function buildInitialState(players: Player[]): GameState {
  const withIndex: Player[] = players.map((p, i) => ({ ...p, alive: true, index: i }));
  return {
    players: withIndex,
    round: 1,
    isFirstNight: true,
    phase: 'night-announce',
    nightResult: emptyNightResult(),
    pendingNightRoles: buildPendingRoles(withIndex, true),
    eliminatedToday: [],
    lynchCandidate: null,
    witchLifeUsed: false,
    witchDeathUsed: false,
    protectorLastProtected: null,
    cupidLovers: null,
    zorroActive: true,
    pendingHunterShot: null,
    winner: null,
  };
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
export function useGame(initialPlayers: Player[]) {
  const [gs, setGs] = useState<GameState>(() => buildInitialState(initialPlayers));
  const update = useCallback((fn: (p: GameState) => GameState) => setGs(fn), []);

  // ── Night announce ────────────────────────────────────────
  const confirmNightAnnounce = useCallback(() => {
    update(prev => ({
      ...prev,
      phase: prev.isFirstNight && hasRole(prev.players, 'ninia')
        ? 'night-girl-hint'
        : 'night-wolves',
    }));
  }, [update]);

  const confirmGirlHint = useCallback(() => {
    update(prev => ({ ...prev, phase: 'night-wolves' }));
  }, [update]);

  // ── Wolves pick victim ────────────────────────────────────
  const wolvesPickVictim = useCallback((idx: number) => {
    update(prev =>
      advanceNightRole({ ...prev, nightResult: { ...prev.nightResult, wolfVictim: idx } })
    );
  }, [update]);

  // ── Vidente ───────────────────────────────────────────────
  const confirmVidente = useCallback(() => {
    update(prev => advanceNightRole(prev));
  }, [update]);

  // ── Bruja — puede usar vida, muerte o ambas ───────────────
  const witchAction = useCallback((
    usedLife: boolean,
    killIdx: number | null,
  ) => {
    update(prev => {
      const nightResult: NightResult = {
        ...prev.nightResult,
        savedByWitch: usedLife,
        killedByWitch: killIdx,
      };
      return advanceNightRole({
        ...prev,
        nightResult,
        witchLifeUsed:  prev.witchLifeUsed  || usedLife,
        witchDeathUsed: prev.witchDeathUsed || killIdx !== null,
      });
    });
  }, [update]);

  // ── Protector ─────────────────────────────────────────────
  const protectorProtect = useCallback((idx: number) => {
    update(prev =>
      advanceNightRole({
        ...prev,
        nightResult: { ...prev.nightResult, protectedIndex: idx },
        protectorLastProtected: idx,
      })
    );
  }, [update]);

  const skipNightRole = useCallback(() => {
    update(prev => advanceNightRole(prev));
  }, [update]);

  // ── Cupido ────────────────────────────────────────────────
  const cupidSetLovers = useCallback((a: number, b: number) => {
    update(prev => advanceNightRole({ ...prev, cupidLovers: [a, b] }));
  }, [update]);

  // ── Zorro ─────────────────────────────────────────────────
  const zorroCheck = useCallback((hadWolf: boolean) => {
    update(prev =>
      advanceNightRole({ ...prev, zorroActive: hadWolf ? prev.zorroActive : false })
    );
  }, [update]);

  // ── Hunter fires (night or day) ───────────────────────────
  const hunterShoot = useCallback((targetIdx: number) => {
    update(prev => {
      let players = [...prev.players];
      let killed = [...prev.eliminatedToday];
      ({ players, killed } = killPlayer(players, targetIdx, killed, prev.cupidLovers));

      const winner = checkWinner(players, prev.cupidLovers);
      // After hunter fires at night → go to day-announce
      // After hunter fires at day  → stay on day-eliminate
      const nextPhase: GamePhase =
        prev.phase === 'day-hunter-night' ? 'day-announce' : 'day-eliminate';

      return {
        ...prev,
        players,
        eliminatedToday: killed,
        pendingHunterShot: null,
        phase: nextPhase,
        winner,
      };
    });
  }, [update]);

  // ── Day flow ──────────────────────────────────────────────
  const startDebate = useCallback(() => {
    update(prev => ({ ...prev, phase: 'day-debate' }));
  }, [update]);

  const startVote = useCallback(() => {
    update(prev => ({ ...prev, phase: 'day-vote', lynchCandidate: null }));
  }, [update]);

  // Atomic lynch — kills player, checks for hunter, moves to eliminate
  const confirmLynch = useCallback((idx: number) => {
    update(prev => {
      let players = [...prev.players];
      let killed: number[] = [];
      ({ players, killed } = killPlayer(players, idx, killed, prev.cupidLovers));

      const hunterDied = killed.find(i => isHunter(players[i])) ?? null;
      const pendingHunterShot = hunterDied !== undefined && hunterDied !== null ? hunterDied : null;

      const winner = checkWinner(players, prev.cupidLovers);
      return {
        ...prev,
        players,
        lynchCandidate: idx,
        eliminatedToday: killed,
        pendingHunterShot,
        // If hunter died, show cards first (day-eliminate), then hunter shoots from there
        phase: 'day-eliminate',
        winner,
      };
    });
  }, [update]);

  const skipLynch = useCallback(() => {
    update(prev => ({
      ...prev,
      lynchCandidate: null,
      eliminatedToday: [],
      pendingHunterShot: null,
      phase: 'day-eliminate',
    }));
  }, [update]);

  // ── Next night ────────────────────────────────────────────
  const nextNight = useCallback(() => {
    update(prev => ({
      ...prev,
      round: prev.round + 1,
      isFirstNight: false,
      phase: 'night-announce',
      nightResult: emptyNightResult(),
      pendingNightRoles: buildPendingRoles(prev.players, false),
      eliminatedToday: [],
      lynchCandidate: null,
      pendingHunterShot: null,
      winner: checkWinner(prev.players, prev.cupidLovers),
    }));
  }, [update]);

  return {
    gs,
    confirmNightAnnounce,
    confirmGirlHint,
    wolvesPickVictim,
    confirmVidente,
    witchAction,
    protectorProtect,
    skipNightRole,
    cupidSetLovers,
    zorroCheck,
    hunterShoot,
    startDebate,
    startVote,
    confirmLynch,
    skipLynch,
    nextNight,
  };
}
