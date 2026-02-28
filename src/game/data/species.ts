import type { TypeId } from './types'

export type SpeciesId = 'charmander' | 'bulbasaur' | 'squirtle'

export type Species = {
  id: SpeciesId
  name: string
  typeId: TypeId
  color: number
  size: number
  speed: number
  dashMultiplier: number
  evolvesTo?: SpeciesId[]
  skills?: string[]
}

export const SPECIES: Species[] = [
  {
    id: 'charmander',
    name: '小火龙',
    typeId: 'fire',
    color: 0xf57a4b,
    size: 22,
    speed: 175,
    dashMultiplier: 2.0,
    evolvesTo: [],
    skills: [],
  },
  {
    id: 'bulbasaur',
    name: '妙蛙种子',
    typeId: 'grass',
    color: 0x61c96f,
    size: 22,
    speed: 165,
    dashMultiplier: 2.05,
    evolvesTo: [],
    skills: [],
  },
  {
    id: 'squirtle',
    name: '杰尼龟',
    typeId: 'water',
    color: 0x5aa2e0,
    size: 22,
    speed: 170,
    dashMultiplier: 2.0,
    evolvesTo: [],
    skills: [],
  },
]

export const SPECIES_BY_ID = Object.fromEntries(SPECIES.map((s) => [s.id, s])) as Record<SpeciesId, Species>
