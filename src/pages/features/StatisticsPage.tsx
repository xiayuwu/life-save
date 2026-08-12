import { BarChart3, CalendarDays, ChevronLeft, ChevronRight, Flame, MapPin, Save, Swords, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageIntro, Panel, Stat, Tabs } from './shared'
import type { FeaturePageProps } from './types'

type Range = '30d' | 'year' | 'all'
const moodScore: Record<string, number> = { 开心: 90, 兴奋: 92, 满足: 82, 放松: 78, 平静: 70, 期待: 80, 疲惫: 42, 焦虑: 35, 难过: 25, 孤独: 30, 迷茫: 38 }

export function StatisticsPage({ saves = [], people = [], events = [], decisions = [], quests = [], places = [] }: FeaturePageProps) {
  const [range, setRange] = useState<Range>('year')
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const filteredSaves = useMemo(() => saves.filter((save) => range === 'all' || (range === 'year' ? save.date.startsWith(String(year)) : new Date(save.date).getTime() >= Date.now() - 30 * 86400000)), [saves, range, year])
  const filteredEvents = useMemo(() => events.filter((event) => range === 'all' || (range === 'year' ? event.date.startsWith(String(year)) : new Date(event.date).getTime() >= Date.now() - 30 * 86400000)), [events, range, year])
  const completed = quests.filter((quest) => quest.status === 'completed').length
  const streak = useMemo(() => { const set = new Set(saves.map((save) => save.date)); let count = 0; const date = new Date(); while (set.has(date.toISOString().slice(0, 10))) { count++; date.setDate(date.getDate() - 1) } return count }, [saves])
  const topMood = topCount(filteredSaves.map((item) => item.mood))
  const topKeyword = topCount(filteredSaves.flatMap((item) => item.keywords))
  const topPerson = people.map((person) => ({ name: person.name, count: [...filteredSaves, ...filteredEvents].filter((item) => item.peopleIds.includes(person.id)).length })).sort((a, b) => b.count - a.count)[0]
  const topPlace = places.map((place) => ({ name: place.name, count: place.visitCount })).sort((a, b) => b.count - a.count)[0]
  const moodSeries = useMemo(() => filteredSaves.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(-30).map((save) => ({ date: save.date, value: moodScore[save.mood] ?? save.satisfaction, mood: save.mood })), [filteredSaves])
  const maxSeries = Math.max(1, ...moodSeries.map((item) => item.value))
  return <main className="feature-page stats-page"><PageIntro code="STATISTICS / LIFE TELEMETRY" title="人生统计中心" description="所有洞察只描述你记录下来的数据，不进行心理或医疗判断。缺失的日子不会被擅自解释。" actions={<Tabs value={range} onChange={setRange} options={[{ value: '30d', label: '近 30 天' }, { value: 'year', label: '年度' }, { value: 'all', label: '全部' }]} />} />{range === 'year' && <div className="stats-year"><button onClick={() => setYear((value) => value - 1)}><ChevronLeft /></button><b>{year}</b><button disabled={year >= currentYear} onClick={() => setYear((value) => value + 1)}><ChevronRight /></button></div>}<div className="fp-grid fp-grid--4"><Panel><Stat label="LIFE SAVES" value={filteredSaves.length} note={`${streak} 天连续记录`} /></Panel><Panel><Stat label="CHARACTERS" value={people.length} note={topPerson ? `最高频 · ${topPerson.name}` : '等待人物数据'} /></Panel><Panel><Stat label="PLACES" value={places.length} note={topPlace ? `最常去 · ${topPlace.name}` : '等待地点数据'} /></Panel><Panel><Stat label="QUESTS DONE" value={completed} note={`共 ${quests.length} 条任务`} /></Panel></div><div className="fp-split"><Panel title="LIFE HEATMAP" meta={<span className="fp-badge">{year} · 365 DAYS</span>}><LifeHeatmap saves={saves} events={events} year={year} /></Panel><Panel title="CURRENT SNAPSHOT"><div className="stats-snapshot"><div><span><Flame /></span><Stat label="RECORD STREAK" value={`${streak} DAYS`} /></div><div><span><BarChart3 /></span><Stat label="TOP MOOD" value={topMood?.name || '—'} note={topMood ? `${topMood.count} 次记录` : '暂无数据'} /></div><div><span><Users /></span><Stat label="TOP PERSON" value={topPerson?.name || '—'} note={topPerson ? `${topPerson.count} 次共同出现` : '暂无数据'} /></div><div><span><MapPin /></span><Stat label="TOP PLACE" value={topPlace?.name || '—'} note={topPlace ? `${topPlace.count} 次访问` : '暂无数据'} /></div></div></Panel></div><div className="fp-grid fp-grid--2"><Panel title="MOOD SIGNAL / RECENT 30 RECORDS"><div className="mood-chart">{moodSeries.length ? moodSeries.map((item) => <button key={item.date} title={`${item.date} · ${item.mood} · ${item.value}`} style={{ height: `${Math.max(5, item.value / maxSeries * 100)}%` }}><span>{item.mood}</span></button>) : <p>还没有足够的心情记录。</p>}</div></Panel><Panel title="RECORD INSIGHTS"><div className="insight-list"><article><Save /><div><b>最常见关键词</b><p>{topKeyword ? `「${topKeyword.name}」在当前范围出现 ${topKeyword.count} 次。` : '关键词数据仍在等待。'}</p></div></article><article><CalendarDays /><div><b>事件密度</b><p>当前范围记录了 {filteredEvents.length} 个事件，平均每条存档关联 {(filteredEvents.length / Math.max(1, filteredSaves.length)).toFixed(1)} 个事件。</p></div></article><article><Swords /><div><b>选择与行动</b><p>共做出 {decisions.length} 次决策，完成 {completed} 条任务。</p></div></article></div></Panel></div></main>
}

function LifeHeatmap({ saves, events, year }: { saves: FeaturePageProps['saves'] extends infer T ? NonNullable<T> : never; events: NonNullable<FeaturePageProps['events']>; year: number }) {
  const days = Array.from({ length: isLeap(year) ? 366 : 365 }, (_, index) => { const date = new Date(year, 0, index + 1); const key = date.toISOString().slice(0, 10); const saveCount = saves.filter((item) => item.date === key).length; const eventCount = events.filter((item) => item.date === key).length; return { key, level: Math.min(4, saveCount * 2 + eventCount), count: saveCount + eventCount } })
  const pad = new Date(year, 0, 1).getDay()
  return <><div className="heatmap-months">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month) => <span key={month}>{month}</span>)}</div><div className="life-heatmap">{Array.from({ length: pad }, (_, i) => <i key={`pad-${i}`} />)}{days.map((day) => <button key={day.key} data-level={day.level} title={`${day.key} · ${day.count} 条记录`} aria-label={`${day.key}，${day.count} 条记录`} />)}</div><div className="heatmap-legend"><span>少</span>{[0, 1, 2, 3, 4].map((item) => <i data-level={item} key={item} />)}<span>多</span></div></>
}
function topCount(items: string[]) { const counts = new Map<string, number>(); items.filter(Boolean).forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1)); return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)[0] }
function isLeap(year: number) { return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) }

