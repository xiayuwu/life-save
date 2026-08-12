import { Archive, BookOpen, Brain, CalendarDays, CheckCircle2, MapPin, Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Empty, formatDay, PageIntro, Pager, Panel, SearchBox, Tabs } from './shared'
import type { FeaturePageProps } from './types'

type ArchiveKind = 'all' | 'save' | 'event' | 'person' | 'place' | 'decision' | 'quest'
interface ArchiveItem { id: string; kind: Exclude<ArchiveKind, 'all'>; title: string; description: string; date: string; tags: string[]; peopleIds: string[]; placeIds: string[] }

const kindMeta: Record<Exclude<ArchiveKind, 'all'>, { label: string; icon: typeof Archive }> = {
  save: { label: '存档', icon: BookOpen }, event: { label: '事件', icon: CalendarDays }, person: { label: '人物', icon: Users }, place: { label: '地点', icon: MapPin }, decision: { label: '决定', icon: Brain }, quest: { label: '任务', icon: CheckCircle2 },
}

export function ArchivePage({ saves = [], events = [], people = [], places = [], decisions = [], quests = [], actions }: FeaturePageProps) {
  const [kind, setKind] = useState<ArchiveKind>('all')
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('全部')
  const [month, setMonth] = useState('全部')
  const [personId, setPersonId] = useState('全部')
  const [placeId, setPlaceId] = useState('全部')
  const [tag, setTag] = useState('全部')
  const [page, setPage] = useState(1)
  const allItems = useMemo<ArchiveItem[]>(() => [
    ...saves.map((item) => ({ id: item.id, kind: 'save' as const, title: item.story.slice(0, 42) || `${item.date} 的生活存档`, description: [item.mood, item.status, item.quote].filter(Boolean).join(' · '), date: item.date, tags: item.keywords, peopleIds: item.peopleIds, placeIds: item.placeIds })),
    ...events.map((item) => ({ id: item.id, kind: 'event' as const, title: item.title, description: item.description || item.type, date: item.date, tags: item.tags, peopleIds: item.peopleIds, placeIds: item.placeIds })),
    ...people.map((item) => ({ id: item.id, kind: 'person' as const, title: item.name, description: [item.nickname, item.relationLevel, item.status].filter(Boolean).join(' · '), date: item.metAt, tags: [...item.interests, ...item.games], peopleIds: [item.id], placeIds: item.placeIds })),
    ...places.map((item) => ({ id: item.id, kind: 'place' as const, title: item.name, description: [item.city, item.category, item.description].filter(Boolean).join(' · '), date: item.lastVisit, tags: [item.category], peopleIds: item.peopleIds, placeIds: [item.id] })),
    ...decisions.map((item) => ({ id: item.id, kind: 'decision' as const, title: item.question, description: `${item.category} · ${item.mode}`, date: item.resolvedAt || item.createdAt, tags: [item.category, ...item.factors], peopleIds: [], placeIds: [] })),
    ...quests.map((item) => ({ id: item.id, kind: 'quest' as const, title: item.title, description: item.description || `${item.type} · ${item.status}`, date: item.completedAt || item.createdAt, tags: item.tags, peopleIds: [], placeIds: [] })),
  ].sort((a, b) => b.date.localeCompare(a.date)), [saves, events, people, places, decisions, quests])
  const years = [...new Set(allItems.map((item) => item.date.slice(0, 4)).filter(Boolean))].sort().reverse()
  const tags = [...new Set(allItems.flatMap((item) => item.tags).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'zh-CN'))
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return allItems.filter((item) => {
      const matchesText = !needle || [item.title, item.description, ...item.tags].join(' ').toLocaleLowerCase().includes(needle)
      return (kind === 'all' || item.kind === kind) && matchesText && (year === '全部' || item.date.startsWith(year)) && (month === '全部' || item.date.slice(5, 7) === month) && (personId === '全部' || item.peopleIds.includes(personId)) && (placeId === '全部' || item.placeIds.includes(placeId)) && (tag === '全部' || item.tags.includes(tag))
    })
  }, [allItems, kind, query, year, month, personId, placeId, tag])
  const pageSize = 12
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const shown = filtered.slice((Math.min(page, pages) - 1) * pageSize, Math.min(page, pages) * pageSize)
  const setFilter = <T,>(setter: (value: T) => void, value: T) => { setter(value); setPage(1) }
  const reset = () => { setKind('all'); setQuery(''); setYear('全部'); setMonth('全部'); setPersonId('全部'); setPlaceId('全部'); setTag('全部'); setPage(1) }
  const openItem = (item: ArchiveItem) => actions?.navigate?.(routeFor(item.kind, item.id))

  return <main className="feature-page archive-page"><PageIntro code="ARCHIVE / GLOBAL MEMORY INDEX" title="人生归档馆" description="把所有历史数据放进同一个可检索索引。按年份、月份、人物、地点、标签与类型交叉寻找。" actions={<span className="fp-badge">{allItems.length} RECORDS</span>} />
    <Panel><div className="archive-search"><SearchBox value={query} onChange={(value) => setFilter(setQuery, value)} placeholder="搜索标题、内容或标签…" /><Tabs value={kind} onChange={(value) => setFilter(setKind, value)} options={[{ value: 'all', label: '全部', count: allItems.length }, ...Object.entries(kindMeta).map(([value, meta]) => ({ value: value as ArchiveKind, label: meta.label, count: allItems.filter((item) => item.kind === value).length }))]} /></div><div className="archive-filters"><Search size={14} /><select className="fp-select" value={year} onChange={(e) => setFilter(setYear, e.target.value)}><option>全部</option>{years.map((item) => <option key={item}>{item}</option>)}</select><select className="fp-select" value={month} onChange={(e) => setFilter(setMonth, e.target.value)}><option>全部</option>{Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')).map((item) => <option key={item} value={item}>{Number(item)} 月</option>)}</select><select className="fp-select" value={personId} onChange={(e) => setFilter(setPersonId, e.target.value)}><option value="全部">全部人物</option>{people.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><select className="fp-select" value={placeId} onChange={(e) => setFilter(setPlaceId, e.target.value)}><option value="全部">全部地点</option>{places.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><select className="fp-select" value={tag} onChange={(e) => setFilter(setTag, e.target.value)}><option value="全部">全部标签</option>{tags.map((item) => <option key={item}>{item}</option>)}</select><button className="fp-button fp-button--ghost" onClick={reset}>重置</button></div></Panel>
    {!shown.length ? <Panel><Empty title={allItems.length ? '没有找到匹配的历史数据' : '归档馆还没有藏品'} description={allItems.length ? '放宽搜索词或重置交叉筛选。' : '当你开始记录，存档、人物、事件与地点会自动进入这里。'} action={allItems.length ? '重置筛选' : undefined} onAction={allItems.length ? reset : undefined} /></Panel> : <Panel title="ARCHIVE INDEX" meta={<span className="fp-muted">找到 {filtered.length} 条</span>}><div className="archive-list">{shown.map((item) => { const meta = kindMeta[item.kind]; const Icon = meta.icon; const peopleText = people.filter((person) => item.peopleIds.includes(person.id)).map((person) => person.name).join('、'); const placesText = places.filter((place) => item.placeIds.includes(place.id)).map((place) => place.name).join('、'); return <button key={`${item.kind}-${item.id}`} onClick={() => openItem(item)} disabled={!actions?.navigate}><span className="archive-kind"><Icon /><small>{meta.label}</small></span><span className="archive-copy"><b>{item.title}</b><span>{item.description || '没有补充描述'}</span><span className="archive-links">{peopleText && `@${peopleText}`}{peopleText && placesText && ' · '}{placesText && `#${placesText}`}</span></span><span className="archive-date">{formatDay(item.date)}<small>{item.tags.slice(0, 3).join(' / ')}</small></span></button>})}</div><Pager page={Math.min(page, pages)} total={pages} onChange={setPage} /></Panel>}
  </main>
}

function routeFor(kind: Exclude<ArchiveKind, 'all'>, id: string) {
  const routes: Record<Exclude<ArchiveKind, 'all'>, string> = { save: '/save', event: '/timeline', person: '/people', place: '/world', decision: '/decision', quest: '/quests' }
  return `${routes[kind]}?id=${encodeURIComponent(id)}`
}
