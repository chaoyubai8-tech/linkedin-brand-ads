# V18 — 八张静态广告文案与官方核验

核验日期：**2026-10-09，Asia/Shanghai**。目录沿用项目批次名 `2026-10-08/tripo-ads-v18`，不是将核验日期写回昨天。状态：本地探索稿，未投放；本子任务只交付 `copy.json` 与本文件，没有修改网站或画面。

## 范围与使用方式

四个已确认广告组各 2 版，共 8 条英文 Feed 文案。只增加静态图文；Before/After 继续暂停，不新增站内信或再营销，不发起建模任务。

`copy.json` 中 `title` 是与主线程候选对应的画内标题建议，`headline` 是信息流链接标题；两者可以不同。本子任务未直接改画面，最终排版由主线程确认。固定 CTA 为 `Learn more`，启用前仍须在 Campaign Manager 检查可选项、落地页及完整预览。

| 广告组 | 两版风格 | 固定卖点 |
| --- | --- | --- |
| Teams 美国游戏 | gallery / bold | 工作流组织、共享资产与减少追文件 |
| Teams 欧洲游戏 | cinematic / technical | 同一游戏项目的角色、道具、环境归集 |
| API 美国游戏与资产 | technical / bold | 自有工具接入、异步任务、成功后取回与审核 |
| API 欧洲企业内容 | gallery / cinematic | 产品展示与产品内容工具的业务用途 |

这些是本轮测试安排，**不是美国/欧洲审美偏好的证据**。两版之间不只变化单一变量，适合方向探索，不能直接据此归因“某一种风格提高 CTR”。没有胜出广告、节省工时或收入效果的测量结论。

## 本次技能及其影响

- `tripo-ad-claims` **1.0.0** 与 `references/claim-register.md`：将功能事实、用途推断、视觉证据分开；重新读当前官方页，不把历史权益当长期常量。
- `ad-creative` **2.8.2 / Mode 1** 与平台规格参考：依据用户固定 brief 和已有产品资料写变体，实际计算字符数，不虚构评价/数据/“已验证赢家”。
- 已读 `.agents/product-marketing.md`；其中 2026-09-17 的旧封面任务和试用口号不覆盖用户当前 V18 范围。本轮不采用旧试用天数/积分、价格或促销数字。

## 官方来源与 claim 台账

所有条目于 2026-10-09 重新打开官方页面核验。网页功能成立不代表这批概念图是真实输出。

