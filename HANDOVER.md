# 项目交接文档 — 情商修炼手册 + 引力工具集

> 本文档用于开启全新对话时快速恢复上下文。最后更新：2026-07-26
> 当前对话已过长，建议新会话以此文档作为入口。

---

## 一、项目概述

**项目名称**：情商修炼手册（EQ Handbook）+ 引力工具集（Gravity Tools）
**线上地址**：https://www.vectorfuture.xyz/
**仓库**：https://github.com/OrenLin/wo-shi-gaoqingshang.git
**分支**：main（推送到 main 自动触发 Vercel 部署）
**本地路径**：`/workspace`

**技术栈**：
- React 18 + TypeScript + Vite 6
- Tailwind CSS 3 + tw-animate-css
- Zustand 5（状态管理，基于 `currentPage` 切页，不用 react-router）
- shadcn/ui + lucide-react
- 引力工具：单文件 HTML + Three.js 0.170.0（ESM + importmap，CDN 加载）
- 部署：Vercel（自动 CI/CD）
- 版本：v1.4.0

**视觉风格**：漫画粗描边 + 硬阴影 + 琥珀橙渐变 + 弹性动画，移动端优先。

---

## 二、关键目录结构

```
/workspace
├── src/
│   ├── App.tsx                      # 路由分发，根据 currentPage 渲染
│   ├── main.tsx                     # 入口
│   ├── store/gameStore.ts           # Zustand 全局状态（PageName/answers/scoring）
│   ├── pages/
│   │   ├── Home.tsx                 # 首页
│   │   ├── SceneModules.tsx         # 场景模块选择
│   │   ├── SceneSelect.tsx          # 场景列表
│   │   ├── Game.tsx                 # 答题页
│   │   ├── Result.tsx               # 单题结果
│   │   ├── FinalReport.tsx          # 总报告
│   │   ├── Profile.tsx              # 个人中心（4 Tab: 历史/轨迹/计划/藏品）
│   │   └── Tools.tsx                # 工具箱入口
│   ├── components/
│   │   ├── ui/BottomNav.tsx         # 底部导航 5 Tab（含🪐引力）
│   │   ├── profile/
│   │   │   ├── CollectionViewer.tsx # 藏品展示柜（3D GIF 手办柜）
│   │   │   ├── ReportHistory.tsx
│   │   │   ├── EQTrajectory.tsx
│   │   │   ├── EQPlan.tsx
│   │   │   ├── AnxietyQuiz.tsx
│   │   │   ├── PersonalAdvice.tsx
│   │   │   └── WoodfishZen.tsx
│   │   ├── tools/
│   │   │   ├── Contemplation.tsx    # 沉思（10 主题 WebGL 背景）
│   │   │   ├── Divination.tsx       # 抽签解签
│   │   │   ├── PhilosophyInsight.tsx
│   │   │   ├── DebateSkills.tsx
│   │   │   └── contemplation/       # 10 个 WebGL 背景组件
│   │   └── scene/                   # 场景卡片、选项列表等
│   ├── data/scenes/                 # 场景题目数据（学术/家宴/职场）
│   └── i18n/                        # 中英双语
├── public/
│   ├── collections/                 # 4 个 3D GIF（gundam/taxi/dog/cat）
│   ├── gravity/
│   │   ├── index.html               # 引力工具集入口页（卡片导航）
│   │   ├── blackhole.html           # 黑洞工具（独立单文件，~1.8MB，内联 three.js base64）
│   │   └── reactor.html             # 核反应堆 3D 教学工具（单文件 ~180KB，CDN 加载 three.js）
│   └── favicon.svg
├── contemplation-skill/             # 独立 SKILL 仓库（已推送到 GitHub）
├── docs/
│   ├── app-features-for-rag.md      # RAG 知识库文档（约 3000 字）
│   └── feature-design.md
├── 黑洞引力.html                     # 黑洞工具源文件（与 public/gravity/index.html 同步）
├── vercel.json                      # 路由 rewrite 规则
└── package.json
```

