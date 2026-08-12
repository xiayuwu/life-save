import { describe, expect, it } from 'vitest'
import { recentIdsForPool, weightedRandom, weightedSample } from './random'

describe('weightedRandom', () => {
  it('avoids all items present in recent history when an unseen item exists', () => {
    const candidates = [
      { id: 'a', baseWeight: 100 },
      { id: 'b', baseWeight: 100 },
      { id: 'c', baseWeight: 1 },
    ]
    expect(weightedRandom(candidates, { recentIds: ['a', 'b'], random: () => 0 })?.id).toBe('c')
    expect(weightedRandom(candidates, { recentIds: ['a', 'b'], random: () => 0.999 })?.id).toBe('c')
  })

  it('returns unique items when sampling without replacement', () => {
    const result = weightedSample(
      Array.from({ length: 8 }, (_, index) => ({ id: String(index), baseWeight: 1 })),
      6,
      { random: () => 0.25 },
    )
    expect(result).toHaveLength(6)
    expect(new Set(result.map((item) => item.id)).size).toBe(6)
  })

  it('disables history exclusion when recent limit is zero', () => {
    const candidates = [
      { id: 'recent', baseWeight: 100 },
      { id: 'unseen', baseWeight: 1 },
    ]

    expect(
      weightedRandom(candidates, {
        recentIds: ['recent'],
        recentLimit: 0,
        random: () => 0,
      })?.id,
    ).toBe('recent')
  })

  it('returns no history when the requested pool limit is zero', () => {
    const history = [
      { pool: 'activities', itemId: 'a', shownAt: '2026-08-10T12:00:00.000Z' },
      { pool: 'activities', itemId: 'b', shownAt: '2026-08-11T12:00:00.000Z' },
    ]

    expect(recentIdsForPool(history, 'activities', 0)).toEqual([])
  })
})
