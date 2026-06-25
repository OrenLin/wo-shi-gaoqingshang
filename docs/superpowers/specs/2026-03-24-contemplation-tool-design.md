# 沉思工具设计规范

## 功能概述

在工具箱中新增"沉思"工具，提供 4 个主题的全屏沉浸式语录体验，每个主题配有独特的 WebGL 特效背景。

## 核心需求

### 1. 主题与特效
- **宇宙（Universe）**：Galaxy 黑洞穿梭效果
- **电磁（Electromagnetism）**：Ferrofluid 铁磁流体效果
- **数字世界（Digital World）**：LetterGlitch 黑客帝国效果
- **轮回（Cycle）**：Balatro 流体光影效果

### 2. 语录系统
- 每个主题 6 条语录
- 混合风格：经典名言 + 原创诗意
- 支持中英文双语
- 8 秒自动切换，淡入淡出效果（0.5秒）
- 显示进度指示器

### 3. 交互设计
- 主题切换：点击底部按钮手动切换，淡入淡出过渡（0.5秒）
- 语录切换：自动轮播（8秒间隔）
- 语言切换：右上角按钮
- 返回：左上角按钮

### 4. 布局方案（毛玻璃卡片式）
- 全屏特效背景
- 毛玻璃卡片居中显示语录
- 底部主题切换按钮栏
- 左上角返回按钮
- 右上角语言切换按钮
- 移动端适配：100dvh、安全区域、响应式

## 技术方案

### 依赖安装
使用 shadcn CLI 安装 4 个 react-bits 特效组件：
```bash
npx shadcn@latest add @react-bits/Galaxy-JS-CSS
npx shadcn@latest add @react-bits/Ferrofluid-JS-CSS
npx shadcn@latest add @react-bits/LetterGlitch-JS-CSS
npx shadcn@latest add @react-bits/Balatro-JS-CSS
```

### 路径别名配置
在 tsconfig.json 中配置：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 文件结构
```
src/components/tools/
  Contemplation.tsx                    # 主组件
  contemplation/
    GalaxyBackground.tsx               # 宇宙特效封装
    FerrofluidBackground.tsx           # 电磁特效封装
    LetterGlitchBackground.tsx         # 数字世界特效封装
    BalatroBackground.tsx              # 轮回特效封装
    quotes.ts                          # 4×6 双语语录数据
```

### 组件设计

#### Contemplation.tsx
- 全屏沉浸式布局（100dvh）
- 状态管理：当前主题索引、当前语录索引、过渡状态
- 自动轮播逻辑（useEffect + setInterval）
- 主题切换逻辑（淡入淡出）
- 语言切换（调用 i18n store）
- 根据主题动态渲染背景组件

#### 背景封装组件
- 接收 react-bits 组件
- 配置特效参数
- 全屏铺满（absolute inset-0）

#### quotes.ts
- 导出 contemplationThemes 数组
- 每个主题包含：id、emoji、name（双语）、quotes（6条）
- 每条语录包含：zh、en、author

### 集成到 Tools.tsx
- 新增 ToolKey：'contemplation'
- 在工具列表中添加卡片
- 点击后渲染 Contemplation 组件（全屏沉浸式，类似抽签）

## 移动端适配

1. **视口高度**：使用 100dvh 替代 100vh
2. **安全区域**：
   - 顶部：`padding-top: env(safe-area-inset-top)`
   - 底部：`padding-bottom: env(safe-area-inset-bottom)`
3. **响应式布局**：
   - 毛玻璃卡片宽度：85%，max-width 340px
   - 主题按钮：40px 圆形
   - 字体大小：适配小屏
4. **触摸优化**：
   - 按钮点击区域足够大
   - 过渡动画流畅

## 性能优化

1. **懒加载**：特效背景组件按需渲染
2. **过渡动画**：使用 CSS transition 而非 JavaScript 动画
3. **内存管理**：组件卸载时清理定时器和事件监听器

## 国际化

- 所有文本支持中英文
- 使用 useI18n hook
- 语录数据包含双语版本
- 语言切换即时生效

## 音效反馈

- 主题切换：click 音效
- 语言切换：click 音效
- 使用 audioManager

## 测试要点

1. 4 个主题特效正常显示
2. 语录自动轮播（8秒）
3. 主题切换淡入淡出（0.5秒）
4. 中英文切换正常
5. 移动端布局适配
6. 返回按钮功能正常
7. 构建无错误
8. 部署到 Vercel 成功

## 版本信息

- 版本号：v1.9.8
- 提交信息：feat: 新增沉思工具（4主题特效+语录轮播）
