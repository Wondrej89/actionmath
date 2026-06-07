export const assetMap: Record<string, string> = {
  castle_default: "/assets/castle.png",
  enemy_slime: "/assets/enemy_slime.png",
  enemy_goblin: "/assets/enemy_goblin.png",
  meadow_placeholder: "/assets/meadow.png",
};

export function getAssetPath(spriteKey: string): string | undefined {
  return assetMap[spriteKey];
}
