export class Castle {
    health;
    maxHealth;
    constructor(maxHealth) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }
    reset() {
        this.health = this.maxHealth;
    }
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }
    renderHearts() {
        return "❤️".repeat(this.health) + "🖤".repeat(this.maxHealth - this.health);
    }
}
//# sourceMappingURL=Castle.js.map