export const PANEL_CSS = `
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
