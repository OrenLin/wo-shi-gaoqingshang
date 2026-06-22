# Tasks

- [x] Task 1: 新建报告持久化工具 `reportStorage.ts`
  - [x] SubTask 1.1: 创建 `src/utils/reportStorage.ts`，定义 `StoredReport` 接口
  - [x] SubTask 1.2: 实现 `saveReport(report)` — 含 5 秒去重 + 最多 100 条
  - [x] SubTask 1.3: 实现 `getReportHistory()` — 按时间倒序
  - [x] SubTask 1.4: 实现 `clearReportHistory()` — 清空
  - [x] SubTask 1.5: 实现 `getReportStats()` — 总次数/模块次数/平均分/最高分

- [x] Task 2: 新建情商轨迹计算工具 `eqTrajectory.ts`
  - [x] SubTask 2.1: 创建 `src/utils/eqTrajectory.ts`，定义 `EQTitle` 接口
  - [x] SubTask 2.2: 定义 8 个称号（初出茅庐/抗压之王/数据控/双面人生/情商之神/持之以恒/社交蝴蝶/社死幸存者）
  - [x] SubTask 2.3: `calculateEQCoefficient(reports)` — 加权平均（0.2/0.3/0.5）
  - [x] SubTask 2.4: `calculateTrend(reports)` — up/stable/down
  - [x] SubTask 2.5: `getUnlockedTitles(reports)` — 已解锁+未解锁列表

- [x] Task 3: 新建问卷链接组件 + Bug 修复
  - [x] SubTask 3.1: 创建 `SurveyLink.tsx`，原生 `<a>` 标签直接跳转
  - [x] 3.2: 支持 compact/full 变体，中英文 + aria-label
  - [x] 3.3: BottomNav 缩小（py-1/text-xl/text-[10px]/rounded-lg）
  - [x] 3.4: A11yControlPanel 上移到 bottom-20 + 面板上移到 bottom-36

- [x] Task 4: 新建报告历史组件 `ReportHistory.tsx`
  - [x] 4.1: 从 localStorage 读取报告列表
  - [x] 4.2: 筛选标签（全部/情商挑战/学术抗压）+ 排序切换
  - [x] 4.3: 报告卡片 + 点击展开 5 维详情
  - [x] 4.4: 空状态提示 + 跳转按钮
  - [x] 4.5: 中英文双语，移动端响应式

- [x] Task 5: 新建情商轨迹组件 `EQTrajectory.tsx`
  - [x] 5.1: 情商系数 + 趋势箭头
  - [x] 5.2: SVG 折线图 + 数据点悬浮提示
  - [x] 5.3: 称号展示区（已解锁高亮 + 未解锁锁定）
  - [x] 5.4: 空状态提示
  - [x] 5.5: 中英文双语

- [x] Task 6: 新建个性化建议组件 `PersonalAdvice.tsx`
  - [x] 6.1: 汇总所有报告 5 维数据
  - [x] 6.2: 三段建议卡片（哲学/情绪/健康）
  - [x] 6.3: 5 维度 × 3 类别 = 15 段中英文文案库
  - [x] 6.4: 空状态兜底
  - [x] 6.5: 中英文双语

- [x] Task 7: 重写 Profile.tsx 整合三大模块
  - [x] 7.1: 移除占位内容
  - [x] 7.2: 用户信息卡片（代号 + 测评次数 + 情商系数 + 称号数）
  - [x] 7.3: Tab 切换三大模块
  - [x] 7.4: 底部 SurveyLink 组件
  - [x] 7.5: 中英文双语，pb-24

- [x] Task 8: FinalReport 保存报告 + 问卷链接 + 性能优化
  - [x] 8.1: useEffect 中调用 saveReport 持久化
  - [x] 8.2: FinalReport 末尾添加 SurveyLink
  - [x] 8.3: 防重复保存（ref 标记）
  - [x] 8.4: SceneModules 音频改 rAF 不阻塞跳转
  - [x] 8.5: SceneSelect 快速渲染

- [x] Task 9: Home 底部问卷链接 + 版本号更新
  - [x] 9.1: Home 底部添加 SurveyLink compact
  - [x] 9.2: 版本号 v1.3.0 → v1.4.0

- [x] Task 10: i18n 补充 + 构建验证 + 部署 + 线上验证
  - [x] 10.1: 新文案使用硬编码双语切换
  - [x] 10.2: npm run build 通过（76 模块）
  - [x] 10.3: Git commit + push 成功（9405bc3）
  - [x] 10.4: 线上验证 v1.4.0 已生效

# Task Dependencies
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 1]
- [Task 7] depends on [Task 4]、[Task 5]、[Task 6]
- [Task 8] depends on [Task 1]、[Task 3]
- [Task 9] depends on [Task 3]
- [Task 10] depends on [Task 1-9]
- [Task 1]、[Task 2]、[Task 3] 可并行
