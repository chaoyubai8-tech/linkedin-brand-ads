# LinkedIn 单图参考：有界复核（2026-10-07）

## 范围与结论

本轮只核对实际 LinkedIn 信息流单图线索，不把自然帖、视频封面、关注公司广告、招聘广告或 Meta 素材替代为 Single Image Ad。仅更新此研究记录，未改网页、Figma 或素材文件，未下载或转存新增远程图片。

- 既有 `cases-linkedin.json` 六条中，**五条标为 image，一条明确是 videoCover**。Runway 1480153026 应从单图比较数量中排除。
- 六条官方详情均经本轮只读 web 访问返回 403，未能独立取得官方广告类型。已停止重试；不能把第三方档案核对升级为本轮官方验证。
- 新发现 **Spline 四条不同静态素材线索**：公开第三方档案明确 `channel=linkedin`、`format=Single Image Ad`、`video=null`，同时提供 LinkedIn 广告 ID 与外链 JPG。新增 JPG 在子任务的图片读取工具中均不可访问，**尚未目视验证**；不能编写其色彩、文字尺寸或构图观察。
- 下述三条视觉启发仅来自本轮实际查看的既有本地参考图，不来自未打开的 Spline 图片；没有 CTR、CPM、转化或效果证明。

## 访问状态不能混为一谈

主线程此前已在官方 Meshy 搜索界面看到 9 条结果，Country / Date 未选择：3 Video、1 Message、2 Follow Company、3 Job。本次查询结果没有 Single Image；**不等于 Meshy 从未投放单图**。此前 707102024 官方详情还核实为 Follow Company Ad，Advertiser MeshyAI、Paid for by Meshy LLC。完整记录见 `meshy-static-only-recheck-2026-10-07.md`。

随后主线程对新的 Autodesk 1474713154 官方详情、Runway 官方搜索又遇到 Cloudflare 阻断（分别 Ray `a46afb346ce19ab6`、`a46b007cfc0e9ab6`）；没有 CAPTCHA。子任务 CUA inventory 返回 `browsers: []`，不能操作主线程可见标签。没有绕过阻断，也没有因此否定此前已获得的 Meshy 官方 UI 证据。

## 既有六条：逐项复核结果

