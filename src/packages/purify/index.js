import { injectCss, setAttr } from '../../common/dom.js';
import { settings, settingsBus } from '../../common/settings.js';
import { FEATURES } from './features.js';

export function initPurify() {
  // 一次性注入全部 CSS，规则都带 html[bx-<key>] 前缀：不生效 = 属性不存在，天然支持开关
  injectCss(FEATURES.map((f) => f.css).join('\n'));

  const apply = () => {
    for (const f of FEATURES) {
      setAttr('bx-' + f.key, settings.get(f.key, f.defaultOn));
    }
  };

  apply();
  settingsBus.on(apply);
}

export { FEATURES };
