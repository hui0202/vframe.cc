# Vercel 同一代码多项目部署指南

本指南将帮助您将**同一份代码**部署到多个不同的 Vercel 项目，适用于多环境部署（开发、测试、生产）或多域名部署场景。

## 使用场景

- 🌍 **多环境部署**：开发环境、测试环境、生产环境
- 🏢 **多品牌部署**：同一代码服务不同品牌/域名
- 🧪 **A/B 测试**：部署不同版本进行测试
- 🌐 **多区域部署**：部署到不同地理区域

## 快速开始

### 方法 1: 使用自动部署脚本（推荐）

```bash
# 1. 添加执行权限
chmod +x scripts/deploy-multiple.sh

# 2. 运行部署脚本（将部署到所有配置的项目）
./scripts/deploy-multiple.sh
```

脚本会自动部署到以下项目：
- `vframe-production` (生产环境)
- `vframe-staging` (预发布环境)  
- `vframe-development` (开发环境)

### 方法 2: 手动部署到指定项目

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod --name vframe-production

# 部署到测试环境
vercel --name vframe-staging

# 部署到开发环境
vercel --name vframe-development
```

### 方法 3: 通过 Vercel Dashboard

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入您的 Git 仓库（同一个仓库可以导入多次）

为每个环境创建独立的项目：

#### 生产环境项目
- **Project Name**: `vframe-production`
- **Environment Variables**: 
  ```
  NEXT_PUBLIC_ENV=production
  NEXT_PUBLIC_API_URL=https://api.vframe.cc
  ```
- **Domain**: `vframe.cc`, `www.vframe.cc`

#### 测试环境项目
- **Project Name**: `vframe-staging`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_ENV=staging
  NEXT_PUBLIC_API_URL=https://staging-api.vframe.cc
  ```
- **Domain**: `staging.vframe.cc`

#### 开发环境项目
- **Project Name**: `vframe-development`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_ENV=development
  NEXT_PUBLIC_API_URL=https://dev-api.vframe.cc
  ```
- **Domain**: `dev.vframe.cc`

## 环境变量配置

### 1. 本地环境变量文件

创建 `.env.local` 文件（参考 `.env.example`）：

```bash
cp .env.example .env.local
# 编辑 .env.local 设置您的环境变量
```

### 2. Vercel Dashboard 配置

在每个 Vercel 项目中单独配置环境变量：

1. 进入项目 Dashboard
2. 点击 `Settings` → `Environment Variables`
3. 添加对应环境的变量：

| 变量名 | 生产环境 | 测试环境 | 开发环境 |
|--------|----------|----------|----------|
| NEXT_PUBLIC_ENV | production | staging | development |
| NEXT_PUBLIC_API_URL | https://api.vframe.cc | https://staging-api.vframe.cc | https://dev-api.vframe.cc |
| AWS_ACCESS_KEY_ID | prod-key | staging-key | dev-key |
| S3_BUCKET_NAME | vframe-prod | vframe-staging | vframe-dev |

### 3. 使用 Vercel CLI 设置环境变量

```bash
# 为生产环境设置变量
vercel env add NEXT_PUBLIC_ENV production --prod --name vframe-production

# 为测试环境设置变量
vercel env add NEXT_PUBLIC_ENV staging --preview --name vframe-staging
```

## 域名配置

### 配置自定义域名

每个项目可以配置不同的域名：

```bash
# 生产环境域名
vercel domains add vframe.cc --project vframe-production

# 测试环境域名
vercel domains add staging.vframe.cc --project vframe-staging

# 开发环境域名
vercel domains add dev.vframe.cc --project vframe-development
```

### DNS 配置

在您的 DNS 提供商处添加以下记录：

```
# 生产环境
A     @       76.76.21.21
CNAME www     cname.vercel-dns.com

# 测试环境
CNAME staging cname.vercel-dns.com

# 开发环境
CNAME dev     cname.vercel-dns.com
```

## 自定义部署脚本

编辑 `scripts/deploy-multiple.sh` 来自定义您的项目：

```bash
# 修改项目配置数组
PROJECTS=(
  "your-project-prod:production"
  "your-project-test:preview"
  "your-project-dev:development"
)
```

## Git 分支策略

推荐的分支与环境对应关系：

| Git 分支 | Vercel 项目 | 环境 | 自动部署 |
|----------|-------------|------|----------|
| main | vframe-production | 生产 | ✅ |
| staging | vframe-staging | 测试 | ✅ |
| develop | vframe-development | 开发 | ✅ |

### 配置自动部署

在 Vercel Dashboard 中为每个项目配置 Git 集成：

1. 进入项目 Settings → Git
2. 设置 Production Branch：
   - 生产项目：`main`
   - 测试项目：`staging`
   - 开发项目：`develop`

## 高级配置

### 条件编译

在代码中根据环境使用不同配置：

```typescript
// src/lib/config.ts
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  environment: process.env.NEXT_PUBLIC_ENV,
  
  // 根据环境启用不同功能
  features: {
    analytics: process.env.NEXT_PUBLIC_ENV === 'production',
    debug: process.env.NEXT_PUBLIC_ENV === 'development',
  }
};

export default config;
```

### 环境特定的构建

在 `next.config.ts` 中添加环境特定配置：

```typescript
const isProd = process.env.NEXT_PUBLIC_ENV === 'production';

const nextConfig = {
  // 生产环境优化
  compress: isProd,
  
  // 开发环境启用 source maps
  productionBrowserSourceMaps: !isProd,
};
```

## 监控和日志

### 查看部署状态

```bash
# 查看所有项目的部署
vercel list

# 查看特定项目的部署历史
vercel list --name vframe-production
```

### 查看日志

```bash
# 查看生产环境日志
vercel logs --name vframe-production

# 查看最近的错误
vercel logs --name vframe-staging --error
```

## 故障排除

### 常见问题

**Q: 如何确保不同项目使用相同的代码版本？**
A: 使用 Git tags 标记版本，部署时指定相同的 tag：
```bash
git tag v1.0.0
git push --tags
vercel --prod --name vframe-production --git-branch v1.0.0
```

**Q: 如何回滚部署？**
A: 在 Vercel Dashboard 中选择之前的部署，点击 "Promote to Production"

**Q: 环境变量没有生效？**
A: 确保在 Vercel Dashboard 中正确设置了环境变量，并重新部署

**Q: 如何在本地测试不同环境？**
A: 使用不同的 `.env` 文件：
```bash
# 测试生产环境配置
cp .env.production .env.local
pnpm dev

# 测试开发环境配置
cp .env.development .env.local
pnpm dev
```

## 最佳实践

1. **环境隔离**：确保每个环境使用独立的数据库、API 和资源
2. **版本管理**：使用 Git tags 标记重要版本
3. **监控告警**：为生产环境配置监控和告警
4. **备份策略**：定期备份生产环境数据
5. **安全配置**：敏感信息只在 Vercel Dashboard 配置，不要提交到代码库

## 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel CLI 参考](https://vercel.com/docs/cli)
