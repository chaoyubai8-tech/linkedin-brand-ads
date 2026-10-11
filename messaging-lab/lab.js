(() => {
  'use strict';
  const groups = [
    {id:'teams-us',label:'Teams · 美国游戏',direction:'降本增效 / Workflow',conclusion:'用真实团队任务解释创建、查找与复用；不以好看的单个模型替代共享工作区价值。'},
    {id:'teams-eu',label:'Teams · 欧洲游戏',direction:'商业化 / 具体游戏项目用途',conclusion:'同一欧洲游戏人群，说明角色与道具在游戏项目中的用途；不增加细分角色或收益保证。'},
    {id:'api-us',label:'API · 美国游戏＋3D资产',direction:'降本增效 / Workflow',conclusion:'说明生成如何接入自己的工具，并区分任务成功、资产验收和后续使用。'},
    {id:'api-eu',label:'API · 欧洲企业内容',direction:'商业化 / 产品展示用途',conclusion:'同一欧洲企业内容人群，固定自有内容平台的产品展示用途；生成审核和展示接入仍由调用方负责。'}
  ];
  const modes=['preview','path','why','check'];
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl=value=>{try{if(!/^https?:\/\//i.test(String(value)))return '';const url=new URL(String(value));return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}};
  const plain=value=>typeof value==='string'?value:typeof value==='number'?String(value):'';
  let data, research={}, selected, mode='preview', steps=[], route=null;
  let renderReady=false;
  const activeGroup=()=>groups.find(group=>group.id===selected?.groupId)||groups[0];
  const getNode=id=>selected.nodes.find(node=>node.id===id);
  const nodeName=(node,zh)=>zh?(node.labelZh||'回复'):(node.id==='intro'?'Opening':`Response ${selected.nodes.indexOf(node)}`);
  const paragraphs=text=>`<div class="message-body">${esc(text)}</div>`;
  const sourceItems=(all=false)=>{
    const entries=Array.isArray(research.sources)?research.sources:Object.entries(research.sources||{}).map(([id,value])=>typeof value==='string'?{id,url:value}:{id,...value});
    const keys=new Set(selected.sourceKeys||[]);
    const found=entries.filter(item=>all||!item.id&&!item.key||keys.has(item.id||item.key)||item.scope==='platform'||item.scope==='brand');
    const fallback=Object.entries(data.sourceMap||{}).filter(([key,value])=>keys.has(key)&&safeUrl(value)).map(([id,url])=>({id,label:({'team-program':'官方团队方案与申请入口','team-workspace':'官方团队资产说明','api-quick-start':'API Quick Start','api-introduction':'API 官方能力说明'}[id]||id),url}));
    const merged=[...found,...fallback];
    return merged.filter((item,index)=>{const url=safeUrl(item.url||item.link);return url&&merged.findIndex(other=>safeUrl(other.url||other.link)===url)===index;});
  };
  const sourceHtml=(all=false)=>`<ul class="source-list">${sourceItems(all).map(item=>`<li><a href="${esc(safeUrl(item.url||item.link))}" target="_blank" rel="noopener noreferrer">${esc(item.label||item.title||item.name||item.id||'官方来源')}</a>${item.type?`<span class="meta"> · ${esc(item.type)}</span>`:''}${item.note||item.boundary?`<p>${esc(item.note||item.boundary)}</p>`:''}${item.checked?`<span class="meta">核对日期：${esc(item.checked)}</span>`:''}</li>`).join('')}</ul>`;
  function resetThread(){steps=[{id:'intro',choice:null}];route=null;}
  function setHash(){const hash=`#${selected.id}/${mode}`;if(location.hash!==hash)history.replaceState(null,'',hash);}
  function choose(id,shouldFocus=false){
    const variant=data.variants.find(item=>item.id===id);if(!variant)return;
    selected=variant;resetThread();renderAll();setHash();
    if(shouldFocus){const heading=$('selected-heading').querySelector('h2');heading.focus({preventScroll:true});}
    announce(`${variant.id}：${variant.label}`);
  }
  function renderGroupNav(){
    $('group-nav').innerHTML=`<label class="mobile-group-select" for="group-select"><span>已确认人群</span><select id="group-select">${groups.map(group=>`<option value="${esc(group.id)}" ${selected.groupId===group.id?'selected':''}>${esc(group.label)} · ${esc(group.direction)}</option>`).join('')}</select></label>${groups.map(group=>`<button type="button" class="group-button" data-group="${esc(group.id)}" aria-pressed="${selected.groupId===group.id}"><strong>${esc(group.label)}</strong><span>${esc(group.direction)}</span></button>`).join('')}`;
  }
  function renderVariants(){
    $('variant-list').innerHTML=data.variants.filter(item=>item.groupId===selected.groupId).map(item=>{const [version,...style]=item.label.split(' · ');return `<button type="button" class="variant-list-item" data-variant="${esc(item.id)}" aria-pressed="${item.id===selected.id}"><strong>${esc(item.id)} · ${esc(version)}</strong><span>${esc(style.join(' · ')||item.hookStyle||'同一诉求的文案表达')}</span></button>`;}).join('');
  }
  function renderHeading(){
    $('selected-heading').innerHTML=`<div class="variant-id">${esc(activeGroup().label)} / ${esc(selected.id)} · 创意候选</div><h2 tabindex="-1">${esc(selected.label)}</h2><p>${esc(selected.job)}</p>${selected.reviewStatus?`<p class="meta">本套状态：${esc(selected.reviewStatus)}</p>`:''}`;
  }
  function renderModeNav(){
    document.querySelectorAll('#mode-nav button').forEach(button=>{const current=button.dataset.mode===mode;button.setAttribute('aria-selected',String(current));button.tabIndex=current?0:-1;});
    modes.forEach(name=>{$(`mode-${name}`).hidden=name!==mode;});
  }
  function threadHtml(zh){
    return steps.map((step,index)=>{
      const node=getNode(step.id),last=index===steps.length-1;
      const buttons=zh?`<ul class="translation-buttons">${node.buttons.map(button=>`<li>${esc(button.labelZh)}${last?'':`（${button.action==='next'?'继续了解':'外部目的页'}）`}</li>`).join('')}</ul>`:last?`<div class="message-actions">${node.buttons.map((button,buttonIndex)=>`<button type="button" ${buttonIndex===0?'class="primary-action"':''} data-node="${esc(node.id)}" data-button="${esc(button.id)}">${esc(button.label)}</button>`).join('')}</div>`:`<ul class="past-buttons">${node.buttons.map(button=>`<li>${esc(button.label)}</li>`).join('')}</ul>`;
      return `<section class="message-step" data-step="${esc(node.id)}"><h3 class="step-title" tabindex="-1">${esc(nodeName(node,zh))}</h3>${paragraphs(zh?node.messageZh:node.message)}${buttons}${index===0?`<span class="platform-decline">${zh?'Not Interested · 平台自动入口':'Not Interested'}</span><span class="platform-note">${zh?'系统入口仅作说明，不是自定义按钮。':'Platform-provided option. Not a custom CTA.'}</span>`:''}${step.choice?`<p class="reader-choice">${zh?'你选择了':'Your selection'}：<strong>${esc(zh?step.choice.labelZh:step.choice.label)}</strong></p>`:''}</section>`;
    }).join('');
  }
  function renderPreview(){
    $('mode-preview').innerHTML=`<div class="review-toolbar"><button type="button" data-reset>从开场重看</button><button type="button" data-copy="en">复制英文全文</button><button type="button" data-copy="zh">复制完整中文</button><button type="button" data-download>下载双语 TXT</button></div><p class="preview-note">点击英文按钮体验预设分支；外部按钮只显示目的地，须手动打开。这里不是自由聊天，也不是领英实际发送界面。</p><div class="bilingual-preview"><article class="message-preview" lang="en" aria-label="英文对话预览"><header class="preview-head"><strong>English copy</strong><span>Sponsored · Review only</span></header><div class="subject"><span>Subject · optional</span><strong>${esc(selected.subject)}</strong></div><div class="sender-note">Sender to be authorized · No sender identity is claimed.</div><div class="message-thread">${threadHtml(false)}</div><div class="custom-footer">${esc(selected.footer)}</div></article><article class="message-preview" aria-label="完整中文释义"><header class="preview-head"><strong>完整中文释义</strong><span>辅助审稿，不是第二份投放稿</span></header><div class="subject"><span>主题</span><strong>${esc(selected.subjectZh)}</strong></div><div class="sender-note">发送者待授权 · 路径与左侧英文同步</div><div class="message-thread">${threadHtml(true)}</div><div class="custom-footer">${esc(selected.footerZh)}</div></article></div><div id="destination-area">${routeHtml()}</div>`;
  }
  function routeHtml(){
    if(!route)return '';
    const url=safeUrl(route.url),group=activeGroup();
    const explanation=group.id.startsWith('teams')?'按钮指向官方 Team Program 申请页；申请仍需按该页要求填写信息，名额与条款以官方页面为准。':'按钮指向 API Quick Start；文档点击不是注册、Key 创建或调用成功，工程接入与结果验收仍需完成。';
    return `<section class="destination" aria-labelledby="destination-title"><h3 id="destination-title" tabindex="-1">已选：${esc(route.label)} · ${esc(route.labelZh)}</h3><p>${esc(explanation)}</p><code>${esc(url)}</code><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">手动打开官方目的页</a><p class="meta">审稿演示没有提交资料、预约、发送广告或追踪你的选择。</p></section>`;
  }
  function renderPath(){
    const intro=getNode('intro');
    const paths=intro.buttons.map(button=>`<li><strong>${esc(button.label)}<br><small>${esc(button.labelZh)}</small></strong><span>${button.action==='next'?`预设回复：${esc(getNode(button.target)?.labelZh||button.target)} → 明确外部出口`:`直接外部行动 → ${selected.groupId.startsWith('teams')?'官方团队申请页':'API Quick Start'}`}</span></li>`).join('');
    $('mode-path').innerHTML=`<div class="path-summary"><h3>从意愿到下一步，只有必要的分支</h3><p>同一开场提供直接行动与两条了解路径；回复后仍回到本组正式目的页。没有假案例、假预约或订阅提醒。</p><ul class="path-options">${paths}</ul><p class="conclusion">结论：分支必须回答一个新问题，不靠更多按钮假装提供更多价值。</p></div>${selected.nodes.map(node=>`<section class="full-node"><h3>${esc(node.labelZh||node.id)}</h3><div class="full-node-pair"><div lang="en"><h4>英文原文 · ${Array.from(node.message).length} characters</h4><pre>${esc(node.message)}</pre><ul class="node-buttons">${node.buttons.map(button=>`<li>${esc(button.label)} → ${button.action==='next'?esc(getNode(button.target)?.labelZh||button.target):`<a href="${esc(safeUrl(button.url))}" target="_blank" rel="noopener noreferrer">正式目的页</a>`}</li>`).join('')}</ul></div><div><h4>完整中文释义</h4><pre>${esc(node.messageZh)}</pre><ul class="node-buttons">${node.buttons.map(button=>`<li>${esc(button.labelZh)} → ${button.action==='next'?esc(getNode(button.target)?.labelZh||button.target):'官方外部目的页'}</li>`).join('')}</ul></div></div></section>`).join('')}<section class="full-node"><h3>主题与补充说明</h3><div class="full-node-pair"><div lang="en"><p><strong>Subject</strong><br>${esc(selected.subject)}</p><p>${esc(selected.footer)}</p></div><div><p><strong>主题</strong><br>${esc(selected.subjectZh)}</p><p>${esc(selected.footerZh)}</p></div></div></section>`;
  }
  function relevantCases(){const all=Array.isArray(research.cases)?research.cases:[];return all.filter(item=>!item.groups&&!item.groupIds||[...(item.groups||[]),...(item.groupIds||[])].includes(selected.groupId));}
  function renderWhy(){
    const rows=[['固定人群',selected.persona],['固定工作需要',selected.job],['固定主张',selected.copyIntent],['本版表达为什么这样写',selected.whyRelevant],['人群范围不变',selected.qualification],['同组共同回答的顾虑',selected.objection],['本轮变化范围',selected.angle]];
    const groupContext=collection(research.groups).find(group=>group.id===selected.groupId);
    $('mode-why').innerHTML=`<dl class="reason-list">${rows.filter(([,value])=>value).map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p class="conclusion">组结论：${esc(groupContext?.conclusion||activeGroup().conclusion)}</p><div class="evidence-note"><strong>文案仍是候选，产品能力要有来源。</strong><p>${esc(data.evidenceNote||'四组已确认人群与主诉求固定，每组仅比较主题与开场表达；CTA和后续回复保持相同，不新增场景或策略。')}</p></div><h3>案例借鉴：只学习路径，不搬运业绩</h3>${relevantCases().map(item=>`<details class="case-note"><summary>${esc(item.label||item.title||item.name||'案例观察')}${item.page?` · PDF 第 ${esc(item.page)} 页`:''}</summary><p>${esc(item.learning||item.lesson||item.observation||item.note||'案例用于理解直接行动与继续了解的分流，不证明 Tripo 广告效果。')}</p>${item.application?`<p><strong>应用到本稿：</strong>${esc(item.application)}</p>`:''}${item.conclusion||item.boundary?`<p><strong>结论：</strong>${esc(item.conclusion||item.boundary)}</p>`:''}${safeUrl(item.url)?`<a href="${esc(safeUrl(item.url))}" target="_blank" rel="noopener noreferrer">查看案例来源</a>`:''}</details>`).join('')||'<p>参考所提供案例中的直接行动与继续了解路径；不照搬案例成效或冒充 Tripo 客户。</p>'}<h3>产品与平台来源</h3>${sourceHtml()}`;
  }
  function collection(value){return Array.isArray(value)?value:Object.entries(value||{}).map(([id,item])=>typeof item==='string'?{id,label:id,note:item}:{id,...item});}
  function itemDetail(item){return item.detail||item.finding||item.requirement||item.check||item.rule||item.description||item.note||item.boundary||item.action||item.reason||'';}
  function auditHtml(items){return items.map(item=>{const source=collection(research.sources).find(value=>[value.key,value.id].includes(item.sourceKey));const url=safeUrl(item.url||item.link||source?.url);return `<div class="audit-row"><div><strong>${esc(item.label||item.title||item.name||item.item||item.id||'核对项')}</strong>${item.status?`<div class="audit-status">${esc(item.status)}</div>`:''}</div><div><p>${esc(itemDetail(item))}</p>${item.change?`<p><strong>本次处理：</strong>${esc(item.change)}</p>`:''}${item.result||item.current?`<p class="meta">当前：${esc(item.result||item.current)}</p>`:''}${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">查看核对依据${source?.title?`：${esc(source.title)}`:''}</a>`:''}</div></div>`;}).join('');}
  function renderCheck(){
    const brand=collection(research.brandAudit),launch=collection(research.launchChecklist);
    const selectedGroup=collection(research.groups).find(group=>[group.id,group.groupId].includes(selected.groupId));
    const leaf=getNode('intro').buttons.find(button=>button.action==='website');
    $('mode-check').innerHTML=`<section class="audit-section"><h3>本套文案的承接边界</h3><dl class="reason-list"><div><dt>最终动作</dt><dd>${esc(leaf?.label)} · ${esc(leaf?.labelZh)}<br><a href="${esc(safeUrl(leaf?.url))}" target="_blank" rel="noopener noreferrer">查看正式目的页</a></dd></div><div><dt>不是哪一种承诺</dt><dd>${selected.groupId.startsWith('teams')?'团队共享不是实时共编、完整项目管理或自动生产验收。':'调用成功不是生产验收通过；API 不等于内置查看器或自动发布的内容平台。'}</dd></div>${selectedGroup?.success||selectedGroup?.metric||selectedGroup?.metrics?`<div><dt>业务验证</dt><dd>${esc(plain(selectedGroup.success)||plain(selectedGroup.metric)||plain(selectedGroup.metrics))}</dd></div>`:''}</dl></section><section class="audit-section"><h3>品牌正文逐项检查</h3>${brand.length?auditHtml(brand):'<p>品牌正文以规范的字体、Logo、术语、承诺与文字检查为准；当前审稿版不代表已完成素材与账户验收。</p>'}<p class="conclusion">结论：英文与中文含义必须一致；配图、产品事实与按钮指向必须属于同一个产品和方向。</p></section><section class="audit-section"><h3>从候选稿到正式上线</h3>${launch.length?auditHtml(launch):'<p>开投前仍需核对发送者授权、目标与可投覆盖、正式配图、表单／落地页、事件回传及审核状态。本站不修改广告账户。</p>'}${selected.leadGenUpgrade?`<details class="case-note"><summary>Lead Gen 升级条件 · 不是已配置的功能</summary><p>候选按钮：${esc(selected.leadGenUpgrade.label)}（${esc(selected.leadGenUpgrade.labelZh)}）</p><p>${esc(selected.leadGenUpgrade.why)}</p></details>`:''}<p class="conclusion">结论：先选稿、补证据与承接，再完成账户验收；本站没有发送广告。</p></section><section class="audit-section"><h3>检查来源</h3>${sourceHtml(true)}</section>`;
  }
  function renderAll(){renderGroupNav();renderVariants();renderHeading();renderPreview();renderPath();renderWhy();renderCheck();renderClaims();renderModeNav();}
  function renderClaims(){
    const product=selected.groupId.startsWith('teams')?'teams':'api';
    const claims=collection(research.claimAudit).filter(item=>item.product===product||item.product==='all');
    if(!claims.length)return;
    const dates=[...new Set(claims.map(item=>item.checked).filter(Boolean))];
    const block=`<section class="audit-section"><h3>产品承诺台账 · 本组相关项</h3><p>核验日期：${esc(dates.join(' / '))}。confirmed表示官方能力已核对；conditional表示有条件；interpretation是本轮审核约定，不是官方保证。</p>${auditHtml(claims)}<p class="conclusion">结论：保留有来源的能力，明确接入、权限和质量检查的条件；不将创意设想写成现成功能或业务成效。</p></section>`;
    const marker='<section class="audit-section"><h3>检查来源</h3>';
    $('mode-check').innerHTML=$('mode-check').innerHTML.replace(marker,block+marker);
  }
  function announce(message){$('feedback').textContent=message;}
  function exportCopy(language){
    const zh=language==='zh';
    return [`${zh?'主题':'Subject'}: ${zh?selected.subjectZh:selected.subject}`,...selected.nodes.map(node=>[`${nodeName(node,zh)}\n${zh?node.messageZh:node.message}`,...node.buttons.map(button=>`${zh?'按钮':'Button'}: ${zh?button.labelZh:button.label} → ${button.action==='website'?button.url:nodeName(getNode(button.target),zh)}`)].join('\n\n')),`${zh?'补充说明':'Footer'}: ${zh?selected.footerZh:selected.footer}`].join('\n\n');
  }
  async function copy(language){
    try{await navigator.clipboard.writeText(exportCopy(language));announce(language==='zh'?'已复制完整中文文案与按钮路径，不含内部研究理由。':'已复制英文文案与按钮路径，不含内部研究理由。');}
    catch{announce('浏览器不允许自动复制。请在“路径与全文”中选中文字复制，或下载双语 TXT。');}
  }
  function download(){
    const content=`${exportCopy('en')}\n\n${'='.repeat(32)}\n\n${exportCopy('zh')}\n`;
    const url=URL.createObjectURL(new Blob(['\uFEFF',content],{type:'text/plain;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download=`Tripo-${selected.id}-conversation.txt`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('已下载本套双语 TXT，只含广告正文、按钮路径与补充说明。');
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||!renderReady)return;
    if(button.dataset.group){choose(data.variants.find(item=>item.groupId===button.dataset.group).id,true);return;}
    if(button.dataset.variant){choose(button.dataset.variant,true);return;}
    if(button.dataset.mode){mode=button.dataset.mode;renderModeNav();setHash();return;}
    if(button.hasAttribute('data-reset')){resetThread();renderPreview();$('mode-preview').querySelector('[data-reset]').focus({preventScroll:true});announce('已回到开场。');return;}
    if(button.dataset.copy){copy(button.dataset.copy);return;}
    if(button.hasAttribute('data-download')){download();return;}
    if(button.dataset.node){
      const node=getNode(button.dataset.node),action=node?.buttons.find(item=>item.id===button.dataset.button);if(!action)return;
      if(action.action==='next'){
        if(steps.some(step=>step.id===action.target)){announce('该回复已在本次路径中显示。可从开场重看。');return;}
        steps[steps.length-1].choice=action;steps.push({id:action.target,choice:null});route=null;renderPreview();
        $('mode-preview').querySelector(`[data-step="${CSS.escape(action.target)}"] .step-title`).focus({preventScroll:true});announce(`已显示回复：${getNode(action.target).labelZh}`);
      }else if(action.action==='website'){
        route=action;renderPreview();$('destination-title').focus({preventScroll:true});announce('已显示正式目的地。没有自动跳转或提交资料。');
      }
    }
  });
  $('group-nav').addEventListener('change',event=>{if(event.target.id==='group-select'&&renderReady)choose(data.variants.find(item=>item.groupId===event.target.value).id,true);});
  $('mode-nav').addEventListener('keydown',event=>{
    const index=modes.indexOf(event.target.dataset.mode);if(index<0)return;
    let next=index;if(event.key==='ArrowRight')next=(index+1)%modes.length;else if(event.key==='ArrowLeft')next=(index-1+modes.length)%modes.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=modes.length-1;else return;
    event.preventDefault();mode=modes[next];renderModeNav();setHash();$(`tab-${mode}`).focus();
  });
  function restoreHash(){
    if(!data)return;
    const [id,requestedMode]=location.hash.slice(1).split('/');
    const variant=data.variants.find(item=>item.id===id);if(variant){selected=variant;if(modes.includes(requestedMode))mode=requestedMode;resetThread();renderAll();}
  }
  window.addEventListener('hashchange',restoreHash);
  async function start(){
    try{
      const response=await fetch('copy.json',{cache:'no-cache'});if(!response.ok)throw new Error('copy unavailable');data=await response.json();
      if(!Array.isArray(data.variants)||data.variants.length!==12||data.variants.some(item=>!groups.some(group=>group.id===item.groupId)||!Array.isArray(item.nodes)||!item.nodes.find(node=>node.id==='intro')))throw new Error('copy invalid');
      try{const context=await fetch('research.json',{cache:'no-cache'});if(context.ok)research=await context.json();}catch{research={};}
      const [id,requestedMode]=location.hash.slice(1).split('/');selected=data.variants.find(item=>item.id===id)||data.variants[0];if(modes.includes(requestedMode))mode=requestedMode;
      resetThread();renderAll();setHash();renderReady=true;
    }catch{
      $('group-nav').innerHTML='<p>交互文案暂时无法读取。</p>';
      $('mode-preview').innerHTML='<div class="error"><h3>双语文案未载入</h3><p>请检查网络并刷新本页；直接打开本地文件时，浏览器可能会限制读取。可使用下方静态全文，或打开上轮对话稿继续审阅。</p><button type="button" id="retry-load">重新读取文案</button></div>';
      $('retry-load').addEventListener('click',start);
      announce('交互未载入；没有丢失已发送信息，因为本站不发送消息。');
    }
  }
  start();
})();
