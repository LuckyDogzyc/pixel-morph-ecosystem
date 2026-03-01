import type { SpeciesId } from './species'
import { SPECIES } from './species'
import type { TypeId } from './types'
import { TILE } from './tiles'

export type BiomeId = 'grass' | 'water' | 'mountain' | 'town' | 'forest' | 'desert' | 'cave'

export type Biome = {
  id: BiomeId
  name: string
  groundTile: number
  spawnTypes: TypeId[]
}

export const BIOMES: Record<BiomeId, Biome> = {
  grass: { id: 'grass', name: '草地', groundTile: TILE.GRASS, spawnTypes: ['grass'] },
  water: { id: 'water', name: '水域', groundTile: TILE.WATER, spawnTypes: ['water'] },
  mountain: { id: 'mountain', name: '山地', groundTile: TILE.MOUNTAIN, spawnTypes: ['fire'] },
  town: { id: 'town', name: '城镇', groundTile: TILE.TOWN, spawnTypes: ['grass', 'fire', 'water'] },
  forest: { id: 'forest', name: '森林', groundTile: TILE.FOREST, spawnTypes: ['grass'] },
  desert: { id: 'desert', name: '沙漠', groundTile: TILE.DESERT, spawnTypes: ['fire'] },
  cave: { id: 'cave', name: '山洞', groundTile: TILE.CAVE, spawnTypes: ['fire', 'water'] },
}

export const BIOME_IDS: BiomeId[] = Object.keys(BIOMES) as BiomeId[]

export function pickSpeciesForBiome(biomeId: BiomeId): SpeciesId | null {
  const biome = BIOMES[biomeId]
  const available = SPECIES.filter((species) => biome.spawnTypes.includes(species.typeId))
  if (available.length === 0) return null
  const index = Math.floor(Math.random() * available.length)
  return available[index]?.id ?? null
}
