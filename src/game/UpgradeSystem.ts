import { upgrades as upgradeData } from "../data/upgrades.js";
import type { Upgrade } from "./types.js";

export class UpgradeSystem {
  private upgrades: Upgrade[] = structuredClone(upgradeData);

  list(): Upgrade[] {
    return this.upgrades;
  }

  getCoinBonus(): number {
    return this.upgrades
      .filter((upgrade) => upgrade.effect.type === "coinBonus")
      .reduce((total, upgrade) => total + upgrade.level * upgrade.effect.value, 0);
  }

  // Future shop hook: validate cost, spend coins through Economy, then apply effects.
  purchase(upgradeId: string): boolean {
    const upgrade = this.upgrades.find((item) => item.id === upgradeId);
    if (!upgrade || upgrade.level >= upgrade.maxLevel) {
      return false;
    }

    upgrade.level += 1;
    return true;
  }
}
