# 铁律的边界：编写 AI 专属的操作指令

> 雇用一个技术超群但每天清空记忆的“赛博承包商”，你最需要的是一张挂在办公室门口、写满关键红线的白板——这就是项目宪法。

随着智能体（Agent）和 AI 原生 IDE 的爆发，各大开发工具都推出了属于自己的**项目级局部系统指令规范**。如果在复杂的工业级项目开发中，你没有为 AI 圈定清晰的操纵边界，它很快就会在无序的上下文中迷失。本章将带你理清主流规则文件的生态位，在项目中搭建起一套坚固、高 ROI 的铁律防线。

---

## 1. 规则文件的生态学：.cursorrules、CLAUDE.md 与 AGENTS.md

在现代项目工程中，不同的 AI 工具在读取规则时有着截然不同的路径与偏好。理解它们的生态位，才能精准地实施防守：

* **`CLAUDE.md` (Claude Code 专属)**：轻量级最高指令锚点。它是 Claude Code 每次启动 Session 时**唯一主动、完整且必读**的白板文件。它就像是给 AI 队友的“入职培训”，核心职责是告知工具本项目的构建、测试、类型检查命令以及最核心的代码反模式，方便其实现“自主执行与自我验证”。
* **`.cursorrules` (Cursor 专属)**：主要定义在 Cursor Chat、Inline Edit 和 Composer 模式下大模型的先验知识与代码风格偏好。例如：“强制对所有 React 组件进行强类型 Props 标注，禁止使用 any”。
* **`AGENTS.md` (通用开放标准 / Cline 等共享)**：由主流 AI 工具链联合发布的开放标准。它主要针对自主 Agent，用高度结构化的语料定义目录树逻辑、安全禁区、依赖边界及故障自愈流程。

### 💡 独立维护的符号链接（Symlink）艺术

如果你的团队同时使用 Claude Code 和 Cursor，或者未来打算引入多种智能体编排，**绝对不要手动维护两份独立的规则文件**——冲突的规则比没有规则更糟糕。

标准的工程做法是：在项目根目录下维护一份唯一的 `AGENTS.md` 作为主宪法，然后通过终端命令创建符号链接，让 `CLAUDE.md` 和 `.cursorrules` 物理指向它：

```bash
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md .cursorrules

```

---

## 2. “指令优先”原则与规则的投资回报率（ROI）

人类日常交流习惯使用带有感情色彩和模糊的词汇（如“尽量简洁一点”、“看起来好一些”）。对于严密的软件开发，这种含糊的描述只会放大 AI 的幻觉。我们必须采取“指令优先（Command-First）”原则，改用高强度、结构化、无歧义的条件触发命令。

* ❌ **模糊措辞（低效）**：`“请帮我写个工具函数把时间格式化一下，最好优雅、简单一点，谢谢。”`
* 🟢 **指令优先（高效）**：
> **Rules**:
> 1. 函数签名必须为：`export function formatDateTime(isoStr: string, pattern: string): string`
> 2. 内部实现仅允许使用原生 `Intl.DateTimeFormat`，严禁引入 `moment.js` 或 `dayjs`。
> 3. 必须通过 100% 的单元测试。如果格式非法，必须显式抛出 `InvalidTimeFormatError`。
> 
> 



### 📊 规则的 ROI 模型：精简你的白板

根据最新对前沿推理大模型的长文本测试，大模型对系统指令的遵守率随着输入内容的堆叠呈明显的基准下降趋势。当规则文件超出水位线后，模型的**指令遵守率会从 95% 骤降至 60%**。

这表明 **规则文件越长，单条规则被模型遗忘的概率就越高**。社区共识是：**根目录规则文件必须保持在 200 行以内，150 条指令是可靠遵守的上限。** 我们必须根据 **ROI（投资回报率）** 精挑细选写入规则文件里的每一行内容：

| ROI 评级 | 规则类型 | 技术说明 | 典型示例 |
| --- | --- | --- | --- |
| ⭐⭐⭐⭐⭐ | **构建/运行/测试命令** | 自动执行性价比最高，Agent 必须直接复制在终端无感运行。 | `make install` / `pnpm test` |
| ⭐⭐⭐⭐ | **架构决策背景 (WHY)** | 说明某些特定约定的设计意图，防止 AI 跨多文件重构时改坏。 | `“代码按 Feature 组织而非传统 MVC”` |
| ⭐⭐⭐⭐ | **技术栈硬性约定 (WHAT)** | 强行规定禁用的轮子或必须使用的统一安全组件。 | `“禁止使用 Moment.js，统一用 date-fns”` |
| ⭐ | **Linter 已覆盖的风格规则** | **几乎没有价值**。能用静态分析强制卡死的，就不要浪费 AI 宝贵的上下文窗口。 | `“缩进使用 2 空格”`（由 Prettier 负责） |
| ❌ | **冗长的散文说明** | **负资产**，严重稀释模型的注意力矩阵。 | 啰唆的项目历史背景与感性描述 |

