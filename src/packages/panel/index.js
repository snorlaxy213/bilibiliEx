import { injectCss } from '../../common/dom.js';
import { settings, settingsBus } from '../../common/settings.js';
import { FEATURES } from '../purify/index.js';
import { ENHANCE_FEATURES } from '../enhance/features.js';
import { PANEL_CSS } from './panel.css.js';

// 控制条图标：粉色圆底 + 白色 B，与 B 站播放器控制条原生图标风格统一
const ICON_SVG =
  '<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">' +
  '<circle cx="12" cy="12" r="11" fill="#fb7299"/>' +
  '<text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="bold" fill="#fff"' +
  ' font-family="-apple-system,\'PingFang SC\',sans-serif">B</text></svg>';

// 左侧导航页签：key 对应内容区 data-key，icon 用内联 SVG 描边风格
const NAV_ICONS = {
  purify:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  player:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9l5 3-5 3z"/></svg>',
  chat:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/></svg>',
  quick:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
  filter:
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M7 12h10M10 19h4"/></svg>',
};

// 页签定义：id / 名称 / 图标 / 分组列表 / 可选底部提示。弹幕过滤单独一页。
// v0.3.20：「快速使用」置顶（极简模式 + 进房自动化），原「增强」页签移除
const TABS = [
  { id: 'quick', label: '快速使用', icon: 'quick', groups: ['快速使用'], hint: '一键获得净化与自动化体验，细节可在各分类页调整。' },
  { id: 'purify', label: '页面净化', icon: 'purify', groups: ['页面净化'] },
  { id: 'player', label: '播放器', icon: 'player', groups: ['播放器'] },
  { id: 'chat', label: '聊天区', icon: 'chat', groups: ['聊天区'] },
  { id: 'filter', label: '弹幕过滤', icon: 'filter', groups: [] },
];

// 极简模式 CSS 直接覆盖的单项：极简模式开启时这些项实际已生效（含播放器页的礼物栏）
const ZEN_KEY = 'zenMode';
const ZEN_COVERS = ['hideHeadInfoTags', 'hideSidebar', 'hideSections', 'hideFlipView', 'hideFooter', 'hideGiftBar'];

