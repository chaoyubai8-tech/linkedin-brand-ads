import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = new URL('./', import.meta.url);
const data = JSON.parse(await fs.readFile(new URL('messages-conversation-data.json', root), 'utf8'));
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const len = s => Array.from(s).length;
const sources = [
  ['LinkedIn 两种站内信格式', 'https://www.linkedin.com/help/linkedin/answer/a421259'],
  ['Conversation Ad 当前规格', 'https://www.linkedin.com/help/lms/answer/a426057'],
  ['Conversation Ad 创建与按钮动作', 'https://www.linkedin.com/help/lms/answer/a425089'],
  ['发送者授权', 'https://www.linkedin.com/help/lms/answer/a427571'],
  ['英文资料语言与发送机制', 'https://www.linkedin.com/help/linkedin/answer/a421723/'],
  ['EEA 与瑞士接收条件', 'https://www.linkedin.com/help/lms/answer/a544586'],
  ['Tripo Teams 试用及共享工作区', 'https://www.tripo3d.ai/programs/team-program'],
  ['Tripo Teams 管理与可见性', 'https://www.tripo3d.ai/blog/tripo-turns-1-team-plan'],
  ['Tripo API Quick Start', 'https://developers.tripo3d.ai/en/docs/quick-start'],
  ['Tripo API 能力与异步机制', 'https://developers.tripo3d.ai/en/docs/introduction']
];

assert.equal(data.format, 'Conversation Ad');
assert.equal(data.flows.length, 4);
assert.deepEqual(data.flows.map(f => f.groupId).sort(), ['api-eu','api-us','teams-eu','teams-us']);
assert.equal(new Set(data.flows.map(f => f.id)).size, 4);
const checks = [];
const records = [];
for (const f of data.flows) {
  for (const k of ['subject','subjectZh','footer','footerZh','copyNote','caseLearning','visualNote']) assert(f[k]?.trim(), f.id + ' missing ' + k);
  assert(len(f.subject) <= data.limits.subject, f.id + ' subject');
  assert(len(f.footer) <= 20000, f.id + ' footer');
  assert.equal(f.nodes.length, 3);
  assert.equal(new Set(f.nodes.map(n => n.id)).size, f.nodes.length);
  const byId = new Map(f.nodes.map(n => [n.id,n]));
  assert(byId.has('intro'));
  let buttonCount = 1; // Platform-added Not Interested, once in the introduction.
  const visited = new Set();
  const visit = (id, active = new Set()) => {
    assert(!active.has(id), f.id + ' cycle ' + id);
    visited.add(id);
    const n = byId.get(id); assert(n, f.id + ' missing response ' + id);
    const path = new Set(active); path.add(id);
    for (const b of n.buttons) if (b.action === 'next') visit(b.target, path);
  };
  for (const n of f.nodes) {
    for (const k of ['label','labelZh','message','messageZh']) assert(n[k]?.trim(), f.id + '/' + n.id + ' missing ' + k);
    assert(len(n.message) <= data.limits.message);
    assert(len(n.message) <= data.limits.editorialMessage, 'Editorial short-copy limit: ' + f.id + '/' + n.id);
    assert(n.buttons.length > 0, 'Dead end: ' + f.id + '/' + n.id);
    assert(n.buttons.length + (n.id === 'intro' ? 1 : 0) <= data.limits.messageButtons);
    if (n.id === 'intro') assert(n.buttons.length <= data.limits.firstCustomButtons);
    assert.equal(n.buttons[0].action, 'website', 'Keep direct business CTA first');
    assert.equal(new Set(n.buttons.map(b => b.id)).size, n.buttons.length);
    buttonCount += n.buttons.length;
    for (const b of n.buttons) {
      assert(b.label?.trim() && b.labelZh?.trim());
      assert(len(b.label) <= data.limits.cta, f.id + '/' + b.id + ' CTA too long');
      assert(['website','next'].includes(b.action));
      if (b.action === 'next') { assert(byId.has(b.target)); assert(!b.url); }
      else {
        const url = new URL(b.url); assert.equal(url.protocol,'https:');
        assert(['www.tripo3d.ai','developers.tripo3d.ai'].includes(url.hostname));
        assert(len(b.url) <= data.limits.url); assert(!b.target);
      }
      records.push({flowId:f.id,group:f.label,format:data.format,subject:f.subject,subjectZh:f.subjectZh,nodeId:n.id,nodeLabel:n.labelZh,message:n.message,messageZh:n.messageZh,buttonId:b.id,buttonText:b.label,buttonTextZh:b.labelZh,action:b.action,target:b.target||'',url:b.url||'',footer:f.footer,footerZh:f.footerZh,reviewStatus:data.status});
    }
    checks.push({flow:f.id,node:n.id,characters:len(n.message),buttons:n.buttons.length,passes:true});
  }
  visit('intro'); assert.equal(visited.size, f.nodes.length, f.id + ' unreachable node');
  assert(buttonCount <= data.limits.conversationButtons);
  const png = await fs.readFile(new URL(f.banner,root));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),300); assert.equal(png.readUInt32BE(20),250); assert(png.length <= 2*1024*1024);
}
assert.equal(checks.length,12,'Page quantity expects 12 messages');
assert.equal(records.length,20,'Page quantity expects 20 custom buttons');
const fields = Object.keys(records[0]);
const csv = s => '"' + String(s ?? '').replaceAll('"','""') + '"';
await fs.writeFile(new URL('messages-conversation-copy.csv',root),'\uFEFF' + [fields.map(csv).join(','),...records.map(r=>fields.map(k=>csv(r[k])).join(','))].join('\r\n'));
await fs.writeFile(new URL('messages-conversation-copy.json',root),JSON.stringify({version:data.version,format:data.format,status:data.status,limits:data.limits,flows:data.flows},null,2)+'\n');

