# Topic Reading Panorama V9 Review Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild topic reading into a full-site roadmap that starts from reader problems and learning depth, incorporates the 8 published topics, and gives future batches permission to keep, rename, split, merge, replace, or remove existing topic pages.

**Architecture:** This is a reviewable planning artifact, not a publish-ready batch. It defines the target taxonomy, topic-level reading paths, book-list depth rules, migration rules, and future batch workflow. Future implementation must first bring every recommended book into `books/`, then publish topic Markdown using only `status: in_library`.

**Tech Stack:** Markdown planning document in `docs/superpowers/plans/`; future implementation uses the existing `topics/*.md` model, Next.js static generation, and topic content validation tests.

---

## Review Status

This plan is not approved for implementation yet. It is the canonical V9 draft for later review.

V9 answers the user's review request directly:

1. **Book-list categories are reasonable after one consolidation pass.** The panorama keeps 12 first-level domains because the project needs separate browsing surfaces for thinking, personal work, psychology, relationships, career, business, money, public life, history, technology, humanities, and health. These are reader-problem domains, not bookstore shelves. A domain may be broad only when its second-level groups separate entry, framework, and system questions.
2. **Book lists are no longer normalized by appearance.** V9 uses intentionally uneven list sizes: compact paths use 5-6 books, standard paths use 7-8 books, and complex/system paths use 9-10 books. A topic with 6 books is allowed only when the reader problem is narrow. A broad topic with only 6 books is treated as underbuilt.
3. **Each domain has enough depth for a full-site roadmap.** Every domain includes at least one entry path, one framework path, and one system/critique path. This prevents the library from becoming either a light self-help shelf or an inaccessible classics list.
4. **The 8 published topics are inputs, not constraints.** Six are kept and deepened, one is renamed, and the product topic is replaced through a product ladder. Existing topic files may be removed later, but only in an explicit migration batch after replacement pages and required books are ready.

The final V9 panorama uses **12 domains and 73 topic candidates**. This is a full-site roadmap, not a publication batch. Future batches should select **4-8 topics** at a time.

## Key V9 Decisions

- Keep the 12-domain structure from V8, but make the taxonomy more operational: each domain now has an entry/framework/system distribution instead of only a topic count.
- Keep humanities separate from technology, history, and health. Literature, art, happiness, and philosophy answer interpretation and meaning questions, not trend-tracking questions.
- Keep health separate from happiness and life philosophy. Sleep, exercise, nutrition, stress, disease, care, and climate require evidence boundaries that should not be mixed with meaning-of-life reading.
- Split product work into a ladder: opportunity validation -> product discovery -> product 0-to-1 -> product organization and delivery -> growth and marketing -> business model and company operation -> strategy and platform effects.
- Merge overlapping evidence topics. Critical thinking, evidence reliability, statistics, and causality belong in one deep evidence path; philosophy/history of science remains a separate worldview path.
- Treat repeated books as deliberate bridges. A repeated book must have one default role: `core`, `bridge`, or `extension`; future batch plans may revise the role only with an explanation.
- Keep the current 8 published topics as first migration priority, but do not preserve old page titles or core lists when they no longer match the reader problem.

## Source Signals

The panorama uses external category signals only as calibration, then converts them into problem-driven reading paths.

- Coursera's official catalog separates Arts and Humanities, Business, Computer Science, Data Science, Health, Personal Development, and Social Sciences, supporting the split between technology, humanities, health, business, and public/social topics: <https://www.coursera.org/browse>
- edX's subject browsing separates tech, business and management, healthcare, education, humanities, world history, and social science, supporting a roadmap that is not dominated by one personal-growth bucket: <https://www.edx.org/learn>
- Five Books-style editorial browsing keeps history, philosophy, politics, economics, science, psychology, and literature separately browsable, which supports separating public life, history, humanities, science, and psychology: <https://fivebooks.com/categories/>
- AI/technology needs a current subdomain because recent general-reader books now distinguish practical AI collaboration, AI containment/governance, and information-network history. Reference signals include Ethan Mollick's *Co-Intelligence*, Mustafa Suleyman's *The Coming Wave*, and Yuval Noah Harari's *Nexus*: <https://www.penguinrandomhouse.com/books/741805/co-intelligence-by-ethan-mollick/>; <https://www.penguinrandomhouse.com/books/722674/the-coming-wave-by-mustafa-suleyman-with-michael-bhaskar/9780593593967/>; <https://www.penguinrandomhouse.com/books/762444/nexus-by-yuval-noah-harari/9798217077618/>

## Non-Negotiable Content Rules

- Topic titles must be reader-centered and problem-driven. Use mixed forms: `如何...`, `怎样...`, `为什么...`, `什么是...`, `看懂...`, or concise noun-style reading paths when that is more natural.
- Topic count per domain is not fixed. The taxonomy optimizes coverage and reader usefulness, not visual symmetry.
- Book count per topic is determined by problem complexity: 5-6 for compact topics, 7-8 for standard topics, and 9-10 for complex/system topics.
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

| Topic Type | Normal Size | When To Split |
|---|---:|---|
| Compact problem | 5-6 books | If the list needs more than two frameworks. |
| Standard learning path | 7-8 books | If two different reader goals are mixed. |
| Complex/system topic | 9-10 books | If the list exceeds 10 or has two independent disciplines. |

V9 length audit:

| Book Count | Number Of Topics | Interpretation |
|---:|---:|---|
| 6 | 15 | Narrow practical or boundary-sensitive topics. |
| 7 | 26 | Normal single-problem paths. |
| 8 | 25 | Standard system paths with adjacent-domain coverage. |
| 9 | 3 | Deeper interdisciplinary paths. |
| 10 | 4 | Full system paths: major decision-making, evidence judgment, deep work, and product 0-to-1. |

## Domain Depth Standard

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
| 科技、AI 与媒介环境 | Technology society, practical AI, AI transformation, algorithmic risk, platform power, attention economy, digital public life. |
| 文学、人文与人生哲学 | Literature, art, philosophy, happiness, life wisdom, meaning, interpretive reading. |
| 健康、身体与可持续生活 | Sleep, exercise, nutrition, stress, aging, disease, care, environment, sustainable life. |

## Domain Coverage Audit

