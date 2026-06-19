# 项目宪法

> 雇用一个技术超群但每天清空记忆的“赛博承包商”，你最需要的是一张挂在办公室门口、写满关键红线的白板——这就是项目宪法。

在与大语言模型（LLM）结对编程时，我们必须直面一个冷酷的技术现实：LLM 本质上是完全无状态的。模型的权重在训练完成后即被冻结，它不会随着时间自动学习你的项目习惯。在每一次全新的会话（Session）开始时，它对你庞大的代码库一无所知。

为了让这颗“失忆的大脑”能够迅速进入工作状态，各大 AI 开发工具都推出了属于自己的项目级系统指令规范。本章将以 Claude Code 的 CLAUDE.md 为核心全景案例，系统拆解规则文件的编写哲学与结构设计，并横向扩展至其他主流 AI 工具的规则机制，帮助你搭建起坚固的团队铁律防线。


## CLAUDE.md 完全指

我们首先以 Claude Code 为例，在它所有的上下文中，`CLAUDE.md` 文件可以说是我们能掌控的权重最高的一个文件。它是会被默认注入到每一次对话中的基础上下文，它用得好不好，直接决定了 Claude Code 的工作质量。

### 为 AI 打造“入职引导”

`CLAUDE.md` 的本质作用是把 Claude 引导（Onboard）到你的代码库中，就像给一个新入职的资深工程师做项目介绍。高效的入职引导必须清晰回答以下三个维度的问题：

| 维度 | 内容 | 说明 |
| --- | --- | --- |
| WHAT（是什么） | 技术栈、项目结构、代码地图 | 告诉 Claude 项目用了什么技术，各部分在哪里。当代码库中有很多项目时，这一点尤其重要。 |
| WHY（为什么） | 项目目的、架构关键约定 | 让 Claude 理解项目的目标设计意图，防止跨多文件重构时改坏。 |
| HOW（怎么做） | 工作方式、验证方法 | 告诉 Claude 如何运行测试、类型检查、编译，使其实现“自主执行与自我验证”。 |


### 核心构建原则

#### 1. 少即是多（Less is More）与 ROI 模型

很多人倾向于把所有可能用到的命令、代码规范、风格指南全塞进规则文件里，这是严重的工程错误。这是因为：

- 指令遵循有上限：前沿思考型 LLM 能够相对一致地遵循约 150-200 条指令。超过这个数量，遵循质量会剧烈下降（小模型呈指数级衰减，大模型呈线性衰减）。
- 上下文稀释：Claude Code 系统提示已占用约 50 条指令（近三分之一的可靠遵循能力）。此外，Claude 在注入文件时会收到系统提醒，自动忽略其认为“不相关”的内容。如果塞满杂讯，可能导致重要指令一并被忽略。
- 规则的投资回报率（ROI）：根目录规则文件必须保持在 200 行以内（Anthropic 官方推荐 < 200 行，社区共识 < 300 行）。我们必须根据 ROI 精挑细选写入的每一行：

| ROI 评级 | 规则类型 | 技术说明 | 典型示例 |
| --- | --- | --- | --- |
| ⭐⭐⭐⭐⭐ | 构建/运行/测试命令 | 自动执行性价比最高，Agent 必须直接复制在终端无感运行。 | `make install` / `pnpm test` |
| ⭐⭐⭐⭐ | 架构决策背景 (WHY) | 说明特定约定的设计意图，约束 AI 的重构逻辑。 | `“代码按 Feature 组织而非传统 MVC”` |
| ⭐⭐⭐⭐ | 技术栈硬性约定 (WHAT) | 强行规定禁用的轮子或必须使用的统一安全组件。 | `“禁止使用 Moment.js，统一用 date-fns”` |
| ⭐ | Linter 已覆盖的风格规则 | 几乎没有价值。不要派 LLM 去干 Linter 的活，又慢又贵。 | `“缩进使用 2 空格”`（由 Prettier 负责） |
| ❌ | 冗长的散文说明 | 负资产，严重稀释模型的注意力矩阵。 | 啰唆的项目历史背景与感性描述 |

#### 2. “指令优先”原则

人类日常交流习惯使用带有感情色彩和模糊的词汇（如“尽量简洁一点”）。对于严密的软件开发，这种含糊的描述只会放大 AI 的幻觉。必须改用高强度、结构化、无歧义的条件触发命令。

