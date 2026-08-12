import { describe, expect, it } from 'vitest'
import {
  achievements,
  activities,
  annualSummaryLines,
  assertContentMinimums,
  contentCounts,
  contentMinimums,
  decisionCopy,
  decisionFactors,
  decisionModes,
  lifeQuestions,
  moods,
  quickSaveTags,
  randomTasks,
  relationshipTips,
  systemLines,
  titleRules,
} from './index'

interface TestableItem {
  id: string
  text: readonly string[]
}

function expectValidPool(name: string, items: readonly TestableItem[]) {
  const ids = items.map((item) => item.id)

  expect(ids, `${name} contains a blank id`).not.toContain('')
  expect(new Set(ids).size, `${name} contains duplicate ids`).toBe(ids.length)
  for (const item of items) {
    expect(item.id.trim(), `${name} contains a whitespace-only id`).not.toBe('')
    for (const text of item.text) {
      expect(text.trim(), `${name}/${item.id} contains blank text`).not.toBe('')
    }
  }
}

describe('content contract', () => {
  it('meets every declared content minimum', () => {
    expect(assertContentMinimums()).toBe(true)

    for (const key of Object.keys(contentMinimums) as Array<keyof typeof contentMinimums>) {
      expect(contentCounts[key], key).toBeGreaterThanOrEqual(contentMinimums[key])
    }
  })

  it('keeps every identified pool unique and all user-facing text non-empty', () => {
    const pools: Record<string, readonly TestableItem[]> = {
      systemLines: systemLines.map((item) => ({ id: item.id, text: [item.text] })),
      activities: activities.map((item) => ({ id: item.id, text: [item.title, item.description] })),
      randomTasks: randomTasks.map((item) => ({ id: item.id, text: [item.title, item.description, item.category] })),
      achievements: achievements.map((item) => ({ id: item.id, text: [item.title, item.description] })),
      titleRules: titleRules.map((item) => ({ id: item.id, text: [item.title, item.description] })),
      lifeQuestions: lifeQuestions.map((item) => ({ id: item.id, text: [item.text] })),
      decisionCopy: decisionCopy.map((item) => ({ id: item.id, text: [item.text] })),
      relationshipTips: relationshipTips.map((item) => ({ id: item.id, text: [item.text] })),
      annualSummaryLines: annualSummaryLines.map((item) => ({ id: item.id, text: [item.text] })),
      moods: moods.map((item) => ({ id: item.id, text: [item.label, item.emoji] })),
      decisionFactors: decisionFactors.map((item) => ({
        id: item.id,
        text: [item.label, item.description, item.question],
      })),
    }

    for (const [name, items] of Object.entries(pools)) expectValidPool(name, items)

    expect(new Set(quickSaveTags).size, 'quickSaveTags contains duplicates').toBe(quickSaveTags.length)
    for (const tag of quickSaveTags) expect(tag.trim()).not.toBe('')
  })

  it('provides every decision mode and enough moods', () => {
    const modeIds = decisionModes.map((item) => item.mode)

    expect(modeIds).toHaveLength(6)
    expect(new Set(modeIds)).toEqual(new Set(['fate', 'rational', 'feeling', 'longterm', 'yolo', 'easy']))
    for (const mode of decisionModes) {
      expect(mode.label.trim()).not.toBe('')
      expect(mode.summary.trim()).not.toBe('')
      expect(mode.prompt.trim()).not.toBe('')
    }

    expect(moods.length).toBeGreaterThanOrEqual(20)
  })
})

