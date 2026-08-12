import type { RecentPick } from '../types'

export interface WeightedCandidate {
  id: string
  baseWeight?: number
  tags?: readonly string[]
  shownCount?: number
  lastShown?: string
}

export interface WeightedRandomOptions<T extends WeightedCandidate> {
  recentIds?: readonly string[]
  recentLimit?: number
  preferredTags?: readonly string[]
  excludedTags?: readonly string[]
  now?: Date
  random?: () => number
  weight?: (candidate: T) => number
}

function tagMultiplier(
  candidateTags: readonly string[],
  preferredTags: readonly string[],
  excludedTags: readonly string[],
): number {
  if (excludedTags.some((tag) => candidateTags.includes(tag))) return 0
  const matches = preferredTags.filter((tag) => candidateTags.includes(tag)).length
  return 1 + Math.min(matches, 3) * 0.35
}

function historyMultiplier(
  id: string,
  recentIds: readonly string[],
  canAvoidRecent: boolean,
): number {
  const latestIndex = recentIds.lastIndexOf(id)
  if (latestIndex < 0) return 1
  if (canAvoidRecent) return 0

  const distanceFromLatest = recentIds.length - 1 - latestIndex
  return Math.min(0.65, 0.04 + distanceFromLatest * 0.04)
}

function recencyRecovery(lastShown: string | undefined, now: Date): number {
  if (!lastShown) return 1
  const timestamp = Date.parse(lastShown)
  if (!Number.isFinite(timestamp)) return 1
  const elapsedDays = Math.max(0, now.getTime() - timestamp) / 86_400_000
  return 0.25 + Math.min(0.75, elapsedDays / 14)
}

/**
 * Selects an item while excluding anything seen in the latest history whenever
 * the pool has an unseen alternative. If the pool is exhausted, recent items
 * remain possible but are strongly discounted by recency.
 */
export function weightedRandom<T extends WeightedCandidate>(
  candidates: readonly T[],
  options: WeightedRandomOptions<T> = {},
): T | undefined {
  if (candidates.length === 0) return undefined

  const recentLimit = Math.max(0, Math.floor(options.recentLimit ?? 20))
  const recentIds = recentLimit === 0 ? [] : (options.recentIds ?? []).slice(-recentLimit)
  const recentSet = new Set(recentIds)
  const canAvoidRecent = candidates.some((candidate) => !recentSet.has(candidate.id))
  const preferredTags = options.preferredTags ?? []
  const excludedTags = options.excludedTags ?? []
  const now = options.now ?? new Date()

  const weighted = candidates.map((candidate) => {
    const base = Math.max(0, options.weight?.(candidate) ?? candidate.baseWeight ?? 1)
    const tags = tagMultiplier(candidate.tags ?? [], preferredTags, excludedTags)
    const history = historyMultiplier(candidate.id, recentIds, canAvoidRecent)
    const usage = 1 / Math.sqrt(1 + Math.max(0, candidate.shownCount ?? 0) * 0.12)
    const recovery = recencyRecovery(candidate.lastShown, now)
    return { candidate, weight: base * tags * history * usage * recovery }
  })

  const positive = weighted.filter((entry) => entry.weight > 0)
  if (positive.length === 0) return candidates[0]
  const total = positive.reduce((sum, entry) => sum + entry.weight, 0)
  const randomValue = Math.min(0.999999999999, Math.max(0, options.random?.() ?? Math.random()))
  let cursor = randomValue * total

  for (const entry of positive) {
    cursor -= entry.weight
    if (cursor < 0) return entry.candidate
  }
  return positive[positive.length - 1]?.candidate
}

export function recentIdsForPool(
  history: readonly RecentPick[],
  pool: string,
  limit = 20,
): string[] {
  const safeLimit = Math.max(0, Math.floor(limit))
  if (safeLimit === 0) return []

  return history
    .filter((pick) => pick.pool === pool)
    .sort((left, right) => Date.parse(left.shownAt) - Date.parse(right.shownAt))
    .slice(-safeLimit)
    .map((pick) => pick.itemId)
}

export function weightedSample<T extends WeightedCandidate>(
  candidates: readonly T[],
  count: number,
  options: WeightedRandomOptions<T> = {},
): T[] {
  const result: T[] = []
  const available = [...candidates]
  const recent = [...(options.recentIds ?? [])]

  while (available.length > 0 && result.length < Math.max(0, Math.floor(count))) {
    const picked = weightedRandom(available, { ...options, recentIds: recent })
    if (!picked) break
    result.push(picked)
    recent.push(picked.id)
    available.splice(
      available.findIndex((candidate) => candidate.id === picked.id),
      1,
    )
  }

  return result
}
