# Checklist

## 报告持久化
- [ ] `src/utils/reportStorage.ts` 存在，定义 `StoredReport` 接口
- [ ] `saveReport(report)` 将报告追加到 localStorage `eq_reports`，含去重逻辑
- [ ] `getReportHistory()` 返回按时间倒序的报告列表
- [ ] `clearReportHistory()` 清空历史报告
- [ ] `getReportStats()` 返回总次数、各模块次数、平均分

## 情商轨迹计算
- [ ] `src/utils/eqTrajectory.ts` 存在，定义 `EQTitle` 接口
- [ ] 定义 6+ 个称号（初出茅庐/抗压之王/数据控/双面人生/情商之神/持之以恒），含 emoji 和解锁条件
- [ ] `calculateEQCoefficient(reports)` 加权平均（最近3次权重 0.5/0.3/0.2）
- [ ] `calculateTrend(reports)` 返回 'up'/'stable'/'down'
- [ ] `getUnlockedTitles(reports)` 返回已解锁和未解锁称号列表

## 问卷链接组件 + Bug 修复
- [ ] `src/components/ui/SurveyLink.tsx` 存在，使用原生 `<a href target="_blank">` 直接跳转
- [ ] 支持 `variant` 属性（'compact' / 'full'）
- [ ] 点击丝滑无卡顿（不经过 JS 中间层，不触发音频加载）
- [ ] 中英文双语 + aria-label
- [ ] BottomNav.tsx 尺寸缩小（py-1、text-xl、text-[10px]），整体高度约 52px
- [ ] A11yControlPanel.tsx 悬浮按钮位置上移（bottom-20），不遮挡底部导航栏
- [ ] A11yControlPanel 面板弹出位置相应上移

## 报告历史组件
- [ ] `src/components/profile/ReportHistory.tsx` 存在
- [ ] 筛选标签（全部/情商挑战/学术抗压）功能正常
- [ ] 排序切换（倒序/正序）功能正常
- [ ] 报告卡片显示日期、模块名、分数、段位 emoji、击败百分比
- [ ] 空状态提示 + 跳转按钮
- [ ] 中英文双语，移动端无溢出

## 情商轨迹组件
- [ ] `src/components/profile/EQTrajectory.tsx` 存在
- [ ] 情商系数 + 趋势箭头显示正确
- [ ] SVG 折线图渲染正常，数据点可悬浮
- [ ] 称号展示区：已解锁高亮 + 未解锁灰色锁定
- [ ] 空状态（<2 次报告）提示
- [ ] 中英文双语

## 个性化建议组件
- [ ] `src/components/profile/PersonalAdvice.tsx` 存在
- [ ] 汇总所有报告的 5 维数据
- [ ] 三段建议卡片（哲学分析/情绪管理/健康管理）根据最弱维度定制
- [ ] 空状态兜底（无报告时通用建议）
- [ ] 中英文双语

## Profile 页面整合
- [ ] `src/pages/Profile.tsx` 重写完成，移除占位内容
- [ ] 用户信息卡片（代号 + 总测评次数 + 平均情商系数）
- [ ] 三大模块（报告历史/情商轨迹/个性化建议）正确展示
- [ ] 底部放置 SurveyLink 组件
- [ ] 底部留 pb-24 给导航栏
- [ ] 中英文双语，移动端响应式

## FinalReport 保存报告 + 问卷链接 + 性能优化
- [ ] FinalReport.tsx useEffect 中调用 `saveReport(report)` 持久化
- [ ] 防重复保存（ref 标记）
- [ ] FinalReport 末尾添加 SurveyLink 组件
- [ ] SceneModules.tsx 模块卡片点击无卡顿（音频不阻塞跳转）
- [ ] SceneSelect.tsx 场景列表快速渲染无白屏

## Home 底部问卷链接 + 版本号
- [ ] Home.tsx 底部添加 SurveyLink compact 变体
- [ ] i18n 中 `home.version` 更新为 "v1.4.0 · 2026"

## i18n
- [ ] 所有新增文案中英文翻译存在
- [ ] 无未翻译的 key（不会显示 raw key）

## 构建与部署
- [ ] `npm run build` 通过
- [ ] Git commit + push 成功
- [ ] 访问 https://www.vectorfuture.xyz/ 验证功能正常