const nodeCopy = (f,n) => `<article class="static-node"><h3>${esc(n.labelZh)} · ${esc(n.id)}</h3><div class="all-copy-pair"><div><h4>英文投放字段</h4><pre lang="en">${esc(n.message)}</pre></div><div><h4>中文释义 · 仅供审稿</h4><pre>${esc(n.messageZh)}</pre></div></div><div class="table-scroll"><table><thead><tr><th>英文按钮</th><th>中文意思</th><th>平台动作</th><th>下一段／目的地</th></tr></thead><tbody>${n.buttons.map(b=>`<tr><td lang="en">${esc(b.label)}</td><td>${esc(b.labelZh)}</td><td>${b.action==='next'?'Show next message':'Visit website'}</td><td>${b.action==='next'?esc(b.target):`<a href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">${esc(f.destinationLabel)}</a>`}</td></tr>`).join('')}</tbody></table></div></article>`;
const raw = JSON.stringify(data).replaceAll('<','\\u003c');
const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>领英站内信广告 · 对话流程审稿</title><meta name="description" content="4套Conversation Ad主流程。对照LinkedIn案例、Message Ad格式和现行规格，提供可点击的预写消息树、完整中文释义及逐节点导出。未发送。"><link rel="stylesheet" href="messages-conversation.css?v=20261011-conversation"></head>
<body class="conversation-page"><a class="skip" href="#conversation-review">跳到对话广告审稿</a>
<header class="topbar"><strong>Tripo / 领英品牌广告</strong><nav aria-label="全站导航"><a href="index.html">广告首页</a><a href="workflow.html">制作工作流</a><a href="messages-single.html">原单按钮稿</a><a href="messages.html">历史8套</a><a href="https://github.com/chaoyubai8-tech/linkedin-brand-ads">GitHub源码</a></nav></header>
<main>
<header class="page-intro"><div><h1>领英站内信广告</h1><p class="quantity">4套主流程 · Conversation Ad 对话广告</p><p>先回答“与我的项目有什么关系”，再让读者选择直接行动或先了解。英文是投放草稿，中文是完整审稿释义。</p><p class="format-link"><a href="#format-audit">为什么从单按钮稿改成对话流程？</a> · <a href="#case-learning">案例怎么用到新稿？</a></p></div><a class="download-link" href="messages-conversation-copy.csv" download>下载4套逐节点双语CSV ↓</a></header>
<aside class="status-line"><p><strong>可审文案与路径，尚未发送。</strong> 本页是预写按钮决策树，不是AI聊天机器人，也不是LinkedIn后台截图。发送者授权、真实配图、表单／UTM与归因仍待配置；原Message Ad稿保留，不要求两种格式同时投。</p></aside>
<div class="review-layout" id="conversation-review"><nav class="audiences" aria-label="选择对话广告人群"><h2>已确认的4个主组</h2>${data.flows.map(f=>`<a href="#${esc(f.id)}" data-flow="${esc(f.id)}"><strong>${esc(f.label)}</strong><span>${esc(f.direction)}</span></a>`).join('')}</nav><div class="review-main"><div id="conversation-loading">正在加载可点击预览。下方完整双语稿不依赖JavaScript，也可直接下载。</div><div id="conversation-content" hidden></div></div></div>

