import { Button, Card, Input, Typography } from "@douyinfe/semi-ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/state-demo")({
	component: StateDemoComponent,
})

function StateDemoComponent() {
	// 从路由器上下文获取 store hook
	const { useStore } = Route.useRouteContext()
	// 调用 hook 获取状态 - 完整的 TypeScript 支持
	const {
		user,
		theme,
		notes,
		searchQuery,
		selectedFolder,
		login,
		logout,
		setTheme,
		addNote,
		setSearchQuery,
		setSelectedFolder,
		getFilteredNotes,
	} = useStore()

	const filteredNotes = getFilteredNotes()

	return (
		<div className="p-6 space-y-6">
			<Typography.Title heading={2}>状态管理器集成演示</Typography.Title>

			{/* 用户状态 */}
			<Card title="用户状态">
				<div className="space-y-4">
					<p>当前用户: {user ? user.name : "未登录"}</p>
					<div className="flex gap-2">
						{user ? (
							<Button onClick={logout}>退出登录</Button>
						) : (
							<Button onClick={() => login({ name: "演示用户" })}>登录</Button>
						)}
					</div>
				</div>
			</Card>

			{/* 主题状态 */}
			<Card title="主题状态">
				<div className="space-y-4">
					<p>当前主题: {theme}</p>
					<Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>切换主题</Button>
				</div>
			</Card>

			{/* 备忘录管理 */}
			<Card title="备忘录管理">
				<div className="space-y-4">
					<div className="flex gap-2">
						<Input
							placeholder="搜索备忘录"
							value={searchQuery}
							onChange={setSearchQuery}
							style={{ width: 200 }}
						/>
						<select
							value={selectedFolder}
							onChange={(e) => setSelectedFolder(e.target.value)}
							className="px-3 py-1 border rounded"
						>
							<option value="all">所有</option>
							<option value="work">工作</option>
							<option value="personal">个人</option>
						</select>
					</div>

					<Button
						onClick={() =>
							addNote({
								title: "新备忘录",
								content: "这是通过状态管理器添加的备忘录",
								createdAt: new Date().toLocaleDateString(),
								updatedAt: new Date().toLocaleTimeString(),
								folderId: "personal",
							})
						}
					>
						添加备忘录
					</Button>

					<div className="space-y-2">
						<p>备忘录数量: {notes.length}</p>
						<p>过滤后数量: {filteredNotes.length}</p>
						{filteredNotes.map((note) => (
							<div key={note.id} className="p-2 border rounded">
								<h4 className="font-semibold">{note.title}</h4>
								<p className="text-sm text-gray-600">{note.content}</p>
								<p className="text-xs text-gray-400">{note.createdAt}</p>
							</div>
						))}
					</div>
				</div>
			</Card>
		</div>
	)
}
