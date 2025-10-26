import { RouterProvider, createRouter } from "@tanstack/react-router"
import "./App.css"

import { ApiProvider, useApi } from "@/providers/api-provider"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/query-client"
// 导入自动生成的路由树
import { routeTree } from "./routeTree.gen"
import { useAppStore } from "./stores/useAppStore"

// 定义路由器上下文类型 - 存储 store hook 本身

// 创建路由器实例，提供 store hook
const router = createRouter({
	routeTree,
	context: {
		useStore: useAppStore, // 直接传递 hook 函数
		queryClient, // 直接传递 queryClient 实例
		useApi,
	},
})

// 为 TypeScript 注册路由器类型
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
			</ApiProvider>
		</QueryClientProvider>
	)
}

export default App
