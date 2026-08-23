import { describe, expect, it } from 'vitest'
import { getFeaturedVisualId, getPanelMotion, wrapProjectIndex } from './featured-projects'

describe('featured project helpers', () => {
  it.each([
    ['/projects/onotoolkit', 'onotoolkit'],
    ['/projects/fe-amazone-monorepo', 'amazone-monorepo'],
    ['/projects/pg-client-mobile', 'pg-client-mobile']
  ] as const)('maps %s to %s', (path, visualId) => {
    expect(getFeaturedVisualId(path)).toBe(visualId)
  })

  it('does not infer a visual from a display title', () => {
    expect(getFeaturedVisualId('/projects/unknown')).toBeNull()
  })

  it.each([
    [-1, 3, 2],
    [0, 3, 0],
    [3, 3, 0],
    [8, 3, 2],
    [1, 0, 0]
  ])('wraps index %i for total %i', (index, total, expected) => {
    expect(wrapProjectIndex(index, total)).toBe(expected)
  })

  it('removes positional movement when reduced motion is active', () => {
    expect(getPanelMotion(true)).toMatchObject({
      initial: { opacity: 0, y: 0 },
      exit: { opacity: 0, y: 0 },
      transition: { duration: 0.01 }
    })
    expect(getPanelMotion(false).initial.y).toBe(8)
  })
})
