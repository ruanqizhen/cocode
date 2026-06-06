# 上下文工程

> 大模型没有记忆，你提供给它的上下文，就是它灵魂的全部。

在上章中，我们达成了一个核心共识：决定最终开发体验的胜负手，往往不是大模型本身的原始智力，而是编程工具的底座框架（Harness）。而 Harness 拆解到最底层的核心战术任务，其实就是对动态信息流进行精准的精细化调配。

这门学问，在 AI 时代被称为上下文工程（Context Engineering）。

在网页端写代码的尝试中，你可能曾花费半个小时精心打磨一段长长的提示词（Prompt），期望 AI 助手为你生成一段完美无瑕的代码。但如果你的项目稍微复杂一点，这种尝试多半会以失败告终。这并不是因为模型太笨，90% 的 AI 编程失败，根本原因都在于输入给它的上下文极度匮乏、模糊或充满噪音。 决定 AI 编程能否生成生产级代码的关键，早已不再是遣词造句的“提示词工程”，而是作为基础设施的“上下文工程”。


## 什么是上下文工程？

著名 AI 研究员 Andrej Karpathy 曾为上下文工程给出了一个被广泛引用的经典定义：

> “上下文工程是一门精妙的艺术和科学，它旨在为下一步操作向上下文窗口中填充恰到好处的信息。” —— Andrej Karpathy

如果把大型语言模型（LLM）比作高速运转的 CPU，那么它的上下文窗口（Context Window）就是其 RAM（内存）。正如操作系统必须精心管理 RAM 中加载的活动进程与数据一样，开发生态也必须精心策划 AI 在生成当前行代码时所能看到的所有周边信息。

### 上下文工程 vs. 提示词工程

为了厘清两者的本质区别，我们可以通过以下多维度矩阵进行对比：

| 维度 | 提示词工程 (Prompt Engineering) | 上下文工程 (Context Engineering) |
| --- | --- | --- |
| 核心关注点 | 如何遣词造句，侧重于指令的表达文本与语气 | 模型在当下知道什么，侧重于知识包的供给与纯度 |
| 操作性质 | 静态的、一次性的任务描述与模板定义 | 动态的、交互迭代式的信息系统网格管理 |
| 解决的痛点 | 意图表达不清，生成方向偏离预期 | 代码幻觉、脱离项目实际的“空中楼阁”代码 |
| 适用场景 | 单功能函数生成、通用算法问答、文本格式化 | 复杂项目重构、跨多文件业务编排、Agent 持续循环 |



## 为什么我们无法脱离 AI 编程工具谈上下文？

既然上下文如此重要，人类开发者能否通过“纯手工”的方式，在网页端给大模型做上下文工程？答案是：在工业级开发中，这完全是一场效率灾难。这正是现代 AI 编程工具存在的必要性所在。

走向“手工投喂”的对立面，AI 编程工具在上下文工程中扮演着以下三大不可替代的角色：

1. 突破人类的“感知极限”与“算力局限”：一个中型项目可能包含几百个文件，复杂的抽象语法树（AST）和错综复杂的双向依赖关系。人类手工只能靠直觉复制两三个相关的代码文件塞给网页端。而 AI 工具能在后台默默扫描上万行代码，找出人类想不到的间接依赖项。
2. 实时捕获“瞬时态”的上下文开销：代码在修改过程中引发的编译器连锁反应、Linter 报错或单元测试挂掉，需要手动去终端复制报错日志，再手动粘贴回网页。而 AI 编程工具直接驻留在宿主或终端环境里，能实时监控这些变动，实现本地自愈闭环。
3. 精准实施 “Token 经济学”：如果一股脑把整个项目丢进网页端，不仅会引发高昂的账单开销，更会导致模型产生严重的“迷失与降智”。AI 工具（Harness）通过自研的裁剪算法，确保发送给模型的每一个 Token 都拥有最高的“含金量”。



## 三大主流工具的上下文抓取机制剖析

在面对同一个开发项目时，Cursor、Claude Code 和 Google Antigravity 这三款极具代表性的工具，其底层的上下文收集与组装哲学大相径庭。理解它们各自的底层抓取机制，才能做到精准投喂：

### 1. Cursor：基于 GUI 视角的“靶向投喂与局部 RAG”

Cursor 代表了经典的“AI 原生 IDE”流派，它高度依赖用户的视觉引导与本地向量索引：

* `@Files`（精准靶向）：直接读取指定文件的全部文本，以最高优先级注入 Prompt 顶部。Token 最省，相关性最高，是高频重构的首选。
* `@Codebase`（智能搜索）：通过本地向量嵌入（Embeddings）进行 RAG 检索，自动匹配并提取与当前问题语义最相关的几段代码碎片。
* 特点：极为直观，完全由开发者在界面上通过 `@` 符号来手动构建信息边界，配合后台小规模 RAG 查缺补漏。

### 2. Claude Code：基于 CLI 视角的“工具自主探索（Tool-driven）”

作为完全运行在终端的 Agent 异类，Claude Code 没有花哨的 UI 面板，它将上下文的收集权几乎完全交给了模型自己：

