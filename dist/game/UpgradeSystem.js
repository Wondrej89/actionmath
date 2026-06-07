import { upgrades as upgradeData } from "../data/upgrades.js";
export class UpgradeSystem {
    upgrades = structuredClone(upgradeData);
    list() {
        return this.upgrades;
    }
    getCoinBonus() {
        return this.upgrades
            .filter((upgrade) => upgrade.effect.type === "coinBonus")
            .reduce((total, upgrade) => total + upgrade.level * upgrade.effect.value, 0);
    }
    // Future shop hook: validate cost, spend coins through Economy, then apply effects.
    purchase(upgradeId) {
        const upgrade = this.upgrades.find((item) => item.id === upgradeId);
        if (!upgrade || upgrade.level >= upgrade.maxLevel) {
            return false;
        }
        upgrade.level += 1;
        return true;
    }
}
//# sourceMappingURL=UpgradeSystem.js.map