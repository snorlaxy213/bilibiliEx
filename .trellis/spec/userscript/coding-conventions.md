# 编码约定

> 依据：`src/common/*.js`、`src/packages/*/index.js` 的既有写法。新代码与既有风格不一致时，以本文件为准。

---

## 模块与导入

- 全部 ES Module，相对路径**必须带 `.js` 后缀**（esbuild 直接读源码，不做扩展名补全）。
- 只从 `common/` 引工具，不从别的 package 引内部实现；唯一例外是 `panel` 引 `purify/index.js` 的 `FEATURES` 和 `enhance/features.js` 的 `ENHANCE_FEATURES` 两张表。

```js
// Good
import { injectCss, setAttr } from '../../common/dom.js';
import { settings, settingsBus } from '../../common/settings.js';

// Bad —— 少写 .js，构建期才报错
import { settings } from '../../common/settings';
```

---

## DOM 与样式

统一走 `common/dom.js`：

```js
export function injectCss(css) {
  const style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  return style;
}
```

- `@run-at document-start` 时 `document.head` 可能还不存在，函数已兜底挂 `documentElement`，不要自己写 `document.head.appendChild`。
- `@grant GM_addStyle` 保留了声明，但**代码里不用它**，避免两套注入路径。
- 建 DOM 一律 `createElement` + `textContent`；不要 `innerHTML` 拼变量（会带入用户输入）。

```js
// Good
const title = document.createElement('span');
title.textContent = 'BiliEx 设置';

// Bad
panel.innerHTML = `<span>${label}</span>`;
```

---

## 设置读写

只有 `common/settings.js` 能碰 `GM_getValue` / `GM_setValue`，存储键固定 `bx_settings_v1`。

```js
settings.get(key, fallback)      // 未存过时用 fallback（调用处通常传 feature.defaultOn）
settings.set(key, val)           // 写盘 + emit(key)
settings.getFilter()             // { enabled, keywords }
settings.setFilter(patch)        // 合并写入 + emit('filter')
```

规则：

1. **新增开关必须给默认值**。`settings.get(key, fallback)` 的 fallback 必须显式传，不要依赖 `false`。
2. **不要直接调 `GM_setValue`**，否则内存缓存和存储会分叉，面板显示与运行时行为对不上。
3. **改默认值不影响老用户**：`load()` 只在键不存在时用 `DEFAULTS`，已存过 `bx_settings_v1` 的用户不会被覆盖。要迁移就写显式迁移逻辑，不要指望改 `defaultOn`。

---

## 事件总线

```js
settingsBus.emit(key);   // key = featureKey 或 'filter'
settingsBus.on((key) => { /* 按 key 决定要不要重算 */ });
```

- 监听者**必须按 key 过滤**，否则每次任意开关变化都会触发全量重绘。面板里 `zenMode` 变化重绘 quick/purify/player 三页，其余 key 只重绘 quick 页，`'filter'` 直接跳过（页内自处理，避免输入框被清空）。
- 广播是同步的，不要在回调里做重活；需要延后就用 `setTimeout(fn, 0)`。

---

## 命名

| 对象 | 规则 | 实例 |
|---|---|---|
| feature key | camelCase，语义完整 | `hideHeadInfoTags`、`autoWebFullscreen` |
| CSS 属性开关 | `bx-` + key，原样大小写 | `html[bx-hideSidebar]` |
| DOM id / class | `bx-` 前缀 | `#bx-panel`、`.bx-toggle`、`.bx-locked` |
| 日志 | 统一前缀 `[BiliEx]` | `console.log('[BiliEx]', ...)` |
| 调试入口 | `window.__BiliEx<用途>` | `window.__BiliExDebugQuality()` |

---

## 注释

- 中文，写**为什么**，不写"是什么"。
- 反直觉的兼容处理必须留注释，例如 `enhance/index.js` 的 `mutatingUrl`：

```js
// 重入保护：脚本自己改写 URL 时置位，让 watchRoomChange 劫持的
// history.replaceState 不触发 onChange，避免「摘/写参数」自激循环
let mutatingUrl = false;
```

- 历史结论（哪个选择器失效了、为什么换锚点）写进 `bilibili-dom.md`，不要散落在代码注释里。

---

## 异步与定时器

- 轮询一律用 `enhance/index.js` 的 `retry(fn, intervalMs, timeoutMs, tag)`，自带超时与异常短路。
- 等播放器就绪用 `onPlayerReady(cb)`（内置 60s 放弃），不要自己写 `while` 轮询。
- 长驻 `setInterval` 允许存在（如 `danmaku-filter` 每 2s `ensure()`、`enhance` 每 1s 检查房间号），但**必须幂等**：重复执行不能重复挂观察器或重复注入样式。
- 可关闭的功能，关闭路径要显式清理（参考 `runFrameGap()` 的 `stop()` 会清定时器并移除 `--bx-frame-w`）。

```js
// Good —— 幂等
if (el && el !== container) attach(el);

// Bad —— 每次调用都新建 observer，旧的不 disconnect
observer = new MutationObserver(fn);
```

---

## 外部 API 调用

播放器实例的字段是 B 站内部实现，随时可能变。调用必须：

1. 先判存在性（`typeof p.getPlayerInfo === 'function'`）；
2. 包 `try/catch`，失败只记日志不抛；
3. 提供下一级回落；
4. 关键步骤打诊断日志，便于线上定位。

```js
let info;
try {
  info = p.getPlayerInfo();
} catch (e) {
  log('自动最高画质: getPlayerInfo() 调用异常', e);
  return false;
}
```

---

## 依赖

- 运行时零依赖，`package.json` 的 `devDependencies` 只有 `esbuild`。
- 想加库先问一句：能不能用 20 行原生代码替代？油猴脚本的产物体积和审查成本都由用户承担。