| Domain | Topic Count | Entry / Framework / System Split | V9 Verdict |
|---|---:|---|---|
| 思维、判断与科学 | 6 | 1 / 3 / 2 | Strong. Decision, evidence, systems, risk, science, and group influence are separated. |
| 自我管理、学习与创造 | 6 | 2 / 3 / 1 | Strong. Practical enough for entry, with writing/creation as output depth. |
| 心理、情绪与修复 | 7 | 2 / 3 / 2 | Keep with boundary. Avoid presenting reading as treatment. |
| 关系、沟通与家庭教育 | 6 | 2 / 3 / 1 | Strong after removing manipulative dating from the core path. |
| 职业、管理与组织 | 6 | 1 / 3 / 2 | Strong. Covers individual career capital and organizational reality. |
| 商业、产品与创业 | 7 | 1 / 4 / 2 | Strongest ladder. Publish carefully to avoid overlapping product pages. |
| 金钱、投资与经济 | 7 | 1 / 3 / 3 | Strong with investment boundary notes. |
| 社会、法律与公共生活 | 7 | 2 / 3 / 2 | Strong after history and technology are split away. |
| 历史、文明与世界格局 | 5 | 2 / 2 / 1 | Compact but coherent. Do not add more until books are ready. |
| 科技、AI 与媒介环境 | 5 | 1 / 2 / 2 | Compact and current. Keep practical AI separate from governance risk. |
| 文学、人文与人生哲学 | 5 | 2 / 2 / 1 | Coherent. Gives meaning and interpretation their own surface. |
| 健康、身体与可持续生活 | 6 | 2 / 2 / 2 | Coherent with medical and nutrition boundaries. |

## Published Topic Reconstruction Matrix

| Current File | Current Topic | V9 Decision | Target Placement | Migration Direction |
|---|---|---|---|---|
| `topics/zhong-da-jue-ce.md` | `如何做重大决策` | Keep and deepen | 思维、判断与科学 | Keep as first-batch topic. Reorder from decision process to bias/noise, prediction, execution checks, system consequences, and uncertainty exposure. |
| `topics/xi-tong-yu-fu-za-xing.md` | `如何理解系统与复杂性` | Keep, rename, and narrow | 思维、判断与科学 | Rename toward `什么是系统思维与复杂性`. Move pure uncertainty books to risk topic. |
| `topics/ke-chi-xu-xi-guan.md` | `如何建立可持续习惯` | Keep and tighten | 自我管理、学习与创造 | Keep as first-batch topic. Center on behavior design, environment, motivation, self-control, and action friction. |
| `topics/pian-jian-yu-qun-ti-ying-xiang.md` | `如何识别偏见与群体影响` | Rename and deepen | 思维、判断与科学 | Replace with `为什么人会偏见、从众与服从`. Keep social psychology; keep structural inequality in social topics. |
| `topics/cong-0-dao-1-zuo-chan-pin.md` | `从0到1做产品` | Replace through split | 商业、产品与创业 | Do not keep old title as an independent planning topic. Use `如何验证产品机会`, `如何做好产品发现`, and `产品从 0 到 1`; the last one replaces the published page. |
| `topics/li-jie-qin-mi-guan-xi.md` | `如何理解亲密关系` | Keep and improve | 关系、沟通与家庭教育 | Rename display title to `亲密关系阅读路径` if needed. Remove manipulative dating books from core. |
| `topics/chuang-shang-yu-zi-wo-xiu-fu.md` | `如何面对创伤与自我修复` | Keep with strict boundary | 心理、情绪与修复 | Keep as first-batch topic. Remove decision books from core; focus on trauma, body memory, attachment, safety, and recovery support. |
| `topics/ti-gao-shen-du-gong-zuo-neng-li.md` | `如何提高深度工作能力` | Keep and broaden | 自我管理、学习与创造 | Keep as first-batch topic. Add cognitive load, task systems, deliberate practice, recovery, and attention environment. |

## First Migration Priority

The first implementation batch should handle the 8 published topics before adding more net-new public pages.

- Replace the published `从0到1做产品` page with `产品从 0 到 1`.
- Rename or replace `如何识别偏见与群体影响` with `为什么人会偏见、从众与服从`.
- Update `如何做重大决策`, `什么是系统思维与复杂性`, `如何建立可持续习惯`, `亲密关系阅读路径`, `如何面对创伤与自我修复`, and `如何提高深度工作能力` to match this plan's book paths.
- Do not retain old core books that this matrix has moved to bridge or extension roles.
- Do not delete or redirect an existing topic until its replacement topic has all books present in `books/` and passes topic validation.

## Published Topic Book-List Audit

