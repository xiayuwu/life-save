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
  SaveFile,
} from '../../types'

export type FeatureEntityKind =
  | 'save'
  | 'person'
  | 'event'
  | 'chapter'
  | 'decision'
  | 'quest'
  | 'place'
  | 'capsule'
  | 'profile'
  | 'settings'

export type FeatureEntity =
  | LifeSave
  | Person
  | LifeEvent
  | Chapter
  | Decision
  | Quest
  | Place
  | MemoryCapsule
  | Profile
  | AppSettings

export type MaybePromise<T> = T | Promise<T>

export interface ImportResult {
  schemaVersion?: number
  counts?: Partial<Record<FeatureEntityKind, number>>
  message?: string
}

export interface FeatureActions {
  save?: (value: LifeSave) => MaybePromise<void>
  create?: (kind: FeatureEntityKind, value: FeatureEntity) => MaybePromise<void>
  update?: (kind: FeatureEntityKind, value: FeatureEntity) => MaybePromise<void>
  delete?: (kind: FeatureEntityKind, id: string) => MaybePromise<void>
  import?: (file: File, mode: 'merge' | 'replace') => MaybePromise<ImportResult | void>
  export?: () => MaybePromise<SaveFile | string | Blob | void>
  reset?: () => MaybePromise<void>
  demo?: () => MaybePromise<void>
  navigate?: (path: string) => void
  notify?: (title: string, message: string) => void
}

export interface FeaturePageProps {
  profile?: Profile
  saves?: LifeSave[]
  people?: Person[]
  events?: LifeEvent[]
  chapters?: Chapter[]
  decisions?: Decision[]
  quests?: Quest[]
  places?: Place[]
  achievements?: Achievement[]
  capsules?: MemoryCapsule[]
  settings?: AppSettings
  actions?: FeatureActions
}

