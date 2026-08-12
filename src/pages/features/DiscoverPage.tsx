import { Banknote, Bookmark, BookmarkCheck, Clock3, Compass, Dices, MapPin, RefreshCw, Sparkles, Swords, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { activities } from '../../content/activities'
import type { Activity, Quest, Rarity } from '../../types'
import { weightedSample } from '../../utils/random'
import { Empty, PageIntro, Panel, readRecent, runAction, secureRandom, uid, writeRecent } from './shared'
import type { FeaturePageProps } from './types'

type TimeFilter = 'any' | '15' | '30' | '60' | '120'
type PlaceFilter = 'any' | 'home' | 'outdoor' | 'indoor' | 'online'
type BudgetFilter = 'any' | '0' | '20' | '50' | '100'
type StateFilter = 'any' | 'tired' | 'calm' | 'bored' | 'social' | 'active'

const recentKey = 'life-save:recent:discover'
const favoriteKey = 'life-save:favorites:activities'
const rarityXp: Record<Rarity, number> = { COMMON: 25, UNCOMMON: 40, RARE: 65, EPIC: 95, LEGENDARY: 140 }
const placeGroups: Record<Exclude<PlaceFilter, 'any'>, string[]> = {
  home: ['家中', '窗边', '阳台'],
  outdoor: ['户外', '街区', '公园', '江边', '山顶', '绿道', '郊外', '校园', '天台', '夜市', '市场', '城市步道'],
  indoor: ['办公室', '咖啡店', '图书馆', '商场', '书店', '工作室', '餐厅', '食堂', '桌游店', '便利店', '文具店'],
  online: ['线上'],
}

function readFavorites() {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(favoriteKey) || '[]')
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  } catch { return [] }
}

function stateMatch(activity: Activity, state: StateFilter) {
  if (state === 'any') return true
  if (state === 'tired') return activity.energy <= 2 || activity.mood.some((item) => ['疲惫', '低落', '过载'].includes(item))
  if (state === 'calm') return activity.social <= 1 && activity.mood.some((item) => ['平静', '焦虑', '烦躁', '迷茫'].includes(item))
  if (state === 'bored') return activity.mood.includes('无聊') || activity.tags.some((item) => ['探索', '随机', '好奇'].includes(item))
  if (state === 'social') return activity.social >= 2 || activity.category === '关系连接'
  return activity.energy >= 3 || activity.tags.some((item) => ['运动', '行动', '挑战'].includes(item))
}