| Published Topic | Keep Core | Move Out Of Core | Add Or Promote | Reason |
|---|---|---|---|---|
| `如何做重大决策` | 《怎样决定大事》, 《决断力》, 《思考，快与慢》, 《噪声》, 《超级预测》, 《对赌》, 《助推》, 《清单革命》, 《系统之美》, 《反脆弱》 | None | Promote planned books before publishing revised page. | The path should run from process to bias/noise, probability updating, execution checks, system consequences, and uncertainty exposure. |
| `如何理解系统与复杂性` | 《系统之美》, 《控制论与科学方法论》, 《第五项修炼》, 《复杂》, 《规模》, 《混沌》, 《复杂经济学》, 《弹性》 | 《黑天鹅》 becomes risk bridge; 《思维模型》 becomes science-worldview bridge. | Promote 《第五项修炼》, 《复杂》, 《规模》. | The topic should be about feedback, emergence, scale, adaptation, and resilience. |
| `如何建立可持续习惯` | 《掌控习惯》, 《习惯的力量》, 《微习惯》, 《福格行为模型》, 《拖延心理学》, 《自控力》, 《驱动力》, 《精要主义》 | 《认知觉醒》 becomes learning/output bridge. | Promote 《自控力》 and 《驱动力》. | The path needs behavior design, action friction, self-control, motivation, and goal pruning. |
| `如何识别偏见与群体影响` | 《社会心理学》, 《偏见的本质》, 《社会性动物》, 《社会认知心理学》, 《影响力》, 《服从权威》, 《路西法效应》, 《盲点》 | 《乌合之众》 becomes critical historical bridge, not core framework. | Rename topic and promote 《服从权威》, 《盲点》. | The reader problem is why ordinary people become biased, compliant, and socially pressured. |
| `从0到1做产品` | 《从零到一》, 《精益创业》, 《四步创业法》, 《客户开发入门》, 《妈妈测试》, 《启示录》, 《用户故事地图》, 《产品开发流程原理》, 《创业维艰》, 《增长黑客》 | 《上瘾》 moves to growth/behavior bridge; 《俞军产品方法论》 moves to product discovery core. | Add 《妈妈测试》, 《启示录》, 《用户故事地图》, 《创业维艰》. | Replace the page through a ladder rather than one overloaded product shelf. |
| `如何理解亲密关系` | 《亲密关系》, 《依恋》, 《幸福的婚姻》, 《抱紧我》, 《爱的艺术》, 《沟通的本质》, 《非暴力沟通》, 《身体从未忘记》 | 《如何让你爱的人爱上你》 removed from core; 《被讨厌的勇气》 moves to self-worth bridge. | Promote 《幸福的婚姻》, 《抱紧我》, 《爱的艺术》, 《非暴力沟通》. | The core should explain attachment, marriage research, emotional cycles, communication, love, and trauma impact. |
| `如何面对创伤与自我修复` | 《身体从未忘记》, 《创伤与复原》, 《唤醒老虎》, 《不原谅也没关系》, 《依恋》, 《抱紧我》, 《也许你该找个人聊聊》, 《我们为什么要睡觉》, 《运动改造大脑》 | 《怎样决定大事》 removed; 《亲密关系》 becomes relationship bridge; 《被讨厌的勇气》 becomes self-worth bridge. | Promote trauma-specific books before revised publication. | The path must stay within trauma, body memory, attachment safety, relationship repair, and recovery support. |
| `如何提高深度工作能力` | 《深度工作》, 《心流》, 《刻意练习》, 《搞定》, 《精要主义》, 《拖延心理学》, 《稀缺》, 《找回专注力》, 《慢生产力》, 《掌控习惯》 | 《认知觉醒》 becomes learning/output bridge. | Promote 《搞定》, 《找回专注力》, 《慢生产力》. | The path should cover attention quality, skill growth, task systems, bandwidth, action resistance, environment, and sustainable output. |

## High-Frequency Book Role Table

| Book | Core Topic | Other Usage |
|---|---|---|
| 《思考，快与慢》 | 如何做重大决策 | bias、行为经济学、证据判断中作为 bridge |
| 《噪声》 | 如何做重大决策 | 预测、证据判断中作为 bridge |
| 《反脆弱》 | 如何理解概率、风险与预测 | 痛苦意义、投资风险、系统复杂性中作为 bridge |
| 《系统之美》 | 什么是系统思维与复杂性 | 重大决策、组织系统、环境主题中作为 bridge |
| 《深度工作》 | 如何提高深度工作能力 | 长期职业资本、长期学习中作为 bridge |
| 《掌控习惯》 | 如何建立可持续习惯 | 健康生活、长期学习中作为 bridge |
| 《亲密关系》 | 亲密关系阅读路径 | 有毒关系、幸福主题中作为 bridge |
| 《依恋》 | 亲密关系阅读路径 | 创伤修复、儿童安全感中作为 bridge |
| 《身体从未忘记》 | 如何面对创伤与自我修复 | 压力恢复、有毒关系中作为 bridge |
| 《影响力》 | 如何做增长与营销 | 偏见、谈判、行为经济学中作为 bridge |
| 《学会提问》 | 如何建立批判性与证据判断 | 媒体公共讨论、阅读输出中作为 bridge |
| 《稀缺》 | 如何理解财富、阶层与机会 | 自控、行为经济学、深度工作中作为 bridge |
| 《从零到一》 | 产品从 0 到 1 | 商业模式、平台效应中作为 bridge |
| 《精益创业》 | 如何验证产品机会 | 产品 0-to-1、商业模式中作为 bridge |
| 《我们为什么要睡觉》 | 如何建立健康生活方式 | 情绪、创伤恢复、衰老主题中作为 bridge |

## Panorama

### 1. 思维、判断与科学

**二级组：决策与防错 / 系统与复杂性 / 证据与科学 / 概率与风险 / 群体影响**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 框架 | 如何做重大决策 | 《怎样决定大事》 -> 《决断力》 -> 《思考，快与慢》 -> 《噪声》 -> 《超级预测》 -> 《对赌》 -> 《助推》 -> 《清单革命》 -> 《系统之美》 -> 《反脆弱》 | 先建立重大选择流程，再校准偏差和噪声，随后处理概率更新、复盘、选择架构、执行防错，最后进入系统反馈和不确定暴露。 |
| 框架 | 什么是系统思维与复杂性 | 《系统之美》 -> 《控制论与科学方法论》 -> 《第五项修炼》 -> 《复杂》 -> 《规模》 -> 《混沌》 -> 《复杂经济学》 -> 《弹性》 | 从反馈、控制和组织学习进入，再理解涌现、尺度、非线性和复杂经济系统，最后回到适应力。 |
| 系统 | 如何建立批判性与证据判断 | 《学会提问》 -> 《批判性思维工具》 -> 《超越感觉》 -> 《事实》 -> 《赤裸裸的统计学》 -> 《女士品茶》 -> 《为什么》 -> 《因果推断》 -> 《这才是心理学》 -> 《噪声》 | 从提问和论证入门，进入统计、实验、因果和心理学证据，再用噪声视角检查专家判断。 |
| 框架 | 为什么人会偏见、从众与服从 | 《社会心理学》 -> 《偏见的本质》 -> 《社会性动物》 -> 《社会认知心理学》 -> 《影响力》 -> 《服从权威》 -> 《路西法效应》 -> 《盲点》 | 从社会心理学主干进入分类、归因、说服、权威、角色和隐性偏见。 |
| 系统 | 如何理解概率、风险与预测 | 《随机漫步的傻瓜》 -> 《超级预测》 -> 《噪声》 -> 《黑天鹅》 -> 《风险、不确定性与利润》 -> 《反脆弱》 -> 《对赌》 -> 《投资最重要的事》 | 先区分运气、概率和可校准预测，再理解噪声、极端事件和不可测不确定性，最后进入暴露面和投资风险。 |
| 入门 | 如何建立科学世界观 | 《别逗了费曼先生》 -> 《世界观》 -> 《科学革命的结构》 -> 《无穷的开始》 -> 《这才是心理学》 -> 《技术的本质》 | 先用科学家故事进入科学精神，再理解范式、解释、证据差异和技术演化。 |

