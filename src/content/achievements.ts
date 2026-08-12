import type { Achievement, Rarity } from '../types'

interface AchievementTrack {
  key: string
  metric: string
  titles: [string, string, string, string, string]
  descriptions: [string, string, string, string, string]
  targets: [number, number, number, number, number]
  icon: string
  secret?: boolean
}

const tracks: AchievementTrack[] = [
  { key: 'save', metric: 'saves', titles: ['初次存档', '日常抄写员', '时光装订师', '千页人生', '活档案'], descriptions: ['留下第一条生活记录。', '累计写下十次真实日常。', '一百次把此刻交给未来。', '生活已铺成长长卷轴。', '你成为了自己的长期见证者。'], targets: [1, 10, 100, 500, 1000], icon: 'save' },
  { key: 'streak', metric: 'saveStreak', titles: ['再次见面', '七日信号', '月相见证', '百日航线', '岁月不断线'], descriptions: ['连续记录两天。', '连续七天返回存档点。', '连续三十天留下信号。', '一百天的生活没有失联。', '记录跨过完整四季。'], targets: [2, 7, 30, 100, 365], icon: 'flame' },
  { key: 'people', metric: 'people', titles: ['新角色登场', '通讯录发芽', '群像开场', '百人图谱', '众星成图'], descriptions: ['记录第一位重要角色。', '人物档案达到五位。', '二十位角色进入你的故事。', '百位人生交点得到名字。', '庞大关系星图被点亮。'], targets: [1, 5, 20, 100, 300], icon: 'users' },
  { key: 'places', metric: 'places', titles: ['坐标确认', '附近探员', '城市脚注', '地图拓荒者', '世界采样员'], descriptions: ['记录第一个地点。', '留下五处生活坐标。', '二十处空间拥有记忆。', '一百个地点被你点亮。', '你的世界地图辽阔而具体。'], targets: [1, 5, 20, 100, 300], icon: 'map-pin' },
  { key: 'decisions', metric: 'decisions', titles: ['选择发生', '分岔路熟客', '决定练习生', '百次落子', '命运编辑器'], descriptions: ['保存第一次决定。', '认真处理十次选择。', '五十次为犹豫建立模型。', '完成一百次选择复盘。', '你熟悉了自己的选择语法。'], targets: [1, 10, 50, 100, 300], icon: 'split' },
  { key: 'quests', metric: 'questsCompleted', titles: ['任务完成', '支线学徒', '任务清单猎手', '百战日常', '全地图行动派'], descriptions: ['完成第一个任务。', '十次把想法变成动作。', '五十条支线成功结算。', '一百次完成感被收集。', '你的行动轨迹铺满地图。'], targets: [1, 10, 50, 100, 500], icon: 'check-circle' },
  { key: 'events', metric: 'events', titles: ['剧情触发', '事件记录员', '章节编目者', '历史现场', '长篇叙事体'], descriptions: ['记录第一件人生事件。', '十个片段进入时间线。', '五十件事件拥有上下文。', '一百次变化被妥善保存。', '你的人生已是一部可检索长篇。'], targets: [1, 10, 50, 100, 500], icon: 'sparkles' },
  { key: 'photos', metric: 'photos', titles: ['第一帧', '随身摄影师', '光影收藏家', '千帧回忆', '视觉档案馆'], descriptions: ['为存档加入第一张照片。', '五十帧现实被收藏。', '两百张照片连接起时间。', '一千次按下快门或保存。', '你的生活拥有宏大视觉索引。'], targets: [1, 50, 200, 1000, 3000], icon: 'camera' },
  { key: 'quick', metric: 'quickSaves', titles: ['快速捕捉', '瞬间接收器', '现场速记员', '即时记忆库', '时间快门'], descriptions: ['完成第一次 Quick Save。', '二十个瞬间来得及保存。', '一百次在细节消失前接住它。', '五百个现场碎片形成星云。', '稍纵即逝已成为你的专长。'], targets: [1, 20, 100, 500, 1000], icon: 'zap' },
  { key: 'night', metric: 'nightSaves', titles: ['夜间信号', '零点仍在线', '夜行观察员', '午夜档案局', '长夜守望者'], descriptions: ['在深夜留下记录。', '十次捕捉夜间频道。', '五十个夜晚拥有注解。', '两百份午夜档案已归档。', '你听懂了长夜的多种语言。'], targets: [1, 10, 50, 200, 500], icon: 'moon', secret: true },
  { key: 'rain', metric: 'rainSaves', titles: ['雨滴样本', '听雨人', '潮湿叙事', '季风档案', '云层译者'], descriptions: ['保存一个雨天。', '记录十次雨声与心情。', '五十场雨有了不同注脚。', '两百次天气事件被观察。', '你能辨认云层下的每种生活。'], targets: [1, 10, 50, 200, 500], icon: 'cloud-rain', secret: true },
  { key: 'travel', metric: 'travelEvents', titles: ['第一次远行', '车窗收藏家', '路线展开', '远方常客', '行星漫游者'], descriptions: ['记录第一段旅途。', '十次离开熟悉坐标。', '五十段路线进入地图。', '一百次与远方交换故事。', '世界在你的脚步下持续展开。'], targets: [1, 10, 50, 100, 300], icon: 'plane' },
  { key: 'bond', metric: 'highBondPeople', titles: ['连接建立', '可靠同伴', '关系园丁', '群星相照', '引力中心'], descriptions: ['一段关系达到高亲密。', '与三位角色建立深连接。', '十段关系得到长期照料。', '二十位重要角色彼此照亮。', '你的世界因稳定连接而有引力。'], targets: [1, 3, 10, 20, 50], icon: 'heart' },
  { key: 'chapters', metric: 'chapters', titles: ['新章标题', '阶段意识', '人生编剧', '十章长卷', '史诗未完'], descriptions: ['命名第一段人生阶段。', '三个阶段被清楚区分。', '五个章节拥有各自主题。', '人生长卷抵达第十章。', '你持续为变化赋予结构。'], targets: [1, 3, 5, 10, 20], icon: 'book-open' },
  { key: 'keywords', metric: 'uniqueKeywords', titles: ['一个关键词', '生活词表', '私人语料库', '百词索引', '千词宇宙'], descriptions: ['添加第一个关键词。', '二十个词开始描述生活。', '五十个词构成私人语料。', '百枚关键词连接起记录。', '一千个词汇成为生活星座。'], targets: [1, 20, 50, 100, 1000], icon: 'tag' },
  { key: 'capsules', metric: 'capsulesOpened', titles: ['未来来信', '时间邮差', '延迟惊喜', '百日回声', '跨年通信'], descriptions: ['打开第一枚记忆胶囊。', '五封延迟消息抵达。', '二十次收到过去的自己。', '百枚时间胶囊完成投递。', '你与多个年份保持通信。'], targets: [1, 5, 20, 100, 300], icon: 'mail' },
  { key: 'early', metric: 'morningSaves', titles: ['晨光上线', '早班观察员', '清晨采集者', '日出档案局', '黎明守门人'], descriptions: ['清晨完成一次记录。', '十个早晨被保存。', '五十次在城市醒来时在线。', '两百道晨光进入档案。', '你见证过无数次世界启动。'], targets: [1, 10, 50, 200, 500], icon: 'sunrise', secret: true },
  { key: 'mood', metric: 'moodsUsed', titles: ['心情命名', '情绪词典', '内在天气站', '感受制图师', '心海观测台'], descriptions: ['为感受选出第一个名字。', '使用十种不同情绪标签。', '二十种内在天气得到辨认。', '大量情绪变化形成地图。', '你学会不评判地观察心海。'], targets: [1, 10, 20, 30, 50], icon: 'gauge' },
  { key: 'export', metric: 'exports', titles: ['逃生舱测试', '备份意识', '档案双保险', '可靠管理员', '时间保全官'], descriptions: ['完成第一次数据导出。', '备份五次人生档案。', '二十次验证数据可带走。', '百次守护本地记录。', '你从不把记忆交给运气。'], targets: [1, 5, 20, 100, 300], icon: 'download' },
  { key: 'longStory', metric: 'storyCharacters', titles: ['多写一句', '千字生活', '长文存档', '十万字人生', '私人史诗'], descriptions: ['一条故事超过两百字。', '累计写下千字生活。', '文字记录达到一万字。', '十万字组成私人长篇。', '百万字符保存了你的时代。'], targets: [200, 1000, 10000, 100000, 1000000], icon: 'pen-line' },
  { key: 'weekend', metric: 'weekendSaves', titles: ['周末在场', '休息日记者', '周末采样员', '假日档案', '自由时间史'], descriptions: ['周末保存一次生活。', '十个周末留下记录。', '五十次休息日有迹可循。', '两百个周末组成另一条线。', '你为自由时间写下漫长历史。'], targets: [1, 10, 50, 200, 500], icon: 'coffee' },
  { key: 'anniversary', metric: 'anniversaries', titles: ['重要日期', '纪念日看守', '时间的结', '百日铭刻', '岁月纪念馆'], descriptions: ['设置第一个纪念日。', '五个日期被认真记住。', '二十段关系与事件拥有坐标。', '一百个重要日期进入提醒。', '你为时间中的连接建起纪念馆。'], targets: [1, 5, 20, 100, 300], icon: 'calendar-heart' },
]

const rarities: Rarity[] = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY']

/** 22 条成长轨道 × 5 个阶段，共 110 项成就。 */
export const achievements: Achievement[] = tracks.flatMap((track) =>
  track.targets.map((target, index) => ({
    id: `achievement-${track.key}-${index + 1}`,
    title: track.titles[index],
    description: track.descriptions[index],
    rarity: rarities[index],
    secret: Boolean(track.secret),
    icon: track.icon,
    progress: 0,
    target,
  })),
)

export const achievementMetrics = Object.fromEntries(tracks.map((track) => [track.key, track.metric]))
