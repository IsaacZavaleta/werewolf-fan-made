import { useState, useCallback } from 'react';
import type { Player, GameState, GamePhase, NightResult } from '../types';

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const WOLF_IDS = new Set(['lobo', 'feroz', 'padre', 'albino', 'perrolobo']);

// Recurring night role order (called every night if alive)
const RECURRING_NIGHT_ROLES = ['vidente', 'bruja', 'protector', 'zorro'] as const;
// First-night-only roles (called in this order)
const FIRST_NIGHT_ROLES     = ['perrolobo', 'cupido', 'gemelas', 'nino']  as const;

// ─────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────

function emptyNightResult(): NightResult {
  return {
    wolfVictim: null, savedByWitch: false,
    killedByWitch: null, protectedIndex: null,
    ferozVictim: null, padreInfected: null,
  };
}

function hasRoleAlive(players: Player[], id: string): boolean {
  return players.some(p => p.alive && p.role?.id === id);
}

function isWolfPlayer(p: Player, perroLoboSide: GameState['perroLoboSide']): boolean {
  if (!p.role) return false;
  if (p.role.id === 'perrolobo') return perroLoboSide === 'wolf';
  return WOLF_IDS.has(p.role.id);
}

function buildFirstNightPending(players: Player[], gs: Partial<GameState>): string[] {
  const aliveIds = new Set(players.filter(p => p.alive).map(p => p.role?.id));
  return FIRST_NIGHT_ROLES.filter(id => {
    if (!aliveIds.has(id)) return false;
    if (id === 'perrolobo' && gs.perroLoboSide != null) return false;
    return true;
  });
}

function buildRecurringPending(players: Player[]): string[] {
  const aliveIds = new Set(players.filter(p => p.alive).map(p => p.role?.id));
  return RECURRING_NIGHT_ROLES.filter(id => aliveIds.has(id));
}

function checkWinner(players: Player[], gs: GameState): GameState['winner'] {
  const alive = players.filter(p => p.alive);

  // Lovers win: exactly 2 remain and both are lovers
  if (gs.cupidLovers) {
    const [a, b] = gs.cupidLovers;
    if (players[a]?.alive && players[b]?.alive && alive.length === 2) return 'lovers';
  }

  // Albino wins: all other wolves dead + all villagers dead (only albino left)
  const albino = players.find(p => p.alive && p.role?.id === 'albino');
  if (albino && alive.length === 1) return 'albino';

  const wolves    = alive.filter(p => isWolfPlayer(p, gs.perroLoboSide));
  const villagers = alive.filter(p => !isWolfPlayer(p, gs.perroLoboSide));

  if (wolves.length === 0) return 'villagers';
  if (wolves.length >= villagers.length) return 'wolves';
  return null;
}

/** Kill idx, apply cupid heartbreak. Returns updated players + all killed indices. */
function killPlayer(
  players: Player[],
  idx: number,
  alreadyKilled: number[],
  lovers: [number, number] | null,
): { players: Player[]; killed: number[] } {
  const next = [...players];
  if (!next[idx]?.alive) return { players: next, killed: alreadyKilled };
  next[idx] = { ...next[idx], alive: false };
  const killed = [...alreadyKilled, idx];

  if (lovers) {
    const [a, b] = lovers;
    const partner = idx === a ? b : idx === b ? a : -1;
    if (partner !== -1 && next[partner]?.alive) {
      next[partner] = { ...next[partner], alive: false };
      killed.push(partner);
    }
  }
  return { players: next, killed };
}

