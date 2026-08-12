# LIFE//SAVE — 人生存档系统

> YOUR LIFE IS STILL LOADING.

LIFE//SAVE 是一个 Local‑First 的个人生活记录、人物关系图鉴、智能决策助手与现实人生 RPG 存档系统。它不要求注册，默认不上传个人数据；使用越久，时间线、关系网络、世界地图、选择历史、任务记录与人生统计就越有价值。

## 在线体验

[打开 LIFE//SAVE](https://xiayuwu.github.io/life-save/)；首次进入可创建自己的本地存档，或加载 Demo Mode 查看完整数据效果。

## 核心能力

- **Life Save**：完整每日存档、Quick Save、20+ 情绪、人物/地点/决定/任务关联、照片压缩
- **Character Archive**：人物卡、BOND、关系详情、共同事件与 Relationship Galaxy
- **Timeline & Chapter**：按日/月/年/章节筛选，构建可检索的人生时间线
- **Decision Lab**：命运、理性、感性、长期主义、YOLO、摆烂六种模式；包含“硬币已经抛出去了”和情景模拟
- **Quest & Achievements**：主线、支线、每日、随机任务，稀有度与隐藏成就
- **My World**：地点图鉴、访问记录、共同人物与记忆强度
- **Statistics**：情绪趋势、365 天热力图、关键词、月度统计与年度结算
- **Archive & Search**：跨人物、事件、地点、标签、任务和决定的全局搜索
- **Memory**：未来胶囊、往年今日、随机记忆与长期未记录关系提示
- **Data Ownership**：IndexedDB + Dexie、完整 JSON 导出、验证、迁移、合并/覆盖导入、自动备份
- **PWA**：可安装、离线访问、HashRouter 支持 GitHub Pages 刷新
- **Content Engine**：大规模系统文案、活动、任务、成就、称号与去重复随机算法

## 内容规模

内置 100+ 系统短句、300+ 活动、150+ 随机任务、100+ 成就、100+ 称号规则、100+ 人生问题、100+ 决策文案、80+ 关系提示、100+ 年度总结句式与 100+ Quick Save 标签。最近 20 次抽取会被记录并动态降低权重，避免连续重复。

## 技术栈

React、TypeScript、Vite、React Router、Zustand、Dexie / IndexedDB、Framer Motion、Recharts、Lucide Icons、vite-plugin-pwa、Vitest、ESLint、Prettier。

## 开发

需要 Node.js 20+ 与 pnpm：

```bash
pnpm install
pnpm dev
```

完整质量检查：

```bash
pnpm lint
pnpm test
pnpm build
pnpm preview
```

## 部署

`.github/workflows/deploy.yml` 会在 `main` 分支更新后自动执行安装、lint、测试、构建并部署到 GitHub Pages。Vite `base` 会自动使用仓库子路径；应用使用 `HashRouter`，因此直接访问和刷新功能页均不会产生 404。

## 数据与隐私

数据默认只保存在当前浏览器的 IndexedDB 中。图片会生成缩略图并优先压缩为 WebP。Settings 可导出带 schema 版本的完整 JSON，也可以在导入前检查数据量并选择 MERGE 或 REPLACE。清除浏览器数据仍可能删除本地存档，因此建议定期下载备份。

LIFE//SAVE 的心情、关系与决策统计仅作数据描述和自我观察，不提供医疗、心理、财务或其他专业判断。

## Roadmap

- 可选 WebDAV / GitHub Gist / Supabase 同步适配器
- 可选端到端加密云备份
- 更丰富的年度 Wrapped 动效模板
- 地理地图适配器与离线地图
- 多存档槽位与家庭共享导出

## License

[MIT](./LICENSE)
