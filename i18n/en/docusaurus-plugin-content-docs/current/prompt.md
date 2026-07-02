# Prompt Engineering

> "The difference between the almost right word and the right word is really a large matter—it's the difference between the lightning bug and the lightning." — Mark Twain

When we first start using AI for programming, we all go through a phase where we just say directly to the AI: "Help me write a login system."

Then the AI generates a whole bunch of code... we run it... get an error... modify it... get another error...

Some people reach this stage and conclude: "AI is no good at writing code."

But in fact, there are ways to make AI do a better job.

This is just like telling a newly joined intern, "Help me make a login system." There's a high probability they won't know exactly what you want either.

They will be confused: Is it an email login or a phone number login? Do you need a CAPTCHA? Should the password be encrypted? Do you support password recovery? Do you need an admin backend?

If the requirement is unclear, the AI can only guess blindly, and the result will be very random.

The essence of Prompt Engineering is actually an art of communication; it helps us accurately convey the ideas in our minds to the AI.


## Reject Vague Instructions

As in the example above, if the instructions given to the AI are vague, the AI can only guess. If it guesses correctly, it's luck. Guessing wrong is the norm.

In an engineering context, a high-quality instruction usually has three characteristics: clear, specific, and constrained.

### Clarity

First, you must tell the AI what the ultimate goal is. Don't make the AI guess.

For example, "I want to improve the performance of this function" is a vague expression. Because the AI has no idea whether you think it runs slowly, consumes too much memory, or makes network requests too frequently.

A clear expression should be like this: "This function takes more than 3 seconds to process 100,000 records. Please analyze the time complexity and optimize it to O(N) by reducing redundant traversals and memory allocations."

The clearer the goal, the easier it is for the AI to generate results that meet our expectations.

### Concreteness

This is a very non-specific request: "Help me connect to the database." The AI doesn't know which solution to use to connect.

To clearly describe the problem, in addition to the goal, we must also tell the AI:

* What the input is;
* What the output is;
* What technology to use;
* What environment to run in.

For example:

"Use the Supabase JavaScript SDK. Input a user ID. Query the profiles table. Return the avatar_url field. Write in TypeScript."

Only when these specific requirements are given to the AI is it less likely to go astray.

### Constraints

Often, besides telling the AI what to do, you also need to tell it what not to do.

For example:

- "Forbidden to use third-party libraries."
- "The `any` type is not allowed."
- "Do not modify the original code; write a new set of functions for the new feature."

These constraints seem inconspicuous, but they can greatly reduce the probability of the AI generating deviations. Experienced developers often spend more space describing constraints than the feature itself. Because everyone can implement features. What's truly difficult is implementing features under constraints.


## The Golden Formula in AI Programming

If a prompt is too short, it's very easy for it to be not clear and specific enough, but longer isn't always better either.

An excellent prompt usually consists of four parts:

- Context
- Goal
- Constraint
- Output

For example:

```text
Context:
I am developing a single-file HTML to-do list tool.

Goal:
Support adding, deleting, and completing tasks.

Constraint:
Not allowed to use any third-party libraries.
Must use LocalStorage to save data.
Adapt to mobile browsers.

Output:
Provide the complete HTML file directly.
```

You will find:

When the information structure is clear, even if the prompt is not long, the quality of the AI's output will improve significantly.



## Context + Instruction Pattern

This is the most commonly used prompt pattern in software development.

Simply put:

First, tell the AI what the current environment is.

Then, tell the AI what to do.

For example:

```markdown
# Context

The current project uses Node.js + Express.
We are developing a user system.

# Instruction

Please write a function to generate a JWT Token.

# Constraint

The Token is valid for 7 days.
Need to handle exception scenarios.
```

This is like taking a new colleague on a tour of the office before assigning them tasks.

If you don't even mention the project background, it's easy for the AI to come up with a solution that is incompatible with the actual environment.



## Few-Shot: Show the AI Examples

Often, instead of spending a long time explaining, it's better to just give an example. This is the core idea of Few-Shot (few-shot learning).

Suppose your team has a unified API response format:

```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

Then, rather than explaining the formatting rules at length, it's better to directly tell the AI: "Please strictly follow the style of the following example when writing subsequent interfaces." And then paste a standard case. The AI will often instantly understand your intent.

This method is very effective for code styles, page designs, article writing, and game interfaces. Often, the value of an excellent example exceeds a thousand words of explanation.


## Role Pattern: Give the AI an Identity

The AI will automatically adjust its answering style based on the identity setting.

For example:

When you separately tell the AI: "You are a frontend architect with ten years of experience" and "You are a strict software security audit expert," the answers you get are often completely different. The former focuses on engineering implementation, while the latter focuses on vulnerability risks.

Therefore, when we are making web games, we can say: "You are a senior arcade game designer"; when writing a personal homepage, we can say: "You are a top UI/UX designer"; when troubleshooting Bugs, tell the AI: "You are an experienced system debugging expert."

A good role setting is equivalent to helping the AI put on a specific pair of glasses.



## Deep Conversation: Do Not Frequently Start New Sessions

If you are not satisfied with the AI's answer, immediately opening a new chat window and starting over often reduces efficiency. Because the AI will lose all the context it has accumulated previously.

A more efficient method is to provide continuous feedback in the current conversation, directly telling the AI what you are not satisfied with, such as "The button style is nice, but it's too big", "The function is normal, but the layout is misaligned on mobile," or "This solution is feasible, but the performance is still not good enough," etc.

This process of continuous feedback is essentially iteration in software development. The AI will gradually approach the goal in your mind.



## Learn to Enter "Diagnostic Mode"

If the program generated by the AI throws an error, don't just ask "Why doesn't it run?"

Because this is a very difficult question for the AI to answer. The AI likely cannot directly see the program running.

A more effective way to ask is to feed back all the information you see to the AI, such as:

```text
Phenomenon:
After clicking the button, the page goes blank.

Error:
Uncaught ReferenceError:
userList is not defined

Troubleshot:
API is normal.
Database is normal.

Please analyze the three most likely causes,
and tell me how to verify them.
```

These types of questions usually yield extremely high-quality answers. Because you have given the AI enough information to reason, rather than letting it guess out of thin air.


## The Ultimate Secret of Prompts

Many articles like to describe prompt engineering as a mysterious technology. As if mastering a few special spells can make the AI instantly ten times stronger.

In fact, this is not the case. Truly excellent prompts are not complex. They simply reflect a simple principle: "Treat the AI as a smart, hardworking, but non-mind-reading intern."

Don't expect it to guess your intent. Don't assume it understands your background. Don't think it knows your preferences. Explain the requirements clearly. Clarify the goals. List the constraints completely. Describe the problems accurately.


Prompt engineering is not about learning how to communicate with machines. It is about learning how to express one's thoughts more accurately. And this ability, with or without AI, is one of our most valuable abilities.


For a mini-program, the methods we learned earlier are basically enough to cope. But for a slightly more complex project, even if it only contains two or three files, using the above methods is often not enough. We need to use specialized programming tools to help us develop projects.