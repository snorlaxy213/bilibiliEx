# AGENTS.md — bilibiliEx

> 给后续接手的 AI Agent 看的项目说明。最后更新：v0.3.3（2026-10-07）。

## 项目定位

B 站直播间（`live.bilibili.com/*`）净化增强油猴脚本，对标已停更的 douyuEx（斗鱼版）。目标是把 B 站直播间净化到「只留播放器 + 右侧弹幕流」的极简形态，并叠加自动网页全屏、自动最高画质等增强功能。

## 技术栈与构建

- **形式**：Tampermonkey 用户脚本（`.user.js`）
- **打包**：esbuild（IIFE 单文件输出），构建脚本 `build.js`
- **运行时**：托管 Node v22.22.2-6（`/Users/superman/.workbuddy/binaries/node/versions/22.22.2-6/bin/node`）
- **依赖位置**：esbuild 装在 `/Users/superman/.workbuddy/binaries/node/workspace/node_modules`，项目内通过 `node_modules` 软链接引用（ESM 不认 NODE_PATH）
- **构建命令**：在项目根目录执行 `node build.js` → 产物 `dist/biliex.user.js`
- **语法校验**：`node --check dist/biliex.user.js`
- **油猴头**：单独维护在 `src/meta.js`，build 时拼接进产物头部

## 源码结构

```
src/
  meta.js                      油猴 @match/@grant/version 等元数据
  main.js                      入口，注册各模块
  common/
    dom.js                     DOM 工具：injectCss、waitFor、onRouteChange 等
    settings.js                GM_setValue/getValue 封装 + 事件总线
  packages/
    purify/                    M1 净化核心
      features.js              净化规则表（key/group/selector/desc）
      index.js                 按 html[bx-<key>] 属性前缀注入 CSS
    panel/                     M2 设置面板
      panel.css.js             面板 + 悬浮球 + 控制条图标的 CSS
      index.js                 面板 UI、B 图标定位、设置开关渲染
    danmaku-filter/            M3 弹幕关键词/正则过滤
      index.js
    enhance/                   v0.3.0 新增增强模块
      features.js              增强开关表
      index.js                 自动网页全屏 + 自动最高画质
```

## 净化 CSS 注入机制（重要）

所有净化规则用**属性前缀选择器**实现开关：

```js
html[bx-<featureKey>] #some-element { display: none !important; }
```

- 所有规则一次性 `GM_addStyle` 注入
- 开关 = 给 `<html>` 增删 `bx-<key>` 属性，零重排
- B 站 SPA 换房不刷新页面，属性保留即生效，**无需重新处理**

## B 站直播间 DOM 实测结论（v0.3.x 取证）

> 这些是从 B 站线上播放器 JS 包反查得到的稳定结构，**别用旧资料**。

### 已失效（旧版 douyuEx/早期资料会引用，但当前 B 站已改版）

- `#control-panel-ctnr-box` — 播放器控制条外壳 id，**已消失**
- `.icon-left-part` — 控制条左侧按钮簇，**已消失**

### 当前有效稳定结构

| 用途 | 选择器 | 备注 |
|---|---|---|
| 播放器控制条外壳 | `#web-player-controller-wrap-el` | 源码写死的稳定 id |
| 控制条按钮 | `span.icon`（Svelte tooltip 组件） | tooltip 文案写死：「网页模式」「全屏模式」「关闭弹幕」等 |
| 礼物栏 | `#gift-control-vm` | 用户开了「礼物栏」净化后会消失，不能当主锚点 |
| 右侧聊天面板 | `#aside-area-vm` | 稳定 |
| 弹幕发送框面板 | `#chat-control-panel-vm` | **当前 B 图标主锚点** |
| 弹幕流列表 | `#chat-items` | 弹幕过滤在此监听 |

### 播放器实例 API

