# 智能体技能（AI Agent Skills）

> “不要试图让天才背诵整本百科全书。给他一块技能插槽，在他需要时自动载入对应的技能芯片。”

在与先进的 AI Agent（如 Claude Code）结对编程时，如果我们把所有的项目背景、规范、构建命令和特定任务的提示词全部塞进全局规则中，很快就会遇到“认知载荷超载”与“上下文稀释”的问题。

为了解决这一痛点，Agent Skills（智能体技能） 应运而生。它正在迅速成为 AI 编程工具的标配。如果说全局规则是常驻大脑的“全局常识”，那么 AI Skills 就是一块块按需插入的“技能芯片”。本文将系统讲解 Skill 的本质、底层运转机制、适用时机以及如何为你的项目定制专属技能。

## 什么是 AI Skill？

Anthropic 官方的定义非常简洁：“一个 Skill 是一组指令——打包成一个简单的文件夹——它教会 Claude 如何处理特定的任务或工作流。”

从技术本质上看，Skill 是一种基于提示词的模块化能力扩展机制（Prompt-based Meta-tool）。它并不是可执行代码（不会运行 Python 或启动 HTTP 服务），而是一个按需加载的指令包。

### 两个绝佳的类比

1. 技能芯片 (Skill Chip)：这就像黑客帝国中插在脑后的芯片，AI 平时不需要掌握这项技能，只有在执行特定任务（如“编写 Git Commit”或“数据库迁移”）时，才临时插上这块包含专业知识的芯片。
2. 食谱与副厨师 (Cookbook vs Sous Chef)：Skill 就像给 AI 递上一本特定菜系的“食谱（Cookbook）”，提供“怎么做某件事”的步骤，AI 依然是亲自动手的人；而子 Agent 则像是直接雇佣了一个“副厨师（Sous Chef）”来帮你完成整道菜。



## 核心优势与底层运行机制

### 渐进式披露（Progressive Disclosure）

AI Skills 能够实现“按需加载”的底层魔法，在于它独特的 YAML 前置元数据（Frontmatter） 声明以及渐进式披露机制。它完美解决了传统全局规则（如 `CLAUDE.md`）持续消耗 Token、稀释模型注意力的问题。

当 AI 工具启动时，它采用的是两阶段加载策略：

1. 第一阶段：轻量级注册（扫描描述）
AI 只读取每个技能顶部的 YAML 元数据（`name` 和 `description`）。这部分数据极小，几乎不占用上下文空间。
2. 第二阶段：动态唤醒（语义匹配）
当你在对话中输入指令时，AI 会在后台将你的请求与所有已注册技能的 `description` 进行语义匹配计算。一旦判定当前任务需要该技能，AI 才会将 `SKILL.md` 的 Markdown 主体指令完整注入到当前对话上下文中，从而“武装”自己去解决问题。



## skill vs 全局规则 vs 子 Agent

这三者都能扩展 AI 的能力，但加载机制和使用成本有着本质的区别：

| 维度 | 全局规则 (CLAUDE.md) | Agent Skills (技能芯片) | 子 Agent (独立同事) |
| --- | --- | --- | --- |
| 本质 | 静态项目宪法 / 全局常识 | 按需加载的指令包（食谱） | 独立的 AI 实例（同事） |
| 加载机制 | 全局强制加载，每次会话始终存在 | 动态按需加载（相关时才载入） | 派遣时启动并接管任务 |
| 上下文/Token | 持续占用并消耗，易产生稀释 | 平时消耗极低，激活时载入 | 拥有独立的上下文窗口，成本较高 |
| 适用场景 | 全局构建命令、核心技术栈约定、团队红线 | 特定垂类任务、工具规范、领域知识、文件转换 | 复杂的多步骤工作流、带验证循环的独立任务 |



## 什么时候应该用 Skill？

### 决策树指南

根据社区总结的最佳实践，你可以通过以下决策树来判断是否需要使用 Skill：

* 是工具 / 转换 / 模板吗？ 👉 用 Skill
* 是 AI 不具备的内部领域知识吗？ 👉 用 Skill
* 会在不同任务间重复使用吗？ 👉 用 Skill
* 需要多步骤推理和协调多个操作吗？ 👉 *用子 Agent*
* 是复杂的、带验证循环的工作流吗？ 👉 *用子 Agent*