/** Find adjacent alive wolf in seat order when knight dies */
function findAdjacentWolf(
  players: Player[],
  knightIdx: number,
  perroLoboSide: GameState['perroLoboSide'],
): number | null {
  const alive = players.filter(p => p.alive && p.index !== knightIdx);
  if (alive.length === 0) return null;
  // pos = -1 because knight is already dead, so search around original position by index
  const sorted = [...players].filter(p => p.alive).sort((a, b) => a.index - b.index);
  const knightPos = players[knightIdx].index;
  const after  = sorted.find(p => p.index > knightPos && isWolfPlayer(p, perroLoboSide));
  const before = [...sorted].reverse().find(p => p.index < knightPos && isWolfPlayer(p, perroLoboSide));
  const nearest = [after, before].filter(Boolean) as Player[];
  if (nearest.length === 0) return null;
  if (nearest.length === 1) return nearest[0].index;
  // Return whichever is closer by seat
  const distAfter  = after  ? after.index  - knightPos : Infinity;
  const distBefore = before ? knightPos - before.index : Infinity;
  return distAfter <= distBefore ? after!.index : before!.index;
}

/** Resolve night deaths and move to day-announce */
function resolveNight(prev: GameState): GameState {
  const { wolfVictim, savedByWitch, killedByWitch, protectedIndex, ferozVictim, padreInfected } = prev.nightResult;
  let players = [...prev.players];
  let killed: number[] = [];
  let ancianoJustSurvived = false;

  // 1. Padre: infect victim (victim doesn't die, becomes a wolf)
  if (padreInfected !== null && players[padreInfected]?.alive) {
    players[padreInfected] = {
      ...players[padreInfected],
      role: {
        ...(players[padreInfected].role ?? { id: 'lobo', name: 'Hombre Lobo', group: 'wolf', icon: '🐺', desc: '', max: 6, default: 2 }),
        id: 'lobo', name: 'Hombre Lobo (infectado)', group: 'wolf',
      },
    };
    // Infected victim does NOT die this night - wolves' attack is replaced by infection
  } else if (wolfVictim !== null && !savedByWitch && protectedIndex !== wolfVictim) {
    // 2. Normal wolf kill — but Anciano resists the FIRST attack
    const isAnciano = prev.players[wolfVictim]?.role?.id === 'anciano';
    if (isAnciano && !prev.ancianoSurvivedAttack) {
      // Anciano survives this night — we'll mark it in the returned state
      ancianoJustSurvived = true;
    } else {
      ({ players, killed } = killPlayer(players, wolfVictim, killed, prev.cupidLovers));
    }
  }

  // 3. Feroz solo attack (skip if feroz passed / -1)
  if (ferozVictim !== null && ferozVictim !== -1 && ferozVictim !== wolfVictim) {
    // Feroz attack bypasses protector (it's a separate attack)
    ({ players, killed } = killPlayer(players, ferozVictim, killed, prev.cupidLovers));
  }

  // 4. Witch death potion
  if (killedByWitch !== null) {
    ({ players, killed } = killPlayer(players, killedByWitch, killed, prev.cupidLovers));
  }

  // 5. Wild child: model died → convert to wolf
  if (prev.wildChildModel !== null && killed.includes(prev.wildChildModel)) {
    const childIdx = players.findIndex(p => p.role?.id === 'nino' && p.alive);
    if (childIdx !== -1) {
      players[childIdx] = {
        ...players[childIdx],
        role: {
          ...(players[childIdx].role!),
          id: 'lobo', name: 'Hombre Lobo (Niño Salvaje)', group: 'wolf',
        },
      };
    }
  }

  // 6. Knight died → find adjacent wolf to die tomorrow
  const knightDiedIdx = killed.find(i => players[i]?.role?.desc?.includes('Caballero') || prev.players[i]?.role?.id === 'caballero') ?? null;
  let caballeroDied = false;
  let caballeroAdjacentWolf: number | null = null;
  if (knightDiedIdx !== null) {
    caballeroDied = true;
    caballeroAdjacentWolf = findAdjacentWolf(players, knightDiedIdx, prev.perroLoboSide);
  }

  // 7. Hunter died?
  const hunterDiedIdx = killed.find(i => prev.players[i]?.role?.id === 'cazador') ?? null;
  const pendingHunterShot = hunterDiedIdx !== undefined && hunterDiedIdx !== null ? hunterDiedIdx : null;

  const draft: GameState = {
    ...prev,
    players,
    eliminatedToday: killed,
    pendingHunterShot,
    caballeroDied,
    caballeroAdjacentWolf,
    ancianoSurvivedAttack: prev.ancianoSurvivedAttack || ancianoJustSurvived,
    phase: 'day-announce',
    winner: null,
  };
  draft.winner = checkWinner(players, draft);
  return draft;
}

