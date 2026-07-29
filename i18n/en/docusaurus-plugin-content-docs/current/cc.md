# Claude Code and Google Antigravity

> "Be formless, shapeless, like water." — Bruce Lee

In the previous chapter, we conducted a systematic review of the six major archetypes of AI programming tools. If that was a top-down survey of the current software weaponry spectrum, this chapter zeroes in on the two apex predators representing the most extreme, opposing philosophical evolutions within that spectrum. We will subject them to a comprehensive dissection and head-to-head comparison.

They are:

* **Claude Code**: A solitary, surgical blade of an agent. It operates under the belief that "the terminal is everything," pushing the Unix pipeline philosophy to its absolute limit. During the writing of this book, Claude Code was arguably the most potent AI programming tool on the market, bar none, serving as the author's primary daily driver for professional workloads.
* **Google Antigravity**: A sprawling, cross-generational agent mothership. It embraces the philosophy of "multi-agent collaboration with maximal visual affordances." Because the author holds a Google Pro subscription, Antigravity currently serves as the most cost-effective option, making it the author's primary AI driver for personal projects.

These two platforms represent the highest technological crystallization of Anthropic and Google in the domain of software engineering. More importantly, they unveil two radically different evolutionary paradigms for the future of human-machine pair programming. This chapter will plunge you deep into their core architectures. Finally, we will provide a practical, hacker-style guide on how to hijack Claude Code's world-class automated Harness and forcefully power it with the ultra-low-cost DeepSeek model.

## Claude Code

### Product Positioning

Claude Code is a terminal-native AI programming agent (CLI Agent) officially developed by Anthropic. It aggressively rejects any compromise with traditional GUI editors: it isn't a bloated, standalone IDE, nor is it an intrusive sidebar plugin. It is simply a digital hacker avatar lying dormant in your command line, waiting to be invoked.

Its core design philosophy is ruthlessly pure: *"Meet developers where they already live, using the tools they already love."* It plugs directly into the highest execution privileges of your local system environment. Just like a human engineer, it integrates seamlessly with your underlying bash scripts, Git workflows, and CI/CD pipelines.

### Core Engineering Capabilities

| Core Capability | Practical Operational Performance |
| --- | --- |
| **Fully Automated Build Execution** | Throw it a natural language objective; it will autonomously plan the architecture, write the code, troubleshoot local syntax errors, and iterate until the build passes. |
| **Self-Healing Debugging** | Paste a terminal stack trace or assign a specific bug. It will traverse the codebase, locate the root cause, and implement a surgical fix on the spot. |
| **Omniscient Codebase Navigation** | Maintains precise awareness of global project dependencies and AST structures. It easily answers macro questions like, *"Where is this deprecated interface implicitly called across the entire repo?"* |
| **Grunt Work Automation** | Capable of batch-fixing hundreds of Linting errors, autonomously untangling massive Git merge conflicts, and automatically distilling coherent release logs. |
| **MCP Cross-Boundary Integration** | Leveraging the Model Context Protocol (MCP), it can break out of its local sandbox to read Google Drive docs, ingest Figma blueprints, or push task updates directly to Slack and Jira. |

### The Interaction Paradigm

By shedding the constraints of graphical interfaces, Claude Code unlocks highly fluid interaction models natively within the terminal:

#### Interactive Terminal Sandbox

:::tip Prerequisite: Node.js
Claude Code is built on Node.js, meaning a local Node environment is required to execute it. If you aren't familiar with Node.js, please read the [Node.js](nodejs) chapter first before continuing.
:::

```bash
# Official recommended (preferred)
curl -fsSL https://claude.ai/install.sh | bash

# Or via npm (alternative, requires Node.js 18+)
npm install -g @anthropic-ai/claude-code

# Awaken the agent directly inside your project root
cd my-backend-project
claude
```

Executing this drops you into a proprietary, persistent dialogue sandbox where you can issue radical system refactoring commands directly to the agent.

#### Non-Interactive Script Execution

```bash
claude -p "Perform a deep-dive analysis on the project's permission verification architecture and output a comprehensive Markdown security audit."
```

#### Pipe Mode (The Unix Way)

This is the feature that makes veteran UNIX hackers rejoice. Claude Code can be seamlessly chained into standard Linux pipelines to filter, distill, and react to dynamic context in real-time:

