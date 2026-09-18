# AI Agent Skills

> "Do what you do best, and outsource the rest." — Peter Drucker

When pair-programming with advanced AI agents (like Claude Code), if you stuff all project background, conventions, build commands, and task prompts into the global rules, you quickly run into "cognitive overload" and "context dilution".

To fix that pain, Agent Skills were born. They are fast becoming standard in AI coding tools. If the global rules are the "general knowledge" that always lives in the brain, then Skills are "skill chips" plugged in on demand. This chapter explains what a Skill is, how it works under the hood, when to use one, and how to build custom skills for your project.

## What is an Agent Skill?

Skills are skill folders under `.claude/skills/`. Each Skill lives in its own folder, with `SKILL.md` as the core entry file. Their value: knowledge you would otherwise re-explain in `CLAUDE.md` or in chat becomes a reusable module loaded on demand. Anthropic's own definition is concise: "a Skill is a set of instructions — packaged as a simple folder — that teaches Claude how to handle a specific task or workflow."

Technically, a Skill is a prompt-based modular capability extension (a prompt-based meta-tool). It is not executable code (it does not run Python or start an HTTP service); it is an instruction pack loaded on demand.

The exact schema mandates a YAML Frontmatter block at the absolute top (which controls the semantic triggering engine), followed by the Markdown directive body:

```markdown
---
name: skill-name        # The unique identifier (kebab-case)
description: text       # The Semantic Trigger Vector. (LETHAL: This determines if the AI loads it)
---

# The Skill Directive

## Core Execution Constraints...
```

### Two Cognitive Analogies

1. **Skill chip:** like the chip plugged into the back of the head in The Matrix. The AI does not hold the skill all the time; it loads it temporarily only when performing that task.
2. **Cookbook vs. sous chef:** a Skill is more like a "cookbook" with steps and conventions; the AI stays the executor. A subagent is more like an "independent colleague" who takes over a whole chunk of work.

## The Semantic Trigger Architecture

### Progressive Disclosure

The absolute advantage of AI Skills is **Dynamic Loading**. This is achieved through a "Progressive Disclosure" engine driven by the YAML Frontmatter. It mathematically prevents global rules from suffocating the context window.

The engine executes in a two-phase loop:

### Phase 1: Lightweight Indexing (Cold State)
Upon initialization, the IDE scans the `.agents/skills/` directory. It parses *only* the YAML Frontmatter (`name` and `description`) of each skill, compiling a lightweight semantic vector index. The heavy Markdown payloads are ignored to preserve tokens.

### Phase 2: Just-In-Time (JIT) Injection (Hot State)
When a user issues a prompt, the system executes a semantic similarity search between the prompt payload and the indexed `description` vectors. If the confidence threshold is breached, the engine dynamically injects the entire `SKILL.md` payload into the LLM's active context window.

## Architectural Matrix: Constitution vs. Skills vs. Subagents

All three systems scale AI capabilities, but their execution vectors are fundamentally different:

| Dimension | The Constitution (`AGENTS.md`) | Agent Skills (The Skill Chips) | Autonomous Subagents |
| ----- | ---------------- | --------------- | ------------- |
| **Ontology** | Static Project DNA & Rules | JIT (Just-In-Time) Instruction Payloads | Independent, autonomous AI instances |
| **Loading Vector** | Globally prepended to all contexts | Injected dynamically via semantic match | Instantiated explicitly for a macro-task |
| **Token Footprint** | Permanent Long-Term Occupation | Ephemeral (Loaded on demand) | Zero footprint (Operates in an isolated window) |
| **Target Use-Case** | Global constraints, Tech Stack definitions | Niche workflows, Template generation, Audits | Multi-step deployments, intense research |

## When Should You Engineer a Skill?

### The Architectural Decision Tree

* Is the payload a Code Template or Format Transformer? 👉 **Engineer a Skill**
* Is the payload a highly specific, repeatable workflow? 👉 **Engineer a Skill**
* Is the payload a localized Domain Constraint? 👉 **Engineer a Skill**
* Does the task require intense autonomous multi-step reasoning and terminal execution? 👉 **Deploy a Subagent**
* Does the workflow contain a deep, recursive verification loop? 👉 **Deploy a Subagent**

**The Golden Rule:** Always default to a Skill. Skills are deterministic, token-efficient, and easy to maintain. Only escalate to an autonomous Subagent when the orchestration complexity exceeds a single prompt execution.

### High-Leverage Execution Scenarios

* **Format Mutators:** PDF → Markdown extraction; DOCX → JSON serialization.
* **Engineering Standards:** Enforcing Conventional Commits; executing strict Security Audits.
* **Boilerplate Generators:** Scaffolding REST API endpoints; synthesizing standardized unit tests.
* **DevOps Protocols:** Step-by-step production deployment checklists; Incident Response debugging flows.

## How to Engineer and Deploy a Skill

### 1. Directory Topology

Skills come in two scopes:

* **User-level (global skills):** `~/.claude/skills/` (applies to all personal projects)
* **Project-level (recommended):** `.claude/skills/` (committed with Git, shared by the team)

> **Note:** `~/.config/claude/skills/` is not an official Claude Code path; only `~/.claude/skills/` and `.claude/skills/` are recognized.

Each Skill is an isolated folder:

