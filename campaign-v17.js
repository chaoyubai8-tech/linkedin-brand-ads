(() => {
  'use strict';
  const DATA_URL = 'campaign-v17-data.json?v=20261009-layout20-all';
  const LANES = {
    main: { label: '主方向', description: '按产品、地区与受众分别建立价值主张。图文与站内信属于同一方向，但分别审阅。' },
    retargeting: { label: '再营销', description: '沿用美国游戏工作流与欧洲游戏项目方向。需核对真实已曝光素材及受众来源，不能把概念稿当成已投放记录。' }
  };
  const STATUS = { planned: '规划中', 'needs-evidence': '待补证据', 'review-ready': '可审稿' };
  const EVIDENCE = { confirmed: '来源已核对', illustrative: '示意 / 非实测', pending: '待核验' };
  const state = { data: null, lane: 'main', group: 'all', status: 'all', selected: null, loading: false, copyTimer: null };
  const $ = (id) => document.getElementById(id);
  const text = (value) => typeof value === 'string' ? value : '';
  const list = (value) => Array.isArray(value) ? value : [];
  function element(tag, content, className) {
    const node = document.createElement(tag);
    if (content !== undefined && content !== null) node.textContent = String(content);
    if (className) node.className = className;
    return node;
  }
  function safeAsset(value, pngOnly = false) {
    if (typeof value !== 'string' || !value.startsWith('assets/') || value.includes('\\')) return null;
    try {
      const url = new URL(value, document.baseURI);
      const root = new URL('assets/', document.baseURI);
      if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return null;
      const format = pngOnly ? /\.png$/i : /\.(png|jpe?g|webp|svg)$/i;
      return format.test(url.pathname) ? url.href : null;
    } catch { return null; }
  }
  function safeSource(value) {
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
  }
  function normalize(data) {
    if (!data || typeof data !== 'object' || !Array.isArray(data.ads) || !Array.isArray(data.groups)) throw new Error('资料格式不完整，需要 groups 与 ads 数组。');
    const ids = new Set();
    const groups = data.groups.map((g) => ({ ...g, id: text(g.id), label: text(g.label) })).filter((g) => g.id && g.id !== 'all' && g.label);
    const groupIds = new Set(groups.map((g) => g.id));
    if (groups.length !== groupIds.size) throw new Error('资料包含重复的人群标识，请修正后重试。');
    const ads = data.ads.map((ad) => {
      if (!ad || typeof ad !== 'object' || !/^[a-z0-9][a-z0-9_-]*$/i.test(ad.id || '') || ids.has(ad.id.toLowerCase()) || !LANES[ad.lane]) throw new Error('方案标识重复、无效，或活动类型缺失。');
      ids.add(ad.id.toLowerCase());
      const assigned = list(ad.groupIds).filter((id) => groupIds.has(id));
      if (!assigned.length) throw new Error(`${ad.id} 尚未关联有效人群。`);
      return { ...ad, groupIds: assigned, status: STATUS[ad.status] ? ad.status : 'needs-evidence', artwork: ad.artwork || {}, feed: ad.feed || {}, message: ad.message || {}, strategy: ad.strategy || {}, evidence: ad.evidence || {} };
    });
    return { ...data, groups, ads };
  }
  function groupLabel(ad) { return ad.groupIds.map((id) => state.data.groups.find((g) => g.id === id)?.label || id).join(' / '); }
  function badge(status) { const node = element('span', STATUS[status], 'campaign-status-badge'); node.dataset.status = status; return node; }
  function announce(message) {
    clearTimeout(state.copyTimer);
    $('campaign-copy-result').textContent = message;
    state.copyTimer = setTimeout(() => { $('campaign-copy-result').textContent = ''; }, 5500);
  }
  async function copy(content, label, button) {
    if (!content.trim()) return;
    button.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(content);
      announce(`已复制${label}。仅复制，未发送。`);
    } catch { announce('浏览器未允许复制。请直接选中下方文案，手动复制。'); }
    finally { button.disabled = false; }
  }
  function copyButton(content, label, buttonText = '复制') {
    const button = element('button', buttonText);
    button.type = 'button';
    button.setAttribute('aria-label', `复制${label}`);
    button.disabled = !content.trim();
    button.addEventListener('click', () => copy(content, label, button));
    return button;
  }
  function messageCtas(ad) { return list(ad.message.ctas).filter((cta) => cta && typeof cta === 'object'); }
  function ctaText(ad) { return messageCtas(ad).map((cta) => text(cta.label)).filter(Boolean).join('\n'); }
  function fullMessage(ad) {
    return [`Subject: ${text(ad.message.subject)}`, text(ad.message.body), `CTA:\n${ctaText(ad)}`].join('\n\n');
  }
  function fullFeed(ad) { return [text(ad.feed.intro), text(ad.feed.headline), text(ad.feed.description), text(ad.feed.cta)].filter(Boolean).join('\n\n'); }
  function titleRow(title, button) { const row = element('div', null, 'campaign-copy-heading'); row.append(element('h3', title)); if (button) row.append(button); return row; }
  function renderArtwork(ad) {
    const figure = element('figure', null, 'campaign-artwork');
    const stage = element('div', null, 'campaign-image-stage');
    const caption = element('figcaption', text(ad.artwork.label) || '素材性质待补充；不得据此推断真实模型结果。');
    const links = element('div', null, 'campaign-artwork-links');
    const src = safeAsset(ad.artwork.src);
    const fallback = (failed = false) => {
      stage.replaceChildren();
      const info = element('div', null, 'campaign-image-unavailable');
      info.append(element('h3', failed ? '原图暂未加载' : '素材待交付'));
      info.append(element('p', failed ? '当前图片不可用。请稍后重试；这不改变下方文案和证据状态。' : '这里保留原图位置。完成素材与证据核对前，不放假图或不对应的效果图。'));
      stage.append(info);
      links.replaceChildren();
    };
    if (src) {
      const img = element('img');
      img.alt = text(ad.artwork.alt) || `${ad.id} 广告审稿原图`;
      img.decoding = 'async';
      if (Number.isInteger(ad.artwork.width) && ad.artwork.width > 0) img.width = ad.artwork.width;
      if (Number.isInteger(ad.artwork.height) && ad.artwork.height > 0) img.height = ad.artwork.height;
      img.addEventListener('error', () => fallback(true), { once: true });
      img.addEventListener('load', () => {
        links.replaceChildren();
        const open = element('a', '打开原比例图片 ↗'); open.href = src; open.target = '_blank'; open.rel = 'noopener'; links.append(open);
        const download = safeAsset(ad.artwork.download || ad.artwork.src, true);
        if (download) { const link = element('a', '下载 PNG'); link.href = download; link.download = `${ad.id}.png`; links.append(link); }
      }, { once: true });
      img.src = src;
      stage.append(img);
    } else fallback();
    figure.append(stage, caption, links);
    return figure;
  }
  function renderFeed(ad) {
    const section = element('section', null, 'campaign-feed');
    section.setAttribute('aria-label', '英文图文文案');
    section.append(titleRow('英文图文文案', copyButton(fullFeed(ad), '图文文案', '复制图文文案')));
    const dl = element('dl', null, 'campaign-feed-fields');
    const fields = [['Primary text', ad.feed.intro, ''], ['Headline', ad.feed.headline, 'campaign-feed-headline'], ['Description', ad.feed.description, '']];
    fields.forEach(([label, value, className]) => {
      if (!text(value) && label === 'Description') return;
      const dd = element('dd', text(value) || '文案待补充', className); dd.lang = 'en';
      dl.append(element('dt', label), dd);
    });
    const cta = element('dd');
    const ctaLabel = element('span', text(ad.feed.cta) || 'CTA 待确认', 'campaign-preview-cta'); ctaLabel.lang = 'en'; cta.append(ctaLabel);
    cta.append(element('p', '按钮文案示意 · 不导航、不发送', 'campaign-field-note'));
    dl.append(element('dt', 'CTA'), cta);
    if (text(ad.feed.destinationLabel) || text(ad.feed.destinationUrl)) {
      const route = element('dd', text(ad.feed.destinationLabel) || text(ad.feed.destinationUrl));
      route.className = 'campaign-route';
      dl.append(element('dt', '承接意图'), route);
    }
    section.append(dl);
    return section;
  }
  function copyField(label, content, lang = 'en') {
    const field = element('div', null, 'campaign-copy-field');
    const row = element('div', null, 'campaign-field-heading');
    row.append(element('h4', label), copyButton(content, label));
    const body = element('p', content || '文案待补充', 'campaign-field-value'); body.lang = lang;
    field.append(row, body);
    return field;
  }
  function renderMessage(ad) {
    const section = element('section', null, 'campaign-message');
    section.setAttribute('aria-label', '站内信文案');
    section.append(titleRow('配套站内信', copyButton(fullMessage(ad), '完整站内信文案', '复制整条')));
    const format = ad.message.type === 'conversation' ? 'Conversation Ads 文案' : ad.message.type === 'message' ? 'Message Ads 文案' : '站内信文案';
    section.append(element('p', `${format} · 审稿版本，未配置发件人、表单或发送动作。`));
    section.append(copyField('Subject', text(ad.message.subject)), copyField('Body', text(ad.message.body)));
    const field = element('div', null, 'campaign-copy-field');
    const row = element('div', null, 'campaign-field-heading'); row.append(element('h4', 'CTA'), copyButton(ctaText(ad), 'CTA 文案'));
    const ul = element('ul', null, 'campaign-message-cta-list');
    messageCtas(ad).forEach((cta) => {
      const li = element('li');
      const label = element('span', text(cta.label) || 'CTA 待确认', 'campaign-preview-cta'); label.lang = 'en';
      li.append(label);
      if (text(cta.destination)) li.append(element('span', `承接意图：${cta.destination}`, 'campaign-route'));
      ul.append(li);
    });
    if (!ul.children.length) ul.append(element('li', 'CTA 待补充'));
    field.append(row, ul, element('p', '以上为文案标签，不是发送或跳转按钮。', 'campaign-field-note'));
    section.append(field);
    if (ad.message.banner && typeof ad.message.banner === 'object') section.append(renderBanner(ad));
    return section;
  }
  function renderBanner(ad) {
    const banner = ad.message.banner;
    const figure = element('figure', null, 'campaign-message-banner');
    figure.append(element('figcaption', '可选桌面配图 · 300 × 250（手机不显示）'));
    const preview = element('div', null, 'campaign-banner-preview');
    const links = element('div', null, 'campaign-artwork-links');
    const note = element('p', '此图仅用于 LinkedIn 桌面侧栏；站内信正文必须独立讲清卖点。手机审稿可通过下方链接打开原图。', 'campaign-field-note');
    const src = safeAsset(banner.src);
    if (src) {
      const image = element('img'); image.width = 300; image.height = 250;
      image.alt = text(banner.alt) || `${ad.id} 站内信可选桌面配图`;
      image.decoding = 'async';
      image.addEventListener('load', () => {
        const open = element('a', '打开配图原图 ↗'); open.href = src; open.target = '_blank'; open.rel = 'noopener'; links.append(open);
        const download = safeAsset(banner.download || banner.src, true);
        if (download) { const link = element('a', '下载配图 PNG'); link.href = download; link.download = `${ad.id}-message-banner.png`; links.append(link); }
        if (image.naturalWidth !== 300 || image.naturalHeight !== 250) note.textContent = `当前原图为 ${image.naturalWidth} × ${image.naturalHeight}，不是 300 × 250。请先核对配图规格；本站保持原比例，不拉伸补齐。`;
      }, { once: true });
      image.addEventListener('error', () => { preview.replaceChildren(element('p', '配图暂未加载。请稍后重试。', 'campaign-field-note')); links.replaceChildren(); }, { once: true });
      image.src = src; preview.append(image);
    } else preview.append(element('p', '桌面配图待交付。', 'campaign-field-note'));
    figure.append(preview, links, note);
    return figure;
  }
  function renderStrategy(ad) {
    const section = element('section', null, 'campaign-context');
    section.append(titleRow('中文策略与证据'));
    const dl = element('dl', null, 'campaign-strategy');
    [['audience', '目标人群'], ['angle', '表达重点'], ['visual', '视觉选择'], ['test', '待验证点']].forEach(([key, label]) => {
      if (!text(ad.strategy[key])) return;
      dl.append(element('dt', label), element('dd', ad.strategy[key]));
    });
    if (!dl.children.length) dl.append(element('dt', '策略'), element('dd', '策略说明待补充。'));
    section.append(dl);
    const evidence = element('section', null, 'campaign-evidence');
    evidence.append(element('h3', '证据状态'));
    evidence.append(element('p', text(ad.evidence.summary) || '证据说明待补充；不得仅凭视觉完成度判断可投放。'));
    const ul = element('ul', null, 'campaign-evidence-list');
    list(ad.evidence.items).filter(Boolean).forEach((item) => {
      const li = element('li'); const row = element('div', null, 'campaign-evidence-title');
      row.append(element('strong', text(item.label) || '证据项目'), element('span', EVIDENCE[item.status] || EVIDENCE.pending));
      li.append(row);
      if (text(item.detail)) li.append(element('p', item.detail));
      const url = safeSource(item.url);
      if (url) { const link = element('a', '查看来源 ↗'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; li.append(link); }
      ul.append(li);
    });
    if (ul.children.length) evidence.append(ul);
    const limitations = [...list(ad.evidence.limitations), ...list(ad.notes)].filter((value) => typeof value === 'string' && value.trim());
    if (limitations.length) {
      evidence.append(element('h4', '审稿边界 / 上线前待办'));
      const limits = element('ul', null, 'campaign-limitations'); limitations.forEach((value) => limits.append(element('li', value))); evidence.append(limits);
    }
    evidence.append(element('p', '证据状态说明：来源已核对 ≠ 本次实测；示意 ≠ 真实输出；可审稿 ≠ 已投放。', 'campaign-field-note'));
    section.append(evidence);
    return section;
  }
  function renderDetail(ad) {
    const detail = $('campaign-detail'); detail.replaceChildren();
    if (!ad) return;
    const header = element('header', null, 'campaign-detail-header');
    const meta = element('div', null, 'campaign-detail-meta'); meta.append(element('span', `${ad.id} · ${LANES[ad.lane].label}`), badge(ad.status));
    const title = element('h2', text(ad.title) || ad.id); title.id = 'selected-title';
    header.append(meta, title, element('p', groupLabel(ad)));
    const creative = element('div', null, 'campaign-creative'); creative.append(renderArtwork(ad), renderFeed(ad));
    const bottom = element('div', null, 'campaign-review-bottom'); bottom.append(renderMessage(ad), renderStrategy(ad));
    detail.append(header, creative, bottom);
  }
  function visibleAds() {
    return state.data.ads.filter((ad) => ad.lane === state.lane && (state.group === 'all' || ad.groupIds.includes(state.group)) && (state.status === 'all' || ad.status === state.status));
  }
  function selectAd(id, updateHash = true) {
    state.selected = id;
    const ad = state.data.ads.find((item) => item.id === id);
    for (const button of document.querySelectorAll('.campaign-choice')) button.setAttribute('aria-current', String(button.dataset.ad === id));
    renderDetail(ad);
    if (updateHash && ad) history.replaceState(null, '', `${location.pathname}${location.search}#${encodeURIComponent(ad.id)}`);
  }
  function renderList() {
    const ads = visibleAds();
    const laneAds = state.data.ads.filter((ad) => ad.lane === state.lane);
    $('campaign-results').textContent = `当前显示 ${ads.length} / ${laneAds.length} 套${LANES[state.lane].label}方案。每套包含图文与站内信。`;
    $('campaign-lane-description').textContent = LANES[state.lane].description;
    $('campaign-lane-stats').textContent = `此方向共 ${laneAds.length} 套 · ${Object.entries(STATUS).map(([key, label]) => `${label} ${laneAds.filter((ad) => ad.status === key).length}`).join(' · ')}（未投放）`;
    $('campaign-panel').setAttribute('aria-labelledby', `lane-${state.lane}`);
    document.querySelectorAll('[data-lane]').forEach((button) => { const active = button.dataset.lane === state.lane; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
    const ul = $('campaign-ad-list'); ul.replaceChildren();
    ads.forEach((ad) => {
      const li = element('li'); const button = element('button', null, 'campaign-choice'); button.type = 'button'; button.dataset.ad = ad.id;
      button.setAttribute('aria-controls', 'campaign-detail');
      button.append(element('span', ad.id, 'campaign-choice-id'), element('span', text(ad.title) || ad.id, 'campaign-choice-title'), element('span', groupLabel(ad), 'campaign-choice-groups'), badge(ad.status));
      button.addEventListener('click', () => selectAd(ad.id));
      li.append(button); ul.append(li);
    });
    const empty = ads.length === 0;
    $('campaign-empty').hidden = !empty; $('campaign-workspace').hidden = empty;
    selectAd(ads.some((ad) => ad.id === state.selected) ? state.selected : ads[0]?.id || null);
    $('campaign-reset').disabled = state.group === 'all' && state.status === 'all';
  }
  function clearFilters() { state.group = 'all'; state.status = 'all'; $('campaign-group').value = 'all'; $('campaign-status').value = 'all'; renderList(); }
  function applyHash() {
    if (!state.data) return false;
    let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return false; }
    const ad = state.data.ads.find((item) => item.id.toLowerCase() === id.toLowerCase());
    if (!ad) return false;
    state.lane = ad.lane; state.group = 'all'; state.status = 'all'; state.selected = ad.id;
    $('campaign-group').value = 'all'; $('campaign-status').value = 'all';
    renderList();
    return true;
  }
  function initialize() {
    const data = state.data;
    $('campaign-title').textContent = text(data.title) || 'V17 · 图文与站内信';
    document.title = `${text(data.title) || 'V17 活动审稿'} · 领英品牌广告`;
    if (text(data.intro)) $('campaign-intro').textContent = data.intro;
    $('campaign-total').textContent = `${data.ads.length} 套方案 · ${data.groups.length} 组人群 · 每套图文 + 站内信`;
    $('campaign-version').textContent = `V17${text(data.updatedAt) ? ` · 更新 ${data.updatedAt}` : ''} · 审稿工作台。本站不发送广告、站内信或联系表单，没有投放跟踪代码。`;
    const group = $('campaign-group'); group.replaceChildren(new Option('全部人群', 'all'));
    data.groups.forEach((item) => group.append(new Option(item.label, item.id)));
    document.querySelectorAll('[data-lane-count]').forEach((span) => { span.textContent = data.ads.filter((ad) => ad.lane === span.dataset.laneCount).length; });
    if (!applyHash()) renderList();
  }
  async function load() {
    if (state.loading) return;
    state.loading = true;
    $('campaign-review').setAttribute('aria-busy', 'true'); $('campaign-loading').hidden = false; $('campaign-error').hidden = true; $('campaign-app').hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(DATA_URL, { cache: 'no-cache', signal: controller.signal });
      if (!response.ok) throw new Error(`资料请求返回 HTTP ${response.status}。`);
      state.data = normalize(await response.json());
      initialize();
      $('campaign-app').hidden = false;
    } catch (error) {
      const reason = error.name === 'AbortError' ? '读取超时。' : error instanceof SyntaxError ? '资料 JSON 无法解析。' : text(error.message);
      $('campaign-error-detail').textContent = `${reason} 请稍后点击“重新加载”。素材和文案未加载时，本页不会用虚构内容替代。`;
      $('campaign-error').hidden = false;
    } finally { clearTimeout(timeout); state.loading = false; $('campaign-loading').hidden = true; $('campaign-review').setAttribute('aria-busy', 'false'); }
  }
  document.querySelectorAll('[data-lane]').forEach((button) => {
    button.addEventListener('click', () => { if (!state.data) return; state.lane = button.dataset.lane; renderList(); });
    button.addEventListener('keydown', (event) => {
      const tabs = [...document.querySelectorAll('[data-lane]')]; let target;
      const index = tabs.indexOf(button);
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target === undefined) return;
      event.preventDefault(); tabs[target].focus(); tabs[target].click();
    });
  });
  $('campaign-group').addEventListener('change', (event) => { state.group = event.target.value; renderList(); });
  $('campaign-status').addEventListener('change', (event) => { state.status = event.target.value; renderList(); });
  $('campaign-reset').addEventListener('click', clearFilters);
  $('campaign-empty-reset').addEventListener('click', clearFilters);
  $('campaign-retry').addEventListener('click', load);
  window.addEventListener('hashchange', applyHash);
  load();
})();
