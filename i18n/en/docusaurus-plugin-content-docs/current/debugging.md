# Debugging and Troubleshooting

> "From seeing the small, one knows the budding; from seeing the beginning, one knows the end." — "Han Feizi"

You paste a piece of error message to the AI, and a few seconds later, it gives a detailed explanation and repair suggestion. It sounds reasonable, so you apply it. As a result, the original error disappears, only to be replaced by a new, more incomprehensible error. 30 minutes later, you have fallen into the quagmire of "using patches to fix patches," further away from the root cause than when you started.

In traditional software development, when programmers encounter tricky bugs, they often use the classic "Rubber Duck Debugging": placing an innocent yellow plastic duck on the desk and explaining the code logic to it line by line to clear their train of thought. But in the era of large models, what is on your desk is no longer that silent plastic duck, but a top-tier debugging master with infinite patience and knowledge of all framework source codes worldwide—the "Cyber Yellow Duck."

However, this high-IQ duck is a double-edged sword. It can solve a configuration problem that tortured you for two days in one minute, but it can also waste your entire afternoon with a string of seemingly reasonable nonsense. This chapter will systematically outline how to avoid AI's logical traps in debugging and efficiently and accurately troubleshoot system failures.



## Classification of Bugs

Not all Bugs are created equal. To tame AI, you must first distinguish what kind of Bug you are facing.

### 1. Pattern Bugs

These are common errors that you or thousands of other developers have seen before. For example, Webpack configuration errors, Promise exceptions caused by forgetting to write `await`, array out-of-bounds, CORS cross-origin interceptions, etc.

* AI's Performance: Excellent. AI has read all Stack Overflow answers and GitHub Issues. For these types of problems, AI is like a senior colleague with a perfect memory.
* Coping Strategy: Throw the error message and related code directly to the AI; its first suggestion is usually the exact solution.

### 2. Causal Bugs

These Bugs are unique to your system's specific state and history. For example, race conditions of microservices under specific loads, dirty data caused by historical database migrations, cache invalidation timing errors.

* AI's Performance: Extremely poor. AI cannot "see" your runtime state, data history, or complete architectural context. It can only blindly guess the most common pattern based on surface symptoms.
* Coping Strategy: Absolutely do not ask the AI directly how to fix it. You need to build the mental model yourself and use AI for causal deduction, rather than asking for code patches.


## Debugging Workflow

To avoid falling into AI's blind guessing, please follow this structured Debugging Ritual. Do not frantically say to the AI: "My API crashed, reporting 500, quick, help me look," this kind of question has zero information density.

### Step 1: Collect Evidence (First 5 Minutes, Don't Touch AI)

Before opening the AI window, you must first collect facts and perform a "three-way feeding":

1. Clue 1: Complete Stack Trace. Grab the original error text containing line numbers, error codes, and TraceIDs.
2. Clue 2: Contextual Logs. Capture the raw database and gateway logs from 10 seconds before and 5 seconds after the exception occurred.
3. Clue 3: Reproduction Path and Physical Environment (Reproduction & Env). Outline the operation steps and system environment configuration (memory, time zone, network restrictions).

Core Rule: If you cannot stably reproduce it, find the reproduction steps first. AI cannot debug a problem you cannot even demonstrate.

### Step 2: Use Standard Templates to Trigger Deduction

Fill the collected clues into the following analysis template, requesting AI to assist in deduction rather than modifying code directly:

```markdown
# Cyber Yellow Duck Debugging Instruction

## 1. Error Scene Description
- Trigger scenario: [e.g., High-concurrency promotion, multiple users ordering simultaneously]
- Host environment: [e.g., Node.js v20.10.0, PostgreSQL 15, AWS ECS (1vCPU/2GB)]

## 2. Core Error Stack Trace
[Paste the complete Stack Trace log here]

## 3. Associated Contextual Log Stream
[Paste the raw system Logs, including database queries, from 10 seconds before and after the exception occurred]

## 4. Target Task
Based on the causal chain above, deduce possible code execution paths, troubleshoot race conditions, memory overflows, or deadlock risks, and point out possible loopholes in my reasoning logic.

```

## The Three Major Traps of AI Debugging

### 1. The "Plausible Hypothesis Trap"

When AI faces causal bugs, it will generate a hypothesis that "could explain this symptom in some parallel universe." You follow it to troubleshoot, rule it out and ask again, and it generates a second one.

* Harm: Every incorrect hypothesis takes up your precious working memory. After trial and error three times, your brain is stuffed with irrelevant context, completely losing judgment on the real problem.
* Countermeasure: If the AI's first suggestion is invalid, stop asking immediately. The accuracy of its subsequent suggestions will drop off a cliff; please quickly retreat to manual breakpoint troubleshooting.

### 2. Patching over Patching

The AI gave a piece of code, it threw an error; you send the error to it, it adds a `try-catch`; it throws an error again, it adds an `if not null` check.

