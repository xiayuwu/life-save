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
  SaveFile,
  SettingRecord,
} from '../types'
import { createId, nowIso } from '../utils/id'
import {
  DATA_TABLES,
  DATABASE_VERSION,
  db,
  type DataTableName,
  type LifeSaveDatabase,
} from './database'

export type ImportMode = 'merge' | 'replace'

export interface ImportSummary {
  mode: ImportMode
  sourceVersion: number
  targetVersion: number
  counts: Record<DataTableName, number>
  importedAt: string
}

export interface SaveFileInspection {
  valid: true
  schemaVersion: number
  exportedAt: string
  counts: Record<DataTableName, number>
}

interface SerializedBlob {
  __lifeSaveType: 'Blob'
  mime: string
  base64: string
}

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requireArray(record: Record<string, unknown>, key: string): unknown[] {
  const value = record[key]
  if (!Array.isArray(value)) throw new Error(`存档字段 data.${key} 必须是数组`)
  return value
}

function requireString(record: Record<string, unknown>, key: string, path: string): string {
  const value = record[key]
  if (typeof value !== 'string') throw new Error(`${path}.${key} 必须是字符串`)
  return value
}

function validateEntityArray(items: unknown[], path: string): void {
  const ids = new Set<string>()
  items.forEach((item, index) => {
    if (!isRecord(item)) throw new Error(`${path}[${index}] 必须是对象`)
    const id = item.id
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new Error(`${path}[${index}].id 无效`)
    }
    if (ids.has(id)) throw new Error(`${path} 中存在重复 id：${id}`)
    ids.add(id)
  })
}

function normalizeInput(input: string | unknown): unknown {
  if (typeof input !== 'string') return input
  try {
    return JSON.parse(input) as unknown
  } catch {
    throw new Error('文件不是有效的 JSON')
  }
}

export function validateSaveFile(input: string | unknown): asserts input is SaveFile {
  const parsed = normalizeInput(input)
  if (!isRecord(parsed)) throw new Error('存档根节点必须是对象')
  if (parsed.app !== 'LIFE//SAVE') throw new Error('这不是 LIFE//SAVE 存档')
  if (!Number.isInteger(parsed.schemaVersion) || Number(parsed.schemaVersion) < 1) {
    throw new Error('存档版本无效')
  }
  if (Number(parsed.schemaVersion) > DATABASE_VERSION) {
    throw new Error(`存档版本 ${String(parsed.schemaVersion)} 高于当前支持版本 ${DATABASE_VERSION}`)
  }
  requireString(parsed, 'exportedAt', 'save')
  if (!isRecord(parsed.data)) throw new Error('存档缺少 data 对象')

  for (const table of DATA_TABLES) {
    const items = requireArray(parsed.data, table)
    validateEntityArray(items, `data.${table}`)
  }
  if ((parsed.data.profile as unknown[]).length > 1) throw new Error('存档只能包含一个玩家档案')
}

function parsedSaveFile(input: string | unknown): Record<string, unknown> {
  const parsed = normalizeInput(input)
  if (!isRecord(parsed)) throw new Error('存档根节点必须是对象')
  return parsed
}

function fillSaveDefaults(save: Record<string, unknown>, migratedAt: string): Record<string, unknown> {
  return {
    weather: '',
    mood: '',
    status: '',
    keywords: [],
    story: '',
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
    ...save,
    createdAt: typeof save.createdAt === 'string' ? save.createdAt : migratedAt,
    updatedAt:
      typeof save.updatedAt === 'string'
        ? save.updatedAt
        : typeof save.createdAt === 'string'
          ? save.createdAt
          : migratedAt,
  }
}

function fillPersonDefaults(person: Record<string, unknown>, migratedAt: string): Record<string, unknown> {
  return {
    nickname: '',
    metPlace: '',
    metHow: '',
    relationType: '认识的人',
    relationLevel: '认识的人',
    status: '',
    intimacy: 0,
    contactFrequency: '',
    interests: [],
    games: [],
    placeIds: [],
    eventIds: [],
    quotes: [],
    notes: '',
    anniversaries: [],
    contactCount: 0,
    importance: 50,
    color: '#8294ff',
    ...person,
    createdAt: typeof person.createdAt === 'string' ? person.createdAt : migratedAt,
    updatedAt:
      typeof person.updatedAt === 'string'
        ? person.updatedAt
        : typeof person.createdAt === 'string'
          ? person.createdAt
          : migratedAt,
  }
}

