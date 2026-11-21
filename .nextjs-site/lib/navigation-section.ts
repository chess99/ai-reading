/** 二级页标记所属栏目，直接打开栏目时标记当前页面。 */
export function navigationCurrent(pathname: string, href: string): 'page' | 'location' | undefined {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === href) return 'page';
  if (path.startsWith('/topics/') && href === '/topics') return 'location';
  if (path.startsWith('/books/') && href === '/library') return 'location';
  if (['/about', '/listen', '/request-book'].includes(path) && href === '/settings') return 'location';
}
