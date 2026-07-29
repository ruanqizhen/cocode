# Claude Code 与 Google Antigravity

> “兵无常势，水无常形。” ——《孙子兵法》

在上一章中，我们系统梳理了 AI 编程工具的六大垂直形态。如果说那是一张俯瞰全局的兵器谱，那么本章我们将挑选在这张谱系中代表着两个极端哲学演进的统治者，进行全方位的解剖与对决。

它们就是：

* Claude Code：信奉“终端即一切”、将 Unix 管道哲学发挥到极致的孤高利刃。Claude Code 在笔者写这本书的过程中，是市面上效果最好的 AI 编程工具，没有之一，也是笔者在工作中的主力工具。
* Google Antigravity：构建“多代理协同、可视化要素拉满”的跨时代代理母舰。因为笔者已经购买了 Google Pro 订阅，所以 Google Antigravity 对于笔者来说是最便宜的 AI 编程工具，这是笔者家用的主力 AI 编程工具。

这两款工具不仅代表了 Anthropic 与 Google 在软件工程领域的最高技术结晶，更揭示了未来人机结对协作的两种截然不同的演进范式。本章将带你深入其核心架构，并在尾部为你奉上一份使用超低成本的 DeepSeek 模型强行驱动 Claude Code 高级全自动开发阵地的实用策略。


## Claude Code

### 产品定位

Claude Code 是 Anthropic 官方推出的终端原生 AI 编程代理（CLI Agent）。它拒绝向任何传统的 GUI 编辑器妥协，它既不是一个庞大的独立 IDE，也不是侧边栏里喧宾夺主的插件。它只是一个静静躺在你的命令行（Shell）中、随时准备被唤醒的黑客化身。

它的核心设计哲学非常纯粹：“在你已经工作的地方与你相遇，使用你已经喜欢的工具。” 它直接依托本地系统的最高执行权限，像一个真正的人类极客一样，和你的各种底层脚本、Git 流水线、CI/CD 管道融为一体。

### 核心硬核能力

| 核心能力 | 工程视角的实际操作表现 |
| --- | --- |
| 全自动无感构建 | 你丢给它一个自然语言目标，它自己规划方案、编写代码、排查本地语法错误并确保跑通。 |
| 自愈式 Debug | 粘贴一段终端报错或直接指派一个 Bug，它会自动遍历代码库、定位根源并就地实施修复。 |
| 无死角导航 | 保持对全局项目依赖和 AST 的精准感知，随时解答诸如“这个过时接口在哪被隐式调用了”等宏观问题。 |
| 繁琐工程自动化 | 批量自动修复 Lint 问题、自主解决大批量的 Git 合并冲突（Merge Conflicts）、自动提炼 Release 日志。 |
| MCP 跨界连接 | 基于模型上下文协议（Model Context Protocol），它能打破本地沙箱，直接去读写你的 Google Drive、Figma 蓝图，或者直接在 Slack、Jira 上与团队对齐任务进度。 |

### 交互范式

Claude Code 摆脱了图形界面的束缚，在终端中衍生出了极高自由度的交互模式：

#### 交互式终端模式


:::tip 背景知识：Node.js
Claude Code 是基于 Node.js 开发的，因此需要安装 Node.js 才能运行。如果你还不了解 Node.js，可以先阅读 [Node.js](nodejs)，然后再回来继续阅读下面的内容。
:::

```bash
# 跨平台一键全局安装
npm install -g @anthropic-ai/claude-code 

# 在你的项目根目录下直接唤醒 AI 智能体
cd my-backend-project
claude

```

此时终端会切入一个专有的对话沙箱，你可以直接对它下达各类激进的系统重构指令。

#### 非交互式脚本模式

```bash
claude -p "深度分析当前项目的权限校验架构并输出一份 Markdown 安全文档"

```

#### 管道（Pipe）模式

这是让所有老派极客高呼过瘾的能力。它可以无缝嵌套进 Linux 的管道流中，实时过滤、提炼动态上下文：

```bash
# 分析最近的日志快照（注意：tail -f 永不结束，会导致 -p 模式挂起，需用 tail -n）
tail -n 200 app.log | claude -p "如果发现未知异常，立刻提炼堆栈信息并给出潜在的修复方案"

# 将历史报错直接喂入，进行全自动根本原因分析（RCA）
cat crash-error.log | claude -p "分析这些错误的根本原因，查查是不是跟我们的 Redis 连接池溢出有关"

```

