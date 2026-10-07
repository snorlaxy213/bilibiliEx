import { settings, settingsBus } from '../../common/settings.js';
import { injectCss } from '../../common/dom.js';
import { ENHANCE_FEATURES } from './features.js';

const log = (...a) => console.log('[BiliEx]', ...a);

// ================= 通用工具 =================

// 房间号变化监听（B 站直播间是 SPA 路由）
function watchRoomChange(onChange) {
  const getRoom = () => (location.pathname.match(/^\/(\d+)/) || [])[1] || null;
  let cur = getRoom();
  const wrap = (name) => {
    const orig = history[name];
    history[name] = function (...args) {
      const r = orig.apply(this, args);
      setTimeout(onChange, 0);
      return r;
    };
  };
  wrap('pushState');
  wrap('replaceState');
  window.addEventListener('popstate', onChange);
  return () => {
    const m = getRoom();
    const changed = m !== cur;
    cur = m;
    return changed;
  };
}

// B 站自己在播放器初始化后设置 window.__PlayerInitialized = true
function onPlayerReady(cb) {
  if (window.__PlayerInitialized) return cb();
  const timer = setInterval(() => {
    if (window.__PlayerInitialized) {
      clearInterval(timer);
      cb();
    }
  }, 500);
  setTimeout(() => clearInterval(timer), 60000); // 60s 放弃
}

// 探查播放器实例：以「具有 getPlayerInfo 方法」为识别特征
function findPlayerAPI() {
  const cands = [window.Player, window.__INTERACTIVE_PLAYER__, window.EmbedPlayer];
  for (const c of cands) {
    if (c && typeof c.getPlayerInfo === 'function') return c;
  }
  return null;
}

// 周期性重试，直到 fn 返回真值或超时
function retry(fn, intervalMs, timeoutMs, tag) {
  const t0 = Date.now();
  const timer = setInterval(() => {
    let r;
    try {
      r = fn();
    } catch (e) {
      log(tag, '出错', e);
      r = true; // 出错不再重试
    }
    if (r || Date.now() - t0 > timeoutMs) {
      clearInterval(timer);
      if (!r) log(tag, '超时放弃');
    }
  }, intervalMs);
}

// ================= 自动网页全屏 =================

// 主路径：B 站 app 源码原生支持 web_fullscreen=1 查询参数，播放器初始化时自动进入
function ensureUrlParam() {
  if (!/^\/\d+/.test(location.pathname)) return;
  const params = new URLSearchParams(location.search);
  if (params.get('web_fullscreen') === '1') return;
  params.set('web_fullscreen', '1');
  history.replaceState(null, '', location.pathname + '?' + params.toString() + location.hash);
}

// 网页全屏态：B 站在 body 上挂 player-full-win class
function isWebFullscreen() {
  return document.body.classList.contains('player-full-win');
}

