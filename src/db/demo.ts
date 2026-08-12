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
import { clearUserData, db, type LifeSaveDatabase } from './database'

const DAY = 86_400_000

function day(offset: number): string {
  return new Date(Date.now() + offset * DAY).toISOString().slice(0, 10)
}

function timestamp(offset: number, hour = 20): string {
  return new Date(`${day(offset)}T${String(hour).padStart(2, '0')}:00:00.000Z`).toISOString()
}

const personBlueprints = [
  ['林澈', '阿澈', '挚友', '#78a7ff'],
  ['苏遥', '小遥', '重要的人', '#d9a2ff'],
  ['程野', '野哥', '游戏好友', '#66e0c2'],
  ['许知夏', '知夏', '普通朋友', '#ffb5cf'],
  ['周屿', '组长', '工作伙伴', '#f8c56c'],
  ['顾清和', '清和', '老同学', '#9bc7ff'],
] as const

const placeBlueprints = [
  ['暮蓝咖啡', '咖啡店', '杭州', '#698eff'],
  ['滨江夜跑线', '户外', '杭州', '#55d9ba'],
  ['星河书店', '探索', '杭州', '#ac91ff'],
  ['工作室', '公司', '杭州', '#f4b861'],
  ['旧校区', '学校', '南京', '#7eaef5'],
] as const

export interface DemoData {
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
}

