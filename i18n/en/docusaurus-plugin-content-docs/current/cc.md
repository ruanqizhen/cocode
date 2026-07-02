# Claude Code and Google Antigravity

> "Be formless, shapeless, like water." — Bruce Lee

In the previous chapter, we systematically reviewed the six major vertical forms of AI programming tools. If that was a top-down view of the weaponry spectrum, then in this chapter we will select the rulers representing two extreme philosophical evolutions within this spectrum, and conduct a comprehensive dissection and duel.

They are:

* Claude Code: A solitary, sharp blade that believes "the terminal is everything" and pushes the Unix pipeline philosophy to its limits. During the writing of this book, Claude Code was the most effective AI programming tool on the market, bar none, and was also the author's primary tool at work.
* Google Antigravity: A cross-era agent mothership that builds "multi-agent collaboration with visual elements maxed out." Because the author has already purchased a Google Pro subscription, Google Antigravity is the cheapest AI programming tool for the author, making it the author's primary AI programming tool for home use.

These two tools not only represent the highest technological crystallization of Anthropic and Google in the field of software engineering, but also reveal two distinctly different evolutionary paradigms for future human-machine pair collaboration. This chapter will take you deep into their core architectures, and at the end, will offer a practical strategy for forcefully driving Claude Code's advanced fully automated development capabilities using the ultra-low-cost DeepSeek model.


## Claude Code

### Product Positioning

Claude Code is a terminal-native AI programming agent (CLI Agent) officially launched by Anthropic. It refuses to compromise with any traditional GUI editor; it is neither a massive standalone IDE nor a presumptuous plug-in in a sidebar. It is simply a hacker avatar lying quietly in your command line (Shell), ready to be awakened at any time.

Its core design philosophy is very pure: "Meet you where you already work, using the tools you already love." It directly relies on the highest execution privileges of the local system, and like a true human geek, integrates seamlessly with your various underlying scripts, Git pipelines, and CI/CD pipelines.

### Core Hardcore Capabilities

| Core Capability | Practical Operational Performance from an Engineering Perspective |
| --- | --- |
| Fully Automated Seamless Build | You throw it a natural language goal, and it plans the scheme, writes the code, troubleshoots local syntax errors, and ensures it runs successfully. |
| Self-Healing Debugging | Paste a terminal error or directly assign a Bug, and it will automatically traverse the codebase, locate the root cause, and implement a fix right on the spot. |
| Dead-Zone-Free Navigation | Maintains precise awareness of global project dependencies and ASTs, ready to answer macro questions like "Where is this deprecated interface implicitly called?" |
| Tedious Engineering Automation | Automatically fixes Lint issues in batches, autonomously resolves massive Git Merge Conflicts, and automatically distills Release logs. |
| MCP Cross-Boundary Connection | Based on the Model Context Protocol, it can break out of the local sandbox and directly read/write your Google Drive, Figma blueprints, or align task progress directly with the team on Slack or Jira. |

### Interaction Paradigm

Claude Code shakes off the shackles of graphical interfaces and derives highly free interaction modes within the terminal:

#### Interactive Terminal Mode


:::tip Background Knowledge: Node.js
Claude Code is developed based on Node.js, so Node.js must be installed to run it. If you don't know Node.js yet, you can read [Node.js](nodejs) first, and then come back to continue reading below.
:::

```bash
# Cross-platform one-click global installation
npm install -g @anthropic-ai/claude-code 

# Wake up the AI agent directly in your project root directory
cd my-backend-project
claude

```

At this time, the terminal will enter a proprietary dialogue sandbox, where you can issue various radical system refactoring commands directly to it.

#### Non-Interactive Script Mode

```bash
claude -p "Deeply analyze the current project's permission verification architecture and output a Markdown security document"

```

#### Pipe Mode

This is the capability that makes all old-school geeks cheer. It can be seamlessly nested into Linux pipelines to filter and distill dynamic context in real-time:

```bash
# Dynamically monitor log streams; if an exception occurs, immediately let the AI catch and reflect
tail -f app.log | claude -p "If unknown exceptions are found, immediately extract stack info and provide potential fixes"

# Feed historical crash errors directly for fully automated Root Cause Analysis (RCA)
cat crash-error.log | claude -p "Analyze the root causes of these errors; see if it's related to our Redis connection pool overflowing"

```

### Exclusive Underlying Black Tech Mechanisms

1. `CLAUDE.md` (Digital Onboarding Guide): This is the soul anchor of Claude Code's context engineering. Maintain this document in the project root directory, filled with your project's quirky rules, build commands, and absolute red lines that must not be touched. It's like a "disclaimer" prepared for a newly arrived senior colleague; Claude Code will adhere to it as the primary rule every time before starting.
2. Extended Thinking: When encountering extremely bizarre architectural deadlocks, Claude Code triggers deep reasoning chains. You can intuitively see its densely packed "psychological activity trajectory" in the terminal, displaying high-purity technical self-reflection without adding nonsense.
3. Auto-compact (Dynamic Track Pruning): When you type long speeches in a terminal session, causing the context window to reach 95% capacity, the tool-layer Harness will instantly awaken. It calls a small background model to compress and summarize the core intent of earlier chit-chat and expired logs, keeping the current active Token usage firmly within a reasonable range.
4. Sandbox Security Defense Line: Built entirely on Linux Namespaces and sandbox isolation mechanisms, when executing dangerous commands locally or reading sensitive environment variables, it will automatically isolate via permission fences, even performing network blockages to strictly prevent the AI from generating destructive privilege escalations.

