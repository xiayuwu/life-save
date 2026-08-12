import { Bell, Cloudy, Command, Menu, Search } from 'lucide-react'

export function Topbar({ saving, onCommand, onMenu }: { saving: boolean; onCommand: () => void; onMenu: () => void }) {
  const now = new Date()
  return <header className="topbar">
    <button className="icon-button topbar__menu" onClick={onMenu} aria-label="展开菜单"><Menu size={17} /></button>
    <div className="topbar__date"><span>{now.toLocaleDateString('zh-CN', { weekday: 'long' })}</span><b>{now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '.')}</b></div>
    <button className="topbar__search" onClick={onCommand}><Search size={15} /><span>搜索你的世界，或执行指令</span><kbd><Command size={11} /> K</kbd></button>
    <div className={`save-status ${saving ? 'save-status--saving' : ''}`}><i />{saving ? 'Saving…' : 'Saved'}</div>
    <div className="topbar__weather"><Cloudy size={16} /><span>LOCAL</span></div>
    <button className="icon-button" aria-label="通知"><Bell size={16} /><i className="notification-dot" /></button>
  </header>
}
