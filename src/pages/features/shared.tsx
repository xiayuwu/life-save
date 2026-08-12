import { ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import type { FeatureActions, FeatureEntity, FeatureEntityKind } from './types'
import './features.css'
import './feature-pages.css'

export function PageIntro({ code, title, description, actions }: { code: string; title: string; description: string; actions?: ReactNode }) {
  return <header className="fp-intro"><div><span className="fp-kicker">{code}</span><h1>{title}</h1><p>{description}</p></div>{actions && <div className="fp-intro__actions">{actions}</div>}</header>
}

export function Panel({ children, className = '', title, meta, accent }: { children: ReactNode; className?: string; title?: string; meta?: ReactNode; accent?: boolean }) {
  return <section className={`fp-panel ${accent ? 'fp-panel--accent' : ''} ${className}`}>{(title || meta) && <header className="fp-panel__head">{title && <h2>{title}</h2>}{meta}</header>}{children}</section>
}

export function Empty({ title, description, action, onAction }: { title: string; description: string; action?: string; onAction?: () => void }) {
  return <div className="fp-empty"><span><Sparkles size={25} /></span><h3>{title}</h3><p>{description}</p>{action && onAction && <button className="fp-button fp-button--primary" onClick={onAction}>{action}</button>}</div>
}

export function Tabs<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string; count?: number }[]; onChange: (value: T) => void }) {
  return <div className="fp-tabs" role="tablist">{options.map((item) => <button type="button" role="tab" aria-selected={value === item.value} className={value === item.value ? 'active' : ''} key={item.value} onClick={() => onChange(item.value)}>{item.label}{item.count !== undefined && <em>{item.count}</em>}</button>)}</div>
}

export function Meter({ value, label, color }: { value: number; label?: string; color?: string }) {
  const safe = Math.max(0, Math.min(100, value))
  return <div className="fp-meter">{label && <span><small>{label}</small><b>{Math.round(safe)}</b></span>}<i><i style={{ width: `${safe}%`, background: color }} /></i></div>
}

export function SearchBox({ value, onChange, placeholder = '搜索你的世界…' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="fp-search"><Search size={16} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>
}

export function Stat({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return <div className="fp-stat"><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>
}

export function useLocalList<T>(source: T[] | undefined) {
  const [items, setItems] = useState<T[]>(source ?? [])
  return [items, setItems] as const
}

export async function runAction(actions: FeatureActions | undefined, method: 'create' | 'update', kind: FeatureEntityKind, value: FeatureEntity) {
  await actions?.[method]?.(kind, value)
  actions?.notify?.(method === 'create' ? '已写入存档' : '修改已保存', `${kind.toUpperCase()} 数据已同步。`)
}

export function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export function secureRandom() {
  const value = new Uint32Array(1)
  crypto.getRandomValues(value)
  return value[0] / 0x1_0000_0000
}

export function readRecent(key: string) {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').slice(-20) : []
  } catch { return [] }
}

export function writeRecent(key: string, ids: string[]) {
  localStorage.setItem(key, JSON.stringify(ids.slice(-20)))
}

export function isoDay(value = new Date()) { return value.toISOString().slice(0, 10) }

export function daysBetween(a?: string, b = isoDay()) {
  if (!a) return 0
  const diff = new Date(b).getTime() - new Date(a).getTime()
  return Math.max(0, Math.floor(diff / 86_400_000))
}

export function formatDay(value?: string) {
  if (!value) return '未记录'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function splitTags(value: string) {
  return [...new Set(value.split(/[,，\s]+/).map((item) => item.trim()).filter(Boolean))]
}

export function Pager({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null
  return <div className="fp-pager"><button disabled={page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft size={15} /></button><span>{page} / {total}</span><button disabled={page >= total} onClick={() => onChange(page + 1)}><ChevronRight size={15} /></button></div>
}

export function useNowQuery() {
  return useMemo(() => {
    const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''
    return new URLSearchParams(window.location.search || hashQuery)
  }, [])
}
