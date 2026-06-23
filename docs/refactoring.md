# 代码重构

> 写新代码是享受，啃旧代码是修行。AI 时代，我们终于拥有了降服“屎山代码”的重装武器。

无论你是在编写精密的 Python 数据处理脚本，还是在构建高并发的 TypeScript 后端服务，软件开发中都绕不开一个宿命：对抗“软件熵增”。每次为了赶进度打的补丁、每个临时的 Hack、每个绕过设计的特例，最终都会凝结成庞大的技术债务。

重构（Refactoring），即在不改变外部行为的前提下改善内部结构，是降低系统认知负荷、为新功能铺路的唯一解药。而在 AI 时代，我们不再需要徒手挖掘这些代码遗迹。大语言模型（LLM）的介入，彻底重塑了代码生成与遗留系统改造的工程范式。



## AI 辅助重构的双刃剑

在将数百行晦涩代码直接丢给 AI 之前，我们必须诚实地面对这位“赛博结对程序员”的能力边界。AI 并不是魔法，它是一位极度聪明但毫无项目历史背景的超级实习生。

### 核心优势

- 极大降低理解成本：AI 能在几秒内解释一段几百行的祖传函数，将新人理解代码的时间从数周缩短至几小时。
- 跨文件模式识别：迅速发现散落在代码库各处的重复逻辑和不一致的命名模式，这是手工搜索难以企及的。
- 高效构建安全网：AI 非常擅长为现有代码生成特征测试（Characterization Tests），这是安全重构的绝对前提。

### 致命盲区

- 缺失“制度记忆”：AI 不知道某段看似多余的日期校验，是因为三年前某个大客户的特殊要求。它可能会“理性地”删掉关键业务逻辑。
- 自信的错误：AI 极易生成看起来非常优雅、专业，但悄悄调用了不存在 API 或破坏了边缘情况的代码。
- 大规模任务易崩塌：当要求 AI 同时进行架构调整、重命名和逻辑优化时，它的指令遵循质量会急剧下降，引发静默的行为改变。

核心原则：在重构中，AI 永远是副驾驶，你必须死死握住业务逻辑和架构决策的方向盘。



## 提效基建：用 AI 快速催生样板代码

在任何商业项目中，都充斥着大量缺乏创造力但必须编写的基础脚手架代码。这类确定性极强的工作，是 AI 发挥速度优势的绝对统治区。

你可以直接输入核心模型定义（例如一段 Prisma Schema）：

```prisma
model Product {
  id        String   @id @default(uuid())
  name      String
  price     Decimal
  stock     Int
  createdAt DateTime @default(now())
}

```

随后下达高强度的生成命令：

```text
基于上述 `Product` 模型，使用 NestJS 规范，自动生成完整的 `ProductController`、`ProductService` 和 `CreateProductDto`。强制要求对所有输入数据进行验证，并使用 `PrismaService` 进行读写。
```

AI 可以在数秒内完美吐出符合规范的高质量骨架代码，为你省去半天的枯燥敲击，让你将精力集中在核心业务逻辑的设计上。



## 面条代码的模块化重构

遗留代码最大的毒素在于面条式长函数（Spaghetti Code）与离奇的 `if-else` 多重嵌套。下面演示如何用 AI 彻底拆解一段面条代码。

### 原始面条逻辑

这是一段典型的混杂了计算、校验与副作用的复杂逻辑：

```typescript
function checkout(cart, user) {
  let total = 0;
  for (let i = 0; i < cart.items.length; i++) {
    total += cart.items[i].price * cart.items[i].quantity;
  }
  
  // 复杂的折扣逻辑
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
  
  // 物理侧副作用
  database.saveOrder(cart, finalPrice, points);
  sms.sendNotification(user.phone, "Order placed");
  
  return { finalPrice, points };
}

```

### 赛博重构指令

我们选中该函数，向 AI 下达精准的重构指令：

```text
请扮演资深代码重构专家。优化上述 `checkout` 函数：
1. 将『折扣计算』与『积分计算』逻辑完全提取为无副作用的纯函数。
2. 使用卫语句（Guard Clauses）提早返回，消除深层嵌套。
3. 使用 TypeScript 标注参数与返回值类型，并在重构后补齐对应的单元测试。
```

### 优化后的代码

AI 拆解出的代码结构极具美感，且业务逻辑被彻底解耦：

