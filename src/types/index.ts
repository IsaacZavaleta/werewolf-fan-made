export type RoleGroup = 'wolf' | 'special' | 'neutral';

export interface RoleDef {
  id: string;
  name: string;
  group: RoleGroup;
  icon: string;
  desc: string;
  max: number;
  default: number;
}

export interface Player {
  name: string;
  role: RoleDef | null;
  alive: boolean;
  index: number;
}

export interface RoleState {
  active: boolean;
  count: number;
}

export type RoleStates = Record<string, RoleState>;

export type Screen =
  | 'landing'
  | 'setup-players'
  | 'setup-roles'
  | 'reveal'
  | 'game';

export type GamePhase =
  | 'night-announce'
  | 'night-girl-hint'
  | 'night-wolves'
  | 'night-role-vidente'
  | 'night-role-bruja'
  | 'night-role-protector'
  | 'night-role-cupido'
  | 'night-role-zorro'
  | 'day-announce'
  | 'day-debate'
  | 'day-vote'
  | 'day-eliminate';

export interface NightResult {
  wolfVictim: number | null;
  savedByWitch: boolean;
  killedByWitch: number | null;
  protectedIndex: number | null;
}

export interface GameState {
  players: Player[];
  round: number;
  isFirstNight: boolean;
  phase: GamePhase;
  nightResult: NightResult;
  pendingNightRoles: string[];
  eliminatedToday: number[];
  lynchCandidate: number | null;
  witchLifeUsed: boolean;
  witchDeathUsed: boolean;
  protectorLastProtected: number | null;
  // Cupido state
  cupidLovers: [number, number] | null;   // indices of the two lovers
  // Zorro state
  zorroActive: boolean;                    // loses power if first guess was wrong
  // Winner
  winner: 'villagers' | 'wolves' | 'lovers' | null;
}