// 兜底：模拟点击控制条「网页模式」按钮（tooltip 文案在 Svelte 组件里写死）
function clickWebFsButton() {
  const wrap = document.getElementById('web-player-controller-wrap-el');
  if (!wrap) return false;
  for (const el of wrap.querySelectorAll('*')) {
    if (el.childElementCount === 0 && el.textContent.trim() === '网页模式') {
      const holder = el.closest('div') || el.parentElement;
      const btn = holder && holder.querySelector('span.icon');
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
  if (p && typeof p.setFullscreenStatus === 'function') {
    try {
      p.setFullscreenStatus(1);
    } catch { /* ignore */ }
    if (isWebFullscreen()) return true;
  }
  return clickWebFsButton();
}

function runAutoWebFullscreen(tag) {
  if (!settings.get('autoWebFullscreen', true)) return;
  if (isWebFullscreen()) return;
  retry(() => tryWebFullscreen(), 1000, 20000, `自动网页全屏(${tag})`);
}

// ================= 自动最高画质 =================

// 通过播放器实例 API：getPlayerInfo() 拿画质列表，switchQualitySeamless(最高qn) 无缝切档
// 每一步都打印诊断日志，便于定位失效环节
function applyHighestQuality() {
  const p = findPlayerAPI();
  if (!p) {
    log('自动最高画质: 未找到播放器实例（Player / __INTERACTIVE_PLAYER__ / EmbedPlayer 均无 getPlayerInfo）');
    return false;
  }
  let info;
  try {
    info = p.getPlayerInfo();
  } catch (e) {
    log('自动最高画质: getPlayerInfo() 调用异常', e);
    return false;
  }
  log('自动最高画质: getPlayerInfo() 原始返回', info);
  const cands = info && (info.qualityCandidates || info.qualityList);
  if (!Array.isArray(cands) || !cands.length) {
    log('自动最高画质: 未拿到画质列表（无 qualityCandidates / qualityList 数组）');
    return false;
  }
  const qnOf = (c) => Number(c.qn ?? c.value ?? c);
  const cur = Number(info.quality ?? info.currentQuality ?? qnOf(cands[0]));
  const max = Math.max(...cands.map(qnOf));
  log('自动最高画质: 当前 qn=' + cur + ' 最高 qn=' + max + ' 列表=' + cands.map(qnOf).join(','));
  if (!(cur < max)) {
    log('自动最高画质: 已是最高画质');
    return true;
  }
  const fn = p.switchQualitySeamless || p.switchQuality;
  if (typeof fn === 'function') {
    try {
      fn.call(p, max);
      log('自动最高画质: 切档成功', cur, '->', max);
      return true;
    } catch (e) {
      log('自动最高画质: 切画质失败', e);
      return false;
    }
  }
  log('自动最高画质: 无 switchQualitySeamless / switchQuality 方法');
  return false;
}

function runAutoQuality(tag) {
  if (!settings.get('autoHighestQuality', false)) return;
  retry(() => applyHighestQuality(), 1000, 20000, `自动最高画质(${tag})`);
}

// ================= 上下等边距 =================

// 让内容区上下留白一致：量出「顶部导航栏底 ↔ 内容顶」这段间距，同样加到内容区底部，
// 背景图铺满视口，底部露出的是背景图而非黑边。
const FRAME_GAP_CSS = `
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

// 顶部基准间距 T：导航栏底 ↔ 内容块顶（用户选定的对称基准，最小 8px 兜底）
// 底部视觉间距 Gb：内容块底 ↔ 视口底
function measureFrameGap() {
  const nav = document.getElementById('main-ctnr');
  const appBody = document.querySelector('.live-room-app .app-body');
  const playerArea = document.querySelector('.live-room-app .app-body .player-and-aside-area');
  if (!nav || !appBody || !playerArea) return null;
  const navBottom = nav.getBoundingClientRect().bottom;
  const bodyTop = appBody.getBoundingClientRect().top;
  const paBottom = playerArea.getBoundingClientRect().bottom;
  const left = playerArea.querySelector('.left-container');
  return {
    T: Math.max(8, Math.round(bodyTop - navBottom)),
    Gb: Math.round(window.innerHeight - paBottom),
    appW: appBody.getBoundingClientRect().width,
    leftW: left ? left.getBoundingClientRect().width : 0,
  };
}

function runFrameGap() {
  injectCss(FRAME_GAP_CSS);

  let running = false;
  let timer = null;

  const stop = () => {
    running = false;
    if (timer) { clearInterval(timer); timer = null; }
    document.documentElement.style.removeProperty('--bx-frame-w');
  };

  // 闭环校正：播放器高 = 左列宽 × 56.25%；按 Gb−T 反推内容列宽度增量，迭代至底部间距 = 顶部间距
  const start = () => {
    if (running) return;
    running = true;
    let lastW = null;
    timer = setInterval(() => {
      const m = measureFrameGap();
      if (!m) return;
      const diff = m.Gb - m.T;
      if (Math.abs(diff) <= 2) return; // 已对称（±2px 容差）
      const ratio = 0.5625; // 播放器 16:9
      const leftW = m.leftW > 0 ? m.leftW : m.appW * 0.8;
      const dApp = (Math.abs(diff) / ratio) * (m.appW / leftW);
      let W = diff > 0 ? m.appW + dApp : m.appW - dApp;
      const cap = window.innerWidth - 100; // B 站原生 100vw-100px 上限
      W = Math.round(Math.max(980, Math.min(W, cap)));
      if (lastW !== null && Math.abs(W - lastW) <= 2) return; // 收敛，防振荡
      lastW = W;
      document.documentElement.style.setProperty('--bx-frame-w', W + 'px');
    }, 500);
  };

  const apply = () => {
    if (settings.get('frameGap', true)) start();
    else stop();
  };

  apply();
  settingsBus.on(apply);
}

// ================= 入口 =================

export function initEnhance() {
  // 进房 URL 参数（document-start 阶段改写，播放器初始化时即可读到）
  ensureUrlParam();

  // 上下等边距（独立于播放器初始化，进房即启用）
  runFrameGap();

  onPlayerReady(() => {
    runAutoWebFullscreen('init');
    runAutoQuality('init');
  });

  const checkRoom = watchRoomChange(() => {
    ensureUrlParam(); // SPA 换房时保持参数在 URL 上
    onPlayerReady(() => {
      runAutoWebFullscreen('room');
      runAutoQuality('room');
    });
  });
  setInterval(checkRoom, 1000);

  // 面板里手动开启时立即生效
  settingsBus.on(() => {
    if (settings.get('autoWebFullscreen', true)) runAutoWebFullscreen('toggle');
    if (settings.get('autoHighestQuality', false)) runAutoQuality('toggle');
  });

  // 调试入口：控制台执行 window.__BiliExDebugQuality() 立即重跑一次自动最高画质并打印诊断
  window.__BiliExDebugQuality = () => applyHighestQuality();
}
