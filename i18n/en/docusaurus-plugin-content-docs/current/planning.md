# Intent Architecture: The SPET Loop

> "Give me six hours to chop down a tree, and I will spend the first four sharpening the axe." — Abraham Lincoln

Establishing Context boundaries (via `PRODUCT.md` and `ARCHITECTURE.md`) merely builds the stage. The true execution—how to deconstruct macro-features, how to orchestrate the AI Agent's workflow, how to enforce quality control, and how to execute merges—is the actual performance.

This chapter transitions into the **Execution Topology**: The deterministic engineering pipeline that allows an AI to operate as a Principal Developer, and the systems required to make this workflow mathematically sustainable.

In the AI era, there is a brutal, asymmetrical truth: **The capability of the underlying LLMs is scaling exponentially, but most engineering teams are only realizing linear gains.** 
This is not a failure of the models; it is a failure of the workflow. The majority of developers still treat AI as a glorified autocomplete engine. They fail to orchestrate pipelines where the AI functions as an autonomous collaborator—capable of ingesting macro-tasks, self-validating its execution, and carrying momentum across complex, multi-session deployments.

The workflow detailed in this chapter is the apex methodology converged upon by elite AI engineering teams. It is not dependent on a specific IDE, though it utilizes the capabilities of Claude Code and modern Agents as its primary reference.

To deploy this workflow, the first lethal bottleneck to eliminate is "Vending Machine Prompting."
When confronting a complex, enterprise-grade repository, amateur developers will lazily hurl a vague, generalized mandate (e.g., *"Build me a real-time WebSocket chat app like Slack"*) into the prompt, expecting the AI to instantly spit out flawless, compiled production code.

This "Blind-Box" development paradigm is mathematically doomed to fail. Within the span of a single sentence, you are forcing the LLM to simultaneously compute multidimensional matrices: Business Logic, System Architecture, Database Schema, and low-level Syntax generation. Its neural attention mechanism instantly diffuses, resulting in fractured logic and catastrophic codebase pollution.

How does the Agent know which specific files to target? How does it know the exact test suite to invoke?

The answer: You must bind the AI to a rigid, deterministic **Strategic Topology** *before* it writes a single character of code. This chapter breaks down the absolute core of modern AI engineering: **The SPET Protocol (Spec -> Plan -> Execute -> Test).** This is the precise threshold that separates standard developers from "Intent Architects."

---

## The SPET Execution Loop

SPET is a rigorous software engineering paradigm designed exclusively for high-frequency Human-AI Pair Programming. It forces the developer to violently decouple the software lifecycle into four isolated, linear phases. It establishes hard "Checkpoint Gates" where the Human Architect must review and approve the trajectory:

```mermaid
sequenceDiagram
    autonumber
    actor Human as Intent Architect
    participant AI as AI Agent
    
    Note over Human, AI: Phase S: Specification (The Payload)
    Human->>AI: Inject structured Context infrastructure (PRODUCT.md / ARCHITECTURE.md)
    
    Note over Human, AI: Phase P: Planning (The Topology)
    AI->>Human: Synthesize a multi-phase, highly granular Implementation Blueprint
    Note over Human: CHECKPOINT: Architect reviews dependency graphs, boundary coupling, and scope.
    Human-->>AI: Approve Topology OR Inject Refactoring Directives
    
    Note over Human, AI: Phase E: Execution (Isolated Micro-Stepping)
    loop Continuous Micro-Iteration
        Human->>AI: Directive: "Execute Phase 1, Step 1. Mutate ONLY target files. Isolate context."
        AI->>Human: Output highly cohesive Git Diff payloads
        Note over Human: CHECKPOINT: Line-by-line Security & Logic Audit
        
        Note over Human, AI: Phase T: Testing (Runtime Verification)
        Human->>Human: Compile locally. Execute Unit Tests & Linter matrices.
        alt Exit Code 0 (Success)
            Human->>Human: Execute `git commit` to serialize the state.
        else Fatal Exception / Logic Collapse
            Human->>Human: Execute `git reset --hard HEAD` (Absolute Rollback)
            Human->>AI: Inject the raw `stderr` dump. Re-execute Step 1 from a clean state.
        end
    end
```

