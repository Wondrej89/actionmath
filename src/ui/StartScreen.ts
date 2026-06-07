export class StartScreen {
  readonly element = document.createElement("section");

  constructor(onStart: () => void) {
    this.element.className = "screen start-screen";
    this.element.innerHTML = `
      <div class="screen-card">
        <div class="logo-shield">🛡️</div>
        <h1>Math Castle Defense</h1>
        <p>Protect the castle by solving kid-friendly math problems.</p>
        <button class="primary-button" type="button">Start Game</button>
      </div>
    `;
    this.element.querySelector("button")?.addEventListener("click", onStart);
  }
}
