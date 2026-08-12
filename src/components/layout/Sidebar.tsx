import { Command, PanelLeftClose } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { Profile } from '../../types'
import { Logo } from '../ui/Logo'
import { navigation, secondaryNavigation } from './navigation'

export function Sidebar({ profile, collapsed, onToggle, onCommand }: { profile?: Profile; collapsed: boolean; onToggle: () => void; onCommand: () => void }) {
  return <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
    <div className="sidebar__brand"><Logo compact={collapsed} /><button className="icon-button sidebar__collapse" onClick={onToggle} aria-label="收起侧边栏"><PanelLeftClose size={16} /></button></div>
    <nav className="sidebar__nav" aria-label="主导航">{navigation.map(({ path, label, icon: Icon }) => <NavLink key={path} to={path} end={path === '/'} title={label}><Icon size={18} /><span>{label}</span><i /></NavLink>)}</nav>
    <nav className="sidebar__nav sidebar__nav--secondary">{secondaryNavigation.map(({ path, label, icon: Icon }) => <NavLink key={path} to={path}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
    <button className="command-hint" onClick={onCommand}><Command size={15} /><span>Command Palette</span><kbd>Ctrl K</kbd></button>
    <div className="sidebar__player"><div className="avatar">{profile?.nickname?.slice(0, 1) || 'P'}</div><div><b>{profile?.nickname || 'PLAYER'}</b><span>{profile?.status || 'SAVE FILE ONLINE'}</span></div><i /></div>
  </aside>
}
