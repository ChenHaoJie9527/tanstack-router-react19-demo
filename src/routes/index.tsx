import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	component: IndexComponent,
})

function IndexComponent() {
	const { useStore } = Route.useRouteContext()
	const { theme } = useStore()
	console.log("render index")
	return (
		<div className="p-2">
			<h1 className="text-3xl font-bold">欢迎来到首页</h1>
			<p className="mt-4">这是使用 TanStack Router 构建的首页。</p>
			<p>当前主题: {theme}</p>
		</div>
	)
}
