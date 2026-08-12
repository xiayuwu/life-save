import { Focus, Minus, Plus, RotateCcw, Users, X } from 'lucide-react'
import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent } from 'react'
import { daysBetween, Empty, Meter, PageIntro, Panel, Stat } from './shared'
import type { FeaturePageProps } from './types'

type Point = { id: string; x: number; y: number }
const hash = (text: string) => [...text].reduce((sum, char) => ((sum << 5) - sum + char.charCodeAt(0)) | 0, 0)

export function GalaxyPage({ people = [], events = [], actions }: FeaturePageProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [custom, setCustom] = useState<Record<string, Point>>({})
  const drag = useRef<{ kind: 'stage' | 'node'; id?: string; startX: number; startY: number; ox: number; oy: number } | null>(null)
  const moved = useRef(false)
  const nodes = useMemo(() => people.map((person, index) => {
    const seed = Math.abs(hash(person.id))
    const angle = (seed % 360) / 57.2958 + index * .31
    const distance = 92 + (100 - person.intimacy) * 2.25
    const placed = custom[person.id]
    return { person, x: placed?.x ?? 500 + Math.cos(angle) * distance, y: placed?.y ?? 360 + Math.sin(angle) * distance, size: 34 + person.importance * .42 }
  }), [people, custom])
  const selected = people.find((person) => person.id === selectedId)
  const zoom = (delta: number) => setScale((value) => Math.max(.45, Math.min(2.4, value + delta)))
  const onWheel = (event: WheelEvent) => { event.preventDefault(); zoom(event.deltaY > 0 ? -.1 : .1) }
  const startStage = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('.galaxy-node')) return
    drag.current = { kind: 'stage', startX: event.clientX, startY: event.clientY, ox: offset.x, oy: offset.y }; moved.current = false; event.currentTarget.setPointerCapture(event.pointerId)
  }
  const startNode = (event: ReactPointerEvent<HTMLButtonElement>, id: string, x: number, y: number) => {
    event.stopPropagation(); drag.current = { kind: 'node', id, startX: event.clientX, startY: event.clientY, ox: x, oy: y }; moved.current = false; event.currentTarget.setPointerCapture(event.pointerId)
  }
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const dx = (event.clientX - drag.current.startX) / (drag.current.kind === 'node' ? scale : 1)
    const dy = (event.clientY - drag.current.startY) / (drag.current.kind === 'node' ? scale : 1)
    if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true
    if (drag.current.kind === 'stage') setOffset({ x: drag.current.ox + dx, y: drag.current.oy + dy })
    else if (drag.current.id) setCustom((value) => ({ ...value, [drag.current!.id!]: { id: drag.current!.id!, x: drag.current!.ox + dx, y: drag.current!.oy + dy } }))
  }
  const end = () => { drag.current = null }
  const center = () => { setScale(1); setOffset({ x: 0, y: 0 }) }
  const related = selected ? events.filter((event) => event.peopleIds.includes(selected.id)) : []

  return <main className="feature-page galaxy-page">
    <PageIntro code="RELATIONSHIP GALAXY / INTERACTIVE MAP" title="关系星图" description="你在中心。关系越亲近，轨道越近；人物越重要，星体越大。拖动画布、拖动人物或滚轮缩放。" actions={<div className="galaxy-controls"><button className="fp-icon-button" onClick={() => zoom(-.15)} aria-label="缩小"><Minus size={15} /></button><span>{Math.round(scale * 100)}%</span><button className="fp-icon-button" onClick={() => zoom(.15)} aria-label="放大"><Plus size={15} /></button><button className="fp-button" onClick={center}><Focus size={15} />回到中心</button><button className="fp-icon-button" onClick={() => setCustom({})} aria-label="重置节点"><RotateCcw size={15} /></button></div>} />
    {!people.length ? <Panel><Empty title="星系尚未形成" description="添加人物后，他们会依据亲密度和重要度出现在你的关系轨道中。" action="前往添加人物" onAction={() => actions?.navigate?.('/people?new=1')} /></Panel> : <section className="galaxy-shell">
      <div className="galaxy-stage" onWheel={onWheel} onPointerDown={startStage} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <div className="galaxy-world" style={{ transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})` }}>
          <svg className="galaxy-lines" viewBox="0 0 1000 720" aria-hidden="true"><circle cx="500" cy="360" r="125" /><circle cx="500" cy="360" r="235" /><circle cx="500" cy="360" r="345" />{nodes.map((node) => <line key={node.person.id} x1="500" y1="360" x2={node.x} y2={node.y} style={{ opacity: .08 + node.person.intimacy / 600 }} />)}</svg>
          <div className="galaxy-me"><span>{'ME'}</span><small>PLAYER</small></div>
          {nodes.map(({ person, x, y, size }) => <button key={person.id} className={`galaxy-node ${selectedId === person.id ? 'active' : ''}`} style={{ left: x, top: y, width: size, height: size, '--node': person.color } as React.CSSProperties} onPointerDown={(event) => startNode(event, person.id, x, y)} onClick={() => { if (!moved.current) setSelectedId(person.id) }}><span>{person.avatar ? <img src={person.avatar} alt="" /> : person.name.slice(0, 1)}</span><b>{person.name}</b><small>{person.relationType}</small></button>)}
        </div>
        <div className="galaxy-legend"><span><i /> 近轨 · 高亲密</span><span><i /> 星体大小 · 重要度</span><span><i /> 连线亮度 · BOND</span></div>
      </div>
      {selected && <aside className="galaxy-inspector fp-panel"><button className="fp-icon-button galaxy-inspector__close" onClick={() => setSelectedId(null)}><X size={15} /></button><span className="fp-avatar galaxy-inspector__avatar" style={{ '--avatar': selected.color } as React.CSSProperties}>{selected.avatar ? <img src={selected.avatar} alt="" /> : selected.name.slice(0, 1)}</span><span className="fp-kicker">CHARACTER SIGNAL</span><h2>{selected.name}</h2><p>{selected.nickname || `${selected.relationType} · ${selected.relationLevel}`}</p><Meter value={selected.intimacy} label="BOND" color={selected.color} /><div className="fp-grid fp-grid--2"><Stat label="相识" value={`${daysBetween(selected.metAt)} 天`} /><Stat label="共同剧情" value={related.length} /></div><div className="fp-divider" /><p className="fp-note">{selected.notes || `当前关系状态：${selected.status}。你们通常以“${selected.contactFrequency}”的频率保持联系。`}</p><button className="fp-button fp-button--primary" onClick={() => actions?.navigate?.(`/people?id=${selected.id}`)}><Users size={15} />打开完整角色卡</button></aside>}
    </section>}
  </main>
}
