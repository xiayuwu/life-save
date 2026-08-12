import { achievements } from './achievements'
import { activities } from './activities'
import { annualSummaryLines } from './annualSummary'
import { decisionCopy, decisionFactors, decisionModes } from './decisionMessages'
import { lifeQuestions } from './lifeQuestions'
import { moods } from './moods'
import { randomTasks } from './quests'
import { quickSaveTags } from './quickSave'
import { relationshipTips } from './relationshipMessages'
import { systemLines } from './systemMessages'
import { titleRules } from './titles'

export * from './achievements'
export * from './activities'
export * from './annualSummary'
export * from './decisionMessages'
export * from './lifeQuestions'
export * from './models'
export * from './moods'
export * from './quests'
export * from './quickSave'
export * from './relationshipMessages'
export * from './systemMessages'
export * from './titles'

export const contentCounts = {
  systemMessages: systemLines.length,
  activities: activities.length,
  quests: randomTasks.length,
  achievements: achievements.length,
  titles: titleRules.length,
  lifeQuestions: lifeQuestions.length,
  decisionCopy: decisionCopy.length,
  relationshipTips: relationshipTips.length,
  annualSummaryLines: annualSummaryLines.length,
  quickSaveTags: quickSaveTags.length,
  moods: moods.length,
  decisionFactors: decisionFactors.length,
  decisionModes: decisionModes.length,
} as const

export type ContentCountKey = keyof typeof contentCounts

export const contentMinimums: Readonly<Record<ContentCountKey, number>> = {
  systemMessages: 100,
  activities: 300,
  quests: 150,
  achievements: 100,
  titles: 100,
  lifeQuestions: 110,
  decisionCopy: 110,
  relationshipTips: 90,
  annualSummaryLines: 110,
  quickSaveTags: 100,
  moods: 20,
  decisionFactors: 13,
  decisionModes: 6,
}

/**
 * Fails fast when a content pool is accidentally shortened below the product
 * contract. Tests and development bootstraps may call this without arguments.
 */
export function assertContentMinimums(
  counts: Readonly<Record<ContentCountKey, number>> = contentCounts,
): true {
  const failures = (Object.keys(contentMinimums) as ContentCountKey[])
    .filter((key) => counts[key] < contentMinimums[key])
    .map((key) => `${key}: ${counts[key]} < ${contentMinimums[key]}`)

  if (failures.length > 0) {
    throw new Error(`Content minimums not met:\n${failures.join('\n')}`)
  }

  return true
}