- 错误的模糊措辞（低效）：`“请帮我写个工具函数把时间格式化一下，最好优雅、简单一点，谢谢。”`
- 正确的指令优先（高效）：
```
Rules:
1. 函数签名必须为：`export function formatDateTime(isoStr: string, pattern: string): string`
2. 内部实现仅允许使用原生 `Intl.DateTimeFormat`，严禁引入 `moment.js` 或 `dayjs`。
3. 必须通过 100% 的单元测试。如果格式非法，必须显式抛出 `InvalidTimeFormatError`。
```


#### 3. 内容甄选清单

检验每一行的标准：问自己——“如果我删掉这一行，Claude 会犯错吗？”如果不会，就删掉它。

| ✅ 应该包含 | ❌ 应该排除 |
| --- | --- |
| 项目背景（1-2 行立即定位技术栈） | 标准语言约定（Claude 已经知道 TypeScript 的写法） |
| 核心命令（Claude 需运行的确切字符串） | 详细的 API 文档（应当用链接或 @imports 代替） |
| 架构/目录地图（告诉 AI 代码在哪里） | Linter 能强制执行的代码风格（交给确定性工具） |
| 非默认约定（只写 Claude 猜不到的怪癖规则） | 逐文件的代码库描述（AI 可以自己读文件） |
| 常见陷阱/反模式（防止重复犯错） | “写干净的代码”这类废话（不言自明，浪费 Token） |
| 工作流规则（如特定的分支命名规范） | 频繁变化的信息（会过期，造成混乱） |



### 渐进式披露（Progressive Disclosure）

这是解决长文本规则跨越水位线、避免 AI 记忆迷失的最强大技巧：把任务相关的知识放在 `CLAUDE.md` 之外，只在需要时才加载。

不要把所有关于构建、测试、约定的指令都塞进主文件，而是把它们拆分到独立的、命名清晰的 Markdown 文件中（优先使用 `file:line` 指针指向权威代码，而非直接粘贴容易过期的代码片段）：

```text
agent_docs/
├── building_the_project.md
├── running_tests.md
├── code_conventions.md
└── database_schema.md

```

然后在 `CLAUDE.md` 中只放一个带说明的列表，并配上“何时阅读”的触发条件：

```markdown
## 参考文档

### API 架构 — `@docs/api-architecture.md`
何时阅读： 添加或修改 API 端点时

### 内容 SEO 规范 — `@docs/CONTENT-SEO-SOP.md`
何时阅读： 创建或编辑任何内容页面时

```

#### Claude Code 提供的渐进式披露与分层机制

- @imports 语法：在主宪法中用 `@path/to/file.md` 按需引入外部文件（支持递归 5 层）。
- `.claude/rules/` 目录：此目录下的 Markdown 文件会与 `CLAUDE.md` 同优先级自动加载，最适合团队级编码规则和审查清单。
- `.claude/skills/` 目录：技能文件包含元数据，AI 会根据任务相关性按需自动发现与加载。
- 局部目录层级继承：Claude Code 会从多个位置加载规则。你可以将共享约定放在根目录，将特定服务上下文放在子目录。例如在 `src/features/billing/CLAUDE.md` 中写入针对计费模块的局部硬约束，当 AI 穿行进入该目录时会自动激活，不会污染全局上下文。


### 四、 生产级 CLAUDE.md 结构模板

```markdown
# Vanish Project Protocol
一个面向高并发场景的项目管理 SaaS 核心后端。

## 1. 命令 (最高 ROI 核心区)
```bash
pnpm install                  # 安装依赖
uvicorn src.main:app --reload # 启动开发服务器
pytest                        # 运行后端测试
pnpm test                     # 运行前端测试
pnpm typecheck                # 静态类型检查
black . && ruff check . --fix # 代码格式化与修复

```

## 2. 项目结构

```
src/
  features/    # 代码严格按功能模块组织，包含专属 router、service、schema
  models/      # 全局公共数据模型
docs/          # 项目长篇文档与架构说明

