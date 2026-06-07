---
title: 工程级迭代与持续验证
---

# 工程级迭代与持续验证

> **“软件工程没有银弹，但‘小步迭代、及时反馈’是人机协作开发中最接近银弹的真理。”**

---

面对大模型的超凡速度，开发新手最容易犯的错误就是**胃口太大**：一次性命令 AI 修改 5 个不相关的核心文件，或是把重写整个模块的重任一股脑丢过去。

这种粗放型的生成方式会导致灾难性的 Bug 爆发，最后让你陷入漫长而绝望的手工调试泥潭。

:::important 克制之道
在人机协作中，越克制，反而越快速。
:::

---

## 1. “一次只做一件事”：微操作（Micro-operations）原则

大模型的上下文窗口在处理复杂的逻辑时，其推理精度会随着单次生成规模的增大而骤然下降。因此，你必须学会克制。

### 🎯 “微操作”原则与拆解示例
* **原则**：每次交互只解决一个单一、明确的任务点。单次代码变动控制在 50 行核心代码以内。
* **反面案例**：“帮我实现完整的商品结账、扣减库存、并发送邮件通知。”
* **正面拆解（微步骤滚动）**：
  1. *步骤 1*：仅修改数据库模型，新增支付状态与库存锁定字段。
  2. *步骤 2*：编写计算应付金额与折扣抵扣的纯计算逻辑，并补齐边界单元测试。
  3. *步骤 3*：集成第三方支付 SDK（如 Stripe/支付宝），实现核心调用与 Webhook 回调路由。
  4. *步骤 4*：编写库存扣减的数据库事务（Transaction），确保并发扣库存的原子性，并与支付成功回调联调。

每次只走一步，人类可以在几秒钟内直观完成 Diff Review，项目便能以最稳健的姿态向前推演。

---

## 2. AI 时代的 TDD 革命：人机同频测试流

测试驱动开发（TDD）在传统的开发工作中常被认为“过于繁琐”，因为手写测试用例是一件枯燥且耗时的工作。但在 AI 时代，TDD 迎来了黄金涅槃：**人类定契约，AI 写测试，AI 补代码**。

### 🛠️ 实战演练：用 Vitest 编写与验证字符串脱敏工具

#### 第一步：人类定义规格 (Spec)
我们需要一个脱敏函数 `maskSensitiveInfo(text: string, type: 'email' | 'phone'): string`。
- 邮箱脱敏：保留首尾字符，中间用 `***` 代替。如 `alice@example.com` → `a***e@example.com`。
- 手机脱敏：保留前 3 位和后 4 位，中间用 `****` 代替。如 `13812345678` → `138****5678`。

#### 第二步：命令 AI 编写单元测试
我们向 AI 输入任务：“*请使用 TypeScript 和 Vitest，为上述 `maskSensitiveInfo` 规格编写完备的单元测试，包含常规路径、边界空值、异常输入等情况。*”

AI 生成了 `security.test.ts`：
```typescript
// security.test.ts
import { describe, it, expect } from 'vitest';
import { maskSensitiveInfo } from './security';

describe('maskSensitiveInfo', () => {
  it('应当正确脱敏标准邮箱', () => {
    expect(maskSensitiveInfo('user@test.com', 'email')).toBe('u***r@test.com');
  });

  it('应当正确脱敏标准手机号', () => {
    expect(maskSensitiveInfo('13812345678', 'phone')).toBe('138****5678');
  });

  it('遇到空值或超短字符时应当抛出 InvalidInputError', () => {
    expect(() => maskSensitiveInfo('', 'email')).toThrow('InvalidInputError');
    expect(() => maskSensitiveInfo('a@b', 'email')).toThrow('InvalidInputError');
  });
});
```

#### 第三步：跑测试，迎来红灯 (Red)
在终端运行 `npx vitest run security.test.ts`。由于主文件 `security.ts` 尚未实现，测试毫无悬念地爆红（红灯）。

#### 第四步：将测试喂给 AI，令其实现业务代码
我们将 `security.test.ts` 的代码和测试报错喂给 AI：“*这是刚才的单元测试。请现在实现 `security.ts`，直到完全跑通上述测试，且不能修改测试文件。*”

