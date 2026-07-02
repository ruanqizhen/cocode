# AI Cost Control

> "Every little bit matters when it comes to frugality." — "Zhu Zi's Family Maxims"

When developers or R&D teams transition from "occasionally using the web version of large models" to using Cursor, Claude Code, or autonomous agents for round-the-clock development, they usually experience their first "bill shock."

A normal coding Agent might make hundreds of API calls in a complex refactoring session. Due to the compounding effect of context (every conversation requires repackaging and sending previous history and tens of thousands of lines of code), this single session could silently burn through $7 to $30. For a 20-person team, if left unchecked, the pure API bill can easily exceed tens of thousands of dollars per month.

In fact, 90% of AI programming bills are burned on meaningless input Tokens (reading context), not on the few lines of code finally generated. As long as you master correct context management and engineering leverage, you can easily cut overall costs by 70% to 85% without lowering the quality of code output.

## The Compound Nightmare

Although large models are smart, their computation requires paying real money. To save money, we must first understand the extremely shrewd billing formulas of large model vendors:

$$\text{Total Cost} = (\text{Input Tokens} \times \text{Unit Price}) + (\text{Output Tokens} \times \text{Unit Price}) - (\text{Cache Hit Tokens} \times \text{Cache Discount})$$

- Input Tokens (The most money-burning black hole): The questions you send to the AI, historical conversation records, and referenced code files. In development, it usually accounts for 80% ~ 90% of overall consumption.
- Output Tokens: The code returned by the AI. Computation generation is costly, and its unit price is usually 3~5 times that of inputs.
- Cache Hit Tokens (Your profit pool): If the file contents sent in consecutive questions have a high degree of overlap, the model will directly reuse the cache on the server side (Prompt Caching). The price of cache hit Tokens is usually discounted to 10% to 50%. This is the core position of our defense!

The terrifying "Context Compound Effect": In an automated Agent session, when the conversation reaches the 50th round, the context may have swollen to a staggering 200K Tokens. This means that even if you just say to the AI at this time, "Test passed, continue," it will repackage and resend all the historical records from the previous 50 rounds. This snowballing hidden compounding is the biggest culprit crushing the bill.

## Model Routing Tiering

In team development, the biggest waste of money is "mindlessly turning on full power"—throwing whatever trivial tasks encountered directly to the most expensive and smartest top-tier models (like Claude 3.7 Sonnet or Gemini 2.0 Pro). In fact, 60% ~ 80% of tasks in daily coding are routine manual labor: adding comments, formatting JSON, renaming variables, writing test boilerplates. The results of doing these tasks with cheap small models and expensive top-tier models are exactly the same.

We must establish a Tiered LLM Strategy:

| Task Tier | Recommended Model & Strategy | Estimated Input Unit Price (per million Tokens) |
| --- | --- | --- |
| Manual Labor (Completion/Comments) | Local Model (Qwen3-Coder 14B) or Extremely Fast & Cheap Model (Gemini 2.5 Flash / DeepSeek-V3) | $0 ~ $0.14 (Cost almost negligible) |
| Daily Mainstay Development | Cost-Effective Sweet Spot (GPT-4o-mini / Claude 3.5 Haiku) | $0.15 ~ $1.00 |
| Hardcore Problem Solving | God-Level Reasoning (DeepSeek-R1) or Code Overlord (Claude 3.7 Sonnet) | $0.55 ~ $3.00 (Draw sword as needed) |

In a multi-agent architecture, let the expensive top-tier models be responsible for formulating high-level refactoring plans (Planner), and then dismantle the steps, handing them over to cheap models to execute specific file modifications (Executor).

## Proactive Context Pruning

"Context is money, context is money, context is money!" The most typical bankruptcy behavior: When asking the AI a question, directly packaging and throwing the entire project's source files (even including `node_modules`) into it (commonly known as mindless `@Codebase`). Throwing in a 200K Token project costs about $0.5 to $2 per question.

- Tactic 1: Targeted feeding, reject global retrieval. If you explicitly know where the problem is, let the tool only read the Git Diff and the relevant function signatures involved. Precisely input `@src/api/user.js`, rather than letting the large model do full-text blind reading.
- Tactic 2: Use Repo Map instead of full text. Both Aider and Cursor support generating a `repo_map`. It uses only a few thousand Tokens to summarize the directory structure and core class/function signatures of the entire codebase. It is 50 times cheaper than directly stuffing 20 complete files, and still allows the AI to accurately perceive the whole picture.
- Tactic 3: Configure an iron-blooded exclusion list. Strictly write automatically generated build artifacts (`build/`, `dist/`) and large `*.log` files into `.gitignore` or the IDE's Exclude list. Physically cut off the possibility of the AI misreading these garbage files.

