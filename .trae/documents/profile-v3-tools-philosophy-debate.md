# 个人中心 v3.0 升级计划 — 工具栏 / 哲学思辨 / 辩论技巧 / 场景完成修复 + UI 升级

## Summary

本次升级围绕"现代人应对压力与焦虑"的主旨，重构个人中心信息架构：新增独立"工具"导航栏（哲学思辨/焦虑急救/敲木鱼/辩论技巧），删除随机地狱模式，修复场景完成状态判断 bug，升级卡片视觉设计，优化音效平衡，并增加成长曲线趋势预测。

---

## Current State Analysis

### 现有架构（基于 Phase 1 探索）

**底部导航栏** ([BottomNav.tsx](file:///workspace/src/components/ui/BottomNav.tsx))
- 当前 3 个 Tab：首页 / 场景 / 我的
- 激活态：`-translate-y-[2px]` + `scale-110` + 琥珀背景
- 无复杂动画，仅 transform 过渡

**Profile 页面** ([Profile.tsx](file:///workspace/src/pages/Profile.tsx))
- 当前 6 个 Tab：报告/轨迹/建议/计划/急救/木鱼
- 用户信息卡片：白底 + 头像 + 3 列统计（测评次数/情商系数/称号）
- 缺乏视觉层次和趣味元素

**场景完成逻辑** ([gameStore.ts](file:///workspace/src/store/gameStore.ts#L375-L387))
- `getCompletedSceneIds()` 只统计**当前模块**的场景（`getScenesByModule(currentModule)`）
- 完成状态从 `answers` 数组派生，不持久化
- **Bug 根因**：切换模块时 `currentModule` 变化，但 `answers` 数组可能包含其他模块的答题记录，导致 `getCompletedSceneIds()` 只看当前模块场景，跨模块完成状态判断不一致

**"trae solo" 悬浮图标**
- 代码库中**不存在** "trae solo" 相关代码
- 右下角唯一的悬浮元素是无障碍控制面板的 ♿ 轮椅按钮（`A11yControlPanel.tsx`，`bottom-20 right-5`）
- 用户反馈的"trae solo 悬浮图标"实际是这个轮椅按钮挡住了底部导航

**音效配置** ([audioManager.ts](file:///workspace/src/utils/audioManager.ts#L165-L184))
- masterGain: 0.8 / sfxGain: 0.55 / bgmGain: 0.28
- 用户反馈"背景音乐和按键声稍微有点小了"

**EQTrajectory** ([EQTrajectory.tsx](file:///workspace/src/components/profile/EQTrajectory.tsx))
- SVG 折线图 300×120，紫色折线 + 渐变填充
- 只有趋势判断（up/stable/down），**无趋势预测**

**PersonalAdvice** ([PersonalAdvice.tsx](file:///workspace/src/components/profile/PersonalAdvice.tsx))
- 5 维度 × 3 类别 = 15 条建议
- 基于最弱维度生成建议
- 与"计划"模块功能有重叠（都涉及提升路径）

---

## Proposed Changes

### 模块一：删除随机地狱模式

**修改文件**：[src/pages/Home.tsx](file:///workspace/src/pages/Home.tsx#L207-L230)
- 删除第 207-230 行的"地狱模式入口"按钮和相关描述
- 删除 `report.hellMode` / `report.hellModeDesc` 的 i18n key 引用（保留 key 定义以防其他地方使用）

**修改文件**：[src/store/gameStore.ts](file:///workspace/src/store/gameStore.ts#L174-L187)
- `selectScene` 方法保留 `hellMode` 参数（向后兼容），但不再有入口触发

---

### 模块二：新增"工具"导航栏 + 4 个工具

#### 2.1 底部导航栏新增"工具"Tab

**修改文件**：[src/components/ui/BottomNav.tsx](file:///workspace/src/components/ui/BottomNav.tsx)
- Tab 数组从 3 个扩展到 4 个：首页 / 场景 / **工具** / 我的
- 新增 `tools` Tab：`{ key: 'tools', icon: '🧰', label: '工具', target: 'tools' }`
- 布局调整：`grid grid-cols-4` 替代 `flex-1`
- 动画升级：
  - 激活态：弹簧动画 `transition-transform duration-300` + `cubic-bezier(0.34, 1.56, 0.64, 1)`
  - 图标弹跳：`scale-125` + 微旋转 `rotate-3`
  - 底部指示条：激活 Tab 下方显示琥珀色小圆点

#### 2.2 新增 PageName: 'tools'

**修改文件**：[src/store/gameStore.ts](file:///workspace/src/store/gameStore.ts#L17)
- `PageName` 类型增加 `'tools'`

#### 2.3 新建工具列表页

**新建文件**：[src/pages/Tools.tsx](file:///workspace/src/pages/Tools.tsx)
- 4 个工具卡片网格布局（2×2）：
  1. 🧠 **哲学思辨** — 哲学框架缓解压力（迁移自原"建议"模块）
  2. 🧘 **焦虑急救** — 搞怪问卷 + 4 路径建议
  3. 🪘 **敲木鱼** — 禅修解压
  4. 🎯 **辩论技巧** — 新增，交互式学习辩论最佳实践
- 每个卡片：渐变背景 + emoji + 标题 + 副标题 + 点击进入对应工具页面
- 卡片悬浮动画：`hover:scale-105` + `hover:-translate-y-1` + 阴影加深
- 入场动画：`animate-pop-in` + 阶梯延迟

#### 2.4 新建辩论技巧工具

**新建文件**：[src/utils/debateSkills.ts](file:///workspace/src/utils/debateSkills.ts)
- `DebateTechnique` 接口：`{ id, emoji, title: {zh,en}, principle: {zh,en}, example: {zh,en}, tip: {zh,en} }`
- 8 个辩论技巧（基于专业辩论学）：
  1. 🎯 **立场澄清** — 先界定概念再反驳（图尔敏论证模型）
  2. 🔄 **以退为进** — 承认部分合理再转折（黑格尔辩证法）
  3. ❓ **苏格拉底提问** — 用问题引导对方自相矛盾（苏格拉底诘问法）
  4. ⚖️ **类比论证** — 用熟悉场景类比陌生概念（类比推理）
  5. 📊 **数据支撑** — 用事实和数据说话（实证主义）
  6. 🪞 **镜像反驳** — 用对方逻辑反证对方（归谬法）
  7. 🌉 **桥梁过渡** — 先认同情绪再引导理性（情绪-理性桥接）
  8. 🏁 **总结收束** — 主动定义讨论框架（框架效应）

**新建文件**：[src/components/tools/DebateSkills.tsx](file:///workspace/src/components/tools/DebateSkills.tsx)
- 卡片列表布局，每个技巧可展开/折叠
- 展开后显示：原则 + 示例对话 + 实战技巧
- 交互式练习：每个技巧配一个"试试看"按钮，弹出场景让用户输入回应
- 进度追踪：localStorage `eq_debate_progress` 记录已学习技巧

#### 2.5 迁移哲学思辨工具

**新建文件**：[src/components/tools/PhilosophyInsight.tsx](file:///workspace/src/components/tools/PhilosophyInsight.tsx)
- 迁移自原 `PersonalAdvice.tsx` 的哲学内容
- 升级为系统化哲学框架：
  - 5 位哲学家 × 5 个维度（苏格拉底/亚里士多德/尼采/庄子/王阳明）
  - 每位哲学家：生平简介 + 核心思想 + 现代应用 + 缓解压力的具体方法
  - 交互式：点击哲学家卡片展开详细内容
- 视觉升级：每位哲学家配独特渐变色 + emoji 头像

---

### 模块三：Profile 页面重构

**修改文件**：[src/pages/Profile.tsx](file:///workspace/src/pages/Profile.tsx)
- Tab 从 6 个缩减为 **3 个**：📊 报告 / 📈 轨迹 / 📚 计划
- 删除 `advice` / `anxiety` / `zen` Tab（迁移到工具栏）
- 用户信息卡片**视觉升级**：
  - 渐变背景（`from-amber-100 via-orange-50 to-rose-100`）
  - 装饰元素：右上角浮动 emoji（🌟/💫）、左下角装饰图形
  - 头像升级：渐变圆形 + 微动画（`animate-float-gentle`）
  - 统计数据卡片化：每个统计独立小卡片 + 图标
  - 添加"成长等级"徽章（基于情商系数）

---

### 模块四：成长曲线趋势预测

**修改文件**：[src/components/profile/EQTrajectory.tsx](file:///workspace/src/components/profile/EQTrajectory.tsx)
- 新增**轻量级线性回归**趋势预测：
  - 基于历史数据点用最小二乘法拟合直线
  - 延伸 2 个预测点（虚线显示）
  - 预测区间用半透明带状显示
- 趋势线样式：紫色虚线 + 半透明填充带
- 预测点标注："预测"文字 + 虚线圆点
- 仅当数据点 ≥ 3 时显示预测

**新建函数**：在 EQTrajectory.tsx 内部实现
```typescript
// 最小二乘法线性回归
function linearRegression(points: {x: number, y: number}[]): {slope: number, intercept: number} {
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}
```

---

### 模块五：场景完成 Bug 修复

**修改文件**：[src/store/gameStore.ts](file:///workspace/src/store/gameStore.ts#L375-L387)
- **Bug 根因**：`getCompletedSceneIds()` 只统计当前模块场景，但 `answers` 数组包含所有模块的答题记录，导致跨模块完成状态判断不一致
- **修复方案**：新增 `getAllCompletedSceneIds()` 方法，统计所有模块的场景完成状态
- 同时修复 `SceneSelect.tsx` 使用新的全模块统计方法

**修改文件**：[src/pages/SceneSelect.tsx](file:///workspace/src/pages/SceneSelect.tsx#L30)
- `getCompletedSceneIds()` → `getAllCompletedSceneIds()`
- 确保 `allDone` 判断基于当前模块的所有场景

---

### 模块六：无障碍按钮位置修复

**修改文件**：[src/components/a11y/A11yControlPanel.tsx](file:///workspace/src/components/a11y/A11yControlPanel.tsx#L69)
- 悬浮按钮位置：`bottom-20 right-5` → `bottom-24 right-4`（上移避开底部导航栏）
- 按钮尺寸：`w-12 h-12` → `w-11 h-11`（略缩小）
- z-index：`z-[60]` → `z-[45]`（低于模态框，高于普通内容）
- 添加"长按隐藏"功能：长按 2 秒可临时隐藏按钮（5 分钟内不再显示）

---

### 模块七：音效平衡优化

**修改文件**：[src/utils/audioManager.ts](file:///workspace/src/utils/audioManager.ts#L165-L184)
- masterGain: 0.8 → **0.85**（略提升总音量）
- sfxGain: 0.55 → **0.65**（提升按键声，更清脆）
- bgmGain: 0.28 → **0.35**（提升背景音乐，更明显但不抢戏）
- play() 方法音量参数：0.55 → **0.65**
- 解锁音效 unlockBeep：0.4 → **0.5**

---

### 模块八：动画丝滑升级

**修改文件**：[src/components/ui/BottomNav.tsx](file:///workspace/src/components/ui/BottomNav.tsx)
- Tab 切换动画：`transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]`
- 激活态：`-translate-y-[3px] scale-105` + 图标 `scale-125 rotate-3`
- 新增底部指示条：激活 Tab 下方 4px 琥珀色圆点 + `animate-pop-in`

**修改文件**：[src/pages/Profile.tsx](file:///workspace/src/pages/Profile.tsx)
- Tab 切换内容：添加 `key={activeTab}` + `animate-slide-in-right` 动画
- Tab 按钮：弹簧动画 + 激活态微弹跳

**修改文件**：[src/index.css](file:///workspace/src/index.css)
- 新增 `@keyframes slide-in-right`（如果不存在）
- 新增 `@keyframes bounce-soft`（柔和弹跳）

---

## Assumptions & Decisions

### 假设
1. 用户未明确选择工具栏位置，采用推荐的**底部导航新增"工具"Tab**
2. 用户未明确选择建议模块处理，采用推荐的**建议改为"哲学思辨"工具**
3. 用户未明确选择场景完成 Bug 根因，采用推荐的**跨模块统计问题**
4. "trae solo" 悬浮图标实际是无障碍轮椅按钮，通过位置调整解决

### 设计决策
1. **工具栏独立成导航**：4 个工具（哲学思辨/焦虑急救/敲木鱼/辩论技巧）放在独立"工具"Tab，与个人中心解耦
2. **Profile 精简为 3 Tab**：报告/轨迹/计划，专注数据展示
3. **趋势预测用线性回归**：轻量级，无新依赖，数据点 ≥3 时显示
4. **音效提升**：用户反馈声音小，适度提升 sfx 和 bgm 音量
5. **场景完成修复**：新增全模块统计方法，不破坏现有 API

---

## Verification Steps

### 功能验证
1. **随机地狱模式删除**
   - [ ] Home 页面不再显示"🔥 随机地狱模式"按钮
   - [ ] 正常场景入口不受影响

2. **工具导航栏**
   - [ ] 底部导航显示 4 个 Tab（首页/场景/工具/我的）
   - [ ] 点击"工具"进入工具列表页
   - [ ] 4 个工具卡片正确显示，点击进入对应页面
   - [ ] 哲学思辨工具内容完整（5 位哲学家）
   - [ ] 辩论技巧工具 8 个技巧可展开学习

3. **Profile 重构**
   - [ ] Profile 只有 3 个 Tab（报告/轨迹/计划）
   - [ ] 用户信息卡片视觉升级（渐变背景+装饰元素）
   - [ ] 统计数据卡片化展示

4. **成长曲线趋势预测**
   - [ ] 数据点 ≥3 时显示趋势预测线（虚线）
   - [ ] 预测点标注"预测"文字
   - [ ] 数据点 <3 时不显示预测

5. **场景完成 Bug 修复**
   - [ ] 完成所有场景后正确显示"全完成"横幅
   - [ ] 跨模块切换不影响完成状态判断
   - [ ] 部分完成时正确分组显示

6. **无障碍按钮**
   - [ ] 轮椅按钮不再挡住底部导航栏
   - [ ] 长按 2 秒可临时隐藏按钮

7. **音效平衡**
   - [ ] 按键声清脆明显
   - [ ] 背景音乐柔和但不抢戏
   - [ ] 首次播放无爆音

8. **动画丝滑**
   - [ ] 底部导航 Tab 切换有弹簧动画
   - [ ] Profile Tab 切换有滑入动画
   - [ ] 激活 Tab 有指示条

### 构建与部署
1. `npm run build` 通过
2. Git commit + push 成功
3. 访问 https://www.vectorfuture.xyz/ 验证版本号 v1.8.0 生效
4. 移动端无 UI 适配问题

### 版本号
- v1.7.0 → **v1.8.0 · 2026**
