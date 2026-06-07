const APP_BUILD_ID = "2026-06-07-assets-v2";
const app = document.querySelector("#app");
if (!app) {
    throw new Error("Missing #app root element.");
}
const { Game } = await import(`./game/Game.js?v=${APP_BUILD_ID}`);
const game = new Game(app);
game.boot();
export {};
//# sourceMappingURL=main.js.map