---

## 三、两大功能模块现状

### 模块 A：藏品展示柜（CollectionViewer）

**位置**：`src/components/profile/CollectionViewer.tsx`（约 17.74KB / gzip 3.59KB）
**入口**：Profile 页面 → "藏品" Tab（lazy 加载 + Suspense）
**数据**：4 个 3D GIF 藏品（位于 `public/collections/`）

| ID | 名称 | 文案 | GIF | 稀有度 |
|----|------|------|-----|--------|
| gundam | 高达 | 钢铁之翼，守护和平的机动战士 | gundam.gif | LEGENDARY |
| taxi | 出租车 | T0678 可靠的伙伴，永远的回忆 | taxi.gif | RARE |
| dog | 狗狗 | 一只可爱的小狗，叫做香香，他喜欢溜溜猫 | dog.gif | EPIC |
| cat | 猫猫 | 一只大怨种猫，叫做风铃，总是没有笑脸 | cat.gif | EPIC |

**技术要点**：
- `IntersectionObserver` 懒加载 GIF（rootMargin 100px，data-src → src 替换）
- 博物馆手办柜 UI：射灯光晕（radial-gradient）+ 玻璃柜门反光（linear-gradient）+ 圆形展台 + 金属铭牌
- 稀有度系统：LEGENDARY（金）/ EPIC（紫）/ RARE（蓝）
- 全屏沉浸式详情弹层（`fixed inset-0 z-[60]`）

**待办（用户上次提到，部分已完成）**：
- ✅ 图层混合问题已修复
- ✅ 文案已更新（出租车 T0678、小狗香香、猫猫风铃）
- ✅ UI 已升级为博物馆手办柜风格
- ⚠️ 小狗"不旋转"控制：当前实现依赖 GIF 自身动画，若用户再次反馈需检查 dog.gif 是否静态
- ⚠️ 可进一步优化"专业设计感"（用户原话：充满设计感）

---

### 模块 B：黑洞引力工具（GARGANTUA）

**位置**：
- 源文件：`/workspace/黑洞引力.html`（1,809,190 字节 / 1.73 MB）
- 部署文件：`/workspace/public/gravity/index.html`（同步副本）
- **修改时务必同时更新这两个文件**（或修改后 `cp 黑洞引力.html public/gravity/index.html`）

**入口**：底部导航栏右侧「🪐 引力」Tab → `window.location.href = '/gravity'`
**返回**：黑洞页左上角 ‹ 按钮 → `history.back()` 返回 React 应用

**文件结构**（单文件 HTML，所有 JS 内联为 base64 importmap）：
- importmap 模块（5 个，已移除 spaceship）：
  - `three`（1.27MB，主要体积来源）
  - `gargantua/orbit-controls`（29KB）
  - `gargantua/shaders`（13KB）
  - `gargantua/post`（6.7KB，HDR 后处理管线）
  - `gargantua/main`（23KB，应用主逻辑）
- HTML/CSS：顶部栏 + 加载提示 + 底部抽屉式参数面板

**核心参数**：
- 12 项核心参数 + 9 项高级参数（折叠隐藏）= 共 21 项
- 3 档画质：standard(96步) / high(176步) / cinematic(256步)
- 4 个视角预设：视界 / 极区 / 光子环 / 深场
- 1 个最佳预设（B 键）

**移动端适配**（最新 commit `55367f5`）：
- 加载提示界面（脉冲动画 + "正在塌缩时空…"文案）
- 右侧固定面板 → **底部抽屉式可折叠**（默认收起，⚙ 按钮切换）
- 默认视角：camDistance=8.5 / inclination=82° / fov=60°（黑洞居中）
- 触摸优化：单指旋转 / 双指缩放 / 禁用平移
- safe-area-inset 适配刘海屏
- 自适应降级：持续 <24fps 自动降一档画质
- 电影运镜默认关闭（开启时幅度减小，黑洞保持居中）

**桌面端**：自动切换为右侧浮动面板（min-width: 900px）

