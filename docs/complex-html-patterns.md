# 复杂单文件 HTML 应用开发经验总结

> 本文档总结在「黑洞引力工具」「核反应堆 3D 教学工具」两个项目中沉淀的复杂单文件 HTML 应用开发经验。
> 适用场景：基于 Three.js / WebGL 的 3D 可视化、单文件交付、移动端优先、Vercel 部署。
> 最后更新：2026-07-26

---

## 一、项目背景

| 项目 | 文件 | 体积 | three.js 加载方式 | 复杂度 |
|------|------|------|-------------------|--------|
| 黑洞引力工具 | `public/gravity/blackhole.html` | 1.8MB | 内联 base64 importmap | 高（需 Python 解包/重打包） |
| 核反应堆教学 | `public/gravity/reactor.html` | 180KB | CDN importmap | 中（直接 Edit） |

两个项目都是**单文件 HTML**（CSS + JS 全部内联），通过 Vercel 部署，移动端优先。本文档沉淀两者对比中得出的最佳实践。

---

## 二、Three.js 加载方式对比与选型

### 方案 A：内联 base64 importmap（黑洞方案）

```html
<script type="importmap">
{
  "imports": {
    "three": "data:text/javascript;base64,XXX...",
    "gargantua/main": "data:text/javascript;base64,YYY..."
  }
}
</script>
```

**优点**：
- 完全离线，无 CDN 依赖
- 适合网络不稳定环境

**缺点**：
- 文件体积膨胀（base64 比原码大 33%）
- 主线程解码阻塞，移动端加载慢
- 修改需 Python 解包/重打包，可维护性差
- 无法利用浏览器缓存，每次访问都重新解码

**适用场景**：网络环境差、需离线运行、不再频繁修改。

### 方案 B：CDN importmap（反应堆方案，推荐）

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
  }
}
</script>
<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 业务代码
</script>
```

**优点**：
- 文件体积小（只含业务代码）
- 浏览器缓存 three.js，二次访问秒开
- 可直接用 Edit 工具修改，可维护性高
- importmap 支持版本锁定（`three@0.170.0`）

**缺点**：
- 依赖 CDN 可用性（jsDelivr 稳定性高，基本无问题）
- 首次访问需下载 three.js（~600KB，但浏览器会缓存）

**适用场景**：绝大多数 Web 3D 项目，尤其是需频繁迭代的项目。

### 选型决策树

```
需要离线运行？
  ├─ 是 → 内联 base64
  └─ 否 → CDN importmap（默认选择）
```

---

## 三、importmap 的关键约束

### 3.1 importmap 必须独立 script 块

**错误写法**（导致 JSON 解析失败，three.js 加载不了）：
```html
<script type="importmap">
{ "imports": { "three": "..." } }
</script>
<script>
// 这里不能插任何代码
console.log("业务代码");
</script>
```

**正确写法**：
```html
<script type="importmap">
{ "imports": { "three": "..." } }
</script>
<script type="module">
import * as THREE from 'three';
// 业务代码在这里
</script>
```

### 3.2 importmap 后不能有 modulepreload

`<link rel="modulepreload">` 与 importmap 同时存在会冲突，导致加载失败。**只用 importmap，不要加 modulepreload**。

### 3.3 importmap 必须在使用前

importmap script 必须出现在所有 `<script type="module">` 之前（HTML 顺序）。

---

## 四、移动端性能优化策略

### 4.1 画质分级（PERF 对象）

```js
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const isTablet = /iPad|Tablet/i.test(navigator.userAgent);

const PERF = {
  level: isMobile ? 0 : (isTablet ? 1 : 2),  // 0=低, 1=中, 2=高
  pixelRatio: isMobile ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 2),
  shadows: !isMobile,
  antialias: !isMobile,
  maxNeutrons: isMobile ? 60 : 180,
  tubeDetail: isMobile ? 20 : 40,
  // 纹理分辨率按档位分级
  texSize: PERF.level >= 2 ? 2048 : (PERF.level >= 1 ? 1024 : 512),
};
```

**关键点**：
- 移动端默认低画质（level=0）
- pixelRatio 上限 1.25（避免高分屏过载）
- 纹理分辨率分级（2048/1024/512）
- 关闭阴影、抗锯齿、Bloom

### 4.2 几何体分段数分级

```js
const tubeSeg = isMobile ? 20 : 40;  // 管道分段
const sphereSeg = isMobile ? 16 : 32; // 球体分段
```

### 4.3 粒子系统优化

- **预分配对象池**：`Float32Array` 固定长度，循环复用
- **隔帧更新**：`if(frameCount%2===0)` 减半更新频率
- **数量分级**：移动端 60，桌面端 180

### 4.4 重复结构用 InstancedMesh

```js
// 燃料棒 169 根，单 draw call
const fuelInstanced = new THREE.InstancedMesh(geo, mat, 169);
// 仅在位置变化时更新矩阵
fuelInstanced.setMatrixAt(i, matrix);
fuelInstanced.instanceMatrix.needsUpdate = true;
```

### 4.5 移动端 UI 适配

- 底部抽屉式控制台（默认收起，拉手展开）
- 右上角设置按钮（圆形或胶囊）
- 触控优化：单指旋转 / 双指缩放 / 禁用平移
- `maxPolarAngle` 限制不能俯视到地下
- safe-area-inset 适配刘海屏

---

## 五、材质共享陷阱

### 5.1 问题

```js
const glowMat = new THREE.MeshBasicMaterial({color:0xff2a1a, transparent:true, opacity:0.9});
const eye = new THREE.Mesh(geo, glowMat);
const tooth = new THREE.Mesh(geo, glowMat);  // 共享同一材质

