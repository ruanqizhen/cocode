---
title: 团队协作与工程化实践
---

# 团队协作与工程化实践

> **"一个人用 AI，是提效；一个团队用 AI，是变革。但如果没有统一规范，十个 AI 加持的开发者，可能制造出比一百个人还要多的混乱。"**

本书前面的章节，主要从个人开发者的视角展开：你如何写 prompt、你如何管理上下文、你如何调试。但真实的软件开发从来不是一个人的战斗。

当一个团队中的每个人都开始使用 AI 编程工具时，新的问题出现了：

- 你的 AI 生成的代码风格和我的 AI 生成的完全不一样，谁来统一？
- 有人用 Cursor、有人用 Copilot、有人用 Claude Code，规则文件怎么共享？
- AI 生成了一个 500 行的 PR，reviewer 应该从头看到尾吗？
- 新人用 AI 写代码速度飞起，但他真的理解项目在做什么吗？

本章将回答这些问题，帮助你和你的团队在 AI 时代建立**可复制的协作范式**。

---

## 统一团队 AI 规范：从个人习惯到集体契约

在没有 AI 工具的时代，团队通过 ESLint、Prettier、编码规范文档来统一代码风格。这些在 AI 时代依然有效——但远远不够。

AI 编程引入了一个全新的变量：**每个开发者的 prompt 习惯、上下文投喂方式、以及对 AI 输出的信任程度，都截然不同。**

### 📋 团队 AI 使用规范应包含的内容

```markdown
# 团队 AI 编程规范 v1.0

## 1. 工具统一
- 全队统一使用 Cursor（IDE）+ Claude Code（终端 Agent）
- 不禁止个人尝试其他工具，但合入主分支的代码必须通过统一的 CI 检查

## 2. Prompt 规范
- 功能开发前，先写 Spec（规划文档），再让 AI 生成代码
- 每个 prompt 必须包含：目标 + 约束 + 期望输出格式
- 禁止把整个项目不加选择地丢给 AI（违反最小上下文原则）

## 3. 代码审查
- AI 生成的代码，仍需完整的 Code Review，标准不低于手写代码
- Reviewer 有权要求 submitter 解释任何一行 AI 生成的代码逻辑
- 超过 200 行的 AI 生成 PR，建议拆分为多个小 PR

## 4. 安全红线
- 禁止将生产密钥、用户数据、内部架构文档发送给云端 AI
- AI 推荐的第三方库，必须先通过 `npm audit` / 手动验证
- 所有 AI 生成的 SQL 必须使用参数化查询

## 5. 上下文管理
- 每个项目必须维护一份面向 AI 的 CLAUDE.md / AGENTS.md
- 重大项目架构变更后，同步更新上述文件
```

:::tip 制定规范的原则
规范不是越厚越好。一个好的团队 AI 规范应该**一页纸能写完**，每位成员都能背下来。如果规范需要翻阅才能执行，那就等于没有规范。
:::

---

## 共享规则文件：让全队的 AI 站在同一条起跑线上

在 [第 13 章](instructions.md) 中，我们讨论了个人项目的 `.cursorrules` 和 `CLAUDE.md`。在团队场景下，这些规则文件承担了新的角色——**它们是全队 AI 的"共同知识基座"**。

### 🏗️ 多层级规则文件架构

```
project-root/
├── CLAUDE.md              # 项目级规则（对所有成员生效）
├── .cursorrules           # 项目级规则（Cursor 专属）
├── AGENTS.md              # Agent 行为规范
├── docs/
│   └── ARCHITECTURE.md    # 架构知识库（供 AI 理解整体设计）
├── frontend/
│   └── .cursorrules       # 前端子项目专属规则
├── backend/
│   └── .cursorrules       # 后端子项目专属规则
└── .github/
    └── copilot-instructions.md  # GitHub Copilot 专属规则
```

### 🔑 关键原则

- **项目级 > 个人级**：如果把规则写在 `.cursorrules` 中并纳入版本控制，全队成员启动 Cursor 时自动继承。个人的临时偏好写成个人配置（不提交到 git）。
- **规则即文档**：规则文件本身也应当是新人上手的入口。一个新人 clone 仓库后，AI 就能通过 CLAUDE.md 理解项目，从第一天起高效协作。
- **随项目演进同步更新**：当架构发生重大变更时，更新 CLAUDE.md 应该成为 DoD（Definition of Done）的一部分。