/** Migrates JSON-compatible save structures before strict validation. */
export function migrateSaveFile(input: string | unknown): unknown {
  const root = parsedSaveFile(input)
  const sourceVersion = Number(root.schemaVersion)
  if (!Number.isInteger(sourceVersion) || sourceVersion < 1 || sourceVersion > DATABASE_VERSION) {
    return root
  }
  const data = isRecord(root.data) ? root.data : {}
  const migratedAt = typeof root.exportedAt === 'string' ? root.exportedAt : nowIso()

  if (sourceVersion < 2) {
    data.saves = Array.isArray(data.saves)
      ? data.saves.map((item) => (isRecord(item) ? fillSaveDefaults(item, migratedAt) : item))
      : []
    data.people = Array.isArray(data.people)
      ? data.people.map((item) => (isRecord(item) ? fillPersonDefaults(item, migratedAt) : item))
      : []
  }
  if (sourceVersion < 3 && !Array.isArray(data.recentPicks)) data.recentPicks = []

  for (const table of DATA_TABLES) {
    if (!Array.isArray(data[table])) data[table] = []
  }
  data.settings = (data.settings as unknown[]).filter(
    (setting) => !(isRecord(setting) && setting.id === 'data-schema-version'),
  )
  ;(data.settings as unknown[]).push({ id: 'data-schema-version', value: DATABASE_VERSION })

  return {
    ...root,
    app: 'LIFE//SAVE',
    schemaVersion: DATABASE_VERSION,
    exportedAt: migratedAt,
    data,
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

function bytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

async function encodeJsonValue(value: unknown): Promise<JsonValue> {
  if (value instanceof Blob) {
    const encoded: SerializedBlob = {
      __lifeSaveType: 'Blob',
      mime: value.type,
      base64: bytesToBase64(new Uint8Array(await value.arrayBuffer())),
    }
    return encoded as unknown as JsonValue
  }
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (Array.isArray(value)) return Promise.all(value.map(encodeJsonValue))
  if (isRecord(value)) {
    const encoded: Record<string, JsonValue> = {}
    for (const [key, child] of Object.entries(value)) encoded[key] = await encodeJsonValue(child)
    return encoded
  }
  return null
}

function isSerializedBlob(value: Record<string, unknown>): value is Record<string, unknown> & SerializedBlob {
  return (
    value.__lifeSaveType === 'Blob' &&
    typeof value.mime === 'string' &&
    typeof value.base64 === 'string'
  )
}

function decodeJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(decodeJsonValue)
  if (isRecord(value)) {
    if (isSerializedBlob(value)) {
      return new Blob([bytesToArrayBuffer(base64ToBytes(value.base64))], { type: value.mime })
    }
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, decodeJsonValue(child)]))
  }
  return value
}

async function snapshotDatabase(database: LifeSaveDatabase): Promise<SaveFile> {
  const [profile, saves, people, events, chapters, decisions, quests, places, achievements, capsules, settings, recentPicks] =
    await Promise.all([
      database.profile.toArray(),
      database.saves.toArray(),
      database.people.toArray(),
      database.events.toArray(),
      database.chapters.toArray(),
      database.decisions.toArray(),
      database.quests.toArray(),
      database.places.toArray(),
      database.achievements.toArray(),
      database.capsules.toArray(),
      database.settings.toArray(),
      database.recentPicks.toArray(),
    ])
  return {
    app: 'LIFE//SAVE',
    schemaVersion: DATABASE_VERSION,
    exportedAt: nowIso(),
    data: { profile, saves, people, events, chapters, decisions, quests, places, achievements, capsules, settings, recentPicks },
  }
}

/** Returns a portable JSON string, including images encoded as tagged base64 blobs. */
export async function exportSaveFile(database: LifeSaveDatabase = db): Promise<string> {
  const snapshot = await snapshotDatabase(database)
  return JSON.stringify(await encodeJsonValue(snapshot), null, 2)
}

function countsFor(save: SaveFile): Record<DataTableName, number> {
  return Object.fromEntries(DATA_TABLES.map((table) => [table, save.data[table].length])) as Record<
    DataTableName,
    number
  >
}

export function inspectSaveFile(input: string | unknown): SaveFileInspection {
  const migrated = migrateSaveFile(input)
  validateSaveFile(migrated)
  const save = migrated as SaveFile
  return { valid: true, schemaVersion: save.schemaVersion, exportedAt: save.exportedAt, counts: countsFor(save) }
}

function asSaveFile(input: string | unknown): SaveFile {
  const migrated = migrateSaveFile(input)
  validateSaveFile(migrated)
  return decodeJsonValue(migrated) as SaveFile
}

async function writeSaveFile(save: SaveFile, mode: ImportMode, database: LifeSaveDatabase): Promise<void> {
  const tables = DATA_TABLES.map((name) => database.table(name))
  await database.transaction('rw', tables, async () => {
    if (mode === 'replace') await Promise.all(tables.map((table) => table.clear()))
    await Promise.all([
      database.profile.bulkPut(save.data.profile),
      database.saves.bulkPut(save.data.saves),
      database.people.bulkPut(save.data.people),
      database.events.bulkPut(save.data.events),
      database.chapters.bulkPut(save.data.chapters),
      database.decisions.bulkPut(save.data.decisions),
      database.quests.bulkPut(save.data.quests),
      database.places.bulkPut(save.data.places),
      database.achievements.bulkPut(save.data.achievements),
      database.capsules.bulkPut(save.data.capsules),
      database.settings.bulkPut(save.data.settings),
      database.recentPicks.bulkPut(save.data.recentPicks),
    ])
    await database.settings.put({ id: 'data-schema-version', value: DATABASE_VERSION })
  })
}

export async function importSaveFile(
  input: string | unknown,
  mode: ImportMode,
  database: LifeSaveDatabase = db,
): Promise<ImportSummary> {
  const original = parsedSaveFile(input)
  const sourceVersion = Number(original.schemaVersion)
  const save = asSaveFile(input)
  await writeSaveFile(save, mode, database)
  return {
    mode,
    sourceVersion,
    targetVersion: DATABASE_VERSION,
    counts: countsFor(save),
    importedAt: nowIso(),
  }
}

export async function createEmptySaveFile(): Promise<SaveFile> {
  return {
    app: 'LIFE//SAVE',
    schemaVersion: DATABASE_VERSION,
    exportedAt: nowIso(),
    data: {
      profile: [] as Profile[],
      saves: [] as LifeSave[],
      people: [] as Person[],
      events: [] as LifeEvent[],
      chapters: [] as Chapter[],
      decisions: [] as Decision[],
      quests: [] as Quest[],
      places: [] as Place[],
      achievements: [] as Achievement[],
      capsules: [] as MemoryCapsule[],
      settings: [] as SettingRecord[],
      recentPicks: [] as RecentPick[],
    },
  }
}

export function backupFileName(date = new Date()): string {
  return `life-save-${date.toISOString().slice(0, 10)}.json`
}

export function newBackupId(): string {
  return createId('backup')
}