```bash
# Analyze recent log snapshot (Note: tail -f never ends and would hang -p mode; use tail -n instead)
tail -n 200 app.log | claude -p "If you detect unknown exceptions, immediately extract the stack trace and provide potential patches."

# Pipe historical crash dumps directly into the agent for fully automated Root Cause Analysis (RCA)
cat crash-error.log | claude -p "Analyze the root cause of these crashes; verify if they correlate with our Redis connection pool overflowing."
```

> **⚠️ Warning:** `claude -p` reads stdin until EOF; `tail -f` never terminates and will cause the command to hang indefinitely. For streaming monitoring, use `tail -n` truncation or sample periodically with a script.

### Under the Hood: Proprietary "Black Tech" Mechanisms

1. **`CLAUDE.md` (The Digital Onboarding Guide)**: This file acts as the absolute anchor for Claude Code's context engineering. By maintaining this markdown file in your project root, you establish your repository's quirky rules, build commands, and strict red lines. It acts as an onboarding document for a newly hired senior engineer; Claude Code ingests and adheres to these rules before taking any action.
2. **Extended Thinking (The Reasoning Chain)**: When confronting bizarre architectural deadlocks, Claude Code engages deep reasoning mode. You can watch its "internal monologue" unfold live in the terminal—dense, high-purity technical self-reflection stripped of conversational fluff.
3. **Auto-Compact (Dynamic Context Pruning)**: During marathon terminal sessions, your context window will eventually hit 95% capacity. When this happens, the tool's underlying harness instantly triggers a lightweight background model. This model compresses and summarizes the core intent of earlier dialogue and expired log data, aggressively pruning the active token footprint back down to a safe operational range.
4. **Sandbox Defense Lines**: Built on platform-native isolation mechanisms (macOS uses Seatbelt / sandbox-exec, Linux uses Namespace / cgroups, Windows uses ACL access control) with permission confirmation and fence isolation for dangerous commands, highly sensitive files, and environment variables, supporting configurable network access policies to strictly prevent the LLM from generating destructive privilege escalation attacks.

### Usage Costs

Claude Code operates on a commercial subscription model, offering tiers at $20, $100, and $200 per month. The $200 package is generally sufficient to cover the daily, intensive workloads of a professional developer. However, for extreme edge cases—like forcing the agent into massive, multi-round iterative debugging loops—even this tier can be exhausted. In short: Claude Code is spectacularly capable, but undeniably expensive.

## Google Antigravity

### Product Positioning

If Claude Code is a solitary, elite assassin thriving in hand-to-hand combat, then Google Antigravity is a hovering aircraft carrier, orchestrating legions of specialized foot soldiers in a coordinated war.

Antigravity is Google's flagship IDE for the impending era of fully automated development. While heavily modified from the open-source VS Code foundation, it completely obliterates the traditional IDE philosophy. It heralds the death of the "Human writes code; AI suggests in the sidebar" era, officially ushering in the age where "The Human acts as the Architectural Manager, dispatching Multi-Agents for massive collaborative development."

### The Core Visual Paradigm

Upon launching Antigravity, you are immediately confronted with its defining UI paradigm—a rigid, bilateral division of the engineering workflow:

