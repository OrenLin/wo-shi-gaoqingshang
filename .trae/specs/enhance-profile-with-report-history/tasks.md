# Tasks

- [ ] Task 1: 新建报告持久化工具 `reportStorage.ts`
  - [ ] SubTask 1.1: 创建 `src/utils/reportStorage.ts`，定义 `StoredReport` 接口（id/timestamp/module/moduleName/averageScore/level/percentile/dims/sceneCount/codename）
  - [ ] SubTask 1.2: 实现 `saveReport(report)` — 将报告快照追加到 localStorage `eq_reports` 数组（去重：同模块同时间段不重复保存）
  - [ ] SubTask 1.3: 实现 `getReportHistory()` — 读取所有历史报告，按时间倒序
  - [ ] SubTask 1.4: 实现 `clearReportHistory()` — 清空所有历史报告
  - [ ] SubTask 1.5: 实现 `getReportStats()` — 返回报告统计（总次数、各模块次数、所有报告的平均分）

- [ ] Task 2: 新建情商轨迹计算工具 `eqTrajectory.ts`
  - [ ] SubTask 2.1: 创建 `src/utils/eqTrajectory.ts`，定义 `EQTitle` 接口（id/emoji/title/desc/condition）
  - [ ] SubTask 2.2: 定义 6+ 个称号（初出茅庐/抗压之王/数据控/双面人生/情商之神/持之以恒），每个含解锁条件判断函数
  - [ ] SubTask 2.3: 实现 `calculateEQCoefficient(reports)` — 加权平均（最近3次权重 0.5/0.3/0.2）
  - [ ] SubTask 2.4: 实现 `calculateTrend(reports)` — 比较最近两次分数，返回 'up'/'stable'/'down'
  - [ ] SubTask 2.5: 实现 `getUnlockedTitles(reports)` — 返回已解锁和未解锁的称号列表

- [ ] Task 3: 新建问卷链接通用组件 `SurveyLink.tsx` + Bug 修复（底部导航栏缩小 + 无障碍按钮位置调整）
  - [ ] SubTask 3.1: 创建 `src/components/ui/SurveyLink.tsx`，使用原生 `<a href target="_blank" rel="noopener noreferrer">` 直接跳转，不经过 JS 中间层，不触发音频加载
  - [ ] 3.2: 支持 `variant` 属性（'compact' 用于底部小按钮，'full' 用于卡片式），中英文双语 + aria-label
  - [ ] 3.3: 缩小 BottomNav.tsx 尺寸：py-1.5→py-1、text-2xl→text-xl、text-[11px]→text-[10px]、减小按钮 padding
  - [ ] 3.4: 调整 A11yControlPanel.tsx 悬浮按钮位置：bottom-5 → bottom-20（避开底部导航栏），面板弹出位置相应上移

- [ ] Task 4: 新建报告历史组件 `ReportHistory.tsx`
  - [ ] SubTask 4.1: 创建 `src/components/profile/ReportHistory.tsx`，从 localStorage 读取报告列表
  - [ ] 4.2: 实现筛选标签（全部/情商挑战/学术抗压）+ 排序切换（倒序/正序）
  - [ ] 4.3: 报告卡片：日期、模块名、分数、段位 emoji、击败百分比，点击展开详情
  - [ ] 4.4: 空状态提示 + 跳转场景模块按钮
  - [ ] 4.5: 中英文双语，移动端响应式

- [ ] Task 5: 新建情商轨迹组件 `EQTrajectory.tsx`
  - [ ] SubTask 5.1: 创建 `src/components/profile/EQTrajectory.tsx`，展示情商系数 + 趋势箭头
  - [ ] 5.2: SVG 折线图（纯实现无依赖），X 轴时间 Y 轴分数，数据点悬浮提示
  - [ ] 5.3: 称号展示区：已解锁称号高亮 + 未解锁灰色锁定
  - [ ] 5.4: 空状态（<2 次报告）提示
  - [ ] 5.5: 中英文双语

- [ ] Task 6: 新建个性化建议组件 `PersonalAdvice.tsx`
  - [ ] SubTask 6.1: 创建 `src/components/profile/PersonalAdvice.tsx`，汇总所有报告的 5 维数据
  - [ ] 6.2: 三段建议卡片：💡 哲学分析、🧘 情绪管理、💪 健康管理，根据最弱维度定制内容
  - [ ] 6.3: 建议文案库（按 5 维度 × 3 类别 = 15 段中英文文案）
  - [ ] 6.4: 空状态兜底（无报告时显示通用建议）
  - [ ] 6.5: 中英文双语

- [ ] Task 7: 重写 Profile.tsx 整合三大模块
  - [ ] SubTask 7.1: 重写 `src/pages/Profile.tsx`，移除占位内容
  - [ ] 7.2: 用户信息卡片（代号 + 总测评次数 + 平均情商系数）
  - [ ] 7.3: Tab 切换或纵向排列三大模块（报告历史 / 情商轨迹 / 个性化建议）
  - [ ] 7.4: 底部放置 SurveyLink 组件
  - [ ] 7.5: 中英文双语，移动端响应式，底部留 pb-24 给导航栏

- [ ] Task 8: FinalReport 保存报告 + 问卷链接 + 场景加载性能优化
  - [ ] SubTask 8.1: 在 FinalReport.tsx 的 useEffect 中，当报告生成时调用 `saveReport(report)` 持久化
  - [ ] 8.2: 在 FinalReport 末尾（操作按钮区下方）添加 SurveyLink 组件
  - [ ] 8.3: 防重复保存（同一次报告只保存一次，用 ref 标记）
  - [ ] 8.4: 优化 SceneModules.tsx 模块卡片点击：去除 audioManager.play 阻塞，改用 requestAnimationFrame 延迟音频
  - [ ] 8.5: 优化 SceneSelect.tsx 场景列表渲染：确保快速渲染无白屏

- [ ] Task 9: Home 底部问卷链接 + 版本号更新
  - [ ] SubTask 9.1: 在 Home.tsx 底部区域（版本号下方）添加 SurveyLink compact 变体
  - [ ] 9.2: 更新 i18n 中 `home.version` 从 "v1.3.0 · 2026" 改为 "v1.4.0 · 2026"

- [ ] Task 10: i18n 补充 + 构建验证 + 部署 + 线上验证
  - [ ] SubTask 10.1: 在 i18n/index.ts 新增所有新文案的中英文翻译（profile/report/trajectory/advice/survey 相关）
  - [ ] 10.2: 运行 `npm run build` 验证编译通过
  - [ ] 10.3: Git commit + push 部署
  - [ ] 10.4: 浏览器访问 https://www.vectorfuture.xyz/ 验证功能正常

# Task Dependencies
- [Task 4] depends on [Task 1]（报告历史需要持久化工具）
- [Task 5] depends on [Task 2]（轨迹需要计算工具）
- [Task 6] depends on [Task 1]（建议需要汇总报告数据）
- [Task 7] depends on [Task 4]、[Task 5]、[Task 6]（Profile 整合三大组件）
- [Task 8] depends on [Task 1]、[Task 3]（保存报告 + 问卷链接）
- [Task 9] depends on [Task 3]（问卷链接）
- [Task 10] depends on [Task 1-9] 全部完成
- [Task 1]、[Task 2]、[Task 3] 可并行
