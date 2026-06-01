# Topic Reading Panorama V5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild topic reading into a full-site roadmap. The roadmap starts from reader problems, not from the current book database. The 8 published topics are included in the same review system and may be kept, renamed, split, merged, or replaced in later implementation batches.

**Architecture:** This is a reviewable planning artifact, not a publish-ready batch. It defines the target taxonomy, topic-level book lists, depth rules, and migration rules. Future implementation must first bring every recommended book into `books/`, then publish topic Markdown using only `status: in_library`.

**Tech Stack:** Markdown planning document in `docs/superpowers/plans/`; future implementation uses the existing `topics/*.md` model, Next.js static generation, and topic content validation tests.

---

## Review Status

This plan is not approved for implementation yet. It is the canonical V5 draft for later review.

Independent review feedback has been incorporated:

- The taxonomy is reduced from 12 domains to 9 stronger domains.
- The 9 domains now contain explicit second-level groups so the panorama works as a reading map, not a flat topic warehouse.
- The published 8 topics are no longer treated as fixed pages.
- Topic book counts are variable. Compact topics can use 5-6 books; standard topics use 7-9 books; complex topics use 10-12 books. If a topic needs more than 12 books, split it.
- Repeated books now have a first-pass role table. A book can be a core book in one topic and an extension or bridge book in another, but later batch plans must keep that role explicit.
- Current published pages may contain recommendations for books not yet in the library. V5 migration must either add those books first or leave the old page untouched until it can be replaced cleanly.
- The final review does not expand topic count. It only tightens title style, topic boundaries, and visibly misplaced book paths.

This plan does not delete live topic files. Deletion, redirect, or slug replacement must happen in a later explicit migration batch.

## Published Topic Reconstruction Matrix

| Current Topic | V5 Decision | Target Placement | Book-List Direction |
|---|---|---|---|
| `如何做重大决策` | Keep and deepen | 思维、判断与复杂性 | Center on high-stakes personal and organizational decisions. Keep 《怎样决定大事》《思考，快与慢》《噪声》《决断力》《超级预测》《对赌》 as the main spine; use systems books as extension. |
| `如何理解系统与复杂性` | Keep and narrow | 思维、判断与复杂性 | Focus on feedback, emergence, scale, and organizational learning. Move pure uncertainty books to the risk topic. |
| `如何建立可持续习惯` | Keep and tighten | 自我管理与学习 | Build around behavior design, motivation, self-control, and environment design. Remove generic self-help from the core path. |
| `如何识别偏见与群体影响` | Rename | 思维、判断与复杂性 | Rename to `如何理解偏见、从众与服从`. Keep cognition plus social influence; separate structural inequality into social topics. |
| `从0到1做产品` | Replace through split | 商业、产品与创业 | Do not keep the old title as an independent planning topic. Use `如何验证产品机会`, `如何做好产品发现`, and `产品从 0 到 1`; the last one replaces the published page when migration happens. |
| `如何理解亲密关系` | Keep and improve | 关系、沟通与家庭 | Use attachment, marriage research, emotional bonding, communication, and love philosophy. Remove manipulative dating books from the core list. |
| `如何面对创伤与自我修复` | Keep with boundary | 心理、情绪与修复 | Focus on trauma, recovery, body memory, attachment, and professional boundary. Do not mix decision books into the core path. |
| `如何提高深度工作能力` | Keep and broaden | 自我管理与学习 | Cover attention, cognitive load, task systems, deliberate practice, recovery, and slow productivity. |

## First Migration Priority

The first implementation batch should handle the 8 published topics before adding more net-new public pages. These pages already define the user-facing baseline, so the site should not carry old book paths after the new panorama is approved.

- Replace the published `从0到1做产品` page with `产品从 0 到 1`.
- Rename or replace `如何识别偏见与群体影响` with `为什么人会从众和服从`.
- Update `如何做重大决策`, `什么是系统思维`, `如何建立可持续习惯`, `亲密关系阅读路径`, `如何面对创伤与自我修复`, and `如何提高深度工作能力` to match this plan's book paths.
- Do not retain old core books that this matrix has moved to extension roles.

## Source Signals

The panorama borrows category signals from knowledge-service platforms, then converts them into problem-driven reading themes.

