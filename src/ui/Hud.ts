import type { Difficulty } from "../game/types.js";

interface HudProps {
  hearts: string;
  coins: number;
  score: number;
  wave: number;
  waveCount: number;
  difficulty: Difficulty;
}

export class Hud {
  readonly element = document.createElement("header");
  private readonly hearts = document.createElement("div");
  private readonly coins = document.createElement("div");
  private readonly score = document.createElement("div");
  private readonly wave = document.createElement("div");
  private readonly difficulty = document.createElement("div");

  constructor() {
    this.element.className = "hud";
    this.element.append(this.hearts, this.coins, this.score, this.wave, this.difficulty);
  }

  update(props: HudProps): void {
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
