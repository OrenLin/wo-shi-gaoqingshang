# 「我是高情商」功能设计文档

> **版本**：v1.9.4  
> **更新日期**：2026-06-23  
> **技术栈**：React 18 + TypeScript + Vite + Zustand + Tailwind CSS  
> **部署**：https://www.vectorfuture.xyz/（Vercel 自动部署，main 分支）

---

## 目录

1. [产品概述](#1-产品概述)
2. [系统架构](#2-系统架构)
3. [核心测试流程](#3-核心测试流程)
4. [场景与题库系统](#4-场景与题库系统)
5. [段位与评分系统](#5-段位与评分系统)
6. [个人中心](#6-个人中心)
7. [工具箱](#7-工具箱)
8. [禅意抽签（核心工具）](#8-禅意抽签核心工具)
9. [底部导航](#9-底部导航)
10. [国际化系统](#10-国际化系统)
11. [音频系统](#11-音频系统)
12. [无障碍设计](#12-无障碍设计)
13. [UI 设计规范](#13-ui-设计规范)
14. [数据持久化](#14-数据持久化)
15. [版本演进记录](#15-版本演进记录)

---

## 1. 产品概述

### 1.1 产品定位

「我是高情商」是一款移动端竖屏情商测试游戏，以**漫画风格（Neo-Brutalism）**呈现，通过沉浸式场景答题评估用户情商，并提供减压工具箱辅助情绪管理。

### 1.2 核心价值

- **娱乐化测评**：将严肃的情商测试包装为游戏化场景互动
- **多维度评估**：5 维情商模型（自我主张/社交/抗压/化解尴尬/成长）
- **工具化沉淀**：5 个独立减压工具，测试之外的持续陪伴
- **隐私优先**：所有数据本地存储，不上传服务器

### 1.3 目标用户

- 希望了解自身情商水平的年轻人
- 在社交/学术/职场场景中感到压力的用户
- 对心理学、哲学、禅宗感兴趣的用户

---

## 2. 系统架构

### 2.1 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | React 18.3 | 函数组件 + Hooks |
| 语言 | TypeScript 5.8 | 严格类型 |
| 构建 | Vite 6.3 | 极速 HMR |
| 状态 | Zustand 5.0 | 轻量全局状态 |
| 样式 | Tailwind CSS 3.4 | 原子化 CSS |
| 音频 | Web Audio API | 无音频文件，PCM 合成 |
| 部署 | Vercel + GitHub Pages | 双部署通道 |

### 2.2 目录结构

```
src/
├── main.tsx                    # 入口
├── App.tsx                     # 根组件（路由 + 全局包裹）
├── index.css                   # 全局样式 + 动画 + 无障碍
├── pages/                      # 8 个页面
│   ├── Home.tsx                # 首页
│   ├── SceneModules.tsx        # 模块选择
│   ├── SceneSelect.tsx         # 场景选择
│   ├── Game.tsx                # 答题页
│   ├── Result.tsx              # 单题结果
│   ├── FinalReport.tsx         # 最终报告
│   ├── Profile.tsx             # 个人中心
│   └── Tools.tsx               # 工具箱
├── store/gameStore.ts          # Zustand 全局状态
├── i18n/index.ts               # 国际化
├── data/                       # 场景与段位数据
│   ├── types.ts                # 类型定义
│   ├── levels.ts               # 段位配置
│   └── scenes/                 # 6 个场景
├── components/
│   ├── ui/                     # BottomNav, ConsentModal
│   ├── a11y/                   # 无障碍组件
│   ├── profile/                # 个人中心子组件
│   └── tools/                  # 工具组件
└── utils/                      # 业务工具
    ├── audioManager.ts         # 音频管理
    ├── scoring.ts              # 评分算法
    ├── divinationLots.ts       # 签数据
    └── ...
```

### 2.3 路由系统

项目**不使用 react-router**，通过 Zustand 的 `currentPage` 状态 + `App.tsx` 的 switch 语句实现页面切换。

```typescript
type PageName = 'home' | 'modules' | 'select' | 'game' | 'result' | 'report' | 'profile' | 'tools';
```

**页面切换动画**：除 tools 页面外，所有页面用 `animate-page-enter` 包裹（380ms 入场动画）。tools 页面跳过包裹以避免 Divination 的 fixed 布局 stacking context 问题。

### 2.4 状态管理（gameStore）

**核心状态**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `currentPage` | PageName | 当前页面 |
| `currentModule` | 'eq-challenge' \| 'academic' | 当前模块 |
| `codename` | string | 玩家代号（maxLength 20） |
| `consented` | boolean | 隐私同意状态 |
| `currentSceneIndex` | number | 当前场景索引 |
| `currentQuestionIndex` | number | 当前题目索引 |
| `answers` | Record<string, Answer> | 答题记录 |
| `streakAnti` / `streakLow` | number | 连对/连错计数 |
| `achieved` | Set<string> | 隐藏成就 |

**核心方法**：`setPage`、`selectModule`、`selectScene`、`submitAnswer`、`goToNextScene`、`reset`、`getFinalReport`、`getAllCompletedSceneIds`

---

## 3. 核心测试流程

### 3.1 流程概览

```
首页 → 模块选择 → 场景选择 → 答题 → 单题结果 → 下一题/下一场景 → 最终报告
```

### 3.2 首页（Home）

- **Loading 层**：根据 `navigator.connection` 调整时长
- **代号输入**：maxLength 20，作为玩家身份标识
- **ConsentModal**：首次进入需同意隐私条款
- **语言切换**：中英文实时切换
- **装饰元素**：FloatingEmojis 浮动表情

### 3.3 模块选择（SceneModules）

显示 2 个场景模块卡片 + 锁定的"更多场景"卡片：

| 模块 | 说明 | 场景数 |
|------|------|--------|
| 情商挑战（eq-challenge） | 家庭/职场/商务场景 | 3 |
| 学术抗压（academic） | 论文答辩/导师谈话/毕业典礼 | 3 |

每个模块卡片显示进度条（已完成/总数），全部完成显示 ✓ 徽章。

### 3.4 场景选择（SceneSelect）

- **分组**：未完成在上、已完成在下
- **ImmersiveScenePreview**：点击场景卡片弹出沉浸式预览（背景图 + 标题 + 描述 + 进入按钮）
- **全部完成**：显示最终报告入口

### 3.5 答题页（Game）

- **Fisher-Yates shuffle**：打乱选项顺序，防止位置记忆
- **微反馈浮层**：答题后显示 smart/cringe 反馈（aria-live="assertive"）
- **连对/连错彩蛋**：连续 3 题高情商/社死触发隐藏成就
- **自由发挥**：可切换为自定义输入模式
- **音效**：anti/smartClick/caw/submit

### 3.6 单题结果（Result）

- 分数徽章、段位、解说、贴士、你的回答
- **AntiKingToast**：抗压之王自动弹出
- 通关后显示下一场景/最终报告按钮

### 3.7 最终报告（FinalReport）

- **5 维情商计算**：advocate（自我主张）/social（社交）/pressure（抗压）/awkward（化解尴尬）/growth（成长）
- **ScoreBoard**：分数 + 雷达图 + Beat%（击败百分比）
- **场景表现**：各场景进度条
- **隐藏成就**：展示已解锁成就
- **段位解析**：4 段（core/history/comment）
- **分享文案 + 段位推荐**：书 + 影推荐
- **地狱模式**：随机场景重玩
- **持久化**：saveReport 到 localStorage

---

## 4. 场景与题库系统

### 4.1 数据结构

```typescript
interface Scene {
  id: string;
  title: string | Localized;
  emoji: string;
  description: string | Localized;
  bgImage: string;           // 背景图 URL
  bgColor: string;           // Tailwind 类名（渐变）
  bgGradient?: string;       // 有效 CSS 渐变（bgImage 为空时使用）
  accentColor: string;
  characters: Character[];
  questions: Question[];
}

interface Question {
  id: string;
  character: string;
  text: string | Localized;
  options: Option[];         // 5 个选项
}

interface Option {
  id: string;
  text: string | Localized;
  level: OptionLevel;        // 'anti' | 'low' | 'medium' | 'high' | 'god'
  feedback: string | Localized;
  tip: string | Localized;
}
```

### 4.2 场景清单

共 **6 个场景**，每个 **3 题**，每题 **5 选项**，总计 **18 题 × 5 选项 = 90 个选项**。

#### 情商挑战模块（eq-challenge）

| 场景 | emoji | 角色数 | 背景 |
|------|-------|--------|------|
| 家庭年夜饭（family-dinner） | 🧨 | 3 | bg-family-dinner.svg |
| 职场生存（workplace） | 💼 | 2 | bg-office.svg |
| 商务应酬（business-dinner） | 🍻 | 2 | bg-dinner.svg |

#### 学术抗压模块（academic）

| 场景 | emoji | 角色数 | 背景 |
|------|-------|--------|------|
| 论文答辩（thesis-defense） | 🎓 | 3 | bgGradient（靛蓝渐变） |
| 导师谈话（advisor-talk） | 📚 | 3 | bgGradient（紫色渐变） |
| 毕业典礼（graduation-ceremony） | 🎩 | 3 | bgGradient（翡翠渐变） |

> **注**：学术场景无 SVG 背景图，使用 `bgGradient` CSS 渐变替代，避免空 `bgImage` 导致的加载延迟。

### 4.3 选项等级

| 等级 | 说明 | 分数 |
|------|------|------|
| `god` | 情商之神 | 5 |
| `high` | 高情商 | 4 |
| `medium` | 及格 | 3 |
| `low` | 社交杀手 | 2 |
| `anti` | 社死 | 1 |

---

## 5. 段位与评分系统

### 5.1 段位配置

| 段位 | 分数区间 | emoji | 说明 |
|------|----------|-------|------|
| anti（社死） | 100 | - | 满分社死 |
| god（情商之神） | 90-99 | 👑 | 顶级情商 |
| high（情商达人） | 70-89 | 😎 | 高情商 |
| medium（及格选手） | 40-69 | 😅 | 及格 |
| low（社交杀手） | 0-39 | 💀 | 需提升 |

每个段位包含：`name`、`tag`、`emoji`、`slogan`、`descModule`（core/history/comment）、`socialCopy`（分享文案）、`recos`（书 + 影推荐）。

### 5.2 评分算法

- **单题评分**：选项 level 映射为 1-5 分
- **场景均分**：该场景所有题目分数的平均值
- **最终均分**：所有已完成场景均分的平均值
- **百分比排名**：基于正态分布（mean=65, sd=18）+ Abramowitz & Stegun erf 近似计算

### 5.3 隐藏成就

| 成就 ID | 触发条件 |
|---------|----------|
| `eqCeiling` | 连续 3 题高情商 |
| `socialKiller` | 连续 3 题社死 |

---

## 6. 个人中心

### 6.1 整体结构

**3 个 Tab**：

| Tab | 名称 | 功能 |
|-----|------|------|
| history | 📊 报告历史 | 历史报告列表 + 筛选 + 趋势对比 |
| trajectory | 📈 成长轨迹 | SVG 折线图 + 趋势预测 |
| plan | 📚 提升计划 | 4 阶段学习计划 + 进度追踪 |

### 6.2 用户信息卡片

- 头像、代号、成长等级徽章
- **成长等级**（5 级）：潜力股 → 初出茅庐 → 进阶选手 → 情商达人 → 情商之神
- **统计数据**：测评次数、情商系数、称号数

### 6.3 成长曲线（EQTrajectory）

- **SVG 折线图**：chartWidth=300, chartHeight=120
- **线性回归**：最小二乘法，数据点 ≥ 3 时启用趋势预测
- **预测点**：延伸 2 个预测点（虚线）
- **预测区间**：±8 分半透明带状
- **趋势箭头**：up（>3 分）/stable/down（<-3 分）
- **8 个称号**：first-step/pressure-king/data-lover/dual-face/eq-deity/persistent/social-butterfly/survivor

### 6.4 提升计划（EQPlan）

**4 阶段计划**（约 4 周）：

| 阶段 | 主题 | 理论基础 |
|------|------|----------|
| 入门篇 | 认知觉醒 | Goleman 情商理论 |
| 进阶篇 | 共情与倾听 | Rogers + NVC（非暴力沟通） |
| 深化篇 | 边界与冲突 | Cloud + Fisher |
| 大师篇 | 影响与领导 | Cialdini + Brown |

每阶段包含：理论基础、专业书籍、影视推荐、实践目标。

**UI 特性**：环形进度图（radius=32）、时间线布局、阶段状态（done/active/pending）。

### 6.5 报告历史（ReportHistory）

- **筛选**：all / eq-challenge / academic
- **排序**：时间倒序/正序
- **趋势对比**：与同模块上一条比较（↑↓=）
- **展开详情**：5 维数据
- **清空历史**：一键清除

---

## 7. 工具箱

### 7.1 整体结构

**5 个工具**：

| 工具 | Key | 文件 | 渲染方式 |
|------|-----|------|----------|
| 禅意抽签 | divination | Divination.tsx | 全屏沉浸式（不走 ToolWrapper） |
| 哲学思辨 | philosophy | PhilosophyInsight.tsx | ToolWrapper（粘性返回按钮） |
| 焦虑急救 | anxiety | AnxietyQuiz.tsx | ToolWrapper |
| 敲木鱼 | woodfish | WoodfishZen.tsx | ToolWrapper |
| 辩论技巧 | debate | DebateSkills.tsx | ToolWrapper |

**布局**：特色工具卡片（竹筒 SVG，全宽）+ 2×2 网格常规工具。每个工具有独特的装饰元素（ToolDecoration）。

### 7.2 哲学思辨（PhilosophyInsight）

**5 位哲学家**：

| 哲学家 | 核心思想 |
|--------|----------|
| 苏格拉底 | 产婆术、认识你自己 |
| 亚里士多德 | 中庸之道、黄金分割 |
| 尼采 | 超人哲学、永恒轮回 |
| 庄子 | 逍遥游、齐物论 |
| 王阳明 | 心学、知行合一 |

**交互**：可展开手风琴，每位哲学家含名言、思想解读、现代应用。

### 7.3 焦虑急救（AnxietyQuiz）

**8 道搞怪题目**，每题 4 选项，每选项对 4 路径打分（0/1/3）。

**4 条哲学路径**：

| 路径 | Key | 哲学基础 | 推荐书籍 |
|------|-----|----------|----------|
| 斯多葛 | stoic | 马可·奥勒留《沉思录》·控制二分法 | 《沉思录》 |
| 禅宗 | zen | 正念呼吸·《心经》·放下执念 | 《正念的奇迹》 |
| CBT | cognitive | Burns《伯恩斯新情绪疗法》·ABCDE 模型 | 《伯恩斯新情绪疗法》 |
| 社交支持 | social | 人际关系疗法·倾诉与社群 | 《亲密关系》 |

**算法**：`calculatePath(answers)` 返回 `{ primary, secondary, scores }`，每路径含 philosophy、framework、3 条 actions、推荐书籍。

### 7.4 敲木鱼（WoodfishZen）

- **交互**：点击木鱼积功德，每次 +10
- **连击系统**：1 秒不点击重置，连击有加成
- **10 条禅语**：每 10 次点击浮现一条
- **4 个里程碑**：

| 里程碑 | 功德值 | 称号 |
|--------|--------|------|
| 初心者 | 100 | 🌱 |
| 虔诚者 | 500 | 🙏 |
| 禅师 | 1000 | 🧘 |
| 活佛 | 5000 | 👼 |

- **localStorage**：`eq_merit`（总功德）、`eq_merit_date`（今日功德）
- **视觉**：WoodfishSVG + LotusSVG，浮动数字 +10/+N/+1

### 7.5 辩论技巧（DebateSkills）

**8 个专业技巧**（基于专业辩论学）：

| 序号 | 技巧 | 理论基础 |
|------|------|----------|
| 1 | 立场澄清 | 图尔敏论证模型 |
| 2 | 以退为进 | 黑格尔辩证法 |
| 3 | 苏格拉底提问 | 苏格拉底诘问法 |
| 4 | 类比论证 | 类比推理 |
| 5 | 数据支撑 | 实证主义 |
| 6 | 镜像反驳 | 归谬法 |
| 7 | 桥梁过渡 | 情绪-理性桥接 |
| 8 | 总结收束 | 框架效应 |

每技巧含：principle（原理）、example（示例）、tip（贴士）。学习进度持久化到 `eq_debate_progress`。

---

## 8. 禅意抽签（核心工具）

### 8.1 设计理念

沉浸式竹筒抽签减压工具，与 App 漫画风格形成反差，营造禅意空间。结合禅宗、斯多葛、CBT 减压智慧。

### 8.2 签数据结构

```typescript
interface DivinationLot {
  id: string;
  number: number;           // 签号 1-30
  level: LotLevel;          // 5 个等级
  element: FiveElement;     // 五行
  poem: Localized;          // 签诗（中英双语）
  interpretation: Localized; // 签语（中英双语）
  blessing: Localized;      // 祝福语（中英双语）
}

type LotLevel = 'supreme' | 'upper' | 'middle' | 'lower' | 'bottom'
type FiveElement = 'metal' | 'wood' | 'water' | 'fire' | 'earth'
```

### 8.3 签等级配置

| 等级 | 中文 | 印章字 | 说明 |
|------|------|--------|------|
| supreme | 上上签 | 吉 | 稀有，惊喜与鼓励 |
| upper | 上签 | 福 | 较多，积极正向 |
| middle | 中签 | 平 | 最多，平和稳妥 |
| lower | 下签 | 守 | 略少，提醒反思 |
| bottom | 下下签 | 忍 | 最少，考验真心 |

### 8.4 概率权重

```typescript
const WEIGHTS: Record<LotLevel, number> = {
  supreme: 3,   // 20.0%
  upper: 4,     // 26.7%
  middle: 5,    // 33.3%
  lower: 2,     // 13.3%
  bottom: 1,    // 6.7%
};
```

**设计原则**：上上签/上签共 46.7%（给惊喜），中签 33.3%（平和），下签/下下签共 20%（略少但保留，体现真实感）。

### 8.5 签数据分布（30 组）

| 等级 | 数量 | 编号 |
|------|------|------|
| supreme | 6 | 1, 13, 14, 15, 16 + 原有 |
| upper | 7 | 2, 17, 18, 19, 20, 21 + 原有 |
| middle | 9 | 3, 22, 23, 24, 25, 26 + 原有 |
| lower | 6 | 4, 27, 28, 29 + 原有 |
| bottom | 2 | 5, 30 + 原有 |

### 8.6 交互流程（状态机）

```
idle（空闲）→ 用户点击竹筒
  ↓
shaking（摇签，1.2s）→ 竹筒摇动 + 签条抖动 + 粒子上升
  ↓
revealing（升签，0.9s）→ 中签升起 + 光晕脉冲
  ↓
revealed（揭晓）→ 卷轴展开 + 印章盖印 + 签文渐显
  ↓
用户点击"再抽一签"→ 重置到 idle（300ms 过渡）→ 重新摇签
```

**关键实现**：
- `startShakingFlow()` 统一管理摇签流程，避免再抽一签时定时器链断裂
- `useRef<ReturnType<typeof setTimeout>[]>` 管理所有定时器，组件卸载时清理
- `clearTimers()` 在返回/再抽时调用，防止内存泄漏

### 8.7 视觉设计

#### 背景层（BackdropScene）

水墨山水 + 庭院园林，多层次氛围：

| 层级 | 内容 | opacity |
|------|------|---------|
| 顶部 | 竹叶画框 + 竹枝线条 | 40% |
| 远山 | 水墨淡彩渐变 | 35% |
| 中山 | 山间云雾 | 40% |
| 近山 | 庭院小桥 + 水面波纹 | 45% |
| 底部竹林 | 左右两侧竹丛（竹节 + 竹叶簇） | 35% |
| 石灯笼 | 左下角，带灯光 | 35% |
| 苔石 | 右下角 | 30% |

#### 飘落竹叶特效（FloatingLeaves）

- 7 片竹叶随风飘过背景
- CSS 变量控制漂移距离（`--leaf-drift`）和旋转角度（`--leaf-rotate`）
- `divination-leaf-drift` 动画：linear infinite，10-16s 随机时长

#### 竹筒（BambooTube）

3D 质感 SVG，140×195px（compact 模式 100×140px）：

- **9 段渐变圆柱体**：左暗→中亮→右暗，模拟圆柱体光照
- **筒口深度**：径向渐变（黑→深黑）+ 边缘高光
- **竹节环**：2 道，渐变填充 + 高光/阴影线
- **绳结装饰**：中部绳纹 + 中心扣
- **木签组**：4 根背景签（模糊，营造深度）+ 1 根选中签（清晰，加宽 16px）
- **签文**：楷体行楷字体（STKaiti/KaiTi/STXingkai），印章字（吉/福/平/守/忍），渐显动画
- **地面阴影**：柔和椭圆 + blur 滤镜

#### 解签面板（InterpretationPanel）

- **渐变融入背景**：`box-shadow` + `mask-image` 替代硬边框
- **淡色衬底纹理**：传统信笺暗纹（点状 + 横线纹理）
- **水印**：大字"禅"（rgba 0.04 极淡）
- **内容**：签级 + 印章（3D 质感）+ 签诗 + 签语 + 祝福语
- **底部操作区**：`flex-shrink-0` 始终可见，铜钱（缘分）+ 再抽一签按钮

### 8.8 动画系统（15 个专用动画）

| 动画名 | 用途 | 时长 |
|--------|------|------|
| `divination-shake` | 竹筒摇动 | 1.5s |
| `divination-lots-jitter` | 签条抖动 | 0.15s infinite |
| `divination-lot-rise` | 中签升起 | 1s + delay 0.2s |
| `divination-glow` | 光晕脉冲 | 1.2s |
| `divination-particle` | 粒子上升 | 1.5s |
| `divination-panel-enter` | 面板入场 | 0.5s |
| `divination-scroll-unfold` | 卷轴展开 | 0.6s |
| `divination-seal-stamp` | 印章盖印 | 0.5s + delay 0.3s |
| `divination-text-fade` | 文字淡入 | 0.6s |
| `divination-bg-enter` | 背景入场 | 1.2s |
| `divination-hint-pulse` | 提示脉冲 | 2s infinite |
| `divination-breathe` | 呼吸效果 | 2.5s infinite |
| `divination-dot-bounce` | 进度点弹跳 | 0.6s infinite |
| `divination-leaf-drift` | 竹叶飘落 | linear infinite |
| `divination-lot-text-reveal` | 签文渐显 | 0.8s + delay 0.3s |

### 8.9 布局优化

- **竹筒区高度**：idle/shaking 阶段 30vh，revealing/revealed 阶段缩小到 20vh（`transition-all duration-500`）
- **compact 模式**：revealed 阶段竹筒 SVG 从 140px 缩小到 100px
- **底部操作区**：`flex-shrink-0` 确保按钮始终可见可点
- **提示文字**：独立行，不与竹筒重叠

---

## 9. 底部导航

### 9.1 Tab 配置

| Tab | 图标 | 目标页面 | 高亮条件 |
|-----|------|----------|----------|
| 首页 | 🏠 | home | currentPage === 'home' |
| 场景 | 🎯 | modules | modules/select/game/result/report |
| 工具 | 🧰 | tools | currentPage === 'tools' |
| 我的 | 👴 | profile | currentPage === 'profile' |

### 9.2 交互

- **弹簧动画**：`cubic-bezier(0.34, 1.56, 0.64, 1)`
- **激活指示条**：小圆点
- **触摸优化**：`-webkit-tap-highlight-color: transparent` + `touch-action: manipulation`

---

## 10. 国际化系统

### 10.1 语言类型

```typescript
type Language = 'zh' | 'en';
```

### 10.2 核心 API

- `useI18n` hook：Zustand 实现，响应式语言切换
- `getI18n()`：非 hook 版本
- `useLocale()`：hook 版本

### 10.3 pickLocalized 函数

```typescript
function pickLocalized(
  field: string | { zh: string; en: string } | undefined,
  language: Language
): string
```

支持三种输入：
- `string`：直接返回
- `{ zh, en }`：根据 language 返回对应语言
- `undefined`：返回空字符串

**使用场景**：所有数据层的 `Localized` 类型字段（场景、问题、选项、段位、签诗等）统一通过此函数渲染。

### 10.4 字典模块

home / select / game / result / report / audio / common / a11y 等，覆盖所有 UI 文案。

---

## 11. 音频系统

### 11.1 音效类型

```typescript
type SoundKey = 'click' | 'select' | 'submit' | 'anti' | 'smartClick' | 'caw' | 'success' | 'unlockBeep' | 'woodfish';
```

共 **9 种音效**，全部通过 PCM 数据合成，无需音频文件。

### 11.2 技术实现

- **AudioManager 类**（单例模式）
- **iOS Safari 兼容**：`AudioBufferSourceNode` + 用户手势同步栈
- **precreateBuffers**：用 PCM 数据预生成多种音效

### 11.3 音量控制

| Gain 节点 | 音量 | 说明 |
|-----------|------|------|
| masterGain | 0.85 | 主音量 |
| sfxGain | 0.65 | 音效音量 |
| bgmGain | 0.35 | 背景音乐音量 |

**DynamicsCompressorNode**：threshold=-10, ratio=4（动态压缩，限制峰值避免爆音）。

### 11.4 背景音乐

C 大调旋律（PCM 合成）：
```
C5-E5-G5-E5-C5-G5-E5-C5-G5-A5-G5-E5-G5-A5-G5-E5
```

### 11.5 iOS 解锁与健壮性

- **持久手势监听器**：pointerdown/touchstart/click/mousedown/keydown
- **visibilitychange/focus 监听**：恢复 AudioContext
- **BGM 健康检查**：每 10 秒
- **调试接口**：`window.__audioDebug`

### 11.6 公共 API

| 方法 | 说明 |
|------|------|
| `userTapped()` | 用户手势触发（解锁音频） |
| `play(key)` | 播放音效 |
| `toggle()` | 切换 BGM 开关 |
| `subscribe(listener)` | 订阅状态变化 |
| `state` getter | 获取当前状态 |

---

## 12. 无障碍设计

### 12.1 WCAG 标准覆盖

| WCAG 条款 | 实现方式 | CSS 类名 |
|-----------|----------|----------|
| 2.4.1 跳过导航 | 跳转链接直达主内容 | `.skip-link` |
| 2.4.7 焦点可见 | 自定义 focus-visible 样式 | `:focus-visible` |
| 2.3.3 减少动画 | 关闭装饰性动画 | `.reduce-motion` |
| 1.4.6 高对比度 | 黑白高对比 | `.high-contrast` |
| 4.1.3 状态公告 | aria-live 区域 | `.sr-only` |
| 大字体模式 | 放大文字到 125% | `.large-text` |
| 屏幕阅读器模式 | 增强 outline | `.screen-reader-mode` |

### 12.2 AccessibilityProvider

**4 种模式状态**：
- `prefersReducedMotion`（减少动画）
- `highContrast`（高对比度）
- `largeText`（大字体）
- `screenReader`（屏幕阅读器辅助）

**初始化逻辑**：
1. 检测系统偏好（`prefers-reduced-motion: reduce`、`prefers-contrast: more`）
2. 从 localStorage 恢复用户上次选择（覆盖系统偏好）
3. 监听系统偏好变化（仅当用户未手动选择时跟随）

**状态应用**：通过 `document.documentElement.classList.toggle()` 应用到 `<html>` 标签。

**announce 函数**：将消息写入 aria-live 区域，屏幕阅读器自动朗读（支持 polite/assertive 优先级）。

### 12.3 A11yControlPanel

**右下角悬浮按钮**（轮椅图标 ♿，`animate-wiggle` 摇摆动画）。

**4 个模式开关**：
1. 🎨 高对比度模式
2. 🔠 大字体模式
3. 🚫 减少动画
4. 🔊 朗读提示

**特性**：激活模式计数小红点、点击外部关闭、ESC 键关闭、`role="switch"` + `aria-checked`。

### 12.4 ConsentModal（隐私同意弹窗）

**内容结构**：
1. 顶部彩色横幅：🔒 隐私与使用说明
2. 娱乐声明（黄色卡片）
3. 我们收集什么（蓝色卡片）：匿名访问日志、代号、答题数据（均本地存储）
4. 我们不收集什么（红色卡片）：真实身份信息、敏感权限、第三方共享
5. 跨境传输提示（橙色卡片）：Vercel/GitHub Pages 海外基础设施
6. 完整隐私条款（可折叠，黑色卡片）
7. 同意勾选：必须勾选才能启用按钮
8. 底部版本号：v1.9.4 · 匿名访问 · 数据不出你浏览器

---

## 13. UI 设计规范

### 13.1 设计风格：Neo-Brutalism 漫画风格

**核心设计语言**：

| 特征 | 实现 |
|------|------|
| 粗黑描边 | `border-[3px] border-[#1a1a2e]` |
| 硬阴影 | `shadow-[Npx_Npx_0_0_#1a1a2e]`（无模糊，纯色偏移） |
| 高饱和色块 | amber/yellow/pink/orange/sky/teal/emerald |
| 圆角 | `rounded-2xl`（16px）/ `rounded-[28px]` |
| 粗体字 | `font-black`（900） |

### 13.2 颜色系统

```css
:root {
  --color-ink: #1a1a2e;      /* 主墨色（深蓝黑） */
  --color-cream: #fff6e5;    /* 奶油色背景 */
  --squish-ease: cubic-bezier(0.34, 1.56, 0.64, 1);  /* 弹簧曲线 */
}
```

### 13.3 工具类系统

| 类名 | 用途 |
|------|------|
| `.manga-border` | 4px border + 6px shadow |
| `.manga-border-thin` | 3px border + 4px shadow |
| `.manga-border-soft` | 3px border + 0 4px shadow |
| `.sticker-shadow` | 贴纸风格双层阴影 |
| `.bubble-shadow` | 气泡风格大阴影 |
| `.squishy` | 按压弹跳动画 |
| `.manga-stripes` | 漫画速度线背景 |

### 13.4 通用动画系统

| 动画类名 | keyframes | 用途 |
|----------|-----------|------|
| `.animate-wiggle` | wiggle-soft (3s) | 摇摆（左右 1.5deg） |
| `.animate-float-gentle` | float-gentle (4s) | 漂浮（上下 8px） |
| `.animate-pulse-glow` | pulse-glow (2s) | 光晕脉冲 |
| `.animate-pop-in` | pop-in (500ms) | 弹出（scale + rotate） |
| `.animate-slide-in-right` | slide-in-right (380ms) | 右滑入 |
| `.animate-page-enter` | page-enter (380ms) | 页面入场 |
| `.animate-slide-down` | slide-down (350ms) | 下滑入 |

### 13.5 触摸优化

```css
@media (max-width: 768px) {
  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
}
```

### 13.6 安全区域适配

```css
body {
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

### 13.7 自定义滚动条

黄橙渐变滚动条，配合漫画风格。

---

## 14. 数据持久化

### 14.1 localStorage Key 规范

所有 key 统一使用 `eq_` 前缀：

| Key | 用途 | 数据结构 |
|-----|------|----------|
| `eq_consented` | 隐私同意状态 | boolean |
| `eq_codename` | 玩家代号 | string |
| `eq_reports` | 报告历史 | StoredReport[]（最多 100 条） |
| `eq_plan_progress` | 提升计划进度 | Record<string, boolean> |
| `eq_merit` | 木鱼功德 | number |
| `eq_merit_date` | 今日功德 | { date: string, count: number } |
| `eq_debate_progress` | 辩论学习进度 | Record<string, boolean> |
| `eq_divination_history` | 抽签历史 | DivinationRecord[]（最多 30 条） |
| `a11y_reduce_motion` | 减少动画偏好 | boolean |
| `a11y_high_contrast` | 高对比度偏好 | boolean |
| `a11y_large_text` | 大字体偏好 | boolean |
| `a11y_screen_reader` | 屏幕阅读器偏好 | boolean |

### 14.2 报告存储（reportStorage）

**StoredReport 接口**：
```typescript
interface StoredReport {
  id: string;
  timestamp: number;
  module: SceneModule;
  averageScore: number;
  levelEmoji: string;
  percentile: number;
  dims: { advocate: number; social: number; pressure: number; awkward: number; growth: number };
  sceneCount: number;
  codename: string;
}
```

**去重**：同模块 5 秒内不重复保存。**上限**：最多 100 条。

### 14.3 情商系数计算

`calculateEQCoefficient`：最近 3 次加权（0.2/0.3/0.5），越近权重越高。

### 14.4 趋势计算

`calculateTrend`：最近两次分数差，>3 为 up，<-3 为 down，否则 stable。

---

## 15. 版本演进记录

### v1.9.4（当前）

- 抽签概率调整（下签/下下签略少但保留）
- 新增 18 组签数据（总计 30 组）
- 学术场景背景修复（bgGradient 字段，解决点击卡顿）
- 抽签下滑布局优化（revealed 阶段竹筒缩小，按钮始终可见）

### v1.9.3

- 背景增强（水墨山水/庭院竹林清晰可见）
- 签文渐显动画 + 楷体行楷字体 + 淡色衬底
- 解签面板高级衬底纹理（信笺暗纹 + "禅"水印）
- 抽签概率调整（中签更多，下签/下下签更少）

### v1.9.2

- 修复再抽一签 bug（startShakingFlow 统一管理）
- 修复返回按钮无效（onBack 回调）
- 竹叶飘落特效（7 片竹叶随风飘过）
- 水墨山水背景（远山/中山/近山 + 庭院小桥 + 石灯笼）
- 竹筒 3D 质感增强（9 段渐变 + 高光/阴影带）
- 解签面板渐变融入背景（box-shadow + mask-image）

### v1.9.1

- 修复抽签点击空白（stacking context 问题）
- 统一工具页返回按钮（粘性顶栏）
- 页面切换动效优化（slide-in-right）
- 定时器清理防止内存泄漏

### v1.9.0

- 新增禅意抽签工具（12 支签 + 13 个专用动画）
- 工具箱列表页设计升级（特色卡片 + 装饰元素）

### v1.8.0

- 删除随机地狱模式
- 个人中心卡片视觉升级（渐变背景 + 成长等级徽章）
- 成长曲线趋势预测（线性回归）
- 建议模块升级为"哲学思辨"工具
- 焦虑急救/敲木鱼/计划独立为"工具"导航栏
- 新增"辩论技巧"工具（8 个专业技巧）
- 底部导航栏 3 Tab → 4 Tab
- 移除右下角悬浮 TRAE SOLO 图标

---

## 附录

### A. 关键文件路径

| 模块 | 路径 |
|------|------|
| 入口 | `src/main.tsx`、`src/App.tsx` |
| 状态管理 | `src/store/gameStore.ts` |
| 国际化 | `src/i18n/index.ts` |
| 类型定义 | `src/data/types.ts` |
| 段位配置 | `src/data/levels.ts` |
| 场景数据 | `src/data/scenes/*.ts` |
| 签数据 | `src/utils/divinationLots.ts` |
| 音频管理 | `src/utils/audioManager.ts` |
| 评分算法 | `src/utils/scoring.ts` |
| 报告存储 | `src/utils/reportStorage.ts` |
| 全局样式 | `src/index.css` |

### B. 部署流程

1. **Vercel 自动部署**（主）：`git push origin main` → Vercel 自动构建 → https://www.vectorfuture.xyz/
2. **GitHub Pages**（备）：`npm run deploy` → 推送到 `gh-pages` 分支

### C. 构建验证

```bash
npm run build  # 构建验证（86 模块，0 错误）
```
