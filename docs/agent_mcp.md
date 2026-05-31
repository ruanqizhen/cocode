---
title: Agent Skills 与扩展协议（MCP）
---

# Agent Skills 与扩展协议（MCP）

> **“当 Agent 掌握了主动操控工具和打破沙盒连接现实的能力，它就不再只是个助手，而是一个真正的赛博数智人。”**

---

在长期开发一个复杂项目时，你会发现有些重复的动作大模型总是需要你反复教导才能做对。例如：“清理 Docker 缓存 -> 重置 Supabase 本地数据库 -> 生成最新 Prisma 客户端 -> 运行种子（Seed）数据填充”。

通过在项目根目录编写 **`SKILL.md`（技能树文件）**，你可以一劳永逸地教会大模型这些复杂的复合动作。然而，如果我们想让大模型跨出文本编辑器，拥有主动访问数据库、操纵浏览器截图、甚至直接调用公司内网私有服务的本领，我们需要一根划时代的连接插线——这就是 **Model Context Protocol（模型上下文协议，简称 MCP）**。

本章将系统剖析 MCP 的协议基石，并手把手带你用 Node.js **动手编写一个可以读写本地 SQLite 数据库的自定义 MCP Server**。

---

## 1. 极速扫盲：MCP 的三大核心支柱

MCP 是 Anthropic 联合行业巨头推出的开源开放协议，你可以把它当成大模型连接外部世界的“USB 数据接口”。在协议内部，主要定义了三种大模型可以调用的核心原语（Primitives）：

* **资源（Resources）**：向大模型提供只读的、高质量的静态数据源。比如：把本地的一个 `api-documentation.json`、或者一个日志文件声明为“资源”，大模型可以像查阅图书一样随时拉取它。
* **工具（Tools）**：向大模型提供**可以执行动作的“武器”**。比如：“执行一条数据库 SQL 查询”、“请求浏览器截图网页”或“通过 Slack 发送消息”。这是 Agent 能够主动改变外部物理世界的核心方式。
* **提示词模板（Prompts）**：向大模型提供预设好的、带有占位符的对话模板。比如：“重构当前文件并补充测试的提示词模板”，大模型可以动态填入文件名并直接套用最佳实践。

---

## 2. 动手实战：从零编写一个 SQLite 自定义 MCP Server

许多 AI 原生工具（如 Cline、Cursor）都原生支持接入自定义 MCP Server。下面我们将使用 **Node.js (TypeScript/JavaScript)** 动手写一个极其好用的 MCP Server。这个 Server 会暴露两个工具给 AI：
1. `query_database`：允许 AI 自主查询本地 SQLite 数据库中的数据。
2. `insert_user`：允许 AI 写入新用户数据到 SQLite 数据库中。

---

### 🛠️ 第一步：创建项目并安装依赖
在本地新建一个名为 `mcp-sqlite-server` 的文件夹，在终端运行：
```bash
npm init -y
npm install @modelcontextprotocol/sdk sqlite3
npm install -D typescript @types/node @types/sqlite3 tsx
```
初始化 TypeScript 配置：
```bash
npx tsc --init
```

---

### 📝 第二步：编写核心 MCP 服务代码
在根目录下新建 `index.ts`，写入如下完整的、符合 MCP SDK 官方规范的代码：

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import sqlite3 from "sqlite3";
import { Database } from "sqlite";

