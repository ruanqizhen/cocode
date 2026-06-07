---
title: 铁律的边界：编写 AI 专属的操作指令
---

# 铁律的边界：编写 AI 专属的操作指令

> **“没有法律约束的国家会走向混乱；没有指令限制的 Agent 则会把你的项目变成屎山的温床。”**

---

随着智能体（Agent）和 AI 原生 IDE 的爆发，各大开发工具都推出了属于自己的**项目级局部系统指令规范**。理解它们的生态位，才能在项目中搭建起坚固的铁律防线。

## 1. 规则文件的生态学：.cursorrules、AGENTS.md 与 CLAUDE.md 的定位

在项目中，各种规则文件扮演着不同的角色：

* **`.cursorrules` (Cursor 专属)**：主要定义在 Cursor Chat 和 Composer 中大模型的先验知识、代码风格偏好。例如：“禁止使用 Any 类型，强制对所有函数入参进行严格的 TypeScript 类型标注”。
* **`CLAUDE.md` (Claude Code 专属)**：轻量级指令锚点。主要告知 Claude Code 该项目的构建（Build）命令、测试（Test）命令以及核心代码风格，方便 Claude Code 一键读取并全自动跑通验证。
* **`AGENTS.md` (通用 Agent / Cline 专属)**：项目说明书的高级版，专门针对自主 Agent。告诉 Agent 本项目的目录树逻辑、安全禁区、以及遇到阻碍时的自愈流程。

---

## 2. “指令优先”原则：抛弃模糊的人类措辞

人类在日常对话中习惯使用大量带有感情色彩和模糊的词汇（如“尽量简洁一点”、“看起来好一些”）。对于严密的软件开发，这种措辞会导致大模型无所适从。

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

---

## 3. 实战：一份生产级 `.cursorrules` 配置模板（Next.js 15 & React 19）

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
