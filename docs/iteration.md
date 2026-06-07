# 迭代与持续验证

> 软件工程没有万灵药，但“小步迭代、及时反馈是人机协作开发中最接近万灵药的真理。



在上一章中，我们通过 GitHub 和 Cloudflare Pages 将我们制作的开源电子书成功推向了全球网络。看着精美的静态页面上线，你可能会松一口气。

但在 AI 时代，上线不是终点，而是持续演化的起点。

Web 环境下的数字资产是“活”的。面对大模型超凡的生成速度，开发新手最容易犯的错误就是胃口太大：试图一次性命令 AI 修复 5 个不相关的核心文件，或者把“重写全书剧情、生成封面、重构侧边栏”的重任一股脑丢过去。

这种粗放型的迭代方式会导致灾难性的逻辑崩溃（Context Rot），最后让你陷入漫长而绝望的手工调试泥潭。本章将带你运用软件工程的严谨纪律，对上线后的数字资产进行精准的“工程级微调”与动态维护。



## 一次只做一件事

大模型的高级推理精度会随着单次生成规模的增大而骤然下降。因此，在对数字项目进行后期升级时，你必须学会克制。

### 微操作

每次交互只解决一个单一、明确的任务点。单次代码或文本变动控制在极小范围内，让你可以用肉眼在几秒钟内直观完成 `Git Diff` 审阅。

假设我们要为上线的电子书项目进行全方位的后期抛光与精细化运营，如果你直接对 AI 下达一个模糊的大包大揽指令，必然会迎来灾难：

* ❌ 反面案例：“帮我把这本书彻底优化一下。改掉里面的剧情不一致，顺便加个好看的封面、写个序言，再帮我生成一些名家搞笑评论，把数据统计功能也改改。”
* 🟢 正面拆解（微步骤滚动）：
* 步骤 1（数据排毒）：仅通过 `@characters.md` 修正第 3 章中主角能力的数值不一致错误。
* 步骤 2（功能增强）：编写一个专门的 React 序言组件，支持点击折叠与展开。
* 步骤 3（视觉包装）：利用 AI 提炼封面设计提示词，并将其嵌入 Docusaurus 首页。
* 步骤 4（营销整活）：让 AI 站在特定视角，为项目生成极具讽刺或幽默感的“伪造名家评论区”。





## 实战演练

承接上面的微操作拆解，我们直接通过人机结对，现场对我们的电子书项目实施四轮精准的“精细化迭代”：

### 数据排毒（修正文本不一致的硬伤）

在长期连载或大型系统迭代中，最怕“前后设定冲突”。例如，第 3 章写着主角肖山“规则感知 Lv2”，到了第 12 章由于 AI 遗忘，莫名其妙退化成了 “Lv1”。

* 标准破局动作：
我们不盲目通读全书，而是利用第二章的“长期记忆基建”，将 `knowledge/characters.md` 和 `docs/chapter12.md` 精准投喂给工具，下达靶向指令：
> “根据 `@characters.md` 中的标准设定，肖山在第 8 章后就已升至 Lv2。请检查并修正 `@chapter12.md` 中关于他能力的笔误，仅修改相关冲突段落，保持其余文本绝对不动。”

初稿生成后，我们绝不能允许 AI “自由放飞”。正如写代码需要跑 Lint 和编译检查一样，文本内容也需要一整套严苛的回归测试（Regression Testing）。我们必须在写新章节前，引入一套冷酷的“体检测试提示词”，对文本进行内容态的卡点审校：

🚀 内容质检提示词范本
```plaintext
# Role
你是金牌网文主编兼文字质检官，专精于长篇故事节奏、逻辑自洽和爽感密度检查。

# Task
请对以下刚生成的初稿章节进行深度审计，必须从五个核心维度输出漏洞报告：

1. 设定测试：法则前后是否一致？是否出现了背离已公开世界观（如 knowledge/world.md）的严重 Bug？
2. 动机测试：主角的对话与行动是否符合人设？是否有为了强行推进剧情而导致的严重 OOC（角色崩坏）？
3. 伏笔追踪：本章计划埋设或回收的伏笔是否精准落地？列出当前未回收的暗线清单（对照 knowledge/mysteries.md）。
4. 爽感与钩子：结尾的悬念 Hook 是否具备足够的张力？打脸揭秘的信息差是否被主角有效利用？

输出要求：不需要长篇大论的赞美。请直接在存在技术软伤的段落后，给出可直接进行 Git 局部行级替换的富文本代码块。

```
通过这套文本 Testing 防线，数据流中的冲突（如前后人设定律矛盾）在合入 GitHub 前就会被无情拦截并就地修复，确保了长期演进中文本逻辑的坚固性。

