# TanStack Router + Zustand 集成项目

这是一个展示如何将 Zustand 状态管理器集成到 TanStack Router 上下文中的完整示例项目。

## 📚 目录

- [🛠 技术栈](#-技术栈)
- [🏗 核心架构](#-核心架构)
- [🚀 快速开始](#-快速开始)
- [📖 架构详解](#-架构详解)
- [📝 使用指南](#-使用指南)
- [⚡ 性能优化](#-性能优化)
- [🎯 最佳实践](#-最佳实践)
- [📱 示例页面](#-示例页面)
- [🔍 常见问题](#-常见问题)
- [📚 相关资源](#-相关资源)

## 🛠 技术栈

- **React 19.2** - 最新版本的 React
- **TanStack Router 1.132** - 类型安全的路由解决方案
- **Zustand 4.x** - 轻量级状态管理库
- **TypeScript 5.9** - 类型安全
- **Vite 7.1** - 现代构建工具
- **Semi Design** - UI 组件库

## 🏗 核心架构

### 架构原理

本项目采用了一种创新的架构模式：**将 Zustand store 作为 hook 函数注入到 TanStack Router 的上下文中**。

```
┌─────────────────────────────────────────┐
│  App.tsx                                │
│  创建路由器，注入 useAppStore           │
└──────────────┬──────────────────────────┘
               │
               ↓ TanStack Router Context
               │
┌──────────────┴──────────────────────────┐
│  所有路由组件                            │
│  通过 Route.useRouteContext() 访问      │
│  调用 useStore() 获取状态               │
└─────────────────────────────────────────┘
```

### 为什么这样设计？

1. **依赖注入** - 不需要在每个文件中导入 store
2. **类型安全** - 完整的 TypeScript 支持
3. **性能优化** - Context 传递函数引用，Zustand 提供细粒度订阅
4. **路由集成** - 可在路由生命周期中访问状态

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 📖 架构详解

### 1. Store 定义 (`src/stores/useAppStore.ts`)

```typescript
export interface AppStore {
  user: { name: string } | null
  theme: "light" | "dark"
  notes: Array<{...}>
  
  // Actions
  login: (user: { name: string }) => void
  setTheme: (theme: "light" | "dark") => void
  addNote: (note: ...) => void
  // ... 更多方法
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 状态和方法实现
      }),
      { name: "app-storage" }
    ),
    { name: "app-store" }
  )
)

// 导出 store 类型
export type AppStoreType = typeof useAppStore
```

**关键点**：
- 导出 `AppStore` 接口用于类型定义
- 导出 `AppStoreType` 类型（`typeof useAppStore`）
- 使用 `devtools` 和 `persist` 中间件

### 2. 路由器配置 (`src/App.tsx`)

```typescript
import { useAppStore, type AppStoreType } from "./stores/useAppStore"

interface MyRouterContext {
  useStore: AppStoreType  // 存储 hook 函数类型
}

const router = createRouter({
  routeTree,
  context: {
    useStore: useAppStore,  // 传递 hook 函数本身
  } satisfies MyRouterContext,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
```

**关键点**：
- 传递的是 **hook 函数本身**，不是 `getState()`
- 使用 `satisfies` 确保类型正确
- 通过 module augmentation 注册路由器类型

### 3. 根路由定义 (`src/routes/__root.tsx`)

```typescript
import type { AppStoreType } from "@/stores/useAppStore"

interface MyRouterContext {
  useStore: AppStoreType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  // 从路由器上下文获取 store hook
  const { useStore } = Route.useRouteContext()
  
  // 调用 hook 获取状态
  const { user, theme, login, setTheme } = useStore()
  
  return (
    // ... JSX
  )
}
```

**关键点**：
- 使用 `createRootRouteWithContext<T>()` 定义上下文类型
- 通过 `Route.useRouteContext()` 获取上下文
- 调用 `useStore()` 订阅状态

### 4. 在任何路由组件中使用

```typescript
function AnyRouteComponent() {
  const { useStore } = Route.useRouteContext()
  const { user, theme } = useStore()
  
  return <div>{user?.name} - {theme}</div>
}
```

## 📝 使用指南

### 基础用法

#### 1. 获取整个 store（不推荐）

```typescript
const { useStore } = Route.useRouteContext()
const state = useStore()  // ❌ 任何状态变化都会重渲染
```

#### 2. 解构获取状态（推荐）

```typescript
const { useStore } = Route.useRouteContext()
const { user, theme } = useStore()  // ✅ 只订阅这两个状态
```

### 高级用法

#### 1. 使用选择器（Selector）

```typescript
const { useStore } = Route.useRouteContext()

// 只订阅 theme
const theme = useStore((state) => state.theme)

// 派生状态
const isLoggedIn = useStore((state) => state.user !== null)

// 计算属性
const noteCount = useStore((state) => state.notes.length)
```

#### 2. 使用浅比较（Shallow）

```typescript
import { shallow } from 'zustand/shallow'

const { useStore } = Route.useRouteContext()

const { user, theme } = useStore(
  (state) => ({ user: state.user, theme: state.theme }),
  shallow  // 只有值变化时才重渲染
)
```

#### 3. 使用 useShallow Hook（推荐）

```typescript
import { useShallow } from 'zustand/react/shallow'

const { useStore } = Route.useRouteContext()

const { user, theme, notes } = useStore(
  useShallow((state) => ({
    user: state.user,
    theme: state.theme,
    notes: state.notes
  }))
)
```

#### 4. 只获取 Actions

```typescript
const { useStore } = Route.useRouteContext()

// 只获取方法，不订阅状态
const login = useStore((state) => state.login)
const setTheme = useStore((state) => state.setTheme)

// 这些函数引用是稳定的，不会导致重渲染
```

#### 5. 派生状态

```typescript
const { useStore } = Route.useRouteContext()

// 根据多个状态计算新值
const filteredNotes = useStore((state) => {
  const { notes, searchQuery, selectedFolder } = state
  
  let filtered = notes
  
  if (selectedFolder !== 'all') {
    filtered = filtered.filter(note => note.folderId === selectedFolder)
  }
  
  if (searchQuery) {
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  
  return filtered
})
```

#### 6. 在事件处理器中使用 getState

```typescript
const { useStore } = Route.useRouteContext()

const handleComplexOperation = () => {
  // 获取当前状态快照
  const currentState = useStore.getState()
  console.log('当前状态:', currentState)
  
  // 直接修改状态
  useStore.setState({ theme: 'dark' })
  
  // 基于当前状态更新
  useStore.setState((state) => ({
    notes: [...state.notes, newNote]
  }))
}
```

#### 7. 外部订阅

```typescript
const { useStore } = Route.useRouteContext()

useEffect(() => {
  // 订阅特定状态的变化
  const unsubscribe = useStore.subscribe(
    (state) => state.theme,
    (theme) => {
      console.log('主题变化:', theme)
      // 执行副作用
    }
  )
  
  return unsubscribe
}, [useStore])
```

## ⚡ 性能优化

### 为什么性能好？

#### 1. Context 层面 - 函数引用不变

```typescript
// ✅ Context 中存储的是函数引用
context: {
  useStore: useAppStore  // 这个引用永远不变
}

// Context value 不变 → 不触发 Context 消费者重渲染
```

#### 2. Zustand 层面 - 细粒度订阅

```typescript
// ✅ 只订阅需要的状态
const theme = useStore((state) => state.theme)

// theme 变化时，只有使用 theme 的组件会重渲染
// 其他组件不受影响
```

### 性能对比

```typescript
// ❌ 差：订阅整个 store
const state = useStore()

// ✅ 好：使用选择器
const theme = useStore((state) => state.theme)

// ✅ 更好：浅比较多个字段
const { user, theme } = useStore(
  (state) => ({ user: state.user, theme: state.theme }),
  shallow
)

// ✅ 最佳：使用 useShallow
const { user, theme } = useStore(
  useShallow((state) => ({ user: state.user, theme: state.theme }))
)
```

### 与传统 React Context 对比

| 特性 | 传统 Context | 我们的方案 |
|------|-------------|-----------|
| Context 值变化 | 状态变化时重新创建 | 永远不变（函数引用） |
| 消费者重渲染 | 所有消费者都重渲染 | 不触发重渲染 |
| 状态订阅 | 粗粒度 | 细粒度（Zustand） |
| 性能 | ❌ 较差 | ✅ 优秀 |

## 🎯 最佳实践

### 1. 使用选择器而不是解构

```typescript
// ❌ 避免
const { user, theme, notes, searchQuery } = useStore()

// ✅ 推荐
const user = useStore((state) => state.user)
const theme = useStore((state) => state.theme)

// ✅ 或使用 useShallow
const { user, theme } = useStore(
  useShallow((state) => ({ user: state.user, theme: state.theme }))
)
```

### 2. 分离状态和 Actions

```typescript
// ✅ 状态订阅
const theme = useStore((state) => state.theme)

// ✅ Actions（不会导致重渲染）
const setTheme = useStore((state) => state.setTheme)
```

### 3. 派生状态在选择器中计算

```typescript
// ✅ 在选择器中计算派生状态
const filteredCount = useStore((state) => {
  const { notes, searchQuery } = state
  return notes.filter(note => 
    note.title.includes(searchQuery)
  ).length
})
```

### 4. 在路由守卫中使用上下文

```typescript
export const Route = createFileRoute('/protected')({
  beforeLoad: ({ context }) => {
    const { useStore } = context
    const user = useStore.getState().user
    
    if (!user) {
      throw redirect({ to: '/login' })
    }
  }
})
```

### 5. 类型定义统一管理

```typescript
// src/types/index.ts
export interface MyRouterContext {
  useStore: AppStoreType
}

// 在各个文件中导入使用
import type { MyRouterContext } from "@/types"
```

## 📱 示例页面

项目包含多个示例页面，展示不同的使用场景：

### 1. 首页 (`/`)
- 基础的状态获取和显示
- 主题切换功能

### 2. 最小示例 (`/minimal-demo`)
- 最简单的使用方式
- 适合快速上手

### 3. 上下文演示 (`/context-demo`)
- 展示如何在路由组件中使用上下文
- 包含用户登录、主题切换、备忘录管理

### 4. 状态演示 (`/state-demo`)
- 完整的状态管理演示
- 包含搜索、过滤、CRUD 操作

### 5. 备忘录系统 (`/notes`)
- 三栏布局设计
- 文件夹分类、搜索功能
- 备忘录详情页

## 🔍 常见问题

### Q1: 为什么传递 hook 函数而不是状态？

**A**: 传递函数引用有以下优势：
- Context value 永远不变，不触发不必要的重渲染
- 保持 Zustand 的细粒度订阅能力
- 符合 React hooks 的使用规范

### Q2: 如何避免重渲染？

**A**: 使用选择器：
```typescript
// ✅ 只订阅需要的状态
const theme = useStore((state) => state.theme)
```

### Q3: 可以在路由生命周期中访问状态吗？

**A**: 可以！
```typescript
export const Route = createFileRoute('/example')({
  beforeLoad: ({ context }) => {
    const state = context.useStore.getState()
    // 使用状态
  },
  loader: ({ context }) => {
    const user = context.useStore.getState().user
    // 基于用户加载数据
  }
})
```

### Q4: 如何调试状态？

**A**: 使用 Zustand DevTools：
- 安装 Redux DevTools 浏览器扩展
- 状态变化会自动显示在 DevTools 中
- 可以查看状态历史、时间旅行等

### Q5: 状态会持久化吗？

**A**: 是的！使用了 `persist` 中间件：
- 自动保存到 localStorage
- 刷新页面后状态恢复
- 可以配置哪些状态需要持久化

## 📚 相关资源

- [TanStack Router 官方文档](https://tanstack.com/router)
- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [React 19 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**Happy Coding! 🎉**
