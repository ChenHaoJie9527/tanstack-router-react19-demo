import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 数据缓存时间:5分钟
			gcTime: 1000 * 60 * 10, // 数据回收时间:10分钟
			retry: 1, // 失败重试次数:1次
			refetchOnWindowFocus: false, // 窗口聚焦时不自动重新获取数据
		},
	},
})