**已知待办**：
- 用户反馈"略慢"——主要瓶颈是 1.27MB 的 three.js 内联 base64，但拆分需重构为多文件部署（当前单文件方案最稳）
- 未来可能扩展多个「引力」工具，黑洞是第一个

---

### 模块 C：核反应堆 3D 教学工具（Reactor）

**位置**：`/workspace/public/gravity/reactor.html`（单文件 ~180KB，CDN 加载 three.js）
**入口**：`/gravity/reactor`（vercel.json 已配置 rewrite）
**分享链接**：`https://www.vectorfuture.xyz/gravity/reactor`

**与黑洞工具的关键差异**：
| 维度 | blackhole.html | reactor.html |
|------|----------------|--------------|
| three.js 加载 | 内联 base64（1.27MB） | CDN importmap（~600KB，浏览器缓存） |
| 文件体积 | 1.8MB | 180KB |
| 加载速度 | 慢（base64 解码阻塞） | 快（CDN + 浏览器缓存） |
| 可维护性 | 难（需 Python 解包/重打包） | 易（直接 Edit） |
| 移动端默认画质 | standard | 低画质（PERF.level=0） |

**核心功能**：
- 3D 压水反应堆模型：压力容器（透明 MeshPhysicalMaterial）+ 燃料棒/控制棒（InstancedMesh）+ 蒸汽发生器 + 主泵 + 汽轮机
- 4 个实时控制参数：控制棒插入深度 / 冷却剂流量 / 硼浓度 / 反应性反馈
- 7 个预设场景：临界 / 满功率 / 紧急停堆 / 失水事故 / 启动 / 冷停堆 / 自然循环
- 8 个部件标注（CSS2DRenderer 中文标签）
- 原理解析浮层（Reactor 101）：4 章节教学卡片
- 末日废土风格环境：焦土天空 + 龟裂地面 + 远景大机器人 + 飞船 + 战车

**最新升级（commit a22f1f9）**：
- 右上角「原理」按钮改为图标+「原理解析」胶囊
- 新增路人系统：2 个地面拾荒小机器人（弯腰搜寻动画）+ 3 架空中巡逻无人机（圆周盘旋+旋翼）
- 飞船灯光柔化：点光源 decay=2 物理衰减 + 冷色辅光 + 外层柔光晕 + 超大柔光拖尾
- 巨人细节：颈部液压杆/铆钉阵列/散热鳍片/肩部尖刺底座/胸口护环+能量导管/武器排气口/背部喷气背包+烟雾
- 周围装置：3 堆锈蚀集装箱（程序纹理）/CatmullRom 输油管道+阀门/2 根异相警示灯柱/旋转雷达天线/散落废铁
- 默认视角 mobile_intro (26,17,30) 朝向 (-4,8,-6)，FOV 58°，让路人+无人机+大机器人同时入镜

**性能分级**（PERF 对象）：
```js
PERF = {
  level: isMobile ? 0 : (isTablet ? 1 : 2),  // 0=低, 1=中, 2=高
  pixelRatio: isMobile ? Math.min(dpr, 1.25) : Math.min(dpr, high?2:1.5),
  maxNeutrons: isMobile ? (med?100:60) : (high?180:120),
  tubeDetail: isMobile ? 20 : 40,
  // 纹理分辨率按档位分级：2048/1024/512
}
```

**踩坑历史**（避免重蹈覆辙）：
1. importmap 后误插代码 → JSON 解析失败 → three.js 加载失败 → **importmap 必须独立 script 块，其后才能插业务代码**
2. JS 对象字面量 `neutrons=true` 应为 `neutrons:true` → 整个脚本块语法错误 → 页面白屏
3. 4 张 2048² 程序纹理同步生成阻塞主线程 → 改为按 PERF.level 分级（2048/1024/512）
4. 共享材质修改 opacity 会影响所有引用该材质的 mesh → 动画化元素必须用独立材质实例
5. `setQuality(0)` 函数名错误，实际是 `applyQuality(0)` → 加载时降级失败

