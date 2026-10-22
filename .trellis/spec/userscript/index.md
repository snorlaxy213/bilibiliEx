# Userscript 开发规范

> 本目录是 BiliEx 的唯一规范来源。AI 在改 `src/` 之前必须读本层 `index.md` + 相关文件。
> 所有规则都能追溯到仓库里的真实文件；没有例外的"理想规范"不要写进来。

---

## 本层适用范围

| 项 | 值 |
|---|---|
| 形态 | Tampermonkey 用户脚本（`.user.js`），无框架、无 TypeScript |
| 语言 | ES Module 源码，esbuild 打成 IIFE 单文件 |
| 入口 | `src/main.js` → `build.js` → `dist/biliex.user.js` |
| 运行环境 | `https://live.bilibili.com/*`，`@run-at document-start`，`@noframes` |
| 规模 | 5 个源文件目录，约 800 行（不含 CSS 常量） |

---

## 文件索引

| 文件 | 内容 | 什么时候读 |
|---|---|---|
| [architecture.md](./architecture.md) | 模块边界、初始化顺序、三种开关实现模式、新增功能的落点 | 改任何功能前 |
| [coding-conventions.md](./coding-conventions.md) | DOM/设置/事件总线用法、命名前缀、禁写模式 | 写代码时 |
| [build-release.md](./build-release.md) | esbuild 构建链、版本号、dist 入库、三条分发渠道 | 改动完成要发版时 |
| [verification.md](./verification.md) | 必跑命令、本机装测流程、手动回归矩阵 | 提交前 |
| [bilibili-dom.md](./bilibili-dom.md) | B 站直播间稳定选择器、播放器 API、锚点回落、改版排查 | 选择器失效或新增净化项时 |

---

## 阅读路径

- **新增一条净化规则** → `bilibili-dom.md`（确认选择器）+ `architecture.md`（落点）+ `coding-conventions.md`（写法）
- **新增一个 JS 行为功能** → `architecture.md` + `coding-conventions.md`
- **B 站改版、元素找不到** → `bilibili-dom.md` 的排查流程
- **发版** → `build-release.md` + `verification.md`

---

## 质量底线（任一不满足不要提交）

1. `node build.js && node --check dist/biliex.user.js` 通过，且 `dist/` 已重新生成。
2. 新增选择器有实测来源（线上 JS 包反查或 DOM 实测），不是从旧教程抄的。
3. 新增功能开关有明确 `defaultOn`，并已加入对应 `features.js` 表。
4. 没有引入运行时依赖（`package.json` 的 devDependencies 只有 `esbuild`）。
5. 改动涉及设置项时，`settingsBus.emit(key)` 的 key 语义正确，面板不需要刷新就能生效。
