export const upgrades = [
    {
        id: "stronger_castle",
        name: "Stronger Castle",
        description: "Adds one extra heart to the castle.",
        cost: 50,
        level: 0,
        maxLevel: 3,
        effect: { type: "castleHealth", value: 1 },
    },
    {
        id: "better_catapult",
        name: "Better Catapult",
        description: "Earn more coins for correct answers.",
        cost: 60,
        level: 0,
        maxLevel: 3,
        effect: { type: "coinBonus", value: 5 },
    },
    {
        id: "magic_shield",
        name: "Magic Shield",
        description: "Future shop item: block one mistake before losing a heart.",
        cost: 80,
        level: 0,
        maxLevel: 1,
        effect: { type: "shield", value: 1 },
    },
];
//# sourceMappingURL=upgrades.js.map