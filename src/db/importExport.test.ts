import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import type { LifeSave } from '../types'
import { LifeSaveDatabase } from './database'
import { exportSaveFile, importSaveFile, inspectSaveFile, migrateSaveFile } from './importExport'

const databases: LifeSaveDatabase[] = []

function testDatabase(): LifeSaveDatabase {
  const database = new LifeSaveDatabase(`test-${crypto.randomUUID()}`)
  databases.push(database)
  return database
}

function save(id: string, story: string): LifeSave {
  return {
    id,
    date: '2026-08-12',
    createdAt: '2026-08-12T12:00:00.000Z',
    updatedAt: '2026-08-12T12:00:00.000Z',
    weather: '晴',
    mood: '平静',
    status: '',
    keywords: ['测试'],
    story,
    peopleIds: [],
    placeIds: [],
    decisionIds: [],
    questIds: [],
    timeSink: '',
    photos: [],
    bgm: '',
    quote: '',
    satisfaction: 50,
    fatigue: 50,
    socialEnergy: 50,
    luck: 50,
    saveWorth: 50,
    quick: false,
  }
}

afterEach(async () => {
  await Promise.all(databases.splice(0).map((database) => database.delete()))
})

describe('save import and export', () => {
  it('round-trips records and blobs', async () => {
    const source = testDatabase()
    const record = save('one', '原始内容')
    record.photos = [{ id: 'image', name: 'x.webp', type: 'image/webp', data: new Blob(['pixel'], { type: 'image/webp' }), createdAt: record.createdAt }]
    await source.saves.put(record)
    const json = await exportSaveFile(source)
    expect(inspectSaveFile(json).counts.saves).toBe(1)

    const target = testDatabase()
    await importSaveFile(json, 'replace', target)
    const restored = await target.saves.get('one')
    expect(restored?.story).toBe('原始内容')
    expect(await restored?.photos[0]?.data.text()).toBe('pixel')
  })

  it('supports merge and replace semantics', async () => {
    const source = testDatabase()
    await source.saves.put(save('incoming', '新数据'))
    const json = await exportSaveFile(source)
    const target = testDatabase()
    await target.saves.put(save('existing', '旧数据'))
    await importSaveFile(json, 'merge', target)
    expect(await target.saves.count()).toBe(2)
    await importSaveFile(json, 'replace', target)
    expect(await target.saves.count()).toBe(1)
    expect(await target.saves.get('existing')).toBeUndefined()
  })

  it('migrates version one save defaults', () => {
    const old = {
      app: 'LIFE//SAVE',
      schemaVersion: 1,
      exportedAt: '2026-01-01T00:00:00.000Z',
      data: { profile: [], saves: [{ id: 'legacy', date: '2026-01-01', createdAt: '2026-01-01T00:00:00.000Z' }], people: [], events: [], chapters: [], decisions: [], quests: [], places: [], achievements: [], capsules: [], settings: [], recentPicks: [] },
    }
    const migrated = migrateSaveFile(old)
    const text = JSON.stringify(migrated)
    expect(inspectSaveFile(text).schemaVersion).toBe(3)
    expect(text).toContain('updatedAt')
  })

  it('rejects malformed and future saves', () => {
    expect(() => inspectSaveFile('{bad')).toThrow('有效的 JSON')
    expect(() => inspectSaveFile({ app: 'LIFE//SAVE', schemaVersion: 99, exportedAt: '', data: {} })).toThrow('高于当前支持版本')
  })
})
