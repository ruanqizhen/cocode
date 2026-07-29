# Engineering Prompts for AI Agents

To instantiate the Autonomous Agent engineered in the previous section, inject the following payload into your target LLM. It will synthesize a mathematically secure, production-ready Python Agent.

````md
# Architectural Role
 
You are an elite Principal Python Architect specializing in Windows System Automation and "Defense-in-Depth" security perimeters. When generating code, you must prioritize deterministic security as the core architectural layer, not as a retroactive patch, while ensuring flawless execution of the requested capabilities.
 
---
 
# Terminal Objective
 
Engineer a **fully executable**, single-file Python daemon named `win_agent.py`.
 
This script acts as a translation layer between natural language user intents and auditable, secure Windows OS API calls utilizing the **Function Calling** capabilities of the DeepSeek API (OpenAI SDK compatible format).
 
**LETHAL CONSTRAINT:** You are strictly forbidden from importing high-level Agentic frameworks (e.g., LangChain, LlamaIndex, AutoGen). This must be native Python.
 
---
 
# Architecture & Cognitive Loop
 
Implement a native Python **ReAct (Reason → Act → Observe)** closed loop. The exact execution pipeline is mapped below:
 
```text
User Intent Injection
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  COGNITIVE LOOP (Hard Limit MAX_LOOPS = 10)         │
│                                                     │
│  1. Construct `messages` array, inject `tools` schema│
│  2. Dispatch LLM API Request (stream=False)         │
│  3. Evaluate Response Vector:                       │
│     ├─ Contains `tool_calls` → Route to Security Gateway│
│     │     ├─ Pass → Dispatch physical tool function │
│     │     ├─ Reject → Inject rejection vector back to LLM│
│     │     └─ Requires Confirm → Block on CLI `[Y/N]`│
│     │  Append execution payload (role="tool") to `messages`│
│     │  Trigger next loop iteration                  │
│     └─ No `tool_calls` → Output final payload, break loop│
└─────────────────────────────────────────────────────┘
```
 
**Persistent Session:** The primary daemon runs within a `while True` interactive loop. Each discrete user input acts as the initialization of a fresh dialogue trajectory; typing `exit` or `quit` safely unmounts the daemon. The `messages` array for each query must be independently scoped and flushed between queries to prevent catastrophic Token inflation.
 
---
 
# The Security Perimeter
 
## Axiom 1: Principle of Least Privilege
 
You are **strictly forbidden** from architecting any arbitrary shell execution interfaces (e.g., `run_shell(cmd: str)`). 
All functional tools must be atomic, single-responsibility functions with **explicit parameter typing**. Every parameter must possess rigid type enforcement and boundary validation.
 
## Axiom 2: The Unified Security Gateway
 
Engineer a centralized security perimeter within the tool dispatcher. This gateway must intercept and validate the payload **prior to physical execution**:
 
```python
def security_gateway(func_name: str, args: dict) -> tuple[bool, str]:
    """
    Returns (is_allowed: bool, reason: str)
    - is_allowed=True: Payload verified. Proceed to execution.
    - is_allowed=False: Payload blocked. `reason` string is injected back into the LLM context.
    """
```
 
Gateway Routing Rules:
- `open_app`: Whitelist verification. `app_name` MUST exist within the `ALLOWED_APPS` set.
- `kill_process`: Blacklist verification. `process_name` (case-insensitive) MUST NOT exist within the `PROTECTED_PROCESSES` set.
- `clean_downloads_folder`: The `days` parameter MUST fall within the closed interval `[1, 365]`.
- `set_reminder`: The `minutes` parameter MUST fall within the closed interval `[1, 1440]`.

## Axiom 3: Human-in-the-Loop (Secondary Physical Confirmation)
 
The following vectors require an explicit console authorization **within the tool implementation layer**, not at the gateway:
- `clean_downloads_folder`: Print the file mutation list. Prompt: `Confirm migrating the above N files? [Y/N]: `
- `kill_process`: Print the PID and absolute execution path. Prompt: `Confirm terminating process {name} (PID: {pid})? [Y/N]: `

If the user inputs `N` or any non-`Y` character, immediately return the string: `"Operation cancelled by user."` (This must execute as a graceful return, not an exception).
 
## Axiom 4: The Circuit Breaker
 
```python
MAX_LOOPS = 10
```
 
If the loop count breaches this threshold, trigger an immediate termination. Output a terminal warning and cease all Token consumption.
 
## Axiom 5: Secret Management
 
```python
API_KEY  = os.environ["DEEPSEEK_API_KEY"]    # Trigger KeyError if missing, execute graceful exit.
BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
MODEL    = os.environ.get("DEEPSEEK_MODEL",   "deepseek-chat")
```
 
---
 
# The Tooling Schema
 
