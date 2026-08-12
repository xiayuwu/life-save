import {
  ArrowRight, BookOpen, CalendarDays, ChevronRight, CircleDashed, Clock3, Compass,
  MapPin, Plus, Save, Sparkles, TrendingUp, Trophy, UsersRound, Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { Achievement, LifeEvent, LifeSave, Person, Place, Profile, Quest } from '../types'
import { GlassCard } from '../components/ui/GlassCard'

type Props = {
  profile?: Profile
  saves: LifeSave[]
  people: Person[]
  places: Place[]
  events: LifeEvent[]
  quests: Quest[]
  achievements: Achievement[]
  systemLine: string
  level: { level: number; xp: number; current: number; needed: number; progress: number }
  streak: number
  onQuickSave: () => void
}

const moodColors: Record<string, string> = { 开心: '#ffb4d8', 平静: '#8ca8ff', 疲惫: '#9ba2be', 兴奋: '#8fe7d7', 放松: '#b697ff', 焦虑: '#ffb477', 满足: '#c5d8ff' }

export function DashboardPage({ profile, saves, people, places, events, quests, achievements, systemLine, level, streak, onQuickSave }: Props) {
  const navigate = useNavigate()
  const [referenceTime] = useState(() => Date.now())
  const latest = [...saves].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)
  const upcoming = quests.filter((quest) => quest.status === 'active').slice(0, 4)
  const moodData = useMemo(() => Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(referenceTime); date.setDate(date.getDate() - (6 - offset)); const iso = date.toISOString().slice(0, 10)
    const save = saves.find((item) => item.date.slice(0, 10) === iso)
    return { day: date.toLocaleDateString('zh-CN', { weekday: 'short' }), value: save ? Math.max(10, save.satisfaction) : 45, mood: save?.mood || '未记录' }
  }), [referenceTime, saves])
  const referenceDate = new Date(referenceTime)
  const today = saves.find((save) => save.date.slice(0, 10) === referenceDate.toISOString().slice(0, 10))
  const joinedDays = profile ? Math.max(1, Math.ceil((referenceTime - new Date(profile.joinedAt).getTime()) / 86400000)) : 1
  const unlocked = achievements.filter((item) => item.unlockedAt).length
  return <div className="dashboard page-stack">
    <section className="dashboard-hero">
      <div><span className="eyebrow">CURRENT SAVE / {referenceDate.toLocaleDateString('zh-CN').replaceAll('/', '.')}</span><h1>YOUR LIFE<br /><b>IS STILL LOADING</b></h1><p>{systemLine}</p><div className="hero-actions"><button className="button button--primary" onClick={onQuickSave}><Save size={16} /> QUICK SAVE</button><button className="button button--secondary" onClick={() => navigate('/save')}><BookOpen size={15} /> 今日存档</button></div></div>
      <GlassCard className="player-card" accent><div className="player-card__top"><span>PLAYER PROFILE</span><i>ONLINE</i></div><div className="player-card__identity"><div className="avatar avatar--large" style={{ '--accent': profile?.accent || '#8ca8ff' } as React.CSSProperties}>{profile?.nickname?.slice(0, 1) || 'P'}</div><div><small>当前玩家</small><h2>{profile?.nickname || 'PLAYER'}</h2><p>{profile?.status || '世界仍在运行'}</p></div></div><div className="player-card__level"><div><span>LIFE LEVEL</span><b>LV. {String(level.level).padStart(2, '0')}</b></div><div className="xp-bar"><i style={{ width: `${level.progress}%` }} /><span>{level.current} / {level.needed} XP</span></div></div><div className="player-card__stats"><div><strong>{joinedDays}</strong><span>JOINED DAYS</span></div><div><strong>{streak}</strong><span>DAY STREAK</span></div><div><strong>{unlocked}</strong><span>ACHIEVED</span></div></div></GlassCard>
    </section>

    <section className="dashboard-metrics">
      <GlassCard interactive onClick={() => navigate('/archive')}><span className="metric-icon"><Save /></span><div><b>{saves.length}</b><span>人生存档</span></div><small><TrendingUp /> 本机记录</small></GlassCard>
      <GlassCard interactive onClick={() => navigate('/people')}><span className="metric-icon metric-icon--pink"><UsersRound /></span><div><b>{people.length}</b><span>角色图鉴</span></div><small><CircleDashed /> 世界成员</small></GlassCard>
      <GlassCard interactive onClick={() => navigate('/world')}><span className="metric-icon metric-icon--cyan"><MapPin /></span><div><b>{places.length}</b><span>解锁地点</span></div><small><Compass /> 记忆坐标</small></GlassCard>
      <GlassCard interactive onClick={() => navigate('/quest')}><span className="metric-icon metric-icon--gold"><Trophy /></span><div><b>{quests.filter((quest) => quest.status === 'completed').length}</b><span>完成任务</span></div><small><Sparkles /> 支线进度</small></GlassCard>
    </section>

    <section className="dashboard-grid">
      <GlassCard className="today-card"><header><div><span className="eyebrow">TODAY STATUS</span><h2>今天的存档状态</h2></div><button className="text-button" onClick={() => navigate('/save')}>{today ? '查看详情' : '完成存档'} <ArrowRight /></button></header>{today ? <div className="today-saved"><div className="mood-orb" style={{ '--mood': moodColors[today.mood] || '#8ca8ff' } as React.CSSProperties}><span>{today.mood}</span></div><div><p>{today.story || today.quote || '这一天已经被保存在时间线里。'}</p><div className="keyword-row">{today.keywords.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="today-score"><strong>{today.saveWorth}</strong><span>SAVE WORTH</span></div></div> : <div className="today-empty"><div><Clock3 /><i /></div><h3>今日存档尚未完成</h3><p>现在的你可能还在经历故事。先记下一点，晚些时候再补全。</p><button className="button button--secondary" onClick={onQuickSave}><Zap size={15} /> 先快速保存</button></div>}</GlassCard>
      <GlassCard className="mood-card"><header><div><span className="eyebrow">MOOD SIGNAL / 7 DAYS</span><h2>情绪波形</h2></div><button className="icon-button" onClick={() => navigate('/stats')} aria-label="查看统计"><ChevronRight /></button></header><div className="mood-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={moodData}><defs><linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9fb6ff" stopOpacity={.42} /><stop offset="100%" stopColor="#9fb6ff" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8990aa', fontSize: 9 }} /><Tooltip contentStyle={{ background: '#11162c', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, fontSize: 10 }} /><Area type="monotone" dataKey="value" stroke="#aabfff" strokeWidth={2} fill="url(#moodGradient)" /></AreaChart></ResponsiveContainer></div><p>最近的情绪曲线仅描述你的记录，不作心理或医疗判断。</p></GlassCard>
      <GlassCard className="recent-card"><header><div><span className="eyebrow">LIFE TIMELINE</span><h2>最近发生</h2></div><button className="text-button" onClick={() => navigate('/timeline')}>全部时间线 <ArrowRight /></button></header><div className="recent-list">{latest.length ? latest.map((save) => <button key={save.id} onClick={() => navigate(`/save?id=${save.id}`)}><time><b>{new Date(save.date).getDate()}</b><span>{new Date(save.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span></time><i style={{ background: moodColors[save.mood] || '#8ca8ff' }} /><div><b>{save.quick ? save.story.slice(0, 36) || '快速存档' : save.quote || save.story.slice(0, 36) || '人生存档'}</b><span>{save.mood} · {save.keywords.slice(0, 2).join(' / ') || '未标记'}</span></div><ChevronRight /></button>) : <div className="inline-empty">时间线仍是一片星空。第一条记录会从这里开始。</div>}</div></GlassCard>
      <GlassCard className="quest-card"><header><div><span className="eyebrow">ACTIVE QUESTS</span><h2>当前任务</h2></div><span className="quest-count">{upcoming.length} ACTIVE</span></header><div className="quest-list">{upcoming.length ? upcoming.map((quest) => <button key={quest.id} onClick={() => navigate('/quest')}><span className={`rarity rarity--${quest.rarity.toLowerCase()}`}>{quest.rarity.slice(0, 1)}</span><div><b>{quest.title}</b><span>{quest.type} · {quest.xp} XP</span><i><em style={{ width: `${Math.min(100, quest.progress / quest.target * 100)}%` }} /></i></div></button>) : <div className="inline-empty">任务栏很安静。也许该领取一条新的支线。</div>}</div><button className="button button--ghost button--full" onClick={() => navigate('/quest?random=1')}><Plus size={14} /> 获取随机任务</button></GlassCard>
    </section>

    <section className="dashboard-bottom">
      <GlassCard className="memory-card" interactive onClick={() => navigate('/memory')}><CalendarDays /><div><span>ON THIS DAY</span><h3>过去的今天</h3><p>{events.length ? `档案里已有 ${events.length} 个事件，某些记忆正在等待被重新看见。` : '第一段“往年今日”会在未来解锁。'}</p></div><ArrowRight /></GlassCard>
      <GlassCard className="system-card"><span className="system-card__pulse" /><div><span>SYSTEM WHISPER</span><p>“{systemLine}”</p></div><small>当前人生版本：未完待续</small></GlassCard>
    </section>
  </div>
}
