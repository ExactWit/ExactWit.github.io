# ExactWit 数字花园

基于 [Quartz v5](https://quartz.jzhao.xyz/) 构建的个人知识库网站，支持多内容库架构。

---

## 📚 内容架构

### 当前内容库

| 库 | 路径 | 描述 |
|---|---|---|
| **CG** | `content/CG/` | 计算机图形学 |

### 多库架构

本网站采用**可扩展多库架构**，支持无限添加新的内容主题库。

**添加新内容库步骤：**

1. **创建新仓库**（如 `ExactWit/AI`）
2. **本地创建 junction**
   ```powershell
   # PowerShell
   New-Item -ItemType Junction -Path "content\AI" -Target "C:\Users\<用户名>\Archive\Obsidian\AI"
   ```
3. **配置 GitHub Actions 触发**（可选）
   - 参考 `.github/workflows/deploy-content-trigger.yaml`
   - 在新库添加 workflow，push 时自动触发主站部署

---

## 🎨 样式系统

### 自定义 Callout

本网站扩展了 19 种学术专用 Callout 类型，按颜色分类：

#### 核心数学概念（紫色系）
| Callout | 颜色 | 用途 |
|---------|------|------|
| `[!definition]` | 蓝色 | 数学定义 |
| `[!theorem]` | 紫色 | 定理陈述 |
| `[!lemma]` | 青色 | 引理/辅助结果 |
| `[!corollary]` | 薰衣草 | 推论 |
| `[!proposition]` | 靛蓝 | 命题 |
| `[!proof]` | 灰色 | 证明过程 |
| `[!axiom]` | 深红 | 公理/基本假设 |

#### 说明与解释（橙/黄色系）
| Callout | 颜色 | 用途 |
|---------|------|------|
| `[!remark]` | 橙色 | 注记/提示 |
| `[!example]` | 金黄 | 具体示例 |
| `[!intuition]` | 粉色 | 直观解释 |

#### 结构组件（蓝/绿色系）
| Callout | 颜色 | 用途 |
|---------|------|------|
| `[!preliminary]` | 深蓝 | 预备知识 |
| `[!property]` | 绿色 | 数学性质 |
| `[!notation]` | 棕色 | 符号约定 |
| `[!algorithm]` | 深青 | 算法描述 |
| `[!application]` | 草绿 | 实际应用 |

#### 论述结构（红色系）
| Callout | 颜色 | 用途 |
|---------|------|------|
| `[!motivation]` | 玫红 | 研究动机/背景 |
| `[!problem]` | 深红 | 问题陈述 |
| `[!solution]` | 翠绿 | 解决方案 |
| `[!summary]` | 深紫 | 要点总结 |
| `[!conclusion]` | 蓝紫 | 最终结论 |

**使用示例：**

```markdown
> [!theorem] 贝塞尔曲线定义
> 给定 $n+1$ 个控制点...

> [!proof]
> 由伯恩斯坦基函数的性质可得...

> [!motivation]
> 研究这个问题的意义在于...
```

### 样式文件位置

| 文件 | 用途 |
|------|------|
| `quartz/styles/custom.scss` | 自定义样式主文件（Callout、排版优化） |
| `quartz/styles/base.scss` | 基础样式（一般不需要修改） |
| `quartz/styles/callouts.scss` | 默认 Callout 样式 |
| `quartz/styles/variables.scss` | 变量定义 |

---

## 🚀 部署系统

### 自动部署触发方式

| 触发方式 | 说明 |
|---------|------|
| **Push 到 v5 分支** | 主仓库代码更新 |
| **内容库 Push** | 通过 `repository_dispatch` 事件触发 |
| **手动触发** | GitHub Actions 页面手动运行 |

### 内容库自动触发配置

在内容库（如 `ExactWit/CG`）添加 `.github/workflows/trigger-deploy.yaml`：

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
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PAT_TOKEN }}
          repository: ExactWit/ExactWit.github.io
          event-type: deploy-blog
```

**需要配置：**
- 在内容库 Settings → Secrets 添加 `PAT_TOKEN`（个人访问令牌）

---

## 🛠️ 本地开发

### 环境要求

- Node.js >= 22
- npm >= 10.9.2

### 安装依赖

```bash
cd C:\Users\28719\WorkSpace\Projects\ExactWit.github.io
npm ci
```

### 启动本地服务器

```bash
npx quartz build --serve --port 8080
```

访问 `http://localhost:8080` 预览。

### 内容编辑工作流

```
1. 在 Obsidian 编辑笔记
      ↓
2. 运行格式检查脚本（可选）
   node fix-obsidian-format.cjs content/CG
      ↓
3. 本地预览验证
   npx quartz build --serve
      ↓
4. 提交到内容库
   git add . && git commit && git push
      ↓
5. 自动触发网站部署
```

---

## 📝 内容格式规范

### Callout 语法（Quartz 兼容）

```markdown
> [!type] 标题
> 内容行1
> 内容行2
```

**注意：** 每行都必须以 `>` 开头，包括空行！

### 块级公式

```markdown
> [!definition]
> 公式说明文字
>
> $$
> E = mc^2
> $$
>
> 后续说明
```

**注意：**
- `$$` 必须独占一行
- Callout 内的公式每行都要以 `>` 开头

### 表格后加空行

```markdown
| 表头1 | 表头2 |
|-------|-------|
| 内容1 | 内容2 |

表格后的文字（必须有空行分隔）
```

---

## 📁 项目结构

```
ExactWit.github.io/
├── .github/
│   └── workflows/
│       └── deploy-v5.yaml      # 主部署工作流
├── content/
│   ├── index.md                # 首页
│   └── CG/                     # CG 内容库（junction）
│       └── 曲面曲线/
│           ├── Bezier Curve.md
│           └── B-Spline.md
├── quartz/
│   ├── styles/
│   │   ├── custom.scss         # 自定义样式
│   │   ├── base.scss           # 基础样式
│   │   └── callouts.scss       # Callout 默认样式
│   └── plugins/                # Quartz 插件
├── quartz.config.yaml          # Quartz 配置
└── README.md                   # 本文件
```

---

## 🔧 常见问题

### Q: 本地内容不显示？
**A:** 检查 junction 是否正常：
```powershell
Get-Item content\CG
# 应该显示 Junction 类型
```

### Q: Callout 背景色不显示？
**A:** 确保使用的是已定义的 callout 类型，并检查 `custom.scss` 中是否有对应样式。

### Q: 公式渲染失败？
**A:** 
1. 确保 `$$` 独占一行
2. Callout 内公式每行以 `>` 开头
3. 检查 `quartz.config.yaml` 中 latex 插件是否启用

### Q: 如何添加新的 callout 类型？
**A:** 编辑 `quartz/styles/custom.scss`，参考现有 callout 格式添加：

```scss
.callout[data-callout="newtype"] {
  --color: rgb(R, G, B) !important;
  --border: rgba(R, G, B, 0.4) !important;
  --bg: rgba(R, G, B, 0.12) !important;
  --callout-icon: url('data:image/svg+xml;...');
}
```

然后添加到全局选择器列表中。

---

## 📄 许可证

基于 [Quartz](https://github.com/jackyzha0/quartz)（MIT License）构建。

---

## 🙏 致谢

- [Quartz](https://quartz.jzhao.xyz/) - 优秀的静态站点生成器
- [Obsidian](https://obsidian.md/) - 强大的本地知识库工具