export function initPanel() {
  injectCss(PANEL_CSS);

  // ---------- 遮罩 ----------
  const overlay = document.createElement('div');
  overlay.id = 'bx-overlay';
  overlay.addEventListener('click', () => closePanel());

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
  close.addEventListener('click', () => closePanel());
  head.append(title, close);

  const main = document.createElement('div');
  main.className = 'bx-panel-main';

  const nav = document.createElement('div');
  nav.className = 'bx-nav';

  const contentWrap = document.createElement('div');
  contentWrap.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;';

  panel.append(head, main);
  main.append(nav, contentWrap);

  // 内容区容器（按页签预建）
  const contentEls = {};
  for (const t of TABS) {
    const el = document.createElement('div');
    el.className = 'bx-content';
    el.dataset.key = t.id;
    contentWrap.appendChild(el);
    contentEls[t.id] = el;
  }

  const navEls = {};
  const switchTab = (id) => {
    for (const t of TABS) {
      navEls[t.id].classList.toggle('bx-active', t.id === id);
      contentEls[t.id].classList.toggle('bx-active', t.id === id);
    }
  };

  // 构建导航
  for (const t of TABS) {
    const item = document.createElement('div');
    item.className = 'bx-nav-item';
    const ic = document.createElement('span');
    ic.className = 'bx-nav-ic';
    ic.innerHTML = NAV_ICONS[t.icon];
    const label = document.createElement('span');
    label.textContent = t.label;
    item.append(ic, label);
    item.addEventListener('click', () => switchTab(t.id));
    nav.appendChild(item);
    navEls[t.id] = item;
  }

  // ---------- 渲染开关组 ----------
  const allFeatures = [...FEATURES, ...ENHANCE_FEATURES];
  const renderFeatureGroup = (container, group) => {
    const gt = document.createElement('div');
    gt.className = 'bx-group-title';
    gt.textContent = group;
    container.appendChild(gt);

    const card = document.createElement('div');
    card.className = 'bx-card';

    const zenOn = settings.get(ZEN_KEY, false);
    for (const f of allFeatures.filter((x) => x.group === group)) {
      const locked = zenOn && ZEN_COVERS.includes(f.key);
      const on = locked ? true : settings.get(f.key, f.defaultOn);
      const item = buildToggleItem(f.key, f.label, f.desc, on, (v) => settings.set(f.key, v));
      if (locked) {
        item.classList.add('bx-locked');
        item.setAttribute('title', '由「极简模式」包含，当前已生效');
        // 点击即解锁：关闭极简模式，该项恢复自身存储状态，无需单独翻转
        item.addEventListener('click', () => settings.set(ZEN_KEY, false));
      }
      card.appendChild(item);
    }
    container.appendChild(card);

    const tab = TABS.find((t) => t.groups.includes(group));
    if (tab && tab.hint) {
      const h = document.createElement('div');
      h.className = 'bx-hint';
      h.textContent = tab.hint;
      container.appendChild(h);
    }
  };

  // ---------- 弹幕过滤页 ----------
  const renderFilterTab = (container) => {
    const gt = document.createElement('div');
    gt.className = 'bx-group-title';
    gt.textContent = '弹幕过滤';
    container.appendChild(gt);

    const card = document.createElement('div');
    card.className = 'bx-card';

    const filterConf = settings.getFilter();
    card.appendChild(
      buildToggleItem('filter-enabled', '启用弹幕关键词过滤', '匹配到关键词的弹幕将被隐藏', filterConf.enabled, (v) => settings.setFilter({ enabled: v }))
    );

    // 输入 + 添加按钮
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
    card.appendChild(row);

    const tags = document.createElement('div');
    tags.className = 'bx-filter-tags';
    card.appendChild(tags);

    const hint = document.createElement('div');
    hint.className = 'bx-hint';
    hint.textContent = '支持 /正则/ 形式，多个关键词可用逗号或换行分隔。修改会实时自动保存并生效。';
    card.appendChild(hint);

    container.appendChild(card);

    let keywords = filterConf.keywords
      .split(/\n|[,，;；、]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const persist = () => settings.setFilter({ keywords: keywords.join('\n') });

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
        const x = document.createElement('span');
        x.className = 'bx-tag-close';
        x.textContent = '×';
        x.addEventListener('click', () => {
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

  // ---------- 全部渲染 ----------
  // renderTabId：指定页签全量重绘；不传则重绘全部（打开面板时用）
  const render = (tabId) => {
    const targets = tabId ? TABS.filter((t) => t.id === tabId) : TABS;
    for (const t of targets) {
      const el = contentEls[t.id];
      el.innerHTML = '';
      if (t.id === 'filter') renderFilterTab(el);
      else for (const g of t.groups) renderFeatureGroup(el, g);
    }
  };

  // 面板打开时，功能开关变化驱动相关页签实时刷新（不碰弹幕过滤输入框）
  settingsBus.on((key) => {
    if (!panel.classList.contains('bx-open')) return;
    if (key === ZEN_KEY) {
      // 极简模式影响：快速使用页自身 + 页面净化页 + 播放器页（礼物栏）
      render('quick');
      render('purify');
      render('player');
    } else if (key === 'filter') {
      // 弹幕过滤变化由页内局部逻辑处理，这里不重绘
      return;
    } else {
      render('quick');
    }
  });

  // ---------- 开 / 关 ----------
  const openPanel = () => {
    render();
    ensurePanelParent();
    panel.classList.add('bx-open');
    overlay.classList.add('bx-open');
    switchTab(TABS[0].id);
  };
  const closePanel = () => {
    panel.classList.remove('bx-open');
    overlay.classList.remove('bx-open');
  };
  const togglePanel = () => {
    if (panel.classList.contains('bx-open')) closePanel();
    else openPanel();
  };

  // 全屏时面板/遮罩必须挂进 fullscreen 元素内才可见（网页全屏只是 CSS，无需处理）
  function ensurePanelParent() {
    const fsEl = document.fullscreenElement;
    const root = fsEl || document.body;
    if (overlay.parentElement !== root) root.appendChild(overlay);
    if (panel.parentElement !== root) root.appendChild(panel);
  }

  // ---------- B 图标 ----------
  const ICON = document.createElement('div');
  ICON.id = 'bx-ctrl-item';
  ICON.title = 'BiliEx 设置';
  ICON.innerHTML = ICON_SVG;
  ICON.addEventListener('click', (e) => {
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
  else document.addEventListener('DOMContentLoaded', mount, { once: true });

  // ---------- 图标定位：锚点级联 ----------
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

  const visibleRect = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) return r;
    return null;
  };

  function placeIcon() {
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

  // 点击面板外部关闭（capture 阶段）；遮罩自身已监听 click 关闭
  document.addEventListener(
    'pointerdown',
    (e) => {
      if (!panel.classList.contains('bx-open')) return;
      if (panel.contains(e.target) || ICON.contains(e.target)) return;
      closePanel();
    },
    true
  );

  // 轮询：聊天面板晚于脚本渲染，换房/进出全屏会重建
  const applyAll = () => placeIcon();
  applyAll();
  setInterval(applyAll, 1000);
  window.addEventListener('resize', applyAll);
  document.addEventListener('fullscreenchange', () => setTimeout(applyAll, 100));

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('打开 BiliEx 设置', openPanel);
  }
}

// 构建单个 toggle 设置项（标题 + 描述 + iOS 开关）；locked 时在标题旁加「极简模式」徽标
function buildToggleItem(key, label, desc, checked, onChange, locked) {
  const item = document.createElement('label');
  item.className = 'bx-item';

  const text = document.createElement('div');
  text.className = 'bx-item-text';
  const t = document.createElement('div');
  t.className = 'bx-item-title';
  const tl = document.createElement('span');
  tl.textContent = label;
  t.appendChild(tl);
  if (locked) {
    const badge = document.createElement('span');
    badge.className = 'bx-lock-badge';
    badge.textContent = '极简模式';
    t.appendChild(badge);
  }
  text.appendChild(t);
  if (desc) {
    const d = document.createElement('div');
    d.className = 'bx-item-desc';
    d.textContent = desc;
    text.appendChild(d);
  }

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = checked;
  cb.addEventListener('change', () => onChange(cb.checked));

  const sw = document.createElement('span');
  sw.className = 'bx-toggle';

  item.append(text, cb, sw);
  return item;
}
