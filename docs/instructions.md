---
title: 铁律的边界：编写 AI 专属的操作指令
---

# 铁律的边界：编写 AI 专属的操作指令
随着智能体（Agent）和 AI 原生 IDE 的爆发，各大开发工具都推出了属于自己的**项目级局部系统指令规范**。理解它们的生态位，并在项目中挂起清晰的“白板”，才能搭建起坚固的铁律防线。

## 1. 规则文件的生态学：.cursorrules、AGENTS.md 与 CLAUDE.md 的定位

在项目中，各种规则文件扮演着不同的角色。正如雇用一个技术超群但每天清空记忆的“赛博承包商”，你需要一张挂在办公室门口写满关键信息的白板——这就是项目宪法：

* **`CLAUDE.md` (Claude Code 专属)**：轻量级指令锚点，是 Claude Code 每次启动 Session 时**唯一主动、完整且必读**的白板文件。它就像是 AI 队友的“入职培训”，直接决定了 AI 对项目理解的起点。它的核心职责是告知 Claude Code 本项目的构建命令、测试命令以及核心代码风格，方便其一键读取并全自动跑通验证。
* **`.cursorrules` (Cursor 专属)**：主要定义在 Cursor Chat 和 Composer 中大模型的先验知识、代码风格偏好。例如：“禁止使用 Any 类型，强制对所有函数入参进行严格的 TypeScript 类型标注”。
* **`AGENTS.md` (通用 Agent 开放标准 / Cline 等通用工具共享)**：由 OpenAI、Google、Cursor、Claude Code 等主要工具在 2025 年 8 月联合发布的开放标准。截至 2026 年 6 月，已有超过 20,000 个仓库采用该标准。它主要针对自主 Agent，定义目录树逻辑、安全禁区及故障自愈流程。

### 💡 实用选型与维护建议
* **单工具团队**：若团队仅使用 Claude Code，从 `CLAUDE.md` 开始。
* **多工具/多智能体编排**：当引入第二种 AI 工具（如 Cursor）或需要 Subagent 编排时，创建 `AGENTS.md`，并**通过 `symlink`（符号链接）使 `CLAUDE.md` 指向它**。绝对不要同时手动维护两份独立内容——**冲突的规则比没有规则更糟糕**。

---

## 2. “指令优先”原则与规则的“投资回报率”（ROI）

人类日常交流习惯使用带有感情色彩和模糊的词汇（如“尽量简洁一点”、“看起来好一些”）。对于严密的软件开发，这种措辞会导致大模型无所适从。

我们必须采取**“指令优先（Command-First）”**原则，改用高强度、结构化、无歧义的逻辑命令。

### ❌ 模糊措辞（低效）
> “请帮我写个工具函数把时间格式化一下，最好优雅、简单一点，谢谢。”

### 🚀 高强度具体命令（高效）
```markdown
# Role
资深 TypeScript 架构专家。

# Task
编写一个格式化 ISO 时间字符串的工具函数 `formatDateTime`。

# Rules
1. 函数签名必须为：`export function formatDateTime(isoStr: string, formatPattern: string): string`
2. 内部实现仅允许使用原生 `Intl.DateTimeFormat`，严禁引入 `moment.js` 或 `dayjs`。
3. 必须通过 100% 的单元测试。
4. 如果 `isoStr` 不是合法的 ISO 格式，必须抛出明确的 `InvalidTimeFormatError`，不允许隐式返回 `undefined` 或 `null`。
```

### 📊 Chroma 2025 精度卡点与规则的 ROI 模型
根据 Chroma 2025 年对包括 Claude Opus 在内的 18 个前沿模型的测试，大模型对指令的遵守率随着输入内容的增加呈明显的精度下降趋势（部分模型在超出限制后，**遵守率从 95% 骤降至 60%**）。

这意味着 **CLAUDE.md 越长，每条规则被遵守的概率越低**。官方和社区共识是：**根目录 CLAUDE.md 必须保持在 200 行以内，150 条指令是可靠遵守的上限。**

