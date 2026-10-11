# 领英站内信广告 · 2026-10-11

在线审稿：[messages-next.html](https://chaoyubai8-tech.github.io/linkedin-brand-ads/messages-next.html)

本轮检查范围与未通过条件：[验收记录](messages-next-QA.md)。

## 数量与结构

四个主投人群，每组2套Message Ad，共8套。Teams美国、欧洲再营销各预留1套，共2套。6个人群方向各共用1张300×250配图，共6张。

- Teams美国游戏：Workflow／共享资产与交接。
- Teams欧洲游戏：具体游戏项目资产用途。
- API美国游戏＋3D资产：异步任务接入自己的工具。
- API欧洲企业内容：产品展示等实际业务用途。
- Teams再营销：原视频、真实案例与人群匹配完成后启用，当前不默认上线。

本轮主方向A/B只换开场。主题、正文、CTA、配图和目的地保持一致。正式广告仅上传英文投放字段，不上传中文释义、审稿标签或来源说明。

## 如何修改

修改 `messages-next-data.json`，然后执行：

```sh
node build-messages-next.mjs
```

生成器会核对10套文案、8主投＋2预留、6配图、字符长度、PNG尺寸和文件大小，并生成HTML、CSV、JSON。网站无需构建框架或服务端；本地使用任意静态HTTP服务器，GitHub Pages发布 `gh-pages` 分支根目录。

页面预览、复制与下载都只在浏览器运行。不存在发送接口、表单、账号授权、分析代码或客户数据。全部10套完整文案静态嵌入HTML，不启用JavaScript仍可查看。

## 上线限制

英文仅覆盖英文资料用户；EEA与瑞士仅覆盖已同意接收Sponsored Messaging的成员。实际账户资格、覆盖、发送者、兼容目标、试用承接和事件回传均须在发送前确认。

官方技术Help Center：主题60／正文1500／CTA20；营销规格页出现较宽松字段。本稿采用较严格上限，不把检查通过等同账户审核通过。所有按钮链接官方Teams或API页面；不含内部预算、账户ID、联系人或私有文档内容。

6张配图沿用V17／2026-10-09历史GPT概念稿。这次没有新生成模型，也没有新执行素材中台工作流。概念图不是实际Tripo模型、真实客户项目或生产可用性的证明。正式视觉须走素材中台并依据原始广告素材视觉规范逐项验收。

## 开源范围

新增站内信网站代码（`messages-next.html`、`messages-next.css`、`messages-next.js`、`build-messages-next.mjs`）采用本目录 `messages-next.LICENSE.txt` 的MIT条款。品牌、logo、广告文案与图片、字体及第三方参考不自动纳入MIT许可。字体沿用其OFL文件；其他素材需由权利人授权。该代码许可不追溯覆盖仓库既有文件。

旧 `messages.html` 和V17记录保留，不覆盖历史广告。

技能：ad-creative 2.8.2、tripo-ad-workbench 1.0.0、tripo-ad-claims 1.0.0、tripo-ad-art-direction 1.1.0、impeccable 3.5.0。本次私有技能库403，采用本地规则回退，未改云端规则。
