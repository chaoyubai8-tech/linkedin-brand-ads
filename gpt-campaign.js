/* V12 review module. Mounts only #gpt-campaign; no framework or external requests. */
(() => {
  'use strict';

  const BASE = new URL('.', document.currentScript?.src || document.baseURI);
  const IDS = ['T12-01', 'T12-02', 'A12-01', 'A12-02'];
  const DEFAULTS = {
    schemaVersion: 1,
    title: 'V12 · GPT 概念主视觉',
    intro: '四张静态广告创意，分别呈现 Teams 协作与 API 接入。可切换到 360px 检查标题、主体与产品身份。',
    updatedAt: '',
    cards: IDS.map((id, index) => ({
      id,
      product: index < 2 ? 'Teams' : 'API',
      title: ['共享资产', '共享管理', '工具接入', '异步工作流'][index],
      audience: '',
      headline: '',
      concept: '创意说明待导出后核对。',
      notes: [],
      status: 'pending'
    }))
  };

  function clean(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim().slice(0, 1200) : fallback;
  }

  function normalize(raw) {
    if (!raw || raw.schemaVersion !== 1 || !Array.isArray(raw.cards)) {
      throw new Error('Unsupported campaign data');
    }
    return {
      title: clean(raw.title, DEFAULTS.title),
      intro: clean(raw.intro, DEFAULTS.intro),
      updatedAt: clean(raw.updatedAt),
      cards: DEFAULTS.cards.map((fallback) => {
        const card = raw.cards.find((item) => item && item.id === fallback.id) || {};
        return {
          ...fallback,
          title: clean(card.title, fallback.title),
          // Product and asset paths are fixed by ID, not supplied by JSON.
          audience: clean(card.audience),
          headline: clean(card.headline),
          intro: clean(card.intro),
          sources: Array.isArray(card.source?.urls) ? card.source.urls.filter(url => {
            try { return new URL(url).protocol === 'https:'; } catch (_) { return false; }
          }).slice(0, 3) : [],
          concept: clean(card.concept, fallback.concept),
          notes: Array.isArray(card.notes) ? card.notes.slice(0, 5).map((note) => clean(note)).filter(Boolean) : [],
          status: card.status === 'ready' ? 'ready' : 'pending'
        };
      })
    };
  }

  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function externalLink(label, url, className) {
    const node = el('a', className, label);
    node.href = url;
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
    return node;
  }

  function downloadLink(label, filename) {
    const node = el('a', 'gc-download', label);
    node.download = filename;
    node.setAttribute('aria-label', `${filename} 下载`);
    node.setAttribute('aria-disabled', 'true');
    node.addEventListener('click', (event) => {
      if (node.getAttribute('aria-disabled') === 'true') event.preventDefault();
    });
    return node;
  }

  function setDownload(node, url, available) {
    node.setAttribute('aria-disabled', String(!available));
    if (available) node.href = url;
    else node.removeAttribute('href');
  }

  function makeCard(card) {
    const png = new URL(`assets/v12/${card.id}.png`, BASE);
    const svg = new URL(`assets/v12/${card.id}.svg`, BASE);
    const article = el('article', 'gc-card');
    article.setAttribute('aria-labelledby', `gc-title-${card.id}`);
    const label = el('div', 'gc-card-label');
    label.append(el('strong', '', card.id), el('span', '', card.product));

    const frame = el('div', 'gc-image-frame');
    const imageLink = externalLink('', png.href, 'gc-image-link');
    imageLink.setAttribute('aria-label', `打开 ${card.id} PNG 原图（新标签页）`);
    imageLink.hidden = true;
    const image = el('img');
    image.alt = `${card.id} ${card.title} — GPT 二维概念广告，不是 Tripo 实际输出`;
    image.decoding = 'async';
    imageLink.append(image);

    const placeholder = el('div', 'gc-placeholder');
    const placeholderTitle = el('strong', '', '正在加载创意');
    const placeholderText = el('p', '', '使用本轮 PNG 导出，不替换为历史稿。');
    const retry = el('button', 'gc-button', '重新加载');
    retry.type = 'button';
    retry.hidden = true;
    retry.setAttribute('aria-label', `重新加载 ${card.id} 的 PNG 和 SVG`);
    placeholder.append(placeholderTitle, placeholderText, retry);
    frame.append(imageLink, placeholder);

    const heading = el('h3', '', card.title);
    heading.id = `gc-title-${card.id}`;
    const caption = el('div', 'gc-caption');
    caption.append(heading);
    if (card.headline) caption.append(el('p', 'gc-headline', card.headline));
    caption.append(el('p', 'gc-concept', card.concept));
    if (card.audience) caption.append(el('p', 'gc-audience', `面向：${card.audience}`));
    if (card.notes.length || card.status !== 'ready') {
      const detail = el('details', 'gc-card-details');
      detail.append(el('summary', '', '创意说明'));
      if (card.intro) { detail.append(el('strong', '', 'LinkedIn 配文'), el('p', '', card.intro)); }
      if (card.status !== 'ready') detail.append(el('p', '', '以下为创意方向，最终画面与文案待导出后核对。'));
      if (card.notes.length) {
        const list = el('ul');
        card.notes.forEach((note) => list.append(el('li', '', note)));
        detail.append(list);
      }
      (card.sources || []).forEach((url, index) => detail.append(externalLink(`产品依据 ${index + 1} ↗`, url, 'gc-direct')));
      caption.append(detail);
    }

    const downloads = el('div', 'gc-downloads');
    const pngDownload = downloadLink('下载 PNG', `${card.id}.png`);
    const svgDownload = downloadLink('下载 SVG', `${card.id}.svg`);
    const direct = externalLink('直达原图 ↗', png.href, 'gc-direct');
    direct.setAttribute('aria-label', `${card.id} PNG 原图（新标签页）`);
    downloads.append(pngDownload, svgDownload, direct);
    const compare = el('button', 'gc-button', '与案例并排对比');
    compare.type = 'button';
    compare.addEventListener('click', () => window.dispatchEvent(new CustomEvent('tripo:compare-ad', { detail: { id: card.id } })));
    downloads.append(compare);
    const status = el('p', 'gc-file-status');
    status.setAttribute('role', 'status');
    let pngStatus = 'PNG 加载中';
    let svgStatus = 'SVG 检查中';
    let requestId = 0;
    const updateStatus = () => { status.textContent = `${pngStatus} · ${svgStatus}`; };

    image.addEventListener('load', () => {
      imageLink.hidden = false;
      placeholder.hidden = true;
      pngStatus = `PNG ${image.naturalWidth} × ${image.naturalHeight}`;
      setDownload(pngDownload, png.href, true);
      updateStatus();
    });
    image.addEventListener('error', () => {
      imageLink.hidden = true;
      placeholder.hidden = false;
      placeholderTitle.textContent = '图片暂未加载';
      placeholderText.textContent = '可能尚未导出或资源暂不可用，可重试或打开原图检查。';
      retry.hidden = false;
      pngStatus = 'PNG 暂不可用';
      setDownload(pngDownload, png.href, false);
      updateStatus();
    });

    async function checkSvg(cacheBust) {
      const current = ++requestId;
      const url = new URL(svg);
      if (cacheBust) url.searchParams.set('reload', String(Date.now()));
      try {
        const response = await fetch(url, { method: 'HEAD', cache: 'no-cache', credentials: 'same-origin' });
        if (current !== requestId) return;
        const type = response.headers.get('content-type') || '';
        const available = response.ok && /(?:image\/svg\+xml|application\/xml|text\/xml)/i.test(type);
        setDownload(svgDownload, svg.href, available);
        svgStatus = available ? 'SVG 可下载' : 'SVG 暂不可用';
      } catch (_) {
        if (current !== requestId) return;
        setDownload(svgDownload, svg.href, false);
        svgStatus = 'SVG 暂不可用';
      }
      updateStatus();
    }

    function loadAssets(cacheBust = false) {
      const url = new URL(png);
      if (cacheBust) url.searchParams.set('reload', String(Date.now()));
      placeholderTitle.textContent = '正在加载创意';
      placeholderText.textContent = '使用本轮 PNG 导出，不替换为历史稿。';
      retry.hidden = true;
      pngStatus = 'PNG 加载中';
      svgStatus = 'SVG 检查中';
      updateStatus();
      image.src = url.href;
      void checkSvg(cacheBust);
    }
    retry.addEventListener('click', () => loadAssets(true));
    // A separate control remains available if only the SVG is late to arrive.
    const retryFiles = el('button', 'gc-retry-files', '检查文件');
    retryFiles.type = 'button';
    retryFiles.setAttribute('aria-label', `重新检查 ${card.id} 导出文件`);
    retryFiles.addEventListener('click', () => loadAssets(true));
    downloads.append(retryFiles);
    article.append(label, frame, caption, downloads, status);
    loadAssets();
    return article;
  }

  function render(root, data, dataError) {
    const compact = root.dataset.reviewWidth === '360';
    root.replaceChildren();
    root.setAttribute('aria-labelledby', 'gc-heading');
    const header = el('header', 'gc-header');
    header.append(el('p', 'gc-eyebrow', 'V12 / 静态创意审稿'));
    const heading = el('h2', '', data.title);
    heading.id = 'gc-heading';
    header.append(heading, el('p', 'gc-intro', data.intro));
    header.append(el('p', 'gc-source-note', 'GPT 二维概念主视觉，不是 Tripo 实际输出；本轮为创意审稿，未投放。'));
    const history = el('a', 'gc-history', '查看 V10 / V11 历史稿 →');
    history.href = '#iterations';
    header.append(history);
    const research = el('a', 'gc-history', '风格研究独立栏目 ↗');
    research.href = 'research.html';
    research.style.marginLeft = '24px';
    header.append(research);

    const controls = el('div', 'gc-controls');
    const toggle = el('button', 'gc-button', '360px 审稿');
    toggle.type = 'button';
    toggle.setAttribute('aria-pressed', String(compact));
    toggle.setAttribute('aria-controls', 'gc-gallery');
    const widthStatus = el('p', 'gc-width-status');
    widthStatus.setAttribute('role', 'status');
    const setWidth = (enabled) => {
      root.dataset.reviewWidth = enabled ? '360' : 'fluid';
      toggle.setAttribute('aria-pressed', String(enabled));
      widthStatus.textContent = enabled ? '每张图片宽 360 CSS px；窄屏可横向滚动。' : '自适应展示；点击检查 360px 下的阅读层级。';
    };
    toggle.addEventListener('click', () => setWidth(root.dataset.reviewWidth !== '360'));
    setWidth(compact);
    controls.append(toggle, widthStatus);

    const scroll = el('div', 'gc-gallery-scroll');
    scroll.id = 'gc-gallery';
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', 'V12 四张广告创意；360px 模式可用左右方向键横向浏览');
    scroll.addEventListener('keydown', (event) => {
      if (event.target !== scroll || !['ArrowLeft', 'ArrowRight'].includes(event.key) || scroll.scrollWidth <= scroll.clientWidth) return;
      event.preventDefault();
      scroll.scrollBy({ left: event.key === 'ArrowRight' ? 384 : -384, behavior: 'auto' });
    });
    const grid = el('div', 'gc-grid');
    data.cards.forEach((card) => grid.append(makeCard(card)));
    scroll.append(grid);

    const boundaries = el('details', 'gc-boundaries');
    boundaries.append(el('summary', '', '来源与使用边界'));
    boundaries.append(el('p', '', 'V12 采用 GPT 生成的二维视觉概念制作广告。不将概念画面作为真实网格、材质、拓扑、视角一致性或生成能力的证明；画面中的协作与接口关系属于创意示意，不是产品操作截图。'));
    boundaries.append(el('p', '', '历史 V11 保留其真实 Tripo 模型与 Blender 渲染说明。PNG 用于看图，SVG 是对应的版式文件；SVG 格式不表示其中的生成主视觉变成了可编辑 3D 模型。未进行投放，也不据此推断 CTR / CPM。'));

    root.append(header, controls, scroll, boundaries);
    if (data.updatedAt) root.append(el('p', 'gc-updated', `创意说明更新：${data.updatedAt}`));
    if (dataError) {
      const warning = el('div', 'gc-data-warning');
      warning.append(el('p', '', '创意说明暂未读取，当前显示基础卡片；图片仍使用本轮固定路径。'));
      const reload = el('button', 'gc-button', '重试读取说明');
      reload.type = 'button';
      reload.addEventListener('click', () => { reload.disabled = true; void load(root); });
      warning.append(reload);
      root.append(warning);
    }
  }

  async function load(root) {
    try {
      const response = await fetch(new URL('gpt-campaign-data.json', BASE), { cache: 'no-cache', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Campaign data unavailable');
      render(root, normalize(await response.json()), false);
    } catch (_) {
      render(root, DEFAULTS, true);
    }
  }

  function mount() {
    const root = document.getElementById('gpt-campaign');
    if (!root || root.dataset.gcMounted === 'true') return;
    root.dataset.gcMounted = 'true';
    root.append(el('p', 'gc-data-loading', '正在读取 V12 创意…'));
    void load(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
