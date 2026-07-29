# 视觉工程

> “耳听为虚，眼见为实。” ——《汉书》

有些模型早期仅支持文本，但随着技术演进，主流模型已全面迈向多模态。以 DeepSeek 为例，早期主要为文本模型，但自 DeepSeek-VL / VL2（2024 年起）已支持视觉能力，截至 2026 年主流大模型（Claude、Gemini、GPT-4o/5、DeepSeek-V3 等）均已具备多模态能力。Google Gemini 本身就是多模态模型，所以我们在为自己的书编写插图时，甚至不需要使用额外的 AI 工具，直接在对话框中提出要求，模型即可处理视觉任务。

对于编程来说，更有用的情景可能还不是画图，而是看图。比如，如果遇到了这种情况：前端界面画歪了、UI 发生了像素级错位，或者设计师直接甩过来一张手绘的草图，你该如何 AI 下达指令？

对于只支持文本的模型，我们和模型的交流被死死局限于“文本”。为了让 AI 帮我们还原一个精美的卡片布局，我们需要费尽心思用文字进行长篇大论的描述。这种方式不仅低效、充满歧义，而且 AI 往往词不达意，盲改出来的视觉效果更是千奇百怪。

随着以 Claude 系列和 Google Gemini 系列为代表的多模态大语言模型（Multimodal LLMs）全面成熟，人机交互正式跨入了视觉时代。AI 编程工具已经长出了明亮的眼睛，能够以底层逻辑直接解构图像、视频等多媒体上下文。本章将带你领略“赛博视网膜”落地于前端视觉重构、UI 缺陷自愈与自动化测试中的终极威力。



## 被动视觉与主动视觉的哲学对决

在目前的 AI 编程前线，Claude Code 与 Google Antigravity 在处理多媒体资源时，分别走了一条截然不同却又殊途同归的工程演进路线：

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        AI 编程的多模态视网膜体系                       │
├───────────────────────────────────────┬────────────────────────────────┤
│       Claude Code (被动视觉流派)       │  Google Antigravity (主动视觉流派)│
├───────────────────────────────────────┼────────────────────────────────┤
│  * 依赖开发者手动“喂图”投喂           │  * 依赖内置浏览器代理自主获取视觉反馈  │
│  * 剪贴板一键粘贴 / 拖拽图片直传       │  * 自动化生成录屏、截图等富媒体制品    │
│  * 黑客式的“看图写代码”极速执行者     │  * 能够自己“看”效果并自愈的测试员    │
└───────────────────────────────────────┴────────────────────────────────┘

```

### Claude Code：以人类输入为核心的靶向视觉

虽然 Claude Code 是一款运行在纯文本终端（Terminal）中的硬核命令行工具，但它的底座 Harness 框架却拥有极其轻量且实用的图像感知力。在终端中，它主要通过两种被动方式承接人类的视觉输入：

* 剪贴板直接注入：在本地系统中利用快捷键截取 UI 缺陷或报错弹窗后，直接在终端里粘贴（Claude Code 支持拖拽图片、粘贴图片或 `/image` 等方式）。Harness 会在后台将图片编码并推入当前上下文窗口。
* 设计稿直传：将 Figma 导出的资产包、截图直接拖入终端或通过文件路径引用，让模型获得像素级上下文。

### Google Antigravity：代理自主获取的视觉反馈机制

与 Claude Code 等待人类喂图的被动模式完全相反，Google Antigravity 展现出了巨型母舰的“主动视觉”统治力。

它依托底层 Gemini 的 Computer Use（计算机操作自动化） 技术，在系统内部直接内嵌了一个无头的 浏览器子代理（Browser Subagent）。这意味着它在修改完前端代码后，不需要你帮它看效果，它自己就能默默拉开本地浏览器，像人类用户一样去点击按钮、填写表单，并在关键步骤自己截图、自己录制操作视频。

这些多媒体资源会沉淀为它的制品系统（Artifacts）。你不仅可以直观地查阅它的“工作证明”，还可以像审阅 Google Docs 一样，直接在它提交的截图上用鼠标划线、留下批注，代理会精准提取屏幕坐标反馈并自动进行新一轮的代码修复。


## 设计稿手稿一键还原为 React 前端组件

为了切身感受到多模态的威力，我们首先模拟一个经典的“需求冷启动”场景：你正在为一家咖啡馆设计一个线上点餐页面。你的设计师（或者你自己）在白纸上用铅笔草草画了一幅布局线框图，包含 Banner 图、今日特推卡片、以及底部的“加入购物车”飘窗按钮。

在过去，你需要先手工编写 HTML 骨架，再写几百行 CSS 去繁琐地调整对齐、间距、字体和阴影，折腾一下午。现在，我们直接用手机拍下这幅草图，直接投喂给 AI 编程工具。

### 投喂线框图与明确约束规范

* 如果你是用 Claude Code：直接将手稿拖入终端，下达指令。
* 如果你是用 Google Antigravity：将图片拖入侧边栏的 Context 区域，在面板中下达宏观目标。

![手绘点餐界面布局草图](/img/coffee_order_sketch.png)
*图：手绘点餐界面布局草图*

#### 视觉重构提示词范本

```text
# Role
你是一位精通 Tailwind CSS 与 React 的前端视觉重构专家。