因此，我们必须根据 **ROI（投资回报率）** 精挑细选写入规则文件里的每一行内容：

| ROI 评级 | 规则类型 | 说明 | 示例 |
| :--- | :--- | :--- | :--- |
| ⭐⭐⭐⭐⭐ | **构建/运行/测试命令** | 自动执行性价比最高，Agent 必须直接复制运行。 | `make install` / `make test` |
| ⭐⭐⭐⭐ | **架构决策背景 (WHY)** | 说明某些特定约定的设计意图，防止 AI 重构时改坏。 | “代码按 Feature 组织而非 MVC” |
| ⭐⭐⭐⭐ | **技术栈硬性约定 (WHAT)** | 规定禁用的库或必须使用的统一组件。 | “禁止 Moment.js，统一使用 date-fns” |
| ⭐ | **Linter 已覆盖的风格规则** | 几乎没有价值。能用工具强制约束的，就不要浪费 AI 上下文。 | “缩进使用 2 空格” |
| ❌ | **冗长的散文说明** | 零价值，严重稀释上下文注意力。 | 啰唆的项目历史背景介绍 |

---

## 3. CLAUDE.md 的结构设计：WHAT / WHY / HOW

最有效的 `CLAUDE.md` 应当严格围绕 **WHAT（项目是什么）**、**WHY（为什么存在特定设计）**、**HOW（如何构建与测试）** 三大支柱展开。

以下是一份经过 2026 年社区实践验证的 **生产级 `CLAUDE.md` 规范模板**：

```markdown
# [项目名称]

## 1. WHAT：项目与技术栈定义
一个面向中小团队的项目管理 SaaS，核心技术栈要求如下：
- 后端：Python 3.12 · FastAPI · SQLModel · Alembic
- 前端：Next.js 14 (App Router) · TypeScript 5.x · Tailwind CSS · shadcn/ui
- 测试：pytest (后端) · Vitest + Testing Library (前端)
- 🚫 禁止使用：Moment.js（统一用 date-fns）、jQuery、class-based React 组件

## 2. HOW：构建与运行命令 (最高 ROI 区域)
运行以下命令无需解释，直接执行：
- 安装依赖：`make install`  # 等价于 pip install -e ".[dev]" && pnpm install
- 后端开发：`make dev-api`  # 监听端口 8000
- 前端开发：`make dev-web`  # 监听端口 3000
- 运行测试：`make test`
- 类型检查：`make typecheck`
- 代码格式化：`make fmt`    # 运行 ruff format + prettier

## 3. WHY：架构说明与关键约定
- 代码按功能模块（Feature）组织，而非传统的 MVC 层级组织。每个功能在 `src/features/` 下拥有独立目录（包含自己的 router、service、schema、tests）。
- 所有 API 响应必须使用统一的 `ApiResponse[T]` 包装类型。
- 数据库操作仅在 `*_repository.py` 中进行，禁止在 router 层直接操作 DB。
- 环境变量通过 `src/config.py` 中的 `Pydantic Settings` 统一管理。

## 4. 🚫 不要发生的事 (Anti-Patterns)
- 不要修改 `alembic/versions/` 中已有的数据库迁移文件。
- 不要在未与团队沟通前，擅自升级第三方主要依赖的大版本。
- 不要创建超过 300 行的单文件，超出时必须拆分。

## 5. 更多参考链接
- docs/architecture.md - 完整架构文档
- docs/adr/ - 架构决策记录目录
- .claude/skills/ - 可复用的操作技能包
```

---

## 4. 实战：一份生产级 `.cursorrules` 配置模板（Next.js 15 & React 19）

为了让大模型在开发 Next.js 15 & React 19 项目时不写出过时的代码（如使用老旧的 `getServerSideProps` 或在 React Server Components 中无脑使用 `useState`），我们可以在根目录下创建 `.cursorrules` 文件：

