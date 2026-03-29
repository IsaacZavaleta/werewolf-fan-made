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

  // Lovers win: exactly the two lovers remain and no-one else
  if (lovers) {
    const [a, b] = lovers;
    const bothAlive = players[a]?.alive && players[b]?.alive;
    if (bothAlive && alive.length === 2) return 'lovers';
  }

  const wolves = alive.filter(p => p.role && WOLF_IDS.has(p.role.id));
  const villagers = alive.filter(p => !p.role || !WOLF_IDS.has(p.role.id));

  if (wolves.length === 0) return 'villagers';
  if (wolves.length >= villagers.length) return 'wolves';
  return null;
}

function hasRole(players: Player[], id: string): boolean {
  return players.some(p => p.alive && p.role?.id === id);
}

/** Pop next alive pending role, resolve night when empty */
function advanceNightRole(prev: GameState): GameState {
  const aliveIds = new Set(prev.players.filter(p => p.alive).map(p => p.role?.id));
  let remaining = [...prev.pendingNightRoles];
  let next = remaining.shift();

  while (next && !aliveIds.has(next)) {
    next = remaining.shift();
  }

  if (next) {
    return { ...prev, pendingNightRoles: remaining, phase: `night-role-${next}` as GamePhase };
  }

  // No more night roles → resolve deaths → day-announce
  return resolveNight({ ...prev, pendingNightRoles: [] });
}

function resolveNight(prev: GameState): GameState {
  const { wolfVictim, savedByWitch, killedByWitch, protectedIndex } = prev.nightResult;
  const players = [...prev.players];
  const killed: number[] = [];

  // Wolf victim
  if (wolfVictim !== null && !savedByWitch && protectedIndex !== wolfVictim) {
    players[wolfVictim] = { ...players[wolfVictim], alive: false };
    killed.push(wolfVictim);
  }

  // Witch death potion
  if (killedByWitch !== null) {
    players[killedByWitch] = { ...players[killedByWitch], alive: false };
    killed.push(killedByWitch);
  }

  // Cupid: if one lover dies, the other dies too (heartbreak)
  const { cupidLovers } = prev;
  if (cupidLovers) {
    const [a, b] = cupidLovers;
    const aJustDied = killed.includes(a);
    const bJustDied = killed.includes(b);
    if (aJustDied && players[b].alive) {
      players[b] = { ...players[b], alive: false };
      killed.push(b);
    }
    if (bJustDied && players[a].alive) {
      players[a] = { ...players[a], alive: false };
      killed.push(a);
    }
  }

  return {
    ...prev,
    players,
    eliminatedToday: killed,
    phase: 'day-announce',
    winner: checkWinner(players, prev.cupidLovers),
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
    winner: null,
  };
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
export function useGame(initialPlayers: Player[]) {
  const [gs, setGs] = useState<GameState>(() => buildInitialState(initialPlayers));
  const update = useCallback((fn: (p: GameState) => GameState) => setGs(fn), []);

  const advance = useCallback((prev: GameState) => advanceNightRole(prev), []);

  // Night announce
  const confirmNightAnnounce = useCallback(() => {
    update(prev => ({
      ...prev,
      phase: prev.isFirstNight && hasRole(prev.players, 'ninia')
        ? 'night-girl-hint'
        : 'night-wolves',
    }));
  }, [update]);

  // Girl hint
  const confirmGirlHint = useCallback(() => {
    update(prev => ({ ...prev, phase: 'night-wolves' }));
  }, [update]);

  // Wolves pick victim
  const wolvesPickVictim = useCallback((idx: number) => {
    update(prev => advance({ ...prev, nightResult: { ...prev.nightResult, wolfVictim: idx } }));
  }, [update, advance]);

  // Vidente
  const confirmVidente = useCallback(() => {
    update(prev => advance(prev));
  }, [update, advance]);

  // Bruja
  const witchSave = useCallback(() => {
    update(prev => advance({
      ...prev,
      nightResult: { ...prev.nightResult, savedByWitch: true },
      witchLifeUsed: true,
    }));
  }, [update, advance]);

  const witchKill = useCallback((idx: number) => {
    update(prev => advance({
      ...prev,
      nightResult: { ...prev.nightResult, killedByWitch: idx },
      witchDeathUsed: true,
    }));
  }, [update, advance]);

  const witchPass = useCallback(() => {
    update(prev => advance(prev));
  }, [update, advance]);

  // Protector
  const protectorProtect = useCallback((idx: number) => {
    update(prev => advance({
      ...prev,
      nightResult: { ...prev.nightResult, protectedIndex: idx },
      protectorLastProtected: idx,
    }));
  }, [update, advance]);

  // Cupido: choose two lovers
  const cupidSetLovers = useCallback((a: number, b: number) => {
    update(prev => advance({ ...prev, cupidLovers: [a, b] }));
  }, [update, advance]);

  // Zorro: advance + mark power loss if no wolf found
  const zorroCheck = useCallback((centerIdx: number, hadWolf: boolean) => {
    update(prev => advance({
      ...prev,
      zorroActive: hadWolf ? prev.zorroActive : false,
    }));
  }, [update, advance]);

  const skipNightRole = useCallback(() => {
    update(prev => advance(prev));
  }, [update, advance]);

  // Day: debate → vote
  const startDebate = useCallback(() => {
    update(prev => ({ ...prev, phase: 'day-debate' }));
  }, [update]);

  const startVote = useCallback(() => {
    update(prev => ({ ...prev, phase: 'day-vote', lynchCandidate: null }));
  }, [update]);

  // Lynch: atomic select + confirm to avoid double-render race
  const confirmLynch = useCallback((idx: number) => {
    update(prev => {
      const players = [...prev.players];
      players[idx] = { ...players[idx], alive: false };

      // Cupid heartbreak on lynch
      let extraKilled: number[] = [];
      if (prev.cupidLovers) {
        const [a, b] = prev.cupidLovers;
        if (idx === a && players[b].alive) {
          players[b] = { ...players[b], alive: false };
          extraKilled = [b];
        }
        if (idx === b && players[a].alive) {
          players[a] = { ...players[a], alive: false };
          extraKilled = [a];
        }
      }

      return {
        ...prev,
        players,
        lynchCandidate: idx,
        eliminatedToday: [idx, ...extraKilled],
        phase: 'day-eliminate',
        winner: checkWinner(players, prev.cupidLovers),
      };
    });
  }, [update]);

  const skipLynch = useCallback(() => {
    update(prev => ({
      ...prev,
      lynchCandidate: null,
      eliminatedToday: [],
      phase: 'day-eliminate',
    }));
  }, [update]);

  // Next night
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
      winner: checkWinner(prev.players, prev.cupidLovers),
    }));
  }, [update]);

  return {
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
  };
}
