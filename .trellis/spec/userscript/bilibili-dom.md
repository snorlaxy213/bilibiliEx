# B 站直播间 DOM 与播放器 API

> 本文件是选择器的唯一事实来源。**B 站改版后先改这里，再改代码**。
> 所有结论来自线上播放器 JS 包反查 + 真机实测，不要用 douyuEx / 旧博客里的选择器。

---

## 当前有效选择器

| 用途 | 选择器 | 使用位置 | 备注 |
|---|---|---|---|
| 播放器控制条外壳 | `#web-player-controller-wrap-el` | `enhance/index.js` | Svelte 源码写死的稳定 id |
| 控制条按钮 | `span.icon` | `enhance/index.js` | 与 tooltip 文案配合定位 |
| 右侧聊天面板 | `#aside-area-vm` | `panel/index.js`（回落 1） | 稳定 |
| 弹幕发送框面板 | `#chat-control-panel-vm` | `panel/index.js`（主锚点） | B 图标挂它上方 32px |
| 弹幕流列表 | `#chat-items` | `danmaku-filter/index.js` | 过滤在此监听 |
| 弹幕流列表（回落） | `.chat-history-list` | `danmaku-filter/index.js` | id 变动时的备选 |
| 单条弹幕 | `.chat-item` | `danmaku-filter/index.js` | 命中即 `display:none` |
| 顶部导航 | `#main-ctnr` | `enhance/index.js`（等边距测量） | 取 `bottom` 作顶部基准 |
| 内容主体 | `.live-room-app .app-body` | `enhance/index.js` | 取 `top` 与 `width` |
| 播放器+侧栏容器 | `.player-and-aside-area` | `enhance/index.js` | 取 `bottom` 算底部间距 |
| 左列 | `.left-container` | `enhance/index.js` | 播放器 16:9 换算用 |
| 网页全屏态 | `body.player-full-win` | `enhance/index.js` | 判断是否已全屏 |
| 背景图层 | `.room-bg` | `enhance/index.js`（CSS 常量） | 固定铺满视口 |
| 净化目标（示例） | `#sections-vm`、`#sidebar-vm`、`#head-info-vm`、`#gift-control-vm`、`footer.link-footer` | `purify/features.js` | 逐条见该文件 |

---

## 已失效（不要再引用）

| 选择器 | 说明 |
|---|---|
| `#control-panel-ctnr-box` | 播放器控制条外壳的旧 id，当前已消失 |
| `.icon-left-part` | 控制条左侧按钮簇，当前已消失 |
| 任何来自 douyuEx 的斗鱼结构 | 平台不同，且 B 站已多次改版 |

---

## 播放器实例 API

| 接口 | 说明 |
|---|---|
| `window.__PlayerInitialized` | B 站自己的就绪标志，`true` 表示播放器可用 |
| `window.Player` / `window.__INTERACTIVE_PLAYER__` / `window.EmbedPlayer` | 实例候选，按「有 `getPlayerInfo` 方法」识别，不要按变量名硬取 |
| `getPlayerInfo()` | 返回含 `qualityCandidates`（或 `qualityList`）与当前 `quality` 的对象 |
| `switchQualitySeamless(qn)` / `switchQuality(qn)` | 无缝切档，优先前者 |
| `setFullscreenStatus(1)` | 进入网页全屏 |
| URL 参数 `web_fullscreen=1` | B 站原生支持，播放器初始化时自动进网页全屏——**这是自动全屏的主路径** |
| `body.player-full-win` | 网页全屏态的 class 标记 |

识别写法（`enhance/index.js`）：

```js
const cands = [window.Player, window.__INTERACTIVE_PLAYER__, window.EmbedPlayer];
for (const c of cands) if (c && typeof c.getPlayerInfo === 'function') return c;
```

---

## B 图标锚点回落链

`panel/index.js` 按优先级逐级降级，**不要打乱顺序**：

1. `#chat-control-panel-vm` 右上角上方 32px —— 用户指定位置（右侧弹幕流功能键区上方）。
2. 该面板被净化隐藏 → 挪到 `#aside-area-vm` 右下角。
3. 两者都找不到 → 右下角悬浮球（10s 后启用）。
4. `resize` / `fullscreenchange` 时重算坐标。

历史教训：v0.3.2 曾锚 `#gift-control-vm`（礼物栏），用户开启礼物栏净化后锚点消失、图标跟着消失。**永远不要用"可能被自己隐藏"的元素当锚点。**

---

## B 站改版后的排查流程

1. **先排除时序问题**：SPA 换房后 DOM 有一段空窗，等 2s（`danmaku-filter` 的 `ensure()` 周期）再看。别把时序当改版。
2. **控制台验证**：`document.querySelector('<选择器>')` 是否为 `null`；是 `null` 才判定失效。
3. **反查线上包**（首选手段）：
   ```
   https://s1.hdslb.com/bfs/static/bilibili-live-player/room-player.*.prod.min.js
   ```
   在包里搜 id / class 字符串，找到新的稳定锚点。**不要靠猜、不要靠旧资料**。
4. **同步两处**：本文件的表格 + `AGENTS.md` 的实测结论段。
5. **改代码 → build → 真机确认**，再提交。

---

## 明确禁止

| 反模式 | 后果 |
|---|---|
| 用 `#gift-control-vm` 这类"可能被净化隐藏"的元素当锚点 | 用户开启对应净化后功能直接消失 |
| 用 `nth-child` / 长链后代选择器 | B 站 DOM 顺序经常调整，一改全废 |
| 依赖 tooltip 中文文案当**主**定位手段 | 文案是 Svelte 写死的，能用作兜底，但改文案就失效 |
| 从 douyuEx、旧博客复制选择器 | 平台不同 + 版本过期，命中率接近 0 |
| 改版后不动本文件只改代码 | 下次改版又要从头摸一遍，规范失效 |
