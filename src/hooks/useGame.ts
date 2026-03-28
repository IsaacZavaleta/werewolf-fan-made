import { useState, useCallback } from 'react';
import type { Player, GameState, GamePhase, NightResult } from '../types';

const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

const NIGHT_ROLE_ORDER = ['vidente', 'bruja', 'protector', 'cupido', 'zorro'] as const;

function buildPendingRoles(players: Player[], isFirst: boolean): string[] {
  const alive = new Set(players.filter(p => p.alive).map(p => p.role?.id));
  return NIGHT_ROLE_ORDER.filter(id => {
    if (!alive.has(id)) return false;
    if (id === 'cupido' && !isFirst) return false;
    return true;
  });
}

function emptyNightResult(): NightResult {
  return { wolfVictim: null, savedByWitch: false, killedByWitch: null, protectedIndex: null };
}

function checkWinner(players: Player[]): 'villagers' | 'wolves' | null {
  const alive = players.filter(p => p.alive);
  const wolves = alive.filter(p => p.role && WOLF_IDS.has(p.role.id));
  const villagers = alive.filter(p => !p.role || !WOLF_IDS.has(p.role.id));
  if (wolves.length === 0) return 'villagers';
  if (wolves.length >= villagers.length) return 'wolves';
  return null;
}

function hasRole(players: Player[], id: string): boolean {
  return players.some(p => p.alive && p.role?.id === id);
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
    winner: null,
  };
}

// ── Helper: pop next alive pending role ────────────────────────
function advanceNightRole(prev: GameState): GameState {
  const aliveRoles = new Set(prev.players.filter(p => p.alive).map(p => p.role?.id));
  let [next, ...remaining] = prev.pendingNightRoles;
  while (next && !aliveRoles.has(next)) {
    [next, ...remaining] = remaining;
  }
  const phase: GamePhase = next
    ? (`night-role-${next}` as GamePhase)
    : 'day-resolve'; // internal: resolve deaths before showing announce
  return { ...prev, pendingNightRoles: remaining, phase };
}

// ── Resolve night deaths and move to day-announce ─────────────
function resolveNight(prev: GameState): GameState {
  const { wolfVictim, savedByWitch, killedByWitch, protectedIndex } = prev.nightResult;
  const players = [...prev.players];
  const killedIndices: number[] = [];

  if (wolfVictim !== null) {
    const isProtected = protectedIndex === wolfVictim;
    const isSaved = savedByWitch;
    if (!isProtected && !isSaved) {
      players[wolfVictim] = { ...players[wolfVictim], alive: false };
      killedIndices.push(wolfVictim);
    }
  }
  if (killedByWitch !== null) {
    players[killedByWitch] = { ...players[killedByWitch], alive: false };
    killedIndices.push(killedByWitch);
  }

  return {
    ...prev,
    players,
    eliminatedToday: killedIndices,
    phase: 'day-announce',
    winner: checkWinner(players),
  };
}

