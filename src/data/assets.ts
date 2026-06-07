export const assetBasePath = "/assets";

export const assetMap = {
  castle_blue: `${assetBasePath}/Buildings/Blue%20Buildings/Castle.png`,
  tower_blue: `${assetBasePath}/Buildings/Blue%20Buildings/Tower.png`,
  barracks_blue: `${assetBasePath}/Buildings/Blue%20Buildings/Barracks.png`,
  enemy_red_warrior_run: `${assetBasePath}/Units/Red%20Units/Warrior/Warrior_Run.png`,
  enemy_purple_pawn_run: `${assetBasePath}/Units/Purple%20Units/Pawn/Pawn_Run.png`,
  ally_blue_archer_idle: `${assetBasePath}/Units/Blue%20Units/Archer/Archer_Idle.png`,
  ally_blue_monk_idle: `${assetBasePath}/Units/Blue%20Units/Monk/Idle.png`,
  terrain_tiles_meadow: `${assetBasePath}/Terrain/Tileset/Tilemap_color1.png`,
  terrain_shadow: `${assetBasePath}/Terrain/Tileset/Shadow.png`,
  tree_1: `${assetBasePath}/Terrain/Resources/Wood/Trees/Tree1.png`,
  tree_2: `${assetBasePath}/Terrain/Resources/Wood/Trees/Tree2.png`,
  rock_1: `${assetBasePath}/Terrain/Decorations/Rocks/Rock1.png`,
  rock_2: `${assetBasePath}/Terrain/Decorations/Rocks/Rock2.png`,
  bush_1: `${assetBasePath}/Terrain/Decorations/Bushes/Bushe1.png`,
  coin_resource: `${assetBasePath}/Terrain/Resources/Gold/Gold%20Resource/Gold_Resource.png`,
  ui_banner: `${assetBasePath}/UI%20Elements/UI%20Elements/Banners/Banner.png`,
  ui_button_blue: `${assetBasePath}/UI%20Elements/UI%20Elements/Buttons/BigBlueButton_Regular.png`,
  ui_button_blue_pressed: `${assetBasePath}/UI%20Elements/UI%20Elements/Buttons/BigBlueButton_Pressed.png`,
  ui_button_red: `${assetBasePath}/UI%20Elements/UI%20Elements/Buttons/BigRedButton_Regular.png`,
  ui_paper: `${assetBasePath}/UI%20Elements/UI%20Elements/Papers/RegularPaper.png`,
} as const;

export type AssetKey = keyof typeof assetMap;

export function getAssetPath(assetKey: string): string | undefined {
  return assetMap[assetKey as AssetKey];
}
