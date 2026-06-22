# 个人中心完善 — 报告历史 / 情商轨迹 / 个性化建议 + Bug 修复 Spec

## Why
当前个人中心是纯占位页，用户完成挑战后无法回顾历史报告、看不到情商成长轨迹，也缺乏基于自身表现的个性化建议。需要将报告数据持久化到 localStorage，实现报告历史浏览、情商轨迹可视化、称号解锁和个性化推荐，并在首页底部、报告末尾、个人中心三处放置用户反馈问卷链接。同时修复新场景加载卡顿、无障碍按钮遮挡底部、底部导航栏过大等体验问题。

## What Changes
- **新增报告持久化机制**：用户完成一个模块的所有场景后，自动将报告快照保存到 localStorage（`eq_reports` key），含时间戳、模块、分数、段位、维度数据
- **重写 Profile.tsx**：从占位页升级为完整功能页，含三大模块
- **新增报告历史模块**：展示所有历史报告卡片，支持按模块筛选（全部/情商挑战/学术抗压）和倒序排列，点击可查看报告详情
- **新增情商轨迹模块**：基于多次测试结果综合计算情商系数，展示成长曲线（SVG 折线图），根据测试次数和表现解锁趣味称号（如"抗压之王""社交常客"等）
- **新增个性化建议模块**：基于用户整体情商维度分布，给出哲学分析、情绪管理和健康管理的三段式推荐
- **新增问卷链接组件**：在 FinalReport 末尾、Home 底部、Profile 页面三处放置问卷星链接（`https://v.wjx.cn/vm/ejvSW8A.aspx#`），新窗口打开，点击丝滑无卡顿
- **更新版本号**：v1.3.0 → v1.4.0
- **i18n 补充**：所有新增文案的中英文翻译
- **UI 适配**：确保中英文无换行/溢出问题，移动端响应式
- **Bug 修复 1 — 新场景加载卡顿**：优化场景切换性能，减少不必要的重渲染和音频加载阻塞
- **Bug 修复 2 — 无障碍轮椅按钮遮挡底部**：将 A11yControlPanel 悬浮按钮从右下角上移（避开底部导航栏），或缩小尺寸
- **Bug 修复 3 — 底部导航栏过大**：缩小 BottomNav 尺寸（减小 padding、图标、字号），使其更紧凑
- **Bug 修复 4 — 问卷点击卡顿**：问卷链接使用 `<a>` 标签直接跳转（非 JS window.open），去除不必要的音频播放阻塞

## Impact
- Affected code:
  - `/workspace/src/pages/Profile.tsx` — 完全重写
  - `/workspace/src/pages/FinalReport.tsx` — 末尾新增问卷链接 + 完成时触发保存报告
  - `/workspace/src/pages/Home.tsx` — 底部新增问卷链接 + 版本号更新
  - `/workspace/src/pages/SceneSelect.tsx` — 优化场景切换性能
  - `/workspace/src/pages/SceneModules.tsx` — 优化模块卡片点击响应
  - `/workspace/src/store/gameStore.ts` — 新增 saveReport / getReportHistory / clearReportHistory 方法
  - `/workspace/src/utils/reportStorage.ts` — 新建，localStorage 报告持久化工具
  - `/workspace/src/utils/eqTrajectory.ts` — 新建，情商轨迹计算 + 称号解锁逻辑
  - `/workspace/src/components/profile/ReportHistory.tsx` — 新建，报告历史列表
  - `/workspace/src/components/profile/EQTrajectory.tsx` — 新建，情商轨迹曲线 + 称号
  - `/workspace/src/components/profile/PersonalAdvice.tsx` — 新建，个性化建议
  - `/workspace/src/components/ui/SurveyLink.tsx` — 新建，问卷链接通用组件（纯 `<a>` 标签，无 JS 阻塞）
  - `/workspace/src/components/ui/BottomNav.tsx` — 缩小尺寸
  - `/workspace/src/components/a11y/A11yControlPanel.tsx` — 调整悬浮按钮位置避开底部导航栏
  - `/workspace/src/i18n/index.ts` — 新增翻译 + 版本号更新

## ADDED Requirements

### Requirement: 报告持久化
系统 SHALL 在用户完成一个模块的所有场景后，自动将报告快照保存到浏览器 localStorage。

#### Scenario: 保存报告
- **WHEN** 用户完成当前模块的所有场景，进入最终报告页
- **THEN** 系统自动将报告快照（含时间戳、模块ID、平均分、段位、5维数据、场景列表）保存到 localStorage 的 `eq_reports` 数组

#### Scenario: 报告数据结构
- **GIVEN** 每条历史报告记录 SHALL 包含：`id`（时间戳）、`timestamp`（ISO 字符串）、`module`（模块ID）、`moduleName`（双语）、`averageScore`、`level`（段位对象）、`percentile`、`dims`（5维数据）、`sceneCount`（场景数）、`codename`

### Requirement: 报告历史浏览
系统 SHALL 在个人中心展示所有历史报告，支持按模块筛选和倒序排列。

#### Scenario: 查看报告历史
- **WHEN** 用户进入个人中心
- **THEN** 显示报告历史列表，每条报告卡片含：日期时间、模块名、分数、段位 emoji、击败百分比

#### Scenario: 按模块筛选
- **WHEN** 用户点击筛选标签（全部 / 情商挑战 / 学术抗压）
- **THEN** 报告列表仅显示对应模块的报告

