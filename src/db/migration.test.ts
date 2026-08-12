import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import { LifeSaveDatabase } from './database'

const names: string[] = []

afterEach(async () => {
  await Promise.all(names.splice(0).map((name) => Dexie.delete(name)))
})

describe('Dexie migrations', () => {
  it('upgrades a v1 database and fills timestamps and arrays', async () => {
    const name = `migration-${crypto.randomUUID()}`
    names.push(name)
    const legacy = new Dexie(name)
    legacy.version(1).stores({
      profile: 'id', saves: 'id,date,createdAt', people: 'id,name,createdAt', events: 'id', chapters: 'id', decisions: 'id', quests: 'id', places: 'id', achievements: 'id', capsules: 'id', settings: 'id', recentPicks: '++id,pool,itemId,shownAt',
    })
    await legacy.open()
    await legacy.table('saves').put({ id: 'old', date: '2025-01-01', createdAt: '2025-01-01T00:00:00.000Z' })
    legacy.close()

    const current = new LifeSaveDatabase(name)
    await current.open()
    const upgraded = await current.saves.get('old')
    expect(upgraded?.updatedAt).toBe('2025-01-01T00:00:00.000Z')
    expect(upgraded?.photos).toEqual([])
    expect(await current.settings.get('data-schema-version')).toEqual({ id: 'data-schema-version', value: 3 })
    current.close()
  })
})
