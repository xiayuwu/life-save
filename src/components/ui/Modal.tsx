import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({ open, onClose, title, eyebrow, children, wide = false }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: ReactNode; wide?: boolean }) {
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <motion.section className={`modal-panel ${wide ? 'modal-panel--wide' : ''}`} initial={{ opacity: 0, scale: .97, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98, y: 12 }} transition={{ duration: .22 }} role="dialog" aria-modal="true" aria-label={title}>
      <header>{<div>{eyebrow && <span>{eyebrow}</span>}<h2>{title}</h2></div>}<button className="icon-button" onClick={onClose} aria-label="关闭"><X size={18} /></button></header>
      <div className="modal-panel__body">{children}</div>
    </motion.section>
  </motion.div>}</AnimatePresence>
}
