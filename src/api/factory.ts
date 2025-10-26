import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query"
import { api } from "./index"

// query keys 管理
export const queryKeys = {
	notes: {
		all: ["notes"],
		lists: () => [...queryKeys.notes.all, "list"],
		list: (filters?: any) => [...queryKeys.notes.lists(), filters],
		details: () => [...queryKeys.notes.all, "detail"],
		detail: (id: string) => [...queryKeys.notes.details(), id],
	},
	users: {
		all: ["users"],
		detail: (id: string) => [...queryKeys.users.all, id],
	},
} as const

// 创建 API hooks 工厂函数
export function createApiHooks() {
	return {
		// ============ Notes API ============

		// 查询备忘录列表
		useNotes: (options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">) => {
			return useQuery({
				queryKey: queryKeys.notes.lists(),
				queryFn: api.getNotes,
				...options,
			})
		},

		// 查询单个备忘录
		useNote: (id: string, options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">) => {
			return useQuery({
				queryKey: queryKeys.notes.detail(id),
				queryFn: () => api.getNote(id),
				enabled: !!id,
				...options,
			})
		},

		// 创建备忘录
		useCreateNote: (options?: UseMutationOptions<any, Error, any>) => {
			const queryClient = useQueryClient()

			return useMutation({
				mutationFn: api.createNote,
				onSuccess: (data, variables, context) => {
					// 自动刷新列表
					queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() })
					// 调用用户自定义的 onSuccess
					options?.onSuccess?.(data, variables, undefined, { client: queryClient, meta: undefined })
				},
				...options,
			})
		},

		// 更新备忘录
		useUpdateNote: (options?: UseMutationOptions<any, Error, { id: string; data: any }>) => {
			const queryClient = useQueryClient()

			return useMutation({
				mutationFn: ({ id, data }) => api.updateNote(id, data),
				onSuccess: (data, variables, context) => {
					// 刷新列表和详情
					queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() })
					queryClient.invalidateQueries({ queryKey: queryKeys.notes.detail(variables.id) })
					options?.onSuccess?.(data, variables, undefined, { client: queryClient, meta: undefined })
				},
				...options,
			})
		},

		// 删除备忘录
		useDeleteNote: (options?: UseMutationOptions<any, Error, string>) => {
			const queryClient = useQueryClient()

			return useMutation({
				mutationFn: api.deleteNote,
				onSuccess: (data, variables, context) => {
					queryClient.invalidateQueries({ queryKey: queryKeys.notes.lists() })
					queryClient.removeQueries({ queryKey: queryKeys.notes.detail(variables) })
					options?.onSuccess?.(data, variables, undefined, { client: queryClient, meta: undefined })
				},
				...options,
			})
		},

		// ============ Users API ============

		useUser: (id: string, options?: Omit<UseQueryOptions<any>, "queryKey" | "queryFn">) => {
			return useQuery({
				queryKey: queryKeys.users.detail(id),
				queryFn: () => api.getUser(id),
				enabled: !!id,
				...options,
			})
		},

		// 可以继续添加更多 API hooks...
	}
}

export type ApiHooks = ReturnType<typeof createApiHooks>
