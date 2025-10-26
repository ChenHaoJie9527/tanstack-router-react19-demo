# 更新日志

本项目的所有重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [2.0.0] - 2025-10-26

### 🎉 重大更新 - TanStack Query 集成

#### 新增功能
- ✨ **TanStack Query 5.x** 集成 - 完整的服务端状态管理
- ✨ **API Hooks 工厂模式** - 集中管理所有 API 调用
- ✨ **双层状态管理架构**
  - Zustand - 客户端状态（UI、偏好）
  - TanStack Query - 服务端状态（API 数据）
- ✨ **新示例页面**
  - `/notes-api` - API Hooks 使用示例
  - `/notes-prefetch` - 数据预加载示例
  - `/notes/$noteId` - 动态路由 + 预加载
- ✨ **API Provider** - 统一的 API Hooks 提供者
- ✨ **Query Keys 管理** - 类型安全的缓存键管理
- ✨ **自动缓存失效** - Mutation 后自动刷新相关数据

#### 架构改进
- 🏗 **职责分离** - 明确区分客户端和服务端状态
- 🏗 **依赖注入** - 通过路由器上下文注入 `useApi`
- 🏗 **工厂模式** - 可复用的 API Hooks 创建模式
- 🏗 **类型安全** - 完整的 TypeScript 类型推断

#### 新增文件
- `src/api/factory.ts` - API Hooks 工厂
- `src/api/index.ts` - Mock API 服务
- `src/providers/api-provider.tsx` - API Hooks Provider
- `src/lib/queryClient.ts` - Query Client 配置
- `src/routes/notes-api.tsx` - API Hooks 示例
- `src/routes/notes-prefetch.tsx` - 预加载示例

#### 文档更新
- 📚 **README.md** - 添加 TanStack Query 使用指南
- 📚 **QUICK_REFERENCE.md** - 添加 API Hooks 代码片段
- 📚 **DOCUMENTATION.md** - 更新学习路径和示例
- 📚 新增混合使用 Zustand + TanStack Query 的模式
- 📚 新增 API Hooks 工厂创建完整示例

#### 开发工具
- 🛠 **React Query DevTools** - 可视化查询和缓存状态
- 🛠 更新依赖包
  - `@tanstack/react-query@^5.51.11`
  - `@tanstack/react-query-devtools@^5.51.11`

#### 性能优化
- ⚡ 路由级别数据预加载 - 减少加载闪烁
- ⚡ 智能缓存管理 - 减少不必要的网络请求
- ⚡ 自动后台刷新 - 保持数据新鲜度

### 破坏性变更
- 🔴 `MyRouterContext` 类型新增 `useApi` 字段
- 🔴 需要在 `App.tsx` 中添加 `ApiProvider` 包裹

### 迁移指南
```typescript
// 1. 更新路由器上下文类型
interface MyRouterContext {
  useStore: AppStoreType
  queryClient: QueryClient
  useApi: () => ApiHooks  // 新增
}

// 2. 在 App.tsx 中添加 ApiProvider
<QueryClientProvider client={queryClient}>
  <ApiProvider>  {/* 新增 */}
    <RouterProvider router={router} />
  </ApiProvider>
</QueryClientProvider>

// 3. 在组件中使用
const { useApi } = Route.useRouteContext()
const api = useApi()
const { data } = api.useNotes()
```

---

## [1.0.0] - 2025-10-26

### 新增
- ✨ 完整的 TanStack Router + Zustand 集成方案
- ✨ 类型安全的路由器上下文实现
- ✨ 多个示例页面展示不同使用场景
  - 首页 - 基础示例
  - 最小示例 (`/minimal-demo`)
  - 上下文演示 (`/context-demo`)
  - 状态演示 (`/state-demo`)
  - 备忘录系统 (`/notes`)
- ✨ 完整的文档体系
  - README.md - 主文档
  - ROUTER_CONTEXT.md - 技术深度解析
  - QUICK_REFERENCE.md - 快速参考手册
  - DOCUMENTATION.md - 文档索引
- ✨ Zustand store 实现
  - 用户状态管理
  - 主题切换
  - 备忘录 CRUD 操作
  - 搜索和过滤功能
- ✨ 持久化支持（localStorage）
- ✨ DevTools 集成

### 技术特性
- 🎯 完整的 TypeScript 支持
- 🎯 细粒度的状态订阅
- 🎯 性能优化（函数引用传递）
- 🎯 路由守卫支持
- 🎯 上下文继承和扩展
- 🎯 自动类型推断

### 开发工具
- 🛠 Biome 代码检查和格式化
- 🛠 TypeScript 5.9
- 🛠 Vite 7.1 构建工具
- 🛠 TanStack Router DevTools

### 文档
- 📚 详细的使用指南
- 📚 性能优化说明
- 📚 最佳实践建议
- 📚 常见问题解答
- 📚 代码示例和模式

### UI/UX
- 🎨 Semi Design 组件库
- 🎨 响应式布局
- 🎨 主题切换功能
- 🎨 现代化的 UI 设计

## [未来计划]

### 计划新增
- [ ] 更多示例页面
- [ ] 单元测试
- [ ] E2E 测试
- [ ] 国际化支持
- [ ] 更多主题选项
- [ ] 服务端渲染示例

### 计划改进
- [ ] 性能监控
- [ ] 错误边界处理
- [ ] 更好的加载状态
- [ ] 离线支持
- [ ] PWA 功能

---

## 版本说明

### [主版本号] - 重大变更
- 不兼容的 API 修改
- 架构重大调整

### [次版本号] - 功能更新
- 新增功能
- 向后兼容的修改

### [修订号] - Bug 修复
- 向后兼容的 bug 修复
- 文档更新
- 性能优化

---

[1.0.0]: https://github.com/yourusername/tanstack-router-react19.2/releases/tag/v1.0.0

