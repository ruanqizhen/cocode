# Node.js and npm

> "Mighty oaks from little acorns grow." — English Proverb

Before learning Claude Code, almost all of us run into a command like this:

```bash
npm install -g @anthropic-ai/claude-code
```

For developers coming from Python, Java, or C++, this line looks a little unfamiliar.

Why isn't it `pip install`? Why isn't it a downloadable installer? Why would Anthropic distribute a heavyweight AI agent through Node.js, an ecosystem originally tied to JavaScript?

To answer that, we need to meet two names first: Node.js and npm.

They are not the main characters of Claude Code, but they are the infrastructure that keeps the whole AI toolchain running. Understanding them is not about becoming a front-end developer; it is about understanding why modern AI programming tools adopted today's architecture.

## Node.js

When most developers first encounter JavaScript, they treat it as a scripting language for web pages.

Historically, that impression was accurate. For a long time, JavaScript could only run inside the browser. It handled button clicks, page animations, and form validation, but it could barely touch the operating system itself: it could not read local files, launch other programs, or write server programs like C++ or Python.

In 2009, an engineer named Ryan Dahl changed all that.

At the time, the newly released Google Chrome shipped with a high-performance JavaScript engine — V8. Dahl did something seemingly simple but far-reaching: he took V8 out of the browser and wrapped it with low-level interfaces to the operating system, including the file system, networking, and process management.

The result was **Node.js**.

From that moment on, JavaScript was no longer confined to the browser; for the first time it could run directly on top of the operating system.

To be clear: Node.js is **not** a new programming language. It is just a JavaScript runtime. The language is still JavaScript, except that it finally stepped out of the browser and gained real access to the operating system.

## Why Is Node.js So Popular?

Node.js succeeded not only because it lets JavaScript write server programs, but because it is naturally suited as a runtime for developer tools and automation.

### High-performance V8 engine
It runs JavaScript directly on the V8 engine from Chrome. V8 compiles code just in time (JIT) to machine code instead of interpreting it line by line, so it runs efficiently. For command-line tools, that means faster startup and better execution performance.

### A natural fit for I/O-heavy work
What really sets Node.js apart is not speed, but how it handles input/output.

Look closely at an AI agent like Claude Code: it spends little time on heavy computation. Most of its time is spent **waiting**:
waiting for the disk to return a file, waiting for Git to return a result, waiting for the network, waiting for a test run to finish.

With a traditional synchronous model, every wait stalls the whole program. Node.js uses an event loop and non-blocking I/O: while waiting for one task to finish, it can keep working on others, so it can juggle many files, network connections, and child processes without one slow disk read or network delay freezing everything.

### Good cross-platform support
Node.js has another important advantage — cross-platform support.
Whether it is Windows, macOS, or Linux, the same JavaScript code runs almost unchanged. Developers do not need to maintain separate versions per operating system, so a tool like Claude Code can cover almost every development environment.

## Node.js and Claude Code

Once you understand Node.js, it is easy to see why Claude Code chose it.

Many people assume Claude Code is a standalone program compiled from Go or Rust. In fact, it is essentially a large application running on Node.js.

When you type in the terminal:

```bash
claude
```

what really starts is a Node.js process.

That process then scans your whole project directory, analyzes the source structure, reads the Git repository state, runs tests or build scripts as requested by the model, and even modifies files on disk. At the same time, it keeps a long-lived connection to Anthropic's servers to receive the model's streaming output.

Almost all of these capabilities rest on the low-level interfaces Node.js provides:
- File reads and writes come from the `fs` module.
- Launching external programs like Git, Python, or npm relies on `child_process`.
- Network communication is handled by the HTTP-related modules.

In short, the AI model does the thinking, while Node.js carries that thinking out on your computer.

Anthropic chose Node.js not because JavaScript is more advanced, but because it already offers mature file-system interfaces, good cross-platform support, and a huge open-source ecosystem. Building on the Node.js community lets the team focus on the AI agent itself instead of reimplementing a whole toolchain.

## npm: the software center of the Node.js world

If Node.js is the engine that runs programs, **npm** (Node Package Manager) is the software center of the Node.js world.

Its role is much like Python's `pip`, Rust's `Cargo`, or Java's `Maven`.
When developers finish a tool, they publish it to the central npm registry. Everyone else can then download, install, and resolve dependencies and versions with a single command, without copying files by hand or configuring complex environments.

After more than a decade, npm has accumulated millions of open-source packages, making it one of the largest open-source registries in the world. Today, many command-line tools, including Claude Code, are published to developers this way.

This deconstructs the mystery of the installation command:

```bash
npm install -g @anthropic-ai/claude-code
```

- `npm`: Invokes the Node Package Manager binary.
- `install`: The execution directive.
- `@anthropic-ai/claude-code`: The scoped, unique namespace of the application in the registry.

The most notable part is the `-g` flag, which stands for Global.

By default, npm installs a package into the current project directory, for that project only. A global install instead puts the program into the system-wide directory and adds it to the PATH, so no matter which folder you are in, typing `claude` lets the OS find and launch it.

That is also why most command-line developer tools use a global install.

## Installing Node.js

To run Claude Code, first install Node.js locally.

If this is your first time with this ecosystem, the simplest path is to download the installer from the official Node.js website. The install works like ordinary software — just keep clicking "Next". It sets up Node.js, npm, and the PATH for you, which is enough for most people.

If you often maintain multiple projects that need different Node.js versions, a version manager such as **fnm** (Fast Node Manager) is recommended. It lets you keep several Node.js versions side by side and switch quickly without reinstalling, which is why many professional developers prefer it.

Either way, after installing, reopen the terminal and verify with:

```bash
node -v
```
(If the terminal prints a version number such as `v22.15.0`, Node.js is installed.)

Then run:

```bash
npm -v
```
(If it prints a version number such as `10.9.2`, the whole runtime is ready.)

At this point your computer is connected to the global JavaScript open-source ecosystem and has everything needed to run Claude Code.

## Do I Need to Learn JavaScript to Use Claude Code?

No.

Installing Node.js does not mean you must learn JavaScript. For most Claude Code users, Node.js is just a runtime — much like installing Python does not mean studying how the Python interpreter is implemented.

As long as Node.js is installed correctly, Claude Code runs. If you already write JavaScript or TypeScript, Node.js gives you more ways to extend Claude Code; but if you work in Python, Go, Rust, Java, or C++, you can simply treat it as underlying infrastructure.
