# 站内信文案修订 · 2026-10-11 · copy2

范围：四个已确认主方向的主题、开场和共同正文；两条再营销预留；完整中文释义与审稿页面。没有新增广告组、改预算、发送广告或生成模型。

修订前原稿保留在[上一次公开提交](https://github.com/chaoyubai8-tech/linkedin-brand-ads/blob/bf2a0d53d1b1d6cd51c1419f068f49f2ff5c3ee8/messages-next-data.json)。新版英文与中文都以 `messages-next-data.json` 为正本，由同一生成器导出，避免页面与下载稿分叉。

## 逐组修改理由

| 人群 | 旧稿问题 | 本次修改 | 保留的边界 |
| --- | --- | --- | --- |
| Teams美国游戏 | 积分、权限、共享库并列，读者利益不突出 | 从每次找人要文件切入，说明共享模型可查找和复用 | 没有量化节省工时，也不是多人实时编辑 |
| Teams欧洲游戏 | “新的游戏世界”比较泛，项目用途不够具体 | 聚焦一个关卡／原型的角色、道具与环境清单 | 未声称真实客户已完成游戏或模型无需处理即可上线 |
| API美国游戏＋3D资产 | 介绍API，但手工重复操作和下一步不够清楚 | 提交任务→跟踪状态→成功取回；CTA承接请求／响应示例 | 异步任务，成功不等于生产验收通过 |
| API欧洲企业内容 | 内容体验抽象，容易误会有内置查看器 | 产品页面／内容平台需要3D资产；调用方接入自己的查看器 | 不承诺精确商品还原、自动集成或收入提升 |
| Teams美国再营销 | 只问是否考虑Teams，试用任务泛 | 带自己的游戏资产需求，由实际成员评估共享工作流程 | 不声称知道个人观看记录，真实场景匹配待补 |
| Teams欧洲再营销 | 需求提交较笼统 | 明确角色、环境、道具清单与团队流程，以此讨论适配 | 案例及原视频证据未齐，仍是预留 |

结论：每条只讲一个工作用途和一个下一步。美国组强调工作流程；欧洲组强调具体项目／产品展示用途。不同方向不是同一人群内的效果排名。

## 数量与翻译

- 保留10条草稿；首轮优先4条A主稿，4条B可选备稿，2条再营销预留。不要求全部同时投放。
- 同组A/B只改变开场段落；主题、共同正文、CTA和目的地相同。启用比较时还需固定其他投放配置。
- 完整中文含主题、开场、正文、按钮及补充说明；翻译不新增英文没有的免费、时效、额度或效果保证。
- 中文仅供内部审稿。英文复制只复制英文投放字段；双语TXT／CSV／JSON清楚分列，不能不加处理直接上传平台。

## 承诺核验台账

核验日期：2026-10-11。创意任务表达与产品事实分开；下表是本次用到的承诺，不代替正式素材验收。

| claim_id | 广告原句／承诺 | 产品范围 | 状态 | 来源 | 条件与冲突处理 |
| --- | --- | --- | --- | --- | --- |
| MSG-T-LIB | “create 3D assets in a shared workspace … a searchable team library” | Teams | confirmed | [Team Program](https://www.tripo3d.ai/programs/team-program) | 团队库可组织、搜索、复用；不添加工时数字 |
| MSG-T-ACCESS | “Authorized teammates can find and reuse shared models” | Teams | conditional | [Team Plan](https://www.tripo3d.ai/blog/tripo-turns-1-team-plan) | 依可见性与授权设置；不写全员无条件看到所有资产 |
| MSG-T-TRIAL | “Request a team trial” | Teams | conditional | [Team Program](https://www.tripo3d.ai/programs/team-program) | 名额、条款及已注册邮箱条件适用；申请不保证获得试用，未写额度 |
| MSG-A-TASK | “submit … track … retrieve … when the task succeeds” | API | confirmed | [Quick Start](https://developers.tripo3d.ai/en/docs/quick-start) | 异步流程，失败任务没有成功模型；使用前仍需项目验收 |
| MSG-A-IMAGE | “generate a 3D model from a reference image” | API | confirmed | [API Introduction](https://developers.tripo3d.ai/en/docs/introduction) | 不保证测量精度、逐细节还原或无需清理 |
| MSG-A-VIEWER | “the product viewer your team builds” | API | interpretation | [API Introduction](https://developers.tripo3d.ai/en/docs/introduction) | 生成能力为事实；查看器用途是调用方方案，本站没有实测集成证据 |

结论：允许清楚解释产品能力；未核验的效率数字、客户案例和商业结果不进入文案。历史GPT配图不作为这些事实的独立证明。

## 校对与界面检查

按 copy-editing 七轮校对检查：清晰度、口吻、读者利益、依据、具体性、情绪相关性和行动风险。具体性来自资产任务，不靠编造指标；情绪来自找文件／重复操作的工作情境，不制造恐慌或虚假紧迫。

ad-creative用于分人群改稿；tripo-ad-claims用于事实与试用条件核验；impeccable用于默认双语可见、清楚的优先级与导出标签。私有技能库认证读取返回403，本轮未同步云端规则。浏览器与生成器检查范围见[QA记录](messages-next-QA.md)。
