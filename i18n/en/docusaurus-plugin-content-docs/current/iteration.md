# Iteration and Continuous Verification

> "A journey of a thousand miles begins with a single step." — Laozi



In the previous chapter, we successfully launched our open-source e-book to the global network through GitHub and Cloudflare Pages. Seeing the exquisite static pages go live, you might breathe a sigh of relief.

But in the AI era, going live is not the end, but the starting point of continuous evolution.

Digital assets in a Web environment are "alive." Faced with the extraordinary generation speed of large models, the most common mistake made by development novices is having too big an appetite: trying to command the AI to fix 5 unrelated core files at once, or throwing the heavy responsibility of "rewriting the plot of the whole book, generating a cover, and refactoring the sidebar" at it all at once.

This extensive iteration method will lead to a disastrous logic collapse (Context Rot), ultimately trapping you in a long and desperate quagmire of manual debugging. This chapter will guide you to use the strict discipline of software engineering to carry out precise "engineering-level fine-tuning" and dynamic maintenance of digital assets after they go live.



## Do One Thing at a Time

The advanced reasoning accuracy of large models will drop sharply as the scale of a single generation increases. Therefore, when upgrading digital projects later, you must learn restraint.

### Micro-operations

Only solve a single, clear task point per interaction. Keep single code or text changes within a very small scope so that you can intuitively complete a `Git Diff` review with the naked eye in a few seconds.

Suppose we want to carry out comprehensive post-polishing and refined operation for the launched e-book project. If you directly issue a vague, all-encompassing instruction to the AI, it will inevitably lead to disaster:

* ❌ Negative case: "Help me thoroughly optimize this book. Fix the plot inconsistencies in it, add a good-looking cover by the way, write a preface, generate some funny comments from famous people for me, and also modify the data statistics function."
* 🟢 Positive dismantling (Micro-step rolling):
* Step 1 (Data Detoxification): Correct the numerical inconsistency error of the protagonist's ability in Chapter 3 exclusively through `@characters.md`.
* Step 2 (Feature Enhancement): Write a dedicated React preface component that supports click-to-collapse and expand.
* Step 3 (Visual Packaging): Use AI to extract cover design prompt words and embed the cover into the Docusaurus homepage.
* Step 4 (Marketing Gimmick): Have the AI take a specific perspective to generate a highly satirical or humorous "fake famous people comments section" for the project.





## Practical Exercise

Following the micro-operation dismantling above, we will directly implement four rounds of precise "refined iteration" on our e-book project through human-machine pairing on the spot:

### Data Detoxification (Fixing Hard Flaws of Text Inconsistencies)

In long-term serialization or large system iteration, "inconsistent settings" are the most feared. For example, Chapter 3 says the protagonist Xiao Shan has "Rule Perception Lv2", but by Chapter 12, due to AI forgetting, it inexplicably degenerates into "Lv1".

* Standard Breakthrough Action:
We do not blindly read the whole book, but use the "Long-Term Memory Infrastructure" from Chapter Two to precisely feed `knowledge/characters.md` and `docs/chapter12.md` to the tool, issuing a targeted instruction:
> "According to the standard settings in `@characters.md`, Xiao Shan has already upgraded to Lv2 after Chapter 8. Please check and correct the clerical error regarding his ability in `@chapter12.md`, only modifying the relevant conflicting paragraphs and keeping the rest of the text absolutely untouched."

After the first draft is generated, we must never allow the AI to "fly freely". Just as writing code requires running Lint and compilation checks, text content also needs a strict set of Regression Testing. Before writing a new chapter, we must introduce a set of cold "Physical Examination Test Prompts" to conduct gate-keeping proofreading on the content of the text:

