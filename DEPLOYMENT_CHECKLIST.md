# 部署前检查清单 (Deployment Checklist)

## 🔧 配置项 (Before Deployment)

### 第一步：获取必要的 ID 和密钥

#### Google AdSense
- [ ] 注册 Google AdSense 账户: https://www.google.com/adsense/
- [ ] 获取发布商 ID: `ca-pub-XXXXXXXXXXXXXXXX`
- [ ] 创建广告单元，获取广告位 ID: `XXXXXXXXXX`

#### Google Analytics 4
- [ ] 访问 https://analytics.google.com/
- [ ] 创建新项目
- [ ] 获取 Measurement ID: `G-XXXXXXXXXX`

#### 域名信息
- [ ] 确定你的最终域名 (例如: `reddit-gallery.com` 或 `your-project.vercel.app`)
- [ ] 记录完整 URL

---

## 📝 代码更新 (Code Updates)

### 需要替换的占位符

在 `index.html` 中搜索并替换：

1. **Google AdSense Publisher ID**
   - 搜索: `ca-pub-XXXXXXXXXXXXXXXX`
   - 替换为: 你的实际 Publisher ID
   - 出现位置: 2 处

2. **Google AdSense 广告位 ID**
   - 搜索: `data-ad-slot="XXXXXXXXXX"`
   - 替换为: 你的实际广告位 ID
   - 出现位置: 1 处

3. **Google Analytics ID**
   - 搜索: `G-XXXXXXXXXX`
   - 替换为: 你的实际 Measurement ID
   - 出现位置: 2 处

4. **你的域名**
   - 搜索: `your-domain.vercel.app`
   - 替换为: 你的实际域名
   - 出现位置: 3 处

### 快速替换脚本

在项目目录运行以下命令（替换相应的值）：

```bash
# 替换 AdSense Publisher ID
sed -i '' 's/ca-pub-XXXXXXXXXXXXXXXX/ca-pub-YOUR_ACTUAL_ID/g' index.html

# 替换 AdSense 广告位 ID
sed -i '' 's/data-ad-slot="XXXXXXXXXX"/data-ad-slot="YOUR_SLOT_ID"/g' index.html

# 替换 Analytics ID
sed -i '' 's/G-XXXXXXXXXX/G-YOUR_ID/g' index.html

# 替换域名
sed -i '' 's/your-domain.vercel.app/your-actual-domain.com/g' index.html
```

---

## ✅ 验证清单

### 本地测试

- [ ] 在浏览器中打开 `index.html`
- [ ] 验证页面加载无错误
- [ ] 测试 Reddit subreddit 加载功能
- [ ] 测试图片库显示
- [ ] 测试模态框预览
- [ ] 验证主题颜色变化
- [ ] 在移动设备上测试响应式设计

### SEO 验证

- [ ] 检查页面 title 包含关键词
- [ ] 检查 meta description 是否正确
- [ ] 验证 Open Graph 标签
- [ ] 验证 Canonical URL 指向正确域名
- [ ] 检查 JSON-LD Schema 数据
- [ ] 用 Google Rich Results Test 验证: https://search.google.com/test/rich-results

### 性能验证

- [ ] 用 Google PageSpeed Insights 测试: https://pagespeed.web.dev/
- [ ] 验证 LCP < 2.5s
- [ ] 验证 FID < 100ms
- [ ] 验证 CLS < 0.1

---

## 🚀 部署步骤

### 方式 1: Vercel CLI（推荐）

```bash
# 1. 全局安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目目录部署
cd /path/to/your/project
vercel --prod

# 4. 验证部署
# Vercel 会给你一个 URL，访问验证功能
```

### 方式 2: GitHub + Vercel 自动部署

```bash
# 1. 初始化 Git（如果还未）
git init
git add .
git commit -m "Add: Reddit Gallery Viewer with SEO and monetization setup"

# 2. 推送到 GitHub
git remote add origin https://github.com/your-username/reddit-gallery-viewer.git
git branch -M main
git push -u origin main

# 3. 在 Vercel Dashboard 导入
# 访问 https://vercel.com/new
# 连接 GitHub，选择仓库
# 点击 Deploy
```

---

## 📊 部署后配置

### Google Search Console 配置

1. [ ] 访问 https://search.google.com/search-console/
2. [ ] 选择"URL 前缀"方式
3. [ ] 输入你的网站 URL
4. [ ] 验证所有权（按照指示）
5. [ ] 提交网址检查
6. [ ] 请求索引

### Google Analytics 配置

1. [ ] 访问你的网站
2. [ ] 打开浏览器开发者工具 (F12)
3. [ ] 查看 console，验证 Analytics 事件被记录
4. [ ] 等待 24 小时数据开始显示在 Analytics Dashboard

### Google AdSense 配置

1. [ ] 访问你的网站
2. [ ] 验证广告显示（不要点击！）
3. [ ] 在 AdSense Dashboard 中等待核实
4. [ ] 24-48 小时后应该显示收入数据

---

## 📈 部署后监控

### 第一周

- [ ] 检查部署是否正确 (使用 Lighthouse)
- [ ] 验证所有功能正常工作
- [ ] 检查 Analytics 是否正确记录数据
- [ ] 监控 AdSense 审核状态
- [ ] 检查 Search Console 是否识别网站

### 前两周

- [ ] 在社交媒体分享你的工具
- [ ] 寻求初始反向链接
- [ ] 收集用户反馈
- [ ] 修复发现的任何问题

### 第一个月

- [ ] 监控 Google Search Console 数据
- [ ] 分析 Google Analytics 用户行为
- [ ] 检查 AdSense 收入数据
- [ ] 根据反馈优化功能

---

## 🔗 重要链接清单

```
部署：
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel CLI 文档: https://vercel.com/docs/cli

SEO：
- Google Search Console: https://search.google.com/search-console/
- Google Analytics: https://analytics.google.com/
- Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev/

盈利：
- Google AdSense: https://www.google.com/adsense/
- AdSense 帮助: https://support.google.com/adsense/

域名：
- Vercel 域名注册: https://vercel.com/domains
- Namecheap: https://www.namecheap.com/
- GoDaddy: https://www.godaddy.com/
```

---

## 📞 常见问题排查

### Q: 广告不显示？
**A:**
- 检查 AdSense Publisher ID 是否正确
- 确保已等待 24 小时让 AdSense 识别网站
- 检查浏览器是否启用了广告拦截器
- 查看浏览器 console 是否有错误

### Q: Analytics 没有数据？
**A:**
- 检查 Measurement ID 是否正确
- 等待 24 小时让数据显示
- 刷新页面几次测试追踪

### Q: 页面速度慢？
**A:**
- 检查 PageSpeed Insights 报告
- 确认 Vercel 部署正确
- 检查 Reddit API 是否响应缓慢

### Q: Vercel 部署失败？
**A:**
- 检查 vercel.json 是否有语法错误
- 确保 index.html 存在
- 查看 Vercel Dashboard 的部署日志

---

## ✨ 成功标志

当你看到以下情况时，说明配置成功：

- ✅ 网站在 Vercel 上正常加载
- ✅ Google Analytics 开始记录数据
- ✅ Google AdSense 广告开始显示
- ✅ Google Search Console 识别网站
- ✅ 第一批用户访问（通常来自社交媒体分享）
- ✅ 第一笔 AdSense 收入（通常在 1-2 周后）

祝贺！🎉 你的 Reddit Gallery Viewer 现在已可用！
