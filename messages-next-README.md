# 领英站内信广告 · Conversation Ad 修订版

日期：2026-10-11。在线审稿：[4套对话流程](https://chaoyubai8-tech.github.io/linkedin-brand-ads/messages-next.html)。[原10套单按钮稿](https://chaoyubai8-tech.github.io/linkedin-brand-ads/messages-single.html)保留为备选／历史，不默认双倍上线。

## 格式与数量

原正文＋一个业务CTA是合法Message Ad。用户PDF案例为Conversation Ads，按钮触发预写回复或目的地，不是开放输入的AI聊天。本轮按其机制重磨4套主流程。

| 已确认人群 | 核心诉求 | ID |
| --- | --- | --- |
| Teams · 美国游戏 | 创建、查找与复用共享游戏资产 | C-T-US |
| Teams · 欧洲游戏 | 关卡／原型的具体资产用途 | C-T-EU |
| API · 美国游戏＋3D资产 | 异步生成任务接入自己的游戏工具 | C-A-US |
| API · 欧洲企业内容 | 审核后的3D模型用于自己的产品展示平台 | C-A-EU |

结论：4套，每套开场＋工作流程回复＋试用／接入检查回复；共12条消息、20个自定义按钮。不是12或20个广告组，不增加预算。直接行动置于首按钮，回复均有网页出口。

Teams出口为官方Team Program申请页；API出口为Quick Start，不冒充已集成或已产生有效线索。旧4主稿＋4备稿＋2再营销预留仍在单独页面；再营销证据／覆盖待确认，Before / After继续暂停。没有已验证的新旧格式转化优劣。

## 修改与生成

新版改 `messages-conversation-data.json`，执行 `node build-conversation.mjs`，生成主入口 `messages-next.html` 和 `messages-conversation-copy.csv/json`。

旧版改 `messages-next-data.json`，执行 `node build-messages-next.mjs`，现在生成 `messages-single.html` 和旧Message Ad导出，**不会覆盖新版入口**。两种格式的数据、上限和生成器分开。

新版校验4人群、12节点、20按钮、全部中文、字符长度、动作目的地、无环／可达／无死路以及历史配图尺寸。中文包含主题、正文、所有按钮与补充说明；复制和本套双语TXT在浏览器本地完成；CSV/JSON是审稿与后台手工配置参考，非LinkedIn直传模板。下方完整稿静态嵌入HTML，不依赖JavaScript。

静态HTML/CSS/JS，无服务器、发送接口、分析代码或客户数据。Pages发布gh-pages分支根目录。原主稿深链转到对应新版；旧再营销 `#M-R-US`／`#M-R-EU` 转到单按钮页面的正确预留稿。历史8套不覆盖。

## 现行规格与未完成项

Conversation Ad现行规格：可选主题60；消息8000；CTA25；URL2000；每消息最多5、整套50个按钮。首条平台自动Not Interested占1，勿重复上传。本轮消息≤500是内部编辑标准，不是官方硬上限。

本轮采用Visit website和Show next message。若投Lead generation目标，**须另配置至少一个原生Lead Gen Form CTA**、有效表单、隐私说明和后续承接。文档点击或外部申请入口不等于该目标已配置完成。发送者授权、实际账户目标兼容、预览／测试消息、UTM与有效线索归因均待验收。

英文仅覆盖英文资料用户；EEA／瑞士仅覆盖已opt-in成员，实际资格及覆盖需核对，不沿用历史欧洲禁投说法。

桌面banner为可选300×250 PNG/JPG≤2MB；消息内250×250图是另一字段，本轮不加。4张历史banner仅参考，非本轮中台产出，未获准作真实效果证据。API欧洲旧机械角色不匹配产品展示，待替换。

正式配图必须走素材中台选材与记录→真实模型／渲染证据→允许范围内AI精修→精确排版→按《广告素材视觉规范》逐项验收→中台回存。这次未新生成模型或执行中台制作。

结论：当前是**双语文案与路径审稿版**，未配置、未发送；真实配图与后台门槛尚未完成。

## 依据、验收与许可

- [修订理由与承诺核验](messages-conversation-revision.md)
- [本轮测试记录](messages-conversation-QA.md)
- [原Message Ad验收](messages-next-QA.md)／[原文案修订](messages-next-revision.md)
- [官方规格](https://www.linkedin.com/help/lms/answer/a426057)／[创建规则](https://www.linkedin.com/help/lms/answer/a425089)

代码许可见 `messages-next.LICENSE.txt`：新增审稿代码MIT；品牌、文案、图片、字体及第三方案例不自动纳入。PDF仅内部研究，未公开附件或联系人截图。

技能：PDF逐页观察；ad-creative 2.8.2／copy-editing 2.0.0重磨任务与分支；tripo-ad-workbench 1.0.0／tripo-ad-claims 1.0.0核验承诺与制作门槛；impeccable 3.5.0澄清双语审稿界面。私有技能库本轮认证连接失败，采用本地规则回退，未宣称云端已同步或修改云端规则。页面不是Figma导出。
