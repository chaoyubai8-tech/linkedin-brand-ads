(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const currentAds = [
    {id:'T9-01', title:'T9-01 · Teams 共享资产库', headline:'One team. One asset library.', caseId:'1474713154', guide:4,
      audience:'游戏工作室负责人 / 制作人',
      audit:'用同一组真实游戏资产表现一个团队资产库，支持文案聚焦 Shared assets、Shared credits、Admin controls。共享库关系为视觉示意，不宣称同一网格实时共同编辑、自动统一风格或所有成员无条件可见。'},
    {id:'T9-02', title:'T9-02 · Teams 从分散到共享', headline:'Stop chasing files. Start creating together.', caseId:'919570584', guide:0, gif:true, gifKB:142,
      audience:'小型游戏团队 / 项目负责人',
      audit:'Before / After 表达文件分散与团队工作区的区别；主张、关系和结果在静态图中完整呈现。GIF 只强调连接，是工作流示意，不是真实产品录屏，也不代表自动导入或已测量的时间节省。'},
    {id:'A9-01', title:'A9-01 · API 接入开发工具', headline:'Add 3D generation to your tools.', caseId:'1345490926', guide:5, gif:true, gifKB:198,
      audience:'游戏开发者 / 工具与管线工程师',
      audit:'把图像提交、任务跟踪、模型取回作为异步接入流程。主张是可把生成能力接入自有工具，不是假称已经完成某款引擎集成。GIF 只提示连接关系，不展示真实耗时、即时完成或成功率保证。'},
    {id:'A9-02', title:'A9-02 · API 真实输入输出', headline:'One image in. A 3D model out.', caseId:'1150183744', guide:3,
      audience:'技术美术 / 游戏工具开发者',
      audit:'对应展示原始参考图片与真实模型的 Blender 白模渲染。打光和材质用于看清几何，不把渲染美化称为生成质量提升，不承诺每个输出无需检查即可进入正式游戏。'}
  ].map(x => ({...x, file:`assets/v9/${x.id}.png`, svg:`assets/v9/${x.id}.svg`, gifFile:x.gif?`assets/v9/${x.id}.gif`:null}));
  currentAds.unshift(...[
    {id:'T11-01',title:'T11-01 · Teams 共享工作区',headline:'One team. One shared workspace.',caseId:'919570584',guide:4,audience:'游戏工作室负责人 / 美术负责人',audit:'真实模型原 PBR 与共享资产库概念分组。不是实际产品 UI，不暗示实时共同编辑。'},
    {id:'T11-02',title:'T11-02 · Teams 从分散到共享',headline:'Less file chasing. More creating.',caseId:'919570584',guide:0,audience:'小型游戏团队 / 制作负责人',audit:'前后展示同一批真实模型，变化仅为文件组织示意；不声称模型质量或效率因此自动提高。'},
    {id:'A11-01',title:'A11-01 · API 接入开发工具',headline:'Add 3D generation to your game tools.',caseId:'1345490926',guide:5,audience:'游戏开发者 / 管线工程师',audit:'真实模型配合工具接入概念；Submit / Track / Retrieve 保持异步，不声称已经完成引擎集成。'},
    {id:'A11-02',title:'A11-02 · API 真实输入输出',headline:'From reference to 3D.',caseId:'1150183744',guide:3,audience:'技术美术 / 资产工具开发者',audit:'原始参考图与对应 Tripo 模型，同一网格真实不同相机视角；不是镜像，不是 GPT 重绘，不承诺 game-ready。'}
  ].map(x=>({...x,file:`assets/v11/${x.id}.png`,svg:`assets/v11/${x.id}.svg`,gifFile:null})));
  currentAds.unshift(...[
    {id:'T12-01',title:'T12-01 · GPT 概念 / Teams 共享资产库',headline:'One team. One asset library.',caseId:'919570584',guide:4,audience:'游戏工作室负责人 / 美术负责人',audit:'原创鹭鸟档案师与道具套组为 GPT 二维概念，不是 Tripo 输出。分组表达共享资产库；不承诺自动统一风格或实时共编。'},
    {id:'T12-02',title:'T12-02 · GPT 概念 / Teams 从分散到共享',headline:'Less file chasing. More creating.',caseId:'919570584',guide:0,audience:'游戏制作负责人 / 团队管理员',audit:'同一套 GPT 概念资产的组织关系示意；左右复用相同图，不表示 Teams 改善模型质量或自动迁移文件。'},
    {id:'A12-01',title:'A12-01 · GPT 概念 / API 工具接入',headline:'Add 3D generation to your game tools.',caseId:'1345490926',guide:5,audience:'游戏工具开发者 / 管线工程师',audit:'修复机械兽为 GPT 概念主体，游戏工具与 API 连接为集成示意；不是实际接口输出、现成引擎插件或同步返回演示。'},
    {id:'A12-02',title:'A12-02 · GPT 概念 / API 异步编排',headline:'Build your 3D generation workflow.',caseId:'1150183744',guide:3,audience:'技术美术 / 管线工程师',audit:'Submit / Track / Retrieve 为异步流程概念；成功后取得输出。机械兽不是 Tripo 实际模型，也不声称已通过游戏验收。'}
  ].map(x=>({...x,file:`assets/v12/${x.id}.png`,svg:`assets/v12/${x.id}.svg`,gifFile:null})));
  currentAds.unshift(...[
    {id:'T13-01',title:'T13-01 · 自有素材 / Teams 共享资产',headline:'One team. One asset library.',caseId:'919570584',guide:4,audience:'游戏工作室负责人 / 美术负责人',alt:'T13-01 Teams 广告：自有角色原始彩色输入，搭配共享资产关系示意；不是贴图模型渲染或产品 UI。',audit:'原始彩色输入作为角色视觉，不冒充模型贴图渲染。Workspace concept 说明共享资产与管理关系；不表示实时共编或自动统一风格。待审稿。'},
    {id:'T13-02',title:'T13-02 · 真实白模 / Teams 共享工作区',headline:'One team. One 3D workspace.',caseId:'919570584',guide:0,audience:'制作负责人 / 团队管理员',alt:'T13-02 Teams 广告：真实无贴图模型白模渲染及团队工作区示意。',audit:'对应真实无贴图模型用于看清几何；Workspace concept 是工作区关系示意，不是产品操作截图、自动迁移或实测效率。待审稿。'},
    {id:'A13-01',title:'A13-01 · 真实白模 / API 工具接入示意',headline:'Add 3D to your tools.',caseId:'1345490926',guide:5,audience:'游戏开发者 / 工具与管线工程师',alt:'A13-01 API 广告：原始输入与对应真实白模，接口连接为 Workflow illustration；不是本次 API 实测结果。',audit:'原始输入与对应真实白模说明图像和模型的关系；接口连接为 Workflow illustration。没有该资产本次 API 运行收据，不称为 API 实测输出或已完成引擎集成。待审稿。'},
    {id:'A13-02',title:'A13-02 · 真实白模 / API 异步流程示意',headline:'Your pipeline. A new dimension.',caseId:'1150183744',guide:3,audience:'技术美术 / 工具与管线工程师',alt:'A13-02 API 广告：原始输入和真实白模，提交、跟踪、成功后取回的异步流程示意。',audit:'Submit / Track / Retrieve 说明异步任务，成功后取回输出。Workflow illustration 不是本次调用日志；真实模型不代表 game-ready、已绑骨或 8K/PBR。待审稿。'}
  ].map(x=>({...x,file:`assets/v13/${x.id}.png`,svg:`assets/v13/${x.id}.svg`,gifFile:null})));
  currentAds.unshift(...[
    {id:'T14-01',title:'T14-01 · GPT 概念 / Teams 共享资产库',headline:'One team. One asset library.',caseId:'919570584',guide:4,audience:'游戏工作室负责人 / 美术负责人',alt:'T14-01：原创 GPT 二维探索角色、无人机和信标在共同资产库；AI-generated concept artwork / Workspace concept，不是真实模型或产品 UI。',audit:'同项目的角色与道具连接美术、开发与共享库，讲清团队关系。全部为 GPT 二维概念；Workspace concept 不是实际工作区，不表示自动统一风格、实时共编或资产无条件可见。待审稿。'},
    {id:'T14-02',title:'T14-02 · GPT 概念 / Teams 共享积分与管理',headline:'Shared credits. Clear controls.',caseId:'919570584',guide:0,audience:'游戏制作负责人 / 工作室管理员',alt:'T14-02：原创 GPT 二维探索角色与共享积分、成员、管理员关系；AI-generated concept artwork / Workspace concept，不是产品截图。',audit:'共享积分和成员管理以无数字关系图说明；不虚构余额、产出或统计。GPT 角色不是 Tripo 生成成果；Teams 资源不暗示 API 共用 Studio 积分。待审稿。'},
    {id:'A14-01',title:'A14-01 · GPT 概念 / API 接入游戏工具',headline:'Add 3D creation to your tools.',caseId:'1345490926',guide:5,audience:'游戏工具开发者 / 技术美术与管线工程师',alt:'A14-01：原创 GPT 二维科考 rover 与 Your tool、Tripo API、3D assets 接入关系；AI-generated concept artwork / Workflow illustration，不是 API 实测。',audit:'rover 与 Your tool → Tripo API → 3D assets 说明可接入的工作关系。GPT 二维概念不是模型输出；仍需开发者实现，不表示已经完成引擎集成、零代码或同步返回。待审稿。'},
    {id:'A14-02',title:'A14-02 · GPT 概念 / API 异步任务',headline:'Submit. Track. Retrieve.',caseId:'1150183744',guide:3,audience:'游戏工具开发者 / 技术负责人',alt:'A14-02：原创 GPT 二维科考 rover 与提交图像、跟踪任务、成功后取回关系；AI-generated concept artwork / Workflow illustration。',audit:'Submit image / Track task / Retrieve on success 清楚分开异步阶段。无本次 API 运行收据，GPT 图不是实际输入输出，不暗示即时完成、成功保证、已绑骨或 game-ready。待审稿。'}
  ].map(x=>({...x,file:`assets/v14/${x.id}.png`,svg:`assets/v14/${x.id}.svg`,gifFile:null})));
  currentAds.unshift(...[
    {id:'T15-01',title:'T15-01 · 中台衍生 AI 主视觉 / Teams 共享资产库',headline:'One team. One asset library.',caseId:'919570584',guide:4,audience:'游戏工作室负责人 / 美术负责人',alt:'T15-01：自有中台输入衍生的 GPT hero 图39602与共享库关系；AI concept / Workspace concept，不是实际贴图模型或产品UI。',audit:'以自有中台输入衍生的GPT二维角色主视觉连接共享资产库。AI concept不是实际贴图模型，Workspace concept不是产品UI或实时共编；不证明自动风格一致、模型质量提升或无条件共享。待审稿。'},
    {id:'T15-02',title:'T15-02 · 中台衍生 AI 主视觉 / Teams 积分与管理',headline:'Shared credits. Clear controls.',caseId:'919570584',guide:0,audience:'游戏制作负责人 / 工作室管理员',alt:'T15-02：中台输入衍生GPT角色与共享积分、成员、管理员关系；AI concept / Workspace concept，不是实际贴图模型。',audit:'共享积分、成员与管理员以概念关系图说明，无虚构余额或产量。角色是中台输入衍生GPT二维图，不是模型渲染；不表示API共用Studio积分或实时共编。待审稿。'},
    {id:'A15-01',title:'A15-01 · 既有真实白模 / API 工具接入',headline:'Add 3D creation to your tools.',caseId:'1345490926',guide:5,audience:'游戏工具开发者 / 技术美术与管线工程师',alt:'A15-01：中台235对应既有真实FBX的Blender白模与工具接入示意；Existing mesh / Workflow illustration，不是本次API生成。',audit:'中台235既有真实FBX经Blender白模呈现，搭配工具、API与结果关系示意。旧资产不是本次API生成，批次不证明引擎版本；不承诺免代码、同步返回、现成引擎集成或game-ready。待审稿。'},
    {id:'A15-02',title:'A15-02 · 真实网格局部 / API 异步任务',headline:'Submit. Track. Retrieve.',caseId:'1150183744',guide:3,audience:'游戏工具开发者 / 技术负责人',alt:'A15-02：中台235既有真实FBX的Blender白模和局部真实黑线框，搭配异步任务关系；不是GPT假线框或本次API生成。',audit:'真实白模与局部黑线框来自中台235既有网格，不使用失败三视图。Submit / Track / Retrieve是Workflow illustration，成功后取回；无本次API调用收据，不暗示即时成功、全四边面、重拓扑或游戏验收。待审稿。'}
  ].map(x=>({...x,file:`assets/v15/${x.id}.png`,svg:`assets/v15/${x.id}.svg`,gifFile:null})));
  const caseNames = {
    '1345490926':'Runway · 一句话展示产品能力',
    '1150183744':'Runway · 直接展示编辑动作',
    '1474713154':'Autodesk · 大字与行业画面',
    '1476401124':'Autodesk · 机械模型与图纸',
    '1524984686':'Autodesk · 促销素材（仅 250px）',
    '919570584':'Spline · 直接点出团队人群'
  };
  const legacyVisualCategories = {
    '1345490926':'产品动作', '1150183744':'产品动作', '1474713154':'大字与行业场景',
    '1476401124':'模型与工程细节', '1524984686':'促销与产品界面', '919570584':'人群与材质主视觉'
  };
  let staticCases = [];
  let filteredCases = [];
  let candidateCases = [];
  let userCases = [];
  let filteredUserCases = [];
  let caseBrand = 'all';
  let caseVisual = 'all';
  let userCategory = 'all';
  let selectedUserId = '';
  let selectedGuideIndex = 4;
  let dataLoaded = false;
  let selectedAd = 0;
  let mainGifPlaying = false;
  const gifCards = [];

  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function sourceLink(text, url) {
    const link = el('a', text, 'source');
    setSourceLink(link, text, url);
    return link;
  }
  function setSourceLink(link, text, url) {
    link.textContent = text;
    link.target = '_blank'; link.rel = 'noreferrer';
    let safe = false;
    try { safe = !!url && ['http:', 'https:'].includes(new URL(url, location.href).protocol); } catch (_) { /* Invalid source URL. */ }
    link.hidden = !safe;
    if (safe) link.href = url;
    else link.removeAttribute('href');
  }
  function evidenceDetails(summary, paragraphs) {
    const details = el('details', null, 'evidence-details');
    details.append(el('summary', summary));
    paragraphs.filter(Boolean).forEach(text => details.append(el('p', text)));
    return details;
  }
  function downloadLink(text, url) {
    const link = el('a', text, 'download');
    link.href = url; link.download = url.split('/').pop();
    return link;
  }
  function fillSelect(id, items) {
    $(id).replaceChildren();
    items.forEach((item, i) => {
      const option = el('option', item.title);
      option.value = String(i); $(id).append(option);
    });
    $(id).disabled = !items.length;
  }
  function fillFilter(id, values, allLabel, selected = 'all') {
    const select = $(id);
    select.replaceChildren();
    [ ['all', allLabel], ...values.map(value => [value, value]) ].forEach(([value, label]) => {
      const option = el('option', label); option.value = value; select.append(option);
    });
    select.value = values.includes(selected) ? selected : 'all';
    select.disabled = !values.length;
  }
  function setImage(img, link, error, src, alt, onLoaded) {
    img.hidden = false;
    if (link) { link.hidden = false; link.href = src; }
    error.hidden = true;
    img.alt = alt;
    img.onload = () => {
      img.hidden = false; error.hidden = true;
      if (onLoaded) onLoaded(img);
    };
    img.onerror = () => {
      img.hidden = true;
      if (link) link.hidden = true;
      error.textContent = /^https?:/.test(src)
        ? '原档案图片暂时无法加载。请查看下方档案来源；本站没有转存此图。'
        : '此图片暂时未加载。请刷新或稍后重试；也可查看下方来源。';
      error.hidden = false;
      if (onLoaded) onLoaded(null);
    };
    img.src = src;
  }
  function setMainImage(kind, item, src = item.file) {
    $(kind+'-size').textContent = '正在读取图片…';
    setImage($(kind+'-img'), $(kind+'-link'), $(kind+'-error'), src, item.alt || item.headline || item.title, img => {
      $(kind+'-size').textContent = img ? `${img.naturalWidth} × ${img.naturalHeight} px` : '未成功读取图片';
    });
    $(kind+'-caption').textContent = item.title;
  }
  function clearMainImage(kind, message) {
    const img = $(kind+'-img');
    img.onload = null; img.onerror = null; img.removeAttribute('src'); img.hidden = true;
    $(kind+'-link').hidden = true;
    $(kind+'-error').textContent = message; $(kind+'-error').hidden = false;
    $(kind+'-caption').textContent = ''; $(kind+'-size').textContent = '';
  }
  function imageCard(item) {
    const wrap = el('div', null, 'image-wrap');
    const link = sourceLink('', item.file);
    link.className = '';
    const img = el('img'); img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer';
    const error = el('p', null, 'image-error'); error.hidden = true;
    link.append(img); wrap.append(link, error);
    setImage(img, link, error, item.file, item.alt || item.headline || item.title);
    return {wrap, link, img, error};
  }
  function renderCase() {
    const item = filteredCases[Number($('case').value)];
    if (!item) {
      clearMainImage('case', dataLoaded ? '此品牌与视觉类型组合暂无已目视案例。请调整筛选，或查看下方候选来源。' : '正在读取案例…');
      $('case-source').hidden = true; $('case-archive').hidden = true;
      $('case-note').textContent = ''; $('case-verification').replaceChildren();
      return;
    }
    setMainImage('case', item);
    setSourceLink($('case-source'), `官方详情 · ${item.id} ↗`, item.officialUrl);
    setSourceLink($('case-archive'), '档案来源 ↗', item.archiveUrl);
    $('case-note').textContent = (item.visualObservations || [])[0] || `${item.brand} / ${item.visualCategory}`;
    $('case-verification').replaceChildren();
    [item.verification, ...(item.visualObservations || []).slice(1), item.width < 500 ? `原素材仅 ${item.width} × ${item.height}px，放大只作构图参考。` : '', '目视确认不等于官方投放验证，也不说明当前在投或效果优劣。'].filter(Boolean).forEach(text => $('case-verification').append(el('p', text)));
  }
  function renderGuide() {
    const isUser = !guides.length || $('reference-kind').value === 'user';
    const items = isUser ? filteredUserCases : guides;
    const index = Number($('guide').value);
    const item = items[index];
    if (!item) {
      clearMainImage('guide', dataLoaded ? '当前选择没有可用的参考图片。请调整分类或参考来源。' : '正在读取参考图片…');
      $('guide-source').hidden = true; $('guide-note').textContent = ''; $('guide-caution').textContent = '';
      return;
    }
    setMainImage('guide', item);
    if (isUser) {
      selectedUserId = item.id;
      setSourceLink($('guide-source'), `${item.id} · 用户提供原图 ↗`, item.file);
      $('guide-note').textContent = item.learning;
      $('guide-caution').textContent = `${item.sourceType} / ${item.filename}。${item.caution}`;
    } else {
      selectedGuideIndex = index;
      setSourceLink($('guide-source'), '飞书规范原位置 ↗', `${guideBase}#${item.anchor}`);
      $('guide-note').textContent = item.lesson;
      $('guide-caution').textContent = `内部规范截图，保留文档水印与参考线。${item.caution}`;
    }
  }
  function refreshRightSelection() {
    const isUser = !guides.length || $('reference-kind').value === 'user';
    $('right-user-filter').hidden = !isUser;
    const items = isUser ? filteredUserCases : guides;
    fillSelect('guide', items);
    $('guide').setAttribute('aria-label', isUser ? '选择用户提供的广告案例' : '选择内部规范截图');
    const index = isUser ? items.findIndex(item => item.id === selectedUserId) : selectedGuideIndex;
    if (index >= 0 && index < items.length) $('guide').value = String(index);
    renderGuide();
  }
  function updateCounts() {
    $('catalog-summary').textContent = `18 张当前封面与 6 张站内信配图已重排 · 历史八条站内信保留 · ${staticCases.length} 条静态档案与 ${userCases.length} 张用户案例`;
    const countText = `筛选显示 ${filteredCases.length} / ${staticCases.length} 条已目视案例`;
    $('case-filter-count').textContent = countText;
    $('case-gallery-count').textContent = countText;
    $('user-case-count').textContent = `当前分类 ${filteredUserCases.length} / ${userCases.length} 张用户提供的案例`;
    const referenceOptions = $('reference-kind').options;
    if (referenceOptions?.[0]) referenceOptions[0].textContent = `用户提供 ${userCases.length} 张`;
    if (referenceOptions?.[1]) referenceOptions[1].textContent = `规范截图 ${guides.length} 张`;
  }
  function applyCaseFilters(preferredId) {
    const previousId = preferredId || filteredCases[Number($('case').value)]?.id;
    ['case-brand', 'gallery-brand'].forEach(id => { $(id).value = caseBrand; });
    ['case-visual', 'gallery-visual'].forEach(id => { $(id).value = caseVisual; });
    filteredCases = staticCases.filter(item => (caseBrand === 'all' || item.brand === caseBrand) && (caseVisual === 'all' || item.visualCategory === caseVisual));
    fillSelect('case', filteredCases);
    const index = filteredCases.findIndex(item => item.id === previousId);
    if (index >= 0) $('case').value = String(index);
    renderCase(); renderCasesGallery(); updateCounts();
  }
  function applyUserFilter() {
    ['right-user-category', 'user-category'].forEach(id => { $(id).value = userCategory; });
    filteredUserCases = userCases.filter(item => userCategory === 'all' || item.category === userCategory);
    renderUserGallery();
    if ($('reference-kind').value === 'user') refreshRightSelection();
    updateCounts();
  }
  function showMainStatic() {
    const item = currentAds[selectedAd];
    mainGifPlaying = false;
    $('mode-image').setAttribute('aria-pressed', 'true');
    $('mode-gif').setAttribute('aria-pressed', 'false');
    $('mode-gif').textContent = '播放轻动效 GIF';
    setMainImage('current', item);
    $('media-status').textContent = item.gif
      ? '完整静态稿。可手动播放 4 秒轻动效；点击“静态 PNG”即可停止。'
      : '这张只提供静态稿，没有额外 GIF。';
  }
  function stopGifCards() {
    gifCards.forEach(card => {
      if (!card.playing) return;
      card.playing = false;
      setImage(card.img, card.link, card.error, card.ad.file, card.ad.headline);
      card.button.textContent = '播放轻动效 GIF';
      card.button.setAttribute('aria-pressed', 'false');
    });
  }
  function playMainGif() {
    const item = currentAds[selectedAd];
    if (!item.gif) return;
    stopGifCards();
    if (mainGifPlaying) { showMainStatic(); return; }
    mainGifPlaying = true;
    setMainImage('current', item, item.gifFile);
    $('mode-image').setAttribute('aria-pressed', 'false');
    $('mode-gif').setAttribute('aria-pressed', 'true');
    $('mode-gif').textContent = '停止 GIF，返回静态';
    $('media-status').textContent = 'GIF 播放中：1200 × 1200 / 40 帧 / 4 秒。仅连接强调，不是模型生成耗时演示。';
  }
  function selectAd(index, pair = true) {
    selectedAd = index;
    const item = currentAds[index];
    stopGifCards(); $('current').value = String(index);
    $('mode-gif').disabled = !item.gif;
    $('download-png').href = item.file;
    $('download-png').download = `${item.id}.png`;
    $('download-svg').href = item.svg;
    $('download-svg').download = `${item.id}.svg`;
    $('download-gif').hidden = !item.gif;
    if (item.gif) { $('download-gif').href = item.gifFile; $('download-gif').download = `${item.id}.gif`; }
    showMainStatic();
    if (pair) {
      const caseIndex = filteredCases.findIndex(x => x.id === item.caseId);
      if (caseIndex >= 0) $('case').value = String(caseIndex);
      selectedGuideIndex = item.guide;
      if ($('reference-kind').value === 'guide') refreshRightSelection();
    }
    renderCase(); renderGuide();
    $('ad-audit').textContent = `${item.audience}。${item.audit}`;
    document.querySelectorAll('[data-v9-ad]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.v9Ad) === index)));
  }
  function jumpToCompare() {
    $('compare').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function renderCurrentGallery() {
    currentAds.forEach((item, index) => {
      const card = el('article'); card.append(imageCard(item).wrap);
      card.append(el('span', item.audience, 'tag'), el('h3', item.headline), el('p', item.title, 'note'));
      const links = el('div', null, 'downloads');
      links.append(downloadLink('PNG', item.file), downloadLink('SVG 源稿', item.svg));
      card.append(links);
      const button = el('button', '放入左列对比');
      button.onclick = () => { selectAd(index); jumpToCompare(); };
      card.append(button); $('ad-gallery').append(card);
    });
  }
  function renderCasesGallery() {
    $('case-gallery').replaceChildren();
    if (!filteredCases.length) $('case-gallery').append(el('p', '这个筛选组合暂无已目视静态案例。请选择其他品牌或视觉类型。', 'empty-state'));
    filteredCases.forEach((item, index) => {
      const card = el('article'); card.append(imageCard(item).wrap);
      card.append(el('span', `${item.brand} / ${item.visualCategory}${item.width < 500 ? ` / 低清 ${item.width}px` : /^https?:/.test(item.file) ? ' / 原站外链' : ''}`, item.width < 500 ? 'tag low-res':'tag'), el('h3', item.title));
      if (item.visualObservations?.length) card.append(el('p', item.visualObservations[0]));
      card.append(evidenceDetails('观察细节与核验状态', [...(item.visualObservations || []).slice(1), item.verification]), sourceLink('官方详情 ↗', item.officialUrl), sourceLink('档案来源 ↗', item.archiveUrl));
      const button = el('button', '放入中间列对比');
      button.onclick = () => { $('case').value = String(index); renderCase(); jumpToCompare(); };
      card.append(el('br'), button); $('case-gallery').append(card);
    });
  }
  function renderGuidesGallery() {
    if (!guides.length || !$('guide-gallery')) return;
    guides.forEach((item, index) => {
      const card = el('article'); card.append(imageCard(item).wrap, el('span', '内部规范文档截图 / 历史示例', 'tag'), el('h3', item.title), el('p', item.lesson), evidenceDetails('历史参数与使用边界', [item.caution]), sourceLink('飞书规范原位置 ↗', `${guideBase}#${item.anchor}`));
      const button = el('button', '放入右列对比');
      button.onclick = () => { $('reference-kind').value = 'guide'; selectedGuideIndex = index; refreshRightSelection(); jumpToCompare(); };
      card.append(el('br'), button); $('guide-gallery').append(card);
    });
  }
  function renderUserGallery() {
    $('user-case-gallery').replaceChildren();
    if (!filteredUserCases.length) $('user-case-gallery').append(el('p', '此分类暂无已载入的用户案例。', 'empty-state'));
    filteredUserCases.forEach(item => {
      const card = el('article');
      card.append(imageCard(item).wrap, el('span', `${item.id} / ${item.category}${/\.jpe?g$/i.test(item.filename) ? ' / 资产展示图' : ''}`, 'tag'), el('h3', item.title), el('p', item.learning), evidenceDetails('来源与使用边界', [item.sourceType, item.filename, item.caution]), sourceLink('用户提供原图 ↗', item.file));
      const button = el('button', '放入右列对比');
      button.onclick = () => { $('reference-kind').value = 'user'; selectedUserId = item.id; refreshRightSelection(); jumpToCompare(); };
      card.append(el('br'), button); $('user-case-gallery').append(card);
    });
  }
  function renderCandidates() {
    $('candidate-details').hidden = !candidateCases.length;
    $('candidate-summary').textContent = `${candidateCases.length} 条未纳入主图库的研究候选`;
    $('candidate-list').replaceChildren();
    candidateCases.forEach(item => {
      const row = el('li', `${item.brand || '品牌待核验'} · ${item.title || item.id}。${item.verification || '尚未完成图片目视核验。'}`);
      row.append(el('br'), sourceLink('官方来源 ↗', item.officialUrl), sourceLink('档案线索 ↗', item.archiveUrl));
      $('candidate-list').append(row);
    });
  }
  function renderGifs() {
    currentAds.filter(item => item.gif).forEach(item => {
      const article = el('article');
      const media = imageCard(item);
      const button = el('button', '播放轻动效 GIF'); button.setAttribute('aria-pressed', 'false');
      const state = {...media, ad:item, button, playing:false}; gifCards.push(state);
      button.onclick = () => {
        const next = !state.playing;
        stopGifCards();
        if (mainGifPlaying) showMainStatic();
        if (next) {
          state.playing = true;
          setImage(state.img, state.link, state.error, item.gifFile, `${item.headline} 轻动效`);
          button.textContent = '停止 GIF，返回静态'; button.setAttribute('aria-pressed', 'true');
        }
      };
      article.append(media.wrap, el('h3', item.headline), el('p', `${item.id} / 1200 × 1200 / 4 秒 / 40 帧 / 约 ${item.gifKB} KB`, 'dimensions'));
      const controls = el('div', null, 'downloads'); controls.append(button, downloadLink('下载 GIF', item.gifFile));
      article.append(controls, el('p', '仅连接高亮。停止会返回静态图，不保证停留在当前帧。', 'note'));
      $('gif-gallery').append(article);
    });
  }
  async function getItems(path, optional = false) {
    const response = await fetch(path, {cache:'no-store'});
    if (optional && response.status === 404) return [];
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error(`${path}: 数据不是数组`);
    return items;
  }
  function normalizeCase(item, legacy = false) {
    const knownLegacy = legacy && Object.prototype.hasOwnProperty.call(caseNames, String(item.id));
    const rawVerification = item.verification || item.viewingStatus || item.provenance;
    return {...item, id:String(item.id), brand:item.brand || '未分类品牌',
      title:knownLegacy ? caseNames[item.id] : item.title || `${item.brand || '案例'} · ${item.id}`,
      visualCategory:Array.isArray(item.visualCategory) ? item.visualCategory.join(' / ') : item.visualCategory || legacyVisualCategories[item.id] || '其他视觉',
      visualVerified:knownLegacy || item.visualVerified === true,
      verification:typeof rawVerification === 'string' ? rawVerification : rawVerification ? JSON.stringify(rawVerification) : '已目视查看静态图片；官方投放身份及效果须以来源记录为准。'};
  }
  async function init() {
    window.addEventListener('tripo:compare-ad', event => {
      const index = currentAds.findIndex(item => item.id === event.detail?.id);
      if (index >= 0) { selectAd(index); jumpToCompare(); }
    });
    fillSelect('current', currentAds); refreshRightSelection();
    renderCurrentGallery(); renderGuidesGallery(); renderGifs();
    document.querySelectorAll('[data-v9-ad]').forEach(button => button.onclick = () => selectAd(Number(button.dataset.v9Ad)));
    $('current').onchange = () => selectAd(Number($('current').value));
    $('case').onchange = renderCase; $('guide').onchange = renderGuide;
    $('reference-kind').onchange = refreshRightSelection;
    ['case-brand', 'gallery-brand'].forEach(id => { $(id).onchange = () => { caseBrand = $(id).value; applyCaseFilters(); }; });
    ['case-visual', 'gallery-visual'].forEach(id => { $(id).onchange = () => { caseVisual = $(id).value; applyCaseFilters(); }; });
    ['right-user-category', 'user-category'].forEach(id => { $(id).onchange = () => { userCategory = $(id).value; applyUserFilter(); }; });
    $('mode-image').onclick = () => { stopGifCards(); showMainStatic(); };
    $('mode-gif').onclick = playMainGif;
    $('mobile').onclick = () => {
      const on = document.body.classList.toggle('compare-mobile');
      $('mobile').setAttribute('aria-pressed', String(on));
      $('mobile').textContent = on ? '恢复自适应宽度' : '360px 手机宽度';
    };
    const hashIndex = currentAds.findIndex(item => `#${item.id.toLowerCase()}` === location.hash.toLowerCase());
    selectAd(hashIndex < 0 ? 0 : hashIndex);
    window.addEventListener('hashchange', () => {
      const index = currentAds.findIndex(item => `#${item.id.toLowerCase()}` === location.hash.toLowerCase());
      if (index >= 0) selectAd(index);
    });
    const results = await Promise.allSettled([getItems('cases-linkedin.json'), getItems('cases-spline-static.json'), getItems('cases-ai-expanded.json', true), getItems('user-cases.json')]);
    const values = results.map(result => result.status === 'fulfilled' ? result.value : []);
    const legacy = [...values[0], ...values[1]].filter(item => item.type === 'image').map(item => normalizeCase(item, true));
    const expanded = values[2].map(item => normalizeCase(item));
    const approved = [...legacy, ...expanded].filter(item => item.type === 'image' && item.file && item.visualVerified === true);
    staticCases = [...new Map(approved.map(item => [item.id, item])).values()];
    candidateCases = expanded.filter(item => !(item.type === 'image' && item.file && item.visualVerified === true) && !staticCases.some(approvedItem => approvedItem.id === item.id));
    userCases = values[3].filter(item => item.id && item.filename && item.title).map(item => ({...item, file:`assets/user-cases/${encodeURIComponent(item.filename)}`}));
    const brands = [...new Set(staticCases.map(item => item.brand))].sort();
    const visuals = [...new Set(staticCases.map(item => item.visualCategory))].sort();
    const categories = ['角色', '拆分', '材质', '建筑', '模型对照'].filter(category => userCases.some(item => item.category === category));
    ['case-brand', 'gallery-brand'].forEach(id => fillFilter(id, brands, '全部品牌', caseBrand));
    ['case-visual', 'gallery-visual'].forEach(id => fillFilter(id, visuals, '全部类型', caseVisual));
    ['right-user-category', 'user-category'].forEach(id => fillFilter(id, categories, '全部分类', userCategory));
    dataLoaded = true;
    applyCaseFilters(currentAds[selectedAd].caseId); applyUserFilter(); renderCandidates();
    if (results.some(result => result.status === 'rejected')) {
      $('load-error').hidden = false;
      $('load-error').textContent = `部分案例清单未加载：当前可用 ${staticCases.length} 条档案与 ${userCases.length} 张用户图。请刷新或稍后重试；最新与历史素材仍可用。`;
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopGifCards(); if (mainGifPlaying) showMainStatic(); }
  });
  init().catch(error => {
    $('load-error').hidden = false;
    $('load-error').textContent = '页面初始化失败。请刷新或稍后重试；也可通过上方 ZIP 下载创意素材。';
    console.error(error);
  });
})();
