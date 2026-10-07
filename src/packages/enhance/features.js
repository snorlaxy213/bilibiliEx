// 增强功能清单（非 CSS 类，JS 行为型功能），开关复用全局 settings
// v0.3.20：frameGap（上下等边距）不再独立成开关，逻辑并入 hideFooter/zenMode（见 index.js）
export const ENHANCE_FEATURES = [
  {
    group: '快速使用',
    key: 'autoWebFullscreen',
    label: '自动网页全屏（进房即全屏）',
    desc: '进入直播间后自动切换为网页全屏',
    defaultOn: false,
  },
  {
    group: '快速使用',
    key: 'autoHighestQuality',
    label: '自动最高画质（受登录/大会员限制）',
    desc: '自动切换到当前可用的最高画质',
    defaultOn: false,
  },
];
