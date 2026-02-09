import { defineConfig } from 'vitepress'
import { generateSidebar } from './scripts/generate-sidebar.mjs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AI 阅读",
  description: "AI 驱动的书籍解读与知识分享平台",
  lang: 'zh-CN',

  // 主题配置
  themeConfig: {
    // 网站标题
    siteTitle: 'AI 阅读',

    // 不使用顶部导航栏，完全依赖侧边栏
    nav: [],

    // 自动生成侧边栏
    sidebar: generateSidebar() as any,

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索书籍',
                buttonAriaLabel: '搜索书籍'
              },
              modal: {
                noResultsText: '未找到相关书籍',
                resetButtonTitle: '清除查询',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/chess99/ai-reading' }
    ],

    // 页脚
    footer: {
      message: '基于 VitePress 构建 | AI 驱动的知识分享',
      copyright: 'Copyright © 2024-present'
    },

    // 文档页脚
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '目录'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  },

  // 启用最后更新时间
  lastUpdated: true,

  // 忽略死链
  ignoreDeadLinks: true,

  // Markdown 配置
  markdown: {
    lineNumbers: false,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
