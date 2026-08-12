import { ArrowDown, ArrowUp, Check, Database, Download, Eye, EyeOff, FileJson, HardDrive, MonitorCog, Palette, RefreshCw, RotateCcw, ShieldCheck, Sparkles, Upload, Volume2, VolumeX } from 'lucide-react'
import { useRef, useState } from 'react'
import type { AppSettings, SaveFile, ThemeName } from '../../types'
import { formatDay, PageIntro, Panel, runAction } from './shared'
import type { FeaturePageProps, ImportResult } from './types'

const defaultSettings: AppSettings = { theme: 'midnight', accent: '#8294ff', sound: false, motion: true, dashboardOrder: ['overview', 'quick-save', 'quests', 'mood', 'people'], autoBackup: true }
const themes: { id: ThemeName; name: string; colors: string[] }[] = [
  { id: 'midnight', name: '深夜存档', colors: ['#080b1b', '#8294ff'] }, { id: 'starlight', name: '星光', colors: ['#14162d', '#d6d9ff'] }, { id: 'sakura', name: '樱花', colors: ['#261627', '#ff8db5'] }, { id: 'ocean', name: '深海', colors: ['#061c2c', '#43c9e8'] }, { id: 'cyber', name: '赛博', colors: ['#071d1c', '#4fffb0'] }, { id: 'black', name: '纯黑', colors: ['#000000', '#dedede'] },
]
const dashboardModules: Record<string, string> = { overview: '人生概览', 'quick-save': '快速存档', quests: '今日任务', mood: '心情趋势', people: '关系人物', timeline: '最近事件', decisions: '最近决定', statistics: '统计摘要' }

