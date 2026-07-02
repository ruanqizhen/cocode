# Context Engineering

> "How can it be so clear and cool? For water comes from the source." — Zhu Xi

In the previous chapter, we reached a core consensus: the decisive factor determining the ultimate development experience is often not the raw intelligence of the large model itself, but the foundation framework (Harness) of the programming tool. And the core tactical task when dismantling the Harness to the bottom layer is actually the precise allocation of dynamic information streams.

In the AI era, this discipline is called Context Engineering.

In attempts to write code on a web page, you might have spent half an hour carefully polishing a long Prompt, expecting the AI assistant to generate flawless code for you. But if your project is slightly more complex, this attempt will mostly end in failure. This is not because the model is too dumb; the root cause of 90% of AI programming failures lies in the extremely scarce, vague, or noisy context fed to it. The key to whether AI programming can generate production-grade code is no longer the word-smithing of "Prompt Engineering," but the infrastructure of "Context Engineering."


## What is Context Engineering?

Famous AI researcher Andrej Karpathy once provided a widely cited classic definition for context engineering:

> "Context engineering is the delicate art and science of filling the context window with just the right amount of information for the next operation." — Andrej Karpathy

If a Large Language Model (LLM) is compared to a high-speed CPU, then its Context Window is its RAM (memory). Just as an operating system must carefully manage active processes and data loaded into RAM, a programming tool must carefully orchestrate all the peripheral information the AI can see when generating the current line of code.

### Context Engineering vs. Prompt Engineering

To clarify the fundamental difference between the two, we can compare them through the following multi-dimensional matrix:

| Dimension | Prompt Engineering | Context Engineering |
| --- | --- | --- |
| Core Focus | How to word sentences, focusing on the expression text and tone of instructions | What the model knows at the moment, focusing on the supply and purity of knowledge packages |
| Operation Nature | Static, one-time task descriptions and template definitions | Dynamic, interactive iterative information system grid management |
| Pain Point Solved | Unclear expression of intent, generation direction deviating from expectations | Code hallucinations, "castles in the air" code detached from project reality |
| Applicable Scenarios | Single function generation, general algorithmic Q&A, text formatting | Complex project refactoring, cross-file business orchestration, Agent continuous looping |



## Why Can't We Talk About Context Apart from AI Programming Tools?

Since context is so important, can human developers do context engineering for large models "purely by hand" on a web page? The answer is: in industrial-grade development, this is a complete efficiency disaster. This is exactly why modern AI programming tools are necessary.

To get rid of the inefficiency of "manual feeding," AI programming tools play the following three irreplaceable roles in context engineering:

1. Breaking through humans' "perception limits" and "computing limits": A medium-sized project may contain hundreds of files, complex Abstract Syntax Trees (ASTs), and intricate bidirectional dependency relationships. Humans can only intuitively copy two or three related code files by hand to stuff into a web page. In contrast, AI tools can silently scan tens of thousands of lines of code in the background to find indirect dependencies that humans wouldn't think of.
2. Real-time capture of "transient" context overhead: Chain reactions of compilers, Linter errors, or failed unit tests triggered during code modification require manually copying error logs from the terminal and pasting them back onto the web page. AI programming tools directly reside in the host or terminal environment, capable of monitoring these changes in real-time to achieve a local self-healing closed loop.
3. Precise practice of "Token Economics": If the entire project is dumped onto a web page all at once, it will not only cause high billing overhead but also cause the model to experience severe "lostness and intelligence degradation." AI tools (Harnesses) use self-developed pruning algorithms to ensure that every Token sent to the model has the highest "gold content."



## Anatomizing the Context Grabbing Mechanisms of Three Mainstream Tools

When facing the same development project, the underlying context collection and assembly philosophies of three highly representative tools—Cursor, Claude Code, and Google Antigravity—are vastly different. Only by understanding their respective underlying grabbing mechanisms can you feed them accurately:

### 1. Cursor: "Targeted Feeding and Local RAG" Based on GUI Perspective

Cursor represents the classic "AI-native IDE" school; it highly relies on user visual guidance and local vector indexing:

* `@Files` (Precise Targeting): Directly reads the entire text of specified files, injecting it at the top of the Prompt with the highest priority. It saves the most Tokens and has the highest relevance, making it the first choice for high-frequency refactoring.
* `@Codebase` (Intelligent Search): Uses local vector embeddings to perform RAG retrieval, automatically matching and extracting several snippets of code semantically most relevant to the current question.
* Features: Extremely intuitive, completely driven by developers building information boundaries manually on the interface using the `@` symbol, supplemented by small-scale RAG in the background to fill in the gaps.

### 2. Claude Code: "Tool-driven" Based on CLI Perspective

As an Agent anomaly completely running in the terminal, Claude Code lacks fancy UI panels; it hands the power of context collection almost entirely to the model itself:

* On-demand perception: When you propose a task, Claude Code won't blindly do a full-repo RAG. Instead, through its integrated dedicated tools like `grep_search` (global search), `locate_files` (locate files), and `view_file` (view file), it flips through the code in your terminal like a true human geek, deciding for itself which files to add to the current context.
* Features: Humans don't need to bother `@`ing files. You only need to state the goal, and it will "scout out" the relevant context in the terminal itself.

### 3. Google Antigravity: "Full Retention and Native Indexing" Based on Ultra-Long Text

As a native concurrent IDE deeply bound to the Gemini ecosystem, Antigravity takes an extremely luxurious "profound inner strength" route:

* Total Devouring: Relying on Gemini's native ultra-Long Context Window easily reaching the millions level, Antigravity tends to keep all core files, syntax trees (ASTs), and full documentation of the entire project permanently resident in the model's KV Cache.
* Features: Due to the massive window, it barely needs to do radical code pruning. For it, the entire project is context that can be called upon at any time; large-scale joint cross-file refactoring does not require humans to carefully select boundaries.



## Classic Combat Comparison: Poor Context vs. Rich Context

To personally feel the industrial-grade quality leap brought by context management through AI programming tools, let's simulate a real backend development task on the spot: "Write a user Register routing function in the Express framework."

### ❌ Scenario A: Extremely Poor Context — Traditional Web-Based Blind Guessing Mode

The developer carelessly enters directly in the dialog box:

> "Help me write an Express user registration interface function. It needs to save the user, and the password needs to be encrypted."

Lacking the tool layer's scan of the local project infrastructure, the AI, in an "information desert" completely oblivious to any architectural details of the project, can only blindly guess and write the following code based on the "probability average" of public internet corpora:

```javascript
// Generalized code blindly guessed by AI
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/User'); // ❌ Blindly guessed file path

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // ❌ Blindly guessed encryption algorithm
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: 'User created' });
  } catch (error) {
    return res.status(500).json({ error: error.message }); // ❌ Crude local dirty catch
  }
});

```

#### Fatal Flaw Analysis:

1. Database Disconnect: The AI blindly guessed you are using Mongoose (MongoDB), but your project engineering actually uses Prisma with PostgreSQL. Throwing this code into the project will directly cause the compilation to fail.
2. Logic Repetition and Security Risks: It introduced a new `bcrypt` package for password hashing, while your project team has clearly unified the more secure `scrypt` encryption algorithm in `src/utils/crypto.ts`.
3. Architectural Pollution: It wrote a rudimentary `try-catch` and directly returned the raw error to the client, completely bypassing the globally unified exception interceptor you carefully wrote.



### 🟢 Scenario B: Precisely Enriched Context (Rich Context) — Combat Flow of the Three Major Tools

We want the AI to strictly reuse the project's existing `schema.prisma` (database definition), `authValidation.ts` (input validation), `crypto.ts` (encryption tool), and `errorHandler.ts` (global error handler).

Let's see how we gracefully construct a high-purity cognitive sandbox for it in the three major mainstream tools:

#### Scheme 1: Precise GUI Targeting in Cursor

The developer enters in Cursor's Chat panel or Composer mode:

> "Please help me write the API interface function for user registration. Strictly reuse the existing modules of the project, and it is forbidden to introduce new encryption packages:
> * Database contract: `@schema.prisma`
> * Validation rules: `@authValidation.ts`
> * Encryption tool: `@crypto.ts`
> * Error interception: `@errorHandler.ts`
> Ensure exceptions are safely thrown through the error handling middleware."
> 
> 

#### Scheme 2: Issuing Fuzzy Strategic Commands in Claude Code

Since Claude Code is a CLI Agent with strong tool control capabilities, you don't need to struggle to locate the paths of these files in the terminal; just type in the command line:

> `claude "Write an API interface function for user registration. You need to find the database Schema definition, login validation contract, our self-developed encryption tool class, and the global error handler in the project yourself, strictly reuse them, and do not introduce any new third-party encryption packages."`
> *(At this point, the terminal will flash madly; Claude Code will automatically call grep to search for keywords like `prisma`, `crypto`, etc., autonomously reading these four files into its own context window, completely without the need for humans to manually drag and drop files.)*

#### Scheme 3: Utilizing "Global Pin" and Ultra-Long Context in Google Antigravity

In the Antigravity interface, thanks to Gemini's extremely exaggerated million-level long text cache, you don't even need to select meticulously. You can right-click the core `src/utils/` and `prisma/` folders in the sidebar to drag them into the "Context Pin," and then enter directly in the inline dialog box:

> "Based on our resident system infrastructure specifications, write a user registration API interface function, ensuring it perfectly integrates into the existing architectural philosophy."



