# The Ever-Growing Mountain of Shit

> "Rome wasn't built in a day." — English Proverb


Submit a requirement to an AI, and it can generate thousands of lines of runnable code in seconds. When you need to add a feature, the speed at which it adds existing code is just as fast. At this point, everything seems perfect. The productivity of software development seems to have ushered in an unprecedented leap.

However, as the codebase grows, almost all teams heavily relying on AI programming will hit an invisible high wall at some point: the cost of modification becomes higher and higher. A function silently expands from twenty lines to two hundred lines; fixing one Bug often pulls out the radish along with the mud, causing three new Bugs; dependencies between modules become entangled. You can no longer understand the code you "wrote" yourself—because you didn't write it in the first place, and no one knows why the AI wrote it that way at the time.

Beneath the revelry of speed brought by AI, a specter is wandering the software engineering world—a new type of Technical Debt crisis driven by AI. It is not simply "producing more bad code," but fundamentally mutating the nature of bad code.



## From "Spaghetti" to "Sedimentary Rock"

AI has not eliminated the "Shit Mountain"; it has merely changed its physical form.

The so-called "Shit Mountain code" refers to a pile of ancestral bad code that no one dares to touch. These codes pile up together like a mountain made of shit. It is tall and smelly, and modifying it anywhere might cause the whole mountain to collapse, so you can only continue piling new shit on top.

In the English context, the Shit Mountain written by human programmers is jokingly called "Spaghetti Code." Various if-else statements are tangled together, and pulling one hair affects the whole body. But a human's Shit Mountain is at least traceable: a person left a mess upon resigning, and when you look through Git Blame, you can at least trace it back to "This is a patch Zhang San wrote in 2018 to support older browsers." The core characteristic of a human Shit Mountain is "don't dare to touch," but it carries strong business context and historical memory.

The Shit Mountain written by AI, however, is "Sedimentary Rock." It is pressed layer by layer, and each layer viewed independently is logically consistent, even coming with perfect comments and unit tests. But between the layers, there is no macro design. A typical AI Shit Mountain looks like this: lying in the project are 5 almost identical files with different parameter names like `utils/fetchData.ts`, `utils/fetch_data_v2.ts`, `utils/apiClientNew.ts`; viewed together, they contain 3 kinds of retry logic, 2 different authentication processes, and an abandoned migration script that still runs in CI but is called by no one.

The terrifying thing about an AI Shit Mountain is not that you "don't dare to touch it," but that you "can't see what's broken, much less why it exists."

This is not alarmist; cruel empirical data has revealed the accumulation speed of this mountain. A deep analysis by GitClear of over 211 million lines of real commercial code (from enterprises like Google, Meta) between 2020 and 2024 revealed three chilling trends:

* Surge in "Copy/Paste" (cloned code): The proportion skyrocketed from 8.3% in 2021 to 12.3% in 2024.
* The Death of Refactoring: The proportion of "modified lines" representing code reuse and refactoring plummeted from 25% to less than 10%.
* Extremely High Short-Term Churn Rate: The proportion of code modified or deleted less than two weeks after being written rose significantly.