- **S (Specification):** Define the absolute boundaries of "What to build" and "What NOT to build." This inherits the macro-directives from the `PRODUCT.md`. The Architect utilizes structured formatting to define the business logic, the technology constraints, and the lethal security red lines.
- **P (Planning):** Define the execution trajectory. Before any code is mutated, the AI is forced to decompose the macro-specification into a highly granular, step-by-step blueprint. Every step must explicitly list the targeted files and the objective verification criteria.
- **E (Execution):** Execute via "Micro-Stepping." The Agent is commanded to mutate only the exact files required for the current atomic step. This is the ultimate defense against "Context Rot"—it mathematically forces the AI's cognitive load below the failure threshold.
- **T (Testing):** Immediately upon step completion, invoke the local compiler. If the tests pass (`Exit Code 0`), serialize the state via Git. If it fails, execute a brutal, one-click `git reset --hard HEAD`. You must **never** allow dirty, failing code to pollute the context window of the next step.

## The Art of Task Decomposition: Hitting the "Sweet Spot"

Task decomposition is the most critical, yet universally botched, mechanism in AI engineering. Junior developers obsess over "writing the perfect prompt," while totally ignoring a deeper law of physics: **What is the volumetric scale of the task payload you are forcing into the model?**

If the payload is too massive, the AI suffers from Context Exhaustion and Attention Drift over long, sprawling sessions. If the payload is too atomic, the context becomes hopelessly fragmented, and the overhead of constantly prompting the Agent eclipses the actual velocity gains. 

Calibrating the exact geometric scale of a task is the prerequisite for stabilizing an LLM's output.

### 1. The 40% Context Threshold

Elite Agent teams operating Claude Code have empirically proven a critical law: **The cognitive payload and conversational history required to execute an atomic task must never exceed the first 40% of a single Session's Context Window.**

This is a mathematical reality. As context depth crosses the 40% threshold, the LLM's adherence to the earliest injected instructions (e.g., the System Prompt, or your global Architectural rules) degrades exponentially. The probability of the model hallucinating APIs or writing non-compliant syntax skyrockets.

A task engineered perfectly into the "Sweet Spot" must satisfy these three axioms:
1. **The Single-Sentence Axiom:** The objective can be articulated in a single, unambiguous declarative string.
2. **The Binary Verification Axiom:** The completion state is determined by a binary machine signal (e.g., passing a specific unit test), not subjective human emotion.
3. **The Session-Isolation Axiom:** The entire lifecycle of the task can be executed and verified within a single, isolated chat session.

```mermaid
graph TD
    A[Task Volumetric Scale] --> B(Micro-Task: < 15 mins)
    A --> C((The Sweet Spot: 30 mins - 2 hrs))
    A --> D(Macro-Task: > 2 hrs)
    
    B --> B1["Overhead > Velocity<br/>(Severe Context Fragmentation)"]
    C --> C1["Optimal 40% Context<br/>(High Cohesion / Absolute Verification)"]
    D --> D1["Context Exhaustion<br/>(Severe Attention Drift & Hallucination)"]

    style B fill:#fee2e2,stroke:#ef4444,stroke-width:2px
    style C fill:#dcfce7,stroke:#22c55e,stroke-width:3px
    style D fill:#fee2e2,stroke:#ef4444,stroke-width:2px
```
*Figure: The Volumetric Task Curve. Micro-tasks create devastating overhead; Macro-tasks trigger context exhaustion. The Sweet Spot guarantees high-fidelity AI output.*

### 2. The Three Iron Laws of Task Atomicity

To ruthlessly audit your task decomposition, enforce these three laws:

* **Law 1: The Low-Coupling Boundary:** The mutation payload of an atomic task must be isolated to 1–3 files within a specific domain directory. If a task requires concurrent mutation of 5+ files across completely separate architectural layers, it is a Composite Task and must be forcefully decomposed.
* **Law 2: Objective Testability:** Upon completion of the atomic step, it must be verified by a deterministic compiler or test runner (`npm run test:auth`). If the completion signal relies on "it looks okay in the browser," the task boundary is a failure.
* **Law 3: The 120-Minute Limit:** If the execution of the task (Prompt -> AI Generation -> Testing -> Git Commit) exceeds 2 hours, it is too massive. While autonomous Sub-Agents are evolving to handle larger orchestration, in modern environments, the human Architect is still strictly responsible for bounding the blast radius.

## The 4-Phase Decomposition Protocol

Business requirements (Specs/GitHub Issues) are formulated to describe value. AI Agents require engineering telemetry. Translating business value into exact, sequential engineering tasks is the primary value of the human Architect. 

During the **P (Planning)** phase of the SPET loop, execute this rigid 4-step protocol to synthesize a task matrix:

