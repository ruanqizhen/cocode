# Loop Engineering

> "Running water does not go stale, and a door hinge is not worm-eaten." — "Lüshi Chunqiu"

In the field of AI-assisted programming, paradigm shifts in technology often come faster than imagined. In 2023, we were discussing how to write perfect prompt words (Prompt Engineering); in 2024, the focus shifted to providing precise context for models (Context Engineering); by 2025, Harness Engineering (building a reliable working environment for Agents) started to boom.

Recently, an even more disruptive concept has sparked widespread discussion in Silicon Valley and developer communities: Loop Engineering.

As Boris Cherny, head of Anthropic's Claude Code, put it: "I no longer manually write prompts for Claude. I run a bunch of Loops to prompt it, letting it decide for itself what to do next. My job has become writing Loops." Peter Steinberger, founder of OpenClaw, also confirmed this: "You shouldn't be writing prompts for Coding Agents yourself anymore. You should design circular systems that prompt the Agent for you."

Subsequently, Google software engineer Addy Osmani systematized this practical methodology. This chapter will deeply deconstruct the core concepts, underlying architecture, and how to implement Loop Engineering in real businesses using minimalist code.

## The Dimensional Upgrade from Harness to Loop

In the traditional "Prompt Era," human-machine collaboration was usually open-loop: you input a Prompt, the AI spits out code, and the conversation ends. If an error occurs, you need to manually copy the error message and ask again. This "human-machine ping-pong" model has enormous friction, and humans became the bottleneck of system efficiency.

Entering the Agent era, why are we starting to abandon fixed workflow frameworks like LangGraph and turn to seemingly simple Loops? This is not a philosophical question; it's an engineering question.

### 1. Decentralization of Intelligence Gravity: The Models Changed

In early 2024, using GPT-4 (128K context) as an Agent, the accuracy of tool calling was only about 60%. If you didn't hardcode the process, the Agent would get lost. Therefore, Workflow frameworks at the time were essentially "drawing flowcharts with code"—humans were responsible for planning, and models were responsible for mechanical execution.

But by Claude 3.7 in 2025, things changed. If given the same task:

* Method A (LangGraph Pre-defined): "Write code → Run tests → Fallback on failure" is hardcoded in the flow. The model doesn't know why it came back; it just mechanically retries.
* Method B (While Loop + Detailed Prompt): Tell the model the goal, throw it into a loop. The model "sees" the error in the loop itself and decides how to fix it itself.
The result is that Method B is faster, and the code quality is higher. The center of gravity for intelligence has shifted from the "framework design layer" to the "model reasoning layer."

### 2. The Ralph Loop: The Violent Aesthetics of One Line of Bash

In 2025, developer Geoffrey Huntley developed a complete programming language project using just one line of Bash script, spending $297 on API fees:

```bash
while :; do cat PROMPT.md | claude; done
```

This seemingly outrageously crude "Ralph Loop" is actually extremely ingenious:

- The context is cleared every loop, avoiding the "conversation is too long so the model talks nonsense" issue.
- Progress and error messages are stored in the physical file system, which the model reads directly in the next loop.
This proves: as long as an agent is given a goal and a chance to correct errors, minimalist engineering methods can maximize the AI's autonomous capabilities.

### 3. Niche Comparison between Harness and Loop

Harness (Base Engineering) solves "getting it right once," while Loop solves "getting it right continuously."

| Dimension | Harness | Loop |
| --- | --- | --- |
| Core Goal | Getting it right once (standardizing actions) | Getting it right continuously (achieving goals) |
| Trigger Method | Manual start | Triggered automatically by time or events |
| Execution Cycle | Single Session | Continuous execution, Cross-session |
| State Management | Exists in Context | Physically solidified on disks, files, or boards |
| Human Role | Operator, command issuer | Designer, rule maker |

## Core Architecture

To design a robust Loop that won't infinitely drain Tokens, the following architectural modules need to be cleverly combined:

1. Automations (Scheduling): The heartbeat of the loop. Set the startup rhythm via `/loop` commands, Cron scheduled tasks, Webhooks, etc. For example, a productized command in Claude Code: `/loop 5m babysit all my PRs` (Check PRs every 5 minutes and automatically fix).
2. Worktrees: Solve multi-Agent parallel conflicts. Let Agents execute in isolated Git branch directories, sharing history but not interfering with each other.
3. Skills: Solidify domain knowledge and boundary guardrails.
4. Connectors / MCP: Tentacles connecting to the outside world, accessing Issue boards, APIs, or Slack.
5. Sub-agents: Achieve role separation. Have one Agent responsible for writing code (Maker) and another independent Agent responsible for finding faults (Checker), forming a quality control mechanism.
6. Support—Memory (State Layer): The "spine" of the Loop. A persistent layer outside of a single session (like a Markdown changelog) to record "what is done, what is left," preventing the loop from getting lost across sessions.

## Replicating the "Knowledge Compilation Loop" with Claude Code

For visual demonstration, we take Claude Code as an example to show how to turn the maintenance of a personal knowledge base into an automatically running Loop: from collecting information to generating a daily insight briefing every morning.

