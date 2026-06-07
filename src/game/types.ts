export type Difficulty = "easy" | "medium" | "hard";
export type GameStatus = "menu" | "playing" | "paused" | "gameOver";
export type Operation = "+" | "-";
export type ProblemType = "chooseResult" | "chooseOperator" | "missingNumber" | "buildExpression";
export type EnemyState = "walking" | "attacking" | "defeated" | "reachedCastle";

export interface MathSettings {
  allowedOperations: Operation[];
  minNumber: number;
  maxNumber: number;
  allowCrossTen: boolean;
  allowThreeNumbers: boolean;
}

export interface MathProblem {
  type: ProblemType;
  expression: string;
  correctAnswer: string | number;
  options: Array<string | number>;
  difficulty: Difficulty;
}

export interface EnemyConfig {
  id: string;
  name: string;
  maxHealth: number;
  speed: number;
  rewardCoins: number;
  spriteKey: string;
  emoji: string;
  isBoss?: boolean;
  damageToCastle?: number;
  problemSettings?: Partial<MathSettings>;
}

export interface WaveConfig {
  waveNumber: number;
  enemyCount: number;
  spawnInterval: number;
  enemySpeed: number;
  difficulty: Difficulty;
  bossEnemyType?: string;
}

export interface LevelConfig {
  id: string;
  name: string;
  background: string;
  castleSkin: string;
  enemyTypes: string[];
  bossEnemyType: string;
  bossEveryWaves: number;
  waveCount: number;
  difficulty: Difficulty;
  spawnInterval: number;
  enemySpeedMultiplier: number;
  mathSettings: MathSettings;
  waves: WaveConfig[];
}

export type UpgradeEffectType =
  | "castleHealth"
  | "enemySlow"
  | "coinBonus"
  | "shield"
  | "autoSlow";

export interface UpgradeEffect {
  type: UpgradeEffectType;
  value: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  effect: UpgradeEffect;
}