```markdown
# Next.js 15 & React 19 开发铁律

## 1. 角色定义 (Role)
你是一名精通 Next.js 15 (App Router)、React 19、TypeScript 以及 Tailwind CSS 4.0 的殿堂级前端架构师。

## 2. 核心规约 (Rules)

### React Server Components (RSC) 优先
- 所有在 `app/` 目录下的组件默认都是 Server Components。
- 只有当组件需要处理客户端交互（如 `onClick`、`useState`、`useEffect`）时，才在文件最顶部添加 `'use client'` 声明。
- 禁止在 RSC 中直接导入包含浏览器端专属 API（如 `window`, `document`）的库。

### 数据获取与变更
- 页面数据获取必须使用标准的 `async/await` Server Components 模式。
- 所有的表单提交与数据变更，强制使用 React 19 **Server Actions**。
- 处理客户端表单状态时，优先使用 React 19 的 `useActionState` 和 `useFormStatus`，淘汰旧版的 `useTransition` / `useState` 表单等待状态。

### TypeScript 规范
- 绝对禁止使用 `any` 类型。如果由于第三方库不可控，必须在代码旁添加 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 并写明理由。
- 所有 API 请求的 Response Payload 必须使用 `zod` 进行强类型校验。

## 3. 落地完成标准 (DoD)
- 在你声称任务完成前，必须且只能在本地终端运行：`npm run build && npm run test`。
- 只有当该命令的执行返回退出码 `0` 时，方可将控制权交还给人类。
```

---

## 5. 高级进阶：分层配置与 `@import` 语法

当项目逐渐变大时，如果把所有规则都写进根目录文件，必定会突破 200 行防线，导致 AI 规则遗忘。

在 2026 年，Claude Code 支持在 `CLAUDE.md` 中使用 **`@path/to/file` 语法** 引用其他特定文档。同时，它还支持**功能级局部配置**：在具体功能目录下放置局部 `CLAUDE.md`，当 AI 进入该目录时会自动加载，而在全局 Session 中则不会污染上下文。

### 📂 分层 CLAUDE.md 项目目录树示例

```text
项目根目录/
├── CLAUDE.md                      # 主宪法文件，通过 @import 保持在 150 行以内
│   ├── # 内部使用 @docs/git-conventions.md 引用
│   └── # 内部使用 @docs/api-design.md 引用
│
├── .claude/
│   ├── settings.json              # 权限与工具配置（硬约束）
│   ├── skills/
│   │   ├── new-feature/SKILL.md   # 创建新功能模块的自主技能包
│   │   └── db-migration/SKILL.md  # 数据库迁移操作指南
│   └── commands/
│       └── review.md              # 自定义命令（如通过 /review 调用的指令）
│
├── src/features/
│   ├── billing/
│   │   └── CLAUDE.md              # 功能级规则（仅在 billing 目录下生效。例如：“Stripe 支付金额必须使用分为单位的整数”）
│   └── auth/
│       └── CLAUDE.md              # 认证模块专属硬约束
│
└── docs/
    ├── git-conventions.md         # 被主 CLAUDE.md @import 导入
    └── api-design.md              # 被主 CLAUDE.md @import 导入
```

通过这种分层设计，我们可以将特定子模块的复杂逻辑约束隔离在子目录中，让 AI 在处理不同任务时，只加载与之相关的规则切片。

---

## 6. 落地完成标准与升级机制

对于具有终端执行权限的 Agent（如 Claude Code、Aider），最危险的事情就是它写完了代码，却根本不知道这些代码能不能跑通，就直接告诉你“完成了”。

我们必须在指令中明确定义它的 **落地完成标准（DoD）** 与 **升级规则（Escalation Rules）**。

### 🏁 退出码（Exit Code）卡点交工协议
在项目的 `CLAUDE.md` 中，明文写入以下交工协议：
> “Agent 在声称任务完成前，**必须且只能**在本地终端运行以下命令：
> `npm run build && npm run test`
> 只有当该命令的执行返回退出码 `0`（即编译通过、测试全绿）时，方可交工。若返回非零，必须原地自我重构，直到全绿为止。”

