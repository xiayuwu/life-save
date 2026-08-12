import type { LifeEvent, LifeSave, Person, Place } from '../types'
import { clamp } from './id'

export interface BondDetails {
  score: number
  knownDays: number
  sharedRecords: number
  sharedEvents: number
  sharedPlaces: number
  contacts: number
}

function daysBetween(start: string, end: Date): number {
  const timestamp = Date.parse(start)
  if (!Number.isFinite(timestamp)) return 0
  return Math.max(0, Math.floor((end.getTime() - timestamp) / 86_400_000))
}

export function calculateBond(
  person: Person,
  data: {
    saves?: readonly LifeSave[]
    events?: readonly LifeEvent[]
    places?: readonly Place[]
    now?: Date
  } = {},
): BondDetails {
  const saves = data.saves ?? []
  const events = data.events ?? []
  const places = data.places ?? []
  const now = data.now ?? new Date()
  const sharedRecords = saves.filter((save) => save.peopleIds.includes(person.id)).length
  const sharedEvents = new Set([
    ...person.eventIds,
    ...events.filter((event) => event.peopleIds.includes(person.id)).map((event) => event.id),
  ]).size
  const sharedPlaces = new Set([
    ...person.placeIds,
    ...places.filter((place) => place.peopleIds.includes(person.id)).map((place) => place.id),
    ...saves
      .filter((save) => save.peopleIds.includes(person.id))
      .flatMap((save) => save.placeIds),
  ]).size
  const knownDays = daysBetween(person.metAt, now)
  const contacts = Math.max(person.contactCount, sharedRecords)
  const score = clamp(
    Math.round(
      Math.min(18, Math.log2(knownDays + 1) * 2.1) +
        Math.min(24, sharedRecords * 2.4) +
        Math.min(20, sharedEvents * 3) +
        Math.min(10, sharedPlaces * 1.7) +
        Math.min(15, contacts * 0.8) +
        clamp(person.intimacy, 0, 100) * 0.08 +
        clamp(person.importance, 0, 100) * 0.05,
    ),
    0,
    100,
  )

  return { score, knownDays, sharedRecords, sharedEvents, sharedPlaces, contacts }
}
