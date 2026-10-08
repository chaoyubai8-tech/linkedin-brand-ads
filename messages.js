/* Review-only migration. No form submission, analytics, or message sending. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const data = window.MESSAGE_DATA;
  if (!data || !Array.isArray(data.originals) || !Array.isArray(data.suggested)) {
    $('message-status').textContent = '文案暂未加载，请刷新或下载 CSV。';
    return;
  }
  const all = [...data.originals, ...data.suggested];
  const state = {group: 'US', index: 0};
  const records = () => state.group === 'NEW' ? data.suggested : data.originals.filter(m => m.id.startsWith(state.group));
  const current = () => records()[state.index];
  function paragraph(parent, text) { const p = document.createElement('p'); p.textContent = text; parent.append(p); }
  function button(text, action, className) { const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.onclick = action; if (className) b.className = className; return b; }
  function closeRoute() { $('route-preview').hidden = true; $('route-preview').replaceChildren(); }
  function route(cta) {
    const root = $('route-preview'); root.replaceChildren(); root.hidden = false;
    const label = document.createElement('div'); label.className = 'route-label'; label.textContent = '承接路径示意 · 不会提交'; root.append(label);
    const heading = document.createElement('h4'); heading.textContent = cta.route === 'teams' ? 'Explore Tripo Teams for your 3D workflow' : cta.route === 'api' ? 'Explore Tripo API for your use case' : 'Tripo 3D Use Cases'; root.append(heading);
    paragraph(root, cta.destination);
    if (cta.route === 'teams' || cta.route === 'api') {
      paragraph(root, '下方只是表单字段示意，不接收或保存个人信息。');
      const fields = document.createElement('div'); fields.className = 'route-fields';
      ['Work email', 'Company name'].forEach(name => { const f = document.createElement('div'); f.className = 'route-field'; f.textContent = name; const value = document.createElement('span'); value.textContent = '字段示意 · 非真实表单'; f.append(value); fields.append(f); }); root.append(fields);
      const disabled = document.createElement('span'); disabled.className = 'route-submit'; disabled.textContent = 'Submit · 预览禁用'; root.append(disabled);
      paragraph(root, '最终字段与目标地址以上线审核为准。');
    } else paragraph(root, '案例页及独立 UTM 待绑定，本页只展示承接意图。');
    root.append(button('收起路径预览', closeRoute, 'route-reset'));
  }
  function updateHash() { history.replaceState(null, '', '#' + current().id); }
  function render() {
    const m = current();
    $('message-format').textContent = m.type === 'conversation' ? 'Conversation Ad · 三路分流' : 'Message Ad · 单产品 / 单按钮';
    $('message-status').textContent = m.status + ' · ' + m.region;
    $('message-subject').textContent = m.subject; $('inbox-subject').textContent = m.subject;
    $('message-body').replaceChildren(); m.body.split('\n\n').forEach(text => paragraph($('message-body'), text));
    $('message-ctas').replaceChildren(); m.ctas.forEach(cta => $('message-ctas').append(button(cta.label, () => route(cta))));
    if (m.type === 'conversation') $('message-ctas').append(button('Not interested', () => { const root = $('route-preview'); root.replaceChildren(); root.hidden = false; paragraph(root, '退出按钮示意：本预览没有发送消息，也没有修改你的偏好。'); root.append(button('返回预览', closeRoute, 'route-reset')); }, 'decline'));
    closeRoute();
    $('banner-error').hidden = true;
    $('message-banner').src = m.banner; $('message-banner').alt = (m.type === 'conversation' ? 'Teams + API' : m.id === 'NEW-T' ? 'Teams' : 'API') + ' 站内信桌面侧边配图';
    $('banner-download').href = m.banner; $('banner-preview').href = m.banner;
    $('message-id').textContent = m.id + ' / ' + (m.type === 'conversation' ? 'CONVERSATION ADS' : 'MESSAGE ADS');
    $('message-angle').textContent = m.angle; $('message-rationale').textContent = m.rationale;
    $('message-grounding').textContent = m.note + (m.sourceRow ? ' 对应原内部表第 ' + m.sourceRow + ' 行。' : '');
    const counts = $('message-counts'); counts.replaceChildren(); const checks = document.createElement('div'); checks.className = 'checks';
    ['主题 ' + m.counts.subject + ' / 60', '正文 ' + m.counts.body + ' / ' + (m.type === 'message' ? 1500 : 8000), 'CTA 最长 ' + Math.max(...m.counts.ctas) + ' / ' + (m.type === 'message' ? 20 : 25)].forEach(text => { const item = document.createElement('span'); item.className = 'check'; item.textContent = text; checks.append(item); }); counts.append(checks);
    paragraph(counts, '上限沿用 V8 审稿记录；实际投放仍以平台当前字段为准。');
    $('copy-result').textContent = '';
    document.querySelectorAll('.message-tab').forEach((b, i) => { b.setAttribute('aria-selected', String(i === state.index)); b.tabIndex = i === state.index ? 0 : -1; });
    $('messenger').setAttribute('aria-labelledby', 'tab-' + m.id);
  }
  function tabs() {
    const root = document.querySelector('.message-tabs'); root.replaceChildren();
    records().forEach((m, index) => {
      const b = button('', () => { state.index = index; render(); updateHash(); }, 'message-tab'); b.id = 'tab-' + m.id; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'messenger');
      const id = document.createElement('small'); id.textContent = m.id; b.append(id, document.createTextNode(m.angle));
      b.onkeydown = event => { const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']; if (!keys.includes(event.key)) return; event.preventDefault(); const n = records().length; state.index = event.key === 'Home' ? 0 : event.key === 'End' ? n - 1 : (state.index + (event.key === 'ArrowRight' ? 1 : -1) + n) % n; render(); updateHash(); root.children[state.index].focus(); };
      root.append(b);
    });
    document.querySelectorAll('[data-group]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.group === state.group)));
    render();
  }
  function selectHash() {
    const m = all.find(item => '#' + item.id === location.hash);
    if (m) { state.group = m.id.startsWith('NEW') ? 'NEW' : m.id.slice(0, 2); state.index = records().findIndex(item => item.id === m.id); }
    tabs();
  }
  document.querySelectorAll('[data-group]').forEach(b => { b.onclick = () => { state.group = b.dataset.group; state.index = 0; tabs(); updateHash(); }; });
  document.querySelectorAll('[data-device]').forEach(b => { b.onclick = () => { $('messenger').classList.toggle('mobile', b.dataset.device === 'mobile'); document.querySelectorAll('[data-device]').forEach(other => other.setAttribute('aria-pressed', String(other === b))); }; });
  $('message-banner').onerror = () => { $('banner-error').hidden = false; };
  $('message-banner').onload = () => { $('banner-error').hidden = true; };
  $('copy-message').onclick = async () => { const m = current(); const text = m.subject + '\n\n' + m.body + '\n\n' + m.ctas.map(c => c.label + ' → ' + c.destination).join('\n'); try { await navigator.clipboard.writeText(text); $('copy-result').textContent = '已复制主题、正文与 CTA。'; } catch { $('copy-result').textContent = '浏览器未允许复制，请下载 CSV 获取完整文案。'; } };
  window.addEventListener('hashchange', selectHash);
  selectHash();
})();
