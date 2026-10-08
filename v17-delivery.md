# Tripo LinkedIn V17 — 六套静态广告审稿包

日期：2026-10-08。状态：**广告审稿交付，未投放**。包内含最终 PNG、完整英文文案和可编辑排版；公开审稿页更新情况以实际站点为准，不构成投放批准。

## 交付范围

- 6 张静态主图：`finals/`，PNG，1200 × 1200。
- 6 套信息流文案：主文、链接标题、CTA、中译要点，见 `copy-draft.json`。
- 6 套站内信文案：subject、body、CTA、中译要点，同样在 `copy-draft.json`。
- 6 张站内信桌面配图：`banners/`，静态 PNG，300 × 250；不等同于移动端消息内嵌图片。
- HTML/CSS 可编辑排版：`artwork/`，附布局 JS、本轮二维主视觉、Instrument Sans 字体与既有 Tripo Logo。
- 承诺来源与限制：`CLAIMS.md`；本地检查记录与待办：`QA.md`、`qa/`。

用户已暂停 Before/After。本轮不交付对照图，不提交新增付费建模任务，也不交付新的 Tripo 3D 模型。

## 六套内容

| 导出/站点 ID | 源文案 ID | 用途 | 画内主标题 |
| --- | --- | --- | --- |
| T17-US | T17-01 | Teams 美国游戏：交接与制作组织 | Less file chasing. More game-making. |
| T17-EU | T17-02 | Teams 欧洲游戏：具体项目资产 | Your next game. One shared workspace. |
| A17-US | A17-01 | API 美国游戏/资产：接入开发工具 | 3D generation. Inside your pipeline. |
| A17-EU | A17-02 | API 欧洲企业内容：产品展示用途 | 3D for your product experiences. |
| R17-US | T17-R-US | Teams 美国再营销：工作流需求 | Bring your team’s workflow into focus. |
| R17-EU | T17-R-EU | Teams 欧洲再营销：项目需求 | A team workspace. For your next game. |

每个导出 ID 在 `finals/` 和 `banners/` 各有一张同名 PNG。链接标题与画内标题可以不同。地区划分仅是**本轮测试安排**，不是全球用户偏好、CTR 或转化差异的结论。

## 如何理解这些画面

前 3 个主方向使用同一幻想游戏世界的探索者、机械凤凰和天文台；API 欧洲方向将原创机械凤凰作为装饰品产品概念。这些是 **GPT 二维概念图**，不能称为真实 Tripo 网格、API 生成结果、客户案例或可直接上线的游戏资产。

排版中的 AI concept、workspace/integration/business-use illustration 标签须保留。产品展示和工具接入是用途示意；展示系统与下游集成仍需开发及质量审核。

两条再营销是完整草稿，但启用前必须把实际曝光广告组、creative/video ID、场景资产版本与可用匹配受众对应起来。不得仅凭这份文案假设有人看过某张图或某条视频。

## 编辑与使用

排版入口为 `artwork/index.html`；文字和版式结构在 `artwork/layout.js`，样式在 `layout.css`、`banner.css`、`refinements.css`。主图与桌面 banner 分别排版，不应拉伸成彼此的尺寸。

`export.cjs` 是本地导出脚本，需要相应 Node.js/Playwright/Chrome 环境；重新导出会写入现有 PNG，修改前先保存版本副本。调整任何文字、图片、尺寸或披露后，重新检查字体加载、手机缩略预览、字符数、文件大小与图片解码。HTML/CSS 是可编辑源，平台上传使用 PNG。

本轮应用了：

- `tripo-ad-workbench` **1.0.0**：读取云端最新规则并核对本地一致性，把本轮人群安排和历史资料分开。
- `tripo-ad-art-direction` **1.1.0**：使用大标题、简约品牌配色和有材质层次的主体；四组画面分别讲工作流或项目用途。
- `tripo-model-showcase` **1.1.0**：保留 GPT 概念与真实模型的边界，不用二维重绘证明几何、拓扑或输入输出。
- `tripo-ad-claims` **1.0.0**：核实 Teams 与 API 的边界，删除未验证数字，把概念画面与真实输出区分开。
- `ad-creative` **2.8.2 / Mode 1**：依据用户固定的四组目标写作，并逐项核对长度；没有把文案当作经实测的胜出方案。

发布前仍须检查素材使用权、最终画面、落地页、发送者授权、目标与地区/语言资格。站内信不能直接使用 Brand Awareness 目标；EEA/瑞士需会员 opt-in。详见 `CLAIMS.md`。
