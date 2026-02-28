export type TypeId = 'fire' | 'grass' | 'water'

export const TYPES: Record<TypeId, { name: string; color: number }> = {
  fire: { name: '火', color: 0xf57a4b },
  grass: { name: '草', color: 0x61c96f },
  water: { name: '水', color: 0x5aa2e0 },
}