### 2. 自我管理、学习与创造

**二级组：习惯与行动 / 注意力与深度工作 / 学习与输出 / 写作与创造**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 如何建立可持续习惯 | 《掌控习惯》 -> 《习惯的力量》 -> 《微习惯》 -> 《福格行为模型》 -> 《拖延心理学》 -> 《自控力》 -> 《驱动力》 -> 《精要主义》 | 从身份和习惯回路入门，再降低启动门槛，处理行为设计、拖延、意志力、内在动机和目标取舍。 |
| 框架 | 如何提高深度工作能力 | 《深度工作》 -> 《心流》 -> 《刻意练习》 -> 《搞定》 -> 《精要主义》 -> 《拖延心理学》 -> 《稀缺》 -> 《找回专注力》 -> 《慢生产力》 -> 《掌控习惯》 | 先理解高质量注意力，再补上技能训练、任务系统、取舍、阻力、认知带宽、注意力环境和可持续产出。 |
| 框架 | 如何管理时间、精力与个人系统 | 《精力管理》 -> 《搞定》 -> 《精要主义》 -> 《高效能人士的七个习惯》 -> 《慢生产力》 -> 《复盘》 -> 《原则》 | 从能量和任务系统入门，再进入价值取舍、个人原则、可持续节奏和复盘机制。 |
| 入门 | 如何长期坚持学习 | 《如何阅读一本书》 -> 《认知天性》 -> 《学习之道》 -> 《刻意练习》 -> 《心流》 -> 《掌控习惯》 -> 《终身成长》 -> 《深度工作》 | 先读懂书，再理解记忆、练习、反馈、心流、习惯、成长型思维和专注环境。 |
| 框架 | 阅读、笔记与输出系统 | 《如何阅读一本书》 -> 《卡片笔记写作法》 -> 《第二大脑》 -> 《金字塔原理》 -> 《学会提问》 -> 《风格感觉》 -> 《写作这回事》 -> 《复盘》 | 从读法进入笔记和知识管理，再把输入转成结构化表达、批判性提问、语言风格和复盘闭环。 |
| 系统 | 写作与创意工作 | 《写作这回事》 -> 《写作的战争》 -> 《字字珠玑》 -> 《风格感觉》 -> 《成为作家》 -> 《像艺术家一样思考》 -> 《最小阻力之路》 -> 《故事》 | 先处理写作习惯和阻力，再补上句子、风格、创作者心态、观察方式、结构张力和叙事表达。 |

### 3. 心理、情绪与修复

**二级组：情绪与内耗 / 自尊与自我 / 创伤与修复 / 成瘾与哀伤 / 意义重建**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 如何理解情绪 | 《蛤蟆先生去看心理医生》 -> 《情绪急救》 -> 《情绪是什么》 -> 《伯恩斯新情绪疗法》 -> 《幸福的陷阱》 -> 《身体从未忘记》 -> 《我们为什么要睡觉》 | 从通俗咨询故事进入情绪识别，再补上认知疗法、接纳承诺、身体反应和睡眠。 |
| 入门 | 理解焦虑与抑郁 | 《伯恩斯新情绪疗法》 -> 《幸福的陷阱》 -> 《也许你该找个人聊聊》 -> 《蛤蟆先生去看心理医生》 -> 《我们为什么要睡觉》 -> 《运动改造大脑》 | 先理解认知、回避和接纳，再看到咨询现场、睡眠、运动和日常支持。 |
| 框架 | 如何停止精神内耗 | 《也许你该找个人聊聊》 -> 《伯恩斯新情绪疗法》 -> 《幸福的陷阱》 -> 《拖延心理学》 -> 《被讨厌的勇气》 -> 《认知觉醒》 -> 《当下的力量》 | 从真实咨询和认知模式进入，再处理回避、拖延、边界、元认知和当下经验。 |
| 框架 | 如何建立稳定的自尊 | 《被讨厌的勇气》 -> 《自尊》 -> 《自卑与超越》 -> 《终身成长》 -> 《性格的陷阱》 -> 《也许你该找个人聊聊》 | 从课题分离和自我接纳开始，再看自尊机制、补偿心理、成长型思维、早期图式和咨询关系。 |
| 框架 | 如何面对创伤与自我修复 | 《身体从未忘记》 -> 《创伤与复原》 -> 《唤醒老虎》 -> 《不原谅也没关系》 -> 《依恋》 -> 《抱紧我》 -> 《也许你该找个人聊聊》 -> 《我们为什么要睡觉》 -> 《运动改造大脑》 | 先理解创伤如何留在身体和关系中，再看复原阶段、躯体经验、复杂性创伤、依恋、关系安全和身体恢复。 |
| 系统 | 面对丧失、哀伤与死亡 | 《最好的告别》 -> 《当呼吸化为空气》 -> 《活出生命的意义》 -> 《相约星期二》 -> 《生死课》 -> 《也许你该找个人聊聊》 | 保持 6 本。主题需要清晰、克制和可承受，不扩成死亡哲学大全。 |
| 系统 | 成瘾、自控与意义重建 | 《多巴胺国度》 -> 《欲罢不能》 -> 《自控力》 -> 《稀缺》 -> 《习惯的力量》 -> 《活出生命的意义》 -> 《反脆弱》 -> 《沉思录》 | 先看奖励回路与行为成瘾，再补上自控、稀缺带宽、习惯回路、意义和不确定中的承受力。 |

Boundary note: mental-health topics are reading paths only and do not replace professional medical care, psychotherapy, crisis support, or addiction treatment.

### 4. 关系、沟通与家庭教育

