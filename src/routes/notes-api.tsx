import { Button, Card, Spin, Typography } from "@douyinfe/semi-ui"
// src/routes/notes-api.tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/notes-api")({
	component: NotesApiComponent,
})

function NotesApiComponent() {
	// ✅ 从路由器上下文获取 API hooks
	const { useApi } = Route.useRouteContext()
	const api = useApi()

	// ✅ 使用封装好的 hooks - 简洁优雅
	const {
		data: notes,
		isLoading,
		error,
	} = api.useNotes({
		staleTime: 1000 * 60 * 10, // 10分钟
		refetchInterval: 30000, // 每30秒重新获取一次
	})
	const createNote = api.useCreateNote()
	const deleteNote = api.useDeleteNote()

	const handleCreate = () => {
		createNote.mutate({
			title: "新备忘录",
			content: "通过 API Hooks 创建",
			folderId: "personal",
		})
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Spin size="large" />
			</div>
		)
	}

	if (error) {
		return <div>加载失败: {error.message}</div>
	}

	return (
		<div className="p-6 space-y-4">
			<Typography.Title heading={2}>API Hooks 示例</Typography.Title>

			<Button onClick={handleCreate} loading={createNote.isPending}>
				创建备忘录
			</Button>

			<div className="space-y-2">
				{notes?.map((note: any) => (
					<Card key={note.id} className="p-4">
						<div className="flex justify-between items-start">
							<div>
								<h3 className="font-semibold">{note.title}</h3>
								<p className="text-gray-600">{note.content}</p>
							</div>
							<Button
								type="danger"
								size="small"
								onClick={() => deleteNote.mutate(note.id)}
								loading={deleteNote.isPending}
							>
								删除
							</Button>
						</div>
					</Card>
				))}
			</div>
		</div>
	)
}