/** After pending first-night roles: show girl-hint if applicable, then go to wolves */
function afterFirstNightRoles(prev: GameState): GameState {
  if (prev.isFirstNight && hasRoleAlive(prev.players, 'ninia')) {
    return { ...prev, phase: 'night-girl-hint' };
  }
  return { ...prev, phase: 'night-wolves' };
}

/** After recurring night roles: resolve night */
function afterRecurringRoles(prev: GameState): GameState {
  return resolveNight({ ...prev, pendingNightRoles: [] });
}

/** Pop next recurring role or resolve night */
function nextRecurringRole(prev: GameState): GameState {
  const remaining = [...prev.pendingNightRoles];
  let next = remaining.shift();
  // skip dead roles
  while (next && !hasRoleAlive(prev.players, next)) next = remaining.shift();
  if (next) {
    return { ...prev, pendingNightRoles: remaining, phase: `night-role-${next}` as GamePhase };
  }
  return afterRecurringRoles(prev);
}

function buildInitialState(players: Player[]): GameState {
  const withIndex: Player[] = players.map((p, i) => ({ ...p, alive: true, index: i }));
  const gs: GameState = {
    players: withIndex,
    round: 1,
    isFirstNight: true,
    phase: 'night-announce',
    nightResult: emptyNightResult(),
    pendingNightRoles: [],
    eliminatedToday: [],
    lynchCandidate: null,
    witchLifeUsed: false,
    witchDeathUsed: false,
    protectorLastProtected: null,
    cupidLovers: null,
    zorroActive: true,
    wildChildModel: null,
    perroLoboSide: null,
    ferozCanAttack: true,
    padreUsed: false,
    caballeroDied: false,
    caballeroAdjacentWolf: null,
    pendingHunterShot: null,
    judgeUsed: false,
    judgeSecondVoteActive: false,
    angelFirstLynch: true,
    ancianoSurvivedAttack: false,
    ancianoLinched: false,
    winner: null,
  };
  gs.pendingNightRoles = buildFirstNightPending(withIndex, gs);
  return gs;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
export function useGame(initialPlayers: Player[]) {
  const [gs, setGs] = useState<GameState>(() => buildInitialState(initialPlayers));
  const update = useCallback((fn: (p: GameState) => GameState) => setGs(fn), []);

  // ── Night announce → first role or girl hint or wolves ────
  const confirmNightAnnounce = useCallback(() => {
    update(prev => {
      if (prev.isFirstNight) {
        const pending = buildFirstNightPending(prev.players, prev);
        if (pending.length > 0) {
          const [first, ...rest] = pending;
          return { ...prev, pendingNightRoles: rest, phase: `night-role-${first}` as GamePhase };
        }
        return afterFirstNightRoles(prev);
      }
      // Non-first nights: go straight to wolves
      const recurring = buildRecurringPending(prev.players);
      return { ...prev, pendingNightRoles: recurring, phase: 'night-wolves' };
    });
  }, [update]);

  // ── Girl hint → wolves ────────────────────────────────────
  const confirmGirlHint = useCallback(() => {
    update(prev => ({ ...prev, phase: 'night-wolves' }));
  }, [update]);

  // Same alias used in GamePage for the standalone girl-hint after first-night roles
  const confirmGirlHint2 = confirmGirlHint;

  // ── Perro Lobo chooses side ───────────────────────────────
  const perroLoboChoose = useCallback((side: 'wolf' | 'villager') => {
    update(prev => {
      const next = { ...prev, perroLoboSide: side };
      const remaining = [...prev.pendingNightRoles];
      const nextRole = remaining.shift();
      if (nextRole) return { ...next, pendingNightRoles: remaining, phase: `night-role-${nextRole}` as GamePhase };
      return afterFirstNightRoles(next);
    });
  }, [update]);

  // ── Cupido ────────────────────────────────────────────────
  const cupidSetLovers = useCallback((a: number, b: number) => {
    update(prev => {
      const next = { ...prev, cupidLovers: [a, b] as [number, number] };
      const remaining = [...prev.pendingNightRoles];
      const nextRole = remaining.shift();
      if (nextRole) return { ...next, pendingNightRoles: remaining, phase: `night-role-${nextRole}` as GamePhase };
      return afterFirstNightRoles(next);
    });
  }, [update]);

  // ── Gemelas ───────────────────────────────────────────────
  const confirmGemelas = useCallback(() => {
    update(prev => {
      const remaining = [...prev.pendingNightRoles];
      const nextRole = remaining.shift();
      if (nextRole) return { ...prev, pendingNightRoles: remaining, phase: `night-role-${nextRole}` as GamePhase };
      return afterFirstNightRoles(prev);
    });
  }, [update]);

  // ── Niño Salvaje picks model ──────────────────────────────
  const wildChildPickModel = useCallback((modelIdx: number) => {
    update(prev => {
      const next = { ...prev, wildChildModel: modelIdx };
      const remaining = [...prev.pendingNightRoles];
      const nextRole = remaining.shift();
      if (nextRole) return { ...next, pendingNightRoles: remaining, phase: `night-role-${nextRole}` as GamePhase };
      return afterFirstNightRoles(next);
    });
  }, [update]);

  // ── Wolves pick victim ────────────────────────────────────
  const wolvesPickVictim = useCallback((idx: number) => {
    update(prev => {
      const nightResult = { ...prev.nightResult, wolfVictim: idx };
      // After wolves: feroz (if active) → padre (if not used) → recurring roles
      if (hasRoleAlive(prev.players, 'feroz') && prev.ferozCanAttack) {
        return { ...prev, nightResult, phase: 'night-role-feroz' };
      }
      if (hasRoleAlive(prev.players, 'padre') && !prev.padreUsed) {
        return { ...prev, nightResult, phase: 'night-role-padre' };
      }
      return nextRecurringRole({ ...prev, nightResult, pendingNightRoles: buildRecurringPending(prev.players) });
    });
  }, [update]);

  // ── Lobo Feroz solo attack ────────────────────────────────
  const ferozPickVictim = useCallback((idx: number | null) => {
    update(prev => {
      // null = feroz skipped/passed
      const nightResult = { ...prev.nightResult, ferozVictim: idx };
      if (hasRoleAlive(prev.players, 'padre') && !prev.padreUsed) {
        return { ...prev, nightResult, phase: 'night-role-padre' };
      }
      return nextRecurringRole({ ...prev, nightResult, pendingNightRoles: buildRecurringPending(prev.players) });
    });
  }, [update]);

  // ── Padre de los Lobos ────────────────────────────────────
  const padreInfect = useCallback((idx: number) => {
    update(prev => {
      const nightResult = { ...prev.nightResult, padreInfected: idx };
      return nextRecurringRole({
        ...prev, nightResult, padreUsed: true,
        pendingNightRoles: buildRecurringPending(prev.players),
      });
    });
  }, [update]);

  const padrePasa = useCallback(() => {
    update(prev =>
      nextRecurringRole({ ...prev, pendingNightRoles: buildRecurringPending(prev.players) })
    );
  }, [update]);

  // ── Vidente ───────────────────────────────────────────────
  const confirmVidente = useCallback(() => {
    update(prev => nextRecurringRole(prev));
  }, [update]);

  // ── Bruja ─────────────────────────────────────────────────
  const witchAction = useCallback((usedLife: boolean, killIdx: number | null) => {
    update(prev => {
      const nightResult: NightResult = {
        ...prev.nightResult, savedByWitch: usedLife, killedByWitch: killIdx,
      };
      return nextRecurringRole({
        ...prev, nightResult,
        witchLifeUsed:  prev.witchLifeUsed  || usedLife,
        witchDeathUsed: prev.witchDeathUsed || (killIdx !== null),
      });
    });
  }, [update]);

  // ── Protector ─────────────────────────────────────────────
  const protectorProtect = useCallback((idx: number) => {
    update(prev => {
      const nightResult = { ...prev.nightResult, protectedIndex: idx };
      return nextRecurringRole({ ...prev, nightResult, protectorLastProtected: idx });
    });
  }, [update]);

  // ── Zorro ─────────────────────────────────────────────────
  const zorroCheck = useCallback((hadWolf: boolean) => {
    update(prev =>
      nextRecurringRole({ ...prev, zorroActive: hadWolf ? prev.zorroActive : false })
    );
  }, [update]);

  const skipNightRole = useCallback(() => {
    update(prev => nextRecurringRole(prev));
  }, [update]);

  // ── Day: after day-announce, go to hunter / caballero / debate ──
  const goAfterAnnounce = useCallback(() => {
    update(prev => {
      if (prev.pendingHunterShot !== null) return { ...prev, phase: 'day-hunter-night' };
      if (prev.caballeroDied) return { ...prev, phase: 'day-caballero' };
      return { ...prev, phase: 'day-debate' };
    });
  }, [update]);

  // ── Hunter fires ──────────────────────────────────────────
  const hunterShoot = useCallback((targetIdx: number) => {
    update(prev => {
      let players = [...prev.players];
      let killed = [...prev.eliminatedToday];
      ({ players, killed } = killPlayer(players, targetIdx, killed, prev.cupidLovers));
      const draft = { ...prev, players, eliminatedToday: killed, pendingHunterShot: null };
      draft.winner = checkWinner(players, draft);

      let phase: GamePhase;
      if (prev.phase === 'day-hunter-night') {
        // Hunter fired after night deaths — go to caballero or debate
        phase = prev.caballeroDied ? 'day-caballero' : 'day-debate';
      } else {
        // Hunter fired after being lynched (day-eliminate context)
        phase = 'day-eliminate';
      }
      return { ...draft, phase };
    });
  }, [update]);

  // ── Caballero: adjacent wolf dies ────────────────────────
  const caballeroResolve = useCallback(() => {
    update(prev => {
      if (prev.caballeroAdjacentWolf === null) {
        return { ...prev, caballeroDied: false, phase: 'day-debate' };
      }
      let players = [...prev.players];
      let killed = [...prev.eliminatedToday];
      ({ players, killed } = killPlayer(players, prev.caballeroAdjacentWolf, killed, prev.cupidLovers));
      const draft = { ...prev, players, eliminatedToday: killed, caballeroDied: false, caballeroAdjacentWolf: null };
      draft.winner = checkWinner(players, draft);
      return { ...draft, phase: 'day-debate' };
    });
  }, [update]);

  // ── Day flow ──────────────────────────────────────────────
  const startDebate = useCallback(() => {
    update(prev => ({ ...prev, phase: 'day-debate' }));
  }, [update]);

  const startVote = useCallback(() => {
    update(prev => ({ ...prev, phase: 'day-vote', lynchCandidate: null }));
  }, [update]);

  const confirmLynch = useCallback((idx: number) => {
    update(prev => {
      let players = [...prev.players];
      let killed: number[] = [];
      ({ players, killed } = killPlayer(players, idx, killed, prev.cupidLovers));

      // Angel wins if first lynch and it's the angel
      let winner: GameState['winner'] = null;
      if (prev.angelFirstLynch && prev.players[idx]?.role?.id === 'angel') {
        winner = 'angel';
      }

      // Hunter check
      const hunterDied = killed.find(i => prev.players[i]?.role?.id === 'cazador') ?? null;
      const pendingHunterShot = hunterDied !== undefined && hunterDied !== null ? hunterDied : null;

      // Anciano lynched: all special roles lose their powers
      const ancianoLinched = prev.players[idx]?.role?.id === 'anciano';

      const draft: GameState = {
        ...prev, players,
        lynchCandidate: idx,
        eliminatedToday: killed,
        pendingHunterShot,
        angelFirstLynch: false,
        ancianoLinched: prev.ancianoLinched || ancianoLinched,
        // If anciano was lynched, disable special powers
        witchLifeUsed:  ancianoLinched ? true : prev.witchLifeUsed,
        witchDeathUsed: ancianoLinched ? true : prev.witchDeathUsed,
        zorroActive:    ancianoLinched ? false : prev.zorroActive,
        phase: 'day-eliminate',
        winner,
      };
      if (!winner) draft.winner = checkWinner(players, draft);
      return draft;
    });
  }, [update]);

  const skipLynch = useCallback(() => {
    update(prev => ({
      ...prev, lynchCandidate: null, eliminatedToday: [],
      pendingHunterShot: null, phase: 'day-eliminate' as GamePhase,
    }));
  }, [update]);

  // ── Judge ─────────────────────────────────────────────────
  const judgeActivate = useCallback(() => {
    update(prev => ({ ...prev, judgeUsed: true, judgeSecondVoteActive: true, phase: 'day-judge-second-vote' as GamePhase }));
  }, [update]);

  const judgeSecondVoteConfirm = useCallback((idx: number) => {
    update(prev => {
      // idx === -1 means the judge chose not to lynch anyone
      if (idx === -1) {
        return { ...prev, judgeSecondVoteActive: false, phase: 'day-eliminate' as GamePhase };
      }
      let players = [...prev.players];
      let killed: number[] = [];
      ({ players, killed } = killPlayer(players, idx, killed, prev.cupidLovers));
      const hunterDied = killed.find(i => prev.players[i]?.role?.id === 'cazador') ?? null;
      const pendingHunterShot = hunterDied !== undefined && hunterDied !== null ? hunterDied : null;
      const draft: GameState = {
        ...prev, players,
        eliminatedToday: [...prev.eliminatedToday, ...killed],
        pendingHunterShot, judgeSecondVoteActive: false,
        phase: 'day-eliminate' as GamePhase,
      };
      draft.winner = checkWinner(players, draft);
      return draft;
    });
  }, [update]);

  // ── Next night ────────────────────────────────────────────
  const nextNight = useCallback(() => {
    update(prev => {
      const round = prev.round + 1;
      const draft: GameState = {
        ...prev, round,
        isFirstNight: false,
        phase: 'night-announce',
        nightResult: emptyNightResult(),
        pendingNightRoles: [],
        eliminatedToday: [],
        lynchCandidate: null,
        pendingHunterShot: null,
        caballeroDied: false,
        caballeroAdjacentWolf: null,
        judgeSecondVoteActive: false,
        // Feroz alternates: can attack every OTHER night
        ferozCanAttack: !prev.ferozCanAttack,
      };
      draft.winner = checkWinner(prev.players, draft);
      return draft;
    });
  }, [update]);

  return {
    gs,
    // Night
    confirmNightAnnounce,
    confirmGirlHint,
    confirmGirlHint2,
    perroLoboChoose,
    cupidSetLovers,
    confirmGemelas,
    wildChildPickModel,
    wolvesPickVictim,
    ferozPickVictim,
    padreInfect,
    padrePasa,
    confirmVidente,
    witchAction,
    protectorProtect,
    zorroCheck,
    skipNightRole,
    // Day
    goAfterAnnounce,
    hunterShoot,
    caballeroResolve,
    startDebate,
    startVote,
    confirmLynch,
    skipLynch,
    judgeActivate,
    judgeSecondVoteConfirm,
    nextNight,
  };
}
