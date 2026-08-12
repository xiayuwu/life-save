import type { MoodDefinition, SelectOptionDefinition } from './models'

export const moods: MoodDefinition[] = [
  { id: 'calm', label: '平静', emoji: '◌', valence: 2, energy: 0, color: '#7dd3fc', tags: ['稳定', '安静'] },
  { id: 'happy', label: '开心', emoji: '☀', valence: 4, energy: 3, color: '#fbbf24', tags: ['积极', '明亮'] },
  { id: 'excited', label: '兴奋', emoji: '✦', valence: 4, energy: 5, color: '#fb7185', tags: ['高能量', '期待'] },
  { id: 'content', label: '满足', emoji: '◡', valence: 4, energy: 1, color: '#86efac', tags: ['积极', '稳定'] },
  { id: 'relaxed', label: '放松', emoji: '≈', valence: 3, energy: -1, color: '#5eead4', tags: ['恢复', '安静'] },
  { id: 'hopeful', label: '期待', emoji: '↗', valence: 3, energy: 3, color: '#c4b5fd', tags: ['未来', '积极'] },
  { id: 'grateful', label: '感激', emoji: '♡', valence: 4, energy: 1, color: '#f9a8d4', tags: ['关系', '温暖'] },
  { id: 'proud', label: '自豪', emoji: '♢', valence: 4, energy: 3, color: '#fde047', tags: ['完成', '自信'] },
  { id: 'curious', label: '好奇', emoji: '?', valence: 2, energy: 3, color: '#67e8f9', tags: ['探索', '开放'] },
  { id: 'inspired', label: '有灵感', emoji: '✧', valence: 4, energy: 4, color: '#d8b4fe', tags: ['创造', '高能量'] },
  { id: 'romantic', label: '浪漫', emoji: '☾', valence: 3, energy: 1, color: '#f0abfc', tags: ['感性', '氛围'] },
  { id: 'brave', label: '勇敢', emoji: '↑', valence: 2, energy: 4, color: '#fb923c', tags: ['行动', '突破'] },
  { id: 'neutral', label: '平淡', emoji: '—', valence: 0, energy: 0, color: '#94a3b8', tags: ['日常', '中性'] },
  { id: 'bored', label: '无聊', emoji: '…', valence: -1, energy: -2, color: '#a8a29e', tags: ['低能量', '空闲'] },
  { id: 'tired', label: '疲惫', emoji: 'z', valence: -2, energy: -5, color: '#818cf8', tags: ['低能量', '恢复'] },
  { id: 'anxious', label: '焦虑', emoji: '⌁', valence: -3, energy: 4, color: '#f87171', tags: ['紧张', '高能量'] },
  { id: 'irritable', label: '烦躁', emoji: '×', valence: -3, energy: 3, color: '#f97316', tags: ['紧张', '高能量'] },
  { id: 'lonely', label: '孤独', emoji: '·', valence: -3, energy: -2, color: '#60a5fa', tags: ['关系', '低落'] },
  { id: 'lost', label: '迷茫', emoji: '◇', valence: -2, energy: 0, color: '#a78bfa', tags: ['不确定', '思考'] },
  { id: 'sad', label: '难过', emoji: '☂', valence: -4, energy: -3, color: '#38bdf8', tags: ['低落', '恢复'] },
  { id: 'frustrated', label: '沮丧', emoji: '↓', valence: -4, energy: -2, color: '#64748b', tags: ['受挫', '低落'] },
  { id: 'regretful', label: '后悔', emoji: '↶', valence: -3, energy: -1, color: '#8b5cf6', tags: ['过去', '反思'] },
  { id: 'overloaded', label: '过载', emoji: '‼', valence: -3, energy: 5, color: '#ef4444', tags: ['高能量', '休息'] },
  { id: 'numb', label: '麻木', emoji: '□', valence: -2, energy: -4, color: '#78716c', tags: ['低能量', '迟钝'] },
  { id: 'nostalgic', label: '怀念', emoji: '◴', valence: 1, energy: -1, color: '#e9d5ff', tags: ['过去', '复杂'] },
  { id: 'shy', label: '社恐', emoji: '◐', valence: -1, energy: 2, color: '#cbd5e1', tags: ['关系', '紧张'] },
  { id: 'awkward', label: '尴尬', emoji: '⌇', valence: -2, energy: 2, color: '#fda4af', tags: ['关系', '瞬时'] },
  { id: 'determined', label: '坚定', emoji: '◆', valence: 2, energy: 4, color: '#22d3ee', tags: ['行动', '稳定'] },
  { id: 'tender', label: '柔软', emoji: '❀', valence: 3, energy: 0, color: '#fbcfe8', tags: ['温暖', '感性'] },
  { id: 'confused', label: '困惑', emoji: '≋', valence: -1, energy: 1, color: '#93c5fd', tags: ['不确定', '思考'] },
]

export const weatherOptions: SelectOptionDefinition[] = [
  ['sunny', '晴朗', '☀'], ['cloudy', '多云', '☁'], ['overcast', '阴天', '◒'],
  ['drizzle', '小雨', '☂'], ['rain', '下雨', '≋'], ['storm', '雷雨', 'ϟ'],
  ['snow', '下雪', '❄'], ['fog', '雾', '≡'], ['windy', '大风', '↝'],
  ['hot', '炎热', '↑'], ['cold', '寒冷', '↓'], ['indoor', '没留意', '—'],
].map(([id, label, emoji]) => ({ id, label, emoji, tags: ['weather'] }))

export const saveStatuses: SelectOptionDefinition[] = [
  ['flow', '状态在线'], ['steady', '平稳推进'], ['busy', '忙碌运转'], ['scattered', '有点分心'],
  ['surviving', '低电量生存'], ['resting', '主动休息'], ['social', '社交模式'], ['solo', '独处模式'],
  ['exploring', '探索中'], ['creating', '创造中'], ['healing', '恢复中'], ['loading', '仍在加载'],
].map(([id, label]) => ({ id, label, tags: ['status'] }))
