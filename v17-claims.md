# V17 — 官方承诺核验与文案交付

核验日期：2026-10-08（Asia/Shanghai）。范围：**4 个主方向 + 2 条 Teams 再营销，共 6 套**；每套包含信息流主文/标题/CTA、站内信 subject/body/CTA 和中译要点。按用户最新要求，不做 Before/After；对照方向不属于本轮，也不阻塞本轮。仅本地草稿，未投放。

已完整阅读本地 `tripo-ad-claims` **1.0.0**、`references/claim-register.md`、`ad-creative` **2.8.2** 及其平台规格参考。前者要求把功能事实与画面暗示一起核对，后者使用 Mode 1，根据既有产品资料和用户固定广告组写作，不假定已有投放胜出数据。主线程已确认云端规则与本地版本匹配。

## 本轮定位与画面边界

| 广告组 | 主方向 | 英文主标题 |
| --- | --- | --- |
| Teams 美国游戏 | 资产交接、共享与制作组织 | Less file chasing. More game-making. |
| Teams 欧洲游戏 | 同一游戏项目的角色、道具与环境 | Your next game. One shared workspace. |
| API 美国游戏与资产 | 生成接入开发工具，异步提交/查询/取回 | 3D generation. Inside your pipeline. |
| API 欧洲企业内容 | 产品内容工具及产品展示用途 | 3D for your product experiences. |

地区划分是用户指定的创意测试分工，不是对美国/欧洲受众偏好或 CTR 的已证实结论。前 3 组沿用同一幻想游戏世界：紫发星仪探索者、蓝绿珐琅机械凤凰、温室天文台；第 4 组把凤凰作为原创装饰品概念。企业用途属于拟议应用，不冒称客户项目。

本轮使用 GPT 生成的二维概念主视觉，不是本次 Tripo 模型输出证据。当前排版代码使用 **AI concept artwork / AI concept assets** 及 **workspace / integration / business-use illustration** 等披露，区分概念图、工作区示意与真实结果。图中不能加入伪造成功任务、计时器、真实 UI 或商品数字孪生证明。若没有虚构界面，不必额外画出界面标签。

## 产品 claim 台账

