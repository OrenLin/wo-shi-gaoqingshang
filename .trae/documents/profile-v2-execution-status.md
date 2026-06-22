# 个人中心 v2.0 升级计划 — 执行进度

## Summary

在个人中心新增三大功能模块（情商提升计划、缓解焦虑问卷、敲木鱼禅修），并修复音效首次播放音量偏高的 bug。所有新增功能支持中英文双语，遵循项目现有漫画风格 UI 约定，数据持久化到 localStorage。

---

## 执行进度

### ✅ 已完成（7/9 任务）

**Task 1: 新建 eqPlan.ts** ✅
- 文件：`/workspace/src/utils/eqPlan.ts`
- 4 阶段计划定义（认知觉醒/共情倾听/边界冲突/影响领导）
- 每阶段 2 本专业书籍 + 1 部影视推荐 + 3 个实践目标
- localStorage 持久化（`eq_plan_progress`）
- 函数：loadPlanProgress / savePlanProgress / toggleTask / resetPlan / getStageProgress / getOverallProgress

**Task 2: 新建 EQPlan.tsx** ✅
- 文件：`/workspace/src/components/profile/EQPlan.tsx`
- 顶部总进度环形图（SVG circle）
- 垂直时间线布局（左侧竖线 + 阶段圆点）
- 阶段卡片可展开/折叠
- 任务清单（书籍/影视/目标）带 checkbox 打卡
- 阶段进度条 + 完成徽章
- 重置计划按钮（confirm 二次确认）

**Task 3: 新建 anxietyQuiz.ts** ✅
- 文件：`/workspace/src/utils/anxietyQuiz.ts`
- 8 道搞怪题目（半夜失眠/老板加需求/相亲已读不回/同事甩锅等）
- 4 路径评分：stoic（斯多葛）/ zen（禅宗）/ cognitive（CBT）/ social（社交支持）
- 4 条路径结果（哲学框架 + 行动建议 + 推荐书籍）
- calculatePath 函数返回主路径 + 次路径

**Task 4: 新建 AnxietyQuiz.tsx** ✅
- 文件：`/workspace/src/components/profile/AnxietyQuiz.tsx`
- 三态视图：intro / quiz / result
- intro 页：搞怪标题"🧠 焦虑急救包" + 4 路径 emoji 展示
- quiz 页：单题展示 + 2×2 选项网格 + 自动进入下一题 + 进度条
- result 页：主路径大卡片 + 行动建议 + 推荐书籍 + 次路径 + 分数分布图

**Task 5: 新建 WoodfishZen.tsx** ✅
- 文件：`/workspace/src/components/profile/WoodfishZen.tsx`
- 木鱼 SVG（手绘风格，棕色椭圆 + 纹路 + 木槌）
- 背景莲花 SVG（半透明，缓慢旋转）
- 功德计数器 + 连击逻辑（1 秒重置）
- 浮动 "+1" 数字动画
- 每 10 次点击浮现禅语（10 条中英文禅语库）
- 4 个功德里程碑称号（初心者/虔诚者/禅师/活佛）
- localStorage 持久化（`eq_merit` / `eq_merit_date`）

**Task 6: 修改 audioManager.ts** ✅
- 文件：`/workspace/src/utils/audioManager.ts`
- 新增 `woodfish` SoundKey（200Hz triangle 波 0.12s）
- 新增 DynamicsCompressorNode（threshold -10, ratio 4）限制峰值
- 修复 unlockByUserGesture：只播 deferKey 不播 unlockBeep，避免叠加爆音
- 删除 resume 后补播 unlockBeep 逻辑
- 统一 sfx 音量：0.7 → 0.55（与首次解锁 0.4 更接近）
- BGM 音量：0.35 → 0.28（更柔和，不抢音效）

**Task 7: 修改 Profile.tsx** ✅
- 文件：`/workspace/src/pages/Profile.tsx`
- Tab 类型扩展为 6 个：history / trajectory / advice / plan / anxiety / zen
- Tab 标签缩短（报告/轨迹/建议/计划/急救/木鱼）
- Tab 栏改为横向滚动布局（`overflow-x-auto` + `flex-shrink-0 min-w-[58px]`）
- 新增 3 个组件导入和渲染

### ⏳ 待完成（2/9 任务）

**Task 8: 修改 i18n/index.ts — 版本号更新**
- 当前版本：v1.6.0 · 2026（第 26 行和第 155 行）
- 目标版本：v1.7.0 · 2026
- 同步更新 ConsentModal.tsx 中的版本号显示

**Task 9: 构建验证 + 部署 + 线上验证**
- `npm run build` 验证无 TypeScript 错误
- Git commit + push
- 访问 https://www.vectorfuture.xyz/ 验证 v1.7.0 生效

---

## 当前阻塞

由于当前处于 Plan Mode，无法执行 Task 8（编辑 i18n/index.ts）和 Task 9（构建/部署）。需要退出 Plan Mode 后继续执行。

---

## Verification Steps

### 功能验证（待执行）
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
   - [ ] iOS 上音频正常播放

### 构建与部署（待执行）
1. `npm run build` 通过
2. Git commit + push 成功
3. 访问 https://www.vectorfuture.xyz/ 验证版本号 v1.7.0 生效
4. 移动端无换行/溢出等 UI 适配问题

### 版本号
- v1.6.0 → **v1.7.0 · 2026**
