import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface AppStore {
	user: { name: string } | null
	theme: "light" | "dark"
	sidebarCollapsed: boolean
	notes: Array<{
		id: string
		title: string
		content: string
		createdAt: string
		updatedAt: string
		folderId: string
	}>
	selectedNoteId: string | null
	searchQuery: string
	selectedFolder: string

	// Actions
	setUser: (user: { name: string } | null) => void
	setTheme: (theme: "light" | "dark") => void
	toggleSidebar: () => void
	login: (user: { name: string }) => void
	logout: () => void

	// 备忘录相关
	addNote: (note: Omit<AppStore["notes"][0], "id">) => void
	updateNote: (id: string, updates: Partial<AppStore["notes"][0]>) => void
	deleteNote: (id: string) => void
	setSelectedNote: (id: string | null) => void
	setSearchQuery: (query: string) => void
	setSelectedFolder: (folderId: string) => void
	getFilteredNotes: () => AppStore["notes"]
}

export const useAppStore = create<AppStore>()(
	devtools(
		persist(
			(set, get) => ({
				// 初始状态
				user: null,
				theme: "light",
				sidebarCollapsed: false,
				notes: [],
				selectedNoteId: null,
				searchQuery: "",
				selectedFolder: "all",

				// 用户相关操作
				setUser: (user) => set({ user }),
				setTheme: (theme) => set({ theme }),
				toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
				login: (user) => set({ user }),
				logout: () => set({ user: null }),

				// 备忘录相关操作
				addNote: (note) => {
					const newNote = {
						...note,
						id: Date.now().toString(),
					}
					set((state) => ({ notes: [...state.notes, newNote] }))
				},

				updateNote: (id, updates) => {
					set((state) => ({
						notes: state.notes.map((note) => (note.id === id ? { ...note, ...updates } : note)),
					}))
				},

				deleteNote: (id) => {
					set((state) => ({
						notes: state.notes.filter((note) => note.id !== id),
						selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
					}))
				},

				setSelectedNote: (id) => set({ selectedNoteId: id }),

				// 搜索和过滤
				setSearchQuery: (query) => set({ searchQuery: query }),
				setSelectedFolder: (folderId) => set({ selectedFolder: folderId }),

				// 获取过滤后的备忘录
				getFilteredNotes: () => {
					const { notes, searchQuery, selectedFolder } = get()

					let filtered = notes

					// 按文件夹过滤
					if (selectedFolder !== "all") {
						filtered = filtered.filter((note) => note.folderId === selectedFolder)
					}

					// 按搜索关键词过滤
					if (searchQuery) {
						filtered = filtered.filter(
							(note) =>
								note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
								note.content.toLowerCase().includes(searchQuery.toLowerCase())
						)
					}

					return filtered
				},
			}),
			{
				name: "app-storage",
				partialize: (state) => ({
					user: state.user,
					theme: state.theme,
					sidebarCollapsed: state.sidebarCollapsed,
					notes: state.notes,
				}),
			}
		),
		{
			name: "app-store",
		}
	)
)

export type AppStoreType = typeof useAppStore
