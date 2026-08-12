import type { LifeEvent, LifeSave, Person, Place, Quest, Decision } from '../types'
import { clamp } from './id'

export interface ExperienceInput {
  saves?: number
  completedQuests?: number
  questXp?: number
  people?: number
  events?: number
  travelEvents?: number
  places?: number
  streakDays?: number
  decisions?: number
  photos?: number
  capsules?: number
}

export interface ExperienceSummary {
  totalXp: number
  level: number
  currentLevelXp: number
  nextLevelXp: number
  progress: number
  breakdown: Record<keyof ExperienceInput, number>
}

const XP_WEIGHTS: Record<keyof ExperienceInput, number> = {
  saves: 12,
  completedQuests: 35,
  questXp: 1,
  people: 20,
  events: 25,
  travelEvents: 40,
  places: 20,
  streakDays: 8,
  decisions: 15,
  photos: 5,
  capsules: 10,
}

function safeCount(value: number | undefined): number {
  return Math.max(0, Number.isFinite(value) ? Math.floor(value ?? 0) : 0)
}

export function experienceForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level))
  return Math.floor(100 * (safeLevel - 1) ** 1.65)
}

export function levelFromExperience(totalXp: number): number {
  const xp = Math.max(0, Math.floor(totalXp))
  let low = 1
  let high = Math.max(2, Math.ceil((xp / 100) ** (1 / 1.65)) + 2)

  while (low < high) {
    const middle = Math.ceil((low + high) / 2)
    if (experienceForLevel(middle) <= xp) low = middle
    else high = middle - 1
  }
  return low
}

export function calculateExperience(input: ExperienceInput): ExperienceSummary {
  const keys = Object.keys(XP_WEIGHTS) as (keyof ExperienceInput)[]
  const breakdown = keys.reduce<Record<keyof ExperienceInput, number>>(
    (result, key) => {
      result[key] = safeCount(input[key]) * XP_WEIGHTS[key]
      return result
    },
    {
      saves: 0,
      completedQuests: 0,
      questXp: 0,
      people: 0,
      events: 0,
      travelEvents: 0,
      places: 0,
      streakDays: 0,
      decisions: 0,
      photos: 0,
      capsules: 0,
    },
  )
  const totalXp = Object.values(breakdown).reduce((sum, value) => sum + value, 0)
  const level = levelFromExperience(totalXp)
  const levelStart = experienceForLevel(level)
  const nextLevelXp = experienceForLevel(level + 1)

  return {
    totalXp,
    level,
    currentLevelXp: totalXp - levelStart,
    nextLevelXp: nextLevelXp - levelStart,
    progress: clamp((totalXp - levelStart) / Math.max(1, nextLevelXp - levelStart), 0, 1),
    breakdown,
  }
}

export function calculateStreak(dates: readonly string[], reference = new Date()): number {
  const uniqueDays = new Set(
    dates
      .map((date) => date.slice(0, 10))
      .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)),
  )
  const cursor = new Date(reference)
  cursor.setUTCHours(0, 0, 0, 0)

  const today = cursor.toISOString().slice(0, 10)
  if (!uniqueDays.has(today)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  let streak = 0
  while (uniqueDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}

export function calculateLifeExperience(data: {
  saves: readonly LifeSave[]
  people: readonly Person[]
  events: readonly LifeEvent[]
  quests: readonly Quest[]
  places: readonly Place[]
  decisions: readonly Decision[]
  capsules?: number
  referenceDate?: Date
}): ExperienceSummary {
  const completed = data.quests.filter((quest) => quest.status === 'completed')
  return calculateExperience({
    saves: data.saves.length,
    completedQuests: completed.length,
    questXp: completed.reduce((sum, quest) => sum + Math.max(0, quest.xp), 0),
    people: data.people.length,
    events: data.events.length,
    travelEvents: data.events.filter((event) => event.type === '旅行').length,
    places: data.places.length,
    streakDays: calculateStreak(
      data.saves.map((save) => save.date),
      data.referenceDate,
    ),
    decisions: data.decisions.filter((decision) => decision.suggestionId).length,
    photos: data.saves.reduce((sum, save) => sum + save.photos.length, 0),
    capsules: data.capsules ?? 0,
  })
}
