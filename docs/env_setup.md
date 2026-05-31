---
title: 搭建你的 AI 开发环境：工欲善其事
---

# 搭建你的 AI 开发环境：工欲善其事

> **“在 AI 时代，一套配置精良的开发环境，就是你的赛博工作台和战机驾驶舱。”**

---

在前面的“零基础开发网页”章节中，我们主要使用的是无需本地配置的在线 AI。但当我们要进入真正的专业开发，或者是使用更强大的智能体（Agent）和结对编程工具时，本地环境的配置就是必过的一关。

本章将手把手带你搭建起一套现代化的 **AI 结对开发环境**，无论你是 Windows 还是 macOS 用户，都可以无缝跟进。

---

## 1. 基础依赖：Node.js 与 Git 的极简安装

现代 AI 编程工具（如 Cline、Aider 等）在后台需要依赖运行环境与版本控制系统。

### 📦 安装 Node.js
Node.js 是运行 JavaScript 的本地环境，也是现代前端开发的核心根基。
* **下载地址**：访问 [Node.js 官方网站](https://nodejs.org/)，选择 **LTS（长期支持版）** 下载并运行安装包。
* **验证安装**：打开你的终端（Windows 下使用 Powershell，macOS/Linux 下使用 Terminal），输入：
  ```bash
  node -v
  npm -v
  ```
  如果输出了版本号（例如 `v20.x.x`），说明安装成功。

### 🐙 安装 Git
Git 是版本控制的终极标准，也是 AI 编程中无可替代的“安全气囊”（下一章我们将详细拆解）。
* **下载地址**：
  * **Windows**：访问 [Git for Windows](https://git-scm.com/) 下载安装程序，一路点击“Next”即可。
  * **macOS**：在终端直接运行 `git --version`，系统会自动弹窗提示安装 Xcode Command Line Tools（包含 Git）；或通过包管理器安装：`brew install git`。
* **验证安装**：在终端运行：
  ```bash
  git --version
  ```

---

## 2. 战机舱门开启：编辑器选型与配置

现代 AI 辅助编辑器主要分为“老牌编辑器强化版”（VS Code）与“专为 AI 重构的战机”（Cursor）。

### 🚀 方案 A：专为 AI 而生的编辑器 —— Cursor
**Cursor** 是目前最火爆的 AI 集成开发环境（IDE），直接基于 VS Code 源码进行深度二次开发。

1. **下载与安装**：访问 [Cursor 官网](https://www.cursor.com/) 下载对应系统的安装包进行安装。
2. **核心特色**：
   * **`Ctrl + K` (Inline Generate)**：直接在编辑器任意行唤醒 AI，写下你的注释或指令，AI 会在原地直接生成或修改代码。
   * **`Ctrl + L` (Chat)**：右侧常驻的 AI 聊天窗口，能够自动识别你当前选中的代码，支持引用当前文件、整个代码库（`@Codebase`）或互联网搜索（`@Web`）。
   * **Composer (`Ctrl + I`)**：这是 Cursor 的杀手锏，支持多文件协同编辑和自主式多步执行。
3. **安全防冲突配置**：
   * 打开 Cursor 的 Settings -> Features -> Tab (Autocomplete)。
   * **强烈建议**：对于习惯用 Git 手动控制代码节奏的程序员，可以在多人协作项目中，合理关闭“Auto-import”或“Auto-complete on accept”以防 AI 自动合入错误的未验证依赖。

### 🔌 方案 B：老牌王者 VS Code 注入智能体插件 —— Cline
如果你更偏爱原装的 **VS Code**，希望保留自己积攒多年的配置与扩展，可以使用 Cline 插件。

1. **安装 Cline**：
   * 在 VS Code 的左侧扩展市场（Extensions）搜索 **Cline**。
   * 点击 **Install** 安装。
2. **Cline 的独特魅力**：
   * **智能体高自主度**：Cline 不仅能聊天和修改代码，还能自主运行终端命令、读取你的本地目录、诊断报错，并通过反复迭代直至任务达成。它就像一个运行在你 VS Code 里的全职初级工程师。

---

## 3. 燃料注入：主流 API 密钥的获取与管理

无论是使用 Cursor、VS Code 还是命令行 Aider，它们底层的大脑都是大模型 API。为了让它们运转起来，你需要准备好“燃料”——**API Key**。

### 🔑 常用 API 密钥申请通道

| 厂商 | 核心模型 | 申请地址 | 特点 |
|---|---|---|---|
| **DeepSeek** | `deepseek-chat` / `deepseek-reasoner` | [DeepSeek 开放平台](https://platform.deepseek.com/) | 价格极低，推理能力与中文处理极其强悍。 |
| **Anthropic** | `claude-3-5-sonnet` / `claude-3-7-sonnet` | [Anthropic Console](https://console.anthropic.com/) | 编程逻辑与代码重构领域的“黄金标准”。 |
| **Google Gemini** | `gemini-2.5-flash` / `gemini-2.0-pro` | [Google AI Studio](https://aistudio.google.com/) | 享有巨大的免费额度，百万上下文容纳度惊人。 |
| **OpenAI** | `gpt-4o` / `o3-mini` | [OpenAI Platform](https://platform.openai.com/) | 行业标准，生态兼容性极强。 |

### 🛠️ 环境变量的配置方法（以 DeepSeek 为例）
为了安全起见，千万不要把 API Key 硬编码在代码中。最佳的做法是将其配置为操作系统的**环境变量**。

#### 💻 Windows (PowerShell)
在终端运行：
```powershell
[System.Environment]::SetEnvironmentVariable('DEEPSEEK_API_KEY', '您的api_key_xxx', 'User')
```
*提示：配置完成后，需关闭并重新打开终端，环境变量才会生效。*

#### 🍎 macOS / Linux
在你的 shell 配置文件（如 `~/.zshrc` 或 `~/.bashrc`）中加入：
```bash
export DEEPSEEK_API_KEY="您的api_key_xxx"
```
保存后，在终端运行：`source ~/.zshrc`。

---

## 4. 终极极客命令行：Aider 极简部署

如果你是一个喜欢在黑漆漆的命令行终端中飞速敲击键盘的“终极极客”，那么基于命令行深度融合 Git 的结对编程神兵 **Aider** 是你的不二之选。

1. **安装 Aider**：
   Aider 推荐通过 Python 环境安装。在终端输入：
   ```bash
   pip install aider-chat
   ```
2. **启动与调用**：
   在任何你的 Git 项目根目录下，确保配置好了对应的 API 密钥环境变量，然后直接输入：
   ```bash
   aider
   ```
   Aider 会自动检测你的本地 Git 仓库，并在每次代码修改并运行成功后，**自动为您撰写极其标准的 Git Commit Message 并自动提交**。这种酣畅淋漓的丝滑体验，会彻底改变你对命令行开发的认知。

---

## 5. 私有化防泄密：本地大模型（Ollama）的搭建

很多公司由于合规和数据保密要求，**绝对禁止**将代码上传给第三方闭源 API。此时，在自己电脑上搭建本地私有化大模型是唯一的解法。

### 🍧 安装 Ollama
Ollama 是一款极其出色的本地大模型运行框架，极大地简化了本地模型的下载和运行流程。
1. 访问 [Ollama 官网](https://ollama.com/) 下载对应系统的客户端并进行安装。
2. 安装完成后，在终端运行以下命令，即可一键下载并启动当前最强劲的轻量级本地推理模型（以 `deepseek-r1:8b` 为例）：
   ```bash
   ollama run deepseek-r1:8b
   ```
   *注意：`8b`（80亿参数）模型需要你的电脑至少拥有 8GB 统一内存（M系列 Mac）或 NVIDIA 显卡。如果电脑配置极高，可以尝试 `deepseek-r1:32b`；若配置较低，推荐 `qwen2.5-coder:7b` 或 `qwen2.5-coder:1.5b`。*

### 🔌 将本地模型接入 Cline/Cursor
以 Cline 为例：
1. 打开 Cline 的设置面板（右上角齿轮）。
2. 在 **API Provider** 中选择 **Ollama**。
3. **Base URL** 填写本地默认的：`http://localhost:11434`。
4. 在 **Model ID** 中填入您刚刚下载的模型，例如 `deepseek-r1:8b`。

恭喜你！现在，你拥有了一套完全运行在本地、离线断网亦可运行、且**零 Token 成本、零泄密风险**的赛博结对编程舱！

---

## 本章小结

工欲善其事，必先利其器。在本章中，我们：
1. 部署了 Node.js 与 Git 等底层依赖；
2. 了解了 Cursor 编辑器与 VS Code Cline 插件的各自优势与选型；
3. 学习了如何申请并安全保管各厂商的 API 密钥；
4. 探索了 Ollama 本地模型的私有化搭建路径。

装备已经就绪。但在你按下 AI 编辑器引擎的启动按钮前，我们必须先学习如何为自己扣上最安全的“防护安全带”——那就是在 AI 时代被赋予了全新维度的版本控制工具：**Git**。

下一章，让我们一起走进 **《Git 极简入门与安全网》**。
