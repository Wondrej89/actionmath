export class Castle {
  health: number;
  maxHealth: number;

  constructor(maxHealth: number) {
    this.maxHealth = maxHealth;
    this.health = maxHealth;
  }

  reset(): void {
    this.health = this.maxHealth;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  renderHearts(): string {
    return "❤️".repeat(this.health) + "🖤".repeat(this.maxHealth - this.health);
  }
}
