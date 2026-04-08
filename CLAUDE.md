# ai-reading 书库规范

## 部署

GitHub Pages，仓库名 `ai-reading`，所有路径以 `/ai-reading` 为前缀。
next.config.ts 已配置 `basePath: '/ai-reading'`。
代码中手动拼接路径时统一用 `process.env.NEXT_PUBLIC_BASE_PATH || '/ai-reading'`，不要硬编码裸路径。

## 书籍文件命名规范

文件路径：`books/<分类>/<作者>-<书名>.md`

### 书名

- 统一使用**中文通用译名**，不用英文原名
  - ✅ `从零到一` ❌ `Zero to One`
  - ✅ `5点钟俱乐部` ❌ `The 5am Club`
  - ✅ `噪声` ❌ `Noise`
- **不含版本信息**，版本信息不进文件名也不进 `title`
  - ✅ `笑傲股市` ❌ `笑傲股市（原书第4版·典藏版）`
  - ✅ `营销管理` ❌ `营销管理（第16版）`
- 例外：品牌缩写可保留英文（`ACSM高级运动生理学`）

### 作者名

- 使用完整中文译名
  - ✅ `菲利普·费雪` ❌ `费舍`
- 多作者用英文逗号分隔：`作者A,作者B,作者C`

## Frontmatter 规范

```yaml
---
slug: <书名拼音，不含作者名>
title: <中文书名，与文件名书名部分一致>
author: <作者名>
tags: [标签1, 标签2]   # 行内数组格式
date: 'YYYY-MM-DD'
---
```

- `slug`：书名拼音，**不含作者名**，不含版本号
  - ✅ `zen-yang-xuan-ze-cheng-zhang-gu`
  - ❌ `fei-li-pu-fei-xue-zen-yang-xuan-ze-cheng-zhang-gu`
- `tags`：使用行内数组 `[tag1, tag2]`，不用多行格式
- `title` 与文件名的书名部分保持一致

## 正文第一级标题

使用中文书名，不加副标题或"综合提炼"等后缀：

```markdown
# 从零到一
```

## 重复书籍处理

同一本书只保留一份提炼，保留内容质量更好的版本。
