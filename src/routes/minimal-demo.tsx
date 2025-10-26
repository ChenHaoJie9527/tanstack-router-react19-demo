import { Button, Typography } from "@douyinfe/semi-ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/minimal-demo")({
	component: MinimalDemoComponent,
})

function MinimalDemoComponent() {
	// 从路由器上下文获取 store hook
	const { useStore } = Route.useRouteContext()
	// 调用 hook 获取状态 - 完整的 TypeScript 支持
	const { user, theme, login, setTheme } = useStore()

	return (
		<div className="p-6 space-y-4">
			<Typography.Title heading={2}>最小示例</Typography.Title>

			<div className="space-y-2">
				<p>用户: {user ? user.name : "未登录"}</p>
				<p>主题: {theme}</p>
			</div>

			<div className="flex gap-2">
				<Button onClick={() => login({ name: "测试用户" })}>登录</Button>
				<Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>切换主题</Button>
			</div>
		</div>
	)
}
