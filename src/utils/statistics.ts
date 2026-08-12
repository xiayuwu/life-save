import type { Decision, LifeEvent, LifeSave, Person, Place, Quest } from '../types'
import { calculateStreak } from './experience'

export interface LifeStatistics {
  saves: number
  saveDays: number
  people: number
  places: number
  events: number
  decisions: number
  completedQuests: number
  photos: number
  currentStreak: number
  topMood?: string
  topTag?: string
  topPerson?: Person
  topPlace?: Place
}

function mostFrequent(values: readonly string[]): string | undefined {
  const counts = new Map<string, number>()
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) ?? 0) + 1)
  return [...counts.entries()].sort(
    (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
  )[0]?.[0]
}

export function calculateStatistics(data: {
  saves: readonly LifeSave[]
  people: readonly Person[]
  places: readonly Place[]
  events: readonly LifeEvent[]
  decisions: readonly Decision[]
  quests: readonly Quest[]
  referenceDate?: Date
}): LifeStatistics {
  const personFrequency = new Map<string, number>()
  const placeFrequency = new Map<string, number>()
  for (const save of data.saves) {
    for (const id of save.peopleIds) personFrequency.set(id, (personFrequency.get(id) ?? 0) + 1)
    for (const id of save.placeIds) placeFrequency.set(id, (placeFrequency.get(id) ?? 0) + 1)
  }
  for (const event of data.events) {
    for (const id of event.peopleIds) personFrequency.set(id, (personFrequency.get(id) ?? 0) + 1)
    for (const id of event.placeIds) placeFrequency.set(id, (placeFrequency.get(id) ?? 0) + 1)
  }
  const topPersonId = [...personFrequency].sort((left, right) => right[1] - left[1])[0]?.[0]
  const topPlaceId = [...placeFrequency].sort((left, right) => right[1] - left[1])[0]?.[0]

  return {
    saves: data.saves.length,
    saveDays: new Set(data.saves.map((save) => save.date.slice(0, 10))).size,
    people: data.people.length,
    places: data.places.length,
    events: data.events.length,
    decisions: data.decisions.length,
    completedQuests: data.quests.filter((quest) => quest.status === 'completed').length,
    photos: data.saves.reduce((sum, save) => sum + save.photos.length, 0),
    currentStreak: calculateStreak(
      data.saves.map((save) => save.date),
      data.referenceDate,
    ),
    topMood: mostFrequent(data.saves.map((save) => save.mood)),
    topTag: mostFrequent(data.saves.flatMap((save) => save.keywords)),
    topPerson: data.people.find((person) => person.id === topPersonId),
    topPlace: data.places.find((place) => place.id === topPlaceId),
  }
}

export interface HeatmapDay {
  date: string
  count: number
  intensity: 0 | 1 | 2 | 3 | 4
}

export function buildHeatmap(saves: readonly LifeSave[], year: number): HeatmapDay[] {
  const counts = new Map<string, number>()
  for (const save of saves) {
    const day = save.date.slice(0, 10)
    if (day.startsWith(`${year}-`)) counts.set(day, (counts.get(day) ?? 0) + 1)
  }
  const cursor = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year + 1, 0, 1))
  const days: HeatmapDay[] = []
  while (cursor < end) {
    const date = cursor.toISOString().slice(0, 10)
    const count = counts.get(date) ?? 0
    const intensity = (count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4) as HeatmapDay['intensity']
    days.push({ date, count, intensity })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return days
}
