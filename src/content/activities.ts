import type { Activity, Rarity } from '../types'

interface ActivitySeed {
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
}

interface ActivityEdition {
  key: string
  titleSuffix: string
  lead: string
  ending: string
  durationFactor: number
  costFactor: number
  energyAdjust: number
  socialAdjust: number
  weightFactor: number
}

const seeds: ActivitySeed[] = [
  {
    title: '给清晨留十分钟空白',
    description: '不急着碰手机，拉开窗帘，听一会儿城市刚醒来的声音。',
    category: '休息充电', duration: 15, cost: 0, energy: 2, social: 0,
    location: ['家中', '窗边'], mood: ['疲惫', '平静', '迷茫'], weather: ['任意'], rarity: 'COMMON', tags: ['独处', '晨间', '低门槛'],
  },
  {
    title: '泡一杯慢慢喝完的茶',
    description: '选喜欢的杯子，把水温、香气和第一口的味道都认真记住。',
    category: '休息充电', duration: 25, cost: 8, energy: 2, social: 0,
    location: ['家中', '办公室', '咖啡店'], mood: ['焦虑', '平静'], weather: ['阴', '雨', '任意'], rarity: 'COMMON', tags: ['饮品', '正念', '慢生活'],
  },
  {
    title: '进行一场无屏幕午休',
    description: '把设备翻面，闭眼或望向远处，让过载的注意力真正歇班。',
    category: '休息充电', duration: 30, cost: 0, energy: 3, social: -1,
    location: ['家中', '办公室', '校园'], mood: ['疲惫', '烦躁'], weather: ['任意'], rarity: 'COMMON', tags: ['无屏幕', '午间', '恢复'],
  },
  {
    title: '听完整张专辑',
    description: '从第一轨到最后一轨不切歌，看看音乐会把思绪带到哪里。',
    category: '休息充电', duration: 50, cost: 0, energy: 1, social: 0,
    location: ['家中', '通勤途中', '公园'], mood: ['低落', '怀旧', '平静'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['音乐', '沉浸', '独处'],
  },
  {
    title: '做一次热水泡脚',
    description: '把水调到舒服的温度，给今天走过很多路的双脚一点奖励。',
    category: '休息充电', duration: 25, cost: 3, energy: 2, social: 0,
    location: ['家中'], mood: ['疲惫', '寒冷'], weather: ['雨', '雪', '寒冷'], rarity: 'COMMON', tags: ['身体', '夜间', '自我照顾'],
  },
  {
    title: '去窗边晒一小块太阳',
    description: '找到光落下的位置坐一会儿，让肩膀和眉头都松开。',
    category: '休息充电', duration: 20, cost: 0, energy: 2, social: 0,
    location: ['家中', '办公室', '图书馆'], mood: ['低落', '疲惫'], weather: ['晴'], rarity: 'COMMON', tags: ['阳光', '身体', '低门槛'],
  },
  {
    title: '安排一个提早熄灯夜',
    description: '把明天要用的东西准备好，比平时更早结束今天的营业。',
    category: '休息充电', duration: 45, cost: 0, energy: 3, social: -1,
    location: ['家中'], mood: ['疲惫', '过载'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['睡眠', '夜间', '恢复'],
  },
  {
    title: '沿着呼吸数到一百',
    description: '不追求清空大脑，只在走神后轻轻回到下一个数字。',
    category: '休息充电', duration: 12, cost: 0, energy: 1, social: 0,
    location: ['任意安静处'], mood: ['焦虑', '烦躁', '紧张'], weather: ['任意'], rarity: 'COMMON', tags: ['呼吸', '正念', '随时'],
  },
  {
    title: '重温一集熟悉的动画',
    description: '挑一集已经知道结局的故事，在确定性里得到片刻安全感。',
    category: '休息充电', duration: 28, cost: 0, energy: 1, social: 0,
    location: ['家中'], mood: ['低落', '怀旧', '孤独'], weather: ['任意'], rarity: 'COMMON', tags: ['动画', '怀旧', '舒适区'],
  },
  {
    title: '允许自己认真发呆',
    description: '设一个温柔的计时器，不学习、不产出，也不为停下来道歉。',
    category: '休息充电', duration: 20, cost: 0, energy: 2, social: 0,
    location: ['家中', '公园', '天台'], mood: ['过载', '迷茫'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['留白', '独处', '反内耗'],
  },

  {
    title: '画一张五分钟速写',
    description: '随手选眼前的物品，只观察形状和光影，不给作品打分。',
    category: '创造表达', duration: 15, cost: 2, energy: 1, social: 0,
    location: ['家中', '咖啡店', '户外'], mood: ['无聊', '好奇'], weather: ['任意'], rarity: 'COMMON', tags: ['绘画', '观察', '低门槛'],
  },
  {
    title: '写一首只有四行的诗',
    description: '从今天见过的一种颜色开始，让四行文字留下当天的体温。',
    category: '创造表达', duration: 20, cost: 0, energy: 1, social: 0,
    location: ['任意'], mood: ['敏感', '浪漫', '低落'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['写作', '诗歌', '记录'],
  },
  {
    title: '为本周制作一张拼贴',
    description: '收集票根、包装、截图与照片，把零散日子拼成一张地图。',
    category: '创造表达', duration: 55, cost: 15, energy: 2, social: 0,
    location: ['家中', '工作室'], mood: ['怀旧', '满足'], weather: ['雨', '阴', '任意'], rarity: 'RARE', tags: ['手作', '拼贴', '纪念'],
  },
  {
    title: '拍摄同一种颜色',
    description: '出门寻找十个相同色系的细节，组成一套微型摄影专题。',
    category: '创造表达', duration: 45, cost: 0, energy: 2, social: 0,
    location: ['街区', '公园', '商场'], mood: ['好奇', '无聊'], weather: ['晴', '阴'], rarity: 'UNCOMMON', tags: ['摄影', '散步', '观察'],
  },
  {
    title: '给虚构角色写一封信',
    description: '告诉那位陪过你的角色，最近的生活发生了什么变化。',
    category: '创造表达', duration: 35, cost: 0, energy: 1, social: 0,
    location: ['家中', '图书馆'], mood: ['怀旧', '孤独', '感激'], weather: ['任意'], rarity: 'RARE', tags: ['写作', '二次元', '情感'],
  },
  {
    title: '设计一枚私人徽章',
    description: '把最近最珍惜的品质变成图形、配色和一句小小的铭文。',
    category: '创造表达', duration: 50, cost: 5, energy: 2, social: 0,
    location: ['家中', '工作室'], mood: ['坚定', '好奇'], weather: ['任意'], rarity: 'RARE', tags: ['设计', '身份', '手作'],
  },
  {
    title: '录一段城市环境音',
    description: '收下路口、车站或夜市的一分钟声音，给未来留一扇听觉窗口。',
    category: '创造表达', duration: 30, cost: 0, energy: 1, social: 0,
    location: ['街区', '车站', '夜市'], mood: ['好奇', '平静'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['声音', '城市', '采集'],
  },
  {
    title: '用冰箱库存发明一道菜',
    description: '不照搬菜谱，用现有食材完成一份只属于今晚的实验料理。',
    category: '创造表达', duration: 60, cost: 10, energy: 3, social: 1,
    location: ['家中'], mood: ['好奇', '兴奋'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['料理', '实验', '生活技能'],
  },
  {
    title: '制作三首歌的微型歌单',
    description: '给一个具体场景选开场、转折与片尾，并认真命名。',
    category: '创造表达', duration: 25, cost: 0, energy: 1, social: 0,
    location: ['任意'], mood: ['浪漫', '怀旧', '兴奋'], weather: ['任意'], rarity: 'COMMON', tags: ['音乐', '策展', '分享'],
  },
  {
    title: '把梦改写成电影梗概',
    description: '记下梦里最荒诞的一幕，为它补上片名、主角和结局。',
    category: '创造表达', duration: 30, cost: 0, energy: 1, social: 0,
    location: ['家中'], mood: ['迷离', '好奇'], weather: ['任意'], rarity: 'RARE', tags: ['写作', '梦境', '故事'],
  },

  {
    title: '走一条没走过的小路',
    description: '在熟悉街区拐进安全但陌生的方向，观察三处新细节。',
    category: '户外行动', duration: 40, cost: 0, energy: 3, social: 0,
    location: ['街区'], mood: ['无聊', '好奇'], weather: ['晴', '阴'], rarity: 'COMMON', tags: ['散步', '探索', '附近'],
  },
  {
    title: '去公园追一次落日',
    description: '查好日落时间，带水出门，看天空怎样一点点换颜色。',
    category: '户外行动', duration: 70, cost: 5, energy: 3, social: 1,
    location: ['公园', '江边', '山顶'], mood: ['浪漫', '低落', '平静'], weather: ['晴', '多云'], rarity: 'UNCOMMON', tags: ['落日', '自然', '仪式感'],
  },
  {
    title: '进行一场慢速骑行',
    description: '不拼速度也不看里程，沿安全路线骑到身体微微发热。',
    category: '户外行动', duration: 60, cost: 5, energy: 4, social: 1,
    location: ['绿道', '公园', '郊外'], mood: ['烦躁', '兴奋'], weather: ['晴', '阴'], rarity: 'UNCOMMON', tags: ['骑行', '运动', '风'],
  },
  {
    title: '在树下读二十页书',
    description: '找一处安全阴凉的座位，让纸页和树叶一起被风翻动。',
    category: '户外行动', duration: 50, cost: 0, energy: 2, social: 0,
    location: ['公园', '校园'], mood: ['平静', '专注'], weather: ['晴', '多云'], rarity: 'UNCOMMON', tags: ['阅读', '自然', '独处'],
  },
  {
    title: '捡一片季节的证据',
    description: '寻找一片落叶、一颗果实或一朵落花，拍照后留在原处。',
    category: '户外行动', duration: 30, cost: 0, energy: 2, social: 0,
    location: ['公园', '街区', '校园'], mood: ['好奇', '平静'], weather: ['任意'], rarity: 'COMMON', tags: ['四季', '观察', '摄影'],
  },
  {
    title: '完成一次夜间安全散步',
    description: '选明亮熟悉的路线，戴好反光物，让晚风替今天收尾。',
    category: '户外行动', duration: 35, cost: 0, energy: 2, social: 0,
    location: ['小区', '街区'], mood: ['烦躁', '清醒'], weather: ['晴', '多云'], rarity: 'UNCOMMON', tags: ['夜晚', '散步', '安全'],
  },
  {
    title: '去市场挑一种当季水果',
    description: '问问摊主最近什么最好吃，带回一种平时不会选的味道。',
    category: '户外行动', duration: 45, cost: 25, energy: 2, social: 2,
    location: ['菜市场', '水果店'], mood: ['平淡', '好奇'], weather: ['任意'], rarity: 'COMMON', tags: ['市场', '季节', '食物'],
  },
  {
    title: '观察一轮月相',
    description: '找到今晚的月亮，辨认它的形状并留下一张带时间的照片。',
    category: '户外行动', duration: 25, cost: 0, energy: 1, social: 0,
    location: ['阳台', '天台', '户外'], mood: ['浪漫', '迷茫'], weather: ['晴', '多云'], rarity: 'RARE', tags: ['月亮', '夜晚', '观察'],
  },
  {
    title: '登上城市里的一段台阶',
    description: '找一处公共楼梯或缓坡，稳稳走完，再回头看抵达的高度。',
    category: '户外行动', duration: 40, cost: 0, energy: 4, social: 0,
    location: ['公园', '城市步道'], mood: ['坚定', '烦躁'], weather: ['晴', '阴'], rarity: 'UNCOMMON', tags: ['运动', '挑战', '城市'],
  },
  {
    title: '替未来拍一张街景',
    description: '选择每天经过的角落，认真构图，记录此刻普通却会改变的样子。',
    category: '户外行动', duration: 30, cost: 0, energy: 1, social: 0,
    location: ['街区', '通勤途中'], mood: ['怀旧', '平静'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['摄影', '时间', '城市'],
  },

  {
    title: '约一个人吃顿便饭',
    description: '不用等待隆重理由，问问对方是否愿意一起吃最近想吃的东西。',
    category: '关系连接', duration: 90, cost: 60, energy: 2, social: 4,
    location: ['餐厅', '家中', '食堂'], mood: ['孤独', '开心'], weather: ['任意'], rarity: 'COMMON', tags: ['朋友', '吃饭', '陪伴'],
  },
  {
    title: '给许久未见的人发问候',
    description: '从一件真实想起对方的小事说起，不用勉强把聊天变得很长。',
    category: '关系连接', duration: 15, cost: 0, energy: 1, social: 2,
    location: ['任意'], mood: ['怀旧', '勇敢'], weather: ['任意'], rarity: 'COMMON', tags: ['联络', '老朋友', '真诚'],
  },
  {
    title: '交换一首最近循环的歌',
    description: '把歌发给一个合适的人，也认真听完对方回赠的那一首。',
    category: '关系连接', duration: 20, cost: 0, energy: 1, social: 2,
    location: ['线上', '任意'], mood: ['浪漫', '开心', '孤独'], weather: ['任意'], rarity: 'COMMON', tags: ['音乐', '分享', '朋友'],
  },
  {
    title: '进行一次不抢答的倾听',
    description: '让对方把一件事讲完，先确认感受，再决定是否给建议。',
    category: '关系连接', duration: 35, cost: 0, energy: 2, social: 4,
    location: ['任意安静处', '线上'], mood: ['关心', '平静'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['倾听', '沟通', '信任'],
  },
  {
    title: '和家人核对一段旧记忆',
    description: '选一张旧照片，听听每个人记住的细节为何不太一样。',
    category: '关系连接', duration: 45, cost: 0, energy: 1, social: 3,
    location: ['家中', '线上'], mood: ['怀旧', '温暖'], weather: ['任意'], rarity: 'RARE', tags: ['家人', '旧照片', '故事'],
  },
  {
    title: '发出一次具体的感谢',
    description: '说清楚对方做了什么、带来什么影响，让感谢不只停在客套。',
    category: '关系连接', duration: 15, cost: 0, energy: 1, social: 2,
    location: ['任意'], mood: ['感激', '温暖'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['感谢', '表达', '善意'],
  },
  {
    title: '组织一局轻松桌游',
    description: '选规则不复杂的游戏，提前约定输赢只负责制造笑声。',
    category: '关系连接', duration: 120, cost: 30, energy: 3, social: 5,
    location: ['家中', '桌游店', '咖啡店'], mood: ['无聊', '兴奋'], weather: ['雨', '阴', '任意'], rarity: 'UNCOMMON', tags: ['桌游', '聚会', '朋友'],
  },
  {
    title: '散步时进行一次深聊',
    description: '并肩走比面对面更松弛，可以从最近最占心的一件事聊起。',
    category: '关系连接', duration: 70, cost: 10, energy: 3, social: 4,
    location: ['公园', '街区', '江边'], mood: ['迷茫', '孤独'], weather: ['晴', '阴'], rarity: 'RARE', tags: ['深聊', '散步', '朋友'],
  },
  {
    title: '为朋友拍一张好照片',
    description: '先问对方喜欢怎样的自己，再耐心找到自然的光和表情。',
    category: '关系连接', duration: 35, cost: 0, energy: 2, social: 3,
    location: ['户外', '咖啡店', '家中'], mood: ['开心', '自信'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['摄影', '朋友', '看见'],
  },
  {
    title: '一起完成一件小事',
    description: '邀请某个人共同做饭、整理或采购，让陪伴落在具体生活里。',
    category: '关系连接', duration: 60, cost: 20, energy: 2, social: 4,
    location: ['家中', '商店'], mood: ['平淡', '温暖'], weather: ['任意'], rarity: 'COMMON', tags: ['协作', '陪伴', '日常'],
  },

  {
    title: '学会一个键盘快捷键',
    description: '挑每天重复的电脑操作，练到今天之内能自然使用三次。',
    category: '成长练习', duration: 15, cost: 0, energy: 1, social: 0,
    location: ['家中', '办公室'], mood: ['专注', '平淡'], weather: ['任意'], rarity: 'COMMON', tags: ['技能', '效率', '微学习'],
  },
  {
    title: '看懂一个陌生概念',
    description: '用可靠资料查清定义，再试着用自己的话向虚拟听众解释。',
    category: '成长练习', duration: 40, cost: 0, energy: 3, social: 0,
    location: ['家中', '图书馆'], mood: ['好奇', '专注'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['学习', '理解', '知识'],
  },
  {
    title: '复盘一次小小失误',
    description: '区分事实、情绪和下次动作，不把一次失误升级成对自己的判决。',
    category: '成长练习', duration: 25, cost: 0, energy: 2, social: 0,
    location: ['任意安静处'], mood: ['沮丧', '后悔'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['复盘', '成长', '反内耗'],
  },
  {
    title: '读一篇长文章并做批注',
    description: '关掉碎片消息，圈出三个新观点和一个暂时不同意的地方。',
    category: '成长练习', duration: 50, cost: 0, energy: 3, social: 0,
    location: ['图书馆', '家中', '咖啡店'], mood: ['专注', '好奇'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['阅读', '思考', '深度'],
  },
  {
    title: '练习一种拒绝说法',
    description: '写下礼貌、清楚、不需要过度解释的版本，并大声读一遍。',
    category: '成长练习', duration: 20, cost: 0, energy: 2, social: 1,
    location: ['家中'], mood: ['紧张', '坚定'], weather: ['任意'], rarity: 'RARE', tags: ['边界', '沟通', '勇气'],
  },
  {
    title: '完成二十五分钟专注冲刺',
    description: '只选一个边界清晰的任务，在计时结束前不新增支线。',
    category: '成长练习', duration: 30, cost: 0, energy: 3, social: -1,
    location: ['家中', '办公室', '图书馆'], mood: ['拖延', '专注'], weather: ['任意'], rarity: 'COMMON', tags: ['专注', '行动', '番茄钟'],
  },
  {
    title: '整理一页个人知识笔记',
    description: '把最近收藏却没消化的内容，改写成以后真能看懂的一页。',
    category: '成长练习', duration: 45, cost: 0, energy: 3, social: 0,
    location: ['家中', '图书馆'], mood: ['专注', '平静'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['笔记', '整理', '学习'],
  },
  {
    title: '向熟手请教一个具体问题',
    description: '先说明已经尝试过什么，再提出一个对方容易回答的小问题。',
    category: '成长练习', duration: 25, cost: 0, energy: 2, social: 2,
    location: ['线上', '工作场所'], mood: ['困惑', '勇敢'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['请教', '沟通', '学习'],
  },
  {
    title: '为下个月设一个实验',
    description: '不立宏大誓言，只写清想验证的假设、最小行动和结束日期。',
    category: '成长练习', duration: 35, cost: 0, energy: 2, social: 0,
    location: ['任意安静处'], mood: ['迷茫', '期待'], weather: ['任意'], rarity: 'RARE', tags: ['计划', '实验', '目标'],
  },
  {
    title: '练习十分钟新语言',
    description: '选一个真实生活场景，学会五个词和一句马上能用的表达。',
    category: '成长练习', duration: 15, cost: 0, energy: 2, social: 0,
    location: ['任意'], mood: ['好奇', '专注'], weather: ['任意'], rarity: 'COMMON', tags: ['语言', '微学习', '练习'],
  },

  {
    title: '拜访一家独立书店',
    description: '不带必买清单，看看店员把哪些书放在最想被发现的位置。',
    category: '城市探索', duration: 75, cost: 35, energy: 2, social: 1,
    location: ['书店'], mood: ['好奇', '平静'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['书店', '城市', '发现'],
  },
  {
    title: '乘公交坐过熟悉的一站',
    description: '白天选择安全线路，多坐一站下车，在附近完成一次短探索。',
    category: '城市探索', duration: 60, cost: 4, energy: 3, social: 0,
    location: ['公交', '陌生街区'], mood: ['好奇', '勇敢'], weather: ['晴', '阴'], rarity: 'RARE', tags: ['公交', '随机', '探索'],
  },
  {
    title: '寻找一栋有趣的老建筑',
    description: '观察门窗、材料和留下的年代痕迹，只在公共区域拍照。',
    category: '城市探索', duration: 70, cost: 10, energy: 3, social: 0,
    location: ['历史街区', '城市'], mood: ['好奇', '怀旧'], weather: ['晴', '阴'], rarity: 'UNCOMMON', tags: ['建筑', '历史', '摄影'],
  },
  {
    title: '试一家没去过的早餐店',
    description: '比平时早一点出门，点一份本地人常吃而你没试过的早餐。',
    category: '城市探索', duration: 50, cost: 25, energy: 2, social: 1,
    location: ['早餐店', '街区'], mood: ['期待', '好奇'], weather: ['任意'], rarity: 'COMMON', tags: ['早餐', '味觉', '附近'],
  },
  {
    title: '逛一次小型展览',
    description: '给自己四十分钟，只选一件作品认真阅读和停留。',
    category: '城市探索', duration: 90, cost: 40, energy: 2, social: 1,
    location: ['美术馆', '画廊', '文化空间'], mood: ['好奇', '平静'], weather: ['任意'], rarity: 'RARE', tags: ['展览', '艺术', '观察'],
  },
  {
    title: '发现一处免费的城市座椅',
    description: '寻找可以自在停留的公共空间，坐下观察十分钟人来人往。',
    category: '城市探索', duration: 35, cost: 0, energy: 1, social: 0,
    location: ['广场', '公园', '街区'], mood: ['平静', '无聊'], weather: ['晴', '阴'], rarity: 'COMMON', tags: ['公共空间', '观察', '免费'],
  },
  {
    title: '按气味寻找一家面包店',
    description: '在街区慢慢走，让烘烤香气做导航，挑一个刚出炉的小东西。',
    category: '城市探索', duration: 45, cost: 20, energy: 2, social: 1,
    location: ['街区', '面包店'], mood: ['期待', '开心'], weather: ['晴', '阴', '寒冷'], rarity: 'UNCOMMON', tags: ['面包', '感官', '散步'],
  },
  {
    title: '走进一家旧物店',
    description: '选一件不购买也能欣赏的旧物，猜猜它曾经参与过怎样的生活。',
    category: '城市探索', duration: 55, cost: 10, energy: 2, social: 1,
    location: ['旧物店', '跳蚤市场'], mood: ['怀旧', '好奇'], weather: ['任意'], rarity: 'RARE', tags: ['旧物', '想象', '城市'],
  },
  {
    title: '收集三枚城市印章',
    description: '查找开放的盖章点，用一页纸串起一条轻量探索路线。',
    category: '城市探索', duration: 120, cost: 20, energy: 4, social: 1,
    location: ['文创店', '博物馆', '车站'], mood: ['兴奋', '好奇'], weather: ['任意'], rarity: 'EPIC', tags: ['盖章', '收集', '路线'],
  },
  {
    title: '在雨后寻找倒影',
    description: '等雨势安全变小，去水洼与玻璃里捕捉一座上下颠倒的城市。',
    category: '城市探索', duration: 45, cost: 0, energy: 2, social: 0,
    location: ['街区', '广场'], mood: ['浪漫', '好奇'], weather: ['雨后'], rarity: 'RARE', tags: ['摄影', '雨后', '城市'],
  },

  {
    title: '清空一个杂物抽屉',
    description: '只处理一个边界明确的小空间，为每件留下的东西安排位置。',
    category: '居家焕新', duration: 35, cost: 0, energy: 3, social: 0,
    location: ['家中'], mood: ['烦躁', '拖延'], weather: ['任意'], rarity: 'COMMON', tags: ['整理', '空间', '完成感'],
  },
  {
    title: '换一次床品',
    description: '洗晒或更换枕套床单，让今晚拥有刚刚刷新过的触感。',
    category: '居家焕新', duration: 40, cost: 5, energy: 3, social: 0,
    location: ['家中'], mood: ['疲惫', '平淡'], weather: ['晴', '任意'], rarity: 'COMMON', tags: ['清洁', '睡眠', '焕新'],
  },
  {
    title: '给房间换一种气味',
    description: '先通风，再用鲜花、茶叶或安全香氛创造今天的空间记忆。',
    category: '居家焕新', duration: 25, cost: 15, energy: 1, social: 0,
    location: ['家中'], mood: ['烦躁', '浪漫'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['气味', '空间', '仪式感'],
  },
  {
    title: '整理手机第一屏',
    description: '移走会无意识点开的入口，只留下真正想主动使用的工具。',
    category: '居家焕新', duration: 25, cost: 0, energy: 2, social: 0,
    location: ['任意'], mood: ['过载', '烦躁'], weather: ['任意'], rarity: 'COMMON', tags: ['数字整理', '手机', '注意力'],
  },
  {
    title: '修好一件拖延的小物',
    description: '缝扣子、换电池或拧紧螺丝，结束一件反复提醒你的微小故障。',
    category: '居家焕新', duration: 30, cost: 10, energy: 2, social: 0,
    location: ['家中'], mood: ['拖延', '坚定'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['维修', '动手', '完成感'],
  },
  {
    title: '为植物做一次体检',
    description: '检查土壤、叶片和光照，只按需要浇水并擦去灰尘。',
    category: '居家焕新', duration: 25, cost: 5, energy: 1, social: 0,
    location: ['家中', '阳台'], mood: ['平静', '关心'], weather: ['任意'], rarity: 'COMMON', tags: ['植物', '照料', '观察'],
  },
  {
    title: '做一顿颜色丰富的饭',
    description: '让餐盘至少出现三种天然颜色，兼顾好吃、饱足与营养。',
    category: '居家焕新', duration: 55, cost: 35, energy: 3, social: 1,
    location: ['家中'], mood: ['疲惫', '平淡'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['料理', '健康', '色彩'],
  },
  {
    title: '把一面墙变成临时展区',
    description: '用可移除方式展示近期照片、画作或一句值得多看几次的话。',
    category: '居家焕新', duration: 50, cost: 20, energy: 2, social: 0,
    location: ['家中'], mood: ['无聊', '期待'], weather: ['任意'], rarity: 'RARE', tags: ['布置', '展览', '个性'],
  },
  {
    title: '建立一个离家检查点',
    description: '给钥匙、耳机和证件设置固定位置，减少明天出门前的混乱。',
    category: '居家焕新', duration: 25, cost: 5, energy: 2, social: 0,
    location: ['家中'], mood: ['健忘', '焦虑'], weather: ['任意'], rarity: 'COMMON', tags: ['收纳', '习惯', '效率'],
  },
  {
    title: '进行十五分钟快速清洁',
    description: '计时处理最影响心情的表面，铃响就停，不把夜晚变成大扫除。',
    category: '居家焕新', duration: 20, cost: 0, energy: 3, social: 0,
    location: ['家中'], mood: ['烦躁', '拖延'], weather: ['任意'], rarity: 'COMMON', tags: ['清洁', '限时', '低门槛'],
  },

  {
    title: '掷骰子决定甜品',
    description: '为六种可接受的小甜品编号，让随机数替选择困难按下确认键。',
    category: '趣味随机', duration: 35, cost: 25, energy: 1, social: 1,
    location: ['家中', '商店', '咖啡店'], mood: ['无聊', '纠结'], weather: ['任意'], rarity: 'COMMON', tags: ['随机', '甜品', '选择'],
  },
  {
    title: '用非惯用手画自画像',
    description: '接受线条失控，给这张笨拙但诚实的脸起一个正式作品名。',
    category: '趣味随机', duration: 20, cost: 2, energy: 1, social: 0,
    location: ['家中', '咖啡店'], mood: ['无聊', '好奇'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['绘画', '搞怪', '挑战'],
  },
  {
    title: '给今天配一句弹幕',
    description: '把此刻当作动画截图，写下一句观众路过时会发出的弹幕。',
    category: '趣味随机', duration: 10, cost: 0, energy: 0, social: 0,
    location: ['任意'], mood: ['任意'], weather: ['任意'], rarity: 'COMMON', tags: ['二次元', '记录', '幽默'],
  },
  {
    title: '寻找现实里的隐藏任务',
    description: '观察周围谁需要举手之劳，在安全和自愿的前提下悄悄完成。',
    category: '趣味随机', duration: 25, cost: 0, energy: 2, social: 2,
    location: ['任意公共空间'], mood: ['无聊', '温暖'], weather: ['任意'], rarity: 'RARE', tags: ['善意', '游戏化', '观察'],
  },
  {
    title: '按首字母挑一本书',
    description: '用今天日期对应的字母或拼音，在书架上随机遇见一本书。',
    category: '趣味随机', duration: 35, cost: 0, energy: 1, social: 0,
    location: ['图书馆', '书店', '家中'], mood: ['好奇', '无聊'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['书', '随机', '探索'],
  },
  {
    title: '模仿电影镜头走一段路',
    description: '选一首配乐，把普通的五分钟通勤想象成主角登场长镜头。',
    category: '趣味随机', duration: 15, cost: 0, energy: 1, social: 0,
    location: ['通勤途中', '街区'], mood: ['平淡', '自信'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['电影感', '音乐', '想象'],
  },
  {
    title: '完成一次十元寻宝',
    description: '在预算内寻找一件能让今天变有趣的小物，买不到也算发现。',
    category: '趣味随机', duration: 45, cost: 10, energy: 2, social: 1,
    location: ['便利店', '市场', '文具店'], mood: ['无聊', '好奇'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['预算', '寻宝', '小物'],
  },
  {
    title: '给路过的云朵命名',
    description: '停下来观察天空，为三朵云取名并编一句极短的身世。',
    category: '趣味随机', duration: 15, cost: 0, energy: 0, social: 0,
    location: ['户外', '窗边'], mood: ['无聊', '浪漫'], weather: ['多云', '晴'], rarity: 'COMMON', tags: ['天空', '想象', '低门槛'],
  },
  {
    title: '和昨天的自己猜拳',
    description: '先写下昨天会出的手，再现场出拳；输的一方负责做一件小善事。',
    category: '趣味随机', duration: 10, cost: 0, energy: 1, social: 0,
    location: ['任意'], mood: ['无聊', '纠结'], weather: ['任意'], rarity: 'RARE', tags: ['脑洞', '随机', '自我对话'],
  },
  {
    title: '拍一张没有主角的合照',
    description: '邀请同行者只拍鞋尖、影子或手里的东西，记录大家共同在场。',
    category: '趣味随机', duration: 15, cost: 0, energy: 1, social: 3,
    location: ['任意'], mood: ['开心', '温暖'], weather: ['任意'], rarity: 'UNCOMMON', tags: ['摄影', '朋友', '创意'],
  },
]

const editions: ActivityEdition[] = [
  {
    key: 'classic', titleSuffix: '',
    lead: '按自己的节奏开始。', ending: '结束后，用一句话保存最清楚的感受。',
    durationFactor: 1, costFactor: 1, energyAdjust: 0, socialAdjust: 0, weightFactor: 1,
  },
  {
    key: 'micro', titleSuffix: ' · 轻量版',
    lead: '今天只做最小可行版本，不必准备齐全。', ending: '做到一半也算有效进度，给自己留下一枚小小的完成标记。',
    durationFactor: 0.55, costFactor: 0.65, energyAdjust: -1, socialAdjust: 0, weightFactor: 1.25,
  },
  {
    key: 'immersive', titleSuffix: ' · 沉浸版',
    lead: '暂时收起通知，为这件事腾出一段完整时间。', ending: '多停留十分钟，注意那些平时会被略过的声音、颜色或心情。',
    durationFactor: 1.65, costFactor: 1.2, energyAdjust: 1, socialAdjust: 0, weightFactor: 0.72,
  },
  {
    key: 'shared', titleSuffix: ' · 同行版',
    lead: '邀请一个不会让你紧绷的人同行，也尊重对方拒绝。', ending: '交换彼此观察到的一处细节，不要求感受完全相同。',
    durationFactor: 1.25, costFactor: 1.6, energyAdjust: 1, socialAdjust: 2, weightFactor: 0.86,
  },
]

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * 80 个独立活动概念 × 4 种有明确体验差异的玩法，共 320 条完整 Activity。
 * 数组在模块加载时即展开，调用方无需二次生成。
 */
export const activities: Activity[] = seeds.flatMap((seed, seedIndex) =>
  editions.map((edition) => ({
    id: `activity-${String(seedIndex + 1).padStart(3, '0')}-${edition.key}`,
    title: `${seed.title}${edition.titleSuffix}`,
    description: `${edition.lead}${seed.description}${edition.ending}`,
    category: seed.category,
    duration: Math.max(5, Math.round((seed.duration * edition.durationFactor) / 5) * 5),
    cost: Math.max(0, Math.round(seed.cost * edition.costFactor)),
    energy: clamp(seed.energy + edition.energyAdjust, -5, 5),
    social: clamp(seed.social + edition.socialAdjust, -5, 5),
    location: [...seed.location],
    mood: [...seed.mood],
    weather: [...seed.weather],
    rarity: edition.key === 'immersive' && seed.rarity === 'COMMON' ? 'UNCOMMON' : seed.rarity,
    tags: [...seed.tags, edition.key],
    baseWeight: Number((1 * edition.weightFactor).toFixed(2)),
  })),
)

export const activityCategories = [...new Set(activities.map((item) => item.category))]