- `window.__PlayerInitialized` — 播放器就绪全局标志（B 站自己埋的）
- 播放器实例候选：`window.Player` / `window.__INTERACTIVE_PLAYER__` 等，按「有 `getPlayerInfo` 方法」识别
- `getPlayerInfo()` → 返回 `qualityCandidates` 画质列表
- `switchQualitySeamless(qn)` — 无缝切画质（不刷流）
- `setFullscreenStatus(1)` — 进入网页全屏
- URL 参数 `web_fullscreen=1` — B 站 app 原生支持，播放器初始化时自动进网页全屏（**自动网页全屏的主路径**）
- `body.player-full-win` class = 网页全屏态

## B 图标定位（v0.3.3 当前方案）

历史踩坑：
- v0.2.0 注入控制条按钮流 → 与原生按钮**重叠**
- v0.3.0 改挂 `#web-player-controller-wrap-el` 但仍在按钮流内 → 仍可能挤位
- v0.3.1 测礼物按钮坐标 → 礼物按钮 tooltip 不稳定
- v0.3.2 锚 `#gift-control-vm` 右上角 → **用户开了礼物栏净化，锚点元素不存在，图标消失**
- v0.3.3 改锚 **`#chat-control-panel-vm` 右上角上方 32px**（用户指定位置：右侧弹幕流功能键区上方）

当前方案：
- `position: fixed`，按 `#chat-control-panel-vm` 的 `getBoundingClientRect()` 计算
- 回落 1：发送面板被净化隐藏 → 挪到 `#aside-area-vm` 右下角
- 回落 2：再找不到 → 右下角悬浮球（10s 后启用）
- 监听 `resize` / `fullscreenchange` 重算坐标
- 控制台带 `[BiliEx]` 调试日志

## 安装机制（用户问过的点）

**外部进程无法直接写入 Tampermonkey 扩展存储**（浏览器扩展沙箱隔离）。安装流程借助 Tampermonkey 自身的 URL 拦截特性：

1. **Tampermonkey 拦截规则**：浏览器访问 URL 以 `.user.js` 结尾时，自动识别为用户脚本并弹安装确认页（而非显示文本/下载）
2. **本地 HTTP 服务**：`cd dist && python3 -m http.server 8787 --bind 127.0.0.1`，把产物暴露成 `http://127.0.0.1:8787/biliex.user.js`
3. **命令行打开浏览器**：macOS `open -a Quark "http://127.0.0.1:8787/biliex.user.js"` 让夸克打开该 URL
4. **Tampermonkey 接管**：夸克加载 URL → Tampermonkey 拦截 → 弹安装/更新页 → **用户点「安装」确认**
5. 升级流程：改代码 → `node build.js` → 刷新安装页 URL → Tampermonkey 提示「更新到新版本」→ 点确认

跨浏览器通用（Chrome/Edge/Firefox/夸克 都一样），因为这套机制是油猴本身的约定。

### 用户环境

- 浏览器：**夸克（Quark.app）**，路径 `/Applications/Quark.app`
- 安装页 URL：`http://127.0.0.1:8787/biliex.user.js`（仅本机访问）
- 服务启停：后台任务，用户确认装好后需手动停掉

## 开发约定

- 改代码后必须执行：`node build.js && node --check dist/biliex.user.js`
- 升版本号：`src/meta.js` 里 `// @version` 字段同步递增
- 净化新规则：在 `src/packages/purify/features.js` 加条目，自动接入面板开关
- 增强新功能：在 `src/packages/enhance/features.js` 加开关 + `index.js` 加实现
- B 站改版导致选择器失效时，**优先去线上播放器 JS 包反查新结构**（`https://s1.hdslb.com/bfs/static/bilibili-live-player/room-player.*.prod.min.js`），不要凭旧资料猜

## 已知限制

- 未登录/非大会员时最高画质受 B 站限制，脚本只在可用画质列表里选最高，不会报错
- B 站改版可能让个别选择器失效，改 `features.js` 重 build 即可修
- 自动化浏览器取证（agent-browser + Chromium）在国内网络下下载常超时失败，改走 JS 包反查路线