核心建议： 从 Skill 开始。Skill 更简单、更快、更易维护。只有当你明确需要复杂的编排（多步骤、决策点、自我验证）时，才升级到子 Agent。并且，Skill 和子 Agent 是可以完美协同的——子 Agent 像项目经理（负责编排），Skill 像它手边的专用工具箱。

### 典型应用场景

* 文件转换：PDF → 文本、DOCX → 文本、Excel 解析。
* 研发规范：生成符合 Conventional Commits 的 Git 消息、执行数据库迁移审计。
* 模板生成：生成符合公司规范的文档、邮件、API 接口文档。
* 可复用的工具函数：常用的实用操作和排错指南。



## 如何创建与部署 Skill？

在项目中创建 Skill 非常简单，只需遵循规范的目录结构和元数据声明。

### 1. 目录结构规范

Skill 分为全局可用和当前项目可用两种作用域：

* 用户级（全局技能）：`~/.config/claude/skills/` 或 `~/.claude/skills/`（所有项目通用）。
* 项目级（团队共享）：项目根目录下的 `.claude/skills/`（推荐随 Git 提交）。

每个 Skill 必须是一个独立的文件夹（使用连字符 `kebab-case` 命名），核心是 `SKILL.md` 文件：

```text
your-project/
├── .claude/
│   └── skills/
│       └── git-commit/          <-- 技能名称目录 
│           ├── SKILL.md         <-- 核心指令文件 (必须)
│           ├── examples.md      <-- 使用示例 (可选)
│           └── scripts/         <-- 辅助脚本 (可选)

```

### 2. 编写 SKILL.md 模板

`SKILL.md` 必须严格由两部分组成：顶部的 YAML Frontmatter 和底部的 Markdown 指令主体。

```markdown
---
name: git-commit
description: Automatically generate structured Conventional Commits messages based on local git diffs. Use when the user asks to write a git commit message or review changes for a commit.
---

# Git Commit 规范生成技能

当你被要求生成 Git Commit 消息或提交代码时，请严格遵守本技能的约束：

## 1. 提交格式
每次提交必须符合规范，结构如下：
`<type>(<scope>): <subject>`

- feat: 新增功能
- fix: 修复 Bug
- docs: 仅修改文档

## 2. 约束条件
- 标题行不得超过 50 个字符。
- 使用祈使句（如 "add x" 而非 "added x"）。

```



## 最佳实践与避坑指南

要让 Skills 能够精准被 AI 发现并高效执行，请务必关注以下工程细节：

1. `description` 是成败的关键：这是 AI 决定何时加载该技能的唯一依据。
* ❌ 低效描述：`"This is a skill to help write git commits."`（缺乏触发场景）。
* ✅ 高效描述：包含动作、触发词，并用第三人称书写。`"Converts document files to text. Use when reading document attachments, analyzing files from tickets, or extracting content."`
* *注：描述请保持在一行内（不要换行），通常控制在 1024 字符以内。*


2. 精细化技能拆分：不要试图创建一个名为 `backend-helper` 的全能型大技能，这会导致严重的上下文稀释。请按功能微观拆分（例如：拆分为 `db-migration`、`api-doc-generator`、`eslint-fixer`）。
3. 控制文件长度：保持 `SKILL.md` 在 500 行以内。利用“渐进式披露”原则，主文件保持精简，详细内容或长示例放在同级目录的 `references/` 或 `examples.md` 中按需引导加载。
4. 命名约束：技能文件夹和 YAML 中的 `name` 字段，必须严格使用连字符命名法 (kebab-case)（如 `document-reader`）。



## 跨工具支持与总结

Skill 机制最初由 Anthropic 推出，但凭借其优雅的设计，正在迅速成为行业标准。目前，Claude Code、Codex CLI、Cursor、Gemini CLI 等工具均已支持 `SKILL.md` 格式，实现了“一次编写，处处可用”的跨平台移植能力。

一句话总结：AI Skills 是一套“按需加载的食谱”。它彻底解决了全局规则“总是占用上下文”的顽疾，让你可以将无数的专业知识和工作流打包沉淀。写好描述（Description），做好功能拆分，是发挥技能芯片最大威力的核心秘诀。