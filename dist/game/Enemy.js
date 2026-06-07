let enemyCounter = 0;
export class Enemy {
    id;
    configId;
    rewardCoins;
    spriteKey;
    emoji;
    maxHealth;
    isBoss;
    damageToCastle;
    x;
    y;
    health;
    speed;
    state;
    currentProblem;
    constructor(config, problem, x, y, speedOverride) {
        enemyCounter += 1;
        this.id = `enemy-${enemyCounter}`;
        this.configId = config.id;
        this.rewardCoins = config.rewardCoins;
        this.spriteKey = config.spriteKey;
        this.emoji = config.emoji;
        this.maxHealth = config.maxHealth;
        this.isBoss = config.isBoss ?? false;
        this.damageToCastle = config.damageToCastle ?? 1;
        this.x = x;
        this.y = y;
        this.health = config.maxHealth;
        this.speed = speedOverride ?? config.speed;
        this.state = "walking";
        this.currentProblem = problem;
    }
    update(deltaTime, castleLineX) {
        if (this.state !== "walking") {
            return;
        }
        this.x -= this.speed * deltaTime;
        if (this.x <= castleLineX) {
            this.x = castleLineX;
            this.state = "reachedCastle";
        }
    }
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health === 0) {
            this.state = "defeated";
        }
    }
    setProblem(problem) {
        this.currentProblem = problem;
    }
    render() {
        return this.emoji;
    }
}
//# sourceMappingURL=Enemy.js.map