**二级组：亲密关系 / 关系冲突 / 沟通表达 / 亲子与家庭 / 教育与成长**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 框架 | 亲密关系阅读路径 | 《亲密关系》 -> 《依恋》 -> 《幸福的婚姻》 -> 《抱紧我》 -> 《爱的艺术》 -> 《沟通的本质》 -> 《非暴力沟通》 -> 《身体从未忘记》 | 先建立关系总览和依恋框架，再看婚姻研究、情绪循环、爱的哲学、沟通技术和创伤影响。 |
| 框架 | 如何处理亲密关系中的冲突 | 《亲密关系》 -> 《依恋》 -> 《幸福的婚姻》 -> 《抱紧我》 -> 《非暴力沟通》 -> 《高难度谈话》 -> 《关键对话》 | 先看冲突为什么反复出现，再处理依恋需求、修复尝试、情绪聚焦、非暴力表达和高风险对话。 |
| 系统 | 如何识别有毒关系 | 《亲密关系》 -> 《依恋》 -> 《煤气灯效应》 -> 《情绪勒索》 -> 《身体从未忘记》 -> 《不原谅也没关系》 -> 《高难度谈话》 | 从正常关系机制进入，再识别操控、勒索、创伤反应、边界和退出沟通。 |
| 框架 | 如何提升沟通与表达 | 《沟通的本质》 -> 《非暴力沟通》 -> 《关键对话》 -> 《高难度谈话》 -> 《金字塔原理》 -> 《演讲的力量》 -> 《说服》 | 先理解人际沟通，再进入情绪表达、关键对话、结构化表达、演讲和说服。 |
| 入门 | 如何做足够好的父母 | 《园丁与木匠》 -> 《正面管教》 -> 《游戏力》 -> 《如何说孩子才会听，怎么听孩子才肯说》 -> 《孩子，把你的手给我》 -> 《孩子：挑战》 | 先校正父母角色，再进入纪律、游戏、倾听、尊重和家庭互动。 |
| 入门 | 如何理解儿童安全感与教育成长 | 《依恋》 -> 《给孩子一生的安全感》 -> 《童年的秘密》 -> 《完整的成长》 -> 《终身幼儿园》 -> 《认知天性》 -> 《朗读手册》 | 从安全感和儿童观进入，再到创造性学习、学习科学和家庭阅读环境。 |

### 5. 职业、管理与组织

**二级组：职业资本 / 管理与领导 / 团队协作 / 组织系统与权力 / 组织变革**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 职业选择阅读路径 | 《远见》 -> 《职业锚》 -> 《你的降落伞是什么颜色》 -> 《优秀到不能被忽视》 -> 《一人企业》 -> 《每周工作4小时》 -> 《原则》 | 先理解职业周期、动机锚和求职探索，再看能力资本、独立工作、生活设计和个人原则。 |
| 框架 | 如何建立长期职业资本 | 《优秀到不能被忽视》 -> 《刻意练习》 -> 《深度工作》 -> 《远见》 -> 《精要主义》 -> 《原则》 -> 《一人企业》 -> 《10倍比两倍更容易》 | 从不要追逐激情开始，进入技能训练、专注产出、长期选择、取舍、原则、独立价值和高杠杆目标。 |
| 框架 | 如何成为有效管理者 | 《卓有成效的管理者》 -> 《管理的实践》 -> 《经理人员的职能》 -> 《领导梯队》 -> 《可复制的领导力》 -> 《高绩效教练》 -> 《关键对话》 -> 《无畏的组织》 | 先建立管理者责任，再看组织职能、领导梯队、复制机制、教练、对话和心理安全。 |
| 框架 | 如何建立领导力与团队协作 | 《领导梯队》 -> 《高绩效教练》 -> 《团队协作的五大障碍》 -> 《关键对话》 -> 《无畏的组织》 -> 《赋能》 -> 《重新定义团队》 -> 《权力》 | 从角色跃迁、教练和团队失效模式开始，再进入对话、心理安全、授权、团队结构和权力现实。 |
| 系统 | 看懂组织运转 | 《组织行为学》 -> 《走出危机》 -> 《丰田之道》 -> 《精益思维》 -> 《科学管理原理》 -> 《第五项修炼》 -> 《原则》 -> 《经理人员的职能》 | 从组织行为进入质量、生产系统、科学管理、学习型组织、经营原则和管理职能。 |
| 系统 | 如何理解组织中的权力与变革 | 《权力》 -> 《权力与影响力》 -> 《变革之心》 -> 《创新者的窘境》 -> 《从优秀到卓越》 -> 《重新定义公司》 -> 《只有偏执狂才能生存》 | 先直面权力来源和影响策略，再进入变革动员、创新困境、组织卓越、文化重塑和战略拐点。 |

### 6. 商业、产品与创业

**二级组：产品机会 / 产品发现 / 产品组织 / 增长营销 / 战略经营 / 平台网络**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 如何验证产品机会 | 《妈妈测试》 -> 《客户开发入门》 -> 《四步创业法》 -> 《精益创业》 -> 《从零到一》 -> 《商业模式新生代》 -> 《跨越鸿沟》 | 先学会问问题和理解客户，再进入客户开发、验证学习、独特命题、商业模式和早期市场。 |
| 框架 | 如何做好产品发现 | 《启示录》 -> 《用户故事地图》 -> 《精益产品手册》 -> 《俞军产品方法论》 -> 《用户体验要素》 -> 《设计心理学》 -> 《设计冲刺》 -> 《产品开发流程原理》 | 先理解现代产品发现，再组织用户任务、价值假设、体验层次、行为心理、冲刺验证和开发流动。 |
| 框架 | 产品从 0 到 1 | 《从零到一》 -> 《精益创业》 -> 《四步创业法》 -> 《客户开发入门》 -> 《妈妈测试》 -> 《启示录》 -> 《用户故事地图》 -> 《产品开发流程原理》 -> 《创业维艰》 -> 《增长黑客》 | 先判断独特命题，再用验证学习和客户开发确认需求，随后进入产品发现、需求组织、交付系统、创业管理和增长实验。 |
| 框架 | 如何建立产品组织与交付系统 | 《启示录》 -> 《产品开发流程原理》 -> 《用户故事地图》 -> 《精益思维》 -> 《赋能》 -> 《重新定义团队》 -> 《领导梯队》 -> 《无畏的组织》 | 从产品组织进入开发流动、需求地图、精益交付、授权、团队结构、领导梯队和心理安全。 |
| 框架 | 如何做增长与营销 | 《定位》 -> 《影响力》 -> 《引爆点》 -> 《跨越鸿沟》 -> 《增长黑客》 -> 《营销管理》 -> 《病毒式循环》 -> 《超级符号就是超级创意》 | 从定位、说服和传播扩散入门，再进入早期市场跨越、实验增长、营销体系、病毒循环和符号资产。 |
| 系统 | 如何设计商业模式与理解公司经营 | 《商业模式新生代》 -> 《客户开发入门》 -> 《精益创业》 -> 《财务智慧》 -> 《定价制胜》 -> 《创业维艰》 -> 《竞争战略》 -> 《从优秀到卓越》 -> 《原则》 | 从商业模式画布进入客户验证、财务语言、定价、创业经营、竞争、组织卓越和经营原则。 |
| 系统 | 如何理解商业竞争、战略与平台效应 | 《竞争战略》 -> 《好战略，坏战略》 -> 《创新者的窘境》 -> 《定位》 -> 《规模》 -> 《平台革命》 -> 《从零到一》 -> 《监视资本主义时代》 | 从行业结构和战略质量入门，再看创新冲击、心智定位、规模规律、平台结构、垄断和平台资本主义风险。 |

