# Checklist

## 数据层
- [x] `src/data/types.ts` 新增 `SceneModule` 类型（`'eq-challenge' | 'academic'`）和 `ModuleConfig` 接口
- [x] `src/data/scenes/academic/thesis-defense.ts` 存在，含 3 道题，每题 5 个选项（low/medium/high/god/anti），中英文双语
- [x] `src/data/scenes/academic/advisor-talk.ts` 存在，含 3 道题，中英文双语
- [x] `src/data/scenes/academic/graduation-ceremony.ts` 存在，含 3 道题，中英文双语
- [x] `src/data/index.ts` 导出 `sceneModules`（含 eq-challenge 和 academic 两个模块），保留 `scenes` 向后兼容

## Store 层
- [x] `PageName` 类型包含 `'modules'` 和 `'profile'`
- [x] `gameStore` 新增 `currentModule` 状态字段，默认 `'eq-challenge'`
- [x] `gameStore` 新增 `selectModule(moduleId)` 方法
- [x] `selectScene` / `goToNextScene` 使用当前模块的场景列表
- [x] `getCompletedSceneIds` / `getFinalReport` / `getCompletedSceneResult` 仅计算当前模块的场景

## 底部导航栏
- [x] `src/components/ui/BottomNav.tsx` 存在，含 3 个 Tab（首页 / 场景 / 我的）
- [x] 导航栏固定在页面底部（`fixed bottom-0`），不遮挡内容
- [x] 当前 Tab 高亮显示（home→首页，modules/select/game/result/report→场景，profile→我的）
- [x] 导航栏有 aria-label、aria-current、role="navigation" 无障碍属性
- [x] 漫画风格视觉（粗描边、阴影偏移、暖色调）

## 场景模块选择页
- [x] `src/pages/SceneModules.tsx` 存在
- [x] 展示"情商挑战"模块卡片（可点击，显示进度 x/3）
- [x] 展示"学术抗压"模块卡片（可点击，显示进度 x/3）
- [x] 展示"更多场景"锁定卡片（🔒，点击有摇动动画 + 提示）
- [x] 点击可进入模块卡片后，`currentModule` 正确设置，跳转到 SceneSelect

## 个人中心占位页
- [x] `src/pages/Profile.tsx` 存在
- [x] 显示"即将上线"提示
- [x] 预告未来功能（报告历史、情商轨迹、个性化建议）以锁定卡片形式展示
- [x] 视觉风格与整体一致

## App 路由集成
- [x] App.tsx `renderPage()` 包含 `'modules'` 和 `'profile'` 分支
- [x] App.tsx 渲染 `<BottomNav />`
- [x] Home.tsx"开始挑战"按钮跳转到 `'modules'`（而非 `'select'`）
- [x] SceneSelect.tsx 返回按钮跳转到 `'modules'`
- [x] FinalReport.tsx 返回按钮跳转到 `'modules'`

## 现有页面适配
- [x] SceneSelect.tsx 根据 `currentModule` 渲染对应模块的场景列表
- [x] SceneSelect.tsx 顶栏显示当前模块名称
- [x] FinalReport.tsx 仅汇总当前模块的场景成绩
- [x] FinalReport.tsx 雷达图维度计算仅基于当前模块答题记录

## i18n
- [x] 底部导航栏文案使用硬编码双语切换（zh ? ... : ...）
- [x] 场景模块页文案使用硬编码双语切换
- [x] 个人中心页文案使用硬编码双语切换
- [x] 学术场景标题/描述使用 Localized 类型双语数据

## 构建与部署
- [x] `npm run build` 通过（TypeScript 编译 + Vite 构建无错误，70 模块转换成功）
- [x] Git commit + push 成功
