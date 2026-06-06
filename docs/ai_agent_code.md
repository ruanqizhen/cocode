# AI Agent 的代码

下面是 AI Agent 的代码，把它复制到一个名为 `win_agent.py` 的文件中。然后运行，就可以尝试我们设计的 AI Agent 的功能了。

```python
"""
win_agent.py — Windows AI 系统命令助手
依赖: pip install openai psutil win10toast（win10toast 为可选）
环境变量:
    DEEPSEEK_API_KEY  （必需）
    DEEPSEEK_BASE_URL （可选，默认 https://api.deepseek.com）
    DEEPSEEK_MODEL    （可选，默认 deepseek-v4-flash）
"""

import os, sys, json, shutil, subprocess, threading, tempfile, time
from datetime import datetime, timedelta
from pathlib import Path
import psutil
from openai import OpenAI

# ==============================================================================
# ANSI 颜色常量（Windows 需要先调用 os.system('') 激活）
# ==============================================================================
COLOR_RESET  = "\033[0m"
COLOR_CYAN   = "\033[96m"   # Thought（模型推理过程）
COLOR_YELLOW = "\033[93m"   # Action（即将调用工具）
COLOR_GREEN  = "\033[92m"   # Observation（工具返回结果）
COLOR_RED    = "\033[91m"   # Error / Warning
COLOR_BOLD   = "\033[1m"

# ==============================================================================
# 业务安全常量定义
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
# 环境变量管理与客户端初始化
# ==============================================================================
API_KEY = os.environ.get("DEEPSEEK_API_KEY")
if not API_KEY:
    print(f"{COLOR_RED}{COLOR_BOLD}[❌ Error] 严重错误: 缺失必需的环境变量 'DEEPSEEK_API_KEY'。{COLOR_RESET}")
    print("运行此脚本前，请先在终端配置该环境变量。")
    print("示例 (Windows CMD):   set DEEPSEEK_API_KEY=your_actual_api_key")
    print("示例 (PowerShell):   $env:DEEPSEEK_API_KEY=\"your_actual_api_key\"")
    sys.exit(1)

BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
MODEL    = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-flash")

try:
    client = OpenAI(api_key=API_KEY, base_url=BASE_URL)
except Exception as init_err:
    print(f"{COLOR_RED}[❌ Error] 初始化 OpenAI 客户端失败: {init_err}{COLOR_RESET}")
    sys.exit(1)

# ==============================================================================
# Core Tools Implementation (核心工具函数定义)
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
        return {"error": f"获取系统性能数据时发生内部异常: {str(e)}"}


def open_app(app_name: str) -> str:
    try:
        proc = subprocess.Popen([app_name], shell=False)
        return f"已启动 {app_name}，PID: {proc.pid}"
    except Exception as e:
        return f"启动应用失败。内部错误: {str(e)}"


def list_directory_files(path: str, extension: str = "") -> dict:
    try:
        real_path = ALLOWED_SCAN_DIRS[path]
        if not real_path.exists():
            return {"directory": str(real_path), "error": "指定的物理目标路径在当前系统上不存在", "files": []}
        
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
        return {"error": f"扫描文件目录时抛出未知异常: {str(e)}"}


def clean_downloads_folder(days: int = 30) -> str:
    try:
        downloads_dir = Path.home() / "Downloads"
        if not downloads_dir.exists():
            return "本地未发现有效的下载文件夹路径"
        
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
            return "未发现符合条件的文件"
            
        print(f"\n{COLOR_YELLOW}====== [⚠️ 待清理文件清单] ======{COLOR_RESET}")
        for _, name, size, mtime in to_move:
            print(f" - {name} ({round(size/1024, 2)} KB, 修改时间: {mtime.strftime('%Y-%m-%d')})")
        print("=" * 32)
        
        confirm = input(f"确认移动以上 {len(to_move)} 个文件? [Y/N]: ").strip().lower()
        if confirm != 'y':
            return "操作已被用户取消"
            
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
                details.append(f"[成功] {name} -> 临时目录")
            except Exception as e:
                fail_count += 1
                details.append(f"[失败] {name} (原因: {type(e).__name__})")
                
        return f"清理流程完毕。成功移动 {success_count} 个，失败 {fail_count} 个。回执日志:\n" + "\n".join(details)
    except Exception as main_err:
        return f"执行下载项物理清理时发生严重内部故障: {str(main_err)}"


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
            return f"未找到名为 {process_name} 的运行中进程"
            
        success_count = 0
        cancel_count = 0
        
        for proc in matched_procs:
            try:
                pid = proc.info['pid']
                exe_path = proc.info['exe'] or "未知映像路径"
                
                print(f"\n发现目标进程 ── 名称: {process_name} | PID: {pid} | 路径: {exe_path}")
                confirm = input(f"确认终止进程 {process_name} (PID: {pid})? [Y/N]: ").strip().lower()
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
                print(f"{COLOR_RED}[❌ Error] 无法操作 PID 为 {proc.pid} 的实例: {proc_err}{COLOR_RESET}")
                
        if success_count == 0 and cancel_count > 0:
            return "操作已被用户取消"
            
        return f"进程终止动作已结束。成功干预 {success_count} 个实例，用户跳过 {cancel_count} 个实例。"
    except Exception as e:
        return f"检索或剔除指定进程序列时引发系统错误: {str(e)}"


def set_reminder(minutes: int, message: str) -> str:
    try:
        def callback():
            print(f"\n{COLOR_RED}{COLOR_BOLD}[⏰ REMINDER] 定时提醒触发: {message}{COLOR_RESET}\a")
            try:
                from win10toast import ToastNotifier
                toaster = ToastNotifier()
                toaster.show_toast("Windows AI 自动化助手", message, duration=10, threaded=True)
            except Exception:
                pass

        t = threading.Timer(minutes * 60, callback)
        t.daemon = True
        t.start()
        
        eta = (datetime.now() + timedelta(minutes=minutes)).strftime("%H:%M:%S")
        return f"提醒已设置：将在 {minutes} 分钟后（{eta}）提醒您：{message}"
    except Exception as e:
        return f"后台时钟守护挂载失败: {str(e)}"

# ==============================================================================
# JSON Schema Specifications for Function Calling
# ==============================================================================
TOOLS_SCHEMA = [
    {
        "type": "function",
        "function": {
            "name": "get_system_stats",
            "description": "【场景】当用户需要实时获悉主机当前的系统级资源快照时调用。【功能】返回包含当前主机整体 CPU 负载百分比、物理内存以及 C 盘存储占用信息的结构化快照数据。【返回】包含 cpu_percent, memory, disk_c 三大要素指标的 JSON 字典串。",
            "parameters": {"type": "object", "properties": {}, "required": []}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "open_app",
            "description": "【场景】当用户显式要求打开某个特定的常见基础系统应用（如记事本、计算器等）时调用。【功能】启动系统底层白名单受信任应用程序。【返回】成功时返回附带底层进程物理 PID 的明文回执。",
            "parameters": {
                "type": "object",
                "properties": {
                    "app_name": {
                        "type": "string",
                        "description": "欲唤醒的目标白名单应用简称",
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
            "description": "【场景】用户想要了解桌面、下载、文档等特定标准根目录下有哪些文件，或检索特定后缀的文件时调用。【功能】扫描受管辖的单一指定用户根级物理目录（不递归），获取其扁平化文件列表并支持按指定后缀名筛选归档。【返回】包含目录绝对路径、过滤器类型、匹配项数量及文件详细元数据的 JSON 字典串。",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "受限的目标应用场景目录关键字",
                        "enum": ["desktop", "downloads", "documents", "pictures"]
                    },
                    "extension": {
                        "type": "string",
                        "description": "可选参数。限定返回特定拓展名的文件（形如 'pdf', '.txt' 均可），大小写不敏感。默认不做约束过滤。"
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
            "description": "【场景】当用户抱怨系统盘空间或要求重置/清理其‘下载’文件夹中堆积的陈旧文件时激活。【功能】安全检索指定天数之前未更改的旧文件，并交由用户进行前置控制台确认，确认通过后整体位移至临时交换区隔离存储。【返回】执行结果总计说明及详尽的文件转移流转报告日志。",
            "parameters": {
                "type": "object",
                "properties": {
                    "days": {
                        "type": "integer",
                        "description": "文件未被触碰或修改的过期间隔天数下限，须在闭区间 [1, 365] 内，缺省通常推荐 30 天。"
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "kill_process",
            "description": "【场景】用户反馈某程序崩溃卡死、要求强制关掉某个后台非核心软件时调用。【功能】依据进程映像全名快速搜寻内存空间，在控制台弹出针对单个或多个相符 PID 物理实体的前置销毁确认，随后实施强行终止。【返回】说明此次处理周期中实际成功或放弃中止的各实例数目报告。",
            "parameters": {
                "type": "object",
                "properties": {
                    "process_name": {
                        "type": "string",
                        "description": "进程的映像绝对名称（例如 'notepad.exe', 'chrome.exe'），大小写不敏感。"
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
            "description": "【场景】用户提出在若干分钟后提醒他某项事务、或者是建立简易计时闹钟时调用。【功能】生成不阻塞当前常驻会话的独立后台计时轻量任务，在设定的绝对时间差归零时在控制台控制响铃并在 Windows 桌面抛出气泡弹窗。【返回】对本次异步定时机制建立成功的即时状态确认回执。",
            "parameters": {
                "type": "object",
                "properties": {
                    "minutes": {"type": "integer", "description": "相对当前时间的顺延推迟分钟数，必须在范围 [1, 1440] 内。"},
                    "message": {"type": "string", "description": "提醒时需要向用户明示显示的备忘描述内容，字数不超过 200 字。"}
                },
                "required": ["minutes", "message"]
            }
        }
    }
]

# ==============================================================================
# Security Gateway (统一安全防御网关)
# ==============================================================================
def security_gateway(func_name: str, args: dict) -> tuple[bool, str]:
    try:
        if func_name == "open_app":
            app_name = args.get("app_name")
            if not app_name:
                return False, "必需的参数 'app_name' 缺失或解析为空。"
            if app_name not in ALLOWED_APPS:
                return False, f"检测到未授权的程序启动尝试: '{app_name}' 不在可信白名单中。"
                
        elif func_name == "kill_process":
            process_name = args.get("process_name")
            if not process_name:
                return False, "必需的参数 'process_name' 缺失或解析为空。"
            if process_name.lower() in [p.lower() for p in PROTECTED_PROCESSES]:
                return False, f"检测到越权终止核心关键进程高危动作: 系统已全面禁止杀除进程 '{process_name}'。"
                
        elif func_name == "clean_downloads_folder":
            days = args.get("days", 30)
            if not isinstance(days, int) or not (1 <= days <= 365):
                return False, f"参数 'days' 取值越界（接收值: {days}）。安全策略限定必须位于闭区间 [1, 365] 之内。"
                
        elif func_name == "set_reminder":
            minutes = args.get("minutes")
            message = args.get("message")
            if minutes is None or message is None:
                return False, "提醒功能所需的 'minutes' 与 'message' 联合主干参数不全。"
            if not isinstance(minutes, int) or not (1 <= minutes <= 1440):
                return False, f"定时延迟参数 'minutes' 非法或违规越界（接收值: {minutes}），最大上限不允许超过 1440 分钟（24小时）。"
            if len(str(message)) > 200:
                return False, f"安全网关截断：防止超长文本溢出潜在隐患，提醒正文字数不得超越 200 限制（当前长: {len(str(message))}）。"
                
        elif func_name == "list_directory_files":
            path_key = args.get("path")
            if not path_key:
                return False, "必需的目标场景标识参数 'path' 缺失。"
            if path_key not in ALLOWED_SCAN_DIRS:
                return False, f"绝对路径沙箱隔离违规：拒绝访问非安全白名单注册的标识区 '{path_key}'。"
                
        return True, ""
    except Exception as g_err:
        return False, f"安全隔离网关在深度解析研判参数包时遭遇内部异常: {str(g_err)}"

# ==============================================================================
# Central Dispatcher (工具分发和统一封装层)
# ==============================================================================
def dispatch_tool(func_name: str, args: dict) -> str:
    is_allowed, reason = security_gateway(func_name, args)
    if not is_allowed:
        print(f"{COLOR_RED}{COLOR_BOLD}[🛡 Blocked] 安全隔离网关拦截动作。原因: {reason}{COLOR_RESET}")
        return f"错误: 触发系统纵深防御保护网关拦截。操作已无害化挂起。拦截详情: {reason}"
        
    args_str = json.dumps(args, ensure_ascii=False)
    print(f"{COLOR_YELLOW}[⚡ Action] 调用工具: {func_name}({args_str}){COLOR_RESET}")
    
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
            return f"错误: 调度层在底层未搜寻到匹配映射的功能实体: {func_name}"
            
        if isinstance(raw_res, (dict, list)):
            final_str = json.dumps(raw_res, ensure_ascii=False)
        else:
            final_str = str(raw_res)
            
        summary = final_str[:200] + ("..." if len(final_str) > 200 else "")
        print(f"{COLOR_GREEN}[👁 Observe] {summary}{COLOR_RESET}")
        return final_str
        
    except Exception as e:
        err_msg = f"[工具执行失败] 运行时致命崩溃 -> {type(e).__name__}: {str(e)}"
        print(f"{COLOR_RED}[❌ Error] {err_msg}{COLOR_RESET}")
        return err_msg

# ==============================================================================
# Single Turn ReAct Core Loop Engine
# ==============================================================================
def run_agent(user_input: str):
    messages = [
        {
            "role": "system",
            "content": "你是一个专精于 Windows 系统自动化操作的 AI 助手。你通过自主决策并按需、依序调用各种原子功能工具来稳妥解决用户的意图。请注意在每一步思考（Thought）中，保持极高的透明性及专业度。"
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
            print(f"{COLOR_RED}[❌ Error] DeepSeek 后端服务通信发生物理中断或 API 报错: {api_err}{COLOR_RESET}")
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
                print(f"{COLOR_BOLD}[✅ Final] {msg.content}{COLOR_RESET}")
            return
            
    print(f"{COLOR_RED}{COLOR_BOLD}[❌ Error] 触发异常熔断保护：当前任务耗费的单轮思考循环总计超越最大设定极限次数 ({MAX_LOOPS})，自动切断上下文。{COLOR_RESET}")

# ==============================================================================
# Main Interactive Interface entry
# ==============================================================================
def main():
    # 激活 Windows 系统终端原生对 ANSI 虚拟终端转义序列的支持
    os.system('')
    
    print("=" * 64)
    print(f"{COLOR_BOLD}Windows AI 纵深防御系统自动化命令助手 (win_agent.py){COLOR_RESET}")
    print("  - 架构设计：纯原生 Python ReAct 无限闭环引擎 (无第三方高阶 Agent 依赖)")
    print("  - 安全核心：全链路安全策略隔离网关 + 限制物理目录沙箱机制")
    print("  - 键入 'exit' 或 'quit' 即可优雅退出常驻终端交互。")
    print("=" * 64)
    
    while True:
        try:
            user_raw_line = input("\n👤 User > ").strip()
            if not user_raw_line:
                continue
            if user_raw_line.lower() in ["exit", "quit"]:
                print("收到离线指令。安全自动化守护进程正在注销卸载... 再见！")
                sys.exit(0)
                
            run_agent(user_raw_line)
        except KeyboardInterrupt:
            print("\n检测到硬中断控制组合键，当前指令执行状态已撤回，系统安全退出。")
            sys.exit(0)
        except Exception as main_loop_err:
            print(f"{COLOR_RED}[❌ Error] 主控常驻消息队列循环发生未知错乱: {main_loop_err}{COLOR_RESET}")

if __name__ == "__main__":
    main()
```