### 7. 金钱、投资与经济

**二级组：财务常识 / 长期投资 / 价值投资 / 交易与周期 / 经济运行 / 消费社会 / 阶层机会**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 建立财务常识 | 《小狗钱钱》 -> 《巴比伦最富有的人》 -> 《富爸爸穷爸爸》 -> 《邻家的百万富翁》 -> 《金钱心理学》 -> 《一本书读懂财报》 | 先建立收入、储蓄和资产意识，再进入家庭财富、金钱行为和财务报表。 |
| 框架 | 普通人如何长期投资 | 《共同基金常识》 -> 《聪明的投资者》 -> 《金钱心理学》 -> 《投资最重要的事》 -> 《周期》 -> 《巴菲特致股东的信》 -> 《穷查理宝典》 | 从低成本长期投资入门，再理解安全边际、行为偏差、风险、周期、企业长期主义和多元思维。 |
| 框架 | 如何理解价值投资 | 《聪明的投资者》 -> 《证券分析》 -> 《巴菲特致股东的信》 -> 《穷查理宝典》 -> 《怎样选择成长股》 -> 《成功投资》 -> 《投资最重要的事》 -> 《安全边际》 -> 《价值投资：从格雷厄姆到巴菲特》 | 从格雷厄姆体系进入企业分析、长期复利、能力圈、成长股、风险控制和价值投资谱系。 |
| 系统 | 如何理解交易、周期与市场风险 | 《股票大作手回忆录》 -> 《以交易为生》 -> 《金融怪杰》 -> 《海龟交易法则》 -> 《自律的交易者》 -> 《金融炼金术》 -> 《债务危机》 -> 《周期》 | 先看交易经验和交易系统，再进入交易心理、反身性、债务周期和市场周期。 |
| 框架 | 如何理解经济运行 | 《小岛经济学》 -> 《像经济学家一样思考》 -> 《经济学原理》 -> 《置身事内》 -> 《贫穷的本质》 -> 《国富论》 -> 《就业、利息和货币通论》 -> 《债：第一个5000年》 | 先用通俗经济学建立直觉，再进入微观、宏观、中国地方政府、发展经济学、古典政治经济学、凯恩斯和债务。 |
| 系统 | 如何理解行为经济学与金钱心理 | 《助推》 -> 《怪诞行为学》 -> 《思考，快与慢》 -> 《稀缺》 -> 《金钱心理学》 -> 《错误的行为》 -> 《影响力》 | 从选择架构和非理性行为入门，再进入双系统、稀缺带宽、金钱叙事、行为经济学史和说服机制。 |
| 系统 | 看懂消费主义、财富与阶层机会 | 《有闲阶级论》 -> 《工作、消费主义和新穷人》 -> 《消费社会》 -> 《邻家的百万富翁》 -> 《贫穷的本质》 -> 《稀缺》 -> 《21世纪资本论》 -> 《置身事内》 | 从消费和炫耀进入家庭财富、贫困机制、稀缺心理、长期不平等和中国制度环境。 |

Boundary note: investment topics are reading paths only and do not constitute investment advice.

### 8. 社会、法律与公共生活

**二级组：社会制度 / 公平正义 / 法律常识 / 媒体公共讨论 / 城市空间 / 性别结构**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 社会分层与共同生活 | 《乡土中国》 -> 《社会学的想象力》 -> 《社会分工论》 -> 《贫穷的本质》 -> 《社会共通资本》 -> 《城市的胜利》 -> 《厌女》 -> 《置身事内》 | 从中国基层社会和社会学想象入门，再看分工、贫困、公共资本、城市、性别结构和制度运行。 |
| 框架 | 如何理解公平与正义 | 《公正》 -> 《洞穴奇案》 -> 《正义之心》 -> 《正义论》 -> 《论人类不平等的起源和基础》 -> 《通往奴役之路》 -> 《开放社会及其敌人》 | 从公共哲学入门，再进入法律两难、道德心理、自由平等、不平等起源、市场自由和开放社会。 |
| 系统 | 如何识别制度与权力 | 《权力》 -> 《旧制度与大革命》 -> 《权力与繁荣》 -> 《国家为什么会失败》 -> 《通往奴役之路》 -> 《法治及其本土资源》 -> 《看得见的正义》 -> 《人的境况》 | 先看权力机制，再进入制度转型、国家能力、法治传统、司法公共性和行动空间。 |
| 入门 | 如何建立法律常识 | 《学点法律避点坑》 -> 《洞穴奇案》 -> 《看得见的正义》 -> 《刑法学讲义》 -> 《民法典与日常生活》 -> 《法治及其本土资源》 | 保持 6 本。先解决日常法律意识，再进入法理、司法、刑法、民法和本土法治。 |
| 框架 | 如何理解媒体、舆论与公共讨论 | 《初识传播学》 -> 《理解媒介》 -> 《娱乐至死》 -> 《注意力商人》 -> 《乌合之众》 -> 《事实》 -> 《学会提问》 -> 《过滤泡》 | 先进入传播学和媒介理论，再看娱乐化、注意力商业、群体舆论、事实判断、批判提问和信息茧房。 |
| 框架 | 城市、空间与生活方式 | 《美国大城市的死与生》 -> 《城市的胜利》 -> 《社会共通资本》 -> 《乡土中国》 -> 《工作、消费主义和新穷人》 -> 《有闲阶级论》 | 保持 6 本。城市主题从街区和城市经济入门，再连接公共资本、乡土结构、工作消费和阶层展示。 |
| 系统 | 如何理解性别与社会结构 | 《厌女》 -> 《第二性》 -> 《看不见的女性》 -> 《性别打结》 -> 《亲密关系》 -> 《社会学的想象力》 | 保持 6 本。先看性别秩序，再进入女性处境、数据偏见、结构机制、亲密关系和社会学视角。 |

