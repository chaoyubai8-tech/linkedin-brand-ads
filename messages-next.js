/* Review only: no sends, forms, analytics, account access or production calls. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let data;
  try {data=JSON.parse($('review-data').textContent);} catch { $('review-loading').className='error'; $('review-loading').textContent='预览数据未能加载，请查看下方完整文案或下载CSV。'; return; }
  const records=data.groups.flatMap(g=>g.variants.map(v=>({g,v})));
  const state={id:records[0].v.id,device:'desktop'};
  const paragraphs=s=>s.split('\n\n').map(p=>`<p>${esc(p).replaceAll('\n','<br>')}</p>`).join('');
  const current=()=>records.find(r=>r.v.id===state.id)??records[0];
  const full=r=>r.v.opening+'\n\n'+r.g.commonBody;
  const text=r=>'Subject: '+r.g.subject+'\n\n'+full(r)+'\n\nCTA: '+r.g.cta+'\nFooter: '+r.g.footer+'\nDestination: '+r.g.destination;
  function render(){
    const r=current(),{g,v}=r,body=full(r);
    const reserve=g.lane==='reserve';
    $('review-content').innerHTML=`<header class="group-heading"><div><h2>${esc(g.label)}</h2><p>${esc(g.audience)}<br>${esc(g.direction)}</p></div><span class="tag ${reserve?'reserve':''}">${reserve?'预留 · 证据未齐':'主投 · 2套文案'}</span></header>
      <div class="variant-tabs"><div role="tablist" aria-label="选择文案版本">${g.variants.map(x=>`<button type="button" role="tab" id="tab-${esc(x.id)}" data-variant="${esc(x.id)}" aria-selected="${x.id===v.id}" aria-controls="message-preview" tabindex="${x.id===v.id?0:-1}">${esc(x.label)}</button>`).join(' ')}</div><div class="device" aria-label="预览设备"><button type="button" data-device="desktop" aria-pressed="${state.device==='desktop'}">桌面</button><button type="button" data-device="mobile" aria-pressed="${state.device==='mobile'}">手机</button></div></div>
      <div class="message-sheet ${state.device==='mobile'?'mobile':''}" id="message-preview" role="tabpanel" aria-labelledby="tab-${esc(v.id)}" tabindex="0"><div class="mock-head"><strong>Messaging</strong><small>LinkedIn消息布局示意 · 非实际发送界面</small></div><div class="message-grid"><article class="thread" lang="en"><div class="sender"><span class="avatar" aria-hidden="true">—</span><div><strong>Approved sender · 待确认</strong><p>Tripo · Sponsored</p></div></div><div class="sponsored">Subject</div><h3>${esc(g.subject)}</h3><div class="body-copy">${paragraphs(body)}</div><button class="preview-cta" id="route-button" type="button" aria-expanded="false" aria-controls="route-panel">${esc(g.cta)}</button><span class="decline">Not interested · 平台自动附加</span><p class="custom-footer">${esc(g.footer)}</p></article><aside class="banner-rail"><img src="${esc(g.banner)}" width="300" height="250" alt="${esc(g.bannerAlt)}"><div><p class="source-tag">${esc(g.bannerId)} · 历史概念配图</p><p>300 × 250 · 仅桌面展示。A/B共用此图，不同时换图测文案。</p><p>GPT二维概念素材，不是真实Tripo输出。正式配图需经中台制作与规范验收。</p><a href="${esc(g.banner)}" download>下载当前配图 PNG ↓</a></div></aside></div></div>
      <section class="route" id="route-panel" hidden><h3>按钮承接 · 审稿说明</h3><p>${esc(g.destinationLabel)}。本预览不会提交表单或触发注册／生成。</p><a href="${esc(g.destination)}" target="_blank" rel="noopener noreferrer">打开官方目的地 ↗</a><p>UTM、最终表单和事件回传需在投放配置中验收。${g.product==='Teams'?'官网申请条件、权益发放与跟进以当前页面为准。':'查看器／引擎接入由调用方实现，成功取回不等于资产已通过生产验收。'}</p></section>
      <div class="tools"><button type="button" id="copy-current">复制英文文案</button><button type="button" id="download-current">下载本条TXT</button><button type="button" id="show-chinese" aria-expanded="false" aria-controls="chinese-panel">中文释义</button>${!reserve?'<button type="button" id="show-compare" aria-expanded="false" aria-controls="compare-panel">对比A/B开场</button>':''}</div><p class="copy-feedback" id="copy-feedback" role="status" aria-live="polite"></p>
      <section class="chinese" id="chinese-panel" hidden><h3>${esc(g.subjectZh)}</h3>${paragraphs(v.openingZh+'\n\n'+g.commonZh)}<p>中文只供审稿，不是另一套投放文案。</p></section>
      ${!reserve?`<section class="ab-comparison" id="compare-panel" hidden><h3>只改开场，不改主题和正文</h3><div class="comparison-grid">${g.variants.map(x=>`<div><h3>${esc(x.label)}</h3><p lang="en">${esc(x.opening).replaceAll('\n','<br>')}</p></div>`).join('')}</div><p>共同主题：${esc(g.subject)}。其余正文、CTA、配图与目标地址保持一致；本轮不混测多个变化。</p></section>`:''}
      <section class="review-notes"><h3>${esc(v.id)} · 本条验收</h3><div class="checks"><span>主题 ${g.subject.length} / 60</span><span>正文 ${body.length} / 1500</span><span>CTA ${g.cta.length} / 20</span><span>1个业务CTA</span></div><dl><dt>用途与画面</dt><dd>${esc(g.visual)}</dd><dt>最终指标</dt><dd>${esc(g.metric)}</dd><dt>当前状态</dt><dd>${reserve?'预留：需匹配原视频、受众和真实案例，不默认上线。':'文案可审；发件人、承接与真实视觉证据待验收。'} 未发送。</dd><dt>素材来源</dt><dd>复用V17历史配图，2026.10.09排版版次；未在本轮运行中台生成，不宣称规范验收通过。</dd></dl></section>`;
    $('review-content').hidden=false;$('review-loading').hidden=true;
    document.querySelectorAll('[data-group]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.group===g.id)));
    document.querySelectorAll('[data-variant]').forEach(b=>{
      b.onclick=()=>choose(b.dataset.variant);
      b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=g.variants.length,i=g.variants.findIndex(x=>x.id===state.id),idx=e.key==='Home'?0:e.key==='End'?n-1:(i+(e.key==='ArrowRight'?1:-1)+n)%n;choose(g.variants[idx].id);$('tab-'+state.id).focus();};
    });
    document.querySelectorAll('[data-device]').forEach(b=>b.onclick=()=>{state.device=b.dataset.device;render();document.querySelector('[data-device="'+state.device+'"]').focus();});
    for(const [button,panel] of [['route-button','route-panel'],['show-chinese','chinese-panel'],['show-compare','compare-panel']])if($(button))$(button).onclick=()=>{const open=$(panel).hidden;$(panel).hidden=!open;$(button).setAttribute('aria-expanded',String(open));};
    $('copy-current').onclick=async()=>{try{await navigator.clipboard.writeText(text(current()));$('copy-feedback').textContent='已复制英文主题、正文、CTA、页脚与目标地址。';}catch{$('copy-feedback').textContent='浏览器未允许复制，请使用下载TXT或下方完整文案。';}};
    $('download-current').onclick=()=>{const r=current(),url=URL.createObjectURL(new Blob([text(r)],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=r.v.id+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('copy-feedback').textContent='已准备本条TXT下载。';};
    const image=document.querySelector('.banner-rail img');image.onerror=()=>{const p=document.createElement('p');p.className='error';p.textContent='配图未能加载，请刷新或打开下载链接。';image.replaceWith(p);};
  }
  function choose(id){if(!records.some(r=>r.v.id===id))return;state.id=id;history.replaceState(null,'','#'+id);render();}
  function fromHash(){const id=location.hash.slice(1);if(records.some(r=>r.v.id===id))state.id=id;render();}
  document.querySelectorAll('[data-group]').forEach(a=>a.onclick=e=>{e.preventDefault();choose(data.groups.find(g=>g.id===a.dataset.group).variants[0].id);});
  window.addEventListener('hashchange',fromHash);fromHash();
})();
