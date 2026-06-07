export class GameOverScreen {
    element = document.createElement("section");
    score = document.createElement("p");
    coins = document.createElement("p");
    constructor(onRestart) {
        this.element.className = "screen game-over-screen hidden";
        const card = document.createElement("div");
        card.className = "screen-card";
        const title = document.createElement("h2");
        title.textContent = "Game Over";
        const button = document.createElement("button");
        button.className = "primary-button";
        button.type = "button";
        button.textContent = "Play Again";
        button.addEventListener("click", onRestart);
        card.append(title, this.score, this.coins, button);
        this.element.append(card);
    }
    update(score, coins) {
        this.score.textContent = `Score: ${score}`;
        this.coins.textContent = `Coins: ${coins}`;
    }
    show() {
        this.element.classList.remove("hidden");
    }
    hide() {
        this.element.classList.add("hidden");
    }
}
//# sourceMappingURL=GameOverScreen.js.map