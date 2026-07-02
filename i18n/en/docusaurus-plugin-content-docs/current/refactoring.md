# Code Refactoring

> "Weed out the old to bring forth the new." — "Book of Documents"

Whether you are writing precise Python data processing scripts or building high-concurrency TypeScript backend services, there is a fate you cannot avoid in software development: fighting "software entropy increase." Every patch applied to rush the schedule, every temporary hack, and every special case that bypasses the design will eventually condense into massive technical debt.

Refactoring, which means improving the internal structure without changing external behavior, is the only antidote to reduce the cognitive load of the system and pave the way for new features. In the AI era, we no longer need to excavate these code ruins barehanded. The intervention of Large Language Models (LLMs) has completely reshaped the engineering paradigm of code generation and legacy system transformation.



## The Double-Edged Sword of AI-Assisted Refactoring

Before throwing hundreds of lines of obscure code directly to the AI, we must honestly face the capability boundaries of this "cyber pair programmer." AI is not magic; it is an extremely smart super intern with absolutely no project historical background.

### Core Advantages

- Greatly reduces comprehension cost: AI can explain a hundreds-of-lines ancestral function in seconds, shortening the time for newcomers to understand the code from weeks to hours.
- Cross-file pattern recognition: Rapidly discovers duplicated logic and inconsistent naming patterns scattered throughout the codebase, which is difficult to match with manual searching.
- Efficiently builds safety nets: AI is very good at generating Characterization Tests for existing code, which is the absolute prerequisite for safe refactoring.

### Fatal Blind Spots

- Lack of "institutional memory": AI doesn't know that a seemingly redundant date validation is there because of a special request from a major client three years ago. It might "rationally" delete critical business logic.
- Confident mistakes: AI is highly prone to generating code that looks very elegant and professional but quietly calls non-existent APIs or breaks edge cases.
- Large-scale tasks easily collapse: When asking the AI to simultaneously perform architecture adjustments, renaming, and logic optimization, its instruction following quality will drop sharply, triggering silent behavior changes.

Core Principle: In refactoring, AI is always the co-pilot; you must firmly grip the steering wheel of business logic and architectural decisions.



## Efficiency Infrastructure: Using AI to Rapidly Spawn Boilerplate Code

Any commercial project is flooded with a large amount of basic scaffolding code that lacks creativity but must be written. This kind of highly deterministic work is the absolute dominant zone where AI exerts its speed advantage.

You can directly input the core model definition (e.g., a piece of Prisma Schema):

```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  price     Decimal
  stock     Int
  createdAt DateTime @default(now())
}

```

Then issue a high-intensity generation command:

```text
Based on the `Product` model above, use NestJS specifications to automatically generate the complete `ProductController`, `ProductService`, and `CreateProductDto`. Force validation on all input data and use `PrismaService` for reading and writing.
```

The AI can perfectly spit out high-quality skeleton code that meets the specifications within seconds, saving you half a day of boring typing and allowing you to focus your energy on the design of core business logic.



## Modular Refactoring of Spaghetti Code

The biggest toxin of legacy code lies in Spaghetti Code (long functions) and bizarre multiple nesting of `if-else`. The following demonstrates how to use AI to completely dismantle a piece of spaghetti code.

### Original Spaghetti Logic

This is a piece of complex logic typically mixed with calculation, validation, and side effects:

```typescript
function checkout(cart, user) {
  let total = 0;
  for (let i = 0; i < cart.items.length; i++) {
    total += cart.items[i].price * cart.items[i].quantity;
  }
  
  // Complex discount logic
  let discount = 0;
  if (user.level === 'VIP') {
    if (total > 500) { discount = total * 0.2; } 
    else { discount = total * 0.1; }
  } else if (user.level === 'GOLD') {
    if (total > 1000) { discount = total * 0.3; } 
    else { discount = total * 0.15; }
  }
  
  let finalPrice = total - discount;
  let points = 0;
  if (finalPrice > 100) {
    points = Math.floor(finalPrice / 10);
    if (user.level === 'VIP') { points = points * 2; }
  }
  
  // Physical side effects
  database.saveOrder(cart, finalPrice, points);
  sms.sendNotification(user.phone, "Order placed");
  
  return { finalPrice, points };
}

```

### Cyber Refactoring Instruction

We select this function and issue precise refactoring instructions to the AI:

```text
Please act as a senior code refactoring expert. Optimize the above `checkout` function:
1. Completely extract the "discount calculation" and "points calculation" logic into pure functions without side effects.
2. Use Guard Clauses to return early and eliminate deep nesting.
3. Use TypeScript to annotate parameters and return value types, and add corresponding unit tests after refactoring.
```

