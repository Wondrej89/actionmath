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
- Enemy reaching the castle removes one heart; bosses can remove two hearts.
- Boss waves appear every third wave, bosses require multiple correct answers, and boss problems use three-number expressions such as `2 + 3 - 1 = ?`.
- Waves now scale endlessly instead of looping back to the first few waves.
- Game Over screen with score, coins, and Play Again.

## Architecture overview

- `src/game/Game.ts` wires the game state, loop, DOM scene, enemy spawning, scoring, wave progression, and game-over flow.
- `src/game/GameLoop.ts` provides a small `requestAnimationFrame` loop for future animation expansion.
- `src/game/Enemy.ts` and `src/game/Castle.ts` model game actors with update/render-oriented methods.
- `src/game/ProblemGenerator.ts` owns age-appropriate math problem generation and answer option validation.
- `src/game/LevelManager.ts` reads level and wave configuration from data files.
- `src/game/Economy.ts` and `src/game/UpgradeSystem.ts` are ready for a future shop and upgrade effects.
- `src/ui/*` contains HUD, answer panel, start screen, and game-over screen components.
- `src/data/*` contains configurable levels, enemies, bosses, waves, and upgrades.
- `src/data/assets.ts` maps game-facing asset keys to the future root `/assets/...` Tiny Swords folder, while DOM rendering keeps emoji/CSS fallbacks if a file is not present yet.

## Tiny Swords asset folder

When the free Tiny Swords pack is added, rename `Tiny Swords (Free Pack)` to `assets` and place it at the repository root. The current MVP already references the provided structure through `src/data/assets.ts` and falls back to emoji/CSS placeholders whenever a PNG has not been copied in yet. Paths are relative (`assets/...`) so the game works when served from the repository root or a static subpath.

### Assets currently wired into the MVP

The game currently attempts to load these Tiny Swords files:

- `assets/Buildings/Blue Buildings/Castle.png` for the castle.
- `assets/Buildings/Blue Buildings/Tower.png` for the defense tower.
- `assets/Terrain/Tileset/Tilemap_color1.png` as a subtle grass/tile overlay.
- `assets/Terrain/Resources/Wood/Trees/Tree1.png` and `assets/Terrain/Resources/Wood/Trees/Tree2.png` as map decorations.
- `assets/Terrain/Decorations/Rocks/Rock1.png` and `assets/Terrain/Decorations/Bushes/Bushe1.png` as map decorations.
- `assets/Units/Purple Units/Pawn/Pawn_Run.png` for the first enemy type.
- `assets/Units/Red Units/Warrior/Warrior_Run.png` for the second enemy type.

If any of those files are missing or the app is opened from the wrong directory, the game intentionally shows fallback emoji/CSS graphics instead of a broken image icon.

### GitHub Pages asset troubleshooting

If GitHub Pages still shows fallback art, open browser DevTools and check the console/network panel. The game logs every path it tried for each missing asset. Most issues are caused by the `assets/` folder not being published on the same branch as `index.html`, a different folder name such as `Tiny Swords (Free Pack)`, case-sensitive path mismatches on GitHub Pages, or a cached older `dist/game/Game.js` module. `index.html` and `src/main.ts` include a build-id query string to force GitHub Pages to fetch the latest game module and stylesheet after asset-loader changes.

## Future extension points

- **Animations:** extend `Enemy.update`, `Enemy.render`, and the feedback hooks in `Game.handleAnswer` / `Game.handleEnemyReachedCastle`.
- **Asset pack:** copy the renamed Tiny Swords folder to root `assets/`; existing keys already point to paths such as `assets/Buildings/Blue Buildings/Castle.png`, `assets/Units/Red Units/Warrior/Warrior_Run.png`, terrain decorations, and UI elements. Add more entries in `src/data/assets.ts` as new sprites are needed.
- **New problem types:** add generators for `chooseOperator`, `missingNumber`, and `buildExpression` while preserving the `MathProblem` interface.
- **New maps:** add `LevelConfig` entries in `src/data/levels.ts` with backgrounds, castle skins, enemy pools, boss cadence, scaling waves, and math settings.
- **Upgrade shop:** connect `UpgradeSystem.purchase` to a future shop UI and spend coins through `Economy`.
