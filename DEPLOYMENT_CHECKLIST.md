# Vercel 部署检查清单

## 404 错误的根本原因与修复

### 问题诊断
您在 Vercel 部署时遇到的 `404: NOT_FOUND` 错误是由以下问题导致的：

1. **useSearchParams() 没有被正确包装** ❌
   - `useSearchParams()` 是 client-side hook
   - 需要被 `Suspense` boundary 包装
   - 否则会导致静态页面生成失败

2. **next.config.js 中的 headers 配置** ❌
   - headers async 函数可能与 Vercel 的自动配置冲突
   - 导致路由错误

### 实施的修复 ✅

**1. 在 page.tsx 中添加 Suspense 包装：**
```typescript
export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GalleryPageWrapper />
    </Suspense>
  );
}
```

**2. 简化 next.config.js：**
```javascript
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['www.reddit.com', 'reddit.com', 'i.redd.it', 'i.imgur.com', 'preview.redd.it'],
  },
};
```

**3. 保留 vercel.json 中的静态文件配置：**
```json
{
  "headers": [
    {
      "source": "/sitemap.xml",
      "headers": [{"key": "Content-Type", "value": "application/xml"}]
    },
    {
      "source": "/robots.txt",
      "headers": [{"key": "Content-Type", "value": "text/plain"}]
    }
  ]
}
```

## 部署前检查清单

### 代码质量检查
- [ ] ✅ `npm run type-check` - 无 TypeScript 错误
- [ ] ✅ `npm run lint` - 通过 ESLint 检查
- [ ] ✅ `npm run build` - 生产构建成功完成

### 功能验证
- [ ] 在本地运行 `npm start` 验证功能
- [ ] 测试主页面加载
- [ ] 测试不同 subreddit 的加载
- [ ] 测试 URL 参数（如 `?sub=photography&sort=top&time=day`）
- [ ] 验证动态 meta 标签更新

### Git 状态检查
- [ ] 所有修改已提交
- [ ] 分支名称为 `main`
- [ ] 本地分支领先于远程分支

### Vercel 部署配置
- [ ] Vercel 项目连接到正确的 Git 仓库
- [ ] 环境变量配置正确（如果有）
- [ ] 构建命令：`npm run build`
- [ ] 安装命令：`npm install`
- [ ] Output Directory：自动或 `.next`

## 部署步骤

### 1. 推送代码到 GitHub

```bash
git push origin main
```

### 2. Vercel 自动部署流程

Vercel 将自动：
1. 检测到 Next.js 项目
2. 运行 `npm install`
3. 运行 `npm run build`
4. 验证没有错误
5. 部署到生产环境

### 3. 验证部署成功

部署完成后，检查：

**首页访问：**
```bash
curl https://your-domain.vercel.app/
```

**SEO 文件：**
```bash
curl https://your-domain.vercel.app/sitemap.xml
curl https://your-domain.vercel.app/robots.txt
```

**带参数的路由：**
```bash
curl "https://your-domain.vercel.app/?sub=photography&sort=top&time=day"
```

## 常见问题排查

### 问题 1：仍然显示 404
**解决方案：**
1. 检查 Vercel 构建日志（Dashboard → Deployments → Build logs）
2. 查找"useSearchParams()"或"Suspense"相关的错误
3. 确认所有代码更改都已推送
4. 在 Vercel Dashboard 中手动重新部署

### 问题 2：页面加载缓慢
**解决方案：**
1. 减少初始加载大小（移除未使用的依赖）
2. 启用 Vercel 的 Web Analytics
3. 检查 Bundle 大小
4. 优化图片加载

### 问题 3：动态元数据不更新
**解决方案：**
1. 检查浏览器开发者工具中的错误
2. 确认 JavaScript 已启用
3. 清除浏览器缓存
4. 在无痕模式中测试

## 性能优化建议

### 已实施的优化：
✅ 图片优化（unoptimized: true 用于 Reddit 图片）
✅ 代码分割（Next.js 自动）
✅ 动态导入（Suspense 边界）
✅ 缓存策略（设置在 vercel.json）

### 可考虑的进一步优化：
- 使用 Next.js Image 组件替代 <img>
- 实现 PWA 支持
- 添加 Service Worker 缓存
- 使用 CDN 加速内容分发

## 重要文件参考

- **src/app/page.tsx** - 主页面，包含 Suspense 包装
- **src/components/GalleryPage.tsx** - Gallery 主组件（client component）
- **next.config.js** - Next.js 配置
- **vercel.json** - Vercel 特定配置
- **src/app/layout.tsx** - 根布局和元数据

## 测试清单（部署前）

```bash
# 1. 清除缓存和构建文件
rm -rf .next node_modules
npm install

# 2. 运行完整的构建
npm run build

# 3. 验证类型
npm run type-check

# 4. 本地启动生产服务器
npm start

# 5. 在浏览器中测试
# - 访问 http://localhost:3000
# - 测试所有功能
# - 检查控制台没有错误
```

## 部署成功标志

✅ Vercel 部署完成，无构建错误
✅ 首页正常加载，不显示 404
✅ 可以点击 subreddit 按钮切换内容
✅ URL 参数能正确加载内容
✅ 动态 meta 标签在页面切换时更新
✅ sitemap.xml 和 robots.txt 返回 200 状态码
✅ 图片正常加载，没有 CORS 错误

## 部署后监控

### Vercel Dashboard
- 检查构建时间和文件大小
- 监控错误率
- 查看实时日志

### 搜索引擎
- 提交 sitemap 到 Google Search Console
- 监控索引状态
- 检查搜索流量

### 分析
- 使用 Google Analytics 监控用户行为
- 追踪页面加载时间
- 分析用户交互

## 联系与支持

- **Vercel 文档**: https://vercel.com/docs
- **Next.js 文档**: https://nextjs.org/docs
- **GitHub Issues**: 如有问题可提交 issue

---

**最后更新**: 2025-10-25
**部署状态**: 准备就绪 ✅
