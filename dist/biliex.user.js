// ==UserScript==
// @name         BiliEx - B站直播间净化增强
// @namespace    https://github.com/snorlaxy213/bilibiliEx
// @version      0.3.23
// @description  仿 DouyuEx 思路：净化 B 站直播间页面，只留播放器与右侧弹幕流；悬浮球设置面板；弹幕关键词过滤（标签式编辑）
// @author       Jules.chen
// @license      MIT
// @homepageURL  https://github.com/snorlaxy213/bilibiliEx
// @supportURL   https://github.com/snorlaxy213/bilibiliEx/issues
// @icon         data:image/png;base64,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
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
    // 携带变更 key 广播（旧回调忽略参数不受影响；'filter' 代表弹幕过滤配置变化）
    emit(key) {
      listeners.forEach((cb) => cb(key));
    }
  };
  var settings = {
    get(key, fallback = false) {
      return cache.features[key] ?? fallback;
    },
    set(key, val) {
      cache.features[key] = val;
      save();
      settingsBus.emit(key);
    },
    getFilter() {
      return { ...cache.filter };
    },
    setFilter(patch) {
      cache.filter = { ...cache.filter, ...patch };
      save();
      settingsBus.emit("filter");
    }
  };

  // src/packages/purify/features.js
  var FEATURES = [
    // ================= 页面净化 =================
    {
      group: "快速使用",
      key: "zenMode",
      label: "极简模式",
      desc: "一键隐藏页面周边元素，只留播放器与弹幕流",
      defaultOn: true,
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
      desc: "隐藏主播信息栏右侧的热门榜、活动标签与更多设置入口",
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
      desc: "隐藏主播头像、昵称、关注按钮等整条信息栏",
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
      desc: "隐藏屏幕右侧的一列悬浮功能按钮",
      defaultOn: true,
      css: `
html[bx-hideSidebar] #sidebar-vm { display: none !important; }
`
    },
    {
      group: "页面净化",
      key: "hideSections",
      label: "播放器下方全部内容（介绍/动态/推荐/公告）",
      desc: "隐藏播放器下方的介绍、动态、推荐与公告区块",
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
      desc: "隐藏直播间活动海报与翻转视图",
      defaultOn: true,
      css: `
html[bx-hideFlipView] .flip-view { display: none !important; }
`
    },
    {
      group: "页面净化",
      key: "hideFooter",
      label: "页面页脚（关于我们/备案信息）",
      desc: "隐藏页面底部关于我们与备案信息，并自动应用上下等边距贴合视口",
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
      desc: "移除直播间背景壁纸，改用纯色背景",
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
      desc: "隐藏播放器底部的礼物栏，含宝箱、抽奖、贵物入口",
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
      desc: "隐藏画面顶部的滚动礼物/打赏通告条",
      defaultOn: true,
      css: `
html[bx-hideAnnouncement] #live-player .announcement-wrapper { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hidePk",
      label: "直播 PK 特效",
      desc: "隐藏直播 PK 对战的特殊效果与弹窗",
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
      desc: "隐藏「天选时刻」抽奖弹窗提示",
      defaultOn: true,
      css: `
html[bx-hideLottery] #anchor-guest-box-id { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideShop",
      label: "购物小橙车",
      desc: "隐藏画面中的购物车（小橙车）图标",
      defaultOn: true,
      css: `
html[bx-hideShop] #shop-popover-vm { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideSticker",
      label: "播放器内互动贴纸",
      desc: "隐藏画面内的互动贴纸与浮层",
      defaultOn: true,
      css: `
html[bx-hideSticker] #interactive-sticker-vm { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideFeedback",
      label: "反馈按钮",
      desc: "隐藏播放器控制条上的反馈按钮",
      defaultOn: true,
      css: `
html[bx-hideFeedback] .web-player-icon-feedback { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideWatermark",
      label: "直播水印 / 边缘模糊条纹",
      desc: "隐藏直播水印与画面边缘的模糊条纹",
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
      desc: "隐藏偶尔弹出的卡顿体验打分框",
      defaultOn: true,
      css: `
html[bx-hideResearch] .research-container { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideGameId",
      label: "幻星互动游戏",
      desc: "隐藏幻星互动游戏入口",
      defaultOn: true,
      css: `
html[bx-hideGameId] #game-id { display: none !important; }
`
    },
    {
      group: "播放器",
      key: "hideFullscreenDanmaku",
      label: "全屏时的弹幕发送框",
      desc: "隐藏网页全屏状态下浮出的弹幕发送框",
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
      desc: "隐藏右侧的排行榜与大航海（舰长）列表",
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
      desc: "隐藏「XXX 来了」这类进场欢迎消息",
      defaultOn: true,
      css: `
html[bx-hideWelcome] .welcome-section-bottom { display: none; }
`
    },
    {
      group: "聊天区",
      key: "hideSystemMsg",
      label: "系统提示公告",
      desc: "隐藏系统提示与公告类消息",
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
      desc: "隐藏「谁送了什么礼物」类礼物弹幕",
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
      desc: "隐藏大表情与表情弹幕",
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
      desc: "隐藏弹幕前的粉丝牌、等级、头衔与排名标识",
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
      desc: "取消舰长、提督、总督弹幕的高亮底色",
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
      desc: "隐藏弹幕区底部的滚动提示条",
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
      desc: "隐藏连击、互动类卡片弹窗",
      defaultOn: true,
      css: `
html[bx-hideComboCard] #relocated-cards-area { display: none !important; }
`
    },
    {
      group: "聊天区",
      key: "hideControlPanel",
      label: "弹幕发送框（整个底部面板，回车仍可发）",
      desc: "隐藏整个弹幕发送面板，回车键仍可发送",
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
      group: "快速使用",
      key: "autoWebFullscreen",
      label: "自动网页全屏（进房即全屏）",
      desc: "进入直播间后自动切换为网页全屏",
      defaultOn: false
    },
    {
      group: "快速使用",
      key: "autoHighestQuality",
      label: "自动最高画质（受登录/大会员限制）",
      desc: "自动切换到当前可用的最高画质",
      defaultOn: false
    }
  ];

  // src/packages/panel/panel.css.js
  var PANEL_CSS = `
/* ===== B 图标 ===== */
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

/* ===== 遮罩层 ===== */
#bx-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  background: rgba(0, 0, 0, 0.4);
  display: none;
}
#bx-overlay.bx-open { display: block; }

/* ===== 设置模态（居中大窗） ===== */
#bx-panel {
  position: fixed;
  z-index: 2147483647;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(860px, 92vw);
  height: min(620px, 84vh);
  display: none;
  flex-direction: column;
  background: #f6f7f8;
  color: #18191c;
  border-radius: 14px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.24);
  font: 13px/1.5 -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow: hidden;
}
#bx-panel.bx-open { display: flex; }

/* 头部 */
.bx-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  font-weight: 600;
  font-size: 15px;
}
.bx-panel-head .bx-close {
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #61666d;
  font-size: 16px;
  line-height: 1;
  background: #ececee;
}
.bx-panel-head .bx-close:hover { background: #e0e1e4; color: #18191c; }

/* 主体：左导航 + 右内容 */
.bx-panel-main {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* 左侧导航 */
.bx-nav {
  width: 180px;
  flex: none;
  padding: 6px 10px;
  overflow-y: auto;
}
.bx-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  margin-bottom: 2px;
  border-radius: 8px;
  cursor: pointer;
  color: #18191c;
  user-select: none;
}
.bx-nav-item:hover { background: #ececee; }
.bx-nav-item.bx-active { background: #e3e5e7; font-weight: 600; }
.bx-nav-item .bx-nav-ic {
  flex: none;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bx-nav-item .bx-nav-ic svg { display: block; }

/* 右侧内容区 */
.bx-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: 6px 20px 20px;
}
.bx-content:not(.bx-active) { display: none; }

/* 分组标题（卡片外） */
.bx-group-title {
  margin: 16px 0 8px;
  font-size: 12px;
  color: #9499a0;
  font-weight: 600;
}
.bx-group-title:first-child { margin-top: 4px; }

/* 设置卡片 */
.bx-card {
  background: #fff;
  border: 1px solid #ececee;
  border-radius: 12px;
  overflow: hidden;
}

/* 设置项：两行（标题 + 描述）+ 右侧 toggle */
.bx-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
}
.bx-item + .bx-item { border-top: 1px solid #f0f1f3; }
.bx-item .bx-item-text { flex: 1; min-width: 0; }
.bx-item .bx-item-title { font-size: 13px; color: #18191c; }
.bx-item .bx-item-desc { font-size: 11.5px; color: #9499a0; margin-top: 2px; }

/* iOS 风格 toggle */
.bx-toggle {
  position: relative;
  flex: none;
  width: 40px;
  height: 23px;
  border-radius: 23px;
  background: #d0d3d7;
  transition: background 0.18s ease;
}
.bx-toggle::after {
  content: "";
  position: absolute;
  left: 2px;
  top: 2px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.18s ease;
}
.bx-item input[type="checkbox"] { position: absolute; opacity: 0; width: 0; height: 0; }
.bx-item input:checked + .bx-toggle { background: #2f81f7; }
.bx-item input:checked + .bx-toggle::after { transform: translateX(17px); }

/* 极简模式锁定态：整行置灰、光标提示、toggle 强制显示开启 */
.bx-item.bx-locked {
  opacity: 0.55;
  cursor: not-allowed;
}
.bx-item.bx-locked .bx-item-title { color: #61666d; }
.bx-item.bx-locked input:not(:checked) + .bx-toggle { background: #2f81f7; }
.bx-item.bx-locked input:not(:checked) + .bx-toggle::after { transform: translateX(17px); }

/* 「极简模式」徽标 */
.bx-lock-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 0 8px;
  height: 18px;
  line-height: 18px;
  font-size: 11px;
  font-weight: 400;
  color: #185fa5;
  background: #e6f1fb;
  border: 1px solid #b5d4f4;
  border-radius: 9px;
  vertical-align: 1px;
}

/* 弹幕过滤编辑区 */
.bx-filter-row {
  display: flex;
  gap: 8px;
  margin: 12px 16px 4px;
}
.bx-filter-input {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  height: 34px;
  padding: 0 12px;
  border: 1px solid #e3e5e7;
  border-radius: 8px;
  font: 13px/1.5 -apple-system, "PingFang SC", sans-serif;
  color: #18191c;
  background: #fff;
}
.bx-filter-input:focus { outline: none; border-color: #2f81f7; }
.bx-filter-input.bx-dup { border-color: #e24b4a; }
.bx-filter-add {
  flex: none;
  height: 34px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: #2f81f7;
  color: #fff;
  font: 13px/1 -apple-system, "PingFang SC", sans-serif;
  cursor: pointer;
}
.bx-filter-add:hover { background: #1f6fe0; }
.bx-filter-add:active { background: #1a5fc4; }

.bx-filter-tags {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 6px;
  min-height: 60px;
  max-height: 160px;
  overflow-y: auto;
  margin: 8px 16px 0;
  padding: 10px;
  border: 1px solid #e3e5e7;
  border-radius: 8px;
  background: #fafbfc;
}
.bx-filter-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 7px 0 10px;
  border-radius: 12px;
  background: #e6f1fb;
  border: 1px solid #b5d4f4;
  font: 12px/1 -apple-system, "PingFang SC", sans-serif;
  color: #185fa5;
}
.bx-filter-tag .bx-tag-close {
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  color: #85b7eb;
}
.bx-filter-tag .bx-tag-close:hover { color: #e24b4a; }
.bx-filter-empty { font: 12px/1.5 -apple-system, "PingFang SC", sans-serif; color: #9499a0; }
.bx-hint { font-size: 11px; color: #9499a0; margin: 10px 16px 0; }
`;

  // src/packages/panel/index.js
  var ICON_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="#fb7299"/><text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff" font-family="-apple-system,'PingFang SC',sans-serif">B</text></svg>`;
  var NAV_ICONS = {
    purify: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    player: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/></svg>',
    quick: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
    filter: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M7 12h10M10 19h4"/></svg>'
  };
  var TABS = [
    { id: "quick", label: "快速使用", icon: "quick", groups: ["快速使用"], hint: "一键获得净化与自动化体验，细节可在各分类页调整。" },
    { id: "purify", label: "页面净化", icon: "purify", groups: ["页面净化"] },
    { id: "player", label: "播放器", icon: "player", groups: ["播放器"] },
    { id: "chat", label: "聊天区", icon: "chat", groups: ["聊天区"] },
    { id: "filter", label: "弹幕过滤", icon: "filter", groups: [] }
  ];
  var ZEN_KEY = "zenMode";
  var ZEN_COVERS = ["hideHeadInfoTags", "hideSidebar", "hideSections", "hideFlipView", "hideFooter", "hideGiftBar"];
  function initPanel() {
    injectCss(PANEL_CSS);
    const overlay = document.createElement("div");
    overlay.id = "bx-overlay";
    overlay.addEventListener("click", () => closePanel());
    const panel = document.createElement("div");
    panel.id = "bx-panel";
    const head = document.createElement("div");
    head.className = "bx-panel-head";
    const title = document.createElement("span");
    title.textContent = "BiliEx 设置";
    const close = document.createElement("span");
    close.className = "bx-close";
    close.textContent = "✕";
    close.addEventListener("click", () => closePanel());
    head.append(title, close);
    const main = document.createElement("div");
    main.className = "bx-panel-main";
    const nav = document.createElement("div");
    nav.className = "bx-nav";
    const contentWrap = document.createElement("div");
    contentWrap.style.cssText = "flex:1;min-width:0;display:flex;flex-direction:column;";
    panel.append(head, main);
    main.append(nav, contentWrap);
    const contentEls = {};
    for (const t of TABS) {
      const el = document.createElement("div");
      el.className = "bx-content";
      el.dataset.key = t.id;
      contentWrap.appendChild(el);
      contentEls[t.id] = el;
    }
    const navEls = {};
    const switchTab = (id) => {
      for (const t of TABS) {
        navEls[t.id].classList.toggle("bx-active", t.id === id);
        contentEls[t.id].classList.toggle("bx-active", t.id === id);
      }
    };
    for (const t of TABS) {
      const item = document.createElement("div");
      item.className = "bx-nav-item";
      const ic = document.createElement("span");
      ic.className = "bx-nav-ic";
      ic.innerHTML = NAV_ICONS[t.icon];
      const label = document.createElement("span");
      label.textContent = t.label;
      item.append(ic, label);
      item.addEventListener("click", () => switchTab(t.id));
      nav.appendChild(item);
      navEls[t.id] = item;
    }
    const allFeatures = [...FEATURES, ...ENHANCE_FEATURES];
    const renderFeatureGroup = (container, group) => {
      const gt = document.createElement("div");
      gt.className = "bx-group-title";
      gt.textContent = group;
      container.appendChild(gt);
      const card = document.createElement("div");
      card.className = "bx-card";
      const zenOn = settings.get(ZEN_KEY, false);
      for (const f of allFeatures.filter((x) => x.group === group)) {
        const locked = zenOn && ZEN_COVERS.includes(f.key);
        const on = locked ? true : settings.get(f.key, f.defaultOn);
        const item = buildToggleItem(f.key, f.label, f.desc, on, (v) => settings.set(f.key, v));
        if (locked) {
          item.classList.add("bx-locked");
          item.setAttribute("title", "由「极简模式」包含，当前已生效");
          item.addEventListener("click", () => settings.set(ZEN_KEY, false));
        }
        card.appendChild(item);
      }
      container.appendChild(card);
      const tab = TABS.find((t) => t.groups.includes(group));
      if (tab && tab.hint) {
        const h = document.createElement("div");
        h.className = "bx-hint";
        h.textContent = tab.hint;
        container.appendChild(h);
      }
    };
    const renderFilterTab = (container) => {
      const gt = document.createElement("div");
      gt.className = "bx-group-title";
      gt.textContent = "弹幕过滤";
      container.appendChild(gt);
      const card = document.createElement("div");
      card.className = "bx-card";
      const filterConf = settings.getFilter();
      card.appendChild(
        buildToggleItem("filter-enabled", "启用弹幕关键词过滤", "匹配到关键词的弹幕将被隐藏", filterConf.enabled, (v) => settings.setFilter({ enabled: v }))
      );
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
      card.appendChild(row);
      const tags = document.createElement("div");
      tags.className = "bx-filter-tags";
      card.appendChild(tags);
      const hint = document.createElement("div");
      hint.className = "bx-hint";
      hint.textContent = "支持 /正则/ 形式，多个关键词可用逗号或换行分隔。修改会实时自动保存并生效。";
      card.appendChild(hint);
      container.appendChild(card);
      let keywords = filterConf.keywords.split(/\n|[,，;；、]/).map((s) => s.trim()).filter(Boolean);
      const persist = () => settings.setFilter({ keywords: keywords.join("\n") });
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
          const x = document.createElement("span");
          x.className = "bx-tag-close";
          x.textContent = "×";
          x.addEventListener("click", () => {
            keywords = keywords.filter((k) => k !== w);
            persist();
            renderTags();
          });
          tag.append(label, x);
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
    const render = (tabId) => {
      const targets = tabId ? TABS.filter((t) => t.id === tabId) : TABS;
      for (const t of targets) {
        const el = contentEls[t.id];
        el.innerHTML = "";
        if (t.id === "filter") renderFilterTab(el);
        else for (const g of t.groups) renderFeatureGroup(el, g);
      }
    };
    settingsBus.on((key) => {
      if (!panel.classList.contains("bx-open")) return;
      if (key === ZEN_KEY) {
        render("quick");
        render("purify");
        render("player");
      } else if (key === "filter") {
        return;
      } else {
        render("quick");
      }
    });
    const openPanel = () => {
      render();
      ensurePanelParent();
      panel.classList.add("bx-open");
      overlay.classList.add("bx-open");
      switchTab(TABS[0].id);
    };
    const closePanel = () => {
      panel.classList.remove("bx-open");
      overlay.classList.remove("bx-open");
    };
    const togglePanel = () => {
      if (panel.classList.contains("bx-open")) closePanel();
      else openPanel();
    };
    function ensurePanelParent() {
      const fsEl = document.fullscreenElement;
      const root = fsEl || document.body;
      if (overlay.parentElement !== root) root.appendChild(overlay);
      if (panel.parentElement !== root) root.appendChild(panel);
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
      root.appendChild(overlay);
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
    document.addEventListener(
      "pointerdown",
      (e) => {
        if (!panel.classList.contains("bx-open")) return;
        if (panel.contains(e.target) || ICON.contains(e.target)) return;
        closePanel();
      },
      true
    );
    const applyAll = () => placeIcon();
    applyAll();
    setInterval(applyAll, 1e3);
    window.addEventListener("resize", applyAll);
    document.addEventListener("fullscreenchange", () => setTimeout(applyAll, 100));
    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("打开 BiliEx 设置", openPanel);
    }
  }
  function buildToggleItem(key, label, desc, checked, onChange, locked) {
    const item = document.createElement("label");
    item.className = "bx-item";
    const text = document.createElement("div");
    text.className = "bx-item-text";
    const t = document.createElement("div");
    t.className = "bx-item-title";
    const tl = document.createElement("span");
    tl.textContent = label;
    t.appendChild(tl);
    if (locked) {
      const badge = document.createElement("span");
      badge.className = "bx-lock-badge";
      badge.textContent = "极简模式";
      t.appendChild(badge);
    }
    text.appendChild(t);
    if (desc) {
      const d = document.createElement("div");
      d.className = "bx-item-desc";
      d.textContent = desc;
      text.appendChild(d);
    }
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = checked;
    cb.addEventListener("change", () => onChange(cb.checked));
    const sw = document.createElement("span");
    sw.className = "bx-toggle";
    item.append(text, cb, sw);
    return item;
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
  var mutatingUrl = false;
  function watchRoomChange(onChange) {
    const getRoom = () => (location.pathname.match(/^\/(\d+)/) || [])[1] || null;
    let cur = getRoom();
    const wrap = (name) => {
      const orig = history[name];
      history[name] = function(...args) {
        const r = orig.apply(this, args);
        if (!mutatingUrl) setTimeout(onChange, 0);
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
    const enabled = settings.get("autoWebFullscreen", false);
    const params = new URLSearchParams(location.search);
    if (!enabled) {
      if (params.get("web_fullscreen") === "1") {
        params.delete("web_fullscreen");
        mutatingUrl = true;
        history.replaceState(null, "", location.pathname + (params.toString() ? "?" + params.toString() : "") + location.hash);
        mutatingUrl = false;
      }
      return;
    }
    if (params.get("web_fullscreen") === "1") return;
    params.set("web_fullscreen", "1");
    mutatingUrl = true;
    history.replaceState(null, "", location.pathname + "?" + params.toString() + location.hash);
    mutatingUrl = false;
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
    if (!settings.get("autoWebFullscreen", false)) return;
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
      const on = settings.get("hideFooter", true) || settings.get("zenMode", false);
      if (on) start();
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
      if (settings.get("autoWebFullscreen", false)) runAutoWebFullscreen("toggle");
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