### 视觉包装（AI 驱动的封面与插图编排）

一本能吸引 18-35 岁硬核读者的电子书，必须具备顶级的视觉冲击力。我们利用 AI 帮我们完成从“设计图纸”到“前端嵌入”的闭环。

1. 生成设计提示词（Midjourney/DALL-E 4）：
我们对 AI 说：*“基于《消散的终点》这种都市外卖员、克苏鲁、规则入侵的风格，为我生成一段用于 AI 绘图工具的英文黄金提示词。”*
> AI 产出：*“An urban cyberpunk cyberpunk street, a Chinese delivery rider standing under giant glowing eldritch neon signs, rule-怪谈 horror atmosphere, hyper-detailed, neon green and deep black twilight, 8k resolution, book cover composition --ar 3:4”*


2. 静态资产合入：
将绘制好的精美图片命名为 `cover.png` 放入项目的 `/static/img/` 目录下。
3. 前端代码微调：
召唤 AI 原生 IDE 修改首页组件，将封面图以优雅的毛玻璃渐变效果渲染在 Docusaurus 首页顶部。

### 组件增强（编写交互式动态序言）

我们希望在电子书的开头加入一段“高级序言”，但为了不打断老读者的阅读节奏，这个序言必须是可动态折叠的。得益于 Docusaurus 的 React 驱动属性，我们可以直接在 Markdown 里面编写 MDX（Markdown + JSX）组件。

我们命令 AI：*“请为我编写一个符合 Tailwind CSS 审美的可折叠 React 序言组件，要求带有平滑的伸缩动画与暗黑模式适配，并将其直接嵌入到 `docs/intro.md` 的顶部。”*

AI 会迅速为你递交一段干净的 MDX 资产，你的电子书从此拥有了动态软件的交互生命：

```markdown
import { useState } from 'react';

export const CollapsiblePreface = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-solid border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800 my-4">
      <button onClick={() => setIsOpen(!isOpen)} className="font-bold flex items-center justify-between w-full cursor-pointer bg-transparent border-none text-slate-800 dark:text-slate-200">
        <span>📖 查看作者前言：大模型时代的创作反思</span>
        <span>{isOpen ? '▲ 收起' : '▼ 展开'}</span>
      </button>
      {isOpen && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          你现在读到的这本书，本身就是一场人机结对的敏捷实验。人脑负责输出粗糙但真实的观点手记、踩坑金句与核心灵魂；而 AI 负责进行扩写、润色、格式排版与代码静态高亮……
        </p>
      )}
    </div>
  );
};

<CollapsiblePreface />

```

### 营销整活（伪造名家幽默评论区）

为了给我们的科技爽文增强“讽刺艺术”与吸睛度，我们可以在 `PRODUCT.md` 规范的指导下，让 AI 站在各种荒诞的名人或虚构文明的视角，为本书编排一组高情商/低情商的伪造名家评论区，以表格形式呈现在电子书的尾页：

```markdown
## 🌌 宇宙级推荐信：看看它们怎么说

| 评论人角色 | 推荐评语级别 | 真实星级评分 |
| :--- | :--- | :---: |
| 三体文明第一观测员 | “在这个故事里，人类竟然试图用代码和外卖订单去对抗高维叙事规则。这完全不是虫子的行为。建议立刻对其发射二向箔，以示最高敬意。” | ⭐⭐⭐⭐⭐ |
| 朝阳区外卖大联盟 | “肖山同志的遭遇完美解释了为什么我们有时候送单会超时。这不是由于交通堵塞，而是因为配送系统被旧日支配者热更新了。同行必读！” | ⭐⭐⭐⭐⭐ |
| 匿名高维克苏鲁代理 | “文字的触手隐藏在 Docusaurus 的每个 HTML 标签后面。当我读到第 15 章时，我的不可名状感知力直接触发了浏览器的 `LocalStorage` 溢出。” | ⭐⭐⭐⭐✨ |
| 传统文学考据专家 | “胡闹！这根本不是传统类型学小说的写法！但在有了全自动 CI/CD 自动部署后，它更新和自我修正的速度让我怀疑作者根本不是人类。” | ⭐⭐⭐⭐⭐ |

```

这种充满极客冷幽默的整活内容，不仅能瞬间拉近与现代年轻读者的距离，更能自然而然地通过 Giscus 评论区引爆读者们的二次玩梗创作。



## AI 时代的 TDD 革命：人机同频测试流

在对数字产品进行持续增效的过程中，功能越堆越多，怎么保证新写的代码或组件不会悄悄把老功能改挂？

