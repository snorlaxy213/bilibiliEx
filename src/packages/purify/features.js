// 净化功能清单：key 对应 html[bx-<key>] 属性选择器，开关 = 属性有无
// 选择器来源：bilibili-cleaner (MIT) + 实测稳定 id，均为 B 站直播间当前有效选择器
export const FEATURES = [
  // ================= 页面净化 =================
  {
    group: '页面净化',
    key: 'zenMode',
    label: '极简模式',
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
`,
  },
  {
    group: '页面净化',
    key: 'hideHeadInfoTags',
    label: '主播信息栏：热门榜/活动标签/更多设置',
    defaultOn: true,
    css: `
html[bx-hideHeadInfoTags] #head-info-vm #LiveRoomHotrankEntries,
html[bx-hideHeadInfoTags] #head-info-vm .activity-entry,
html[bx-hideHeadInfoTags] #head-info-vm .right-dynamic-modules { display: none !important; }
`,
  },
  {
    group: '页面净化',
    key: 'hideHeadInfo',
    label: '主播信息栏（整个隐藏，含头像/关注）',
    defaultOn: false,
    css: `
html[bx-hideHeadInfo] #head-info-vm { display: none !important; }
html[bx-hideHeadInfo] #player-ctnr {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
}
`,
  },
  {
    group: '页面净化',
    key: 'hideSidebar',
    label: '右侧悬浮按钮（实验室/关注等）',
    defaultOn: true,
    css: `
html[bx-hideSidebar] #sidebar-vm { display: none !important; }
`,
  },
  {
    group: '页面净化',
    key: 'hideSections',
    label: '播放器下方全部内容（介绍/动态/推荐/公告）',
    defaultOn: true,
    css: `
html[bx-hideSections] #sections-vm { display: none !important; }
html[bx-hideSections] .room-bg { min-height: 99vh !important; }
`,
  },
  {
    group: '页面净化',
    key: 'hideFlipView',
    label: '活动海报',
    defaultOn: true,
    css: `
html[bx-hideFlipView] .flip-view { display: none !important; }
`,
  },
  {
    group: '页面净化',
    key: 'hideFooter',
    label: '页面页脚（关于我们/备案信息）',
    defaultOn: true,
    css: `
html[bx-hideFooter] #link-footer-vm,
html[bx-hideFooter] footer.link-footer { display: none !important; }
`,
  },
  {
    group: '页面净化',
    key: 'removeWallpaper',
    label: '直播间背景图（改纯色）',
    defaultOn: false,
    css: `
html[bx-removeWallpaper] .room-bg { background-image: unset !important; }
html[bx-removeWallpaper] #player-ctnr {
  box-shadow: 0 0 12px rgb(0 0 0 / 0.2);
  border-radius: 12px;
}
html[bx-removeWallpaper] #aside-area-vm { box-shadow: 0 0 12px rgb(0 0 0 / 0.2); }
`,
  },

  // ================= 播放器 =================
  {
    group: '播放器',
    key: 'hideGiftBar',
    label: '礼物栏（宝箱/抽奖/贵物）',
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
`,
  },
  {
    group: '播放器',
    key: 'hideAnnouncement',
    label: '滚动礼物通告',
    defaultOn: true,
    css: `
html[bx-hideAnnouncement] #live-player .announcement-wrapper { display: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hidePk',
    label: '直播 PK 特效',
    defaultOn: true,
    css: `
html[bx-hidePk] #pk-vm,
html[bx-hidePk] #awesome-pk-vm,
html[bx-hidePk] #universal-pk-vm { display: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hideLottery',
    label: '天选时刻弹窗',
    defaultOn: true,
    css: `
html[bx-hideLottery] #anchor-guest-box-id { display: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hideShop',
    label: '购物小橙车',
    defaultOn: true,
    css: `
html[bx-hideShop] #shop-popover-vm { display: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hideSticker',
    label: '播放器内互动贴纸',
    defaultOn: true,
    css: `
html[bx-hideSticker] #interactive-sticker-vm { display: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hideFeedback',
    label: '反馈按钮',
    defaultOn: true,
    css: `
html[bx-hideFeedback] .web-player-icon-feedback { display: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hideWatermark',
    label: '直播水印 / 边缘模糊条纹',
    defaultOn: true,
    css: `
html[bx-hideWatermark] .web-player-icon-roomStatus,
html[bx-hideWatermark] .blur-edges-ctnr { display: none !important; }
html[bx-hideWatermark] .web-player-module-area-mask { backdrop-filter: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hideResearch',
    label: '卡顿打分弹窗',
    defaultOn: true,
    css: `
html[bx-hideResearch] .research-container { display: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hideGameId',
    label: '幻星互动游戏',
    defaultOn: true,
    css: `
html[bx-hideGameId] #game-id { display: none !important; }
`,
  },
  {
    group: '播放器',
    key: 'hideFullscreenDanmaku',
    label: '全屏时的弹幕发送框',
    defaultOn: false,
    css: `
html[bx-hideFullscreenDanmaku] #fullscreen-danmaku-vm { display: none !important; }
`,
  },

  // ================= 聊天区 =================
  {
    group: '聊天区',
    key: 'hideRankList',
    label: '排行榜 / 大航海列表',
    defaultOn: false,
    css: `
html[bx-hideRankList] #rank-list-vm { display: none !important; }
html[bx-hideRankList] body:not(.hide-aside-area.player-full-win) #aside-area-vm {
  display: flex;
  flex-direction: column;
}
html[bx-hideRankList] .chat-history-panel { flex: 1; }
`,
  },
  {
    group: '聊天区',
    key: 'hideWelcome',
    label: '"XXX 来了" 欢迎消息',
    defaultOn: true,
    css: `
html[bx-hideWelcome] .welcome-section-bottom { display: none; }
`,
  },
  {
    group: '聊天区',
    key: 'hideSystemMsg',
    label: '系统提示公告',
    defaultOn: true,
    css: `
html[bx-hideSystemMsg] .convention-msg.border-box,
html[bx-hideSystemMsg] .new-video-pk-item-dm { display: none !important; }
`,
  },
  {
    group: '聊天区',
    key: 'hideGiftMsg',
    label: '礼物弹幕（谁送了礼物）',
    defaultOn: true,
    css: `
html[bx-hideGiftMsg] .chat-item.gift-item,
html[bx-hideGiftMsg] .chat-item.common-danmuku-msg { display: none !important; }
`,
  },
  {
    group: '聊天区',
    key: 'hideEmoticon',
    label: '大表情弹幕',
    defaultOn: false,
    css: `
html[bx-hideEmoticon] .chat-item.bulge-emoticon,
html[bx-hideEmoticon] .chat-item.chat-emoticon { display: none !important; }
html[bx-hideEmoticon] .bili-dm-emoji,
html[bx-hideEmoticon] .bili-danmaku-x-dm-emoji { display: none !important; }
`,
  },
  {
    group: '聊天区',
    key: 'hideMedal',
    label: '粉丝牌 / 等级 / 头衔 / 排名标识',
    defaultOn: false,
    css: `
html[bx-hideMedal] .chat-item .fans-medal-item-ctnr,
html[bx-hideMedal] .chat-item .wealth-medal-ctnr,
html[bx-hideMedal] .chat-item .group-medal-ctnr,
html[bx-hideMedal] .chat-item .title-label,
html[bx-hideMedal] .chat-item .rank-icon { display: none !important; }
`,
  },
  {
    group: '聊天区',
    key: 'hideHighlight',
    label: '弹幕高亮底色（舰长/提督/总督）',
    defaultOn: false,
    css: `
html[bx-hideHighlight] .chat-item {
  background-color: unset !important;
  border-image-source: unset !important;
}
`,
  },
  {
    group: '聊天区',
    key: 'hideBrushPrompt',
    label: '底部滚动提示条',
    defaultOn: true,
    css: `
html[bx-hideBrushPrompt] #brush-prompt { display: none !important; }
html[bx-hideBrushPrompt] .chat-history-panel .chat-history-list.with-brush-prompt { height: 100% !important; }
`,
  },
  {
    group: '聊天区',
    key: 'hideComboCard',
    label: '互动卡片弹窗',
    defaultOn: true,
    css: `
html[bx-hideComboCard] #relocated-cards-area { display: none !important; }
`,
  },
  {
    group: '聊天区',
    key: 'hideControlPanel',
    label: '弹幕发送框（整个底部面板，回车仍可发）',
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
`,
  },
];
