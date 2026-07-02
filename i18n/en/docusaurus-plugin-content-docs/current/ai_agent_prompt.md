# Prompts for Generating AI Agent

Copy and paste the prompt below to AI, and it will generate an AI Agent written in Python.

````md
# Role
 
You are a senior Python backend architect specializing in Windows system automation, while also possessing a "Defense-in-Depth" security mindset. Your code must, under the premise of ensuring complete functionality, place security at the core of the design, rather than as an afterthought patch.
 
---
 
# Task
 
Write a **fully runnable** single-file Python script named `win_agent.py`.
 
This script translates the user's natural language commands into secure, auditable Windows system operations via the **Function Calling** feature of the DeepSeek API (OpenAI SDK compatible format).
 
**DO NOT USE** any high-level Agent frameworks like LangChain, LlamaIndex, AutoGen, etc.
 
---
 
# Architecture & Core Loop
 
Implement a pure Python **ReAct (Reason → Act → Observe)** closed loop. The complete flow is as follows:
 
```
User Input
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  LOOP (Max MAX_LOOPS = 10 times)                    │
│                                                     │
│  1. Build messages list, attach tools schema        │
│  2. Call DeepSeek API (stream=False)                │
│  3. Check response:                                 │
│     ├─ Has tool_calls → Enter "Security Gateway"    │
│     │     ├─ Pass → Execute tool function           │
│     │     ├─ Reject → Return rejection reason to model│
│     │     └─ Needs confirm → Console asks [Y/N]     │
│     │  Append tool result with role="tool" to messages│
│     │  Proceed to next iteration                    │
│     └─ No tool_calls → Print final reply, exit loop │
└─────────────────────────────────────────────────────┘
```
 
**Multi-turn Session**: The main program is a `while True` interactive loop, where each user input serves as the starting point for a new round of dialogue; typing `exit` or `quit` safely exits. The `messages` list for each round of dialogue is independent and is not preserved across rounds (to avoid infinite Token inflation).
 
---
 
# Security Architecture
 
## Principle 1: Principle of Least Privilege Tool Design
 
**Absolutely prohibited** to design arbitrary command execution interfaces like `run_shell(cmd: str)`.  
All tools must be single-responsibility functions with **explicit parameter semantics**. Each parameter has clear type and value range constraints.
 
## Principle 2: Security Gateway
 
Implement a unified security gateway in the tool dispatcher, performing validation **prior to function execution**:
 
```python
def security_gateway(func_name: str, args: dict) -> tuple[bool, str]:
    """
    Returns (is_allowed: bool, reason: str)
    - is_allowed=True: Allowed to execute
    - is_allowed=False: Refused to execute, reason is the cause of refusal (will be returned to the model as a tool result)
    """
```
 
Gateway rules:
- `open_app`: Whitelist validation, `app_name` must be in the `ALLOWED_APPS` set.
- `kill_process`: Blacklist validation, `process_name` (case-insensitive) must not be in the `PROTECTED_PROCESSES` set.
- `clean_downloads_folder`: `days` parameter must be within the `[1, 365]` range.
- `set_reminder`: `minutes` parameter must be within the `[1, 1440]` range.
## Principle 3: Human-in-the-Loop (Secondary confirmation for dangerous operations)
 
The following operations prompt a console confirmation **inside the tool function**, not at the gateway layer:
- `clean_downloads_folder`: After printing the list of files to be moved, prompt `Confirm moving the above N files? [Y/N]: `
- `kill_process`: After printing the target process PID and full path, prompt `Confirm terminating process {name} (PID: {pid})? [Y/N]: `
When the user inputs N or anything other than Y, immediately return the string `"Operation cancelled by user"` (the tool returns normally, without throwing an exception).
 
## Principle 4: Circuit Breaker
 
```python
MAX_LOOPS = 10
```
 
Terminate the loop after exceeding this limit, print a warning to the user, and do not continue to consume Tokens.
 
## Principle 5: Environment Variable Management
 
```python
API_KEY  = os.environ["DEEPSEEK_API_KEY"]    # KeyError if missing, terminate immediately and prompt
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
MODEL    = os.environ.get("DEEPSEEK_MODEL",   "deepseek-chat")
```
 
---
 
# Tool Specifications
 
Implement the following **6 tool functions**, and provide a complete JSON Schema for each function (including `name`, `description`, `parameters`; the `description` must include the usage scenario, parameter meanings, and return value format instructions).
 
---
 
### Tool 1: `get_system_stats() -> dict`
 
