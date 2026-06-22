# 场景模块化 + 底部导航栏 Spec

## Why
当前应用只有一组"情商挑战"场景（3 个），用户希望扩展为多模块架构，新增"学术抗压"专题场景，并为未来"个人中心"预留入口。需要底部导航栏让用户在首页、场景模块、个人中心之间切换，提升多模块下的导航体验。

## What Changes
- **新增底部导航栏组件** `BottomNav.tsx`：3 个 Tab（首页 / 场景 / 我的），固定在页面底部，漫画风格
- **新增场景模块选择页** `SceneModules.tsx`：展示场景模块卡片（情商挑战 + 学术抗压 + 锁定的"更多场景"）
- **新增学术抗压场景数据**：3 个场景文件（论文答辩 / 导师谈话 / 毕业答辩压力），每场景 3 道题，中英文双语
- **新增个人中心占位页** `Profile.tsx`：展示"即将上线"状态，预留未来报告历史和情商轨迹入口
- **扩展 gameStore**：新增 `currentModule` 字段和模块化场景管理逻辑
- **扩展路由**：`PageName` 新增 `'modules'` 和 `'profile'` 两个页面
- **调整 SceneSelect**：根据 `currentModule` 渲染对应模块的场景列表
- **调整 FinalReport**：根据 `currentModule` 仅汇总该模块内场景的成绩
- **i18n 补充**：所有新增文案的中英文翻译
- **视觉一致性**：新页面沿用现有漫画风格（粗描边、阴影偏移、暖色调、animate-pop-in 动画）

## Impact
- Affected code:
  - `/workspace/src/App.tsx` — 渲染 BottomNav + 新路由分发
  - `/workspace/src/store/gameStore.ts` — 新增 currentModule、模块化场景管理
  - `/workspace/src/data/index.ts` — 新增模块化场景导出
  - `/workspace/src/data/types.ts` — 新增 SceneModule 类型
  - `/workspace/src/data/scenes/academic/` — 新增 3 个学术场景文件
  - `/workspace/src/pages/SceneModules.tsx` — 新建
  - `/workspace/src/pages/Profile.tsx` — 新建
  - `/workspace/src/components/ui/BottomNav.tsx` — 新建
  - `/workspace/src/pages/SceneSelect.tsx` — 适配模块化
  - `/workspace/src/pages/FinalReport.tsx` — 适配模块化报告
  - `/workspace/src/i18n/index.ts` — 新增翻译

## ADDED Requirements

### Requirement: 底部导航栏
系统 SHALL 在所有页面底部显示固定导航栏，包含 3 个 Tab：首页、场景、我的。

#### Scenario: Tab 切换
- **WHEN** 用户点击底部导航栏的"场景"Tab
- **THEN** 页面切换到场景模块选择页（`currentPage = 'modules'`）

#### Scenario: 当前 Tab 高亮
- **WHEN** 用户在答题页（`currentPage = 'game'`）
- **THEN** 底部导航栏"场景"Tab 高亮显示（因为答题属于场景模块流程）

#### Scenario: 个人中心占位
- **WHEN** 用户点击"我的"Tab
- **THEN** 显示个人中心占位页，含"即将上线"提示和未来功能预告（报告历史、情商轨迹、个性化建议）

### Requirement: 场景模块选择页
系统 SHALL 提供场景模块选择页，展示所有可用场景模块和锁定模块。

#### Scenario: 查看模块列表
- **WHEN** 用户进入场景模块选择页
- **THEN** 显示"情商挑战"模块卡片（可点击）+ "学术抗压"模块卡片（可点击）+ "更多场景"卡片（锁定状态，不可点击）

#### Scenario: 进入模块
- **WHEN** 用户点击"学术抗压"模块卡片
- **THEN** 设置 `currentModule = 'academic'`，页面切换到场景选择页，展示学术模块的 3 个场景

#### Scenario: 锁定模块
- **WHEN** 用户点击"更多场景"锁定卡片
- **THEN** 显示提示"更多场景即将上线，敬请期待"（toast 或摇动动画反馈），不跳转

### Requirement: 学术抗压场景数据
系统 SHALL 提供 3 个学术抗压主题场景，每场景 3 道题，中英文双语。

#### Scenario: 场景内容
- **GIVEN** 学术抗压模块包含 3 个场景：论文答辩、导师谈话、毕业典礼
- **WHEN** 用户进入学术模块的场景选择页
- **THEN** 显示 3 个场景卡片，每个卡片含 emoji、标题、描述、人物、题数

#### Scenario: 答题与评分
- **WHEN** 用户在学术场景中答题
- **THEN** 复用现有评分逻辑（scorePresetOption / scoreCustomInput），分数和段位计算与情商挑战一致

#### Scenario: 模块独立报告
- **WHEN** 用户完成学术模块的所有 3 个场景
- **THEN** 最终报告仅汇总学术模块的场景成绩，生成独立的段位、雷达图、击败百分比

### Requirement: 模块化场景管理
系统 SHALL 按模块组织场景，支持多模块独立完成和独立报告。

#### Scenario: 模块隔离
- **GIVEN** 用户完成了情商挑战模块的 2 个场景
- **WHEN** 用户切换到学术抗压模块答题
- **THEN** 学术模块的完成状态独立计算，不影响情商挑战模块的进度

#### Scenario: 模块切换
- **WHEN** 用户从学术模块的场景选择页返回到场景模块选择页
- **THEN** `currentModule` 保留，但 `currentPage` 切换到 `'modules'`

## MODIFIED Requirements

### Requirement: 页面路由
原有 5 个页面（home/select/game/result/report）扩展为 7 个，新增 `modules`（场景模块选择）和 `profile`（个人中心）。

路由流程更新为：
```
home ⇄ modules ⇄ select → game → result → (循环) → report
home ⇄ profile
```

`PageName` 类型扩展为：`'home' | 'modules' | 'select' | 'game' | 'result' | 'report' | 'profile'`

### Requirement: 场景选择页
SceneSelect 页面 SHALL 根据 `currentModule` 渲染对应模块的场景列表，而非全局 scenes 数组。

### Requirement: 最终报告页
FinalReport 页面 SHALL 仅汇总 `currentModule` 对应模块的场景成绩，而非所有场景。
