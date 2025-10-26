import type { ApiHooks } from "@/api/factory"
import type { AppStoreType } from "@/stores/useAppStore"
import type { QueryClient } from "@tanstack/react-query"

export interface MyRouterContext {
	useStore: AppStoreType
	queryClient: QueryClient
	useApi: () => ApiHooks
}
