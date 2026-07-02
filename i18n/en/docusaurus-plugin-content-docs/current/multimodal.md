# Visual Engineering

> "Hearing is deceiving; seeing is believing." — "Book of Han"

Some models can only process text. For example, when the author wrote this book, DeepSeek could still only process text. But some models can not only process text but also images, and even audio and video; these are called multimodal models. Google Gemini is a multimodal model, so when we were creating illustrations for our book, we didn't even need to use extra AI tools. By directly making a request in the Google Antigravity dialog box, "Add some beautiful illustrations to this book," it started working.

For programming, the more useful scenario might not be drawing, but seeing. For example, if you encounter this situation: the frontend interface is drawn crookedly, the UI has a pixel-level misalignment, or a designer directly throws you a hand-drawn sketch, how do you give instructions to the AI?

For models that only support text, our communication with the model is strictly limited to "text." For the AI to help us restore a beautiful card layout, we have to painfully write long textual descriptions. This method is not only inefficient and full of ambiguity, but the AI often fails to capture the exact meaning, and the visual effects produced by blind modifications are even more bizarre.

With the full maturity of Multimodal Large Language Models (Multimodal LLMs) represented by the Claude series and the Google Gemini series, human-machine interaction has officially entered the visual era. AI programming tools have grown bright eyes and can directly deconstruct multimedia contexts such as images and videos using underlying logic. This chapter will lead you to appreciate the ultimate power of the "cyber retina" applied in frontend visual reconstruction, UI defect self-healing, and automated testing.



## The Philosophical Duel Between Passive Vision and Active Vision

At the current frontier of AI programming, Claude Code and Google Antigravity have respectively taken distinctly different yet converging engineering evolutionary paths in processing multimedia resources:

```text
┌────────────────────────────────────────────────────────────────────────┐
│             The Multimodal Retinal System of AI Programming            │
├───────────────────────────────────────┬────────────────────────────────┤
│       Claude Code (Passive Vision)    │Google Antigravity (Active Vision)│
├───────────────────────────────────────┼────────────────────────────────┤
│  * Relies on developers manually      │  * Relies on built-in browser  │
│    feeding images                     │    agents to autonomously get  │
│                                       │    visual feedback             │
│  * One-click clipboard encoding /     │  * Automatically generates rich│
│    Handoff Bundle integration         │    media artifacts like screen │
│                                       │    recordings and screenshots  │
│  * Hacker-style "see picture, write   │  * A tester capable of "seeing"│
│    code" extreme executor             │    effects and self-healing    │
└───────────────────────────────────────┴────────────────────────────────┘

```

### Claude Code: Targeted Vision Centered on Human Input

Although Claude Code is a hardcore command-line tool running in a pure text Terminal, its underlying Harness framework possesses extremely lightweight and sexy image perception capabilities. In the terminal, it primarily accepts human visual input through two passive methods:

* Direct Clipboard Injection: After using shortcuts in the local system to capture a UI defect or error popup, directly press `Cmd + V` (or `Ctrl + V`) in the terminal. The Harness will automatically encode the image in the background, tag it with `[image]`, and push it into the current context window.
* Design Handoff Bundle Integration: Through deep integration with the Claude Design toolchain, a complete asset bundle exported by a designer from Figma can be directly fed into the terminal via a single command, allowing the main agent to instantly gain a global, pixel-level big picture view.

### Google Antigravity: The Agent's Autonomously Acquired Visual Feedback Mechanism

Completely opposite to Claude Code's passive mode of waiting for humans to feed images, Google Antigravity demonstrates the "active vision" dominance of a giant mothership.

Relying on the underlying Computer Use technology of Gemini, it directly embeds a headless Browser Subagent within the system. This means that after it modifies frontend code, it doesn't need you to check the effect for it; it can silently pull up a local browser itself, click buttons and fill out forms like a human user, and take screenshots or record operation videos at key steps itself.

These multimedia resources will be precipitated into its Artifacts system. You can not only intuitively review its "Proof of Work," but also, like reviewing Google Docs, draw lines and leave comments with your mouse directly on the screenshots it submits. The agent will accurately extract the screen coordinates from the feedback and automatically initiate a new round of code fixes.


## Restoring Design Draft Sketches to React Frontend Components with One Click

To personally experience the power of multimodality, we first simulate a classic "requirement cold start" scenario: you are designing an online ordering page for a cafe. Your designer (or yourself) hastily drew a layout wireframe on a blank piece of paper with a pencil, including a Banner image, a today's special recommendation card, and an "Add to Cart" floating button at the bottom.

In the past, you needed to manually write the HTML skeleton first, then write hundreds of lines of CSS to tediously adjust alignment, spacing, fonts, and shadows, tossing and turning for an entire afternoon. Now, we just take a photo of this sketch with our phone and feed it directly to the AI programming tool.

### Feeding the Wireframe and Clarifying Constraint Specifications

