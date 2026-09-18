# Cross-AI Teams (Subagents)

> "Talent wins games, but teamwork and intelligence win championships." — Michael Jordan

As a repository scales from a localized script into a distributed enterprise architecture, developers executing AI Pair Programming crash into a lethal physics barrier: **The Context Exhaustion Trap**. 

Consider a scenario where you command the AI to execute a complex, cross-domain refactor spanning 5 microservices and 20 files. Even if you issue a perfectly constrained Prompt, the AI Agent must execute massive exploratory operations to parse the dependency graph. It will execute dozens of `Grep` and `Read` calls across thousands of lines of code.

The consequence is mathematically unavoidable: the active context window becomes violently polluted with thousands of tokens of temporary "read-only" noise. Within minutes, the core LLM succumbs to "Lost-in-the-Middle" syndrome. Its instruction-following fidelity craters, its logic execution spirals into hallucination, and your Token burn-rate explodes.

To annihilate the cognitive limitations of a "Single-Node Agent," frontier AI programming IDEs have engineered a devastating paradigm shift at the underlying orchestration layer: **The Autonomous Subagent Architecture**. 

This system dynamically shatters massive, monolithic tasks into highly cohesive, isolated sub-routines executed by temporary, specialized AI instances. This chapter deconstructs the architecture of Subagent Swarms and how to deploy them to execute industrial-scale automation.

## What is a Subagent?

In modern Agentic topology, a Subagent is a completely isolated, ephemeral AI instance dynamically instantiated by the Primary Agent during runtime to execute a hyper-specific, closed-loop task.

The structural architecture of this swarm is analogous to a military command hierarchy:

```mermaid
graph TD
    A[Human Principal Architect] -->|Injects Macro Objective| B(Primary Orchestrator Agent)
    B -->|Asynchronous Dispatch: Recon| C(Explore Subagent / The Scout)
    B -->|Asynchronous Dispatch: Audit| D(Reviewer Subagent / The Auditor)
    B -->|Asynchronous Dispatch: Mutation| E(Refactor Subagent / The Executor)
    
    C -->|Executes Read-Only Grep -> Returns Semantic Summary| B
    D -->|Executes Static AST Audit -> Returns Vulnerability Payload| B
    E -->|Executes Isolated Mutation -> Returns verified Git Diff| B
    
    B -->|Synthesizes execution payloads -> Streams final state| A
```

The Primary Agent (The Orchestrator) acts as the centralized command node. It interfaces with the human, processes the Global `PRODUCT.md` specification, and synthesizes the Implementation Matrix. Crucially, when it identifies a tedious, bounded task (e.g., *"Map the internal API routes across these 15 configuration payloads"*), it **does not** pollute its own context window. It dispatches a Subagent to execute the physical traversal in an isolated sandbox.

When a Subagent is instantiated, it is fortified by four rigid constraints:

1. **The Isolated Context Sandbox:** Even if the Subagent parses 50,000 lines of spaghetti code, the resulting Token bloat is permanently trapped inside its ephemeral context window. The Primary Agent's context remains utterly pristine.
2. **The Specialized Injection Prompt:** The Orchestrator forces a custom cognitive persona onto the Subagent (e.g., *"You are a ruthless Application Security Auditor. Find SQL Injections."*).
3. **Restricted I/O Boundaries:** You (or the Orchestrator) physically castrate the Subagent's terminal privileges. You can enforce a strict `ReadOnly` execution mode, stripping its ability to mutate the filesystem or execute Bash binaries.
4. **Economic Model Routing:** The Orchestrator can map different sub-tasks to different intelligence tiers. It leverages lightweight, hyper-fast models for basic Regex searches, and heavy reasoning models for complex architectural audits.

## The Engineering Necessity of Subagents

Scaling from a linear conversational model to an asynchronous Agent Swarm fundamentally shatters the three primary barriers to industrial AI adoption:

### 1. Defending the "Purity of Context"
This is the supreme technical imperative of the Subagent architecture. An LLM's attention mechanism degrades linearly as context volume expands. The Subagent operates as a cryptographic firewall. It parses 20 monolithic source files, executes high-density logic mapping in isolation, and returns only a compressed, 300-word topological summary to the Orchestrator. The Primary Agent maintains maximum cognitive fidelity for the duration of the sprint.

### 2. Multi-Threaded Parallel Execution
Standard LLM interfaces enforce a rigid, synchronous "Request/Response" deadlock. Real-world engineering requires massive concurrency. If you need to verify whether a newly injected Node module collides with internal namespaces across 5 separate frontend apps, the Orchestrator will instantly dispatch 5 parallel Subagents to scan the 5 directory trees concurrently, slashing the execution Time-to-Resolution (TTR) by 80%.

### 3. Precision Token Arbitrage (Cost Engineering)
Multi-Agent topologies allow teams to execute ruthless Model Routing to optimize cost efficiency:

```text
Main agent (Opus) ➔ orchestration, high-level decisions, complex plan arrangement (high cost, low frequency)
 ├── Explore subagent (Haiku) ➔ read-only grep search across the repo (floor price, high-frequency use)
 └── Code-reviewer subagent (Sonnet) ➔ medium-difficulty static audits (balanced cost/performance)
```
By mapping the cognitive payload to the appropriate model tier, engineering teams effortlessly slash their AI infrastructural burn-rate by over 70%.

## The Built-In Native Swarm

