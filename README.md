# 老小孩 · leige 个人主页

> 老小孩（leige）的个人主页 —— 一个放想法、放游戏、放作品的小角落。
> 主打入口：**[老小孩找规律](https://game.leige.online)**。

线上地址：<https://www.leige.site>

---

## ✨ 项目简介

这是一个纯静态（HTML + CSS + JS，零依赖、零打包）的个人主页，双击 `index.html` 即可在浏览器中打开，也适合直接部署到任意静态托管（Cloudflare Pages / GitHub Pages / Vercel / Nginx 等）。

页面主打深色主题 + 紫青渐变强调色，桌面与移动端自适应，并对 `prefers-reduced-motion`（减少动画）做了无障碍适配。

## 🎮 核心内容

- **「老小孩找规律」** 游戏入口：页面多处设置指向 <https://game.leige.online> 的链接（Hero 按钮、主推游戏卡片、作品区、联系区、页脚），点击即跳转到游戏站。
- **关于我 / 作品 / 联系**：常规个人主页模块。

## 📁 目录结构

```
www.leige.site/
├── index.html        # 页面结构（含页脚备案号）
├── css/
│   └── style.css     # 全部样式（设计变量、响应式、动画）
├── js/
│   └── main.js       # 交互（导航、滚动动画、回到顶部、小彩蛋）
└── README.md         # 本文档
```

## 🚀 本地预览

因为是纯静态站点，直接双击 [index.html](index.html) 即可在浏览器打开。

如需带本地服务器预览（避免某些浏览器对本地文件的限制），任选其一：

```bash
# Python（本机用 uv）
uv run --no-project --with http.server python -m http.server 8080

# 或 Node
npx serve .
```

然后访问 <http://localhost:8080>。

## 🌐 部署

将整个目录上传到静态托管即可。关键域名约定：

| 域名 | 用途 |
| --- | --- |
| `www.leige.site` | 本个人主页 |
| `game.leige.online` | 「老小孩找规律」游戏站 |

## 📋 备案信息

页脚悬挂有 ICP 备案号，并链接到工信部备案管理系统：

- **鄂ICP备2025092414号-2**
- 查询入口：<https://beian.miit.gov.cn/>

## 🛠️ 自定义指南

- **配色**：编辑 [css/style.css](css/style.css) 顶部的 `:root` 变量（`--primary` / `--primary-2` / `--grad` 等）。
- **个人文案**：修改 [index.html](index.html) 中对应区块的文字。
- **新增作品卡**：在 `#works` 的 `.works-grid` 中复制一张 `.work-card`。
- **页脚年份**：由 [js/main.js](js/main.js) 自动取当前年份，无需手动改。

## 📄 许可

个人作品，保留所有权利。如需引用，请保留出处链接。