#### Scenario: 倒序排列
- **GIVEN** 报告默认按时间倒序排列（最新在前）
- **WHEN** 用户点击排序切换
- **THEN** 可在倒序/正序间切换

#### Scenario: 空状态
- **WHEN** 用户没有任何历史报告
- **THEN** 显示空状态提示"还没有报告，去挑战一个场景吧！" + 跳转按钮

### Requirement: 情商轨迹与称号
系统 SHALL 基于用户的历史报告计算情商成长轨迹，并根据测试次数和表现解锁趣味称号。

#### Scenario: 情商系数计算
- **GIVEN** 情商系数 = 所有历史报告平均分的加权平均（最近3次权重更高）
- **WHEN** 用户有 ≥2 次报告
- **THEN** 显示情商系数（0-100）和成长趋势（上升/平稳/下降）

#### Scenario: 成长曲线
- **WHEN** 用户有 ≥2 次报告
- **THEN** 显示 SVG 折线图，X 轴为时间，Y 轴为分数，每个数据点可悬浮查看详情

#### Scenario: 称号解锁
- **GIVEN** 根据测试次数和表现解锁称号
- **WHEN** 用户达成条件
- **THEN** 显示已解锁称号（含 emoji 图标和描述），未解锁称号以灰色锁定状态展示

#### Scenario: 称号列表（示例）
- 🥇 初出茅庐 — 完成 1 次测评
- 🔥 抗压之王 — 学术模块获得 100 分
- 📊 数据控 — 完成 5 次测评
- 🎭 双面人生 — 两个模块都完成至少 1 次
- 👑 情商之神 — 任意模块获得 ≥90 分
- 🔄 持之以恒 — 完成 10 次测评

### Requirement: 个性化建议
系统 SHALL 基于用户整体情商维度分布，给出哲学分析、情绪管理和健康管理的三段式推荐。

#### Scenario: 建议生成
- **GIVEN** 汇总用户所有历史报告的 5 维数据（嘴替力/社交力/抗压力/社死预警/成长值）
- **WHEN** 用户进入个性化建议模块
- **THEN** 显示三段建议卡片：💡 哲学分析、🧘 情绪管理、💪 健康管理，每段内容根据用户最弱维度定制

#### Scenario: 无数据兜底
- **WHEN** 用户没有任何历史报告
- **THEN** 显示通用建议文案，引导用户先完成测评

### Requirement: 问卷反馈链接
系统 SHALL 在三处位置放置问卷星链接，方便用户填写反馈。

#### Scenario: 链接位置
- **GIVEN** 问卷链接为 `https://v.wjx.cn/vm/ejvSW8A.aspx#`
- **WHEN** 用户在 FinalReport 末尾 / Home 底部 / Profile 页面
- **THEN** 显示"📝 填写问卷反馈"按钮，点击在新窗口打开链接

### Requirement: 双语言支持
所有新增功能 SHALL 同时支持中文和英文，无换行或溢出问题。

#### Scenario: 语言切换
- **WHEN** 用户切换语言
- **THEN** 个人中心所有内容（报告历史、轨迹、建议、称号、问卷按钮）均切换为对应语言

## MODIFIED Requirements

### Requirement: 版本号
版本号从 v1.3.0 更新为 v1.4.0，反映个人中心功能完善。

### Requirement: Profile 页面
Profile 页面从占位页升级为完整功能页，含用户信息卡片 + 报告历史 + 情商轨迹 + 个性化建议 + 问卷链接。

## Bug 修复需求

### Requirement: 新场景加载卡顿修复
系统 SHALL 优化场景切换和模块点击的响应速度，消除卡顿。

#### Scenario: 场景模块点击响应
- **WHEN** 用户在 SceneModules 页面点击模块卡片
- **THEN** 立即响应跳转，不因音频加载或动画阻塞而卡顿

#### Scenario: 场景选择页加载
- **WHEN** 用户从模块页进入 SceneSelect
- **THEN** 场景列表快速渲染，不出现白屏或长时间加载

### Requirement: 无障碍轮椅按钮位置调整
系统 SHALL 调整 A11yControlPanel 悬浮按钮位置，避免遮挡底部导航栏。

#### Scenario: 按钮位置
- **GIVEN** 底部导航栏占据屏幕底部约 52px 高度
- **WHEN** 页面渲染时
- **THEN** 无障碍轮椅按钮位于底部导航栏上方（`bottom` 值需加上导航栏高度，如 `bottom-20`），不与导航栏重叠

### Requirement: 底部导航栏尺寸缩小
系统 SHALL 缩小 BottomNav 的整体尺寸，使其更紧凑。

#### Scenario: 尺寸调整
- **GIVEN** 当前导航栏 padding 较大、图标 2xl、字号 11px
- **WHEN** 优化后
- **THEN** 减小垂直 padding（py-1.5 → py-1）、图标缩小（text-2xl → text-xl）、字号微调（text-[11px] → text-[10px]），整体高度从约 64px 降至约 52px

### Requirement: 问卷链接丝滑点击
系统 SHALL 确保问卷链接点击即时响应，无卡顿。

#### Scenario: 点击响应
- **WHEN** 用户点击问卷链接
- **THEN** 使用原生 `<a href target="_blank">` 直接跳转，不经过 JS 中间层，不触发音频加载等阻塞操作
