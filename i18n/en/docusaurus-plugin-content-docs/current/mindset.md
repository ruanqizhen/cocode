# The Programming Mindset in the Era of Large Models

> The mindset is the foundation of the moves.

We often see various impetuous promotions on the internet like "god-level prompts," "universal prompt templates," or "generate a whole App with one sentence." But after truly integrating AI deeply into your workflow, you will gradually discover that the core of human-AI collaboration is absolutely not "memorizing prompts."

For different problems and different contexts, the most effective prompts must be dynamically changing. So-called universal templates often turn into "snake oil"—they can be used everywhere, which means they are not very useful anywhere.

If we can shift our perspective and understand Large Language Models (LLMs) from the perspective of "system design," seeing clearly how they actually think, forget, and make mistakes, we can harness AI more efficiently and turn it into a true productivity lever.



## The Inside Story of LLM Operations

A large language model is essentially not an "electronic brain," nor does it have true autonomous consciousness. It is more like an extremely massive probabilistic prediction system. Everything it does is built upon one core underlying logic: "Based on the currently existing content, predict the next most likely Token to appear."

And the "sense of intelligence" we feel is actually an "emergent" result produced by this massive probability calculation on complex language structures.

### Token (Word Element)

A Token is the smallest unit of language in the world of large models. Inside a large model, it cannot directly understand language by "character" or "word" like humans do, but needs to dismantle all input into Tokens.

* In the English world: One word usually corresponds to $1 \sim 1.5$ Tokens (about 4 consecutive letters form one Token).
* In the Chinese world: The situation is slightly more complex. Early models usually took up $1 \sim 2$ Tokens for one Chinese character; but in modern large models optimized for Chinese today (such as mainstream domestic models and the latest open-source models), commonly used phrases, idioms, and even short sentences will be aggregated into one Token. In other words, a Chinese character takes up less than 1 Token.

### Context Window

The Context Window is essentially the information boundary that AI can currently "remember." It contains the code you sent, the historical chat record, and the AI's previous answers.

Although current models frequently advertise supporting "1M (million-level) Context" or even ultra-long context, the actual engineering performance is not as perfect as imagined. In long text processing, the famous "Lost in the Middle" phenomenon is still prevalent: models are most sensitive to the information at the beginning and end of the context, while the massive amount of content in the middle is easily diluted by the attention mechanism.

This is very similar to the state of humans reading long financial reports or technical documents: the first page and the last page leave the deepest impression, and the dozens of pages in between are forgotten right after reading.

Therefore, the information fed to the AI is absolutely not the longer, the better. To prevent the core logic from being diluted, we need to proactively control the context length and periodically reset the conversation to clear historical baggage. When necessary, we also need to use `README`, rule documents, or architecture summaries to "anchor" the model and repeatedly emphasize core constraints.

### Temperature Parameter

The Temperature parameter is a regulating valve that controls the creativity of the model's output. It controls not hot and cold, but the randomness of the output results:

* When `Temperature = 0`: The model will be extremely conservative, always choosing the Token with the highest probability and the most stability. This means that for the same input, the output result is deterministic and repeatable. This mode is most suitable for rigorous, certainty-emphasizing tasks like writing code, debugging programs, and running mathematical calculations.
* When `Temperature = 0.9`: The model will start to "let itself go" and is willing to try Token combinations that have a lower probability but are full of imagination. This mode is suitable for scenarios requiring divergent thinking, such as UI creativity, copywriting, and brainstorming.

Different temperatures determine completely different "working personalities" for the AI. In programming tasks, it is usually recommended to lock the temperature between $0 \sim 0.2$.



## The Boundaries of AI Capabilities

A large language model is a very typical "genius with partiality." Its performance in some areas is outrageously strong, but in some seemingly simple places, it is so fragile it makes you laugh.

### "Pattern Matching" Where AI Excels

During the training phase, LLMs devoured massive amounts of internet corpora, including countless open-source codes, technical documents, and standard tutorials. Therefore, it has extremely terrifying reproduction capabilities for "mature patterns."

For routine tasks that have been repeatedly implemented countless times by humans on the internet, such as implementing a small game, writing a data conversion script, or building a basic web login system, AI handles them with ease. You often just need one sentence, and it can generate hundreds of lines of structurally complete code in a few seconds. But this is not because it truly "understands" your business system, but because in the vast ocean of probability, it instantly matched the closest existing pattern.