// ═════════════════════════════════════════════════════════════
export function useGame(initialPlayers: Player[]) {
  const [gs, setGs] = useState<GameState>(() => buildInitialState(initialPlayers));

  const update = useCallback((fn: (prev: GameState) => GameState) => setGs(fn), []);

  // ── Night announce ────────────────────────────────────────
  const confirmNightAnnounce = useCallback(() => {
    update(prev => {
      const goGirl = prev.isFirstNight && hasRole(prev.players, 'ninia');
      return { ...prev, phase: goGirl ? 'night-girl-hint' : 'night-wolves' };
    });
  }, [update]);

  // ── Girl hint ─────────────────────────────────────────────
  const confirmGirlHint = useCallback(() => {
    update(prev => ({ ...prev, phase: 'night-wolves' }));
  }, [update]);

  // ── Wolves pick victim ────────────────────────────────────
  const wolvesPickVictim = useCallback((playerIndex: number) => {
    update(prev => {
      const nightResult = { ...prev.nightResult, wolfVictim: playerIndex };
      const next = advanceNightRole({ ...prev, nightResult });
      // if no pending roles remain, resolve immediately
      if (next.phase === ('day-resolve' as GamePhase)) return resolveNight(next);
      return next;
    });
  }, [update]);

  // ── Vidente ───────────────────────────────────────────────
  const confirmVidente = useCallback(() => {
    update(prev => {
      const next = advanceNightRole(prev);
      if (next.phase === ('day-resolve' as GamePhase)) return resolveNight(next);
      return next;
    });
  }, [update]);

  // ── Bruja ─────────────────────────────────────────────────
  const witchSave = useCallback(() => {
    update(prev => {
      const nightResult = { ...prev.nightResult, savedByWitch: true };
      const next = advanceNightRole({ ...prev, nightResult, witchLifeUsed: true });
      if (next.phase === ('day-resolve' as GamePhase)) return resolveNight(next);
      return next;
    });
  }, [update]);

  const witchKill = useCallback((playerIndex: number) => {
    update(prev => {
      const nightResult = { ...prev.nightResult, killedByWitch: playerIndex };
      const next = advanceNightRole({ ...prev, nightResult, witchDeathUsed: true });
      if (next.phase === ('day-resolve' as GamePhase)) return resolveNight(next);
      return next;
    });
  }, [update]);

  const witchPass = useCallback(() => {
    update(prev => {
      const next = advanceNightRole(prev);
      if (next.phase === ('day-resolve' as GamePhase)) return resolveNight(next);
      return next;
    });
  }, [update]);

  // ── Protector ─────────────────────────────────────────────
  const protectorProtect = useCallback((playerIndex: number) => {
    update(prev => {
      const nightResult = { ...prev.nightResult, protectedIndex: playerIndex };
      const next = advanceNightRole({ ...prev, nightResult, protectorLastProtected: playerIndex });
      if (next.phase === ('day-resolve' as GamePhase)) return resolveNight(next);
      return next;
    });
  }, [update]);

  // ── Skip any night role ───────────────────────────────────
  const skipNightRole = useCallback(() => {
    update(prev => {
      const next = advanceNightRole(prev);
      if (next.phase === ('day-resolve' as GamePhase)) return resolveNight(next);
      return next;
    });
  }, [update]);

  // ── Day: start debate ─────────────────────────────────────
  const startDebate = useCallback(() => {
    update(prev => ({ ...prev, phase: 'day-debate' }));
  }, [update]);

  // ── Day: start vote ───────────────────────────────────────
  const startVote = useCallback(() => {
    update(prev => ({ ...prev, phase: 'day-vote', lynchCandidate: null }));
  }, [update]);

  // ── Day: select + confirm lynch ───────────────────────────
  const selectLynch = useCallback((playerIndex: number) => {
    update(prev => ({ ...prev, lynchCandidate: playerIndex }));
  }, [update]);

  const confirmLynch = useCallback(() => {
    update(prev => {
      if (prev.lynchCandidate === null) return prev;
      const players = [...prev.players];
      players[prev.lynchCandidate] = { ...players[prev.lynchCandidate], alive: false };
      return {
        ...prev,
        players,
        eliminatedToday: [prev.lynchCandidate],
        phase: 'day-eliminate',
        winner: checkWinner(players),
      };
    });
  }, [update]);

  // ── Day: no lynch ─────────────────────────────────────────
  const skipLynch = useCallback(() => {
    update(prev => ({
      ...prev,
      lynchCandidate: null,
      eliminatedToday: [],
      phase: 'day-eliminate',
    }));
  }, [update]);

  // ── Start next night ──────────────────────────────────────
  const nextNight = useCallback(() => {
    update(prev => {
      const round = prev.round + 1;
      const pending = buildPendingRoles(prev.players, false);
      return {
        ...prev,
        round,
        isFirstNight: false,
        phase: 'night-announce',
        nightResult: emptyNightResult(),
        pendingNightRoles: pending,
        eliminatedToday: [],
        lynchCandidate: null,
        winner: checkWinner(prev.players),
      };
    });
  }, [update]);

  return {
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
  };
}
