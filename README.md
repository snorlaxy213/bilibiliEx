# BiliEx — B 站直播间净化增强

仿 [DouyuEx](https://github.com/qianjiachun/douyuEx) 思路的 B 站直播间油猴脚本：净化页面噪音，只留 **播放器 + 右侧弹幕流**，并叠加自动网页全屏、自动最高画质、上下等边距等增强功能。

> 净化选择器参考了 [bilibili-cleaner](https://github.com/festoney8/bilibili-cleaner)（MIT），均为 B 站直播间当前有效选择器。

## 功能

### 页面净化
- **极简模式**：一键只留播放器 + 弹幕流（对应斗鱼净化后的形态）
- **主播信息栏**：热门榜 / 活动标签 / 更多设置，或整个信息栏隐藏
- **播放器下方内容区**（介绍 / 动态 / 推荐 / 公告）、活动海报、右侧悬浮按钮、页脚
- **直播间背景图**：可改为纯色

### 播放器净化
礼物栏、滚动礼物通告、直播 PK 特效、天选时刻、购物小橙车、互动贴纸、反馈按钮、水印、卡顿打分弹窗、幻星互动游戏、全屏弹幕发送框。

### 聊天区净化
排行榜 / 大航海、欢迎消息、系统公告、礼物弹幕、大表情弹幕、粉丝牌标识、弹幕高亮底色、底部滚动提示、互动卡片、弹幕发送框。

### 增强
- **自动网页全屏**：进房即全屏（走 B 站原生 `web_fullscreen=1` 参数）
- **自动最高画质**：可选开启，受登录 / 大会员限制
- **上下等边距**：自动贴合视口——以「导航栏底 ↔ 内容顶」的间距为基准，闭环校正内容宽度，使「内容底 ↔ 屏幕底」视觉间距与顶部一致

### 弹幕过滤
标签式关键词过滤：输入框 + 回车/按钮添加，点标签上的 × 删除，去重提示，修改实时生效。

### 设置面板
B 图标钉在弹幕发送面板右上角上方；网页全屏锚定全屏弹幕发送框，其余情况固定窗口右下角；面板从图标上方弹出；全屏下可用；状态持久化（GM_setValue）。

## 安装

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/)
2. 构建产物（`dist/biliex.user.js`）
3. Tampermonkey → 新建脚本 → 粘贴 `dist/biliex.user.js` 全部内容 → 保存
4. 打开任意直播间（`live.bilibili.com/房间号`），弹幕发送面板右上角出现粉色 **B** 图标即安装成功

> 进阶：本地起一个 HTTP 服务暴露产物，再用浏览器打开该 `.user.js` URL，Tampermonkey 会接管并弹出安装/更新页，便于后续一键升级。

## 本地运行

```bash
npm install          # 安装 esbuild（软链接至托管 node_modules）
npm run build        # 产出 dist/biliex.user.js
node --check dist/biliex.user.js   # 语法校验
```

构建产物为 esbuild IIFE 单文件，油猴头单独维护在 `src/meta.js`，打包时拼接进产物头部。

## 目录结构

```
bilibiliEx/
├── build.js                    # esbuild 打包：src → dist/biliex.user.js（自动附加油猴头）
├── src/
│   ├── meta.js                 # 油猴脚本头（@match/@grant/version 在此维护）
│   ├── main.js                 # 入口：注册各模块
│   ├── common/
│   │   ├── dom.js              # 样式注入、html 属性开关
│   │   └── settings.js         # 设置持久化 + 变更广播
│   └── packages/
│       ├── purify/             # 净化核心
│       │   ├── features.js     # 净化规则表（key/group/selector/desc）
│       │   └── index.js        # 按 html[bx-<key>] 属性前缀注入 CSS
│       ├── panel/              # B 图标设置面板
│       │   ├── index.js        # 面板 UI、B 图标定位、设置开关渲染
│       │   └── panel.css.js    # 面板 + 悬浮球 + 控制条图标 CSS
│       ├── danmaku-filter/     # 弹幕关键词过滤
│       │   └── index.js
│       └── enhance/            # 增强模块
│           ├── features.js     # 增强开关表
│           └── index.js        # 自动网页全屏 + 自动最高画质 + 上下等边距
└── dist/biliex.user.js         # 构建产物
```

实现机制：所有净化 CSS 以 `html[bx-<功能key>]` 前缀注入，开关 = 给 `<html>` 增删对应属性，因此换房（SPA 路由切换）无需重新处理；弹幕过滤监听弹幕流列表，换房后自动重挂。

修改代码后：

```bash
npm run build
```

然后把 `dist/biliex.user.js` 重新粘贴到 Tampermonkey 即可（或用 Tampermonkey 的「文件→导入」）。

## 已知边界

- B 站直播间 DOM 改版可能导致个别选择器失效，届时更新 `features.js` 中对应规则即可（优先去线上播放器 JS 包反查新结构）
- 未登录 / 非大会员时自动最高画质受 B 站限制，脚本只在可用画质列表里选最高，不会报错
- 弹幕过滤对已显示的历史弹幕不追溯，改动过滤词后刷新页面可全量应用
- 脚本仅做显示层净化，不涉及任何 B 站接口调用与账号操作