```text
┌───────────────────────────────────────┬───────────────────────────────────────┐
│                                       │                                       │
│          Agent Manager                │               Editor                  │
│      (The Task Control Center)        │        (The Standard VS Code)         │
│                                       │                                       │
│  [Agent 1: Patching SQL Injection]    │  * 100% Native VS Code Ecosystem      │
│  [Agent 2: Writing User Unit Tests]   │  * Retains all keybindings & plugins  │
│  [Agent 3: Refactoring Frontend UI]   │  * Intuitively review Agent Code Diff │
│                                       │                                       │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

- **Agent Manager (Task Control Center)**: Here, you assume the role of Senior Technical Director. You issue macro-level *Missions*. The system autonomously breaks these down and incubates multiple parallel sub-agents. You can monitor the live lifecycle, logical reasoning, and current bottlenecks of every individual agent in real-time.
- **Editor (Standard Editor)**: The right pane preserves the VS Code environment you already know (your plugins, themes, and muscle memory). Operating from a managerial perspective, you primarily use inline commands (`Cmd+I`) to perform micro-adjustments or meticulously review and approve the massive code diffs submitted by your agents.

### Killer Features of the Agent Mothership

#### Massive Multi-Agent Concurrency

This is the generational leap that destroys traditional chat tools. In standard sidebar AI, you must wait sequentially for the AI to finish typing out an interface before you can issue your next instruction. 
In Antigravity, you simply click "Create New Agent" multiple times. You assign Task A to fix CSS alignment, Task B to update the backend database contracts, and Task C to write the integration tests. These agents execute concurrently in completely isolated virtual context sandboxes, compounding your productivity exponentially.

#### The "Artifacts" System & Proof of Work

Antigravity understands that a human director cannot possibly read tens of thousands of lines of an agent's raw dialogue logs. Therefore, it enforces a strict rule: as agents work, they must compile highly visual "Artifacts" to serve as succinct Proof of Work reports:

| Artifact Type | Engineering Purpose |
| --- | --- |
| **Task Lists** | Structured, checklist-style breakdowns the agent generates before starting work. |
| **Implementation Plans** | Macro architectural blueprints detailing proposed changes before execution. |
| **Walkthroughs** | Post-completion summaries distilling technical changes and test validations. |
| **Screenshots / Video** | The ultimate lifesaver for frontend devs. The agent automatically captures before-and-after UI screenshots and records headless browser sessions interacting with the DOM, empirically proving to the human manager: *"Look, the UI didn't break."* |

Crucially, you can highlight text directly inside these artifacts to leave human feedback, exactly like reviewing a Google Doc. Upon receiving feedback, the agent instantly triggers a new cycle of self-healing iterations.

#### Built-in Chrome Browser Agent

Antigravity is deeply integrated with Google's native Chrome engine. Once an agent finishes writing a frontend component, it can autonomously spin up a headless browser, physically click buttons, fill out forms, and verify logic in a live DOM environment. It isn't just an "Agent that writes code"; it is a "QA Agent that executes comprehensive E2E UI testing."

## Hijacking Claude Code: Running on the DeepSeek Engine

In our previous chapter covering future trends, we posited a highly disruptive thesis: *"The Models are the disposable foot soldiers; the Tooling Harness is the iron-clad fortress."*

To practically demonstrate this thesis, we are going to get our hands dirty. While Claude Code officially locks its ecosystem to Anthropic's proprietary models, the community has verified that requests can be routed to a compatible proxy layer via environment variables. DeepSeek officially promotes its OpenAI-compatible interface (`https://api.deepseek.com`), while Anthropic compatibility requires a third-party proxy (such as LiteLLM Proxy or a community Claude-to-OpenAI forwarding layer) or a proxy endpoint that supports Anthropic format passthrough.

This means we can use environment variable spoofing to surgically graft Claude Code—the world-class, terminal-controlling "Harness"—directly onto the immensely cost-effective DeepSeek "Brain," effectively slashing our API costs to a mere fraction of standard Western vendors. Note: this is an unofficial usage and compatibility may change with versions.

Here is the complete, production-grade configuration pipeline required to pull off this heist.

### Prerequisites

