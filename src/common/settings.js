// 设置持久化：GM_setValue / GM_getValue，集中存储 + 变更广播
const STORE_KEY = 'bx_settings_v1';

const DEFAULTS = {
  features: {}, // featureKey -> bool（未设置时用 feature 定义的 defaultOn）
  filter: {
    enabled: true,
    keywords: '', // 每行一个，支持 逗号/中文逗号 分隔；/xxx/ 形式按正则处理
  },
};

const listeners = [];

function load() {
  try {
    const raw = GM_getValue(STORE_KEY, '{}');
    const saved = JSON.parse(raw || '{}');
    return {
      features: { ...saved.features },
      filter: { ...DEFAULTS.filter, ...(saved.filter || {}) },
    };
  } catch {
    return { features: {}, filter: { ...DEFAULTS.filter } };
  }
}

let cache = load();

function save() {
  GM_setValue(STORE_KEY, JSON.stringify(cache));
}

export const settingsBus = {
  on(cb) {
    listeners.push(cb);
  },
  emit() {
    listeners.forEach((cb) => cb());
  },
};

export const settings = {
  get(key, fallback = false) {
    return cache.features[key] ?? fallback;
  },
  set(key, val) {
    cache.features[key] = val;
    save();
    settingsBus.emit();
  },
  getFilter() {
    return { ...cache.filter };
  },
  setFilter(patch) {
    cache.filter = { ...cache.filter, ...patch };
    save();
    settingsBus.emit();
  },
};
