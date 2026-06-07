export class Hud {
    element = document.createElement("header");
    hearts = document.createElement("div");
    coins = document.createElement("div");
    score = document.createElement("div");
    wave = document.createElement("div");
    difficulty = document.createElement("div");
    constructor() {
        this.element.className = "hud";
        this.element.append(this.hearts, this.coins, this.score, this.wave, this.difficulty);
    }
    update(props) {
        this.hearts.className = "hud-card hearts";
        this.coins.className = "hud-card coins";
        this.score.className = "hud-card score";
        this.wave.className = "hud-card wave";
        this.difficulty.className = `hud-card difficulty ${props.difficulty}`;
        this.hearts.textContent = props.hearts;
        this.coins.textContent = `🪙 ${props.coins}`;
        this.score.textContent = `Score ${props.score}`;
        this.wave.textContent = `Wave ${props.wave} / ${props.waveCount}`;
        this.difficulty.textContent = props.difficulty.toUpperCase();
    }
}
//# sourceMappingURL=Hud.js.map