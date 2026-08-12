import type { DecisionMode, Rarity } from '../types'

export type TaskDifficulty = 'tiny' | 'easy' | 'medium' | 'brave'

export interface RandomTaskDefinition {
  id: string
  title: string
  description: string
  category: string
  difficulty: TaskDifficulty
  duration: number
  xp: number
  tags: string[]
  baseWeight: number
}

export interface TitleRule {
  id: string
  title: string
  description: string
  condition: {
    metric: string
    comparison: 'gte' | 'lte' | 'eq'
    value: number | string
  }
  rarity: Rarity
  priority: number
}

export interface MoodDefinition {
  id: string
  label: string
  emoji: string
  valence: number
  energy: number
  color: string
  tags: string[]
}

export interface DecisionFactorDefinition {
  id: string
  label: string
  description: string
  question: string
  defaultWeight: number
  tags: string[]
}

export interface DecisionModeDefinition {
  mode: DecisionMode
  label: string
  icon: string
  summary: string
  prompt: string
  accent: string
}

export interface SelectOptionDefinition {
  id: string
  label: string
  emoji?: string
  tags: string[]
}
