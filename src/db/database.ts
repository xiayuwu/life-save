import Dexie, { type EntityTable, type Table } from 'dexie'
import type {
  Achievement,
  Chapter,
  Decision,
  LifeEvent,
  LifeSave,
  MemoryCapsule,
  Person,
  Place,
  Profile,
  Quest,
  RecentPick,
  SettingRecord,
} from '../types'

export const DATABASE_NAME = 'life-save-database'
export const DATABASE_VERSION = 3

export interface BackupRecord {
  id: string
  createdAt: string
  reason: 'automatic' | 'manual'
  schemaVersion: number
  byteLength: number
  payload: string
}

export class LifeSaveDatabase extends Dexie {
  profile!: EntityTable<Profile, 'id'>
  saves!: EntityTable<LifeSave, 'id'>
  people!: EntityTable<Person, 'id'>
  events!: EntityTable<LifeEvent, 'id'>
  chapters!: EntityTable<Chapter, 'id'>
  decisions!: EntityTable<Decision, 'id'>
  quests!: EntityTable<Quest, 'id'>
  places!: EntityTable<Place, 'id'>
  achievements!: EntityTable<Achievement, 'id'>
  capsules!: EntityTable<MemoryCapsule, 'id'>
  settings!: EntityTable<SettingRecord, 'id'>
  recentPicks!: Table<RecentPick, number>
  backups!: EntityTable<BackupRecord, 'id'>

  constructor(name = DATABASE_NAME) {
    super(name)

    this.version(1).stores({
      profile: 'id',
      saves: 'id,date,createdAt,mood,chapterId,quick,*keywords,*peopleIds,*placeIds',
      people: 'id,name,metAt,relationType,relationLevel,importance,createdAt',
      events: 'id,date,type,importance,chapterId,*tags,*peopleIds,*placeIds',
      chapters: 'id,number,startDate,endDate',
      decisions: 'id,createdAt,mode,category,suggestionId,actualChoiceId',
      quests: 'id,type,status,rarity,createdAt,completedAt,*tags',
      places: 'id,name,category,city,lastVisit,visitCount',
      achievements: 'id,rarity,secret,unlockedAt',
      capsules: 'id,openAt,opened,createdAt',
      settings: 'id',
      recentPicks: '++id,pool,itemId,shownAt,[pool+shownAt]',
    })

    this.version(2)
      .stores({
        profile: 'id',
        saves: 'id,date,createdAt,updatedAt,mood,chapterId,quick,*keywords,*peopleIds,*placeIds',
        people: 'id,name,metAt,relationType,relationLevel,importance,createdAt,updatedAt',
        events: 'id,date,type,importance,chapterId,*tags,*peopleIds,*placeIds',
        chapters: 'id,number,startDate,endDate',
        decisions: 'id,createdAt,resolvedAt,mode,category,suggestionId,actualChoiceId',
        quests: 'id,type,status,rarity,createdAt,completedAt,*tags',
        places: 'id,name,category,city,lastVisit,visitCount',
        achievements: 'id,rarity,secret,unlockedAt',
        capsules: 'id,openAt,opened,createdAt',
        settings: 'id',
        recentPicks: '++id,pool,itemId,shownAt,[pool+shownAt]',
      })
      .upgrade(async (transaction) => {
        const migratedAt = new Date().toISOString()
        await transaction
          .table<LifeSave, string>('saves')
          .toCollection()
          .modify((save) => {
            if (!save.updatedAt) save.updatedAt = save.createdAt || migratedAt
            if (!Array.isArray(save.photos)) save.photos = []
            if (!Array.isArray(save.keywords)) save.keywords = []
          })
        await transaction
          .table<Person, string>('people')
          .toCollection()
          .modify((person) => {
            if (!person.updatedAt) person.updatedAt = person.createdAt || migratedAt
            if (!Array.isArray(person.anniversaries)) person.anniversaries = []
          })
      })

    this.version(3)
      .stores({
        profile: 'id',
        saves: 'id,date,createdAt,updatedAt,mood,chapterId,quick,*keywords,*peopleIds,*placeIds',
        people: 'id,name,metAt,relationType,relationLevel,importance,createdAt,updatedAt',
        events: 'id,date,type,importance,chapterId,*tags,*peopleIds,*placeIds',
        chapters: 'id,number,startDate,endDate',
        decisions: 'id,createdAt,resolvedAt,mode,category,suggestionId,actualChoiceId',
        quests: 'id,type,status,rarity,createdAt,completedAt,*tags',
        places: 'id,name,category,city,lastVisit,visitCount',
        achievements: 'id,rarity,secret,unlockedAt',
        capsules: 'id,openAt,opened,createdAt',
        settings: 'id',
        recentPicks: '++id,pool,itemId,shownAt,[pool+shownAt]',
        backups: 'id,createdAt,reason,schemaVersion',
      })
      .upgrade(async (transaction) => {
        const settings = transaction.table<SettingRecord, string>('settings')
        const existing = await settings.get('data-schema-version')
        if (!existing) await settings.put({ id: 'data-schema-version', value: DATABASE_VERSION })
      })
  }
}

export const db = new LifeSaveDatabase()

export const DATA_TABLES = [
  'profile',
  'saves',
  'people',
  'events',
  'chapters',
  'decisions',
  'quests',
  'places',
  'achievements',
  'capsules',
  'settings',
  'recentPicks',
] as const

export type DataTableName = (typeof DATA_TABLES)[number]

export async function initializeDatabase(database: LifeSaveDatabase = db): Promise<void> {
  if (!database.isOpen()) await database.open()
  await database.settings.put({ id: 'data-schema-version', value: DATABASE_VERSION })
}

export async function clearAllData(database: LifeSaveDatabase = db): Promise<void> {
  await database.transaction('rw', database.tables, async () => {
    await Promise.all(database.tables.map((table) => table.clear()))
  })
}

export async function clearUserData(database: LifeSaveDatabase = db): Promise<void> {
  const tables = DATA_TABLES.map((name) => database.table(name))
  await database.transaction('rw', tables, async () => {
    await Promise.all(tables.map((table) => table.clear()))
  })
}