### 示例：一份团队共享的 CLAUDE.md

```markdown
# CLAUDE.md

## 项目概览
- 项目名：Mercury 电商平台
- 技术栈：Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL
- 部署：Vercel (前端) + Railway (后端)

## 架构约定
- /app 目录下每个路由使用 Server Components 作为默认
- 数据变更操作必须通过 Server Actions
- 全局状态管理使用 Zustand，禁止引入 Redux

## 代码风格
- 所有函数必须显式声明返回类型
- 禁止使用 `any` 类型（除非有明确注释说明原因）
- API 路由使用 zod 进行输入校验

## 安全红线
- 禁止硬编码任何密钥或 Token
- 所有 SQL 查询使用 Prisma 参数化查询
- API 端点必须校验用户身份和权限

## DoD (Definition of Done)
- [ ] TypeScript 编译零错误
- [ ] ESLint 零警告
- [ ] 相关单元测试通过
- [ ] 手写的变更已人工审查通过
- [ ] 如果是架构变更，已同步更新本文档
```

---

## AI 生成代码的 Code Review：新范式下的审视标准

传统的 Code Review 关注的是：这段代码写得对不对？好不好？安不安全？当代码由 AI 生成时，Review 需要增加新的维度。

### 🔍 AI 代码 Review 五问

每当你 review 一段 AI 生成的代码时，需要多问五个问题：

1. **理解问**：这段代码的逻辑我完全理解了吗？还是"它能跑"所以通过了？
2. **意图问**：这段代码是在解决正确的问题吗？AI 有没有巧妙地把问题"简化"到它可以轻松解决、但实际背离了需求？
3. **边界问**：异常情况、空值、并发、超时——AI 覆盖了吗？还是它只写了 Happy Path？
4. **冗余问**：AI 有没有为了凑"完整性"而生成根本不需要的代码（过度工程化）？
5. **幻觉问**：这段代码里有没有引用不存在的 API、配置、或依赖？

### 📐 Review 实战策略

| PR 规模 | 策略 |
|---|---|
| < 100 行 AI 代码 | 逐行审查，正常 Code Review 流程 |
| 100~300 行 AI 代码 | 要求 submitter 在 PR 描述中标注"AI 生成区域"和"手写区域"，Reviewer 对 AI 区域执行五问审查 |
| > 300 行 AI 代码 | 退回，要求拆分为多个小 PR。AI 时代"大 PR"的风险被指数级放大——一次性生成 500 行代码只需要 5 秒，但一次埋进 5 个漏洞也只需要 5 秒 |

:::warning 警惕"它能跑"的陷阱
AI 生成的代码有一个危险的特性：**它能跑的代码，未必是正确的代码。** 

AI 特别擅长生成"刚好能跑通 Happy Path"的代码，但在边界条件、错误处理、并发安全等维度上全面缺失。Review 时"跑一遍就过"的心态，是 AI 时代最大的代码质量杀手。
:::

---

## Git 工作流：AI 时代的版本控制策略

AI 编程改变了代码的**产出速率**和**产出方式**，但对 Git 的使用提出了新的要求。

### 原子化提交：AI 速度下的提交纪律

当 AI 帮你一口气写了三个功能模块时，很容易产生一个 `feat: add user auth, product list, shopping cart` 这样的"大杂烩提交"。

**AI 时代的提交黄金法则**：一次提交 = 一个逻辑上不可分割的变更。

```bash
# ❌ 糟糕的提交
git commit -m "feat: AI generated multiple features"

# ✅ 好的提交
git commit -m "feat(auth): add email/password login with JWT session"
git commit -m "feat(auth): add password reset flow"
git commit -m "feat(product): add product listing with pagination"
```

### 用 AI 生成 Commit Message

```bash
# 让 AI 帮你写 commit message
git diff --staged | aidermsg
# 或者直接在 AI 工具中说：
# "阅读 git diff --staged 的内容，生成一条 conventional commits 格式的提交信息"
```

:::tip Conventional Commits
建议全队统一使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式（`feat:`、`fix:`、`refactor:` 等），让提交历史本身成为一种可被 AI 解析的结构化数据。
:::

### PR 工作流优化

