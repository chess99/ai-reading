# Topic Reading Panorama Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Archive a reviewable full-spectrum topic reading roadmap that expands beyond the current 8 published topics and can be reviewed before any Markdown topic articles are created.

**Architecture:** This document is the source planning artifact for future topic batches. It defines a 12-domain, 48-topic panorama, with complete candidate book lists for each topic. After review approval, future implementation must create missing book entries first, then publish topic Markdown with every recommended book linked as `in_library`.

**Tech Stack:** Markdown planning document in `docs/superpowers/plans/`; future implementation uses the existing `topics/*.md` content model, Next.js static generation, and existing topic validation tests.

---

## Review Status

This plan is not approved for implementation yet. It is an archived draft for later content review.

The existing 8 published topics remain unchanged in this plan:

- `如何做重大决策`
- `如何理解系统与复杂性`
- `如何建立可持续习惯`
- `如何识别偏见与群体影响`
- `从0到1做产品`
- `如何理解亲密关系`
- `如何面对创伤与自我修复`
- `如何提高深度工作能力`

Future topic implementation must not create duplicate or near-duplicate replacements for these 8 topics. If a future topic overlaps one of these 8, it must be renamed to answer a different primary question before implementation.

## Source Signals

The panorama borrows category signals from public knowledge-service platforms, then converts them into problem-driven reading themes.

- 得到：lifelong learning, business, management, product thinking, finance, history, modern thought, and daily book listening.
- 帆书/樊登读书：mindset, management, workplace, family, humanities, entrepreneurship, psychology, parenting, investment, social science, and health.
- 喜马拉雅：health psychology, daily life, children growth, learning motivation, humanities, social science, business finance, history, parenting, and relationships.

Reference links:

