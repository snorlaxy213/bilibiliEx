import { initPurify } from './packages/purify/index.js';
import { initPanel } from './packages/panel/index.js';
import { initDanmakuFilter } from './packages/danmaku-filter/index.js';
import { initEnhance } from './packages/enhance/index.js';

initPurify();
initDanmakuFilter();
initEnhance();
initPanel();