> **⚠️ 注意：** `claude -p` 会读取 stdin 直到 EOF，`tail -f` 永不结束会导致命令挂死。流式监控请用 `tail -n` 截断或配合脚本定时采样。

### 独家底层黑科技机制

1. `CLAUDE.md`（数字入职指南）：这是 Claude Code 上下文工程的灵魂锚点。在项目根目录下维护这个文档，里面写满你项目的古怪规矩、构建命令、绝对禁止触碰的红线。它就像给新来的资深同事准备的“免责声明”，Claude Code 每次启动前都会将其作为首要规则去遵守。
2. Extended Thinking（扩展思考机制）：当遇到极其诡异的架构死锁时，Claude Code 会触发深层推理链。你能在终端直观地看到它密密麻麻的“心理活动轨迹”，在不增加废话的前提下展示极高纯度的技术自我反思。
3. Auto-compact（上下文压缩）：当你在一个终端会话里长篇大论，导致上下文窗口达到阈值时，工具层的 Harness 会调用 `/compact` 对前文的闲聊与过期日志进行核心意图压缩与摘要，将当前活跃的 Token 占用控制在合理范围内。
4. 沙箱式安全防线：基于平台原生隔离机制构建（macOS 使用 Seatbelt / sandbox-exec，Linux 使用 Namespace / cgroups，Windows 使用 ACL 权限控制），对危险命令、高敏感文件和环境变量进行权限确认和围栏隔离，支持配置网络访问策略，严防 AI 产生破坏性越权。

### 使用成本

Claude Code 推出了商业版固定月费计划，有 20 美元/月、100 美元/月和 200 美元/月等不同档位的套餐。200 美元的套餐足够职业程序员日常一般强度使用，但如果需要重度使用，比如运行多轮循环辩论，恐怕还是会捉襟见肘。总而言之，Claude Code 非常好用，但比较贵。



## Google Antigravity

### 产品定位

如果说 Claude Code 是一位擅长白刃战的顶级刺客，那么 Google Antigravity 就是一艘高居天幕、指挥无数小兵协同作战的航空母舰。

Antigravity 是 Google 针对未来全自动开发时代祭出的王牌产品。它基于 VS Code 开源底座深度改造，但从底层重构了 IDE 的基础哲学：它宣布软件工程彻底告别“人类写代码、AI 在侧边栏提供建议”的辅助时代，正式跨入“人类充当架构负责人（Manager），全权调度多代理（Agents）协作开发”的领航时代。

### 核心视觉奇观

当你启动 Antigravity，你会看到它最具辨识度的核心 UI 范式——将工作流彻底分为左右两个世界：

```text
┌───────────────────────────────────────┬───────────────────────────────────────┐
│                                       │                                       │
│          Agent Manager                │               Editor                  │
│         (任务控制中心)                 │            (标准编辑器)                │
│                                       │                                       │
│  [Agent 1: 正在修复 SQL 注入 Bug]      │  * 100% 保留 VS Code 原生生态          │
│  [Agent 2: 正在编写用户模块单元测试]    │  * 键位、快捷键、插件完全兼容            │
│  [Agent 3: 正在重构前端自适应组件]      │  * 直观审查代理提交的 Code Diff         │
│                                       │                                       │
└───────────────────────────────────────┴───────────────────────────────────────┘

```

- Agent Manager（任务控制中心）：你在这里扮演高级技术总监。你只需下达宏观的母任务（Missions），系统就会自动孵化、衍生出多个平行的子代理（Sub-agents）。你能在这里实时监控每个代理的生命周期、思考逻辑和当前的任务卡点。
- Editor（标准编辑器）：这里依然保留了你最习惯的 VS Code 宇宙（插件、主题、肌肉记忆）。你主要在这里以第三者的视角，用内联命令（Cmd+I）去精细化调教局部代码，或者批准代理们递交上来的改动。

### 代理母舰的杀手锏特性

#### 多代理高并发并行（Multi-Agent Concurrency）

