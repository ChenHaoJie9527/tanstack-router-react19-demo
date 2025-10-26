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
- **TanStack Query 5.x** - 服务端状态管理和数据获取
- **Zustand 4.x** - 客户端状态管理库
- **TypeScript 5.9** - 类型安全
- **Vite 7.1** - 现代构建工具
- **Semi Design** - UI 组件库

## 🏗 核心架构

### 架构原理

本项目采用了一种创新的架构模式：**通过 TanStack Router 的上下文系统实现依赖注入**。

```
┌─────────────────────────────────────────────────┐
│  TanStack Router Context                       │
│  - useStore (Zustand - 客户端状态)             │
│  - useApi (API Hooks 管理器 - 服务端状态)      │
│  - queryClient (TanStack Query)                │
└──────────────┬──────────────────────────────────┘
               │
               ↓ 依赖注入
               │
┌──────────────┴──────────────────────────────────┐
│  所有路由组件                                    │
│  - Route.useRouteContext() 获取依赖             │
│  - useStore() → 客户端状态（UI、偏好）          │
│  - useApi() → 服务端数据（API 调用）            │
└─────────────────────────────────────────────────┘
```

### 为什么这样设计？

1. **依赖注入** - 统一的依赖管理，便于测试和维护
2. **职责分离** - 客户端状态（Zustand）和服务端状态（TanStack Query）分离
3. **类型安全** - 完整的 TypeScript 支持和自动类型推断
4. **性能优化** - Context 传递函数引用，细粒度的状态订阅
5. **开发体验** - 集中管理的 API Hooks，简洁的调用方式
6. **路由集成** - 可在路由生命周期中访问所有依赖

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

### 状态管理分层

本项目采用**双层状态管理**架构：

| 层级 | 技术 | 职责 | 示例 |
|------|------|------|------|
| **客户端状态** | Zustand | UI 状态、用户偏好、临时数据 | 主题、侧边栏状态、表单草稿 |
| **服务端状态** | TanStack Query | API 数据、缓存、同步 | 用户信息、备忘录列表 |

### 1. Zustand Store 定义 (`src/stores/useAppStore.ts`)

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

### 2. API Hooks 工厂 (`src/api/factory.ts`)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from './index'

// Query Keys 管理
export const queryKeys = {
  notes: {
    all: ['notes'] as const,
    lists: () => [...queryKeys.notes.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.notes.all, id] as const,
  },
}

// 创建 API Hooks 工厂函数
export function createApiHooks() {
  return {
    // 查询备忘录列表
    useNotes: (options?) => {
      return useQuery({
        queryKey: queryKeys.notes.lists(),
        queryFn: api.getNotes,
        ...options,
      })
    },

    // 创建备忘录
    useCreateNote: (options?) => {
      const queryClient = useQueryClient()
      
      return useMutation({
        mutationFn: api.createNote,
        onSuccess: (data, variables, context) => {
          // 自动刷新列表
          queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() })
          options?.onSuccess?.(data, variables, context)
        },
        ...options,
      })
    },
    
    // ... 更多 API hooks
  }
}

export type ApiHooks = ReturnType<typeof createApiHooks>
```

**关键点**：
- 集中管理所有 API 相关的 hooks
- 自动处理缓存失效和数据同步
- 支持自定义选项和回调
- 完整的 TypeScript 类型支持

### 3. API Provider (`src/providers/api-provider.tsx`)

```typescript
import { createContext, useContext } from 'react'
import { createApiHooks, type ApiHooks } from '@/api/factory'

const ApiContext = createContext<ApiHooks | null>(null)

export function ApiProvider({ children }) {
  const apiHooks = createApiHooks()
  return (
    <ApiContext.Provider value={apiHooks}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within ApiProvider')
  }
  return context
}
```

### 4. 路由器配置 (`src/App.tsx`)

```typescript
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { routeTree } from "./routeTree.gen"
import { useAppStore } from "./stores/useAppStore"
import { queryClient } from "./lib/queryClient"
import { ApiProvider, useApi } from "./providers/api-provider"
import type { MyRouterContext } from "./types"

