import type { TypeId } from './types'

const EFFECTIVE_AGAINST: Record<TypeId, TypeId[]> = {
  fire: ['grass'],
  grass: ['water'],
  water: ['fire'],
}

export function isEffective(attacker: TypeId, defender: TypeId): boolean {
  return EFFECTIVE_AGAINST[attacker]?.includes(defender) ?? false
}