### Usage Costs

Claude Code has introduced commercial fixed monthly fee plans, with different tiers such as $20/month, $100/month, and $200/month. The $200 package is sufficient for the daily average intensity usage of professional programmers, but if heavy use is required, such as running multiple rounds of looping debates, it may still fall short. In summary, Claude Code is very easy to use, but quite expensive.



## Google Antigravity

### Product Positioning

If Claude Code is a top-tier assassin adept at hand-to-hand combat, then Google Antigravity is an aircraft carrier sitting high in the sky, commanding countless foot soldiers in coordinated warfare.

Antigravity is Google's ace product for the future era of fully automated development. It is deeply modified based on the VS Code open-source foundation, but it rebuilds the fundamental philosophy of IDEs from the bottom up: it announces that software engineering completely bids farewell to the auxiliary era of "humans write code, AI provides suggestions in the sidebar," and officially steps into the pilot era of "humans act as Architecture Managers, with full authority to dispatch Multi-Agents for collaborative development."

### Core Visual Spectacle

When you launch Antigravity, you will see its most recognizable core UI paradigm—completely dividing the workflow into two worlds, left and right:

```text
┌───────────────────────────────────────┬───────────────────────────────────────┐
│                                       │                                       │
│          Agent Manager                │               Editor                  │
│         (Task Control Center)         │            (Standard Editor)          │
│                                       │                                       │
│  [Agent 1: Fixing SQL Injection Bug]  │  * 100% Retains VS Code native eco    │
│  [Agent 2: Writing User Module Tests] │  * Keybindings, plugins fully compat  │
│  [Agent 3: Refactoring frontend UI]   │  * Intuitively review Agent Code Diff │
│                                       │                                       │
└───────────────────────────────────────┴───────────────────────────────────────┘

```

- Agent Manager (Task Control Center): You play the role of Senior Technical Director here. You only need to issue macro Missions, and the system will automatically incubate and derive multiple parallel Sub-agents. You can monitor the lifecycle, thinking logic, and current task bottlenecks of each agent in real-time here.
- Editor (Standard Editor): This still retains your most accustomed VS Code universe (plugins, themes, muscle memory). Here, from a third-party perspective, you primarily use inline commands (Cmd+I) to finely tune local code, or approve the changes submitted by the agents.

### Killer Features of the Agent Mothership

#### Multi-Agent Concurrency

This is the most destructive generational leap over traditional Chat tools. In traditional sidebar tools, you have to wait for the AI to finish writing the previous interface and typing the words before you can ask the next question.
But in Antigravity, you can simultaneously click "Create New Agent," assigning task A to fix frontend styles, task B to change backend database contracts, and task C to write unit tests. Multiple Agents push forward highly concurrently in their respective isolated virtual context sandboxes, multiplying productivity.

#### Perfect "Artifacts" System and Proof of Work

Antigravity believes that human directors cannot possibly have the energy to read the tens of thousands of dialogue rounds of an Agent. Therefore, it requires that when agents work, they must accumulate and generate highly visual "artifacts" as proof of work reporting:

| Artifact Type | Engineering Explanation |
| --- | --- |
| Task Lists | Structured task boards self-disassembled by the agent before starting work |
| Implementation Plan | Macro architectural change blueprints generated by the agent |
| Walkthrough | After completion, a technical change summary and test point alignment explanation automatically distilled by the agent |
| Screenshots / Video | The ultimate gospel for frontend developers: the agent automatically captures before-and-after comparison screenshots of page changes, and even automatically records videos of frontend interaction clicks, thereby proving to humans "my page didn't draw skewed" |

You can add human comments by selecting text directly on these artifacts, just like reviewing Google Docs. After the agent receives the feedback, it will automatically perform a new round of self-healing iterations.

#### Built-in Native Chrome Browser Agent

Antigravity deeply integrates Google's own Chrome browser engine. After an agent finishes writing a piece of frontend code, it can autonomously pull up a headless browser, personally click buttons, fill out forms, and verify whether the logic runs successfully in a real DOM environment. It is not just an "Agent that can write code," it is even more so a "QA Agent that can do end-to-end (E2E) UI testing itself."



## Running Claude Code on the DeepSeek Engine

In the future trends of the previous chapter, we threw out a highly disruptive industry assertion: "Models are the passing soldiers, the tool-layer Harness is the iron-clad camp."

To prove this argument to you physically, we're going to play hardball. Although Claude Code officially nominally locks in Anthropic's own models, the good news is that DeepSeek officially launched a special request endpoint perfectly compatible with the Anthropic API format.

