/* Standalone V10/V11 review module. Only owns #iterations; no tracking or publishing.
 * Optional content: iterations-data.json (strings are rendered with textContent).
 * Schema: {title?,intro?,updatedAt?,note?,strengths:[{title,summary,points:[]}],
 * pairs:[{key,title?,audience?,v10:{headline?,alt?,caption?,assetNote?},
 * v11:{headline?,alt?,caption?,assetNote?},
 * review:{v10Issue?,changes:[],remaining?,verdict?}}]}.
 * Keys: teams-workspace, teams-control, api-integration, api-image.
 * Assets remain fixed to the same-origin PNG/SVG files listed below.
 */
(() => {
  'use strict';
  const SCRIPT_BASE = new URL('.', document.currentScript?.src || document.baseURI);
  const DEFAULTS = {
    title: '从 V10 到 V11，看改动是否成立。',
    intro: '四组静态广告等尺寸比较。先看主张与模型证据，再核对评价和下一步修改。',
    note: '创意草稿，未投放。对比表达与视觉质量，不代表 CTR 或 CPM 改善。',
    strengths: [
      { title: 'AI / B2B 案例的长处', summary: '先让读者知道，这张广告与自己有什么关系。', points: ['一个人群、一个主张，大字先被读到。', '产品动作或工作问题可视化，减少解释负担。'] },
      { title: '我们的模型案例的长处', summary: '用主体、材质和细节，让 3D 能力有可看的证据。', points: ['大模型与塑形光，保留轮廓和材质层次。', '真实输入输出或局部细节，只承担有来源的一种证明。'] }
    ]
  };
  const PAIRS = [
    { key: 'teams-workspace', before: 'T10-01', after: 'T11-01', title: 'Teams / 共享工作区', audience: '游戏工作室负责人、艺术负责人', headline: 'One team. One shared 3D workspace.' },
    { key: 'teams-control', before: 'T10-02', after: 'T11-02', title: 'Teams / 共享与管理', audience: '小团队老板、制作负责人', headline: 'Shared assets. Shared credits. Clear control.' },
    { key: 'api-integration', before: 'A10-01', after: 'A11-01', title: 'API / 接入自己的工具', audience: '游戏开发者、技术负责人', headline: 'Add 3D generation to your tools.' },
    { key: 'api-image', before: 'A10-02', after: 'A11-02', title: 'API / 真实输入输出', audience: '技术美术、资产管线开发者', headline: 'From reference image to 3D.' }
  ];

  const text = (value, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
  const list = value => Array.isArray(value) ? value.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim()).slice(0, 6) : [];
  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function button(label) {
    const node = el('button', 'it-button', label);
    node.type = 'button';
    return node;
  }
  function assetURL(version, id, extension) {
    return new URL(`assets/${version}/${id}.${extension}`, SCRIPT_BASE).href;
  }
  function link(label, url, downloadName) {
    const node = el('a', 'it-link', label);
    node.href = url;
    if (downloadName) {
      node.download = downloadName;
      node.classList.add('it-download');
    } else {
      node.target = '_blank';
      node.rel = 'noopener';
    }
    return node;
  }

  function makeFigure(pair, version, details) {
    const isBefore = version === 'v10';
    const id = isBefore ? pair.before : pair.after;
    const png = assetURL(version, id, 'png');
    const svg = assetURL(version, id, 'svg');
    const figure = el('figure', 'it-figure');
    const caption = el('figcaption', 'it-figure-label');
    caption.append(el('strong', '', isBefore ? 'V10 / 初稿' : 'V11 / 迭代稿'), el('span', '', id));
    const frame = el('div', 'it-image-frame');
    const original = link('', png);
    original.className = 'it-image-link';
    original.setAttribute('aria-label', `${id}：打开原尺寸 PNG（新标签页）`);
    const image = el('img');
    image.width = 1440;
    image.height = 1440;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.alt = text(details.alt, `${id} ${pair.title}静态广告：${text(details.headline, pair.headline)}`);
    const loading = el('p', 'it-image-loading', '图片加载中…');
    const failure = el('div', 'it-image-failure');
    failure.hidden = true;
    failure.setAttribute('role', 'status');
    const retry = button('重试图片');
    failure.append(el('strong', '', '图片暂未加载'), el('p', '', `${id} 可能尚未导出或网络暂不可用。这里不以其他图替代。`), retry, link('打开原文件', png));
    const dimensions = el('p', 'it-dimensions', '等待核对图片尺寸');
    image.addEventListener('load', () => {
      loading.hidden = true;
      failure.hidden = true;
      original.hidden = false;
      dimensions.textContent = `${image.naturalWidth} × ${image.naturalHeight} px${image.naturalWidth !== image.naturalHeight ? ' / 非方图，保持原比例展示' : ''}`;
    });
    image.addEventListener('error', () => {
      loading.hidden = true;
      failure.hidden = false;
      original.hidden = true;
      dimensions.textContent = '尺寸尚未核验';
    });
    retry.addEventListener('click', () => {
      loading.hidden = false;
      failure.hidden = true;
      original.hidden = false;
      image.src = `${png}?retry=${Date.now()}`;
      dimensions.textContent = '正在重新加载图片';
    });
    original.append(image);
    frame.append(original, loading, failure);
    const heading = el('p', 'it-creative-headline', text(details.headline, pair.headline));
    const downloads = el('div', 'it-downloads');
    const pngLink = link('下载 PNG', png, `${id}.png`);
    const svgLink = link('下载 SVG', svg, `${id}.svg`);
    pngLink.setAttribute('aria-label', `下载 ${id} PNG`);
    svgLink.setAttribute('aria-label', `下载 ${id} SVG 可编辑源稿`);
    downloads.append(pngLink, svgLink);
    figure.append(caption, frame, heading);
    if (text(details.caption)) figure.append(el('p', 'it-caption', text(details.caption)));
    figure.append(el('p', 'it-asset-note', text(details.assetNote, '素材核验记录待补充；不能仅凭图片认定模型来源或 PBR 制作流程。')), dimensions, downloads);
    image.src = png;
    return figure;
  }

  function makeReview(review) {
    const block = el('div', 'it-review');
    const changes = list(review.changes);
    const issue = text(review.v10Issue);
    const verdict = text(review.verdict);
    const remaining = text(review.remaining);
    if (!issue && !changes.length && !verdict && !remaining) {
      block.append(el('p', 'it-pending', '本组评价待补充。先看两版画面，不预先判定 V11 更好。'));
      return block;
    }
    if (issue) {
      const p = el('p', '');
      p.append(el('strong', '', '初稿问题：'), document.createTextNode(issue));
      block.append(p);
    }
    if (changes.length) {
      block.append(el('h4', '', '本轮改动'));
      const ul = el('ul', 'it-change-list');
      changes.forEach(change => ul.append(el('li', '', change)));
      block.append(ul);
    }
    if (verdict) {
      const p = el('p', '');
      p.append(el('strong', '', '复评：'), document.createTextNode(verdict));
      block.append(p);
    }
    if (remaining) {
      const p = el('p', '');
      p.append(el('strong', '', '仍待改进：'), document.createTextNode(remaining));
      block.append(p);
    }
    return block;
  }

  function render(root, data, loadState) {
    const focusID = root.contains(document.activeElement) ? document.activeElement.id : '';
    const mobile = root.dataset.reviewWidth === '360';
    const fragment = document.createDocumentFragment();
    const heading = el('div', 'it-heading');
    const h2 = el('h2', '', text(data.title, DEFAULTS.title));
    h2.id = 'it-title';
    heading.append(h2, el('p', 'it-intro', text(data.intro, DEFAULTS.intro)));
    if (text(data.updatedAt)) heading.append(el('p', 'it-date', `评价更新：${text(data.updatedAt)}`));
    fragment.append(heading);

    const strengths = el('div', 'it-strengths');
    const sourceStrengths = Array.isArray(data.strengths) && data.strengths.length === 2 ? data.strengths : DEFAULTS.strengths;
    sourceStrengths.forEach((item, index) => {
      const fallback = DEFAULTS.strengths[index];
      const article = el('article', 'it-strength');
      article.append(el('h3', '', text(item.title, fallback.title)), el('p', '', text(item.summary, fallback.summary)));
      const ul = el('ul', '');
      const points = list(item.points);
      (points.length ? points : fallback.points).forEach(point => ul.append(el('li', '', point)));
      article.append(ul);
      strengths.append(article);
    });
    fragment.append(strengths);

    const controls = el('div', 'it-controls');
    const widthToggle = button('360px 审稿');
    widthToggle.id = 'it-width-toggle';
    widthToggle.setAttribute('aria-pressed', String(mobile));
    widthToggle.setAttribute('aria-controls', 'it-pairs');
    const widthStatus = el('p', 'it-width-status', mobile ? '每张图固定 360px；窄屏可横向比较。' : '自适应等宽；点击图片可看原文件。');
    widthStatus.id = 'it-width-status';
    widthStatus.setAttribute('role', 'status');
    widthToggle.setAttribute('aria-describedby', widthStatus.id);
    widthToggle.addEventListener('click', () => {
      const active = root.dataset.reviewWidth !== '360';
      root.dataset.reviewWidth = active ? '360' : 'fluid';
      widthToggle.setAttribute('aria-pressed', String(active));
      widthStatus.textContent = active ? '每张图固定 360px；窄屏可横向比较。' : '自适应等宽；点击图片可看原文件。';
    });
    controls.append(widthToggle, widthStatus);
    fragment.append(controls);

    const pairs = el('div', 'it-pairs');
    pairs.id = 'it-pairs';
    const overrides = Array.isArray(data.pairs) ? data.pairs : [];
    PAIRS.forEach(base => {
      const custom = overrides.find(item => item && item.key === base.key) || {};
      const pair = { ...base, title: text(custom.title, base.title) };
      const article = el('article', 'it-pair');
      const title = el('h3', 'it-pair-title', pair.title);
      title.id = `it-${base.key}`;
      article.setAttribute('aria-labelledby', title.id);
      article.append(title, el('p', 'it-audience', `面向：${text(custom.audience, base.audience)}`));
      const shell = el('div', 'it-pair-scroll');
      shell.tabIndex = 0;
      shell.setAttribute('role', 'region');
      shell.setAttribute('aria-label', `${pair.title}：V10 与 V11 对比，超出屏幕时可用左右方向键横向移动`);
      shell.addEventListener('keydown', event => {
        if (event.target !== shell || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          if (shell.scrollWidth <= shell.clientWidth) return;
          event.preventDefault();
          shell.scrollLeft += event.key === 'ArrowRight' ? 180 : -180;
        }
      });
      const grid = el('div', 'it-pair-grid');
      grid.append(makeFigure(pair, 'v10', custom.v10 || {}), makeFigure(pair, 'v11', custom.v11 || {}));
      shell.append(grid);
      article.append(shell, makeReview(custom.review || {}));
      pairs.append(article);
    });
    fragment.append(pairs);

    const boundary = el('div', 'it-boundary');
    boundary.append(el('strong', '', '证据与交付边界'), el('p', '', '真实模型和 PBR 材质渲染需有素材记录；概念流程不等于实际产品 UI。输入输出只用对应原始素材，画面不能单独证明拓扑、速度或游戏内表现。'), el('p', '', 'PNG 用于静态审稿；SVG 为可编辑源稿，不是领英上传格式。正式投放前还需核对文件大小、权益文案和素材授权。'), el('p', '', text(data.note, DEFAULTS.note)));
    fragment.append(boundary);
    const status = el('p', 'it-data-status', loadState);
    status.setAttribute('role', 'status');
    fragment.append(status);
    root.replaceChildren(fragment);
    root.setAttribute('aria-labelledby', 'it-title');
    root.dataset.reviewWidth = mobile ? '360' : 'fluid';
    if (focusID) document.getElementById(focusID)?.focus({ preventScroll: true });
  }

  async function init() {
    const root = document.getElementById('iterations');
    if (!root || root.dataset.iterationsReady === 'true') return;
    root.dataset.iterationsReady = 'true';
    root.classList.add('it-module');
    render(root, {}, '正在加载评价记录…');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(new URL('iterations-data.json', SCRIPT_BASE), { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid data');
      render(root, data, '评价记录已载入。画面与文字均保留版本，供逐项复评。');
    } catch (_error) {
      render(root, {}, '评价记录暂未载入，当前展示固定的四组图片入口；具体改动不作推测。');
    } finally {
      window.clearTimeout(timeout);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
