import { Check, Clock3, Dices, LockKeyhole, Mail, Plus, Send, Trash2, UnlockKeyhole } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import type { MemoryCapsule } from '../../types'
import { weightedRandom } from '../../utils/random'
import { Empty, formatDay, isoDay, PageIntro, Panel, readRecent, runAction, secureRandom, Tabs, uid, useLocalList, useNowQuery, writeRecent } from './shared'
import type { FeaturePageProps } from './types'

type MemoryView = 'capsules' | 'today' | 'shuffle'
type MemoryPick = { id: string; type: '存档' | '事件'; date: string; title: string; content: string; tags: string[] }

const addDays = (days: number) => { const date = new Date(); date.setDate(date.getDate() + days); return isoDay(date) }
const freshCapsule = (): MemoryCapsule => ({ id: uid('capsule'), title: '', content: '', createdAt: new Date().toISOString(), openAt: `${addDays(30)}T08:00`, opened: false })

export function MemoryPage({ capsules: source, saves = [], events = [], actions }: FeaturePageProps) {
  const [capsules, setCapsules] = useLocalList(source)
  const query = useNowQuery()
  const [view, setView] = useState<MemoryView>(query.has('shuffle') ? 'shuffle' : 'capsules')
  const [editor, setEditor] = useState(query.has('new'))
  const [draft, setDraft] = useState(freshCapsule)
  const [now] = useState(() => Date.now())
  const [openedId, setOpenedId] = useState<string | null>(null)
  const [random, setRandom] = useState<MemoryPick | null>(null)
  const dueCount = capsules.filter((item) => new Date(item.openAt).getTime() <= now).length
  const today = isoDay().slice(5)
  const currentYear = Number(isoDay().slice(0, 4))
  const onThisDay = useMemo<MemoryPick[]>(() => [
    ...saves.filter((item) => item.date.slice(5) === today && Number(item.date.slice(0, 4)) < currentYear).map((item) => ({ id: item.id, type: '存档' as const, date: item.date, title: item.story.slice(0, 50) || `${item.date} 的存档`, content: [item.mood, item.status, item.quote].filter(Boolean).join(' · '), tags: item.keywords })),
    ...events.filter((item) => item.date.slice(5) === today && Number(item.date.slice(0, 4)) < currentYear).map((item) => ({ id: item.id, type: '事件' as const, date: item.date, title: item.title, content: item.description, tags: item.tags })),
  ].sort((a, b) => b.date.localeCompare(a.date)), [saves, events, today, currentYear])
  const memoryPool = useMemo<MemoryPick[]>(() => [
    ...saves.map((item) => ({ id: `save:${item.id}`, type: '存档' as const, date: item.date, title: item.story.slice(0, 55) || `${item.date} 的存档`, content: [item.mood, item.status, item.quote].filter(Boolean).join(' · '), tags: item.keywords })),
    ...events.map((item) => ({ id: `event:${item.id}`, type: '事件' as const, date: item.date, title: item.title, content: item.description, tags: item.tags })),
  ], [saves, events])
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!draft.title.trim() || !draft.content.trim() || new Date(draft.openAt).getTime() <= Date.now()) return
    const value = { ...draft, title: draft.title.trim(), content: draft.content.trim(), openAt: new Date(draft.openAt).toISOString() }
    await runAction(actions, 'create', 'capsule', value)
    setCapsules((items) => [...items, value].sort((a, b) => a.openAt.localeCompare(b.openAt)))
    setDraft(freshCapsule()); setEditor(false)
  }
  const openCapsule = async (capsule: MemoryCapsule) => {
    if (new Date(capsule.openAt).getTime() > Date.now()) return
    const value = { ...capsule, opened: true }
    if (!capsule.opened) { await runAction(actions, 'update', 'capsule', value); setCapsules((items) => items.map((item) => item.id === value.id ? value : item)) }
    setOpenedId(capsule.id)
  }
  const remove = async (id: string) => {
    if (!window.confirm('确定删除这枚记忆胶囊吗？删除后无法恢复。')) return
    await actions?.delete?.('capsule', id); setCapsules((items) => items.filter((item) => item.id !== id)); setOpenedId(null)
  }
  const shuffle = () => {
    if (!memoryPool.length) return
    const key = 'life-save:recent:memories'
    const recent = readRecent(key)
    const pick = weightedRandom(memoryPool.map((item) => ({ ...item, baseWeight: 1 })), { recentIds: recent, recentLimit: 20, random: secureRandom })
    if (!pick) return
    writeRecent(key, [...recent, pick.id])
    setRandom(pick)
  }

  return <main className="feature-page memory-page"><PageIntro code="MEMORY LAB / TIME POST OFFICE" title="记忆实验室" description="给未来留一封信，也让过去偶尔重新浮出水面。胶囊到期前不会展示正文。" actions={<button className="fp-button fp-button--primary" onClick={() => setEditor(true)}><Plus size={15} />写给未来</button>} />
    <Tabs value={view} onChange={setView} options={[{ value: 'capsules', label: '记忆胶囊', count: capsules.length }, { value: 'today', label: '往年今日', count: onThisDay.length }, { value: 'shuffle', label: '随机回忆', count: memoryPool.length }]} />
    {view === 'capsules' ? <CapsuleShelf capsules={capsules} dueCount={dueCount} openedId={openedId} now={now} onOpen={openCapsule} onDelete={remove} onCreate={() => setEditor(true)} /> : view === 'today' ? <OnThisDay items={onThisDay} /> : <MemoryShuffle item={random} hasMemories={memoryPool.length > 0} onShuffle={shuffle} />}
    {editor && <div className="fp-popover" onMouseDown={(e) => e.target === e.currentTarget && setEditor(false)}><form className="fp-dialog" onSubmit={submit}><div className="fp-dialog__head"><div><span className="fp-kicker">NEW MEMORY CAPSULE</span><h2>写给未来的自己</h2><p>内容会保存在本地，到达设定时间后才可开启。</p></div><button type="button" className="fp-button fp-button--ghost" onClick={() => setEditor(false)}>取消</button></div><div className="fp-form-grid"><label className="fp-field fp-field--wide"><span>信件标题 *</span><input autoFocus required className="fp-input" value={draft.title} onChange={(e) => setDraft((item) => ({ ...item, title: e.target.value }))} placeholder="例如：给三个月后的我" /></label><label className="fp-field fp-field--wide"><span>正文 *</span><textarea required className="fp-textarea memory-letter" value={draft.content} onChange={(e) => setDraft((item) => ({ ...item, content: e.target.value }))} placeholder="此刻你想对未来的自己说什么？" /></label><label className="fp-field fp-field--wide"><span>开启日期</span><div className="fp-chip-list memory-presets">{[[30, '30 天后'], [100, '100 天后'], [365, '一年后']].map(([days, label]) => <button type="button" className="fp-chip" key={days} onClick={() => setDraft((item) => ({ ...item, openAt: `${addDays(Number(days))}T08:00` }))}>{label}</button>)}</div><input required className="fp-input" type="datetime-local" min={`${addDays(1)}T00:00`} value={draft.openAt.slice(0, 16)} onChange={(e) => setDraft((item) => ({ ...item, openAt: e.target.value }))} /></label></div><div className="fp-divider" /><button className="fp-button fp-button--primary" disabled={!draft.title.trim() || !draft.content.trim() || new Date(draft.openAt).getTime() <= Date.now()}><Send size={15} />封存这封信</button></form></div>}
  </main>
}