```text
your-project/
├── .claude/
│   └── skills/
│       └── git-commit/
│           ├── SKILL.md
│           ├── examples.md
│           └── scripts/
```

### 2. The `SKILL.md` Schema

```markdown
---
name: generate-commit
description: Generates Git commit messages conforming to the Conventional Commits specification based on the git diff. Trigger this when writing commits or executing a diff review.
---

# Conventional Commit Generator

When requested to synthesize a Git commit payload, you MUST adhere to the following architecture:

## 1. Syntax Format
<type>(<scope>): <subject>

- feat: A new feature payload
- fix: A vulnerability or bug patch
- docs: Markdown or comment mutations

## 2. Lethal Constraints
- The subject line is strictly bounded to 50 characters.
- MUST utilize the imperative mood (e.g., "add feature", NOT "added feature").
```

### 3. Elite Production Templates

#### Example 1: Creating a new feature module

````markdown
---
name: new-feature
description: Create a new feature module under features/ with standard vertical slice architecture
---

# Creating a new feature module

## Directory structure

```
src/features/{module_name}/
├── router.py
├── service.py
├── repository.py
├── schemas.py
├── tests/
```

## Constraints
- All modules must use the same structure
- All DB operations must go into repository
- The router must be registered in main.py

## Afterwards
- Run typecheck
- Register the router
````

#### Example 2: Database migration skill

````markdown
---
name: db-migration
description: Handle Alembic database migrations safely. Use when modifying database schema or models.
---

# Database migration rules

## ⚠️ Hard constraints
- Do not modify historical migration files
- Do not write business logic inside migrations
- Must support downgrade

## Standard flow
```bash
alembic revision --autogenerate -m "update schema"
alembic upgrade head
alembic downgrade -1
```

## Done criteria
- Tests pass
- Rollback works
````

## Advanced Heuristics and Anti-Patterns

### 1. The Description Vector is Everything

The `description` field is the sole metric the IDE uses to trigger the skill. If it is ambiguous, the skill will never load.

* ❌ **Toxic:** `A skill for git stuff.`
* ✅ **Elite:** `Generates commit payloads adhering to Conventional Commits. Triggers on git diff analysis, commit generation, or code reviews.`

### 2. Surgical Modularity

Do not engineer "God Skills." Maintain strict modularity.

* ❌ **Toxic:** `backend-omnipotent-helper`
* ✅ **Elite:** `db-migration` / `api-doc-generator` / `log-analyzer`

### 3. Cognitive Compression

The `SKILL.md` must remain extremely lightweight to preserve the context window. If a skill requires massive JSON schemas or verbose examples, shard the payload into sibling files:

* `examples.md`
* `references/api-schema.json`

### 4. Inject "References", Not Abstract Prose

LLMs process concrete paths significantly better than abstract English concepts.

* ❌ **Toxic:** *"Scaffold a new module according to the project's architectural standards."*
* ✅ **Elite:** *"Execute a 1:1 structural replication of the `src/features/billing/` directory. You are forbidden from mutating the structural layout."*

## Preventing "Hallucinated Scaffolding"

### The Triad of Failure
When AI generates files without a Skill, it typically fails via:
1. Depositing files in the wrong root directory.
2. Hallucinating custom utility functions instead of utilizing the existing `src/utils`.
3. Drifting from the team's casing standards (e.g., mixing `camelCase` and `snake_case`).

### The Solution: Deterministic Referencing

```markdown
❌ The Abstract Fallacy:
"Create the module according to our strict specs."

✓ The Deterministic Anchor:
"Execute a strict 1:1 clone of the `auth` module directory structure. Utilize the `ApiResponse<T>` interface located in `src/types/global.ts` for all returns."
```

## Reverse Engineering: Generating Conventions from an Existing Project

```markdown
Please analyze the codebase and draft a CLAUDE.md, including:

1. Directory structure patterns
2. Naming conventions
3. How tests are organized
4. Import style
5. Potential forbidden zones

And explain the basis for each rule
```

## The Tri-Layer Security Perimeter

Skills are highly probabilistic; they *guide* the LLM. To engineer a truly indestructible repository, you must deploy a Tri-Layer Perimeter:

```mermaid
graph TD
A[AGENTS.md + Skill Chips<br/>(Probabilistic Guidance)] --> B[Git Hooks<br/>(Local Deterministic Blocks)]
B --> C[CI/CD Pipeline<br/>(Absolute Cloud Verification)]
```

* **Skills/Rules:** Provide the initial cognitive guidance to generate accurate code.
* **Git Hooks (e.g., Husky):** Provide localized, mathematical blocks (Linters, Typechecks) to prevent dirty commits.
* **CI/CD:** Provides the ultimate, immutable integration test suite.

Only by weaving these three layers together can you achieve a stable, autonomous AI engineering pipeline.

## Cross-Tool Support and Summary

The Skill mechanism is gradually becoming a cross-tool standard supported by many AI coding tools: "write once, use in many places."

### In one sentence

AI Skills are a "capability module system loaded on demand". They split engineering experience into reusable skill units so the AI loads them when needed and stays light otherwise, fixing the problem of global rules permanently occupying context.

Writing a good description, splitting skills well, and designing them together with CLAUDE.md, Hooks, and subagents is the key to getting the most out of this system.
