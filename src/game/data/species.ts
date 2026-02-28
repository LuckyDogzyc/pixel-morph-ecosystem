export type SpeciesId =
  | 'sprout'
  | 'beetle'
  | 'lizard'
  | 'wolf'
  | 'hawk'
  | 'shark'

export type Species = {
  id: SpeciesId
  name: string
  color: number
  size: number
  speed: number
  dashMultiplier: number
}

export const SPECIES: Species[] = [
  { id: 'sprout', name: '芽灵', color: 0x5ccf6a, size: 18, speed: 140, dashMultiplier: 2.1 },
  { id: 'beetle', name: '甲虫', color: 0xc29b4c, size: 20, speed: 150, dashMultiplier: 2.1 },
  { id: 'lizard', name: '蜥蜴', color: 0x3bb2a4, size: 22, speed: 160, dashMultiplier: 2.0 },
  { id: 'wolf', name: '夜狼', color: 0x7d7f9a, size: 24, speed: 170, dashMultiplier: 1.9 },
  { id: 'hawk', name: '影鹰', color: 0xe0c35a, size: 22, speed: 180, dashMultiplier: 1.8 },
  { id: 'shark', name: '深海', color: 0x4b6bd1, size: 26, speed: 165, dashMultiplier: 1.9 },
]

export const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((s) => [s.id, s])) as Record<SpeciesId, Species>