这是对传统 Chat 工具最具毁灭性的代际超越。在传统的侧边栏工具里，你必须等 AI 把上一个接口写完、字敲完，才能提下一个问题。
而在 Antigravity 中，你可以同时点击“创建新代理”，指派任务 A 去修前端样式，指派任务 B 去改后端数据库契约，指派任务 C 去编写单元测试。多个 Agent 在各自隔离的虚拟上下文沙箱里高并发向前推进，成倍拉升生产力。

#### 完美的“制品系统（Artifacts）”与工作证明

Antigravity 认为，人类总监不可能有精力去阅读 Agent 那动辄上万轮的对话历史。因此，它要求代理在工作时，必须沉淀并生成高度可视化的“制品”来作为工作汇报证明：

| 制品类型 | 实际工程说明 |
| --- | --- |
| Task Lists | 代理开工前自我拆解的结构化任务看板 |
| Implementation Plan | 代理生成的宏观架构改动方案图纸 |
| Walkthrough | 完工后，代理自动提炼的技术变动摘要与测试点对齐说明 |
| Screenshots / Video | 前端开发者的终极福音：代理自动截取页面改动前后的对比图，甚至自动录制前端交互点击的视频，以此向人类证明“我的页面没有画歪” |

你可以像审阅 Google Docs 一样，直接在这些制品上划词添加人类意见，代理收到反馈后会自动进行新一轮的自愈迭代。

#### 内置原生 Chrome 浏览器代理

Antigravity 深度打通了 Google 自家的 Chrome 浏览器内核。当代理编写完一段前端代码后，它能自主拉起一个无头浏览器，亲自去点击按钮、填写表单、在真实的 DOM 环境中验证逻辑是否跑通。 它不仅仅是“会写代码的 Agent”，它更是“会自己做端到端（E2E）UI 测试的 QA Agent”。



## 让 Claude Code 跑在 DeepSeek 引擎上

在上一章的未来趋势中，我们抛出了一个极具颠覆性的行业论断：“模型是流水的老兵，工具层的 Harness 才是铁打的营盘。”

为了向你以物理级的方式证明这个论点，我们要玩一把硬核的。Claude Code 官方虽然名义上绑定了 Anthropic 模型，但社区已验证可通过环境变量将请求路由到兼容层。DeepSeek 官方主推 OpenAI 兼容接口，而 Anthropic 兼容则需通过第三方代理（如 LiteLLM Proxy 或社区转发层）实现，或使用支持 Anthropic 格式透传的代理端点。

这意味着，我们可以通过环境变量，将 Claude Code 那个世界级、懂得如何深度操控终端和 Git 的聪明“身体（Harness）”，嫁接到价格更具优势的 DeepSeek 大脑上！但需注意：这属于非官方用法，兼容性可能随版本变化。

下面为你奉上整套配置流水线。

### 前置条件准备

