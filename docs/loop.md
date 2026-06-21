# 环路工程（Loop Engineering）：AI 时代的自驱飞轮与工程实践

> “单次的推理只是瞬间的断面，持续的闭环才是滚滚向前的软件生命力。”

在 AI 辅助编程领域，技术的范式转换往往比想象中来得更快。2023 年，我们在讨论如何写出完美的提示词（Prompt Engineering）；2024 年，重点转向了为模型提供精准上下文（Context Engineering）；到了 2025 年，Harness Engineering（为 Agent 构建可靠工作环境的工程）开始火爆。

而在近期，一个更具颠覆性的概念在硅谷和开发者社区引发了广泛讨论：Loop Engineering（环路工程）。

正如 Anthropic Claude Code 负责人 Boris Cherny 所言：“我不再手动给 Claude 写提示词了。我跑了一堆 Loop 去提示它，让它自己判断接下来要做什么。我的工作变成了写 Loop。” OpenClaw 创始人 Peter Steinberger 也印证了这一点：“你不应该再亲自给 Coding Agent 写提示词了。你应当设计那些能够替你去提示 Agent 的循环系统。”

随后，Google 软件工程师 Addy Osmani 将这一实践方法论体系化。本章将深度拆解 Loop Engineering 的核心理念、底层架构，以及如何用极简的代码在真实业务中落地。


## 从 Harness 到 Loop 的升维

在传统的“提示词时代”，人机协作通常是开环（Open-Loop）的：你输入 Prompt，AI 吐出代码，对话结束。如果报错，你需要手动复制报错信息，重新提问。这种“人机乒乓球”模式的摩擦极大，人类成为了系统效能的瓶颈。

到了 Agent 时代，为什么我们开始抛弃像 LangGraph 这样的固定工作流框架，转向看似简单的 Loop？这不是哲学问题，是工程问题。

### 1. 智能重心的下放：模型变了

2024 年初，用 GPT-4（128K 上下文）做 Agent，工具调用的准确率大概只有 60%。你不把流程写死，Agent 就会迷路。因此，当时的 Workflow 框架本质上是“用代码画流程图”，人类负责规划，模型负责机械执行。

但到了 2025 年的 Claude 3.7，情况变了。如果给它同样的任务：

* 方式 A（LangGraph 预定义）：“写代码 → 跑测试 → 失败回退”写死在流程里。模型不知道为什么回来，只是机械重试。
* 方式 B（While 循环 + 详细 Prompt）：告诉模型目标，扔进循环。模型在循环中自己“看到”报错，自己决定怎么改。
结果是方式 B 更快，代码质量更高。 智能的重心从“框架设计层”转移到了“模型推理层”。

### 2. Ralph Loop：一行 Bash 的暴力美学

2025 年，开发者 Geoffrey Huntley 仅用一行 Bash 脚本，就开发了一个完整的编程语言项目，耗费了 297 美元 API 费：

```bash
while :; do cat PROMPT.md | claude; done

```

这个看似简陋得离谱的“Ralph Loop”，实则极其精妙：

- 每次循环上下文清零，避免了“对话太长模型胡说”。
- 进度和报错信息存在物理文件系统里，下一次循环模型直接读取。
这证明了：只要给智能体目标和纠错机会，极简的工程手段就能让 AI 的自主能力最大化。

### 3. Harness 与 Loop 的生态位对比

Harness（基座工程）解决的是“单次做对”，而 Loop 解决的是“持续做对”。

| 维度 | Harness（基座工程） | Loop（环路工程） |
|  |  |  |
| 核心目标 | 单次做对（规范动作） | 持续做对（达成目标） |
| 触发方式 | 手动启动 | 按时间、事件自动触发 |
| 执行周期 | 单次会话（Session） | 持续执行，跨会话（Cross-session） |
| 状态管理 | 存在于上下文（Context）中 | 物理固化在磁盘、文件或看板上 |
| 人类角色 | 操作者、命令下达者 | 设计者、规则制定者 |



## 核心架构

要设计一个不会无限空耗 Token 的健壮 Loop，需要巧妙组合以下架构模块：

1. Automations（自动化/调度）：循环的心跳。通过 `/loop` 命令、Cron 定时任务、Webhook 等方式设定启动节奏。例如 Claude Code 产品化的命令：`/loop 5m babysit all my PRs`（每 5 分钟检查一次 PR 并自动修复）。
2. Worktrees（工作树）：解决多 Agent 并行冲突。让 Agent 在隔离的 Git 分支目录中执行，共享历史却互不干扰。
3. Skills（技能）：固化领域知识与边界护栏。
4. Connectors / MCP（连接器）：连接外部世界的触角，接入 Issue 看板、API 或 Slack。
5. Sub-agents（子智能体）：实现角色分离。让一个 Agent 负责写代码（Maker），另一个独立 Agent 负责挑刺（Checker），形成质量控制机制。
6. 支撑——Memory（记忆层/状态层）：Loop 的“脊椎”。单次会话之外的持久化层（如 Markdown 变更日志），记录“已完成什么，还剩什么”，防止跨会话时循环迷失。



## 用 Claude Code 复刻“知识编译 Loop”

