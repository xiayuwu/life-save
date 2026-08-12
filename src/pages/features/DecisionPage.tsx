import { Brain, Check, CircleDollarSign, Clock, Coins, Dices, Heart, History, Plus, RotateCw, Scale, Sparkles, Trash2, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Decision, DecisionMode, DecisionOption } from '../../types'
import { weightedRandom } from '../../utils/random'
import { Empty, formatDay, PageIntro, Panel, readRecent, runAction, secureRandom, Tabs, uid, useLocalList, useNowQuery, writeRecent } from './shared'
import type { FeaturePageProps } from './types'

const modes: { id: DecisionMode; name: string; english: string; description: string; icon: typeof Dices }[] = [
  { id: 'fate', name: '命运', english: 'FATE', description: '完全随机，让偶然替你打破僵局。', icon: Dices },
  { id: 'rational', name: '理性', english: 'RATIONAL', description: '综合因素分数，选择整体表现更高的方案。', icon: Scale },
  { id: 'feeling', name: '感性', english: 'FEELING', description: '听见当下的情绪、渴望与即时满足。', icon: Heart },
  { id: 'longterm', name: '长期主义', english: 'LONG TERM', description: '把未来价值、收益和可持续性放在前面。', icon: Clock },
  { id: 'yolo', name: 'YOLO', english: 'YOLO', description: '偏爱新鲜、刺激和一次性的体验。', icon: Zap },
  { id: 'easy', name: '摆烂', english: 'EASY', description: '优先低成本、低精力和最省事的选项。', icon: CircleDollarSign },
]
const factors = ['时间', '金钱', '心情', '体力', '风险', '收益', '长期价值', '即时快乐', '新鲜感', '难度']
const blankOption = (index: number): DecisionOption => ({ id: uid('option'), title: `选项 ${String.fromCharCode(65 + index)}`, note: '', scores: Object.fromEntries(factors.map((factor) => [factor, 50])) })
function freshDecision(): Decision { return { id: uid('decision'), question: '', category: '日常', options: [blankOption(0), blankOption(1)], factors: [...factors], mode: 'rational', createdAt: new Date().toISOString() } }

function scoreOption(option: DecisionOption, mode: DecisionMode) {
  const s = option.scores
  const weights: Record<DecisionMode, Record<string, number>> = {
    fate: {}, rational: { 时间: .8, 金钱: .8, 心情: 1, 体力: .8, 风险: -.5, 收益: 1.2, 长期价值: 1.1, 即时快乐: .5, 新鲜感: .35, 难度: -.35 }, feeling: { 心情: 1.8, 即时快乐: 1.6, 新鲜感: .8, 体力: .35, 风险: -.15 }, longterm: { 长期价值: 2, 收益: 1.3, 风险: -.7, 金钱: .5, 难度: -.2 }, yolo: { 新鲜感: 1.8, 即时快乐: 1.4, 心情: .8, 风险: .3, 长期价值: .1 }, easy: { 难度: -1.8, 体力: .9, 时间: .8, 金钱: .45, 风险: -.4 },
  }
  if (mode === 'fate') return secureRandom() * 100
  return Object.entries(weights[mode]).reduce((total, [key, weight]) => total + (s[key] ?? 50) * weight, 0)
}