### 1. Preparation and Directory Division

Initialize the environment in a local terminal or VS Code:

```bash
mkdir -p inbox raw wiki scripts worktree log
touch wiki/_changelog.md raw/_registry.md log/loop-run.log CLAUDE.md
```

* `inbox`: Raw material inbox; `raw`: Filtered content waiting for compilation; `wiki`: Final knowledge base.

### 2. Configure Core Skill Files (Rule Separation)

Global constraints (`CLAUDE.md`):
Define the project as divided into three main phases: triage, compile, and briefing, and divide the roles of Maker and Verifier.

Three specialized skill files:

* `@triage.md`: Read `inbox/`, filter out ads, archive valid materials to `raw/` and register them in `_registry.md`. Empty processed files.
* `@compile.md`: Read `raw/`, write Wiki entries into `wiki/`, and record updates in `_changelog.md`. Empty `raw/`.
* `@briefing.md`: Read logs to generate the day's briefing to `log/daily-brief.md`, and check for broken links in the Wiki.

### 3. Configure Dual-Agent Verification (Role Separation)

Utilizing Claude Code's multi-session capability, write `scripts/compile-loop.sh` to eliminate "self-audit and self-correction":

```bash
#!/bin/bash
# 1. Maker executes content compilation
claude "@compile.md" --worktree=worktree/maker

# 2. Independent Verifier executes strong validation
claude "Verify Wiki entry correlations and content completeness according to CLAUDE.md, and output a list of issues" --worktree=worktree/verifier
```

### 4. Build Automated Scheduling (Automation)

Configure Crontab on Linux/Mac to automatically trigger the entire process at 6:03 every morning:

```bash
# Terminal manual test command:
claude "/loop run triage then compile then briefing --worktree=worktree"

# Crontab automatic scheduling:
3 6 * * * cd /absolute/path/knowledge-base && claude "/loop run triage then compile then briefing --worktree=worktree" >> log/cron-run.log 2>&1
```

In actual operation, this system automatically filtered 200+ articles and accumulated 50+ core concepts in 2 months. And he only needed to spend 3 minutes a day reviewing the Briefing report.

## Safety Checkpoints and Iron Laws of Design

Handing over control to AI is extremely dangerous; we must embed defense lines and circuit breaker mechanisms in the loop.

### 1. Self-Healing Closed Loop and the Exit Code 0 Golden Rule

When an error occurs, an excellent base should extract the core error scene through regular expressions or AST and hand it back to the model.
The self-healing loop must follow Exit Code 0: only when type checks, Lints, or test scripts return `0` is it allowed to close and execute a Git Commit. Otherwise, handing in the work is strictly prohibited.

### 2. The Three Gates of Human-in-the-Loop (HITL)

* P (Planning) Phase: Review whether the steps generated by the Agent take on too much or introduce redundant dependencies.
* E (Execution) Phase: Review `Git Diff` to prevent AI from overstepping its bounds to modify unrelated files or imagining security vulnerabilities.
* T (Testing) Phase: Review the coverage rate of test cases to prevent AI from arbitrarily tampering with or deleting test cases just to "pass the exam."

### 3. Three Practical Principles for Designing Loops

1. Start small and iterate gradually: First get the minimalist logic of Cron + Skill + Markdown memory layer running, then introduce external data sources and complex dual Agents.
2. Maker ≠ Checker: If you let the Agent review itself, to take shortcuts, it usually determines "no modifications needed" (test update rate only 5%). After introducing an independent Checker, the update conversion rate jumps to 30%.
3. Let silence be the enemy: If it gets stuck in the background with errors 3 times, a Webhook alert must be triggered, and it must be explicitly output through logs (like `_changelog.md`).

## Can Loops Replace Skills?

Those rigid Skills that "encapsulate fixed processes" are indeed losing value. Because real business processes are too complex, fixed sequences cannot cover them. But Skills as guardrails and background knowledge are evolving—"Don't delete the production database," "Points to note for financial calculation logic." They have gone from operating guides to reference manuals.

4 personal suggestions for ordinary developers:

1. Stop treating LangGraph as a necessity: Unless your scenario requires strict compliance and manual intervention approval, a `while` loop + detailed Prompt can get it done.
2. Writing good Prompts is better than orchestrating code: A 5000-word detailed operation manual including constraints and error handling performs far better than 5000 lines of graph orchestration code, and maintenance costs are extremely low.
3. Forcibly lock in a version safety net: Before starting a complex Loop, leave a clean Git Commit. If the AI messes around, use `git reset --hard HEAD` directly to sever the collapsing loop. Never let the AI blindly apply a second or third version of error patches; this will only pollute the context.
4. Use the latest and strongest models: Deducing architectural designs backward using the retarded capabilities of old models is like writing programs with a DOS mindset in 2026.

Automation is: "You tell me how to do each step, and I'll do it."
Intelligence is: "I understand the goal, then I'll figure out how to achieve it myself."

Skills are the product of automation, while Loops are the starting point towards engineering intelligence. The senior engineers of the future will no longer be producers of lines of code, but the top-level designers of entire closed-loop feedback systems.