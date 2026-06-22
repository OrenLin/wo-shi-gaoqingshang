# 个人中心 v2.0 升级计划 — 情商提升计划 / 焦虑缓解问卷 / 木鱼禅修 + 音效修复

## Summary

在个人中心新增三大功能模块（情商提升计划、缓解焦虑问卷、敲木鱼禅修），并修复音效首次播放音量偏高的 bug。所有新增功能支持中英文双语，遵循项目现有漫画风格 UI 约定，数据持久化到 localStorage。

---

## Current State Analysis

### 现有架构（基于 Phase 1 探索）

**Profile 页面结构** ([src/pages/Profile.tsx](file:///workspace/src/pages/Profile.tsx))
- 使用 `useState<Tab>` 本地状态切换 Tab（不挂 URL）
- 当前 3 个 Tab：`'history' | 'trajectory' | 'advice'`
- Tab 配置写死在组件内，每个 Tab 有 emoji + 中英 label
- 内容区用 `&&` 短路渲染

**localStorage 持久化模式**
- key 命名规范：`eq_` 前缀 + 小写下划线（`eq_reports` / `eq_consented` / `eq_codename`）
- 序列化：`JSON.stringify` + try/catch
- 模式：load 函数初始化 + setter 双写（无 zustand persist 中间件）

**漫画风格 UI 约定**
- 核心：`border-[3px] border-[#1a1a2e]` + `shadow-[Npx_Npx_0_0_#1a1a2e]` + `font-black` + `rounded-2xl`
- 动画：`animate-pop-in` + `style={{ animationDelay: ${i * 0.05}s }}` 阶梯入场
- 缓动：`--squish-ease: cubic-bezier(0.34, 1.56, 0.64, 1)`

**音效问题根因** ([src/utils/audioManager.ts](file:///workspace/src/utils/audioManager.ts#L260-L323))
- `unlockByUserGesture(deferKey)` 首次点击时同时叠加播放 3 个 buffer：
  1. unlockBeep (音量 0.5)
  2. deferKey 音效 (音量 0.5)
  3. resume 完成后补播 unlockBeep (音量 0.4)
- 三 buffer 叠加且无 DynamicsCompressorNode，峰值超过 1.0 导致削波失真
- 已解锁后正常 `play()` 只播 1 个 buffer 音量 0.7

**i18n 模式**
- `useI18n((s) => s.t)` + `t('module.key', {var: value})`
- `pickLocalized(field, language)` 用于数据级双语字段
- Profile 页面用最简模式：`const zh = language === 'zh'` + 三元判断

---

## Proposed Changes

### 模块一：情商提升计划（EQ Improvement Plan）

**目标**：基于心理学/社会学/情商学的 4 阶段打卡计划，专业书籍为主、影视为辅，localStorage 持久化打卡状态。

#### 新建文件

**[src/utils/eqPlan.ts](file:///workspace/src/utils/eqPlan.ts)** — 计划数据 + 持久化逻辑
- `STORAGE_KEY = 'eq_plan_progress'`
- `PlanStage` 接口：`{ id, title: {zh,en}, duration: {zh,en}, description: {zh,en}, books: BookRec[], media: MediaRec[], goals: {zh,en}[] }`
- `BookRec` 接口：`{ title: {zh,en}, author: {zh,en}, category: {zh,en}, why: {zh,en} }`
- `MediaRec` 接口：`{ title: {zh,en}, type: 'movie'|'tv', why: {zh,en} }`
- `PlanProgress` 接口：`{ stageId: string, tasks: Record<string, boolean>, startDate: string, completedDates: string[] }`
- 4 阶段定义（基于 Goleman 情商理论 + Marshall Rosenberg NVC + CBT + SFBT）：
  1. **入门篇 · 认知觉醒**（1 周）：Goleman《情商》、Covey《高效能人士的七个习惯》+ 电影《心灵奇旅》
  2. **进阶篇 · 共情与倾听**（1 周）：Rogers《成为一个人》、Rosenberg《非暴力沟通》+ 电影《心灵捕手》
  3. **深化篇 · 边界与冲突**（1 周）：Cloud《边界》、Fisher《谈判力》+ 电视剧《傲骨贤妻》精选集
  4. **大师篇 · 影响与领导**（1 周）：Cialdini《影响力》、Brown《 Dare to Lead》+ 电影《国王的演讲》
- 函数：`loadPlanProgress()` / `savePlanProgress(p)` / `toggleTask(stageId, taskId)` / `getStageProgress(stageId)` / `resetPlan()`

**[src/components/profile/EQPlan.tsx](file:///workspace/src/components/profile/EQPlan.tsx)** — 计划 UI 组件
- 顶部：总进度环形图（SVG circle，4 阶段完成度）+ 总周期提示"约 4 周"
- 阶段卡片列表（垂直时间线布局）：
  - 左侧时间线竖线 + 阶段编号圆点（已完成=绿色✓，进行中=琥珀色脉冲，未开始=灰色）
  - 阶段标题 + 时长徽章 + 描述
  - 任务清单（书籍/影视/目标）：每项带 checkbox，点击切换打卡状态
  - 阶段进度条（已完成任务数/总任务数）
  - 阶段完成时显示"✅ 阶段已完成"徽章 + 庆祝动画
- 底部：重置计划按钮（confirm 二次确认）
- 动画：`animate-pop-in` + 阶梯延迟

#### 修改文件

**[src/pages/Profile.tsx](file:///workspace/src/pages/Profile.tsx)** — 新增第 4 个 Tab
- `Tab` 类型增加 `'plan'`
- Tab 配置数组增加：`{ key: 'plan', emoji: '📚', label: { zh: '提升计划', en: 'Plan' } }`
- 内容区增加：`{activeTab === 'plan' && <EQPlan />}`
- Tab 栏布局调整：4 个 Tab 用 `grid grid-cols-4 gap-1` 替代原来的 3 列

**[src/i18n/index.ts](file:///workspace/src/i18n/index.ts)** — 新增 i18n key
- `plan.title` / `plan.subtitle` / `plan.totalDuration` / `plan.stageComplete` / `plan.resetConfirm` / `plan.taskDone` / `plan.progress` 等

---

### 模块二：缓解焦虑问卷（Anxiety Relief Quiz）

**目标**：搞怪解压风格的问卷，基于选择给出 3-4 条佛系/哲学路径建议，轻松为主。

#### 新建文件

**[src/utils/anxietyQuiz.ts](file:///workspace/src/utils/anxietyQuiz.ts)** — 问卷数据 + 评分逻辑
- `AnxietyQuestion` 接口：`{ id, question: {zh,en}, options: AnxietyOption[] }`
- `AnxietyOption` 接口：`{ id, text: {zh,en}, emoji, scores: Record<PathType, number> }`
- `PathType = 'stoic' | 'zen' | 'cognitive' | 'social'`（斯多葛/禅宗/认知行为/社交支持）
- 8 道搞怪题目（如"半夜三点睡不着，你会？"、"老板又加需求，第一反应？"）
- 4 条路径结果：
  1. **🏛️ 斯多葛路径**：马可·奥勒留《沉思录》+ "控制二分法"练习
  2. **🧘 禅宗路径**：《心经》诵读 + 正念呼吸 4-7-8 法
  3. **🧠 认知行为路径**：Burns《伯恩斯新情绪疗法》+ ABCDE 模型记录
  4. **🤝 社交支持路径**：约朋友倾诉 + 加入兴趣社群
- 函数：`calculatePath(answers)` → 返回主路径 + 次路径 + 个性化建议

**[src/components/profile/AnxietyQuiz.tsx](file:///workspace/src/components/profile/AnxietyQuiz.tsx)** — 问卷 UI 组件
- 三态视图：`'intro' | 'quiz' | 'result'`
- **intro 页**：搞怪标题"🧠 焦虑急救包" + 描述 + 开始按钮
- **quiz 页**：单题展示（一次一题），选项卡片网格 2×2，选中后自动进入下一题，顶部进度条
- **result 页**：
  - 主路径大卡片（emoji + 路径名 + 哲学框架说明 + 3 条具体行动建议）
  - 次路径小卡片（辅助建议）
  - "重新测试" + "分享我的解药" 按钮
- 动画：题目切换 `animate-slide-in-right`，结果 `animate-pop-in`

#### 修改文件

**[src/pages/Profile.tsx](file:///workspace/src/pages/Profile.tsx)** — 新增第 5 个 Tab
- `Tab` 类型增加 `'anxiety'`
- Tab 配置数组增加：`{ key: 'anxiety', emoji: '🧘', label: { zh: '焦虑急救', en: 'Anxiety' } }`
- Tab 栏布局调整为 `grid grid-cols-5 gap-0.5`，Tab 字号略缩小

**[src/i18n/index.ts](file:///workspace/src/i18n/index.ts)** — 新增 i18n key
- `anxiety.title` / `anxiety.subtitle` / `anxiety.start` / `anxiety.nextQ` / `anxiety.viewResult` / `anxiety.retry` / `anxiety.share` / `anxiety.pathStoic` / `anxiety.pathZen` / `anxiety.pathCognitive` / `anxiety.pathSocial` 等

---

### 模块三：敲木鱼禅修（Woodfish Zen）

**目标**：完整禅意体验，点击木鱼 +1 功德，累计功德，连击特效，禅语浮现。

#### 新建文件

**[src/components/profile/WoodfishZen.tsx](file:///workspace/src/components/profile/WoodfishZen.tsx)** — 木鱼组件
- 内置 state：`merit (功德数)` / `combo (连击数)` / `floatingNumbers (浮动数字数组)` / `zenPhrase (当前禅语)`
- localStorage 持久化：`eq_merit`（功德总数）、`eq_merit_date`（今日日期，用于每日重置连击）
- **视觉元素**：
  - 木鱼 SVG（手绘风格，棕色椭圆 + 装饰纹路 + 木槌）
  - 背景莲花 SVG（半透明，缓慢旋转 `animate-spin-slow`）
  - 功德计数器（顶部，大字号 `text-4xl font-black`）
  - 连击计数器（右上角，连击≥5 时显示火焰图标）
- **交互**：
  - 点击木鱼：功德 +1，浮动 "+1" 数字上升淡出，木鱼轻微缩放 `active:scale-95`
  - 连击逻辑：1 秒内连续点击累计 combo，combo≥5 显示"🔥 x5"，combo≥10 显示"✨ 功德无量"
  - 每 10 次点击随机浮现一条禅语（如"放下即是"、"本来无一物"、"心静自然凉"）
  - 点击音效：新增 `woodfish` SoundKey（低频木鱼声，200Hz triangle 短促 0.1s）
- **功德里程碑**（localStorage 持久化）：
  - 100 功德 → 解锁"🧘 初心者"称号
  - 500 功德 → 解锁"🙏 虔诚者"称号
  - 1000 功德 → 解锁"✨ 禅师"称号
  - 5000 功德 → 解锁"🏮 活佛"称号
- **重置按钮**：长按 2 秒重置功德（confirm 二次确认）

#### 修改文件

**[src/pages/Profile.tsx](file:///workspace/src/pages/Profile.tsx)** — 新增第 6 个 Tab
- `Tab` 类型增加 `'zen'`
- Tab 配置数组增加：`{ key: 'zen', emoji: '🪘', label: { zh: '敲木鱼', en: 'Woodfish' } }`
- Tab 栏布局：6 个 Tab 改为可横向滚动 `overflow-x-auto` + `flex` 布局，每个 Tab `flex-shrink-0 min-w-[60px]`

**[src/i18n/index.ts](file:///workspace/src/i18n/index.ts)** — 新增 i18n key
- `zen.merit` / `zen.combo` / `zen.reset` / `zen.resetConfirm` / `zen.titleStarter` / `zen.titleDevout` / `zen.titleMaster` / `zen.titleBuddha` / `zen.phrase1` ~ `zen.phrase10` 等

**[src/utils/audioManager.ts](file:///workspace/src/utils/audioManager.ts)** — 新增 woodfish 音效
- `SoundKey` 类型增加 `'woodfish'`
- `precreateBuffers()` 增加：`this.buffers.woodfish = createBeep(200, 0.1, 0.4, 'triangle')`

---

### 模块四：音效首次播放音量偏高修复

#### 修改文件

**[src/utils/audioManager.ts](file:///workspace/src/utils/audioManager.ts)** — 修复 unlockByUserGesture 叠加播放问题

**问题根因**：首次点击时 `unlockByUserGesture(key)` 同时播放 3 个 buffer（unlockBeep 0.5 + deferKey 0.5 + resume 后 unlockBeep 0.4），叠加导致音量偏高。

**修复方案**：
1. **添加 DynamicsCompressorNode**：在 sfxGain 和 masterGain 之间插入压缩器，自动限制峰值
   ```ts
   this.compressor = this.ctx.createDynamicsCompressor();
   this.compressor.threshold.value = -10;
   this.compressor.knee.value = 10;
   this.compressor.ratio.value = 4;
   this.compressor.attack.value = 0.003;
   this.compressor.release.value = 0.1;
   this.sfxGain.connect(this.compressor);
   this.compressor.connect(this.masterGain);
   ```
2. **简化 unlockByUserGesture 播放逻辑**：
   - 首次解锁时**只播 deferKey**（不播 unlockBeep），音量降到 0.4
   - resume 完成后**不再补播 unlockBeep**（删除第 290-292 行的补播逻辑）
   - 这样首次点击只播 1 个 buffer，与已解锁后的 0.7 音量接近
3. **统一 sfx 播放音量**：将 `play()` 方法的音量从 0.7 调整为 0.55，与首次解锁的 0.4 更接近，减少突兀感
4. **BGM 音量微调**：从 0.35 调整为 0.28，让 BGM 更柔和，不抢音效

---

## Assumptions & Decisions

### 假设
1. 用户未明确选择阶段划分方案，采用推荐的 **4 阶段 · 4 周** 方案
2. 用户未明确选择问卷风格，采用推荐的 **搞怪解压为主** 风格
3. 用户未明确选择木鱼交互深度，采用推荐的 **完整禅意体验** 方案
4. 所有新增功能支持中英文双语（用户明确要求）

### 设计决策
1. **Tab 栏布局**：从 3 Tab 扩展到 6 Tab，移动端改为横向滚动布局（`overflow-x-auto`），避免 Tab 过小
2. **localStorage key 命名**：遵循 `eq_` 前缀规范
   - `eq_plan_progress` — 提升计划打卡状态
   - `eq_merit` — 木鱼功德总数
   - `eq_merit_date` — 木鱼功德日期（用于连击重置）
3. **音效修复**：采用 DynamicsCompressorNode + 简化解锁播放逻辑，不改变现有音效 buffer 定义
4. **木鱼音效**：新增 `woodfish` SoundKey，低频 triangle 波 200Hz，模拟真实木鱼声
5. **不引入新依赖**：所有 SVG 图形手绘，所有动画用 CSS，木鱼音效用现有 AudioContext API

---

## Verification Steps

### 功能验证
1. **情商提升计划**
   - [ ] 4 阶段卡片正确渲染，中英文切换正常
   - [ ] 点击任务 checkbox 可切换打卡状态，刷新页面后状态保留
   - [ ] 阶段进度条和总进度环正确计算
   - [ ] 阶段完成时显示徽章 + 动画
   - [ ] 重置计划按钮有二次确认

2. **缓解焦虑问卷**
   - [ ] intro/quiz/result 三态切换正常
   - [ ] 8 道题目中英文切换正常
   - [ ] 选项点击后自动进入下一题
   - [ ] 结果页主路径 + 次路径正确计算
   - [ ] 重新测试功能正常

3. **敲木鱼禅修**
   - [ ] 点击木鱼功德 +1，浮动数字动画正常
   - [ ] 连击逻辑正常，1 秒不点击后连击重置
   - [ ] 禅语每 10 次点击浮现
   - [ ] 功德数 localStorage 持久化
   - [ ] 4 个里程碑称号正确解锁
   - [ ] 木鱼音效播放正常

4. **音效修复**
   - [ ] 首次点击场景时音效不再偏高
   - [ ] BGM 与音效音量平衡，不抢戏
   - [ ] iOS 上音频正常播放（visibilitychange/focus 恢复）

### 构建与部署
1. `npm run build` 通过（无 TypeScript 错误）
2. Git commit + push 成功
3. 访问 https://www.vectorfuture.xyz/ 验证版本号 v1.7.0 生效
4. 移动端无换行/溢出等 UI 适配问题

### 版本号
- v1.6.0 → **v1.7.0 · 2026**
- 同步更新 ConsentModal 中的版本号显示
