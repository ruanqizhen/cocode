# 环路工程（Loop Engineering）

> “流水不腐，户枢不蠹。” ——《吕氏春秋》

在 AI 辅助编程领域，技术的范式转换往往比想象中来得更快。2023 年，我们在讨论如何写出完美的提示词（Prompt Engineering）；2024 年，重点转向了为模型提供精准上下文（Context Engineering）；到了 2025 年，Harness Engineering（为 Agent 构建可靠工作环境的工程）开始火爆。

而在近期，一个更具颠覆性的概念在开发者社区引发了广泛讨论：Loop Engineering（环路工程）。

正如 Anthropic Claude Code 负责人 Boris Cherny 所言：“我不再手动给 Claude 写提示词了。我跑了一堆 Loop 去提示它，让它自己判断接下来要做什么。我的工作变成了写 Loop。” OpenClaw 创始人 Peter Steinberger 也印证了这一点：“你不应该再亲自给 Coding Agent 写提示词了。你应当设计那些能够替你去提示 Agent 的循环系统。”随后，Google 软件工程师 Addy Osmani 将这一实践方法论体系化。

本章将深度拆解 Loop Engineering 的核心理念、底层架构，以及如何用极简的代码在真实业务中落地。


## 从 Harness 到 Loop 的升维

在早期的“提示词时代”，人机协作通常是开环（Open-Loop）的：你输入 Prompt，AI 吐出代码，对话就结束了。AI 甚至不知道这段代码到底能不能跑，它没有执行环境，看不到结果。

于是验证的活儿全落在你身上：把代码复制到编辑器、运行、看到报错、再把报错信息复制回对话框、重新提问。AI 生成一次要几秒，你完成这一圈要几分钟。整个系统的效率就卡在你这一环上。人成了整个系统的瓶颈。

Agent 时代要解决的就是这件事：把这个循环交给机器自己跑。AI 写代码 → 自己执行 → 自己看到报错 → 自己修改 → 再执行，直到跑通。这就是闭环。

有意思的是，实现这个闭环的方式，正在从复杂变回简单。早期大家用的是固定工作流框架：开发者事先画好状态图，规定“第一步做什么、什么条件下走哪个分支”，把 Agent 的行为路径设计得清清楚楚。而现在越来越多的 Agent 回到了一个朴素的 Loop：不预设任何路径，只反复执行“思考 → 调用工具 → 观察结果”，让模型自己决定每一步干什么。

为什么？因为模型变强了。当模型已经能自己判断“哪里错了、下一步该怎么办”时，你精心画的那张流程图就不再是帮助，而是束缚：它把模型能走的路限制在你想到的那几条上，而任何没预料到的情况，都得回去改图。

所以这个转向不是审美之争，而是工程结论：简单的 Loop 在真实任务上跑得更好、也更好维护。

### 1. 智能重心的下放：模型变了

2024 年初，用当时最强的模型 GPT-4（128K 上下文）做 Agent，工具调用的准确率大概只有 60%。你不把流程写死，Agent 就会迷路。因此，当时的 Workflow 框架本质上是“用代码画流程图”，人类负责规划，模型负责机械执行。

但到了 2025 年，新模型的准确率大大提高，如果给它同样的任务，告诉模型目标，扔进循环。模型在循环中自己“看到”报错，自己决定怎么改。这种方式模型不再会出错，并且运行更快，代码质量更高。 智能的重心从“框架设计层”转移到了“模型推理层”。

### 2. Ralph Loop：一行 Bash 的暴力美学

2025 年，开发者 Geoffrey Huntley 仅用一行 Bash 脚本，就开发了一个完整的编程语言项目，耗费了 297 美元的 API 费用：

```bash
while :; do cat PROMPT.md | claude -p; done
```

先解释一下这行代码：

| 片段 | 含义 |
| --- | --- |
| `while :` | `:` 是 shell 里永远返回真的空命令，所以这是一个无限循环 |
| `cat PROMPT.md` | 把一个叫 `PROMPT.md` 的文件内容打印出来 |
| `\| claude -p` | 通过管道把内容喂给 Claude 命令行工具。`-p` 让它以非交互模式运行（读 stdin、输出结果、退出），不进入需要人打字的界面 |
| `done` | 回到开头，再来一遍 |

翻译成人话：反复地把同一份任务说明书交给 AI，一遍又一遍，永不停止。

为什么“重复读同一个文件”不是在做无用功？这是一个反直觉的地方。既然每次输入都一样，为什么输出不是一样的？

因为每一轮循环之间，外部环境都在发生变化。上一轮 AI 干的活：创建的源文件、跑测试留下的日志、写进 TODO 里的进度，全都留在磁盘上。下一轮它启动后， AI 会先去读这些文件，于是看到的是一个已经被推进过的项目，自然会接着往下做而不是从头开始。

所以我们也可以想想得到，在 `PROMPT.md` 文件里写的不是“请实现 XXX”这种一次性指令，而是一份长期工作守则，比如：“你的目标是实现 X。先看 `TODO.md` 了解进度，再看最近的测试输出。挑一件还没做完的事去做，做完更新 `TODO.md`。”