<section class="section-bottom" id="format-audit"><h2>格式核对：旧稿不是错格式，但不是这份案例的形式</h2><div class="table-scroll"><table><thead><tr><th>维度</th><th>原 Message Ad</th><th>本轮 Conversation Ad</th></tr></thead><tbody><tr><td>消息结构</td><td>正文＋1个业务CTA</td><td>短开场＋直接行动／两条信息路径</td></tr><tr><td>读者选择</td><td>直接访问目的地</td><td>访问网页，或看所选问题的预写回复</td></tr><tr><td>适合当前什么任务</td><td>一项已清楚的行动</td><td>让不同准备程度的读者先取得所需信息</td></tr><tr><td>本次数量</td><td>原4主稿＋4备稿＋2再营销预留</td><td>4套主流程，每套3条消息；不是12个广告组</td></tr></tbody></table></div><p class="conclusion">结论：两者都属于LinkedIn Sponsored Messaging。本次按用户提供的Conversation Ads案例打磨主流程；没有证据说明它一定比Message Ad转化更好，格式需结合投测选择，不默认双倍上线。</p><p><a href="messages-single.html">原单按钮10套完整双语稿 →</a> 再营销2套仍需匹配原视频、实际人群与案例后才能启用；Before / After继续暂停。</p></section>

<section class="section-bottom" id="case-learning"><h2>案例怎么落到我们的路径</h2><p>参考用户提供的《LinkedIn Conversation Ads - Case Study》。已逐页查看11页；以下只总结结构，不公开PDF、联系人截图或复用案例的业绩数字。</p><div class="table-scroll"><table><thead><tr><th>案例与页码</th><th>可借鉴的机制</th><th>在Tripo稿里怎么使用</th><th>不能照搬什么</th></tr></thead><tbody><tr><td>Huawei · 第5页</td><td>立即沟通与技术了解分开</td><td>Teams直接申请，API直接看Quick Start；另外保留问题解释路径</td><td>没有获准真实案例，不设“看客户案例”按钮</td></tr><tr><td>Jabra · 第9页</td><td>接住还没准备转化的读者</td><td>先解释团队访问、试用准备或接入要求，不强迫首屏填表</td><td>不把“稍后”做成已订阅提醒，不重复平台Not Interested</td></tr><tr><td>LinkedIn Learning · 第11页</td><td>用户选择感兴趣的内容</td><td>按钮写具体问题，下一段真正回答该问题</td><td>不让已定向的读者重新选择Teams／API／其他产品</td></tr></tbody></table></div><p class="conclusion">结论：借鉴的是“意愿选择→相关回答→明确下一步”，不是照抄长文、按钮数量或第三方高点击／低CPL。本站的转化表现尚未验证。</p></section>

<section class="section-bottom" id="quantity"><h2>这一轮到底准备多少</h2><div class="table-scroll"><table><thead><tr><th>内容</th><th>本轮准备</th><th>是否新增投放组</th></tr></thead><tbody><tr><td>Conversation Ad</td><td>4套主流程，12条短消息，20个自定义按钮</td><td>否，仍对应已确认的4个人群</td></tr><tr><td>站内信配图</td><td>4张300×250桌面配图待制作；本轮不加消息内图</td><td>否，侧栏图非信息流单图</td></tr><tr><td>Message Ad旧稿</td><td>4主稿＋4备稿，另2再营销预留</td><td>格式备选／历史，不默认同时上线</td></tr><tr><td>再营销</td><td>沿用原计划，证据和覆盖补齐后另审</td><td>本次不启用</td></tr></tbody></table></div><p class="conclusion">结论：先把4套主流程和4张对应桌面配图审好。按钮与回复不是额外素材组；信息流单图另计，当前改稿不增加预算或人群。</p></section>

