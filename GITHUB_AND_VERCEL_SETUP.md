# GitHub 和 Vercel 部署指南

完整的步骤指南，将你的 Reddit Gallery Viewer 推送到 GitHub 并在 Vercel 上部署。

---

## 📋 目录

1. [推送到 GitHub](#推送到-github)
2. [在 Vercel 上部署](#在-vercel-上部署)
3. [后续更新](#后续更新)
4. [常见问题](#常见问题)

---

## 推送到 GitHub

### 步骤 1: 创建 GitHub 仓库

1. 登录 GitHub: https://github.com/login
2. 点击右上角的 `+` 图标，选择 **New repository**
3. 填写仓库信息：
   - **Repository name**: `reddit-gallery-viewer`（或你喜欢的名称）
   - **Description**: `Free online tool to browse Reddit subreddits as beautiful image galleries`
   - **Visibility**: 选择 **Public**（这样 Vercel 可以访问）
   - **Add a README file**: 不选（我们已经有 README.md）
   - **Add .gitignore**: 不选（我们已经有）
4. 点击 **Create repository**

### 步骤 2: 关联本地仓库到 GitHub

在终端中运行以下命令（记得替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/reddit-gallery-viewer.git
git branch -M main
git push -u origin main
```

### 步骤 3: 验证推送成功

访问你的 GitHub 仓库地址：
```
https://github.com/YOUR_USERNAME/reddit-gallery-viewer
```

你应该看到所有的文件都已经上传了。

---

## 在 Vercel 上部署

### 步骤 1: 登录 Vercel

访问 https://vercel.com，使用 GitHub 账号登录：
1. 点击 **Continue with GitHub**
2. 授予 Vercel 访问 GitHub 的权限

### 步骤 2: 导入项目

1. 在 Vercel Dashboard 点击 **New Project** 或访问 https://vercel.com/new
2. 在 "Import Git Repository" 部分，搜索 `reddit-gallery-viewer`
3. 选择你的仓库

### 步骤 3: 配置项目

1. **Project Name**: `reddit-gallery-viewer`（默认）
2. **Framework Preset**: 选择 **Other**（因为这是一个静态 HTML 项目）
3. **Root Directory**: `.`（默认）
4. **Build Command**: 保持空白或设置为 `mkdir -p public && cp index.html public/`
5. **Output Directory**: `public`

点击 **Deploy**

### 步骤 4: 等待部署完成

Vercel 会自动开始构建和部署你的项目。这通常需要 1-2 分钟。

部署完成后，你会看到一个成功消息和你的部署 URL，类似：
```
https://reddit-gallery-viewer-xxxxx.vercel.app
```

### 步骤 5: 配置自定义域名（可选）

如果你想使用自己的域名：

1. 在 Vercel 项目设置中，进入 **Domains**
2. 点击 **Add**，输入你的域名
3. 按照 Vercel 的指示配置 DNS 记录

---

## 后续更新

### 在本地更新代码

```bash
# 1. 进行代码修改
# 2. 提交更改
git add .
git commit -m "Update: Your change description"

# 3. 推送到 GitHub
git push origin main
```

### 自动部署

Vercel 已经配置为 **自动部署**。每次你推送代码到 GitHub 的 `main` 分支时，Vercel 会自动：
1. 检测到新的推送
2. 构建项目
3. 部署到生产环境

你可以在 Vercel Dashboard 的 **Deployments** 标签中查看部署历史和状态。

---

## 常见问题

### Q: 如何在 GitHub 上查看我的代码？

A: 访问 `https://github.com/YOUR_USERNAME/reddit-gallery-viewer`

### Q: 部署失败了怎么办？

A:
1. 检查 Vercel Dashboard 中的 **Logs** 标签查看错误信息
2. 确保 `index.html` 在仓库的根目录
3. 确保 `vercel.json` 配置正确

### Q: 如何更新已部署的网站？

A: 只需在本地修改代码，提交并推送到 GitHub，Vercel 会自动重新部署。

### Q: 如何回滚到之前的版本？

A: 在 Vercel Dashboard 中，进入 **Deployments** 标签，找到之前的部署，点击三个点菜单选择 **Promote to Production**。

### Q: 可以从 GitHub 删除代码吗？

A: 可以，但这样会影响 Vercel 的部署。如果你需要私有性，建议升级到私有仓库（GitHub Pro 或更高）。

### Q: 如何配置环境变量？

A: 这个项目不需要环境变量。如果以后需要，可以在 Vercel 项目设置中的 **Environment Variables** 添加。

---

## 验证清单

部署完成后，验证以下内容：

- [ ] GitHub 仓库已创建并可访问
- [ ] 所有文件已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] 网站已部署并可访问
- [ ] 网站的所有功能正常工作（搜索、加载图片等）
- [ ] 移动设备上显示正常

---

## 后续步骤

1. **配置搜索引擎**：
   - 在 Google Search Console 提交你的网站
   - 等待 Google 索引

2. **监控性能**：
   - 在 Vercel 中启用 Analytics
   - 在 Google Analytics 中跟踪流量

3. **启用盈利**（可选）：
   - 获取 Google AdSense 账户
   - 取消注释 `index.html` 中的广告代码
   - 替换占位符 ID

4. **推广你的工具**：
   - 在 Reddit、Twitter 等社交媒体分享
   - 提交到 Product Hunt

---

## 有用的链接

- GitHub: https://github.com
- Vercel: https://vercel.com
- Vercel 文档: https://vercel.com/docs
- Git 文档: https://git-scm.com/doc

---

祝部署顺利！如有问题，参考相关文档或联系支持。
