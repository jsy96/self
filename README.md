# 老小孩 · leige 个人站点（www.leige.site）

> 老小孩（leige）的个人站点目录 —— 部署在 **[www.leige.site](https://www.leige.site)**。
> 关联子站：**[大狗Tap · 大狗叫-哈基米-叮咚鸡](https://bigdog-two.vercel.app/)**。

---

## ✨ 项目简介

本目录是 `www.leige.site` 域名对应的纯静态站点源码目录（HTML / CSS / JS，零依赖、零打包）。
双击任一 `.html` 文件即可在浏览器打开，也适合直接部署到任意静态托管（Cloudflare Pages / GitHub Pages / Vercel / Nginx 等）。

页面统一采用深色主题 + 紫青渐变强调色，桌面与移动端自适应。

## 📁 当前目录结构

```
www.leige.site/
├── index.html                 # 站点首页（个人主页 · 板块导航）
├── waytoagi-activities.html   # 活动展示页（数据驱动，fetch activities.json 动态渲染）
├── activities.json            # 活动数据源（结构化，可被脚本自动刷新）
├── sync-activities.js         # 数据同步脚本（lark-cli 拉取飞书知识库 → 刷新 activities.json）
├── update-activities.bat      # 本地一键同步（调 sync-activities.js --discover 发现新活动，自动 commit + push）
├── start.bat                   # 本地预览：双击起 HTTP 服务器（uv run python -m http.server 8080）
├── 0git.bat                   # 一次性：初始化仓库并推送到 Gitee（origin）
├── 1git.bat                   # 日常：一键 git add + commit + push（origin / Gitee，自动镜像 GitHub）
├── .gitignore                 # 忽略规则
└── README.md                  # 本文档
```

> 注：原静态主页（`index.html` / `css/style.css` / `js/main.js`）目前在工作区已被删除，
> 但仍保留在 git 历史 `HEAD` 中，可随时通过 `git checkout HEAD -- index.html css/ js/` 恢复。

## 🎮 页面内容

### index.html（站点首页 · 个人主页）

老小孩 leige 的个人主页，深色 hero + 板块卡片导航，分以下板块：

| 板块 | 链接 |
| --- | --- |
| 🍳 Gitee 主页 | <https://gitee.com/jsy96> |
| 🐙 GitHub 主页 | <https://github.com/jsy96> |
| 🔧 AI 硬件 | 建设中（即将上线） |
| 🐾 宠物乐园 | <https://pet.leige.online> |
| 🐶 大狗叫-哈基米-叮咚鸡 | <https://bigdog-two.vercel.app/> |
| 📦 舱单文件处理 | <https://dd.leige.online/> |
| 💎 爱己美己（工作项目） | 商家端：[web](https://web.leige.online/) · [ajmj](https://ajmj.leige.online/)；超管：<https://admin.leige.online/> |
| 🌟 WaytoAGI 活动聚合 | [waytoagi-activities.html](waytoagi-activities.html)（站内） |

页脚悬挂 ICP 备案号，与 [waytoagi-activities.html](waytoagi-activities.html) 共用同一套视觉语言（深色 + 紫青渐变 + 卡片网格）。

### waytoagi-activities.html

整理自 **WaytoAGI 飞书知识库**（space_id `7226178700923011075`），覆盖 **近期 + 未来一个月**（2026-06-05 ~ 2026-08-06）的活动，按 6 大主题分类：

| 主题 | 内容 |
| --- | --- |
| 🌟 近期与未来重点活动 | WAIC 2026 上海 / Adventure X 杭州黑客松 / OPC 共创节北京 / 第 25 期 AI 切磋小会亲子 AI / IVS2026 京都 / 未来硅世界 Vol18 |
| 🎓 AI 训练营系列 | 第一~七期 + 线下 DemoDay（第七期 AI 硬件为新开） |
| 💡 晚 8 点共学沙龙 | 07-02 秒哒暑假创造计划 / 06-25 Alice AI 原生产品设计 / 共学日历 |
| 🏆 AI 创作大赛 | 光帆杯 AIGC 出海（新启动）/ 千问 × 淘宝悬赏 / 图像视频 / 音乐 / TBox 征集 |
| 🎙️ 品牌栏目 | OPC 专栏 / AI 知声 / 锦上添花 / 鹿演 / AI 教育火种车 / AIGC 短剧 |
| 🤝 战略合作 | 学习强国 / State of Vibe 调研 / 人形机器人培训班 / AGI HORIZON / 香港首秀 / AIFUT |

页面采用**数据驱动架构**：所有活动信息存在 [activities.json](activities.json)，HTML 启动时 `fetch` 该 JSON 动态渲染（带缓存破坏 `?t=timestamp`，每次打开都拉最新数据）。所有活动卡片均带飞书知识库真实链接（`https://waytoagi.feishu.cn/wiki/{node_token}`）。

## 🚀 本地预览

> ⚠️ `waytoagi-activities.html` 通过 `fetch('activities.json')` 加载数据。
> 直接双击打开（`file://` 协议）会被浏览器 CORS 拦截，**必须用本地 HTTP 服务器预览**：
>
> 💡 最简单：双击 [`start.bat`](start.bat) 即可（等价于下方命令，在 8080 端口起 HTTP 服务器）。

```bash
# Python（本机用 uv 管理；http.server 是标准库，无需 --with）
uv run --no-project python -m http.server 8080

# 或 Node
npx serve .
```

然后访问 <http://localhost:8080/waytoagi-activities.html>。

## 🌐 部署

将整个目录上传到静态托管即可。一键发布脚本：

```bash
# 一次性初始化（推送到 Gitee）
0git.bat

# 日常更新（自动 stage + commit + push 到 Gitee；Gitee 自动镜像到 GitHub）
1git.bat
# 或自定义提交信息
1git.bat add waytoagi activities page
```

关键域名约定：

| 域名 | 用途 |
| --- | --- |
| `www.leige.site` | 本站点 |
| `bigdog-two.vercel.app` | 「大狗Tap」节奏点击游戏（大狗叫-哈基米-叮咚鸡） |

远程仓库：

- `origin` → <https://gitee.com/jsy96/self.git>（**唯一远程**）
- Gitee 仓库已开启自动镜像 → GitHub（[jsy96/self](https://github.com/jsy96/self)），push 到 Gitee 后自动同步，**无需单独推 GitHub**

## 🔄 自动更新机制（打开网页即最新）

**目标**：网页部署后，无需手动改代码，打开就能看到飞书知识库里的最新活动。

**架构**：数据与展示分离 —— [activities.json](activities.json) 是数据源，[waytoagi-activities.html](waytoagi-activities.html) 启动时 `fetch` 该 JSON 并动态渲染（带 `?t=timestamp` 缓存破坏）。只要 `activities.json` 被刷新并推送，下一次打开网页就自动呈现新内容。

### 两种刷新方式

#### 1. 手动编辑（最简单）

直接编辑 [activities.json](activities.json)，按现有 schema 增删活动卡片，刷新页面即可。

#### 2. 本地一键脚本（同步 + 自动推送）

```bash
# 同步 activities.json 并自动 git commit + push（user 身份）
update-activities.bat
```

脚本调 `sync-activities.js --discover`，用 `lark-cli` 扫描飞书知识库活动父目录、发现新节点并刷新 `activities.json`，完成后自动 git commit 并 push 到 origin（Gitee）。前置条件：本机 `lark-cli auth login` 已完成（user 身份有效）。

> 已默认开启发现模式（`--discover`），无需再手动跑。注意：发现新节点依赖 user 身份有效；若授权过期（refresh token 失效），扫描会静默返回 0 条，脚本仍会正常提交（仅刷新时间戳）——表现就是"跑了但没更新"。用 `lark-cli auth status` 查看状态，过期用 `lark-cli auth login --domain all` 刷新。

### sync-activities.js 两种模式

```bash
node sync-activities.js               # 默认：刷新 meta.generated_at（秒级，安全）
node sync-activities.js --discover    # 默认 + 扫描 6 个活动父目录，发现新节点
```

发现模式经过三层过滤，避免噪音：

- **token 去重**：已收录的节点不再加入
- **标题去重**：标题已存在的不再加入
- **白/黑名单**：必须命中活动类关键词（活动/训练营/大会/黑客松/共学/直播/比赛/大赛/悬赏/征集/...），并跳过管理类、过期年份、社区动态速览等

### 身份与续期

| 身份 | 适用 | 有效期 |
| --- | --- | --- |
| `--as user`（默认） | 本地脚本同步 | refresh token 约 60 天，过期需重新 `auth login` |

> 私有知识库需把用户加为成员；WaytoAGI 这类公开库可直接读。

## 📋 备案信息

页面 footer 居中悬挂 ICP 备案号，并链接到工信部备案查询系统：

- **鄂ICP备2025092414号-2** → <https://beian.miit.gov.cn/>

## 🔧 数据来源与工具

活动数据来源于 **WaytoAGI 飞书知识库**（[waytoagi.feishu.cn](https://waytoagi.feishu.cn/wiki/PFXnwBTsEiGwGGk2QQFcdTWrnlb)，space_id `7226178700923011075`），通过以下工具拉取：

- **lark-cli**（`@larksuite/cli`）：飞书开放平台 CLI
- **skills**：`lark-wiki`（节点遍历）、`lark-shared`（认证）、`docs +fetch`（文档内容）、`drive +search`（关键词检索）
- **sync-activities.js**：本项目的同步脚本，封装上述能力自动化刷新

初始数据获取流程：user 授权 → 解析 `space_id` → 遍历活动目录节点 → 批量 `wiki spaces get_node` 校验时间戳 → 读取官方「近期活动整理」汇总文档 → 按主题分类整理。后续刷新由 [sync-activities.js](sync-activities.js) 自动完成（见上文「自动更新机制」）。

## 📄 许可

个人站点源码，转载请注明出处。
