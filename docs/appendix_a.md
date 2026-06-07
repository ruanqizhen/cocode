---
title: 附录 A：一份标准的 AGENTS.md 通用项目模板
---

# 附录 A：一份标准的 AGENTS.md 通用项目模板

> **“通过一份高度规范的 AGENTS.md，你可以瞬间让任何第三方 Agent 在两秒钟内彻底理清你的项目脉络，避免它偏离轨道。”**

---

你可以直接将以下模板复制并保存到你项目的根目录，命名为 `AGENTS.md`：

```markdown
# 🤖 Project AGENTS.md - System Rules & Context Anchor

> **【面向 Agent 声明】**：你是本项目（CoCode）的超级结对编程专家。在阅读并完全理解本文件的架构说明、质量禁区和 DoD 完成标准之前，禁止对代码库进行任何非平凡的修改动作。

---

## 📂 1. 项目架构与目录索引
本项目是一个基于 [技术栈：如 Next.js 15 App Router + Prisma + PostgreSQL] 构建的现代 Web 应用。

* `/src/app`: 所有的页面路由定义与 Server Components。
* `/src/components`: 共享的 UI 组件，遵循纯 Vanilla CSS / Tailwind 规范。
* `/src/lib`: 工具类、底层 DB 连接实例与通用纯函数。
* `/src/services`: 核心业务领域逻辑层，严禁在此层直接读写 HTTP Session 状态。
* `/prisma`: 数据库 Schema 定义与 Seed 填充数据。

---

## 🚫 2. 质量死守防线（Critical Constraints）
任何 Agent 在编写代码时，必须死守以下质量红线：

1. **类型安全**：
   * 严禁在 TypeScript 文件中声明或隐式使用 `any` 类型。所有函数入参、出参必须定义完备的 Interface 或 Type。
2. **零大依赖原则**：
   * 禁止在未征得人类同意的情况下引入任何第三方库。优先使用 JavaScript 原生方法（如：优先使用原生 `Intl` 格式化时间，而非 `moment` / `dayjs`）。
3. **架构隔离**：
   * 数据库调用仅允许在 `Service` 或 `Repository` 层进行，严禁直接在路由 `Controller` 或 UI 页面组件中书写底层的 `prisma.query`。

---

## 💾 3. 数据库变更与迁移规范（Database Migrations）
1. **Schema 变更规则**：
   * 禁止直接使用物理客户端工具（如 DBeaver, pgAdmin）修改开发或生产环境的数据表结构。
   * 必须通过修改 `prisma/schema.prisma` 文件来实现 Schema 的改动。
2. **迁移步骤**：
   * 修改 Schema 文件后，必须首先在本地终端运行本地迁移生成命令：
     `npx prisma migrate dev --name <migration_name>`
   * 确认本地迁移运行成功并生成迁移 SQL 脚本后，方可将其提交至版本控制中。
3. **安全提醒**：
   * 严禁生成包含 `DROP COLUMN` 或 `DROP TABLE` 的破坏性迁移，除非已得到人类架构师的明确书面授权。

---

## 📝 4. 日志记录规范（Logging Conventions）
1. **日志分级原则**：
   * `ERROR`：系统逻辑崩溃、第三方接口调用超时、数据库死锁等导致业务无法正常运行的卡点。必须使用全局错误处理器或捕获后抛给 Sentry。
   * `WARN`：非致命性异常，例如：输入校验失败、用户登录密码错误。
   * `INFO`：核心业务流节点，例如：一笔订单扣款成功（包括 OrderID 和金额）。
2. **敏感信息拦截**：
   * 严禁在任何日志打印信息中包含用户敏感数据（如明文密码、信用卡卡号、个人身份证号）。
3. **Node.js 示例规范**：
   * `logger.info({ orderId, userId }, 'Order checkout successfully');`

---

## 🏁 5. 落地完成标准（Definition of Done）
你声称任务完成前，必须满足以下卡点要求：

* **代码质量卡点**：运行类型检查 `npm run typecheck` 必须无任何编译 Error。
* **风格卡点**：运行 `npm run lint`，不得有任何未处理的格式警报。
* **测试卡点**：若修改了业务逻辑，必须运行对应的测试脚本，并保证 100% 绿灯。
* **Git 提交卡点**：确保修改的范围符合“一次只做一件事”的原则，编写清晰且符合 Angular 规范的 Commit Message。

---

## 🚨 6. 升级规则（Escalation Protocol）
* **无限循环熔断器**：若你在自我排查 Bug 的过程中，针对同一个编译/运行报错**连续 3 次**修改均以失败告终，表明你已陷入逻辑盲区。
* **升级动作**：**必须立即停止对代码库的所有写入动作**，在终端输出当前遇到的瓶颈原因、你的 2 个排错假设，并主动向人类抛出求助广播。
```