Modern IDE backends (like Claude Code or Antigravity) ship with a natively embedded Subagent mesh. 
You are not required to architect complex Python orchestration layers; the IDE's core execution loop autonomously invokes these Subagents when it detects the appropriate telemetry triggers:

| Built-in subagent name | Default model | Permissions | Auto-trigger scenario |
|  |  |  |  |
| Explore | Haiku | Strictly read-only (only Grep, Glob, Read) | Fast whole-repo semantic search, e.g. "find where the old Docusaurus API is still called". |
| Plan | Inherits the main model | Strictly read-only (syntax-tree AST and architecture/dependency analysis) | When you follow the SPET method and guide the tool into "Plan Mode" to draw the technical blueprint. |
| General-purpose | Sonnet | Full read/write (may Write files and run Bash terminal tests) | Broad cross-file rewrites with self-healing debugging. |
| Claude Code Guide | Lightweight specialized model | Zero local permissions (only official docs knowledge) | When you ask the tool itself in the terminal about its own config, e.g. how to connect the MCP protocol. |

> **Note:** Claude Code's model tiers are Haiku / Sonnet / Opus; Flash is a Gemini-series model name. Other tools (e.g. Cursor / Antigravity) may use Flash-class models; this chapter follows the Claude naming.

When operating a terminal-based AI environment, if you observe the `[Dispatching Subagent...]` output streaming in the console, **do not abort.** This is the system autonomously isolating the context payload to protect your core execution thread.

## Engineering Custom Subagents

As your repository matures, generic native agents will fail to adhere to your bespoke "Enterprise Architectural Red Lines." This is when you must transition to engineering declarative, custom Subagent configurations.

### Approach 1: CLI Initialization

In supported terminal environments, execute the bootstrap command:
```bash
/agents
```
This triggers an interactive wizard, allowing you to define the Agent's nomenclature, target model tier, and strict tool I/O permissions.

### Approach 2: Declarative Markdown Infrastructure (Production Grade)

For persistent, enterprise environments, execute infrastructure-as-code (IaC). Provision an `.agents/` or `.claude/agents/` directory in the repository root. Every `.md` file mapped in this directory is instantly compiled into a highly specialized, dispatchable Agent node.

#### 📐 Template 1: The Autonomous Security Auditor (`code-reviewer.md`)

```markdown
---
name: code-reviewer
description: Autonomously audits Git Diffs for structural security vulnerabilities, performance red lines, and architectural protocol violations.
tools: Read, Glob, Grep  # 🔴 LETHAL CONSTRAINT: Strict Read-Only. Bash and Write access are permanently revoked to prevent unauthorized mutations.
model: sonnet            # Optimal model for logic density vs speed.
---

# You are the cold code reviewer and security architect for this open-source project team.

## Your top duties:
1. Statically review the changed code or text handed over by the main agent.
2. Strictly check the code for N+1 database queries, SQL injection, and XSS vulnerabilities.
3. Strictly check the text against the core settings in `knowledge/world.md` for logic breaks.

## Your limits:
- You are a strictly read-only agent. You must not, and cannot, call any tool to modify local files directly.
- Keep your output concise, ordered strictly by severity: [Critical] > [Warning] > [Info].
```

#### 📐 Template 2: The Autonomous Unit-Test Engine (`test-writer.md`)

```markdown
---
name: test-writer
description: Autonomously synthesizes and executes Vitest coverage suites for existing TypeScript business controllers.
tools: Read, Write, Bash # 🟢 Execution access granted: Required for iterative physical execution of `vitest run`.
model: sonnet
---

# You are a dedicated engineer for writing high-quality unit tests.

## Your workflow:
1. Read the specified business source file.
2. Create a `*.test.ts` file in the same directory.
3. Automatically run `npx vitest run` in the terminal.
4. If it errors, reflect and fix it yourself until the tests exit with code 0; only then report back to the project manager.
```

With this infrastructure committed to version control, you can unleash massive collaborative power in a single prompt:

> *"Orchestrator, I have completed the JWT Authentication module. Instantly dispatch `code-reviewer` to execute a lethal security audit. Upon success confirmation, dispatch `test-writer` to autonomously scaffold and verify 100% path coverage for the module."*

## The Command Vectors of Multi-Agent Orchestration

To extract maximum velocity from a swarm architecture, the Human Architect must deploy advanced command heuristics:

### 1. Force-Trigger Concurrent Execution

The base Orchestrator will often default to a lazy, linear execution path to save tokens. If you require massive parallelization, you must inject a "Concurrent Force-Directive" in your payload:

* ❌ **Toxic Directive:** *"Analyze the architecture of the monorepo."* (Triggers a slow, sequential crawl).
* 🟢 **Elite Directive:** *"Dispatch 3 parallel Subagents simultaneously to execute a deep AST retrieval of `apps/frontend/`, `apps/backend/`, and `packages/database/`. Aggregate their telemetry and output a singular topological map under 500 words."*

### 2. The Law of the "Flat Hierarchy"

Given the constraints of modern LLM context frameworks, **Subagents absolutely cannot be nested recursively.** 
The Primary Orchestrator can spawn an infinite horizontal array of Subagents, but a Subagent is incapable of spawning a "Grandchild Agent." 

The topological hierarchy is permanently locked into a flat `Orchestrator ➔ Node` structure. Therefore, when engineering a custom `SKILL.md` or Agent configuration, you must ensure the task boundaries are completely terminal. Do not instruct a Subagent to outsource work; it will physically crash the execution loop.
