# Markdown File Format

> "Speech without literary grace will not spread far." — "Zuo Zhuan"

You may have already noticed that in our interactions with AI, we have always been using the Markdown format. You might wonder: why is the entire AI collaboration ecosystem highly unanimously supporting the Markdown (.md) format instead of more advanced Word or structured JSON/XML?

The answer is very pure: Markdown is currently the digital currency for combating LLM "intelligence degradation" and achieving the highest Token economic efficiency.

Below, we will completely dismantle the core syntax of Markdown for you and reveal how to write "high-purity documents" that AI Agent tools cannot resist.


## Why Does AI Prefer Markdown?

For large language models, ordinary TXT files lack structure, which easily leads to logic confusion in long texts; while HTML or XML contains a large number of closing tags (like `<div>...</div>`), which pointlessly consumes a lot of expensive Tokens and introduces text noise.

Markdown, with its extremely restrained "syntactic sugar," achieves the following three major AI-friendly characteristics:

- **Extreme Token Consumption Ratio**: Just one or two characters (like `#` or `-`) can seamlessly transmit "heading hierarchy" and "list relationships" to the model.
- **Natural Attention Focus**: Cutting-edge models have devoured the entire internet's GitHub repositories and tech blogs during the pre-training phase. They have a natural conditioned reflex to the skeleton of Markdown syntax and can accurately extract the subject, predicate, object, and core constraints.
- **Perfect Diff Review Benchmark**: Whether it's Cursor's Composer mode or Aider's automated file modification, Markdown's plain text attribute allows AI agents to present you with the most intuitive code difference previews with the minimum line-level computational overhead.

---
## Core Syntax Quick Reference

Here are standard Markdown syntaxes frequently used when writing project documents and machine rules:

### Text Hierarchy and Skeleton

```markdown
# Heading 1 (Usually used for project names or root rule files)
## Heading 2 (Used for major modules, like: architectural layering, environment configuration)
### Heading 3 (Used for specific sub-item explanations)
```

:::tip AI Tuning Tip
It is strongly recommended to maintain strict heading nesting in documents. When AI programming tools perform RAG retrieval, they often slice content (Chunking) according to heading blocks. If your hierarchy is chaotic, the fragments the AI fishes up will be taken out of context.
:::

### Lists and Conditional Constraints

```markdown
- **Unordered List Item 1**: Use an asterisk or a minus sign.
- **Unordered List Item 2**: Suitable for stating parallel system constraints.

1. **Ordered List Item 1**: The first step that must be executed.
2. **Ordered List Item 2**: The second step that must immediately follow.

- [ ] **To-Do Item 1**: Development blueprints not yet implemented.
- [x] **Completed Item 2**: System infrastructure that has been successfully run.
```

### Code Blocks and Highlighting (Core Syntax)

For AI programming tools, the declaration format of code blocks directly determines whether it can do precise syntax highlighting and line-level Diff rewriting for you.

````markdown
```typescript
// You must explicitly specify the language declaration after the backticks (like typescript, python, json)
export function greet(name: string): string {
    return `Hello, ${name}!`;
}
```
````

:::tip 
Never write isolated code blocks without a language suffix (i.e., pure triple backticks). Once terminal tools like Claude Code cannot recognize the AST attribute of the code block, they will abandon local modification and instead simply and crudely rewrite the entire file of several hundred lines from scratch, which very easily triggers session interruption.
:::

### Tables and Relational Mapping

Tables are the most efficient layout weapon for piling up "rule opposites" or "data flows" for AI:

```markdown
| Route Path | Associated Service | Permission Level |
| :--- | :---: | ---: |
| `/api/v1/auth` | AuthService | Public |
| `/api/v1/user` | UserService | User_Role |
```

## AI-Oriented "Context-Level" Markdown Advanced Refactoring

After understanding the basic syntax, how do we upgrade the dimension of a document so that it turns into a perfect set of "machine-readable infrastructure"?

### Strategy 1: Make Good Use of YAML Front Matter (Global Prefix Resident)

At the very top of a large project document (like `ARCHITECTURE.md`), use double hyphens to wrap a section of key-value pairs; this is called Front Matter. When modern AI agents read files, they will prioritize parsing this as global metadata:

```markdown
---
project: "Anachron Forum"
version: "2026.06"
primary_tech_stack: ["React", "TypeScript", "Prisma", "Express"]
strict_constraints: "No external crypto packages allowed"
---

# Global Architecture Specification
...
```

This allows the Agent entering the project to instantly establish a "big picture view," aligning the tech stack version in its internal Planner in one second, preventing it from polluting your modern code with syntax from outdated versions.

### Strategy 2: Use "Blockquotes" to Create Strong Isolation Zones

When you need to warn the AI about "minefields" or "safety bottom lines that must absolutely not be touched" in the project, don't bury them in ordinary body paragraphs. Use the `>` symbol to transform them into highly cohesive blockquotes:

```markdown
:::warning Core Boundary
All database query actions in this project **must** go through the singleton object exported by `src/lib/prismaClient.ts`.
It is **absolutely forbidden** to privately use `new PrismaClient()` to re-establish a connection in any business logic layer or routing layer, otherwise it will cause a connection pool exhaustion deadlock under high concurrency!
:::
```

When the Harness module of modern AI programming tools dynamically trims Prompts, it will give Blockquotes a higher weight. In the underlying Attention Matrix of the model, this format can often get a higher score weighting.

### Strategy 3: Structure Your Machine Rules (Best Practice Template for `.cursorrules`)

Don't write rules for AI in humanized prose. Below is a rule template strictly conforming to Markdown context engineering that you can copy and modify directly for `.cursorrules` or `AGENTS.md` in your project root directory:

```markdown
# AI Agent Behavior Protocol

## 1. Context
- **Target Project**: High-Concurrency Historical Figures Dialogue Forum (Echo Hall)
- **Development Principles**: Adhere to strong type contracts, pursue zero runtime errors.

## 2. Action Loops
### Before Writing Code:
1. Must use semantic search to confirm whether a similar utility function already exists within the project.
2. Force the output of an `Implementation Plan` architecture of no more than 3 lines in the sidebar, waiting for human confirmation.

### After Writing Code:
1. Automatically pull up the terminal and run `npm run lint` for static checking.
2. If an error is encountered, it is forbidden to seek human help; it must autonomously read the error log and attempt to self-repair at least 3 times.

## 3. Negative Bounds
> - Absolutely forbid using the `var` keyword.
> - Absolutely forbid bypassing the global error interceptor (`errorHandler.ts`).
> - When encountering complex business uncertainties, guessing blindly is forbidden; stop actions immediately and issue a request for confirmation/clarification to the human.
```
