let sequence = 0

export function createId(prefix = 'item'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  sequence = (sequence + 1) % Number.MAX_SAFE_INTEGER
  return `${prefix}-${Date.now().toString(36)}-${sequence.toString(36)}`
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}
