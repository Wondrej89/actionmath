import { Game } from "./game/Game.js";
const app = document.querySelector("#app");
if (!app) {
    throw new Error("Missing #app root element.");
}
const game = new Game(app);
game.boot();
//# sourceMappingURL=main.js.map