# 项目宪法

> 雇用一个技术超群但每天清空记忆的“赛博承包商”，你最需要的是一张挂在办公室门口、写满关键红线的白板——这就是项目宪法。

在与大语言模型（LLM）结对编程时，我们必须直面一个冷酷的技术现实：LLM 本质上是完全无状态的。模型不会记住你的项目，也不会自动理解你的工程约定。

因此，问题从来不是“AI 会不会记住”，而是，你如何把规则重新注入每一次对话的上下文中。



## CLAUDE.md 与双轨记忆系统

用 AI 编码工具干活，你可能很快会撞上一个烦人的问题：它没有长期记忆。每开一个新对话，它对你项目的了解就清零一次。

在每一次全新的会话（Session）开始时，它对你的代码库一无所知。

为了解决这一痛点，Claude Code 提供了两套机制来跨会话保留信息：

* 一套是你亲手写的 主动规约（CLAUDE.md）
* 一套是系统自动生成的 自动记忆（Auto Memory）

配好记忆系统后的体感差异非常明显：

没配 `CLAUDE.md` 时，你让它加个接口，它可能顺手用了 `axios`，但你项目统一用 `fetch`，于是反复返工；
配好之后，它会一开始就遵循你的技术栈、目录约定与命名风格。

差别不在“某一次对话是否惊艳”，而在长期协作中——你少说了多少废话。



### 1. 双轨记忆系统对比

* 主动规约 (CLAUDE.md)：由开发者编写，是项目的显式规则系统。
* 自动记忆 (Auto Memory)：由 Claude 自动提取，是协作过程中沉淀的经验。

| 维度   | CLAUDE.md    | Auto Memory    |
| ---- | ------------ | -------------- |
| 编写主体 | 开发者          | Claude 自动生成    |
| 内容性质 | 显式规则与约束      | 经验、偏好、历史事实     |
| 作用范围 | 项目 / 用户级     | 本地仓库级          |
| 内容类型 | 架构规范、技术栈、DoD | 命令、Bug 原因、环境习惯 |



## CLAUDE.md 的多级作用域

`CLAUDE.md` 并不只有一个位置，它有明确的层级结构，并遵循“越具体越优先”的规则：

### 1. 用户全局级

`~/.claude/CLAUDE.md` 或 `~/.config/claude/CLAUDE.md`

* 跨项目通用偏好
* 示例：默认中文回复、pnpm 优先



### 2. 项目级（核心层）

`./CLAUDE.md` 或 `./.claude/CLAUDE.md`

* 团队共享规则
* 技术栈、目录结构、开发规范



### 3. 子目录级

`src/module/CLAUDE.md`

* 仅在访问该目录时生效
* 用于局部规范隔离



### 4. 本地沙箱级

`CLAUDE.local.md`

* 不提交 Git
* 存储敏感或个人配置



### 5. 企业托管级

企业级统一策略（Managed Policy）

* 强制生效
* 无法被覆盖



### 覆盖规则

越具体层级优先级越高。
例如项目级与用户级冲突时，项目级优先生效。



## /init 自动化与协同生成

你不需要从零手写 `CLAUDE.md`：

```bash
/init
```

它会扫描项目结构、依赖与构建方式，并生成初始规则文件。



### 高级用法

* 交互式初始化：可在初始化过程中动态确认规则
* 多工具融合：自动吸收 `.cursorrules`、`AGENTS.md`
* 二次优化 Prompt：

```text
请基于当前 CLAUDE.md：
1. 补充隐性工程约定
2. 提取易错点
3. 补充关键开发红线
```



## 黄金编写五原则

### 原则一：具体可验证

❌ “写好代码”
✅ “使用 2 空格缩进 + camelCase”



### 原则二：保持精简

CLAUDE.md 会被频繁加载，过长会稀释上下文。



### 原则三：结构清晰

用标题、列表、分区增强可读性。



### 原则四：持续清理

过时规则比没有规则更危险。



### 原则五：关键规则前置

最重要的规则必须放在文件顶部。



### 隐藏技巧

HTML 注释不会进入模型上下文：

```html
<!-- 仅人类维护备注 -->
```



## 渐进式披露与拆分策略

当规则膨胀时，应拆分而不是堆叠。

### @import 引入

```md
@docs/git.md
```

作用：拼接内容到上下文（不省 token）



### .claude/rules 路径规则

```yaml
paths:
  - "src/api/*.ts"
```

作用：按文件触发加载规则



### AGENTS.md 统一入口

可以作为跨工具统一规范：

```md
@AGENTS.md
```



## 生产级 CLAUDE.md 模板

```markdown
# Project Protocol

## Commands
pnpm install
pnpm test
pnpm typecheck

## Structure
src/
  features/
  models/
docs/

## Rules
- DB 只能在 repository 层操作
- API 使用统一 Response Wrapper

## Anti-patterns
- 禁止修改历史 migration
- 禁止超 300 行文件

## References
@docs/api.md
```



## Auto Memory（自动记忆机制）

Claude Code 会自动记录协作经验。

### 存储结构

```text
~/.claude/projects/<project>/memory/
├── MEMORY.md
├── build-commands.md
└── debugging.md
```



### 特点

* 本地存储
* 不提交 Git
* 自动提取经验



## 其他工具的规则体系

| 工具          | 文件                           |
| ----------- | ---------------------------- |
| Claude Code | CLAUDE.md                    |
| Cursor      | .cursorrules / .cursor/rules |
| Copilot     | copilot-instructions.md      |
| Antigravity | AGENTS.md                    |
| Gemini      | GEMINI.md                    |
| Aider       | CONVENTIONS.md               |



## AGENTS.md 与统一宪法

AGENTS.md 正在成为跨工具标准。

推荐结构：

```text
AGENTS.md
CLAUDE.md -> symlink
.cursorrules -> symlink
```



## DoD 与熔断机制（关键补全）

### DoD（交付标准）

```text
pnpm run build && pnpm run test 必须返回 0
否则禁止交付
```



### 熔断机制

连续 3 次失败：

* 停止修改
* 输出原因
* 提出假设
* 请求人类介入



## Git Hooks 安全层

```bash
pnpm typecheck || exit 1
pnpm lint || exit 1
```

用于阻断错误代码进入主干。



## 排错指南

### 1. 是否加载 CLAUDE.md

使用 `/memory` 检查。



### 2. 是否发生规则冲突

子目录规则可能覆盖全局规则。



### 3. /compact 风险

压缩上下文可能导致：

* 子目录 CLAUDE.md 暂时失效



## FAQ

### Q1：CLAUDE.md 会增加 token 吗？

会，每次会话都会加载。



### Q2：需要提交 Git 吗？

项目级必须提交。



### Q3：规则修改是否立即生效？

新会话或 /clear 后生效。



### Q4：能否完全依赖 AI 自动生成？

不建议。关键规则必须人工设计。