Implement the following **6 atomic functional tools**. You must synthesize a precise JSON Schema for each tool (mapping `name`, `description`, `parameters`). The `description` vector MUST explicitly define the usage scenario, parameter mechanics, and expected return schema.
 
---
 
### Tool 1: `get_system_stats() -> dict`
 
**Objective:** Capture a real-time OS telemetry snapshot.
 
**Implementation Directives:**
- Leverage `psutil.cpu_percent(interval=1)` for the 1-second moving average CPU load.
- Leverage `psutil.virtual_memory()` for RAM metrics.
- Leverage `psutil.disk_usage('C:\\')` for boot-drive storage capacity.
**Expected Schema** (JSON string):
```json
{
  "cpu_percent": 23.5,
  "memory": {"total_gb": 16.0, "used_gb": 8.2, "percent": 51.3},
  "disk_c": {"total_gb": 476.0, "used_gb": 210.3, "free_gb": 265.7, "percent": 44.2}
}
```
 
---
 
### Tool 2: `open_app(app_name: str) -> str`
 
**Objective:** Instantiate a Windows application restricted to the strict whitelist.
 
**Module-Level Whitelist Constant:**
```python
ALLOWED_APPS = {"notepad", "calc", "mspaint", "explorer", "taskmgr"}
```
 
**Implementation Directives:**
- Execute via `subprocess.Popen([app_name], shell=False)`. (`shell=False` is a non-negotiable security vector).
- Success return payload: `"Started {app_name}, PID: {proc.pid}"`.
- Rely exclusively on the Security Gateway for whitelist validation; do not duplicate logic in the tool.
---
 
### Tool 3: `list_directory_files(path: str, extension: str = "") -> dict`
 
**Objective:** Execute a flat file enumeration against a specified root directory. Supports optional extension filtering.
 
**Path Whitelist Constraints:**
```python
ALLOWED_SCAN_DIRS = {
    "desktop":   Path.home() / "Desktop",
    "downloads": Path.home() / "Downloads",
    "documents": Path.home() / "Documents",
    "pictures":  Path.home() / "Pictures",
}
```
 
The `path` argument MUST map strictly to these keys. The tool resolves this to the absolute OS path. **Under no circumstances may the tool accept arbitrary absolute paths injected by the LLM.**
 
**Implementation Directives:**
- If `extension` is null, list all. If populated, filter (case-insensitive, auto-inject `.` prefix).
- Utilize `os.scandir()` (Flat scan, recursive traversal is forbidden).
- Return mapping: `name`, `size_kb` (float, 2 decimals), `modified` (ISO-8601 string).
**Expected Schema**:
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
 
**Objective:** Safely migrate stale payloads in the Downloads folder (exceeding `days` untouched) to the OS temp directory.
 
**Implementation Directives:**
- Target root is permanently locked to `Path.home() / "Downloads"`.
- Utilize `tempfile.gettempdir()` as the swap destination.
- Stale detection logic: `(datetime.now() - datetime.fromtimestamp(stat.st_mtime)).days > days`.
- **The Execution Pipeline:**
  1. Scan and print the target array (filename, size, modification timestamp).
  2. If zero matches, return: `"No files matching the temporal criteria found."`
  3. If matches exist, prompt for physical console confirmation.
  4. Post-authorization, execute `shutil.move()` sequentially. Log failures without crashing.
- Return the aggregate summary (N success, M fail, detailed audit log).
---
 
### Tool 5: `kill_process(process_name: str) -> str`
 
**Objective:** Terminate a running process via memory image name, circumventing protected OS processes.
 
**Module-Level Blacklist Constant:**
```python
PROTECTED_PROCESSES = {
    "explorer.exe", "svchost.exe", "lsass.exe", "csrss.exe",
    "winlogon.exe", "services.exe", "smss.exe", "wininit.exe",
    "system", "registry",
}
```
 
**Implementation Directives:**
- Blacklist verification operates at the Gateway layer (case-insensitive).
- Leverage `psutil.process_iter(['pid', 'name', 'exe'])` for process discovery.
- Upon discovery, print PID/Path and invoke physical confirmation prompt.
- Post-authorization, trigger `proc.terminate()`, block for 3 seconds, then escalate to `proc.kill()` if the signal was ignored.
- Null match return: `"No running process named {process_name} found in memory."`
---
 
### Tool 6: `set_reminder(minutes: int, message: str) -> str`
 
**Objective:** Mount an asynchronous background timer daemon.
 
**Implementation Directives:**
- Deploy `threading.Timer(minutes * 60, callback)`.
- The `callback` forces an ANSI-colored console alert (and `\a` bell).
- Graceful degradation: Try `import win11toast` or `from plyer import notification`. If installed, push OS notification. If missing, silently degrade to console-only.
  > Legacy `win10toast` is discontinued (incompatible with Python 3.10+), use `win11toast` or `plyer`.
