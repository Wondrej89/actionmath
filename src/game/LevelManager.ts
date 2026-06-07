import { levels } from "../data/levels.js";
import type { Difficulty, LevelConfig, MathSettings, WaveConfig } from "./types.js";

export class LevelManager {
  private activeLevel: LevelConfig = levels[0];

  getLevel(): LevelConfig {
    return this.activeLevel;
  }

  getWave(waveNumber: number): WaveConfig {
    return this.activeLevel.waves[Math.min(waveNumber - 1, this.activeLevel.waves.length - 1)];
  }

  getWaveCount(): number {
    return this.activeLevel.waves.length;
  }

  getCurrentDifficulty(waveNumber: number): Difficulty {
    return this.getWave(waveNumber).difficulty;
  }

  getMathSettings(waveNumber: number): MathSettings {
    const difficulty = this.getCurrentDifficulty(waveNumber);

    if (difficulty === "medium") {
      return {
        ...this.activeLevel.mathSettings,
        maxNumber: 20,
        allowCrossTen: true,
      };
    }

    if (difficulty === "hard") {
      return {
        ...this.activeLevel.mathSettings,
        maxNumber: 20,
        allowCrossTen: true,
        allowThreeNumbers: true,
      };
    }

    return this.activeLevel.mathSettings;
  }

  getNextEnemyType(spawnIndex: number): string {
    return this.activeLevel.enemyTypes[spawnIndex % this.activeLevel.enemyTypes.length];
  }
}