function CapsuleShelf({ capsules, dueCount, openedId, now, onOpen, onDelete, onCreate }: { capsules: MemoryCapsule[]; dueCount: number; openedId: string | null; now: number; onOpen: (value: MemoryCapsule) => void; onDelete: (id: string) => void; onCreate: () => void }) {
  if (!capsules.length) return <Panel><Empty title="时间邮局还没有信件" description="写一封给未来的信，设定开启日期，然后把答案留给时间。" action="写第一封信" onAction={onCreate} /></Panel>
  return <><div className="memory-summary"><Panel><span><Mail /></span><div><b>{capsules.length}</b><small>已寄出的信</small></div></Panel><Panel><span><UnlockKeyhole /></span><div><b>{dueCount}</b><small>可以开启</small></div></Panel><Panel><span><Clock3 /></span><div><b>{capsules.length - dueCount}</b><small>仍在旅行</small></div></Panel></div><div className="capsule-grid">{[...capsules].sort((a, b) => a.openAt.localeCompare(b.openAt)).map((capsule) => { const due = new Date(capsule.openAt).getTime() <= now; const open = openedId === capsule.id; const days = Math.max(0, Math.ceil((new Date(capsule.openAt).getTime() - now) / 86400000)); return <Panel key={capsule.id} accent={due} className={`capsule-card ${due ? 'due' : ''}`}><div className="capsule-seal">{due ? <UnlockKeyhole /> : <LockKeyhole />}</div><span className="fp-kicker">{due ? 'DELIVERED' : `IN TRANSIT / ${days} DAYS`}</span><h3>{capsule.title}</h3><p>{open ? capsule.content : due ? '这封信已经抵达。开启后可阅读正文。' : `正文已封存，将在 ${formatDay(capsule.openAt)} 解锁。`}</p><div className="capsule-meta"><small>写于 {formatDay(capsule.createdAt)}</small><small>开启 {formatDay(capsule.openAt)}</small></div><div className="fp-actions">{due && <button className="fp-button fp-button--primary" onClick={() => onOpen(capsule)}>{open ? <Check size={15} /> : <Mail size={15} />}{open ? '已开启' : '开启信件'}</button>}<button className="fp-icon-button fp-button--danger" aria-label="删除胶囊" onClick={() => onDelete(capsule.id)}><Trash2 size={15} /></button></div></Panel>})}</div></>
}