This means that we can use exquisite tampering of system environment variables to forcefully graft Claude Code—that world-class, smart "body (Harness)" that knows how to deeply control the terminal and Git—onto the highly cost-effective DeepSeek brain, whose price is only a fraction of overseas major vendors!

Here is the entire production-grade configuration pipeline presented to you with both hands.

### Prerequisites

1. Ensure a Node.js 18+ environment is installed locally.
2. Log into the [DeepSeek Platform](https://platform.deepseek.com/) developer backend, generate a brand new `sk-` format API Key, and ensure the account is injected with sufficient computing balance.

### Step 1: Global Installation of Claude Code

Execute the official installation command in your host terminal (if you have installed it before, it is recommended to update to the latest version to ensure compatibility):

```bash
npm install -g @anthropic-ai/claude-code

```

### Step 2: Implement Environment Variable Hijacking

We need to use environment variables to stealthily route traffic to DeepSeek's relay servers and spoof the model name at the exact moment Claude Code initiates a network request.

#### 🍏 macOS / Linux Users (Write to Shell Profile)

Open your `~/.zshrc` or `~/.bashrc` file and paste the following "core-swapping matrix" directly at the very bottom:

```bash
# =====================================================================
# CLAUDE CODE + DEEPSEEK EXTRACTION TUNNEL
# =====================================================================
# 1. Hijack base gateway route, connect directly to DeepSeek's Anthropic-compatible dedicated endpoint
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic

# 2. Inject your DeepSeek key, spoofing the Anthropic token
export ANTHROPIC_AUTH_TOKEN="YOUR_DEEPSEEK_API_KEY_XXXXXXXX"

# 3. Forcefully implement full-module model generational spoofing (Core spoofing layer)
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]

# 4. Direct lightweight sub-agents to the extremely fast Flash model
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash

# 5. Turn on highest level of intellectual thinking firepower, and lift API timeout limits
export CLAUDE_CODE_EFFORT_LEVEL=max
export API_TIMEOUT_MS=600000

```

After saving the file, execute `source ~/.zshrc` in the terminal to let the magic take effect instantly.

#### 🪟 Windows Users (PowerShell Permanent Persistence)

If you are using Git Bash or PowerShell in a Windows environment, you can execute the following script to permanently write user-level system variables:

```powershell
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://api.deepseek.com/anthropic", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "YOUR_DEEPSEEK_API_KEY_XXXXXX", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "deepseek-v4-pro[1m]", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_OPUS_MODEL", "deepseek-v4-pro[1m]", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_SONNET_MODEL", "deepseek-v4-pro[1m]", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_HAIKU_MODEL", "deepseek-v4-flash", "User")
[System.Environment]::SetEnvironmentVariable("CLAUDE_CODE_SUBAGENT_MODEL", "deepseek-v4-flash", "User")
[System.Environment]::SetEnvironmentVariable("CLAUDE_CODE_EFFORT_LEVEL", "max", "User")

```

After the configuration is complete, simply reopen a clean PowerShell window.

### Step 3: Witness the Miracle Cold Start

Now, go into any of your software engineering project root directories and directly type the awakening command:

```bash
claude

```

At this time, Claude Code will still pull up its cool console character animation and initialize its local sandbox file monitor just as usual. But from this second on, the computing power truly backing all the complex, multi-step code rewriting tasks you issue in the terminal is the highly cost-effective DeepSeek brain!


## Reflections on the Red Lines, Pain Points, and Costs of Core Swapping

Although this hacker-style "bait-and-switch" can simply and crudely help you knock down your development Token bill by over 90% (directly degrading costs by 10-30 times), you must also objectively face the physical flaws generated during cross-vendor compatibility. In practice, you need to pay special attention to and guard against the following "landmines":

1. Lack of native Extended Thinking functionality: At its core, Claude Code is designed with an extremely rigorous parsing flow tailored for Claude's native, exclusive `thinking` field. Even if DeepSeek uses the Anthropic compatible endpoint, its intermediate thinking and reasoning chain may be compressed or ignored. When facing super complex, long system reasoning, occasional semantic disconnection or "intelligence degradation" may occur.
2. Failure overhead of Prompt Caching: Claude Code relies heavily on Anthropic's official `cache_control` feature to achieve lightning-fast Time to First Token (TTFT) when the codebase is fully resident during ultra-long sessions. After switching to DeepSeek's compatible interface, if the endpoint's cache management is not seamless enough, you might find that the waiting time after pressing Enter in long conversations begins to gradually stretch out.
3. The Escape Hatch back to Native: If, during a large-scale, high-pressure refactoring, you find that the DeepSeek model falls into a repeated infinite loop due to closed-source common sense of some niche frameworks, don't panic. Simply cleanly execute: `unset ANTHROPIC_BASE_URL` in the terminal to clear these hijacked variables, and Claude Code will instantly revert to its true self, reconnecting back to Anthropic's official high-speed servers.

Although DeepSeek's capabilities are not as good as native Claude models, it is cheap! This is the backup AI programming tool the author uses at home. When Google Antigravity exceeds its package limits, Claude Code + DeepSeek is immediately used as a substitute.

