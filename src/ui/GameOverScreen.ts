export class GameOverScreen {
  readonly element = document.createElement("section");
  private readonly score = document.createElement("p");
  private readonly coins = document.createElement("p");

  constructor(onRestart: () => void) {
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

  update(score: number, coins: number): void {
    this.score.textContent = `Score: ${score}`;
    this.coins.textContent = `Coins: ${coins}`;
  }

  show(): void {
    this.element.classList.remove("hidden");
  }

  hide(): void {
    this.element.classList.add("hidden");
  }
}
