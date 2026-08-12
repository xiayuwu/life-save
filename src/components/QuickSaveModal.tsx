import { useMemo, useState } from 'react'
import { BookmarkPlus, Check, Tag } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Textarea } from './ui/Field'

const fallbackTags = ['突发事件', '值得记住', '朋友', '食物', '工作', '心情', '新发现', '游戏', '下雨', '决定', '夜晚', '小幸运']

export function QuickSaveModal({ open, onClose, onSave, suggestions = fallbackTags }: { open: boolean; onClose: () => void; onSave: (text: string, tags: string[]) => Promise<void> | void; suggestions?: string[] }) {
  const [text, setText] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const visible = useMemo(() => {
    const start = new Date().getDate() % Math.max(1, suggestions.length)
    return [...suggestions.slice(start), ...suggestions.slice(0, start)].slice(0, 12)
  }, [suggestions])
  const submit = async () => { if (!text.trim()) return; await onSave(text.trim(), tags); setText(''); setTags([]); onClose() }
  return <Modal open={open} onClose={onClose} title="刚刚发生了什么？" eyebrow="QUICK SAVE / F5">
    <div className="quick-save-form"><div className="quick-save-icon"><BookmarkPlus /></div><p>不需要写完整日记。先把这一刻存下来，以后随时补充。</p><Textarea autoFocus rows={5} value={text} onChange={(event) => setText(event.target.value)} placeholder="认识了一个有意思的人、吃到很好吃的东西、突然下雨……" /><div className="tag-cloud"><span><Tag size={13} /> 快速标签</span><div>{visible.map((tag) => <button key={tag} className={tags.includes(tag) ? 'active' : ''} onClick={() => setTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag])}>{tags.includes(tag) && <Check size={11} />}{tag}</button>)}</div></div><button className="button button--primary button--full" disabled={!text.trim()} onClick={submit}><BookmarkPlus size={16} /> QUICK SAVE</button></div>
  </Modal>
}
