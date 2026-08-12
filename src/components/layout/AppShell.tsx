import { AnimatePresence, motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import type { Profile } from '../../types'
import { AmbientBackground } from '../AmbientBackground'
import { MobileDock } from './MobileDock'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell({ children, profile, saving, onCommand }: { children: ReactNode; profile?: Profile; saving: boolean; onCommand: () => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  return <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''} ${mobileOpen ? 'app-shell--menu-open' : ''}`}>
    <AmbientBackground />
    <div onClick={() => setMobileOpen(false)} className="mobile-scrim" />
    <Sidebar profile={profile} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onCommand={onCommand} />
    <div className="app-main"><Topbar saving={saving} onCommand={onCommand} onMenu={() => setMobileOpen((value) => !value)} /><AnimatePresence mode="wait"><motion.div className="route-content" key={location.hash} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .2 }}>{children}</motion.div></AnimatePresence></div>
    <MobileDock />
  </div>
}
