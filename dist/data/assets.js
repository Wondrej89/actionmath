export const assetBasePath = "assets";
export const legacyAssetBasePath = "Tiny Swords (Free Pack)";
export const assetMap = {
    castle_blue: `${assetBasePath}/Buildings/Blue Buildings/Castle.png`,
    tower_blue: `${assetBasePath}/Buildings/Blue Buildings/Tower.png`,
    barracks_blue: `${assetBasePath}/Buildings/Blue Buildings/Barracks.png`,
    enemy_red_warrior_run: `${assetBasePath}/Units/Red Units/Warrior/Warrior_Run.png`,
    enemy_purple_pawn_run: `${assetBasePath}/Units/Purple Units/Pawn/Pawn_Run.png`,
    ally_blue_archer_idle: `${assetBasePath}/Units/Blue Units/Archer/Archer_Idle.png`,
    ally_blue_monk_idle: `${assetBasePath}/Units/Blue Units/Monk/Idle.png`,
    terrain_tiles_meadow: `${assetBasePath}/Terrain/Tileset/Tilemap_color1.png`,
    terrain_shadow: `${assetBasePath}/Terrain/Tileset/Shadow.png`,
    tree_1: `${assetBasePath}/Terrain/Resources/Wood/Trees/Tree1.png`,
    tree_2: `${assetBasePath}/Terrain/Resources/Wood/Trees/Tree2.png`,
    rock_1: `${assetBasePath}/Terrain/Decorations/Rocks/Rock1.png`,
    rock_2: `${assetBasePath}/Terrain/Decorations/Rocks/Rock2.png`,
    bush_1: `${assetBasePath}/Terrain/Decorations/Bushes/Bushe1.png`,
    coin_resource: `${assetBasePath}/Terrain/Resources/Gold/Gold Resource/Gold_Resource.png`,
    ui_banner: `${assetBasePath}/UI Elements/UI Elements/Banners/Banner.png`,
    ui_button_blue: `${assetBasePath}/UI Elements/UI Elements/Buttons/BigBlueButton_Regular.png`,
    ui_button_blue_pressed: `${assetBasePath}/UI Elements/UI Elements/Buttons/BigBlueButton_Pressed.png`,
    ui_button_red: `${assetBasePath}/UI Elements/UI Elements/Buttons/BigRedButton_Regular.png`,
    ui_paper: `${assetBasePath}/UI Elements/UI Elements/Papers/RegularPaper.png`,
};
export function getAssetPath(assetKey) {
    return assetMap[assetKey];
}
export function getAssetCandidates(assetKey) {
    const assetPath = getAssetPath(assetKey);
    if (!assetPath) {
        return [];
    }
    const legacyPath = assetPath.replace(assetBasePath, legacyAssetBasePath);
    return uniquePaths([
        assetPath,
        `./${assetPath}`,
        encodeURI(assetPath),
        `./${encodeURI(assetPath)}`,
        `/${assetPath}`,
        `/${encodeURI(assetPath)}`,
        legacyPath,
        `./${legacyPath}`,
        encodeURI(legacyPath),
        `./${encodeURI(legacyPath)}`,
    ]);
}
function uniquePaths(paths) {
    return [...new Set(paths)];
}
//# sourceMappingURL=assets.js.map