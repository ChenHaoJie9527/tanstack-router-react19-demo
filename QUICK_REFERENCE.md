# 快速参考手册

> 常用代码片段和使用模式的快速查询手册

## 📌 基础用法

### 获取 Store

```typescript
const { useStore } = Route.useRouteContext()
```

### 订阅状态

```typescript
// 方式 1：解构（简单场景）
const { user, theme } = useStore()

// 方式 2：选择器（推荐）
const theme = useStore((state) => state.theme)

// 方式 3：多个字段 + 浅比较
import { shallow } from 'zustand/shallow'
const { user, theme } = useStore(
  (state) => ({ user: state.user, theme: state.theme }),
  shallow
)

// 方式 4：useShallow（最推荐）
import { useShallow } from 'zustand/react/shallow'
const { user, theme } = useStore(
  useShallow((state) => ({ user: state.user, theme: state.theme }))
)
```

### 获取 Actions

```typescript
// 只获取方法，不订阅状态
const login = useStore((state) => state.login)
const setTheme = useStore((state) => state.setTheme)
```

## 🎯 常见模式

### 派生状态

```typescript
// 在选择器中计算
const isLoggedIn = useStore((state) => state.user !== null)
const noteCount = useStore((state) => state.notes.length)

// 复杂计算
const filteredNotes = useStore((state) => {
  const { notes, searchQuery } = state
  return notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
})
```

### 条件渲染

```typescript
function Component() {
  const { useStore } = Route.useRouteContext()
  const user = useStore((state) => state.user)
  
  if (!user) {
    return <LoginPrompt />
  }
  
  return <Dashboard user={user} />
}
```

### 表单处理

```typescript
function LoginForm() {
  const { useStore } = Route.useRouteContext()
  const login = useStore((state) => state.login)
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    login({ name })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      <button type="submit">登录</button>
    </form>
  )
}
```

### 列表渲染

```typescript
function NotesList() {
  const { useStore } = Route.useRouteContext()
  const notes = useStore((state) => state.notes)
  
  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  )
}
```

## 🔧 高级用法

### 在事件处理器中使用

```typescript
function Component() {
  const { useStore } = Route.useRouteContext()
  
  const handleClick = () => {
    // 获取当前状态快照
    const state = useStore.getState()
    console.log('当前状态:', state)
    
    // 直接修改状态
    useStore.setState({ theme: 'dark' })
    
    // 基于当前状态更新
    useStore.setState((prev) => ({
      notes: [...prev.notes, newNote]
    }))
  }
  
  return <button onClick={handleClick}>操作</button>
}
```

### 订阅状态变化

```typescript
function Component() {
  const { useStore } = Route.useRouteContext()
  
  useEffect(() => {
    // 订阅 theme 的变化
    const unsubscribe = useStore.subscribe(
      (state) => state.theme,
      (theme) => {
        console.log('主题变化:', theme)
        document.body.className = theme
      }
    )
    
    return unsubscribe
  }, [useStore])
  
  return <div>...</div>
}
```

### 在路由守卫中使用

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

### 在 Loader 中使用

```typescript
export const Route = createFileRoute('/dashboard')({
  loader: async ({ context }) => {
    const { useStore } = context
    const user = useStore.getState().user
    
    // 基于用户加载数据
    const data = await fetchUserData(user.id)
    return data
  }
})
```

## 📊 性能优化

### ✅ 推荐做法

```typescript
// 1. 使用选择器
const theme = useStore((state) => state.theme)

// 2. 使用浅比较
const { user, theme } = useStore(
  useShallow((state) => ({ user: state.user, theme: state.theme }))
)

// 3. 分离状态和 actions
const theme = useStore((state) => state.theme)
const setTheme = useStore((state) => state.setTheme)

// 4. 派生状态在选择器中计算
const count = useStore((state) => state.notes.length)
```

### ❌ 避免做法

```typescript
// 1. 订阅整个 store
const state = useStore()  // 任何变化都会重渲染

// 2. 在组件中计算派生状态
const { notes } = useStore()
const count = notes.length  // 不如在选择器中计算

// 3. 不必要的解构
const { user, theme, notes, searchQuery, selectedFolder } = useStore()
// 只用了 user，但订阅了所有字段
```

## 🎨 UI 模式

### 加载状态

```typescript
function Component() {
  const { useStore } = Route.useRouteContext()
  const [loading, setLoading] = useState(false)
  const addNote = useStore((state) => state.addNote)
  
  const handleAdd = async () => {
    setLoading(true)
    try {
      await addNote(newNote)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button onClick={handleAdd} disabled={loading}>
      {loading ? '添加中...' : '添加'}
    </button>
  )
}
```

### 乐观更新

```typescript
function Component() {
  const { useStore } = Route.useRouteContext()
  const updateNote = useStore((state) => state.updateNote)
  
  const handleUpdate = async (id: string, updates: any) => {
    // 乐观更新
    updateNote(id, updates)
    
    try {
      // 发送到服务器
      await api.updateNote(id, updates)
    } catch (error) {
      // 失败时回滚
      updateNote(id, originalData)
    }
  }
  
  return <button onClick={() => handleUpdate(id, data)}>更新</button>
}
```

### 条件渲染 + 加载

```typescript
function Component() {
  const { useStore } = Route.useRouteContext()
  const user = useStore((state) => state.user)
  const notes = useStore((state) => state.notes)
  
  if (!user) {
    return <LoginPrompt />
  }
  
  if (notes.length === 0) {
    return <EmptyState />
  }
  
  return <NotesList notes={notes} />
}
```

## 🧪 测试

### Mock Store

```typescript
// 测试文件
const mockStore = create<AppStore>()(() => ({
  user: { name: 'Test User' },
  theme: 'light',
  login: vi.fn(),
  setTheme: vi.fn(),
  // ... 其他方法
}))

// 在测试中使用
const router = createRouter({
  routeTree,
  context: {
    useStore: mockStore
  }
})
```

## 📝 类型定义

### 扩展上下文类型

```typescript
// src/types/index.ts
import type { AppStoreType } from '@/stores/useAppStore'

export interface MyRouterContext {
  useStore: AppStoreType
  // 可以添加其他上下文
  apiClient?: ApiClient
  analytics?: Analytics
}
```

### 在路由中使用

```typescript
import type { MyRouterContext } from '@/types'

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})
```

## 🔗 相关链接

- [完整文档 - README.md](./README.md)
- [技术详解 - ROUTER_CONTEXT.md](./ROUTER_CONTEXT.md)
- [TanStack Router 文档](https://tanstack.com/router)
- [Zustand 文档](https://github.com/pmndrs/zustand)

---

**提示**: 使用 `Cmd/Ctrl + F` 快速搜索您需要的代码片段！