const router = createRouter({
  routeTree,
  context: {
    useStore: useAppStore,
    queryClient,
    useApi, // 注入 API Hooks 工厂
  } satisfies MyRouterContext,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ApiProvider>
    </QueryClientProvider>
  )
}
```

**关键点**：
- 使用 `QueryClientProvider` 包裹整个应用
- 使用 `ApiProvider` 提供 API Hooks
- 将 `useApi` 工厂函数注入路由器上下文
- 集成 React Query DevTools

### 5. 根路由定义 (`src/routes/__root.tsx`)

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

## 📝 使用指南

### 客户端状态管理（Zustand）

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

### 服务端状态管理（TanStack Query + API Hooks）

#### 1. 基础用法

```typescript
function NotesComponent() {
  // 获取 API Hooks 管理器
  const { useApi } = Route.useRouteContext()
  const api = useApi()
  
  // 查询数据
  const { data: notes, isLoading, error } = api.useNotes()
  
  // Mutation
  const createNote = api.useCreateNote()
  const deleteNote = api.useDeleteNote()
  
  const handleCreate = () => {
    createNote.mutate({
      title: "新备忘录",
      content: "内容",
      folderId: "personal"
    })
  }
  
  if (isLoading) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>
  
  return (
    <div>
      <button onClick={handleCreate} disabled={createNote.isPending}>
        {createNote.isPending ? '创建中...' : '创建备忘录'}
      </button>
      {notes?.map(note => (
        <div key={note.id}>
          {note.title}
          <button 
            onClick={() => deleteNote.mutate(note.id)}
            disabled={deleteNote.isPending}
          >
            删除
          </button>
        </div>
      ))}
    </div>
  )
}
```

#### 2. 自定义选项

```typescript
function Component() {
  const { useApi } = Route.useRouteContext()
  const api = useApi()
  
  // 传递自定义选项
  const { data } = api.useNotes({
    staleTime: 1000 * 60 * 10, // 10 分钟
    refetchInterval: 30000, // 每 30 秒刷新
  })
  
  // 自定义 mutation 回调
  const createNote = api.useCreateNote({
    onSuccess: (data) => {
      console.log('创建成功:', data)
    },
    onError: (error) => {
      console.error('创建失败:', error)
    }
  })
}
```

#### 3. 路由级别的数据预加载

```typescript
import { queryKeys } from '@/api/factory'
import { api } from '@/api'

export const Route = createFileRoute('/notes/$noteId')({
  // 在路由加载时预取数据
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData({
      queryKey: queryKeys.notes.detail(params.noteId),
      queryFn: () => api.getNote(params.noteId),
    })
  },
  
  component: NoteDetail,
})

function NoteDetail() {
  const { noteId } = Route.useParams()
  const { useApi } = Route.useRouteContext()
  const api = useApi()
  
  // 数据已预加载，立即可用
  const { data: note } = api.useNote(noteId)
  
  return <div>{note?.title}</div>
}
```

### Zustand 高级用法

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

### Zustand 示例

#### 1. 首页 (`/`)
- 基础的 Zustand 状态获取和显示
- 主题切换功能

#### 2. 最小示例 (`/minimal-demo`)
- 最简单的 Zustand 使用方式
- 适合快速上手

#### 3. 上下文演示 (`/context-demo`)
- 展示如何在路由组件中使用 Zustand 上下文
- 包含用户登录、主题切换、备忘录管理

#### 4. 状态演示 (`/state-demo`)
- 完整的 Zustand 状态管理演示
- 包含搜索、过滤、本地状态操作

### TanStack Query 示例

#### 5. API Hooks 示例 (`/notes-api`)
- 展示 API Hooks 管理器的使用
- 包含查询、创建、删除操作
- 自动缓存失效和数据同步

#### 6. 数据预加载示例 (`/notes-prefetch`)
- 展示路由级别的数据预加载
- 使用 loader 预取数据
- 无加载状态的即时渲染

#### 7. 备忘录详情 (`/notes/$noteId`)
- 动态路由参数
- 数据预加载 + API Hooks
- 完整的 CRUD 操作

### 综合示例

#### 8. 备忘录系统 (`/notes`)
- 三栏布局设计
- 文件夹分类、搜索功能
- Zustand + TanStack Query 混合使用

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

**A**: Zustand 状态会持久化：
- 使用 `persist` 中间件
- 自动保存到 localStorage
- 刷新页面后状态恢复
- 可以配置哪些状态需要持久化

TanStack Query 也有缓存：
- 自动缓存查询结果
- 可配置缓存时间
- 支持持久化到 localStorage（需额外配置）

### Q6: 什么时候用 Zustand，什么时候用 TanStack Query？

**A**: 职责分离原则：

**使用 Zustand**：
- ✅ UI 状态（主题、侧边栏、模态框）
- ✅ 用户偏好（语言、布局）
- ✅ 表单草稿
- ✅ 本地计算和过滤

**使用 TanStack Query**：
- ✅ API 数据获取
- ✅ 服务端数据缓存
- ✅ 数据同步和刷新
- ✅ 乐观更新

### Q7: API Hooks 管理器的优势是什么？

**A**: 
- ✅ 集中管理所有 API 调用
- ✅ 自动处理缓存失效
- ✅ 统一的错误处理
- ✅ 易于测试和 mock
- ✅ 完整的类型推断
- ✅ 简洁的调用方式

### Q8: 如何在路由守卫中使用？

**A**: 
```typescript
export const Route = createFileRoute('/protected')({
  beforeLoad: ({ context }) => {
    // 访问 Zustand store
    const user = context.useStore.getState().user
    
    // 访问 Query 缓存
    const cachedData = context.queryClient.getQueryData(['key'])
    
    if (!user) {
      throw redirect({ to: '/login' })
    }
  }
})
```

## 📚 相关资源

- [TanStack Router 官方文档](https://tanstack.com/router)
- [TanStack Query 官方文档](https://tanstack.com/query)
- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [React 19 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**Happy Coding! 🎉**
