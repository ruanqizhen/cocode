# 用于生成 AI Agent 的提示词

把下面的提示词复制粘贴给 AI，它就会生成一个用 Python 编写的 AI Agent。

```md
# Role
 
你是一位专精于 Windows 系统自动化的资深 Python 后端架构师，同时具备纵深防御（Defense-in-Depth）安全理念。你的代码必须在保证功能完整的前提下，将安全性置于设计核心，而非事后补丁。
 
---
 
# Task
 
编写一个**完全可运行**的单文件 Python 脚本，命名为 `win_agent.py`。
 
该脚本通过 DeepSeek API（OpenAI SDK 兼容格式）的 **Function Calling** 功能，将用户的自然语言指令转化为安全、可审计的 Windows 系统操作。
 
**禁止使用** LangChain、LlamaIndex、AutoGen 等任何高层 Agent 框架。
 
---
 
# Architecture & Core Loop
 
实现纯 Python 的 **ReAct（Reason → Act → Observe）** 闭环。完整流程如下：
 
```
用户输入
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  LOOP（最多 MAX_LOOPS = 10 次）                      │
│                                                     │
│  1. 构建 messages 列表，附带 tools schema            │
│  2. 调用 DeepSeek API（stream=False）                │
│  3. 检查响应：                                       │
│     ├─ 含 tool_calls → 进入「安全网关」              │
│     │     ├─ 通过 → 执行工具函数                    │
│     │     ├─ 拒绝 → 返回拒绝原因给模型              │
│     │     └─ 需确认 → 控制台询问 [Y/N]              │
│     │  将工具结果以 role="tool" 追加至 messages      │
│     │  继续下一轮循环                                │
│     └─ 无 tool_calls → 打印最终回复，退出循环        │
└─────────────────────────────────────────────────────┘
```
 
**多轮会话**：主程序为 `while True` 交互循环，每次用户输入作为新一轮对话起点；输入 `exit` 或 `quit` 时安全退出。每轮对话的 `messages` 列表独立，不跨轮保留（避免 Token 无限膨胀）。
 
---
 
# Security Architecture
 
## 原则一：最小权限工具设计
 
**绝对禁止**设计 `run_shell(cmd: str)` 此类任意命令执行接口。  
所有工具必须是**参数语义明确**的单一职责函数。每个参数都有明确的类型和取值范围约束。
 
## 原则二：安全网关（Security Gateway）
 
在工具调度器（dispatcher）中实现统一的安全网关，**先于函数执行**进行校验：
 
```python
def security_gateway(func_name: str, args: dict) -> tuple[bool, str]:
    """
    返回 (is_allowed: bool, reason: str)
    - is_allowed=True：允许执行
    - is_allowed=False：拒绝执行，reason 为拒绝原因（将作为 tool result 返回给模型）
    """