# Task
这是我手画的点餐界面布局草图（已上传）。请你仔细阅读图中的线框层级与文字指示，为我编写一个高还原度的响应式咖啡点餐卡片组件。

# 视觉设计硬性约束
1. 色彩系统：严禁使用默认黑白。必须采用高级的“赛博复古咖啡馆”专属配色（深棕色 `#3E2723`、浅米黄 `#D7CCC8` 和醒目的温暖橙黄 `#FF9800` 作为主色调）。
2. 设计美学：使用现代前端流行的精致毛玻璃效果（Glassmorphism）和圆润的大圆角（rounded-3xl），搭配细腻的扩散型漫反射阴影，以此拉开视觉纵深。
3. 响应式布局：小屏移动端视口下呈现垂直单列，中大屏自适应铺开为多列网格。

请输出一段纯净、可直接上线的 React 代码，并在组件内自动引入 lucide-react 进行图标美化。

```

### AI 视觉解构后产出的高内聚代码

大模型在接收到图片输入的瞬间，其神经网络便完成了对线条几何关系与文字实体的双向检索映射，仅仅几秒钟，便吐出了结构完整的工业级组件：

```jsx
import React, { useState } from 'react';
import { Coffee, ShoppingCart, Star, Heart } from 'lucide-react';

export default function CoffeeOrderCard() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#F5F2EB] p-6 flex flex-col items-center">
      {/* 咖啡馆 Banner 区域 */}
      <div className="w-full max-w-md bg-[#3E2723] rounded-3xl overflow-hidden shadow-2xl relative mb-6">
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="h-48 bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center" />
        <div className="absolute bottom-4 left-6 right-6 text-white z-10">
          <span className="bg-[#FF9800] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">今日特推</span>
          <h1 className="text-2xl font-bold mt-2">琥珀冰滴冷萃</h1>
          <p className="text-sm text-gray-300 mt-1">发酵 72 小时的极简醇厚，配有独特的果香余韵。</p>
        </div>
      </div>

      {/* 点餐数据卡片（毛玻璃融合效果） */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-[#D7CCC8] rounded-3xl p-6 shadow-xl relative">
        <button className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-red-50 transition-colors">
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm">
          <Star className="w-4 h-4 fill-current" />
          <span>4.9 (180+ 评价)</span>
        </div>

        <div className="mt-4 flex justify-between items-baseline">
          <h2 className="text-xl font-bold text-gray-800">特调琥珀冰滴</h2>
          <span className="text-2xl font-extrabold text-[#3E2723]">¥ 38.00</span>
        </div>

        {/* 规格选择网格 */}
        <div className="mt-6 flex flex-col gap-3">
          <span className="text-sm font-semibold text-gray-500">甜度选择</span>
          <div className="grid grid-cols-3 gap-2">
            {['无糖', '微糖 (3分)', '半糖 (5分)'].map((sugar, index) => (
              <button 
                key={index}
                className={`py-2 px-3 text-xs rounded-xl border text-center transition-all ${
                  index === 1 
                    ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md' 
                    : 'border-[#D7CCC8] text-gray-600 hover:bg-gray-50'
                }`}
              >
                {sugar}
              </button>
            ))}
          </div>
        </div>

        {/* 动态加入购物车主动作区 */}
        <div className="mt-8 flex gap-4 items-center">
          <button 
            onClick={() => setCartCount(c => c + 1)}
            className="flex-1 bg-gradient-to-r from-[#FF9800] to-[#E65100] text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:translate-y-[0px] transition-all flex justify-center items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>加入购物车 ({cartCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

```

将这段高还原度的代码合入你的本地主干，一个完美遵循你线框版面设计、具备现代美学、圆角间距极其合理的动态点餐卡片便宣告诞生。多模态 AI 帮你把原本枯燥的“重设像素”工作，压缩到了只有几次呼吸的电光火石之间。



## 实战案例 2：移动端诡异视觉缺陷诊断与自愈

多模态的另一个极高价值的战场，是处理那些单靠阅读代码很难发现的“瞬时态”视觉 Bug。尤其是针对不同移动端设备视口、不同浏览器内核（如 iOS Safari 的 WebKit 核心）引发的样式塌陷。

### 手机全面屏底部的 `100vh` 地址栏阻挡缺陷

开发者经常会遇到一个经典的移动端历史陷阱：当在 CSS 中对一个全屏遮罩模态弹窗设置 `height: 100vh` 时，在 PC 端模拟器上一切完美；但一旦拿到真实的 iPhone Safari 浏览器上运行，你会痛苦地发现，底部的“确认支付”或“关闭弹窗”按钮，有一半会被 Safari 浏览器自身弹出的动态底部工具栏无情挡死，完全无法点击。

这是因为在移动端规范里，`100vh` 计算的是浏览器的最大物理视口，它经常把动态收缩的地址栏也强行计算在内。

### 步骤一：视觉上下文投喂

我们直接在手机上把这个惨不忍睹的截断画面截屏，丢给 AI 工具（同时在提示词中 `@` 负责布局的 `Modal.css` 源代码）：

![移动端 Safari 100vh 底部遮挡缺陷](/img/mobile_layout_bug.png)
*图：移动端 Safari 100vh 底部遮挡缺陷示意图*

```css
/* 优化前有技术软伤的组件 CSS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh; /* ❌ 经典的 100vh 移动端视觉地雷 */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

```

人类总监指令：“AI 医生，我的模态弹窗在 iOS 真实设备上运行时发生了遮挡 Bug。底部的『确认支付』按钮被 Safari 浏览器的原生工具栏盖住了。这是我刚截取的真实翻车截图。我附上了负责布局的代码文件，请‘睁开眼’帮我诊断并给出改写后的自愈方案。”

### 步骤二：AI 视网膜审判与修正

AI 编程助手在读取了图像中按钮被拦截的物理几何错位后，结合代码中的 `100vh`，在 2 秒内下达了精准的诊断报告与重写方案：

“诊断报告：经典的移动端动态视口高度（Dynamic Viewport Height）计算缺陷。”

深度成因：移动端浏览器的地址栏和工具栏会随着滚动动态伸缩。`100vh` 无法感知这一动态变化。要彻底破局，必须引入现代 CSS 规范中的 动态视口单位（dvh） 配合全面屏安全区域环境变量（Safe Area Insets）。

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  
  /* 降级防线：对于完全不支持新特性的极老版浏览器内核 */
  height: 100vh;
  height: -webkit-fill-available;
  
  /* 现代标准：完美适配移动端动态地址栏和工具栏的伸缩 */
  height: 100dvh; 
  
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  
  /* ✅ 降维打击全面屏地雷：精准避开全面屏底部的黑条/安全视口区 */
  padding-bottom: env(safe-area-inset-bottom); 
}

```

将自愈代码合入系统。网页不仅能完美避开手机全面屏底部的物理黑条，也能随着工具栏的弹出与收缩实现像素级的无缝自适应。



## 视觉提示词工程（Visual Prompt Engineering）的四大铁律

为了把多模态模型的这双眼睛压榨到极致，避免其在处理视觉资产时产生新的“视力幻觉”，你在投喂图片和指导代理时，必须严格奉行以下四条黄金铁律：

### 铁律一：实施“高对比度”剪裁与红圈红线标记

如果你的屏幕很大，Bug 只是角落里一个错位了 2 个像素的小图标，绝对不要直接扔一张原始的 4K 分辨率全局大截图！这会导致模型的视觉注意力矩阵被海量的桌面背景噪声极度稀释。

* 黄金操作：用剪裁工具将缺陷局部精准切片。如果可以，使用红色画笔在 Bug 核心区手画一个红圈，并在一旁打上“重叠”、“重叠”等指示字样。多模态模型对带有红色强对比度标注的图像召回率接近 100%。

### 铁律二：强制注入明确的版面与排版空间约束

大模型虽然对颜色和宏观结构敏感，但在面对精密的前端还原时，经常会忽略微观间距（Margin / Padding）。

* 黄金操作：在下达指令时，必须追加明确的细节定性描述：“注意图片到文字标题之间的间距必须等于字高的一半，卡片的圆角需要呈现极度明显的钝角圆润，阴影应当是细腻无边框的漫反射扩散，拒绝任何生硬坚硬的黑投影。”

### 铁律三：色彩系统的精确十六进制固化（Grounding）

摄像头拍摄的物理白板照片或手机照片，由于受到现实环境光色温的影响，不可避免地会产生严重的偏色和色彩失真。

* 黄金操作：如果你知道标准的品牌色，千万不要含糊地对 AI 描述“帮我做一个好看的深色背景，配一个温馨的橙色按钮”。你必须指定精确的十六进制色值（如 `#3E2723`），或者直接在提示词中塞入一套品牌调色盘（Color Palette）基准字典。

### 铁律四：打破 DOM 依赖，强制启动纯视觉推理

在像 Google Antigravity 这样的自主代理 Ide 中工作时，社区开发者发现了一个隐秘的盲点：代理有时候在测试 UI 时会“过度偷懒依赖 DOM 树结构”。它发现 HTML 标签都在，就想当然地认为页面没问题，从而忽略了它自己截取的屏幕截图中，按钮文字已经溢出、或者两个元素在视觉上已经重叠在一起的低级灾难。

* 黄金操作：在派发测试代理时，在 Prompt 中强制追加高优先级的纯视觉复核命令：*“请启动你的多模态视网膜，仔细审视你刚刚在前台截取的真实渲染截图。严密确认在视觉呈现上，没有任何文本溢出容器边界，没有任何按钮发生像素级的物理重叠，且在当前移动端视口内完全可见。”*