function OnThisDay({ items }: { items: MemoryPick[] }) { return <Panel title="ON THIS DAY">{items.length ? <div className="memory-timeline">{items.map((item) => <article key={`${item.type}-${item.id}`}><time>{item.date.slice(0, 4)}</time><i /><div><span className="fp-badge">{item.type}</span><h3>{item.title}</h3><p>{item.content || '没有补充描述'}</p><div className="fp-chip-list">{item.tags.map((tag) => <span className="fp-chip" key={tag}>#{tag}</span>)}</div></div></article>)}</div> : <Empty title="往年的今天没有记录" description="这不是遗忘，只是这一天暂时没有被存档。明年再回来，也许会多一条回声。" />}</Panel> }
function MemoryShuffle({ item, hasMemories, onShuffle }: { item: MemoryPick | null; hasMemories: boolean; onShuffle: () => void }) { return <Panel accent className="memory-shuffle"><Dices /><span className="fp-kicker">MEMORY SHUFFLE</span>{item ? <><small>{item.type} / {formatDay(item.date)}</small><h2>{item.title}</h2><p>{item.content || '这一帧没有文字说明。'}</p><div className="fp-chip-list">{item.tags.map((tag) => <span className="fp-chip active" key={tag}>#{tag}</span>)}</div></> : <><h2>{hasMemories ? '从过去随机抽取一帧' : '还没有可抽取的回忆'}</h2><p>{hasMemories ? '每次抽取只展示你真实记录过的内容。' : '先记录一些生活存档或事件，随机回忆才会开始工作。'}</p></>}<button className="fp-button fp-button--primary" disabled={!hasMemories} onClick={onShuffle}><Dices size={16} />{item ? '再抽一次' : '抽取回忆'}</button></Panel> }