| ID | 可用承诺 | 状态 | 精确官方来源 | 限定 |
| --- | --- | --- | --- | --- |
| T1 | 共享工作区与集中资产库，可组织/查找/复用资产 | confirmed | [Team Program](https://www.tripo3d.ai/programs/team-program)；[Team Plan 发布说明](https://www.tripo3d.ai/blog/tripo-turns-1-team-plan) | 可见性受团队权限控制；不等于多人实时共同编辑同一模型 |
| T2 | 团队共享积分池 | confirmed | [Team Plan 发布说明](https://www.tripo3d.ai/blog/tripo-turns-1-team-plan) | 本轮不写积分数、无限额度或与 API 积分通用 |
| T3 | 管理员可管成员/访问权限并查看用量 | confirmed | [Team Program](https://www.tripo3d.ai/programs/team-program)；[Team Plan 发布说明](https://www.tripo3d.ai/blog/tripo-turns-1-team-plan) | 不外推审批系统、版本控制、自动项目管理 |
| A1 | 开发者可把 3D 生成能力接入自有产品/工具 | confirmed | [API Introduction](https://developers.tripo3d.ai/en/docs/introduction) | 需要开发实现，不是任意工具一键自动接入 |
| A2 | 生成采用异步任务：提交后取得 task_id，再查询状态 | confirmed | [API Introduction](https://developers.tripo3d.ai/en/docs/introduction) | Submit / Track / Retrieve 是易懂的流程总结，不是同步、速度或成功率承诺 |
| A3 | 任务成功后可从 output 取回模型等结果 | confirmed | [Task Query](https://developers.tripo3d.ai/en/docs/task-query) | 输出仅在 success 时提供；成功不代表适合游戏引擎、无需修改或后续自动集成 |
| I1 | 少追文件、多做游戏；按项目归集资产 | interpretation | 基于 T1–T3 的定性表达 | 不含已测量的工时或成本节省；不承诺自动风格一致 |
| I2 | 面向游戏工具/资产管线的应用 | interpretation | 基于 A1–A3 | 模型还需审查与精修，不写 game-ready |
| I3 | 面向产品可视化/产品体验的应用 | interpretation | 基于 A1–A3 | 展示系统由客户开发，不是 API 内置完整商品查看器；不保证商品尺寸、文字或材质准确，不暗示客户成果 |

**未纳入本轮的承诺：**速度、8K、面数、免费试用数字权益、价格、促销、量化节省、收入保证、点击即转化。历史资料中的数字不得复用。官方网页存在计划/促销数字也不等于本轮必须宣称它们。

## 当前 LinkedIn 格式

依据：[Single image specifications](https://www.linkedin.com/help/linkedin/answer/a427596/)（本次读取显示最近更新 2 个月前）。

- 单图接受 JPG/PNG/GIF，上限 5 MB。本轮 6 张主图为静态 PNG、1200 × 1200，导出要求低于 5,000,000 bytes。
- 本轮采用官方推荐方图尺寸 1200 × 1200；允许方图范围为 360 × 360 至 4320 × 4320。可编辑源为 HTML/CSS，使用 Instrument Sans 与既有官方 Tripo Logo；实际上传文件为 PNG。
- 主文建议不超过 150 字符（当前硬上限 3,000），标题建议不超过 70（硬上限 200）。本地 `ad-creative` 参考中的主文 600 硬上限已不符当前官方页；本轮仍全部小于 150，无冲突。
- Feed 拟用后台 CTA `Learn more`；发布时从实际可选项确认，不把自定义按钮字当后台已支持项。画内文字需在手机预览中另作可读性审稿。

站内信依据：[Message ads specifications](https://www.linkedin.com/help/linkedin/answer/a1344888)、[Sponsored Messaging](https://www.linkedin.com/help/linkedin/answer/a421723/sponsored-messaging?lang=en)（本次读取均显示最近更新 1 周前）。

- subject ≤60、body ≤1,500、CTA ≤20 字符；本稿不用姓名宏、正文内链或 emoji。后台须选获授权的发送者。
- Message Ads 当前支持网站访问、线索、网站转化目标；**不支持 Brand Awareness 目标**。现有品牌认知广告组不能直接装入本稿站内信，需要独立兼容目标的配置及用户确认；本文没有创建或改动广告组。
- EEA/瑞士现在支持 Sponsored Messaging，但仅能触达已主动同意接收此类广告的会员，不能沿用“欧洲全部禁用”的旧结论。英国与 EEA/瑞士不可一概混写，具体国家和账户资格仍需提交前检查。
- 英文 Sponsored Messaging 只触达资料语言为英语的会员；与英文 Sponsored Content 的语言范围不同。EU 英文稿不代表覆盖全部欧洲目标人群。
- 可选桌面 banner ≤300 × 250、≤2 MB，接受 JPG/静态 GIF/PNG。本轮每套另配一张 300 × 250 静态 PNG，共 6 张，导出要求低于 2,000,000 bytes；不是把信息流方图按原尺寸提交。

## 两条 Teams 再营销的启用门槛

官方依据：[Create a video audience with Matched Audiences](https://www.linkedin.com/help/lms/answer/a427086)。视频观看数不等于匹配会员数；具体来源广告组、观看条件和回溯窗口要在后台核实。

`R17-US` 与 `R17-EU` 的文案完整，但状态为 `blocked_pending_exposure_mapping`：必须填入真实来源 ad set、creative/video ID、场景资产版本与 matched audience ID，再确认受众可用。US 只延续 US 源场景，EU 只延续 EU 源场景。如果来源广告组混有不同场景，不可凭广告组整体观看来声称某个场景特定曝光。站点/导出采用上述 ID；源 `copy-draft.json` 中对应的旧 ID 分别为 `T17-R-US`、`T17-R-EU`。

文案不写“你看过我们的某视频”“我注意到你观看了”等个体行为推断。中性文案仍不能替代来源匹配。先不创建受众、不发送站内信、不投放。

当前 US 站内信 CTA 为 `Request a trial`，仅邀请申请团队试用，不承诺立即开通或任何数字权益；[Team Program](https://www.tripo3d.ai/programs/team-program) 当前有申请入口。EU CTA 为 `Share your needs`，邀请说明项目需求，不保证响应时间或采购结果。

## 文件与校验

文案见同目录 `copy-draft.json`。本次已重新按实际字符串计算 Unicode 字符数，包含空格、标点与换行，未依赖可能滞后的汇总字段。6 套完整，最长信息流主文 124、标题 41、站内信 subject 40、body 285、CTA 16 字符。US/EU 再营销站内信正文分别为 236/241 字符，CTA 分别为 15/16 字符；全部在本轮采用的上限内。若后续加宏/链接/必需披露，应重新计数。

两张再营销画内标题已与实际画面同步：US 为 `Bring your team’s workflow into focus.`（38 字符），EU 为 `A team workspace. For your next game.`（37 字符）；Feed 链接标题保持原稿，可与画内标题不同，不包含个体观看推断。

主方向状态为待视觉与最终审稿，不因已暂停的 B/A 阻塞。再营销只由其真实曝光来源缺失而暂停。此文档不是发布批准；正式启用前仍须检查模型/图片权利、真实画面标签、目标/语言/发送者、落地页与当前规则。
