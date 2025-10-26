# 📚 文档索引

欢迎来到 TanStack Router + Zustand 集成项目的文档中心！

## 📖 文档导航

### 🚀 主文档 - [README.md](./README.md)
**适合**: 初学者、快速上手

**内容**:
- 项目概述和技术栈（Zustand + TanStack Query）
- 快速开始指南
- 双层状态管理架构详解
- Zustand 客户端状态管理
- TanStack Query 服务端状态管理
- API Hooks 管理器使用
- 性能优化说明
- 最佳实践
- 常见问题解答

**阅读时间**: 20-25 分钟

---

### 🔬 技术深度解析 - [ROUTER_CONTEXT.md](./ROUTER_CONTEXT.md)
**适合**: 想深入理解原理的开发者

**内容**:
- TanStack Router 内部实现原理
- 为什么传递函数引用而不是状态
- 性能优化的底层原理
- 与其他方案的详细对比
- 类型系统工作原理
- 上下文继承和扩展

**阅读时间**: 20-30 分钟

---

### ⚡ 快速参考手册 - [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
**适合**: 需要快速查询代码片段的开发者

**内容**:
- 常用代码片段
- 各种使用模式
- 性能优化技巧
- UI 模式示例
- 测试示例

**阅读时间**: 5-10 分钟（查询用）

---

## 🎯 根据需求选择文档

### 我是新手，想快速上手
👉 从 [README.md](./README.md) 开始

### 我想理解为什么这样设计
👉 阅读 [ROUTER_CONTEXT.md](./ROUTER_CONTEXT.md)

### 我需要查找特定的代码示例
👉 使用 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### 我想看实际运行的例子
👉 启动项目后访问以下页面：

**Zustand 示例**：
- `/` - 首页
- `/minimal-demo` - 最小示例
- `/context-demo` - 上下文演示
- `/state-demo` - 完整状态管理演示

**TanStack Query 示例**：
- `/notes-api` - API Hooks 使用
- `/notes-prefetch` - 数据预加载
- `/notes/$noteId` - 动态路由 + 预加载

**综合示例**：
- `/notes` - 备忘录系统（Zustand + TanStack Query）

---

## 📂 项目结构

```
tanstack-router-react19.2/
├── README.md                    # 主文档
├── ROUTER_CONTEXT.md           # 技术深度解析
├── QUICK_REFERENCE.md          # 快速参考手册
├── DOCUMENTATION.md            # 本文件 - 文档索引
│
├── src/
│   ├── App.tsx                 # 路由器配置 + Query Provider
│   ├── main.tsx                # 应用入口
│   │
│   ├── stores/
│   │   └── useAppStore.ts      # Zustand store 定义
│   │
│   ├── api/
│   │   ├── index.ts            # API 服务函数
│   │   └── factory.ts          # API Hooks 工厂
│   │
│   ├── providers/
│   │   └── api-provider.tsx    # API Hooks Provider
│   │
│   ├── lib/
│   │   ├── queryClient.ts      # Query Client 配置
│   │   └── utils.ts            # 工具函数
│   │
│   ├── types/
│   │   └── index.ts            # 类型定义
│   │
│   └── routes/
│       ├── __root.tsx          # 根路由
│       ├── index.tsx           # 首页
│       ├── about.tsx           # 关于页
│       ├── minimal-demo.tsx    # Zustand 最小示例
│       ├── context-demo.tsx    # Zustand 上下文演示
│       ├── state-demo.tsx      # Zustand 状态演示
│       ├── notes-api.tsx       # API Hooks 示例
│       ├── notes-prefetch.tsx  # 数据预加载示例
│       └── notes/              # 备忘录模块
│           ├── route.tsx       # 备忘录布局
│           ├── index.tsx       # 备忘录列表
│           ├── $noteId.tsx     # 备忘录详情（预加载）
│           └── styles/         # 样式文件
│
└── package.json                # 项目配置
```

---

## 🔑 核心概念速查

### Zustand（客户端状态）

```typescript
// 1. 获取 Store
const { useStore } = Route.useRouteContext()

// 2. 订阅状态
const theme = useStore((state) => state.theme)

// 3. 获取 Actions
const setTheme = useStore((state) => state.setTheme)

// 4. 使用浅比较
import { useShallow } from 'zustand/react/shallow'
const { user, theme } = useStore(
  useShallow((state) => ({ user: state.user, theme: state.theme }))
)
```

### TanStack Query（服务端状态）

```typescript
// 1. 获取 API Hooks
const { useApi } = Route.useRouteContext()
const api = useApi()

// 2. 查询数据
const { data, isLoading, error } = api.useNotes()

// 3. Mutation
const createNote = api.useCreateNote()
createNote.mutate({ title: "新备忘录", content: "内容" })

// 4. 路由预加载
export const Route = createFileRoute('/notes')({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ['notes'],
      queryFn: api.getNotes,
    })
  }
})
```

---

## 🎓 学习路径

### 第一步：理解基础（1 小时）
1. 阅读 README.md 的"快速开始"和"架构原理"部分
2. 启动项目并访问 `/minimal-demo`（Zustand 示例）
3. 访问 `/notes-api`（TanStack Query 示例）
4. 查看对应的源码文件

### 第二步：深入使用（2 小时）
1. 阅读 README.md 的"使用指南"部分
2. 访问所有示例页面，理解不同场景
3. 查看 `/notes-prefetch` 学习数据预加载
4. 尝试修改代码，添加新功能

### 第三步：理解原理（1 小时）
1. 阅读 ROUTER_CONTEXT.md
2. 理解为什么传递函数引用
3. 理解 API Hooks 工厂模式
4. 理解性能优化原理

### 第四步：实践应用（2+ 小时）
1. 使用 QUICK_REFERENCE.md 作为参考
2. 创建自己的 API Hooks
3. 在自己的项目中应用这种模式
4. 根据需求调整和优化

---

## 💡 提示

- 使用 `Cmd/Ctrl + F` 在文档中快速搜索
- 所有代码示例都可以直接复制使用
- 遇到问题时，先查看"常见问题"部分
- 建议按顺序阅读文档，循序渐进

---

## 🔗 外部资源

- [TanStack Router 官方文档](https://tanstack.com/router)
- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [React 19 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org)

---

## 📝 更新日志

### v1.0.0 (2025-10-26)
- ✅ 完整的文档体系
- ✅ 多个示例页面
- ✅ 完善的类型定义
- ✅ 性能优化实现

---

**祝您学习愉快！如有问题，欢迎提 Issue。** 🎉