Boundary note: legal topics are reading paths only and do not constitute legal advice.

### 9. 历史、文明与世界格局

**二级组：中国历史 / 世界历史 / 文明兴衰 / 国际秩序**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 框架 | 中国社会的现代转型 | 《乡土中国》 -> 《中国历代政治得失》 -> 《万历十五年》 -> 《中国近代史》 -> 《叫魂》 -> 《枢纽》 -> 《置身事内》 -> 《旧制度与大革命》 | 从乡土社会和制度传统进入，再看明代政治、近代转型、基层恐慌、历史枢纽、当代治理和比较革命。 |
| 入门 | 中国历史入门 | 《中国通史》 -> 《中国历代政治得失》 -> 《万历十五年》 -> 《叫魂》 -> 《中国近代史》 -> 《枢纽》 -> 《曾国藩传》 | 先建立通史骨架，再看政治制度、明代切片、清代社会、近代变局、历史转折和人物传记。 |
| 入门 | 如何理解世界历史 | 《全球通史》 -> 《人类简史》 -> 《枪炮、病菌与钢铁》 -> 《丝绸之路》 -> 《大国的兴衰》 -> 《世界秩序》 -> 《未来简史》 | 从通史和人类叙事入门，再看地理、贸易网络、国家兴衰、国际秩序和现代风险。 |
| 框架 | 如何理解文明兴衰 | 《枪炮、病菌与钢铁》 -> 《大国的兴衰》 -> 《文明的冲突》 -> 《国家为什么会失败》 -> 《世界秩序》 -> 《人类简史》 -> 《增长的极限》 | 从地理和经济力量入门，再看文化冲突、制度质量、国际秩序、人类叙事和增长边界。 |
| 系统 | 如何理解国际秩序与地缘风险 | 《世界秩序》 -> 《大国的兴衰》 -> 《文明的冲突》 -> 《注定一战》 -> 《国家为什么会失败》 -> 《开放社会及其敌人》 -> 《未来简史》 | 从国际秩序和大国兴衰进入，再看文明冲突、修昔底德陷阱、制度竞争、开放社会和现代风险。 |

### 10. 科技、AI 与媒介环境

**二级组：技术社会 / AI 变革 / 平台算法 / 注意力风险 / 数字公共生活**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 技术社会读什么 | 《技术的本质》 -> 《必然》 -> 《失控》 -> 《理解媒介》 -> 《娱乐至死》 -> 《监视资本主义时代》 -> 《平台革命》 | 先理解技术演化，再看网络社会、媒介环境、娱乐化、监控资本主义和平台结构。 |
| 框架 | 普通人如何理解和使用 AI | 《人机共智》 -> 《AI 2041》 -> 《生命3.0》 -> 《对齐问题》 -> 《即将到来的浪潮》 -> 《未来呼啸而来》 | 从实际协作和生成式 AI 使用进入，再看场景化未来、智能生命、对齐、技术扩散和产业变化。 |
| 系统 | AI 风险、治理与技术权力 | 《即将到来的浪潮》 -> 《对齐问题》 -> 《算法霸权》 -> 《监视资本主义时代》 -> 《开放社会及其敌人》 -> 《智人之上》 | 从 AI 与生物技术扩散风险进入，再看对齐、算法歧视、监控资本主义、开放社会和信息网络权力。 |
| 框架 | 看懂平台、算法与注意力风险 | 《娱乐至死》 -> 《注意力商人》 -> 《过滤泡》 -> 《监视资本主义时代》 -> 《算法霸权》 -> 《平台革命》 -> 《理解媒介》 | 从媒介和注意力商业入门，再看信息茧房、监控、算法歧视、平台治理和媒介理论。 |
| 系统 | 数字公共生活与信息网络 | 《智人之上》 -> 《理解媒介》 -> 《初识传播学》 -> 《过滤泡》 -> 《事实》 -> 《学会提问》 -> 《人的境况》 | 从信息网络史进入媒介、传播、公共事实、批判提问和公共行动空间。 |

### 11. 文学、人文与人生哲学

**二级组：文学阅读 / 艺术审美 / 幸福哲学 / 人生哲学**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 文学与人文阅读入门 | 《如何阅读一本小说》 -> 《小说面面观》 -> 《文学理论入门》 -> 《文学回忆录》 -> 《文学的故事》 -> 《文学讲稿》 | 先学会阅读小说，再进入叙事形式、文学理论、文学史和文学讲稿。 |
| 入门 | 艺术与审美入门 | 《艺术的故事》 -> 《写给大家看的设计书》 -> 《像艺术家一样思考》 -> 《美的历程》 -> 《谈美》 -> 《禅与摩托车维修艺术》 | 从艺术史和视觉基础进入，再看观察方式、中国美学、美学入门和技艺精神。 |
| 框架 | 如何理解幸福 | 《幸福的方法》 -> 《真实的幸福》 -> 《心流》 -> 《亲密关系》 -> 《被讨厌的勇气》 -> 《人生的智慧》 -> 《尼各马可伦理学》 | 从积极心理学进入沉浸体验、关系、自我接纳、人生智慧和德性伦理。 |
| 框架 | 人生哲学入门 | 《苏菲的世界》 -> 《人生的智慧》 -> 《沉思录》 -> 《论语》 -> 《道德经》 -> 《尼各马可伦理学》 -> 《悉达多》 -> 《人的境况》 | 先用哲学故事进入，再看人生智慧、斯多葛、儒道、德性伦理、精神追寻和行动空间。 |
| 系统 | 如何读懂痛苦、自由与意义 | 《活出生命的意义》 -> 《悉达多》 -> 《沉思录》 -> 《当下的力量》 -> 《人的境况》 -> 《开放社会及其敌人》 | 从苦难意义和精神追寻入门，再进入斯多葛、当下经验、行动空间和开放社会。 |