**已知待办**：
- [ ] 真机验证高画质下性能
- [ ] 可能增加更多教学场景（如切尔诺贝利事故还原）

---

## 四、近期 Git 提交记录

```
a22f1f9 feat(gravity/reactor): 手机端体验与场景丰富度升级   ← 最新
d2906b8 feat(gravity/reactor): 重构移动端布局，消除顶部遮挡，优化抽屉交互
ccbca36 fix(gravity/reactor): 修复打不开 - 致命语法错误 + 纹理分辨率分级
b861b65 fix(gravity/reactor): 修复打不开 - 移除 modulepreload 与 importmap 冲突
86d3d12 fix(gravity/reactor): 修复打开慢/打不开 + 加载失败兜底
e1aeb19 feat(gravity): 独立分享链接 + 移动端画质与访问速度优化
55367f5 feat(gravity): 黑洞工具移动端深度优化
e477b56 feat: 手机端面板改底部可折叠dock-不挡黑洞
93736d0 fix: 补回被误删的#params div - 修复null is not an object
4c5f985 feat: 新增万有引力工具集 - 黑洞轻量版
8ed174d feat: 藏品柜UI升级 - 修复图层混合/控制旋转/文案更新
```

**黑洞工具踩坑历史**（避免重蹈覆辙）：
1. 手机端加载失败 → 必须内联 three.js（不能用 CDN/外部 import）
2. `null is not an object` → HTML 中 `#params` div 不能删
3. 飞船功能 → 已彻底移除（用户多次要求）
4. 右侧面板挡黑洞 → 改底部抽屉
5. 电影模式黑屏 → 默认关闭，幅度减小

---

## 五、常用命令

```bash
# 开发
npm run dev              # 启动 Vite dev server
npm run build            # 构建（tsc -b && vite build）
npm run check            # 类型检查（不输出文件）
npm run lint             # ESLint

# 部署（推送到 main 分支即自动触发 Vercel 部署）
git add -A && git commit -m "feat: xxx" && git push origin main

# 黑洞工具修改后同步（重要！）
cp 黑洞引力.html public/gravity/index.html
```

---

## 六、修改黑洞工具的正确流程

由于 `黑洞引力.html` 是单文件且体积 1.8MB，**不能直接用 Read 工具读取整个文件**（会超过 128KB 限制）。正确流程：

1. **解析 importmap**（Python 脚本）：
   ```python
   import json, base64
   with open('黑洞引力.html', 'r', encoding='utf-8') as f:
       lines = f.readlines()
   importmap = json.loads(lines[168].strip())  # 第 169 行是 importmap
   for name, dataurl in importmap['imports'].items():
       b64 = dataurl[len('data:text/javascript;base64,'):]
       code = base64.b64decode(b64).decode('utf-8')
       # 写入临时文件进行修改
   ```

2. **修改对应模块**（如 `gargantua_main.js`）

3. **重新打包**（Python 脚本）：
   ```python
   new_imports = {}
   for name, dataurl in importmap['imports'].items():
       if name == 'gargantua/main':
           with open('_bh_main_new.js') as f: code = f.read()
           b64 = base64.b64encode(code.encode()).decode()
           new_imports[name] = f'data:text/javascript;base64,{b64}'
       else:
           new_imports[name] = dataurl  # 保持原样
   new_importmap_str = json.dumps({'imports': new_imports}, separators=(',',':'), ensure_ascii=False)
   # 替换模板中的 __IMPORTMAP__ 占位符
   ```

4. **同步两个文件**：
   ```bash
   cp 黑洞引力.html public/gravity/index.html
   ```

5. **验证**：
   ```python
   # 检查 importmap 模块列表、HTML 标签平衡、关键函数存在
   ```

6. **提交推送**：
   ```bash
   git add public/gravity/index.html 黑洞引力.html
   git commit -m "feat(gravity): xxx"
   git push origin main
   ```

---

## 七、部署与路由

