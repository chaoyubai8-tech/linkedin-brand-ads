(() => {
  'use strict';
  const panel = document.querySelector('#conversation-content');
  const loading = document.querySelector('#conversation-loading');
  try {
    const data = JSON.parse(document.querySelector('#conversation-data').textContent);
    const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const alias = {'M-T-US-A':'C-T-US','M-T-US-B':'C-T-US','M-T-EU-A':'C-T-EU','M-T-EU-B':'C-T-EU','M-A-US-A':'C-A-US','M-A-US-B':'C-A-US','M-A-EU-A':'C-A-EU','M-A-EU-B':'C-A-EU'};
    let flow, history = [], route = null;
    const selected = () => data.flows.find(f => f.id === (alias[location.hash.slice(1)] || location.hash.slice(1))) || data.flows[0];
    const routeLegacyReserve = () => {
      const key=location.hash.slice(1);
      if(!['M-R-US','M-R-EU'].includes(key)) return false;
      location.replace('messages-single.html#'+key);
      return true;
    };
    const choose = () => {flow=selected(); history=[{nodeId:'intro'}];route=null;render();};
    const node = id => flow.nodes.find(n=>n.id===id);
    const actionName = b => b.action==='next' ? 'Show next message' : 'Visit website';
    const exportFlow = zh => [
      `${flow.id} | ${flow.label} | Conversation Ad | REVIEW ONLY — NOT SENT`,
      `${zh?'可选主题':'Optional subject'}: ${zh?flow.subjectZh:flow.subject}`,
      ...flow.nodes.map(n=>`\n[${n.id}] ${zh?n.labelZh:n.label}\n${zh?n.messageZh:n.message}\n\n${n.buttons.map(b=>`${zh?b.labelZh:b.label} | ${actionName(b)} | ${b.target||b.url}`).join('\n')}`),
      `\n${zh?'补充说明':'Custom footer'}: ${zh?flow.footerZh:flow.footer}`,
      zh ? '\n首条Not Interested由平台自动添加，勿重复上传。中文仅供审稿。' : '\nNot Interested is platform-added on the introduction; do not upload a duplicate button.'
    ].join('\n\n');
    const fullFlow = () => exportFlow(false)+'\n\n========== 中文释义 · 仅供审稿 ==========\n\n'+exportFlow(true);
    function render() {
      document.querySelectorAll('[data-flow]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.flow===flow.id)));
      const last = history.length-1;
      panel.innerHTML = `<header class="group-heading"><div><h2>${esc(flow.label)}</h2><p>${esc(flow.audience)}<br>${esc(flow.direction)}</p></div><span class="tag">${esc(flow.id)} · 草稿</span></header>
      <div class="conversation-toolbar"><p>点击英文按钮试走预写路径；中文释义同步显示。</p><button type="button" data-reset>从开场重新查看</button></div>
      <div class="conversation-review-pair"><section class="conversation-preview" aria-label="英文对话广告示意"><div class="mock-head"><strong>Messaging</strong><small>本地审稿示意 · 非后台预览</small></div><div class="inbox-subject"><span>Optional subject · 可选收件箱主题</span><strong lang="en">${esc(flow.subject)}</strong></div><div class="conversation-thread"><div class="sender"><span class="avatar" aria-hidden="true">T</span><div><strong>发件人待授权 · Tripo</strong><p>需真实账号授权后在Campaign Manager配置</p></div></div>${history.map((entry,i)=>{const n=node(entry.nodeId);return `<article class="conversation-step" id="preview-${esc(n.id)}"><p class="sponsored">Sponsored · ${i===0?'开场消息':'预写回复'}</p><div class="conversation-body" lang="en">${esc(n.message)}</div>${i===last?`<div class="conversation-actions">${n.buttons.map((b,j)=>`<button type="button" lang="en" data-choice="${esc(b.id)}" class="${j===0?'primary-action':''}">${esc(b.label)}</button>`).join('')}</div>`:''}${i===0?'<span class="platform-decline" lang="en">Not Interested</span><small class="platform-note">平台自动附加；本地示意不执行删除或归档</small>':''}${entry.choice?`<p class="reader-choice">读者点击的预设选项<strong lang="en">${esc(entry.choice)}</strong></p>`:''}</article>`;}).join('')}<p class="custom-footer" lang="en">${esc(flow.footer)}</p></div></section>
      <section class="translation-panel" aria-label="中文释义"><h3>完整中文释义</h3><p class="translation-note">仅供内部审稿，不作为英文广告字段上传。</p><p class="zh-subject">主题：${esc(flow.subjectZh)}</p>${history.map((entry,i)=>{const n=node(entry.nodeId);return `<article class="translation-step"><h4>${esc(n.labelZh)}</h4><div class="translation-message">${esc(n.messageZh)}</div>${entry.choiceZh?`<p class="reader-choice">读者选择<strong>${esc(entry.choiceZh)}</strong></p>`:i===last?`<div class="translation-choices">这条消息的按钮<ul>${n.buttons.map(b=>`<li><span>${esc(b.labelZh)}</span>：${b.action==='next'?'看下一段回复':'打开官方网页'}</li>`).join('')}</ul></div>`:''}</article>`;}).join('')}<p class="custom-footer">补充说明：${esc(flow.footerZh)}</p></section></div>
      ${route?`<section class="conversation-route" id="route-review"><h3>此按钮在广告里会打开网页</h3><p><strong>${esc(route.label)} / ${esc(route.labelZh)}</strong><br>${esc(flow.destinationLabel)}。本地审稿只展示路径，未提交表单、注册或发送消息。</p><a href="${esc(route.url)}" target="_blank" rel="noopener noreferrer">另开官方目的地 →</a><p><code>${esc(route.url)}</code></p><p>${flow.product==='Teams'?'目前采用外部Teams试用申请页；不是已配置的LinkedIn Lead Gen Form。':'这是API文档，不是已经完成API调用或业务集成。'}</p></section>`:''}
      <div class="tools"><button type="button" data-copy="en">复制本套英文流程</button><button type="button" data-copy="zh">复制本套中文释义</button><button type="button" data-download>下载本套双语TXT</button></div><p class="copy-feedback" role="status" aria-live="polite"></p>
      <section class="conversation-notes"><h3>本套逻辑与验收边界</h3><p>${esc(flow.copyNote)}</p><p><strong>案例借鉴：</strong>${esc(flow.caseLearning)}</p><p><strong>衡量：</strong>${esc(flow.metric)}</p><div class="checks">${flow.nodes.map(n=>`<span>${esc(n.id)} · ${Array.from(n.message).length}/500 编辑标准 · ${n.buttons.length}个自定义按钮</span>`).join('')}</div><details><summary>查看历史桌面配图与待替换要求</summary><img src="${esc(flow.banner)}" alt="${esc(flow.bannerAlt)}" width="300" height="250"><p class="visual-warning">${esc(flow.visualNote)}</p><p>当前图片仅历史参考，未批准用作本轮真实证据；正式配图需走素材中台与视觉规范逐项验收。本轮不新增消息内图。</p></details><details class="flowmap" open><summary>查看全部按钮与后台动作映射</summary><div class="table-scroll"><table><thead><tr><th>消息</th><th>按钮：英文／中文</th><th>后台动作</th><th>结果</th></tr></thead><tbody>${flow.nodes.flatMap(n=>n.buttons.map(b=>`<tr><td>${esc(n.labelZh)}</td><td lang="en">${esc(b.label)}<br><span lang="zh-CN">${esc(b.labelZh)}</span></td><td>${actionName(b)}</td><td>${b.action==='next'?esc(node(b.target).labelZh):esc(flow.destinationLabel)}</td></tr>`)).join('')}</tbody></table></div><p>首条另含平台自动Not Interested；导出只含自定义按钮。没有开放输入框或自动追发。</p></details></section>`;
      panel.hidden=false;loading.hidden=true;
      panel.querySelector('[data-reset]').addEventListener('click',()=>{history=[{nodeId:'intro'}];route=null;render();panel.querySelector('[data-reset]').focus();});
      panel.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{
        const n=node(history.at(-1).nodeId), b=n.buttons.find(x=>x.id===button.dataset.choice);
        if(b.action==='next') {history.at(-1).choice=b.label;history.at(-1).choiceZh=b.labelZh;history.push({nodeId:b.target});route=null;render();panel.querySelector(`#preview-${b.target} [data-choice]`).focus();}
        else {route=b;render();panel.querySelector('#route-review a').focus();}
      }));
      panel.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
        const feedback=panel.querySelector('.copy-feedback');
        try {await navigator.clipboard.writeText(exportFlow(button.dataset.copy==='zh'));feedback.textContent='已复制本套完整'+(button.dataset.copy==='zh'?'中文释义':'英文流程')+'，含每条消息、按钮与动作。';}
        catch {feedback.textContent='浏览器未允许复制。请下载本套TXT，或到下方完整稿选中文本。';}
      }));
      panel.querySelector('[data-download]').addEventListener('click',()=>{
        const blob=new Blob([fullFlow()],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=flow.id+'-conversation-bilingual.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);panel.querySelector('.copy-feedback').textContent='已开始下载本套完整双语流程TXT。';
      });
    }
    window.addEventListener('hashchange',()=>{if(routeLegacyReserve())return;const key=alias[location.hash.slice(1)]||location.hash.slice(1);if(data.flows.some(f=>f.id===key)&&key!==flow.id)choose();});
    document.querySelectorAll('[data-flow]').forEach(a=>a.addEventListener('click',()=>{if(flow?.id===a.dataset.flow){history=[{nodeId:'intro'}];route=null;render();}}));
    if(!routeLegacyReserve())choose();
  } catch(error) {
    loading.className='error';loading.textContent='互动预览未能加载。下方4套完整双语稿仍可查看，CSV／JSON也可下载。';
  }
})();
