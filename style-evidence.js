/* Image-backed research comparisons. No tracking, generation or ad publishing. */
(() => {
  'use strict';
  const root = document.getElementById('style-evidence');
  if (!root) return;
  const base = new URL('.', document.currentScript.src);
  const make = (tag, cls, text) => {const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  const str = x => typeof x==='string'?x:'';
  const arr = x => Array.isArray(x)?x:[];
  function url(path, image=false) {
    try {const u=new URL(path,base);if(!['https:','http:'].includes(u.protocol))return null;if(image&&u.origin!==base.origin)return null;return u.href;}catch{return null;}
  }
  function anchor(label, href) {const a=make('a','',label);a.href=href;a.target='_blank';a.rel='noopener noreferrer';return a;}
  function button(label) {const b=make('button','',label);b.type='button';return b;}
  const loading = make('p','se-load','正在加载图证对照…');
  loading.setAttribute('role','status');root.append(loading);
  let cases=new Map(), dimensions=[], current=0, tabs, panel, dialog, dialogTitle, dialogImage, dialogCaption;
  function openImage(item) {
    const src=url(item.image,true);if(!src)return;
    dialogTitle.textContent=item.title;dialogImage.alt=str(item.alt)||item.title;dialogImage.src=src;
    dialogCaption.replaceChildren(make('p','',str(item.evidenceLabel)),make('p','',str(item.rightsNote)));
    if(item.caveat)dialogCaption.append(make('p','',item.caveat));
    const links=make('div','se-figlinks');links.append(anchor('打开原图文件',src));
    const source=url(item.sourceUrl);if(source)links.append(anchor('查看来源页面',source));dialogCaption.append(links);
    dialog.showModal();
  }
  function image(item, lazy=true) {
    const img=make('img');img.alt=str(item.alt)||item.title;img.loading=lazy?'lazy':'eager';img.decoding='async';
    const src=url(item.image,true);if(src)img.src=src;return img;
  }
  function figure(item, isPrimary) {
    const f=make('figure','se-figure');f.append(make('span','se-evidence-label',item.evidenceLabel));
    const frame=make('div','se-media');const zoom=button('');zoom.className='se-image-button';zoom.setAttribute('aria-label',`放大查看：${item.title}`);
    const img=image(item,!isPrimary);zoom.append(img);zoom.addEventListener('click',()=>openImage(item));
    const fail=make('div','se-image-error');fail.hidden=true;fail.append(make('strong','','图片暂未加载'));
    const retry=button('重新加载');retry.onclick=()=>{fail.hidden=true;img.src=url(item.image,true)+'?retry='+Date.now();};fail.append(retry);
    const src=url(item.sourceUrl);if(src)fail.append(anchor('查看来源页面',src));
    img.addEventListener('error',()=>{fail.hidden=false;});img.addEventListener('load',()=>{fail.hidden=true;});frame.append(zoom,fail);
    const cap=make('figcaption');cap.append(make('p','se-figtitle',item.title));
    const links=make('div','se-figlinks');const enlarge=button('查看原图');enlarge.onclick=()=>openImage(item);links.append(enlarge);
    if(src)links.append(anchor('来源 ↗',src));cap.append(links,make('p','se-rights',item.rightsNote));
    if(item.caveat){const note=make('details','se-caveat');note.append(make('summary','','这张图不能证明什么'),make('p','',item.caveat));cap.append(note);}
    f.append(frame,cap);return f;
  }
  function thumbnails(ids,label) {
    const group=make('div','se-mini-group');if(label)group.append(make('strong','',label));
    const strip=make('div','se-related');arr(ids).forEach(id=>{const item=cases.get(id);if(!item)return;const f=make('figure','se-thumb');const b=button('');b.setAttribute('aria-label',`放大查看：${item.title}`);b.append(image(item));b.onclick=()=>openImage(item);f.append(b,make('figcaption','',item.title));strip.append(f);});group.append(strip);return group;
  }
  function side(details,label,isPrimary) {
    const col=make('article','se-side');col.append(make('h4','',label),make('p','se-summary',details.summary));const item=cases.get(details.caseId);
    if(item)col.append(figure(item,isPrimary));else col.append(make('p','se-load','本项参考图未配置。'));
    const observations=make('div','se-observations');observations.append(make('h5','','对着图看这几处'));
    const ol=make('ol');arr(details.observations).forEach(o=>ol.append(make('li','',typeof o==='string'?o:str(o.text))));observations.append(ol);col.append(observations);
    if(arr(details.relatedCaseIds).length)col.append(thumbnails(details.relatedCaseIds,'补充参照，点击放大'));
    return col;
  }
  function select(index,updateHash=false,focus=false) {
    current=Math.max(0,Math.min(index,dimensions.length-1));const d=dimensions[current];if(!d)return;
    [...tabs.children].forEach((b,i)=>{b.setAttribute('aria-selected',String(i===current));b.tabIndex=i===current?0:-1;});
    panel.setAttribute('aria-labelledby',`se-tab-${d.id}`);panel.replaceChildren();
    const heading=make('div','se-heading');heading.append(make('h3','',d.title),make('span','se-count',`${current+1} / ${dimensions.length}`));panel.append(heading);
    const pair=make('div','se-pair');pair.append(side(d.left,'领英行业参考',true),side(d.right,'我们的 Tripo 广告与资产参考',true));panel.append(pair);
    const takeaway=make('div','se-takeaway');takeaway.append(make('strong','','合到我们的新广告里'),make('p','',d.takeaway));panel.append(takeaway);
    if(arr(d.relatedCaseIds).length)panel.append(thumbnails(d.relatedCaseIds,'补充图证'));
    const nav=make('div','se-footer-nav');const prev=button('← 上一项');const next=button('下一项 →');prev.disabled=current===0;next.disabled=current===dimensions.length-1;
    prev.onclick=()=>{select(current-1,true,true);panel.scrollIntoView({block:'start'});};next.onclick=()=>{select(current+1,true,true);panel.scrollIntoView({block:'start'});};nav.append(prev,next);panel.append(nav);
    if(updateHash)history.replaceState(null,'',`#style-evidence-${encodeURIComponent(d.id)}`);
    if(focus)panel.focus({preventScroll:true});
  }
  function fromHash(scroll=false) {const prefix='#style-evidence-';if(!location.hash.startsWith(prefix))return;const id=decodeURIComponent(location.hash.slice(prefix.length));const i=dimensions.findIndex(d=>d.id===id);if(i>=0){select(i);if(scroll)root.scrollIntoView({block:'start'});}}
  async function init() {
    try {
      const response=await fetch(new URL('style-evidence-data.json?v=20261008-1',base));if(!response.ok)throw new Error('HTTP '+response.status);const data=await response.json();
      dimensions=arr(data.dimensions);cases=new Map(arr(data.cases).map(c=>[c.id,c]));if(dimensions.length!==7)throw new Error('Expected seven dimensions');
      root.replaceChildren();root.append(make('h2','','两类视觉参考，每一条特点都有图。'),make('p','se-lede',str(data.intro)||'逐项比较领英行业参考与 Tripo 效果广告。先看原图，再看具体观察和可采用的做法。'));
      root.append(make('p','se-scope','这些是本次所看案例的特点，不代表领英只有一种风格。官方自然帖、第三方广告归档、用户历史素材分别标注；视觉参考不是投放效果或产品能力证明。所有图片保持原比例，点击可放大。'));
      tabs=make('div','se-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','七个广告比较维度');
      dimensions.forEach((d,i)=>{const b=button(d.title);b.id=`se-tab-${d.id}`;b.setAttribute('role','tab');b.setAttribute('aria-controls','se-evidence-panel');b.onclick=()=>select(i,true);b.addEventListener('keydown',e=>{let target=i;if(e.key==='ArrowRight')target=(i+1)%dimensions.length;else if(e.key==='ArrowLeft')target=(i+dimensions.length-1)%dimensions.length;else if(e.key==='Home')target=0;else if(e.key==='End')target=dimensions.length-1;else return;e.preventDefault();select(target,true);tabs.children[target].focus();});tabs.append(b);});root.append(tabs);
      panel=make('div','se-panel');panel.id='se-evidence-panel';panel.setAttribute('role','tabpanel');panel.tabIndex=-1;root.append(panel);
      const fusion=make('section','se-fusion');fusion.id='style-fusion';fusion.append(make('h3','','我们的新稿，具体要取什么、改什么？'),make('p','','每条原则都连接参考图与现有 V11 稿。以下是创意诊断，不是效果排名；V12 尚未制作完成。'));
      arr(data.fusionPrinciples).forEach(p=>{const row=make('article','se-principle');const copy=make('div');copy.append(make('h4','',p.title));const gap=make('p');gap.append(make('strong','','当前差距：'),document.createTextNode(str(p.gap)));const action=make('p');action.append(make('strong','','下一稿动作：'),document.createTextNode(str(p.action)));copy.append(gap,action);const images=make('div','se-proof-strip');images.append(thumbnails(p.caseIds,'对应参考'),thumbnails(p.currentCaseIds,'当前 V11，点击检查'));row.append(copy,images);fusion.append(row);});root.append(fusion);
      const library=make('details','archive-note');library.append(make('summary','','本节完整图证索引与来源'));arr(data.cases).forEach(c=>{const p=make('p');const source=url(c.sourceUrl);p.append(make('strong','',c.title+' · '),document.createTextNode(c.evidenceLabel+' '));if(source)p.append(anchor('来源页面',source));library.append(p);});root.append(library);
      dialog=make('dialog','se-dialog');dialog.setAttribute('aria-labelledby','se-dialog-title');const head=make('div','se-dialog-head');dialogTitle=make('h3');dialogTitle.id='se-dialog-title';const close=button('关闭 ×');close.onclick=()=>dialog.close();head.append(dialogTitle,close);dialogImage=make('img','se-dialog-image');dialogCaption=make('div','se-dialog-caption');dialog.append(head,dialogImage,dialogCaption);dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});document.body.append(dialog);
      select(0);fromHash(true);window.addEventListener('hashchange',()=>fromHash(true));
      if(location.hash==='#style-evidence')root.scrollIntoView({block:'start'});
    }catch(error){root.replaceChildren(make('h2','','图证对照暂未加载'),make('p','se-load','可刷新页面重试；下方既有案例库和广告稿仍可查看。'));const retry=button('重试加载');retry.onclick=init;root.append(retry);console.error('Style evidence:',error.message);}
  }
  init();
})();