---

## 3. CLAUDE.md 的结构设计：WHAT / WHY / HOW

最有效的项目宪法应当严格围绕 **WHAT（项目与技术栈定义）**、**HOW（如何构建与测试）**、**WHY（架构关键约定）** 三大支柱展开。以下是一份经过工业实践验证的 **生产级 `CLAUDE.md` 规范模板**：

```markdown
# Vanish Project Protocol

## 1. WHAT: 项目与技术栈定义
一个面向高并发场景的项目管理 SaaS 核心后端，技术栈限制如下：
- 后端：Python 3.12 · FastAPI · SQLModel · Alembic
- 前端：Next.js 15 (App Router) · TypeScript 5.x · Tailwind CSS 4.0
- 测试：pytest (后端) · Vitest (前端)
- 🚫 禁止使用：Moment.js、jQuery、class-based React 组件

## 2. HOW: 构建与运行命令 (最高 ROI 核心区)
当你需要执行相关工程动作时，直接免签运行以下本地命令：
- 安装依赖：`pnpm install && pip install -e ".[dev]"`
- 启动后端：`uvicorn src.main:app --reload --port 8000`
- 启动前端：`pnpm dev`
- 运行测试：`pytest` (后端) / `pnpm test` (前端)
- 静态卡点：`pnpm typecheck`
- 代码格式：`black . && ruff check . --fix`

## 3. WHY: 架构说明与关键约定
- 代码严格按照功能模块（Feature）组织。每个独立功能在 `src/features/` 下拥有专属目录（包含自己的 router、service、schema 以及 tests）。
- 数据库操作仅在 `*_repository.py` 中进行，严禁在 router 路由层直接操纵 DB 实例。
- 所有的 API 响应结构，必须使用统一的 `ApiResponse[T]` 包装类型封装输出。

## 4. 🚫 反模式禁区 (Anti-Patterns)
- 不要修改 `alembic/versions/` 中已经物理递交的数据库旧迁移文件。
- 创建单文件绝对禁止超过 300 行，超出时必须强制进行模块化拆分。

```

---

## 4. 实战范本：Next.js 15 & React 19 专属开发铁律

为了让大模型在开发前沿前端项目时不写出过时的老旧代码（例如使用老旧的 `getServerSideProps` 或在 React Server Components 中无脑滥用 `'use client'`），我们可以在根目录下单独配置面向编辑器的 `.cursorrules` 文件：

```markdown
# Next.js 15 & React 19 开发铁律

## 1. 角色定位
你是一名精通 Next.js 15 (App Router)、React 19、TypeScript 以及 Tailwind CSS 4.0 的殿堂级前端架构师。

## 2. 核心规约

### React Server Components (RSC) 优先
- 所有在 `app/` 目录下的组件默认均为 Server Components。
- 只有当组件需要处理客户端动态交互（如 `onClick`、表单状态、`useEffect`）时，才允许在文件最顶部添加 `'use client'` 声明。
- 绝不准在 RSC 中直接导入包含浏览器端专属 API（如 `window`, `document`）的外部类库。

### 数据获取与变更变更
- 页面数据拉取必须使用标准的 `async/await` Server Components 模式。
- 所有的表单提交与数据变更，强制使用 React 19 **Server Actions**。
- 处理客户端表单等待状态时，优先使用 React 19 的 `useActionState` 和 `useFormStatus`，坚决淘汰旧版的 `useState` 状态打补丁模式。

### TypeScript 与安全规约
- 绝对禁止使用 `any` 类型。如果由于第三方库类型缺失不可控，必须显式添加 `// eslint-disable-next-line` 并写明工程理由。
- 所有来自外部请求的 Response Payload，必须使用 `zod` 实施强类型校验。

## 3. 落地验收标准 (DoD)
- 在你向人类声称任务完成前，必须在本地终端完整运行：`npm run build && npm run test`。
- 只有当该命令的执行返回退出码 `0` 时，方可交付控制权。