* Harm: The code becomes extremely fragile and heavily spaghetti-fied, and the root cause is covered up by layers of garbage patches.
* Countermeasure: Once you notice the AI starting to repeatedly apply patches for new errors, immediately `git revert` to the initial clean state and re-examine the core logic.

### 3. Skill Atrophy

Expert debuggers use a "breadth-first, data-driven" strategy, while novices often fall into the quagmire of "depth-first, stubbornly clinging to a single hypothesis." If you outsource all diagnostics to AI, you will lose the opportunity to exercise your underlying troubleshooting intuition.

## 4 Scenarios of AI Debugging

Although AI easily rolls over when facing complex business logic, you can trust it unreservedly in the following highly deterministic scenarios:

| Scenario | Why AI is Good at It | Best Practice |
| --- | --- | --- |
| Hieroglyphic Error Translation | AI is extremely good at pattern matching and language parsing. | Throw C++ template errors, Webpack compilation gibberish, or deep Java exceptions at it, and let it translate them into human language. |
| Regex and SQL Debugging | Strict domains of pure logic and syntax. | "Why didn't this regular expression match the last line?" AI will precisely point out the problem and explain the reason. |
| Troubleshooting Misuse of Obscure APIs | AI has memorized almost all official documentation. | "Why does calling this third-party method return undefined?" AI can instantly point out reversed parameters or type mismatches. |
| Writing Regression Tests | Verifying boundary conditions and refactoring safety. | After you fix a Bug, have the AI immediately write a unit test to tightly cover the edge case that was just fixed. |


## The Tough Battle with the Cyber Yellow Duck

### Snipping Concurrent Race Conditions

Background: The system backend occasionally throws order ID uniqueness conflict errors. Local single-threaded tests run perfectly, but during high-concurrency online promotions, a few users' wallet balances are deducted into the negative.

Hidden danger in the original code:

```typescript
// Classic "read-then-write" dirty read vulnerability
export async function createOrder(userId: string, totalPrice: number) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet || wallet.balance < totalPrice) throw new Error("Insufficient balance");

  const newOrder = await prisma.order.create({ /* ... */ });

  // ❌ Dirty write risk: Directly using the old balance read into memory for subtraction overwrite
  await prisma.wallet.update({
    where: { userId },
    data: { balance: wallet.balance - totalPrice } 
  });
}

```

Cyber Yellow Duck Diagnostic Deduction:
The AI instantly points out the physical process: Two concurrent requests (Req A and Req B) simultaneously read a balance of `100`. Req A deducts and writes `20`. Req B, holding the old data, deducts again and overwrites `20`. The user bought two items, but the database only deducted money once.

Correct prevention scheme given by AI (Atomic deduction and exclusive locks):

```typescript
export async function createOrder(userId: string, totalPrice: number) {
  return await prisma.$transaction(async (tx) => {
    // 1. SELECT FOR UPDATE forcefully locks the current wallet row
    const wallet = await tx.$queryRaw<any[]>`SELECT * FROM "Wallet" WHERE "userId" = ${userId} FOR UPDATE`;
    if (!wallet[0] || wallet[0].balance < totalPrice) throw new Error("Insufficient balance");

    const newOrder = await tx.order.create({ /* ... */ });

    // 2. Precise atomic deduction: Rely on the database's native subtraction operation, discard memory calculations
    await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: totalPrice } } // ✅ Safe atomic operation
    });
  });
}

```

### Diagnosing Node.js Memory Leaks (Heap Dump Analysis)

Background: After running continuously for 48 hours, the system frequently reboots due to OOM (Out of Memory). We captured a heap memory snapshot and found the suspected leak path is: `Closure -> context -> pendingRequests (Array) -> 240,000 items`.

Original middleware code:

```typescript
const pendingRequests = [];
app.use((req, res, next) => {
  pendingRequests.push({ req, timestamp: Date.now() }); // Record request
  res.on('finish', () => {
    // ❌ Forgot to remove it from the global array pendingRequests!
  });
  next();
});

```

Cyber Yellow Duck Diagnostic Deduction:
The AI quickly identified this as a "memory leak caused by typical event listener closure escape and static array reference residue," and provided an advanced solution utilizing the V8 engine's garbage collection mechanism.

Elegant scheme given by AI (WeakMap weak reference):

```typescript
import { Request, Response, NextFunction } from 'express';

// ✅ Use WeakMap to associate the request object
// When the req object's lifecycle ends and is destroyed, the metadata in the WeakMap is automatically released by the Garbage Collection (GC) mechanism
const requestMetadata = new WeakMap<Request, { timestamp: number }>();

app.use((req: Request, res: Response, next: NextFunction) => {
  requestMetadata.set(req, { timestamp: Date.now() });

  res.on('finish', () => {
    // At this point, there's no need to manually delete, eliminating memory leaks caused by human omission
  });
  next();
});

```