- [得到 App Store](https://apps.apple.com/kg/app/%E5%BE%97%E5%88%B0-%E8%AF%BE%E7%A8%8B%E5%90%AC%E4%B9%A6%E7%94%B5%E5%AD%90%E4%B9%A6/id1016323413)
- [帆书书籍解读](https://www.fanshu.cn/intro/read)
- [帆书延伸学习](https://www.fanshu.cn/intro/learn)
- [喜马拉雅有声阅读报告](https://biz.tom.com/202404/1840213107.html)

## Non-Negotiable Content Rules

- Topic titles must be real reader questions in the form `如何...`.
- Approved topics must use `status: in_library` for every recommendation.
- Before publishing an approved topic, every recommended book must either already exist in `books/` or be added to `books/` with a valid slug.
- Published topic Markdown must use `status: in_library` for every book recommendation.
- Each topic uses 5-8 books according to the size of the problem. Do not force all lists to the same length.
- The order of books in a topic is intentional: entry book first, then core framework, then expansion, then practice or reflection.
- Book titles use common Chinese names. Author names and final slugs are verified during the future implementation batch.
- Medical, mental health, legal, and investment topics must include a reader-facing boundary note in the article body.

## Division Review

The 12-domain structure is retained, but the boundaries are sharpened:

- `个人成长与自我管理` handles self-understanding, attention, learning, time, and habit systems.
- `心理、情绪与关系` handles inner experience and adult relationships. Parenting topics stay out of this domain.
- `家庭、亲子与教育` handles parent-child relationships, development, adolescence, and home learning environments.
- `职场、管理与组织` handles individual careers, teams, management, and organizational systems.
- `商业、创业与产品` handles value creation, customers, product, marketing, growth, and company building.
- `金钱、投资与经济` handles personal finance, investment risk, economic logic, and consumption systems.
- `社会、法律与公共生活` handles social structure, public institutions, justice, power, and everyday legal literacy.
- `历史、人文与文明` handles historical explanation, civilization, literature, culture, and media.
- `科学、技术与未来` handles scientific thinking, technological change, information environments, and uncertainty.
- `健康、身体与生活方式` handles sleep, nutrition, exercise, aging, and embodied wellbeing.
- `写作、表达与创造` handles writing, storytelling, speaking, and creative practice.
- `哲学、意义与人生` handles freedom, responsibility, suffering, happiness, and life philosophy.

## Panorama

### 1. 个人成长与自我管理

#### 1. 如何建立自我认知

阅读路径： 《被讨厌的勇气》 → 《自卑与超越》 → 《终身成长》 → 《思考，快与慢》 → 《原则》 → 《自我分析》

#### 2. 如何停止精神内耗

阅读路径： 《也许你该找个人聊聊》 → 《伯恩斯新情绪疗法》 → 《幸福的陷阱》 → 《自卑与超越》 → 《不原谅也没关系》 → 《当下的力量》

#### 3. 如何管理时间与精力

阅读路径： 《精力管理》 → 《搞定》 → 《精要主义》 → 《深度工作》 → 《高效能人士的七个习惯》 → 《慢生产力》

#### 4. 如何长期坚持学习

阅读路径： 《如何阅读一本书》 → 《认知天性》 → 《学习之道》 → 《刻意练习》 → 《心流》 → 《掌控习惯》

### 2. 心理、情绪与关系

#### 5. 如何理解情绪

阅读路径： 《蛤蟆先生去看心理医生》 → 《情绪急救》 → 《伯恩斯新情绪疗法》 → 《身体从未忘记》 → 《我们为什么要睡觉》

#### 6. 如何建立稳定的自尊

阅读路径： 《被讨厌的勇气》 → 《自尊》 → 《自卑与超越》 → 《终身成长》 → 《也许你该找个人聊聊》 → 《不原谅也没关系》

#### 7. 如何处理冲突与沟通

阅读路径： 《沟通的本质》 → 《非暴力沟通》 → 《关键对话》 → 《高难度谈话》 → 《谈判力》 → 《影响力》

#### 8. 如何识别有毒关系

阅读路径： 《亲密关系》 → 《依恋》 → 《煤气灯效应》 → 《情绪勒索》 → 《身体从未忘记》 → 《不原谅也没关系》

### 3. 家庭、亲子与教育

#### 9. 如何做足够好的父母

阅读路径： 《园丁与木匠》 → 《正面管教》 → 《游戏力》 → 《如何说孩子才会听，怎么听孩子才肯说》 → 《孩子，把你的手给我》 → 《读懂孩子的心》

#### 10. 如何陪孩子建立安全感

阅读路径： 《依恋》 → 《给孩子一生的安全感》 → 《童年的秘密》 → 《完整的成长》 → 《孩子：挑战》 → 《最温柔的教养》

#### 11. 如何理解青春期

阅读路径： 《解码青春期》 → 《与青春期和解》 → 《养育男孩》 → 《养育女孩》 → 《孩子，把你的手给我》

#### 12. 如何打造家庭学习环境

阅读路径： 《朗读手册》 → 《打造儿童阅读环境》 → 《如何阅读一本书》 → 《好妈妈胜过好老师》 → 《终身幼儿园》

### 4. 职场、管理与组织

#### 13. 如何成为有效管理者

阅读路径： 《卓有成效的管理者》 → 《管理的实践》 → 《经理人员的职能》 → 《领导梯队》 → 《可复制的领导力》 → 《高绩效教练》

#### 14. 如何做好团队协作

阅读路径： 《团队协作的五大障碍》 → 《关键对话》 → 《横向领导力》 → 《无畏的组织》 → 《赋能》 → 《重新定义团队》

#### 15. 如何理解组织运转

阅读路径： 《组织行为学》 → 《科学管理原理》 → 《走出危机》 → 《丰田之道》 → 《精益思想》 → 《原则》

#### 16. 如何做职业选择

阅读路径： 《远见》 → 《你的降落伞是什么颜色》 → 《优秀到不能被忽视》 → 《一人企业》 → 《每周工作4小时》

### 5. 商业、创业与产品

#### 17. 如何理解商业模式

阅读路径： 《商业模式新生代》 → 《从零到一》 → 《精益创业》 → 《创新者的窘境》 → 《定位》 → 《好战略，坏战略》

#### 18. 如何做用户研究

阅读路径： 《用户体验要素》 → 《设计心理学》 → 《客户开发入门》 → 《用户故事地图》 → 《精益产品手册》 → 《启示录》

#### 19. 如何做增长与营销

阅读路径： 《定位》 → 《影响力》 → 《引爆点》 → 《增长黑客》 → 《营销管理》 → 《病毒式循环》

#### 20. 如何理解公司经营

阅读路径： 《创业维艰》 → 《小米创业思考》 → 《从优秀到卓越》 → 《基业长青》 → 《原则》 → 《艰难的事》

### 6. 金钱、投资与经济

#### 21. 如何建立财务常识

阅读路径： 《小狗钱钱》 → 《富爸爸穷爸爸》 → 《邻家的百万富翁》 → 《金钱心理学》 → 《投资最重要的事》 → 《穷查理宝典》

#### 22. 如何理解投资风险

阅读路径： 《随机漫步的傻瓜》 → 《聪明的投资者》 → 《投资最重要的事》 → 《安全边际》 → 《黑天鹅》 → 《反脆弱》

#### 23. 如何理解经济运行

阅读路径： 《小岛经济学》 → 《经济学原理》 → 《国富论》 → 《就业、利息和货币通论》 → 《政治经济学及赋税原理》 → 《置身事内》

#### 24. 如何理解消费主义

阅读路径： 《有闲阶级论》 → 《工作、消费主义和新穷人》 → 《娱乐至死》 → 《消费社会》 → 《债：第一个5000年》

### 7. 社会、法律与公共生活

#### 25. 如何理解社会结构

阅读路径： 《乡土中国》 → 《社会分工论》 → 《社会共通资本》 → 《城市的胜利》 → 《枪炮、病菌与钢铁》 → 《人的境况》

#### 26. 如何理解公平与正义

阅读路径： 《公正》 → 《洞穴奇案》 → 《正义之心》 → 《正义论》 → 《论人类不平等的起源和基础》 → 《通往奴役之路》

#### 27. 如何识别制度与权力

阅读路径： 《乌合之众》 → 《服从权威》 → 《路西法效应》 → 《旧制度与大革命》 → 《权力与繁荣》 → 《人的境况》

#### 28. 如何建立法律常识

阅读路径： 《学点法律避点坑》 → 《洞穴奇案》 → 《看得见的正义》 → 《刑法学讲义》 → 《民法典与日常生活》 → 《法治及其本土资源》

### 8. 历史、人文与文明

#### 29. 如何理解中国历史

阅读路径： 《中国历代政治得失》 → 《万历十五年》 → 《叫魂》 → 《中国近代史》 → 《曾国藩传》 → 《枢纽》

#### 30. 如何理解世界历史

阅读路径： 《全球通史》 → 《人类简史》 → 《枪炮、病菌与钢铁》 → 《丝绸之路》 → 《文明的冲突》 → 《世界秩序》

#### 31. 如何读懂经典文学

阅读路径： 《如何阅读一本小说》 → 《文学回忆录》 → 《月亮与六便士》 → 《傲慢与偏见》 → 《红与黑》 → 《平凡的世界》

#### 32. 如何理解文化与传播

阅读路径： 《初识传播学》 → 《理解媒介》 → 《娱乐至死》 → 《童年的消逝》 → 《乌合之众》 → 《我们赖以生存的隐喻》

### 9. 科学、技术与未来

#### 33. 如何建立科学思维

阅读路径： 《学会提问》 → 《别逗了费曼先生》 → 《世界观》 → 《科学革命的结构》 → 《无穷的开始》 → 《思维模型》

#### 34. 如何理解 AI 与技术变革

阅读路径： 《技术的本质》 → 《必然》 → 《未来呼啸而来》 → 《智能时代》 → 《生命3.0》 → 《AI 3.0》

#### 35. 如何应对信息过载

阅读路径： 《娱乐至死》 → 《注意力商人》 → 《事实》 → 《学会提问》 → 《清单革命》 → 《深度工作》

#### 36. 如何面对未来不确定性

阅读路径： 《超级预测》 → 《黑天鹅》 → 《反脆弱》 → 《未来简史》 → 《今日简史》 → 《原则》

### 10. 健康、身体与生活方式

#### 37. 如何建立健康生活方式

阅读路径： 《掌控习惯》 → 《我们为什么要睡觉》 → 《深度营养》 → 《身体使用手册》 → 《运动改造大脑》 → 《超越百岁》

#### 38. 如何理解运动与体能

阅读路径： 《无器械健身》 → 《ACSM健身与健康完全指南》 → 《身体使用手册》 → 《施瓦辛格健身全书》 → 《耐力》 → 《ACSM高级运动生理学》

#### 39. 如何理解饮食与代谢

阅读路径： 《深度营养》 → 《我们为什么会生病》 → 《肥胖代码》 → 《救命饮食》 → 《超越百岁》

#### 40. 如何面对衰老与死亡

阅读路径： 《最好的告别》 → 《当呼吸化为空气》 → 《活好》 → 《相约星期二》 → 《超越百岁》 → 《生死课》

### 11. 写作、表达与创造

#### 41. 如何开始写作

阅读路径： 《写作这回事》 → 《写作的战争》 → 《字字珠玑》 → 《风格感觉》 → 《成为作家》 → 《小说写作指南》

#### 42. 如何讲好故事

阅读路径： 《故事》 → 《救猫咪》 → 《电影剧本写作基础》 → 《千面英雄》 → 《故事工程》 → 《小说课》

#### 43. 如何提升表达与演讲

阅读路径： 《高情商聊天术》 → 《金字塔原理》 → 《演讲的力量》 → 《说服》 → 《关键对话》 → 《非暴力沟通》

#### 44. 如何做创意工作

阅读路径： 《像艺术家一样思考》 → 《写作的战争》 → 《最小阻力之路》 → 《创造力》 → 《艺术的故事》 → 《禅与摩托车维修艺术》

### 12. 哲学、意义与人生

#### 45. 如何理解自由与责任

阅读路径： 《被讨厌的勇气》 → 《论自由》 → 《存在主义是一种人道主义》 → 《人的境况》 → 《通往奴役之路》 → 《有限与无限的游戏》

#### 46. 如何面对人生低谷

阅读路径： 《也许你该找个人聊聊》 → 《活出生命的意义》 → 《当下的力量》 → 《不原谅也没关系》 → 《最小阻力之路》 → 《反脆弱》

#### 47. 如何建立人生哲学

阅读路径： 《人生的智慧》 → 《论语》 → 《道德经》 → 《沉思录》 → 《尼各马可伦理学》 → 《悉达多》

#### 48. 如何理解幸福

阅读路径： 《幸福的方法》 → 《真实的幸福》 → 《心流》 → 《亲密关系》 → 《被讨厌的勇气》 → 《最好的告别》

## Future Implementation Plan

### Task 1: Review and Lock One Batch

**Files:**

- Read: `docs/superpowers/plans/2026-06-01-topic-reading-panorama.md`
- Create: `docs/superpowers/plans/YYYY-MM-DD-topic-batch-N.md`

- [ ] Select one batch of 4-8 topics from this panorama.
- [ ] Remove any topic whose primary question duplicates the existing 8 published topics.
- [ ] Verify every selected topic has a final approved title and a final approved book list.
- [ ] Record review notes in a new batch implementation plan.

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

- Create: `topics/<slug>.md`
- Update: `.nextjs-site/tests/topics-content.test.mjs`

- [ ] Create one topic Markdown file per approved topic.
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

- `/topics/` shows the new approved topics.
- Every new topic detail page renders the guide body.
- Every recommended book has a working `阅读提炼` link.
- No topic page displays any non-library status label.
- `/sitemap.xml` includes every new topic URL.

### Task 5: Commit the Batch

**Commands:**

```bash
git status --short
git add books book-scores.md topics .nextjs-site/tests/topics-content.test.mjs
git commit -m "feat: add topic reading batch N"
```

Only stage and commit files created or modified by that implementation batch. Preserve unrelated user changes.

## Self-Review Checklist

- The plan records 48 new topic candidates across 12 domains.
- The plan excludes implementation changes to the existing 8 published topics.
- The plan requires every future approved topic recommendation to use `status: in_library`.
- The plan requires all books in an approved topic to be present in the book library before topic publication.
- The plan contains no open-ended example-based expansion rule for existing topics.
