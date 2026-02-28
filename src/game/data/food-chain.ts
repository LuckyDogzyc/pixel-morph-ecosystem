import type { SpeciesId } from './species'

export const FOOD_CHAIN: SpeciesId[] = ['sprout', 'beetle', 'lizard', 'wolf', 'hawk', 'shark']

export function getPrey(id: SpeciesId): SpeciesId {
  const idx = FOOD_CHAIN.indexOf(id)
  const preyIdx = (idx - 1 + FOOD_CHAIN.length) % FOOD_CHAIN.length
  return FOOD_CHAIN[preyIdx]
}

export function getPredator(id: SpeciesId): SpeciesId {
  const idx = FOOD_CHAIN.indexOf(id)
  const predIdx = (idx + 1) % FOOD_CHAIN.length
  return FOOD_CHAIN[predIdx]
}

export function canEat(predator: SpeciesId, prey: SpeciesId): boolean {
  return getPrey(predator) === prey
}