To combat entropy increase, human programmers invented the DRY (Don't Repeat Yourself) principle; whereas the marginal cost of AI-generated code is almost zero. It doesn't care about DRY at all; it prefers to just rewrite similar logic directly.



## Local Optima and Global Collapse

Mainstream benchmark tests (like HumanEval) give the illusion that AI writes perfect code, but these tests are all based on the "write once, judge once" routine. In real-world software engineering, code lives in continuous iteration.

To explore changes in AI code quality during continuous iteration, research teams from the University of Wisconsin, Washington State University, and MIT designed the SlopCodeBench test suite, forcing AI to repeatedly expand and modify its own generated code without seeing previous conversation history (simulating the scenario of "opening an old project and continuing to work" in real development).

Comparing 473 real open-source Python repositories, the results are shocking:

- 77% of the iteration trajectories experienced structural erosion: code complexity concentrated in a few core functions. On average, in each problem, the number of complex functions (cyclomatic complexity ≥ 10) surged from 3.6 to 23.7. Logic that could originally be explained in twenty lines was forcefully stuffed into two-hundred-line functions.
- Human code is actually cleaner: The verbosity of AI-generated code is 2.3 times that of real human historical repositories, and structural erosion is 2.0 times higher. In other words, the vast majority of code written by human engineers is cleaner than the worst batch from AI.
- Astonishing degradation speed: With each round of iteration, the growth rate of AI code verbosity is 6.6 times that of humans, and structural erosion speed is 5.0 times higher.

### Why Can't Prompts Stop the Degradation?

You might ask: Can't we directly command the AI in the system prompt to "follow the single responsibility principle and keep the code concise"?
Experiments prove: Completely ineffective. AI equipped with quality prompts indeed writes neatly in the first few rounds, but it still gets messier later on, with the degradation rate being exactly the same as without prompts.

The core reason lies in: The degradation of code quality is essentially the accumulation of micro-architectural decisions.
AI's optimization goal is "Task Complete," not "Task Correct" (architectural correctness). In each round of iteration, when facing new features, AI makes the seemingly fastest compromise based on local information—stuffing logic into old functions. Single decisions are mostly harmless, but the infinite stacking of local optima inevitably leads to global degradation in complex systems.

When a human engineer modifies something for the third time and feels something is wrong, the "braking mechanism" brought by experience will make them stop and refactor. A stateless AI has no memory; it cannot feel the "weight of technical debt" and doesn't know that this function has already stacked five patches, and stacking the sixth will completely collapse it.



## Token Explosion and The Great Toil Shift

Code becoming ugly is just a superficial phenomenon; the true cost is reflected in the hidden costs of engineering operations.

First is the invisible Token explosion.
Research by SlopCodeBench shows that from the early to late stages of iteration, the average Token overhead for handling the same problem increased by 2.2 times. The longer and messier the code, the more Tokens the AI needs to consume to understand the context before acting; the code produced is messier, and the cost of understanding in the next round is even higher, forming an extremely money-burning positive feedback black hole. When you exclaim in the first round that "you can finish a module for just a few cents," you usually wouldn't think that by the twentieth modification, the overall operating cost has risen exponentially.

Second is "The Great Toil Shift".
SonarSource's "State of Developer Toil Report" points out that 88% of developers feel the negative impact of AI on technical debt. Although 75% of people believe AI reduces the drudgery of coding, the proportion of their total time actually spent on "drudgery" has not decreased.
What happened? Because in the past, a programmer's drudgery was "handwriting boring boilerplate code"; now, the drudgery has become "reading and reviewing AI code with no pedigree, and managing mountains of technical debt."

In traditional development, the ratio of reading code to writing code is about 10:1. When AI increases the speed of writing code by 10 times, human programmers face a massive amount of sedimentary rock code not written by themselves. Once the cognitive load of humans is completely overwhelmed, the project will fall into the quagmire of "extremely fast first version launch, completely paralyzed maintenance phase."



## Three Eras of Shit Mountain Evolution Deduction

Because the cost of code generation approaches zero, software engineering in the next few years will experience severe geological movements. The accumulation speed of Shit Mountains will reach an extremely exaggerated level, and the industry predicts it will go through the following three stages:

### Phase 1: Bubble Hyperplasia Period (Now - 2028)
Code volume explodes directly by 10 to 100 times. A small team of 5 people can build a SaaS system in a week that previously required 50 people developing for half a year. The Shit Mountain is as tall as Mount Everest, but fortunately, it is still a loose pile of dirt. At this time, the most dangerous thing is not the rot, but the fanatical inertia of "as long as it runs." A PM will question: "AI finished it in three minutes, why do you need to spend three days refactoring?" Once the code breaks at this point, you can just `rm -rf` and have the AI regenerate it.

### Phase 2: Shit Mountain Collapse and Differentiation Period (2028 - 2031)
The first wave of systems piled up purely by AI "Vibe Coding" enters the deep maintenance phase. When encountering major version upgrades of dependency libraries or security compliance audits, teams will despairingly discover: no one can safely modify it at all.
Systems will polarize: one-off marketing pages or MVPs will be discarded directly when broken; while core infrastructure systems (banks, medical, underlying services) will become extremely conservative, issuing strict "AI Code Admission Passes," with architectural boundaries that must be signed off by humans. The middle ground that lives long enough but isn't important enough to rewrite will turn into a true "fossil layer."

### Phase 3: Shit Mountain Swallowed by Machines (After 2031)
Shit Mountains will not be cleaned up by humans, but will be taken over by more powerful repository-level "Archaeological AIs." Daily development will become: you issue a command in natural language to "upgrade the payment module from v3 to v5," and the Archaeological AI will spend 20 minutes scanning the entire sedimentary rock to draw a dependency graph, rewrite 12 files at once, and pass 8,000 auto-generated regression tests.
The Shit Mountain is still there, but it is compacted by tools and completely buried underground. Human work will completely float up to the semantic layer.



## Holding the Shovel Steady in the Sedimentary Rock Era

Before "that day" arrives when "Archaeological AIs" mature completely and take over the bottom layer, how do we survive in the sedimentary rock we created with our own hands? Relying purely on prompts cannot intervene in the increase of structural entropy; what can truly change the degradation curve is the reshaping of our engineering practices.

The most valuable engineers in the AI era are no longer the ones who write code the fastest, but those who can do "CT scans" for Shit Mountains. Here are four verified core rules:

* Establish a "Vibe, then Verify" Culture
  Allow developers to use AI to rapidly explore and build prototypes (Vibe), but before merging into the main branch, an extremely cruel automated verification framework (Verify) must be established. You must never give a pass just because it "looks fine" to the human naked eye. Force the integration of static analysis tools into CI pipelines to intercept blind spots.

* Move Testing Forward as the Only Combat Weapon (TDD)
  Always let AI write tests before writing code. In the face of constantly stacking sedimentary rocks, tests are the only anchors you have to determine system behavior. The core work of humans shifts to reviewing the intentions and boundary conditions of tests, firmly locking the non-deterministic AI into the deterministic test suite.

* Set Hard Architectural Boundaries and Micro-Operations
  Do not stuff massive requirements into AI all at once. Break down large requirements into extremely small micro-operations to induce AI to make reasonable module splits. Set insurmountable physical isolation for the codebase: for example, a single module must absolutely not exceed 500 lines, and core externally exposed API interfaces and domain models must be handwritten by humans. AI can mess around in the box all it wants, but the shit must never spill out of the box.

* Establish "Quarterly Archaeology Days" (Periodic Refactoring)
  Since cumulative degradation is unavoidable, interrupt it proactively. Every few versions of iteration, forcibly set aside a cycle for no new feature expansion. Throw the entire codebase to a strong model with an ultra-long context, let it draw a CT scan map of duplicate logic and dead code, and have humans command a one-time forced cleanup. This is equivalent to periodically compacting the loose dirt pile and resetting the complexity baseline to zero.



## The Death of Readability and the "Intent Architect"

If we stretch the timeline long enough, the speed at which AI generates code far exceeds the speed at which humans can read it. What is the endgame of software engineering? Will humans eventually completely abandon reading code?

The answer is: Yes. Humans will eventually give up "reading code line by line," but this by no means equals giving up control.

History is always strikingly similar. In the assembly language era, programmers had to understand every machine instruction; when C language and compilers appeared, humans gave up reading assembly and placed their trust in compilers. Today, large language models are becoming the new compilers, and natural language (structured Prompts) is becoming the new high-level programming language.

### Leaping to "Intent Architect"
The top developers of the future will evolve into "Intent Architects." You will no longer care about how a specific loop is written or how concurrent states are controlled. Your core job is: expressing intent. You define system boundaries, business constraints, performance goals, and safety guardrails.
Developers will become "Curators of Clarity," acting like governors commanding a massive and living software ecosystem. The traditional Code Review mechanism will completely die out, evolving into "Behavior Verification"—we no longer track Bugs in lines of code, but monitor test results and observe behavioral deviations.

### Magic Combats Magic: AI Supervises AI
To prevent AI from burying time bombs in black boxes, future software will be maintained by Multi-Agent adversarial systems:
* Generator Agents: Responsible for translating human intent into underlying code.
* Watchdog Agents: Continuously scan for performance drift and regressions in code.
* Adversarial Agents: Simulate hackers 24/7 to stress-test and mine vulnerabilities in the system.

In this network structure, AI writes code, other AIs verify and fortify code, and humans are responsible for coordinating the entire ecosystem.

### The Complete End of Code Readability
This leads to the most radical and inevitable outcome: the underlying source code of the future may be a bunch of completely unreadable Gibberish to humans.
If the only reader and modifier of the code is AI, then the various design patterns and naming conventions humans invented for maintainability might be seen as inefficient by AI. It might invent a code structure that is highly optimized and executes extremely fast, but is completely incomprehensible to the human naked eye.
This sounds terrifying, but just as you don't read compiler-optimized binary files by hand today, as long as you can harness it through high-dimensional intent, the underlying unreadability will be completely accepted.



In this astonishing paradigm shift, we will inevitably lose some things: the joy of manually shaping perfect logic, the satisfaction of playing with a line of subtle syntax, the meditative rhythm of solving problems through code, and the tactile intimacy between the lines of code.

But what we gain is the freedom to create complex systems in higher dimensions.