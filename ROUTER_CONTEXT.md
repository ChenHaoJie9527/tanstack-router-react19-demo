# TanStack Router 上下文机制详解

> 本文档是 README.md 的技术补充，深入解释路由器上下文的工作原理。

## 概述

本项目采用了将 Zustand 状态管理器集成到 TanStack Router 上下文中的架构方案。这是一种基于 React Context 的依赖注入模式。

## 核心实现

### 1. Store 定义 (`src/stores/useAppStore.ts`)

```typescript
export interface AppStore {
  user: { name: string } | null
  theme: "light" | "dark"
  // ... 其他状态
  login: (user: { name: string }) => void
  setTheme: (theme: "light" | "dark") => void
  // ... 其他方法
}

export const useAppStore = create<AppStore>()(
  devtools(persist(/* ... */))
)

// 导出 store 类型
export type AppStoreType = typeof useAppStore
```

### 2. 路由器配置 (`src/App.tsx`)

```typescript
interface MyRouterContext {
  useStore: AppStoreType
}

const router = createRouter({
  routeTree,
  context: {
    useStore: useAppStore, // 传递 store hook 本身
  } satisfies MyRouterContext,
})
```

### 3. 根路由定义 (`src/routes/__root.tsx`)

```typescript
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
  
  // ... 使用状态
}
```

### 4. 在任何路由组件中使用

```typescript
function AnyRouteComponent() {
  // 从路由器上下文获取 store hook
  const { useStore } = Route.useRouteContext()
  // 调用 hook 获取状态 - 完整的 TypeScript 支持
  const { user, theme, login, setTheme } = useStore()
  
  // ... 使用状态
}
```

## 优势

1. **完整的 TypeScript 支持**: 所有状态和方法都有类型提示
2. **响应式更新**: 状态变化会自动触发组件重新渲染
3. **符合 React 规范**: 在组件内部调用 hooks
4. **全局可用**: 所有路由组件都可以访问状态
5. **持久化**: 通过 Zustand 的 persist 中间件自动保存状态

## 使用示例

查看以下页面了解具体用法：
- `/minimal-demo` - 最小示例
- `/context-demo` - 上下文演示
- `/state-demo` - 完整状态管理演示

## 技术深度解析

### TanStack Router 内部实现原理（简化版）

```typescript
// TanStack Router 内部大概是这样实现的
const RouterContext = createContext<RouterInstance | null>(null)

function RouterProvider({ router, children }) {
  return (
    <RouterContext.Provider value={router}>
      {children}
    </RouterContext.Provider>
  )
}

function useRouteContext() {
  const router = useContext(RouterContext)
  // router.context 就是您在 createRouter 时传入的 context
  return router.context
}
```

### 为什么传递函数引用而不是状态？

#### 传统 Context 的问题

```typescript
// ❌ 传统方式：存储状态值
const StoreContext = createContext({ user: null, theme: 'light' })

function Provider({ children }) {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')
  
  // 问题：每次状态更新，value 对象都会重新创建
  const value = { user, theme, setUser, setTheme }
  
  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

// 问题：所有使用 useContext 的组件都会重渲染
function ComponentA() {
  const { user } = useContext(StoreContext)
  // theme 变化时，这个组件也会重渲染！
  return <div>{user?.name}</div>
}
```

#### 我们的解决方案

```typescript
// ✅ 我们的方式：存储函数引用
const router = createRouter({
  context: {
    useStore: useAppStore  // 函数引用，永远不变
  }
})

function ComponentA() {
  const { useStore } = Route.useRouteContext()  // 获取函数引用
  const user = useStore((state) => state.user)  // Zustand 细粒度订阅
  // 只有 user 变化时才重渲染
  return <div>{user?.name}</div>
}
```

### 性能优化原理

#### 1. Context 层面 - 引用稳定

```typescript
// useAppStore 是一个函数引用
// 在整个应用生命周期中，这个引用都不会改变
context: {
  useStore: useAppStore  // 稳定的引用
}

// 因此 Context value 永远不变
// → Context 消费者不会因为 Context value 变化而重渲染
```

#### 2. Zustand 层面 - 细粒度订阅

Zustand 内部实现了类似这样的机制：

```typescript
function create(initializer) {
  let state = initializer()
  const listeners = new Set()
  
  return function useStore(selector) {
    const [, forceUpdate] = useReducer(x => x + 1, 0)
    
    useEffect(() => {
      const listener = (newState) => {
        // 只有选择的部分变化时才触发更新
        const oldValue = selector(state)
        const newValue = selector(newState)
        
        if (!Object.is(oldValue, newValue)) {
          forceUpdate()
        }
      }
      
      listeners.add(listener)
      return () => listeners.delete(listener)
    }, [selector])
    
    return selector(state)
  }
}
```

### 与其他方案对比

#### 方案 1：直接导入 store（传统方式）

```typescript
// 每个文件都需要导入
import { useAppStore } from '@/stores/useAppStore'

function Component() {
  const { user } = useAppStore()
  return <div>{user?.name}</div>
}
```

**缺点**：
- ❌ 紧耦合，难以测试
- ❌ 无法在路由生命周期中访问
- ❌ 不利于模块化

#### 方案 2：React Context 包裹（传统方式）

```typescript
// 需要手动创建 Provider
const StoreContext = createContext(null)

function App() {
  return (
    <StoreContext.Provider value={useAppStore}>
      <Router />
    </StoreContext.Provider>
  )
}
```

**缺点**：
- ❌ 需要额外的 Provider 组件
- ❌ 与路由系统分离
- ❌ 需要手动管理类型

#### 方案 3：TanStack Router Context（我们的方案）

```typescript
const router = createRouter({
  context: { useStore: useAppStore }
})

function Component() {
  const { useStore } = Route.useRouteContext()
  const { user } = useStore()
  return <div>{user?.name}</div>
}
```

**优点**：
- ✅ 与路由系统深度集成
- ✅ 自动类型推断
- ✅ 可在路由生命周期中访问
- ✅ 支持上下文继承
- ✅ 更少的样板代码

### 类型系统工作原理

#### 1. 定义上下文类型

```typescript
// src/types/index.ts
export interface MyRouterContext {
  useStore: AppStoreType
}
```

#### 2. 在根路由中声明

```typescript
// src/routes/__root.tsx
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})
```

#### 3. 注册到全局类型

```typescript
// src/App.tsx
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
```

#### 4. 自动类型推断

现在在任何路由组件中：

```typescript
const { useStore } = Route.useRouteContext()
//      ^? useStore: AppStoreType (自动推断)

const { user, theme } = useStore()
//      ^? user: { name: string } | null (自动推断)
//      ^? theme: "light" | "dark" (自动推断)
```

### 上下文继承和扩展

子路由可以扩展父路由的上下文：

```typescript
// 父路由
export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    return {
      ...context,
      isAdmin: true,  // 添加新的上下文
      permissions: ['read', 'write']
    }
  }
})

// 子路由可以访问所有上下文
export const Route = createFileRoute('/admin/users')({
  component: () => {
    const { useStore, isAdmin, permissions } = Route.useRouteContext()
    //      ^? 可以访问 useStore、isAdmin 和 permissions
    
    return <div>管理员权限: {isAdmin ? '是' : '否'}</div>
  }
})
```

## 总结

这种架构模式结合了：
- **TanStack Router** - 路由系统和依赖注入
- **React Context** - 底层的上下文传递机制
- **Zustand** - 细粒度的状态管理
- **TypeScript** - 完整的类型安全

最终实现了一个高性能、类型安全、易于维护的状态管理方案。

