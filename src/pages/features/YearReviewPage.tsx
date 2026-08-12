import { Award, CalendarDays, ChevronLeft, ChevronRight, Disc3, MapPin, Sparkles, Swords, Trophy, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatDay, PageIntro, Panel, Stat } from './shared'
import type { FeaturePageProps } from './types'

const countTop = (values: string[]) => {
  const counts = new Map<string, number>()
  values.filter(Boolean).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)[0]
}

export function YearReviewPage({ profile, saves = [], people = [], events = [], decisions = [], quests = [], places = [] }: FeaturePageProps) {
  const currentYear = new Date().getFullYear()
  const recordedYears = useMemo(() => [...new Set([
    ...saves.map((item) => item.date.slice(0, 4)),
    ...events.map((item) => item.date.slice(0, 4)),
    ...decisions.map((item) => item.createdAt.slice(0, 4)),
    ...quests.map((item) => item.createdAt.slice(0, 4)),
  ].map(Number).filter(Number.isFinite))].sort((a, b) => b - a), [saves, events, decisions, quests])
  const [year, setYear] = useState(recordedYears[0] ?? currentYear)
  const prefix = `${year}-`
  const yearSaves = saves.filter((item) => item.date.startsWith(prefix))
  const yearEvents = events.filter((item) => item.date.startsWith(prefix))
  const yearPeople = people.filter((item) => item.metAt.startsWith(prefix))
  const yearPlaces = places.filter((item) => item.firstVisit.startsWith(prefix))
  const yearDecisions = decisions.filter((item) => (item.resolvedAt || item.createdAt).startsWith(prefix))
  const yearQuests = quests.filter((item) => (item.completedAt || item.createdAt).startsWith(prefix))
  const completedQuests = yearQuests.filter((item) => item.status === 'completed')
  const days = new Set([...yearSaves.map((item) => item.date), ...yearEvents.map((item) => item.date)])
  const topPerson = people.map((person) => ({ person, count: [...yearSaves, ...yearEvents].filter((item) => item.peopleIds.includes(person.id)).length })).sort((a, b) => b.count - a.count)[0]
  const topPlace = places.map((place) => ({ place, count: [...yearSaves, ...yearEvents].filter((item) => item.placeIds.includes(place.id)).length })).sort((a, b) => b.count - a.count)[0]
  const happiest = [...yearSaves].sort((a, b) => b.satisfaction - a.satisfaction)[0]
  const topMood = countTop(yearSaves.map((item) => item.mood))
  const topBgm = countTop(yearSaves.map((item) => item.bgm))
  const keywords = useMemo(() => {
    const values = [...yearSaves.flatMap((item) => item.keywords), ...yearEvents.flatMap((item) => item.tags)]
    const counts = new Map<string, number>()
    values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
    return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 12)
  }, [yearSaves, yearEvents])
  const monthCounts = Array.from({ length: 12 }, (_, month) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}`
    return yearSaves.filter((item) => item.date.startsWith(key)).length + yearEvents.filter((item) => item.date.startsWith(key)).length
  })
  const activeMonthIndex = monthCounts.indexOf(Math.max(...monthCounts))
  const averageMood = yearSaves.length ? Math.round(yearSaves.reduce((sum, item) => sum + item.satisfaction, 0) / yearSaves.length) : 0
  const title = yearTitle({ saves: yearSaves.length, places: yearPlaces.length, quests: completedQuests.length, decisions: yearDecisions.length, averageMood })
  const hasData = days.size + yearPeople.length + yearPlaces.length + yearDecisions.length + yearQuests.length > 0

  return <main className="feature-page review-page">
    <PageIntro code="YEAR IN REVIEW / PERSONAL WRAPPED" title={`${year} 年度结算`} description="把这一年的记录折叠成一组可以翻阅的证据。所有称号与洞察只来自你实际留下的数据。" actions={<div className="review-year-picker"><button aria-label="上一年" onClick={() => setYear((value) => value - 1)}><ChevronLeft /></button><b>{year}</b><button aria-label="下一年" disabled={year >= currentYear} onClick={() => setYear((value) => value + 1)}><ChevronRight /></button></div>} />
    {!hasData ? <Panel><div className="review-empty"><CalendarDays /><span className="fp-kicker">NO SIGNAL / {year}</span><h2>这一年还没有留下可结算的数据</h2><p>切换到有记录的年份，或从今天开始写下第一条存档。</p>{recordedYears.length > 0 && <div className="fp-chip-list">{recordedYears.map((item) => <button className={`fp-chip ${item === year ? 'active' : ''}`} key={item} onClick={() => setYear(item)}>{item}</button>)}</div>}</div></Panel> : <>
      <Panel accent className="review-cover"><div className="review-orbit" /><div><span className="fp-kicker">PLAYER / {profile?.nickname || 'UNKNOWN PLAYER'}</span><h2>{title}</h2><p>你在 {year} 年有 <strong>{days.size}</strong> 天留下坐标。这不是完整人生，只是你选择保存下来的光。</p><div className="fp-chip-list">{keywords.slice(0, 5).map((item) => <span className="fp-chip active" key={item.name}>#{item.name}</span>)}</div></div><Trophy /></Panel>
      <div className="fp-grid fp-grid--4"><Panel><Stat label="DAYS LIVED ON RECORD" value={days.size} note="有存档或事件的日子" /></Panel><Panel><Stat label="LIFE SAVES" value={yearSaves.length} note="留下的生活切片" /></Panel><Panel><Stat label="NEW CHARACTERS" value={yearPeople.length} note="第一次遇见的人" /></Panel><Panel><Stat label="NEW PLACES" value={yearPlaces.length} note="第一次抵达的地方" /></Panel></div>
      <div className="review-story-grid">
        <Panel className="review-card" title="MOST FREQUENT CHARACTER"><Users /><span>今年最常出现的人</span><h3>{topPerson?.count ? topPerson.person.name : '还没有明确主角'}</h3><p>{topPerson?.count ? `在 ${topPerson.count} 条记录中共同出现。` : '关联人物后，这里会出现这一年的高频角色。'}</p></Panel>
        <Panel className="review-card" title="MOST VISITED PLACE"><MapPin /><span>今年最常去的地方</span><h3>{topPlace?.count ? topPlace.place.name : '地图仍在展开'}</h3><p>{topPlace?.count ? `在 ${topPlace.count} 条年度记录中出现。` : '把地点关联到存档或事件，就能看见年度坐标。'}</p></Panel>
        <Panel className="review-card" title="HAPPIEST SAVE"><Sparkles /><span>满意度最高的一天</span><h3>{happiest ? formatDay(happiest.date) : '等待记录'}</h3><p>{happiest ? `${happiest.mood || '未命名心情'} · 满意度 ${happiest.satisfaction}` : '暂时没有可比较的每日存档。'}</p></Panel>
        <Panel className="review-card" title="MOST ACTIVE MONTH"><CalendarDays /><span>记录最密集的月份</span><h3>{Math.max(...monthCounts) > 0 ? `${activeMonthIndex + 1} 月` : '等待记录'}</h3><p>{Math.max(...monthCounts) > 0 ? `存档与事件共 ${monthCounts[activeMonthIndex]} 条。` : '这一年没有月份数据。'}</p></Panel>
      </div>
      <div className="fp-grid fp-grid--2"><Panel title="YEARLY SIGNAL"><div className="review-signals"><article><Swords /><div><b>{completedQuests.length}</b><span>完成任务</span></div></article><article><Award /><div><b>{yearDecisions.length}</b><span>做出决定</span></div></article><article><Sparkles /><div><b>{topMood?.name || '—'}</b><span>年度心情</span></div></article><article><Disc3 /><div><b>{topBgm?.name || '—'}</b><span>年度 BGM</span></div></article></div></Panel><Panel title="MONTHLY RHYTHM"><div className="review-months">{monthCounts.map((count, index) => <div key={index} title={`${index + 1} 月 · ${count} 条`}><i style={{ height: `${Math.max(4, count / Math.max(1, ...monthCounts) * 100)}%` }} /><span>{index + 1}</span></div>)}</div></Panel></div>
      <Panel title="WORDS OF THE YEAR">{keywords.length ? <div className="review-keywords">{keywords.map((item, index) => <span key={item.name} style={{ fontSize: `${Math.max(.78, 1.55 - index * .065)}rem` }}>#{item.name}<small>{item.count}</small></span>)}</div> : <p className="fp-muted">为存档添加关键词后，年度词云会在这里生长。</p>}</Panel>
    </>}
  </main>
}

function yearTitle(data: { saves: number; places: number; quests: number; decisions: number; averageMood: number }) {
  if (data.saves >= 100) return '存档狂魔'
  if (data.quests >= 30) return '支线任务大师'
  if (data.places >= 12) return '城市漫游者'
  if (data.decisions >= 20) return '选择实验家'
  if (data.averageMood >= 80) return '高能量收集者'
  if (data.saves >= 30) return '日常观察员'
  return '世界线记录者'
}