- 得到：lifelong learning, business, management, product thinking, finance, history, modern thought, and daily book listening.
- 帆书/樊登读书：mindset, management, workplace, family, humanities, entrepreneurship, psychology, parenting, investment, social science, and health.
- 喜马拉雅：health psychology, daily life, children growth, learning motivation, humanities, social science, business finance, history, parenting, and relationships.

Reference links:

- [得到 App Store](https://apps.apple.com/kg/app/%E5%BE%97%E5%88%B0-%E8%AF%BE%E7%A8%8B%E5%90%AC%E4%B9%A6%E7%94%B5%E5%AD%90%E4%B9%A6/id1016323413)
- [帆书书籍解读](https://www.fanshu.cn/intro/read)
- [帆书延伸学习](https://www.fanshu.cn/intro/learn)
- [喜马拉雅有声阅读报告](https://biz.tom.com/202404/1840213107.html)

## Non-Negotiable Content Rules

- Topic titles must be reader-centered and problem-driven. Use a mixed style: `如何...`, `怎样...`, `为什么...`, `什么是...`, `看懂...`, or concise noun-style reading paths when that sounds more natural.
- Topic count per domain is not fixed. The taxonomy must optimize coverage and reader usefulness, not visual symmetry.
- Book count per topic is determined by problem complexity: 5-6 for compact topics, 7-9 for standard topics, 10-12 for complex topics.
- Book order is intentional: entry book first, then core framework, then system coverage, then practice, critique, or advanced reference.
- Approved topics must use `status: in_library` for every recommendation.
- Before publishing an approved topic, every recommended book must already exist in `books/` or be added to `books/` with a valid slug.
- Medical, mental health, legal, and investment topics must include a reader-facing boundary note in the article body.
- Book titles use common Chinese names. Author names and final slugs are verified during the future implementation batch.
- A book that appears in multiple themes must be assigned one of three roles during implementation: `core`, `extension`, or `bridge`. The public page does not need to show this role.

## Domain Depth Standard

Each domain must support three reader layers:

- `入门层`: quickly build vocabulary and avoid common misunderstandings.
- `框架层`: form a stable mental model of the topic.
- `系统层`: connect the topic to adjacent disciplines, institutions, constraints, and long-term consequences.

Any future batch that only contains entry-level popular books fails the depth bar. Any future batch that only contains classics and textbooks fails the accessibility bar.

| Domain | Required Depth |
|---|---|
| 思维、判断与复杂性 | Cognitive bias, evidence, probability, decision process, system feedback, group influence, uncertainty. |
| 自我管理与学习 | Habit, attention, energy, learning science, knowledge management, action resistance, personal operating system. |
| 心理、情绪与修复 | Emotion, self-worth, anxiety, trauma, grief, meaning, recovery boundary. |
| 关系、沟通与家庭 | Attachment, intimacy, conflict, family system, parenting, adolescence, education. |
| 职业、管理与组织 | Career capital, management, collaboration, leadership, organizational design, power and politics. |
| 商业、产品与创业 | Customer problem, opportunity validation, discovery, delivery, growth, strategy, business model, design. |
| 金钱、经济与消费 | Personal finance, investing, risk, macroeconomics, consumption, inequality, financial boundary. |
| 社会、法律、历史与文明 | Institutions, law, media, public reasoning, China, world history, cities, culture, literature, political freedom, technology society, modern transformation. |
| 健康、身体、意义与创造 | Sleep, exercise, nutrition, stress, aging, death, writing, story, creativity, philosophy, happiness. |

## Domain Subgroups

| Domain | Second-Level Groups |
|---|---|
| 思维、判断与复杂性 | 决策与防错 / 系统与复杂性 / 证据与科学 / 预测与风险 |
| 自我管理与学习 | 习惯与行动 / 注意力与深度工作 / 学习与输出 / 自我认知 |
| 心理、情绪与修复 | 情绪与内耗 / 自尊与自我 / 创伤与修复 / 哀伤与意义 |
| 关系、沟通与家庭 | 亲密关系 / 关系冲突 / 亲子与家庭 / 教育与成长 |
| 职业、管理与组织 | 职业资本 / 管理与领导 / 团队协作 / 组织系统与权力 |
| 商业、产品与创业 | 产品机会 / 产品发现 / 产品组织 / 增长营销 / 战略经营 |
| 金钱、经济与消费 | 财务常识 / 投资风险 / 经济运行 / 消费社会 / 阶层机会 |
| 社会、法律、历史与文明 | 社会制度 / 法律公共生活 / 历史文明 / 技术与现代性 / 文学人文 |
| 健康、身体、意义与创造 | 健康与身体 / 衰老与死亡 / 写作与表达 / 意义与创造 |

## High-Frequency Book Role Table

These roles are planning defaults. Future batch plans may revise them, but each revision must explain why.

| Book | Core Topic | Other Usage |
|---|---|---|
| 《思考，快与慢》 | 如何做重大决策 | bias、行为经济学、证据判断主题中作为 bridge |
| 《噪声》 | 如何做重大决策 | 预测、证据判断主题中作为 bridge |
| 《反脆弱》 | 如何理解概率、风险与预测 | 痛苦意义、投资风险主题中作为 bridge |
| 《系统之美》 | 什么是系统思维 | 重大决策、未来不确定性主题中作为 bridge |
| 《深度工作》 | 如何提高深度工作能力 | 长期职业资本主题中作为 bridge |
| 《掌控习惯》 | 如何建立可持续习惯 | 健康生活、长期学习主题中作为 bridge |
| 《亲密关系》 | 亲密关系阅读路径 | 有毒关系、幸福主题中作为 bridge |
| 《依恋》 | 亲密关系阅读路径 | 创伤修复、儿童安全感主题中作为 bridge |
| 《身体从未忘记》 | 如何面对创伤与自我修复 | 压力恢复、有毒关系主题中作为 bridge |
| 《影响力》 | 如何做增长与营销 | 偏见、谈判主题中作为 bridge |
| 《事实》 | 如何建立批判性思维 | 证据判断、公共讨论主题中作为 bridge |
| 《稀缺》 | 如何理解财富、阶层与机会 | 自控、行为经济学主题中作为 bridge |
| 《原则》 | 如何理解公司经营 | 领导力、自我认知主题中作为 bridge |
| 《从零到一》 | 如何验证产品机会 | 商业模式、平台效应主题中作为 bridge |
| 《精益创业》 | 如何验证产品机会 | 产品 0-to-1、商业模式主题中作为 bridge |
| 《学会提问》 | 如何建立批判性思维 | 证据判断、媒体公共讨论、阅读输出主题中作为 bridge |
| 《也许你该找个人聊聊》 | 如何停止精神内耗 | 自尊、创伤、哀伤主题中作为 bridge |
| 《我们为什么要睡觉》 | 如何建立健康生活方式 | 情绪、创伤恢复、衰老主题中作为 bridge |

## Panorama

### 1. 思维、判断与复杂性

**二级组：决策与防错 / 系统与复杂性 / 证据与科学 / 预测与风险**

#### 1. 如何做重大决策

阅读路径： 《怎样决定大事》 → 《决断力》 → 《思考，快与慢》 → 《噪声》 → 《超级预测》 → 《对赌》 → 《助推》 → 《清单革命》

#### 2. 什么是系统思维

阅读路径： 《系统之美》 → 《控制论与科学方法论》 → 《第五项修炼》 → 《复杂》 → 《规模》 → 《混沌》 → 《弹性》 → 《复杂经济学》

#### 3. 为什么人会从众和服从

阅读路径： 《社会心理学》 → 《偏见的本质》 → 《社会性动物》 → 《社会认知心理学》 → 《影响力》 → 《服从权威》 → 《路西法效应》 → 《乌合之众》 → 《盲点》

#### 4. 如何建立批判性思维

阅读路径： 《学会提问》 → 《批判性思维工具》 → 《超越感觉》 → 《事实》 → 《思考，快与慢》 → 《清醒思考的艺术》 → 《思维模型》

#### 5. 如何理解概率、风险与预测

阅读路径： 《随机漫步的傻瓜》 → 《超级预测》 → 《噪声》 → 《黑天鹅》 → 《风险、不确定性与利润》 → 《反脆弱》 → 《对赌》

#### 6. 怎样判断证据是否可靠

阅读路径： 《赤裸裸的统计学》 → 《女士品茶》 → 《为什么》 → 《因果推断》 → 《事实》 → 《这才是心理学》 → 《学会提问》 → 《噪声》

#### 7. 如何建立科学思维

阅读路径： 《别逗了费曼先生》 → 《世界观》 → 《科学革命的结构》 → 《无穷的开始》 → 《这才是心理学》 → 《思维模型》

#### 8. 识别伪科学与坏证据

阅读路径： 《这才是心理学》 → 《学会提问》 → 《事实》 → 《赤裸裸的统计学》 → 《为什么》 → 《科学革命的结构》

### 2. 自我管理与学习

**二级组：习惯与行动 / 注意力与深度工作 / 学习与输出 / 自我认知**

#### 9. 如何建立可持续习惯

阅读路径： 《掌控习惯》 → 《习惯的力量》 → 《微习惯》 → 《福格行为模型》 → 《自控力》 → 《驱动力》

#### 10. 如何提高深度工作能力

阅读路径： 《深度工作》 → 《心流》 → 《刻意练习》 → 《搞定》 → 《精力管理》 → 《找回专注力》 → 《慢生产力》

#### 11. 如何管理时间与精力

阅读路径： 《精力管理》 → 《搞定》 → 《精要主义》 → 《高效能人士的七个习惯》 → 《每周工作4小时》 → 《慢生产力》

#### 12. 如何长期坚持学习

阅读路径： 《如何阅读一本书》 → 《认知天性》 → 《学习之道》 → 《刻意练习》 → 《心流》 → 《掌控习惯》 → 《终身成长》

#### 13. 阅读与输出系统

阅读路径： 《如何阅读一本书》 → 《卡片笔记写作法》 → 《金字塔原理》 → 《学会提问》 → 《风格感觉》 → 《写作这回事》 → 《第二大脑》

#### 14. 如何摆脱拖延与行动阻力

阅读路径： 《拖延心理学》 → 《微习惯》 → 《福格行为模型》 → 《幸福的陷阱》 → 《掌控习惯》 → 《搞定》 → 《写作的战争》

#### 15. 如何建立自我认知

阅读路径： 《被讨厌的勇气》 → 《自卑与超越》 → 《终身成长》 → 《性格的陷阱》 → 《原则》 → 《也许你该找个人聊聊》

### 3. 心理、情绪与修复

**二级组：情绪与内耗 / 自尊与自我 / 创伤与修复 / 哀伤与意义**

#### 16. 如何理解情绪

阅读路径： 《蛤蟆先生去看心理医生》 → 《情绪急救》 → 《情绪是什么》 → 《伯恩斯新情绪疗法》 → 《身体从未忘记》 → 《我们为什么要睡觉》

#### 17. 理解焦虑与抑郁

阅读路径： 《伯恩斯新情绪疗法》 → 《幸福的陷阱》 → 《也许你该找个人聊聊》 → 《蛤蟆先生去看心理医生》 → 《我们为什么要睡觉》

边界说明：本主题只做阅读路径，不替代专业医疗、心理咨询或危机干预。

#### 18. 如何停止精神内耗

阅读路径： 《也许你该找个人聊聊》 → 《伯恩斯新情绪疗法》 → 《幸福的陷阱》 → 《拖延心理学》 → 《认知觉醒》 → 《当下的力量》

#### 19. 如何建立稳定的自尊

阅读路径： 《被讨厌的勇气》 → 《自尊》 → 《自卑与超越》 → 《终身成长》 → 《也许你该找个人聊聊》

#### 20. 如何面对创伤与自我修复

阅读路径： 《身体从未忘记》 → 《创伤与复原》 → 《唤醒老虎》 → 《不原谅也没关系》 → 《依恋》 → 《也许你该找个人聊聊》 → 《我们为什么要睡觉》

边界说明：本主题只做阅读路径，不替代专业医疗、心理咨询或危机干预。

#### 21. 面对丧失、哀伤与死亡

阅读路径： 《最好的告别》 → 《当呼吸化为空气》 → 《活出生命的意义》 → 《相约星期二》 → 《生死课》 → 《也许你该找个人聊聊》

#### 22. 如何在痛苦中重建意义

阅读路径： 《活出生命的意义》 → 《当下的力量》 → 《人生的智慧》 → 《反脆弱》 → 《悉达多》 → 《最小阻力之路》

#### 23. 成瘾与自我控制

阅读路径： 《多巴胺国度》 → 《欲罢不能》 → 《自控力》 → 《稀缺》 → 《习惯的力量》 → 《上瘾》

### 4. 关系、沟通与家庭

**二级组：亲密关系 / 关系冲突 / 亲子与家庭 / 教育与成长**

#### 24. 亲密关系阅读路径

阅读路径： 《亲密关系》 → 《依恋》 → 《幸福的婚姻》 → 《抱紧我》 → 《爱的艺术》 → 《沟通的本质》 → 《非暴力沟通》

#### 25. 如何识别有毒关系

阅读路径： 《亲密关系》 → 《依恋》 → 《煤气灯效应》 → 《情绪勒索》 → 《身体从未忘记》 → 《不原谅也没关系》

#### 26. 如何处理亲密关系中的冲突

阅读路径： 《亲密关系》 → 《依恋》 → 《幸福的婚姻》 → 《抱紧我》 → 《非暴力沟通》 → 《高难度谈话》

#### 27. 如何做足够好的父母

阅读路径： 《园丁与木匠》 → 《正面管教》 → 《游戏力》 → 《如何说孩子才会听，怎么听孩子才肯说》 → 《孩子，把你的手给我》 → 《读懂孩子的心》

#### 28. 如何陪孩子建立安全感

阅读路径： 《依恋》 → 《给孩子一生的安全感》 → 《童年的秘密》 → 《完整的成长》 → 《孩子：挑战》 → 《最温柔的教养》

#### 29. 如何理解青春期

阅读路径： 《解码青春期》 → 《与青春期和解》 → 《养育男孩》 → 《养育女孩》 → 《孩子，把你的手给我》

#### 30. 如何打造家庭学习环境

阅读路径： 《朗读手册》 → 《打造儿童阅读环境》 → 《阅读的力量》 → 《好妈妈胜过好老师》 → 《终身幼儿园》

#### 31. 如何理解教育与成长

阅读路径： 《爱弥儿》 → 《民主主义与教育》 → 《童年的秘密》 → 《园丁与木匠》 → 《终身幼儿园》 → 《认知天性》

### 5. 职业、管理与组织

**二级组：职业资本 / 管理与领导 / 团队协作 / 组织系统与权力**

#### 32. 职业选择阅读路径

阅读路径： 《远见》 → 《职业锚》 → 《你的降落伞是什么颜色》 → 《优秀到不能被忽视》 → 《一人企业》 → 《每周工作4小时》

#### 33. 如何建立长期职业资本

阅读路径： 《优秀到不能被忽视》 → 《刻意练习》 → 《深度工作》 → 《远见》 → 《精要主义》 → 《原则》 → 《一人企业》

#### 34. 如何成为有效管理者

阅读路径： 《卓有成效的管理者》 → 《管理的实践》 → 《经理人员的职能》 → 《领导梯队》 → 《可复制的领导力》 → 《高绩效教练》

#### 35. 如何做好团队协作

阅读路径： 《团队协作的五大障碍》 → 《关键对话》 → 《横向领导力》 → 《无畏的组织》 → 《赋能》 → 《重新定义团队》

#### 36. 如何处理职场沟通与冲突

阅读路径： 《关键对话》 → 《高难度谈话》 → 《非暴力沟通》 → 《谈判力》 → 《横向领导力》 → 《团队协作的五大障碍》

#### 37. 看懂组织运转

阅读路径： 《组织行为学》 → 《走出危机》 → 《丰田之道》 → 《精益思想》 → 《科学管理原理》 → 《原则》

#### 38. 如何理解组织中的权力与政治

阅读路径： 《权力》 → 《权力与影响力》 → 《组织行为学》 → 《经理人员的职能》 → 《领导梯队》 → 《无畏的组织》

#### 39. 如何建立领导力

阅读路径： 《领导梯队》 → 《高绩效教练》 → 《第五项修炼》 → 《原则》 → 《从优秀到卓越》 → 《赋能》

#### 40. 如何推动组织变革

阅读路径： 《变革之心》 → 《第五项修炼》 → 《创新者的窘境》 → 《从优秀到卓越》 → 《走出危机》 → 《重新定义公司》

### 6. 商业、产品与创业

**二级组：产品机会 / 产品发现 / 产品组织 / 增长营销 / 战略经营**

#### 41. 如何验证产品机会

阅读路径： 《精益创业》 → 《四步创业法》 → 《客户开发入门》 → 《妈妈测试》 → 《用户访谈》 → 《从零到一》 → 《商业模式新生代》

#### 42. 如何做好产品发现

阅读路径： 《启示录》 → 《用户故事地图》 → 《精益产品手册》 → 《俞军产品方法论》 → 《用户体验要素》 → 《设计心理学》 → 《设计冲刺》

边界说明：本主题讲“做什么解法”，不讲增长成瘾或商业模式。

#### 43. 产品从 0 到 1

阅读路径： 《从零到一》 → 《精益创业》 → 《四步创业法》 → 《客户开发入门》 → 《启示录》 → 《用户故事地图》 → 《产品开发流程原理》 → 《创业维艰》

迁移说明：本主题用于替代已发布的 `从0到1做产品`，原标题不再作为独立规划主题保留。

#### 44. 如何建立产品组织

阅读路径： 《启示录》 → 《产品开发流程原理》 → 《用户故事地图》 → 《赋能》 → 《重新定义团队》 → 《领导梯队》

#### 45. 如何理解设计与用户体验

阅读路径： 《设计心理学》 → 《用户体验要素》 → 《简约至上》 → 《点石成金》 → 《写给大家看的设计书》 → 《用户故事地图》 → 《启示录》

#### 46. 如何做增长与营销

阅读路径： 《定位》 → 《影响力》 → 《引爆点》 → 《增长黑客》 → 《营销管理》 → 《病毒式循环》

#### 47. 如何设计并验证商业模式

阅读路径： 《商业模式新生代》 → 《客户开发入门》 → 《精益创业》 → 《从零到一》 → 《创新者的窘境》 → 《好战略，坏战略》

#### 48. 如何理解公司经营

阅读路径： 《创业维艰》 → 《财务智慧》 → 《竞争战略》 → 《从优秀到卓越》 → 《基业长青》 → 《原则》 → 《小米创业思考》

#### 49. 如何理解商业竞争与战略

阅读路径： 《竞争战略》 → 《好战略，坏战略》 → 《创新者的窘境》 → 《定位》 → 《规模》 → 《只有偏执狂才能生存》

#### 50. 如何理解平台与网络效应

阅读路径： 《平台革命》 → 《从零到一》 → 《规模》 → 《引爆点》 → 《竞争战略》 → 《监视资本主义时代》

### 7. 金钱、经济与消费

**二级组：财务常识 / 投资风险 / 经济运行 / 消费社会 / 阶层机会**

#### 51. 建立财务常识

阅读路径： 《小狗钱钱》 → 《巴比伦最富有的人》 → 《富爸爸穷爸爸》 → 《邻家的百万富翁》 → 《金钱心理学》 → 《财务自由之路》

#### 52. 如何理解投资风险

阅读路径： 《随机漫步的傻瓜》 → 《聪明的投资者》 → 《投资最重要的事》 → 《安全边际》 → 《黑天鹅》 → 《反脆弱》

#### 53. 如何理解经济运行

阅读路径： 《小岛经济学》 → 《像经济学家一样思考》 → 《经济学原理》 → 《置身事内》 → 《贫穷的本质》 → 《国富论》 → 《就业、利息和货币通论》

#### 54. 看懂消费主义

阅读路径： 《有闲阶级论》 → 《工作、消费主义和新穷人》 → 《娱乐至死》 → 《消费社会》 → 《债：第一个5000年》

#### 55. 如何理解财富、阶层与机会

阅读路径： 《邻家的百万富翁》 → 《贫穷的本质》 → 《稀缺》 → 《资本论》 → 《21世纪资本论》 → 《社会学的想象力》

#### 56. 如何理解行为经济学

阅读路径： 《助推》 → 《怪诞行为学》 → 《思考，快与慢》 → 《稀缺》 → 《金钱心理学》 → 《错误的行为》

边界说明：本领域只做阅读路径，不构成投资建议。

### 8. 社会、法律、历史与文明

**二级组：社会制度 / 法律公共生活 / 历史文明 / 技术与现代性 / 文学人文**

#### 57. 社会分层与共同生活

阅读路径： 《乡土中国》 → 《社会学的想象力》 → 《社会分工论》 → 《贫穷的本质》 → 《社会共通资本》 → 《城市的胜利》

#### 58. 如何理解公平与正义

阅读路径： 《公正》 → 《洞穴奇案》 → 《正义之心》 → 《正义论》 → 《论人类不平等的起源和基础》 → 《通往奴役之路》

#### 59. 如何识别制度与权力

阅读路径： 《权力》 → 《旧制度与大革命》 → 《权力与繁荣》 → 《通往奴役之路》 → 《法治及其本土资源》 → 《看得见的正义》

#### 60. 现代国家与官僚体系

阅读路径： 《旧制度与大革命》 → 《中国历代政治得失》 → 《法治及其本土资源》 → 《国家为什么会失败》 → 《置身事内》 → 《权力与繁荣》

#### 61. 如何建立法律常识

阅读路径： 《学点法律避点坑》 → 《洞穴奇案》 → 《看得见的正义》 → 《刑法学讲义》 → 《民法典与日常生活》 → 《法治及其本土资源》

边界说明：本主题只做阅读路径，不构成法律建议。

#### 62. 如何理解媒体、舆论与公共讨论

阅读路径： 《初识传播学》 → 《理解媒介》 → 《娱乐至死》 → 《注意力商人》 → 《乌合之众》 → 《事实》 → 《学会提问》

#### 63. 中国社会的现代转型

阅读路径： 《乡土中国》 → 《中国历代政治得失》 → 《万历十五年》 → 《中国近代史》 → 《叫魂》 → 《枢纽》 → 《置身事内》

#### 64. 中国历史入门

阅读路径： 《中国通史》 → 《中国历代政治得失》 → 《万历十五年》 → 《叫魂》 → 《中国近代史》 → 《枢纽》

#### 65. 如何理解世界历史

阅读路径： 《全球通史》 → 《人类简史》 → 《枪炮、病菌与钢铁》 → 《丝绸之路》 → 《大国的兴衰》 → 《世界秩序》

#### 66. 城市、空间与生活方式

阅读路径： 《美国大城市的死与生》 → 《城市的胜利》 → 《社会共通资本》 → 《乡土中国》 → 《工作、消费主义和新穷人》 → 《有闲阶级论》

#### 67. 如何理解文明兴衰

阅读路径： 《枪炮、病菌与钢铁》 → 《大国的兴衰》 → 《文明的冲突》 → 《国家为什么会失败》 → 《世界秩序》 → 《人类简史》

#### 68. 看懂平台、算法与注意力经济

阅读路径： 《娱乐至死》 → 《注意力商人》 → 《过滤泡》 → 《监视资本主义时代》 → 《算法霸权》 → 《平台革命》 → 《理解媒介》

#### 69. AI 技术变革读什么

阅读路径： 《技术的本质》 → 《必然》 → 《AI 2041》 → 《生命3.0》 → 《对齐问题》 → 《未来呼啸而来》

边界说明：本主题只讲技术范式和产业变化；治理与公共风险放在下一主题。

#### 70. 技术社会的伦理风险

阅读路径： 《技术的本质》 → 《娱乐至死》 → 《监视资本主义时代》 → 《算法霸权》 → 《对齐问题》 → 《开放社会及其敌人》

边界说明：本主题聚焦监控、算法偏见、治理和公共风险，不重复讲 AI 技术趋势。

#### 71. 文学阅读入门

阅读路径： 《如何阅读一本小说》 → 《小说面面观》 → 《文学理论入门》 → 《文学回忆录》 → 《文学的故事》 → 《文学讲稿》

#### 72. 如何理解政治自由与开放社会

阅读路径： 《论自由》 → 《自由论》 → 《开放社会及其敌人》 → 《通往奴役之路》 → 《人的境况》 → 《旧制度与大革命》

### 9. 健康、身体、意义与创造

**二级组：健康与身体 / 衰老与死亡 / 写作与表达 / 意义与创造**

#### 73. 如何建立健康生活方式

阅读路径： 《掌控习惯》 → 《我们为什么要睡觉》 → 《运动改造大脑》 → 《身体使用手册》 → 《精力管理》 → 《超越百岁》

#### 74. 面对衰老

阅读路径： 《超越百岁》 → 《最好的告别》 → 《我们为什么要睡觉》 → 《运动改造大脑》 → 《当呼吸化为空气》

#### 75. 如何理解运动与体能

阅读路径： 《无器械健身》 → 《ACSM健身与健康完全指南》 → 《身体使用手册》 → 《施瓦辛格健身全书》 → 《耐力》 → 《ACSM高级运动生理学》

#### 76. 如何理解饮食与代谢

阅读路径： 《营养学：概念与争论》 → 《我们为什么会生病》 → 《肥胖代码》 → 《深度营养》 → 《超越百岁》

复核说明：本主题涉及医学与营养争议，未来入库前必须复核证据质量和适用边界。

#### 77. 如何理解压力、恢复与身体信号

阅读路径： 《身体从未忘记》 → 《我们为什么要睡觉》 → 《运动改造大脑》 → 《身体使用手册》 → 《精力管理》 → 《超越百岁》

边界说明：本领域只做阅读路径，不替代医疗、营养或运动处方。

#### 78. 开始写作

阅读路径： 《写作这回事》 → 《写作的战争》 → 《字字珠玑》 → 《风格感觉》 → 《成为作家》 → 《小说写作指南》

#### 79. 如何讲好故事

阅读路径： 《故事》 → 《救猫咪》 → 《电影剧本写作基础》 → 《千面英雄》 → 《故事工程》 → 《小说课》

#### 80. 如何提升表达与演讲

阅读路径： 《金字塔原理》 → 《演讲的力量》 → 《关键对话》 → 《非暴力沟通》 → 《说服》 → 《沟通的本质》

#### 81. 如何做创意工作

阅读路径： 《像艺术家一样思考》 → 《写作的战争》 → 《最小阻力之路》 → 《创造力》 → 《艺术的故事》 → 《禅与摩托车维修艺术》

#### 82. 人生哲学入门

阅读路径： 《苏菲的世界》 → 《人生的智慧》 → 《沉思录》 → 《论语》 → 《道德经》 → 《尼各马可伦理学》 → 《悉达多》

#### 83. 如何理解幸福

阅读路径： 《幸福的方法》 → 《真实的幸福》 → 《心流》 → 《亲密关系》 → 《被讨厌的勇气》 → 《人生的智慧》

#### 84. 如何理解环境、气候与可持续生活

阅读路径： 《寂静的春天》 → 《增长的极限》 → 《小即是美》 → 《失控的农业》 → 《气候经济与人类未来》 → 《社会共通资本》

## Future Implementation Plan

### Task 1: Review and Lock One Batch

**Files:**

- Read: `docs/superpowers/plans/2026-06-01-topic-reading-panorama.md`
- Create: `docs/superpowers/plans/YYYY-MM-DD-topic-batch-N.md`

- [ ] Select one batch of 4-8 topics from this V5 panorama.
- [ ] For each selected topic, confirm whether it is new, replaces a published topic, renames a published topic, splits a published topic, or merges multiple published topics.
- [ ] Verify every selected topic has a final approved title and a final approved book list.
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

- The plan records 84 topic candidates across 9 domains.
- The 8 published topics are included in the same evaluation system and are not treated as immutable.
- The 8 published topics are marked as the first migration priority before adding more net-new public pages.
- The product topic is explicitly split into opportunity validation, product discovery, product 0-to-1, growth, and platform/network-effect themes.
- Topic book counts vary by problem complexity instead of forcing a fixed number.
- Topic titles use mixed reader-centered forms instead of a uniform `如何...` template.
- The plan allows future batches to update, split, merge, rename, redirect, or remove published topic files through explicit migration decisions.
- The plan requires every future approved topic recommendation to use `status: in_library`.
- The plan requires all books in an approved topic to be present in the book library before topic publication.
- The plan contains no open-ended example-based expansion rule for existing topics.