### 🚨 升级规则（Escalation Protocol）
Agent 很容易在遇到顽固 Bug 时陷入**自我纠错的无限死循环**（消耗大量 API 费用）。我们必须在系统指令中注入一条“警报线”：
> “**【升级规则】**：若你在修改代码并运行测试的过程中，**连续 3 次**遇到相同的编译或测试报错，表明你已陷入盲区。**请立即停止所有自主修改动作**，在终端输出当前遇到的瓶颈原因、你的 2 个排错假设，并主动请求人类接入协助。”

---

## 7. 从失败中迭代：活文档与“复利工程”

好的项目宪法从来不是一次性规划出来的，而是伴随项目的演进而生长的**活文档**。当 AI 在开发过程中犯了某个原本能通过规则避免的错误时，就应当立刻把对应的防御规则写入 `CLAUDE.md`。

这种**“失败驱动的规则累积”**被称为**复利工程 (Compound Engineering)**。每一条踩坑得来的新规则，都在为未来的 Session 提供免受相同错误折磨的保护。

### 🔄 规则的生命周期管理与审计
1. **失败驱动**：AI 犯错 -> 人类/AI 总结 -> 写入 `CLAUDE.md` 的 `Anti-Patterns`。
2. **每月审查**：团队应每月对根目录的 `CLAUDE.md` 进行审查，剔除由于技术债清除而不再适用的陈旧规则。
3. **能力下沉**：如果某些代码风格或规约已经内化为团队的默认开发习惯，应将其迁移至 ESLint、Prettier 或 Linter 配置文件中。记住：**能用静态分析工具强制约束的，就绝不占用 AI 宝贵的上下文窗口。**

---

## 8. 赛博规则守门员：用 Husky 实现 Pre-commit 指令合规校验

为了确保团队中每一位成员由 AI 生成的代码都严格遵守了项目规则，我们可以在 Git 提交前通过 **Pre-commit Hook** 自动进行规则一致性审计。

在根目录配置 `.husky/pre-commit` 脚本：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🛡️  正在启动赛博规则守门员..."

# 1. 运行编译与静态校验卡点
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ 编译未通过！禁止 Git 提交！请命令 AI 修复类型错误后再试。"
  exit 1
fi

# 2. 运行 ESLint 与 Prettier 校验
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ 代码规范/Lint 检查未通过！请命令 AI 运行格式化修复。"
  exit 1
fi

echo "✅ 规则审计全绿通过！安全放行。"
exit 0
```

---

## 🎯 第 1 章 · 编写 AI 指令检查清单

在宣布你的项目已具备完备的 AI 协作环境前，请对照以下清单进行校验：

- [ ] 根目录下存在且仅存在一份唯一的 `CLAUDE.md` 或通过 `symlink` 统一的 `AGENTS.md`。
- [ ] 根目录 `CLAUDE.md` 的行数严格控制在 200 行（或 150 条指令）以内。
- [ ] 包含完整且不需要任何额外解释便能执行的依赖安装、运行、测试及格式化命令（HOW）。
- [ ] 明确列出了项目中绝对禁止使用的依赖、库及反模式清单（WHAT / Anti-Patterns）。
- [ ] 所有架构约定背后都附带了至少一句话的背景原因解释（WHY）。
- [ ] 没有任何一条规则与 ESLint/Prettier/Linter 能够覆盖的静态风格规则发生重复。
- [ ] （如适用）针对复杂功能模块，在子目录下建立了局部隔离的 `CLAUDE.md` 文件。
- [ ] 已在 `CLAUDE.md` 中显式写入 Exit Code 0 的 DoD 验收卡点协议与 3 次失败熔断升级机制。

---

## 本章小结

规章制度是人机协作中最坚固的防火墙。在本章中，我们：
1. 梳理了 `.cursorrules`、`CLAUDE.md` 与 `AGENTS.md` 的生态定位与统一维护方案；
2. 明确了使用高强度、逻辑命令的“指令优先”原则，并用 ROI 模型厘清了规则的性价比；
3. 学习并制定了基于 `WHAT / WHY / HOW` 结构的 `CLAUDE.md` 生产模板；
4. 引入了 2026 年最新的分层 `@import` 机制与功能目录下的局部规则配置；
5. 建立了基于 Exit Code 0 的交工 DoD、3 次失败熔断的升级协议以及“复利工程”活文档审计机制；
6. 用 Husky 配置了 Git 提交前的自动规则守门员。

指令为大模型在编辑器内画好了跑道的边界。但在开发大型复杂项目时，大模型经常需要跨出编辑器，去读写本地数据库、操纵浏览器截图。

下一章，让我们一起走进 **《Agent Skills 与扩展协议（MCP）》（扩充版）**。�须在代码旁添加 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 并写明理由。
- 所有 API 请求的 Response Payload 必须使用 `zod` 进行强类型校验。

## 3. 落地完成标准 (DoD)
- 在你声称任务完成前，必须且只能在本地终端运行：`npm run build && npm run test`。
- 只有当该命令的执行返回退出码 `0` 时，方可将控制权交还给人类。
```

