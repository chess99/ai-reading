# Topic Reading Panorama V8 Review Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild topic reading into a full-site roadmap. The roadmap starts from reader problems and learning depth, not from the current book database. The 8 published topics are included in the same review system and may be kept, renamed, split, merged, replaced, or removed in later implementation batches.

**Architecture:** This is a reviewable planning artifact, not a publish-ready batch. It defines the target taxonomy, topic-level book lists, book-list depth rules, migration rules, and future batch workflow. Future implementation must first bring every recommended book into `books/`, then publish topic Markdown using only `status: in_library`.

**Tech Stack:** Markdown planning document in `docs/superpowers/plans/`; future implementation uses the existing `topics/*.md` model, Next.js static generation, and topic content validation tests.

---

## Review Status

This plan is not approved for implementation yet. It is the canonical V8 draft for later review.

This V8 revision answers three review questions:

1. **Is the topic division reasonable?** Yes after splitting two overloaded buckets. Domains must be reader-problem domains, not bookstore shelves. A domain may be broad only if its second-level groups clearly separate entry, framework, and system questions. V8 uses 12 domains by splitting V7's `历史、文明、技术与人文` into history/civilization, technology/AI/media, and humanities/philosophy, and by moving happiness/life philosophy out of the health bucket.
2. **Are books inside each list reasonable?** Mostly yes after rebalancing. V8 keeps variable list lengths, makes compact paths intentionally compact, and prevents every topic from becoming a 6-book template. The current count distribution is: 10 compact 6-book paths, 30 seven-book paths, 29 eight-book paths, 7 nine-book paths, and 4 ten-book system paths.
3. **Are domains deep and systematic enough?** Yes as a full-site roadmap, but not every topic needs the same depth. Each domain must contain at least one entry path, one framework path, and one system/critique path. A future batch that publishes only entry-level lists from a domain is incomplete even if each individual topic looks coherent.

The final panorama now uses **12 domains and 80 topic candidates**. Topic count is still large because the file is a full-site roadmap, but it is not a publishing batch. Future batches should select 4-8 topics at a time.

This plan does not delete live topic files. Deletion, redirect, or slug replacement must happen in a later explicit migration batch.

## Key V8 Decisions

- Split V5's overloaded society/history domain into `社会、法律与公共生活`, `历史、文明与世界格局`, `科技、AI 与媒介环境`, and `文学、人文与人生哲学`.
- Do not hide humanities inside a technology/history bucket. Literature, art, happiness, and philosophy are their own reader-facing domain because their purpose is interpretation, meaning, and aesthetic judgment, not trend tracking.
- Split V5's overloaded health/meaning/creation domain by moving writing, expression, and creativity into `自我管理、学习与创造`; moving happiness and life philosophy into `文学、人文与人生哲学`; and keeping sleep, exercise, nutrition, stress, aging, disease, and climate in `健康、身体与可持续生活`.
- Merge overlapping evidence topics. V5 had `如何建立批判性思维`, `怎样判断证据是否可靠`, `如何建立科学思维`, and `识别伪科学与坏证据`; V8 keeps one strong evidence path and one science-worldview path.
- Keep product work as a ladder, not a cluster of near-duplicates: opportunity validation -> product discovery -> 0-to-1 -> product organization/delivery -> growth/strategy/platform.
- Keep the 8 published topics in the first migration priority, but no current page is sacred. The product page should be replaced through a split, and the bias/group-influence page should be renamed.
- Book-list length is no longer visually normalized. Compact topics use 5-6 books, standard topics use 7-9, and complex/system topics use 10-12.
- A repeated book must have one clear role per topic: `core`, `bridge`, or `extension`. A later batch can revise these roles, but must record why.
- Current published topics are inputs, not constraints. V8 keeps or deepens six of the eight, replaces the product page through a split, and renames the bias/group-influence page to make the reader problem clearer.

## Published Topic Reconstruction Matrix

| Current Topic | V8 Decision | Target Placement | Migration Direction |
|---|---|---|---|
| `如何做重大决策` | Keep and deepen | 思维、判断与科学 | Keep as first-batch topic. Add decision process, judgment noise, probability updating, system consequences, and execution checks. |
| `如何理解系统与复杂性` | Keep, rename, and narrow | 思维、判断与科学 | Rename toward `什么是系统思维与复杂性`. Keep feedback, emergence, scale, and resilience; move pure uncertainty books to risk topic. |
| `如何建立可持续习惯` | Keep and tighten | 自我管理、学习与创造 | Keep as first-batch topic. Center on behavior design, environment, motivation, self-control, and action friction. |
| `如何识别偏见与群体影响` | Rename and deepen | 思维、判断与科学 | Replace with `为什么人会偏见、从众与服从`. Keep social psychology; separate structural inequality into social topics. |
| `从0到1做产品` | Replace through split | 商业、产品与创业 | Do not keep the old title as an independent planning topic. Use `如何验证产品机会`, `如何做好产品发现`, and `产品从 0 到 1`; the last one replaces the published page when migration happens. |
| `如何理解亲密关系` | Keep and improve | 关系、沟通与家庭教育 | Rename display title to `亲密关系阅读路径` if needed. Remove manipulative dating books from the core path. |
| `如何面对创伤与自我修复` | Keep with strict boundary | 心理、情绪与修复 | Keep as first-batch topic. Do not mix decision books into the core path; focus on trauma, body memory, attachment, safety, and recovery. |
| `如何提高深度工作能力` | Keep and broaden | 自我管理、学习与创造 | Keep as first-batch topic. Add cognitive load, task systems, deliberate practice, recovery, and attention environment. |

## First Migration Priority

The first implementation batch should handle the 8 published topics before adding more net-new public pages. These pages already define the user-facing baseline, so the site should not carry old book paths after the new panorama is approved.

- Replace the published `从0到1做产品` page with `产品从 0 到 1`.
- Rename or replace `如何识别偏见与群体影响` with `为什么人会偏见、从众与服从`.
- Update `如何做重大决策`, `什么是系统思维与复杂性`, `如何建立可持续习惯`, `亲密关系阅读路径`, `如何面对创伤与自我修复`, and `如何提高深度工作能力` to match this plan's book paths.
- Do not retain old core books that this matrix has moved to extension roles.
- Do not delete or redirect an existing topic until its replacement topic has all books present in `books/` and passes topic validation.

## Published Topic Book-List Audit

This audit is the concrete answer to "the existing 8 topic lists may be deleted." V8 does not delete files in this planning pass, but it stops treating the current pages as the canonical structure.