```

## 3. 架构说明与关键约定

* 数据库操作仅在 `*_repository.py` 中进行，严禁在 router 路由层直接操纵 DB 实例。
* 所有的 API 响应结构，必须使用统一的 `ApiResponse[T]` 包装类型封装输出。
* [只列非默认、Claude 不被告知就会做错的特定模式]

## 4. 🚫 反模式禁区 (Anti-Patterns)

* 不要修改 `alembic/versions/` 中已经物理递交的数据库旧迁移文件。
* 单文件绝对禁止超过 300 行，超出时必须强制进行模块化拆分。
* 严禁引入 `moment.js` 或 `jQuery`。

## 5. 参考文档

### API 设计规范 — `@docs/api-design.md`

何时阅读： 修改或新增 API 路由与端点时

```


### 规则文件的生命周期与维护

1. 当作活文档（Living Documents）维护：要是 Claude 反复忽略某条规则，说明文件太长需要删减；若反复询问已回答的问题，说明表述有歧义需要重写。可以使用 `IMPORTANT` 或 `YOU MUST` 前缀来提高关键红线的遵循率。
2. 最被低估的技巧：让 AI 自我修正：当 Claude 犯错时（如用错导入路径、违反命名约定），不要只是修复然后继续。告诉 Claude 把这个修正写进 `CLAUDE.md` 的反模式中。通过这种“失败驱动的规则累积”（复利工程），文件会演变成一个持续进化的反馈循环。
3. 一个反直觉的建议：不要用 `/init` 自动生成：一行糟糕的代码只是局部问题，但一行糟糕的 `CLAUDE.md` 会在一开始就导致大量糟糕的计划，进而持续拖累每一次会话、每一个产出。高杠杆文件必须由人类仔细思考并亲手书写。


## 其他主流 AI 工具的规则机制

几乎所有主流 AI 编程工具都有类似 `CLAUDE.md` 的机制，因为它们面对的是完全相同的 LLM “失忆”困境。

### 一、 各工具的规则文件机制一览

| 工具 | 配置文件 | 位置 | 格式与核心特色 |
|------|---------|------|--------------|
| Claude Code | `CLAUDE.md` | 项目根 + `~/.claude/` + 子目录 | Markdown；与终端高度结合，主打自主执行与自我验证。 |
| Cursor | `.cursor/rules/*.mdc` (新)<br>`.cursorrules` (旧) | `.cursor/rules/` 目录 | MDC（增强 Markdown）；拥有最精细的激活模式（Always On / 打开匹配文件时自动附带 / AI 自行决定 / 手动 @ 调用）。 |
| GitHub Copilot | `.github/copilot-instructions.md` | `.github/` 目录 | Markdown；支持 glob 模式作用域（例如 `applyTo: "/*.tsx"`），可为不同文件类型精准配置规则。 |
| Windsurf | `.windsurf/rules/*.md` (新)<br>`.windsurfrules` (旧) | `.windsurf/rules/` 目录 | Markdown；有严格字符限制（单文件 6000 字符，总计 12000 字符），强制精简。 |
| Codex CLI (OpenAI) | `AGENTS.md` | 项目根 + 子目录 | Markdown；支持 `AGENTS.override.md` 本地个人覆盖（自动 gitignore）与目录级层级继承。 |
| Gemini CLI | `GEMINI.md` | 项目根 + `~/.gemini/` | Markdown；可用 `/memory show` 查看已加载上下文，`/memory refresh` 强制重载。 |
| Aider | `CONVENTIONS.md` | 项目根（需手动指定） | Markdown；针对自主 Git 变更流的规范定义。 |

---

### .cursorrules 范本

为了让大模型在开发前沿前端项目时不写出过时的老旧代码（例如在 Next.js 15 中无脑滥用 `'use client'` 或使用老旧的 `useState` 打补丁模式），我们可以针对编辑器环境（如 Cursor）配置专属的局部开发规约：

