'use strict';
(() => {
  let data;
  const state = {id:'TE-01',part:'intro',language:'both',mode:'compare'};
  const partLabels = {intro:'开场与主题',workflow:'回复 1 · 制作流程',preflight:'回复 2 · 评估方法',cta:'CTA 流程',form:'留资表单',footer:'页脚'};
  const $ = id => document.getElementById(id);
  const el = (tag,text,className) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text??'');if(className)n.className=className;return n;};
  const value = (x,key,lang) => x?.[lang==='zh'?`${key}Zh`:key] ?? '';
  const languages = () => state.language==='both'?['en','zh']:[state.language];
  const langLabel = lang => lang==='zh'?'中文':'English';
  const selected = () => data.pairs.find(p=>p.id===state.id);
  const groupAnalysis = () => data.analysis?.groups?.find(g=>g.groupId===selected().groupId);
  const variantAnalysis = () => data.analysis?.variants?.filter(v=>v.id===state.id) || [];
  function quoteText(version,item,lang){
    if(lang==='zh')return version==='v7'?item.oldQuote:item.newQuote;
    const copy=selected()[version];
    if(item.dimension==='subject')return copy.subject;
    const message=copy.nodes.find(node=>node.id===item.dimension)?.message||'';
    return item.dimension==='intro'?message.split('\n\n')[1]||message:message;
  }
  const textValue = v => Array.isArray(v)?v.join('\n'):String(v??'');
  function safeUrl(raw) {
    if(typeof raw!=='string'||/[\u0000-\u0020]/.test(raw))return null;
    try {const u=new URL(raw,location.href);if(u.protocol==='https:'||u.origin===location.origin&&u.protocol===location.protocol)return u.href;}catch{}
    return null;
  }
  function link(text,url){const href=safeUrl(url);if(!href)return el('span',text);const a=el('a',text);a.href=href;if(new URL(href).origin!==location.origin){a.target='_blank';a.rel='noopener noreferrer';}return a;}
  function versionUrl(version){const v=data.versions.find(v=>v.id===version);const raw=v?.url|| (version==='v7'?'../?v=989c4af':'../feedback-v8/?v=8cc462c');return `${raw.split('#')[0]}#${state.id}/preview`;}
  function route(button) {
    if(button.action==='next')return `后续回复 → ${partLabels[button.target]||button.target||'未标注'}`;
    if(button.action==='leadgen')return `原生留资表单 → ${button.formId||'未标注'}`;
    if(button.action==='website')return `外部网页 → ${button.url||'未标注'}`;
    return `${button.action||'动作未标注'}${button.url?' → '+button.url:''}`;
  }
  function block(title,text,lang,subject=false){const s=el('div',undefined,'copy-block');s.append(el('h4',title));const p=el('p',text,`copy-text${subject?' subject-text':''}`);if(lang)p.lang=lang==='zh'?'zh-CN':'en';s.append(p);return s;}
  function buttonList(buttons) {
    const list=el('ul',undefined,'button-list');
    for(const b of buttons||[]){const li=el('li');for(const lang of languages()){const span=el('span',value(b,'label',lang),'button-label');span.lang=lang==='zh'?'zh-CN':'en';li.append(span);if(state.language==='both')li.append(el('br'));}li.append(el('span',route(b),'button-route'));list.append(li);}return list;
  }
  function renderNode(column,copy,nodeId) {
    const node=copy.nodes.find(n=>n.id===nodeId);if(!node){column.append(el('p','此版本没有对应段落。'));return;}
    if(nodeId==='intro')for(const lang of languages())column.append(block(`主题 · ${langLabel(lang)}`,value(copy,'subject',lang),lang,true));
    for(const lang of languages())column.append(block(`正文 · ${langLabel(lang)}`,value(node,'message',lang),lang));
    column.append(buttonList(node.buttons));column.append(el('p','按钮为原文静态标注；此处不会发送消息或打开表单。','static-note'));
  }
  function renderFlow(column,copy){for(const node of copy.nodes){const section=el('section',undefined,'copy-block');section.append(el('h4',partLabels[node.id]||node.labelZh));section.append(buttonList(node.buttons));column.append(section);}column.append(el('p','Not Interested 为平台选项，不计入自定义按钮。','static-note'));}
  function renderForm(column,version) {
    const forms=data.forms?.[version]||[];const form=forms.find(f=>f.id==='teams-trial')||forms[0];
    if(!form){column.append(el('p','此版本未设置 Teams 留资表单。'));return;}
    column.append(el('p','静态字段与文案对照，不填写、不提交、不保存。','static-note'));
    for(const lang of languages()){
      column.append(block(`表单标题 · ${langLabel(lang)}`,value(form,'headline',lang),lang,true));
      column.append(block(`说明 · ${langLabel(lang)}`,value(form,'details',lang),lang));
      const fields=el('ul',undefined,'field-list');for(const f of form.fields||[])fields.append(el('li',value(f,'label',lang)));column.append(fields);
      column.append(block(`隐私说明 · ${langLabel(lang)}`,value(form,'privacyText',lang),lang));
      column.append(block(`提交后文案 · ${langLabel(lang)}`,value(form.confirmation,'message',lang),lang));
      column.append(block(`提交后按钮 · ${langLabel(lang)}`,value(form.confirmation,'cta',lang),lang));
    }
    column.append(el('p',`隐私政策：${form.privacyUrl||'未标注'}`,'static-note'));
    column.append(el('p',`提交后目的地：${form.confirmation?.url||'未标注'}`,'static-note'));
  }
  function conclusion(title,text){const s=el('section',undefined,'conclusion');s.append(el('h3',title),el('p',textValue(text)||'暂无结论。'));return s;}
  function renderCompare(){
    const root=$('comparison');root.replaceChildren();root.append(el('h2',partLabels[state.part]));root.firstChild.id='part-heading';
    const pair=selected();const grid=el('div',undefined,'comparison-grid');
    for(const version of ['v7','v8']){
      const copy=pair[version];const article=el('article',undefined,'version-column');const head=el('header',undefined,'version-head');head.append(el('h3',version==='v7'?'旧版 V7':'新版 V8'),link('查看原版互动预览',versionUrl(version)));const content=el('div',undefined,'version-content');
      if(['intro','workflow','preflight'].includes(state.part))renderNode(content,copy,state.part);
      else if(state.part==='cta')renderFlow(content,copy);
      else if(state.part==='form')renderForm(content,version);
      else for(const lang of languages())content.append(block(`页脚 · ${langLabel(lang)}`,value(copy,'footer',lang),lang));
      article.append(head,content);grid.append(article);
    }
    root.append(grid);
    const relevant=variantAnalysis().filter(v=>{const d=String(v.dimension||'');return d===state.part||state.part==='intro'&&/开场|主题|购买|intro/.test(d)||state.part==='cta'&&/CTA|承接|流程/.test(d)||state.part==='form'&&/表单|留资/.test(d)||state.part==='footer'&&/页脚|边界/.test(d)||state.part==='workflow'&&/workflow|回复|流程/.test(d)||state.part==='preflight'&&/preflight|评估/.test(d);});
    const chosen=relevant;
    for(const v of chosen)root.append(conclusion(`${state.id} · 本段结论`,v.conclusion||v.meaning));
    if(!chosen.length){const part=data.analysis?.parts?.find(p=>p.groupId===pair.groupId&&p.part===state.part);root.append(conclusion(`${state.id} · 本段结论`,part?.conclusion||groupAnalysis()?.remainingIssue||data.analysis?.overall?.conclusion));}
    root.append(conclusion('本组结论',groupAnalysis()?.conclusion));
  }
  function findingTable(items){const table=el('table',undefined,'findings-table');const thead=el('thead');const tr=el('tr');for(const title of ['维度','旧版 V7','新版 V8','结论'])tr.append(el('th',title));thead.append(tr);const tbody=el('tbody');for(const f of items||[]){const row=el('tr');for(const [title,val] of [['维度',f.title],['旧版 V7',f.old],['新版 V8',f.new],['结论',f.conclusion]]){const td=el('td',textValue(val));td.dataset.label=title;row.append(td);}tbody.append(row);}table.append(thead,tbody);return table;}
  function renderAnalysis(){const root=$('analysis');root.replaceChildren();const overall=data.analysis?.overall||{};root.append(el('h2','购买理由、证据和下一步是否连起来？'));root.firstChild.id='analysis-heading';root.append(el('p',textValue(overall.summary)));if(overall.logic)root.append(conclusion('推导顺序',overall.logic));root.append(findingTable(overall.findings));root.append(conclusion('整体结论',overall.conclusion));
    const g=groupAnalysis();const section=el('section',undefined,'analysis-section');section.append(el('h3',data.groups.find(g=>g.id===selected().groupId)?.label||'本组分析'));const dl=el('dl',undefined,'definition-grid');for(const [label,key] of [['旧版应保留','oldStrength'],['新版有改进','newGain'],['还缺什么','remainingIssue'],['下一步怎么做','nextStep']]){dl.append(el('dt',label),el('dd',textValue(g?.[key])));}section.append(dl,conclusion('本组结论',g?.conclusion));root.append(section);
    for(const item of data.analysis?.parts?.filter(p=>p.groupId===selected().groupId)||[])root.append(conclusion(`${partLabels[item.part]||item.part} · 结论`,item.conclusion));
    for(const v of variantAnalysis()){const s=el('section',undefined,'analysis-section');s.append(el('h3',`${state.id} · ${partLabels[v.dimension]||v.dimension||'原文证据'}`));const quotes=el('div',undefined,'quotes');for(const [version,label] of [['v7','旧版原句'],['v8','新版原句']]){const quote=el('blockquote');for(const lang of languages()){const p=el('p',textValue(quoteText(version,v,lang)));p.lang=lang==='zh'?'zh-CN':'en';quote.append(el('span',`${label} · ${langLabel(lang)}`),p);}quotes.append(quote);}s.append(quotes,el('p',textValue(v.meaning)),conclusion('明确结论',v.conclusion));root.append(s);}
    if(data.references?.length){const refs=el('section',undefined,'analysis-section');refs.append(el('h3','产品机制参考（不作为收益证明）'));for(const ref of data.references){const p=el('p');p.append(link(ref.title,ref.url));refs.append(p);}root.append(refs);}
  }
  function navButton(text,active,fn){const b=el('button',text);b.type='button';b.setAttribute('aria-pressed',String(active));b.addEventListener('click',fn);return b;}
  function renderNavigation(){const pair=selected();$('groups').replaceChildren();for(const g of data.groups){const b=navButton('',g.id===pair.groupId,()=>{state.id=data.pairs.find(p=>p.groupId===g.id).id;update();});b.dataset.group=g.id;b.append(el('strong',g.label),el('span',g.direction));$('groups').append(b);}$('variants').replaceChildren();for(const p of data.pairs.filter(p=>p.groupId===pair.groupId)){const b=navButton('',p.id===state.id,()=>{state.id=p.id;update();});b.dataset.variant=p.id;b.append(el('strong',`${p.id} · ${(p.v8.label||p.v7.label||'').split(' · ')[0]}`),el('span',p.v8.hookStyle||p.v7.hookStyle));$('variants').append(b);}
    $('parts').replaceChildren();for(const [id,label] of Object.entries(partLabels)){if(id==='form'&&!pair.groupId.startsWith('teams'))continue;const b=navButton(label,id===state.part,()=>{state.part=id;state.mode='compare';update();});b.dataset.part=id;if(id===state.part)b.setAttribute('aria-current','page');$('parts').append(b);}
    $('variant-id').textContent=state.id;$('variant-heading').textContent=pair.v8.label||pair.v7.label;$('direction').textContent=data.groups.find(g=>g.id===pair.groupId)?.direction||'';
    for(const b of $('languages').querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.language===state.language));for(const b of $('modes').querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode));$('old-link').href=versionUrl('v7');$('new-link').href=versionUrl('v8');
  }
  function readHash(){const bits=location.hash.slice(1).split('/');state.id=data.pairs.some(p=>p.id===bits[0])?bits[0]:'TE-01';state.part=Object.hasOwn(partLabels,bits[1])?bits[1]:bits[1]==='analysis'?'intro':'intro';state.language=['zh','en','both'].includes(bits[2])?bits[2]:'both';state.mode=bits[3]==='analysis'||bits[1]==='analysis'?'analysis':'compare';if(state.part==='form'&&!selected().groupId.startsWith('teams'))state.part='intro';}
  function update(){const active=document.activeElement;const focusKey=['group','variant','part'].find(key=>active?.dataset?.[key]);const focusValue=focusKey?active.dataset[focusKey]:null;if(state.part==='form'&&!selected().groupId.startsWith('teams'))state.part='intro';const hash=`#${state.id}/${state.part}/${state.language}${state.mode==='analysis'?'/analysis':''}`;if(location.hash!==hash)history.replaceState(null,'',hash);renderNavigation();renderCompare();renderAnalysis();$('comparison').hidden=state.mode!=='compare';$('analysis').hidden=state.mode!=='analysis';$('parts').hidden=state.mode==='analysis';$('manual-copy').hidden=true;$('notice').textContent='';if(focusKey){const nav=focusKey==='group'?$('groups'):focusKey==='variant'?$('variants'):$('parts');const target=[...nav.querySelectorAll('button')].find(button=>button.dataset[focusKey]===focusValue);target?.focus({preventScroll:true});}}
  function exportText(all=false){const pair=selected();const chunks=[`${state.id} · V7 / V8 对比`,data.groups.find(g=>g.id===pair.groupId)?.label||''];for(const version of ['v7','v8']){const c=pair[version];chunks.push(`\n${version==='v7'?'旧版 V7':'新版 V8'}`);if(all||state.part==='intro')chunks.push(`主题：${c.subject}\n中文：${c.subjectZh}`);const nodes=all?c.nodes:c.nodes.filter(n=>n.id===state.part||state.part==='cta');for(const node of nodes){chunks.push(`\n${partLabels[node.id]}\n${node.message}\n\n${node.messageZh}`);for(const b of node.buttons||[])chunks.push(`${b.label} / ${b.labelZh}\n${route(b)}`);}if(all||state.part==='footer')chunks.push(`\n页脚\n${c.footer}\n${c.footerZh}`);if((all&&pair.groupId.startsWith('teams'))||state.part==='form'){const f=(data.forms?.[version]||[])[0];if(f)chunks.push(`\n表单\n${f.headline}\n${f.headlineZh}\n${f.details}\n${f.detailsZh}\n${(f.fields||[]).map(x=>`${x.label} / ${x.labelZh}`).join('\n')}\n${f.privacyText}\n${f.privacyTextZh}\n${f.privacyUrl}\n${f.confirmation?.message||''}\n${f.confirmation?.messageZh||''}\n${f.confirmation?.cta||''} / ${f.confirmation?.ctaZh||''}\n${f.confirmation?.url||''}`);}}if(state.mode==='analysis'&&!all)return $('analysis').innerText;chunks.push(`\n本组结论\n${textValue(groupAnalysis()?.conclusion)}`);return chunks.join('\n');}
  async function load(){ $('loading').hidden=false;$('error').hidden=true;$('app').hidden=true;try{const response=await fetch('data.json',{cache:'no-store'});if(!response.ok)throw new Error('HTTP '+response.status);const result=await response.json();if(result.schemaVersion!==1||!Array.isArray(result.pairs)||result.pairs.length!==12||!Array.isArray(result.groups)||result.groups.length!==4||!result.pairs.every(p=>p.v7?.nodes&&p.v8?.nodes))throw new Error('Invalid comparison data');data=result;readHash();$('date').textContent=data.createdOn||'';update();$('app').hidden=false;}catch{$('error').hidden=false;}finally{$('loading').hidden=true;}}
  $('retry').addEventListener('click',load);window.addEventListener('hashchange',()=>{if(data){readHash();update();}});
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();const target=state.mode==='analysis'?$('analysis'):$('comparison');target.tabIndex=-1;target.focus();target.scrollIntoView({block:'start'});});
  $('languages').addEventListener('click',event=>{const b=event.target.closest('button[data-language]');if(b){state.language=b.dataset.language;update();}});$('modes').addEventListener('click',event=>{const b=event.target.closest('button[data-mode]');if(b){state.mode=b.dataset.mode;update();}});
  $('copy').addEventListener('click',async()=>{const text=exportText();try{if(!navigator.clipboard?.writeText)throw new Error();await navigator.clipboard.writeText(text);$('notice').textContent='当前对照已复制。';}catch{$('manual-copy').hidden=false;$('copy-text').value=text;$('copy-text').focus();$('copy-text').select();$('notice').textContent='请手动复制下方已选中的文字。';}});
  $('close-copy').addEventListener('click',()=>{$('manual-copy').hidden=true;$('copy').focus();});$('download').addEventListener('click',()=>{const blob=new Blob([exportText(true)],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${state.id}-V7-V8-bilingual.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('notice').textContent='已生成本版双语 TXT。';});$('print').addEventListener('click',()=>window.print());load();
})();
