import { useState, useCallback } from 'react';
import { ROLES } from '../data/roles';
import type { Player, RoleStates, Screen } from '../types';

// ── Helper: Fisher-Yates shuffle ────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Build initial RoleStates ─────────────────────────────────
function buildInitialRoleStates(): RoleStates {
  return Object.fromEntries(
    ROLES.map((r) => [r.id, { active: false, count: r.default }])
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useGameSetup() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [playerCount, setPlayerCount] = useState<number>(8);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [roleStates, setRoleStates] = useState<RoleStates>(buildInitialRoleStates);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showStartDialog, setShowStartDialog] = useState<boolean>(false);
  const [rolesError, setRolesError] = useState<string>('');

  // ── Navigation ───────────────────────────────────────────
  const goTo = useCallback((s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  }, []);

  // ── Player names ─────────────────────────────────────────
  const initPlayerNames = useCallback((n: number) => {
    setPlayerNames(Array.from({ length: n }, (_, i) => `Jugador ${i + 1}`));
  }, []);

  const setPlayerName = useCallback((index: number, name: string) => {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  }, []);

  // ── Role toggles ─────────────────────────────────────────
  const toggleRole = useCallback((id: string) => {
    setRoleStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], active: !prev[id].active },
    }));
    setRolesError('');
  }, []);

  const changeRoleCount = useCallback((id: string, delta: number) => {
    const roleDef = ROLES.find((r) => r.id === id)!;
    setRoleStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        count: Math.max(1, Math.min(roleDef.max, prev[id].count + delta)),
      },
    }));
    setRolesError('');
  }, []);

  // ── Total assigned slots ──────────────────────────────────
  const assignedCount = ROLES.reduce(
    (sum, r) => sum + (roleStates[r.id]?.active ? (roleStates[r.id]?.count ?? 0) : 0),
    0
  );

  // ── Deal roles ────────────────────────────────────────────
  const dealRoles = useCallback(() => {
    const total = playerNames.length;
    const pool = ROLES.flatMap((r) => {
      if (!roleStates[r.id]?.active) return [];
      return Array.from({ length: roleStates[r.id].count }, () => r);
    });

    if (pool.some(r => r.group === 'neutral') === false) {
      setRolesError('Debe haber al menos un Aldeano activo.');
      return;
    }
    if (pool.some(r => r.group === 'wolf') === false) {
      setRolesError('Debe haber al menos un Hombre Lobo activo.');
      return;
    }
    if (pool.length < total) {
      setRolesError(`Faltan ${total - pool.length} roles. Activa más roles o aumenta su cantidad.`);
      return;
    }
    if (pool.length > total) {
      setRolesError(`Hay ${pool.length - total} roles de más. Reduce la cantidad.`);
      return;
    }

    const shuffledPool = shuffle(pool);
    // Include alive and index so GamePage / useGame can consume them directly
    const assigned: Player[] = playerNames.map((name, i) => ({
      name: name.trim() || `Jugador ${i + 1}`,
      role: shuffledPool[i],
      alive: true,
      index: i,
    }));

    setPlayers(assigned);
    setCurrentIndex(0);
    setShowStartDialog(false);
    goTo('reveal');
  }, [playerNames, roleStates, goTo]);

  // ── Reveal navigation ─────────────────────────────────────
  const movePlayer = useCallback(
    (dir: 1 | -1) => {
      const isLast = currentIndex === players.length - 1;
      if (dir === 1 && isLast) {
        setShowStartDialog(true);
        return;
      }
      setCurrentIndex((i) => Math.max(0, Math.min(players.length - 1, i + dir)));
    },
    [currentIndex, players.length]
  );

  // ── Start game ────────────────────────────────────────────
  const startGame = useCallback(() => {
    setShowStartDialog(false);
    goTo('game');
  }, [goTo]);

  // ── Full reset ────────────────────────────────────────────
  const resetAll = useCallback(() => {
    setPlayerCount(8);
    setPlayerNames([]);
    setRoleStates(buildInitialRoleStates());
    setPlayers([]);
    setCurrentIndex(0);
    setShowStartDialog(false);
    setRolesError('');
    goTo('landing');
  }, [goTo]);

  return {
    // state
    screen,
    playerCount,
    playerNames,
    roleStates,
    players,
    currentIndex,
    showStartDialog,
    rolesError,
    assignedCount,
    // actions
    goTo,
    setPlayerCount,
    initPlayerNames,
    setPlayerName,
    toggleRole,
    changeRoleCount,
    dealRoles,
    movePlayer,
    startGame,
    setShowStartDialog,
    resetAll,
  };
}