### "Precise Reasoning" Where AI Struggles

Because LLMs are probability machines rather than logic machines, they are "predicting" a text that looks most like the correct answer, not rigorously deducing causal relationships.

When faced with tasks requiring a tight logical closed loop—such as deducing complex mathematical formulas, designing deep recursive logic, or building complex state machines—the AI's fragility is quickly exposed. More fatally, AI will never proactively admit that it "can't figure it out," but will fabricate facts by secretly replacing concepts and forcing continuation, talking serious nonsense.

:::tip Core Strategy
The truly efficient human-machine collaboration model should be: humans are responsible for setting the direction, setting constraints, and acting as referees; AI is responsible for moving bricks, writing boilerplate code, and doing physical labor.
In a team, you can treat the current AI as a Junior Developer with extremely strong execution and extremely fast hand speed, but absolutely do not blindly treat it as a completely trustworthy system architect.
:::



## Anatomy of Hallucinations

Hallucinations are the most criticized problem of large language models in the programming field. You may have experienced AI extremely sincerely recommending an npm package that doesn't exist at all, or affirmatively fabricating a certain framework's official API.

For example, the following typical "trainwreck" code:

```javascript
// Classic AI Hallucination: Seriously calling a non-existent API
const response = await aiModel.nonExistentSuperAwesomeFeature({
  ultraTurboMode: true
});

```

This code has standardized naming and elegant syntax, looking extremely professional. However, in the real world, this API simply does not exist.

### Why do hallucinations occur?

Because large models are not "looking up a dictionary" or "retrieving a database." As mentioned earlier, it is doing language continuation in a statistical sense.

If it finds a certain way of writing in your context prompt that "highly conforms to a certain excellent, mainstream API design style," it will follow this probability trend to complete the code, even if this API is purely fictional. To ensure the coherence of the text flow, it would rather bite the bullet and continue making things up than easily throw an "I don't know" exception. Hallucinations are the innate side effects of probability models.

### How to combat hallucinations?

As long as we are still using Transformer architecture models based on probability predictions, we cannot fundamentally "eliminate hallucinations" perfectly. In engineering practice, the only effective path to combat hallucinations is to establish a "verification system."

This requires us, after receiving a solution provided by the AI, to cross-verify it through means like running unit tests, consulting official standard documents, and static code checks. This is exactly why, in the era of large models, an excellent programmer's core competitiveness is no longer "making AI generate perfect code at once," but the ability to see through where AI is talking nonsense at a glance and possess the ability to quickly correct errors.



## The Leap of Thinking Paradigms

In the era of traditional programming, an excellent programmer's moat was often built on memory and proficiency: memorizing thousands of API interfaces and mastering the syntax details of various frameworks. At that time, the "muscle memory" of code itself was the core productivity.

However, the rise of AI is accelerating the reshaping of the underlying logic of this industry. In terms of memory capacity and retrieval speed, humans are simply no match for models, and the skill of "reciting APIs" is rapidly depreciating. The value chain of programming in the future has undergone a restructuring: "how to write" is becoming increasingly cheap, while "what to write" and "why write it this way" are becoming increasingly valuable.

* Past: Programmers were more like craftsmen, focusing on carving every brick and tile.
* Future: Programmers will be more like designers and directors.

The core work of programming is quietly leaping from "handwriting code line by line" to "organizing core logic, scheduling general intelligence, and managing the context environment." This is a profound and deep revolution of the thinking paradigm.



## Context Control Power

After you have intensely used AI programming in actual projects for a few months, you will inevitably reach a profound conclusion: purely studying isolated prompts is far from enough; what truly separates the superior from the inferior is "Context Control."

Whoever controls the context, controls the AI. Because all subsequent thinking and output of the model completely depend on the "ideological boundaries" defined by the current context. The content we feed the AI shouldn't just be an isolated command of "help me write a function," but should be a clearly structured "cognitive environment" that can be continuously maintained and dynamically updated.

Regarding how to precisely build and schedule this environment (including core context elements like README, project rules, naming conventions, etc.), we will conduct a comprehensive practical teardown in the following chapters.

Please refer to the subsequent dedicated chapter: [Context Engineering: Feeding Your AI](./context.md).