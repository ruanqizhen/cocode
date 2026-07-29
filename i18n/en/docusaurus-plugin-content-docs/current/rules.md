# The Architectural Constitution

> "Learn the rules like a pro, so you can break them like an artist." — Pablo Picasso

When executing pair-programming loops with Large Language Models (LLMs), developers crash into a brutal physical limitation: **LLMs are fundamentally stateless.** The model possesses zero innate memory of your project. It cannot organically "absorb" your engineering conventions over time like a human engineer.

Therefore, the architectural challenge is never *"Will the AI remember my rules?"* The challenge is: **How do we engineer an infrastructure that forcibly injects our rules into the Context Window of every single session?**

## The Dual-Track Memory Architecture

When you boot up an AI Agent in a legacy repository, you instantly collide with the "Amnesia Problem." Because the model starts with a tabula rasa (blank slate), it will hallucinate architectural decisions. If you command it to *"Fetch user data,"* it might randomly `npm install axios`, completely ignoring the fact that your team strictly mandated the native `fetch` API. This results in toxic code commits and endless refactoring cycles.

To annihilate this friction, enterprise AI tooling (such as Claude Code or Google Antigravity) implements a **Dual-Track Memory System** to persist state across volatile sessions:

1. **The Active Constitution (e.g., `CLAUDE.md` / `AGENTS.md`):** A hard-coded rulebook authored by the Human Architect.
2. **The Autonomous Memory (Auto-Memory):** An invisible telemetry system that the Agent writes to itself based on execution feedback.

The delta in velocity after configuring a robust Constitution is staggering. Without it, you spend 50% of your prompt bandwidth micro-managing the AI. With it, the AI organically conforms to your tech stack, your directory topologies, and your variable naming conventions from the very first token. 

The value of an AI Agent is not measured by *"How smart was this single conversation?"* It is measured by the **Long-Term Collaboration Baseline:** How few repetitive instructions you are forced to type over a 6-month sprint.

### Deconstructing the Dual-Track System

| Architectural Vector | Active Constitution (`CLAUDE.md` / `AGENTS.md`) | Autonomous Memory (`Auto-Memory`) |
| ---- | ------------ | -------------- |
| **Authoring Entity** | The Human Principal Engineer | The AI Agent (Autonomously generated) |
| **Data Topology** | Explicit, rigid constraints and Red Lines | Execution telemetry, historical failures, IDE preferences |
| **Execution Scope** | Repository / Global User level | Local Sandbox level |
| **Payload Type** | Tech Stack, Linter rules, Definition of Done (DoD) | Bash commands, Bug post-mortems, Terminal environment quirks |

## The Cascading Scope Matrix

Constitutional files do not exist in a vacuum. They are architected as a Cascading Hierarchy. The system resolves rule conflicts by enforcing a strict law of physics: **Proximity dictates Priority.** The closer a rule is to the execution context, the higher its overriding authority.

### 1. The Global User Stratum
*(Path: `~/.claude/CLAUDE.md` — global user memory)*
- Applies to every repository on your physical machine.
- Defines absolute developer preferences (e.g., *"Always utilize `pnpm` instead of `npm`. Never speak in passive voice."*)

### 2. The Repository Core Stratum (The Constitution)
*(Path: `./CLAUDE.md` or `./.agents/AGENTS.md`)*
- Commited to the Git repository. Shared across the entire engineering team.
- Defines the macro tech stack, the directory architecture, and the PR review standards.

### 3. The Sub-Domain Stratum
*(Path: `src/microservices/auth/CLAUDE.md`)*
- Activates exclusively when the Agent touches files within this specific directory tree.
- Executes extreme isolation (e.g., *"This microservice strictly uses Rust and gRPC; ignore the global TypeScript rules."*)

### 4. The Local Sandbox Stratum
*(Path: `CLAUDE.local.md`)*
- Explicitly blocked from Git via `.gitignore`.
- Houses ephemeral developer states or local `.env` mock parameters that should never leak to the remote trunk.

### 5. The Enterprise Policy Stratum
- Centrally injected by the organization's MDM (Mobile Device Management) or IDE Policy Server.
- Possesses absolute overriding authority. Cannot be bypassed by local user configs.

### The Override Algorithm
When a collision occurs, the engine executes a specificity check. If the Global User config mandates `yarn`, but the Repository config mandates `pnpm`, the Agent obeys the Repository config.

## Autonomous Scaffolding via `/init`

