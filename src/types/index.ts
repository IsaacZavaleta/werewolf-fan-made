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
  // Night
  | 'night-announce'
  | 'night-girl-hint'
  | 'night-role-perrolobo'    // 1st night: dog wolf chooses side
  | 'night-role-cupido'       // 1st night: pick lovers
  | 'night-role-gemelas'      // 1st night: twins recognize each other
  | 'night-role-nino'         // 1st night: wild child picks model
  | 'night-wolves'            // all wolves attack together
  | 'night-role-feroz'        // fierce wolf attacks alone (every 2 nights)
  | 'night-role-padre'        // wolf father infects (once)
  | 'night-role-vidente'
  | 'night-role-bruja'
  | 'night-role-protector'
  | 'night-role-zorro'
  // Day
  | 'day-announce'
  | 'day-hunter-night'        // hunter died at night → fires after day-announce, before debate
  | 'day-caballero'           // knight died → wolf dies next to him (narrador reveals)
  | 'day-debate'
  | 'day-vote'
  | 'day-judge-second-vote'   // judge activated second lynch
  | 'day-eliminate'
  | 'day-hunter-day';         // hunter lynched → fires after card reveal

export interface NightResult {
  wolfVictim: number | null;
  savedByWitch: boolean;
  killedByWitch: number | null;
  protectedIndex: number | null;
  // Fierce wolf second attack
  ferozVictim: number | null;
  // Father of wolves infect (victim turns wolf instead of dying)
  padreInfected: number | null;
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

  // Witch
  witchLifeUsed: boolean;
  witchDeathUsed: boolean;

  // Protector
  protectorLastProtected: number | null;

  // Cupid
  cupidLovers: [number, number] | null;

  // Zorro
  zorroActive: boolean;

  // Wild child
  wildChildModel: number | null;   // index of model player

  // Perro Lobo: chosen side
  perroLoboSide: 'wolf' | 'villager' | null;

  // Fierce wolf attacks every 2 nights
  ferozCanAttack: boolean;

  // Father of wolves: power used flag
  padreUsed: boolean;

  // Knight: died this round → narrador must announce which wolf dies next
  caballeroDied: boolean;
  caballeroAdjacentWolf: number | null; // index of wolf to kill

  // Hunter
  pendingHunterShot: number | null;

  // Judge
  judgeUsed: boolean;
  judgeSecondVoteActive: boolean;

  // Angel
  angelFirstLynch: boolean; // true = first lynch hasn't happened yet

  // Anciano
  ancianoSurvivedAttack: boolean;  // true after surviving first wolf attack
  ancianoLinched: boolean;         // if lynched, specials lose powers

  // Winner
  winner: 'villagers' | 'wolves' | 'lovers' | 'angel' | 'albino' | null;
}
