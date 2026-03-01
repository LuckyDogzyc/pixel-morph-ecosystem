export const TILE = {
  GRASS: 1,
  WATER: 2,
  ROAD: 3,
  WALL: 4,
  BRIDGE: 5,
  TREE: 6,
  FLOWER: 7,
  ROCK: 8,
  FENCE: 9,
  ROOF: 10,
  HOUSE_WALL: 11,
  MOUNTAIN: 12,
  DESERT: 13,
  CAVE: 14,
  TOWN: 15,
  FOREST: 16,
} as const

export type TileIndex = (typeof TILE)[keyof typeof TILE]

export const WATER_TILE = TILE.WATER

export const BLOCKING_TILES = new Set<number>([
  TILE.WATER,
  TILE.WALL,
  TILE.TREE,
  TILE.ROCK,
  TILE.FENCE,
  TILE.ROOF,
  TILE.HOUSE_WALL,
  TILE.MOUNTAIN,
])
