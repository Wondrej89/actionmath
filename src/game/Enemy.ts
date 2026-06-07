import type { EnemyConfig, EnemyState, MathProblem } from "./types.js";

let enemyCounter = 0;

export class Enemy {
  readonly id: string;
  readonly configId: string;
  readonly rewardCoins: number;
  readonly spriteKey: string;
  readonly emoji: string;
  readonly maxHealth: number;
  readonly isBoss: boolean;
  readonly damageToCastle: number;
  x: number;
  y: number;
  health: number;
  speed: number;
  state: EnemyState;
  currentProblem: MathProblem;

  constructor(config: EnemyConfig, problem: MathProblem, x: number, y: number, speedOverride?: number) {
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

  update(deltaTime: number, castleLineX: number): void {
    if (this.state !== "walking") {
      return;
    }

    this.x -= this.speed * deltaTime;

    if (this.x <= castleLineX) {
      this.x = castleLineX;
      this.state = "reachedCastle";
    }
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    if (this.health === 0) {
      this.state = "defeated";
    }
  }

  setProblem(problem: MathProblem): void {
    this.currentProblem = problem;
  }

  render(): string {
    return this.emoji;
  }
}
