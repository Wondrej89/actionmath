import type { EnemyConfig } from "../game/types.js";

export const enemyConfigs: EnemyConfig[] = [
  {
    id: "slime_green",
    name: "Green Slime",
    maxHealth: 1,
    speed: 24,
    rewardCoins: 10,
    spriteKey: "enemy_slime",
    emoji: "🟢",
  },
  {
    id: "goblin_small",
    name: "Tiny Goblin",
    maxHealth: 1,
    speed: 28,
    rewardCoins: 12,
    spriteKey: "enemy_goblin",
    emoji: "👾",
  },
];

export function getEnemyConfig(id: string): EnemyConfig {
  const config = enemyConfigs.find((enemy) => enemy.id === id);
  if (!config) {
    throw new Error(`Unknown enemy config: ${id}`);
  }
  return config;
}