export function generateDemoData(): DemoData {
  const now = new Date().toISOString()
  const chapters: Chapter[] = [
    {
      id: 'chapter-current',
      number: 3,
      title: '向新的坐标移动',
      startDate: day(-210),
      description: '开始认真整理生活，也开始理解自己真正想留下什么。',
      color: '#7b8dff',
      peopleIds: ['person-0', 'person-1', 'person-4'],
      placeIds: ['place-0', 'place-1', 'place-3'],
      eventIds: ['event-0', 'event-1'],
      song: 'After the Rain',
      keywords: ['重启', '城市', '创造'],
    },
    {
      id: 'chapter-past',
      number: 2,
      title: '离开校园之后',
      startDate: day(-900),
      endDate: day(-211),
      description: '从熟悉的地图走入没有攻略的新区域。',
      color: '#55d9ba',
      peopleIds: ['person-2', 'person-5'],
      placeIds: ['place-4'],
      eventIds: ['event-2'],
      song: 'New Game',
      keywords: ['毕业', '工作', '第一次'],
    },
  ]
  const profile: Profile[] = [
    {
      id: 'player',
      nickname: '夜航者',
      bio: '在现实世界收集坐标、声音与相遇。',
      status: '正在加载新的支线',
      accent: '#8294ff',
      tags: ['夜猫子', '城市漫游', '游戏', '摄影'],
      joinedAt: day(-417),
      currentChapterId: chapters[0].id,
      onboardingComplete: true,
    },
  ]
  const people: Person[] = personBlueprints.map(([name, nickname, relationType, color], index) => ({
    id: `person-${index}`,
    name,
    nickname,
    metAt: day(-1200 + index * 133),
    metPlace: index % 2 === 0 ? '旧校区' : '杭州',
    metHow: index % 2 === 0 ? '共同活动' : '朋友介绍',
    relationType,
    relationLevel: index < 2 ? '重要的人' : index < 4 ? '好友' : '认识的人',
    status: index === 1 ? '常联系' : '在线',
    intimacy: 88 - index * 9,
    contactFrequency: index < 3 ? '每周' : '偶尔',
    interests: [['摄影', '电影'], ['音乐', '旅行'], ['游戏', '硬件']][index % 3] ?? [],
    games: index % 2 === 0 ? ['Apex Legends', '双人成行'] : [],
    placeIds: [`place-${index % 5}`, `place-${(index + 1) % 5}`],
    eventIds: [`event-${index % 8}`],
    quotes: [`“第 ${index + 1} 个方案也许值得试试。”`],
    notes: '一位在时间线里反复出现的重要角色。',
    birthday: day(40 + index * 17),
    anniversaries: [
      { id: `anniversary-${index}`, name: '认识纪念日', date: day(-365 + index * 11), recurring: true },
    ],
    contactCount: 34 - index * 3,
    importance: 92 - index * 8,
    color,
    createdAt: timestamp(-390 + index),
    updatedAt: timestamp(-index),
  }))
  const places: Place[] = placeBlueprints.map(([name, category, city, color], index) => ({
    id: `place-${index}`,
    name,
    category,
    firstVisit: day(-500 + index * 60),
    lastVisit: day(-index * 3),
    visitCount: 18 - index * 2,
    peopleIds: [`person-${index % people.length}`, `person-${(index + 1) % people.length}`],
    eventIds: [`event-${index}`],
    photos: [],
    rating: 5 - (index % 2) * 0.5,
    memoryStrength: 90 - index * 7,
    description: ['适合独处和写字。', '风大的晚上城市很安静。', '总能翻到意外的书。'][index % 3],
    city,
    coordinates: { x: 20 + index * 17, y: 25 + ((index * 23) % 55) },
    color,
  }))
  const eventTitles = [
    '雨停后的长谈',
    '第一次完成独立项目',
    '毕业那天的合影',
    '没有导航的城市漫游',
    '凌晨排位五连胜',
    '书店偶遇旧朋友',
    '临时决定去看海',
    '团队庆功晚餐',
  ]
  const events: LifeEvent[] = eventTitles.map((title, index) => ({
    id: `event-${index}`,
    title,
    description: index % 2 === 0 ? '一段值得放进主时间线的记忆。' : '计划之外发生的小型闪光事件。',
    date: day(-index * 23 - 2),
    type: ['朋友', '工作', '成长', '旅行', '游戏'][index % 5],
    peopleIds: [`person-${index % people.length}`],
    placeIds: [`place-${index % places.length}`],
    tags: ['记忆', index % 2 === 0 ? '重要' : '日常'],
    mood: ['满足', '兴奋', '怀念', '平静'][index % 4],
    importance: 55 + ((index * 7) % 43),
    chapterId: index < 6 ? chapters[0].id : chapters[1].id,
    createdAt: timestamp(-index * 23 - 2),
  }))
  const moods = ['平静', '开心', '疲惫', '满足', '期待', '放松', '兴奋', '迷茫']
  const saves: LifeSave[] = Array.from({ length: 38 }, (_, index) => {
    const offset = -index
    const personId = `person-${index % people.length}`
    const placeId = `place-${index % places.length}`
    return {
      id: `save-${index}`,
      date: day(offset),
      createdAt: timestamp(offset, 21),
      updatedAt: timestamp(offset, 22),
      weather: ['晴', '多云', '雨', '微风'][index % 4],
      mood: moods[index % moods.length],
      status: index % 3 === 0 ? '充电中' : '正常运行',
      keywords: [['工作', '咖啡'], ['朋友', '夜晚'], ['散步', '城市'], ['游戏', '放松']][index % 4],
      story: index % 5 === 0 ? '今天发生了一件以后还会想起来的小事。' : `第 ${38 - index} 次连续记录，世界仍在运行。`,
      peopleIds: index % 3 === 0 ? [personId] : [],
      placeIds: [placeId],
      decisionIds: index % 7 === 0 ? [`decision-${index % 6}`] : [],
      questIds: index % 4 === 0 ? [`quest-${index % 10}`] : [],
      timeSink: ['项目', '通勤', '游戏', '聊天'][index % 4],
      photos: [],
      bgm: index % 3 === 0 ? 'Night Drive' : '',
      quote: ['慢一点也没关系。', '新的地图需要自己探索。', '今天值得被保存。'][index % 3],
      satisfaction: 55 + ((index * 11) % 45),
      fatigue: 25 + ((index * 13) % 65),
      socialEnergy: 30 + ((index * 17) % 65),
      luck: 35 + ((index * 19) % 60),
      saveWorth: 60 + ((index * 7) % 40),
      quick: index % 6 === 0,
      chapterId: chapters[0].id,
    }
  })
  const decisions: Decision[] = Array.from({ length: 6 }, (_, index): Decision => ({
    id: `decision-${index}`,
    question: ['今晚做什么？', '周末要不要出门？', '要不要买这件设备？'][index % 3],
    category: ['娱乐', '出门', '消费'][index % 3],
    options: [
      { id: `decision-${index}-a`, title: '按原计划行动', note: '稳妥路线', scores: { 满足感: 7, 长期价值: 8, 风险: 2, 难度: 5 } },
      { id: `decision-${index}-b`, title: '换一条新路线', note: '获得新鲜感', scores: { 满足感: 9, 即时快乐: 9, 风险: 6, 长期价值: 5 } },
      { id: `decision-${index}-c`, title: '先休息', note: '恢复体力', scores: { 体力: 1, 难度: 1, 即时快乐: 6, 长期价值: 4 } },
    ] as Decision['options'],
    factors: ['满足感', '长期价值', '风险', '难度'],
    mode: ['rational', 'feeling', 'longterm', 'yolo', 'easy', 'fate'][index] as Decision['mode'],
    suggestionId: `decision-${index}-${index % 2 === 0 ? 'a' : 'b'}`,
    actualChoiceId: `decision-${index}-${index % 3 === 0 ? 'b' : 'a'}`,
    regretted: index === 4,
    satisfaction: 60 + index * 6,
    simulation: ['两小时后的你可能感到放松。', '这只是情景模拟，不是未来预测。'],
    createdAt: timestamp(-index * 8),
    resolvedAt: timestamp(-index * 8, 21),
  }))
  const questTitles = ['整理桌面十分钟', '拍一张今天的天空', '完成作品集主页', '联系一位老朋友', '探索一家新店', '早睡一次', '读完手边的书', '夜跑三公里', '整理年度照片', '写给未来的信']
  const quests: Quest[] = questTitles.map((title, index) => ({
    id: `quest-${index}`,
    title,
    description: index % 2 === 0 ? '一个能让世界状态前进一点的小任务。' : '可选支线，不必追求完美完成。',
    type: ['DAILY', 'SIDE', 'MAIN', 'RANDOM'][index % 4] as Quest['type'],
    rarity: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC'][index % 4] as Quest['rarity'],
    status: index < 6 ? 'completed' : 'active',
    progress: index < 6 ? 1 : index % 2,
    target: 1,
    dueAt: index >= 6 ? day(index + 3) : undefined,
    tags: ['成长', index % 2 === 0 ? '独处' : '探索'],
    xp: 20 + index * 8,
    createdAt: timestamp(-30 + index),
    completedAt: index < 6 ? timestamp(-12 + index) : undefined,
  }))
  const achievementTitles = ['第一份存档', '连续存档 7 天', '关系图谱启动', '城市漫游者', '选择的重量', '支线任务大师', '夜间记录者', '记忆收藏家', '世界观察员', '第三章开启']
  const achievements: Achievement[] = achievementTitles.map((title, index) => ({
    id: `achievement-${index}`,
    title,
    description: `达成「${title}」对应的记录条件。`,
    rarity: ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'][index % 5] as Achievement['rarity'],
    secret: index === 8,
    icon: ['save', 'flame', 'users', 'map', 'sparkles'][index % 5],
    unlockedAt: index < 7 ? timestamp(-20 + index) : undefined,
    progress: index < 7 ? 1 : index - 6,
    target: index < 7 ? 1 : 5,
  }))
  const capsules: MemoryCapsule[] = [
    { id: 'capsule-0', title: '给一年后的我', content: '希望你还记得现在为什么出发。', createdAt: timestamp(-50), openAt: day(315), opened: false },
    { id: 'capsule-1', title: '项目完成后打开', content: '辛苦了，现在可以好好庆祝。', createdAt: timestamp(-21), openAt: day(45), opened: false },
  ]
  const appSettings: AppSettings = {
    theme: 'midnight',
    accent: '#8294ff',
    sound: false,
    motion: true,
    dashboardOrder: ['overview', 'quick-save', 'quests', 'mood', 'people'],
    autoBackup: true,
  }
  const settings: SettingRecord[] = [
    { id: 'app-settings', value: appSettings },
    { id: 'demo-generated-at', value: now },
  ]
  return { profile, saves, people, events, chapters, decisions, quests, places, achievements, capsules, settings }
}

export async function seedDemoData(
  database: LifeSaveDatabase = db,
  options: { replace?: boolean } = {},
): Promise<DemoData> {
  const demo = generateDemoData()
  if (options.replace) await clearUserData(database)
  await database.transaction('rw', database.tables, async () => {
    await Promise.all([
      database.profile.bulkPut(demo.profile),
      database.saves.bulkPut(demo.saves),
      database.people.bulkPut(demo.people),
      database.events.bulkPut(demo.events),
      database.chapters.bulkPut(demo.chapters),
      database.decisions.bulkPut(demo.decisions),
      database.quests.bulkPut(demo.quests),
      database.places.bulkPut(demo.places),
      database.achievements.bulkPut(demo.achievements),
      database.capsules.bulkPut(demo.capsules),
      database.settings.bulkPut(demo.settings),
    ])
  })
  return demo
}
