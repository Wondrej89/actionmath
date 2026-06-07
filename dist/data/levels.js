export const meadowLevel = {
    id: "green_meadow_castle",
    name: "Green Meadow Before the Castle",
    background: "terrain_tiles_meadow",
    castleSkin: "castle_blue",
    enemyTypes: ["slime_green", "goblin_small"],
    waveCount: 4,
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
        { waveNumber: 2, enemyCount: 7, spawnInterval: 3500, enemySpeed: 27, difficulty: "easy" },
        { waveNumber: 3, enemyCount: 8, spawnInterval: 3000, enemySpeed: 32, difficulty: "medium" },
        { waveNumber: 4, enemyCount: 10, spawnInterval: 2600, enemySpeed: 38, difficulty: "medium" },
    ],
};
export const levels = [meadowLevel];
//# sourceMappingURL=levels.js.map