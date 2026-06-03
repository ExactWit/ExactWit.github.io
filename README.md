# 从零搭建 Quartz 数字花园

一份简明扼要的 Quartz 站点搭建指南，实现 Obsidian 笔记自动化发布与多库管理。

---

## Problem

在频繁更新维护的情况下，本地的 Obsidian 笔记库不方便与他人同步：
- 频繁传输文件会给他人带来整理负担
- 批注与笔记分离，难以统一管理
- 本地格式（如 Callout、公式）在不同平台渲染不一致

## Motivation

建立一个**自动化笔记网页流程**：
- 仅需本地修改笔记，同步到内容库后自动更新网页
- 发布功能和不同内容库的维护解耦（CG、Math、AI 等独立管理）
- 支持学术格式（Callout、LaTeX 公式、代码块）的优雅渲染
- 提供评论互动功能

## Solution

基于 **Quartz v5** 项目，利用 GitHub Actions 部署到 `*.github.io`：
- **io 库**作为发布库，管理 Quartz 配置和部署流程
- **内容库**（如 CG）通过符号链接（Windows Junction）关联到 io 库
- 在内容库设置 Trigger，push 后自动触发 io 库部署 Action
- 利用 Giscus 部署评论系统，关联到具体笔记

---

## Quick Start

### Step 1: Fork Quartz 模板

```bash
# 创建你的 io 仓库（如 ExactWit.github.io）
git clone https://github.com/jackyzha0/quartz.git
cd quartz
git remote set-url origin https://github.com/YourName/YourName.github.io.git
git push -u origin v4
```

**关键配置**：切换到 v4 分支（稳定版）或 v5（最新版）

### Step 2: 创建内容库

```bash
# 创建独立的内容仓库（如 CG、Math、AI）
mkdir CG
cd CG
git init
git remote add origin https://github.com/YourName/CG.git
```

将你的 Obsidian 笔记放入此仓库，保持原有目录结构。

### Step 3: 本地关联（符号链接）

```powershell
# Windows: 使用 Junction 链接内容库到 io 库
cd YourName.github.io
mkdir content
New-Item -ItemType Junction -Path "content\CG" -Target "C:\Path\To\Your\Obsidian\CG"
```

```bash
# macOS/Linux: 使用软链接
cd YourName.github.io
mkdir content
ln -s /path/to/your/obsidian/CG content/CG
```

**验证**：在 io 库修改 `content/CG` 中的文件，原 Obsidian 库同步更新。

### Step 4: 配置 GitHub Actions

创建 `.github/workflows/deploy.yaml`：

```yaml
name: Deploy Quartz to GitHub Pages

on:
  push:
    branches: [v5]
  workflow_dispatch:
  repository_dispatch:
    types: [deploy-blog]  # 内容库触发用

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Quartz
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # 关键：checkout 内容库到 content/ 目录
      - name: Checkout CG content
        uses: actions/checkout@v4
        with:
          repository: YourName/CG
          path: content/CG
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build Quartz
        run: npx quartz build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

### Step 5: 配置内容库 Trigger

在内容库（如 CG）创建 `.github/workflows/trigger.yaml`：

```yaml
name: Trigger Main Site Deploy

on:
  push:
    branches: [main]

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger deployment
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.PAT_TOKEN }}
          repository: YourName/YourName.github.io
          event-type: deploy-blog
```

**配置 PAT**：
1. GitHub Settings → Developer settings → Personal access tokens
2. 生成 Token，勾选 `repo` 权限
3. 在内容库 Settings → Secrets → Actions 添加 `PAT_TOKEN`

### Step 6: 配置 Giscus 评论

1. 确保 GitHub 仓库已启用 **Discussions**（Settings → Features）
2. 访问 [giscus.app](https://giscus.app)，填写仓库信息
3. 获取 `data-repo-id` 和 `data-category-id`
4. 配置 `quartz.config.yaml`：

```yaml
plugins:
  - source: github:quartz-community/comments
    enabled: true
    options:
      provider: giscus
      options:
        repo: YourName/YourName.github.io
        repoId: R_kgDORg53vQ  # 你的 repo ID
        category: Blog Comments
        categoryId: DIC_kwDORg53vc4C-ajq  # 你的 category ID
        mapping: pathname
        reactionsEnabled: "1"
        inputPosition: bottom
        theme: preferred_color_scheme
        lang: zh-CN
