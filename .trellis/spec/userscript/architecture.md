# 模块架构与扩展落点

> 对应文件：`src/main.js`、`src/common/*.js`、`src/packages/*/index.js`

---

## 模块图

```
src/main.js                    仅做注册，不含业务逻辑
├── packages/purify/index.js   注入全部净化 CSS + 按开关维护 <html> 属性
│   └── features.js            FEATURES 表：key/group/label/desc/defaultOn/css
├── packages/danmaku-filter/   MutationObserver 监听弹幕流，命中关键词即隐藏
├── packages/enhance/index.js  JS 行为：URL 全屏参数、画质切档、上下等边距
│   └── features.js            ENHANCE_FEATURES 表：仅开关元信息，无 css
└── packages/panel/index.js    设置面板：遮罩 + 左侧导航 + 内容区 + B 图标
    └── panel.css.js           面板/悬浮球/图标的全部 CSS 常量

src/common/dom.js              injectCss(css) / setAttr(name, on)
src/common/settings.js         GM 存取 + 内存缓存 + settingsBus
```

依赖方向只有一条：`main → packages → common`。`common` 不得反向 import `packages`。

---

## 初始化顺序（`src/main.js`）

```js
initPurify();          // 先注入 CSS，避免首屏闪烁
initDanmakuFilter();   // 尽早挂观察器，避免漏掉弹幕
initEnhance();         // document-start 阶段就要改写 URL 参数
initPanel();           // 最后，依赖 FEATURES / ENHANCE_FEATURES 两张表
```

顺序不是随意的：

- `purify` 必须最先，样式在首屏就位才没有「先看到再消失」的闪烁。
- `enhance` 的 `ensureUrlParam()` 必须在播放器初始化前跑完，否则 `web_fullscreen=1` 来不及生效。
- `panel` 最后，因为它 `import { FEATURES } from '../purify/index.js'`，需要表已就绪。

---

## 三种开关模式

改功能前先判断属于哪一种，不要混用。

### 1. CSS 属性前缀（净化的唯一做法）

```js
// features.js
{ group: '页面净化', key: 'hideSidebar', label: '右侧推荐', defaultOn: true,
  css: `html[bx-hideSidebar] #sidebar-vm { display: none !important; }` }

// purify/index.js —— 一次性注入全部规则，开关只是改 html 属性
injectCss(FEATURES.map((f) => f.css).join('\n'));
setAttr('bx-' + f.key, settings.get(f.key, f.defaultOn));
```

好处：零重排、SPA 换房不失效、开关不需要重新跑 JS。

**规则**：`css` 里每一条选择器都必须以 `html[bx-<key>]` 开头，否则关不掉。属性名与 `key` 严格一致（`bx-` + 原样 key，不改大小写）。

### 2. JS 行为（增强类）

`ENHANCE_FEATURES` 只管开关元信息，实现写在 `enhance/index.js`，并在 `settingsBus.on` 里响应变化：

```js
settingsBus.on(() => {
  if (settings.get('autoWebFullscreen', false)) runAutoWebFullscreen('toggle');
});
```

**规则**：行为型功能必须做到「关掉即停止副作用」，不能只在开启时生效。反例：`ensureUrlParam()` 在关闭时会主动摘掉 URL 里残留的 `web_fullscreen=1`，否则刷新后 B 站仍会自动全屏。

### 3. 独立设置页（弹幕过滤）

弹幕过滤有自己的数据形状（`enabled` + 多行 `keywords`），走 `settings.getFilter()` / `setFilter()`，在面板里单独一页，`settingsBus.emit('filter')` 与普通 feature key 区分。

---

## 新增一条净化规则

1. 在 `src/packages/purify/features.js` 的 `FEATURES` 末尾追加对象，字段齐全（`group/key/label/desc/defaultOn/css`）。
2. `group` 必须命中 `panel/index.js` 里 `TABS[].groups` 的某个值，否则不会出现在面板里。
3. 面板不用改：`panel/index.js` 按 `group` 自动把条目渲染进对应页签。
4. 如果这条规则被极简模式（`zenMode`）的 CSS 覆盖，必须同步加入 `panel/index.js` 的 `ZEN_COVERS`，否则用户在极简模式下手动关它会「点了没反应」。

```js
// panel/index.js
const ZEN_COVERS = ['hideHeadInfoTags', 'hideSidebar', 'hideSections', 'hideFlipView', 'hideFooter', 'hideGiftBar'];
```

---

## 新增一个增强功能

1. `enhance/features.js` 加开关（`group: '快速使用'` 或新建分组）。
2. `enhance/index.js` 写实现函数，用现有 `retry(fn, interval, timeout, tag)` / `onPlayerReady(cb)` / `watchRoomChange(onChange)` 三个工具，不要另写轮询。
3. 在 `initEnhance()` 的 `settingsBus.on` 回调里接上「开即执行」。
4. 新建分组时同步改 `panel/index.js` 的 `TABS`（含 `NAV_ICONS` 图标）。

---

## 明确禁止

| 反模式 | 原因 |
|---|---|
| 在 `main.js` 写业务逻辑 | 入口只做注册，逻辑散在入口会让初始化顺序不可控 |
| 净化规则改用 JS 增删元素 | 破坏「属性即开关」模型，SPA 换房后会丢状态 |
| `enhance` 里用无超时的 `setInterval` 轮询元素 | 已有 `retry` + `onPlayerReady` 封装，60s 自动放弃 |
| 面板直接读 `GM_getValue` | 绕过 `settings` 缓存，面板与运行时状态会不一致 |
| 用 `#gift-control-vm` 之类的可选元素当锚点 | 用户开启对应净化后锚点消失，图标会跟着消失（v0.3.2 踩过） |
