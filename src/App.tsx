import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { AmbientBackground } from './components/AmbientBackground'
import { CommandPalette } from './components/CommandPalette'
import { AppShell } from './components/layout/AppShell'
import { QuickSaveModal } from './components/QuickSaveModal'
import { Toast, type ToastState } from './components/ui/Toast'
import { exportSaveFile, importSaveFile } from './db'
import { DashboardPage } from './pages/DashboardPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { useAppStore } from './store/appStore'
import type { FeatureActions, FeatureEntity, FeatureEntityKind } from './pages/features/types'
import type { AppSettings, Chapter, Decision, LifeEvent, LifeSave, MemoryCapsule, Person, Place, Profile, Quest } from './types'
import { calculateLifeExperience, calculateStreak } from './utils/experience'
import { downloadText } from './utils/download'
import { quickSaveTags, systemLines } from './content'
import { weightedRandom } from './utils/random'

const SavePage = lazy(() => import('./pages/features').then((module) => ({ default: module.SavePage })))
const PeoplePage = lazy(() => import('./pages/features').then((module) => ({ default: module.PeoplePage })))
const GalaxyPage = lazy(() => import('./pages/features').then((module) => ({ default: module.GalaxyPage })))
const TimelinePage = lazy(() => import('./pages/features').then((module) => ({ default: module.TimelinePage })))
const DecisionPage = lazy(() => import('./pages/features').then((module) => ({ default: module.DecisionPage })))
const DiscoverPage = lazy(() => import('./pages/features').then((module) => ({ default: module.DiscoverPage })))
const QuestPage = lazy(() => import('./pages/features').then((module) => ({ default: module.QuestPage })))
const WorldPage = lazy(() => import('./pages/features').then((module) => ({ default: module.WorldPage })))
const StatisticsPage = lazy(() => import('./pages/features').then((module) => ({ default: module.StatisticsPage })))
const YearReviewPage = lazy(() => import('./pages/features').then((module) => ({ default: module.YearReviewPage })))
const ArchivePage = lazy(() => import('./pages/features').then((module) => ({ default: module.ArchivePage })))
const SettingsPage = lazy(() => import('./pages/features').then((module) => ({ default: module.SettingsPage })))
const ProfilePage = lazy(() => import('./pages/features').then((module) => ({ default: module.ProfilePage })))
const MemoryPage = lazy(() => import('./pages/features').then((module) => ({ default: module.MemoryPage })))

const systemLineHistoryKey = 'life-save:recent:system-lines'

function pickSystemLine(): string {
  let recent: string[] = []
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(systemLineHistoryKey) || '[]')
    if (Array.isArray(stored)) recent = stored.filter((item): item is string => typeof item === 'string').slice(-20)
  } catch { recent = [] }
  const picked = weightedRandom(systemLines, { recentIds: recent, recentLimit: 20 }) ?? systemLines[0]
  if (!picked) return '世界仍在运行。'
  localStorage.setItem(systemLineHistoryKey, JSON.stringify([...recent, picked.id].slice(-20)))
  return picked.text
}

function LoadingScreen() {
  return <main className="boot-screen"><AmbientBackground /><div className="boot-seal"><i /><i /><span>LS</span></div><p>LOADING SAVE FILE…</p></main>
}

function StartupError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <main className="boot-screen"><AmbientBackground /><div className="boot-seal"><i /><i /><span>!</span></div><p>本地存档初始化失败</p><small>{message}</small><button className="button button--primary" onClick={onRetry}>重新载入</button></main>
}

