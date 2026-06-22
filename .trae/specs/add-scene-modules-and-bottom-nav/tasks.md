# Tasks

- [x] Task 1: 扩展数据层 — 新增 SceneModule 类型 + 学术抗压场景数据
  - [x] SubTask 1.1: 在 `src/data/types.ts` 新增 `SceneModule` 类型（`'eq-challenge' | 'academic'`）和 `ModuleConfig` 接口
  - [x] SubTask 1.2: 新建 `src/data/scenes/academic/thesis-defense.ts`（论文答辩场景，3 道题，中英文）
  - [x] SubTask 1.3: 新建 `src/data/scenes/academic/advisor-talk.ts`（导师谈话场景，3 道题，中英文）
  - [x] SubTask 1.4: 新建 `src/data/scenes/academic/graduation-ceremony.ts`（毕业典礼场景，3 道题，中英文）
  - [x] SubTask 1.5: 在 `src/data/index.ts` 新增 `sceneModules` 导出，按模块组织场景，保留 `scenes` 向后兼容

- [x] Task 2: 扩展 gameStore — 模块化场景管理
  - [x] SubTask 2.1: `PageName` 类型新增 `'modules'` 和 `'profile'`
  - [x] SubTask 2.2: 新增 `currentModule: SceneModule` 状态字段（默认 `'eq-challenge'`）
  - [x] SubTask 2.3: 新增 `selectModule(moduleId)` 方法（设置 currentModule + 跳转 select 页）
  - [x] SubTask 2.4: 修改 `selectScene` / `goToNextScene` / `getCompletedSceneIds` / `getFinalReport` / `getCompletedSceneResult` 使用当前模块的场景列表
  - [x] SubTask 2.5: 修改 `reset` 保留模块概念（重置当前模块的答题记录，不跨模块）

- [x] Task 3: 新建底部导航栏组件 `BottomNav.tsx`
  - [x] SubTask 3.1: 创建 `src/components/ui/BottomNav.tsx`，3 个 Tab（首页🏠 / 场景🎯 / 我的👤）
  - [x] SubTask 3.2: 漫画风格样式（粗描边、阴影偏移、暖色调），固定底部 `fixed bottom-0`
  - [x] SubTask 3.3: 当前 Tab 高亮逻辑（game/result/report → 场景 Tab 高亮）
  - [x] SubTask 3.4: 无障碍属性（aria-label、aria-current、role="navigation"）

- [x] Task 4: 新建场景模块选择页 `SceneModules.tsx`
  - [x] SubTask 4.1: 创建 `src/pages/SceneModules.tsx`，展示模块卡片网格
  - [x] 4.2: 情商挑战模块卡片（可点击，显示已完成场景数/总场景数）
  - [x] 4.3: 学术抗压模块卡片（可点击，显示已完成场景数/总场景数）
  - [x] 4.4: "更多场景"锁定卡片（🔒，点击触发摇动动画 + toast 提示）
  - [x] 4.5: 顶部标题区 + 语言切换按钮（沿用现有风格）

- [x] Task 5: 新建个人中心占位页 `Profile.tsx`
  - [x] SubTask 5.1: 创建 `src/pages/Profile.tsx`，展示"即将上线"状态
  - [x] 5.2: 预告未来功能（报告历史、情商轨迹、个性化建议）的灰色锁定卡片
  - [x] 5.3: 漫画风格视觉，与整体一致

- [x] Task 6: 适配现有页面 — App.tsx 路由 + BottomNav 集成
  - [x] SubTask 6.1: App.tsx 的 `renderPage()` 新增 `modules` 和 `profile` 分支
  - [x] 6.2: 在 App.tsx 渲染 `<BottomNav />`（在 main 内容下方）
  - [x] 6.3: 调整 Home.tsx 的"开始挑战"按钮逻辑：同意后跳转 `'modules'` 而非 `'select'`
  - [x] 6.4: 调整 SceneSelect.tsx 顶栏返回按钮：返回 `'modules'` 而非 `'home'`
  - [x] 6.5: 调整 FinalReport.tsx 顶栏返回：返回 `'modules'`

- [x] Task 7: 适配 SceneSelect 和 FinalReport 模块化
  - [x] SubTask 7.1: SceneSelect.tsx 使用 `currentModule` 对应的场景列表渲染
  - [x] 7.2: SceneSelect.tsx 顶栏显示当前模块名称
  - [x] 7.3: FinalReport.tsx 的 `getFinalReport` 仅汇总当前模块场景
  - [x] 7.4: FinalReport.tsx 雷达图维度计算仅基于当前模块的答题记录

- [x] Task 8: i18n 补充 + 构建验证 + 部署
  - [x] SubTask 8.1: 新页面文案使用硬编码双语切换（zh ? ... : ...），无需额外 i18n 翻译
  - [x] 8.2: 运行 `npm run build` 验证 TypeScript 编译和 Vite 构建通过（70 模块转换成功）
  - [x] 8.3: Git commit + push 触发 GitHub Pages 部署

# Task Dependencies
- [Task 2] depends on [Task 1]（store 需要模块化数据结构）
- [Task 4] depends on [Task 1] 和 [Task 2]（模块页需要数据和 store 方法）
- [Task 6] depends on [Task 3]、[Task 4]、[Task 5]（App 集成需要组件就绪）
- [Task 7] depends on [Task 2]（页面适配需要 store 模块化逻辑）
- [Task 8] depends on [Task 1-7] 全部完成
- [Task 1] 和 [Task 3] 和 [Task 5] 可并行