```mermaid
flowchart TD
    Step1[Phase 1: Read-Only Recon<br/>Map the existing architecture] --> Step2[Phase 2: Autonomous Generation<br/>AI synthesizes the dependency matrix]
    Step2 --> Step3[Phase 3: Architect Checkpoint<br/>Human audits boundaries and vectors]
    Step3 --> Step4[Phase 4: Serialization<br/>Commit to HANDOFF.md & Execute]
```

* **Phase 1: Read-Only Reconnaissance**
  Before commanding the AI to plan, force it to execute a read-only scan of the relevant domain directories. **Strictly forbid code mutation.**
  > **Architect Payload:**
  > "I need to deploy the 'Email Digest' microservice (see `docs/specs/email-digest.md`). Before synthesizing a plan, execute a Read-Only scan of `src/features/notifications/`, `src/services/email.py`, and `src/scheduler.py`. Do NOT write code. Output a highly compressed, 10-line architectural summary of the current state."

* **Phase 2: Autonomous Matrix Generation**
  Command the Agent to synthesize the task matrix, explicitly demanding dependency mapping.
  > **Architect Payload:**
  > "Based on your recon, synthesize an implementation matrix for `docs/specs/email-digest.md`. Constraints per node: 1) Must be isolated to a single Session; 2) Must contain an exact verification command; 3) Must explicitly declare Blocked-By dependencies and Parallelization opportunities."

* **Phase 3: The Architect Checkpoint**
  The human executes a ruthless audit of the AI's proposed topology:
  1. Do any nodes violate architectural boundaries?
  2. Did the AI hallucinate or miss critical hidden dependencies (e.g., a required DB migration)?
  3. Are the verification signals 100% deterministic?

* **Phase 4: Serialization & Execution**
  Once approved, write the task nodes directly into the `NEXT` array of your `HANDOFF.md` artifact. This creates a persistent state that survives across sessions.

## The Dependency Matrix: Parallel vs. Serial Execution

The topological mapping of task dependencies dictates the entire velocity of the sprint. 

Tasks containing **Data Coupling (DB schema mutations)** or **State Collisions** must be strictly serialized. However, functionally isolated tasks (e.g., rendering independent React components) can be parallelized, exponentially accelerating output.

You must not map dependencies based on "intuition." The graph must be mathematically derived from the targeted file boundaries:

```mermaid
graph TD
    T1[T1: Prisma Schema Mutation<br/>Strict Serial Node (Critical Path)] --> T2a[T2a: Express API Controllers<br/>Parallel Wave A]
    T1 --> T2b[T2b: React Component Implementation<br/>Parallel Wave B]
    T1 --> T2c[T2c: Email Template Engine<br/>Parallel Wave C]
    T2a --> T3[T3: E2E Integration & State Hydration<br/>Convergence Node (Blocked by Wave A/B/C)]
    T2b --> T3
    T2c --> T3

    style T1 fill:#fef08a,stroke:#eab308,stroke-width:2px
    style T2a fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style T2b fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style T2c fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
    style T3 fill:#f3e8ff,stroke:#a855f7,stroke-width:2px
```
*Figure: The Execution Matrix. Node T1 mutates the database; it blocks the entire pipeline. Nodes T2a/b/c possess zero file overlap and execute in parallel. Node T3 is the integration convergence point.*

## Core Template Standardization

To prevent human ambiguity from corrupting the AI's logic engine, you must utilize highly structured Markdown schemas. These templates are optimized to interface flawlessly with the RAG (Retrieval-Augmented Generation) systems embedded in IDEs like Cursor and Claude Code.

### 📋 The Specification (Spec) Schema

```markdown
# Specification (Spec): [Feature Namespace]

## 1. Terminal Objective
[Define the exact business value and end-state of this module in one strict paragraph.]

## 2. Infrastructure Constraints
- Frontend Runtime: [e.g., React 19, TypeScript 5]
- Persistence Layer: [e.g., Prisma + PostgreSQL]
- Aesthetic Engine: [e.g., Tailwind CSS v3]
- Dependency Policy: [e.g., LETHAL CONSTRAINT: Do NOT import external NPM packages for UI components; utilize existing primitives in `/src/ui`.]

## 3. Core State Contracts
1. [Sub-Feature Alpha]: [Explicit mapping of I/O parameters and state mutations]
2. [Sub-Feature Beta]: [Explicit mapping of I/O parameters and state mutations]

## 4. Security & Performance Directives
- [e.g., All unhandled exceptions MUST route through `src/interceptors/global.ts`]
- [e.g., LETHAL CONSTRAINT: O(N) database queries within map loops are strictly forbidden.]
```

### 📐 The Implementation Matrix (Plan) Schema