```
 
网关规则：
- `open_app`：白名单校验，`app_name` 必须在 `ALLOWED_APPS` 集合中
- `kill_process`：黑名单校验，`process_name`（大小写不敏感）不得在 `PROTECTED_PROCESSES` 集合中
- `clean_downloads_folder`：`days` 参数必须在 `[1, 365]` 范围内
- `set_reminder`：`minutes` 参数必须在 `[1, 1440]` 范围内
## 原则三：Human-in-the-Loop（危险操作二次确认）
 
以下操作在**工具函数内部**弹出控制台确认提示，而非在网关层：
- `clean_downloads_folder`：打印将被移动的文件清单后，提示 `确认移动以上 N 个文件? [Y/N]: `
- `kill_process`：打印目标进程的 PID 和完整路径后，提示 `确认终止进程 {name} (PID: {pid})? [Y/N]: `
用户输入 N 或非 Y 内容时，立即返回 `"操作已被用户取消"` 字符串（工具正常返回，不抛异常）。
 
## 原则四：循环熔断
 
```python
MAX_LOOPS = 10
```
 
超出后终止循环，向用户打印警告，不继续消耗 Token。
 
## 原则五：环境变量管理
 
```python
API_KEY  = os.environ["DEEPSEEK_API_KEY"]    # 缺失时 KeyError，立即终止并提示
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
MODEL    = os.environ.get("DEEPSEEK_MODEL",   "deepseek-chat")
```
 
---
 
# Tool Specifications
 
实现以下 **6 个工具函数**，并为每个函数提供完整的 JSON Schema（含 `name`、`description`、`parameters`，`description` 必须包含使用场景、参数含义、返回值格式说明）。
 
---
 
### Tool 1: `get_system_stats() -> dict`
 
**功能**：获取系统资源快照。
 
**实现要点**：
- 使用 `psutil.cpu_percent(interval=1)` 获取 1 秒均值 CPU 使用率
- 使用 `psutil.virtual_memory()` 获取内存信息
- 使用 `psutil.disk_usage('C:\\')` 获取 C 盘磁盘信息
**返回格式**（JSON 字符串，下同）：
```json
{
  "cpu_percent": 23.5,
  "memory": {"total_gb": 16.0, "used_gb": 8.2, "percent": 51.3},
  "disk_c": {"total_gb": 476.0, "used_gb": 210.3, "free_gb": 265.7, "percent": 44.2}
}
```
 
---
 
### Tool 2: `open_app(app_name: str) -> str`
 
**功能**：启动白名单内的 Windows 应用。
 
**白名单常量**（定义为模块级）：
```python
ALLOWED_APPS = {"notepad", "calc", "mspaint", "explorer", "taskmgr"}
```
 
**实现要点**：
- 使用 `subprocess.Popen([app_name], shell=False)` 启动（`shell=False` 为安全要求）
- 成功时返回 `"已启动 {app_name}，PID: {proc.pid}"`
- 白名单校验在安全网关层完成，工具内无需重复
---
 
### Tool 3: `list_directory_files(path: str, extension: str = "") -> dict`
 
**功能**：列出指定目录的文件。比原版 `list_desktop_pdfs()` 更通用，支持按扩展名过滤。
 
**路径白名单**（安全网关校验，工具内部也需二次验证）：
```python
ALLOWED_SCAN_DIRS = {
    "desktop":   Path.home() / "Desktop",
    "downloads": Path.home() / "Downloads",
    "documents": Path.home() / "Documents",
    "pictures":  Path.home() / "Pictures",
}
```
 
`path` 参数只接受上述 key（字符串，如 `"desktop"`），工具内部将其映射为真实路径，**绝不接受用户传入任意绝对路径**。
 
**实现要点**：
- `extension` 为空时列出所有文件；非空时过滤（不区分大小写，自动补全 `.` 前缀）
- 使用 `os.scandir()` 而非 `os.walk()`（仅扫描一层，不递归）
- 每个文件返回 `name`、`size_kb`（保留 2 位小数）、`modified`（ISO 格式日期时间字符串）
**返回格式**：
```json
{
  "directory": "C:\\Users\\user\\Desktop",
  "filter": ".pdf",
  "count": 3,
  "files": [
    {"name": "report.pdf", "size_kb": 245.60, "modified": "2025-06-01T14:23:00"}
  ]
}
```
 
---
 
### Tool 4: `clean_downloads_folder(days: int = 30) -> str`
 
**功能**：清理下载文件夹中超过指定天数未修改的文件（移动至系统临时目录）。
 
**实现要点**：
- 目标目录固定为 `Path.home() / "Downloads"`（不可由参数修改）
- 使用 `tempfile.gettempdir()` 获取系统临时目录
- 过滤逻辑：`(datetime.now() - datetime.fromtimestamp(stat.st_mtime)).days > days`
- **确认流程**：
  1. 先扫描并打印文件列表（含大小和修改时间）
  2. 若无符合文件，直接返回 `"未发现符合条件的文件"`
  3. 若有文件，打印清单后提示用户确认
  4. 用户确认后逐文件 `shutil.move()`，跳过移动失败的文件并记录错误
- 返回最终结果摘要（成功 N 个，失败 M 个，详细列表）
---
 
### Tool 5: `kill_process(process_name: str) -> str`
 
**功能**：根据进程名终止非系统进程。
 
**黑名单常量**（定义为模块级）：
```python
PROTECTED_PROCESSES = {
    "explorer.exe", "svchost.exe", "lsass.exe", "csrss.exe",
    "winlogon.exe", "services.exe", "smss.exe", "wininit.exe",
    "system", "registry",
}
```
 
**实现要点**：
- 黑名单校验在安全网关层完成（大小写不敏感）
- 使用 `psutil.process_iter(['pid', 'name', 'exe'])` 查找匹配进程
- 找到后打印 PID 和可执行文件路径，弹出确认提示
- 用户确认后调用 `proc.terminate()`，等待 3 秒后若仍存活则调用 `proc.kill()`
- 若无匹配进程，返回 `"未找到名为 {process_name} 的运行中进程"`
---
 
### Tool 6: `set_reminder(minutes: int, message: str) -> str`
 
**功能**：设置非阻塞后台定时提醒。
 
**实现要点**：
- 使用 `threading.Timer(minutes * 60, callback)` 在后台计时
- `callback` 函数打印醒目提醒（使用 ANSI 颜色代码，或 `\a` 响铃符）
- 尝试 `import win10toast`，可用时弹出 Windows 通知气泡；不可用时仅打印到控制台（优雅降级，不抛异常）
- 立即返回 `"提醒已设置：将在 {minutes} 分钟后（{预计时间}）提醒您：{message}"`（非阻塞，立即返回）
- `message` 长度限制：不超过 200 字符（网关层校验）
---
 
# Console Output Standards
 
为方便调试和审计，在控制台打印时使用统一的视觉符号：
 
```python
# ANSI 颜色代码（Windows 需要先调用 os.system('') 激活）
COLOR_RESET  = "\033[0m"
COLOR_CYAN   = "\033[96m"   # Thought（模型推理过程）
COLOR_YELLOW = "\033[93m"   # Action（即将调用工具）
COLOR_GREEN  = "\033[92m"   # Observation（工具返回结果）
COLOR_RED    = "\033[91m"   # Error / Warning
COLOR_BOLD   = "\033[1m"
```
 
打印规范：
- **模型思考内容**（`finish_reason` 前的文本内容，如有）：`[🤔 Thought] {内容}`（青色）
- **工具调用**：`[⚡ Action] 调用工具: {func_name}({args})`（黄色）
- **工具结果**：`[👁 Observe] {结果摘要（前200字符）}`（绿色）
- **最终回复**：`[✅ Final] {回复内容}`（粗体）
- **错误信息**：`[❌ Error] {详情}`（红色）
- **安全拒绝**：`[🛡 Blocked] {拒绝原因}`（红色粗体）
---
 
# Tool Result Contract
 
工具函数的**所有**返回值均为字符串（`str`），通过统一调度器包装：
 
```python
def dispatch_tool(func_name: str, args: dict) -> str:
    """
    1. 调用安全网关
    2. 网关拒绝 → 返回拒绝原因字符串
    3. 网关通过 → try/except 执行工具函数
    4. 执行成功 → 若返回 dict/list，json.dumps(..., ensure_ascii=False)；若已是 str，直接返回
    5. 执行异常 → 返回 f"[工具执行失败] {type(e).__name__}: {e}"
    """