1. Ensure a local Node.js environment (v18+) is installed.
2. Log into the [DeepSeek Developer Platform](https://platform.deepseek.com/), generate a fresh `sk-` format API Key, and ensure the account is funded.

### Step 1: Global Installation of Claude Code

Execute the official installation command in your host terminal (official native script is preferred, npm is alternative):

```bash
# Official recommended (preferred)
curl -fsSL https://claude.ai/install.sh | bash

# Or via npm (alternative, requires Node.js 18+)
npm install -g @anthropic-ai/claude-code
```

### Step 2: Environment Variable Hijacking

We must leverage OS environment variables to route Claude Code's network traffic to a compatible proxy layer, specifying the model identifier at request time.

> **⚠️ Important:** `https://api.deepseek.com/anthropic` is NOT an official stable Anthropic-compatible endpoint provided by DeepSeek. You must replace it with your own LiteLLM Proxy, Claude-to-OpenAI forwarding proxy, or other community-verified compatible layer address. The official DeepSeek endpoint `https://api.deepseek.com` primarily promotes OpenAI format. The example below uses a placeholder compatible proxy address — **please replace it with a real available proxy address** and use real DeepSeek model IDs (e.g., `deepseek-chat`, `deepseek-reasoner`).

#### 🍏 macOS / Linux Users (Profile Injection)

Open your `~/.zshrc` or `~/.bashrc` and append this configuration to the bottom of the file (**replace proxy address and model with real available values**):

```bash
# =====================================================================
# CLAUDE CODE + DEEPSEEK (via compatible proxy)
# Note: ANTHROPIC_BASE_URL must point to an Anthropic-compatible proxy, not the official DeepSeek endpoint directly
# =====================================================================
# 1. Hijack base gateway routing, pointing to compatible proxy (example address, replace with real proxy)
export ANTHROPIC_BASE_URL=https://your-compatible-proxy.example.com/anthropic

# 2. Inject your DeepSeek key (forwarded by proxy layer)
export ANTHROPIC_AUTH_TOKEN="YOUR_DEEPSEEK_API_KEY_XXXXXXXX"

# 3. Model mapping (must use DeepSeek official real model IDs, [1m] suffix syntax not supported)
export ANTHROPIC_MODEL="deepseek-chat"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-chat"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-chat"

# 4. Route lightweight sub-agent tasks to cost-effective model
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-chat"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-chat"

# 5. Increase API timeout if needed
export API_TIMEOUT_MS=600000
```

Save the file and run `source ~/.zshrc` to apply the magic instantly.

#### 🪟 Windows Users (PowerShell Permanent Persistence)

If you operate in a Windows environment via Git Bash or PowerShell, execute the following script to permanently register the user-level system variables:

```powershell
# Note: Replace BASE_URL with a real Anthropic-compatible proxy address
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://your-compatible-proxy.example.com/anthropic", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "YOUR_DEEPSEEK_API_KEY_XXXXXX", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "deepseek-chat", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_OPUS_MODEL", "deepseek-chat", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_SONNET_MODEL", "deepseek-chat", "User")
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_DEFAULT_HAIKU_MODEL", "deepseek-chat", "User")
[System.Environment]::SetEnvironmentVariable("CLAUDE_CODE_SUBAGENT_MODEL", "deepseek-chat", "User")
```

After execution, spawn a completely new PowerShell window for the variables to take effect.

### Step 3: The Cold Start

Navigate into the root directory of any software project and fire the awakening command:

```bash
claude
```

Claude Code will boot up, displaying its slick ASCII animation and initializing its local sandbox filesystem watchers exactly as normal. However, from this moment forward, the raw computing power processing every complex system refactor command you issue is powered entirely by the ultra-efficient DeepSeek architecture!

## Reflections on the Red Lines, Pain Points, and Costs of Core Swapping

While this hacker-style "bait-and-switch" elegantly slashes your API token bill by upwards of 90% (a 10x to 30x cost reduction), you must soberly acknowledge the friction introduced by cross-vendor spoofing. In high-stakes engineering, watch out for these specific landmines:

1. **Loss of Native Extended Thinking**: Claude Code is intricately tuned to parse the exact formatting of Claude's native `<thinking>` blocks. Even using the compatible endpoint, DeepSeek's internal reasoning chains may be truncated or improperly parsed by the harness. During exceptionally complex, multi-stage architectural reasoning, you may notice occasional semantic drift or "intelligence degradation."
2. **Prompt Caching Overhead**: Claude Code heavily exploits Anthropic's native `cache_control` headers to achieve lightning-fast Time to First Token (TTFT) during massive, codebase-wide sessions. When spoofing the DeepSeek endpoint, if the relay's cache management isn't perfectly seamless, the latency after you press 'Enter' will stretch noticeably as the session history bloats.
3. **The Escape Hatch**: If, during a massive, high-pressure system refactor, you realize the DeepSeek model has fallen into an irrecoverable logic loop regarding a niche framework, don't panic.
   * macOS/Linux (temporary): `unset ANTHROPIC_BASE_URL` — this only affects the current shell; you must also remove the persistent `export` lines from `~/.zshrc` / `~/.bashrc`.
   * macOS/Linux (permanent): Delete the `export` lines added above from `~/.zshrc` / `~/.bashrc` and run `source ~/.zshrc`.
   * Windows: Execute `[System.Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", $null, "User")` to delete the user-level variable, and remove the other related variables from the System Environment Variables settings panel, then restart your terminal. Claude Code will instantly revert to its true form, seamlessly reconnecting to Anthropic's premium, high-speed servers.

DeepSeek's raw intelligence might occasionally trail Anthropic's flagship models, but it is undeniably, spectacularly cheap. This is the exact configuration the author utilizes at home. Whenever the Google Antigravity Pro tier limits are exhausted, this Claude Code + DeepSeek chimera is immediately deployed as the ultimate, cost-effective substitute.
