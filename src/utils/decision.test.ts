import { describe, expect, it } from 'vitest'
import type { DecisionOption } from '../types'
import { recommendDecision, scoreDecisionOptions } from './decision'

const options: DecisionOption[] = [
  { id: 'future', title: '学习', note: '', scores: { 长期价值: 10, 收益: 8, 即时快乐: 2, 难度: 7 } },
  { id: 'fun', title: '游戏', note: '', scores: { 长期价值: 2, 收益: 1, 即时快乐: 10, 难度: 2 } },
]

describe('decision scoring', () => {
  it('supports all six modes', () => {
    expect(recommendDecision(options, 'longterm')?.option.id).toBe('future')
    expect(recommendDecision(options, 'feeling')?.option.id).toBe('fun')
    expect(recommendDecision(options, 'easy')?.option.id).toBe('fun')
    expect(recommendDecision(options, 'yolo')?.option.id).toBe('fun')
    expect(scoreDecisionOptions(options, 'rational')).toHaveLength(2)
    expect(recommendDecision(options, 'fate', {}, () => 0.99)?.option.id).toBe('fun')
  })

  it('allows explicit user factor weighting', () => {
    expect(recommendDecision(options, 'rational', { 即时快乐: 10 })?.option.id).toBe('fun')
  })
})