🚀 Content Quality Inspection Prompt Template
```plaintext
# Role
You are a gold-medal web novel chief editor and text quality inspector, specializing in checking the rhythm, logical consistency, and satisfaction density of long stories.

# Task
Please conduct an in-depth audit of the following newly generated draft chapter, and you must output a vulnerability report from five core dimensions:

1. Setting Test: Are the rules consistent throughout? Are there any serious Bugs that deviate from the established public worldview (e.g., knowledge/world.md)?
2. Motivation Test: Are the protagonist's dialogues and actions consistent with their persona? Is there any serious OOC (Out of Character) caused by forcibly advancing the plot?
3. Foreshadowing Tracking: Are the foreshadowings planned to be laid or resolved in this chapter accurately landed? List the current unresolved hidden lines (referencing knowledge/mysteries.md).
4. Satisfaction and Hooks: Does the suspense Hook at the end have enough tension? Is the information gap of the face-slapping reveal effectively utilized by the protagonist?

Output Requirements: No need for lengthy praises. Please directly follow paragraphs with technical soft flaws with rich-text code blocks that can be directly used for Git local line-level replacement.

```
Through this text Testing defense line, conflicts in the data stream (such as contradictions in the setting's laws) will be ruthlessly intercepted and fixed on the spot before merging into GitHub, ensuring the solidity of the text logic during long-term evolution.

### Visual Packaging (AI-Driven Cover and Illustration Layout)

An e-book that can attract hardcore readers aged 18-35 must possess top-tier visual impact. We use AI to help us complete the closed loop from "design drawings" to "frontend embedding."

1. Generate Design Prompt Words (Midjourney/DALL-E 4):
We say to the AI: *"Based on the urban delivery rider, Cthulhu, and rule invasion style of 'The Dissipating End', generate a paragraph of English golden prompt words for an AI drawing tool for me."*
> AI Output: *"An urban cyberpunk cyberpunk street, a Chinese delivery rider standing under giant glowing eldritch neon signs, rule-怪谈 horror atmosphere, hyper-detailed, neon green and deep black twilight, 8k resolution, book cover composition --ar 3:4"*


2. Static Asset Merging:
Name the beautifully drawn picture `cover.png` and put it into the project's `/static/img/` directory.
3. Frontend Code Fine-Tuning:
Summon the AI-native IDE to modify the homepage component, rendering the cover image with an elegant frosted glass gradient effect at the top of the Docusaurus homepage.

### Component Enhancement (Writing an Interactive Dynamic Preface)

We want to add a "premium preface" at the beginning of the e-book, but in order not to interrupt the reading rhythm of old readers, this preface must be dynamically collapsible. Thanks to Docusaurus's React-driven properties, we can write MDX (Markdown + JSX) components directly in Markdown.

We command the AI: *"Please write a collapsible React preface component for me that conforms to Tailwind CSS aesthetics, requires smooth expansion/collapse animations and dark mode adaptation, and embed it directly at the top of `docs/intro.md`."*

The AI will quickly hand you a clean MDX asset, and your e-book will henceforth possess the interactive life of dynamic software:

```markdown
import { useState } from 'react';

export const CollapsiblePreface = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-solid border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800 my-4">
      <button onClick={() => setIsOpen(!isOpen)} className="font-bold flex items-center justify-between w-full cursor-pointer bg-transparent border-none text-slate-800 dark:text-slate-200">
        <span>📖 View Author's Preface: Creative Reflections in the Era of Large Models</span>
        <span>{isOpen ? '▲ Collapse' : '▼ Expand'}</span>
      </button>
      {isOpen && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          The book you are reading now is in itself an agile experiment of human-machine pairing. The human brain is responsible for outputting rough but real perspective notes, pithy quotes from stepping into pitfalls, and core soul; while AI is responsible for expanding, polishing, formatting, and static code highlighting...
        </p>
      )}
    </div>
  );
};

<CollapsiblePreface />

```

### Marketing Gimmicks (Forging a Humorous Famous People Comments Section)

To enhance the "satirical art" and attractiveness of our tech-refreshing novel, under the guidance of the `PRODUCT.md` specification, we can let the AI take the perspective of various absurd celebrities or fictional civilizations to arrange a set of high-EQ/low-EQ forged famous people comments sections for this book, presented in table format at the end of the e-book:

```markdown
## 🌌 Universe-Level Recommendation Letters: See What They Say

| Commentator Role | Recommendation Comment Level | True Star Rating |
| :--- | :--- | :---: |
| Trisolaran Civilization First Observer | "In this story, humans actually try to use code and food delivery orders to fight against high-dimensional narrative rules. This is absolutely not the behavior of bugs. It is recommended to immediately launch a dual-vector foil at it to show the highest respect." | ⭐⭐⭐⭐⭐ |
| Chaoyang District Delivery Riders Alliance | "Comrade Xiao Shan's experience perfectly explains why our deliveries sometimes time out. This is not due to traffic jams, but because the dispatch system was hot-updated by the Great Old Ones. A must-read for peers!" | ⭐⭐⭐⭐⭐ |
| Anonymous High-Dimensional Cthulhu Agent | "The tentacles of the text hide behind every HTML tag in Docusaurus. When I read Chapter 15, my indescribable perception directly triggered a browser `LocalStorage` overflow." | ⭐⭐⭐⭐✨ |
| Traditional Literature Research Expert | "Nonsense! This is simply not the way to write a traditional genre novel! But with fully automatic CI/CD automated deployment, its speed of updating and self-correcting makes me suspect the author is not human at all." | ⭐⭐⭐⭐⭐ |

```

This kind of gimmick content full of geek dry humor can not only instantly close the distance with modern young readers, but also naturally detonate readers' secondary meme-creation through the Giscus comment section.



## The TDD Revolution in the AI Era: Human-Machine Synced Testing Flow

In the process of continuously increasing efficiency for digital products, as more and more features are piled up, how can you guarantee that newly written code or components won't quietly break old features?

This requires the introduction of Test-Driven Development (TDD). In traditional development work, people often consider TDD to be too cumbersome and rigid because hand-writing test cases is extremely boring. But in the AI era, TDD has ushered in its golden nirvana: Humans set the contract, AI writes the tests, AI fills in the code.

### 🛠️ Practical Exercise: Using Vitest to Write and Verify a Word Count Tool

In our Markdown editor/e-book project, the bottom data statistics bar has a core of the core algorithm: accurately calculating the number of Chinese characters and generic characters in the text, and it must exclude spaces, punctuation, and Markdown syntax symbols.

#### Step 1: Human Defines Specification (Spec)

We need a pure calculation function `countChineseWords(text: string): number`.

* Pure English or number input: Returns `0`.
* Standard Chinese text: "你好 AI" → Returns `2` (Calculates Chinese characters only).
* Empty string or abnormal input: Returns `0`.

#### Step 2: Command AI to Write Unit Tests

We lock the context in the tool via `@Files` and input the task to the AI:

> "Please use TypeScript and the Vitest testing framework to write complete unit tests for the core specifications of the aforementioned `countChineseWords`, covering normal paths, mixed Chinese and English, Markdown tag pollution, and abnormal boundaries."

The AI quickly generates `parser.test.ts` locally:

```typescript
// parser.test.ts
import { describe, it, expect } from 'vitest';
import { countChineseWords } from './parser';

describe('countChineseWords Core Contract Test', () => {
  it('should correctly count the number of pure Chinese characters', () => {
    expect(countChineseWords('赛博朋克')).toBe(4);
  });

  it('should accurately filter out noise when Chinese and English are mixed and contain Markdown symbols', () => {
    expect(countChineseWords('# Hello 这是一个 强设定 网文')).toBe(8);
  });

  it('should gracefully return 0 when encountering pure English, spaces, or empty strings', () => {
    expect(countChineseWords('### Micro-stepping tips!')).toBe(0);
    expect(countChineseWords('   ')).toBe(0);
  });
});

```

#### Step 3: Run Tests, Welcome the Red Light (Red)

We run in the host terminal: `npx vitest run parser.test.ts`. Because we haven't implemented the specific logic of the `parser.ts` file at all at this point, the test unsurprisingly blows up red (red light).

#### Step 4: Feed the Red Light Error to AI, Forcing Business Code Implementation

We stuff the red-hot test file along with the error message back to the AI:

> "This is the unit test contract that just blew up red. Now please implement the specific core algorithm of `parser.ts` for me until it completely passes all the tests above. Note: You are absolutely not allowed to modify my test file to cheat."

Under the constraints of the strict test contract, the AI spits out high-purity business implementation code:

```typescript
// parser.ts
export function countChineseWords(text: string): number {
  if (!text) return 0;
  
  // 1. Roughly filter out standard Markdown level 1 and 2 headers and bold symbol noise
  const cleanText = text.replace(/[#*`>_\-\[\]\(\)]/g, '');
  
  // 2. Use regular expressions to precisely match the global range of Chinese characters
  const chineseMatches = cleanText.match(/[\u4e00-\u9fa5]/g);
  
  return chineseMatches ? chineseMatches.length : 0;
}

