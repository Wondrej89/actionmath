# Math Castle Defense

A browser MVP of a kid-friendly castle defense math game for grades 1–3. The player protects a castle by choosing the correct answer to addition and subtraction problems while enemies walk from the right side of the battlefield toward the castle.

## Run locally

```bash
npm run dev
```

Then open http://127.0.0.1:5173 in the browser. The repository includes compiled `dist/` files so the MVP can run as a static app.

After changing TypeScript, rebuild with:

```bash
npm run build
```

## Current MVP

- Menu with **Start Game**.
- Castle health, coins, score, wave, and difficulty HUD.
- One active enemy moving from right to left toward the castle.
- Choose-result math problems with three touch-friendly answer buttons.
- Easy and medium addition/subtraction up to 20.
- Correct answer defeats the enemy and awards coins/score.
- Wrong answer flashes red and nudges the enemy closer.
- Enemy reaching the castle removes one heart.
- Game Over screen with score, coins, and Play Again.

## Architecture overview

- `src/game/Game.ts` wires the game state, loop, DOM scene, enemy spawning, scoring, wave progression, and game-over flow.
- `src/game/GameLoop.ts` provides a small `requestAnimationFrame` loop for future animation expansion.
- `src/game/Enemy.ts` and `src/game/Castle.ts` model game actors with update/render-oriented methods.
- `src/game/ProblemGenerator.ts` owns age-appropriate math problem generation and answer option validation.
- `src/game/LevelManager.ts` reads level and wave configuration from data files.
- `src/game/Economy.ts` and `src/game/UpgradeSystem.ts` are ready for a future shop and upgrade effects.
- `src/ui/*` contains HUD, answer panel, start screen, and game-over screen components.
- `src/data/*` contains configurable levels, enemies, and upgrades.
- `src/assets/placeholder/assetMap.ts` is the swap point for replacing emoji/CSS placeholders with a real asset pack such as Tiny Swords.

## Future extension points

- **Animations:** extend `Enemy.update`, `Enemy.render`, and the feedback hooks in `Game.handleAnswer` / `Game.handleEnemyReachedCastle`.
- **Asset pack:** replace placeholder CSS/emoji with sprite lookups through `assetMap` and enemy/castle `spriteKey` values.
- **New problem types:** add generators for `chooseOperator`, `missingNumber`, and `buildExpression` while preserving the `MathProblem` interface.
- **New maps:** add `LevelConfig` entries in `src/data/levels.ts` with backgrounds, castle skins, enemy pools, waves, and math settings.
- **Upgrade shop:** connect `UpgradeSystem.purchase` to a future shop UI and spend coins through `Economy`.