export function SettingsPage({ settings: source, actions }: FeaturePageProps) {
  const [settings, setSettings] = useState<AppSettings>(source ?? defaultSettings)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [mode, setMode] = useState<'merge' | 'replace'>('merge')
  const [importSummary, setImportSummary] = useState<ImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => { setSettings((item) => ({ ...item, [key]: value })); setSaved(false) }
  const save = async () => { setBusy('settings'); await runAction(actions, 'update', 'settings', settings); setSaved(true); setBusy(null) }
  const moveModule = (index: number, direction: -1 | 1) => { const next = index + direction; if (next < 0 || next >= settings.dashboardOrder.length) return; const order = [...settings.dashboardOrder]; [order[index], order[next]] = [order[next], order[index]]; set('dashboardOrder', order) }
  const toggleModule = (id: string) => set('dashboardOrder', settings.dashboardOrder.includes(id) ? settings.dashboardOrder.filter((item) => item !== id) : [...settings.dashboardOrder, id])
  const exportData = async () => {
    if (!actions?.export) return
    setBusy('export')
    try {
      const output = await actions.export()
      if (output !== undefined) {
        const blob = output instanceof Blob ? output : new Blob([typeof output === 'string' ? output : JSON.stringify(output satisfies SaveFile, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `life-save-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url)
      }
      actions.notify?.('存档已导出', 'JSON 备份已交给浏览器下载。')
    } finally { setBusy(null) }
  }
  const importData = async (file?: File) => {
    if (!file || !actions?.import) return
    if (mode === 'replace' && !window.confirm('覆盖导入会替换当前全部数据。已确认拥有可恢复备份并继续吗？')) { if (inputRef.current) inputRef.current.value = ''; return }
    setBusy('import')
    try { const result = await actions.import(file, mode); setImportSummary(result ?? { message: '导入完成' }); actions.notify?.('存档导入完成', mode === 'merge' ? '新数据已与本地存档合并。' : '本地数据已替换。') } finally { setBusy(null); if (inputRef.current) inputRef.current.value = '' }
  }
  const reset = async () => { if (!actions?.reset || !window.confirm('这会清空 LIFE//SAVE 的全部本地数据，且无法撤销。确定继续吗？')) return; setBusy('reset'); try { await actions.reset(); actions.notify?.('本地数据已清空', '你可以从新的世界线重新开始。') } finally { setBusy(null) } }
  const demo = async () => { if (!actions?.demo || !window.confirm('载入演示世界会替换当前数据。确定继续吗？')) return; setBusy('demo'); try { await actions.demo(); actions.notify?.('演示世界已载入', '可以开始探索完整功能。') } finally { setBusy(null) } }

  return <main className="feature-page settings-page" style={{ '--fp-accent': settings.accent } as React.CSSProperties}><PageIntro code="SYSTEM SETTINGS / LOCAL CONTROL" title="系统设置" description="外观、交互与数据控制都集中在这里。你的个人数据默认保存在当前浏览器本地。" actions={<button className="fp-button fp-button--primary" disabled={!actions?.update || busy === 'settings'} onClick={save}><Check size={15} />{busy === 'settings' ? '保存中…' : saved ? '已保存' : '保存设置'}</button>} />
    <div className="settings-layout"><div className="settings-main"><Panel title="APPEARANCE / THEME" meta={<Palette size={17} />}><div className="theme-grid">{themes.map((theme) => <button className={settings.theme === theme.id ? 'active' : ''} key={theme.id} onClick={() => set('theme', theme.id)}><span style={{ background: `linear-gradient(135deg,${theme.colors[0]},${theme.colors[1]})` }}><i /></span><b>{theme.name}</b><small>{theme.id.toUpperCase()}</small></button>)}</div><div className="fp-divider" /><label className="settings-accent"><span><b>系统强调色</b><small>用于按钮、图表与数据高亮</small></span><input type="color" value={settings.accent} onChange={(e) => set('accent', e.target.value)} /><code>{settings.accent}</code></label></Panel>
      <Panel title="INTERACTION" meta={<MonitorCog size={17} />}><div className="settings-switches"><SettingSwitch icon={settings.sound ? Volume2 : VolumeX} title="界面音效" description="为关键保存与解锁操作播放轻量提示音。" checked={settings.sound} onChange={(value) => set('sound', value)} /><SettingSwitch icon={settings.motion ? Eye : EyeOff} title="动态效果" description="启用页面过渡、星球运动与结果揭晓动画。" checked={settings.motion} onChange={(value) => set('motion', value)} /><SettingSwitch icon={HardDrive} title="自动本地备份" description="数据发生变化时，至多每天创建一次滚动备份。" checked={settings.autoBackup} onChange={(value) => set('autoBackup', value)} /></div></Panel>
      <Panel title="DASHBOARD MODULES" meta={<span className="fp-badge">拖动顺序的键盘友好版本</span>}><p className="fp-muted">选择首页显示的模块，并用上下按钮调整顺序。</p><div className="dashboard-order">{Object.entries(dashboardModules).map(([id, label]) => { const index = settings.dashboardOrder.indexOf(id); const active = index >= 0; return <article className={active ? 'active' : ''} key={id}><button className="settings-check" aria-label={`${active ? '隐藏' : '显示'}${label}`} onClick={() => toggleModule(id)}>{active && <Check />}</button><span><b>{label}</b><small>{id.toUpperCase()}</small></span>{active && <div><button aria-label={`${label}上移`} disabled={index === 0} onClick={() => moveModule(index, -1)}><ArrowUp /></button><button aria-label={`${label}下移`} disabled={index === settings.dashboardOrder.length - 1} onClick={() => moveModule(index, 1)}><ArrowDown /></button></div>}</article>})}</div></Panel></div>
      <aside className="settings-side"><Panel title="DATA VAULT" accent><div className="settings-vault"><span><Database /></span><h3>本地优先的数据保险库</h3><p>定期导出 JSON，可以跨浏览器恢复人物、事件、存档、图片与全部设置。</p><button className="fp-button fp-button--primary" disabled={!actions?.export || busy === 'export'} onClick={exportData}><Download size={15} />{busy === 'export' ? '正在整理…' : '导出完整存档'}</button><div className="fp-divider" /><label className="fp-field"><span>导入策略</span><select className="fp-select" value={mode} onChange={(e) => setMode(e.target.value as 'merge' | 'replace')}><option value="merge">合并到当前存档</option><option value="replace">覆盖当前存档</option></select></label><button className="fp-button" disabled={!actions?.import || busy === 'import'} onClick={() => inputRef.current?.click()}><Upload size={15} />{busy === 'import' ? '正在校验与导入…' : '选择 JSON 存档'}</button><input ref={inputRef} hidden type="file" accept="application/json,.json" onChange={(e) => importData(e.target.files?.[0])} />{importSummary && <div className="settings-result"><ShieldCheck /><div><b>{importSummary.message || '导入完成'}</b><span>{importSummary.schemaVersion ? `存档版本 v${importSummary.schemaVersion}` : '文件已通过校验'}</span>{importSummary.counts && <small>{Object.entries(importSummary.counts).map(([key, value]) => `${key} ${value}`).join(' · ')}</small>}</div></div>}</div></Panel>
      <Panel title="BACKUP STATUS"><div className="settings-backup"><RefreshCw /><div><b>{settings.autoBackup ? '自动备份已开启' : '自动备份已关闭'}</b><span>{settings.lastBackupAt ? `最近一次：${formatDay(settings.lastBackupAt)}` : '尚未产生备份记录'}</span></div></div></Panel>
      <Panel title="WORLD CONTROL"><div className="settings-danger"><button disabled={!actions?.demo || busy !== null} onClick={demo}><Sparkles /><span><b>载入演示世界</b><small>用完整示例数据替换当前世界</small></span></button><button disabled={!actions?.reset || busy !== null} onClick={reset}><RotateCcw /><span><b>清空全部数据</b><small>永久删除当前浏览器中的存档</small></span></button></div></Panel>
      <Panel title="PORTABILITY"><div className="settings-portability"><FileJson /><p>导出文件为可阅读的 JSON。导入前会由数据层检查格式与版本，覆盖操作还会再次要求确认。</p></div></Panel></aside></div>
  </main>
}

function SettingSwitch({ icon: Icon, title, description, checked, onChange }: { icon: typeof Volume2; title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label><span className="settings-switch-icon"><Icon /></span><span><b>{title}</b><small>{description}</small></span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><i /></label> }
