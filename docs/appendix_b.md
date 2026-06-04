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

## 🐚 2. 命令行生产力提升：Shell 与 Git 别名 (Aliases)

为了高频启动和控制你的命令行 Agent，建议在你的 Shell 配置文件（如 `.bashrc` 或 `.zshrc`）中配置以下快捷别名：

```bash
# 命令行 Agent 快捷启动
alias cc="claude"                     # Claude Code 原生终端
alias ad="aider --model anthropic/claude-3-5-sonnet"  # 默认 Sonnet 启动 Aider
alias ad-ds="aider --model deepseek/deepseek-chat"    # 极低成本 DeepSeek 启动 Aider

# Git 一键原子提交别名
alias g-cr="git diff --cached | aider --msg" # 使用 Aider 自动生成符合规范的提交消息并提交
```

---

## ⚙️ 3. Aider 生产级配置文件示例 (`.aider.conf.yml`)

将以下内容保存到你项目根目录下的 `.aider.conf.yml` 文件中，可以锁定每次启动时的默认行为，不用繁琐地敲击超长命令参数：

```yaml
# Aider 局部配置文件
model: anthropic/claude-3-5-sonnet  # 默认主推理模型
weak-model: deepseek/deepseek-chat   # 廉价辅助模型（用于处理简单任务和编写 Commit）

# 缓存与安全设置
cache-prompts: true                 # 开启提示词缓存 (Prompt Caching)，能省下 90% 的输入 Token 账单
auto-commits: false                 # 禁止 Aider 自动进行 Git Commit（保持人类最高法官的手动提交习惯）
dirty-commits: false                # 发生修改但测试失败时禁止提交

# 验证门禁
test-cmd: npm run test              # 绑定本地自动化测试脚本，Aider 修改后可一键运行验证
auto-test: true                     # 当你命令它测试时，全自动执行上述命令
```

---

## 🔌 4. Cline MCP 客户端配置文件示例 (`cline_mcp_settings.json`)

若要在 Cline 中快速接入外部数据库和工具，可以在你的全局 Cline 插件目录中（通常在 `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`）配置自定义 MCP 服务：

```json
{
  "mcpServers": {
    "sqlite-mcp-server": {
      "command": "npx",
      "args": [
        "tsx",
        "c:/projects/mcp-sqlite-server/index.ts"
      ]
    },
    "memory-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    }
  }
}
```
*(注意：请将 `sqlite-mcp-server` 中的绝对路径替换为您本地实际的项目路径。)*
