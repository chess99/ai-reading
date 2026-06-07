# Topics Page Discovery Design

## Status

Approved direction: A2 clean search version.

This spec covers the future `/topics` index page presentation for a larger topic set. It does not implement the page and does not change published topic content.

## Goal

Make `/topics` remain a reading-site entry page, not a dense course catalog or admin-style search interface.

The page should help readers start from a concrete question, quickly narrow by field when needed, and scan topic cards without being distracted by roadmap-scale numbers or artificial learning levels.

Keep the existing subtitle:

> 带着一个具体问题开始阅读：先建立判断框架，再沿着几本关键书逐层深入。

## Final Direction

Use a clean search-first layout:

1. Header and title stay close to the current page.
2. Add one search panel below the subtitle.
3. Add one filter row for domain only.
4. Keep the topic card grid as the main body.
5. Do not show global count stats such as total topic count, domain count, or book-count ranges.
6. Do not show topic levels such as `入门`, `框架`, or `系统`.
7. Do not add sorting controls in the first version.

This keeps the page lightweight and close to the current visual language while still making a larger topic set navigable.

## Information Architecture

The page has three visible layers:

### 1. Page Introduction

Content:

- Kicker: `TOPICS`
- Title: `主题阅读`
- Subtitle: `带着一个具体问题开始阅读：先建立判断框架，再沿着几本关键书逐层深入。`

No stats cards appear in the introduction.

### 2. Search And Domain Filter

Search input placeholder:

`搜索主题、标签、领域、书名，例如：决策、亲密关系、产品`

The first implementation may search only topic fields available on the index page. If book-title search requires loading full topic book recommendations, the UI can still use the same placeholder once the data supports it. Do not link this search box to the global full-text search page unless explicitly designed later.

Domain filter:

- `全部`
- `思维`
- `学习`
- `心理`
- `关系`
- `职业`
- `商业`
- `金钱`
- `社会`
- `历史`
- `健康`

The filter row is a single dimension. There is no level filter and no multi-row advanced filter panel.

### 3. Topic Cards

Cards remain close to the existing `TopicCard` structure:

- Title
- Description
- Metadata chips
- Book count chip

Recommended metadata chips:

- Domain
- Group, when available
- Book count

Do not place a level badge in the card corner.

## Data Model

Extend topic metadata when the implementation batch is ready:

```yaml
domain: 思维、判断与科学
group: 决策与防错
```

`level` is intentionally not part of the public index design.

The existing `tags` field remains useful for topic detail pages, SEO keywords, and search matching. Domain and group should not be inferred from tags once the 80-topic roadmap is implemented; they should be explicit frontmatter fields.

## Interaction Behavior

Search:

- Client-side filtering is enough for the topic index.
- Match title, description, tags, domain, group, and book titles if book recommendation data is included in the topic index payload.
- Debounce input lightly if needed, but the topic list size is small enough that this is not a performance-sensitive feature.

Domain filter:

- Selecting a domain filters the visible topic cards.
- Selecting `全部` clears the domain filter.
- Search and domain filter combine with AND behavior.
- Empty state should say that no matching topic was found and suggest clearing the search or changing the domain.

URL state:

- Nice to have, not required for first implementation.
- If added, use query params such as `?q=决策&domain=思维`.

## Responsive Design

Desktop:

- Keep the current constrained content width.
- Search input and search button sit in one row.
- Domain chips wrap naturally when needed.
- Topic cards remain two-column, matching the current page.

Mobile:

- Search input becomes full width.
- The search button can be omitted if input filters live, or placed below the input if explicit submit is used.
- Domain chips scroll horizontally or wrap into two compact rows.
- Topic cards become single-column.
- No sticky filter bar in the first version.

## Accessibility

- Search input must have a visible label or an accessible label.
- Domain chips must be real buttons with `aria-pressed`.
- Keyboard focus states must remain visible.
- Filtering should not rely on color alone; active domain state should also use weight, border, or background.
- Empty state should be text, not only visual absence.

## Non-Goals

- No hierarchical domain sections in this version.
- No level labels.
- No global statistics cards.
- No sorting controls.
- No advanced filter drawer.
- No change to topic detail page layout.
- No migration of the 80-topic roadmap into live topic files as part of this design.

## Acceptance Criteria

- `/topics` keeps the original subtitle exactly.
- The page has a search input and a domain-only filter row.
- There are no visible total-count stat cards.
- There are no `入门` / `框架` / `系统` labels in filters or cards.
- The card grid remains recognizable as the current topic card experience.
- Filtering works on desktop and mobile without horizontal page overflow.
- The implementation does not stage or commit `.superpowers/` mockup files.