// 动画中修改 opacity
eye.material.opacity = 0.5;  // tooth 也跟着变！
```

### 5.2 解决方案

**动画化元素必须用独立材质实例**：
```js
const eyeMat = glowMat.clone();  // 或重新 new
const eye = new THREE.Mesh(geo, eyeMat);
```

**非动画元素可共享**（节省内存）：
```js
const staticMat = new THREE.MeshStandardMaterial({...});
const box1 = new THREE.Mesh(geo, staticMat);
const box2 = new THREE.Mesh(geo, staticMat);  // OK，不修改 opacity
```

---

## 六、程序纹理生成

### 6.1 Canvas 纹理（无需外部图片）

```js
function createRustTexture(){
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#5a2a14';
  x.fillRect(0, 0, 256, 256);
  // 锈斑
  for(let i = 0; i < 80; i++){
    x.fillStyle = `rgba(${60+Math.random()*60|0}, ${20+Math.random()*30|0}, ${10}, ${0.3+Math.random()*0.5})`;
    x.beginPath();
    x.arc(Math.random()*256, Math.random()*256, 2+Math.random()*8, 0, Math.PI*2);
    x.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
```

### 6.2 纹理缓存（避免重复生成）

```js
function createContainerStack(){
  if(!createContainerStack.rustTex){
    createContainerStack.rustTex = createRustTexture();  // 首次生成，缓存
  }
  const mat = new THREE.MeshStandardMaterial({map: createContainerStack.rustTex});
  // 多个 mesh 共享同一纹理（纹理共享是安全的，不像材质）
}
```

### 6.3 分辨率分级

```js
const texSize = PERF.level >= 2 ? 2048 : (PERF.level >= 1 ? 1024 : 512);
// 移动端 512²，桌面端 2048²
```

**避免同步生成多张大纹理**：4 张 2048² 纹理同步生成会阻塞主线程数秒。

---

## 七、相机视角预设系统

### 7.1 预设定义

```js
const CAM_PRESETS = {
  mobile_intro: {pos: new THREE.Vector3(26, 17, 30), target: new THREE.Vector3(-4, 8, -6)},
  mobile_console: {pos: new THREE.Vector3(14, 22, 18), target: new THREE.Vector3(0, 11, 0)},
  top: {pos: new THREE.Vector3(0, 28, 12), target: new THREE.Vector3(0, 4, 0)},
};

function targetCamera(name){
  const c = CAM_PRESETS[name];
  if(!c) return;
  camTarget = {pos: c.pos.clone(), target: c.target.clone(), t: 0};
}

function updateCamera(dt){
  if(!camTarget) return;
  camTarget.t += dt * 1.2;
  const a = Math.min(1, THREE.MathUtils.smoothstep(camTarget.t, 0, 1));
  camera.position.lerp(camTarget.pos, a);
  controls.target.lerp(camTarget.target, a);
  controls.update();
  if(a >= 1) camTarget = null;
}
```

### 7.2 移动端 FOV 调整

```js
if(isMobile){
  camera.fov = 58;  // 略放宽，让更多背景元素入镜
  camera.updateProjectionMatrix();
}
```

### 7.3 初始视角与 controls.target 同步

```js
if(isMobile){
  camera.position.set(26, 17, 30);
  controls.target.set(-4, 8, -6);  // 必须与 mobile_intro 一致
  controls.update();
}
```

---

## 八、动画循环组织

### 8.1 主循环结构

```js
let lastTime = 0, frameCount = 0;
function animate(time){
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, (time - lastTime) / 1000);
  lastTime = time;
  frameCount++;

  // 1. 物理模拟（固定 30Hz）
  // 2. 相机动画
  updateCamera(dt);
  // 3. 各元素动画（按优先级）
  if(W.spaceships) updateSpaceships(dt, time);
  if(W.giantBot) updateGiantBot(dt, time);
  if(W.scavengers) updateScavengers(dt, time);
  if(W.drones) updateDrones(dt, time);
  // 4. 渲染
  renderer.render(scene, camera);
}
```

### 8.2 隔帧更新减负

```js
if(frameCount % 2 === 0){
  // 粒子位置更新（每 2 帧一次）
  // 注意：dt 要补偿（乘以 2）
  dPos[i*3+1] += dt * 0.6 * 2;  // 补偿隔帧
}
```

### 8.3 userData 引用缓存

```js
// 创建时存引用
g.userData.glowEye = eye;
g.userData.engineLights = [light, lightL, lightR];

// 动画时直接用，避免每帧遍历 children
const ud = bot.userData;
if(ud.glowEye) ud.glowEye.material.opacity = 0.85 + Math.sin(time*3.2)*0.12;
```

---

## 九、版本控制与部署

### 9.1 Git 工作流

```bash
# 修改后
git add public/gravity/reactor.html
git commit -m "feat(gravity/reactor): 手机端体验与场景丰富度升级

- 右上角「原理」按钮改为图标+文字胶囊
- 新增路人系统：拾荒机器人+无人机
- 柔化飞船灯光
- 巨人细节增加
- 周围装置丰富"
git push origin main  # 触发 Vercel 自动部署
```

### 9.2 Commit Message 规范

```
<type>(<scope>): <subject>

<body 列出关键改动>
```

**type**：
- `feat`：新功能
- `fix`：修复 bug
- `refactor`：重构
- `docs`：文档

**scope**：
- `gravity/reactor`：反应堆工具
- `gravity/blackhole`：黑洞工具
- `gravity`：引力工具集通用
- `profile`：个人中心
- `tools`：工具箱

### 9.3 Vercel 部署特性

- 推送到 main 分支自动触发部署
- 部署时间约 1-2 分钟
- CDN 缓存可能导致"看不到更新"，建议：
  - 等待 1-2 分钟
  - 手机端强制刷新 / 清缓存
  - 或加 `?fresh=1` 参数

### 9.4 黑洞工具的特殊同步要求

黑洞工具有两个文件需同步：
- 源文件：`黑洞引力.html`（根目录）
- 部署文件：`public/gravity/blackhole.html`

修改后必须执行：
```bash
cp 黑洞引力.html public/gravity/blackhole.html
```

**反应堆工具无此问题**（只有 `public/gravity/reactor.html` 一个文件）。

---

## 十、调试与验证流程

### 10.1 本地预览

```bash
python3 -m http.server 8765 --directory /workspace/public
# 访问 http://localhost:8765/gravity/reactor.html
```

### 10.2 语法检查（修改后必做）

```bash
# 提取所有 inline script，用 vm 检查语法
node -e "
const fs = require('fs');
const html = fs.readFileSync('public/gravity/reactor.html', 'utf8');
const vm = require('vm');
const scripts = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach((src, i) => {
  try { new vm.Script(src); console.log('SCRIPT ' + i + ' OK'); }
  catch(e) { console.log('SCRIPT ' + i + ' ERROR: ' + e.message); }
});
"
```

**注意**：
- SCRIPT 0 通常是 importmap JSON，会报 `Unexpected token ':'`，正常
- ES module 的 `import/export` 用 vm 检查需先剥离

### 10.3 关键片段检查

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('public/gravity/reactor.html', 'utf8');
const checks = ['function createScavengerBot', 'W.scavengers=', 'mobile_intro:{pos'];
const missing = checks.filter(c => !html.includes(c));
if(missing.length === 0) console.log('All key snippets present');
else console.log('MISSING: ' + missing.join(', '));
"
```

### 10.4 括号平衡检查

```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('public/gravity/reactor.html', 'utf8');
let braces = 0, parens = 0, brackets = 0;
for(const ch of html){
  if(ch === '{') braces++; else if(ch === '}') braces--;
  if(ch === '(') parens++; else if(ch === ')') parens--;
  if(ch === '[') brackets++; else if(ch === ']') brackets--;
}
console.log('Brace: ' + braces + ', Paren: ' + parens + ', Bracket: ' + brackets);
// 期望全为 0
"
```

### 10.5 HTTP 加载验证

```bash
curl -s -o /dev/null -w "HTTP:%{http_code} TIME:%{time_total}s SIZE:%{size_download}\n" \
  http://localhost:8765/gravity/reactor.html
# 期望 HTTP:200
```

---

## 十一、常见错误与修复

| 错误现象 | 根因 | 修复 |
|---------|------|------|
| 页面白屏 / loading 卡住 | importmap 后误插代码 | importmap 必须独立 script 块 |
| `Unexpected token ':'` | JS 对象字面量 `key=value` 应为 `key:value` | 修正语法 |
| 加载慢（数秒） | 多张大纹理同步生成 | 按 PERF.level 分级纹理分辨率 |
| 动画元素全部闪烁 | 共享材质修改 opacity | 动画元素用独立材质实例 |
| 加载时降级失败 | 函数名错误（setQuality vs applyQuality） | 核对实际函数名 |
| 手机端打不开 | CDN 不可达 / base64 解码阻塞 | 黑洞用内联，反应堆用 CDN |
| `null is not an object` | HTML 中必需的 div 被删 | 检查 `#params` 等 div 是否存在 |
| 看不到更新 | Vercel CDN 缓存 | 等 1-2 分钟 / 强制刷新 / 加 `?fresh=1` |

---

## 十二、文件体积控制

### 12.1 体积对比

| 文件 | 体积 | 主要来源 |
|------|------|---------|
| blackhole.html | 1.8MB | 内联 three.js base64（1.27MB） |
| reactor.html | 180KB | 业务代码（three.js 走 CDN） |

### 12.2 控制策略

- **优先 CDN 加载 three.js**（180KB vs 1.8MB）
- 程序纹理用 Canvas 生成，不内联图片
- 几何体用代码构建，不导入模型文件
- 重复结构用 InstancedMesh
- 注释适度，不过度冗长

---

## 十三、移动端 UI 设计要点

### 13.1 按钮可识别性

**问题**：纯图标按钮新用户看不懂。

**解决**：图标 + 文字胶囊
```html
<button>
  <svg>...</svg>
  <span>原理解析</span>
</button>
```

### 13.2 底部抽屉控制台

- 默认收起（不挡主视图）
- 拉手 + 半透明遮罩
- 展开时相机抬高，让主体在抽屉上方可见
- 点击遮罩收起

### 13.3 视角预设

- 进入默认广角（看到主体 + 背景元素）
- 展开控制台时切换到操控视角
- 收起时回到初始广角

### 13.4 safe-area 适配

```css
.bottom-drawer {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 十四、新增场景元素的模板

以「新增一个路人机器人」为例，完整流程：

### 14.1 创建函数

```js
function createScavengerBot(){
  const g = new THREE.Group();
  // 材质
  const bodyMat = new THREE.MeshStandardMaterial({color: 0x3a2a1c, metalness: 0.55, roughness: 0.8});
  // 几何体
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.5), bodyMat);
  torso.position.y = 0.95;
  g.add(torso);
  // 返回 mesh + 动画需要的子部件引用
  return {mesh: g, legL, legR, torso, head};
}
```

### 14.2 实例化

```js
const scavengers = [];
const specs = [
  {pos: [-18, 0, 12], ry: 0.6, phase: 0},
  {pos: [16, 0, 18], ry: -0.4, phase: 1.5},
];
for(const s of specs){
  const bot = createScavengerBot();
  bot.mesh.position.set(...s.pos);
  bot.mesh.rotation.y = s.ry;
  bot.walkPhase = s.phase;
  scene.add(bot.mesh);
  scavengers.push(bot);
}
W.scavengers = scavengers;  // 存到全局 W 对象
```

### 14.3 动画

```js
if(W.scavengers){
  for(const bot of W.scavengers){
    const m = bot.mesh;
    bot.walkPhase += dt * 1.2;
    const walkAmount = Math.sin(bot.walkPhase) * 0.6;
    // 腿部摆动
    const legSwing = Math.sin(bot.walkPhase * 3) * 0.4;
    if(bot.legL) bot.legL.rotation.x = legSwing;
    if(bot.legR) bot.legR.rotation.x = -legSwing;
  }
}
```

### 14.4 调整视角让新元素入镜

```js
// 修改 CAM_PRESETS.mobile_intro
mobile_intro: {pos: new THREE.Vector3(26, 17, 30), target: new THREE.Vector3(-4, 8, -6)},
// 同步更新初始相机位置
if(isMobile){
  camera.position.set(26, 17, 30);
  controls.target.set(-4, 8, -6);
}
```

---

## 十五、检查清单（修改后必走）

- [ ] 语法检查通过（vm.Script）
- [ ] 关键片段都存在
- [ ] 括号平衡为 0
- [ ] HTTP 200 加载成功
- [ ] 浏览器无 console 错误
- [ ] 移动端尺寸下视觉正常
- [ ] commit message 符合规范
- [ ] push 后等 1-2 分钟验证线上

---

## 十六、参考资源

- Three.js 文档：https://threejs.org/docs/
- importmap 规范：https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap
- Vercel 部署：https://vercel.com/docs
- 项目 HANDOVER：`/workspace/HANDOVER.md`

---

*本文档由 reactor.html 和 blackhole.html 两个项目的开发经验沉淀，供后续复杂单文件 HTML 应用开发参考。*