export function DecisionPage({ decisions: source, actions }: FeaturePageProps) {
  const [decisions, setDecisions] = useLocalList(source)
  const query = useNowQuery()
  const [draft, setDraft] = useState(freshDecision)
  const [view, setView] = useState<'lab' | 'history'>('lab')
  const [phase, setPhase] = useState<'edit' | 'reaction' | 'reveal'>('edit')
  const [suggestion, setSuggestion] = useState<DecisionOption | null>(null)
  const [hopeId, setHopeId] = useState<string | undefined>()
  const [simulation, setSimulation] = useState<string[]>([])
  const [simChoice, setSimChoice] = useState<string | undefined>()
  const [spinning, setSpinning] = useState(false)
  useState(() => { if (query.has('random')) setDraft((value) => ({ ...value, mode: 'fate' })) })
  const mode = modes.find((item) => item.id === draft.mode)!
  const ranked = useMemo(() => [...draft.options].map((option) => ({ option, score: scoreOption(option, draft.mode) })).sort((a, b) => b.score - a.score), [draft.options, draft.mode])
  const setOption = (id: string, patch: Partial<DecisionOption>) => setDraft((value) => ({ ...value, options: value.options.map((option) => option.id === id ? { ...option, ...patch } : option) }))
  const updateScore = (id: string, factor: string, value: number) => { const option = draft.options.find((item) => item.id === id); if (option) setOption(id, { scores: { ...option.scores, [factor]: value } }) }
  const decide = () => {
    if (!draft.question.trim() || draft.options.filter((item) => item.title.trim()).length < 2) return
    if (draft.mode === 'fate') {
      setSpinning(true); setTimeout(() => {
        const key = 'life-save:recent:fate-options'
        const recent = readRecent(key)
        const pick = weightedRandom(draft.options.map((option) => ({ ...option, baseWeight: 1 })), { recentIds: recent, recentLimit: 20, random: secureRandom })
        if (pick) { writeRecent(key, [...recent, pick.id]); setSuggestion(pick) }
        setSpinning(false); setPhase('reaction')
      }, 850)
    } else { setSuggestion(ranked[0].option); setPhase('reveal') }
  }
  const revealFate = (id: string) => { setHopeId(id); setPhase('reveal') }
  const saveDecision = async (actualChoiceId?: string) => {
    if (!suggestion) return
    const value: Decision = { ...draft, suggestionId: suggestion.id, actualChoiceId, hopedChoiceId: hopeId, simulation, resolvedAt: new Date().toISOString() }
    await runAction(actions, 'create', 'decision', value); setDecisions((items) => [value, ...items]); actions?.notify?.('决定已归档', '未来可以回来记录满意度与是否后悔。')
  }
  const simulate = (choiceId: string) => {
    const choice = draft.options.find((item) => item.id === choiceId); if (!choice) return
    setSimChoice(choiceId); setSimulation([
      `2 小时后：你已经开始执行「${choice.title}」，最先感受到的是行动带来的确定感。`,
      `明天：结果未必完美，但你会更清楚自己真正看重的因素。`,
      `一周后：这次选择成为一条小支线，它的价值取决于你之后如何回应。`,
    ])
  }
  const reset = () => { setDraft(freshDecision()); setSuggestion(null); setHopeId(undefined); setSimulation([]); setSimChoice(undefined); setPhase('edit') }

  return <main className="feature-page decision-page">
    <PageIntro code="DECISION LAB / CHOICE ENGINE" title="人生决策实验室" description="把纠结拆成可以观察的选项。这里提供思考镜头，不伪装成能预测未来的 AI。" actions={<Tabs value={view} onChange={setView} options={[{ value: 'lab', label: '实验室' }, { value: 'history', label: '历史', count: decisions.length }]} />} />
    {view === 'history' ? <DecisionHistory decisions={decisions} /> : phase === 'edit' ? <>
      <Panel accent><label className="decision-question"><span>你现在在纠结什么？</span><textarea value={draft.question} onChange={(e) => setDraft((value) => ({ ...value, question: e.target.value }))} placeholder="例如：今晚玩游戏、看电影，还是早点睡？" rows={2} /></label><div className="fp-form-grid" style={{ marginTop: 13 }}><label className="fp-field"><span>分类</span><select className="fp-select" value={draft.category} onChange={(e) => setDraft((value) => ({ ...value, category: e.target.value }))}>{['日常', '娱乐', '社交', '消费', '工作', '学习', '出门', '饮食', '关系', '其他'].map((item) => <option key={item}>{item}</option>)}</select></label></div></Panel>
      <section><span className="fp-kicker">01 / SELECT THINKING MODE</span><div className="decision-modes">{modes.map(({ id, name, english, description, icon: Icon }) => <button className={draft.mode === id ? 'active' : ''} key={id} onClick={() => setDraft((value) => ({ ...value, mode: id }))}><Icon size={19} /><div><b>{name}</b><span>{english}</span><p>{description}</p></div></button>)}</div></section>
      <section><div className="fp-toolbar"><span className="fp-kicker">02 / BUILD OPTIONS</span><button className="fp-button" disabled={draft.options.length >= 6} onClick={() => setDraft((value) => ({ ...value, options: [...value.options, blankOption(value.options.length)] }))}><Plus size={15} />添加选项</button></div><div className="decision-options">{draft.options.map((option, index) => <Panel key={option.id} title={`OPTION ${String.fromCharCode(65 + index)}`} meta={draft.options.length > 2 && <button className="fp-icon-button" onClick={() => setDraft((value) => ({ ...value, options: value.options.filter((item) => item.id !== option.id) }))}><Trash2 size={14} /></button>}><input className="fp-input" value={option.title} onChange={(e) => setOption(option.id, { title: e.target.value })} placeholder="选项名称" /><textarea className="fp-textarea" rows={2} value={option.note} onChange={(e) => setOption(option.id, { note: e.target.value })} placeholder="补充条件或直觉…" />{draft.mode !== 'fate' && <div className="decision-score-grid">{factors.map((factor) => <label key={factor}><span>{factor}<b>{option.scores[factor]}</b></span><input type="range" min="0" max="100" value={option.scores[factor]} onChange={(e) => updateScore(option.id, factor, Number(e.target.value))} /></label>)}</div>}</Panel>)}</div></section>
      <Panel className="decision-launch"><div><span className="fp-kicker">MODE / {mode.english}</span><h2>{mode.name}模式准备完成</h2><p>{mode.description}</p></div><button className="fp-button fp-button--primary" disabled={spinning || !draft.question.trim() || draft.options.filter((item) => item.title.trim()).length < 2} onClick={decide}>{spinning ? <RotateCw className="spin" size={18} /> : draft.mode === 'fate' ? <Coins size={18} /> : <Brain size={18} />}{spinning ? '命运正在做决定…' : draft.mode === 'fate' ? '交给命运' : '运行决策模型'}</button></Panel>
    </> : phase === 'reaction' ? <FirstReaction options={draft.options} onChoose={revealFate} /> : suggestion && <DecisionReveal decision={draft} suggestion={suggestion} hoped={draft.options.find((item) => item.id === hopeId)} ranked={ranked} simulation={simulation} simChoice={simChoice} onSimulate={simulate} onSave={saveDecision} onReset={reset} />}
  </main>
}