You are not required to architect the Constitution from scratch. Modern CLI tools feature a bootstrap command:

```bash
/init
```

The Agent executes an AST (Abstract Syntax Tree) scan of your repository, parses your `package.json`, maps your build pipelines, and autonomously synthesizes a baseline rule file.

### Advanced Prompt Engineering for Rule Expansion

You can command the Agent to iteratively refine its own Constitution:

```text
Analyze the current `CLAUDE.md`. Execute the following mutations:
1. Deduce and inject any implicit architectural patterns you observe in `src/`.
2. Extract the Root Cause of our last 3 compilation failures and inject them as "Lethal Anti-Patterns."
3. Define strict deployment Red Lines.
```

## The Five Golden Laws of Constitutional Engineering

### Law 1: Absolute Determinism
❌ *"Write elegant, clean code."* (Subjective, useless).
✅ *"Enforce 2-space indentation. All interfaces must use `PascalCase`. Do NOT use default exports."* (Deterministic, mathematically verifiable).

### Law 2: Aggressive Compression
The Constitution is injected into the LLM's Context Window upon *every single prompt*. If it is bloated, it dilutes the AI's attention and violently inflates your token costs. Keep it brutally concise.

### Law 3: Structural Topology
Exploit Markdown headers (`##`), bullet points, and code blocks to mathematically group rules. LLMs parse structured data exponentially better than prose.

### Law 4: Ruthless Pruning
An outdated rule is infinitely more dangerous than having no rule at all. It will force the AI to hallucinate legacy APIs. Delete deprecated rules immediately.

### Law 5: The Priority Hierarchy
LLMs heavily prioritize data at the very top and very bottom of a context window. Place your "Lethal Constraints" at the absolute top of the file.

### The "Invisible Comment" Clarification
If you need to leave instructions for other human maintainers without affecting AI behavior, note that HTML comments **are still visible to the LLM** — they do enter the context window. They are not automatically stripped by the parser. To hide content from the AI, put it in a separate file that is not loaded into context (e.g., `docs/internal-notes.md` excluded via `.claudeignore`), or rely on file-level ignore rules. Use HTML comments only for human annotations that are harmless if seen by the AI:

```html
<!-- Human Notice: This repo is transitioning to Svelte. Prefer Svelte patterns for new components. -->
```

## Progressive Disclosure & File Sharding

When a repository scales, a monolithic `AGENTS.md` becomes a bottleneck. You must shard the ruleset.

### The `@import` Directive
```md
@docs/architecture/git-workflow.md
```
*Function:* Dynamically injects the contents of the target file into the context window only when required.

### Path-Based Activation
Official Cursor rules use frontmatter to control activation scope. Instead of a fictional `paths:` field, use the supported `globs:` key in `.cursor/rules/` or `.claude/rules/*.md`:

```markdown
---
description: API route validation rules
globs: ["src/api/**/*.ts"]
---
- All REST APIs MUST wrap outputs in `ApiResponse<T>`.
```

### The `AGENTS.md` Universal Entrypoint
As the AI ecosystem fragments (Cursor, Claude, Copilot), `AGENTS.md` is emerging as the universal standard API.

```md
@AGENTS.md
```

## A Production-Grade Constitution Template

Copy this schema to bootstrap an enterprise-grade AI workflow:

```markdown
# 🏛️ Architecture Constitution

## 1. Execution Telemetry
Install: `pnpm install`
Test: `pnpm run test:ci`
Verify: `pnpm run typecheck`

## 2. Directory Topology
`src/features/` -> Isolated domain logic. No cross-imports allowed.
`src/models/` -> Database schemas and ORM bindings ONLY.
`docs/` -> Markdown architecture files.

## 3. Lethal Constraints (Rules)
- Database mutations MUST ONLY occur within the `src/repositories/` layer.
- All REST APIs MUST wrap outputs in the standard `ApiResponse<T>` generic interface.

## 4. Anti-Patterns (NEVER DO THIS)
- LETHAL: You are strictly forbidden from modifying historical Prisma migrations in `prisma/migrations/`.
- LETHAL: Generating any React component exceeding 300 lines of code is forbidden. Decompose it immediately.

## 5. Architectural References
@docs/api-contracts.md
```

## The Autonomous Memory Engine (Auto-Memory)

Frontier tools (like Claude Code) feature an invisible telemetry engine that records interaction state.