* 按需感知：当你提出一个任务时，Claude Code 不会盲目去做全库 RAG，而是通过其集成的 `grep_search`（全局搜索）、`locate_files`（定位文件）和 `view_file`（查看文件）等专属工具，像一个真正的人类极客一样，在你的终端里翻阅代码，自己决定把哪些文件加入当前的上下文。
* 特点：无需人类费心去 `@` 文件。你只需要说出目标，它会自己在终端里把相关的上下文“侦察”出来。

### 3. Google Antigravity：基于超级长文本的“全量常驻与原生索引”

作为深度绑定 Gemini 生态的原生并发 IDE，Antigravity 走的是一条极其奢华的“大内功”路线：

* 全量吞噬：依托 Gemini 动辄百万级的原生超长上下文窗口（Long Context Window），Antigravity 倾向于将整个项目的所有核心文件、语法树（AST）和全量文档直接常驻在模型的常驻内存（KV Cache）中。
* 特点：由于窗口极大，它几乎不需要做激进的代码剪裁。对它而言，整个项目就是随时可调用的上下文，跨文件的大规模联合重构不需要人类精心挑选边界。



## 经典实战对比：Poor Context vs. Rich Context

为了切身感受到 AI 编程工具通过上下文管理带来的工业级质量跃迁，我们现场模拟一个真实后端开发任务：“在 Express 框架中编写一个用户注册（Register）路由函数”。

### ❌ 场景 A：极度贫瘠的上下文 (Poor Context) —— 传统网页端瞎猜模式

开发者在对话框中直接草率输入：

> “帮我写一个 Express 的用户注册接口函数。要能保存用户，密码要加密。”

由于缺乏工具层对本地项目基建的扫描，AI 在完全不知道项目任何架构细节的“信息荒漠”中，只能凭借互联网公开语料的“概率平均值”盲猜写出以下代码：

```javascript
// AI 盲猜生成的泛化代码
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./models/User'); // ❌ 盲猜的文件路径

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // ❌ 盲猜的加密算法
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: 'User created' });
  } catch (error) {
    return res.status(500).json({ error: error.message }); // ❌ 粗暴的局部脏捕获
  }
});

```

#### 致命缺陷分析：

1. 数据库断层：AI 盲猜你用的是 Mongoose(MongoDB)，但你的项目工程实际使用的是 Prisma 配合 PostgreSQL。这段代码丢进项目直接导致编译挂掉。
2. 逻辑重复与安全隐患：密码哈希它引入了新的 `bcrypt` 包，而你项目团队内部明明在 `src/utils/crypto.ts` 中统一封装了更安全的 `scrypt` 加密算法。
3. 架构污染：它写了简陋的 `try-catch` 并直接向客户端返回原始错误，彻底绕过了你精心编写的全局统一异常拦截器。



### 🟢 场景 B：精准富集的上下文 (Rich Context) —— 三大工具实战流

我们希望 AI 严格复用项目现有的 `schema.prisma`（数据库定义）、`authValidation.ts`（输入校验）、`crypto.ts`（加密工具）和 `errorHandler.ts`（全局错误处理器）。

看看在三大主流工具中，我们如何优雅地为其构建高纯度的认知沙盒：

#### 方案 1：在 Cursor 中进行 GUI 精准点杀

开发者在 Cursor 的 Chat 面板或 Composer 模式下输入：

> “请帮我编写用户注册的 API 接口函数。严格复用项目现有的模块，禁止引入新的加密包：
> * 数据库契约：`@schema.prisma`
> * 校验规则：`@authValidation.ts`
> * 加密工具：`@crypto.ts`
> * 错误拦截：`@errorHandler.ts`
> 确保通过错误处理中间件安全抛出异常。”
> 
> 

#### 方案 2：在 Claude Code 中下达模糊战略指令

由于 Claude Code 是具备强工具操控能力的 CLI Agent，你不需要在终端里费力去定位这些文件的路径，直接敲入命令行：

> `claude "编写用户注册的 API 接口函数。你需要在项目中自己找出数据库 schema 定义、登录校验契约、我们自研的加密工具类以及全局错误处理器，严格复用它们，不要引入任何新的第三方加密包。"`
> *（此时终端会疯狂闪烁，Claude Code 会自动调用 grep 搜索 `prisma`、`crypto` 等关键词，自主把这四个文件读进自己的上下文窗口，完全不需要人类手动拖拽文件。）*

#### 方案 3：在 Google Antigravity 中利用“全局Pin”与超长上下文

在 Antigravity 界面中，得益于 Gemini 极度夸张的百万级长文本缓存，你甚至不需要精细挑选。你可以直接在侧边栏右键将核心的 `src/utils/` 和 `prisma/` 文件夹拖入 “Context Pin（上下文常驻区）”，然后直接在内联对话框输入：

> “基于我们常驻的系统基建规范，编写用户注册的 API 接口函数，确保完美融入现有的架构哲学。”



无论使用上述哪一种工具流，AI 在获取了充足、精准的上下文后，最终写出的都是达到“零修改、直接上线”标准的工业级代码：

