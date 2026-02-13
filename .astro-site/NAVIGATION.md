# 导航系统使用指南

## 概述

本项目实现了一个类似 Obsidian 的导航系统,支持移动端和桌面端的不同交互体验。

## 功能特性

### 移动端体验
- **底部 Tab 栏**: 固定在屏幕底部,包含 Files / Search / Tags 三个选项
- **全屏视图**: 点击 Tab 切换不同的视图面板
- **Touch 优化**: 支持触摸交互,响应快速
- **安全区域**: 自动适配 iPhone X 等设备的安全区域

### 桌面端体验
- **左侧侧边栏**: 280px 宽度,可折叠至 48px(仅图标)
- **Sticky 定位**: 侧边栏始终可见,不随页面滚动
- **快速切换**: 顶部 Tab 快速切换视图
- **键盘快捷键**: 支持多种快捷键操作

## 三大视图

### 1. Files 视图
- 显示所有书籍分类的目录树
- 支持实时筛选分类
- 显示每个分类的书籍数量
- 当前分类高亮显示

### 2. Search 视图
- 集成 Pagefind 全文搜索
- 实时搜索结果展示
- 支持中文分词
- 显示搜索结果摘要

### 3. Tags 视图
- 标签云展示所有标签
- 点击放大镜显示搜索框
- 点击标签查看相关书籍
- 支持标签筛选

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Alt + 1` | 切换到 Files 视图 |
| `Alt + 2` | 切换到 Search 视图 |
| `Alt + 3` | 切换到 Tags 视图 |
| `Cmd/Ctrl + B` | 切换侧边栏折叠状态 |
| `Cmd/Ctrl + K` | 快速打开搜索 |
| `ESC` | 关闭搜索/清空输入 |

## 在页面中启用导航

### 基础用法

在任何页面的 BaseLayout 中添加 `showNavigation={true}`:

```astro
<BaseLayout
  title="页面标题"
  description="页面描述"
  showNavigation={true}
>
  <!-- 页面内容 -->
</BaseLayout>
```

### 高级用法

指定当前视图和分类:

```astro
<BaseLayout
  title={`${category} - AI 阅读`}
  description={`浏览 ${category} 分类下的书籍`}
  showNavigation={true}
  currentView="files"
  currentCategory={category}
>
  <!-- 页面内容 -->
</BaseLayout>
```

### 参数说明

- `showNavigation`: 是否显示导航系统 (默认: `false`)
- `currentView`: 当前激活的视图 (`'files'` | `'search'` | `'tags'`, 默认: `'files'`)
- `currentCategory`: 当前分类名称,用于在 FileTree 中高亮

## 组件架构

```
NavigationShell (导航容器)
├── Sidebar (桌面端侧边栏)
│   ├── FileTree (文件树)
│   ├── SearchPanel (搜索面板)
│   └── TagList (标签列表)
├── Mobile Panels (移动端面板)
│   ├── FileTree
│   ├── SearchPanel
│   └── TagList
└── TabBar (移动端底部 Tab)
```

## 状态管理

导航系统使用 `NavigationStateManager` 类管理状态:

- **localStorage 持久化**: 记住用户的视图选择和侧边栏折叠状态
- **URL hash 同步**: 当前视图保存在 URL hash 中 (`#view=files`)
- **响应式**: 自动适配窗口大小变化

## 自定义样式

导航系统使用 CSS 变量,可以在 `:root` 中自定义:

```css
:root {
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --hover-bg: #f3f4f6;
  --active-bg: #dbeafe;
}
```

## 性能优化

- **按需加载**: Pagefind 搜索引擎仅在切换到 Search 视图时加载
- **防抖处理**: 搜索输入使用防抖,减少不必要的查询
- **CSS 过渡**: 使用 GPU 加速的 CSS 过渡,保证流畅动画

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## 示例页面

- **分类页面**: `/category/[category]` - 已启用导航系统
- **首页**: `/` - 未启用(保持原有设计)
- **书籍详情页**: `/books/[slug]` - 可选启用

## 开发指南

### 添加新视图

1. 在 `src/components/navigation/` 创建新组件
2. 在 `Sidebar.astro` 和 `NavigationShell.astro` 中引入
3. 在 `navigationState.ts` 中添加新的视图类型
4. 更新 `TabBar.astro` 添加新的 Tab

### 修改样式

所有导航组件的样式都使用 scoped CSS,直接在组件的 `<style>` 标签中修改即可。

## 故障排除

### 搜索不工作
- 确保 Pagefind 构建成功: `npm run build`
- 检查浏览器控制台是否有错误
- 确认 `/pagefind/` 目录存在

### 侧边栏不显示
- 检查是否设置了 `showNavigation={true}`
- 确认屏幕宽度 >= 768px (桌面端)
- 检查浏览器控制台是否有 JavaScript 错误

### 状态不持久化
- 检查浏览器是否禁用了 localStorage
- 清除浏览器缓存后重试
- 检查控制台是否有权限错误

## 未来计划

- [ ] 添加书签功能
- [ ] 支持拖拽排序分类
- [ ] 添加阅读历史记录
- [ ] 支持自定义主题
- [ ] 添加快捷命令面板 (Cmd+P)