```
传统流程：
  写代码 (2h) → 写 PR 描述 (15min) → Review (30min) → 修改 (1h)

AI 加速流程：
  写 Spec (15min) → AI 生成代码 (5min) → 
  人工整理提交 (10min) → AI 生成 PR 描述 (1min) → 
  Review (30min) → AI 协助修改 (5min)
```

关键在于：**AI 压缩了"写"的时间，但"想"和"审"的时间不能压缩，甚至需要更多。**

---

## CI/CD 集成：让 AI 守规矩

当团队中每个人都在高频使用 AI 生成代码时，仅靠人力 Code Review 不足以守住质量底线。你需要在 CI/CD 流程中增加针对性的检查。

### 🤖 AI 时代的 CI 质量门禁

```yaml
# .github/workflows/ai-quality-gate.yml
name: AI Code Quality Gate
on: [pull_request]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Type Check
        run: npx tsc --noEmit

      - name: Lint
        run: npx eslint . --max-warnings 0

      - name: Security Scan (AI 代码重点)
        uses: semgrep/semgrep-action@v1
        with:
          config: p/owasp-top-ten

      - name: Secret Detection
        uses: gitleaks/gitleaks-action@v2

      - name: Dependency Audit
        run: npm audit --audit-level=high

      - name: Test Coverage (不低于 80%)
        run: npx vitest --coverage --threshold 80
```

### 📊 AI 代码质量看板

建议在团队 Dashboard 上追踪以下指标：
- **AI 生成代码的 Bug 率 vs 手写代码的 Bug 率**（按周统计）
- **AI 生成 PR 的 Review 退回率**（是否显著高于手写 PR）
- **安全扫描发现的 AI 引入漏洞数量**（按类型分类）
- **各成员 AI 工具使用频率与代码质量的相关性**

> 数据不会说谎。追踪这些指标可以帮助团队客观评估 AI 的实际效果，而不是凭感觉下结论。

---

## 新人 onboarding：AI 时代的成长悖论

当新人可以靠 AI 在第一天就提交功能代码时，一个危险的陷阱出现了：**新人产出惊人，但完全没有理解项目在做什么。**

### 🎓 AI 时代的 onboarding 三阶段

**第一阶段：禁止期（第 1 周）**
- 关闭 AI 编程工具
- 手写完成一个简单 feature，强迫理解项目核心流程
- 通读 CLAUDE.md、ARCHITECTURE.md 和核心模块代码

**第二阶段：辅助期（第 2~4 周）**
- 开放 AI 工具，但要求每段 AI 生成代码提交时附带手写注释
- 每日站会时随机抽问："昨天 AI 帮你写的那段代码，其中的事务处理逻辑是怎样的？"
- 定期进行"脱网编程"练习

**第三阶段：自主期（第 5 周起）**
- 正常使用 AI 工具
- 代码 Review 标准对新人更高（AI 加速了写代码，Review 要更仔细）
- 鼓励新人为 CLAUDE.md 贡献规则——好的规则往往来自新人踩过的坑

---

## 避开团队 AI 协作的五个常见陷阱

### 🕳️ 陷阱一：规范过重
制定了 50 页的 AI 使用规范，没人看也执行不了。**规范的价值在于"被遵守"，不在于"写得多"。**

### 🕳️ 陷阱二：AI 生成的代码不需要 Review
"因为不是人写的，所以出了 Bug 不能怪人"——这是团队中最危险的心态。**AI 写的 Bug，上线后的责任仍然在你。**

### 🕳️ 陷阱三：评审人的 AI 疲劳
每天 Review 10 个 AI 生成的 PR，很快会形成"扫一眼就过"的习惯。**定期轮换 Review 职责，保持审慎。**

### 🕳️ 陷阱四：规则文件的版本位差
CLAUDE.md 在项目初期写得很好，后续再也没更新过，AI 按照过时的规则生成过时的代码。**把 CLAUDE.md 的更新纳入 DoD。**

### 🕳️ 陷阱五：假装 AI 不存在
有些团队禁止使用 AI 编程工具，理由是"不安全""不可控"。**禁止 AI 不会让 AI 消失，只会让团队成员偷偷使用，然后声称代码是自己手写的——这反而是更大的风险。拥抱它，规范它。**

---

> **"AI 不会取代团队，但会用 AI 的团队会取代不会用的团队。真正的护城河不是工具多新，而是整个团队能否在同一套 AI 协作范式下，形成 1+1>2 的合力。"**
