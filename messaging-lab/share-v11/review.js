(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text = (value, lang) => typeof value === 'string' ? value : value?.[lang] || '';
  const validLink = value => { try { const u = new URL(value, location.href); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
  const validImage = value => { try { const u = new URL(value, location.href); return u.protocol === 'https:' || u.origin === location.origin ? u.href : ''; } catch { return ''; } };
  const copyLabel = {en:'English',zh:'中文'};
  const steps = ['intro','followup','form','confirmation'];
  const stepNames = {intro:{en:'First message',zh:'首条消息'},followup:{en:'Product details',zh:'产品说明'},form:{en:'Lead form',zh:'留资表单'},confirmation:{en:'After submission',zh:'提交后'}};
  let data = null, state = {id:'TE-01',view:'preview',lang:'both',node:'intro'}, statusTimer;

  function prose(value) {
    const chunks = String(value || '').replace(/\r/g,'').split(/\n\s*\n/).filter(Boolean);
    return chunks.map(chunk => {
      const lines = chunk.split('\n');
      let out = '', list = [];
      const flush = () => { if (list.length) { out += `<ul>${list.map(line=>`<li>${esc(line)}</li>`).join('')}</ul>`; list=[]; } };
      for (const line of lines) {
        if (/^\s*[•–-]\s+/.test(line)) list.push(line.replace(/^\s*[•–-]\s+/,''));
        else { flush(); if (line.trim()) out += `<p>${esc(line)}</p>`; }
      }
      flush(); return out;
    }).join('');
  }
  function currentGroup(){ return data.groups.find(g=>g.id===state.id) || data.groups[0]; }
  function visibleLanguages(){ return state.lang === 'both' ? ['en','zh'] : [state.lang]; }
  function announce(message){ $('status').textContent=message; $('status').hidden=false; clearTimeout(statusTimer); statusTimer=setTimeout(()=>{$('status').hidden=true;},3200); }
  function updateHash(){ const next=`#${state.id}/${state.view}/${state.lang}`; if(location.hash!==next) history.replaceState(null,'',next); }
  function readHash(){
    const [id,view,lang] = location.hash.slice(1).split('/');
    const previous=state.id;
    state.id=data.groups.some(g=>g.id===id)?id:(data.groups.some(g=>g.id==='TE-01')?'TE-01':data.groups[0].id);
    state.view=view==='flow'?'flow':'preview'; state.lang=['en','zh'].includes(lang)?lang:'both';
    if(previous!==state.id) state.node='intro';
    updateHash();
  }
  function imageHtml(group,lang){
    const im=group.image; if(!im?.src) return '';
    const src=validImage(im.src), source=validLink(im.sourceUrl);
    if(!src) return '';
    return `<figure class="ad-image"><img src="${esc(src)}" alt="${esc(text(im.alt,lang))}" width="250" loading="lazy"><figcaption>${esc(text(im.caption,lang))}${source?` <a href="${esc(source)}" target="_blank" rel="noopener noreferrer">${lang==='en'?'Source':'图片来源'}</a>`:''}</figcaption></figure>`;
  }
  function action(label, node, primary=false, inert=false){ return `<button type="button" class="${primary?'primary':''}" ${inert?'tabindex="-1"':`data-node="${node}"`}>${esc(label)}</button>`; }
  function formHtml(group,lang,inert=false){
    const f=group.form, privacy=validLink(f.privacyUrl);
    return `<p class="form-kicker">${lang==='en'?'LinkedIn Lead Gen Form · Preview':'LinkedIn 原生留资表单 · 预览'}</p><h3 class="form-title">${esc(text(f.title,lang))}</h3><div class="prose">${prose(text(f.description,lang))}</div><p class="form-note">${lang==='en'?'Read-only preview. No information is submitted or stored.':'只读预览，不提交或保存任何信息。'}</p><div class="form-fields">${f.fields.map((field,i)=>`<label class="form-field">${esc(text(field.label,lang))}<input type="text" readonly aria-readonly="true" tabindex="-1" value="" placeholder="${lang==='en'?'Read-only preview':'只读字段示例'}" autocomplete="off" data-field="${esc(field.id || i)}"></label>`).join('')}</div><p class="privacy">${esc(text(f.privacyText,lang) || (lang==='en'?'Your information would be shared with Tripo to follow up on your request.':'提交后，您的信息将提供给 Tripo，用于跟进您的需求。'))}${privacy?` <a href="${esc(privacy)}" target="_blank" rel="noopener noreferrer">${lang==='en'?'Privacy policy':'隐私政策'}</a>`:''}</p><div class="message-actions">${action(lang==='en'?'Preview confirmation':'预览提交后','confirmation',true,inert)}</div>`;
  }
  function nodeHtml(group,node,lang,inert=false){
    if(node==='intro') return `<div class="prose">${prose(text(group.intro,lang))}</div>${imageHtml(group,lang)}<div class="message-actions">${action(text(group.buttons.primary,lang),'form',true,inert)}${action(text(group.buttons.secondary,lang),'followup',false,inert)}</div><p class="platform-option">${lang==='en'?'Not interested — platform-provided option':'Not interested／不感兴趣 · 平台提供的选项'}</p>`;
    if(node==='followup') return `<div class="prose">${prose(text(group.followup,lang))}</div><div class="message-actions">${(group.followupButtons || []).map((button,i)=>{
      if(button.action==='link'){const href=validLink(button.url);return href?`<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text(button.label,lang))} ↗</a>`:'';}
      return action(text(button.label,lang),'form',i===0,inert);
    }).join('')}</div>`;
    if(node==='form') return formHtml(group,lang,inert);
    const destination=group.form.destination, href=validLink(destination?.url);
    return `<p class="confirmation-marker">${lang==='en'?'Confirmation preview':'提交后文案预览'}</p><div class="prose">${prose(text(group.form.confirmation,lang))}</div>${href?`<div class="message-actions"><a class="primary" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text(destination.label,lang))} ↗</a></div>`:''}`;
  }
  function panel(group,node,lang,inert=false){
    return `<section class="language-panel" lang="${lang==='zh'?'zh-CN':'en'}"><h4 class="language-label">${copyLabel[lang]}</h4><article class="message"><header class="message-header"><strong>Tripo</strong><span>${lang==='en'?'Sponsored · Preview':'推广消息 · 预览'}</span></header>${node==='intro'?`<div class="message-subject"><small>${lang==='en'?'Subject':'主题'}</small><h3>${esc(text(group.subject,lang))}</h3></div>`:''}<div class="message-content">${nodeHtml(group,node,lang,inert)}</div></article></section>`;
  }
  function flowHtml(group,languages,print=false){
    return steps.map(node=>`<section class="flow-section" data-flow-section="${node}"><h3>${esc(text(stepNames[node],state.lang==='en'?'en':'zh'))}</h3><div class="bilingual ${languages.length===1?'single':''}">${languages.map(lang=>panel(group,node,lang,print)).join('')}</div></section>`).join('');
  }
  function bindImages(root){ root.querySelectorAll('.ad-image img').forEach(img=>{ img.addEventListener('error',()=>{const fallback=document.createElement('div');fallback.className='image-fallback';fallback.textContent=img.closest('[lang]')?.lang==='en'?'Image unavailable. Please retry later.':'图片暂时无法加载，请稍后重试。';img.replaceWith(fallback);},{once:true}); }); }
  function render(){
    const g=currentGroup();
    $('groups').innerHTML=data.groups.map(group=>`<button type="button" data-group="${esc(group.id)}" aria-pressed="${group.id===state.id}"><strong>${esc(group.label)}</strong><span>${esc(text(group.theme,state.lang==='en'?'en':'zh'))}</span></button>`).join('');
    $('languages').innerHTML=[['both','中英对照'],['en','English'],['zh','中文']].map(([lang,label])=>`<button type="button" data-lang="${lang}" aria-pressed="${state.lang===lang}">${label}</button>`).join('');
    $('group-title').textContent=g.label;
    $('group-theme').textContent=text(g.theme,state.lang==='en'?'en':'zh');
    $('views').querySelectorAll('[data-view]').forEach(button=>{ const selected=button.dataset.view===state.view; button.setAttribute('aria-selected',selected); button.tabIndex=selected?0:-1; });
    $('content').setAttribute('aria-labelledby',`tab-${state.view}`);
    $('steps').innerHTML=steps.map((node,i)=>`${i?'<span class="step-arrow" aria-hidden="true">→</span>':''}<button type="button" data-node="${node}" ${state.view==='preview'&&state.node===node?'aria-current="step"':''}>${esc(text(stepNames[node],state.lang==='en'?'en':'zh'))}</button>`).join('');
    const languages=visibleLanguages();
    $('content').innerHTML=state.view==='flow'?flowHtml(g,languages):`<div class="bilingual ${languages.length===1?'single':''}">${languages.map(lang=>panel(g,state.node,lang)).join('')}</div>`;
    bindImages($('content'));
    document.title=`${g.label} · Tripo 站内信 V11`;
  }
  function focusNode(){ $('content').focus({preventScroll:true}); $('content').scrollIntoView({block:'start',behavior:'auto'}); }
  function groupText(group,lang){
    const f=group.form;
    return [group.label,text(group.theme,lang),'',lang==='en'?'SUBJECT':'主题',text(group.subject,lang),'',text(stepNames.intro,lang),text(group.intro,lang),'',text(group.image?.caption,lang),'',text(group.buttons.primary,lang)+' → '+text(stepNames.form,lang),text(group.buttons.secondary,lang)+' → '+text(stepNames.followup,lang),'',text(stepNames.followup,lang),text(group.followup,lang),'',(group.followupButtons||[]).map(b=>text(b.label,lang)+(b.url?' → '+b.url:' → '+text(stepNames.form,lang))).join('\n'),'',text(stepNames.form,lang),text(f.title,lang),text(f.description,lang),f.fields.map(field=>text(field.label,lang)).join('\n'),text(f.privacyText,lang),f.privacyUrl || '','',text(stepNames.confirmation,lang),text(f.confirmation,lang),text(f.destination?.label,lang),f.destination?.url || ''].filter(value=>value!==undefined).join('\n');
  }
  async function copy(lang){
    const value=groupText(currentGroup(),lang);
    try { await navigator.clipboard.writeText(value);announce(lang==='en'?'已复制本组英文全文':'已复制本组中文全文'); }
    catch { $('copy-text').value=value;$('copy-dialog').showModal();$('copy-text').focus();$('copy-text').select(); }
  }
  function download(){
    const g=currentGroup(), content=`Tripo 领英站内信 · V11\n${data.date || ''}\n\n${groupText(g,'en')}\n\n${'—'.repeat(30)}\n\n${groupText(g,'zh')}\n\n${text(data.note,'zh')}`;
    const blob=new Blob(['\ufeff',content],{type:'text/plain;charset=utf-8'}), url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download=`Tripo-V11-${g.id}-EN-ZH.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('已下载本组中英双语文案');
  }
  function makePrint(){
    $('print-document').innerHTML=data.groups.map(group=>`<article><h1>Tripo 领英站内信 · V11</h1><p class="print-meta">${esc(group.label)} · ${esc(data.date || '')}</p>${flowHtml(group,['en','zh'],true)}<p class="print-meta">${esc(text(data.note,'zh'))}</p></article>`).join('');
    $('print-document').querySelectorAll('img').forEach(img=>img.loading='eager');bindImages($('print-document'));
  }
  async function printAll(){
    makePrint();
    await Promise.all(Array.from($('print-document').querySelectorAll('img')).map(img=>img.complete?Promise.resolve():Promise.race([new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});}),new Promise(resolve=>setTimeout(resolve,2000))])));
    window.print();
  }
  async function load(){
    $('load-state').hidden=false; $('app').hidden=true; $('load-state').className='load-state';$('load-state').innerHTML='<p>正在加载文案…</p><div class="loading-lines" aria-hidden="true"></div>';
    const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),15000);
    try {
      const response=await fetch('data.json',{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('HTTP '+response.status);
      const result=await response.json();if(!Array.isArray(result.groups)||result.groups.length!==4||result.groups.some(group=>!group.id||!group.intro||!group.form?.fields||!group.buttons))throw new Error('Invalid content');
      data=result;readHash();render();$('site-note').textContent=text(data.note,'zh') || '审稿预览 · 不会发送消息或收集信息。';$('edition').textContent=`4 组人群 · 中英双语 · ${data.date || '完整流程'}`;$('load-state').hidden=true;$('app').hidden=false;makePrint();
    } catch(error) { $('load-state').className='error';$('load-state').innerHTML='<p>暂时无法加载文案。请检查网络后重试。</p><button type="button" id="retry">重新加载</button>';$('retry').addEventListener('click',load); }
    finally {clearTimeout(timeout);}
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.group){state.id=button.dataset.group;state.node='intro';updateHash();render();$('groups').querySelector(`[data-group="${state.id}"]`)?.focus();}
    else if(button.dataset.lang){state.lang=button.dataset.lang;updateHash();render();$('languages').querySelector(`[data-lang="${state.lang}"]`)?.focus();}
    else if(button.dataset.view){state.view=button.dataset.view;updateHash();render();$(`tab-${state.view}`).focus();}
    else if(button.dataset.node){state.node=button.dataset.node;state.view='preview';updateHash();render();focusNode();}
    else if(button.dataset.tool==='copy-en')copy('en');else if(button.dataset.tool==='copy-zh')copy('zh');else if(button.dataset.tool==='download')download();else if(button.dataset.tool==='print')printAll();
  });
  $('views').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();state.view=event.key==='Home'?'preview':event.key==='End'?'flow':state.view==='preview'?'flow':'preview';updateHash();render();$(`tab-${state.view}`).focus();});
  $('close-copy').addEventListener('click',()=>$('copy-dialog').close());
  window.addEventListener('hashchange',()=>{if(data){readHash();render();}});
  window.addEventListener('beforeprint',()=>{if(data)makePrint();});
  load();
})();
