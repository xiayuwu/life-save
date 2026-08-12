import { Save } from 'lucide-react'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? 'logo--compact' : ''}`}>
      <span className="logo__mark"><Save size={compact ? 17 : 21} strokeWidth={1.5} /></span>
      <span className="logo__word">LIFE<i>//</i>SAVE</span>
      {!compact && <small>REALITY ARCHIVE SYSTEM</small>}
    </div>
  )
}
