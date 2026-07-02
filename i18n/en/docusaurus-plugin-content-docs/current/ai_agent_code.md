# AI Agent Source Code

Below is the complete source code for the AI Agent. Copy it into a file named `win_agent.py`. Then execute it in your terminal, and you can test the Agent's autonomous capabilities that we architected.

```python
"""
win_agent.py — Windows AI System Command Assistant
Dependencies: pip install openai psutil win10toast (win10toast is optional)
Environment Variables:
    DEEPSEEK_API_KEY  (Required)
    DEEPSEEK_BASE_URL (Optional, defaults to https://api.deepseek.com)
    DEEPSEEK_MODEL    (Optional, defaults to deepseek-v4-flash)
"""

import os, sys, json, shutil, subprocess, threading, tempfile, time
from datetime import datetime, timedelta
from pathlib import Path
import psutil
from openai import OpenAI

# ==============================================================================
# ANSI Color Constants (Windows requires os.system('') to activate)
# ==============================================================================
COLOR_RESET  = "\033[0m"
COLOR_CYAN   = "\033[96m"   # Thought (Model reasoning process)
COLOR_YELLOW = "\033[93m"   # Action (Executing tool call)
COLOR_GREEN  = "\033[92m"   # Observation (Tool execution payload)
COLOR_RED    = "\033[91m"   # Error / Warning
COLOR_BOLD   = "\033[1m"

# ==============================================================================
# Security & Sandbox Constants
# ==============================================================================
MAX_LOOPS = 10

ALLOWED_APPS = {"notepad", "calc", "mspaint", "explorer", "taskmgr"}

PROTECTED_PROCESSES = {
    "explorer.exe", "svchost.exe", "lsass.exe", "csrss.exe",
    "winlogon.exe", "services.exe", "smss.exe", "wininit.exe",
    "system", "registry",
}

ALLOWED_SCAN_DIRS = {
    "desktop":   Path.home() / "Desktop",
    "downloads": Path.home() / "Downloads",
    "documents": Path.home() / "Documents",
    "pictures":  Path.home() / "Pictures",
}

# ==============================================================================
# Environment Verification & Client Initialization
# ==============================================================================
API_KEY = os.environ.get("DEEPSEEK_API_KEY")
if not API_KEY:
    print(f"{COLOR_RED}{COLOR_BOLD}[❌ Error] Fatal Error: Missing required environment variable 'DEEPSEEK_API_KEY'.{COLOR_RESET}")
    print("Please configure this environment variable in the terminal before execution.")
    print("Example (Windows CMD):   set DEEPSEEK_API_KEY=your_actual_api_key")
    print("Example (PowerShell):   $env:DEEPSEEK_API_KEY=\"your_actual_api_key\"")
    sys.exit(1)

BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
MODEL    = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash")

try:
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
except Exception as init_err:
    print(f"{COLOR_RED}[❌ Error] Failed to initialize OpenAI client: {init_err}{COLOR_RESET}")
    sys.exit(1)

# ==============================================================================
# Core Tool Implementations
# ==============================================================================

def get_system_stats() -> dict:
    try:
        cpu = psutil.cpu_percent(interval=1)
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage('C:\\')
        return {
            "cpu_percent": cpu,
            "memory": {
                "total_gb": round(mem.total / (1024 ** 3), 1),
                "used_gb": round(mem.used / (1024 ** 3), 1),
                "percent": mem.percent
            },
            "disk_c": {
                "total_gb": round(disk.total / (1024 ** 3), 1),
                "used_gb": round(disk.used / (1024 ** 3), 1),
                "free_gb": round(disk.free / (1024 ** 3), 1),
                "percent": disk.percent
            }
        }
    except Exception as e:
        return {"error": f"Internal exception occurred while capturing system telemetry: {str(e)}"}


def open_app(app_name: str) -> str:
    try:
        proc = subprocess.Popen([app_name], shell=False)
        return f"Successfully initialized {app_name}, PID: {proc.pid}"
    except Exception as e:
        return f"Failed to initialize the application. Internal error: {str(e)}"


def list_directory_files(path: str, extension: str = "") -> dict:
    try:
        real_path = ALLOWED_SCAN_DIRS[path]
        if not real_path.exists():
            return {"directory": str(real_path), "error": "The specified physical target path does not exist on the current system", "files": []}
        
        ext_filter = extension.strip()
        if ext_filter and not ext_filter.startswith('.'):
            ext_filter = '.' + ext_filter
        ext_filter = ext_filter.lower()
        
        files_list = []
        with os.scandir(real_path) as it:
            for entry in it:
                try:
                    if entry.is_file():
                        if ext_filter and not entry.name.lower().endswith(ext_filter):
                            continue
                        stat = entry.stat()
                        size_kb = round(stat.st_size / 1024, 2)
                        modified = datetime.fromtimestamp(stat.st_mtime).isoformat(timespec='seconds')
                        files_list.append({
                            "name": entry.name,
                            "size_kb": size_kb,
                            "modified": modified
                        })
                except (PermissionError, FileNotFoundError):
                    continue
        return {
            "directory": str(real_path),
            "filter": ext_filter if ext_filter else "ALL",
            "count": len(files_list),
            "files": files_list
        }
    except Exception as e:
        return {"error": f"Unknown exception thrown while scanning file directory: {str(e)}"}


def clean_downloads_folder(days: int = 30) -> str:
    try:
        downloads_dir = Path.home() / "Downloads"
        if not downloads_dir.exists():
            return "Valid downloads folder path not found locally"
        
        temp_dir = Path(tempfile.gettempdir())
        now = datetime.now()
        to_move = []
        
        with os.scandir(downloads_dir) as it:
            for entry in it:
                try:
                    if entry.is_file():
                        stat = entry.stat()
                        mtime = datetime.fromtimestamp(stat.st_mtime)
                        if (now - mtime).days > days:
                            to_move.append((entry.path, entry.name, stat.st_size, mtime))
                except (PermissionError, FileNotFoundError):
                    continue
                    
        if not to_move:
            return "No files matching the temporal criteria found."
            
        print(f"\n{COLOR_YELLOW}====== [⚠️ List of Files to Clean] ======{COLOR_RESET}")
        for _, name, size, mtime in to_move:
            print(f" - {name} ({round(size/1024, 2)} KB, Modified: {mtime.strftime('%Y-%m-%d')})")
        print("=" * 32)
        
        confirm = input(f"Confirm migrating the above {len(to_move)} files? [Y/N]: ").strip().lower()
        if confirm != 'y':
            return "Operation cancelled by user."
            
        success_count = 0
        fail_count = 0
        details = []
        
        for src_path_str, name, _, _ in to_move:
            try:
                src_path = Path(src_path_str)
                dst_path = temp_dir / name
                if dst_path.exists():
                    dst_path = temp_dir / f"{src_path.stem}_{int(time.time())}{src_path.suffix}"
                shutil.move(str(src_path), str(dst_path))
                success_count += 1
                details.append(f"[Success] {name} -> Temp Directory")
            except Exception as e:
                fail_count += 1
                details.append(f"[Failed] {name} (Reason: {type(e).__name__})")
                
        return f"Cleaning process completed. Successfully migrated {success_count} files, failed on {fail_count} files. Log:\n" + "\n".join(details)
    except Exception as main_err:
        return f"Severe internal failure occurred during physical cleaning of downloads: {str(main_err)}"


def kill_process(process_name: str) -> str:
    try:
        target_name = process_name.lower()
        matched_procs = []
        
        for proc in psutil.process_iter(['pid', 'name', 'exe']):
            try:
                p_name = proc.info['name']
                if p_name and p_name.lower() == target_name:
                    matched_procs.append(proc)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
                
        if not matched_procs:
            return f"No active process named {process_name} found in memory."
            
        success_count = 0
        cancel_count = 0
        
        for proc in matched_procs:
            try:
                pid = proc.info['pid']
                exe_path = proc.info['exe'] or "Unknown image path"
                
                print(f"\nFound target process ── Name: {process_name} | PID: {pid} | Path: {exe_path}")
                confirm = input(f"Confirm terminating process {process_name} (PID: {pid})? [Y/N]: ").strip().lower()
                if confirm != 'y':
                    cancel_count += 1
                    continue
                    
                proc.terminate()
                gone, alive = psutil.wait_procs([proc], timeout=3)
                if alive:
                    for p in alive:
                        p.kill()
                success_count += 1
            except (psutil.NoSuchProcess, psutil.AccessDenied) as proc_err:
                print(f"{COLOR_RED}[❌ Error] Unable to operate on instance with PID {proc.pid}: {proc_err}{COLOR_RESET}")
                
        if success_count == 0 and cancel_count > 0:
            return "Operation cancelled by user."
            
        return f"Process termination action concluded. Successfully eliminated {success_count} instances, user skipped {cancel_count} instances."
    except Exception as e:
        return f"System error triggered while retrieving or eliminating the specified process sequence: {str(e)}"


def set_reminder(minutes: int, message: str) -> str:
    try:
        def callback():
            print(f"\n{COLOR_RED}{COLOR_BOLD}[⏰ REMINDER] Timer triggered: {message}{COLOR_RESET}\a")
            try:
                from win10toast import ToastNotifier
                toaster = ToastNotifier()
                toaster.show_toast("Windows AI Automation Assistant", message, duration=10, threaded=True)
            except Exception:
                pass

        t = threading.Timer(minutes * 60, callback)
        t.daemon = True
        t.start()
        
        eta = (datetime.now() + timedelta(minutes=minutes)).strftime("%H:%M:%S")
        return f"Reminder configured: Will alert you in {minutes} minutes ({eta}): {message}"
    except Exception as e:
        return f"Failed to mount background clock daemon: {str(e)}"

# ==============================================================================
# JSON Schema Specifications for Function Calling
# ==============================================================================
TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "get_system_stats",
            "description": "[Scenario] Called when the user requires a real-time system-level resource snapshot of the host. [Function] Returns structured telemetry data including CPU load, physical memory, and primary drive storage metrics. [Return] A JSON dictionary payload.",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "open_app",
            "description": "[Scenario] Called when the user explicitly requests to execute a common system application (e.g., notepad, calculator). [Function] Bootstraps a trusted application from the system's strict whitelist. [Return] A plaintext receipt with the underlying physical PID upon success.",
            "parameters": {
                "type": "object",
                "properties": {
                    "app_name": {
                        "type": "string",
                        "description": "The target whitelist application to instantiate.",
                        "enum": ["notepad", "calc", "mspaint", "explorer", "taskmgr"]
                    }
                },
                "required": ["app_name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_directory_files",
            "description": "[Scenario] Called when the user requires a listing of files in specific root directories like desktop, downloads, documents. [Function] Scans a single whitelisted user directory (non-recursive) and supports extension filtering. [Return] A JSON payload containing the file array and metadata.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "The target directory alias.",
                        "enum": ["desktop", "downloads", "documents", "pictures"]
                    },
                    "extension": {
                        "type": "string",
                        "description": "Optional file extension filter (e.g., '.pdf', '.txt'). Case-insensitive."
                    }
                },
                "required": ["path"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "clean_downloads_folder",
            "description": "[Scenario] Activated when the user requests to clean up stale files in their Downloads folder. [Function] Identifies old files untouched for a specified number of days, prompts for console confirmation, and safely migrates them to a temporary swap area. [Return] Execution summary and file transfer log.",
            "parameters": {
                "type": "object",
                "properties": {
                    "days": {
                        "type": "integer",
                        "description": "The minimum number of days the file has been untouched. Range [1, 365]. Defaults to 30."
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "kill_process",
            "description": "[Scenario] Called to forcefully terminate a non-core background software instance. [Function] Rapidly scans memory space for the process image name, prompts for confirmation, and enforces termination. [Return] Report of instances eliminated or aborted.",
            "parameters": {
                "type": "object",
                "properties": {
                    "process_name": {
                        "type": "string",
                        "description": "The absolute image name of the target process (e.g., 'notepad.exe', 'chrome.exe'). Case-insensitive."
                    }
                },
                "required": ["process_name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "set_reminder",
            "description": "[Scenario] Called when the user requires an asynchronous delayed alarm or reminder. [Function] Mounts a lightweight background timer that executes a console bell and OS notification upon expiration. [Return] Instant confirmation payload.",
            "parameters": {
                "type": "object",
                "properties": {
                    "minutes": {"type": "integer", "description": "The number of relative delayed minutes from the current time. Range [1, 1440]."},
                    "message": {"type": "string", "description": "The memo description content explicitly shown to the user upon reminder. Max 200 characters."}
                },
                "required": ["minutes", "message"]
            }
        }
    }
]

# ==============================================================================
# Security Gateway (Unified Defense Perimeter)
# ==============================================================================
def security_gateway(func_name: str, args: dict) -> tuple[bool, str]:
    try:
        if func_name == "open_app":
            app_name = args.get("app_name")
            if not app_name:
                return False, "Required parameter 'app_name' is missing or null."
            if app_name not in ALLOWED_APPS:
                return False, f"Unauthorized app launch vector detected: '{app_name}' is not in the trusted whitelist."
                
        elif func_name == "kill_process":
            process_name = args.get("process_name")
            if not process_name:
                return False, "Required parameter 'process_name' is missing."
            if process_name.lower() in [p.lower() for p in PROTECTED_PROCESSES]:
                return False, f"High-risk action intercepted: System has strictly forbidden killing core OS process '{process_name}'."
                
        elif func_name == "clean_downloads_folder":
            days = args.get("days", 30)
            if not isinstance(days, int) or not (1 <= days <= 365):
                return False, f"Parameter 'days' value out of bounds ({days}). Security policy strictly requires interval [1, 365]."
                
        elif func_name == "set_reminder":
            minutes = args.get("minutes")
            message = args.get("message")
            if minutes is None or message is None:
                return False, "Required parameters 'minutes' or 'message' are incomplete."
            if not isinstance(minutes, int) or not (1 <= minutes <= 1440):
                return False, f"Timer parameter 'minutes' is out of bounds ({minutes}), limit is 1440."
            if len(str(message)) > 200:
                return False, f"Truncation block: Reminder body length exceeds 200 characters to prevent buffer overflow (current: {len(str(message))})."
                
        elif func_name == "list_directory_files":
            path_key = args.get("path")
            if not path_key:
                return False, "Required scenario identifier 'path' is missing."
            if path_key not in ALLOWED_SCAN_DIRS:
                return False, f"Sandbox violation: Access denied to unverified path identifier '{path_key}'."
                
        return True, ""
    except Exception as g_err:
        return False, f"Security perimeter encountered a parsing exception during payload evaluation: {str(g_err)}"

# ==============================================================================
# Central Dispatcher (Tool Routing Layer)
# ==============================================================================
def dispatch_tool(func_name: str, args: dict) -> str:
    is_allowed, reason = security_gateway(func_name, args)
    if not is_allowed:
        print(f"{COLOR_RED}{COLOR_BOLD}[🛡 Blocked] Security gateway intercepted action. Vector: {reason}{COLOR_RESET}")
        return f"Error: Action suspended by security perimeter. Details: {reason}"
        
    args_str = json.dumps(args, ensure_ascii=False)
    print(f"{COLOR_YELLOW}[⚡ Action] Dispatching tool: {func_name}({args_str}){COLOR_RESET}")
    
    try:
        if func_name == "get_system_stats":
            raw_res = get_system_stats()
        elif func_name == "open_app":
            raw_res = open_app(**args)
        elif func_name == "list_directory_files":
            raw_res = list_directory_files(**args)
        elif func_name == "clean_downloads_folder":
            raw_res = clean_downloads_folder(**args)
        elif func_name == "kill_process":
            raw_res = kill_process(**args)
        elif func_name == "set_reminder":
            raw_res = set_reminder(**args)
        else:
            return f"Error: Dispatcher failed to map target tool namespace: {func_name}"
            
        if isinstance(raw_res, (dict, list)):
            final_str = json.dumps(raw_res, ensure_ascii=False)
        else:
            final_str = str(raw_res)
            
        summary = final_str[:200] + ("..." if len(final_str) > 200 else "")
        print(f"{COLOR_GREEN}[👁 Observation] {summary}{COLOR_RESET}")
        return final_str
        
    except Exception as e:
        err_msg = f"[Tool Dispatch Failed] Runtime exception -> {type(e).__name__}: {str(e)}"
        print(f"{COLOR_RED}[❌ Error] {err_msg}{COLOR_RESET}")
        return err_msg

# ==============================================================================
# ReAct Execution Loop (Agent Cognitive Engine)
# ==============================================================================
def run_agent(user_input: str):
    messages = [
        {
            "role": "system",
            "content": "You are an autonomous AI assistant specialized in Windows systems engineering. You make independent decisions and dispatch atomic tools in sequence to execute user intents. Maintain extreme transparency and analytical rigor in your Thought process."
        },
        {"role": "user", "content": user_input}
    ]
    
    loop_count = 0
    while loop_count < MAX_LOOPS:
        loop_count += 1
        try:
            response = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                tools=TOOLS_SCHEMA,
                tool_choice="auto",
                stream=False
            )
        except Exception as api_err:
            print(f"{COLOR_RED}[❌ Error] Fatal API communication failure with LLM backend: {api_err}{COLOR_RESET}")
            return
            
        choice = response.choices[0]
        msg = choice.message
        
        if msg.tool_calls:
            if msg.content:
                print(f"{COLOR_CYAN}[🤔 Thought] {msg.content}{COLOR_RESET}")
            
            messages.append(msg)
            
            for tool_call in msg.tool_calls:
                f_name = tool_call.function.name
                try:
                    f_args = json.loads(tool_call.function.arguments) if tool_call.function.arguments else {}
                except Exception:
                    f_args = {}
                    
                observation = dispatch_tool(f_name, f_args)
                
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": f_name,
                    "content": observation
                })
            continue
        else:
            if msg.content:
                print(f"{COLOR_BOLD}[✅ Resolution] {msg.content}{COLOR_RESET}")
            return
            
    print(f"{COLOR_RED}{COLOR_BOLD}[❌ Error] Circuit Breaker activated: Maximum cognitive loop limit ({MAX_LOOPS}) exceeded. Task aborted.{COLOR_RESET}")

# ==============================================================================
# Terminal Entrypoint
# ==============================================================================
def main():
    # Initialize ANSI virtual terminal sequences for Windows CMD
    os.system('')
    
    print("=" * 64)
    print(f"{COLOR_BOLD}Windows AI Depth Defense Agent Architecture (win_agent.py){COLOR_RESET}")
    print("  - Engine: Native Python ReAct Loop (Zero framework bloat)")
    print("  - Security: Immutable Isolation Gateway + Restricted Sandbox")
    print("  - Type 'exit' or 'quit' to terminate the persistent daemon.")
    print("=" * 64)
    
    while True:
        try:
            user_raw_line = input("\n👤 Architect > ").strip()
            if not user_raw_line:
                continue
            if user_raw_line.lower() in ["exit", "quit"]:
                print("Termination signal received. Unmounting daemon... Goodbye.")
                sys.exit(0)
                
            run_agent(user_raw_line)
        except KeyboardInterrupt:
            print("\nHard interrupt sequence intercepted. Aborting current execution vector.")
            sys.exit(0)
        except Exception as main_loop_err:
            print(f"{COLOR_RED}[❌ Error] Fatal queue collapse in primary execution loop: {main_loop_err}{COLOR_RESET}")

if __name__ == "__main__":
    main()
```