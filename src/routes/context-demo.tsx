import { Button, Card, Typography } from "@douyinfe/semi-ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/context-demo")({
	component: ContextDemoComponent,
})

function ContextDemoComponent() {
	// 从路由器上下文获取 store hook
	const { useStore } = Route.useRouteContext()
	// 调用 hook 获取状态 - 完整的 TypeScript 支持
	const { user, theme, notes, login, setTheme, addNote } = useStore()
	return (
		<div className="p-6 space-y-6">
			<Typography.Title heading={2}>路由器上下文演示</Typography.Title>

			<Card title="当前状态">
				<div className="space-y-2">
					<p>用户: {user ? user.name : "未登录"}</p>
					<p>主题: {theme}</p>
					<p>备忘录数量: {notes.length}</p>
				</div>
			</Card>

			<Card title="操作">
				<div className="space-y-4">
					<div className="flex gap-2">
						<Button onClick={() => login({ name: "路由器用户" })}>登录</Button>
						<Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>切换主题</Button>
						<Button
							onClick={() =>
								addNote({
									title: "路由器创建的备忘录",
									content: "这是通过路由器上下文创建的备忘录",
									createdAt: new Date().toLocaleDateString(),
									updatedAt: new Date().toLocaleTimeString(),
									folderId: "personal",
								})
							}
						>
							添加备忘录
						</Button>
					</div>
				</div>
			</Card>

			<Card title="备忘录列表">
				<div className="space-y-2">
					{notes.map((note) => (
						<div key={note.id} className="p-2 border rounded">
							<h4 className="font-semibold">{note.title}</h4>
							<p className="text-sm text-gray-600">{note.content}</p>
							<p className="text-xs text-gray-400">{note.createdAt}</p>
						</div>
					))}
				</div>
			</Card>
		</div>
	)
}
