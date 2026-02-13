/**
 * 导航状态管理
 * 负责侧栏折叠、视图切换、状态持久化
 */

type ViewType = 'files' | 'search' | 'tags';

interface NavigationState {
  currentView: ViewType;
  sidebarCollapsed: boolean;
  selectedTag?: string;
}

class NavigationStateManager {
  private state: NavigationState;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.state = this.loadState();
    this.init();
  }

  private loadState(): NavigationState {
    if (typeof window === 'undefined') {
      return { currentView: 'files', sidebarCollapsed: false };
    }

    const saved = localStorage.getItem('nav-state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return {
      currentView: 'files',
      sidebarCollapsed: window.innerWidth < 768, // 移动端默认折叠
    };
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nav-state', JSON.stringify(this.state));
    }
  }

  private init() {
    this.syncWithURL();
    this.attachEventListeners();
    this.updateUI();
  }

  private syncWithURL() {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    const match = hash.match(/#view=(files|search|tags)/);
    if (match) {
      this.state.currentView = match[1] as ViewType;
    }
  }

  private attachEventListeners() {
    if (typeof window === 'undefined') return;

    // 视图切换按钮
    document.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view') as ViewType;
        if (view) this.switchView(view);
      });
    });

    // 侧栏折叠按钮
    document.querySelector('.sidebar-toggle')?.addEventListener('click', () => {
      this.toggleSidebar();
    });

    // 浏览器前进后退
    window.addEventListener('popstate', () => {
      this.syncWithURL();
      this.updateUI();
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      // Alt + 1/2/3 切换视图
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.switchView('files');
            break;
          case '2':
            e.preventDefault();
            this.switchView('search');
            break;
          case '3':
            e.preventDefault();
            this.switchView('tags');
            break;
        }
      }

      // Cmd/Ctrl + B 切换侧栏
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        this.toggleSidebar();
      }

      // Cmd/Ctrl + K 快速搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.switchView('search');
        // 聚焦搜索框
        setTimeout(() => {
          const searchInput = document.querySelector<HTMLInputElement>(
            '#quick-search-input, #pagefind-search'
          );
          searchInput?.focus();
        }, 100);
      }
    });

    // 响应式: 窗口大小变化
    let resizeTimer: number;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile && !this.state.sidebarCollapsed) {
          // 移动端自动折叠
          this.state.sidebarCollapsed = true;
          this.updateSidebarUI();
        }
      }, 250);
    });
  }

  switchView(view: ViewType) {
    this.state.currentView = view;
    this.saveState();
    this.updateURL();
    this.updateUI();
    this.emit('viewChange', view);
  }

  toggleSidebar() {
    this.state.sidebarCollapsed = !this.state.sidebarCollapsed;
    this.saveState();
    this.updateSidebarUI();
    this.emit('sidebarToggle', this.state.sidebarCollapsed);
  }

  private updateURL() {
    if (typeof window === 'undefined') return;
    const hash = `#view=${this.state.currentView}`;
    history.replaceState(null, '', hash);
  }

  private updateUI() {
    // 更新视图面板
    document.querySelectorAll('[data-view-panel]').forEach((panel) => {
      const panelView = panel.getAttribute('data-view-panel');
      const isActive = panelView === this.state.currentView;
      panel.classList.toggle('active', isActive);
      if (isActive) {
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    // 更新标签按钮
    document.querySelectorAll('[data-view]').forEach((btn) => {
      const btnView = btn.getAttribute('data-view');
      const isActive = btnView === this.state.currentView;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // 更新侧栏状态
    this.updateSidebarUI();
  }

  private updateSidebarUI() {
    const sidebar = document.querySelector('.sidebar');
    sidebar?.setAttribute('data-collapsed', String(this.state.sidebarCollapsed));
  }

  private emit(event: string, data?: any) {
    this.listeners.get(event)?.forEach((fn) => fn(data));
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  getCurrentView(): ViewType {
    return this.state.currentView;
  }

  isSidebarCollapsed(): boolean {
    return this.state.sidebarCollapsed;
  }
}

// 全局实例
let navState: NavigationStateManager;

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    navState = new NavigationStateManager();
    (window as any).navState = navState; // 调试用
  });
}

export { NavigationStateManager };
export type { ViewType, NavigationState };
