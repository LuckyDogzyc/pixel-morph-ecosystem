export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1)
}

export function normalize(x: number, y: number): { x: number; y: number } {
  const len = Math.hypot(x, y) || 1
  return { x: x / len, y: y / len }
}
