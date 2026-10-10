(() => {
  'use strict';
  const data = window.MATERIAL_LIBRARY;
  const $ = (id) => document.getElementById(id);
  const grid = $('asset-grid');
  const form = $('filters');
  const versionSelect = $('version-filter');
  const searchInput = $('search-filter');
  const resetButton = $('reset-filters');
  const empty = $('empty-state');
  const emptyAction = $('empty-action');
  const kindButtons = [...document.querySelectorAll('[data-kind]')];
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  };
  const textValue = (value) => {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.map(textValue).filter(Boolean).join(' · ');
    return [value.en, value.cn, value.text].filter(Boolean).map(String).join(' / ');
  };
  const safeUrl = (value) => {
    if (typeof value !== 'string' || !value.trim() || value.trim().startsWith('#')) return null;
    try {
      const raw = value.trim();
      const url = new URL(raw, document.baseURI);
      return ['http:', 'https:', 'file:'].includes(url.protocol) ? raw : null;
    } catch { return null; }
  };
  const makeLink = (url, label, download = false) => {
    const link = make('a', '', label);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    if (download) link.setAttribute('download', '');
    return link;
  };

  if (!data || !Array.isArray(data.versions) || !Array.isArray(data.assets)) {
    $('library-summary').textContent = '素材目录暂未载入。';
    $('empty-title').textContent = '暂时无法读取素材目录';
    $('empty-description').textContent = '请刷新页面重试，也可先返回广告首页。';
    emptyAction.textContent = '刷新页面';
    emptyAction.addEventListener('click', () => window.location.reload());
    empty.hidden = false;
    grid.setAttribute('aria-busy', 'false');
    [...form.elements].forEach((control) => { control.disabled = true; });
    $('downloads-empty').hidden = false;
    return;
  }

  const versions = data.versions.filter((v) => v && v.id != null);
  const versionById = new Map(versions.map((v) => [String(v.id), v]));
  const assets = data.assets.filter((asset) => asset && ['ad', 'refined'].includes(asset.kind));
  const downloads = Array.isArray(data.downloads) ? data.downloads : [];
  const membership = (asset) => [...new Set([asset.version, ...(Array.isArray(asset.versions) ? asset.versions : [])].filter((v) => v != null && String(v)).map(String))];
  const versionLabel = (id) => textValue(versionById.get(String(id))?.label) || (String(id) === 'ALL' ? '全部版本' : String(id) === 'legacy-model-backups' ? '早期模型留档' : String(id));
  const versionStatus = (id) => textValue(versionById.get(String(id))?.status);
  const params = new URLSearchParams(window.location.search);
  let state = {
    kind: params.get('kind') === 'refined' ? 'refined' : 'ad',
    version: versionById.has(params.get('version')) ? params.get('version') : '',
    query: params.get('q') || ''
  };

  versions.forEach((version) => {
    const option = make('option', '', textValue(version.label) || String(version.id));
    option.value = String(version.id);
    versionSelect.append(option);
  });
  const adCount = assets.filter((asset) => asset.kind === 'ad').length;
  const refinedCount = assets.filter((asset) => asset.kind === 'refined').length;
  $('library-summary').textContent = `${versions.length} 个版本 · ${adCount} 张广告成图 · ${refinedCount} 张 AI 精修图像`;
  if (data.updated) $('updated-at').textContent = `更新于 ${textValue(data.updated)}`;
  (Array.isArray(data.notes) ? data.notes : []).filter(Boolean).forEach((note) => $('notes-list').append(make('li', '', textValue(note))));

  const appendDetail = (dl, label, value) => {
    const valueText = textValue(value);
    if (!valueText) return;
    dl.append(make('dt', '', label), make('dd', '', valueText));
  };
  const createCard = (asset, index) => {
    const card = make('article', 'asset-card');
    const title = textValue(asset.title) || textValue(asset.id) || '素材';
    const imageUrl = safeUrl(asset.src);
    const preview = imageUrl ? makeLink(imageUrl, '') : make('div');
    preview.className = 'asset-preview' + (asset.kind === 'refined' ? ' is-refined' : '') + (asset.nativeBanner ? ' is-native-banner' : '');
    if (imageUrl) {
      preview.setAttribute('aria-label', `查看原尺寸：${title}`);
      const image = make('img');
      image.alt = title;
      image.src = imageUrl;
      image.loading = index < 6 ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => {
        image.hidden = true;
        preview.append(make('span', 'preview-unavailable', '预览暂时无法加载，点击打开原图'));
      }, { once: true });
      preview.append(image);
    } else {
      preview.append(make('span', 'preview-unavailable', '此素材暂无预览'));
    }
    card.append(preview);
    const ids = membership(asset);
    const meta = make('div', 'asset-meta');
    meta.append(make('p', '', ids.map(versionLabel).join(' · ')), make('span', '', asset.kind === 'ad' ? '广告成图' : 'AI 精修'));
    card.append(meta, make('h3', '', title));
    const statuses = [...new Set(ids.map(versionStatus).filter(Boolean))];
    if (statuses.length) card.append(make('p', 'asset-status', statuses.join(' · ')));
    const links = make('div', 'asset-links');
    const used = new Set();
    (Array.isArray(asset.formats) ? asset.formats : []).forEach((format) => {
      const url = safeUrl(format?.url);
      if (!url || used.has(url)) return;
      used.add(url);
      links.append(makeLink(url, `下载 ${textValue(format.label) || '文件'}`, true));
    });
    if (imageUrl) links.append(makeLink(imageUrl, '查看原图'));
    if (links.childElementCount) card.append(links);
    const detailValues = [asset.headline, asset.support, asset.translation, asset.concept, asset.cta, asset.sourceId];
    if (detailValues.some((v) => textValue(v))) {
      const details = make('details', 'copy-details');
      details.append(make('summary', '', '文案与中文概念'));
      const dl = make('dl');
      appendDetail(dl, '标题', asset.headline);
      appendDetail(dl, '利益说明', asset.support);
      appendDetail(dl, '中文译意', asset.translation);
      appendDetail(dl, '中文概念', asset.concept);
      appendDetail(dl, '按钮', asset.cta);
      appendDetail(dl, '来源编号', asset.sourceId);
      details.append(dl);
      card.append(details);
    }
    return card;
  };

  const formatBytes = (bytes) => {
    const value = Number(bytes);
    if (!Number.isFinite(value) || value <= 0) return '';
    if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(1)} GB`;
    if (value >= 1024 ** 2) return `${(value / 1024 ** 2).toFixed(1)} MB`;
    return `${Math.ceil(value / 1024)} KB`;
  };
  const allPackage = downloads.find((entry) => entry && entry.version === 'ALL' && safeUrl(entry.url));
  if (allPackage) {
    const allLink = $('all-download');
    allLink.href = safeUrl(allPackage.url);
    allLink.target = '_blank';
    allLink.rel = 'noopener';
    allLink.setAttribute('download', '');
    allLink.hidden = false;
    $('all-download-size').textContent = formatBytes(allPackage.bytes);
  }
  const renderDownloadGroups = (container, entries) => {
    container.replaceChildren();
    const groups = new Map();
    entries.forEach((entry) => {
      const id = entry.version == null ? '' : String(entry.version);
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(entry);
    });
    const rank = new Map(versions.map((version, i) => [String(version.id), i]));
    [...groups.entries()].sort(([a], [b]) => (rank.get(a) ?? Infinity) - (rank.get(b) ?? Infinity)).forEach(([id, entries]) => {
      const group = make('section', 'download-group');
      const heading = make('div');
      heading.append(make('h3', '', id ? versionLabel(id) : '合集下载'));
      if (id && versionStatus(id)) heading.append(make('p', 'download-version-status', versionStatus(id)));
      group.append(heading);
      const list = make('ul');
      entries.forEach((entry) => {
        const item = make('li');
        const row = make('div', 'download-row');
        const url = safeUrl(entry.url);
        const title = textValue(entry.title) || (entry.kind === 'models' ? '模型源文件' : entry.kind === 'sources' ? '可编辑源文件' : '广告成图包');
        const name = make('div');
        name.append(url ? makeLink(url, title, true) : make('span', '', title));
        if (!url) name.append(make('span', 'download-pending', '暂未提供下载'));
        row.append(name);
        const size = formatBytes(entry.bytes);
        if (size) row.append(make('span', 'download-size', size));
        item.append(row);
        list.append(item);
      });
      group.append(list);
      container.append(group);
    });
  };
  const renderDownloads = () => {
    const entries = downloads.filter((entry) => entry && (!state.version || membership(entry).includes(state.version)));
    const standard = entries.filter((entry) => entry.kind !== 'models');
    const models = entries.filter((entry) => entry.kind === 'models');
    renderDownloadGroups($('standard-downloads'), standard);
    renderDownloadGroups($('model-downloads'), models);
    $('model-download-section').hidden = !models.length;
    $('downloads-empty').hidden = entries.length > 0;
    $('downloads-context').textContent = state.version ? `${versionLabel(state.version)} 的图片素材与原始模型下载。` : '图片素材按版本整理，原始模型另列。';
  };
  const updateUrl = () => {
    try {
      const query = new URLSearchParams(window.location.search);
      if (state.version) query.set('version', state.version); else query.delete('version');
      if (state.kind !== 'ad') query.set('kind', state.kind); else query.delete('kind');
      if (state.query.trim()) query.set('q', state.query.trim()); else query.delete('q');
      const suffix = query.toString();
      window.history.replaceState(null, '', window.location.pathname + (suffix ? '?' + suffix : '') + window.location.hash);
    } catch { /* The library still works when local preview restricts history. */ }
  };
  const render = () => {
    versionSelect.value = state.version;
    searchInput.value = state.query;
    kindButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.kind === state.kind)));
    resetButton.disabled = !state.version && !state.query && state.kind === 'ad';
    const terms = state.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const filtered = assets.filter((asset) => {
      if (asset.kind !== state.kind) return false;
      const ids = membership(asset);
      if (state.version && !ids.includes(state.version)) return false;
      const haystack = [asset.id, asset.title, asset.headline, asset.support, asset.translation, asset.concept, asset.cta, asset.sourceId, ...ids, ...ids.map(versionLabel)].map(textValue).join(' ').toLocaleLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
    const fragment = document.createDocumentFragment();
    filtered.forEach((asset, index) => fragment.append(createCard(asset, index)));
    grid.replaceChildren(fragment);
    grid.setAttribute('aria-busy', 'false');
    empty.hidden = filtered.length > 0;
    const kindLabel = state.kind === 'ad' ? '广告成图' : 'AI 精修图像';
    $('results-title').textContent = state.version ? `${versionLabel(state.version)} · ${kindLabel}` : `全部${kindLabel}`;
    $('results-count').textContent = `显示 ${filtered.length} 张`;
    const selected = versionById.get(state.version);
    $('version-description').textContent = selected ? [textValue(selected.summary), textValue(selected.status)].filter(Boolean).join(' · ') : '';
    renderDownloads();
    updateUrl();
  };
  let searchTimer;
  const reset = () => {
    clearTimeout(searchTimer);
    state = {kind: 'ad', version: '', query: ''};
    render();
  };
  kindButtons.forEach((button) => button.addEventListener('click', () => { state.kind = button.dataset.kind; render(); }));
  versionSelect.addEventListener('change', () => { state.version = versionSelect.value; render(); });
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    state.query = searchInput.value;
    searchTimer = setTimeout(render, 160);
  });
  form.addEventListener('submit', (event) => { event.preventDefault(); clearTimeout(searchTimer); render(); });
  form.addEventListener('reset', (event) => { event.preventDefault(); reset(); });
  emptyAction.addEventListener('click', reset);
  render();
})();
