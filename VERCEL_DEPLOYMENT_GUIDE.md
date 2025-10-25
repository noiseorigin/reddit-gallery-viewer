# Vercel 部署完整指南

## 问题历程与最终解决方案

### 遇到的问题
部署到 Vercel 后显示 `404: NOT_FOUND`，尽管：
- ✅ 本地 `npm start` 能正常运行
- ✅ 构建日志显示成功编译
- ✅ 页面被标记为预渲染

### 根本原因
1. **Suspense 和 useSearchParams 冲突** - 服务器组件尝试预渲染包含客户端 hook 的 Suspense
2. **输出模式不匹配** - Next.js 默认输出方式与 Vercel 的部署预期不一致
3. **配置不明确** - Vercel 不能正确识别项目的构建输出

### 最终修复
三层递进式修复：

#### 第一步：修复 Suspense 和 useSearchParams 的冲突
✅ **文件**：`src/app/page-wrapper.tsx` (新建)
```typescript
'use client';  // 客户端组件

import { Suspense } from 'react';
import { GalleryPage } from '@/components/GalleryPage';

export function PageWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GalleryPage />
    </Suspense>
  );
}
```

✅ **文件**：`src/app/page.tsx` (简化)
```typescript
export default function Home() {
  return <PageWrapper />;  // 简单导入和渲染
}
```

#### 第二步：启用 Standalone 输出模式
✅ **文件**：`next.config.js`
```javascript
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['www.reddit.com', 'reddit.com', 'i.redd.it', 'i.imgur.com', 'preview.redd.it'],
  },
  output: 'standalone',  // ← 关键改动
};
```

**为什么**：
- `standalone` 模式创建自包含的 `.next/standalone` 目录
- 包含所有必要的文件和依赖
- 优化了对 Vercel 的部署

#### 第三步：显式配置 Vercel 部署参数
✅ **文件**：`vercel.json`
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "headers": [
    // SEO 文件的 Content-Type 配置
  ]
}
```

**为什么**：
- 明确告诉 Vercel 如何构建项目
- 防止 Vercel 的自动检测出错
- 确保输出目录正确识别

## 完整的 Vercel 配置清单

### 1. 项目配置文件

**next.config.js** - 必须包含：
```javascript
{
  output: 'standalone',  // ✅ 启用 standalone 模式
  images: {
    unoptimized: true,
    domains: [/* ... */]
  }
}
```

**vercel.json** - 必须包含：
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

**package.json** - build 脚本：
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

### 2. Vercel Dashboard Settings

**Settings → General**：
- ✅ Framework: `Next.js` （应自动识别）
- ✅ Build Command: `npm run build` （或留空）
- ✅ Install Command: `npm install` （或留空）
- ✅ Output Directory: `.next` （或留空）
- ✅ Node Version: 18.x 或 20.x LTS

**Settings → Environment Variables**（如需要）：
```
NODE_ENV=production
```

### 3. Git 推送和部署

```bash
# 本地验证
npm run build
npm run type-check
npm start  # 验证能访问

# 推送到 GitHub
git push origin main

# Vercel 自动部署
# - 检测代码变更
# - 自动触发构建
# - 部署到生产环境
```

## 部署检查清单

在推送之前确保：

- [ ] ✅ `npm run build` 成功（0 个错误，可以有警告）
- [ ] ✅ `npm run type-check` 通过（0 个类型错误）
- [ ] ✅ `npm start` 能访问首页
- [ ] ✅ 本地功能正常（subreddit 切换、URL 参数等）
- [ ] ✅ `.next` 目录存在
- [ ] ✅ `.next/standalone` 目录存在
- [ ] ✅ 所有代码已提交
- [ ] ✅ `vercel.json` 和 `next.config.js` 配置正确

## 部署后验证

部署完成后（通常 2-3 分钟），检查：

1. **页面可访问**：
   ```bash
   curl https://your-domain.vercel.app/
   # 应返回 HTML（不是 404）
   ```

2. **SEO 文件**：
   ```bash
   curl https://your-domain.vercel.app/sitemap.xml
   # 应返回 XML（Content-Type: application/xml）

   curl https://your-domain.vercel.app/robots.txt
   # 应返回 TXT（Content-Type: text/plain）
   ```

3. **功能测试**：
   - 访问主页（不应该 404）
   - 点击 subreddit 按钮
   - 使用 URL 参数：`?sub=photography&sort=top&time=day`
   - 打开浏览器控制台，检查没有 JavaScript 错误

4. **Vercel 仪表板**：
   - 检查 Deployments 列表
   - 查看最新部署的状态（应为绿色 ✅）
   - 检查 Build Logs（应该看到 `✓ Generating static pages (4/4)`）

## 常见问题排查

### 仍然显示 404

**解决步骤**：
1. 检查 Vercel Dashboard → Deployments → Latest → Build Logs
2. 查找错误信息（搜索 "error" 或 "Error"）
3. 检查 `prerender-manifest.json` 中是否包含 `"/"` 路由
4. 在 Vercel 仪表板中手动重新部署

### 构建失败

1. 查看完整的 Build Logs
2. 检查是否有类型错误：`npm run type-check`
3. 确认本地 `npm run build` 能成功
4. 检查是否有环境变量缺失

### 页面加载缓慢

1. 检查 Vercel 的 Web Analytics
2. 查看 Bundle 大小
3. 优化图片加载（已在 next.config.js 中配置）
4. 考虑缓存策略

## 性能优化建议

### 已实施的优化
✅ 图片优化（`unoptimized: true` 用于外部 Reddit 图片）
✅ 代码分割（Next.js 自动）
✅ 静态预渲染
✅ Suspense 边界用于加载状态

### 可考虑的进一步优化
- 使用 `next/image` 替代 `<img>`
- 实现 PWA 支持
- 添加 Service Worker
- 性能监控（Web Vitals）

## 文件结构总览

```
project/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 主页（导入 PageWrapper）
│   │   ├── page-wrapper.tsx    # Suspense + GalleryPage 的包装
│   │   └── globals.css
│   ├── components/
│   │   ├── GalleryPage.tsx     # 客户端组件
│   │   ├── GalleryGrid.tsx
│   │   └── ...
│   └── lib/
│       ├── reddit.ts
│       ├── cache.ts
│       ├── colors.ts
│       └── storage.ts
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── rgv_logo.png
├── next.config.js              # ✅ output: 'standalone'
├── vercel.json                 # ✅ 显式配置
├── package.json
└── tsconfig.json
```

## 关键改动总结

| 文件 | 改动 | 原因 |
|------|------|------|
| `next.config.js` | 添加 `output: 'standalone'` | Vercel 优化部署 |
| `vercel.json` | 添加显式配置 | 防止自动检测错误 |
| `src/app/page.tsx` | 简化，导入 PageWrapper | 分离关注点 |
| `src/app/page-wrapper.tsx` | 新建 | 将 Suspense 移到客户端 |

## 最终确认

现在项目应该能成功部署到 Vercel 并访问！

**预期的 Vercel 构建日志**：
```
✓ Compiled successfully
✓ Generating static pages (4/4)
Build Completed in /vercel/output [28s]
Deploying outputs...
Deployment completed
```

**预期的最终结果**：
```
✅ https://your-domain.vercel.app/ 能正常访问
✅ 没有 404 错误
✅ 所有功能正常工作
✅ 动态元数据更新
```

---

**最后更新**：2025-10-25
**部署准备状态**：✅ 已完全准备就绪
