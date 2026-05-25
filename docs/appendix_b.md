---
title: 附录 B：常见 AI 优先 IDE 与命令行 Agent 常用快捷键及命令速查表
---

# 附录 B：常见 AI 优先 IDE 与命令行 Agent 常用快捷键及命令速查表

> **“熟练掌握快捷键与命令，能将你与 AI 的对话速度提升 3 倍以上，真正做到‘思维的流逝即是代码的喷涌’。”**

---

## ⌨️ 1. Cursor & Windsurf 核心快捷键（VS Code 基础继承）

| 快捷键 (Windows / Linux) | 快捷键 (macOS) | 功能描述 | 最佳实践场景 |
| :--- | :--- | :--- | :--- |
| `Ctrl + K` | `Cmd + K` | **行内 AI 编辑/生成** | 直接在当前编辑器选中几行代码，输入“添加异常处理”或“重写为箭头函数”。 |
| `Ctrl + L` | `Cmd + L` | **侧边栏 Chat 对话** | 提问全局性问题，或是向 AI 询问代码原理，默认会将当前文件作为上下文。 |
| `Ctrl + I` | `Cmd + I` | **Composer (多文件协同)** | 进行跨模块重构、多文件并发改写时的终极利器。 |
| `@` | `@` | **上下文召唤菜单** | 在 Chat 或 Composer 中输入，快速引入外部文件、文件夹、Git 提交或在线 Docs。 |
| `Ctrl + Shift + Y` | `Cmd + Shift + Y` | **接受所有 AI 推荐 (Accept All)** | 快速同意 AI 刚刚在 Composer 中进行的所有增量改动。 |

---

## ⚙️ 2. Cline 核心配置与工具使用指南

Cline 作为一个高自主性的 Agent 插件，支持以下强大的扩展能力：

### 🛠️ Tool Use（工具调用权限）配置
* **Read / Write Files**：允许 Cline 直接读取或创建/修改你本地的源文件。
* **Execute Commands**：运行终端命令。建议将 `npm run dev`、`npm test` 等授权给它。
* **Browser Sandbox**：开启本地 Puppeteer 渲染，允许 Cline 对你刚写好的前端网页进行截图和像素级视觉对齐。

---

## 🐚 3. Claude Code & Aider 命令行指令速查

对于终端极客，以下命令是高频使用的灵魂伴侣：

### 🚀 Claude Code (Anthropic 原生 CLI)

```bash
# 启动 Claude Code 交互会话
claude

# 常用交互内置指令（在 claude 交互式命令行中输入）：
/bug        # 开启 Bug 深度追踪模式，输入报错，自动排脏
/compact    # 压缩当前历史会话，防止上下文臃肿，节省 Token
/clear      # 清除当前屏幕和历史缓冲
/help       # 召唤所有内置指令说明
```

### 🐙 Aider (结对 Git 结对编程神兵)

```bash
# 启动 aider，指定当前使用的强力推理模型（推荐 Claude 3.5 Sonnet）
aider --model anthropic/claude-3-5-sonnet

# 在 Aider 终端中的内置快捷指令：
/add <file>      # 将特定文件加入到 AI 的“只读/读写”上下文地图中
/drop <file>     # 从 AI 的上下文地图中移除特定文件，降低噪音
/git <command>   # 在 Aider 内部运行原生的 Git 命令
/test <command>  # 自动运行指定的测试命令，失败时 AI 会自动感知并原地重写修复
/exit            # 优雅退出 Aider
```