| Published Topic | Keep Core | Move Out Of Core | Add Or Promote | Reason |
|---|---|---|---|---|
| `如何做重大决策` | 《思考，快与慢》, 《噪声》, 《怎样决定大事》, 《系统之美》, 《助推》, 《反脆弱》, 《清单革命》 | None | 《决断力》, 《超级预测》, 《对赌》 | The path should run from decision process to bias/noise, probability updating, execution checks, and system consequences. |
| `如何理解系统与复杂性` | 《系统之美》, 《控制论与科学方法论》, 《反脆弱》, 《弹性》 | 《黑天鹅》 becomes risk-topic bridge; 《思维模型》 becomes science-worldview bridge | 《第五项修炼》, 《复杂》, 《规模》, 《混沌》, 《复杂经济学》 | The topic should be about feedback, emergence, scale, adaptation, and resilience, not a general uncertainty shelf. |
| `如何建立可持续习惯` | 《掌控习惯》, 《习惯的力量》, 《微习惯》, 《福格行为模型》, 《拖延心理学》 | 《认知觉醒》 becomes learning/output bridge | 《自控力》, 《驱动力》, 《精要主义》 | The path needs behavior design, action friction, self-control, motivation, and goal pruning. |
| `如何识别偏见与群体影响` | 《社会心理学》, 《偏见的本质》, 《社会性动物》, 《社会认知心理学》, 《影响力》, 《路西法效应》 | None | 《服从权威》, 《盲点》 | Rename to `为什么人会偏见、从众与服从`; keep social psychology and treat 《乌合之众》 as a historical text to read critically. |
| `从0到1做产品` | 《从零到一》, 《精益创业》, 《四步创业法》, 《客户开发入门》, 《产品开发流程原理》 | 《上瘾》 moves to behavior/growth bridge; 《俞军产品方法论》 moves to product discovery core | 《妈妈测试》, 《启示录》, 《用户故事地图》, 《创业维艰》 | Replace the page through a product ladder: opportunity validation, product discovery, 0-to-1, organization/delivery, growth, strategy, and platform. |
| `如何理解亲密关系` | 《亲密关系》, 《依恋》, 《沟通的本质》, 《身体从未忘记》 | 《如何让你爱的人爱上你》 removed from core; 《被讨厌的勇气》 moves to self-worth bridge | 《幸福的婚姻》, 《抱紧我》, 《爱的艺术》, 《非暴力沟通》 | The core should explain attachment, marriage research, emotional cycles, communication, love, and trauma impact, not manipulative tactics. |
| `如何面对创伤与自我修复` | 《身体从未忘记》, 《依恋》, 《我们为什么要睡觉》 | 《怎样决定大事》 removed; 《亲密关系》 becomes relationship bridge; 《被讨厌的勇气》 becomes self-worth bridge | 《创伤与复原》, 《唤醒老虎》, 《不原谅也没关系》, 《抱紧我》, 《运动改造大脑》 | The path must stay within trauma, body memory, attachment safety, relationship repair, and recovery support. |
| `如何提高深度工作能力` | 《深度工作》, 《心流》, 《刻意练习》, 《精要主义》, 《拖延心理学》, 《稀缺》, 《掌控习惯》 | 《认知觉醒》 becomes learning/output bridge | 《搞定》, 《找回专注力》, 《慢生产力》 | The path should cover attention quality, skill growth, task systems, bandwidth, action resistance, environment, and sustainable output. |

## Source Signals

The panorama borrows category signals from knowledge-service platforms, then converts them into problem-driven reading themes.

- 得到：lifelong learning, business, management, product thinking, finance, history, modern thought, and daily book listening.
- 帆书/樊登读书：mindset, management, workplace, family, humanities, entrepreneurship, psychology, parenting, investment, social science, and health.
- 喜马拉雅：health psychology, daily life, children growth, learning motivation, humanities, social science, business finance, history, parenting, and relationships.
- Coursera/edX category signals: business, social sciences, health, humanities, personal development, data/computer science, and language/arts are separated at the platform level, which supports splitting technology, humanities, and health instead of forcing them into one mixed domain.
- Five Books-style editorial signals: topic curation works best when public life, history, philosophy, literature, science, economics, and psychology remain separately browsable, then are connected through individual reading paths.

Reference links:

- [得到 App Store](https://apps.apple.com/kg/app/%E5%BE%97%E5%88%B0-%E8%AF%BE%E7%A8%8B%E5%90%AC%E4%B9%A6%E7%94%B5%E5%AD%90%E4%B9%A6/id1016323413)
- [帆书书籍解读](https://www.fanshu.cn/intro/read)
- [帆书延伸学习](https://www.fanshu.cn/intro/learn)
- [喜马拉雅有声阅读报告](https://biz.tom.com/202404/1840213107.html)
- [Coursera Browse](https://www.coursera.org/browse)
- [edX Courses](https://www.edx.org/search)
- [Five Books Categories](https://fivebooks.com/categories/)

## Non-Negotiable Content Rules

- Topic titles must be reader-centered and problem-driven. Use a mixed style: `如何...`, `怎样...`, `为什么...`, `什么是...`, `看懂...`, or concise noun-style reading paths when that sounds more natural.
- Topic count per domain is not fixed. The taxonomy must optimize coverage and reader usefulness, not visual symmetry.
- Book count per topic is determined by problem complexity: 5-6 for compact topics, 7-9 for standard topics, 10-12 for complex topics.
- A 6-book list is allowed only when the reader problem is narrow and the books form a complete arc. A broad field with only 6 books is underbuilt, even if the six books are individually strong.
- A 10-12-book list is allowed only when the topic truly needs multiple disciplines or a system view. Do not inflate a practical problem just to display depth.
- Book order is intentional: entry book first, then core framework, then system coverage, then practice, critique, or advanced reference.
- Every list must have a visible learning gradient. If the order cannot be explained, the list is not ready.
- Approved topics must use `status: in_library` for every recommendation.
- Before publishing an approved topic, every recommended book must already exist in `books/` or be added to `books/` with a valid slug.
- Medical, mental health, legal, and investment topics must include a reader-facing boundary note in the article body.
- Book titles use common Chinese names. Author names and final slugs are verified during the future implementation batch.
- A book that appears in multiple themes must be assigned one of three roles during implementation: `core`, `extension`, or `bridge`. The public page does not need to show this role.

## Book-List Depth Rules

Each topic list should pass four tests:

| Test | Requirement |
|---|---|
| Entry test | The first 1-2 books let a motivated general reader enter the subject without a textbook wall. |
| Framework test | The middle books establish the core concepts, evidence, or practice model. |
| System test | At least one book connects the topic to adjacent systems, institutions, constraints, or long-term consequences. |
| Practice or critique test | The final books either help the reader apply the topic or challenge the easy version of the topic. |

Book-list lengths are intentionally uneven:

| Topic Type | Normal Size | When to Split |
|---|---:|---|
| Compact problem | 5-6 books | If the list needs more than two frameworks. |
| Standard learning path | 7-9 books | If two different reader goals are mixed. |
| Complex/system topic | 10-12 books | If the list exceeds 12 or has two independent disciplines. |

Current V8 length audit:

| Book Count | Number Of Topics | Interpretation |
|---:|---:|---|
| 6 | 10 | Deliberately compact paths: medical/legal/parenting/social subtopics where over-expansion would reduce clarity. |
| 7 | 30 | Normal single-problem paths with entry, framework, and practice/critique. |
| 8 | 29 | Standard system paths that need adjacent-domain coverage. |
| 9 | 7 | Deeper interdisciplinary paths. |
| 10 | 4 | Full system paths: major decision-making, evidence judgment, product 0-to-1, and deep work. |

## Domain Depth Standard

Each domain must support three reader layers:

- `入门层`: quickly build vocabulary and avoid common misunderstandings.
- `框架层`: form a stable mental model of the topic.
- `系统层`: connect the topic to adjacent disciplines, institutions, constraints, and long-term consequences.

Any future batch that only contains entry-level popular books fails the depth bar. Any future batch that only contains classics and textbooks fails the accessibility bar.

| Domain | Required Depth |
|---|---|
| 思维、判断与科学 | Cognitive bias, decision process, evidence, statistics, causality, scientific worldview, system feedback, uncertainty. |
| 自我管理、学习与创造 | Habit, attention, energy, learning science, knowledge management, action resistance, writing, creative work. |
| 心理、情绪与修复 | Emotion, self-worth, anxiety, trauma, grief, addiction, meaning, recovery boundary. |
| 关系、沟通与家庭教育 | Attachment, intimacy, conflict, communication, family system, parenting, adolescence, education. |
| 职业、管理与组织 | Career capital, management, collaboration, leadership, organizational design, power, politics, change. |
| 商业、产品与创业 | Customer problem, opportunity validation, discovery, delivery, growth, strategy, business model, platform effects. |
| 金钱、投资与经济 | Personal finance, investing, valuation, market risk, trading psychology, macroeconomics, consumption, inequality. |
| 社会、法律与公共生活 | Institutions, law, justice, media, public reasoning, cities, gender, social structure. |
| 历史、文明与世界格局 | China, world history, civilization dynamics, international order, institutional comparison, long-term historical forces. |
| 科技、AI 与媒介环境 | Technology society, AI transformation, algorithmic risk, platform power, attention economy, digital public life. |
| 文学、人文与人生哲学 | Literature, art, philosophy, happiness, life wisdom, meaning, interpretive reading. |
| 健康、身体与可持续生活 | Sleep, exercise, nutrition, stress, aging, disease, care, environment, sustainable life. |

## Domain Subgroups

| Domain | Second-Level Groups |
|---|---|
| 思维、判断与科学 | 决策与防错 / 系统与复杂性 / 证据与科学 / 概率与风险 / 群体影响 |
| 自我管理、学习与创造 | 习惯与行动 / 注意力与深度工作 / 学习与输出 / 写作与创造 |
| 心理、情绪与修复 | 情绪与内耗 / 自尊与自我 / 创伤与修复 / 成瘾与哀伤 / 意义重建 |
| 关系、沟通与家庭教育 | 亲密关系 / 关系冲突 / 沟通表达 / 亲子与家庭 / 教育与成长 |
| 职业、管理与组织 | 职业资本 / 管理与领导 / 团队协作 / 组织系统与权力 / 组织变革 |
| 商业、产品与创业 | 产品机会 / 产品发现 / 产品组织 / 增长营销 / 战略经营 / 平台网络 |
| 金钱、投资与经济 | 财务常识 / 长期投资 / 价值投资 / 交易与周期 / 经济运行 / 消费社会 / 阶层机会 |
| 社会、法律与公共生活 | 社会制度 / 公平正义 / 法律常识 / 媒体公共讨论 / 城市空间 / 性别结构 |
| 历史、文明与世界格局 | 中国历史 / 世界历史 / 文明兴衰 / 国际秩序 |
| 科技、AI 与媒介环境 | 技术社会 / AI 变革 / 平台算法 / 注意力风险 / 数字公共生活 |
| 文学、人文与人生哲学 | 文学阅读 / 艺术审美 / 幸福哲学 / 人生哲学 |
| 健康、身体与可持续生活 | 健康生活 / 压力恢复 / 运动体能 / 饮食代谢 / 衰老疾病 / 环境气候 |

## Domain Coverage Audit

| Domain | V8 Verdict | Depth Check |
|---|---|---|
| 思维、判断与科学 | Keep | Complete enough: decision, evidence, causality, science, systems, risk, and group influence are separated instead of collapsed into "thinking better." |
| 自我管理、学习与创造 | Keep | Complete enough: habits, attention, time/energy, learning, notes/output, action resistance, writing, and creative work form a usable ladder. |
| 心理、情绪与修复 | Keep with boundary | Systematic enough for reading, but must retain mental-health boundary notes and avoid presenting self-help books as treatment. |
| 关系、沟通与家庭教育 | Keep | Complete enough: intimacy, conflict, toxic relationships, communication, parenting, attachment safety, adolescence, and education are separate reader problems. |
| 职业、管理与组织 | Keep | Complete enough: individual career capital, manager role, leadership, collaboration, organizational systems, power, and change are all covered. |
| 商业、产品与创业 | Keep and publish carefully | Deepest domain by design. Product topics must be published as a ladder, not as overlapping pages competing for the same books. |
| 金钱、投资与经济 | Keep with boundary | Systematic enough: personal finance, long-term investing, value investing, trading risk, macroeconomics, consumption, and inequality are separated. All investment pages need boundary notes. |
| 社会、法律与公共生活 | Keep | Complete enough after the history split: institutions, justice, law, media, city, and gender each have a distinct public-life question. |
| 历史、文明与世界格局 | Split and keep | More coherent after technology and humanities are removed. The domain now covers historical orientation, civilization dynamics, China/world comparison, and geopolitical order. |
| 科技、AI 与媒介环境 | Split and keep | Systematic enough only if AI trend books, platform power, algorithmic risk, attention markets, and media theory remain separate reading problems. |
| 文学、人文与人生哲学 | Split and keep | Gives interpretation, aesthetics, happiness, and philosophy enough room without smuggling them into health or technology. |
| 健康、身体与可持续生活 | Split and keep with boundary | More coherent after happiness/philosophy move out. Nutrition and medical-adjacent pages require evidence review and boundary notes. |

## High-Frequency Book Role Table

These roles are planning defaults. Future batch plans may revise them, but each revision must explain why.

| Book | Core Topic | Other Usage |
|---|---|---|
| 《思考，快与慢》 | 如何做重大决策 | bias、行为经济学、证据判断主题中作为 bridge |
| 《噪声》 | 如何做重大决策 | 预测、证据判断主题中作为 bridge |
| 《反脆弱》 | 如何理解概率、风险与预测 | 痛苦意义、投资风险、系统复杂性主题中作为 bridge |
| 《系统之美》 | 什么是系统思维与复杂性 | 重大决策、组织系统、环境主题中作为 bridge |
| 《深度工作》 | 如何提高深度工作能力 | 长期职业资本、长期学习主题中作为 bridge |
| 《掌控习惯》 | 如何建立可持续习惯 | 健康生活、长期学习主题中作为 bridge |
| 《亲密关系》 | 亲密关系阅读路径 | 有毒关系、幸福主题中作为 bridge |
| 《依恋》 | 亲密关系阅读路径 | 创伤修复、儿童安全感主题中作为 bridge |
| 《身体从未忘记》 | 如何面对创伤与自我修复 | 压力恢复、有毒关系主题中作为 bridge |
| 《影响力》 | 如何做增长与营销 | 偏见、谈判、行为经济学主题中作为 bridge |
| 《事实》 | 如何建立批判性与证据判断 | 公共讨论、科学思维主题中作为 bridge |
| 《稀缺》 | 如何理解财富、阶层与机会 | 自控、行为经济学、深度工作主题中作为 bridge |
| 《原则》 | 如何理解公司经营 | 领导力、自我认知主题中作为 bridge |
| 《从零到一》 | 产品从 0 到 1 | 商业模式、平台效应主题中作为 bridge |
| 《精益创业》 | 如何验证产品机会 | 产品 0-to-1、商业模式主题中作为 bridge |
| 《学会提问》 | 如何建立批判性与证据判断 | 媒体公共讨论、阅读输出主题中作为 bridge |
| 《也许你该找个人聊聊》 | 如何停止精神内耗 | 自尊、创伤、哀伤主题中作为 bridge |
| 《我们为什么要睡觉》 | 如何建立健康生活方式 | 情绪、创伤恢复、衰老主题中作为 bridge |

## Panorama

### 1. 思维、判断与科学

**二级组：决策与防错 / 系统与复杂性 / 证据与科学 / 概率与风险 / 群体影响**

#### 1. 如何做重大决策

阅读路径： 《怎样决定大事》 → 《决断力》 → 《思考，快与慢》 → 《噪声》 → 《超级预测》 → 《对赌》 → 《助推》 → 《清单革命》 → 《系统之美》 → 《反脆弱》

梯度说明：先建立重大选择流程，再校准认知偏差和判断噪声，随后处理概率更新、结果复盘、选择架构、执行防错，最后把决策放入系统反馈和不确定暴露中。

#### 2. 什么是系统思维与复杂性

阅读路径： 《系统之美》 → 《控制论与科学方法论》 → 《第五项修炼》 → 《复杂》 → 《规模》 → 《混沌》 → 《复杂经济学》 → 《弹性》 → 《反脆弱》

梯度说明：先学存量、流量、反馈和控制，再进入组织学习、涌现、尺度、非线性和复杂经济系统，最后回到个体与系统的适应能力。

#### 3. 如何建立批判性与证据判断

阅读路径： 《学会提问》 → 《批判性思维工具》 → 《超越感觉》 → 《事实》 → 《赤裸裸的统计学》 → 《女士品茶》 → 《为什么》 → 《因果推断》 → 《这才是心理学》 → 《噪声》

梯度说明：从提问和论证入门，进入数据、统计、实验、因果和心理学证据，再用噪声视角检查组织与专家判断的不稳定性。

#### 4. 为什么人会偏见、从众与服从

阅读路径： 《社会心理学》 → 《偏见的本质》 → 《社会性动物》 → 《社会认知心理学》 → 《影响力》 → 《服从权威》 → 《路西法效应》 → 《乌合之众》 → 《盲点》

梯度说明：先理解社会心理学主干，再看分类、归因、说服、权威、角色和群体情境如何改变判断与行为。把《乌合之众》作为历史文本批判阅读，不作为唯一框架。

#### 5. 如何理解概率、风险与预测

阅读路径： 《随机漫步的傻瓜》 → 《超级预测》 → 《噪声》 → 《黑天鹅》 → 《风险、不确定性与利润》 → 《反脆弱》 → 《对赌》 → 《投资最重要的事》

梯度说明：先区分运气、概率与可校准预测，再理解噪声、极端事件和不可测不确定性，最后进入暴露面、复盘和投资风险。

#### 6. 如何建立科学世界观

阅读路径： 《别逗了费曼先生》 → 《世界观》 → 《科学革命的结构》 → 《无穷的开始》 → 《这才是心理学》 → 《技术的本质》 → 《思维模型》

梯度说明：先用科学家故事进入科学精神，再理解世界观、范式变化、可解释性、学科证据差异和技术演化。

### 2. 自我管理、学习与创造

**二级组：习惯与行动 / 注意力与深度工作 / 学习与输出 / 写作与创造**

#### 7. 如何建立可持续习惯

阅读路径： 《掌控习惯》 → 《习惯的力量》 → 《微习惯》 → 《福格行为模型》 → 《拖延心理学》 → 《自控力》 → 《驱动力》 → 《精要主义》

梯度说明：从身份和习惯回路入门，再降低启动门槛，处理行为模型、拖延、意志力、内在动机和目标取舍。

#### 8. 如何提高深度工作能力

阅读路径： 《深度工作》 → 《心流》 → 《刻意练习》 → 《搞定》 → 《精要主义》 → 《拖延心理学》 → 《稀缺》 → 《找回专注力》 → 《慢生产力》 → 《掌控习惯》

梯度说明：先理解高质量注意力，再补上技能训练、任务系统、取舍、行动阻力、认知带宽、注意力环境和可持续产出。

#### 9. 如何管理时间、精力与个人系统

阅读路径： 《精力管理》 → 《搞定》 → 《精要主义》 → 《高效能人士的七个习惯》 → 《每周工作4小时》 → 《慢生产力》 → 《复盘》 → 《原则》

梯度说明：从能量和任务系统入门，再进入价值取舍、个人原则、自动化、可持续节奏和复盘机制。

#### 10. 如何长期坚持学习

阅读路径： 《如何阅读一本书》 → 《认知天性》 → 《学习之道》 → 《刻意练习》 → 《心流》 → 《掌控习惯》 → 《终身成长》 → 《深度工作》 → 《海绵阅读法》

梯度说明：先读懂书，再理解记忆、练习、反馈、心流、习惯、成长型思维和专注环境。

#### 11. 阅读、笔记与输出系统

阅读路径： 《如何阅读一本书》 → 《卡片笔记写作法》 → 《第二大脑》 → 《金字塔原理》 → 《学会提问》 → 《风格感觉》 → 《写作这回事》 → 《复盘》

梯度说明：从读法进入笔记和知识管理，再把输入转成结构化表达、批判性提问、语言风格和复盘闭环。

#### 12. 如何摆脱拖延与行动阻力

阅读路径： 《拖延心理学》 → 《微习惯》 → 《福格行为模型》 → 《幸福的陷阱》 → 《掌控习惯》 → 《搞定》 → 《写作的战争》

梯度说明：先看拖延背后的情绪与自我价值，再用小行动、行为设计、接纳承诺、外部系统和创作阻力处理行动卡点。

#### 13. 开始写作

阅读路径： 《写作这回事》 → 《写作的战争》 → 《字字珠玑》 → 《风格感觉》 → 《成为作家》 → 《小说写作指南》 → 《英文写作指南》

梯度说明：先进入写作习惯和阻力，再补上句子、风格、创作者心态、叙事技术和英文写作基本功。

#### 14. 如何做创意工作

阅读路径： 《像艺术家一样思考》 → 《写作的战争》 → 《最小阻力之路》 → 《创造力》 → 《艺术的故事》 → 《禅与摩托车维修艺术》 → 《故事》

梯度说明：先打开观察方式，再处理阻力、结构张力、创造力机制、美学经验、技艺精神和叙事表达。

### 3. 心理、情绪与修复

**二级组：情绪与内耗 / 自尊与自我 / 创伤与修复 / 成瘾与哀伤 / 意义重建**

#### 15. 如何理解情绪

阅读路径： 《蛤蟆先生去看心理医生》 → 《情绪急救》 → 《情绪是什么》 → 《伯恩斯新情绪疗法》 → 《幸福的陷阱》 → 《身体从未忘记》 → 《我们为什么要睡觉》 → 《运动改造大脑》

梯度说明：从通俗心理咨询故事进入情绪识别，再补上认知疗法、接纳承诺、身体反应、睡眠和运动。

边界说明：本主题只做阅读路径，不替代专业医疗、心理咨询或危机干预。

#### 16. 理解焦虑与抑郁

阅读路径： 《伯恩斯新情绪疗法》 → 《幸福的陷阱》 → 《也许你该找个人聊聊》 → 《蛤蟆先生去看心理医生》 → 《我们为什么要睡觉》 → 《运动改造大脑》

梯度说明：先理解认知、回避和接纳，再看到咨询现场、睡眠、运动和日常支持。保持短清单，避免把医学主题泛化成自助大全。

边界说明：本主题只做阅读路径，不替代专业医疗、心理咨询或危机干预。

#### 17. 如何停止精神内耗

阅读路径： 《也许你该找个人聊聊》 → 《伯恩斯新情绪疗法》 → 《幸福的陷阱》 → 《拖延心理学》 → 《被讨厌的勇气》 → 《认知觉醒》 → 《当下的力量》

梯度说明：从真实咨询和认知模式进入，再处理回避、拖延、边界、元认知和当下经验。

#### 18. 如何建立稳定的自尊

阅读路径： 《被讨厌的勇气》 → 《自尊》 → 《自卑与超越》 → 《终身成长》 → 《性格的陷阱》 → 《也许你该找个人聊聊》

梯度说明：从课题分离和自我接纳开始，再看自尊机制、补偿心理、成长型思维、早期图式和咨询关系。

#### 19. 如何面对创伤与自我修复

阅读路径： 《身体从未忘记》 → 《创伤与复原》 → 《唤醒老虎》 → 《不原谅也没关系》 → 《依恋》 → 《抱紧我》 → 《也许你该找个人聊聊》 → 《我们为什么要睡觉》 → 《运动改造大脑》

梯度说明：先理解创伤如何留在身体和关系中，再看复原阶段、躯体经验、复杂性创伤、依恋、关系安全、咨询支持和身体恢复。

边界说明：本主题只做阅读路径，不替代专业医疗、心理咨询或危机干预。

#### 20. 面对丧失、哀伤与死亡

阅读路径： 《最好的告别》 → 《当呼吸化为空气》 → 《活出生命的意义》 → 《相约星期二》 → 《生死课》 → 《也许你该找个人聊聊》

梯度说明：保持 6 本。这个主题需要清晰、克制和可承受，不宜扩成死亡哲学大全。

#### 21. 成瘾与自我控制

阅读路径： 《多巴胺国度》 → 《欲罢不能》 → 《自控力》 → 《稀缺》 → 《习惯的力量》 → 《上瘾》 → 《福格行为模型》

梯度说明：先看奖励回路与行为成瘾，再补上自控、稀缺带宽、习惯回路和行为设计。

边界说明：本主题只做阅读路径，不替代成瘾治疗或医学干预。

#### 22. 如何在痛苦中重建意义

阅读路径： 《活出生命的意义》 → 《当下的力量》 → 《人生的智慧》 → 《反脆弱》 → 《悉达多》 → 《最小阻力之路》 → 《沉思录》

梯度说明：从苦难意义、当下经验和人生智慧入门，再进入不确定中的反脆弱、精神追寻、创造张力和斯多葛练习。

### 4. 关系、沟通与家庭教育

**二级组：亲密关系 / 关系冲突 / 沟通表达 / 亲子与家庭 / 教育与成长**

#### 23. 亲密关系阅读路径

阅读路径： 《亲密关系》 → 《依恋》 → 《幸福的婚姻》 → 《抱紧我》 → 《爱的艺术》 → 《沟通的本质》 → 《非暴力沟通》 → 《身体从未忘记》

梯度说明：先建立关系总览和依恋框架，再看婚姻研究、情绪循环、爱的哲学、沟通技术和创伤影响。操纵式恋爱技巧不进入核心列表。

#### 24. 如何处理亲密关系中的冲突

阅读路径： 《亲密关系》 → 《依恋》 → 《幸福的婚姻》 → 《抱紧我》 → 《非暴力沟通》 → 《高难度谈话》 → 《关键对话》

梯度说明：先看冲突为什么反复出现，再处理依恋需求、修复尝试、情绪聚焦、非暴力表达和高风险对话。

#### 25. 如何识别有毒关系

阅读路径： 《亲密关系》 → 《依恋》 → 《煤气灯效应》 → 《情绪勒索》 → 《身体从未忘记》 → 《不原谅也没关系》 → 《高难度谈话》

梯度说明：从正常关系机制进入，再识别操控、勒索、创伤反应、边界和退出沟通。

边界说明：如存在暴力、胁迫或安全风险，应优先寻求现实支持和专业帮助。

#### 26. 如何提升沟通与表达

阅读路径： 《沟通的本质》 → 《非暴力沟通》 → 《关键对话》 → 《高难度谈话》 → 《金字塔原理》 → 《演讲的力量》 → 《说服》

梯度说明：先理解人际沟通，再进入情绪表达、关键对话、结构化表达、演讲和说服。

#### 27. 如何做足够好的父母

阅读路径： 《园丁与木匠》 → 《正面管教》 → 《游戏力》 → 《如何说孩子才会听，怎么听孩子才肯说》 → 《孩子，把你的手给我》 → 《读懂孩子的心》 → 《孩子：挑战》

梯度说明：先校正父母角色，再进入纪律、游戏、倾听、尊重、发展心理和家庭互动。

#### 28. 如何陪孩子建立安全感

阅读路径： 《依恋》 → 《给孩子一生的安全感》 → 《童年的秘密》 → 《完整的成长》 → 《孩子：挑战》 → 《最温柔的教养》

梯度说明：保持 6 本。主题聚焦安全感和发展环境，不扩展到完整教育哲学。

#### 29. 如何理解青春期

阅读路径： 《解码青春期》 → 《与青春期和解》 → 《养育男孩》 → 《养育女孩》 → 《孩子，把你的手给我》 → 《沟通的本质》

梯度说明：先理解青春期变化和亲子冲突，再补充性别经验、倾听和沟通。

#### 30. 如何理解教育与成长

阅读路径： 《爱弥儿》 → 《民主主义与教育》 → 《童年的秘密》 → 《园丁与木匠》 → 《终身幼儿园》 → 《认知天性》 → 《朗读手册》 → 《打造儿童阅读环境》

梯度说明：从教育哲学和儿童观进入，再到创造性学习、学习科学和家庭阅读环境。

### 5. 职业、管理与组织

**二级组：职业资本 / 管理与领导 / 团队协作 / 组织系统与权力 / 组织变革**

#### 31. 职业选择阅读路径

阅读路径： 《远见》 → 《职业锚》 → 《你的降落伞是什么颜色》 → 《优秀到不能被忽视》 → 《一人企业》 → 《每周工作4小时》 → 《原则》

梯度说明：先理解职业周期、动机锚和求职探索，再看能力资本、独立工作、生活设计和个人原则。

#### 32. 如何建立长期职业资本

阅读路径： 《优秀到不能被忽视》 → 《刻意练习》 → 《深度工作》 → 《远见》 → 《精要主义》 → 《原则》 → 《一人企业》 → 《10倍比两倍更容易》

梯度说明：从不要追逐激情开始，进入技能训练、专注产出、长期选择、取舍、原则、独立价值和高杠杆目标。

#### 33. 如何成为有效管理者

阅读路径： 《卓有成效的管理者》 → 《管理的实践》 → 《经理人员的职能》 → 《领导梯队》 → 《可复制的领导力》 → 《高绩效教练》 → 《关键对话》 → 《无畏的组织》

梯度说明：先建立管理者责任，再看组织职能、领导梯队、复制机制、教练、对话和心理安全。

#### 34. 如何建立领导力

阅读路径： 《领导梯队》 → 《高绩效教练》 → 《第五项修炼》 → 《原则》 → 《从优秀到卓越》 → 《赋能》 → 《重新定义公司》 → 《权力》

梯度说明：从角色跃迁和教练开始，再进入系统学习、原则、组织能力、授权、文化和权力现实。

#### 35. 如何做好团队协作

阅读路径： 《团队协作的五大障碍》 → 《关键对话》 → 《横向领导力》 → 《无畏的组织》 → 《赋能》 → 《重新定义团队》 → 《沟通的本质》

梯度说明：先看团队失效模式，再补上对话、无权影响、心理安全、授权和沟通基础。

#### 36. 如何处理职场沟通与冲突

阅读路径： 《关键对话》 → 《高难度谈话》 → 《非暴力沟通》 → 《谈判力》 → 《横向领导力》 → 《组织行为学》 → 《权力》

梯度说明：先处理关键场景，再进入情绪表达、谈判、横向影响、组织行为和权力结构。

#### 37. 看懂组织运转

阅读路径： 《组织行为学》 → 《走出危机》 → 《丰田之道》 → 《精益思维》 → 《科学管理原理》 → 《第五项修炼》 → 《原则》 → 《经理人员的职能》

梯度说明：从组织行为进入质量、生产系统、科学管理、学习型组织、经营原则和管理职能。

#### 38. 如何理解组织中的权力与政治

阅读路径： 《权力》 → 《权力与影响力》 → 《组织行为学》 → 《经理人员的职能》 → 《领导梯队》 → 《无畏的组织》 → 《人的境况》

梯度说明：先直面权力来源和影响策略，再回到组织行为、职位结构、心理安全和公共行动。

#### 39. 如何推动组织变革

阅读路径： 《变革之心》 → 《第五项修炼》 → 《创新者的窘境》 → 《从优秀到卓越》 → 《走出危机》 → 《重新定义公司》 → 《只有偏执狂才能生存》

梯度说明：先看变革动员，再看系统学习、创新困境、卓越组织、质量转型、文化重塑和战略拐点。

### 6. 商业、产品与创业

**二级组：产品机会 / 产品发现 / 产品组织 / 增长营销 / 战略经营 / 平台网络**

#### 40. 如何验证产品机会

阅读路径： 《妈妈测试》 → 《客户开发入门》 → 《四步创业法》 → 《精益创业》 → 《从零到一》 → 《商业模式新生代》 → 《跨越鸿沟》 → 《产品经理手册》

梯度说明：先学会问问题和理解客户，再进入客户开发、验证学习、独特命题、商业模式、早期市场和产品管理。

#### 41. 如何做好产品发现

阅读路径： 《启示录》 → 《用户故事地图》 → 《精益产品手册》 → 《俞军产品方法论》 → 《用户体验要素》 → 《设计心理学》 → 《设计冲刺》 → 《产品开发流程原理》

梯度说明：先理解现代产品发现，再组织用户任务、价值假设、体验层次、行为心理、冲刺验证和开发流动。

边界说明：本主题讲“做什么解法”，不讲增长成瘾或商业模式。

#### 42. 产品从 0 到 1

阅读路径： 《从零到一》 → 《精益创业》 → 《四步创业法》 → 《客户开发入门》 → 《妈妈测试》 → 《启示录》 → 《用户故事地图》 → 《产品开发流程原理》 → 《创业维艰》 → 《增长黑客》

梯度说明：先判断是否有独特命题，再用验证学习和客户开发确认需求，随后进入产品发现、需求组织、交付系统、创业管理和增长实验。

迁移说明：本主题用于替代已发布的 `从0到1做产品`，原标题不再作为独立规划主题保留。

#### 43. 如何建立产品组织与交付系统

阅读路径： 《启示录》 → 《产品开发流程原理》 → 《用户故事地图》 → 《精益思维》 → 《赋能》 → 《重新定义团队》 → 《领导梯队》 → 《无畏的组织》

梯度说明：从产品组织进入开发流动、需求地图、精益交付、授权、团队结构、领导梯队和心理安全。

#### 44. 如何理解设计与用户体验

阅读路径： 《设计心理学》 → 《用户体验要素》 → 《简约至上》 → 《点石成金》 → 《写给大家看的设计书》 → 《用户故事地图》 → 《启示录》

梯度说明：从认知心理和体验层次入门，再进入简化、可用性、视觉基础、用户任务和产品判断。

#### 45. 如何做增长与营销

阅读路径： 《定位》 → 《影响力》 → 《引爆点》 → 《跨越鸿沟》 → 《增长黑客》 → 《营销管理》 → 《病毒式循环》 → 《超级符号就是超级创意》

梯度说明：从定位、说服和传播扩散入门，再进入早期市场跨越、实验增长、营销体系、病毒循环和符号资产。

#### 46. 如何设计并验证商业模式

阅读路径： 《商业模式新生代》 → 《客户开发入门》 → 《精益创业》 → 《从零到一》 → 《创新者的窘境》 → 《好战略，坏战略》 → 《财务智慧》 → 《定价制胜》

梯度说明：从商业模式画布进入客户验证、独特命题、创新困境、战略取舍、财务语言和定价。

#### 47. 如何理解公司经营

阅读路径： 《创业维艰》 → 《财务智慧》 → 《竞争战略》 → 《从优秀到卓越》 → 《基业长青》 → 《原则》 → 《小米创业思考》 → 《MBA一日通》

梯度说明：从创业经营难题进入财务、竞争、组织卓越、长期基业、经营原则、案例和 MBA 综合框架。

#### 48. 如何理解商业竞争与战略

阅读路径： 《竞争战略》 → 《好战略，坏战略》 → 《创新者的窘境》 → 《定位》 → 《规模》 → 《只有偏执狂才能生存》 → 《商战》 → 《孙子兵法》 → 《跨越鸿沟》

梯度说明：从行业结构和战略质量入门，再看创新冲击、心智定位、规模规律、战略拐点、竞争叙事和市场跨越。

#### 49. 如何理解平台与网络效应

阅读路径： 《平台革命》 → 《从零到一》 → 《规模》 → 《引爆点》 → 《病毒式循环》 → 《Facebook效应》 → 《监视资本主义时代》

梯度说明：先理解平台结构、垄断与规模，再看扩散、病毒循环、社交网络案例和平台资本主义风险。

### 7. 金钱、投资与经济

**二级组：财务常识 / 长期投资 / 价值投资 / 交易与周期 / 经济运行 / 消费社会 / 阶层机会**

#### 50. 建立财务常识

阅读路径： 《小狗钱钱》 → 《巴比伦最富有的人》 → 《富爸爸穷爸爸》 → 《邻家的百万富翁》 → 《金钱心理学》 → 《财富自由之路》 → 《一本书读懂财报》

梯度说明：先建立收入、储蓄和资产意识，再进入家庭财富、金钱行为、长期计划和财务报表。

边界说明：本领域只做阅读路径，不构成投资建议。

#### 51. 普通人如何长期投资

阅读路径： 《共同基金常识》 → 《聪明的投资者》 → 《金钱心理学》 → 《投资最重要的事》 → 《周期》 → 《巴菲特致股东的信》 → 《穷查理宝典》

梯度说明：从低成本长期投资入门，再理解安全边际、行为偏差、风险、周期、企业长期主义和多元思维。

边界说明：本领域只做阅读路径，不构成投资建议。

#### 52. 如何理解价值投资

阅读路径： 《聪明的投资者》 → 《证券分析》 → 《巴菲特致股东的信》 → 《穷查理宝典》 → 《怎样选择成长股》 → 《成功投资》 → 《投资最重要的事》 → 《安全边际》 → 《价值投资：从格雷厄姆到巴菲特》

梯度说明：从格雷厄姆体系进入企业分析、长期复利、能力圈、成长股、风险控制和价值投资谱系。

边界说明：本领域只做阅读路径，不构成投资建议。

#### 53. 如何理解交易、周期与市场风险

阅读路径： 《股票大作手回忆录》 → 《以交易为生》 → 《金融怪杰》 → 《海龟交易法则》 → 《自律的交易者》 → 《金融炼金术》 → 《债务危机》 → 《周期》

梯度说明：先看交易经验和交易系统，再进入交易心理、反身性、债务周期和市场周期。

边界说明：本领域只做阅读路径，不构成投资建议。

#### 54. 如何理解经济运行

阅读路径： 《小岛经济学》 → 《像经济学家一样思考》 → 《经济学原理》 → 《置身事内》 → 《贫穷的本质》 → 《国富论》 → 《政治经济学及赋税原理》 → 《就业、利息和货币通论》 → 《债：第一个5000年》

梯度说明：先用通俗经济学建立直觉，再进入微观、宏观、中国地方政府、发展经济学、古典政治经济学、凯恩斯和债务。

#### 55. 如何理解行为经济学与金钱心理

阅读路径： 《助推》 → 《怪诞行为学》 → 《思考，快与慢》 → 《稀缺》 → 《金钱心理学》 → 《错误的行为》 → 《影响力》

梯度说明：从选择架构和非理性行为入门，再进入双系统、稀缺带宽、金钱叙事、行为经济学史和说服机制。

#### 56. 看懂消费主义

阅读路径： 《有闲阶级论》 → 《工作、消费主义和新穷人》 → 《娱乐至死》 → 《消费社会》 → 《债：第一个5000年》 → 《注意力商人》

梯度说明：从炫耀消费和工作伦理进入媒体娱乐、符号消费、债务和注意力商业。

#### 57. 如何理解财富、阶层与机会

阅读路径： 《邻家的百万富翁》 → 《贫穷的本质》 → 《稀缺》 → 《资本论》 → 《21世纪资本论》 → 《社会学的想象力》 → 《置身事内》

梯度说明：先看家庭财富和贫困机制，再进入稀缺心理、资本结构、长期不平等、社会学视角和中国制度环境。

### 8. 社会、法律与公共生活

**二级组：社会制度 / 公平正义 / 法律常识 / 媒体公共讨论 / 城市空间 / 性别结构**

#### 58. 社会分层与共同生活

阅读路径： 《乡土中国》 → 《社会学的想象力》 → 《社会分工论》 → 《贫穷的本质》 → 《社会共通资本》 → 《城市的胜利》 → 《厌女》 → 《置身事内》

梯度说明：从中国基层社会和社会学想象入门，再看分工、贫困、公共资本、城市、性别结构和制度运行。

#### 59. 如何理解公平与正义

阅读路径： 《公正》 → 《洞穴奇案》 → 《正义之心》 → 《正义论》 → 《论人类不平等的起源和基础》 → 《通往奴役之路》 → 《开放社会及其敌人》

梯度说明：从公共哲学入门，再进入法律两难、道德心理、自由平等、不平等起源、市场自由和开放社会。

#### 60. 如何识别制度与权力

阅读路径： 《权力》 → 《旧制度与大革命》 → 《权力与繁荣》 → 《国家为什么会失败》 → 《通往奴役之路》 → 《法治及其本土资源》 → 《看得见的正义》 → 《人的境况》

梯度说明：先看权力机制，再进入制度转型、国家能力、法治传统、司法公共性和行动空间。

#### 61. 如何建立法律常识

阅读路径： 《学点法律避点坑》 → 《洞穴奇案》 → 《看得见的正义》 → 《刑法学讲义》 → 《民法典与日常生活》 → 《法治及其本土资源》

梯度说明：保持 6 本。先解决日常法律意识，再进入法理、司法、刑法、民法和本土法治。

边界说明：本主题只做阅读路径，不构成法律建议。

#### 62. 如何理解媒体、舆论与公共讨论

阅读路径： 《初识传播学》 → 《理解媒介》 → 《娱乐至死》 → 《注意力商人》 → 《乌合之众》 → 《事实》 → 《学会提问》 → 《过滤泡》

梯度说明：先进入传播学和媒介理论，再看娱乐化、注意力商业、群体舆论、事实判断、批判提问和信息茧房。

#### 63. 城市、空间与生活方式

阅读路径： 《美国大城市的死与生》 → 《城市的胜利》 → 《社会共通资本》 → 《乡土中国》 → 《工作、消费主义和新穷人》 → 《有闲阶级论》

梯度说明：保持 6 本。城市主题从街区和城市经济入门，再连接公共资本、乡土结构、工作消费和阶层展示。

#### 64. 如何理解性别与社会结构

阅读路径： 《厌女》 → 《第二性》 → 《看不见的女性》 → 《性别打结》 → 《亲密关系》 → 《社会学的想象力》

梯度说明：保持 6 本。先看性别秩序，再进入女性处境、数据偏见、结构机制、亲密关系和社会学视角。

### 9. 历史、文明与世界格局

**二级组：中国历史 / 世界历史 / 文明兴衰 / 国际秩序**

#### 65. 中国社会的现代转型

阅读路径： 《乡土中国》 → 《中国历代政治得失》 → 《万历十五年》 → 《中国近代史》 → 《叫魂》 → 《枢纽》 → 《置身事内》 → 《旧制度与大革命》

梯度说明：从乡土社会和制度传统进入，再看明代政治、近代转型、基层恐慌、历史枢纽、当代治理和比较革命。

#### 66. 中国历史入门

阅读路径： 《中国通史》 → 《中国历代政治得失》 → 《万历十五年》 → 《叫魂》 → 《中国近代史》 → 《枢纽》 → 《曾国藩传》

梯度说明：先建立通史骨架，再看政治制度、明代切片、清代社会、近代变局、历史转折和人物传记。

#### 67. 如何理解世界历史

阅读路径： 《全球通史》 → 《人类简史》 → 《枪炮、病菌与钢铁》 → 《丝绸之路》 → 《大国的兴衰》 → 《世界秩序》 → 《未来简史》 → 《今日简史》

梯度说明：从通史和人类叙事入门，再看地理、贸易网络、国家兴衰、国际秩序和现代风险。

#### 68. 如何理解文明兴衰

阅读路径： 《枪炮、病菌与钢铁》 → 《大国的兴衰》 → 《文明的冲突》 → 《国家为什么会失败》 → 《世界秩序》 → 《人类简史》 → 《开放社会及其敌人》 → 《增长的极限》

梯度说明：从地理和经济力量入门，再看文化冲突、制度质量、国际秩序、人类叙事、开放社会和增长边界。

### 10. 科技、AI 与媒介环境

**二级组：技术社会 / AI 变革 / 平台算法 / 注意力风险 / 数字公共生活**

#### 69. 技术社会读什么

阅读路径： 《技术的本质》 → 《必然》 → 《失控》 → 《理解媒介》 → 《娱乐至死》 → 《监视资本主义时代》 → 《平台革命》 → 《未来呼啸而来》

梯度说明：先理解技术演化，再看网络社会、媒介环境、娱乐化、监控资本主义、平台结构和未来趋势。

#### 70. AI 技术变革读什么

阅读路径： 《AI 2041》 → 《生命3.0》 → 《对齐问题》 → 《智人之上》 → 《未来呼啸而来》 → 《必然》 → 《技术的本质》

梯度说明：先从场景化未来进入，再看智能生命、对齐、安全、产业趋势和技术演化。

边界说明：本主题只讲技术范式和产业变化；治理与公共风险放在下一主题。

#### 71. 看懂平台、算法与注意力风险

阅读路径： 《娱乐至死》 → 《注意力商人》 → 《过滤泡》 → 《监视资本主义时代》 → 《算法霸权》 → 《平台革命》 → 《理解媒介》 → 《开放社会及其敌人》

梯度说明：从媒介和注意力商业入门，再看信息茧房、监控、算法歧视、平台治理和开放社会风险。

边界说明：本主题聚焦监控、算法偏见、治理和公共风险，不重复讲 AI 技术趋势。

### 11. 文学、人文与人生哲学

**二级组：文学阅读 / 艺术审美 / 幸福哲学 / 人生哲学**

#### 72. 文学与人文阅读入门

阅读路径： 《如何阅读一本小说》 → 《小说面面观》 → 《文学理论入门》 → 《文学回忆录》 → 《文学的故事》 → 《文学讲稿》 → 《艺术的故事》

梯度说明：先学会阅读小说，再进入叙事形式、文学理论、文学史、讲稿和艺术史。

#### 73. 如何理解幸福

阅读路径： 《幸福的方法》 → 《真实的幸福》 → 《心流》 → 《亲密关系》 → 《被讨厌的勇气》 → 《人生的智慧》 → 《尼各马可伦理学》

梯度说明：从积极心理学进入沉浸体验、关系、自我接纳、人生智慧和德性伦理。

#### 74. 人生哲学入门

阅读路径： 《苏菲的世界》 → 《人生的智慧》 → 《沉思录》 → 《论语》 → 《道德经》 → 《尼各马可伦理学》 → 《悉达多》 → 《人的境况》

梯度说明：先用哲学故事进入，再看人生智慧、斯多葛、儒道、德性伦理、精神追寻和行动空间。

### 12. 健康、身体与可持续生活

**二级组：健康生活 / 压力恢复 / 运动体能 / 饮食代谢 / 衰老疾病 / 环境气候**

#### 75. 如何建立健康生活方式

阅读路径： 《掌控习惯》 → 《我们为什么要睡觉》 → 《运动改造大脑》 → 《身体使用手册》 → 《ACSM健身与健康完全指南》 → 《精力管理》 → 《超越百岁》 → 《身体从未忘记》

梯度说明：先从习惯、睡眠和运动入门，再补上身体使用、训练指南、能量管理、长寿和压力创伤。

边界说明：本主题只做阅读路径，不替代医疗、营养或运动处方。

#### 76. 如何理解压力、恢复与身体信号

阅读路径： 《身体从未忘记》 → 《我们为什么要睡觉》 → 《运动改造大脑》 → 《身体使用手册》 → 《精力管理》 → 《超越百岁》 → 《多巴胺国度》 → 《幸福的陷阱》

梯度说明：从创伤和压力身体化进入，再看睡眠、运动、身体使用、能量、长寿、奖励系统和接纳。

边界说明：本主题只做阅读路径，不替代医疗、营养或运动处方。

#### 77. 如何理解运动与体能

阅读路径： 《无器械健身》 → 《ACSM健身与健康完全指南》 → 《身体使用手册》 → 《施瓦辛格健身全书》 → 《耐力》 → 《ACSM高级运动生理学》 → 《生理学》

梯度说明：从可执行训练入门，再进入健康指南、动作与康复、力量训练、耐力、生理学和高级运动机制。

边界说明：本主题只做阅读路径，不替代医疗、营养或运动处方。

#### 78. 如何理解饮食与代谢

阅读路径： 《营养学：概念与争论》 → 《我们为什么会生病》 → 《肥胖代码》 → 《深度营养》 → 《超越百岁》 → 《生理学》

梯度说明：保持 6 本，且必须在入库前复核证据质量。营养主题争议大，不宜用单一畅销书建立结论。

边界说明：本主题只做阅读路径，不替代医疗、营养或运动处方。

#### 79. 面对衰老、疾病与照护

阅读路径： 《超越百岁》 → 《最好的告别》 → 《当呼吸化为空气》 → 《我们为什么要睡觉》 → 《运动改造大脑》 → 《活出生命的意义》 → 《生死课》

梯度说明：从长寿医学进入照护、疾病经验、睡眠运动、意义支撑和临终沟通。

边界说明：本主题只做阅读路径，不替代医疗建议或临终照护决策。

#### 80. 如何理解环境、气候与可持续生活

阅读路径： 《寂静的春天》 → 《增长的极限》 → 《小即是美》 → 《失控的农业》 → 《气候经济与人类未来》 → 《社会共通资本》 → 《枪炮、病菌与钢铁》

梯度说明：从环境危机和增长边界入门，再看适度经济、农业系统、气候经济、公共资本和地理文明约束。

## Deleted, Merged, Or Renamed From V5

| V5 Topic | V8 Treatment | Reason |
|---|---|---|
| `识别伪科学与坏证据` | Merge into `如何建立批判性与证据判断` | The book list heavily overlapped with critical thinking and evidence evaluation. |
| `怎样判断证据是否可靠` | Merge into `如何建立批判性与证据判断` | The evidence path is stronger as one 10-book system list. |
| `如何建立科学思维` | Rename to `如何建立科学世界观` | Separates philosophy/history of science from evidence hygiene. |
| `阅读与输出系统` | Rename to `阅读、笔记与输出系统` | Makes the knowledge-management layer explicit. |
| `如何打造家庭学习环境` | Merge into `如何理解教育与成长` | Family reading is better as the practical end of the education path. |
| `现代国家与官僚体系` | Merge into `如何识别制度与权力` and `中国社会的现代转型` | Avoids a thin separate page and keeps state capacity in context. |
| `技术社会的伦理风险` | Rename to `看懂平台、算法与注意力风险` | Narrows the topic to the actual reader problem and avoids duplicating AI trend books. |
| `如何提升表达与演讲` | Merge into `如何提升沟通与表达` | Speech, persuasion, and structured communication share one reader path. |
| `面对衰老` | Merge into `面对衰老、疾病与照护` | Aging is too narrow unless connected to illness, care, and mortality. |

## Future Implementation Plan

### Task 1: Review and Lock One Batch

**Files:**

- Read: `docs/superpowers/plans/2026-06-01-topic-reading-panorama.md`
- Create: `docs/superpowers/plans/YYYY-MM-DD-topic-batch-N.md`

- [ ] Select one batch of 4-8 topics from this V8 panorama.
- [ ] For each selected topic, confirm whether it is new, replaces a published topic, renames a published topic, splits a published topic, or merges multiple published topics.
- [ ] Verify every selected topic has a final approved title and a final approved book list.
- [ ] Explain the learning gradient of every selected list in one sentence.
- [ ] Assign each repeated book a `core`, `extension`, or `bridge` role.
- [ ] Record review notes and migration decisions in a new batch implementation plan.

### Task 2: Prepare Books Before Topic Publication

**Files:**

- Read: `books/**/*.md`
- Create or update: `books/<分类>/<作者>-<书名>.md`
- Update: `book-scores.md`

- [ ] For every book in the approved batch, check whether a matching book already exists in `books/`.
- [ ] For every missing book, create a book extraction Markdown file using the project book naming and frontmatter rules.
- [ ] Update `book-scores.md` for every newly added or substantially revised book.
- [ ] Confirm every approved topic book has a final slug before creating topic Markdown.

### Task 3: Publish Approved Topic Articles

**Files:**

- Create or update: `topics/<slug>.md`
- Update: `.nextjs-site/tests/topics-content.test.mjs`

- [ ] Create one topic Markdown file per approved topic.
- [ ] Update, redirect, or remove superseded published topic files only when the batch plan explicitly says so.
- [ ] Use the existing topic frontmatter model.
- [ ] Set every recommendation to `status: in_library`.
- [ ] Include `slug` for every book recommendation.
- [ ] Write reader-facing guide copy that starts from the problem, not from the book database.
- [ ] Include a boundary note for medical, mental health, legal, and investment topics.
- [ ] Add the approved topic slug list to topic content tests.

### Task 4: Verify Static Site Behavior

**Commands:**

```bash
cd /Users/zcs/Notes/ai-reading/.nextjs-site && npm test
cd /Users/zcs/Notes/ai-reading/.nextjs-site && npm run build
```

**Browser checks:**

- `/topics/` shows the approved topic set after migration.
- Every topic detail page renders the guide body.
- Every recommended book has a working `阅读提炼` link.
- No topic page displays any non-library status label.
- `/sitemap.xml` includes all current topic URLs and excludes removed topic URLs.

### Task 5: Commit the Batch

**Commands:**

```bash
git status --short
git add books book-scores.md topics .nextjs-site/tests/topics-content.test.mjs
git commit -m "feat: update topic reading batch N"
```

Only stage and commit files created or modified by that implementation batch. Preserve unrelated user changes.

## Self-Review Checklist

- The plan records 80 topic candidates across 12 domains.
- The plan includes a domain coverage audit, not only a topic list.
- The plan includes a book-count audit showing that 6-book lists are intentionally compact rather than a default template.
- The 8 published topics are included in the same evaluation system and are not treated as immutable.
- The 8 published topics are marked as the first migration priority before adding more net-new public pages.
- The product topic is explicitly split into opportunity validation, product discovery, product 0-to-1, product organization, growth, strategy, and platform/network-effect themes.
- Topic book counts vary by problem complexity instead of forcing a fixed number.
- Every topic has a one-sentence learning-gradient note.
- Topic titles use mixed reader-centered forms instead of a uniform `如何...` template.
- The plan allows future batches to update, split, merge, rename, redirect, or remove published topic files through explicit migration decisions.
- The plan requires every future approved topic recommendation to use `status: in_library`.
- The plan requires all books in an approved topic to be present in the book library before topic publication.
- The plan merges overlapping V5 evidence/science topics instead of multiplying shallow pages.