```markdown
# Next.js 15 & React 19 开发铁律

## 1. 角色定位
你是一名精通 Next.js 15 (App Router)、React 19、TypeScript 以及 Tailwind CSS 4.0 的殿堂级前端架构师。

## 2. 核心规约
### React Server Components (RSC) 优先
- 所有在 `app/` 目录下的组件默认均为 Server Components。
- 只有当组件需要处理客户端动态交互（如 `onClick`、表单状态、`useEffect`）时，才允许在文件最顶部添加 `'use client'` 声明。

### 数据获取与变更
- 页面数据拉取必须使用标准的 `async/await` Server Components 模式。
- 所有的表单提交与数据变更，强制使用 React 19 Server Actions。
- 处理客户端表单等待状态时，优先使用 React 19 的 `useActionState` 和 `useFormStatus`。

### TypeScript 与安全规约
- 绝对禁止使用 `any` 类型。所有来自外部请求的 Response Payload，必须使用 `zod` 实施强类型校验。

```


### 开源标准 AGENTS.md

随着开源社区的演进，由 OpenAI Codex CLI 推广、现由 Linux 基金会托管的 `AGENTS.md` 正在成为自主 Agent 跨工具的事实标准。目前已有超过 60,000+ 个开源项目采用。甚至 Claude Code 在找不到 `CLAUDE.md` 时，也会自动 fallback 读取 `AGENTS.md`。

如果你的团队同时使用 Claude Code、Cursor 和 GitHub Copilot，绝对不要手动维护多份独立的规则文件——冲突的规则比没有规则更糟糕。

#### 符号链接（Symlink）艺术

业界推荐的工程做法是：在项目根目录下维护一份唯一的 `AGENTS.md` 作为“主宪法”，然后通过终端命令创建符号链接，让其他工具的文件在物理上指向它：

```bash
# 创建物理指向，实现“一次编写，处处可用”
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md .cursorrules

```

对于更复杂的环境，可以采用如下拓扑结构进行统一管理：

```text
your-project/
├── AGENTS.md                 # 通用全局主宪法（Codex、Cursor、Claude 统一读取）
├── AGENTS.override.md        # 本地个人覆盖规则（写入 .gitignore，不提交）
├── CLAUDE.md                 # 符号链接（或仅写：Strictly follow ./AGENTS.md）
├── .github/
│   └── copilot-instructions.md # Copilot 特定轻量引用
└── .cursor/
    └── rules/                # 仅存放 Cursor 特定的精细化作用域激活规则 (.mdc)

```



## DoD、熔断与安全守门员

对于具有终端控制权限的自主 AI Agent（如 Claude Code），最危险的事情就是它就地写完了代码，却在根本没有验证可用性的情况下直接交工。我们必须在系统规则中明文注入其交付标准与熔断机制。

### 退出码（Exit Code）卡点交工协议（DoD）

在项目的根目录规则或主宪法中，必须写入以下机器死命令：

【落地完成标准 (DoD)】

Agent 在声称任务完成前，必须且只能在本地终端完整运行以下验证命令：`pnpm run build && pnpm run test`。
只有当该命令的执行返回退出码 `0`（编译通过、单测全绿）时，方可交付控制权。若返回非零退出码，必须原地自主启动重构，直到全绿为止。


### 二、 失败熔断升级协议（Escalation Protocol）

Agent 很容易在遇到顽固环境 Bug 时陷入自我纠错的无限死循环，疯狂空耗你的 API 额度。必须为其划定强行叫停的红线：

【失败熔断升级协议】

若你在修改代码并运行测试的过程中，连续 3 次遇到了完全相同的编译或测试报错日志，表明你已进入认知盲区。请立刻停止所有自主修改动作，在终端输出当前遇到的瓶颈成因、你的 2 个排错假设，并主动挂起进程、请求人类架构师接入协助。

### Husky Pre-commit 拦截架构

为了确保团队中由 AI 生成的每一行代码在合入主干前都绝对合规，我们可以利用静态卡点工具在 Git 提交前进行自动化审计。在项目根目录配置 `.husky/pre-commit` 脚本：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🛡️ 正在启动赛博规则守门员，启动规则强行审计..."

# 1. 强行卡点类型检查
pnpm typecheck
if [ $? -ne 0 ]; then
  echo "❌ 编译未通过！禁止物理提交！请命令 AI 修复 TypeScript 类型冲突后再试。"
  exit 1
fi

# 2. 强行卡点 Lint 检查
pnpm lint
if [ $? -ne 0 ]; then
  echo "❌ 代码规范/Lint 检查未通过！请命令 AI 运行格式化修复。"
  exit 1
fi

echo "✅ 规则审计全绿通过！安全放行入库。"
exit 0

```