```

#### Step 5: Retest, Welcome the Green Light (Green)

Hit run test again in the local terminal, all green lights are on! With this TDD safety net, no matter how the large model tinkers or expands features in the future, as long as this green light doesn't go out, you have 100% underlying control over the core logic.

---

## Automated Checkpoint Verification

When large models are frantically generating components or code changes at high frequency, due to subtle hallucinations, they may make low-level technical errors like spelling mistakes or missing types. You should not let these hidden dangers accumulate until the final release stage to troubleshoot. Instead, immediately after saving each Micro-operation change, run a high-frequency checkpoint verification in the local terminal:

```bash
# Recommended to hot-run frequently in IDE terminal or Git pre-commit hooks
pnpm typecheck && pnpm lint

```

* TypeScript Type Guard: Let `tsc --noEmit --watch` keep hot-listening in the background. As long as the large model writes an Optional Property wrong in a component or gets the input parameter contract wrong, the compiler will sound an alarm within milliseconds. You only need to feed this original terminal error back to the AI to achieve precise correction within 3 seconds.
* Formatting and Static Code Guard: Use Prettier and ESLint for forced correction, eliminating AI's bad little writing habits (such as chaotic alternating use of double and single quotes, redundant blank lines) completely at the local saving stage, ensuring the main Git tree is absolutely tidy.