### Optimized Code

The code structure dismantled by the AI is highly aesthetic, and the business logic is completely decoupled:

```typescript
// 1. Independent, pure function for discount calculation without side effects
export function calculateDiscount(total: number, userLevel: string): number {
  if (userLevel === 'VIP') return total > 500 ? total * 0.2 : total * 0.1;
  if (userLevel === 'GOLD') return total > 1000 ? total * 0.3 : total * 0.15;
  return 0;
}

// 2. Independent, pure function for points calculation without side effects
export function calculatePoints(finalPrice: number, userLevel: string): number {
  if (finalPrice <= 100) return 0;
  const basePoints = Math.floor(finalPrice / 10);
  return userLevel === 'VIP' ? basePoints * 2 : basePoints;
}

// 3. Orchestration main controller entry point, process is clear and easy to maintain
export function checkout(cart: Cart, user: User) {
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const discount = calculateDiscount(total, user.level);
  const finalPrice = total - discount;
  const points = calculatePoints(finalPrice, user.level);
  
  // Execute side effect operations
  database.saveOrder(cart, finalPrice, points);
  sms.sendNotification(user.phone, "Order placed");
  
  return { finalPrice, points };
}

```



## Common AI Commands

When you face a terrible codebase and don't know where to start, directly applying the refined instructions in the table below can make the AI's output hit the nail on the head:

| Code Smell | Phenomenon Characteristics | Common AI Prompts |
| --- | --- | --- |
| Long Method | Functions are hundreds of lines long, mixing reading, calculating, and IO. | "Use the Single Responsibility Principle (SRP) to dismantle this long function into 3 sub-functions. Forbid sharing implicit global state; communication must be through explicit parameter passing." |
| Nested Ifs | Code leans heavily to the right. | "Please switch to using Guard Clauses to return/throw errors early, eliminate indentation depth, and keep the main business logic path on the outermost layer." |
| Magic Numbers | Flooded with inexplicable number or string constants. | "Extract all hard-coded magic values in this function into `Readonly Enum`s with clear semantic declarations, and add necessary explanatory comments." |



## Five-Step Takeover Workflow for Legacy Systems

If you just took over a 5-year-old legacy system with zero documentation, you must absolutely not simply select hundreds of lines of code and let the AI "clean it up"; that will trigger a disaster. Please strictly follow the enterprise-grade safe refactoring five-step workflow below.

### Step 1: Global Semantic Scanning and Positioning

Do not rush to modify the code. Utilize AI's powerful context retrieval engine to build a mental model. Ask high-level architectural questions: "Please sort out what the entry logic of this project is? Which services modify the core data of customers? Where are the core business process routes distributed?" This can quickly lower the cognitive threshold without breaking anything.

### Step 2: Lock Current Behavior

This is the most critical yet most often overlooked step. Before modifying any function, use tests to "lock" its current behavior (including feature-like Bugs).

AI Prompt: 

```text
Please write comprehensive Characterization Tests for this legacy function. Do not try to fix any logic; your goal is to 100% cover its current behavior and all edge cases. These tests will serve as my safety net when refactoring.
```

### Step 3: Set Strict Constraint Boundaries

When AI performs code refactoring, it often commits the "imposter dependency hallucination"—imagining that some popular libraries (like `lodash-es` or `date-fns`) are installed in the project and quietly importing them at the top. You must set a clear Negative Prompts list in the instructions:

AI Prompt: 

```text
[Anti-hallucination constraint]: Strictly forbid introducing any new third-party libraries that do not currently exist in `package.json`. Do not change any public API contracts; do not modify core logic related to payments.
```

### Step 4: Micro PRs and Local Anatomy

Paste the toughest "ancestral functions" to the AI and have it translate the hidden true business rules paragraph by paragraph. Subsequently, split the refactoring into extremely small, single-intent steps (e.g., step one only renames, step two only extracts functions), and submit them in the form of micro Pull Requests (PRs). If a PR cannot be understood by a reviewer within 1 minute, it is too dangerous.

### Step 5: Mandatory Domain Review and Static Analysis

Use AI in conjunction with static analysis tools (like SonarQube). Static tools objectively find code smells with extremely high cyclomatic complexity, and AI provides optimization plans combined with context. Ultimately, the review must be conducted by senior developers familiar with the business domain, with the focus locked on Invariants and backward compatibility.