### The Physical Storage Layer
Claude Code stores per-project session state locally (not in your repo). An example layout:

```text
~/.claude/projects/<encoded-project-path>/
├── memory/          # compacted session context (auto-managed)
└── <session-id>.jsonl   # raw conversation history

./CLAUDE.local.md    # optional local overrides, gitignored
```

### Architectural Properties
- **Localized State:** Stored entirely on your physical disk under `~/.claude/`.
- **Git Ignored:** Local override file `CLAUDE.local.md` and `~/.claude/` are never committed.
- **Self-Healing:** The Agent may summarize learnings into `CLAUDE.md` or `CLAUDE.local.md` when you run `/memory`, but it does not create `MEMORY.md` / `build-commands.md` / `debugging.md` files — those filenames are fictional.

## Cross-Platform Constitutional Standards

Different AI platforms parse different filenames. If you operate in a multi-IDE team, be aware of the schema:

| Execution Engine | Constitutional Filename |
| ----------- | ---------------------------- |
| **Claude Code CLI** | `CLAUDE.md` |
| **Cursor IDE** | `.cursorrules` / `.cursor/rules/` |
| **GitHub Copilot** | `copilot-instructions.md` |
| **Google Antigravity** | `AGENTS.md` |
| **Google Gemini** | `GEMINI.md` |
| **Aider** | `CONVENTIONS.md` |

### The Symlink Exploit
To prevent maintaining 6 different rule files, utilize `AGENTS.md` as your Single Source of Truth, and generate Symlinks for the other IDEs:

```bash
ln -s AGENTS.md .cursorrules
ln -s AGENTS.md CLAUDE.md
```

## The Definition of Done (DoD) & The Circuit Breaker

### The DoD (Definition of Done)
You must establish a mathematical barrier that prevents the AI from delivering broken code. Inject this into your Constitution:

```text
[DEFINITION OF DONE]
The payload is ONLY considered complete when `pnpm run build && pnpm run test` executes with Exit Code 0. 
If it throws an error, you are FORBIDDEN from delivering the code. You must self-heal.
```

### The Circuit Breaker Protocol
AI Agents can get trapped in "Death Spirals"—failing a test, writing a bad patch, and failing again infinitely. Enforce a Circuit Breaker constraint:

```text
[CIRCUIT BREAKER]
If you encounter 3 consecutive `Exit Code 1` execution failures:
1. HALT all code mutation immediately.
2. Output a structured post-mortem of the failure vector.
3. Formulate 2 technical hypotheses.
4. Request manual human intervention.
```

## The CI/CD Git Hooks Perimeter

Do not rely solely on the AI to obey rules. Enforce the rules at the kernel level using Git Hooks (e.g., Husky):

```bash
# .husky/pre-commit
pnpm typecheck || exit 1
pnpm run lint || exit 1
```
This physical perimeter guarantees that even if the AI hallucinates and attempts to commit toxic code, the operating system will block the transaction.

## Troubleshooting the Constitution

### 1. Verification of Ingestion
How do you know if the Agent is actually reading your file? In Claude Code, execute `/memory` to dump the current active context array. 

### 2. Resolving Rule Collisions
If the Agent is ignoring a rule, a localized Sub-Directory Constitution (e.g., `src/legacy/CLAUDE.md`) is likely overriding your Global Repository rules.

### 3. The Danger of `/compact`
Tools often provide a command to compress context windows (e.g., `/compact`). Executing this command forces the LLM to summarize the chat history. Warning: This aggressive summarization can occasionally cause the model to temporarily "forget" complex sub-directory rules until the context is refreshed.

## Strategic FAQ

### Q1: Does injecting a massive Constitution inflate my Token costs?
**Yes.** The contents of your Constitution are physically prepended to every single interaction. This is why aggressive compression (Law 2) is mandatory.

### Q2: Must I commit this to the Git repository?
**Yes.** Project-level Constitutions (`AGENTS.md`) represent the structural DNA of the repository. They must be version-controlled and shared across the entire team.

### Q3: If I mutate the Constitution, does the AI register it instantly?
**No.** The prompt payload has already been serialized. You must execute a session wipe (e.g., `/clear`) or boot a fresh terminal to inject the updated AST.

### Q4: Can I rely 100% on the `/init` command to build my rules?
**No.** The `/init` command is merely a statistical scraper. It cannot deduce complex business logic, architectural red lines, or your specific DoD. The Human Architect must engineer the critical constraints.
