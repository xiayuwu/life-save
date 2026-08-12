import { create } from 'zustand'
import type {
  Achievement,
  AppSettings,
  Chapter,
  Decision,
  LifeEvent,
  LifeSave,
  MemoryCapsule,
  Person,
  Place,
  Profile,
  Quest,
  SettingRecord,
} from '../types'
import {
  clearAllData,
  db,
  initializeDatabase,
  runAutomaticBackup,
  seedDemoData,
} from '../db'
import { createId, nowIso, todayIso } from '../utils/id'

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'midnight',
  accent: '#8294ff',
  sound: false,
  motion: true,
  dashboardOrder: ['overview', 'quick-save', 'quests', 'mood', 'people'],
  autoBackup: true,
}

type NewLifeSave = Partial<LifeSave> & { id?: string }
type NewPerson = Partial<Person> & { id?: string; name?: string }
type NewLifeEvent = Partial<LifeEvent> & { id?: string; title?: string }
type NewDecision = Partial<Decision> & { id?: string; question?: string }
type NewQuest = Partial<Quest> & { id?: string; title?: string }
type NewPlace = Partial<Place> & { id?: string; name?: string }
type NewChapter = Partial<Chapter> & { id?: string; title?: string }
type NewCapsule = Partial<MemoryCapsule> & { id?: string; title?: string }

export interface AppStoreState {
  profile?: Profile
  saves: LifeSave[]
  people: Person[]
  events: LifeEvent[]
  chapters: Chapter[]
  decisions: Decision[]
  quests: Quest[]
  places: Place[]
  achievements: Achievement[]
  capsules: MemoryCapsule[]
  settings: AppSettings
  loading: boolean
  saving: boolean
  initialized: boolean
  revision: number
  error?: string
  initialize: () => Promise<void>
  refresh: () => Promise<void>
  saveLifeSave: (value: NewLifeSave) => Promise<LifeSave>
  deleteSave: (id: string) => Promise<void>
  savePerson: (value: NewPerson) => Promise<Person>
  deletePerson: (id: string) => Promise<void>
  saveEvent: (value: NewLifeEvent) => Promise<LifeEvent>
  deleteEvent: (id: string) => Promise<void>
  saveDecision: (value: NewDecision) => Promise<Decision>
  deleteDecision: (id: string) => Promise<void>
  saveQuest: (value: NewQuest) => Promise<Quest>
  deleteQuest: (id: string) => Promise<void>
  savePlace: (value: NewPlace) => Promise<Place>
  deletePlace: (id: string) => Promise<void>
  saveChapter: (value: NewChapter) => Promise<Chapter>
  deleteChapter: (id: string) => Promise<void>
  saveCapsule: (value: NewCapsule) => Promise<MemoryCapsule>
  deleteCapsule: (id: string) => Promise<void>
  updateProfile: (value: Partial<Profile>) => Promise<Profile>
  updateSettings: (value: Partial<AppSettings>) => Promise<AppSettings>
  quickSave: (text: string, tags?: string[]) => Promise<LifeSave>
  resetWithDemo: () => Promise<void>
  clearAll: () => Promise<void>
  clearError: () => void
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '发生未知错误'
}

function settingsFrom(records: readonly SettingRecord[]): AppSettings {
  const value = records.find((record) => record.id === 'app-settings')?.value
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return DEFAULT_SETTINGS
  return { ...DEFAULT_SETTINGS, ...(value as Partial<AppSettings>) }
}

function existingById<T extends { id: string }>(items: readonly T[], id: string | undefined): T | undefined {
  return id ? items.find((item) => item.id === id) : undefined
}

function lifeSaveFrom(value: NewLifeSave, existing?: LifeSave): LifeSave {
  const timestamp = nowIso()
  return {
    id: value.id ?? createId('save'),
    date: todayIso(),
    createdAt: timestamp,
    weather: '',
    mood: '平静',
    status: '正常运行',
    keywords: [],
    story: '',
    peopleIds: [],
    placeIds: [],
    decisionIds: [],
    questIds: [],
    timeSink: '',
    photos: [],
    bgm: '',
    quote: '',
    satisfaction: 50,
    fatigue: 50,
    socialEnergy: 50,
    luck: 50,
    saveWorth: 50,
    quick: false,
    ...existing,
    ...value,
    updatedAt: timestamp,
  }
}

