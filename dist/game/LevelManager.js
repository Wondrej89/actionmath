import { levels } from "../data/levels.js";
export class LevelManager {
    activeLevel = levels[0];
    getLevel() {
        return this.activeLevel;
    }
    getWave(waveNumber) {
        return this.activeLevel.waves[Math.min(waveNumber - 1, this.activeLevel.waves.length - 1)];
    }
    getWaveCount() {
        return this.activeLevel.waves.length;
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
                allowThreeNumbers: true,
            };
        }
        return this.activeLevel.mathSettings;
    }
    getNextEnemyType(spawnIndex) {
        return this.activeLevel.enemyTypes[spawnIndex % this.activeLevel.enemyTypes.length];
    }
}
//# sourceMappingURL=LevelManager.js.map