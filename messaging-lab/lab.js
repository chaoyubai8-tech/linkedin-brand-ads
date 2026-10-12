(() => {
  'use strict';
  const groups = [
    {id:'teams-us',label:'Teams · 美国游戏'},
    {id:'teams-eu',label:'Teams · 欧洲游戏'},
    {id:'api-us',label:'API · 美国游戏＋3D资产'},
    {id:'api-eu',label:'API · 欧洲企业内容'}
  ];
  const modes=['path','preview'];
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl=value=>{try{if(!/^https?:\/\//i.test(String(value)))return '';const url=new URL(String(value));return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}};
  let data, selected, mode='path', steps=[], route=null, activeForm=null;
  let renderReady=false;
  const activeGroup=()=>groups.find(group=>group.id===selected?.groupId)||groups[0];
  const getNode=id=>selected?.nodes.find(node=>node.id===id);
  const getLeadForm=id=>data?.leadForms?.find(form=>form.id===id);
  const nodeName=(node,zh)=>!node?(zh?'回复待配置':'Response not configured'):node.id==='intro'?(zh?'开场':'Opening'):`${zh?'回复':'Response'} ${selected.nodes.indexOf(node)}`;
  const usedForms=()=>[...new Set(selected.nodes.flatMap(node=>node.buttons.filter(button=>button.action==='leadgen').map(button=>button.formId)))].map(getLeadForm).filter(Boolean);
  const formValue=(form,key,zh)=>form?.[zh?`${key}Zh`:key]||'';
  function actionDestination(button,zh=false){
    if(button.action==='next')return nodeName(getNode(button.target),zh);
    if(button.action==='leadgen'){
      const form=getLeadForm(button.formId);
      return `${zh?'LinkedIn 留资表单':'LinkedIn Lead Gen Form'} → ${formValue(form,'headline',zh)||button.formId}`;
    }
    return safeUrl(button.url)|| (zh?'网页目的地待配置':'Website destination not configured');
  }
  function reveal(selector){
    const element=$('mode-preview').querySelector(selector);if(!element)return;
    element.focus({preventScroll:true});element.scrollIntoView({block:'center',behavior:'auto'});
  }
  const paragraphs=text=>`<div class="message-body">${esc(text)}</div>`;
  function resetThread(){steps=[{id:'intro',choice:null}];route=null;activeForm=null;}
  function setHash(){const hash=`#${selected.id}/${mode}`;if(location.hash!==hash)history.replaceState(null,'',hash);}
  function choose(id,shouldFocus=false){
    const variant=data.variants.find(item=>item.id===id);if(!variant)return;
    selected=variant;resetThread();renderAll();setHash();
    if(shouldFocus){const heading=$('selected-heading').querySelector('h2');heading.focus({preventScroll:true});}
    announce(`${variant.id}：${variant.label}`);
  }
  function renderGroupNav(){
    $('group-nav').innerHTML=`<label class="mobile-group-select" for="group-select"><span>人群</span><select id="group-select">${groups.map(group=>`<option value="${esc(group.id)}" ${selected.groupId===group.id?'selected':''}>${esc(group.label)}</option>`).join('')}</select></label>${groups.map(group=>`<button type="button" class="group-button" data-group="${esc(group.id)}" aria-pressed="${selected.groupId===group.id}"><strong>${esc(group.label)}</strong></button>`).join('')}`;
  }
  function renderVariants(){
    $('variant-list').innerHTML=data.variants.filter(item=>item.groupId===selected.groupId).map(item=>{const [version,...style]=item.label.split(' · ');return `<button type="button" class="variant-list-item" data-variant="${esc(item.id)}" aria-pressed="${item.id===selected.id}"><strong>${esc(item.id)} · ${esc(version)}</strong><span>${esc(style.join(' · ')||item.hookStyle||'同一诉求的文案表达')}</span></button>`;}).join('');
  }
  function renderHeading(){
    $('selected-heading').innerHTML=`<div class="variant-id">${esc(activeGroup().label)} / ${esc(selected.id)}</div><h2 tabindex="-1">${esc(selected.label)}</h2>`;
  }
  function renderModeNav(){
    document.querySelectorAll('#mode-nav button').forEach(button=>{const current=button.dataset.mode===mode;button.setAttribute('aria-selected',String(current));button.tabIndex=current?0:-1;});
    modes.forEach(name=>{$(`mode-${name}`).hidden=name!==mode;});
  }
  function threadHtml(zh){
    return steps.map((step,index)=>{
      const node=getNode(step.id),last=index===steps.length-1;
      if(!node)return '';
      const primary=node.buttons.find(button=>button.action==='leadgen')||node.buttons[0];
      const buttons=zh?`<ul class="translation-buttons">${node.buttons.map(button=>`<li>${esc(button.labelZh)}</li>`).join('')}</ul>`:last?`<div class="message-actions">${node.buttons.map(button=>`<button type="button" ${button===primary?'class="primary-action"':''} data-node="${esc(node.id)}" data-button="${esc(button.id)}">${esc(button.label)}</button>`).join('')}</div>`:`<ul class="past-buttons">${node.buttons.map(button=>`<li>${esc(button.label)}</li>`).join('')}</ul>`;
      return `<section class="message-step" data-step="${esc(node.id)}"><h3 class="step-title" tabindex="-1">${esc(nodeName(node,zh))}</h3>${paragraphs(zh?node.messageZh:node.message)}${buttons}${index===0?'<span class="platform-decline">Not Interested</span>':''}${step.choice?`<p class="reader-choice">${zh?'已选':'Selected'}：<strong>${esc(zh?step.choice.labelZh:step.choice.label)}</strong></p>`:''}</section>`;
    }).join('');
  }
  const senderHtml=()=>`<div class="sender-note"><strong>${esc(data.sender?.name||'Tripo')}</strong></div>`;
  const reviewNote=(id='form-review-note-preview')=>`<p class="form-review-note" id="${esc(id)}">审核预览，不提交资料</p>`;
  const copyToolsHtml=()=>'<button type="button" data-copy="en">复制英文</button><button type="button" data-copy="zh">复制中文</button><button type="button" data-download>下载双语 TXT</button>';
  function renderCopyTools(){if($('copy-tools'))$('copy-tools').innerHTML=copyToolsHtml();}
  const copyToolsFallback=()=>$('copy-tools')?'':`<div class="review-toolbar">${copyToolsHtml()}</div>`;
  function leadFormHtml(zh){
    if(!activeForm)return '';
    const form=getLeadForm(activeForm.id),lang=zh?'zh':'en';
    if(!form)return `<section class="leadgen-preview"><h3 id="lead-form-title-${lang}" tabindex="-1">${zh?'表单文案未配置':'Form copy not configured'}</h3><button type="button" data-form-close>${zh?'回到消息':'Back to message'}</button></section>`;
    const notice=zh?'':reviewNote();
    const controls=`<div class="leadgen-actions"><button type="button" data-form-close>${zh?'返回对话':'Back to conversation'}</button></div>`;
    if(activeForm.stage==='confirmation'){
      const confirmation=form.confirmation||{},url=safeUrl(confirmation.url);
      return `<section class="leadgen-preview leadgen-confirmation" aria-labelledby="lead-confirmation-title-${lang}">${notice}<h3 id="lead-confirmation-title-${lang}" tabindex="-1">${zh?'提交后确认':'Confirmation'}</h3>${paragraphs(formValue(confirmation,'message',zh))}<div class="confirmation-destination">${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(formValue(confirmation,'cta',zh))}</a><code>${esc(url)}</code>`:`<p>${zh?'确认页目的地待配置。':'Confirmation destination not configured.'}</p>`}</div><div class="leadgen-actions"><button type="button" data-form-back>${zh?'返回表单':'Back to form'}</button><button type="button" data-form-close>${zh?'返回对话':'Back to conversation'}</button></div></section>`;
    }
    const privacyUrl=safeUrl(form.privacyUrl);
    const fields=(form.fields||[]).map(field=>{
      const id=`lead-field-${lang}-${String(field.id).replace(/[^a-zA-Z0-9_-]/g,'')}`;
      return `<div class="leadgen-field"><label for="${esc(id)}">${esc(formValue(field,'label',zh))}</label><input id="${esc(id)}" type="text" value="" readonly disabled autocomplete="off" aria-describedby="form-review-note-preview"></div>`;
    }).join('');
    return `<section class="leadgen-preview" aria-labelledby="lead-form-title-${lang}">${notice}<h3 id="lead-form-title-${lang}" tabindex="-1">${esc(formValue(form,'headline',zh))}</h3>${paragraphs(formValue(form,'details',zh))}<div class="leadgen-fields">${fields}</div><div class="leadgen-privacy"><p>${esc(formValue(form,'privacyText',zh))}</p>${privacyUrl?`<a href="${esc(privacyUrl)}" target="_blank" rel="noopener noreferrer">${zh?'隐私政策':'Privacy Policy'}</a>`:''}</div><div class="leadgen-actions"><button type="button" class="primary-action" data-form-confirm>${zh?'查看确认页':'Preview confirmation'}</button></div>${controls}</section>`;
  }
  function renderPreview(){
    $('mode-preview').innerHTML=`${copyToolsFallback()}<div class="review-toolbar"><button type="button" data-reset>重看开场</button></div><div class="bilingual-preview"><article class="message-preview" lang="en" aria-label="英文对话预览"><header class="preview-head"><strong>English</strong><span>Sponsored</span></header><div class="subject"><span>Subject</span><strong>${esc(selected.subject)}</strong></div>${senderHtml()}<div class="message-thread">${threadHtml(false)}${leadFormHtml(false)}</div><div class="custom-footer">${esc(selected.footer)}</div></article><article class="message-preview" lang="zh-CN" aria-label="中文对话预览"><header class="preview-head"><strong>中文</strong><span>Sponsored</span></header><div class="subject"><span>主题</span><strong>${esc(selected.subjectZh)}</strong></div>${senderHtml()}<div class="message-thread">${threadHtml(true)}${leadFormHtml(true)}</div><div class="custom-footer">${esc(selected.footerZh)}</div></article></div><div id="destination-area">${routeHtml()}</div>`;
  }
  function routeHtml(){
    if(!route)return '';
    const url=safeUrl(route.url);
    return `<section class="destination" aria-labelledby="destination-title"><h3 id="destination-title" tabindex="-1">${esc(route.label)} · ${esc(route.labelZh)}</h3>${url?`<code>${esc(url)}</code><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">打开 API Quick Start</a>`:'<p>网页目的地待配置。</p>'}</section>`;
  }
  function pathButtonHtml(button,zh){
    if(button.action==='website'){
      const url=safeUrl(button.url);
      return url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${zh?'API 接入文档':'API Quick Start'}</a>`:esc(actionDestination(button,zh));
    }
    return esc(actionDestination(button,zh));
  }
  function formDefinitionHtml(form,zh){
    const confirmation=form.confirmation||{};
    return `<div lang="${zh?'zh-CN':'en'}"><h4>${zh?'中文':'English'}</h4><h4>${zh?'表单标题':'Headline'}</h4><pre>${esc(formValue(form,'headline',zh))}</pre><h4>${zh?'表单说明':'Details'}</h4><pre>${esc(formValue(form,'details',zh))}</pre><h4>${zh?'字段':'Fields'}</h4><ul>${(form.fields||[]).map(field=>`<li>${esc(formValue(field,'label',zh))}</li>`).join('')}</ul><h4>${zh?'隐私文字与政策':'Privacy text and policy'}</h4><pre>${esc(formValue(form,'privacyText',zh))}</pre><p><code>${esc(safeUrl(form.privacyUrl)|| (zh?'隐私政策待配置':'Privacy policy not configured'))}</code></p><h4>${zh?'提交后确认':'Confirmation'}</h4><pre>${esc(formValue(confirmation,'message',zh))}</pre><p><strong>${zh?'确认页按钮':'Confirmation CTA'}</strong> · ${esc(formValue(confirmation,'cta',zh))}<br><code>${esc(safeUrl(confirmation.url)|| (zh?'确认页目的地待配置':'Confirmation destination not configured'))}</code></p></div>`;
  }
  function flowEndHtml(button){
    if(button.action==='leadgen')return '<span class="flow-end">LinkedIn Lead Gen Form<br><small>领英留资表单</small></span>';
    if(button.action==='website'){
      const url=safeUrl(button.url);
      return url?`<a class="flow-end" href="${esc(url)}" target="_blank" rel="noopener noreferrer">API Quick Start<br><small>API 接入文档</small></a>`:'<span class="flow-end">目的页待配置</span>';
    }
    return `<span class="flow-end">${esc(nodeName(getNode(button.target),false))} / ${esc(nodeName(getNode(button.target),true))}</span>`;
  }
  function flowChoiceHtml(button){
    const reply=button.action==='next'?getNode(button.target):null;
    return `<li><div class="flow-choice"><strong lang="en">${esc(button.label)}</strong><span>${esc(button.labelZh)}</span></div><span class="flow-arrow" aria-hidden="true">→</span>${reply?`<span class="flow-reply">${esc(nodeName(reply,false))}<br><small>${esc(nodeName(reply,true))}</small></span><span class="flow-arrow" aria-hidden="true">→</span>${reply.buttons.map(flowEndHtml).join('')}`:flowEndHtml(button)}</li>`;
  }
  function renderPath(){
    const intro=getNode('intro');
    const forms=usedForms().map(form=>`<section class="full-node"><h3>留资表单 / Lead Gen Form</h3>${reviewNote('form-review-note-path')}<div class="full-node-pair">${formDefinitionHtml(form,false)}${formDefinitionHtml(form,true)}</div></section>`).join('');
    const subject=`<section class="full-node subject-pair"><div class="full-node-pair"><div lang="en"><h3>Subject</h3><pre>${esc(selected.subject)}</pre></div><div lang="zh-CN"><h3>主题</h3><pre>${esc(selected.subjectZh)}</pre></div></div></section>`;
    const messages=selected.nodes.map(node=>`<section class="full-node"><h3>${esc(nodeName(node,true))} / ${esc(nodeName(node,false))}</h3><div class="full-node-pair"><div lang="en"><h4>English</h4><pre>${esc(node.message)}</pre><ul class="node-buttons">${node.buttons.map(button=>`<li>${esc(button.label)} → ${pathButtonHtml(button,false)}</li>`).join('')}</ul></div><div lang="zh-CN"><h4>中文</h4><pre>${esc(node.messageZh)}</pre><ul class="node-buttons">${node.buttons.map(button=>`<li>${esc(button.labelZh)} → ${pathButtonHtml(button,true)}</li>`).join('')}</ul></div></div></section>`).join('');
    $('mode-path').innerHTML=`${copyToolsFallback()}<section class="flow-summary" aria-labelledby="flow-heading"><h3 id="flow-heading">流程</h3><ol class="flow-list">${intro.buttons.map(flowChoiceHtml).join('')}</ol></section>${subject}${messages}${forms}<section class="full-node"><h3>补充说明 / Footer</h3><div class="full-node-pair"><pre lang="en">${esc(selected.footer)}</pre><pre lang="zh-CN">${esc(selected.footerZh)}</pre></div></section>`;
  }
  function renderAll(){renderGroupNav();renderVariants();renderHeading();renderCopyTools();renderPreview();renderPath();renderModeNav();}
  function announce(message){$('feedback').textContent=message;}
  function exportCopy(language){
    const zh=language==='zh';
    const formCopies=usedForms().map(form=>{
      const confirmation=form.confirmation||{};
      return [zh?'LinkedIn 留资表单':'LinkedIn Lead Gen Form',`${zh?'表单标题':'Headline'}: ${formValue(form,'headline',zh)}`,`${zh?'表单说明':'Details'}: ${formValue(form,'details',zh)}`,`${zh?'字段':'Fields'}:\n${(form.fields||[]).map(field=>`- ${formValue(field,'label',zh)}`).join('\n')}`,`${zh?'隐私文字':'Privacy text'}: ${formValue(form,'privacyText',zh)}`,`${zh?'隐私政策 URL':'Privacy policy URL'}: ${safeUrl(form.privacyUrl)}`,`${zh?'提交后确认':'Confirmation'}:\n${formValue(confirmation,'message',zh)}`,`${zh?'确认页按钮':'Confirmation CTA'}: ${formValue(confirmation,'cta',zh)}`,`${zh?'确认页目的地':'Confirmation destination'}: ${safeUrl(confirmation.url)}`].join('\n\n');
    });
    return [`${zh?'主题':'Subject'}: ${zh?selected.subjectZh:selected.subject}`,...selected.nodes.map(node=>[`${nodeName(node,zh)}\n${zh?node.messageZh:node.message}`,...node.buttons.map(button=>`${zh?'按钮':'Button'}: ${zh?button.labelZh:button.label} → ${button.action==='leadgen'?`${zh?'LinkedIn 留资表单':'LinkedIn Lead Gen Form'}: ${formValue(getLeadForm(button.formId),'headline',zh)}`:button.action==='website'?button.url:nodeName(getNode(button.target),zh)}`)].join('\n\n')),...formCopies,`${zh?'补充说明':'Footer'}: ${zh?selected.footerZh:selected.footer}`].join('\n\n');
  }
  async function copy(language){
    try{await navigator.clipboard.writeText(exportCopy(language));announce(language==='zh'?'已复制中文全文。':'已复制英文全文。');}
    catch{announce('自动复制不可用，请选中文字复制或下载 TXT。');}
  }
  function download(){
    const content=`${exportCopy('en')}\n\n${'='.repeat(32)}\n\n${exportCopy('zh')}\n`;
    const url=URL.createObjectURL(new Blob(['\uFEFF',content],{type:'text/plain;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download=`Tripo-${selected.id}-conversation.txt`;document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('已下载双语 TXT。');
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button||!renderReady)return;
    if(button.dataset.group){choose(data.variants.find(item=>item.groupId===button.dataset.group).id,true);return;}
    if(button.dataset.variant){choose(button.dataset.variant,true);return;}
    if(button.dataset.mode){mode=modes.includes(button.dataset.mode)?button.dataset.mode:'path';renderModeNav();setHash();return;}
    if(button.hasAttribute('data-reset')){resetThread();renderPreview();$('mode-preview').querySelector('[data-reset]').focus({preventScroll:true});announce('已回到开场。');return;}
    if(button.dataset.copy){copy(button.dataset.copy);return;}
    if(button.hasAttribute('data-download')){download();return;}
    if(button.hasAttribute('data-form-confirm')){
      if(!activeForm)return;
      activeForm={...activeForm,stage:'confirmation'};renderPreview();
      reveal(`#lead-confirmation-title-${button.closest('[lang="en"]')?'en':'zh'}`);
      announce('已显示确认页预览。');return;
    }
    if(button.hasAttribute('data-form-back')){
      if(!activeForm)return;
      activeForm={...activeForm,stage:'form'};renderPreview();
      reveal(`#lead-form-title-${button.closest('[lang="en"]')?'en':'zh'}`);
      announce('已返回表单。');return;
    }
    if(button.hasAttribute('data-form-close')){
      const previous=activeForm;activeForm=null;renderPreview();
      if(previous)reveal(`[data-node="${CSS.escape(previous.nodeId)}"][data-button="${CSS.escape(previous.buttonId)}"]`);
      announce('已返回对话。');return;
    }
    if(button.dataset.node){
      const node=getNode(button.dataset.node),action=node?.buttons.find(item=>item.id===button.dataset.button);if(!action)return;
      if(action.action==='next'){
        if(!getNode(action.target)){announce('这条预设回复还未配置，请从开场重看。');return;}
        if(steps.some(step=>step.id===action.target)){announce('该回复已在本次路径中显示。可从开场重看。');return;}
        steps[steps.length-1].choice=action;steps.push({id:action.target,choice:null});route=null;activeForm=null;renderPreview();
        reveal(`[data-step="${CSS.escape(action.target)}"] .step-title`);announce(`已显示回复：${getNode(action.target).labelZh}`);
      }else if(action.action==='leadgen'){
        const form=getLeadForm(action.formId);
        if(!form||form.simulationOnly!==true){announce('表单预览不可用。');return;}
        activeForm={id:form.id,nodeId:node.id,buttonId:action.id,stage:'form'};route=null;renderPreview();
        reveal('#lead-form-title-en');announce('已显示表单预览。');
      }else if(action.action==='website'){
        route=action;activeForm=null;renderPreview();reveal('#destination-title');announce('已显示 API 文档链接。');
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
    selected=data.variants.find(item=>item.id===id)||selected||data.variants[0];mode=modes.includes(requestedMode)?requestedMode:'path';resetThread();renderAll();setHash();
  }
  window.addEventListener('hashchange',restoreHash);
  async function start(){
    try{
      const response=await fetch('copy.json',{cache:'no-cache'});if(!response.ok)throw new Error('copy unavailable');data=await response.json();
      if(!Array.isArray(data.variants)||data.variants.length!==12||data.variants.some(item=>!groups.some(group=>group.id===item.groupId)||!Array.isArray(item.nodes)||!item.nodes.find(node=>node.id==='intro')))throw new Error('copy invalid');
      const [id,requestedMode]=location.hash.slice(1).split('/');selected=data.variants.find(item=>item.id===id)||data.variants[0];mode=modes.includes(requestedMode)?requestedMode:'path';
      resetThread();renderAll();setHash();renderReady=true;
    }catch{
      renderReady=false;mode='path';renderModeNav();
      $('group-nav').innerHTML='';
      $('mode-path').innerHTML='<div class="error"><h3>文案未载入</h3><p>请重新读取，或<a href="all-copy.html">打开双语全文</a>。</p><button type="button" id="retry-load">重新读取</button></div>';
      $('retry-load').addEventListener('click',start);
      announce('文案未载入。');
    }
  }
  start();
})();
