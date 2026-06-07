export function createInitialGameState() {
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
//# sourceMappingURL=GameState.js.map