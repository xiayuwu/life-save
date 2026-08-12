import { describe, expect, it } from 'vitest'
import {
  calculateExperience,
  calculateStreak,
  experienceForLevel,
  levelFromExperience,
} from './experience'

describe('experience system', () => {
  it('keeps level thresholds monotonic and reversible', () => {
    for (let level = 1; level < 30; level += 1) {
      expect(experienceForLevel(level + 1)).toBeGreaterThan(experienceForLevel(level))
      expect(levelFromExperience(experienceForLevel(level))).toBe(level)
    }
  })

  it('calculates a deterministic breakdown and progress', () => {
    const result = calculateExperience({ saves: 10, people: 2, completedQuests: 3, questXp: 90 })
    expect(result.totalXp).toBe(355)
    expect(result.level).toBeGreaterThan(1)
    expect(result.progress).toBeGreaterThanOrEqual(0)
    expect(result.progress).toBeLessThan(1)
  })

  it('recognizes a streak ending today or yesterday', () => {
    const reference = new Date('2026-08-12T12:00:00Z')
    expect(calculateStreak(['2026-08-12', '2026-08-11', '2026-08-10'], reference)).toBe(3)
    expect(calculateStreak(['2026-08-11', '2026-08-10'], reference)).toBe(2)
  })
})
