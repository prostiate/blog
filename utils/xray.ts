export function percentageFromPointer(clientX: number, left: number, width: number): number {
  if (width <= 0) return 0
  return Math.round(Math.min(1, Math.max(0, (clientX - left) / width)) * 100)
}