function personFrom(value: NewPerson, existing?: Person): Person {
  const timestamp = nowIso()
  return {
    id: value.id ?? createId('person'),
    name: value.name?.trim() || '未命名角色',
    nickname: '',
    metAt: todayIso(),
    metPlace: '',
    metHow: '',
    relationType: '认识的人',
    relationLevel: '认识的人',
    status: '',
    intimacy: 20,
    contactFrequency: '偶尔',
    interests: [],
    games: [],
    placeIds: [],
    eventIds: [],
    quotes: [],
    notes: '',
    anniversaries: [],
    contactCount: 0,
    importance: 50,
    color: '#8294ff',
    createdAt: timestamp,
    ...existing,
    ...value,
    updatedAt: timestamp,
  }
}

function eventFrom(value: NewLifeEvent, existing?: LifeEvent): LifeEvent {
  return {
    id: value.id ?? createId('event'),
    title: value.title?.trim() || '未命名事件',
    description: '',
    date: todayIso(),
    type: '日常',
    peopleIds: [],
    placeIds: [],
    tags: [],
    mood: '平静',
    importance: 50,
    createdAt: nowIso(),
    ...existing,
    ...value,
  }
}

function decisionFrom(value: NewDecision, existing?: Decision): Decision {
  return {
    id: value.id ?? createId('decision'),
    question: value.question?.trim() || '还没有写下问题',
    category: '日常',
    options: [],
    factors: [],
    mode: 'rational',
    createdAt: nowIso(),
    ...existing,
    ...value,
  }
}

function questFrom(value: NewQuest, existing?: Quest): Quest {
  return {
    id: value.id ?? createId('quest'),
    title: value.title?.trim() || '未命名任务',
    description: '',
    type: 'SIDE',
    rarity: 'COMMON',
    status: 'active',
    progress: 0,
    target: 1,
    tags: [],
    xp: 20,
    createdAt: nowIso(),
    ...existing,
    ...value,
  }
}

function placeFrom(value: NewPlace, existing?: Place): Place {
  const date = todayIso()
  return {
    id: value.id ?? createId('place'),
    name: value.name?.trim() || '未命名地点',
    category: '其他',
    firstVisit: date,
    lastVisit: date,
    visitCount: 1,
    peopleIds: [],
    eventIds: [],
    photos: [],
    rating: 3,
    memoryStrength: 50,
    description: '',
    city: '',
    color: '#8294ff',
    ...existing,
    ...value,
  }
}

function chapterFrom(value: NewChapter, existing?: Chapter): Chapter {
  return {
    id: value.id ?? createId('chapter'),
    number: 1,
    title: value.title?.trim() || '未命名章节',
    startDate: todayIso(),
    description: '',
    color: '#8294ff',
    peopleIds: [],
    placeIds: [],
    eventIds: [],
    song: '',
    keywords: [],
    ...existing,
    ...value,
  }
}

function capsuleFrom(value: NewCapsule, existing?: MemoryCapsule): MemoryCapsule {
  const createdAt = nowIso()
  return {
    id: value.id ?? createId('capsule'),
    title: value.title?.trim() || '给未来的信',
    content: '',
    createdAt,
    openAt: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    opened: false,
    ...existing,
    ...value,
  }
}

