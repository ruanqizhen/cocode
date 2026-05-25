---
title: 第九章 编码、重构与遗留代码解毒
---

# 第九章 编码、重构与遗留代码解毒

> **“写新代码是享受，啃旧代码是修行。AI 时代，我们终于拥有了降服‘史山代码’的重装武器。”**

---

## 9.1 提效基础建设：用 AI 快速催生 CRUD、API 路由与数据模型样板

在任何商业项目中，都充斥着大量缺乏创造力但必须编写的**基础脚手架代码**（如：新增一个表后，编写对应的 CRUD 方法、定义 API 路由、书写 DTO 传输对象）。

这类工作正是 AI 的绝对统治区。

### 🚀 极速生成模板工作流
1. **输入你的核心模型定义（如 Prisma Schema 或 SQL DDL）**：
   ```prisma
   model Product {
     id          String   @id @default(uuid())
     name        String
     price       Decimal
     stock       Int
     createdAt   DateTime @default(now())
   }
   ```
2. **下达高强度生成命令**：
   > “基于上述 `Product` 模型，使用 NestJS 规范，自动生成完整的 `ProductController`、`ProductService` 和 `CreateProductDto`。强制要求对所有输入数据进行验证，并使用 `PrismaService` 进行读写。”
3. **成果**：AI 可以在 3 秒内完美吐出符合规范的高质量骨架代码，为你省去半天的枯燥敲击。

---

## 9.2 局部重构：提取函数、简化嵌套逻辑与消除代码坏味道

随着业务的频繁迭代，局部的业务代码往往会越写越臃肿，充斥着离奇的 `if-else` 多重嵌套与难以维护的超长函数（即“代码坏味道”）。

### 🛠️ 赛博重构招式
* **重构手法一：提取纯函数（Extract Method）**：选中一段复杂的计算逻辑，丢给 AI：“把这段逻辑提取为独立的、没有副作用（Side-effect）的纯函数，并用 TypeScript 精确声明入参及返回值类型。”
* **重构手法二：卫语句简化嵌套（Guard Clauses）**：
  :::tip 优化前
  ```javascript
  function processOrder(order) {
    if (order !== null) {
      if (order.isPaid) {
        if (order.hasStock) {
          // 核心逻辑...
        }
      }
    }
  }
  ```
  :::
  :::tip 优化后（AI 自动改写为卫语句）
  ```javascript
  function processOrder(order) {
    if (!order) return;
    if (!order.isPaid) throw new Error("Order not paid");
    if (!order.hasStock) throw new Error("Out of stock");
    
    // 核心逻辑...
  }
  ```
  :::

---

## 9.3 跨文件重构：应对接口变更与大规模依赖替换的“阵痛期”

当核心接口发生变更（如 `UserService.getUserInfo` 的参数由单个 `id` 变更为包含租户 ID 的 `UserQueryContext` 对象），或者是需要将整个项目的 `axios` 迁移替换为原生的 `fetch` 时，传统的人工查找替换往往会遗漏大量卡点。

### 🌟 跨文件 Composer 协同重构术
在 Cursor Composer 或 Cline 中，将整个重构动作分解为**架构对齐流程**：
1. **喂入修改锚点**：同时打开核心定义文件和受影响的 2 个调用端文件。
2. **下发对齐指令**：
   > “我已经修改了 `UserService.ts` 中的 `getUserInfo` 接口定义。请扫描所有引入并使用此方法的外部文件，逐一对其进行重写，使其符合最新的接口签名，并保持原有的业务异常捕获逻辑。”
3. **闭环卡点编译**：命令 Agent 在终端拉起 TypeScript 编译，发现遗漏报错后，由 Agent 自主定位并彻底修复。

---

## 9.4 逆向工程：让 AI 帮你梳理并接管毫无文档的“史山遗留系统”

你刚入职一家新公司，老板丢给你一个运行了 5 年、没有任何架构文档、充斥着神秘全局变量和拼音命名函数的“屎山系统”，并要求你在下周给它增加新功能。

这在以前是所有程序员的噩梦。但现在，我们可以依靠 AI 进行**逆向工程（Reverse Engineering）**。

### 🧙 史山接管四步解毒法

```mermaid
graph TD
  A[第一步: 导入核心骨架] -->|@Codebase 语义分析| B[第二步: 生成业务全景图]
  B --> C[第三步: 局部切片安全带]
  C --> D[第四步: 橡皮鸭小步测试]
```

1. **第一步：全局语义扫描**：使用 `@Codebase` 问 AI：“请梳理该项目的入口逻辑是什么，它是如何连接数据库的，核心业务流程路由分布在哪里？请生成一份简要的架构全景说明。”
2. **第二步：局部解剖分析**：将那段最难啃的 800 行“祖传函数”贴给 AI：“请扮演一位代码解毒专家，帮我逐段拆解该函数的运行流程，并用自然语言为我翻译出它隐藏的真实业务规则。”
3. **第三步：添加安全防护网**：要求 AI 针对该史山函数的关键节点，补齐高密度的集成测试。有了测试网的保护，你就可以在后续的重构与功能新增中高枕无忧了。