function FirstReaction({ options, onChoose }: { options: DecisionOption[]; onChoose: (id: string) => void }) { return <Panel className="decision-reaction" accent><Coins size={45} /><span className="fp-kicker">THE COIN IS ALREADY IN THE AIR</span><h2>在结果显示前——</h2><p>你希望它是哪一个？不要分析，记录刚才浮现的第一反应。</p><div>{options.map((option) => <button key={option.id} onClick={() => onChoose(option.id)}>{option.title}</button>)}</div><small>这一选择不会改变硬币结果，它只帮你看见真实倾向。</small></Panel> }
function DecisionReveal({ decision, suggestion, hoped, ranked, simulation, simChoice, onSimulate, onSave, onReset }: { decision: Decision; suggestion: DecisionOption; hoped?: DecisionOption; ranked: { option: DecisionOption; score: number }[]; simulation: string[]; simChoice?: string; onSimulate: (id: string) => void; onSave: (id?: string) => void; onReset: () => void }) { const aligned = hoped?.id === suggestion.id; return <div className="decision-result"><Panel accent className="decision-result__hero"><Sparkles size={30} /><span className="fp-kicker">SYSTEM SUGGESTION</span><p>关于「{decision.question}」</p><h2>{suggestion.title}</h2>{hoped && <div className="fp-note">你第一反应希望是「{hoped.title}」。{aligned ? '这一次，直觉与结果站在同一边。' : '硬币给了另一面，但你的第一反应可能已经说出了答案。'}</div>}<div className="fp-actions"><button className="fp-button fp-button--primary" onClick={() => onSave(suggestion.id)}><Check size={15} />就选这个并归档</button><button className="fp-button" onClick={onReset}>重新开始</button></div></Panel>{decision.mode !== 'fate' && <Panel title="SCORING TRACE"><div className="decision-ranking">{ranked.map((item, index) => <div key={item.option.id}><span>{index + 1}</span><b>{item.option.title}</b><i><i style={{ width: `${Math.max(8, 100 - index * 22)}%` }} /></i><em>{Math.round(item.score)}</em></div>)}</div></Panel>}<Panel title="REGRET SIMULATOR" meta={<span className="fp-badge">情境模拟 · 非未来预测</span>}><p className="fp-muted">选一个方案，模拟不同时间尺度下你可能关注的感受。</p><div className="fp-chip-list">{decision.options.map((option) => <button key={option.id} className={`fp-chip ${simChoice === option.id ? 'active' : ''}`} onClick={() => onSimulate(option.id)}>{option.title}</button>)}</div>{simulation.length ? <div className="simulation-track">{simulation.map((line, index) => <article key={line}><span>{index + 1}</span><p>{line}</p></article>)}</div> : <Empty title="选择一条可能的支线" description="模拟的目的不是预测，而是让你提前观察自己会在意什么。" />}</Panel></div> }
function DecisionHistory({ decisions }: { decisions: Decision[] }) { const [selected, setSelected] = useState<string | null>(null); if (!decisions.length) return <Panel><Empty title="还没有决定被归档" description="完成一次实验，未来的你就可以回来校准满意度与后悔程度。" /></Panel>; return <Panel title="DECISION HISTORY"><div className="fp-list">{[...decisions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((item) => { const open = selected === item.id; const suggestion = item.options.find((option) => option.id === item.suggestionId); return <button key={item.id} className="fp-list-row decision-history-row" onClick={() => setSelected(open ? null : item.id)}><span className="fp-avatar"><History size={18} /></span><span className="fp-list-row__main"><b>{item.question}</b><span>{formatDay(item.createdAt)} · {modes.find((mode) => mode.id === item.mode)?.name}模式 · 建议 {suggestion?.title || '未完成'}</span>{open && <p>{item.simulation?.[0] || `共有 ${item.options.length} 个选项，分类为 ${item.category}。`}</p>}</span><span className="fp-badge">{item.resolvedAt ? 'RESOLVED' : 'OPEN'}</span></button>})}</div></Panel> }