export const useAppStore = create<AppStoreState>((set, get) => {
  const refresh = async (): Promise<void> => {
    const [profile, saves, people, events, chapters, decisions, quests, places, achievements, capsules, settingRecords] =
      await Promise.all([
        db.profile.get('player'),
        db.saves.orderBy('date').reverse().toArray(),
        db.people.orderBy('updatedAt').reverse().toArray(),
        db.events.orderBy('date').reverse().toArray(),
        db.chapters.orderBy('number').reverse().toArray(),
        db.decisions.orderBy('createdAt').reverse().toArray(),
        db.quests.orderBy('createdAt').reverse().toArray(),
        db.places.orderBy('lastVisit').reverse().toArray(),
        db.achievements.toArray(),
        db.capsules.orderBy('openAt').toArray(),
        db.settings.toArray(),
      ])
    set((state) => ({
      profile,
      saves,
      people,
      events,
      chapters,
      decisions,
      quests,
      places,
      achievements,
      capsules,
      settings: settingsFrom(settingRecords),
      revision: state.revision + 1,
      error: undefined,
    }))
  }

  const persist = async (operation: () => Promise<void>): Promise<void> => {
    set({ saving: true, error: undefined })
    try {
      await operation()
      await refresh()
      const settings = get().settings
      await runAutomaticBackup({ enabled: settings.autoBackup, intervalHours: 24, keep: 5 })
    } catch (error) {
      set({ error: errorMessage(error) })
      throw error
    } finally {
      set({ saving: false })
    }
  }

  return {
    profile: undefined,
    saves: [],
    people: [],
    events: [],
    chapters: [],
    decisions: [],
    quests: [],
    places: [],
    achievements: [],
    capsules: [],
    settings: DEFAULT_SETTINGS,
    loading: false,
    saving: false,
    initialized: false,
    revision: 0,
    error: undefined,
    refresh,
    initialize: async () => {
      if (get().initialized || get().loading) return
      set({ loading: true, error: undefined })
      try {
        await initializeDatabase()
        await refresh()
        set({ initialized: true })
      } catch (error) {
        set({ error: errorMessage(error) })
        throw error
      } finally {
        set({ loading: false })
      }
    },
    saveLifeSave: async (value) => {
      const record = lifeSaveFrom(value, existingById(get().saves, value.id))
      await persist(async () => { await db.saves.put(record) })
      return record
    },
    deleteSave: async (id) => persist(async () => { await db.saves.delete(id) }),
    savePerson: async (value) => {
      const record = personFrom(value, existingById(get().people, value.id))
      await persist(async () => { await db.people.put(record) })
      return record
    },
    deletePerson: async (id) => persist(async () => { await db.people.delete(id) }),
    saveEvent: async (value) => {
      const record = eventFrom(value, existingById(get().events, value.id))
      await persist(async () => { await db.events.put(record) })
      return record
    },
    deleteEvent: async (id) => persist(async () => { await db.events.delete(id) }),
    saveDecision: async (value) => {
      const record = decisionFrom(value, existingById(get().decisions, value.id))
      await persist(async () => { await db.decisions.put(record) })
      return record
    },
    deleteDecision: async (id) => persist(async () => { await db.decisions.delete(id) }),
    saveQuest: async (value) => {
      const record = questFrom(value, existingById(get().quests, value.id))
      await persist(async () => { await db.quests.put(record) })
      return record
    },
    deleteQuest: async (id) => persist(async () => { await db.quests.delete(id) }),
    savePlace: async (value) => {
      const record = placeFrom(value, existingById(get().places, value.id))
      await persist(async () => { await db.places.put(record) })
      return record
    },
    deletePlace: async (id) => persist(async () => { await db.places.delete(id) }),
    saveChapter: async (value) => {
      const record = chapterFrom(value, existingById(get().chapters, value.id))
      await persist(async () => { await db.chapters.put(record) })
      return record
    },
    deleteChapter: async (id) => persist(async () => { await db.chapters.delete(id) }),
    saveCapsule: async (value) => {
      const record = capsuleFrom(value, existingById(get().capsules, value.id))
      await persist(async () => { await db.capsules.put(record) })
      return record
    },
    deleteCapsule: async (id) => persist(async () => { await db.capsules.delete(id) }),
    updateProfile: async (value) => {
      const current = get().profile
      const profile: Profile = {
        nickname: '玩家',
        bio: '',
        status: '正常运行',
        accent: '#8294ff',
        tags: [],
        joinedAt: todayIso(),
        onboardingComplete: false,
        ...current,
        ...value,
        id: 'player',
      }
      await persist(async () => { await db.profile.put(profile) })
      return profile
    },
    updateSettings: async (value) => {
      const settings = { ...get().settings, ...value }
      await persist(async () => { await db.settings.put({ id: 'app-settings', value: settings }) })
      return settings
    },
    quickSave: async (text, tags = []) => {
      const story = text.trim()
      if (!story) throw new Error('快速存档内容不能为空')
      return get().saveLifeSave({ story, keywords: [...new Set(tags)], quick: true, saveWorth: 65 })
    },
    resetWithDemo: async () => {
      set({ saving: true, error: undefined })
      try {
        await seedDemoData(db, { replace: true })
        await refresh()
      } catch (error) {
        set({ error: errorMessage(error) })
        throw error
      } finally {
        set({ saving: false, initialized: true })
      }
    },
    clearAll: async () => {
      set({ saving: true, error: undefined })
      try {
        await clearAllData()
        await refresh()
      } catch (error) {
        set({ error: errorMessage(error) })
        throw error
      } finally {
        set({ saving: false, initialized: true })
      }
    },
    clearError: () => set({ error: undefined }),
  }
})
