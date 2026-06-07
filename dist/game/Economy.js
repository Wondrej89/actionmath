export class Economy {
    coins = 0;
    score = 0;
    coinBonus = 0;
    reset() {
        this.coins = 0;
        this.score = 0;
        this.coinBonus = 0;
    }
    setCoinBonus(value) {
        this.coinBonus = value;
    }
    reward(baseCoins) {
        const earned = baseCoins + this.coinBonus;
        this.coins += earned;
        this.score += earned * 10;
        return earned;
    }
}
//# sourceMappingURL=Economy.js.map