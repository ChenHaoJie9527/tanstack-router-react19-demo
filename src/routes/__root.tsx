import type { AppStoreType } from "@/stores/useAppStore"
import { Button, Layout, Nav } from "@douyinfe/semi-ui"
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

// 定义路由器上下文类型
interface MyRouterContext {
	useStore: AppStoreType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
})

function RootComponent() {
	const { Header, Content } = Layout
	// 从路由器上下文获取 store hook
	const { useStore } = Route.useRouteContext()
	// 调用 hook 获取状态 - 完整的 TypeScript 支持
	const { user, theme, login, setTheme } = useStore()

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Header style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
				<Nav mode="horizontal">
					<Nav.Item
						itemKey="home"
						text={
							<Link to="/" activeOptions={{ exact: true }}>
								Home
							</Link>
						}
					/>
					<Nav.Item itemKey="about" text={<Link to="/about">About</Link>} />
					<Nav.Item itemKey="notes" text={<Link to="/notes">Notes</Link>} />
					<Nav.Item itemKey="minimal-demo" text={<Link to="/minimal-demo">最小示例</Link>} />
					<Nav.Item itemKey="context-demo" text={<Link to="/context-demo">上下文演示</Link>} />
					<Nav.Item itemKey="state-demo" text={<Link to="/state-demo">状态演示</Link>} />

					{/* 使用路由器上下文中的状态 */}
					<Nav.Item
						itemKey="user"
						style={{ marginLeft: "auto" }}
						text={
							user ? (
								<span>欢迎，{user.name}</span>
							) : (
								<Button onClick={() => login({ name: "用户" })}>登录</Button>
							)
						}
					/>

					<Nav.Item
						itemKey="theme"
						text={
							<Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
								{theme === "light" ? "🌙" : "☀️"}
							</Button>
						}
					/>
				</Nav>
			</Header>
			<Content>
				<Outlet />
			</Content>
			<TanStackRouterDevtools />
		</Layout>
	)
}
