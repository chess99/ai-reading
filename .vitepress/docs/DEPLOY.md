# 部署指南

## GitHub Pages 部署步骤

### 1. 推送代码到 GitHub

```bash
# 初始化 git 仓库（如果还没有）
git init
git add .
git commit -m "Initial commit: Setup VitePress site"

# 添加远程仓库
git remote add origin https://github.com/yourusername/AI阅读.git

# 推送到 main 分支
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 进入 GitHub 仓库设置页面
2. 找到 **Settings** → **Pages**
3. 在 **Source** 下选择 **GitHub Actions**

### 3. 自动部署

推送到 main 分支后，GitHub Actions 会自动：
1. 运行预处理脚本（提取元数据、生成索引）
2. 构建 VitePress 站点
3. 部署到 GitHub Pages

查看部署状态：
- 访问仓库的 **Actions** 标签页
- 查看最新的 workflow 运行状态

### 4. 访问网站

部署成功后，网站将在以下地址可用：
```
https://yourusername.github.io/AI阅读/
```

## 本地预览

### 开发模式（热重载）

```bash
npm run docs:dev
```

访问 http://localhost:5173

### 构建并预览

```bash
npm run docs:build
npm run docs:preview
```

## 配置自定义域名（可选）

1. 在仓库根目录创建 `CNAME` 文件：
```bash
echo "yourdomain.com" > CNAME
```

2. 在域名提供商处添加 DNS 记录：
```
Type: CNAME
Name: www (or @)
Value: yourusername.github.io
```

3. 在 GitHub 仓库设置中配置自定义域名

## 更新配置

### 修改网站标题和描述

编辑 `.vitepress/config.mts`:

```typescript
export default defineConfig({
  title: "你的网站标题",
  description: "你的网站描述",
  // ...
})
```

### 修改导航栏

编辑 `.vitepress/config.mts` 中的 `nav` 配置：

```typescript
nav: [
  { text: '首页', link: '/' },
  { text: '分类1', link: '/分类1/' },
  // 添加更多导航项...
]
```

### 自定义样式

编辑 `.vitepress/theme/style.css` 来自定义网站外观。

## 添加新分类

1. 在根目录创建新的分类文件夹
2. 在 `.vitepress/scripts/generate-sidebar.mjs` 中添加分类名称
3. 在 `.vitepress/scripts/prebuild.mjs` 中添加分类名称
4. 在 `.vitepress/config.mts` 中添加导航链接

## 故障排查

### 构建失败

检查 GitHub Actions 日志：
1. 访问仓库的 **Actions** 标签页
2. 点击失败的 workflow
3. 查看详细错误信息

### 页面显示异常

1. 确保所有 Markdown 文件格式正确
2. 检查文件名是否包含特殊字符
3. 验证 frontmatter 格式是否正确

### 搜索功能不工作

VitePress 的本地搜索是自动构建的，如果搜索不工作：
1. 清除构建缓存：`rm -rf .vitepress/cache .vitepress/dist`
2. 重新构建：`npm run docs:build`

## 性能优化

### 图片优化

- 使用 WebP 格式
- 压缩图片大小
- 考虑使用 CDN

### 构建优化

如果构建时间过长：
- 减少不必要的插件
- 使用增量构建
- 考虑使用缓存策略

## 维护建议

### 定期更新

```bash
# 更新依赖
npm update

# 检查过时的包
npm outdated
```

### 备份

定期备份原始 Markdown 文件到其他位置。

### 监控

使用 GitHub Insights 监控网站访问情况（如果仓库是公开的）。