```markdown
# Implementation Matrix - [Feature Namespace]

- [ ] Wave 1: [Infrastructure & Schema Definition]
  - [ ] Node 1.1: [Deploy Prisma DTOs and Data Models]
    - Target Files: `src/models/schema.prisma`
    - Verification: Execute `npx prisma db push` (Exit Code 0)
  - [ ] Node 1.2: [Define Zod Validation Schemas]
    - Target Files: `src/validators/user.schema.ts`
    - Verification: Compile-time TSC checks.

- [ ] Wave 2: [Business Logic Execution]
  - [ ] Node 2.1: [Implement User Authentication Service]
    - Dependencies: `@schema.prisma`
    - Constraints: [LETHAL: Do NOT mutate any routing layers in this step. Isolate logic to the service class.]
```

## Live Execution: Architecting an Offline Markdown Editor via SPET

### 🎯 The Terminal Objective

Architect a "Next-Gen Web-Based Markdown Editor featuring real-time DOM rendering, localized IndexedDB auto-saving, and one-click sanitized HTML export."

---

### 📝 Phase 1: S (Specification) - The Blueprint

The human Architect establishes the foundational constraints and injects them into the AI context:

```markdown
# Specification (Spec): Local-First Markdown Editor

## 1. Objective
Architect a high-performance web editor supporting real-time Markdown rendering via an adaptive dual-pane DOM, featuring offline auto-save state-recovery, and dynamic telemetry.

## 2. Technology Stack
* UI Engine: React 18 + TypeScript
* Aesthetics: Tailwind CSS (Strict requirements for flawless Dark/Light mode execution)
* Parser: `marked` (Lightweight compiler)
* Persistence: `localStorage` (Configuration state) + `IndexedDB` (Incremental draft serialization)

## 3. State Contracts
1. Main Layout: Adaptive dual-pane CSS Grid. Raw input intercepts on the left; real-time parsed HTML renders on the right.
2. Telemetry HUD: Render real-time stats in the footer: Byte count, Word count, Paragraph count, and calculated reading-time velocity.
3. Auto-Save State Machine:
   * Implement a strict 1000ms Debounce wrapper. Automatically serialize the draft to IndexedDB upon input cessation.
   * Upon cold-boot of the application, scan IndexedDB. If an unmerged draft exists, trigger a modal: "Unsaved state detected. Execute recovery?"
4. Security Perimeter: LETHAL CONSTRAINT: Heavyweight WYSIWYG dependencies are forbidden. All parsed Markdown MUST route through `DOMPurify` to mathematically eliminate XSS vectors.
```

### 📐 Phase 2: P (Planning) - Synthesizing the Matrix

We now command the AI to generate the technical matrix. **Code generation is strictly disabled.**

* In Claude Code CLI: `claude "Ingest the provided Specification. You are restricted to PLAN_MODE. Code mutation is forbidden. Synthesize a 12-node implementation matrix adhering to the defined architecture."`

The Agent computes the constraints and outputs a highly rigorous topology:

```markdown
# Implementation Matrix - Markdown Editor

- [ ] Wave A: DOM Infrastructure & Layout
  - [ ] Node 1: Scaffold `src/components/EditorLayout.tsx`. Implement the responsive CSS Grid dual-pane architecture.
  - [ ] Node 2: Inject Tailwind configuration; implement Theme Provider for Dark/Light mode (`src/index.css`).
  - [ ] Node 3: Architect the Header Navigation, integrating the 'Export' CTA and filename input state.

- [ ] Wave B: Markdown Compilation Engine
  - [ ] Node 4: Provision `marked` and `dompurify`. Construct the AST compilation and XSS-sanitization pipeline (`src/utils/markdownParser.ts`).
  - [ ] Node 5: Implement bi-directional scroll synchronization between the Input Pane and the Render Pane.
  - [ ] Node 6: Scaffold the Telemetry HUD `src/components/StatsBar.tsx`. Implement RegEx algorithms for accurate word-counting.

- [ ] Wave C: Persistence & Auto-Save
  - [ ] Node 7: Architect the `src/hooks/useDebounce.ts` hook to throttle intense I/O mutations.
  - [ ] Node 8: Construct the IndexedDB controller `src/utils/dbController.ts` for asynchronous CRUD operations.
  - [ ] Node 9: Bind the Auto-Save logic to the editor `onChange` events. Verify debounce timing and visual save-indicator logic.
  - [ ] Node 10: Implement the Cold-Boot interceptor to detect and recover orphaned IndexedDB drafts.

- [ ] Wave D: Export & Optimization
  - [ ] Node 11: Implement the Export logic: Serialize the DOM to a standalone `.html` blob with embedded CSS and trigger browser download.
  - [ ] Node 12: Execute mobile-viewport regression testing and touch-target padding adjustments.
```

