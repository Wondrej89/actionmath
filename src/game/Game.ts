import { getEnemyConfig } from "../data/enemies.js";
import { getAssetPath } from "../assets/placeholder/assetMap.js";
import { AnswerPanel } from "../ui/AnswerPanel.js";
import { GameOverScreen } from "../ui/GameOverScreen.js";
import { Hud } from "../ui/Hud.js";
import { StartScreen } from "../ui/StartScreen.js";
import { Castle } from "./Castle.js";
import { Economy } from "./Economy.js";
import { Enemy } from "./Enemy.js";
import { GameLoop } from "./GameLoop.js";
import { createInitialGameState, type GameState } from "./GameState.js";
import { LevelManager } from "./LevelManager.js";
import { ProblemGenerator } from "./ProblemGenerator.js";
import { UpgradeSystem } from "./UpgradeSystem.js";
import type { MathProblem } from "./types.js";

const GAME_WIDTH = 1000;
const CASTLE_LINE_X = 160;
const ENEMY_START_X = 900;
const ENEMY_Y = 310;

export class Game {
  private state: GameState = createInitialGameState();
  private readonly castle = new Castle(3);
  private readonly economy = new Economy();
  private readonly upgrades = new UpgradeSystem();
  private readonly levelManager = new LevelManager();
  private readonly problemGenerator = new ProblemGenerator();
  private readonly loop = new GameLoop((deltaSeconds) => this.update(deltaSeconds));

  private readonly shell = document.createElement("main");
  private readonly scene = document.createElement("section");
  private readonly battlefield = document.createElement("div");
  private readonly enemyLayer = document.createElement("div");
  private readonly activeProblem = document.createElement("div");
  private readonly waveBanner = document.createElement("div");
  private readonly hud = new Hud();
  private readonly answerPanel = new AnswerPanel((answer) => this.handleAnswer(answer));
  private readonly startScreen = new StartScreen(() => this.startGame());
  private readonly gameOverScreen = new GameOverScreen(() => this.startGame());

  constructor(private readonly root: HTMLElement) {}

  boot(): void {
    this.shell.className = "game-shell";
    this.scene.className = "game-scene hidden";
    this.battlefield.className = "battlefield";
    this.enemyLayer.className = "enemy-layer";
    this.activeProblem.className = "global-problem";
    this.waveBanner.className = "wave-banner hidden";

    const castleAssetPath = getAssetPath("castle_default");
    this.battlefield.innerHTML = `
      <div class="skyline"></div>
      <div class="castle ${castleAssetPath ? "castle--sprite" : ""}" aria-label="Castle">
        ${
          castleAssetPath
            ? `<img class="castle-sprite" src="${castleAssetPath}" alt="Castle" />`
            : `
              <div class="castle-flag">⚑</div>
              <div class="castle-towers">🏰</div>
              <div class="castle-label">Castle</div>
            `
        }
      </div>
      <div class="defense-tower">🧙‍♂️</div>
      <div class="path"></div>
      <div class="future-upgrades">Upgrades<br><span>shop later</span></div>
    `;
    this.battlefield.append(this.enemyLayer, this.activeProblem, this.waveBanner);
    this.scene.append(this.hud.element, this.battlefield, this.answerPanel.element);
    this.shell.append(this.startScreen.element, this.scene, this.gameOverScreen.element);
    this.root.replaceChildren(this.shell);
    this.render();
  }

  private startGame(): void {
    this.state = createInitialGameState();
    this.state.status = "playing";
    this.castle.maxHealth = this.state.maxCastleHealth;
    this.castle.reset();
    this.economy.reset();
    this.economy.setCoinBonus(this.upgrades.getCoinBonus());
    this.gameOverScreen.hide();
    this.startScreen.element.classList.add("hidden");
    this.scene.classList.remove("hidden");
    this.spawnEnemy();
    this.showWaveBanner(`Wave ${this.state.currentWave}`);
    this.loop.start();
    this.render();
  }

  private update(deltaSeconds: number): void {
    if (this.state.status !== "playing") {
      return;
    }

    for (const enemy of this.state.enemies) {
      enemy.update(deltaSeconds, CASTLE_LINE_X);
    }

    const reachedCastle = this.state.enemies.find((enemy) => enemy.state === "reachedCastle");
    if (reachedCastle) {
      this.handleEnemyReachedCastle(reachedCastle);
    }

    this.render();
  }

  private spawnEnemy(): void {
    const wave = this.levelManager.getWave(this.state.currentWave);
    if (this.state.enemiesSpawnedInWave >= wave.enemyCount) {
      this.advanceWaveIfComplete();
      return;
    }

    const problem = this.createProblem();
    const enemyType = this.levelManager.getNextEnemyType(this.state.enemiesSpawnedInWave);
    const config = getEnemyConfig(enemyType);
    const enemy = new Enemy(config, problem, ENEMY_START_X, ENEMY_Y, wave.enemySpeed);
    this.state.enemies = [enemy];
    this.state.activeProblem = problem;
    this.state.currentDifficulty = wave.difficulty;
    this.state.enemiesSpawnedInWave += 1;
  }

  private createProblem(): MathProblem {
    return this.problemGenerator.generate(
      this.levelManager.getCurrentDifficulty(this.state.currentWave),
      this.levelManager.getMathSettings(this.state.currentWave),
    );
  }

