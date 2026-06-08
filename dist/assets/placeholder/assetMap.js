const assetUrl = (relativePath) => new URL(`../../../assets/${relativePath}`, import.meta.url).href;
export const assetMap = {
    castle_default: assetUrl("Buildings/Blue Buildings/Castle.png"),
    enemy_slime: assetUrl("Units/Red Units/Pawn/Pawn_Run.png"),
    enemy_goblin: assetUrl("Units/Red Units/Warrior/Warrior_Run.png"),
    meadow_placeholder: assetUrl("Terrain/Tileset/Tilemap_color1.png"),
};
export function getAssetPath(spriteKey) {
    return assetMap[spriteKey];
}
//# sourceMappingURL=assetMap.js.map