---

## 4. 落地完成标准与升级机制

对于具有终端执行权限的 Agent（如 Claude Code、Aider），最危险的事情就是它写完了代码，却根本不知道这些代码能不能跑通，就直接告诉你“完成了”。

我们必须在指令中明确定义它的 **落地完成标准（DoD）** 与 **升级规则（Escalation Rules）**。

### 🏁 退出码（Exit Code）卡点交工协议
在项目的 `CLAUDE.md` 中，明文写入以下交工协议：
> “Agent 在声称任务完成前，**必须且只能**在本地终端运行以下命令：
> `npm run build && npm run test`
> 只有当该命令的执行返回退出码 `0`（即编译通过、测试全绿）时，方可交工。若返回非零，必须原地自我重构，直到全绿为止。”

### 🚨 升级规则（Escalation Protocol）
Agent 很容易在遇到顽固 Bug 时陷入**自我纠错的无限死循环**（消耗大量 API 费用）。我们必须在系统指令中注入一条“警报线”：
> “**【升级规则】**：若你在修改代码并运行测试的过程中，**连续 3 次**遇到相同的编译或测试报错，表明你已陷入盲区。**请立即停止所有自主修改动作**，在终端输出当前遇到的瓶颈原因、你的 2 个排错假设，并主动请求人类接入协助。”

---

## 5. 赛博规则守门员：用 Husky 实现 Pre-commit 指令合规校验

为了确保团队中每一位成员由 AI 生成的代码都严格遵守了项目规则，我们可以在 Git 提交前通过 **Pre-commit Hook** 自动进行规则一致性审计。

在根目录配置 `.husky/pre-commit` 脚本：

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🛡️  正在启动赛博规则守门员..."

# 1. 运行编译与静态校验卡点
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ 编译未通过！禁止 Git 提交！请命令 AI 修复类型错误后再试。"
  exit 1
fi

# 2. 运行 ESLint 与 Prettier 校验
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ 代码规范/Lint 检查未通过！请命令 AI 运行格式化修复。"
  exit 1
fi

echo "✅ 规则审计全绿通过！安全放行。"
exit 0
```

---

## 本章小结

规章制度是人机协作中最坚固的防火墙。在本章中，我们：
1. 梳理了 `.cursorrules`、`CLAUDE.md` 与 `AGENTS.md` 的生态定位；
2. 学习了如何使用结构化、强命令的“指令优先”原则与 AI 对话；
3. 实战配置了一份针对 Next.js 15 & React 19 的生产级 `.cursorrules` 模板；
4. 建立了基于 Exit Code 0 的交工 DoD 与防范死循环的升级熔断协议；
5. 用 Husky 配置了 Git 提交前的自动规则守门员。

指令为大模型在编辑器内画好了跑道的边界。但在开发大型复杂项目时，大模型经常需要跨出编辑器，去读写本地数据库、操纵浏览器截图。

下一章，让我们一起走进 **《Agent Skills 与扩展协议（MCP）》（扩充版）**。