Regardless of which of the above tool flows is used, after the AI acquires sufficient and precise context, the final code written will be industrial-grade code that reaches the "zero modification, direct online" standard:

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prismaClient'; // ✅ Precisely reuse project's existing Prisma Client
import { validateRegisterInput } from '../utils/authValidation'; // ✅ Strictly adhere to project's input validation contract
import { hashPassword } from '../utils/crypto'; // ✅ Precisely call project's proprietary encryption algorithm
import { AppError } from '../middlewares/errorHandler'; // ✅ Integrate into globally unified error handler

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Strictly use global validation mechanism
    const { error, value } = validateRegisterInput(req.body);
    if (error) {
      throw new AppError(400, `Input validation failed: ${error.message}`);
    }

    const { email, password, nickname } = value;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError(409, 'This email is already registered');
    }

    // 3. Reuse unified hash function in the project
    const hashedPassword = await hashPassword(password);

    // 4. Precise persistent writing
    const newUser = await prisma.user.create({
      data: { email, passwordHash: hashedPassword, nickname },
      select: { id: true, email: true, nickname: true, createdAt: true }
    });

    return res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error); // ✅ Never do dirty catches locally, safely throw to global middleware
  }
}

```


## Scaling Confrontation: Long Session Collapse and "Context Rot"

In human-machine collaborative development, there is a silent hidden killer called "Context Rot." When you talk continuously with AI in the same session for over an hour, accumulating tens or hundreds of rounds of historical messages, you will find the AI starting to become forgetful and unresponsive.

### Why Does Ultra-Long Context Cause the Model to "Degrade in Intelligence"?

1. Lost in the Middle: Even if a model claims to support a 1 million Token window, when the actual fill volume increases, its extraction recall rate for information in the Middle will exponentially decline. Your core instructions are easily drowned in long historical nonsense.
2. Negative Memory Pollution: During a long session of debugging, erroneous modification ideas and error reports that you and the AI tried together but eventually abandoned remain in the historical messages, severely interfering with the AI's current reasoning path.

### 🛠️ Golden Rule: The Art of Starting Fresh in Different Tools

In daily high-frequency development, the simplest and most efficient habit to combat context rot is "don't retire in a single session." Once you notice signs of the AI misunderstanding or slowing down, immediately start a brand new, clean session!

* In Cursor: Resolutely press `Ctrl/Cmd + N`, close the old Chat, and directly `@register.ts` in the new window to feed the sliced state: "This is the latest code we just wrote; let's develop the next login interface based on this."
* In Claude Code: Type `/compact` directly in the terminal to force trigger track pruning and historical summarization, or directly type `/exit` to quit, and re-type `claude` to start a clean process.
* In Google Antigravity: Utilize its Tab isolation mechanism to clear the current virtual reasoning session sandbox with one click, and remount the foundational context with one click.


## Implementation Guide: Building Context Infrastructure Suitable for AI Reading

As a software engineer of the new era, your core work is evolving from "writing every line of code by hand yourself" to "orchestrating a perfect production environment for AI." You must establish an AI-friendly context infrastructure within your project engineering:

### Step 1: Establish a Project-Level "Panoramic View"

Maintain the following three standard Markdown documents for machine reading in the project root directory:

* `PRODUCT.md`: Core business vision, primary user links, and functional boundaries. (Let the AI know what we are doing).
* `ARCHITECTURE.md`: The project's system layering, tech stack selection versions, and data flow design. (Let the AI know how we do it).
* `CONTRIBUTING.md`: Daily development environment configuration, Linting specifications, and unit test writing standards.

(For more on "Markdown", please refer to: [Appendix: Markdown Documentation](markdown))

### Step 2: Write Highly Executable Machine Rule Files

According to the mainstream weapons chosen by your team, configure the corresponding rule declaration files in the root directory. Remember, do not write vague, emotionally colored prose; it must be concrete, condition-triggered, and verifiable operational instructions:

* If you use Cursor: Create a `.cursorrules` file.
* If you use Claude Code: Create `.claudecode.json` or configure system-level instructions in the project description.
* If you use Google Antigravity: Create a `.antigravity/rules.json` workspace specification.

> 🟢 Example of Highly Executable Rules:
> "When handling interface errors, it is forbidden to use local `try-catch` blocks in the current function to intercept them. `AppError` must be thrown explicitly, or passed to the global error interceptor via `next(error)`. Every time a business logic file is modified, `npm run test` must be run automatically for availability alignment."

### Step 3: KV Cache-Friendly Prompt Design

If you are developing a smart Agent system exclusive to your team based on large model APIs, be sure to pay attention to Key-Value Cache (KV Cache) optimization. Keep the prefix of the System Prompt absolutely stable. Avoid injecting high-frequency dynamic variables like current timestamps or random Session IDs at the beginning of the System Prompt. This will completely invalidate the large model's underlying KV cache mechanism, causing your Time to First Token (TTFT) and Token costs for long-context reasoning to skyrocket by over 10 times.

