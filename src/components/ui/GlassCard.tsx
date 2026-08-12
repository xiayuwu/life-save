import type { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  interactive?: boolean
  accent?: boolean
}

export function GlassCard({ children, className = '', interactive, accent, ...props }: Props) {
  return <div className={`glass-card ${interactive ? 'glass-card--interactive' : ''} ${accent ? 'glass-card--accent' : ''} ${className}`} {...props}>{children}</div>
}