<section class="section-bottom" id="platform-check"><h2>平台规格与上线验收</h2><div class="table-scroll"><table><thead><tr><th>检查项</th><th>现行官方规格／本轮策略</th><th>本站状态</th></tr></thead><tbody><tr><td>可选主题</td><td>最多60字符；不填时首条内容作收件箱预览</td><td>四套均提供英文主题和中文释义</td></tr><tr><td>每条消息</td><td>平台硬上限8000字符；本轮编辑标准≤500</td><td>12条原始英文纯文本均校验，不是把500说成官方硬上限</td></tr><tr><td>CTA及数量</td><td>CTA≤25字符；每条≤5、整套≤50；首条自动Not Interested占1个</td><td>首条3自定义＋1平台按钮，回复各1；平台按钮不手动上传</td></tr><tr><td>按钮动作</td><td>下一条预写消息／网页／Lead Gen Form</td><td>本轮用next与website，至少一条网页CTA；未配置原生表单</td></tr><tr><td>配图</td><td>桌面banner300×250 PNG/JPG≤2MB；消息内250×250图是另一个字段</td><td>历史配图仅存作参考，非本轮中台产出；移动端正文独立成立</td></tr><tr><td>发件人及投测</td><td>授权发件人、实际后台预览和测试消息</td><td>未授权／未配置／未发送；网站校验不能代替后台验收</td></tr><tr><td>欧洲与语言</td><td>英文仅英文资料；EEA／瑞士需成员opt-in</td><td>实际可覆盖人群仍需在账户核对</td></tr></tbody></table></div><p class="conclusion">结论：文案字符与路径检查通过，只代表可以继续配置。正式上线还要做发送者、目标、可覆盖人群、真实画面、承接与归因验收。</p><p>若选择Lead generation目标，必须另配置至少一个原生Lead Gen Form CTA、有效表单与隐私说明。API文档访问或外部申请入口不等于该目标已配置完成，也不能把分支点击计作有效线索。</p><p>配图制作仍须：素材中台选材与记录→真实模型／渲染证据→允许范围内的AI精修→精确排版→按《广告素材视觉规范》逐项核对→中台回存。不能用GPT概念图证明实际生成质量，本次没有运行新模型制作。</p></section>

<section class="section-bottom" id="all-conversations"><h2>全部4套逐节点双语稿</h2><p>不启用JavaScript也能查看。CSV／JSON是审稿与后台手工配置参考，不是LinkedIn直传模板。中文与本地审稿标签不要上传为英文广告字段。<a href="messages-conversation-copy.json" download>下载完整流程JSON</a></p>${data.flows.map(f=>`<details id="copy-${esc(f.id)}"><summary>${esc(f.id)} · ${esc(f.label)}</summary><div class="static-fields"><p><strong>可选主题：</strong><span lang="en">${esc(f.subject)}</span><br>中文：${esc(f.subjectZh)}</p><p><strong>补充说明：</strong><span lang="en">${esc(f.footer)}</span><br>中文：${esc(f.footerZh)}</p></div>${f.nodes.map(n=>nodeCopy(f,n)).join('')}<p class="conclusion">结论：${esc(f.copyNote)}</p></details>`).join('')}</section>

<section class="section-bottom"><h2>来源与交付</h2><details><summary>展开官方依据及本次修改记录</summary><p>平台与产品页面核验日期：2026.10.11。新规范优先于旧tips页；不沿用历史欧洲禁投说法。案例结构来自用户附件，PDF不作为Tripo业绩证据。</p><ul>${sources.map(([label,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a></li>`).join('')}</ul><p><a href="messages-conversation-revision.md">格式判断、改稿理由与事实核验</a> · <a href="messages-conversation-QA.md">测试记录</a> · <a href="messages-next-README.md">交付说明</a></p><p>使用本地PDF、ad-creative、copy-editing、tripo-ad-workbench、tripo-ad-claims及impeccable。私有技能库本轮认证连接失败，未宣称云端已同步；不更改云端规则。HTML/CSS/JavaScript审稿页面，不是Figma导出。</p></details></section>
</main><footer><span>2026.10.11 · Conversation Ad双语审稿版 · 未发送</span><a href="messages-next.LICENSE.txt">代码许可与素材边界</a></footer>
<script type="application/json" id="conversation-data">${raw}</script><script src="messages-conversation.js?v=20261011-conversation" defer></script></body></html>`;
await fs.writeFile(new URL('messages-next.html',root),html);
console.log(JSON.stringify({page:'messages-next.html',flows:data.flows.length,nodes:checks.length,customButtons:records.length,checks,graph:'all nodes reachable; acyclic; no dead-end response',passed:true},null,2));