```

### Step 7: 自定义样式（可选但推荐）

创建 `quartz/styles/custom.scss`，添加学术 Callout 样式：

```scss
// 定义 Callout - 蓝色
.callout[data-callout="definition"] {
  --color: rgb(59, 130, 246);
  --border: rgba(59, 130, 246, 0.4);
  --bg: rgba(59, 130, 246, 0.12);
  --callout-icon: url('data:image/svg+xml; utf8, <svg>...</svg>');
}

// 定理 Callout - 紫色
.callout[data-callout="theorem"] {
  --color: rgb(139, 92, 246);
  --border: rgba(139, 92, 246, 0.4);
  --bg: rgba(139, 92, 246, 0.12);
  --callout-icon: url('...');
}

// 更多类型：proof, lemma, corollary, example, remark...
```

**确保背景色生效**：
```scss
.callout[data-callout="definition"],
.callout[data-callout="theorem"] {
  background-color: var(--bg) !important;
  border-color: var(--border) !important;
}
```

### Step 8: 日期自动显示

启用 `created-modified-date` 和 `content-meta` 插件：

```yaml
plugins:
  - source: github:quartz-community/created-modified-date
    enabled: true
    options:
      priority:
        - frontmatter
        - git
        - filesystem

  - source: github:quartz-community/content-meta
    enabled: true
    options:
      showDate: true
      showReadingTime: true
```

在笔记 frontmatter 中添加日期：
```markdown
---
title: 贝塞尔曲线
date: 2025-01-15
---
```

或留空让 Git 自动提取：
```markdown
---
title: 贝塞尔曲线
date:
lastmod:
---
```

---

## Usage Workflow

### 日常写作流程

1. **本地写作**：在 Obsidian 中编辑笔记
2. **格式检查**：确保 Callout、公式格式符合规范（见下方）
3. **提交触发**：
   ```bash
   cd C:\Path\To\CG
   git add .
   git commit -m "add: Bezier Curve notes"
   git push origin main
   ```
4. **自动部署**：GitHub Actions 自动构建并部署（约 2 分钟）
5. **在线访问**：`https://yourname.github.io/cg/bezier-curve`

### 添加新内容库

仅需 3 步：

1. 新建仓库（如 `YourName/AI`）
2. io 库 workflow 添加 checkout 步骤：
   ```yaml
   - name: Checkout AI content
     uses: actions/checkout@v4
     with:
       repository: YourName/AI
       path: content/AI
   ```
3. 本地创建 junction：
   ```powershell
   New-Item -ItemType Junction -Path "content\AI" -Target "C:\Obsidian\AI"
   ```

---

## Format Guidelines

### Callout 格式（Quartz 兼容）

```markdown
> [!definition] 贝塞尔曲线定义
> 给定 $n+1$ 个控制点...
>
> $$
> C(t) = \sum_{i=0}^n B_{i,n}(t) \cdot b_i
> $$
```

**关键**：每行都必须以 `>` 开头，包括空行和公式块！

### 公式块

```markdown
<!-- 正确：独占一行 -->
$$
E = mc^2
$$

<!-- 错误：与文字同行 -->
能量公式 $$E = mc^2$$ 很重要
```

### 表格后空行

```markdown
| 列1 | 列2 |
|-----|-----|
| A   | B   |

<!-- 必须有空行 -->
表格后的文字
```

---

## Troubleshooting

### 问题：内容库 push 后网页未更新

**检查**：
1. io 库 Actions 是否触发？（repository_dispatch 事件）
2. Actions 中内容库 checkout 是否成功？
3. 本地 junction 是否正常？`dir /al content\`

### 问题：Callout 背景色不显示

**解决**：确保 CSS 使用 `!important` 并设置 `background-color`：

```scss
.callout[data-callout="definition"] {
  background-color: var(--bg) !important;
}
```

### 问题：Giscus 评论加载失败

**检查**：
1. 仓库已启用 Discussions
2. Giscus App 已安装并有权限
3. repoId 和 categoryId 配置正确
4. 网页路径与 mapping 设置匹配

### 问题：日期不显示

**检查**：
1. 笔记有 frontmatter（即使 date 为空）
2. `created-modified-date` 插件已启用
3. 文件已提交到 Git（日期从 Git 历史提取）

---

## Contribution

搭建完成后：
- **他人受益**：直接访问 `yourname.github.io` 观看笔记、评论
- **自己受益**：督促及时整理笔记，积累数字资产
- **社区贡献**：分享你的配置和主题，帮助更多人建立知识库

---

## References

- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [Giscus Configuration](https://giscus.app/)
- [GitHub Pages Deployment](https://docs.github.com/en/pages)

---

*Last updated: June 2025*