### 12. 健康、身体与可持续生活

**二级组：健康生活 / 压力恢复 / 运动体能 / 饮食代谢 / 衰老疾病 / 环境气候**

| Layer | Topic | Reading Path | Gradient |
|---|---|---|---|
| 入门 | 如何建立健康生活方式 | 《掌控习惯》 -> 《我们为什么要睡觉》 -> 《运动改造大脑》 -> 《身体使用手册》 -> 《ACSM健身与健康完全指南》 -> 《精力管理》 -> 《超越百岁》 | 先从习惯、睡眠和运动入门，再补上身体使用、训练指南、能量管理和长寿。 |
| 框架 | 如何理解压力、恢复与身体信号 | 《身体从未忘记》 -> 《我们为什么要睡觉》 -> 《运动改造大脑》 -> 《身体使用手册》 -> 《精力管理》 -> 《多巴胺国度》 -> 《幸福的陷阱》 | 从创伤和压力身体化进入，再看睡眠、运动、身体使用、能量、奖励系统和接纳。 |
| 框架 | 如何理解运动与体能 | 《无器械健身》 -> 《ACSM健身与健康完全指南》 -> 《身体使用手册》 -> 《施瓦辛格健身全书》 -> 《耐力》 -> 《ACSM高级运动生理学》 -> 《生理学》 | 从可执行训练入门，再进入健康指南、动作与康复、力量训练、耐力、生理学和高级运动机制。 |
| 入门 | 如何理解饮食与代谢 | 《营养学：概念与争论》 -> 《我们为什么会生病》 -> 《肥胖代码》 -> 《深度营养》 -> 《超越百岁》 -> 《生理学》 | 保持 6 本，且必须在入库前复核证据质量。营养主题争议大，不宜用单一畅销书建立结论。 |
| 系统 | 面对衰老、疾病与照护 | 《超越百岁》 -> 《最好的告别》 -> 《当呼吸化为空气》 -> 《我们为什么要睡觉》 -> 《运动改造大脑》 -> 《活出生命的意义》 -> 《生死课》 | 从长寿医学进入照护、疾病经验、睡眠运动、意义支撑和临终沟通。 |
| 系统 | 如何理解环境、气候与可持续生活 | 《寂静的春天》 -> 《增长的极限》 -> 《小即是美》 -> 《失控的农业》 -> 《气候经济与人类未来》 -> 《社会共通资本》 -> 《枪炮、病菌与钢铁》 | 从环境危机和增长边界入门，再看适度经济、农业系统、气候经济、公共资本和地理文明约束。 |

Boundary note: health topics are reading paths only and do not replace medical advice, nutrition prescriptions, exercise prescriptions, or clinical care.

## Deleted, Merged, Or Renamed From V8

| V8 Topic | V9 Treatment | Reason |
|---|---|---|
| `如何摆脱拖延与行动阻力` | Merge into `如何建立可持续习惯`, `如何提高深度工作能力`, and `如何停止精神内耗` | The old topic had three different reader problems: behavior design, attention work, and emotional avoidance. |
| `开始写作` and `如何做创意工作` | Merge into `写作与创意工作` | Writing and creative work share resistance, practice, style, and output concerns at this roadmap depth. |
| `如何理解青春期` | Merge into future parenting/education batch, not kept as a first-class V9 topic | The current library does not yet support a deep enough standalone adolescence path. |
| `如何理解设计与用户体验` | Move inside `如何做好产品发现` | UX is important, but the current book coverage works better as product-discovery depth than as a separate public page. |
| `如何理解公司经营` and `如何设计并验证商业模式` | Merge into `如何设计商业模式与理解公司经营` | Keeps business model, finance, pricing, and company operation in one system path. |
| `如何理解商业竞争与战略` and `如何理解平台与网络效应` | Merge into `如何理解商业竞争、战略与平台效应` | Avoids two thin strategy pages that compete for the same books. |
| `看懂消费主义` and `如何理解财富、阶层与机会` | Merge into `看懂消费主义、财富与阶层机会` | Consumption, poverty, wealth accumulation, and inequality should be read together. |
| `AI 技术变革读什么` | Split into `普通人如何理解和使用 AI` and `AI 风险、治理与技术权力` | Practical AI collaboration and AI governance/risk now have different reader goals. |
| `面对衰老` | Keep merged into `面对衰老、疾病与照护` | Aging is too narrow unless connected to illness, care, and mortality. |

## Future Implementation Plan

### Task 1: Review and Lock One Batch

**Files:**

- Read: `docs/superpowers/plans/2026-06-01-topic-reading-panorama.md`
- Create: `docs/superpowers/plans/YYYY-MM-DD-topic-batch-N.md`

- [ ] Select one batch of 4-8 topics from this V9 panorama.
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

- The plan records 73 topic candidates across 12 domains.
- The plan includes a domain coverage audit, not only a topic list.
- The plan includes a book-count audit showing that 5-6-book lists are intentionally compact rather than a default template.
- The 8 published topics are included in the same evaluation system and are not treated as immutable.
- The 8 published topics are marked as first migration priority before adding more net-new public pages.
- The product topic is explicitly split into opportunity validation, product discovery, product 0-to-1, product organization, growth, business model/company operation, and strategy/platform themes.
- Topic book counts vary by problem complexity instead of forcing a fixed number.
- Every topic has a one-sentence learning-gradient note.
- Topic titles use mixed reader-centered forms instead of a uniform `如何...` template.
- The plan allows future batches to update, split, merge, rename, redirect, or remove published topic files through explicit migration decisions.
- The plan requires every future approved topic recommendation to use `status: in_library`.
- The plan requires all books in an approved topic to be present in the book library before topic publication.
- The plan merges overlapping evidence/science topics instead of multiplying shallow pages.
