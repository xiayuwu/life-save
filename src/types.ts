export type ISODate = string
export type Id = string
export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
export type ThemeName = 'midnight' | 'starlight' | 'sakura' | 'ocean' | 'cyber' | 'black'

export interface Profile {
  id: 'player'
  nickname: string
  birthday?: ISODate
  avatar?: string
  bio: string
  status: string
  accent: string
  tags: string[]
  joinedAt: ISODate
  currentChapterId?: Id
  onboardingComplete: boolean
}

export interface LifeSave {
  id: Id
  date: ISODate
  createdAt: ISODate
  updatedAt: ISODate
  weather: string
  mood: string
  status: string
  keywords: string[]
  story: string
  peopleIds: Id[]
  placeIds: Id[]
  decisionIds: Id[]
  questIds: Id[]
  timeSink: string
  photos: LocalImage[]
  bgm: string
  quote: string
  satisfaction: number
  fatigue: number
  socialEnergy: number
  luck: number
  saveWorth: number
  quick: boolean
  chapterId?: Id
}

export interface LocalImage {
  id: Id
  name: string
  type: string
  data: Blob
  thumbnail?: Blob
  createdAt: ISODate
}

export interface Person {
  id: Id
  name: string
  nickname: string
  avatar?: string
  metAt: ISODate
  metPlace: string
  metHow: string
  relationType: string
  relationLevel: string
  status: string
  intimacy: number
  contactFrequency: string
  interests: string[]
  games: string[]
  placeIds: Id[]
  eventIds: Id[]
  quotes: string[]
  notes: string
  birthday?: ISODate
  anniversaries: Anniversary[]
  contactCount: number
  importance: number
  color: string
  createdAt: ISODate
  updatedAt: ISODate
}

export interface Anniversary {
  id: Id
  name: string
  date: ISODate
  recurring: boolean
}

export interface LifeEvent {
  id: Id
  title: string
  description: string
  date: ISODate
  type: string
  peopleIds: Id[]
  placeIds: Id[]
  tags: string[]
  mood: string
  importance: number
  chapterId?: Id
  createdAt: ISODate
}

export interface Chapter {
  id: Id
  number: number
  title: string
  startDate: ISODate
  endDate?: ISODate
  description: string
  color: string
  cover?: string
  peopleIds: Id[]
  placeIds: Id[]
  eventIds: Id[]
  song: string
  keywords: string[]
}

export interface DecisionOption {
  id: Id
  title: string
  note: string
  scores: Record<string, number>
}

export type DecisionMode = 'fate' | 'rational' | 'feeling' | 'longterm' | 'yolo' | 'easy'

export interface Decision {
  id: Id
  question: string
  category: string
  options: DecisionOption[]
  factors: string[]
  mode: DecisionMode
  suggestionId?: Id
  actualChoiceId?: Id
  hopedChoiceId?: Id
  regretted?: boolean
  satisfaction?: number
  simulation?: string[]
  createdAt: ISODate
  resolvedAt?: ISODate
}

export interface Quest {
  id: Id
  title: string
  description: string
  type: 'MAIN' | 'SIDE' | 'DAILY' | 'RANDOM'
  rarity: Rarity
  status: 'active' | 'completed' | 'paused' | 'failed'
  progress: number
  target: number
  dueAt?: ISODate
  tags: string[]
  xp: number
  createdAt: ISODate
  completedAt?: ISODate
}

export interface Place {
  id: Id
  name: string
  category: string
  firstVisit: ISODate
  lastVisit: ISODate
  visitCount: number
  peopleIds: Id[]
  eventIds: Id[]
  photos: LocalImage[]
  rating: number
  memoryStrength: number
  description: string
  city: string
  coordinates?: { x: number; y: number }
  color: string
}

export interface Achievement {
  id: Id
  title: string
  description: string
  rarity: Rarity
  secret: boolean
  icon: string
  unlockedAt?: ISODate
  progress: number
  target: number
}

export interface MemoryCapsule {
  id: Id
  title: string
  content: string
  createdAt: ISODate
  openAt: ISODate
  opened: boolean
}

export interface RecentPick {
  id?: number
  pool: string
  itemId: string
  shownAt: ISODate
}

export interface SettingRecord {
  id: string
  value: unknown
}

export interface AppSettings {
  theme: ThemeName
  accent: string
  sound: boolean
  motion: boolean
  dashboardOrder: string[]
  autoBackup: boolean
  lastBackupAt?: ISODate
}

export interface SaveFile {
  app: 'LIFE//SAVE'
  schemaVersion: number
  exportedAt: ISODate
  data: {
    profile: Profile[]
    saves: LifeSave[]
    people: Person[]
    events: LifeEvent[]
    chapters: Chapter[]
    decisions: Decision[]
    quests: Quest[]
    places: Place[]
    achievements: Achievement[]
    capsules: MemoryCapsule[]
    settings: SettingRecord[]
    recentPicks: RecentPick[]
  }
}

export interface Activity {
  id: string
  title: string
  description: string
  category: string
  duration: number
  cost: number
  energy: number
  social: number
  location: string[]
  mood: string[]
  weather: string[]
  rarity: Rarity
  tags: string[]
  baseWeight: number
}

export interface ContentItem {
  id: string
  text: string
  tags: string[]
  baseWeight: number
}
