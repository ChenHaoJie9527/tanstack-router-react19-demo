import { type ApiHooks, createApiHooks } from "@/api/factory"
import { type ReactNode, createContext, useContext } from "react"

const ApiContext = createContext<ApiHooks | null>(null)

export function ApiProvider({ children }: { children: ReactNode }) {
	const apiHooks = createApiHooks()

	return <ApiContext.Provider value={apiHooks}>{children}</ApiContext.Provider>
}

export function useApi() {
	const context = useContext(ApiContext)
	if (!context) {
		throw new Error("useApi must be used within ApiProvider")
	}
	return context
}