* If you are using Claude Code: Directly drag the manuscript into the terminal and issue instructions.
* If you are using Google Antigravity: Drag the image into the Context area of the sidebar and issue macro goals in the panel.

![Hand-drawn ordering interface layout sketch](/img/coffee_order_sketch.png)
*Figure: Hand-drawn ordering interface layout sketch*

#### Visual Reconstruction Prompt Template

```text
# Role
You are a frontend visual reconstruction expert proficient in Tailwind CSS and React.

# Task
This is a hand-drawn sketch of an ordering interface layout I made (already uploaded). Please carefully read the wireframe hierarchy and text instructions in the picture and write a highly restored responsive coffee ordering card component for me.

# Visual Design Hard Constraints
1. Color System: Strictly forbid using default black and white. Must use a premium "Cyber Retro Cafe" exclusive color palette (dark brown `#3E2723`, light beige `#D7CCC8`, and striking warm orange `#FF9800` as the main colors).
2. Design Aesthetics: Use the exquisite Glassmorphism effect popular in modern frontends and large rounded corners (`rounded-3xl`), paired with delicate diffused shadows to create visual depth.
3. Responsive Layout: Presents as a vertical single column under small screen mobile viewports, and adaptively spreads out into a multi-column grid on medium to large screens.

Please output a pure, directly deployable React code segment, and automatically introduce `lucide-react` within the component for icon beautification.

```

### Highly Cohesive Code Produced After AI Visual Deconstruction

The moment the large model receives the image input, its neural network completes the two-way retrieval mapping of line geometric relationships and text entities. In just a few seconds, it spits out a structurally complete industrial-grade component:

```jsx
import React, { useState } from 'react';
import { Coffee, ShoppingCart, Star, Heart } from 'lucide-react';

