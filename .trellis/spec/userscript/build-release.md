# 构建与发布

> 对应文件：`build.js`、`src/meta.js`、`package.json`、`.gitignore`

---

## 构建链

```js
// build.js
const banner = fs.readFileSync('src/meta.js', 'utf8');   // 油猴头直接从源码读
await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/biliex.user.js',
  format: 'iife',
  charset: 'utf8',
  target: 'es2020',
  banner: { js: banner },
});
```

四个参数的用意：

| 参数 | 原因 |
|---|---|
| `format: 'iife'` | 油猴脚本在页面上下文执行，不能是 ESM（会有顶层 `import` 语法错误） |
| `target: 'es2020'` | 覆盖用户端主流浏览器；再高会限制老版本内核 |
| `charset: 'utf8'` | 源码含中文注释与字符串，不设会被转义成 `\uXXXX`，产物可读性全无 |
| `banner` | `==UserScript==` 头必须出现在产物最前面，由 `src/meta.js` 单点维护 |

---

## 环境依赖

- Node：托管版本 v22.22.2（`/Users/superman/.workbuddy/binaries/node/versions/22.22.2-6/bin/node`）。
- esbuild 装在 `/Users/superman/.workbuddy/binaries/node/workspace/node_modules`，项目里的 `node_modules` 是指向它的**软链接**。
- 不要试图用 `NODE_PATH` 找依赖：`build.js` 是 ESM，Node 不认这个环境变量。软链是唯一可行做法。

---

## 版本号

- **唯一来源是 `src/meta.js` 的 `// @version`**，改完必须手动递增。
- `package.json` 的 `version: "0.1.0"` 是 init 遗留值，不参与构建、不参与发布，**不要拿它当版本源**。
- 用户端更新提示比较的是 `@version` 字符串，格式保持 `0.x.y` 递增即可。

---

## dist 产物入库

`.gitignore` 里 `dist/` 被忽略，但 `dist/biliex.user.js` 通过 `git add -f` 单独纳入版本控制（`.gitignore` 内有注释说明）。这意味着：

1. **改完 `src/` 必须重新 build 再提交**，否则仓库里的产物和源码不一致，ScriptCat 会同步到旧版本。
2. 新克隆的仓库没有 `dist/` 目录时，`git add dist/biliex.user.js` 需要 `-f`；已跟踪后普通 `git add -A` 即可。
3. 不要把 `dist/` 整个加回版本控制（中间文件、map 都会进来）。

---

## 标准发版流程

1. 改 `src/meta.js` 的 `@version`。
2. `node build.js && node --check dist/biliex.user.js`
3. `git add -A && git commit && git push`
4. ScriptCat 源码同步是**自动模式**（定期检查 + Webhook）；急着生效就去「脚本管理 → 源代码同步 → 保存并同步一次」手动触发。
5. 可选校验：`curl -s <ScriptCat 安装直链> | diff - dist/biliex.user.js && echo OK`

---

## 分发渠道

| 渠道 | 地址 | 状态 |
|---|---|---|
| GitHub | `github.com/snorlaxy213/bilibiliEx` | ✅ 主仓库，`dist` 已跟踪 |
| ScriptCat | `scriptcat.org/zh-CN/script-show-page/8294`（脚本 ID 8294） | ✅ 已上架，源码自动同步 |
| jsDelivr | `cdn.jsdelivr.net/gh/snorlaxy213/bilibiliEx@main/dist/biliex.user.js` | ✅ 国内可用直链；`@main` 有最长 12h CDN 缓存，急发用版本 tag |
| Greasy Fork | — | ⏳ 未上架：本机网络不可达 greasyfork.org |
| GitHub raw | `raw.githubusercontent.com/.../dist/biliex.user.js` | ⚠️ 本机直连被墙，**别用它安装** |

---

## 站点维护红线

- **禁止在 ScriptCat 站点上直接改代码**：源码同步开启后会被下次同步覆盖。要改就改 `src/` → build → push。
- 只改「详细说明 / 更新日志」时走 `/8294/update` 页的「发布更新」，版本号不用动。
- 源码同步里的「说明同步地址」必须**保持为空**，否则会用 README 覆盖站内说明。
- 站点 Markdown 是 CommonMark：段落内单个换行会被合并，问答/图注要空行分段。