> 🚦 **The Architect Checkpoint (Gatekeeping)**
> The human Architect audits the matrix and detects a critical race-condition threat: *"Node 5 is architecturally flawed. If bi-directional scroll-sync utilizes complex two-way event listeners, it will trigger an infinite event-loop deadlock. Mutate the plan: Enforce ONE-WAY binding ONLY. Scrolling the Input Pane drives the Render Pane; the inverse is disabled."*
> The Agent acknowledges the architectural flaw, patches Node 5, and the Architect signs off. **(APPROVED!)**

### 🚀 Phase 3: E (Execution) - Isolated Micro-Stepping

We transition the Agent into ACT mode. 
The human maintains absolute control over the blast radius. We **forbid** the AI from executing Nodes 1-12 simultaneously. We enforce isolated, atomic execution:

* **Architect:** *"Execute Node 1. Mutate ONLY `src/components/EditorLayout.tsx`. Do not touch the global CSS or any other files."*
* **Agent:** Computes the layout constraints and outputs highly cohesive React code for the Layout file.
* **Architect:** Audits the `git diff`. Verifies that the Agent obeyed the file boundaries and that the code compiles.
* **Architect:** Executes serialization: `git add . && git commit -m "feat: init EditorLayout grid (Node 1)"`.

By enforcing this rigorous "Command-and-Verify" loop, the volume of code generated per interaction is mathematically minimized. The human review burden is negligible, and the probability of the AI hallucinating sprawling system bugs is eliminated.

---
### 🔬 Phase 4: T (Testing) - The Ultimate Safety Net

During the execution of **Node 9 (Auto-Save Binding)**, a catastrophic failure occurs. The AI generated a flawed asynchronous event listener. When you rapidly type in the browser, the main thread deadlocks, throwing a fatal IndexedDB cursor collision error due to rapid concurrent writes.

In this scenario, **never** command the AI to "fix the bug" within the same polluted session. This forces the model to ingest massive amounts of toxic `stderr` history, degrading its context and usually resulting in it creating a worse patch.

Enforce the "Zero-State Reboot" doctrine:

1. **Physical Eradication:** Instantly execute `git reset --hard HEAD` in your terminal. This violently purges the corrupted code from the file system, reverting the repository to the pristine, verified state of Node 8.
2. **Contextual Reboot & Precision Injection:** Terminate the polluted chat session. Initialize a clean session. Utilize targeted context injection (e.g., explicitly `@dbController.ts` in Cursor) and issue a hyper-specific corrective payload:
> *"Agent, during the execution of Node 9, your IndexedDB implementation triggered a fatal main-thread deadlock under high-frequency key-presses because the DB cursor was not correctly released. I have executed a hard `git reset` to rollback the repository. Analyze your previous failure. Patch the cursor-release logic in your Node 9 architecture, and generate the corrected implementation."*

Because the AI is unburdened by a polluted chat history, and explicitly warned of the exact concurrency vector, it instantly recognizes the missing `.close()` transaction block. It outputs a flawless, deadlock-free implementation.
You compile, test the application, and receive `Exit Code 0`. Mission accomplished.

## The Architect's Checkpoint Matrix

Human-AI Pair Programming is not "autopilot." As the Principal Architect, you must rigorously defend the integrity of your codebase at these four critical gates:

| Execution Phase | The Architect's Audit Matrix | The "Hard Stop" Kill Criteria |
| --- | --- | --- |
| **S (Specification)** | Is the objective perfectly deterministic? Is the tech stack explicitly defined? Are security protocols documented? | If the prompt contains vague emotion (e.g., "Build an app that feels like X"), **HALT** and restructure. |
| **P (Planning)** | Are file mutations isolated? Are cross-domain dependencies minimized? Is the testing signal automated? | If an atomic Node mandates modifying 8 files across the frontend and backend simultaneously, **REJECT** and force decomposition. |
| **E (Execution)** | Does the `git diff` precisely match the current Node's scope? Did the AI hallucinate unauthorized features? | If the Agent sneaks in "helpful" but unauthorized code outside the scope of the current Node, execute an immediate `git checkout` or revert. |
| **T (Testing)** | Does the compiler return zero errors? Are linters silent? Do the unit tests cover the new logic branches? | Pushing code to the `main` branch that contains a single active Linter warning or failed test assertion is **LETHAL.** Do not proceed. |