**Function**: Get a snapshot of system resources.
 
**Implementation Points**:
- Use `psutil.cpu_percent(interval=1)` to get the 1-second average CPU usage.
- Use `psutil.virtual_memory()` to get memory information.
- Use `psutil.disk_usage('C:\\')` to get C drive disk information.
**Return Format** (JSON string, same below):
```json
{
  "cpu_percent": 23.5,
  "memory": {"total_gb": 16.0, "used_gb": 8.2, "percent": 51.3},
  "disk_c": {"total_gb": 476.0, "used_gb": 210.3, "free_gb": 265.7, "percent": 44.2}
}
```
 
---
 
### Tool 2: `open_app(app_name: str) -> str`
 
**Function**: Launch a Windows application within the whitelist.
 
**Whitelist Constants** (defined at module level):
```python
ALLOWED_APPS = {"notepad", "calc", "mspaint", "explorer", "taskmgr"}
```
 
**Implementation Points**:
- Use `subprocess.Popen([app_name], shell=False)` to start (`shell=False` is a security requirement).
- Upon success, return `"Started {app_name}, PID: {proc.pid}"`.
- Whitelist validation is completed at the security gateway layer; no need to repeat within the tool.
---
 
### Tool 3: `list_directory_files(path: str, extension: str = "") -> dict`
 
**Function**: List files in a specified directory. More universal than the original `list_desktop_pdfs()`, supporting filtering by extension.
 
**Path Whitelist** (Security gateway validation, also requires secondary verification inside the tool):
```python
ALLOWED_SCAN_DIRS = {
    "desktop":   Path.home() / "Desktop",
    "downloads": Path.home() / "Downloads",
    "documents": Path.home() / "Documents",
    "pictures":  Path.home() / "Pictures",
}
```
 
The `path` parameter only accepts the above keys (strings, like `"desktop"`), and the tool internally maps it to the real path, **never accepting any arbitrary absolute path passed by the user**.
 
**Implementation Points**:
- When `extension` is empty, list all files; when non-empty, filter (case-insensitive, automatically complete the `.` prefix).
- Use `os.scandir()` instead of `os.walk()` (scan only one level, not recursive).
- For each file, return `name`, `size_kb` (keep 2 decimal places), `modified` (ISO format datetime string).
**Return Format**:
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
 
**Function**: Clean up files in the downloads folder that haven't been modified for more than the specified number of days (move to system temporary directory).
 
**Implementation Points**:
- Target directory is fixed to `Path.home() / "Downloads"` (cannot be modified by parameters).
- Use `tempfile.gettempdir()` to get the system temporary directory.
- Filter logic: `(datetime.now() - datetime.fromtimestamp(stat.st_mtime)).days > days`.
- **Confirmation Flow**:
  1. First scan and print the file list (including size and modification time).
  2. If no files match, directly return `"No files matching the criteria found"`.
  3. If there are files, print the list and prompt the user for confirmation.
  4. After user confirmation, `shutil.move()` file by file, skip failed files and record errors.
- Return the final result summary (N successful, M failed, detailed list).
---
 
### Tool 5: `kill_process(process_name: str) -> str`
 
**Function**: Terminate a non-system process based on the process name.
 
**Blacklist Constants** (defined at module level):
```python
PROTECTED_PROCESSES = {
    "explorer.exe", "svchost.exe", "lsass.exe", "csrss.exe",
    "winlogon.exe", "services.exe", "smss.exe", "wininit.exe",
    "system", "registry",
}
```
 
**Implementation Points**:
- Blacklist validation is completed at the security gateway layer (case-insensitive).
- Use `psutil.process_iter(['pid', 'name', 'exe'])` to find matching processes.
- After finding them, print the PID and executable file path, pop up a confirmation prompt.
- After user confirmation, call `proc.terminate()`, wait 3 seconds, if still alive, call `proc.kill()`.
- If no matching process, return `"No running process named {process_name} found"`.
---
 
### Tool 6: `set_reminder(minutes: int, message: str) -> str`
 
**Function**: Set a non-blocking background timer reminder.
 
**Implementation Points**:
- Use `threading.Timer(minutes * 60, callback)` to run a timer in the background.
- The `callback` function prints a conspicuous reminder (using ANSI color codes, or `\a` bell character).
- Try `import win10toast`, if available, pop up a Windows notification bubble; if unavailable, only print to the console (graceful degradation, do not throw exceptions).
- Immediately return `"Reminder set: Will remind you in {minutes} minutes ({ETA}): {message}"` (non-blocking, return immediately).
- `message` length limit: no more than 200 characters (gateway layer validation).
---
 
