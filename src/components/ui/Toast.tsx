import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Trophy } from 'lucide-react'

export type ToastState = { id: number; title: string; message: string; kind?: 'save' | 'achievement' } | null

export function Toast({ toast }: { toast: ToastState }) {
  return <AnimatePresence>{toast && <motion.div className={`toast toast--${toast.kind || 'save'}`} key={toast.id} initial={{ opacity: 0, x: 30, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 25 }}><span>{toast.kind === 'achievement' ? <Trophy /> : <CheckCircle2 />}</span><div><small>{toast.kind === 'achievement' ? 'ACHIEVEMENT UNLOCKED' : 'SYSTEM MESSAGE'}</small><b>{toast.title}</b><p>{toast.message}</p></div></motion.div>}</AnimatePresence>
}