```

---

## 5. 高级进阶：分层配置与 `@import` 语法

当项目逐渐变大时，如果把所有规则都死板地堆在根目录，必定会突破 200 行防线，加速 AI 的“迷失与失忆”。

现代 AI 编程代理（如 Claude Code）在底座层面支持了 **`@path/to/file` 语法**，允许你在主宪法中通过动态链接导入子文档。同时，它还支持**功能级局部目录配置**：在具体子功能目录下放置局部的 `CLAUDE.md`，当 AI 穿行进入该特定目录时会自动激活加载，而在全局 Session 中则不会平白无故污染主上下文。

### 📂 分层项目目录树拓扑示例

```text
Vanish/
├── CLAUDE.md                      # 主宪法文件（通过 @import 保持在 150 行以内）
│    ├── @docs/git-conventions.md  # 动态导入 Git 规范
│    └── @docs/api-design.md       # 动态导入 API 规范
│
├── .claude/
│    ├── settings.json             # 工具权限与沙箱硬约束配置
│    └── skills/
│         └── db-migration/SKILL.md # 数据库迁移专属操作技能包
│
├── src/features/
│    ├── billing/
│    │    └── CLAUDE.md            # 局部规则（仅在 billing 目录下生效。如：“Stripe 金额必须使用分为单位的整数”）
│    └── auth/
│         └── CLAUDE.md            # 认证模块局部硬约束
│
└── docs/
     ├── git-conventions.md        # 被主文档动态 @import
     └── api-design.md             # 被主文档动态 @import

```

---

## 6. 落地完成标准（DoD）与熔断升级机制

对于具有终端控制权限的自主 Agent，最危险的事情就是它就地写完了代码，却在根本没有验证可用性的情况下，就直接邀功告诉你“任务完成了”。我们必须在系统规则中明文注入它的 **落地完成标准（DoD）** 与 **熔断升级规则（Escalation Protocol）**。

### 🏁 退出码（Exit Code）卡点交工协议

在项目的根目录规则中，必须写入以下机器死命令：

> “Agent 在声称任务完成前，**必须且只能**在本地终端运行以下命令：`pnpm run build && pnpm run test`。
> 只有当该命令的执行返回退出码 `0`（编译通过、单测全绿）时，方可交工。若返回非零退出码，必须原地自主启动重构，直到全绿为止。”

### 🚨 失败熔断升级协议

Agent 很容易在遇到顽固环境 Bug 时，由于过度轴的特征陷入**自我纠错的无限死循环**，疯狂空耗你的 API 额度。我们必须在系统规则中为其划定强行叫停的红线：

> “**【熔断升级规则】**：若你在修改代码并运行测试的过程中，**连续 3 次**遇到了完全相同的编译或测试报错日志，表明你已进入认知盲区。**请立刻停止所有自主修改动作**，在终端输出当前遇到的瓶颈成因、你的 2 个排错假设，并主动挂起进程、请求人类架构师接入协助。”

---

## 7. 赛博规则守门员：Husky Pre-commit 拦截架构

为了确保团队中由 AI 生成的每一行代码在合入主干前都绝对合规，我们可以在 Git 提交前通过 **Pre-commit Hook** 自动进行规则一致性审计。在根目录配置 `.husky/pre-commit` 脚本：

```bash
#!/sh
. "$(dirname "$0")/_/husky.sh"

echo "🛡️  正在启动赛博规则守门员，启动规则一致性审计..."

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

---

## 8. 从失败中迭代：活文档与“复利工程”

好的项目宪法从来不是一次性拍脑门规划出来的，而是伴随项目的演进而生长的**活文档（Living Documents）**。

当 AI 犯了某个原本能通过规则避免的错误时（比如引入了一个被禁用的旧第三方库），你就应当立刻把对应的防御规则写入 `CLAUDE.md` 的 `Anti-Patterns` 区域。这种“失败驱动的规则累积”被称为**复利工程 (Compound Engineering)**。每一条踩坑得来的新规则，都在为未来的 Session 提供免受相同错误折修折磨的物理免疫保护。

### 规则的生命周期管理

* **每两周审查**：团队应每两周对根目录的规则文件进行走查，剔除由于底层技术债清除而不再适用的陈旧命令。
* **规则能力下沉**：如果某些代码风格或规约已经内化为团队的默认习惯，应将其迁移至 ESLint、Prettier 或标准的 Linter 配置文件中。**能用静态分析工具强制约束的，就绝不占用 AI 宝贵的上下文窗口。**