```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prismaClient'; // ✅ 精准复用项目现有的 Prisma Client
import { validateRegisterInput } from '../utils/authValidation'; // ✅ 严格遵守项目的输入校验契约
import { hashPassword } from '../utils/crypto'; // ✅ 精准调用项目的专有加密算法
import { AppError } from '../middlewares/errorHandler'; // ✅ 融入全局统一错误处理器

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. 严格使用全局校验机制
    const { error, value } = validateRegisterInput(req.body);
    if (error) {
      throw new AppError(400, `输入校验失败: ${error.message}`);
    }

    const { email, password, nickname } = value;

    // 2. 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError(409, '该邮箱已被注册');
    }

    // 3. 复用项目中统一的哈希函数
    const hashedPassword = await hashPassword(password);

    // 4. 精准持久化写入
    const newUser = await prisma.user.create({
      data: { email, passwordHash: hashedPassword, nickname },
      select: { id: true, email: true, nickname: true, createdAt: true }
    });

    return res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error); // ✅ 绝不在局部做脏捕获，安全抛给全局中间件
  }
}

```


## 规模化对抗：长会话崩塌与“上下文腐烂”

在人机协作开发中，还有一个悄无声息的隐性杀手叫做“上下文腐烂”（Context Rot）。当你在同一个会话内与 AI 连续对话超过一个小时，积攒了数十上百轮的历史消息后，你会发现 AI 开始变得丢三落四、反应迟钝。

### 为什么超长的上下文会导致模型“降智”？

1. 迷失在中间（Lost in the Middle）：即使模型声称支持 100 万的 Token 窗口，当实际填充量增大时，其对中部（Middle）信息的提取召回率会呈现指数级下降。你的核心指令很容易被淹没在漫长的历史废话中。
2. 负面记忆污染：在长会话调试过程中，你和 AI 一起尝试过、但最终被抛弃的错误改动思路和排错报错，依然残留在历史消息中，严重干扰 AI 当前的推理路径。

### 🛠️ 黄金法则：在不同工具中另起炉灶的艺术

在日常高频开发中，对抗上下文腐烂最朴素、最高效的习惯就是“不要在一个会话里养老”。一旦发现 AI 开始出现理解偏差或反应变慢的苗头，毫不犹豫地开启一个全新的、干净的会话！

* 在 Cursor 中：果断按下 `Ctrl/Cmd + N`，关闭老 Chat，在新窗口中直接 `@register.ts` 喂入切片状态：“这是刚才写好的最新代码，我们在这个基础上开发下一个登录接口。”
* 在 Claude Code 中：在终端直接输入 `/compact` 强制触发音轨剪枝与历史摘要，或者直接输入 `/exit` 退出，重新敲击 `claude` 开启干净的进程。
* 在 Google Antigravity 中：利用其 Tab 隔离机制，一键清空当前的虚拟推理会话沙盒，重新一键挂载基础上下文。


## 落地指南：构建适合 AI 阅读的上下文基础设施

作为新时代的软件工程师，你的核心工作正从“自己手写每一行代码”演变为“为 AI 编排完美的生产环境”。你必须在你的项目工程中建立一套对 AI 友好的上下文基础设施：

### 第一步：建立项目级“全景透视图”

在项目根目录下，维护以下三个标准的、面向机器阅读的 Markdown 文档：

* `PRODUCT.md`：核心业务愿景、主要用户链路与功能边界。（让 AI 知道我们在做什么）。
* `ARCHITECTURE.md`：项目的系统分层、技术栈选型版本、数据流向设计。（让 AI 知道我们怎么做）。
* `CONTRIBUTING.md`：日常开发环境配置、Linting 规范、单元测试编写标准。

### 第二步：编写高可执行力的机器规则文件

根据你团队选选用的主流兵器，在根目录下配置对应的规则声明文件。记住，不要写成含糊、带有感性色彩的人类散文，必须是具体的、条件触发的、可验证的操作指令：

* 如果你是用 Cursor：创建 `.cursorrules` 文件。
* 如果你是用 Claude Code：创建 `.claudecode.json` 或在项目说明中配置系统级说明。
* 如果你是用 Google Antigravity：创建 `.antigravity/rules.json` 工作区规范。

> 🟢 高可执行力规则示例：
> “当需要处理接口报错时，禁止在当前函数中使用局部 `try-catch` 块拦截。必须显式抛出 `AppError`，或通过 `next(error)` 传递给全局错误拦截器。每次修改业务逻辑文件后，必须自动运行 `npm run test` 进行可用性对齐。”

### 第三步：面向 KV 缓存友好的 Prompt 设计

如果你正在基于大模型 API 自研团队专属的智能 Agent 系统，务必注意键值缓存（KV Cache）的优化。保持系统提示词（System Prompt）前缀的绝对稳定。切忌在 System Prompt 开头注入诸如动态当前时间戳、随机 Session ID 等高频变动变量。这会导致大模型底层的 KV 缓存机制完全失效，让你的首字生成时间（TTFT）与长上下文推理的 Token 成本飙升 10 倍以上。
