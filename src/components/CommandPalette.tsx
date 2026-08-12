import { AnimatePresence, motion } from 'framer-motion'
import { Archive, Compass, Map, Orbit, Plus, Save, Search, Settings, Sparkles, UserPlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LifeEvent, Person, Place } from '../types'

type CommandItem = { id: string; label: string; hint: string; icon: typeof Save; action: () => void; keywords: string }

export function CommandPalette({ open, onClose, onQuickSave, people = [], places = [], events = [] }: { open: boolean; onClose: () => void; onQuickSave: () => void; people?: Person[]; places?: Place[]; events?: LifeEvent[] }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  useEffect(() => { if (!open) setQuery('') }, [open])
  const go = (path: string) => { navigate(path); onClose() }
  const commands: CommandItem[] = [
    { id: 'quick', label: '快速记录', hint: '保存刚刚发生的事', icon: Save, keywords: 'quick save 快速 存档', action: () => { onQuickSave(); onClose() } },
    { id: 'save', label: '新建今日存档', hint: '打开完整 Life Save', icon: Plus, keywords: '日记 新建 今日', action: () => go('/save?new=1') },
    { id: 'person', label: '新增人物', hint: '打开 Character Archive', icon: UserPlus, keywords: '朋友 人物 新增', action: () => go('/people?new=1') },
    { id: 'decision', label: '创建一个决定', hint: '进入 Decision Lab', icon: Compass, keywords: '纠结 决定 随机', action: () => go('/decision?new=1') },
    { id: 'discover', label: '现在做点什么', hint: '打开 What Now? 推荐引擎', icon: Orbit, keywords: '活动 discover 无聊 推荐', action: () => go('/discover') },
    { id: 'quest', label: '领取随机任务', hint: '看看今天的支线', icon: Sparkles, keywords: '任务 quest 随机', action: () => go('/quest?random=1') },
    { id: 'world', label: '打开世界地图', hint: '查看地点图鉴', icon: Map, keywords: '地图 地点 世界', action: () => go('/world') },
    { id: 'archive', label: '搜索全部档案', hint: '进入 Archive', icon: Archive, keywords: '搜索 archive 历史', action: () => go('/archive') },
    { id: 'settings', label: '导入 / 导出存档', hint: '打开 Settings', icon: Settings, keywords: '设置 数据 备份', action: () => go('/settings') },
  ]
  const searchable = [
    ...commands,
    ...people.map((person) => ({ id: `person-${person.id}`, label: person.name, hint: `人物 · ${person.relationLevel}`, icon: UserPlus, keywords: `${person.nickname} ${person.interests.join(' ')}`, action: () => go(`/people?id=${person.id}`) } as CommandItem)),
    ...places.map((place) => ({ id: `place-${place.id}`, label: place.name, hint: `地点 · ${place.category}`, icon: Map, keywords: place.city, action: () => go(`/world?id=${place.id}`) } as CommandItem)),
    ...events.map((event) => ({ id: `event-${event.id}`, label: event.title, hint: `事件 · ${event.date}`, icon: Archive, keywords: event.tags.join(' '), action: () => go(`/timeline?id=${event.id}`) } as CommandItem)),
  ]
  const results = searchable.filter((item) => `${item.label} ${item.hint} ${item.keywords}`.toLowerCase().includes(query.toLowerCase())).slice(0, 12)
  return <AnimatePresence>{open && <motion.div className="command-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.section className="command-palette" initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}><header><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入指令，或搜索人物、地点、事件……" /><button onClick={onClose} aria-label="关闭"><X size={16} /></button></header><div className="command-results"><span className="command-results__label">{query ? `SEARCH RESULT · ${results.length}` : 'QUICK ACTIONS'}</span>{results.length ? results.map(({ id, label, hint, icon: Icon, action }, index) => <button key={id} onClick={action}><span><Icon size={16} /></span><div><b>{label}</b><small>{hint}</small></div><kbd>{index < 9 ? index + 1 : '↵'}</kbd></button>) : <div className="command-empty">没有找到匹配的存档。换个关键词试试。</div>}</div><footer><span><kbd>↑↓</kbd> 浏览</span><span><kbd>Enter</kbd> 打开</span><span><kbd>Esc</kbd> 关闭</span></footer></motion.section></motion.div>}</AnimatePresence>
}