| 品牌 / ID | 现有证据与素材 | 本轮官方详情状态 | 单图处理 |
| --- | --- | --- | --- |
| Runway 1345490926 | Foresight 档案；1080 × 1080 JPG；本轮目视看到墨镜人像、暖侧光、黑色操作提示条 | [官方详情](https://www.linkedin.com/ad-library/detail/1345490926) 返回 403 | 保留为次级档案单图参考；不标本轮官方验证 |
| Runway 1150183744 | Foresight 档案；1080 × 1080 JPG；本轮目视看到瓶身静物、浅绿背景、黑色打光操作提示条 | [官方详情](https://www.linkedin.com/ad-library/detail/1150183744) 返回 403 | 保留为次级档案单图参考 |
| Autodesk 1474713154 | Foresight 档案；1200 × 1200 JPG；本轮目视看到黑底左栏黄字、右栏建筑结构 | [官方详情](https://www.linkedin.com/ad-library/detail/1474713154) 返回 403；主线程另遇 Cloudflare 阻断 | 保留为次级档案单图参考 |
| Autodesk 1476401124 | 既有记录为 image，1172 × 660；本轮未重新目视 | [官方详情](https://www.linkedin.com/ad-library/detail/1476401124) 返回 403 | 维持原次级来源标签，不增加视觉结论 |
| Runway 1480153026 | 既有 `type=videoCover`，媒体 URL 路径为 `videocover-high` | [官方详情](https://www.linkedin.com/ad-library/detail/1480153026) 返回 403 | **排除：视频封面不是信息流单图广告** |
| Autodesk 1524984686 | 既有记录为 image，但仅 250 × 250；本轮未重新目视 | [官方详情](https://www.linkedin.com/ad-library/detail/1524984686) 返回 403 | 仅低清结构参考，不标高清 |

次级来源：[Runway Foresight 档案](https://www.foresightiq.co/ad-library/runway)、[Autodesk Foresight 档案](https://www.foresightiq.co/ad-library/autodesk)。现有图片与映射保留在 `cases-linkedin.json`，本轮没有更改。

## 新增 Spline 静态候选：只完成档案身份映射

公开入口：[Spline Sprites 广告档案](https://www.sprites.ai/spline-ads-library)。旧路径 `https://www.sprites.ai/ads-library/spline` 本轮重定向到该入口。读取的是公开页面可见记录及同页序列化字段，不是登录后数据、付费隐藏记录或受限端点。档案身份是次级证据，以下官方详情均未在本轮 UI 成功打开。

| ID / 官方详情 | 档案类型 | 文案主题（概括，非画面观察） | 外链原档案图 |
| --- | --- | --- | --- |
| [919650284](https://www.linkedin.com/ad-library/detail/919650284) | Single Image Ad；LinkedIn；video=null | 团队赶交付、快速制作并嵌入网站或应用；headline 为免费开始 | [JPG 919650284](https://spritesai.b-cdn.net/ads/linkedin-ads/images/1789684127170-6a042c7d-9b96-4a6b-919f-a8d2e9a0e252.jpg) |
| [919570584](https://www.linkedin.com/ad-library/detail/919570584) | Single Image Ad；LinkedIn；video=null | 同一快速交付主题，素材 URL 与上一条不同 | [JPG 919570584](https://spritesai.b-cdn.net/ads/linkedin-ads/images/1789684127124-780c36c6-ddab-476e-88c6-240f3bcb297f.jpg) |
| [919500674](https://www.linkedin.com/ad-library/detail/919500674) | Single Image Ad；LinkedIn；video=null | 浏览器中的 2D/3D 创作与实时协作；headline 为免费开始 | [JPG 919500674](https://spritesai.b-cdn.net/ads/linkedin-ads/images/1789684127145-4aa78f8b-697e-4fc9-b3e3-5563f05f8656.jpg) |
| [919520464](https://www.linkedin.com/ad-library/detail/919520464) | Single Image Ad；LinkedIn；video=null | 同一创作与实时协作主题，素材 URL 与上一条不同 | [JPG 919520464](https://spritesai.b-cdn.net/ads/linkedin-ads/images/1789684127165-9f9d64ac-564c-4b03-bb78-f0cbdb6676d1.jpg) |

去重：919470734 与 919570584 共用同一素材 URL；919560604 与 919650284 共用同一素材 URL，因此不拿重复素材凑四张。四个外链 JPG 本轮 `web.open` 均报不可访问 / Internal Error；未下载以规避显示限制。它们现在是**可交接的外链候选，不是已目视验收素材**。

另看公开 [Framer 档案](https://www.sprites.ai/ads-library/framer)，本轮已展示记录中没有提取到 Single Image Ad；没有继续进入付费/隐藏记录，也没有拿视频充数。

## 三条可立即用于 Tripo 的具体构图启发

以下是从已目视的 Runway / Autodesk 图片提炼的设计建议，不是平台规则或效果保证。按 `tripo-ad-art-direction`：一个业务收益 + 一个视觉证据，Tripo 字体/色值沿用自有规范，不照抄竞品色值。

1. **一条大字说一个具体动作，直接压到对应的视觉证据上。** Runway 的瓶身和人像图都只用一条宽黑色提示条解释操作；主体仍占大部分面积。Tripo API 可用一句短标题和真实输入→输出对应模型，保留任务/输出证据，避免把 Submit、Track、Retrieve、格式、模型名都塞成小字。
2. **把行业对象和业务承诺分工，别让两者抢读者注意。** Autodesk 1474713154 左侧黑底黄字讲收益、右侧建筑结构说明行业。Tripo Teams 可让大字讲“共享工作区”，画面用同一套真实游戏资产被归入团队库作证；不能只堆三个随机模型再标 Teams。
3. **质感来自单一主角、受控打光与留白，不来自更多装饰。** Runway 人像用清楚的侧光与阴影分离主体，静物用材质反光和干净背景。Tripo 应先把一个正式版真实模型的轮廓/体块打磨好，再放少量同系列配件；按 1440→360 缩小检查，让标题、模型轮廓与产品区别仍可读。不能把静态提示箭头称为已验证动效。

## 下一步边界

已有五张静态图可继续本地审美对比，但需保留“第三方档案关联、官方详情本轮受阻”的标签。新增 Spline 四张需在可正常访问的公开页面目视确认，才可作具体视觉分析。没有宣称它们效果更好，没有继续研究视频，没有再次泛搜 Meshy，也没有修改用户网站。
