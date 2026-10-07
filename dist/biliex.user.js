// ==UserScript==
// @name         BiliEx - B站直播间净化增强
// @namespace    https://github.com/juleschen/bilibiliEx
// @version      0.3.18
// @description  仿 DouyuEx 思路：净化 B 站直播间页面，只留播放器与右侧弹幕流；悬浮球设置面板；弹幕关键词过滤（标签式编辑）
// @author       Jules.chen
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @noframes
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

/*
 * BiliEx - B站直播间净化增强
 * 项目结构参考 qianjiachun/douyuEx（MIT），净化选择器参考 festoney8/bilibili-cleaner（MIT）
 */

(() => {
  // src/common/dom.js
  function injectCss(css) {
    const style = document.createElement("style");
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    return style;
  }
  function setAttr(name, on) {
    const root = document.documentElement;
    if (on) root.setAttribute(name, "");
    else root.removeAttribute(name);
  }

  // src/common/settings.js
  var STORE_KEY = "bx_settings_v1";
  var DEFAULTS = {
    features: {},
    // featureKey -> bool（未设置时用 feature 定义的 defaultOn）
    filter: {
      enabled: true,
      keywords: ""
      // 每行一个，支持 逗号/中文逗号 分隔；/xxx/ 形式按正则处理
    }
  };
  var listeners = [];
  function load() {
    try {
      const raw = GM_getValue(STORE_KEY, "{}");
      const saved = JSON.parse(raw || "{}");
      return {
        features: { ...saved.features },
        filter: { ...DEFAULTS.filter, ...saved.filter || {} }
      };
    } catch {
      return { features: {}, filter: { ...DEFAULTS.filter } };
    }
  }
  var cache = load();
  function save() {
    GM_setValue(STORE_KEY, JSON.stringify(cache));
  }
  var settingsBus = {
    on(cb) {
      listeners.push(cb);
    },
    emit() {
      listeners.forEach((cb) => cb());
    }
  };
  var settings = {
    get(key, fallback = false) {
      return cache.features[key] ?? fallback;
    },
    set(key, val) {
      cache.features[key] = val;
      save();
      settingsBus.emit();
    },
    getFilter() {
      return { ...cache.filter };
    },
    setFilter(patch) {
      cache.filter = { ...cache.filter, ...patch };
      save();
      settingsBus.emit();
    }
  };

  // src/packages/purify/features.js
  var FEATURES = [
    // ================= 页面净化 =================
    {
      group: "页面净化",
      key: "zenMode",
      label: "极简模式",
      defaultOn: false,
      css: `
html[bx-zenMode] #sections-vm,
html[bx-zenMode] #sidebar-vm,
html[bx-zenMode] .flip-view,
html[bx-zenMode] #gift-control-vm,
html[bx-zenMode] #link-footer-vm,
html[bx-zenMode] footer.link-footer,
html[bx-zenMode] #head-info-vm #LiveRoomHotrankEntries,
html[bx-zenMode] #head-info-vm .activity-entry,
html[bx-zenMode] #head-info-vm .right-dynamic-modules { display: none !important; }
html[bx-zenMode] body:not(.pure_room_root, .player-full-win) #player-ctnr {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
}
`
    },
    {
      group: "页面净化",
      key: "hideHeadInfoTags",
      label: "主播信息栏：热门榜/活动标签/更多设置",
      defaultOn: true,
      css: `
html[bx-hideHeadInfoTags] #head-info-vm #LiveRoomHotrankEntries,
html[bx-hideHeadInfoTags] #head-info-vm .activity-entry,
html[bx-hideHeadInfoTags] #head-info-vm .right-dynamic-modules { display: none !important; }
`
    },
    {
      group: "页面净化",
      key: "hideHeadInfo",
      label: "主播信息栏（整个隐藏，含头像/关注）",
      defaultOn: false,
      css: `
html[bx-hideHeadInfo] #head-info-vm { display: none !important; }
html[bx-hideHeadInfo] #player-ctnr {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
}
`
    },
    {
      group: "页面净化",
      key: "hideSidebar",
      label: "右侧悬浮按钮（实验室/关注等）",
      defaultOn: true,
      css: `
html[bx-hideSidebar] #sidebar-vm { display: none !important; }
`
    },
    {
      group: "页面净化",
      key: "hideSections",
      label: "播放器下方全部内容（介绍/动态/推荐/公告）",
      defaultOn: true,
      css: `
html[bx-hideSections] #sections-vm { display: none !important; }
html[bx-hideSections] .room-bg { min-height: 99vh !important; }
`
    },
    {
      group: "页面净化",
      key: "hideFlipView",
      label: "活动海报",
      defaultOn: true,
      css: `
html[bx-hideFlipView] .flip-view { display: none !important; }
`
    },
    {
      group: "页面净化",
      key: "hideFooter",
      label: "页面页脚（关于我们/备案信息）",
      defaultOn: true,
      css: `
html[bx-hideFooter] #link-footer-vm,
html[bx-hideFooter] footer.link-footer { display: none !important; }
`
    },
    {
      group: "页面净化",
      key: "removeWallpaper",
      label: "直播间背景图（改纯色）",
      defaultOn: false,
      css: `
html[bx-removeWallpaper] .room-bg { background-image: unset !important; }
html[bx-removeWallpaper] #player-ctnr {
  box-shadow: 0 0 12px rgb(0 0 0 / 0.2);
  border-radius: 12px;
}
html[bx-removeWallpaper] #aside-area-vm { box-shadow: 0 0 12px rgb(0 0 0 / 0.2); }
`
    },
    // ================= 播放器 =================
    {
      group: "播放器",
      key: "hideGiftBar",
      label: "礼物栏（宝箱/抽奖/贵物）",
      defaultOn: true,
      css: `
html[bx-hideGiftBar] #gift-control-vm { display: none !important; }
html[bx-hideGiftBar] body:not(.pure_room_root, .player-full-win) .fullscreen-container-paddingbox {
  height: 0 !important;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  overflow: hidden;
}
html[bx-hideGiftBar] body:not(.pure_room_root, .player-full-win) #fullscreen-container {
  grid-template-rows: minmax(0, 1fr) auto !important;
}
`
    },
    {
      group: "播放器",
      key: "hideAnnouncement",
      label: "滚动礼物通告",
      defaultOn: true,
      css: `
html[bx-hideAnnouncement] #live-player .announcement-wrapper { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hidePk",
      label: "直播 PK 特效",
      defaultOn: true,
      css: `
html[bx-hidePk] #pk-vm,
html[bx-hidePk] #awesome-pk-vm,
html[bx-hidePk] #universal-pk-vm { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideLottery",
      label: "天选时刻弹窗",
      defaultOn: true,
      css: `
html[bx-hideLottery] #anchor-guest-box-id { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideShop",
      label: "购物小橙车",
      defaultOn: true,
      css: `
html[bx-hideShop] #shop-popover-vm { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideSticker",
      label: "播放器内互动贴纸",
      defaultOn: true,
      css: `
html[bx-hideSticker] #interactive-sticker-vm { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideFeedback",
      label: "反馈按钮",
      defaultOn: true,
      css: `
html[bx-hideFeedback] .web-player-icon-feedback { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideWatermark",
      label: "直播水印 / 边缘模糊条纹",
      defaultOn: true,
      css: `
html[bx-hideWatermark] .web-player-icon-roomStatus,
html[bx-hideWatermark] .blur-edges-ctnr { display: none !important; }
html[bx-hideWatermark] .web-player-module-area-mask { backdrop-filter: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideResearch",
      label: "卡顿打分弹窗",
      defaultOn: true,
      css: `
html[bx-hideResearch] .research-container { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideGameId",
      label: "幻星互动游戏",
      defaultOn: true,
      css: `
html[bx-hideGameId] #game-id { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideFullscreenDanmaku",
      label: "全屏时的弹幕发送框",
      defaultOn: false,
      css: `
html[bx-hideFullscreenDanmaku] #fullscreen-danmaku-vm { display: none !important; }
`
    },
    // ================= 聊天区 =================
    {
      group: "聊天区",
      key: "hideRankList",
      label: "排行榜 / 大航海列表",
      defaultOn: false,
      css: `
html[bx-hideRankList] #rank-list-vm { display: none !important; }
html[bx-hideRankList] body:not(.hide-aside-area.player-full-win) #aside-area-vm {
  display: flex;
  flex-direction: column;
}
html[bx-hideRankList] .chat-history-panel { flex: 1; }
`
    },
    {
      group: "聊天区",
      key: "hideWelcome",
      label: '"XXX 来了" 欢迎消息',
      defaultOn: true,
      css: `
html[bx-hideWelcome] .welcome-section-bottom { display: none; }
`
    },
    {
      group: "聊天区",
      key: "hideSystemMsg",
      label: "系统提示公告",
      defaultOn: true,
      css: `
html[bx-hideSystemMsg] .convention-msg.border-box,
html[bx-hideSystemMsg] .new-video-pk-item-dm { display: none !important; }
`
    },
    {
      group: "聊天区",
      key: "hideGiftMsg",
      label: "礼物弹幕（谁送了礼物）",
      defaultOn: true,
      css: `
html[bx-hideGiftMsg] .chat-item.gift-item,
html[bx-hideGiftMsg] .chat-item.common-danmuku-msg { display: none !important; }
`
    },
    {
      group: "聊天区",
      key: "hideEmoticon",
      label: "大表情弹幕",
      defaultOn: false,
      css: `
html[bx-hideEmoticon] .chat-item.bulge-emoticon,
html[bx-hideEmoticon] .chat-item.chat-emoticon { display: none !important; }
html[bx-hideEmoticon] .bili-dm-emoji,
html[bx-hideEmoticon] .bili-danmaku-x-dm-emoji { display: none !important; }
`
    },
    {
      group: "聊天区",
      key: "hideMedal",
      label: "粉丝牌 / 等级 / 头衔 / 排名标识",
      defaultOn: false,
      css: `
html[bx-hideMedal] .chat-item .fans-medal-item-ctnr,
html[bx-hideMedal] .chat-item .wealth-medal-ctnr,
html[bx-hideMedal] .chat-item .group-medal-ctnr,
html[bx-hideMedal] .chat-item .title-label,
html[bx-hideMedal] .chat-item .rank-icon { display: none !important; }
`
    },
    {
      group: "聊天区",
      key: "hideHighlight",
      label: "弹幕高亮底色（舰长/提督/总督）",
      defaultOn: false,
      css: `
html[bx-hideHighlight] .chat-item {
  background-color: unset !important;
  border-image-source: unset !important;
}
`
    },
    {
      group: "聊天区",
      key: "hideBrushPrompt",
      label: "底部滚动提示条",
      defaultOn: true,
      css: `
html[bx-hideBrushPrompt] #brush-prompt { display: none !important; }
html[bx-hideBrushPrompt] .chat-history-panel .chat-history-list.with-brush-prompt { height: 100% !important; }
`
    },
    {
      group: "聊天区",
      key: "hideComboCard",
      label: "互动卡片弹窗",
      defaultOn: true,
      css: `
html[bx-hideComboCard] #relocated-cards-area { display: none !important; }
`
    },
    {
      group: "聊天区",
      key: "hideControlPanel",
      label: "弹幕发送框（整个底部面板，回车仍可发）",
      defaultOn: false,
      css: `
html[bx-hideControlPanel] #chat-control-panel-vm {
  display: none !important;
  min-height: unset !important;
}
html[bx-hideControlPanel] body:not(.hide-aside-area.player-full-win) #aside-area-vm {
  display: flex;
  flex-direction: column;
}
html[bx-hideControlPanel] .chat-history-panel {
  flex: 1;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
`
    }
  ];

  // src/packages/purify/index.js
  function initPurify() {
    injectCss(FEATURES.map((f) => f.css).join("\n"));
    const apply = () => {
      for (const f of FEATURES) {
        setAttr("bx-" + f.key, settings.get(f.key, f.defaultOn));
      }
    };
    apply();
    settingsBus.on(apply);
  }

  // src/packages/enhance/features.js
  var ENHANCE_FEATURES = [
    {
      group: "增强",
      key: "autoWebFullscreen",
      label: "自动网页全屏（进房即全屏）",
      defaultOn: true
    },
    {
      group: "增强",
      key: "autoHighestQuality",
      label: "自动最高画质（受登录/大会员限制）",
      defaultOn: false
    },
    {
      group: "增强",
      key: "frameGap",
      label: "上下等边距（自动贴合视口）",
      defaultOn: true
    }
  ];

  // src/packages/panel/panel.css.js
  var PANEL_CSS = `
/* B 图标：fixed 定位（坐标为 getBoundingClientRect 视口坐标，滚动不漂移），按实测坐标摆放 */
#bx-ctrl-item {
  position: fixed !important;
  z-index: 2147483647 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  pointer-events: auto !important;
}
#bx-ctrl-item svg { display: block; pointer-events: none; }
#bx-ctrl-item:hover svg circle:first-of-type { fill: #ff5c8a; }

/* 设置面板：跟随图标上方弹出（位置由 JS 设定） */
#bx-panel {
  position: fixed;
  z-index: 2147483647;
  width: 320px;
  max-height: 72vh;
  display: none;
  flex-direction: column;
  background: #fff;
  color: #18191c;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
  font: 13px/1.5 -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
}
#bx-panel.bx-open { display: flex; }

.bx-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid #f0f1f3;
  font-weight: 600;
  font-size: 14px;
}
.bx-panel-head .bx-close { cursor: pointer; color: #9499a0; font-size: 16px; }
.bx-panel-head .bx-close:hover { color: #fb7299; }

.bx-panel-body { overflow-y: auto; padding: 4px 14px 10px; }
.bx-group-title {
  margin: 10px 0 4px;
  font-size: 12px;
  color: #fb7299;
  font-weight: 600;
}
.bx-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
  border-radius: 4px;
}
.bx-item:hover { background: #f6f7f8; }
.bx-item input[type="checkbox"] { accent-color: #fb7299; margin: 0; cursor: pointer; }

.bx-filter-row {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
.bx-filter-input {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  height: 30px;
  padding: 0 8px;
  border: 1px solid #e3e5e7;
  border-radius: 6px;
  font: 12px/1.5 -apple-system, "PingFang SC", sans-serif;
  color: #18191c;
  background: #fff;
}
.bx-filter-input:focus { outline: none; border-color: #fb7299; }
.bx-filter-input.bx-dup { border-color: #e24b4a; }
.bx-filter-add {
  flex: none;
  height: 30px;
  padding: 0 14px;
  border: none;
  border-radius: 6px;
  background: #fb7299;
  color: #fff;
  font: 13px/1 -apple-system, "PingFang SC", sans-serif;
  cursor: pointer;
}
.bx-filter-add:hover { background: #ff5c8a; }
.bx-filter-add:active { background: #e05f82; }

.bx-filter-tags {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 6px;
  min-height: 60px;
  max-height: 120px;
  overflow-y: auto;
  margin-top: 8px;
  padding: 8px;
  border: 1px solid #e3e5e7;
  border-radius: 6px;
  background: #f6f7f8;
}
.bx-filter-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 22px;
  padding: 0 6px 0 8px;
  border-radius: 4px;
  background: #fbeaf0;
  border: 1px solid #f4c0d1;
  font: 12px/1 -apple-system, "PingFang SC", sans-serif;
  color: #d4537e;
}
.bx-filter-tag .bx-tag-close {
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: #ed93b1;
}
.bx-filter-tag .bx-tag-close:hover { color: #e24b4a; }
.bx-filter-empty { font: 12px/1.5 -apple-system, "PingFang SC", sans-serif; color: #9499a0; }
.bx-hint { font-size: 11px; color: #9499a0; margin-top: 6px; }
`;

  // src/packages/panel/index.js
  var ICON_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="#fb7299"/><text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff" font-family="-apple-system,'PingFang SC',sans-serif">B</text></svg>`;
  function initPanel() {
    injectCss(PANEL_CSS);
    const panel = document.createElement("div");
    panel.id = "bx-panel";
    const head = document.createElement("div");
    head.className = "bx-panel-head";
    const title = document.createElement("span");
    title.textContent = "BiliEx 设置";
    const close = document.createElement("span");
    close.className = "bx-close";
    close.textContent = "✕";
    close.addEventListener("click", () => panel.classList.remove("bx-open"));
    head.append(title, close);
    const body = document.createElement("div");
    body.className = "bx-panel-body";
    panel.append(head, body);
    const render = () => {
      body.innerHTML = "";
      const all = [...FEATURES, ...ENHANCE_FEATURES];
      const groups = [...new Set(all.map((f) => f.group))];
      for (const g of groups) {
        const gt = document.createElement("div");
        gt.className = "bx-group-title";
        gt.textContent = g;
        body.appendChild(gt);
        for (const f of all.filter((x) => x.group === g)) {
          const item = document.createElement("label");
          item.className = "bx-item";
          const cb = document.createElement("input");
          cb.type = "checkbox";
          cb.checked = settings.get(f.key, f.defaultOn);
          cb.addEventListener("change", () => settings.set(f.key, cb.checked));
          const text = document.createElement("span");
          text.textContent = f.label;
          item.append(cb, text);
          body.appendChild(item);
        }
      }
      const ft = document.createElement("div");
      ft.className = "bx-group-title";
      ft.textContent = "弹幕过滤";
      body.appendChild(ft);
      const fItem = document.createElement("label");
      fItem.className = "bx-item";
      const fCb = document.createElement("input");
      fCb.type = "checkbox";
      const filterConf = settings.getFilter();
      fCb.checked = filterConf.enabled;
      fCb.addEventListener("change", () => settings.setFilter({ enabled: fCb.checked }));
      const fText = document.createElement("span");
      fText.textContent = "启用弹幕关键词过滤";
      fItem.append(fCb, fText);
      body.appendChild(fItem);
      const row = document.createElement("div");
      row.className = "bx-filter-row";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "bx-filter-input";
      input.placeholder = "输入关键词，按回车添加";
      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "bx-filter-add";
      addBtn.textContent = "添加";
      row.append(input, addBtn);
      body.appendChild(row);
      const tags = document.createElement("div");
      tags.className = "bx-filter-tags";
      body.appendChild(tags);
      const hint = document.createElement("div");
      hint.className = "bx-hint";
      hint.textContent = "修改会实时自动保存并生效。";
      body.appendChild(hint);
      let keywords = filterConf.keywords.split(/\n|[,，;；、]/).map((s) => s.trim()).filter(Boolean);
      const persist = () => {
        settings.setFilter({ keywords: keywords.join("\n") });
      };
      const renderTags = () => {
        tags.innerHTML = "";
        if (!keywords.length) {
          const empty = document.createElement("div");
          empty.className = "bx-filter-empty";
          empty.textContent = "暂无过滤词";
          tags.appendChild(empty);
          return;
        }
        keywords.forEach((w) => {
          const tag = document.createElement("span");
          tag.className = "bx-filter-tag";
          const label = document.createElement("span");
          label.textContent = w;
          const close2 = document.createElement("span");
          close2.className = "bx-tag-close";
          close2.textContent = "×";
          close2.addEventListener("click", () => {
            keywords = keywords.filter((k) => k !== w);
            persist();
            renderTags();
          });
          tag.append(label, close2);
          tags.appendChild(tag);
        });
      };
      const addKeyword = () => {
        const val = input.value.trim();
        if (!val) return;
        if (keywords.includes(val)) {
          input.classList.add("bx-dup");
          return;
        }
        input.classList.remove("bx-dup");
        keywords.push(val);
        persist();
        renderTags();
        input.value = "";
        input.focus();
      };
      addBtn.addEventListener("click", addKeyword);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addKeyword();
      });
      input.addEventListener("input", () => input.classList.remove("bx-dup"));
      renderTags();
    };
    const openPanel = () => {
      render();
      ensurePanelParent();
      panel.classList.add("bx-open");
      placePanel();
    };
    const togglePanel = () => {
      if (panel.classList.contains("bx-open")) panel.classList.remove("bx-open");
      else openPanel();
    };
    function ensurePanelParent() {
      const fsEl = document.fullscreenElement;
      if (fsEl && panel.parentElement !== fsEl) fsEl.appendChild(panel);
      else if (!fsEl && panel.parentElement !== document.body) document.body.appendChild(panel);
    }
    const ICON = document.createElement("div");
    ICON.id = "bx-ctrl-item";
    ICON.title = "BiliEx 设置";
    ICON.innerHTML = ICON_SVG;
    ICON.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      togglePanel();
    });
    const mount = () => {
      const root = document.body || document.documentElement;
      root.appendChild(panel);
      root.appendChild(ICON);
    };
    if (document.body) mount();
    else document.addEventListener("DOMContentLoaded", mount, { once: true });
    let lastKey = "";
    const setSpot = (left, top, tag) => {
      const key = tag + ":" + Math.round(left) + "," + Math.round(top);
      if (key !== lastKey) {
        lastKey = key;
        console.log("[BiliEx] 图标定位(" + tag + ")=(", Math.round(left) + "," + Math.round(top) + ")");
      }
      ICON.style.left = left + "px";
      ICON.style.top = top + "px";
    };
    const visibleRect = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) return r;
      return null;
    };
    function placeIcon() {
      const fsEl = document.fullscreenElement;
      const root = fsEl || document.body || document.documentElement;
      if (ICON.parentElement !== root) root.appendChild(ICON);
      const cp = document.getElementById("chat-control-panel-vm");
      const r1 = cp && visibleRect(cp);
      if (r1) return setSpot(r1.right - 40, r1.top - 32, "发送面板上方");
      const aside = document.getElementById("aside-area-vm");
      const r2 = aside && visibleRect(aside);
      if (r2) return setSpot(r2.right - 40, r2.bottom - 44, "聊天区右下角");
      const fd = document.getElementById("fullscreen-danmaku-vm");
      const r3 = fd && visibleRect(fd);
      if (r3) return setSpot(r3.right - 40, r3.top - 36, "全屏弹幕框上方");
      setSpot(window.innerWidth - 54, window.innerHeight - 130, "固定兜底");
    }
    function placePanel() {
      if (!panel.classList.contains("bx-open")) return;
      const r = ICON.getBoundingClientRect();
      if (r.width === 0) return;
      const ph = panel.offsetHeight || 400;
      const pw = 320;
      let left = r.left + r.width / 2 - pw / 2;
      let top = r.top - ph - 8;
      if (left < 8) left = 8;
      if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
      if (top < 8) top = r.bottom + 8;
      panel.style.left = left + "px";
      panel.style.top = top + "px";
    }
    document.addEventListener(
      "pointerdown",
      (e) => {
        if (!panel.classList.contains("bx-open")) return;
        if (panel.contains(e.target) || ICON.contains(e.target)) return;
        panel.classList.remove("bx-open");
      },
      true
    );
    const applyAll = () => {
      placeIcon();
      placePanel();
    };
    applyAll();
    setInterval(applyAll, 1e3);
    window.addEventListener("resize", () => {
      placeIcon();
      placePanel();
    });
    document.addEventListener("fullscreenchange", () => setTimeout(applyAll, 100));
    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("打开 BiliEx 设置", openPanel);
    }
  }

  // src/packages/danmaku-filter/index.js
  function initDanmakuFilter() {
    let observer = null;
    let container = null;
    function getKeywords() {
      const { enabled, keywords } = settings.getFilter();
      if (!enabled) return null;
      const list = keywords.split(/\n|[,，;；、]/).map((s) => s.trim()).filter(Boolean);
      return list.length ? list : null;
    }
    function hit(node, words) {
      const text = (node.textContent || "").toLowerCase();
      return words.some((w) => text.includes(w.toLowerCase()));
    }
    function processNode(n, words) {
      if (n.nodeType === 1 && n.classList && n.classList.contains("chat-item") && hit(n, words)) {
        n.style.display = "none";
      }
    }
    function process(nodes) {
      const words = getKeywords();
      if (!words) return;
      for (const n of nodes) processNode(n, words);
    }
    function attach(el) {
      if (observer) observer.disconnect();
      container = el;
      observer = new MutationObserver((muts) => {
        const adds = [];
        for (const m of muts) for (const n of m.addedNodes) adds.push(n);
        process(adds);
      });
      observer.observe(el, { childList: true });
    }
    function ensure() {
      const el = document.getElementById("chat-items") || document.querySelector(".chat-history-list");
      if (el && el !== container) attach(el);
    }
    ensure();
    setInterval(ensure, 2e3);
    settingsBus.on(() => {
      ensure();
      const words = getKeywords();
      const el = container;
      if (!words || !el) return;
      el.querySelectorAll(".chat-item").forEach((n) => {
        if (n.style.display !== "none") processNode(n, words);
      });
    });
  }

  // src/packages/enhance/index.js
  var log = (...a) => console.log("[BiliEx]", ...a);
  function watchRoomChange(onChange) {
    const getRoom = () => (location.pathname.match(/^\/(\d+)/) || [])[1] || null;
    let cur = getRoom();
    const wrap = (name) => {
      const orig = history[name];
      history[name] = function(...args) {
        const r = orig.apply(this, args);
        setTimeout(onChange, 0);
        return r;
      };
    };
    wrap("pushState");
    wrap("replaceState");
    window.addEventListener("popstate", onChange);
    return () => {
      const m = getRoom();
      const changed = m !== cur;
      cur = m;
      return changed;
    };
  }
  function onPlayerReady(cb) {
    if (window.__PlayerInitialized) return cb();
    const timer = setInterval(() => {
      if (window.__PlayerInitialized) {
        clearInterval(timer);
        cb();
      }
    }, 500);
    setTimeout(() => clearInterval(timer), 6e4);
  }
  function findPlayerAPI() {
    const cands = [window.Player, window.__INTERACTIVE_PLAYER__, window.EmbedPlayer];
    for (const c of cands) {
      if (c && typeof c.getPlayerInfo === "function") return c;
    }
    return null;
  }
  function retry(fn, intervalMs, timeoutMs, tag) {
    const t0 = Date.now();
    const timer = setInterval(() => {
      let r;
      try {
        r = fn();
      } catch (e) {
        log(tag, "出错", e);
        r = true;
      }
      if (r || Date.now() - t0 > timeoutMs) {
        clearInterval(timer);
        if (!r) log(tag, "超时放弃");
      }
    }, intervalMs);
  }
  function ensureUrlParam() {
    if (!/^\/\d+/.test(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    if (params.get("web_fullscreen") === "1") return;
    params.set("web_fullscreen", "1");
    history.replaceState(null, "", location.pathname + "?" + params.toString() + location.hash);
  }
  function isWebFullscreen() {
    return document.body.classList.contains("player-full-win");
  }
  function clickWebFsButton() {
    const wrap = document.getElementById("web-player-controller-wrap-el");
    if (!wrap) return false;
    for (const el of wrap.querySelectorAll("*")) {
      if (el.childElementCount === 0 && el.textContent.trim() === "网页模式") {
        const holder = el.closest("div") || el.parentElement;
        const btn = holder && holder.querySelector("span.icon");
        if (btn) {
          btn.click();
          return true;
        }
      }
    }
    return false;
  }
  function tryWebFullscreen() {
    if (isWebFullscreen()) return true;
    const p = findPlayerAPI();
    if (p && typeof p.setFullscreenStatus === "function") {
      try {
        p.setFullscreenStatus(1);
      } catch {
      }
      if (isWebFullscreen()) return true;
    }
    return clickWebFsButton();
  }
  function runAutoWebFullscreen(tag) {
    if (!settings.get("autoWebFullscreen", true)) return;
    if (isWebFullscreen()) return;
    retry(() => tryWebFullscreen(), 1e3, 2e4, `自动网页全屏(${tag})`);
  }
  function applyHighestQuality() {
    const p = findPlayerAPI();
    if (!p) {
      log("自动最高画质: 未找到播放器实例（Player / __INTERACTIVE_PLAYER__ / EmbedPlayer 均无 getPlayerInfo）");
      return false;
    }
    let info;
    try {
      info = p.getPlayerInfo();
    } catch (e) {
      log("自动最高画质: getPlayerInfo() 调用异常", e);
      return false;
    }
    log("自动最高画质: getPlayerInfo() 原始返回", info);
    const cands = info && (info.qualityCandidates || info.qualityList);
    if (!Array.isArray(cands) || !cands.length) {
      log("自动最高画质: 未拿到画质列表（无 qualityCandidates / qualityList 数组）");
      return false;
    }
    const qnOf = (c) => Number(c.qn ?? c.value ?? c);
    const cur = Number(info.quality ?? info.currentQuality ?? qnOf(cands[0]));
    const max = Math.max(...cands.map(qnOf));
    log("自动最高画质: 当前 qn=" + cur + " 最高 qn=" + max + " 列表=" + cands.map(qnOf).join(","));
    if (!(cur < max)) {
      log("自动最高画质: 已是最高画质");
      return true;
    }
    const fn = p.switchQualitySeamless || p.switchQuality;
    if (typeof fn === "function") {
      try {
        fn.call(p, max);
        log("自动最高画质: 切档成功", cur, "->", max);
        return true;
      } catch (e) {
        log("自动最高画质: 切画质失败", e);
        return false;
      }
    }
    log("自动最高画质: 无 switchQualitySeamless / switchQuality 方法");
    return false;
  }
  function runAutoQuality(tag) {
    if (!settings.get("autoHighestQuality", false)) return;
    retry(() => applyHighestQuality(), 1e3, 2e4, `自动最高画质(${tag})`);
  }
  var FRAME_GAP_CSS = `
/* 背景图固定铺满整个视口：内容区下方留白露出背景图而非页面黑底 */
body:not(.pure_room_root, .player-full-win) .room-bg {
  position: fixed !important;
  inset: 0 !important;
  min-height: 100vh !important;
  background-size: cover !important;
  background-position: center !important;
}
/* 宽度闭环校正：B 站原生公式按隐藏区域的预留高度收窄内容宽（底部余出 ~80px），
   JS 量出底部视觉间距后写入 --bx-frame-w 撑回；未设置时回落 B 站原生公式 */
body:not(.pure_room_root):not(.player-full-win) .live-room-app .app-content .app-body {
  width: var(--bx-frame-w, clamp(980px, min(calc((100vh - 136px - 78px - 64px) * 16 / 9 + 300px + 12px + 100px), calc(100vw - 100px)), 3420px)) !important;
}
`;
  function measureFrameGap() {
    const nav = document.getElementById("main-ctnr");
    const appBody = document.querySelector(".live-room-app .app-body");
    const playerArea = document.querySelector(".live-room-app .app-body .player-and-aside-area");
    if (!nav || !appBody || !playerArea) return null;
    const navBottom = nav.getBoundingClientRect().bottom;
    const bodyTop = appBody.getBoundingClientRect().top;
    const paBottom = playerArea.getBoundingClientRect().bottom;
    const left = playerArea.querySelector(".left-container");
    return {
      T: Math.max(8, Math.round(bodyTop - navBottom)),
      Gb: Math.round(window.innerHeight - paBottom),
      appW: appBody.getBoundingClientRect().width,
      leftW: left ? left.getBoundingClientRect().width : 0
    };
  }
  function runFrameGap() {
    injectCss(FRAME_GAP_CSS);
    let running = false;
    let timer = null;
    const stop = () => {
      running = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      document.documentElement.style.removeProperty("--bx-frame-w");
    };
    const start = () => {
      if (running) return;
      running = true;
      let lastW = null;
      timer = setInterval(() => {
        const m = measureFrameGap();
        if (!m) return;
        const diff = m.Gb - m.T;
        if (Math.abs(diff) <= 2) return;
        const ratio = 0.5625;
        const leftW = m.leftW > 0 ? m.leftW : m.appW * 0.8;
        const dApp = Math.abs(diff) / ratio * (m.appW / leftW);
        let W = diff > 0 ? m.appW + dApp : m.appW - dApp;
        const cap = window.innerWidth - 100;
        W = Math.round(Math.max(980, Math.min(W, cap)));
        if (lastW !== null && Math.abs(W - lastW) <= 2) return;
        lastW = W;
        document.documentElement.style.setProperty("--bx-frame-w", W + "px");
      }, 500);
    };
    const apply = () => {
      if (settings.get("frameGap", true)) start();
      else stop();
    };
    apply();
    settingsBus.on(apply);
  }
  function initEnhance() {
    ensureUrlParam();
    runFrameGap();
    onPlayerReady(() => {
      runAutoWebFullscreen("init");
      runAutoQuality("init");
    });
    const checkRoom = watchRoomChange(() => {
      ensureUrlParam();
      onPlayerReady(() => {
        runAutoWebFullscreen("room");
        runAutoQuality("room");
      });
    });
    setInterval(checkRoom, 1e3);
    settingsBus.on(() => {
      if (settings.get("autoWebFullscreen", true)) runAutoWebFullscreen("toggle");
      if (settings.get("autoHighestQuality", false)) runAutoQuality("toggle");
    });
    window.__BiliExDebugQuality = () => applyHighestQuality();
  }

  // src/main.js
  initPurify();
  initDanmakuFilter();
  initEnhance();
  initPanel();
})();
