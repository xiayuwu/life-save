import type { IndexableType } from 'dexie'
import type { LifeSaveDatabase } from './database'
import { db } from './database'

export interface EntityWithId {
  id: IndexableType
}

export async function listRecords<T>(
  tableName: string,
  database: LifeSaveDatabase = db,
): Promise<T[]> {
  return database.table<T>(tableName).toArray()
}

export async function getRecord<T>(
  tableName: string,
  id: IndexableType,
  database: LifeSaveDatabase = db,
): Promise<T | undefined> {
  return database.table<T>(tableName).get(id)
}

export async function putRecord<T extends EntityWithId>(
  tableName: string,
  value: T,
  database: LifeSaveDatabase = db,
): Promise<IndexableType> {
  return database.table<T, IndexableType>(tableName).put(value)
}

export async function putRecords<T extends EntityWithId>(
  tableName: string,
  values: readonly T[],
  database: LifeSaveDatabase = db,
): Promise<void> {
  await database.table<T, IndexableType>(tableName).bulkPut([...values])
}

export async function deleteRecord(
  tableName: string,
  id: IndexableType,
  database: LifeSaveDatabase = db,
): Promise<void> {
  await database.table(tableName).delete(id)
}

export async function countRecords(
  tableName: string,
  database: LifeSaveDatabase = db,
): Promise<number> {
  return database.table(tableName).count()
}
