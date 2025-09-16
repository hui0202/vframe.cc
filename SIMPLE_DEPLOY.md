# Vercel 多项目部署指南（简化版）

将同一份代码部署到多个 Vercel 项目，无需区分环境。

## 🚀 快速开始

### 前置条件

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 登录 Vercel：
```bash
vercel login
```

## 📦 部署方式

### 方式 1：批量部署（部署到所有项目）

```bash
# 添加执行权限
chmod +x scripts/deploy-multiple.sh

# 执行批量部署
./scripts/deploy-multiple.sh
```

这将自动部署到 `scripts/deploy-multiple.sh` 中配置的所有项目。

### 方式 2：单个部署（部署到指定项目）

```bash
# 添加执行权限
chmod +x scripts/deploy-single.sh

# 部署到指定项目
./scripts/deploy-single.sh vframe-cc
./scripts/deploy-single.sh vframe-cc-7qaj
```

### 方式 3：手动部署

```bash
# 部署到指定项目
vercel --prod --name vframe-cc --yes
vercel --prod --name vframe-cc-7qaj --yes
```

## ⚙️ 配置项目列表

编辑 `scripts/deploy-multiple.sh` 文件，修改 `PROJECTS` 数组：

```bash
# 项目列表 - 在这里添加您要部署的所有项目名称
PROJECTS=(
  "vframe-cc"
  "vframe-cc-7qaj"
  "your-project-name"  # 添加更多项目
)
```

## 🔧 Vercel Dashboard 设置

### 1. 创建多个项目

在 [Vercel Dashboard](https://vercel.com/dashboard)：

1. 点击 "Add New Project"
2. 导入您的 Git 仓库
3. 设置项目名称（如：`vframe-cc`）
4. 点击 "Deploy"
5. 重复以上步骤创建其他项目（如：`vframe-cc-7qaj`）

### 2. 配置环境变量

每个项目可以有独立的环境变量：

1. 进入项目 Dashboard
2. 点击 Settings → Environment Variables
3. 添加需要的环境变量

常用环境变量示例：
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://example.com
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

### 3. 配置域名

为每个项目配置不同的域名：

1. 进入项目 Settings → Domains
2. 添加自定义域名
3. 配置 DNS 记录

示例：
- 项目 1：`example.com`
- 项目 2：`app.example.com`

## 📊 查看部署状态

```bash
# 查看所有部署
vercel list

# 查看特定项目的部署
vercel list --name vframe-cc

# 查看项目日志
vercel logs --name vframe-cc

# 查看项目域名
vercel domains ls --name vframe-cc
```

## 🔄 回滚部署

如需回滚到之前的版本：

1. 登录 Vercel Dashboard
2. 选择项目
3. 点击 "Deployments" 标签
4. 找到要回滚的版本
5. 点击 "..." → "Promote to Production"

## ❓ 常见问题

### Q: 部署失败怎么办？

检查以下事项：
1. 确认已登录：`vercel login`
2. 确认项目名称正确
3. 确认有项目访问权限
4. 查看错误日志：`vercel logs --name project-name`

### Q: 如何删除一个项目？

```bash
vercel remove project-name
```

或在 Vercel Dashboard 中：
Settings → Advanced → Delete Project

### Q: 如何查看当前部署的版本？

```bash
vercel inspect project-name
```

### Q: 如何设置自动部署？

在 Vercel Dashboard 中：
1. Settings → Git
2. 连接 GitHub/GitLab 仓库
3. 选择要自动部署的分支

## 📚 更多资源

- [Vercel 文档](https://vercel.com/docs)
- [Vercel CLI 参考](https://vercel.com/docs/cli)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
