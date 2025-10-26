import { IconEditStroked } from "@douyinfe/semi-icons"
import { Button, Input, Typography } from "@douyinfe/semi-ui"
import { Link, Outlet, createFileRoute, useNavigate, useParams } from "@tanstack/react-router"
import { useEffect, useEffectEvent, useState } from "react"
import styles from "./styles/notes.module.scss"

// 模拟数据 - 按文件夹分组
const mockNotes = [
	{
		id: "1",
		title: "总监，上午好。我叫陈浩杰",
		content:
			"总监，上午好。我叫陈浩杰，是广东茂名人，会听会讲粤语，现居住在深圳宝安。我从事前端开发有6年左右的时间，擅长使用 React和 Vue 前端框架以及这两个生态系统的使用。我擅长SSR服务端Nextjs框架的使用，我抗压能力较强，与人主动沟通交流。在这6年时间里带待过不少的团队，在与人相处和项目开发中积累了许多经验，做过 To B 系统类项目，也做过 To C 商场类项目，并且也做过 Web3 区块链相关的项目也有涉猎。",
		createdAt: "2025/9/2",
		updatedAt: "09:28",
		folderId: "work",
	},
	{
		id: "2",
		title: "react-hook-form 重要性",
		content: "react-hook-form 是一个高性能、灵活且易于使用的表单验证库...",
		createdAt: "2025/6/8",
		updatedAt: "10:15",
		folderId: "work",
	},
	{
		id: "3",
		title: "学习笔记",
		content: "TanStack Router 特性：\n- 类型安全\n- 嵌套路由\n- URL 状态管理",
		createdAt: "2024/01/17",
		updatedAt: "14:20",
		folderId: "personal",
	},
	{
		id: "4",
		title: "旅行计划",
		content: "目的地：京都\n日期：3月15-20日\n预算：5000元",
		createdAt: "2024/01/18",
		updatedAt: "16:30",
		folderId: "personal",
	},
	{
		id: "5",
		title: "读书笔记",
		content: "《深入理解 TypeScript》\n第三章：类型推断和类型兼容性",
		createdAt: "2024/01/19",
		updatedAt: "09:45",
		folderId: "personal",
	},
]

const folders = [
	{ id: "all", name: "所有备忘录" },
	{ id: "work", name: "工作" },
	{ id: "personal", name: "个人" },
]

export const Route = createFileRoute("/notes")({
	component: NotesLayout,
})

const { Text } = Typography

function NotesLayout() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedFolder, setSelectedFolder] = useState("all")
	const navigate = useNavigate()
	const params = useParams({ strict: false }) // 获取当前路由参数
	const currentNoteId = (params as { noteId?: string }).noteId // 当前选中的备忘录ID

	// 根据选中的文件夹过滤备忘录
	const filteredByFolder =
		selectedFolder === "all"
			? mockNotes
			: mockNotes.filter((note) => note.folderId === selectedFolder)

	// 再根据搜索关键词过滤
	const filteredNotes = filteredByFolder.filter((note) =>
		note.title.toLowerCase().includes(searchQuery.toLowerCase())
	)

	// 计算每个文件夹的备忘录数量
	const getFolderCount = (folderId: string) => {
		if (folderId === "all") return mockNotes.length
		return mockNotes.filter((note) => note.folderId === folderId).length
	}

	// 使用 useEffectEvent 提取导航逻辑（不作为依赖项）
	const onFolderChange = useEffectEvent(() => {
		if (filteredNotes.length > 0) {
			// 有备忘录时，自动导航到第一条
			const firstNote = filteredNotes[0]
			navigate({
				to: "/notes/$noteId",
				params: { noteId: firstNote.id },
			})
		} else {
			// 空文件夹时，导航到空状态（清空右侧内容）
			navigate({ to: "/notes" })
		}
	})

	// 当选中文件夹时，触发导航逻辑
	useEffect(() => {
		onFolderChange()
	}, [selectedFolder]) // 只依赖 selectedFolder，其他值通过 Effect Event 访问

	return (
		<div className={styles.notesLayout}>
			{/* 左侧文件夹列表 */}
			<div className={styles.sidebar}>
				<div className={styles.sidebarHeader}>
					<Text strong>文件夹</Text>
				</div>
				{folders.map((folder) => (
					<div
						key={folder.id}
						onClick={() => setSelectedFolder(folder.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setSelectedFolder(folder.id)
							}
						}}
						className={`${styles.folderItem} ${selectedFolder === folder.id ? styles.active : ""}`}
					>
						<Text className={styles.folderName}>{folder.name}</Text>
						<Text type="tertiary" className={styles.folderCount}>
							{getFolderCount(folder.id)}
						</Text>
					</div>
				))}
			</div>

			{/* 中间备忘录列表 */}
			<div className={styles.notesList}>
				<div className={styles.searchBox}>
					<Input
						placeholder="搜索"
						value={searchQuery}
						onChange={setSearchQuery}
						style={{ width: "100%" }}
						size="small"
					/>
					<Button icon={<IconEditStroked />} type="tertiary" size="small" aria-label="创建" />
				</div>

				<div className={styles.notesScrollArea}>
					{filteredNotes.length === 0 ? (
						<div className={styles.emptyList}>
							<Text type="tertiary">该文件夹下暂无备忘录</Text>
						</div>
					) : (
						filteredNotes.map((note) => (
							<Link
								key={note.id}
								to="/notes/$noteId"
								params={{ noteId: note.id }}
								className={`${styles.noteItem} ${currentNoteId === note.id ? styles.active : ""}`}
							>
								<div className={styles.noteItemHeader}>
									<Text strong className={styles.noteTitle}>
										{note.title}
									</Text>
								</div>
								<div className={styles.noteItemMeta}>
									<Text type="tertiary" className={styles.noteDate}>
										{note.createdAt}
									</Text>
									<Text type="tertiary" className={styles.noteDate}>
										{note.updatedAt}
									</Text>
								</div>
								<Text type="secondary" className={styles.notePreview}>
									{note.content}
								</Text>
							</Link>
						))
					)}
				</div>
			</div>

			{/* 右侧内容区域 */}
			<div className={styles.contentArea}>
				<Outlet />
			</div>
		</div>
	)
}

// 导出数据供子路由使用
export { mockNotes }
