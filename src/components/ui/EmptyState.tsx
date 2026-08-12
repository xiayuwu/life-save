import { Plus, Sparkles } from 'lucide-react'

export function EmptyState({ title, description, action, onAction }: { title: string; description: string; action?: string; onAction?: () => void }) {
  return (
    <div className="empty-state">
      <span><Sparkles size={28} strokeWidth={1.3} /></span>
      <h3>{title}</h3><p>{description}</p>
      {action && onAction && <button className="button button--secondary" onClick={onAction}><Plus size={15} /> {action}</button>}
    </div>
  )
}
