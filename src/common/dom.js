// DOM 辅助：在 document-start 阶段尽早注入样式（此时 head 可能还不存在，挂到 documentElement 上即可生效）
export function injectCss(css) {
  const style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  return style;
}

export function setAttr(name, on) {
  const root = document.documentElement;
  if (on) root.setAttribute(name, '');
  else root.removeAttribute(name);
}