这就需要引入测试驱动开发（TDD）。在传统的开发工作中，人们常认为 TDD 过于繁琐死板，因为手写测试用例极其枯燥。但在 AI 时代，TDD 迎来了它的黄金涅槃：人类定契约，AI 写测试，AI 补代码。

### 🛠️ 实战演练：用 Vitest 编写与验证字数统计工具

在我们的 Markdown 编辑器/电子书项目中，底部数据统计栏有一个核心的核心算法：精准计算文本中的汉字数与字符数，必须剔除空格、标点及 Markdown 语法符号。

#### 第一步：人类定义规格说明 (Spec)

我们需要一个纯计算函数 `countChineseWords(text: string): number`。

* 纯英文或数字输入：返回 `0`。
* 标准中文文本：“你好 AI” → 返回 `2`（仅计算汉字数）。
* 空字符串或异常输入：返回 `0`。

#### 第二步：命令 AI 编写单元测试

我们在工具中通过 `@Files` 锁定上下文，向 AI 输入任务：

> “请使用 TypeScript 和 Vitest 测试框架，为上述 `countChineseWords` 的核心规格编写完备的单元测试，覆盖常规路径、中英文混合、Markdown 标签污染及异常边界。”

AI 迅速在本地生成了 `parser.test.ts`：

```typescript
// parser.test.ts
import { describe, it, expect } from 'vitest';
import { countChineseWords } from './parser';

describe('countChineseWords 核心契约测试', () => {
  it('应当正确统计纯中文字符数', () => {
    expect(countChineseWords('赛博朋克')).toBe(4);
  });

  it('在中英文混合且包含 Markdown 符号时应当精准剔除噪声', () => {
    expect(countChineseWords('# Hello 这是一个 强设定 网文')).toBe(8);
  });

  it('遇到纯英文、空格或空字符串时应当优雅返回 0', () => {
    expect(countChineseWords('### Micro-stepping tips!')).toBe(0);
    expect(countChineseWords('   ')).toBe(0);
  });
});

```

#### 第三步：跑测试，迎来红灯 (Red)

我们在宿主终端运行：`npx vitest run parser.test.ts`。由于我们此时根本还没有实现 `parser.ts` 文件的具体逻辑，测试毫无悬念地爆红（红灯）。

#### 第四步：将红灯错误喂给 AI，倒逼业务代码实现

我们将爆红的测试文件与报错信息一并塞回给 AI：

> “这是刚才爆红的单元测试契约。现在请为我实现 `parser.ts` 的具体核心算法，直到完全通过上述所有测试。注意：你绝对不允许为了作弊而改动我的测试文件。”

AI 在严苛的测试契约约束下，吐出了高纯度的业务实现代码：

```typescript
// parser.ts
export function countChineseWords(text: string): number {
  if (!text) return 0;
  
  // 1. 粗暴剔除标准的 Markdown 一级、二级标题及加粗符号噪声
  const cleanText = text.replace(/[#*`>_\-\[\]\(\)]/g, '');
  
  // 2. 利用正规表达式精准匹配全局的汉字字符范围
  const chineseMatches = cleanText.match(/[\u4e00-\u9fa5]/g);
  
  return chineseMatches ? chineseMatches.length : 0;
}

```

#### 第五步：重新测试，迎来绿灯 (Green)

在本地终端再次敲击运行测试，绿灯全亮！有了这套 TDD 安全网，后续无论大模型怎么折腾、扩写功能，只要这盏绿灯不灭，你就对核心逻辑拥有 100% 的底层掌控力。

---

## 自动化卡点验证

大模型在疯狂高频生成组件或代码变动时，由于细微的幻觉，可能会犯下拼写错误、类型缺失等低级技术硬伤。你不应当将这些隐患积压到最后的发布阶段才去排错，而是在每次 Micro-operation 变动保存后，立即在本地终端高频运行卡点验证：

```bash
# 建议在 IDE 终端或 Git pre-commit 钩子中高频热运行
pnpm typecheck && pnpm lint

```

* TypeScript 类型守卫：让 `tsc --noEmit --watch` 在后台保持热监听。大模型只要在组件里写错了一个可选属性（Optional Property）或者搞错了入参契约，编译器就会在毫秒级内拉响警报。你只需将这段原始终端报错回喂给 AI，即可在 3 秒内完成精准纠偏。
* 格式与静态代码卫士：利用 Prettier 与 ESLint 进行强制纠偏，把 AI 的书写小坏习惯（如双引号与单引号的混乱交替使用、多余的空行）在本地保存阶段就消灭干净，确保主干 Git 树的绝对整洁。