  private handleAnswer(answer: string | number): void {
    if (this.state.status !== "playing" || !this.state.activeProblem) {
      return;
    }

    const isCorrect = answer === this.state.activeProblem.correctAnswer;
    this.answerPanel.flash(isCorrect);
    this.state.feedback = isCorrect ? "correct" : "wrong";
    window.setTimeout(() => {
      this.state.feedback = null;
      this.render();
    }, 450);

    if (!isCorrect) {
      this.nudgeEnemyForward();
      this.render();
      return;
    }

    const enemy = this.state.enemies[0];
    if (enemy) {
      enemy.takeDamage(1);
      this.economy.reward(enemy.rewardCoins);
      this.state.coins = this.economy.coins;
      this.state.score = this.economy.score;
      this.state.enemiesDefeatedInWave += 1;
    }

    this.state.enemies = [];
    this.state.activeProblem = null;
    this.advanceWaveIfComplete();
    if (this.state.status === "playing" && this.state.enemies.length === 0) {
      window.setTimeout(() => {
        if (this.state.status === "playing") {
          this.spawnEnemy();
          this.render();
        }
      }, 450);
    }
    this.render();
  }

  private nudgeEnemyForward(): void {
    const enemy = this.state.enemies[0];
    if (!enemy) {
      return;
    }

    enemy.x = Math.max(CASTLE_LINE_X, enemy.x - 45);
    if (enemy.x <= CASTLE_LINE_X) {
      enemy.state = "reachedCastle";
      this.handleEnemyReachedCastle(enemy);
    }
  }

  private handleEnemyReachedCastle(enemy: Enemy): void {
    this.castle.takeDamage(1);
    this.state.castleHealth = this.castle.health;
    this.state.enemies = this.state.enemies.filter((item) => item.id !== enemy.id);
    this.state.activeProblem = null;

    if (this.castle.health <= 0) {
      this.endGame();
      return;
    }

    this.advanceWaveIfComplete();
    if (this.state.status === "playing" && this.state.enemies.length === 0) {
      this.spawnEnemy();
    }
  }

  private advanceWaveIfComplete(): void {
    const wave = this.levelManager.getWave(this.state.currentWave);
    const allSpawned = this.state.enemiesSpawnedInWave >= wave.enemyCount;
    const noEnemies = this.state.enemies.length === 0;

    if (!allSpawned || !noEnemies) {
      return;
    }

    if (this.state.currentWave >= this.levelManager.getWaveCount()) {
      this.state.enemiesSpawnedInWave = 0;
      this.state.enemiesDefeatedInWave = 0;
      this.state.currentWave = 1;
      this.showWaveBanner("Bonus loop!");
      return;
    }

    this.state.currentWave += 1;
    this.state.enemiesSpawnedInWave = 0;
    this.state.enemiesDefeatedInWave = 0;
    this.state.currentDifficulty = this.levelManager.getCurrentDifficulty(this.state.currentWave);
    this.showWaveBanner(`Wave ${this.state.currentWave}`);
  }

  private endGame(): void {
    this.state.status = "gameOver";
    this.loop.stop();
    this.gameOverScreen.update(this.state.score, this.state.coins);
    this.gameOverScreen.show();
  }

  private showWaveBanner(text: string): void {
    this.waveBanner.textContent = text;
    this.waveBanner.classList.remove("hidden");
    window.setTimeout(() => this.waveBanner.classList.add("hidden"), 1200);
  }

  private render(): void {
    const level = this.levelManager.getLevel();
    this.hud.update({
      hearts: this.castle.renderHearts(),
      coins: this.state.coins,
      score: this.state.score,
      wave: this.state.currentWave,
      waveCount: this.levelManager.getWaveCount(),
      difficulty: this.state.currentDifficulty,
    });

    this.scene.dataset.level = level.id;
    this.battlefield.style.setProperty("--game-width", String(GAME_WIDTH));
    this.renderEnemies();
    this.renderProblemBubble();
    this.answerPanel.update(this.state.activeProblem);
  }

  private renderEnemies(): void {
    this.enemyLayer.innerHTML = "";

    for (const enemy of this.state.enemies) {
      const node = document.createElement("div");
      node.className = `enemy ${this.state.feedback ?? ""}`;
      node.style.left = `${enemy.x / 10}%`;
      node.style.top = `${enemy.y}px`;
      node.dataset.spriteKey = enemy.spriteKey;
      const assetPath = getAssetPath(enemy.spriteKey);
      node.innerHTML = assetPath
        ? `
          <span class="enemy-shadow"></span>
          <img class="enemy-sprite" src="${assetPath}" alt="${enemy.configId}" />
        `
        : `<span class="enemy-shadow"></span><span class="enemy-emoji">${enemy.render()}</span>`;
      this.enemyLayer.append(node);
    }
  }

  private renderProblemBubble(): void {
    const enemy = this.state.enemies[0];
    if (!enemy || !this.state.activeProblem) {
      this.activeProblem.textContent = "";
      this.activeProblem.classList.add("hidden");
      return;
    }

    this.activeProblem.className = `global-problem ${this.state.feedback ?? ""}`;
    this.activeProblem.textContent = this.state.activeProblem.expression;
    this.activeProblem.style.left = `${Math.min(72, Math.max(32, enemy.x / 10))}%`;
  }
}