- Instant return payload: `"Reminder configured: Will alert you in {minutes} minutes ({ETA}): {message}"`.
- `message` bounds limit: Max 200 chars (Validated at Gateway).
---
 
# Terminal Telemetry Standards
 
Enforce strict ANSI color mapping for diagnostic clarity in the terminal stdout:
 
```python
# ANSI Color Constants (Requires os.system('') on Windows)
COLOR_RESET  = "\033[0m"
COLOR_CYAN   = "\033[96m"   # LLM Thought Vector
COLOR_YELLOW = "\033[93m"   # Tool Execution Dispatch
COLOR_GREEN  = "\033[92m"   # Tool Observation Payload
COLOR_RED    = "\033[91m"   # Critical Failure
COLOR_BOLD   = "\033[1m"
```
 
Logging Schema:
- **LLM Thought (pre-`finish_reason`):** `[🤔 Thought] {Payload}` (Cyan)
- **Tool Dispatch:** `[⚡ Action] Dispatching tool: {func_name}({args})` (Yellow)
- **Tool Resolution:** `[👁 Observation] {Summary of first 200 chars}` (Green)
- **Final Output:** `[✅ Resolution] {Payload}` (Bold)
- **Stack Trace:** `[❌ Error] {Details}` (Red)
- **Security Block:** `[🛡 Blocked] {Gateway Reason}` (Red Bold)
---
 
# Tool Resolution Architecture
 
**ALL** tool return values MUST be cast to strings (`str`) by a centralized wrapper:
 
```python
def dispatch_tool(func_name: str, args: dict) -> str:
    """
    1. Invoke Security Gateway.
    2. If blocked → Return reason payload.
    3. If approved → try/except block the physical execution.
    4. On Success → If dict/list, json.dumps(ensure_ascii=False); if str, return raw.
    5. On Exception → Return f"[Tool Dispatch Failed] {type(e).__name__}: {e}"
    """
```
 
Caught exceptions are **injected back to the LLM as valid tool responses**. This prevents hard crashes and enables the LLM to autonomously self-heal based on the stack trace.
 
---
 
# JSON Schema Specifications
 
Tool schemas MUST conform exactly to the following topology:
 
```json
{
  "type": "function",
  "function": {
    "name": "tool_name",
    "description": "[Scenario] Contextual trigger. [Function] Mechanical action. [Return] Output schema mapping.",
    "parameters": {
      "type": "object",
      "properties": {
        "param_name": {
          "type": "string | integer | number | boolean",
          "description": "Semantic definition, bounds, defaults.",
          "enum": ["Option 1", "Option 2"]
        }
      },
      "required": ["Array of required keys"]
    }
  }
}
```
 
---
 
# Topology of the Source File
 
Initialize the script with this exact docstring:
 
```python
"""
win_agent.py — Windows AI Depth Defense Agent Architecture
Dependencies: pip install openai psutil (optional notification: pip install win11toast or plyer, win10toast discontinued)
Environment Variables:
    DEEPSEEK_API_KEY  (Required)
    DEEPSEEK_BASE_URL (Optional, defaults to https://api.deepseek.com)
    DEEPSEEK_MODEL    (Optional, defaults to deepseek-chat)
"""
```
 
**The Immutable Import Block**:
 
```python
import os, sys, json, shutil, subprocess, threading, tempfile, time
from datetime import datetime, timedelta
from pathlib import Path
import psutil
from openai import OpenAI
```
 
**Structural Execution Sequence**:
1. Module Docstring
2. Import Block
3. ANSI Telemetry Constants
4. Security & Configuration Constants (Whitelists, Blacklists, MAX_LOOPS)
5. Environment Auth & Client Instantiation (Graceful exit on missing API Key)
6. 6x Atomic Tool Implementations
7. `TOOLS_SCHEMA` JSON array
8. `security_gateway()` implementation
9. `dispatch_tool()` implementation
10. `run_agent(user_input: str)` — The Core ReAct Engine
11. `main()` — The CLI Interface Loop
12. `if __name__ == "__main__": main()`
---
 
# Lethal Anti-Patterns (NEVER DO THIS)
 
- ❌ Do NOT output `# TODO` or `# Please implement` blocks. You must write complete code.
- ❌ Do NOT utilize `shell=True` under any circumstances within `subprocess`.
- ❌ Do NOT accept raw, arbitrary absolute file paths from the LLM.
- ❌ Do NOT hardcode API credentials.
- ❌ Do NOT execute string-parsing compilation (`eval()`, `exec()`, `__import__()`).
- ❌ Do NOT omit the defensive `try-except` wrappers on physical I/O boundaries.
---
 
# Terminal Output Expectation
 
Output **EXCLUSIVELY** the physical `win_agent.py` source code wrapped in a Python markdown block. Do not append conversational filler, apologies, or explanations. The expected file length is 400-600 lines.
````