function AppRoutes() {
  const store = useAppStore()
  const navigate = useNavigate()
  const [commandOpen, setCommandOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const toastTimer = useRef<number | null>(null)

  const initialize = store.initialize
  useEffect(() => { void initialize() }, [initialize])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCommandOpen((value) => !value) }
      if (event.key === 'F5') { event.preventDefault(); setQuickOpen(true) }
      if (event.key === 'Escape') { setCommandOpen(false); setQuickOpen(false) }
    }
    addEventListener('keydown', handler)
    return () => removeEventListener('keydown', handler)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = store.settings.theme
    document.documentElement.style.setProperty('--accent', store.settings.accent)
    const hex = store.settings.accent.replace('#', '')
    if (/^[0-9a-fA-F]{6}$/.test(hex)) document.documentElement.style.setProperty('--accent-rgb', `${parseInt(hex.slice(0,2),16)}, ${parseInt(hex.slice(2,4),16)}, ${parseInt(hex.slice(4,6),16)}`)
  }, [store.settings.theme, store.settings.accent])

  const notify = useCallback((title: string, message: string, kind: 'save' | 'achievement' = 'save') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), title, message, kind })
    toastTimer.current = window.setTimeout(() => setToast(null), 3800)
  }, [])

  const entityAction = async (method: 'create' | 'update', kind: FeatureEntityKind, entity: FeatureEntity) => {
    if (method === 'create' || method === 'update') {
      if (kind === 'person') await store.savePerson(entity as Person)
      else if (kind === 'event') await store.saveEvent(entity as LifeEvent)
      else if (kind === 'decision') await store.saveDecision(entity as Decision)
      else if (kind === 'quest') await store.saveQuest(entity as Quest)
      else if (kind === 'place') await store.savePlace(entity as Place)
      else if (kind === 'chapter') await store.saveChapter(entity as Chapter)
      else if (kind === 'capsule') await store.saveCapsule(entity as MemoryCapsule)
      else if (kind === 'save') await store.saveLifeSave(entity as LifeSave)
      else if (kind === 'profile') await store.updateProfile(entity as Profile)
      else if (kind === 'settings') await store.updateSettings(entity as AppSettings)
    }
  }

  const deleteEntity = async (kind: FeatureEntityKind, id: string) => {
    if (kind === 'person') await store.deletePerson(id)
    else if (kind === 'event') await store.deleteEvent(id)
    else if (kind === 'decision') await store.deleteDecision(id)
    else if (kind === 'quest') await store.deleteQuest(id)
    else if (kind === 'place') await store.deletePlace(id)
    else if (kind === 'chapter') await store.deleteChapter(id)
    else if (kind === 'capsule') await store.deleteCapsule(id)
    else if (kind === 'save') await store.deleteSave(id)
  }

  const actions: FeatureActions = {
    save: async (save) => { await store.saveLifeSave(save); notify('存档完成', '这一天已经写入 LIFE//SAVE。') },
    create: (kind, value) => entityAction('create', kind, value),
    update: (kind, value) => entityAction('update', kind, value),
    delete: deleteEntity,
    export: async () => { const text = await exportSaveFile(); downloadText(text, `life-save-${new Date().toISOString().slice(0,10)}.json`); return text },
    import: async (file, mode) => { const summary = await importSaveFile(await file.text(), mode); await store.refresh(); notify('存档导入完成', `${mode.toUpperCase()} · ${Object.values(summary.counts).reduce((sum, value) => sum + value, 0)} 条数据`); return { schemaVersion: summary.targetVersion, counts: summary.counts, message: '导入完成' } },
    reset: async () => { await store.clearAll(); notify('存档已清空', '本机 LIFE//SAVE 数据已经移除。') },
    demo: async () => { await store.resetWithDemo(); notify('Demo Mode 已载入', '一套完整示例人生已经写入本机。') },
    navigate,
    notify,
  }
  const pageProps = { profile: store.profile, saves: store.saves, people: store.people, events: store.events, chapters: store.chapters, decisions: store.decisions, quests: store.quests, places: store.places, achievements: store.achievements, capsules: store.capsules, settings: store.settings, actions }
  const experience = calculateLifeExperience({ saves: store.saves, people: store.people, events: store.events, quests: store.quests, places: store.places, decisions: store.decisions, capsules: store.capsules.length })
  const level = { level: experience.level, xp: experience.totalXp, current: experience.currentLevelXp, needed: experience.nextLevelXp, progress: Math.round(experience.progress * 100) }
  const [systemLine] = useState(pickSystemLine)

  if (store.error && !store.initialized && !store.loading) return <StartupError message={store.error} onRetry={() => { store.clearError(); void store.initialize() }} />
  if (!store.initialized || store.loading) return <LoadingScreen />
  if (!store.profile?.onboardingComplete) return <><OnboardingPage onComplete={async (profile: Profile) => { await store.updateProfile(profile); notify('SAVE FILE CREATED', '欢迎进入你的现实存档。', 'achievement') }} onDemo={async () => { await store.resetWithDemo(); notify('Demo Mode', '示例人生已经加载。') }} onImport={() => importRef.current?.click()} /><input ref={importRef} hidden type="file" accept="application/json" onChange={async (event) => { const file=event.target.files?.[0]; if(file){await importSaveFile(await file.text(),'replace'); await store.refresh()} }} /></>

  return <AppShell profile={store.profile} saving={store.saving} onCommand={() => setCommandOpen(true)}>
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<DashboardPage profile={store.profile} saves={store.saves} people={store.people} places={store.places} events={store.events} quests={store.quests} achievements={store.achievements} systemLine={systemLine} level={level} streak={calculateStreak(store.saves.map((save) => save.date))} onQuickSave={() => setQuickOpen(true)} />} />
        <Route path="/save" element={<SavePage {...pageProps} />} />
        <Route path="/people" element={<PeoplePage {...pageProps} />} />
        <Route path="/galaxy" element={<GalaxyPage {...pageProps} />} />
        <Route path="/timeline" element={<TimelinePage {...pageProps} />} />
        <Route path="/decision" element={<DecisionPage {...pageProps} />} />
        <Route path="/discover" element={<DiscoverPage {...pageProps} />} />
        <Route path="/quest" element={<QuestPage {...pageProps} />} />
        <Route path="/world" element={<WorldPage {...pageProps} />} />
        <Route path="/stats" element={<StatisticsPage {...pageProps} />} />
        <Route path="/review" element={<YearReviewPage {...pageProps} />} />
        <Route path="/archive" element={<ArchivePage {...pageProps} />} />
        <Route path="/settings" element={<SettingsPage {...pageProps} />} />
        <Route path="/profile" element={<ProfilePage {...pageProps} />} />
        <Route path="/memory" element={<MemoryPage {...pageProps} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    <QuickSaveModal open={quickOpen} onClose={() => setQuickOpen(false)} suggestions={quickSaveTags} onSave={async (text, tags) => { await store.quickSave(text, tags); notify('QUICK SAVE', '刚刚发生的事情已经保存。') }} />
    <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} onQuickSave={() => setQuickOpen(true)} people={store.people} places={store.places} events={store.events} />
    <Toast toast={toast} />
  </AppShell>
}

export default function App() { return <HashRouter><AppRoutes /></HashRouter> }
