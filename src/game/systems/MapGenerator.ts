import { BIOMES, type BiomeId } from '../data/biomes'
import { BLOCKING_TILES, TILE, WATER_TILE } from '../data/tiles'

export type MapData = {
  width: number
  height: number
  tileSize: number
  ground: number[][]
  decor: number[][]
  collision: number[][]
  biomes: BiomeId[][]
  getBiomeAtWorld: (x: number, y: number) => BiomeId
  isBlockedAtWorld: (x: number, y: number, canSwim?: boolean) => boolean
}

type MapOptions = {
  viewWidth: number
  viewHeight: number
  tileSize: number
  scaleMultiplier: number
  seed?: number
}

const BLOCKING_DECOR = new Set<number>([
  TILE.TREE,
  TILE.ROCK,
  TILE.FENCE,
  TILE.ROOF,
  TILE.HOUSE_WALL,
  TILE.MOUNTAIN,
])

const ROAD_WIDTH = 4

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const noise2d = (x: number, y: number, seed: number, scale: number) => {
  const nx = x / scale
  const ny = y / scale
  const s = Math.sin(nx * 127.1 + ny * 311.7 + seed * 0.123) * 43758.5453
  return s - Math.floor(s)
}

const majorityBiome = (neighbors: BiomeId[]) => {
  const counts = new Map<BiomeId, number>()
  neighbors.forEach((b) => counts.set(b, (counts.get(b) ?? 0) + 1))
  let best: BiomeId = neighbors[0]
  let bestCount = 0
  counts.forEach((count, biome) => {
    if (count > bestCount) {
      bestCount = count
      best = biome
    }
  })
  return { biome: best, count: bestCount }
}

export const generateMap = (options: MapOptions): MapData => {
  const tileSize = options.tileSize
  const viewTilesX = Math.ceil(options.viewWidth / tileSize)
  const viewTilesY = Math.ceil(options.viewHeight / tileSize)
  const width = viewTilesX * options.scaleMultiplier
  const height = viewTilesY * options.scaleMultiplier
  const seed = options.seed ?? 1337

  const biomes: BiomeId[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => 'grass'))

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const v = noise2d(x, y, seed, 14)
      let biome: BiomeId = 'grass'
      if (v < 0.08) biome = 'water'
      else if (v < 0.14) biome = 'mountain'
      else if (v < 0.2) biome = 'desert'
      else if (v < 0.28) biome = 'forest'
      biomes[y][x] = biome
    }
  }

  // Town clusters.
  const townCenters = [
    { x: Math.floor(width * 0.62), y: Math.floor(height * 0.3), r: 10 },
    { x: Math.floor(width * 0.68), y: Math.floor(height * 0.65), r: 12 },
  ]
  townCenters.forEach((center) => {
    for (let y = center.y - center.r; y <= center.y + center.r; y += 1) {
      for (let x = center.x - center.r; x <= center.x + center.r; x += 1) {
        if (x < 0 || y < 0 || x >= width || y >= height) continue
        const dist = Math.hypot(x - center.x, y - center.y)
        if (dist <= center.r) biomes[y][x] = 'town'
      }
    }
  })

  // Cave pockets inside mountains.
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (biomes[y][x] !== 'mountain') continue
      const v = noise2d(x, y, seed + 11, 6)
      if (v > 0.78) biomes[y][x] = 'cave'
    }
  }

  // Smooth transitions.
  for (let pass = 0; pass < 2; pass += 1) {
    const next = biomes.map((row) => row.slice())
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const neighbors: BiomeId[] = []
        for (let dy = -1; dy <= 1; dy += 1) {
          for (let dx = -1; dx <= 1; dx += 1) {
            if (dx === 0 && dy === 0) continue
            neighbors.push(biomes[y + dy][x + dx])
          }
        }
        const { biome, count } = majorityBiome(neighbors)
        if (count >= 5) next[y][x] = biome
      }
    }
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        biomes[y][x] = next[y][x]
      }
    }
  }

  const ground: number[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => TILE.GRASS))
  const decor: number[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => 0))
  const collision: number[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => 0))

  const roadX = Math.floor(width * 0.55)
  const roadY = Math.floor(height * 0.52)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const biome = biomes[y][x]
      ground[y][x] = BIOMES[biome].groundTile

      const roadVertical = x >= roadX && x < roadX + ROAD_WIDTH
      const roadHorizontal = y >= roadY && y < roadY + ROAD_WIDTH
      if (roadVertical || roadHorizontal) {
        ground[y][x] = ground[y][x] === TILE.WATER ? TILE.BRIDGE : TILE.ROAD
      }

      if (ground[y][x] === TILE.ROAD || ground[y][x] === TILE.BRIDGE) {
        continue
      }

      const v = noise2d(x, y, seed + 23, 9)
      if (biome === 'forest' && v > 0.65) decor[y][x] = TILE.TREE
      if (biome === 'grass' && v > 0.86) decor[y][x] = TILE.FLOWER
      if (biome === 'grass' && v > 0.78 && v <= 0.82) decor[y][x] = TILE.ROCK
      if (biome === 'mountain' && v > 0.6) decor[y][x] = TILE.ROCK
      if (biome === 'desert' && v > 0.72) decor[y][x] = TILE.ROCK

      if (biome === 'town') {
        const houseChance = noise2d(x, y, seed + 77, 5)
        if (houseChance > 0.78 && y + 1 < height) {
          if (biomes[y + 1][x] === 'town') {
            decor[y][x] = TILE.ROOF
            decor[y + 1][x] = TILE.HOUSE_WALL
          }
        }
      }

      if (biome === 'mountain' && v > 0.8) {
        decor[y][x] = TILE.MOUNTAIN
      }
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const tile = ground[y][x]
      const deco = decor[y][x]
      let block = 0
      if (BLOCKING_TILES.has(tile)) block = tile
      if (BLOCKING_DECOR.has(deco)) block = deco
      collision[y][x] = block
    }
  }

  const getTile = (x: number, y: number) => {
    const tx = clamp(Math.floor(x / tileSize), 0, width - 1)
    const ty = clamp(Math.floor(y / tileSize), 0, height - 1)
    return { tx, ty }
  }

  return {
    width,
    height,
    tileSize,
    ground,
    decor,
    collision,
    biomes,
    getBiomeAtWorld: (x: number, y: number) => {
      const { tx, ty } = getTile(x, y)
      return biomes[ty][tx]
    },
    isBlockedAtWorld: (x: number, y: number, canSwim = false) => {
      const { tx, ty } = getTile(x, y)
      const tile = collision[ty][tx]
      if (tile === 0) return false
      if (tile === WATER_TILE) return !canSwim
      return true
    },
  }
}