export default function CoffeeOrderCard() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#F5F2EB] p-6 flex flex-col items-center">
      {/* Cafe Banner Area */}
      <div className="w-full max-w-md bg-[#3E2723] rounded-3xl overflow-hidden shadow-2xl relative mb-6">
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="h-48 bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center" />
        <div className="absolute bottom-4 left-6 right-6 text-white z-10">
          <span className="bg-[#FF9800] text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">Today's Special</span>
          <h1 className="text-2xl font-bold mt-2">Amber Ice Drip Cold Brew</h1>
          <p className="text-sm text-gray-300 mt-1">Minimalist and mellow fermented for 72 hours, with a unique fruity aftertaste.</p>
        </div>
      </div>

      {/* Ordering Data Card (Glassmorphism Effect) */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-[#D7CCC8] rounded-3xl p-6 shadow-xl relative">
        <button className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-red-50 transition-colors">
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
        </button>

        <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm">
          <Star className="w-4 h-4 fill-current" />
          <span>4.9 (180+ Reviews)</span>
        </div>

        <div className="mt-4 flex justify-between items-baseline">
          <h2 className="text-xl font-bold text-gray-800">Special Amber Ice Drip</h2>
          <span className="text-2xl font-extrabold text-[#3E2723]">¥ 38.00</span>
        </div>

        {/* Specification Selection Grid */}
        <div className="mt-6 flex flex-col gap-3">
          <span className="text-sm font-semibold text-gray-500">Sweetness Selection</span>
          <div className="grid grid-cols-3 gap-2">
            {['No Sugar', 'Less Sugar (30%)', 'Half Sugar (50%)'].map((sugar, index) => (
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

        {/* Dynamic Add to Cart Main Action Area */}
        <div className="mt-8 flex gap-4 items-center">
          <button 
            onClick={() => setCartCount(c => c + 1)}
            className="flex-1 bg-gradient-to-r from-[#FF9800] to-[#E65100] text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:translate-y-[0px] transition-all flex justify-center items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart ({cartCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

```

Merge this highly restored code into your local trunk, and a dynamic ordering card that perfectly follows your wireframe layout design, possesses modern aesthetics, and has extremely reasonable rounded corners and spacing is born. Multimodal AI helps you compress the originally tedious work of "resetting pixels" into just a few breaths of lightning speed.



## Practical Case 2: Diagnosis and Self-Healing of Bizarre Visual Defects on Mobile Devices

Another extremely high-value battlefield for multimodality is handling those "transient" visual Bugs that are hard to find just by reading code. Especially style collapses caused by different mobile device viewports and different browser cores (like iOS Safari's WebKit core).

### The `100vh` Address Bar Blocking Defect at the Bottom of Mobile Full Screens

Developers often encounter a classic mobile historical trap: when setting `height: 100vh` in CSS for a full-screen mask modal popup, everything is perfect on a PC emulator; but once it runs on a real iPhone Safari browser, you will painfully discover that the "Confirm Payment" or "Close Popup" button at the bottom is halfway ruthlessly blocked by Safari's own dynamic bottom toolbar popup, making it completely unclickable.

This is because in mobile specifications, `100vh` calculates the maximum physical viewport of the browser, which often forcibly includes the dynamically shrinking address bar.

### Step 1: Visual Context Feeding

We simply take a screenshot of this horrific truncated screen on the phone and throw it to the AI tool (while `@` mentioning the `Modal.css` source code responsible for the layout in the prompt):

![Mobile Safari 100vh Bottom Blocking Defect](/img/mobile_layout_bug.png)
*Figure: Schematic diagram of the Mobile Safari 100vh bottom blocking defect*

```css
/* Component CSS with a soft technical flaw before optimization */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh; /* ❌ Classic 100vh mobile visual landmine */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

```

Human Director Instruction: "Dr. AI, my modal popup experienced a blocking Bug when running on a real iOS device. The 'Confirm Payment' button at the bottom is covered by Safari's native toolbar. This is a real screenshot of the trainwreck I just took. I've attached the code file responsible for the layout. Please 'open your eyes' to help me diagnose and provide a self-healing rewritten solution."

### Step 2: AI Retina Trial and Correction

After reading the physical geometric misalignment of the intercepted button in the image and combining it with the `100vh` in the code, the AI programming assistant issues an accurate diagnostic report and rewriting plan within 2 seconds:

"Diagnostic Report: A classic mobile Dynamic Viewport Height calculation defect."

Deep Cause: The address bar and toolbar of mobile browsers stretch and shrink dynamically with scrolling. `100vh` cannot perceive this dynamic change. To break this completely, dynamic viewport units (`dvh`) in modern CSS specifications must be introduced, along with environment variables for the safe area of full screens (`Safe Area Insets`).

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  
  /* Degradation defense line: for extremely old browser cores that completely don't support new features */
  height: 100vh;
  height: -webkit-fill-available;
  
  /* Modern standard: perfectly adapts to the stretching and shrinking of mobile dynamic address bars and toolbars */
  height: 100dvh; 
  
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  
  /* ✅ Dimensionality reduction strike on full-screen landmines: accurately avoids the black bar/safe viewport area at the bottom of full screens */
  padding-bottom: env(safe-area-inset-bottom); 
}

```

Merge the self-healing code into the system. The web page not only perfectly avoids the physical black bar at the bottom of the phone's full screen, but also achieves pixel-level seamless adaptation as the toolbar pops up and shrinks.



## The Four Iron Laws of Visual Prompt Engineering

To squeeze the absolute most out of the multimodal model's eyes and avoid generating new "visual hallucinations" when processing visual assets, you must strictly follow these four golden iron laws when feeding images and instructing agents:

### Iron Law 1: Implement "High Contrast" Cropping and Red Circle/Red Line Marking

If your screen is very large and the Bug is just a small icon misplaced by 2 pixels in the corner, absolutely do not throw a raw 4K resolution global large screenshot directly! This will cause the model's visual attention matrix to be extremely diluted by massive desktop background noise.

* Golden Operation: Use a cropping tool to precisely slice the local defect. If possible, use a red brush to hand-draw a red circle in the core area of the Bug, and add indicative text like "overlap", "overlap" next to it. The recall rate of multimodal models for images with red high-contrast annotations is close to 100%.

### Iron Law 2: Force Injection of Explicit Layout and Spacing Constraints

Although large models are sensitive to colors and macro structures, they often ignore micro-spacing (Margin / Padding) when faced with precise frontend restoration.

* Golden Operation: When issuing instructions, you must append clear, qualitative detail descriptions: "Note that the spacing between the image and the text title must equal half the font height; the rounded corners of the card need to present extremely obvious obtuse roundness; the shadows should be delicate, borderless diffused reflections, rejecting any stiff, hard black drop shadows."

### Iron Law 3: Precise Hexadecimal Grounding of Color Systems

Physical whiteboard photos or mobile phone photos taken by cameras will inevitably produce severe color cast and color distortion due to the influence of the color temperature of the ambient light in the real world.

* Golden Operation: If you know the standard brand colors, never vaguely describe to the AI, "Help me make a nice-looking dark background with a warm orange button." You must specify the exact hexadecimal color value (like `#3E2723`), or directly embed a brand Color Palette benchmark dictionary into the prompt.

### Iron Law 4: Break DOM Dependency, Force the Start of Pure Visual Reasoning

When working in autonomous agent IDEs like Google Antigravity, community developers found a hidden blind spot: agents sometimes "over-lazily rely on the DOM tree structure" when testing UI. Finding that the HTML tags are all there, it takes for granted that the page is fine, thereby ignoring low-level disasters in its own screenshots, such as button text overflowing, or two elements visually overlapping each other.

* Golden Operation: When dispatching a test agent, forcefully append a high-priority pure visual review command in the Prompt: *"Please activate your multimodal retina to carefully examine the real rendering screenshot you just took in the foreground. Strictly confirm that in the visual presentation, no text overflows container boundaries, no buttons have pixel-level physical overlap, and everything is completely visible within the current mobile viewport."*
