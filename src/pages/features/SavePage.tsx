import { Check, ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { LifeSave } from '../../types'
import { Empty, isoDay, PageIntro, Panel, runAction, splitTags, uid, useLocalList, useNowQuery } from './shared'
import type { FeaturePageProps } from './types'

const weatherChoices = ['晴', '多云', '雨', '雷雨', '雪', '雾', '风']
const moods = ['平静', '开心', '兴奋', '满足', '期待', '放松', '疲惫', '焦虑', '迷茫', '孤独', '亢奋', '摆烂']

function freshSave(): LifeSave {
  const now = new Date().toISOString()
  return { id: uid('save'), date: isoDay(), createdAt: now, updatedAt: now, weather: '晴', mood: '平静', status: '', keywords: [], story: '', peopleIds: [], placeIds: [], decisionIds: [], questIds: [], timeSink: '', photos: [], bgm: '', quote: '', satisfaction: 60, fatigue: 40, socialEnergy: 50, luck: 50, saveWorth: 70, quick: false }
}

export function SavePage({ saves: source, people = [], places = [], decisions = [], quests = [], actions }: FeaturePageProps) {
  const [saves, setSaves] = useLocalList(source)
  const query = useNowQuery()
  const selectedFromQuery = query.get('id')
  const [draft, setDraft] = useState<LifeSave>(() => source?.find((item) => item.id === selectedFromQuery) ?? freshSave())
  const [keywordText, setKeywordText] = useState(draft.keywords.join(' '))
  const [saved, setSaved] = useState(false)
  const [showHistory, setShowHistory] = useState(!query.has('new'))
  const sortedSaves = useMemo(() => [...saves].sort((a, b) => b.date.localeCompare(a.date)), [saves])

  useEffect(() => { setKeywordText(draft.keywords.join(' ')); setSaved(false) }, [draft.id, draft.keywords])
  const patch = <K extends keyof LifeSave>(key: K, value: LifeSave[K]) => setDraft((current) => ({ ...current, [key]: value, updatedAt: new Date().toISOString() }))
  const toggleId = (key: 'peopleIds' | 'placeIds' | 'decisionIds' | 'questIds', id: string) => patch(key, draft[key].includes(id) ? draft[key].filter((item) => item !== id) : [...draft[key], id])
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const value = { ...draft, keywords: splitTags(keywordText), updatedAt: new Date().toISOString() }
    await actions?.save?.(value)
    if (!actions?.save) await runAction(actions, saves.some((item) => item.id === value.id) ? 'update' : 'create', 'save', value)
    setSaves((current) => [value, ...current.filter((item) => item.id !== value.id)])
    setDraft(value); setSaved(true)
  }
  const remove = async () => {
    if (!saves.some((item) => item.id === draft.id)) return
    await actions?.delete?.('save', draft.id)
    setSaves((current) => current.filter((item) => item.id !== draft.id)); setDraft(freshSave()); setKeywordText('')
  }
  const load = (value: LifeSave) => { setDraft(value); setShowHistory(false); scrollTo({ top: 0, behavior: 'smooth' }) }

  return <main className="feature-page save-page">
    <PageIntro code="LIFE SAVE / WRITE MEMORY" title={saves.some((item) => item.id === draft.id) ? `编辑 ${draft.date} 存档` : '创建今日存档'} description="把今天的剧情、人和感受写入本地世界。字段可以逐步补全，先保存当下最重要的部分。" actions={<><button className="fp-button" onClick={() => setShowHistory((value) => !value)}>历史存档 · {saves.length}</button><button className="fp-button fp-button--primary" form="life-save-form" type="submit"><Save size={16} />{saved ? '已保存' : '保存存档'}</button></>} />
    {showHistory && <Panel title="SAVE SLOTS" meta={<button className="fp-button" onClick={() => { setDraft(freshSave()); setShowHistory(false) }}><Plus size={15} />新存档</button>}>
      {sortedSaves.length ? <div className="fp-list">{sortedSaves.map((item) => <button className="fp-list-row" key={item.id} onClick={() => load(item)}><span className="fp-avatar" style={{ '--avatar': item.mood === '开心' ? '#65d8ff' : '#8b7cff' } as React.CSSProperties}>{item.date.slice(-2)}</span><span className="fp-list-row__main"><b>{item.quote || item.story.slice(0, 32) || '未命名的一天'}</b><span>{item.date} · {item.mood || '未选择心情'} · 保存价值 {item.saveWorth}</span></span><span className="fp-badge">LOAD</span></button>)}</div> : <Empty title="还没有人生存档" description="今天会成为时间线上的第一个亮点。" action="创建第一条存档" onAction={() => setShowHistory(false)} />}
    </Panel>}
    <form id="life-save-form" onSubmit={submit} className="fp-split">
      <div className="fp-grid">
        <Panel accent title="TODAY / CORE RECORD">
          <div className="fp-form-grid">
            <label className="fp-field"><span>日期</span><input className="fp-input" type="date" value={draft.date} onChange={(e) => patch('date', e.target.value)} required /></label>
            <label className="fp-field"><span>今日状态</span><input className="fp-input" value={draft.status} onChange={(e) => patch('status', e.target.value)} placeholder="在加载、全速推进、缓慢恢复…" /></label>
            <label className="fp-field"><span>天气</span><select className="fp-select" value={draft.weather} onChange={(e) => patch('weather', e.target.value)}>{weatherChoices.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="fp-field"><span>今天最花时间的事</span><input className="fp-input" value={draft.timeSink} onChange={(e) => patch('timeSink', e.target.value)} placeholder="工作、通勤、游戏…" /></label>
            <label className="fp-field fp-field--wide"><span>今日关键词 <small>用空格或逗号分隔</small></span><input className="fp-input" value={keywordText} onChange={(e) => setKeywordText(e.target.value)} placeholder="夏天 夜晚 朋友 新发现" /></label>
            <label className="fp-field fp-field--wide"><span>今天发生的事情</span><textarea className="fp-textarea" rows={10} value={draft.story} onChange={(e) => patch('story', e.target.value)} placeholder="不用写得完整。先记录你不想让未来的自己忘记的画面……" required /></label>
            <label className="fp-field"><span>今日 BGM</span><input className="fp-input" value={draft.bgm} onChange={(e) => patch('bgm', e.target.value)} placeholder="歌名 / 艺术家" /></label>
            <label className="fp-field"><span>今日一句话</span><input className="fp-input" value={draft.quote} onChange={(e) => patch('quote', e.target.value)} placeholder="留给今天的字幕" /></label>
          </div>
          <div className="fp-divider" />
          <span className="fp-muted" style={{ fontSize: '.72rem' }}>今日心情</span><div className="fp-chip-list" style={{ marginTop: 9 }}>{moods.map((mood) => <button type="button" className={`fp-chip ${draft.mood === mood ? 'active' : ''}`} key={mood} onClick={() => patch('mood', mood)}>{draft.mood === mood && <Check size={11} />} {mood}</button>)}</div>
        </Panel>
        <Panel title="ATTACHMENTS" meta={<span className="fp-badge">LOCAL ONLY</span>}>
          <label className="save-upload"><ImagePlus size={22} /><b>添加今日照片</b><span>图片将在数据层中压缩并保存至 IndexedDB</span><input type="file" accept="image/*" multiple onChange={() => actions?.notify?.('照片已选择', '接入图片存储后将自动压缩写入。')} /></label>
        </Panel>
      </div>
      <aside className="fp-grid">
        <Panel title="TODAY METRICS">{([
          ['satisfaction', '满意度'], ['fatigue', '疲劳度'], ['socialEnergy', '社交能量'], ['luck', '幸运度'], ['saveWorth', '值得保存程度'],
        ] as const).map(([key, label]) => <label className="fp-field save-slider" key={key}><span>{label}</span><div className="fp-range"><input type="range" min="0" max="100" value={draft[key]} onChange={(e) => patch(key, Number(e.target.value))} /><output>{draft[key]}</output></div></label>)}</Panel>
        <LinkPanel title="今天见到的人" items={people.map((item) => ({ id: item.id, label: item.name, sub: item.relationLevel }))} selected={draft.peopleIds} onToggle={(id) => toggleId('peopleIds', id)} empty="人物图鉴还是空的" />
        <LinkPanel title="今天去过的地方" items={places.map((item) => ({ id: item.id, label: item.name, sub: item.city }))} selected={draft.placeIds} onToggle={(id) => toggleId('placeIds', id)} empty="世界地图还没有地点" />
        <LinkPanel title="关联决定 / 任务" items={[...decisions.map((item) => ({ id: item.id, label: item.question, sub: 'DECISION' })), ...quests.map((item) => ({ id: item.id, label: item.title, sub: 'QUEST' }))]} selected={[...draft.decisionIds, ...draft.questIds]} onToggle={(id) => decisions.some((item) => item.id === id) ? toggleId('decisionIds', id) : toggleId('questIds', id)} empty="还没有决定或任务" />
        <div className="fp-actions"><button type="submit" className="fp-button fp-button--primary" style={{ flex: 1 }}><Save size={16} />写入人生存档</button><button type="button" className="fp-icon-button fp-button--danger" onClick={remove} disabled={!saves.some((item) => item.id === draft.id)} aria-label="删除存档"><Trash2 size={16} /></button></div>
      </aside>
    </form>
  </main>
}

function LinkPanel({ title, items, selected, onToggle, empty }: { title: string; items: { id: string; label: string; sub?: string }[]; selected: string[]; onToggle: (id: string) => void; empty: string }) {
  return <Panel title={title} meta={<span className="fp-badge">{selected.length} LINKED</span>}>{items.length ? <div className="fp-chip-list">{items.slice(0, 12).map((item) => <button type="button" key={item.id} title={item.sub} className={`fp-chip ${selected.includes(item.id) ? 'active' : ''}`} onClick={() => onToggle(item.id)}>{selected.includes(item.id) && <Check size={11} />} {item.label}</button>)}</div> : <p className="fp-muted" style={{ margin: 0, fontSize: '.8rem' }}>{empty}</p>}</Panel>
}
