import { Check, CirclePause, Dices, Flag, Plus, RotateCcw, Sparkles, Swords, Trash2, Trophy } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import type { Quest, Rarity } from '../../types'
import { weightedRandom } from '../../utils/random'
import { Empty, formatDay, Meter, PageIntro, Panel, readRecent, runAction, secureRandom, splitTags, Stat, Tabs, uid, useLocalList, useNowQuery, writeRecent } from './shared'
import type { FeaturePageProps } from './types'

const types: Quest['type'][] = ['MAIN', 'SIDE', 'DAILY', 'RANDOM']
const rarities: Rarity[] = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY']
const randomQuests = [
  { id: 'road', title: '走一条从没走过的路', description: '探索附近一条陌生街道，留下一张照片。', rarity: 'RARE', baseWeight: .8 },
  { id: 'hello', title: '给很久没联系的人发一句问候', description: '只问候，不为回复设置期待。', rarity: 'UNCOMMON', baseWeight: 1 },
  { id: 'procrastination', title: '完成一件拖延的小事', description: '选择十五分钟内能结束的那件事。', rarity: 'COMMON', baseWeight: 1.4 },
  { id: 'sky', title: '记录今天的天空', description: '拍下或写下今天头顶的光线。', rarity: 'COMMON', baseWeight: 1.35 },
  { id: 'walk', title: '离线散步 30 分钟', description: '把手机留在口袋里，让注意力回到街道。', rarity: 'RARE', baseWeight: .75 },
  { id: 'playlist', title: '创造一个只属于今天的歌单', description: '至少加入五首歌，为它取一个章节名。', rarity: 'EPIC', baseWeight: .45 },
] satisfies { id: string; title: string; description: string; rarity: Rarity; baseWeight: number }[]
function freshQuest(): Quest { return { id: uid('quest'), title: '', description: '', type: 'SIDE', rarity: 'COMMON', status: 'active', progress: 0, target: 1, tags: [], xp: 30, createdAt: new Date().toISOString() } }

export function QuestPage({ quests: source, achievements = [], actions }: FeaturePageProps) {
  const [quests, setQuests] = useLocalList(source)
  const query = useNowQuery()
  const [tab, setTab] = useState<'active' | 'completed' | 'all'>('active')
  const [editor, setEditor] = useState(query.has('new'))
  const [draft, setDraft] = useState(freshQuest)
  const [random, setRandom] = useState<{ title: string; description: string; rarity: Rarity } | null>(null)
  const visible = useMemo(() => quests.filter((quest) => tab === 'all' || quest.status === tab), [quests, tab])
  const completed = quests.filter((item) => item.status === 'completed').length
  const xp = quests.filter((item) => item.status === 'completed').reduce((sum, item) => sum + item.xp, 0)
  useState(() => { if (query.has('random')) setTimeout(() => drawRandom(), 0) })
  function drawRandom() {
    const key = 'life-save:recent:quests'
    const recent = readRecent(key)
    const pick = weightedRandom(randomQuests, { recentIds: recent, recentLimit: 20, random: secureRandom })
    if (!pick) return
    writeRecent(key, [...recent, pick.id])
    setRandom({ title: pick.title, description: pick.description, rarity: pick.rarity })
  }
  const claimRandom = async () => { if (!random) return; const quest: Quest = { ...freshQuest(), title: random.title, description: random.description, type: 'RANDOM', rarity: random.rarity, xp: rarities.indexOf(random.rarity) * 25 + 35 }; await runAction(actions, 'create', 'quest', quest); setQuests((items) => [quest, ...items]); setRandom(null) }
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!draft.title.trim()) return; await runAction(actions, 'create', 'quest', draft); setQuests((items) => [draft, ...items]); setDraft(freshQuest()); setEditor(false) }
  const update = async (quest: Quest, patch: Partial<Quest>) => { const value = { ...quest, ...patch }; await runAction(actions, 'update', 'quest', value); setQuests((items) => items.map((item) => item.id === value.id ? value : item)) }
  const remove = async (id: string) => { await actions?.delete?.('quest', id); setQuests((items) => items.filter((item) => item.id !== id)) }

  return <main className="feature-page quest-page">
    <PageIntro code="QUEST LOG / REAL LIFE RPG" title="人生任务" description="主线需要耐心，支线负责让今天发光。完成任务会写入真实进度，而不只是点亮一张卡。" actions={<><button className="fp-button" onClick={drawRandom}><Dices size={15} />领取随机任务</button><button className="fp-button fp-button--primary" onClick={() => setEditor(true)}><Plus size={15} />新建任务</button></>} />
    <div className="fp-grid fp-grid--4"><Panel><Stat label="ACTIVE QUESTS" value={quests.filter((item) => item.status === 'active').length} note="正在进行" /></Panel><Panel><Stat label="COMPLETED" value={completed} note="全部时间" /></Panel><Panel><Stat label="XP EARNED" value={xp} note={`LV.${Math.floor(xp / 300) + 1}`} /></Panel><Panel><Stat label="ACHIEVEMENTS" value={achievements.filter((item) => item.unlockedAt).length} note={`/ ${achievements.length || 0}`} /></Panel></div>
    <Panel><Tabs value={tab} onChange={setTab} options={[{ value: 'active', label: '进行中', count: quests.filter((item) => item.status === 'active').length }, { value: 'completed', label: '已完成', count: completed }, { value: 'all', label: '全部', count: quests.length }]} /></Panel>
    {!visible.length ? <Panel><Empty title={quests.length ? '这个任务栏是空的' : '任务日志尚未激活'} description={quests.length ? '切换标签查看其他任务，或开启一条新支线。' : '给现实生活增加一个可完成的目标，经验值会从行动中产生。'} action="领取一条随机支线" onAction={drawRandom} /></Panel> : <div className="quest-columns">{types.map((type) => { const list = visible.filter((item) => item.type === type); if (!list.length) return null; return <section key={type}><header><span>{type === 'MAIN' ? <Swords /> : type === 'DAILY' ? <RotateCcw /> : type === 'RANDOM' ? <Dices /> : <Flag />}</span><div><b>{type} QUEST</b><small>{list.length} ACTIVE SIGNALS</small></div></header><div>{list.map((quest) => <QuestCard key={quest.id} quest={quest} onUpdate={update} onDelete={remove} />)}</div></section> })}</div>}
    {random && <div className="fp-popover"><Panel accent className="random-quest"><Sparkles size={38} /><span className="fp-kicker">RANDOM QUEST FOUND / {random.rarity}</span><h2>{random.title}</h2><p>{random.description}</p><div className="fp-actions"><button className="fp-button fp-button--primary" onClick={claimRandom}>接受任务</button><button className="fp-button" onClick={drawRandom}>重新探索</button><button className="fp-button fp-button--ghost" onClick={() => setRandom(null)}>稍后再说</button></div></Panel></div>}
    {editor && <div className="fp-popover" onMouseDown={(e) => e.target === e.currentTarget && setEditor(false)}><form className="fp-dialog" onSubmit={submit}><div className="fp-dialog__head"><div><span className="fp-kicker">CREATE QUEST</span><h2>定义一条现实任务</h2></div><button className="fp-button fp-button--ghost" type="button" onClick={() => setEditor(false)}>取消</button></div><QuestForm value={draft} setValue={setDraft} /><div className="fp-divider" /><button className="fp-button fp-button--primary"><Flag size={15} />加入任务日志</button></form></div>}
  </main>
}