export function DiscoverPage({ actions }: FeaturePageProps) {
  const [time, setTime] = useState<TimeFilter>('any')
  const [place, setPlace] = useState<PlaceFilter>('any')
  const [budget, setBudget] = useState<BudgetFilter>('any')
  const [state, setState] = useState<StateFilter>('any')
  const [recommendations, setRecommendations] = useState<Activity[]>([])
  const [favorites, setFavorites] = useState<string[]>(readFavorites)
  const [claimed, setClaimed] = useState<string[]>([])
  const filtered = useMemo(() => activities.filter((activity) => {
    const timeOk = time === 'any' || activity.duration <= Number(time)
    const budgetOk = budget === 'any' || activity.cost <= Number(budget)
    const placeOk = place === 'any' || activity.location.includes('任意') || activity.location.some((item) => placeGroups[place].some((keyword) => item.includes(keyword)))
    return timeOk && budgetOk && placeOk && stateMatch(activity, state)
  }), [time, place, budget, state])

  const setFilter = <T,>(setter: (value: T) => void, value: T) => { setter(value); setRecommendations([]) }
  const discover = () => {
    const recent = readRecent(recentKey)
    const picks = weightedSample(filtered, 3, {
      recentIds: recent,
      recentLimit: 20,
      random: secureRandom,
      weight: (activity) => activity.baseWeight * (favorites.includes(activity.id) ? .72 : 1),
    })
    setRecommendations(picks)
    writeRecent(recentKey, [...recent, ...picks.map((item) => item.id)])
  }
  const toggleFavorite = (id: string) => {
    setFavorites((items) => {
      const next = items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
      localStorage.setItem(favoriteKey, JSON.stringify(next))
      return next
    })
  }
  const claim = async (activity: Activity) => {
    if (!actions?.create || claimed.includes(activity.id)) return
    const quest: Quest = { id: uid('quest'), title: activity.title, description: activity.description, type: 'SIDE', rarity: activity.rarity, status: 'active', progress: 0, target: 1, tags: [...activity.tags, 'DISCOVER'], xp: rarityXp[activity.rarity], createdAt: new Date().toISOString() }
    await runAction(actions, 'create', 'quest', quest)
    setClaimed((items) => [...items, activity.id])
  }

  return <main className="feature-page discover-page"><PageIntro code="WHAT NOW? / DISCOVER ENGINE" title="现在做什么？" description="告诉系统你此刻拥有的时间、地点、预算与状态，从 300+ 条活动中加权抽取一组现实可执行建议。" actions={<button className="fp-button fp-button--primary" disabled={!filtered.length} onClick={discover}>{recommendations.length ? <RefreshCw size={16} /> : <Dices size={16} />}{recommendations.length ? '换一批' : '开始发现'}</button>} />
    <Panel className="discover-filters"><div><Clock3 /><label><span>可用时间</span><select className="fp-select" value={time} onChange={(event) => setFilter(setTime, event.target.value as TimeFilter)}><option value="any">不限</option><option value="15">15 分钟内</option><option value="30">30 分钟内</option><option value="60">1 小时内</option><option value="120">2 小时内</option></select></label></div><div><MapPin /><label><span>所在地点</span><select className="fp-select" value={place} onChange={(event) => setFilter(setPlace, event.target.value as PlaceFilter)}><option value="any">任意</option><option value="home">家中</option><option value="outdoor">户外</option><option value="indoor">室内公共空间</option><option value="online">线上</option></select></label></div><div><Banknote /><label><span>预算上限</span><select className="fp-select" value={budget} onChange={(event) => setFilter(setBudget, event.target.value as BudgetFilter)}><option value="any">不限</option><option value="0">零预算</option><option value="20">¥20</option><option value="50">¥50</option><option value="100">¥100</option></select></label></div><div><Zap /><label><span>现在状态</span><select className="fp-select" value={state} onChange={(event) => setFilter(setState, event.target.value as StateFilter)}><option value="any">随便看看</option><option value="tired">有点疲惫</option><option value="calm">想安静一下</option><option value="bored">有点无聊</option><option value="social">想见见人</option><option value="active">想动起来</option></select></label></div><span className="discover-count">{filtered.length} 条候选</span></Panel>
    {!filtered.length ? <Panel><Empty title="当前条件没有匹配活动" description="试着放宽时间、地点或预算范围，发现引擎会重新建立候选池。" action="重置筛选" onAction={() => { setTime('any'); setPlace('any'); setBudget('any'); setState('any'); setRecommendations([]) }} /></Panel> : !recommendations.length ? <Panel><Empty title="候选池已经准备好" description="点击“开始发现”，系统会优先避开最近 20 次看过的活动，并按活动权重抽取三条。" action="给我一些建议" onAction={discover} /></Panel> : <div className="discover-grid">{recommendations.map((activity, index) => { const favorite = favorites.includes(activity.id); const isClaimed = claimed.includes(activity.id); return <Panel accent={index === 0} className={`discover-card discover-card--${activity.rarity.toLowerCase()}`} key={activity.id}><div className="discover-card__top"><span className="fp-badge">{activity.rarity}</span><button className="fp-icon-button" aria-label={favorite ? '取消收藏' : '收藏活动'} onClick={() => toggleFavorite(activity.id)}>{favorite ? <BookmarkCheck /> : <Bookmark />}</button></div><span className="fp-kicker">{activity.category.toUpperCase()}</span><h2>{activity.title}</h2><p>{activity.description}</p><div className="discover-stats"><span><Clock3 />{activity.duration} 分钟</span><span><Banknote />{activity.cost ? `约 ¥${activity.cost}` : '零预算'}</span><span><Zap />能量 {activity.energy > 0 ? '+' : ''}{activity.energy}</span></div><div className="fp-chip-list">{activity.location.slice(0, 3).map((item) => <span className="fp-chip" key={item}>#{item}</span>)}{activity.tags.slice(0, 3).map((item) => <span className="fp-chip active" key={item}>{item}</span>)}</div><div className="discover-card__actions"><button className="fp-button fp-button--primary" disabled={!actions?.create || isClaimed} title={!actions?.create ? '当前数据层未提供任务创建能力' : undefined} onClick={() => claim(activity)}><Swords size={15} />{isClaimed ? '已加入任务' : '领取成任务'}</button></div></Panel>})}</div>}
    {recommendations.length > 0 && <Panel className="discover-footnote"><Compass /><p><b>推荐不是命令。</b>你可以换一批、只收藏，或者什么都不做。最近展示历史只保存在本地，用来降低连续重复。</p><Sparkles /></Panel>}
  </main>
}