为了直观展示，我们以 Claude Code 为例，展示如何将个人知识库的维护变成一条自动运转的 Loop：从收集信息到生成每天早晨的洞见日报。

### 1. 前期准备与目录划分

在本地终端或 VS Code 初始化环境：

```bash
mkdir -p inbox raw wiki scripts worktree log
touch wiki/_changelog.md raw/_registry.md log/loop-run.log CLAUDE.md

```

* `inbox`：原始素材收纳箱；`raw`：筛选后待编译内容；`wiki`：最终知识库。

### 2. 配置核心 Skill 文件（规则拆分）

全局约束 (`CLAUDE.md`)：
定义项目分为分拣(triage)、编译(compile)、简报(briefing)三大环节，并划分 Maker 和 Verifier 角色。

三个专项技能文件：

* `@triage.md`：读取 `inbox/`，剔除广告，有效素材归档至 `raw/` 并登记在 `_registry.md`。清空已处理文件。
* `@compile.md`：读取 `raw/`，撰写 Wiki 存入 `wiki/`，在 `_changelog.md` 记录更新。清空 `raw/`。
* `@briefing.md`：读取日志生成当日简报至 `log/daily-brief.md`，并检查 Wiki 内断裂链接。

### 3. 配置双 Agent 校验（角色分离）

利用 Claude Code 多会话能力，编写 `scripts/compile-loop.sh` 杜绝“自审自改”：

```bash
#!/bin/bash
# 1. Maker 执行内容编译
claude "@compile.md" --worktree=worktree/maker

# 2. 独立 Verifier 执行强力校验
claude "按照 CLAUDE.md 校验 Wiki 词条关联与内容完整性，输出问题清单" --worktree=worktree/verifier

```

### 4. 搭建自动化调度（Automation）

配置 Linux/Mac 的 Crontab，实现每日早晨 6:03 自动触发全流程：

```bash
# 终端手动测试命令：
claude "/loop run triage then compile then briefing --worktree=worktree"

# Crontab 自动调度：
3 6 * * * cd /绝对路径/knowledge-base && claude "/loop run triage then compile then briefing --worktree=worktree" >> log/cron-run.log 2>&1

```

在实际运行中，该系统 2 个月自动过滤 200+ 篇素材，沉淀 50+ 核心概念。而他每天只需花 3 分钟查看 Briefing 报告。



## 安全卡点与设计铁律

将控制权交给 AI 是极其危险的，我们必须在循环中嵌入防线与熔断机制。

### 1. 自愈闭环与 Exit Code 0 黄金法则

当报错时，优秀的底座应当通过正则表达式或 AST 提取核心报错现场交回模型。
自愈循环必须遵循 Exit Code 0（零退出码）：只有类型检查、Lint 或测试脚本返回 `0` 时，才允许合拢执行 Git Commit。否则严禁交工。

### 2. 人类在环 (Human-in-the-Loop, HITL) 的三道闸门

* P (Planning) 计划期：审查 Agent 生成的步骤是否大包大揽、是否引入冗余依赖。
* E (Execution) 执行期：Review `Git Diff`，防范 AI 越权修改无关文件或脑补安全漏洞。
* T (Testing) 测试期：审查测试用例的覆盖率，防范 AI 为了“应试”而擅自篡改或删减测试用例。

### 3. 设计 Loop 的三个实用原则

1. 从小开始，逐步迭代：先跑通 Cron + Skill + Markdown 记忆层的极简逻辑，再引入外部数据源和复杂双 Agent。
2. Maker ≠ Checker：如果让 Agent 自己审核自己，为了走捷径它通常会判定“无需修改”（测试更新率仅 5%）。引入独立 Checker 后，更新转化率跃升至 30%。
3. 让沉默成为敌人：如果在后台卡死 3 次报错，必须触发 Webhook 告警，并通过日志（如 `_changelog.md`）显式输出。



## Loop 能否替代 Skill

那种“把固定流程封装起来”的死板 Skill 确实正在失去价值。因为真实的业务流程太复杂，固定顺序覆盖不了。但作为护栏和背景知识的 Skill 正在进化——“不能删生产数据库”、“金融口径问题注意点”。它们从操作指南变成了参考手册。

对普通开发者的 4 个切身建议：

1. 别再把 LangGraph 当必需品：除非你的场景需要严格合规和人工介入审批，否则一个 `while` 循环 + 详细 Prompt 就能搞定。
2. 写好 Prompt 胜过编排代码：5000 字包含约束与错误处理的详细操作手册，效果远好于 5000 行图谱编排代码，且维护成本极低。
3. 强行锁定版本安全网：启动复杂 Loop 前先留一个干净的 Git Commit。AI 一旦胡改，直接 `git reset --hard HEAD` 斩断崩坏循环。切忌让 AI 盲目打第二版、第三版错误补丁，这只会污染上下文。
4. 用最新最强的模型：用旧模型的弱智能力来倒推架构设计，就像在 2026 年用 DOS 思维写程序。

自动化是：“你告诉我每一步怎么做，我照做。”
智能化是：“我理解目标，然后自己想办法达成。”

Skill 是自动化的产物，而 Loop，正是走向工程智能的起点。未来的资深工程师，将不再是代码行数的产出者，而是整个闭环反馈系统的顶层设计师。