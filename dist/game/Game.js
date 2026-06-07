import { getAssetCandidates, getAssetPath } from "../data/assetResolver.js";
import { getEnemyConfig } from "../data/enemies.js";
import { AnswerPanel } from "../ui/AnswerPanel.js";
import { GameOverScreen } from "../ui/GameOverScreen.js";
import { Hud } from "../ui/Hud.js";
import { StartScreen } from "../ui/StartScreen.js";
import { Castle } from "./Castle.js";
import { Economy } from "./Economy.js";
import { Enemy } from "./Enemy.js";
import { GameLoop } from "./GameLoop.js";
import { createInitialGameState } from "./GameState.js";
import { LevelManager } from "./LevelManager.js";
import { ProblemGenerator } from "./ProblemGenerator.js";
import { UpgradeSystem } from "./UpgradeSystem.js";
const GAME_WIDTH = 1000;
const CASTLE_LINE_X = 160;
const ENEMY_START_X = 900;
const ENEMY_Y = 310;
export class Game {
    root;
    state = createInitialGameState();
    castle = new Castle(3);
    economy = new Economy();
    upgrades = new UpgradeSystem();
    levelManager = new LevelManager();
    problemGenerator = new ProblemGenerator();
    loop = new GameLoop((deltaSeconds) => this.update(deltaSeconds));
    shell = document.createElement("main");
    scene = document.createElement("section");
    battlefield = document.createElement("div");
    castleNode = document.createElement("div");
    defenseTowerNode = document.createElement("div");
    enemyLayer = document.createElement("div");
    activeProblem = document.createElement("div");
    waveBanner = document.createElement("div");
    hud = new Hud();
    answerPanel = new AnswerPanel((answer) => this.handleAnswer(answer));
    startScreen = new StartScreen(() => this.startGame());
    gameOverScreen = new GameOverScreen(() => this.startGame());
    renderedStaticAssetKey = "";
    enemyNodes = new Map();
    constructor(root) {
        this.root = root;
    }
    boot() {
        this.shell.className = "game-shell";
        this.scene.className = "game-scene hidden";
        this.battlefield.className = "battlefield";
        this.enemyLayer.className = "enemy-layer";
        this.activeProblem.className = "global-problem";
        this.waveBanner.className = "wave-banner hidden";
        this.battlefield.innerHTML = `
      <div class="skyline"></div>
      <div class="path"></div>
      <img class="terrain-decor tree tree-left" data-asset-key="tree_1" alt="" />
      <img class="terrain-decor tree tree-right" data-asset-key="tree_2" alt="" />
      <img class="terrain-decor rock rock-left" data-asset-key="rock_1" alt="" />
      <img class="terrain-decor bush bush-right" data-asset-key="bush_1" alt="" />
      <div class="future-upgrades">Upgrades<br><span>shop later</span></div>
    `;
        this.castleNode.className = "castle";
        this.castleNode.setAttribute("aria-label", "Castle");
        this.defenseTowerNode.className = "defense-tower";
        this.defenseTowerNode.setAttribute("aria-label", "Defense tower");
        this.battlefield.append(this.castleNode, this.defenseTowerNode, this.enemyLayer, this.activeProblem, this.waveBanner);
        this.scene.append(this.hud.element, this.battlefield, this.answerPanel.element);
        this.shell.append(this.startScreen.element, this.scene, this.gameOverScreen.element);
        this.root.replaceChildren(this.shell);
        this.render();
    }
    startGame() {
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
    update(deltaSeconds) {
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
    spawnEnemy() {
        const wave = this.levelManager.getWave(this.state.currentWave);
        if (this.state.enemiesSpawnedInWave >= wave.enemyCount) {
            this.advanceWaveIfComplete();
            return;
        }
        const enemyType = this.levelManager.getNextEnemyType(this.state.enemiesSpawnedInWave, this.state.currentWave);
        const config = getEnemyConfig(enemyType);
        const problem = this.createProblem(config);
        const speed = config.isBoss ? Math.max(12, wave.enemySpeed * 0.72) : wave.enemySpeed;
        const enemy = new Enemy(config, problem, ENEMY_START_X, ENEMY_Y, speed);
        this.state.enemies = [enemy];
        this.state.activeProblem = problem;
        this.state.currentDifficulty = wave.difficulty;
        this.state.enemiesSpawnedInWave += 1;
    }
    createProblem(enemyConfig) {
        const difficulty = enemyConfig?.isBoss ? "hard" : this.levelManager.getCurrentDifficulty(this.state.currentWave);
        return this.problemGenerator.generate(difficulty, {
            ...this.levelManager.getMathSettings(this.state.currentWave),
            ...enemyConfig?.problemSettings,
        });
    }
    handleAnswer(answer) {
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
            if (enemy.state !== "defeated") {
                this.refreshEnemyProblem(enemy);
                this.render();
                return;
            }
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
    nudgeEnemyForward() {
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
    handleEnemyReachedCastle(enemy) {
        this.castle.takeDamage(enemy.damageToCastle);
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
    advanceWaveIfComplete() {
        const wave = this.levelManager.getWave(this.state.currentWave);
        const allSpawned = this.state.enemiesSpawnedInWave >= wave.enemyCount;
        const noEnemies = this.state.enemies.length === 0;
        if (!allSpawned || !noEnemies) {
            return;
        }
        this.state.currentWave += 1;
        this.state.enemiesSpawnedInWave = 0;
        this.state.enemiesDefeatedInWave = 0;
        this.state.currentDifficulty = this.levelManager.getCurrentDifficulty(this.state.currentWave);
        this.showWaveBanner(this.levelManager.isBossWave(this.state.currentWave)
            ? `Boss Wave ${this.state.currentWave}!`
            : `Wave ${this.state.currentWave}`);
    }
    refreshEnemyProblem(enemy) {
        const config = getEnemyConfig(enemy.configId);
        const nextProblem = this.createProblem(config);
        enemy.setProblem(nextProblem);
        this.state.activeProblem = nextProblem;
    }
    endGame() {
        this.state.status = "gameOver";
        this.loop.stop();
        this.gameOverScreen.update(this.state.score, this.state.coins);
        this.gameOverScreen.show();
    }
    showWaveBanner(text) {
        this.waveBanner.textContent = text;
        this.waveBanner.classList.remove("hidden");
        window.setTimeout(() => this.waveBanner.classList.add("hidden"), 1200);
    }
    render() {
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
        this.battlefield.style.setProperty("--meadow-tiles", `url("${getAssetPath(level.background) ?? ""}")`);
        this.renderStaticAssets();
        this.renderEnemies();
        this.renderProblemBubble();
        this.answerPanel.update(this.state.activeProblem);
    }
    renderStaticAssets() {
        const level = this.levelManager.getLevel();
        const assetKey = `${level.id}|${level.castleSkin}|${level.background}`;
        if (assetKey === this.renderedStaticAssetKey) {
            return;
        }
        this.renderedStaticAssetKey = assetKey;
        this.castleNode.classList.remove("asset-loaded", "asset-error");
        this.defenseTowerNode.classList.remove("asset-loaded", "asset-error");
        this.castleNode.replaceChildren(this.createAssetImage(level.castleSkin, "castle-sprite", "Blue castle", "🏰", () => this.castleNode.classList.add("asset-loaded"), () => this.castleNode.classList.add("asset-error")), this.createTextNode("div", "castle-flag", "⚑"), this.createTextNode("div", "castle-label", "Castle"));
        this.defenseTowerNode.replaceChildren(this.createAssetImage("tower_blue", "tower-sprite", "Blue defense tower", "🧙‍♂️", () => this.defenseTowerNode.classList.add("asset-loaded"), () => this.defenseTowerNode.classList.add("asset-error")));
        this.battlefield.querySelectorAll("[data-asset-key]").forEach((image) => {
            const assetKey = image.dataset.assetKey;
            if (assetKey) {
                this.loadImageWithFallbacks(image, assetKey);
            }
        });
    }
    createAssetImage(assetKey, className, alt, fallbackText, onLoad, onError) {
        const assetCandidates = getAssetCandidates(assetKey);
        const wrapper = document.createElement("span");
        wrapper.className = `${className}-wrap asset-wrap`;
        const fallback = document.createElement("span");
        fallback.className = "asset-fallback";
        fallback.textContent = fallbackText;
        if (assetCandidates.length === 0) {
            fallback.classList.add("visible");
            wrapper.append(fallback);
            return wrapper;
        }
        const image = document.createElement("img");
        image.className = className;
        image.alt = alt;
        image.draggable = false;
        this.loadImageWithFallbacks(image, assetKey, () => {
            image.classList.add("loaded");
            wrapper.classList.add("asset-loaded");
            onLoad?.();
        }, (attemptedPaths) => {
            image.classList.add("asset-missing");
            wrapper.classList.add("asset-error");
            fallback.classList.add("visible");
            console.warn(`[assets] Could not load ${assetKey}. Tried: ${attemptedPaths.join(", ")}`);
            onError?.();
        }, assetCandidates);
        wrapper.append(image, fallback);
        return wrapper;
    }
    loadImageWithFallbacks(image, assetKey, onLoad, onFinalError, candidates = getAssetCandidates(assetKey)) {
        const attemptedPaths = [];
        let candidateIndex = 0;
        image.onload = () => {
            image.classList.remove("asset-missing");
            image.dataset.assetStatus = "loaded";
            onLoad?.();
        };
        image.onerror = () => {
            candidateIndex += 1;
            if (candidateIndex < candidates.length) {
                image.src = candidates[candidateIndex];
                return;
            }
            image.dataset.assetStatus = "missing";
            image.classList.add("asset-missing");
            onFinalError?.(attemptedPaths);
        };
        if (candidates.length === 0) {
            image.dataset.assetStatus = "missing";
            image.classList.add("asset-missing");
            onFinalError?.(attemptedPaths);
            return;
        }
        attemptedPaths.push(...candidates);
        image.src = candidates[0];
    }
    createTextNode(tagName, className, text) {
        const node = document.createElement(tagName);
        node.className = className;
        node.textContent = text;
        return node;
    }
    renderEnemies() {
        const activeEnemyIds = new Set(this.state.enemies.map((enemy) => enemy.id));
        for (const [enemyId, node] of this.enemyNodes) {
            if (!activeEnemyIds.has(enemyId)) {
                node.remove();
                this.enemyNodes.delete(enemyId);
            }
        }
        for (const enemy of this.state.enemies) {
            let node = this.enemyNodes.get(enemy.id);
            if (!node) {
                node = document.createElement("div");
                node.dataset.spriteKey = enemy.spriteKey;
                node.append(this.createTextNode("span", "enemy-shadow", ""), this.createAssetImage(enemy.spriteKey, "enemy-sprite", enemy.configId, enemy.render()), this.createTextNode("span", "enemy-health", enemy.isBoss ? `${enemy.health}/${enemy.maxHealth}` : ""));
                this.enemyLayer.append(node);
                this.enemyNodes.set(enemy.id, node);
            }
            const enemyHealth = node.querySelector(".enemy-health");
            if (enemyHealth) {
                enemyHealth.textContent = enemy.isBoss ? `${enemy.health}/${enemy.maxHealth}` : "";
            }
            node.className = `enemy ${enemy.isBoss ? "boss" : ""} ${this.state.feedback ?? ""}`;
            node.style.left = `${enemy.x / 10}%`;
            node.style.top = `${enemy.y}px`;
        }
    }
    renderProblemBubble() {
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
//# sourceMappingURL=Game.js.map