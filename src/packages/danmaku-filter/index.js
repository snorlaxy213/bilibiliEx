import { settings, settingsBus } from '../../common/settings.js';

// 弹幕关键词过滤：MutationObserver 监听弹幕列表新增节点，命中即隐藏
// 关键词为纯字符串子串匹配（忽略大小写），无需正则
export function initDanmakuFilter() {
  let observer = null;
  let container = null;

  function getKeywords() {
    const { enabled, keywords } = settings.getFilter();
    if (!enabled) return null;
    const list = keywords
      .split(/\n|[,，;；、]/)
      .map((s) => s.trim())
      .filter(Boolean);
    return list.length ? list : null;
  }

  function hit(node, words) {
    const text = (node.textContent || '').toLowerCase();
    return words.some((w) => text.includes(w.toLowerCase()));
  }

  function processNode(n, words) {
    if (
      n.nodeType === 1 &&
      n.classList &&
      n.classList.contains('chat-item') &&
      hit(n, words)
    ) {
      n.style.display = 'none';
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
    // 兼容 id 变动：优先 id，回落到 class
    const el = document.getElementById('chat-items') ||
      document.querySelector('.chat-history-list');
    if (el && el !== container) attach(el);
  }

  ensure();
  setInterval(ensure, 2000); // 换房（SPA 路由）后自动重新挂载

  settingsBus.on(() => {
    ensure();
    // 关键词改动后立即对当前已有弹幕重新过滤，无需刷新页面
    const words = getKeywords();
    const el = container;
    if (!words || !el) return;
    el.querySelectorAll('.chat-item').forEach((n) => {
      if (n.style.display !== 'none') processNode(n, words);
    });
  });
}
