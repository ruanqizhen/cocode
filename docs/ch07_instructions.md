---
title: 第七章 铁律的边界：编写 AI 专属的操作指令
---

# 第七章 铁律的边界：编写 AI 专属的操作指令

> **“没有法律约束的国家会走向混乱；没有指令限制的 Agent 则会把你的项目变成屎山的温床。”**

---

## 7.1 规则文件的生态学：.cursorrules、AGENTS.md 与 CLAUDE.md 的定位

随着智能体（Agent）和 AI 原生 IDE 的爆发，各大开发工具都推出了属于自己的**项目级局部系统指令规范**。理解它们的生态位，才能在项目中搭建起坚固的铁律防线。

### 📄 `.cursorrules`
* **适用工具**：Cursor
* **职责**：定义在 Cursor Chat 和 Composer 中大模型的先验知识、代码风格偏好。例如：“禁止使用 Any 类型，强制对所有函数入参进行严格的 TypeScript 类型标注”。

### 📄 `CLAUDE.md`
* **适用工具**：Claude Code / Anthropic 官方 CLI
* **职责**：轻量级指令锚点。主要告知 Claude 该项目的构建（Build）命令、测试（Test）命令以及核心代码风格，方便 Claude Code 一键读取并全自动跑通验证。

### 📄 `AGENTS.md`
* **适用工具**：通用 Agentic 开发流程 / Aider / Cline
* **职责**：项目说明书的高级版，专门针对自主 Agent。告诉 Agent 本项目的目录树逻辑、安全禁区、以及遇到阻碍时的自愈流程。

---

## 7.2 “指令优先”原则：抛弃模糊的人类措辞，改用高强度的具体命令

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

## 7.3 落地完成标准（Definition of Done）：让 AI 懂得用退出码（Exit Code）交工

对于Cline、Claude Code等具备终端执行权限的 Agent，最危险的事情就是它写完了代码，却根本不知道这些代码能不能跑通，就直接告诉你“完成了”。

我们必须在指令中明确定义它的 **落地完成标准（DoD）**，并强迫它通过**退出码（Exit Code）**来交工。

:::tip DoD 模板
在项目的 `.cursorrules` 或 `CLAUDE.md` 中，明文写入以下交工协议：

“Agent 在声称任务完成前，**必须且只能**在本地终端运行以下命令：
`npm run build && npm run test`
只有当该命令的执行返回退出码 `0`（Exit Code 0，即编译通过、测试全绿）时，方可将控制权交还给人类。若返回非零，必须原地自我重构，直到全绿为止。”
:::

---

## 7.4 制定升级规则（Escalation Rules）：告诉 AI 陷入死循环时如何优雅地“求助”

Agent 很容易在遇到顽固 Bug 时陷入**自我纠错的无限死循环**：
1. 运行测试失败。
2. 修改代码，再次运行测试失败。
3. 再次修改代码，导致了新的报错，反复折腾 10 次，直到烧光你的 Token。

### 🚨 制定升级规则（Escalation Protocol）
在系统指令中明文注入一条**“警报线”**：

> “**【升级规则】**：若你在修改代码并运行测试的过程中，**连续 3 次**遇到相同的编译或测试报错，表明你已陷入盲区。**请立即停止所有自主修改动作**，在终端输出当前遇到的瓶颈原因、你的 2 个排错假设，并主动请求人类接入协助。”

这能瞬间帮你保住钱包，并拉回偏离轨道的 AI。

---

## 7.5 复杂项目治理：Monorepo 中的目录级规则继承与隔离机制

对于大型的企业级 Monorepo（单一代码库，如内部包含 `/apps/web`、`/apps/api`、`/packages/shared`），全局的规则文件往往会因为技术栈的差异而失效。

### 目录级继承与隔离
1. **全局主指令**（根目录 `.cursorrules`）：规定通用的协作礼仪、Git 提交规范、升级规则等。
2. **子目录专属指令**：
   * 在 `/apps/web` 下创建子 `.cursorrules`：强制使用 Tailwind 规范、React Server Components 铁律。
   * 在 `/apps/api` 下创建子 `.cursorrules`：强制使用 NestJS 依赖注入规范、严格的 DTO 校验。
   * 在 `/packages/shared` 下创建子 `.cursorrules`：禁止使用任何 Node.js 特有 API，确保纯 JS 库在浏览器与后端的双重兼容。

通过这套层级式隔离体系，大模型无论定位到项目的哪个子模块，都能瞬间调频出最符合当前模块的技术思维。
