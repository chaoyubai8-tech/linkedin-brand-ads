/* Current V15 review. Legacy #gpt-campaign anchor is retained for compatibility. */
(() => {
  'use strict';

  const BASE = new URL('.', document.currentScript?.src || document.baseURI);
  const IDS = ['T15-01', 'T15-02', 'A15-01', 'A15-02'];
  const DEFAULTS = {
    schemaVersion: 1,
    title: 'V15 · 中台素材，把共享与接入讲清楚',
    intro: 'Teams 使用中台输入衍生的 GPT 主视觉，API 使用对应既有真实网格的 Blender 白模。工作区与流程为示意，不是本次 API 实测，均为待审稿。',
    workflowSamples: [],
    updatedAt: '',
    cards: IDS.map((id, index) => ({
      id,
      product: index < 2 ? 'Teams' : 'API',
      title: ['中台角色与共享库', '共享积分与资源管理', '真实白模与工具接入', '真实网格与异步任务'][index],
      imageDescription: ['自有中台输入衍生的 GPT 二维 hero 图与共享库示意', '自有中台输入衍生的 GPT 二维角色与管理关系', '中台235既有真实FBX的Blender白模与接入示意', '中台235既有真实FBX的白模、局部真实黑线框与异步任务示意'][index],
      artworkLabel: index < 2 ? 'AI concept · Workspace concept' : 'Existing mesh · Blender render · Workflow illustration',
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

  function localArtwork(value, svg = false) {
    if (typeof value !== 'string' || !/^assets\/v(?:13|14|15)\/[a-zA-Z0-9._/-]+$/i.test(value) || value.includes('..')) return '';
    return (svg ? /\.svg$/i : /\.(?:png|jpe?g|webp)$/i).test(value) ? value : '';
  }

  function normalize(raw) {
    if (!raw || raw.schemaVersion !== 1 || !Array.isArray(raw.cards)) {
      throw new Error('Unsupported campaign data');
    }
    return {
      title: clean(raw.title, DEFAULTS.title),
      intro: clean(raw.intro, DEFAULTS.intro),
      updatedAt: clean(raw.updatedAt),
      workflowSamples: Array.isArray(raw.workflowSamples) ? raw.workflowSamples.slice(0, 4).filter(item => item && localArtwork(item.image)).map(item => ({title:clean(item.title, '工作流样板'),summary:clean(item.summary),image:localArtwork(item.image),svg:localArtwork(item.svg, true),alt:clean(item.alt, '工作流表达样板；不代表真实产品操作'),sourceLabel:clean(item.sourceLabel, '表达示意'),compareImage:localArtwork(item.compareImage),compareTitle:clean(item.compareTitle, '对应主稿')})) : [],
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
          imageDescription: clean(card.imageDescription, fallback.imageDescription),
          artworkLabel: clean(card.artworkLabel, fallback.artworkLabel),
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
    const png = new URL(`assets/v15/${card.id}.png`, BASE);
    const svg = new URL(`assets/v15/${card.id}.svg`, BASE);
    const article = el('article', 'gc-card');
    article.setAttribute('aria-labelledby', `gc-title-${card.id}`);
    const label = el('div', 'gc-card-label');
    label.append(el('strong', '', card.id), el('span', '', card.product));

    const frame = el('div', 'gc-image-frame');
    const imageLink = externalLink('', png.href, 'gc-image-link');
    imageLink.setAttribute('aria-label', `打开 ${card.id} PNG 原图（新标签页）`);
    imageLink.hidden = true;
    const image = el('img');
    image.alt = `${card.id} ${card.title} — ${card.imageDescription}；${card.artworkLabel || (card.product === 'Teams' ? 'Workspace concept' : 'Workflow illustration')}，不是产品操作截图或本次 API 实测结果`;
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
    caption.append(el('p', 'gc-audience', `呈现边界：${card.artworkLabel || (card.product === 'Teams' ? 'Workspace concept' : 'Workflow illustration')} · 待审稿`));
    if (card.notes.length || card.status !== 'ready') {
      const detail = el('details', 'gc-card-details');
      detail.append(el('summary', '', '创意说明'));
      if (card.intro) { detail.append(el('strong', '', 'LinkedIn 配文'), el('p', '', card.intro)); }
      if (card.status !== 'ready') detail.append(el('p', '', '以下为审稿说明，最终画面与文案仍待确认。'));
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
    header.append(el('p', 'gc-eyebrow', 'V15 / 中台素材 · 静态创意审稿'));
    const heading = el('h2', '', data.title);
    heading.id = 'gc-heading';
    header.append(heading, el('p', 'gc-intro', data.intro));
    header.append(el('p', 'gc-source-note', 'Teams：自有中台输入衍生的 GPT hero 图，AI concept，不是实际贴图模型。API：中台235对应既有FBX的Blender白模与局部真实线框，不是本次API生成。两类关系图均为示意。'));
    const history = el('a', 'gc-history', '查看 V14 / V13 / V12 / V11 / V9 历史稿 →');
    history.href = '#current-gallery';
    header.append(history);
    const research = el('a', 'gc-history', '风格研究独立栏目 ↗');
    research.href = 'research.html';
    research.style.marginLeft = '24px';
    header.append(research);
    const review = el('a', 'gc-history', 'V15 质量检查记录 ↗');
    review.href = 'assets/v15/REVIEW.md';
    review.style.marginLeft = '24px';
    header.append(review);

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
    scroll.setAttribute('aria-label', 'V15 四张广告创意；360px 模式可用左右方向键横向浏览');
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
    boundaries.append(el('p', '', 'V15 Teams 使用自有中台输入衍生的 GPT hero 图39602，属于 AI concept，不是实际3D模型的贴图渲染。V15 API 使用中台235对应既有真实FBX的 Blender 白模与局部黑线框；线框来自真实网格，不使用失败三视图。'));
    boundaries.append(el('p', '', 'Teams 的共享库、积分与管理员连接为 Workspace concept；API 的工具连接与任务流程为 Workflow illustration。不是产品 UI、实时共编或本次 API 调用日志；成功后才取回结果，不保证即时完成、零代码或每次成功。'));
    boundaries.append(el('p', '', 'API展示的是既有旧资产，不是本次API生成，素材批次也不等于引擎版本。局部线框不证明全四边面、重拓扑或生产验收；未验证绑定、游戏表现、耗时或节省比例。V14及更早稿保留各自说明。PNG/SVG不是原始3D模型，未批准投放，不据此推断CTR/CPM。'));
    boundaries.append(el('p', '', '本轮版式按 Instrument Sans、品牌黄 #F9CF00、黑白及大写 TRIPO3D.AI 的方向制作；具体画面和移动端可读性以质量检查记录为准。'));
    const archive = el('a', 'gc-history', 'V14 原始创意说明归档 JSON ↗');
    archive.href = 'gpt-campaign-v14-data.json';
    boundaries.append(archive);

    const workflow = el('details', 'gc-boundaries');
    workflow.id = 'workflow-samples';
    workflow.append(el('summary', '', data.workflowSamples.length ? 'V13 历史 AI 对照与制作样板' : '历史制作样板 · 待补充'));
    workflow.append(el('p', '', 'V15 Teams 复用了下列中台流程产出的无字主视觉，并重做排版。此处保留 V13 时的原始素材与 AI 美术对照，不是本次重新生成；AI 图不代表真实 3D 输出。'));
    const samples = el('div', 'gc-workflow-list'); samples.id = 'gc-workflow-samples';
    data.workflowSamples.forEach(item => {
      const article = el('article', 'gc-sample');
      article.append(el('h3', '', item.title), el('p', '', item.summary));
      const pair = el('div', 'gc-sample-grid');
      const visual = (src, label, alt) => {
        const figure = el('figure');
        const img = el('img'); img.src = new URL(src, BASE).href; img.alt = alt; img.loading = 'lazy';
        const link = externalLink('', img.src, 'gc-sample-image'); link.append(img);
        figure.append(el('figcaption', '', label), link);
        img.addEventListener('error', () => { link.hidden = true; figure.append(el('p', '', '样板图片暂未加载；保留说明，不以其他图片替代。')); });
        return figure;
      };
      if (item.compareImage) pair.append(visual(item.compareImage, item.compareTitle, `${item.compareTitle}；原始素材呈现，不是模型贴图渲染`));
      pair.append(visual(item.image, item.sourceLabel, item.alt));
      article.append(pair, el('p', 'gc-audience', item.sourceLabel));
      const downloads = el('div', 'gc-downloads');
      const png = downloadLink('下载 AI 对照 PNG', item.image.split('/').pop()); setDownload(png, new URL(item.image, BASE).href, true); downloads.append(png);
      if (item.svg) { const svg = downloadLink('下载 AI 对照 SVG', item.svg.split('/').pop()); setDownload(svg, new URL(item.svg, BASE).href, true); downloads.append(svg); }
      article.append(downloads); samples.append(article);
    });
    if (!data.workflowSamples.length) samples.append(el('p', '', '样板与逐项观察将在核对来源后补充；当前四张广告可通过下方三列对比查看。'));
    workflow.append(samples);

    root.append(header, controls, scroll, boundaries, workflow);
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
    root.append(el('p', 'gc-data-loading', '正在读取 V15 创意…'));
    void load(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
