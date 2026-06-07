export class Economy {
  coins = 0;
  score = 0;
  private coinBonus = 0;

  reset(): void {
    this.coins = 0;
    this.score = 0;
    this.coinBonus = 0;
  }

  setCoinBonus(value: number): void {
    this.coinBonus = value;
  }

  reward(baseCoins: number): number {
    const earned = baseCoins + this.coinBonus;
    this.coins += earned;
    this.score += earned * 10;
    return earned;
  }
}
