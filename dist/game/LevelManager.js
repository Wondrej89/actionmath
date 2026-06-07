import { levels } from "../data/levels.js";
export class LevelManager {
    activeLevel = levels[0];
    getLevel() {
        return this.activeLevel;
    }
    getWave(waveNumber) {
        const configuredWave = this.activeLevel.waves[waveNumber - 1];
        if (configuredWave) {
            return configuredWave;
        }
        return this.createScalingWave(waveNumber);
    }
    getWaveCount() {
        return "∞";
    }
    getCurrentDifficulty(waveNumber) {
        return this.getWave(waveNumber).difficulty;
    }
    getMathSettings(waveNumber) {
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
                allowThreeNumbers: waveNumber >= 9,
            };
        }
        return this.activeLevel.mathSettings;
    }
    getNextEnemyType(spawnIndex, waveNumber) {
        const wave = this.getWave(waveNumber);
        const bossEnemyType = wave.bossEnemyType ?? this.activeLevel.bossEnemyType;
        const isLastEnemyInBossWave = this.isBossWave(waveNumber) && spawnIndex === wave.enemyCount - 1;
        if (isLastEnemyInBossWave) {
            return bossEnemyType;
        }
        return this.activeLevel.enemyTypes[spawnIndex % this.activeLevel.enemyTypes.length];
    }
    isBossWave(waveNumber) {
        return waveNumber > 0 && waveNumber % this.activeLevel.bossEveryWaves === 0;
    }
    createScalingWave(waveNumber) {
        const bossEnemyType = this.isBossWave(waveNumber) ? this.activeLevel.bossEnemyType : undefined;
        return {
            waveNumber,
            enemyCount: Math.min(24, 10 + Math.floor(waveNumber * 0.75)),
            spawnInterval: Math.max(1200, 3600 - waveNumber * 140),
            enemySpeed: Math.min(90, 32 + waveNumber * 3),
            difficulty: this.getScalingDifficulty(waveNumber),
            bossEnemyType,
        };
    }
    getScalingDifficulty(waveNumber) {
        if (waveNumber <= 2) {
            return "easy";
        }
        if (waveNumber <= 5) {
            return "medium";
        }
        return "hard";
    }
}
//# sourceMappingURL=LevelManager.js.map