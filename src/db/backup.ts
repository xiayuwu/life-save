import { nowIso } from '../utils/id'
import { db, DATABASE_VERSION, type BackupRecord, type LifeSaveDatabase } from './database'
import { exportSaveFile, newBackupId } from './importExport'

export interface AutoBackupOptions {
  enabled: boolean
  intervalHours?: number
  keep?: number
}

export async function createBackup(
  reason: BackupRecord['reason'] = 'manual',
  database: LifeSaveDatabase = db,
): Promise<BackupRecord> {
  const payload = await exportSaveFile(database)
  const record: BackupRecord = {
    id: newBackupId(),
    createdAt: nowIso(),
    reason,
    schemaVersion: DATABASE_VERSION,
    byteLength: new Blob([payload]).size,
    payload,
  }
  await database.backups.put(record)
  return record
}

export async function pruneBackups(keep = 5, database: LifeSaveDatabase = db): Promise<number> {
  const backups = await database.backups.orderBy('createdAt').reverse().toArray()
  const expired = backups.slice(Math.max(0, Math.floor(keep)))
  await database.backups.bulkDelete(expired.map((backup) => backup.id))
  return expired.length
}

export async function runAutomaticBackup(
  options: AutoBackupOptions,
  database: LifeSaveDatabase = db,
): Promise<BackupRecord | undefined> {
  if (!options.enabled) return undefined
  const interval = Math.max(1, options.intervalHours ?? 24) * 3_600_000
  const latest = await database.backups.orderBy('createdAt').last()
  if (latest && Date.now() - Date.parse(latest.createdAt) < interval) return undefined
  const backup = await createBackup('automatic', database)
  await pruneBackups(options.keep ?? 5, database)
  await database.settings.put({ id: 'last-auto-backup-at', value: backup.createdAt })
  return backup
}

export async function listBackups(database: LifeSaveDatabase = db): Promise<BackupRecord[]> {
  return database.backups.orderBy('createdAt').reverse().toArray()
}

export async function deleteBackup(id: string, database: LifeSaveDatabase = db): Promise<void> {
  await database.backups.delete(id)
}
