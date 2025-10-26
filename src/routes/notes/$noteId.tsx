import { createFileRoute } from "@tanstack/react-router"
import { mockNotes } from "./route"
import { Typography, Empty } from "@douyinfe/semi-ui"
import styles from "./styles/noteDetail.module.scss"

export const Route = createFileRoute("/notes/$noteId")({
	component: NoteDetailComponent,
})

function NoteDetailComponent() {
	const { noteId } = Route.useParams()
	const { Title, Paragraph, Text } = Typography
	const note = mockNotes.find((n) => n.id === noteId)

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
