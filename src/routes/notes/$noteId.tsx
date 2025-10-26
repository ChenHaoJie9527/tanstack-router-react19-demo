import { api } from "@/api"
import { queryKeys } from "@/api/factory"
import { Empty, Spin, Typography } from "@douyinfe/semi-ui"
import { createFileRoute } from "@tanstack/react-router"
import styles from "./styles/noteDetail.module.scss"

export const Route = createFileRoute("/notes/$noteId")({
	component: NoteDetailComponent,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData({
			queryKey: queryKeys.notes.detail(params.noteId),
			queryFn: () => api.getNote(params.noteId),
		})
	},
})

function NoteDetailComponent() {
	const { noteId } = Route.useParams()
	const { useApi } = Route.useRouteContext()
	const api = useApi()
	const { Title, Paragraph, Text } = Typography
	const { data: note, isLoading, error } = api.useNote(noteId)

	if (isLoading) {
		return <Spin size="large" />
	}

	if (error) {
		return <div>加载失败: {error.message}</div>
	}

	if (!note) {
		return (
			<div className={styles.emptyState}>
				<Empty title="备忘录不存在" description={`找不到 ID 为 ${noteId} 的备忘录`} />
			</div>
		)
	}

	return (
		<div className={styles.noteDetail}>
			{/* 头部信息 */}
			<div className={styles.noteHeader}>
				<div className={styles.noteMeta}>
					<Text type="tertiary" className={styles.noteMetaDate}>
						{note.createdAt}
					</Text>
					<Text type="tertiary" className={styles.noteMetaDate}>
						{note.updatedAt}
					</Text>
				</div>
			</div>

			{/* 内容区域 */}
			<div className={styles.noteContent}>
				<Title heading={3} className={styles.noteTitle}>
					{note.title}
				</Title>
				<Paragraph className={styles.noteBody}>{note.content}</Paragraph>
			</div>
		</div>
	)
}
