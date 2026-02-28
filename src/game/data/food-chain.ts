import type { SpeciesId } from './species'
import { SPECIES_BY_ID } from './species'
import { isEffective } from './type-chart'

export function canEat(predator: SpeciesId, prey: SpeciesId): boolean {
  const predatorType = SPECIES_BY_ID[predator].typeId
  const preyType = SPECIES_BY_ID[prey].typeId
  return isEffective(predatorType, preyType)
}