### 3. Harness 与 Loop 的生态位对比

Harness（基座工程）解决的是“单次做对”，而 Loop 解决的是“持续做对”。

| 维度 | Harness（基座工程） | Loop（环路工程） |
| --- | --- | --- |
| 核心目标 | 单次做对（规范动作） | 持续做对（达成目标） |
| 触发方式 | 手动启动 | 按时间、事件自动触发 |
| 执行周期 | 单次会话（Session） | 持续执行，跨会话（Cross-session） |
| 状态管理 | 存在于上下文（Context）中 | 物理固化在磁盘、文件或看板上 |
| 人类角色 | 操作者、命令下达者 | 设计者、规则制定者 |



## 核心架构

如果要让 AI Agent 进入“自动循环干活”状态，又不至于失控、重复劳动、把 Token 烧光，那么需要把 AI Agent 分成几个模块。把这个 Loop 想象成一个小团队在值班，每个架构模块负责解决一个具体的失控风险。
 

1. Automations（自动化/调度）：循环的心跳。决定“什么时候干活”。没有心跳，Loop 要么一直空转浪费 Token，要么没人叫醒它。常见做法是利用定时任务，例如“每 5 分钟检查一次”；或者利用 Webhook 事件触发（有新 PR 才跑）；或者自定义 Skill 做定时检查。`/loop` 不是 Claude Code 的内置命令，想做循环得自己用 Cron、`/tasks` 或脚本去搭。
2. Worktrees（工作树）：解决多 Agent 并行冲突。多个 Agent 同时改代码，最容易互相覆盖、冲突。Git worktree 让每个 Agent 在独立的目录和分支里工作，共享同一份提交历史，但文件系统互不干扰。在 Claude Code 里这是通过 EnterWorktree 工具或 git worktree 命令实现的。
3. Skills（技能）：固化领域知识与边界护栏。把“这个项目该怎么做、不该做什么”固化下来。比如代码规范、测试流程、禁止直接 push main 分支。Skill 让每次循环启动的 Agent 不用重新学习，直接加载同一套行为约束，减少犯错和返工。
4. Connectors / MCP（连接器）：连接外部世界的触角。Loop 不能只活在终端里。它需要读到外部世界的状态：GitHub Issue、Jira 看板、Slack 消息、CI 结果。MCP 就是统一的接入协议，让 Agent 能查询和操作这些外部系统，形成“感知-行动”闭环。
5. Sub-agents（子智能体）：实现角色分离。一个 Agent 既写代码又自己审查，很容易自我认同、放过 bug。拆成 Maker（负责写）和 Checker（负责挑刺）两个角色，Checker 独立评审，不通过就打回。这是一种轻量质量门禁，也是防止 Loop 自我欺骗的关键。
6. Memory（记忆层/状态层）：Loop 的“脊椎”。单次会话结束后，Agent 会失忆。如果没有持久化状态，下一次循环醒来会重复做已经做完的事，这就是“无限空耗 Token”的主要来源。保存记忆的方法通常很朴素：用 Markdown 文件（如 PROGRESS.md、CHANGELOG.md、TODO.md）记录“做完了什么、还剩什么、当前卡在哪里”。每次循环先读记忆，再决定要不要干活、干哪一步。


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

利用 Claude Code 多会话与 Worktree 隔离能力，编写 `scripts/compile-loop.sh` 杜绝“自审自改”：

```bash
#!/bin/bash
# 1. Maker 执行内容编译（通过 EnterWorktree 或 git worktree 隔离）
# 先创建隔离工作区：git worktree add worktree/maker -b maker-work && cd worktree/maker
claude -p "根据 .claude/skills/compile/SKILL.md 编译知识库内容"

# 2. 独立 Verifier 执行强力校验（另一隔离工作区）
# git worktree add worktree/verifier -b verifier-work && cd worktree/verifier
claude -p "按照 CLAUDE.md 校验 Wiki 词条关联与内容完整性，输出问题清单"

```

> **修正说明：** 原示例中的 `claude "@compile.md" --worktree=...` 并非真实 CLI 语法，`--worktree` flag 不存在，`@` 引用 Skill 的写法也非官方。正确方式是通过 `git worktree` 隔离目录 + `claude -p "提示"` 或交互式 `/skills` 调用。

### 4. 搭建自动化调度（Automation）

配置 Linux/Mac 的 Crontab，实现每日早晨 6:03 自动触发全流程：

```bash
# 终端手动测试命令（进入项目目录后，执行完整流水）
cd /home/YOU/knowledge-base && claude -p "执行 triage -> compile -> briefing 流水线"

# Crontab 自动调度（示例路径需替换为真实绝对路径）
3 6 * * * cd /home/YOU/knowledge-base && claude -p "执行 triage、compile、briefing 全流程" >> log/cron-run.log 2>&1

```

> **注意：** `/loop run ...` 并非 Claude Code 内置命令，定时调度可通过系统 Cron + `claude -p` 或自定义 Skill + 自动化脚本实现；`/绝对路径/` 为中文占位符，请替换为英文真实路径。

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