1. 确保本地安装了 Node.js 18+ 环境。
2. 登录 [DeepSeek Platform](https://platform.deepseek.com/) 开发者后台，生成一枚全新的 `sk-` 格式 API Key，并确保账户内注入了充足的算力余额。

### 步骤一：全局安装 Claude Code

在你的宿主终端内执行安装命令（官方当前推荐原生脚本为首选，npm 为备选）：

```bash
# 官方推荐（首选）
curl -fsSL https://claude.ai/install.sh | bash

# 或 npm 方式（备选，需 Node.js 18+）
npm install -g @anthropic-ai/claude-code

```

### 步骤二：实施环境变量劫持

我们需要利用环境变量，在 Claude Code 发起网络请求的瞬间，将流量路由到兼容层中转服务器上，并指定模型名称。

> **⚠️ 重要声明：** `https://api.deepseek.com/anthropic` 并非 DeepSeek 官方稳定提供的 Anthropic 兼容端点，实际使用时需替换为你自建的 LiteLLM Proxy、Claude-to-OpenAI 转发代理或社区验证可用的兼容层地址。DeepSeek 官方 `https://api.deepseek.com` 主推 OpenAI 格式。下方示例以社区常见的兼容代理写法为示意，**请替换为实际可用的代理地址**，并使用 DeepSeek 官方存在的模型 ID（如 `deepseek-chat`、`deepseek-reasoner`）。

#### 🍏 macOS / Linux 用户（写入 Shell 配置文件）

打开你的 `~/.zshrc` 或 `~/.bashrc` 文件，将以下配置粘贴到最底部（**替换代理地址和模型为真实可用值**）：

```bash
# =====================================================================
# CLAUDE CODE + DEEPSEEK (via compatible proxy)
# 注意：ANTHROPIC_BASE_URL 需指向 Anthropic 兼容代理，而非 DeepSeek 官方直接端点
# =====================================================================
# 1. 劫持基础网关路由，指向兼容代理（示例地址，请替换为实际代理）
export ANTHROPIC_BASE_URL=https://your-compatible-proxy.example.com/anthropic

# 2. 注入你的 DeepSeek 密钥（由代理层转发）
export ANTHROPIC_AUTH_TOKEN="你的_DEEPSEEK_API_KEY_XXXXXXXX"

# 3. 模型映射（必须使用 DeepSeek 官方真实模型 ID，不支持 [1m] 后缀语法）
export ANTHROPIC_MODEL="deepseek-chat"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-chat"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-chat"

# 4. 将轻量子代理定向给性价比高的模型
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-chat"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-chat"

# 5. 放开 API 超时上限限制（如需）
export API_TIMEOUT_MS=600000

```

保存文件后，在终端执行 `source ~/.zshrc` 生效。

#### 🪟 Windows 用户（PowerShell 永久持久化）

```powershell
# 注意：请将 BASE_URL 替换为实际可用的 Anthropic 兼容代理地址
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://your-compatible-proxy.example.com/anthropic", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "你的_DEEPSEEK_API_KEY_XXXXXX", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "deepseek-chat", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_OPUS_MODEL", "deepseek-chat", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_SONNET_MODEL", "deepseek-chat", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_HAIKU_MODEL", "deepseek-chat", "User")
[System.Environment]::SetEnvironmentVariable("CLAUDE_CODE_SUBAGENT_MODEL", "deepseek-chat", "User")

```

配置完成后，重新打开一个干净的 PowerShell 窗口即可。

### 步骤三：见证奇迹的冷启动

现在，进入你的任意软件工程项目根目录下，直接敲下唤醒圣谕：

```bash
claude

```

此时，Claude Code 依然会像往常一样拉起控制台字符动画，初始化本地沙箱文件监控器。但从这一秒起，你在终端里下达的所有复杂多步代码改写任务，其背后真正提供算力支撑的，已经是性价比极高的 DeepSeek 大脑了！


## 换核运行的红线、痛点与代价反思

这种“偷天换日”虽然能帮你将开发 Token 账单显著降低，但也必须客观面对跨厂商兼容时产生的物理硬伤。在实践中，你需要特别注意并防范以下“地雷”：

1. 缺失原生的 Extended Thinking（扩展思考）功能：Claude Code 底层是针对 Claude 原生特有的 `thinking` 字段进行解析设计的。DeepSeek 即使通过兼容层接入，其思考推理链条也可能会被压缩或忽略，在面对超级复杂的系统长推理时，可能会发生偶发性的语义失联或“降智”。
2. 提示词缓存（Prompt Caching）的失效开销：Claude Code 极度依赖 Anthropic 官方的 `cache_control` 特性，以此来实现超长会话中对代码库全量常驻时的极速首字输出（TTFT）。换用第三方兼容接口后，如果该端点对缓存的管理不够完善，你可能会发现长对话中每一次按回车的等待时间开始拉长。
3. 回归原生的逃生通道：如果你在大规模高压重构时，发现 DeepSeek 的模型因为某些小众框架的闭源常识出现反复死循环，不要惊慌。
   * macOS/Linux（临时）：`unset ANTHROPIC_BASE_URL`（仅当前 Shell 生效，需同时从 `~/.zshrc` 删除持久化配置）。
   * macOS/Linux（永久）：从 `~/.zshrc` / `~/.bashrc` 中删除上述 `export` 行，执行 `source ~/.zshrc`。
   * Windows：执行 `[System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", $null, "User")` 删除用户级变量，并从系统环境变量设置面板中移除其余相关变量，重启终端即可。Claude Code 会瞬间退回到官方服务器。

DeepSeek 虽然在极端复杂任务上能力不及 Claude 原生模型，但价格更具优势，是笔者在家使用的备用 AI 编程工具。当主力工具超出套餐限量时，使用 Claude Code + DeepSeek 顶上。