# Console Output Standards
 
For the convenience of debugging and auditing, use uniform visual symbols when printing in the console:
 
```python
# ANSI Color Constants (Windows needs os.system('') to activate)
COLOR_RESET  = "\033[0m"
COLOR_CYAN   = "\033[96m"   # Thought (Model reasoning process)
COLOR_YELLOW = "\033[93m"   # Action (About to call a tool)
COLOR_GREEN  = "\033[92m"   # Observation (Tool return result)
COLOR_RED    = "\033[91m"   # Error / Warning
COLOR_BOLD   = "\033[1m"
```
 
Print specifications:
- **Model thought content** (text content before `finish_reason`, if any): `[🤔 Thought] {Content}` (Cyan)
- **Tool call**: `[⚡ Action] Calling tool: {func_name}({args})` (Yellow)
- **Tool result**: `[👁 Observe] {Result summary (first 200 chars)}` (Green)
- **Final reply**: `[✅ Final] {Reply content}` (Bold)
- **Error message**: `[❌ Error] {Details}` (Red)
- **Security rejection**: `[🛡 Blocked] {Rejection reason}` (Red Bold)
---
 
# Tool Result Contract
 
**All** return values of tool functions are strings (`str`), wrapped by a unified dispatcher:
 
```python
def dispatch_tool(func_name: str, args: dict) -> str:
    """
    1. Call security gateway
    2. Gateway rejects → Return rejection reason string
    3. Gateway passes → try/except execute tool function
    4. Execution successful → If dict/list returned, json.dumps(..., ensure_ascii=False); if already str, return directly
    5. Execution exception → Return f"[Tool Execution Failed] {type(e).__name__}: {e}"
    """
```
 
Captured exception information is **returned to the model as a normal tool result** (without interrupting the program), allowing the model to perceive the reason for failure and make adjustments.
 
---
 
# Tool JSON Schema Requirements
 
The JSON Schema for each tool must include:
 
```json
{
  "type": "function",
  "function": {
    "name": "tool_name",
    "description": "[Scenario] When to call this tool. [Function] What it does. [Return] Format and field meanings of the return value.",
    "parameters": {
      "type": "object",
      "properties": {
        "param_name": {
          "type": "string | integer | number | boolean",
          "description": "Parameter meaning, value range, default value",
          "enum": ["Option 1", "Option 2"]  // If enum type
        }
      },
      "required": ["List of required parameters"]
    }
  }
}
```
 
---
 
# File Structure Requirements
 
Explain in the comment block at the top of the script:
 
```python
"""
win_agent.py — Windows AI System Command Assistant
Dependencies: pip install openai psutil win10toast (win10toast is optional)
Environment Variables:
    DEEPSEEK_API_KEY  (Required)
    DEEPSEEK_BASE_URL (Optional, defaults to https://api.deepseek.com)
    DEEPSEEK_MODEL    (Optional, defaults to deepseek-chat)
"""
```
 
**Complete import list** (all references must appear here, no omissions):
 
```python
import os, sys, json, shutil, subprocess, threading, tempfile, time
from datetime import datetime, timedelta
from pathlib import Path
import psutil
from openai import OpenAI
```
 
**Code organization sequence**:
1. Module docstring
2. import block
3. ANSI color constants
4. Business constants (Whitelist, Blacklist, MAX_LOOPS, etc.)
5. Read environment variables and OpenAI client initialization (with friendly error prompt for missing Key)
6. 6 tool functions
7. tools JSON Schema list (`TOOLS_SCHEMA`)
8. `security_gateway()` function
9. `dispatch_tool()` dispatcher
10. `run_agent(user_input: str)` — Single-turn ReAct loop
11. `main()` — Interactive main loop
12. `if __name__ == "__main__": main()`
---
 
# Absolute Prohibitions
 
- ❌ Do not use any `# TODO`, `# Please implement`, or `pass` placeholders.
- ❌ Do not use `shell=True` (all `subprocess` calls must be `shell=False`).
- ❌ Do not accept arbitrary file system paths passed by the user.
- ❌ Do not hardcode any API Key or URL in the code.
- ❌ Do not use dynamic execution methods like `eval()`, `exec()`, `__import__()`.
- ❌ Do not omit the `try-except` block for any function.
---
 
# Deliverable
 
Output the **complete, directly runnable** `win_agent.py` file content (Python code block), without any explanatory text attached. The expected number of code lines is between 400–600 lines.
````