# 验证与回归

> 本项目的验证分两层：可脚本化的构建校验，和必须在真浏览器里做的手动回归。后者不可省——选择器和播放器 API 的行为只有真环境能验。

---

## 必跑（每次改完 `src/`）

```bash
node build.js
node --check dist/biliex.user.js
```

- `node --check` 只做语法检查，能挡住「打包成功但产物有语法错」这类问题。
- 两条都过才允许提交；`dist/biliex.user.js` 要一并提交（见 `build-release.md`）。

---

## 本机装机测试

```bash
cd dist
python3 -m http.server 8787 --bind 127.0.0.1
open -a Quark "http://127.0.0.1:8787/biliex.user.js"
```

原理：Tampermonkey 拦截以 `.user.js` 结尾的 URL 并弹安装页，所以只要能通过 HTTP 拿到产物即可。夸克、Chrome、Edge、Firefox 通用。测完记得停掉后台服务。

升级路径：改代码 → `node build.js` → 重开同一 URL → Tampermonkey 提示「更新到新版本」→ 确认。

---

## 手动回归矩阵

按改动范围挑行，全量发版建议全跑。

| # | 场景 | 期望 | 关联模块 |
|---|---|---|---|
| 1 | 冷启动进任意直播间 | 首屏就是净化后状态，无「先显示再消失」的闪烁 | purify |
| 2 | 打开设置面板 | 五个页签（快速使用/页面净化/播放器/聊天区/弹幕过滤）都渲染，无空白页 | panel |
| 3 | 面板里切任意 toggle | 页面即时响应，不需要刷新 | settings + 各模块 |
| 4 | 开启极简模式 | 被覆盖的 6 项显示为锁定态（置灰 + 「极简模式」徽标），点击 = 关闭极简模式 | panel `ZEN_COVERS` |
| 5 | 自动网页全屏：开 → 刷新 → 关 → 再刷新 | 开启时进房即全屏；关闭后刷新不会因 URL 残留参数再次全屏 | enhance |
| 6 | 自动最高画质（登录态） | 进房后切到可用最高档；未登录/非大会员不报错，停在可用档位 | enhance |
| 7 | 弹幕过滤：加关键词 → 删关键词 | 已有弹幕立即隐藏/恢复，输入框不被重绘清空 | danmaku-filter + panel |
| 8 | SPA 换房（点推荐房间，不刷新页面） | 净化属性、弹幕过滤、B 图标位置全部跟随，无需手动刷新 | 全部 |
| 9 | B 图标锚点回落 | 正常锚 `#chat-control-panel-vm` 上方 32px；发送面板被净化时挪到 `#aside-area-vm` 右下；都找不到时 10s 后出悬浮球 | panel |
| 10 | 真全屏（F11/播放器全屏） | 面板与遮罩仍可见（挂进 `fullscreenElement`） | panel |

---

## 调试入口

| 入口 | 用途 |
|---|---|
| `window.__BiliExDebugQuality()` | 立即重跑一次自动最高画质并打印每步诊断 |
| 控制台 `[BiliEx]` 前缀日志 | 画质/全屏流程的中间状态 |
| `document.documentElement` 属性 | 直接看 `bx-<key>` 是否按预期挂上（排查"开关没反应"最快的一步） |

---

## 不能自动化的部分

- **真实播放器行为**：`getPlayerInfo()` 返回结构、`switchQualitySeamless` 是否生效，只有真环境能给答案。
- **CSS 选择器的实际命中**：B 站改版后是否还命中，必须在页面上看。
- **浏览器自动化不可靠**：本机用 agent-browser + Chromium 取证常因网络下载超时失败，改走「反查线上 JS 包 + 人工在夸克确认」的路线（见 `bilibili-dom.md`）。

---

## 提交前清单

- [ ] `node build.js && node --check dist/biliex.user.js` 通过
- [ ] 受影响的手动回归项已跑
- [ ] `src/meta.js` 的 `@version` 已递增（发版时）
- [ ] `dist/biliex.user.js` 已随源码一起提交
- [ ] 新选择器已在 `bilibili-dom.md` 记录来源