```
 
捕获的异常信息**作为正常 tool result 返回给模型**（不中断程序），让模型能感知失败原因并作出调整。
 
---
 
# Tool JSON Schema Requirements
 
每个工具的 JSON Schema 必须包含：
 
```json
{
  "type": "function",
  "function": {
    "name": "tool_name",
    "description": "【场景】何时调用此工具。【功能】做什么。【返回】返回值的格式和字段含义。",
    "parameters": {
      "type": "object",
      "properties": {
        "param_name": {
          "type": "string | integer | number | boolean",
          "description": "参数含义、取值范围、默认值",
          "enum": ["可选值1", "可选值2"]  // 若为枚举类型
        }
      },
      "required": ["必填参数列表"]
    }
  }
}
```
 
---
 
# File Structure Requirements
 
脚本顶部注释块中说明：
 
```python
"""
win_agent.py — Windows AI 系统命令助手
依赖: pip install openai psutil win10toast（win10toast 为可选）
环境变量:
    DEEPSEEK_API_KEY  （必需）
    DEEPSEEK_BASE_URL （可选，默认 https://api.deepseek.com）
    DEEPSEEK_MODEL    （可选，默认 deepseek-chat）
"""
```
 
**完整 import 列表**（所有引用必须在此出现，不遗漏）：
 
```python
import os, sys, json, shutil, subprocess, threading, tempfile, time
from datetime import datetime, timedelta
from pathlib import Path
import psutil
from openai import OpenAI
```
 
**代码组织顺序**：
1. 模块文档字符串
2. import 区块
3. ANSI 颜色常量
4. 业务常量（白名单、黑名单、MAX_LOOPS 等）
5. 环境变量读取与 OpenAI 客户端初始化（含缺失 Key 的友好错误提示）
6. 6 个工具函数
7. tools JSON Schema 列表（`TOOLS_SCHEMA`）
8. `security_gateway()` 函数
9. `dispatch_tool()` 调度器
10. `run_agent(user_input: str)` — 单轮 ReAct 循环
11. `main()` — 交互式主循环
12. `if __name__ == "__main__": main()`
---
 
# Absolute Prohibitions（禁止事项）
 
- ❌ 不得出现任何 `# TODO`、`# 请实现`、`pass` 占位符
- ❌ 不得使用 `shell=True`（`subprocess` 调用一律 `shell=False`）
- ❌ 不得接受用户传入的任意文件系统路径
- ❌ 不得在代码中硬编码任何 API Key 或 URL
- ❌ 不得使用 `eval()`、`exec()`、`__import__()` 等动态执行手段
- ❌ 不得省略任何函数的 `try-except` 块
---
 
# Deliverable
 
输出**完整、可直接运行**的 `win_agent.py` 文件内容（Python 代码块），不附加任何解释性文字。代码行数预计在 400–600 行之间。
```