import { injectCss } from '../../common/dom.js';
import { settings } from '../../common/settings.js';
import { FEATURES } from '../purify/index.js';
import { ENHANCE_FEATURES } from '../enhance/features.js';
import { PANEL_CSS } from './panel.css.js';

// 控制条图标：粉色圆底 + 白色 B，与 B 站播放器控制条原生图标风格统一
const ICON_SVG =
  '<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="12" cy="12" r="11" fill="#fb7299"/>' +
  '<text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff"' +
  ' font-family="-apple-system,\'PingFang SC\',sans-serif">B</text></svg>';

export function initPanel() {
  injectCss(PANEL_CSS);

  // ---------- 面板 ----------
  const panel = document.createElement('div');
  panel.id = 'bx-panel';

  const head = document.createElement('div');
  head.className = 'bx-panel-head';
  const title = document.createElement('span');
  title.textContent = 'BiliEx 设置';
  const close = document.createElement('span');
  close.className = 'bx-close';
  close.textContent = '✕';
  close.addEventListener('click', () => panel.classList.remove('bx-open'));
  head.append(title, close);

  const body = document.createElement('div');
  body.className = 'bx-panel-body';
  panel.append(head, body);

  const render = () => {
    body.innerHTML = '';

    // 开关（净化 + 增强，按分组渲染）
    const all = [...FEATURES, ...ENHANCE_FEATURES];
    const groups = [...new Set(all.map((f) => f.group))];
    for (const g of groups) {
      const gt = document.createElement('div');
      gt.className = 'bx-group-title';
      gt.textContent = g;
      body.appendChild(gt);
      for (const f of all.filter((x) => x.group === g)) {
        const item = document.createElement('label');
        item.className = 'bx-item';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = settings.get(f.key, f.defaultOn);
        cb.addEventListener('change', () => settings.set(f.key, cb.checked));
        const text = document.createElement('span');
        text.textContent = f.label;
        item.append(cb, text);
        body.appendChild(item);
      }
    }

    // 弹幕过滤
    const ft = document.createElement('div');
    ft.className = 'bx-group-title';
    ft.textContent = '弹幕过滤';
    body.appendChild(ft);

    const fItem = document.createElement('label');
    fItem.className = 'bx-item';
    const fCb = document.createElement('input');
    fCb.type = 'checkbox';
    const filterConf = settings.getFilter();
    fCb.checked = filterConf.enabled;
    fCb.addEventListener('change', () => settings.setFilter({ enabled: fCb.checked }));
    const fText = document.createElement('span');
    fText.textContent = '启用弹幕关键词过滤';
    fItem.append(fCb, fText);
    body.appendChild(fItem);

    // 关键词编辑：输入框 + 添加按钮 + 标签胶囊（点 × 删除），实时保存生效
    const row = document.createElement('div');
    row.className = 'bx-filter-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'bx-filter-input';
    input.placeholder = '输入关键词，按回车添加';
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'bx-filter-add';
    addBtn.textContent = '添加';
    row.append(input, addBtn);
    body.appendChild(row);

    const tags = document.createElement('div');
    tags.className = 'bx-filter-tags';
    body.appendChild(tags);

    const hint = document.createElement('div');
    hint.className = 'bx-hint';
    hint.textContent = '修改会实时自动保存并生效。';
    body.appendChild(hint);

    let keywords = filterConf.keywords
      .split(/\n|[,，;；、]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const persist = () => {
      settings.setFilter({ keywords: keywords.join('\n') });
    };

    const renderTags = () => {
      tags.innerHTML = '';
      if (!keywords.length) {
        const empty = document.createElement('div');
        empty.className = 'bx-filter-empty';
        empty.textContent = '暂无过滤词';
        tags.appendChild(empty);
        return;
      }
      keywords.forEach((w) => {
        const tag = document.createElement('span');
        tag.className = 'bx-filter-tag';
        const label = document.createElement('span');
        label.textContent = w;
        const close = document.createElement('span');
        close.className = 'bx-tag-close';
        close.textContent = '×';
        close.addEventListener('click', () => {
          keywords = keywords.filter((k) => k !== w);
          persist();
          renderTags();
        });
        tag.append(label, close);
        tags.appendChild(tag);
      });
    };

    const addKeyword = () => {
      const val = input.value.trim();
      if (!val) return;
      if (keywords.includes(val)) {
        input.classList.add('bx-dup');
        return;
      }
      input.classList.remove('bx-dup');
      keywords.push(val);
      persist();
      renderTags();
      input.value = '';
      input.focus();
    };

    addBtn.addEventListener('click', addKeyword);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addKeyword();
    });
    input.addEventListener('input', () => input.classList.remove('bx-dup'));

    renderTags();
  };

  const openPanel = () => {
    render();
    ensurePanelParent();
    panel.classList.add('bx-open');
    placePanel();
  };
  const togglePanel = () => {
    if (panel.classList.contains('bx-open')) panel.classList.remove('bx-open');
    else openPanel();
  };

  // 全屏时面板必须挂进 fullscreen 元素内才可见（网页全屏只是 CSS，无需处理）
  function ensurePanelParent() {
    const fsEl = document.fullscreenElement;
    if (fsEl && panel.parentElement !== fsEl) fsEl.appendChild(panel);
    else if (!fsEl && panel.parentElement !== document.body) document.body.appendChild(panel);
  }

  // ---------- B 图标 ----------
  // 注意：必须先创建、后挂载。此前挂载代码在声明前引用 ICON（const 暂死区），
  // Tampermonkey 偶发晚注入（body 已存在）时会抛 ReferenceError 导致整个面板模块失效。
  const ICON = document.createElement('div');
  ICON.id = 'bx-ctrl-item';
  ICON.title = 'BiliEx 设置';
  ICON.innerHTML = ICON_SVG;
  ICON.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    togglePanel();
  });

  // document-start 时 body 尚未解析，等 DOMContentLoaded 再挂
  const mount = () => {
    const root = document.body || document.documentElement;
    root.appendChild(panel);
    root.appendChild(ICON);
  };
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount, { once: true });

  // ---------- 定位：锚点级联 ----------
  // 1) #chat-control-panel-vm 弹幕发送面板右上角上方（普通布局）
  // 2) #aside-area-vm 聊天区右下角（发送面板被净化隐藏时回落）
  // 3) #fullscreen-danmaku-vm 全屏弹幕发送框上方（网页全屏态）
  // 4) 窗口右下角固定兜底（首页 / 真全屏 / 锚点全部失效），保证任何状态都有入口
  // 坐标一律用 getBoundingClientRect（视口坐标）+ position:fixed，页面滚动不漂移
  let lastKey = '';
  const setSpot = (left, top, tag) => {
    const key = tag + ':' + Math.round(left) + ',' + Math.round(top);
    if (key !== lastKey) {
      lastKey = key;
      console.log('[BiliEx] 图标定位(' + tag + ')=(', Math.round(left) + ',' + Math.round(top) + ')');
    }
    ICON.style.left = left + 'px';
    ICON.style.top = top + 'px';
  };

  // 元素有尺寸且在视口内才可作锚点，防止 B 站把聊天区移出屏外时图标跟着出屏
  const visibleRect = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) return r;
    return null;
  };

  function placeIcon() {
    // 真全屏时图标必须挂进 fullscreen 元素内才可见，与面板同规则
    const fsEl = document.fullscreenElement;
    const root = fsEl || document.body || document.documentElement;
    if (ICON.parentElement !== root) root.appendChild(ICON);

    const cp = document.getElementById('chat-control-panel-vm');
    const r1 = cp && visibleRect(cp);
    if (r1) return setSpot(r1.right - 40, r1.top - 32, '发送面板上方');

    const aside = document.getElementById('aside-area-vm');
    const r2 = aside && visibleRect(aside);
    if (r2) return setSpot(r2.right - 40, r2.bottom - 44, '聊天区右下角');

    const fd = document.getElementById('fullscreen-danmaku-vm');
    const r3 = fd && visibleRect(fd);
    if (r3) return setSpot(r3.right - 40, r3.top - 36, '全屏弹幕框上方');

    setSpot(window.innerWidth - 54, window.innerHeight - 130, '固定兜底');
  }

  // 面板跟随图标上方弹出
  function placePanel() {
    if (!panel.classList.contains('bx-open')) return;
    const r = ICON.getBoundingClientRect();
    if (r.width === 0) return;
    const ph = panel.offsetHeight || 400;
    const pw = 320;
    let left = r.left + r.width / 2 - pw / 2;
    let top = r.top - ph - 8;
    if (left < 8) left = 8;
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    if (top < 8) top = r.bottom + 8;
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }

  // 点击面板外部关闭（capture 阶段，比内部 click 更早触发）
  // 排除：面板本身（内部操作不关）、B 图标（走 togglePanel 切换）
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (!panel.classList.contains('bx-open')) return;
      if (panel.contains(e.target) || ICON.contains(e.target)) return;
      panel.classList.remove('bx-open');
    },
    true
  );

  // 轮询：聊天面板晚于脚本渲染，换房/进出全屏会重建；1s 间隔减少锚点暂失时的闪烁窗口
  const applyAll = () => { placeIcon(); placePanel(); };
  applyAll();
  setInterval(applyAll, 1000);
  // 窗口尺寸变化 / 进出全屏后坐标会变，重算
  window.addEventListener('resize', () => { placeIcon(); placePanel(); });
  document.addEventListener('fullscreenchange', () => setTimeout(applyAll, 100));

  // ---------- 油猴菜单快捷入口 ----------
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('打开 BiliEx 设置', openPanel);
  }
}