**vercel.json**（路由 rewrite）：
```json
{
  "rewrites": [
    { "source": "/contemplation", "destination": "/index.html" },
    { "source": "/divination", "destination": "/index.html" },
    { "source": "/philosophy", "destination": "/index.html" },
    { "source": "/anxiety", "destination": "/index.html" },
    { "source": "/woodfish", "destination": "/index.html" },
    { "source": "/debate", "destination": "/index.html" },
    { "source": "/gravity", "destination": "/gravity/index.html" },
    { "source": "/gravity/blackhole", "destination": "/gravity/blackhole.html" },
    { "source": "/gravity/reactor", "destination": "/gravity/reactor.html" }
  ]
}
```

- `/gravity` 是工具集入口（卡片导航），`/gravity/blackhole` 和 `/gravity/reactor` 是两个独立子工具
- 其他 `/contemplation` 等都是 SPA 内页（rewrite 到 index.html 由 React 路由处理）
- Vercel 部署有时有 CDN 缓存，用户反馈"看不到更新"时建议：
  - 等待 1-2 分钟
  - 手机端强制刷新 / 清缓存
  - 或加 `?fresh=1` 参数强制跳过 localStorage

---

## 八、用户偏好与协作风格

- **语言**：中文沟通，代码注释中文
- **风格**：偏好"顶级 UI/UX 设计"、"充满设计感"、"专业"
- **核心诉求**：移动端体验优先，打开速度要快
- **常见反馈模式**：先要求功能 → 要求裁剪简化 → 要求移动端适配 → 要求细节微调
- **SKILL 使用**：用户熟悉 brainstorming / spec / plan / algorithmic-art 等 skill
- **独立 SKILL 仓库**：`contemplation-skill/` 已推送到 GitHub，名为 `product-design-0to1`

---

## 九、待办与可能的下一步

### 黑洞工具
- [ ] 进一步提升打开速度（考虑拆分 three.js 为独立 JS 文件，但需重构部署方式）
- [ ] 未来扩展多个「引力」子工具（黑洞是第一个）
- [ ] 可能增加声音引导/解说

### 藏品展示柜
- [ ] 小狗旋转控制（若 GIF 自带旋转动画，需考虑替换为静态图或 CSS 动画）
- [ ] 进一步提升"设计感"（用户多次提及）
- [ ] 可能增加更多藏品

### 整体
- [ ] RAG 知识库文档已生成（`docs/app-features-for-rag.md`），用于后续测试
- [ ] 持续优化移动端性能

---

## 十、关键文件速查表

| 任务 | 文件路径 |
|------|----------|
| 修改底部导航 | `src/components/ui/BottomNav.tsx` |
| 修改藏品展示 | `src/components/profile/CollectionViewer.tsx` |
| 修改个人中心 | `src/pages/Profile.tsx` |
| 修改全局状态 | `src/store/gameStore.ts` |
| 修改黑洞工具 | `黑洞引力.html` + `public/gravity/blackhole.html`（同步） |
| 修改核反应堆工具 | `public/gravity/reactor.html`（直接 Edit，无需同步） |
| 修改引力工具集入口 | `public/gravity/index.html` |
| 修改路由 | `vercel.json` |
| RAG 文档 | `docs/app-features-for-rag.md` |
| 复杂 HTML 应用经验 | `docs/complex-html-patterns.md` |
| 产品设计 SKILL | `contemplation-skill/SKILL.md` |
| 设计文档 | `.trae/documents/*.md` |

---

## 十一、新会话启动建议

开启新对话时，建议这样开场：

> "我正在继续开发情商修炼手册项目（https://www.vectorfuture.xyz/），仓库在 /workspace。请先阅读 HANDOVER.md 了解项目现状，然后帮我 [具体任务]。"

**常见任务示例**：
- "优化藏品展示柜的 UI 设计感"
- "黑洞工具加载还是慢，帮我优化"
- "新增一个引力工具子分类"
- "修复 xxx 页面的 xxx 问题"

---

*本文档由上一轮对话生成，用于上下文交接。如有疑问以代码实际状态为准。*