```typescript
// 1. 独立、无副作用的折扣计算纯函数
export function calculateDiscount(total: number, userLevel: string): number {
  if (userLevel === 'VIP') return total > 500 ? total * 0.2 : total * 0.1;
  if (userLevel === 'GOLD') return total > 1000 ? total * 0.3 : total * 0.15;
  return 0;
}

// 2. 独立、无副作用的积分计算纯函数
export function calculatePoints(finalPrice: number, userLevel: string): number {
  if (finalPrice <= 100) return 0;
  const basePoints = Math.floor(finalPrice / 10);
  return userLevel === 'VIP' ? basePoints * 2 : basePoints;
}

// 3. 编排主控入口，流程清晰且易于维护
export function checkout(cart: Cart, user: User) {
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const discount = calculateDiscount(total, user.level);
  const finalPrice = total - discount;
  const points = calculatePoints(finalPrice, user.level);
  
  // 执行副作用操作
  database.saveOrder(cart, finalPrice, points);
  sms.sendNotification(user.phone, "Order placed");
  
  return { finalPrice, points };
}

```



## 常用 AI 指令

当你面对糟糕的代码库不知如何下手时，直接套用下表中的精细化指令，能让 AI 的输出直击要害：

| 代码坏味道（Code Smell） | 现象特征 | 常用 AI 指令（AI Prompts） |
| --- | --- | --- |
| 过长函数（Long Method） | 函数长达百行，杂糅读取、计算与 IO。 | “使用单一职责原则（SRP），将此长函数拆解为 3 个子函数。禁止共享隐式全局状态，必须通过显式传参通信。” |
| 嵌套地狱（Nested Ifs） | 代码向右侧倾斜严重。 | “请改用卫语句（Guard Clauses）提早返回/抛错，消除缩进深度，使主业务逻辑路径保持在最外层。” |
| 神奇魔法值（Magic Numbers） | 充斥着莫名其妙的数字或字符串常量。 | “将此函数中的所有硬编码魔法值提取为具有明确语义声明的 `Readonly Enum`，并添加必要的解释注释。” |



## 遗留系统的五步接管工作流

如果你刚接手一个运行了 5 年、毫无文档的遗留系统，绝不能简单地框选几百行代码让 AI“清理一下”，那将引发一场灾难。请严格遵循以下企业级安全重构的五步工作流。

### 第一步：全局语义扫描与定位

不要急于修改代码。利用 AI 强大的上下文检索引擎建立心智模型。询问高层架构问题：“请梳理该项目的入口逻辑是什么？哪些服务修改了客户的核心数据？核心业务流程路由分布在哪里？”这能在不破坏任何东西的情况下，快速降低认知门槛。

### 第二步：锁定当前行为

这是最关键却最常被忽略的一步。在修改任何函数前，用测试将其当前的行为（包括像 Bug 的特性）“锁定”下来。

> AI 提示词： “请为这个遗留函数编写全面的特征测试（Characterization Tests）。不要试图修复任何逻辑，你的目标是 100% 覆盖它当前的行为和所有边缘情况。这些测试将作为我重构时的安全网。”

### 第三步：设定严格的约束边界

AI 在做代码重构时，经常会犯“李鬼依赖幻觉”——假想项目中安装了某些流行的库（如 `lodash-es` 或 `date-fns`），并悄悄在顶部引入。你必须在指令中设定清晰的负面清单（Negative Prompts）：

> AI 提示词： “【防幻觉约束】：严禁引入任何当前 `package.json` 中不存在的新第三方库。不要改变任何公开的 API 契约，不要修改与支付相关的核心逻辑。”

### 第四步：微型 PR 与局部解剖

将最难啃的“祖传函数”贴给 AI，让其逐段翻译出隐藏的真实业务规则。随后，将重构拆分为极小的、意图单一的步骤（例如第一步只做重命名，第二步只提取函数），并以微型 PR（Pull Request）的形式提交。如果一个 PR 不能让审查者在 1 分钟内看懂，它就太危险了。

### 第五步：强制领域审查与静态分析

将 AI 与静态分析工具（如 SonarQube）结合使用。静态工具客观地找出圈复杂度极高的代码异味，AI 结合上下文提供优化方案。最终，必须由了解该业务领域的资深开发者进行审查，审查重点锁定在不变量（Invariants）和向后兼容性上。


