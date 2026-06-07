import type { EnemyConfig } from "../game/types.js";

export const enemyConfigs: EnemyConfig[] = [
  {
    id: "slime_green",
    name: "Green Slime",
    maxHealth: 1,
    speed: 24,
    rewardCoins: 10,
    spriteKey: "enemy_purple_pawn_run",
    emoji: "🟣",
  },
  {
    id: "goblin_small",
    name: "Tiny Goblin",
    maxHealth: 1,
    speed: 28,
    rewardCoins: 12,
    spriteKey: "enemy_red_warrior_run",
    emoji: "⚔️",
  },
  {
    id: "boss_ogre",
    name: "Math Ogre Boss",
    maxHealth: 3,
    speed: 18,
    rewardCoins: 45,
    spriteKey: "enemy_red_warrior_run",
    emoji: "👹",
    isBoss: true,
    damageToCastle: 2,
    problemSettings: {
      maxNumber: 20,
      allowCrossTen: true,
      allowThreeNumbers: true,
    },
  },
];

export function getEnemyConfig(id: string): EnemyConfig {
  const config = enemyConfigs.find((enemy) => enemy.id === id);
  if (!config) {
    throw new Error(`Unknown enemy config: ${id}`);
  }
  return config;
}
