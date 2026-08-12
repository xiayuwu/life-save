import type { DecisionMode, DecisionOption } from '../types'

export interface DecisionFactorWeights {
  [factor: string]: number
}

export interface ScoredDecisionOption {
  option: DecisionOption
  score: number
  normalizedScore: number
  explanation: string[]
}

const MODE_WEIGHTS: Record<Exclude<DecisionMode, 'fate'>, DecisionFactorWeights> = {
  rational: {
    时间: -1,
    金钱: -1,
    心情: 0.8,
    体力: -0.7,
    风险: -1.2,
    收益: 1.4,
    后悔概率: -1,
    满足感: 1,
    长期价值: 1.4,
    即时快乐: 0.5,
    难度: -0.6,
  },
  feeling: {
    心情: 1.6,
    满足感: 1.7,
    即时快乐: 1.5,
    社交欲望: 1,
    体力: -0.5,
    后悔概率: -0.5,
    长期价值: 0.35,
  },
  longterm: {
    长期价值: 2,
    收益: 1.6,
    后悔概率: -1.1,
    风险: -0.7,
    金钱: -0.8,
    时间: -0.6,
    满足感: 0.6,
    难度: -0.2,
  },
  yolo: {
    即时快乐: 1.8,
    满足感: 1.2,
    收益: 0.6,
    风险: 0.7,
    难度: 0.25,
    金钱: -0.25,
    时间: -0.2,
    体力: -0.2,
  },
  easy: {
    难度: -2,
    时间: -1.5,
    金钱: -1,
    体力: -1.7,
    风险: -0.6,
    满足感: 0.4,
    即时快乐: 0.5,
  },
}

const COST_FACTORS = new Set(['时间', '金钱', '体力', '风险', '后悔概率', '难度'])

export function decisionModeWeights(mode: DecisionMode): DecisionFactorWeights {
  return mode === 'fate' ? {} : { ...MODE_WEIGHTS[mode] }
}

export function scoreDecisionOptions(
  options: readonly DecisionOption[],
  mode: DecisionMode,
  customWeights: DecisionFactorWeights = {},
  random: () => number = Math.random,
): ScoredDecisionOption[] {
  if (options.length === 0) return []

  if (mode === 'fate') {
    const selectedIndex = Math.min(
      options.length - 1,
      Math.floor(Math.max(0, Math.min(0.999999999999, random())) * options.length),
    )
    return options
      .map((option, index) => ({
        option,
        score: index === selectedIndex ? 1 : 0,
        normalizedScore: index === selectedIndex ? 100 : 0,
        explanation: index === selectedIndex ? ['命运选择了这一项'] : [],
      }))
      .sort((left, right) => right.score - left.score)
  }

  const modeWeights = decisionModeWeights(mode)
  const allFactors = new Set([
    ...Object.keys(modeWeights),
    ...Object.keys(customWeights),
    ...options.flatMap((option) => Object.keys(option.scores)),
  ])
  const weights = Object.fromEntries(
    [...allFactors].map((factor) => [factor, (modeWeights[factor] ?? 0.5) * (customWeights[factor] ?? 1)]),
  )

  const raw = options.map((option) => {
    const contributions = Object.entries(option.scores).map(([factor, value]) => ({
      factor,
      contribution: value * (weights[factor] ?? 0),
    }))
    const score = contributions.reduce((sum, entry) => sum + entry.contribution, 0)
    const explanation = contributions
      .filter((entry) => Math.abs(entry.contribution) >= 2)
      .sort((left, right) => Math.abs(right.contribution) - Math.abs(left.contribution))
      .slice(0, 3)
      .map((entry) => `${entry.factor}${entry.contribution >= 0 ? '加分' : '扣分'}`)
    return { option, score, normalizedScore: 0, explanation }
  })
  const values = raw.map((entry) => entry.score)
  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  const span = maximum - minimum

  return raw
    .map((entry) => ({
      ...entry,
      normalizedScore: span === 0 ? 50 : ((entry.score - minimum) / span) * 100,
    }))
    .sort((left, right) => right.score - left.score)
}

export function recommendDecision(
  options: readonly DecisionOption[],
  mode: DecisionMode,
  customWeights: DecisionFactorWeights = {},
  random: () => number = Math.random,
): ScoredDecisionOption | undefined {
  return scoreDecisionOptions(options, mode, customWeights, random)[0]
}

export function inferScorePolarity(factor: string): 'cost' | 'benefit' {
  return COST_FACTORS.has(factor) ? 'cost' : 'benefit'
}
