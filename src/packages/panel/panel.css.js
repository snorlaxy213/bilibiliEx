export const PANEL_CSS = `
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