function QuestCard({ quest, onUpdate, onDelete }: { quest: Quest; onUpdate: (quest: Quest, patch: Partial<Quest>) => void; onDelete: (id: string) => void }) { const progress = quest.target ? quest.progress / quest.target * 100 : 0; return <article className={`quest-card quest-card--${quest.rarity.toLowerCase()} ${quest.status === 'completed' ? 'completed' : ''}`}><div className="quest-card__head"><span className="fp-badge">{quest.rarity}</span><span>+{quest.xp} XP</span></div><h3>{quest.title}</h3><p>{quest.description || '没有任务说明。'}</p>{quest.tags.length > 0 && <div className="fp-chip-list">{quest.tags.map((tag) => <span className="fp-chip" key={tag}>{tag}</span>)}</div>}<Meter value={progress} label={`${quest.progress} / ${quest.target}`} /><div className="quest-card__foot"><small>{quest.dueAt ? `截止 ${formatDay(quest.dueAt)}` : `创建于 ${formatDay(quest.createdAt)}`}</small><div>{quest.status !== 'completed' && <><button title="增加进度" onClick={() => onUpdate(quest, { progress: Math.min(quest.target, quest.progress + 1), status: quest.progress + 1 >= quest.target ? 'completed' : quest.status, completedAt: quest.progress + 1 >= quest.target ? new Date().toISOString() : undefined })}><Check size={14} /></button><button title="暂停" onClick={() => onUpdate(quest, { status: quest.status === 'paused' ? 'active' : 'paused' })}><CirclePause size={14} /></button></>}<button title="删除" onClick={() => onDelete(quest.id)}><Trash2 size={14} /></button></div></div>{quest.status === 'completed' && <span className="quest-complete"><Trophy size={14} /> QUEST COMPLETE</span>}</article> }
function QuestForm({ value, setValue }: { value: Quest; setValue: React.Dispatch<React.SetStateAction<Quest>> }) { const set = <K extends keyof Quest>(key: K, next: Quest[K]) => setValue((item) => ({ ...item, [key]: next })); return <div className="fp-form-grid"><label className="fp-field fp-field--wide"><span>任务名 *</span><input autoFocus required className="fp-input" value={value.title} onChange={(e) => set('title', e.target.value)} /></label><label className="fp-field"><span>类型</span><select className="fp-select" value={value.type} onChange={(e) => set('type', e.target.value as Quest['type'])}>{types.map((item) => <option key={item}>{item}</option>)}</select></label><label className="fp-field"><span>稀有度</span><select className="fp-select" value={value.rarity} onChange={(e) => set('rarity', e.target.value as Rarity)}>{rarities.map((item) => <option key={item}>{item}</option>)}</select></label><label className="fp-field"><span>目标进度</span><input className="fp-input" type="number" min="1" value={value.target} onChange={(e) => set('target', Number(e.target.value))} /></label><label className="fp-field"><span>奖励 XP</span><input className="fp-input" type="number" min="0" value={value.xp} onChange={(e) => set('xp', Number(e.target.value))} /></label><label className="fp-field"><span>截止日期</span><input className="fp-input" type="date" value={value.dueAt || ''} onChange={(e) => set('dueAt', e.target.value || undefined)} /></label><label className="fp-field"><span>标签</span><input className="fp-input" value={value.tags.join(' ')} onChange={(e) => set('tags', splitTags(e.target.value))} /></label><label className="fp-field fp-field--wide"><span>任务说明</span><textarea className="fp-textarea" value={value.description} onChange={(e) => set('description', e.target.value)} /></label></div> }