## Extremely Draining Caching and Automatic Compression

Besides controlling your hands to send fewer files, we also need to "drain" the large model vendors' rules at the communication protocol level.

### Order is Money (Extreme Utilization of Prompt Caching)
The API caching mechanism of large models (KV matrix caching) is extremely sensitive to content order; it matches from the beginning. Best practice: You must always place static, huge content (such as massive system instructions, project `CLAUDE.md` specifications, full-repo API tool definitions) at the very front of the conversation; put dynamic content (the user's latest questions, current error Logs) at the very end. A well-designed Agent can ensure that the static part, taking up to 80% of the volume, hits the 10% cache bargain price every time.

### Automatic Session Compression and "Verbatim Deletion"
Never let the LLM do "Summarization" of historical conversations; that will lead to omitted important file paths and original error codes, triggering terrifying hallucinations. Modern geek tools (like Claude Code or Morph Compact) will perform asynchronous verbatim compression when the context reaches a threshold: it will directly filter out debugging nonsense like "you are right, sorry, I will fix it immediately" and repeatedly generated boilerplate code from the history, only retaining "core architectural decisions" and "code essence." This can instantly sever the compound nightmare without dropping IQ.

## Toolchain Optimization and Batch Processing

- Defer Loading and Semantic Caching: When your fully autonomous Agent mounts more than 10 tools (MCP servers, database querying, etc.), just explaining the usage of these tools to the large model alone will consume tens of thousands of Tokens. Do not load all at once; let the AI perform Tool Search dynamically. For repetitive database or API queries, use Redis + vectors to build a "semantic cache," directly returning the previous result.
- The Ultimate Fleece: Time for Money (Batch API): If you have large-scale, non-real-time task workloads (such as nightly CI/CD automated code reviews, large-scale supplementation of documentation comments for legacy codebases, batch generation of regression tests), absolutely do not use synchronous APIs. Switch to OpenAI or Anthropic's Batch API. As long as you are willing to wait for the system to process during idle times (usually within tens of minutes), all input and output costs are directly forced to a 50% discount.

## The Minimalist Workflow "Three Axes" for Saving Money

Even if you don't understand underlying APIs, as a developer, cultivating the following three habits can also greatly cut off losses:

- Guardrails first: No tests, no AI. If there are written test cases, the AI usually writes it correctly the first time having a target. If there are no test cases, the AI might blindly guess and try and error 4 times like a headless fly. You are actually paying for the AI's "trial and error cost."
- Small steps commit, reject grand narratives: Let the AI modify 50 lines, verify, commit; then modify the next 50 lines. Do not attempt to let it refactor 2000 lines at once. The failure rate is extremely high, and once it derails, the cost of tens of thousands of discarded Tokens goes straight down the drain.
- Turn off the IDE's "always-on auto-completion": Things like Cursor's Tab completion look cool, but behind it is the model making crazy requests. If you are not writing code at high intensity all day, it can quietly burn through $5-10 a day and it's all noise. Change completion to manual trigger via keypress, or let a local 14B open-source model ($0 cost) take over.

## Computing Power Budget Sheet

Through the implementation of the above five levers, let's calculate the cost difference of a 10,000-line core code project over a 2-week development period:

- ❌ The Naked Tycoon Flow (Select all top-tier models + mindless global repo scanning + no cache): Approx. $150 ~ $220.
- ✅ The Engineering Master Flow (Mixed routing + targeted feeding + cache keep-alive): Approx. $12 ~ $18.

If the practice of "mindless global resident top-tier models" is completely abandoned, a normal-intensity individual developer or small team member's reasonable monthly computing power budget should be as follows:

- Local small models for fallback: $0, covering 60% of basic mechanical tasks.
- Medium online models (pay-as-you-go): $5 ~ $15, dealing with mainline feature development.
- Top-tier models (API emergency refactoring): $5 ~ $10, only drawing the sword when gnawing hard bones.
- Total: $10 ~ $25 / month.

This is basically equivalent to buying an ordinary fixed-quota subscription assistant, but because you have mastered precise routing and cache scheduling, the same budget can let you explode with top-tier combat power several dimensions higher. Saving money is absolutely not about being stingy, but about meticulously squeezing the massive computing power of Silicon Valley giants into your true productivity through systematic engineering discipline and architectural control.