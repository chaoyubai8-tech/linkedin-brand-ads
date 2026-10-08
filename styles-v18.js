(() => {
  'use strict';
  const STYLES = { gallery: '明亮作品集', bold: '品牌大字', cinematic: '电影感场景', technical: '技术流程' };
  const GROUPS = { 'teams-us': 'Teams · 美国游戏', 'teams-eu': 'Teams · 欧洲游戏', 'api-us': 'API · 美国游戏＋3D资产', 'api-eu': 'API · 欧洲企业内容' };
  const state = { data: null, style: 'all', group: 'all', view: 'gallery', selected: null, device: 'desktop', loading: false, copyTimer: null };
  const $ = (id) => document.getElementById(id);
  const str = (value) => typeof value === 'string' ? value : '';
  const el = (tag, content, className) => { const node = document.createElement(tag); if (content !== undefined && content !== null) node.textContent = content; if (className) node.className = className; return node; };
  const groupLabel = (group) => GROUPS[group] || group;
  function imageUrl(value) {
    if (typeof value !== 'string' || !value.startsWith('assets/v18/') || value.includes('\\')) return null;
    try { const url = new URL(value, document.baseURI); const root = new URL('assets/v18/', document.baseURI); return url.origin === root.origin && url.pathname.startsWith(root.pathname) && /\.png$/i.test(url.pathname) ? url.href : null; } catch { return null; }
  }
  function domain(value) { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.hostname : '目标页面待确认'; } catch { return '目标页面待确认'; } }
  function normalize(data) {
    if (!data || !Array.isArray(data.ads)) throw new Error('资料格式不完整，需要 ads 数组。');
    const seen = new Set();
    const ads = data.ads.map((ad) => {
      if (!ad || !/^[a-z0-9][a-z0-9_-]*$/i.test(ad.id || '') || seen.has(ad.id.toLowerCase()) || !STYLES[ad.style] || !str(ad.group) || ad.group === 'all') throw new Error('方案标识、人群或风格字段无效，请修正资料后重试。');
      seen.add(ad.id.toLowerCase());
      return { ...ad, title: str(ad.title) || ad.id };
    });
    return { ...data, ads };
  }
  function filtered() { return state.data.ads.filter((ad) => (state.style === 'all' || ad.style === state.style) && (state.group === 'all' || ad.group === state.group)); }
  function announce(message) { clearTimeout(state.copyTimer); $('v18-copy-result').textContent = message; state.copyTimer = setTimeout(() => { $('v18-copy-result').textContent = ''; }, 5500); }
  function copyButton(value, label, caption = '复制') {
    const button = el('button', caption); button.type = 'button'; button.disabled = !value.trim(); button.setAttribute('aria-label', `复制${label}`);
    button.addEventListener('click', async () => { button.disabled = true; try { if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(value); announce(`已复制${label}。未投放、未发送。`); } catch { announce('浏览器未允许复制。请直接选中下方英文文案，手动复制。'); } finally { button.disabled = false; } });
    return button;
  }
  function fullCopy(ad) { return [str(ad.primary), str(ad.headline), str(ad.cta)].filter(Boolean).join('\n\n'); }
  function downloadLink(ad, caption = '下载 PNG') { const url = imageUrl(ad.image); if (!url) return null; const link = el('a', caption); link.href = url; link.download = `${ad.id}.png`; return link; }
  function mountImage(ad, container, onLoad) {
    const url = imageUrl(ad.image);
    const error = () => { container.replaceChildren(el('span', '图片暂未加载。请稍后重试；本站不会用其他图片代替。', 'v18-image-error')); };
    if (!url) { container.append(el('span', '图片待交付。文案与策略可先审阅。', 'v18-image-error')); return; }
    const image = el('img'); image.width = 1200; image.height = 1200; image.alt = `${ad.id} · ${ad.title} · ${STYLES[ad.style]}，AI 概念静态广告稿`; image.decoding = 'async';
    image.addEventListener('load', () => { if (onLoad) onLoad(image); }, { once: true }); image.addEventListener('error', error, { once: true }); image.src = url; container.append(image);
  }
  function hashFor(value) { history.replaceState(null, '', `${location.pathname}${location.search}#${encodeURIComponent(value)}`); }
  function openAd(id, updateHash = true, focus = false) {
    state.selected = id; state.view = 'feed'; renderView(); if (updateHash) hashFor(id);
    if (focus) { $('v18-single').scrollIntoView({ block: 'start', behavior: 'auto' }); $('v18-ad-select').focus({ preventScroll: true }); }
  }
  function renderGallery(ads) {
    const gallery = $('v18-gallery'); gallery.replaceChildren();
    ads.forEach((ad) => {
      const article = el('article', null, 'v18-card');
      const button = el('button', null, 'v18-card-button'); button.type = 'button'; button.dataset.ad = ad.id; button.setAttribute('aria-label', `${ad.id} ${ad.title}，查看图文预览`); button.setAttribute('aria-current', String(ad.id === state.selected));
      const image = el('span', null, 'v18-card-image'); const footer = el('div', null, 'v18-card-footer');
      mountImage(ad, image, () => { const link = downloadLink(ad); if (link) footer.prepend(link); });
      button.append(image, el('span', `${ad.id} · ${STYLES[ad.style]}`, 'v18-card-meta'), el('span', ad.title, 'v18-card-title'), el('span', groupLabel(ad.group), 'v18-card-group'));
      button.addEventListener('click', () => openAd(ad.id, true, true));
      footer.append(el('span', '点图查看信息流 →')); article.append(button, footer); gallery.append(article);
    });
  }
  function copyField(label, value) {
    const section = el('section', null, 'v18-copy-field'); const heading = el('div', null, 'v18-copy-field-top'); heading.append(el('h3', label), copyButton(value, label));
    const content = el('p', value || '文案待补充', 'v18-copy-field-value'); content.lang = 'en'; section.append(heading, content); return section;
  }
  function renderFeed(ad) {
    const feed = $('v18-feed'); feed.replaceChildren(); const detail = $('v18-detail'); detail.replaceChildren();
    if (!ad) return;
    const header = el('div', null, 'v18-feed-header'); const brand = el('div'); brand.append(el('strong', 'Tripo'), el('p', 'Promoted · Concept preview')); const menu = el('span', '···', 'v18-feed-menu'); menu.setAttribute('aria-hidden', 'true'); header.append(brand, menu);
    const primary = el('p', str(ad.primary) || 'Primary text pending', 'v18-feed-primary'); primary.lang = 'en';
    const image = el('div', null, 'v18-feed-image');
    const linkbox = el('div', null, 'v18-feed-linkbox'); const text = el('div'); const headline = el('h3', str(ad.headline) || ad.title); headline.lang = 'en'; text.append(headline, el('p', domain(ad.destinationUrl))); const cta = el('span', str(ad.cta) || 'CTA pending', 'v18-feed-cta'); cta.lang = 'en'; linkbox.append(text, cta);
    const footer = el('div', null, 'v18-feed-footer'); footer.setAttribute('aria-label', '仅为布局示意，无社交操作'); ['Like', 'Comment', 'Repost', 'Send'].forEach((label) => footer.append(el('span', label)));
    feed.append(header, primary, image, linkbox, footer);
    const top = el('header', null, 'v18-detail-top'); top.append(el('p', `${ad.id} · ${STYLES[ad.style]}`), el('h2', ad.title), el('p', groupLabel(ad.group), 'v18-fine'));
    const actions = el('div', null, 'v18-detail-actions'); actions.append(copyButton(fullCopy(ad), '完整图文文案', '复制完整文案'));
    mountImage(ad, image, (img) => { const link = downloadLink(ad); if (link) actions.append(link); const original = el('a', '打开原图 ↗'); original.href = imageUrl(ad.image); original.target = '_blank'; original.rel = 'noopener'; actions.append(original); if (img.naturalWidth !== 1200 || img.naturalHeight !== 1200) announce(`当前原图为 ${img.naturalWidth} × ${img.naturalHeight}，请检查交付规格。`); });
    top.append(actions); detail.append(top, copyField('Primary text', str(ad.primary)), copyField('Headline', str(ad.headline)), copyField('CTA', str(ad.cta)));
    detail.append(el('p', 'Feed 中的 CTA 仅为标签，不会打开目标页或提交表单。', 'v18-fine'));
    const strategy = el('section', null, 'v18-strategy'); strategy.append(el('h3', '人群、表达与证据')); const dl = el('dl');
    [['audience', '目标人群'], ['angle', '表达重点'], ['visual', '视觉选择'], ['evidenceNote', '证据边界']].forEach(([key, label]) => { dl.append(el('dt', label), el('dd', str(ad[key]) || '待补充；不从视觉完成度推断真实效果。')); }); strategy.append(dl); detail.append(strategy);
    renderDevice();
  }
  function updateWidthLabel() { const ad = state.data?.ads.find((item) => item.id === state.selected); if (!ad) return; const width = Math.round($('v18-feed-wrap').getBoundingClientRect().width); $('v18-preview-label').textContent = `${ad.id} · LinkedIn 信息流布局示意 · ${state.device === 'mobile' ? `360px 手机模式${width && width < 360 ? `（当前可用 ${width}px）` : ''}` : '桌面模式'} · 未投放`; }
  function renderDevice() { $('v18-feed-wrap').dataset.device = state.device; document.querySelectorAll('button[data-device]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.device === state.device))); updateWidthLabel(); }
  function renderView() {
    const ads = filtered(); const empty = !ads.length; const feedView = state.view === 'feed' && !empty;
    $('v18-gallery').hidden = empty || feedView; $('v18-single').hidden = !feedView; $('v18-empty').hidden = !empty;
    document.querySelectorAll('[data-view]').forEach((button) => { button.setAttribute('aria-pressed', String(button.dataset.view === state.view)); button.disabled = empty && button.dataset.view === 'feed'; });
    if (feedView) { const ad = ads.find((item) => item.id === state.selected) || ads[0]; state.selected = ad.id; const select = $('v18-ad-select'); select.replaceChildren(); ads.forEach((item) => select.append(new Option(`${item.id} · ${item.title}`, item.id))); select.value = ad.id; renderFeed(ad); }
    document.querySelectorAll('.v18-card-button').forEach((button) => button.setAttribute('aria-current', String(button.dataset.ad === state.selected)));
  }
  function render() {
    const ads = filtered();
    if (!ads.some((ad) => ad.id === state.selected)) state.selected = ads[0]?.id || null;
    $('v18-panel').setAttribute('aria-labelledby', `style-${state.style}`);
    document.querySelectorAll('[data-style]').forEach((button) => { const active = button.dataset.style === state.style; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
    $('v18-results').textContent = `当前 ${ads.length} / ${state.data.ads.length} 张 · ${state.style === 'all' ? '全部风格' : STYLES[state.style]} · ${state.group === 'all' ? '全部人群' : groupLabel(state.group)}。点击图片进入完整信息流预览。`;
    $('v18-reset').disabled = state.style === 'all' && state.group === 'all';
    renderGallery(ads); renderView();
  }
  function reset() { state.style = 'all'; state.group = 'all'; state.view = 'gallery'; $('v18-group').value = 'all'; render(); hashFor('all'); }
  function applyHash() {
    if (!state.data) return false;
    let value; try { value = decodeURIComponent(location.hash.slice(1)); } catch { return false; }
    const ad = state.data.ads.find((item) => item.id.toLowerCase() === value.toLowerCase());
    if (ad) { state.style = 'all'; state.group = 'all'; $('v18-group').value = 'all'; state.selected = ad.id; state.view = 'feed'; render(); return true; }
    if (value === 'all' || STYLES[value]) { state.style = value; state.group = 'all'; state.view = 'gallery'; $('v18-group').value = 'all'; render(); return true; }
    return false;
  }
  async function load() {
    if (state.loading) return; state.loading = true;
    $('v18-review').setAttribute('aria-busy', 'true'); $('v18-loading').hidden = false; $('v18-error').hidden = true; $('v18-app').hidden = true;
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('styles-v18-data.json', { cache: 'no-cache', signal: controller.signal }); if (!response.ok) throw new Error(`资料请求返回 HTTP ${response.status}。`);
      state.data = normalize(await response.json());
      const group = $('v18-group'); group.replaceChildren(new Option('全部人群', 'all')); [...new Set(state.data.ads.map((ad) => ad.group))].forEach((value) => group.append(new Option(groupLabel(value), value)));
      document.querySelectorAll('[data-count]').forEach((node) => { node.textContent = state.data.ads.filter((ad) => node.dataset.count === 'all' || ad.style === node.dataset.count).length; });
      $('v18-version').textContent = `V18${str(state.data.updatedAt) ? ` · 更新 ${state.data.updatedAt}` : ''} · 静态创意审稿。V17 图文＋站内信与 V8 历史站内信保持独立入口，未被本轮覆盖。`;
      $('v18-app').hidden = false; if (!applyHash()) render();
    } catch (error) { $('v18-error-text').textContent = `${error.name === 'AbortError' ? '加载超时。' : error instanceof SyntaxError ? 'JSON 资料无法解析。' : str(error.message)} 请重试或先查看历史版本；缺资料时不会显示虚构广告。`; $('v18-error').hidden = false; }
    finally { clearTimeout(timeout); state.loading = false; $('v18-loading').hidden = true; $('v18-review').setAttribute('aria-busy', 'false'); }
  }
  document.querySelectorAll('[data-style]').forEach((button) => {
    button.addEventListener('click', () => { if (!state.data) return; state.style = button.dataset.style; state.view = 'gallery'; render(); hashFor(state.style); });
    button.addEventListener('keydown', (event) => { const tabs = [...document.querySelectorAll('[data-style]')]; const index = tabs.indexOf(button); let target; if (event.key === 'ArrowRight') target = (index + 1) % tabs.length; if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length; if (event.key === 'Home') target = 0; if (event.key === 'End') target = tabs.length - 1; if (target !== undefined) { event.preventDefault(); tabs[target].focus(); tabs[target].click(); } });
  });
  $('v18-group').addEventListener('change', (event) => { state.group = event.target.value; state.view = 'gallery'; render(); hashFor(state.style); });
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => { state.view = button.dataset.view; renderView(); if (state.view === 'feed' && state.selected) hashFor(state.selected); else hashFor(state.style); }));
  document.querySelectorAll('button[data-device]').forEach((button) => button.addEventListener('click', () => { state.device = button.dataset.device; renderDevice(); }));
  $('v18-ad-select').addEventListener('change', (event) => openAd(event.target.value));
  $('v18-back-gallery').addEventListener('click', () => { state.view = 'gallery'; renderView(); hashFor(state.style); const choice = [...document.querySelectorAll('.v18-card-button')].find((button) => button.dataset.ad === state.selected); if (choice) { choice.setAttribute('aria-current', 'true'); choice.focus({ preventScroll: true }); choice.scrollIntoView({ block: 'nearest', behavior: 'auto' }); } });
  $('v18-reset').addEventListener('click', reset); $('v18-empty-reset').addEventListener('click', reset); $('v18-retry').addEventListener('click', load); window.addEventListener('hashchange', applyHash);
  if ('ResizeObserver' in window) new ResizeObserver(updateWidthLabel).observe($('v18-feed-wrap'));
  load();
})();
