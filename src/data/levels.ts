import type { LevelConfig } from "../game/types.js";

export const meadowLevel: LevelConfig = {
  id: "green_meadow_castle",
  name: "Green Meadow Before the Castle",
  background: "terrain_tiles_meadow",
  castleSkin: "castle_blue",
  enemyTypes: ["slime_green", "goblin_small"],
  bossEnemyType: "boss_ogre",
  bossEveryWaves: 3,
  waveCount: 12,
  difficulty: "easy",
  spawnInterval: 4000,
  enemySpeedMultiplier: 1,
  mathSettings: {
    allowedOperations: ["+", "-"],
    minNumber: 1,
    maxNumber: 10,
    allowCrossTen: false,
    allowThreeNumbers: false,
  },
  waves: [
    { waveNumber: 1, enemyCount: 5, spawnInterval: 4000, enemySpeed: 22, difficulty: "easy" },
    { waveNumber: 2, enemyCount: 7, spawnInterval: 3600, enemySpeed: 26, difficulty: "easy" },
    { waveNumber: 3, enemyCount: 7, spawnInterval: 3300, enemySpeed: 28, difficulty: "medium", bossEnemyType: "boss_ogre" },
    { waveNumber: 4, enemyCount: 8, spawnInterval: 3100, enemySpeed: 31, difficulty: "medium" },
    { waveNumber: 5, enemyCount: 9, spawnInterval: 2900, enemySpeed: 34, difficulty: "medium" },
    { waveNumber: 6, enemyCount: 9, spawnInterval: 2700, enemySpeed: 36, difficulty: "hard", bossEnemyType: "boss_ogre" },
    { waveNumber: 7, enemyCount: 10, spawnInterval: 2500, enemySpeed: 39, difficulty: "hard" },
    { waveNumber: 8, enemyCount: 11, spawnInterval: 2300, enemySpeed: 42, difficulty: "hard" },
    { waveNumber: 9, enemyCount: 11, spawnInterval: 2200, enemySpeed: 45, difficulty: "hard", bossEnemyType: "boss_ogre" },
    { waveNumber: 10, enemyCount: 12, spawnInterval: 2100, enemySpeed: 48, difficulty: "hard" },
    { waveNumber: 11, enemyCount: 13, spawnInterval: 2000, enemySpeed: 51, difficulty: "hard" },
    { waveNumber: 12, enemyCount: 13, spawnInterval: 1900, enemySpeed: 54, difficulty: "hard", bossEnemyType: "boss_ogre" },
  ],
};

export const levels = [meadowLevel];
