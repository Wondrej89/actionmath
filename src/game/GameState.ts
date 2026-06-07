import type { Difficulty, GameStatus, MathProblem } from "./types.js";
import type { Enemy } from "./Enemy.js";

export interface GameState {
  status: GameStatus;
  castleHealth: number;
  maxCastleHealth: number;
  coins: number;
  score: number;
  currentWave: number;
  currentDifficulty: Difficulty;
  enemies: Enemy[];
  activeProblem: MathProblem | null;
  enemiesDefeatedInWave: number;
  enemiesSpawnedInWave: number;
  feedback: "correct" | "wrong" | null;
}

export function createInitialGameState(): GameState {
  return {
    status: "menu",
    castleHealth: 3,
    maxCastleHealth: 3,
    coins: 0,
    score: 0,
    currentWave: 1,
    currentDifficulty: "easy",
    enemies: [],
    activeProblem: null,
    enemiesDefeatedInWave: 0,
    enemiesSpawnedInWave: 0,
    feedback: null,
  };
}
