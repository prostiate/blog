import type { FeaturedVisualId } from '../types/project'

const VISUAL_BY_PATH: Readonly<Record<string, FeaturedVisualId>> = {
  '/projects/onotoolkit': 'onotoolkit',
  '/projects/fe-amazone-monorepo': 'amazone-monorepo',
  '/projects/pg-client-mobile': 'pg-client-mobile'
}

export function getFeaturedVisualId(path?: string): FeaturedVisualId | null {
  return path ? (VISUAL_BY_PATH[path] ?? null) : null
}

export function wrapProjectIndex(index: number, total: number): number {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

export function getPanelMotion(reducedMotion: boolean) {
  return {
    initial: { opacity: 0, y: reducedMotion ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reducedMotion ? 0 : -8 },
    transition: { duration: reducedMotion ? 0.01 : 0.22 }
  }
}
