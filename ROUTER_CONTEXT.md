# TanStack Router + Zustand 集成方案

## 架构说明

本项目采用了将 Zustand 状态管理器集成到 TanStack Router 上下文中的架构方案。

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

