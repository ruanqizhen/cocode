---
title: 编码、重构与遗留代码解毒
---

# 编码、重构与遗留代码解毒

> **“写新代码是享受，啃旧代码是修行。AI 时代，我们终于拥有了降服‘史山代码’的重装武器。”**

---

## 1. 提效基础建设：用 AI 快速催生样板代码

在任何商业项目中，都充斥着大量缺乏创造力但必须编写的**基础脚手架代码**（如：编写对应的 CRUD 方法、定义 API 路由、书写 DTO 传输对象）。这类工作正是 AI 的绝对统治区。

### 🚀 极速生成模板工作流
1. **输入你的核心模型定义（如 Prisma Schema）**：
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
3. **成果**：AI 可以在数秒内完美吐出符合规范的高质量骨架代码，为你省去半天的枯燥敲击。

---

## 2. 局部重构：提取函数与简化嵌套（Spaghetti to Modular 实战）

遗留代码最大的毒素在于**面条式长函数（Spaghetti Code）**与离奇的 **`if-else` 多重嵌套**。下面我们演示如何用 AI 彻底拆解一段面条代码。

### ⏳ 原始面条代码（Before）
这是一段在结算购物车时计算最终折扣和积分、并向外部同步的原始复杂逻辑：

```javascript
// 优化前的面条逻辑
function checkout(cart, user) {
  let total = 0;
  for (let i = 0; i < cart.items.length; i++) {
    total += cart.items[i].price * cart.items[i].quantity;
  }
  
  // 复杂的折扣逻辑
  let discount = 0;
  if (user.level === 'VIP') {
    if (total > 500) {
      discount = total * 0.2;
    } else {
      discount = total * 0.1;
    }
  } else if (user.level === 'GOLD') {
    if (total > 1000) {
      discount = total * 0.3;
    } else {
      discount = total * 0.15;
    }
  }
  
  let finalPrice = total - discount;
  
  // 复杂的积分逻辑
  let points = 0;
  if (finalPrice > 100) {
    points = Math.floor(finalPrice / 10);
    if (user.level === 'VIP') {
      points = points * 2;
    }
  }
  
  // 物理侧副作用
  database.saveOrder(cart, finalPrice, points);
  sms.sendNotification(user.phone, "Order placed");
  
  return { finalPrice, points };
}
```

### 🧙 赛博重构指令
我们选中该函数，向 AI 下达精准的重构指令：
> “请扮演资深代码重构专家。优化上述 `checkout` 函数：
> 1. 将『折扣计算』与『积分计算』逻辑完全提取为无副作用的**纯函数（Pure Functions）**。
> 2. 使用**卫语句（Guard Clauses）**简化任何潜在的深层嵌套。
> 3. 使用 TypeScript 标注参数与返回值类型，并在重构后补齐对应的 Vitest 单元测试。”

### 🟢 重构后的模块化代码（After）
AI 拆解出的代码结构极具美感，且逻辑彻底解耦：

```typescript
// 优化后的模块化 TypeScript 实现

// 1. 独立、无副作用的折扣计算纯函数
export function calculateDiscount(total: number, userLevel: string): number {
  if (userLevel === 'VIP') {
    return total > 500 ? total * 0.2 : total * 0.1;
  }
  
  if (userLevel === 'GOLD') {
    return total > 1000 ? total * 0.3 : total * 0.15;
  }
  
  return 0;
}

// 2. 独立、无副作用的积分计算纯函数
export function calculatePoints(finalPrice: number, userLevel: string): number {
  if (finalPrice <= 100) return 0;
  
  const basePoints = Math.floor(finalPrice / 10);
  return userLevel === 'VIP' ? basePoints * 2 : basePoints;
}

interface CartItem {
  price: number;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

interface User {
  level: string;
  phone: string;
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

---

## 3. 常见“代码坏味道”的 AI 调教指令指南

当你看到糟糕的代码时，直接套用下表中的精细化指令，能让 AI 的输出直击要害：

| 代码坏味道（Code Smell） | 现象特征 | 黄金 AI 指令（AI Prompts） |
|---|---|---|
| **过长函数（Long Method）** | 函数长达 100+ 行，杂糅了读取、校验、计算与 IO。 | “使用单一职责原则（SRP），将此长函数拆解为 3 个子函数。禁止共享隐式全局状态，必须通过显式传参通信。” |
| **嵌套地狱（Nested Ifs）** | `if` 块里嵌套 `if`，向右侧倾斜严重。 | “请改用卫语句（Guard Clauses）提早返回/抛错，消除缩进深度，使主业务逻辑路径保持在最外层。” |
| **神奇魔法值（Magic Numbers）** | 代码中充斥着莫名其妙的数字或字符串常量（如 `status === 4`）。 | “将此函数中的所有硬编码魔法值提取为具有明确语义声明的 TypeScript `Readonly Enum`，并添加必要的解释注释。” |

---

## 4. 严防重构中的“李鬼依赖幻觉”

大模型在做代码重构时，为了省事，经常会犯**“库引入幻觉”**的毛病：它会假想项目中安装了某些流行的格式化库（如 `lodash-es`、`date-fns`），并在重构后的文件顶部悄无声息地写下 `import _ from 'lodash'`。

### 🛡️ 防御红线：
在进行任何大重构前，必须向 AI 强调以下规则：
> “**【依赖约束】**：在重构代码的过程中，**严禁引入任何当前 `package.json` 中不存在的新第三方库**。如果需要辅助功能（如数组去重、深拷贝），必须使用原生 JavaScript (ES6+) API 自研实现，或者向人类申请依赖安装。”

---

## 5. 逆向工程：让 AI 帮你接管“史山遗留系统”

你刚入职一家新公司，老板丢给你一个运行了 5 年、没有任何架构文档、充斥着神秘全局变量和拼音命名函数的“史山系统”。

### 🧙 史山接管四步解毒法

```mermaid
graph TD
  A[第一步: 全局语义扫描] -->|@Codebase 语义检索| B[第二步: 局部解剖分析]
  B -->|提取核心业务规则| C[第三步: 添加安全防护网]
  C -->|补齐高密度单元测试| D[第四步: 小步重构与验证]
```

1. **第一步：全局语义扫描**：使用 `@Codebase` 问 AI：“请梳理该项目的入口逻辑是什么，它是如何连接数据库的，核心业务流程路由分布在哪里？请生成一份简要的架构全景说明。”
2. **第二步：局部解剖分析**：将那段最难啃的 800 行“祖传函数”贴给 AI：“请扮演一位代码解毒专家，帮我逐段拆解该函数的运行流程，并用自然语言为我翻译出它隐藏的真实业务规则。”
3. **第三步：添加安全防护网**：要求 AI 针对该史山函数的关键节点，补齐高密度的集成测试。有了测试网的保护，你就可以在后续的重构与功能新增中高枕无忧了。

---

## 本章小结

重构是消灭技术债的必由之路。在本章中，我们：
1. 演练了将复杂嵌套、混杂副作用的面条代码重构为纯函数、卫语句和强类型 TypeScript 组件的全流程；
2. 掌握了应对不同“代码坏味道”的靶向 AI 提问指令；
3. 锁定了防范“依赖包幻觉”的安全红线；
4. 梳理了接管没有任何文档的“祖传史山代码”的逆向工程四步法。

代码重构完，一旦在本地运行或者线上高并发下突发异常，如何让 AI 化身为全职的排错特种兵？

下一章，让我们一起走进 **《橡皮鸭调试与全场景测试》（扩充版）**。