// 1. 初始化本地 SQLite 数据库，并建立一张测试表
const db = new sqlite3.Database("./local_users.db");
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'developer'
    )
  `);
});

// 2. 创建一个名为 "sqlite-mcp-server" 的 MCP 服务实例
const server = new Server(
  {
    name: "sqlite-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {}, // 声明本 Server 具有提供 Tools 工具的能力
    },
  }
);

// 3. 向大模型声明我们拥有的工具列表 (List Tools)
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "query_database",
        description: "运行 SELECT SQL 语句查询本地用户数据库。仅允许只读查询。",
        inputSchema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "要在 local_users.db 上运行的只读 SELECT SQL 语句。例如: 'SELECT * FROM users LIMIT 10'"
            }
          },
          required: ["sql"]
        }
      },
      {
        name: "insert_user",
        description: "向本地用户表中插入一条新用户记录。",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "用户的姓名" },
            email: { type: "string", description: "用户的唯一邮箱地址" },
            role: { type: "string", description: "用户的系统角色，默认是 'developer'" }
          },
          required: ["name", ["email"]]
        }
      }
    ]
  };
});

// 4. 实现工具的执行逻辑 (Call Tool)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "query_database") {
    const sql = args?.sql as string;
    // 严格限制，防止 AI 通过注入执行危险的删除语句
    if (!sql.toLowerCase().trim().startsWith("select")) {
      return {
        content: [{ type: "text", text: "错误: 该工具仅允许执行 SELECT 只读语句。" }],
        isError: true
      };
    }

    return new Promise((resolve) => {
      db.all(sql, [], (err, rows) => {
        if (err) {
          resolve({
            content: [{ type: "text", text: `SQL 执行失败: ${err.message}` }],
            isError: true
          });
        } else {
          resolve({
            content: [{ type: "text", text: JSON.stringify(rows, null, 2) }]
          });
        }
      });
    });
  }

  if (name === "insert_user") {
    const userName = args?.name as string;
    const userEmail = args?.email as string;
    const userRole = (args?.role as string) || "developer";

    return new Promise((resolve) => {
      db.run(
        "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
        [userName, userEmail, userRole],
        function (err) {
          if (err) {
            resolve({
              content: [{ type: "text", text: `写入失败: ${err.message}` }],
              isError: true
            });
          } else {
            resolve({
              content: [{ type: "text", text: `写入成功！新用户 ID 为: ${this.lastID}` }]
            });
          }
        }
      );
    });
  }

  throw new Error(`找不到匹配的工具: ${name}`);
});

// 5. 启动服务并采用标准输入输出 (Stdio) 进行通信传输
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("SQLite MCP Server 启动成功！正在等待 AI 指令...");
```

编译并测试运行：
```bash
npx tsx index.ts
```
*(如果看到控制台报错输出“正在等待 AI 指令”，说明服务已经在后台以 Stdio 模式顺利拉起。)*

---

### 🔌 第三步：将自定义 Server 接入你的 AI 原生工具（以 Cline 为例）

1. 打开 VS Code 的 **Cline 扩展配置**。
2. 找到配置项中的 **MCP Servers Config**（通常对应一个本地的 `cline_mcp_settings.json` 配置文件）。
3. 加入如下配置段落：

```json
{
  "mcpServers": {
    "sqlite-mcp": {
      "command": "npx",
      "args": [
        "tsx",
        "c:/path/to/your/mcp-sqlite-server/index.ts" 
      ]
    }
  }
}
```
*(请将路径替换为您本地实际的项目路径)*

### 🎮 第四步：见证奇迹！测试 AI 对本地数据库的自主调度
接入成功后，重新打开 Cline。在聊天窗口中，你不需要给他喂任何数据模型，直接输入：
> “亲爱的 Cline，请帮我检查一下本地用户数据库里有哪些角色，并帮我新增一个名字叫‘赛博武僧’、邮箱为‘monk@cyber.com’的管理员。”

**你会看到令人震惊的画面**：
1. Cline 在右侧面板中，亮起特殊的绿灯提示：**“Requested Tool: query_database”**。
2. Cline 自主生成了：`SELECT DISTINCT role FROM users`。
3. 本地数据库跑出结果，返还给 Cline。
4. Cline 紧接着亮起绿灯：**“Requested Tool: insert_user”**，参数填入 `{"name": "赛博武僧", "email": "monk@cyber.com", "role": "admin"}`。
5. 插入成功，Cline 开心地告诉你：“已经成功为您建立了管理员记录，ID 为 1。”

通过 MCP 协议，你的 Agent 拥有了直接触摸本地数据库的物理双手，信息交互的效率和自主性实现了质的跃迁！

---

## 本章小结

本章向你展示了人机协作从“纸上谈兵”转入“自主操盘”的全新形态。我们：
1. 系统剖析了 MCP 协议的三大支柱：只读资源（Resources）、物理工具（Tools）与预设模板（Prompts）；
2. 使用 Node.js 亲手实现了一个自定义 SQLite 数据库读取与写入的 MCP 接口服务；
3. 实战配置了 Cline，亲眼见证了 Agent 如何自主做决定、自主读写本地数据库的全过程。

Agent 拥有了双手，让一切变得全自动。但这同样引入了另一个恐怖的风险：一旦 Agent 在调试过程中发生逻辑混乱，可能会在几毫秒内将你的系统搞崩溃。

下一章，让我们一起走进 **《橡皮鸭调试与自动化测试：让大模型成为你的全职排错官》（扩充版）**。