AI 迅速给出完美的业务实现：
```typescript
// security.ts
export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}

export function maskSensitiveInfo(text: string, type: 'email' | 'phone'): string {
  if (!text || text.trim() === '') {
    throw new InvalidInputError('输入不能为空');
  }

  if (type === 'email') {
    const parts = text.split('@');
    if (parts.length !== 2 || parts[0].length < 3) {
      throw new InvalidInputError('邮箱格式错误或前缀太短');
    }
    const [prefix, domain] = parts;
    return `${prefix[0]}***${prefix[prefix.length - 1]}@${domain}`;
  }

  if (type === 'phone') {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length !== 11) {
      throw new InvalidInputError('手机号必须是11位数字');
    }
    return `${cleaned.slice(0, 3)}****${cleaned.slice(7)}`;
  }

  throw new Error('未知的脱敏类型');
}
```

#### 第五步：重新测试，迎来绿灯 (Green)
在本地终端再次运行测试，绿灯全亮！代码的逻辑契约在此刻坚固如铁。

---

## 3. 自动化卡点验证：配置你的“赛博安全带”

大模型在生成代码时可能由于细微幻觉导致拼写错误、类型缺失。你不应该积压到最后才去排错，而是在每次代码变动后立即运行卡点：

```bash
# 建议在 IDE 终端或 pre-commit 钩子中高频运行
npm run typecheck && npm run lint
```

* **TypeScript 守卫**：让 `tsc --noEmit --watch` 在后台热监听。AI 哪怕写错了一个可选属性（Optional Property），编译器会立即抛出警报，你只需将终端报错回喂给 AI，即可在 3 秒内完成精准纠偏。
* **代码格式卫士**：利用 Prettier 与 ESLint 进行强行格式化，把 AI 的书写小习惯（如双引号与单引号的混乱使用）在本地保存阶段就消灭干净。

---

## 4. 另起炉灶的艺术：继续对话 vs 开启新 Chat

在大模型交互中，上下文会随着对话增多而“腐烂”。当 AI 开始反复为同一个 Bug 道歉、或者给出的代码明显开始丢三落四时，继续在该会话中纠缠是极其不明智的。

我们需要掌握**“另起炉灶”的黄金决策法则**：

| 决策维度 | 🟢 继续当前对话的场景 | 🔴 开启全新 Chat 的场景 |
| --- | --- | --- |
| **任务连续性** | 当前功能开发顺畅，AI 的架构思路在你的轨道上，修改是渐进且微小的。 | 发生大面积编译崩溃，或者需要推翻之前的方案，改用全新的底层库或重构设计。 |
| **会话长度** | 历史交互在 10 轮以内，上下文容量较小，响应时间极快。 | 历史对话已长达几十轮，AI 开始出现“失忆”或“幻觉”（上下文接近水位极限）。 |
| **阶段成果** | 功能还在半途，数据流还没闭环。 | 阶段性微任务（如已顺利通过 TDD 的 Unit Tests）已经大功告成，你需要“干净的场地”进行下一项开发。 |

> [!TIP]
> **“挥别过去的错，开启全新的 Chat，是每个 AI 架构师必须拥有的断舍离胸怀。”**
> 在开启新 Chat 时，只需将前一阶段尘埃落定的最终代码和核心 Spec 贴给 AI 作为初始输入即可，轻装上阵的 AI 智商会瞬间重回巅峰。

---

## 本章小结

"小步迭代、及时反馈"是让人机协作不脱轨的唯一缰绳。在本章中，我们：
1. 掌握了**单次交互“微操作”原则**，学会将大功能拆解为极小步骤滚动执行；
2. 实践了**人机 TDD 闭环**，用 Vitest 实现了从需求 Spec 到单元测试再到完美实现的高安全工作流；
3. 学习了如何在编译与格式化阶段布设“赛博安全带”；
4. 归纳了“继续对话 vs 另起炉灶”的黄金决策矩阵。

掌握了整个迭代与测试环路，我们的手脚和大脑已经能协调运转。但有些时候，人类和 AI 的沟通仅仅依靠文字是不够的——我们可能想直接让它看懂我们的设计图、白板手稿或是报错截图。

下一章，让我们一起走进 **《多模态 AI 编程实战：看懂你的世界》（扩充版）**。