| ID | 本轮可用表达 / 产品范围 | 状态 | 来源 | 限定与本轮处理 |
| --- | --- | --- | --- | --- |
| T1 | Shared asset library；Teams 资产组织、查找和复用 | confirmed | [Team Program](https://www.tripo3d.ai/programs/team-program) | 共享受访问权限控制；T18-US-01 可讲载具/道具库，但不能把概念资产集合说成真实库截图 |
| T2 | One workspace；shared credits；member controls | confirmed | [Team Plan 发布说明](https://www.tripo3d.ai/blog/tripo-turns-1-team-plan) | 不写积分数，不表示 Studio/API 积分互通；不保证多人实时共同编辑 |
| T3 | Organize a game project's 3D assets | confirmed | [Team Plan 发布说明](https://www.tripo3d.ai/blog/tripo-turns-1-team-plan) | 角色/道具/环境是项目应用分类，不承诺全文件类型支持、风格自动一致或一键成完整游戏 |
| A1 | Add 3D generation to your tools；API 接入自有产品 | confirmed | [API Introduction](https://developers.tripo3d.ai/en/docs/introduction) | 需要开发实现；本轮没有真实 UI、实际接入结果或客户案例 |
| A2 | Submit a task, query status, retrieve after success | confirmed | [API Introduction](https://developers.tripo3d.ai/en/docs/introduction)、[Task Query](https://developers.tripo3d.ai/en/docs/task-query) | 当前文档为 v3 异步任务；output 在 success 时提供。成功不等于可进引擎、无需精修或无失败 |
| A3 | Image-to-3D generation in product-content tools | confirmed（生成/接入能力） | [API Introduction](https://developers.tripo3d.ai/en/docs/introduction) | 椅子/产品体验是拟议业务用途，不是内置完整商城/查看器、精确实物复刻或客户落地证明 |
| I1 | Less file chasing. More game-making. | interpretation | 基于 [Teams 工作区能力](https://www.tripo3d.ai/programs/team-program) | 定性效益表达，无量化工时/成本结果 |
| I2 | Build a world / One project / Put products in perspective | interpretation | 用户确定的项目与业务方向，功能边界参照 T1–A3 | 是创意标题，不外推自动生成整套世界、每一类资产都可处理或产品尺寸/材质完全准确 |
| V1 | 这 8 张图是实际 Tripo 模型、真实 UI 或客户案例 | unverified；不使用 | 本轮没有此类证据 | 明确采用 GPT 二维概念素材；禁止以本批图片证明上述结果 |

**冲突处理：**官方页面含活动和套餐数字，但本轮不核发数字权益、不沿用旧口号。共享工作区、积分池、成员管理与 API 异步流程本轮未发现实质冲突；不能把画面更精美推导为实际模型质量或更高转化率。具体数字/性能如未来要用，需另开证据核验。

## 必须保留的视觉限定

- 全部新主视觉是 **GPT 2D concept artwork**；应有清晰的 `AI concept artwork` 或等义标注，不能标作 Tripo output、rendered mesh 或客户实物。
- 资产库/项目图册用 `Workspace concept`、`Project illustration` 等限定；不是 Tripo 官方 UI 截图。不要制作虚构布线图或网格质量证明。
- API 技术流程用 `Workflow illustration` 或 `Integration concept`；取回阶段保留 `after success`，之后是审核与精修。不要显示伪造 task ID、已成功运行的状态、真实耗时或自动进引擎。
- 港湾是游戏世界的二维概念；家居椅是原创产品概念。它们不是可玩场景、真实客户商品、已实现的交互 3D 查看器或数字孪生。
- 本轮没有 B/A，不做真假输入输出对照。不同风格稿也不是产品质量优劣对照。

## LinkedIn 当前 Single Image 规格

官方：[Single image ads advertising specifications](https://www.linkedin.com/help/linkedin/answer/a427596/)，本次读取显示最近更新 2 个月前。

- 接受 JPG、PNG、GIF，单文件上限 5 MB。本轮建议静态 PNG，并以低于 5,000,000 bytes 作保守导出门槛。
- 官方推荐方图 **1200 × 1200（1:1）**；允许方图范围 360 × 360 至 4320 × 4320。这里只给当前规范，不代表已对主线程最终 PNG 做尺寸/解码验收。
- Primary/intro 建议 ≤150 字符，当前硬上限 3,000；headline 建议 ≤70，硬上限 200。技能参考中旧的 intro 600 上限不作为当前官方规则；本轮全部小于 150，不受差异影响。
- CTA 从后台可选项选择，Feed 文案与画内文字分开验收；最终仍要检查手机缩略和实际裁切。

## 字符数与本地校验

按实际字符串计算 Unicode 字符，包含空格与标点；不用姓名宏、emoji 或主文内 URL。以下 `title` 不计为平台链接标题：

| ID | title | primary（≤150） | headline（≤70） | CTA |
| --- | ---: | ---: | ---: | ---: |
| T18-US-01 | 36 | 121 | 41 | 10 |
| T18-US-02 | 32 | 106 | 41 | 10 |
| T18-EU-01 | 31 | 103 | 43 | 10 |
| T18-EU-02 | 25 | 117 | 40 | 10 |
| A18-US-01 | 29 | 125 | 37 | 10 |
| A18-US-02 | 28 | 119 | 40 | 10 |
| A18-EU-01 | 28 | 128 | 39 | 10 |
| A18-EU-02 | 17 | 127 | 43 | 10 |

8 条主文最长 **128**，链接标题最长 **43**，CTA 均 10 字符。四组各 2 条，gallery/bold/cinematic/technical 各 2 条；ID 唯一，Teams/API 落地页分开。已从最终文件核对 JSON 语法、字段和字符限制，后续改字后重新计数。T18-US-01 gallery 对应 Less file chasing，T18-US-02 bold 对应 Create together，已与主线程版式顺序同步。

本轮不提供节省时间/金钱数字、game-ready、速度、8K、收入保证、点击即转化或安全/IP 绝对保证。最终画面、素材使用权、可读性、落地页、文件尺寸及投放设置仍待主线程审查；此交付不是投放批准或网站发布凭证。
