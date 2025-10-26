// 模拟 API 服务
export const api = {
	// 获取用户信息
	async getUser(userId: string) {
		await new Promise((resolve) => setTimeout(resolve, 1000))
		return {
			id: userId,
			name: "张三",
			email: "zhangsan@example.com",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
		}
	},
	// 获取单个备忘录
	async getNote(noteId: string) {
		await new Promise((resolve) => setTimeout(resolve, 800))
		return {
			id: noteId,
			title: "会议记录",
			content: "今天的会议讨论了...",
		}
	},

	// 获取备忘录列表
	async getNotes() {
		await new Promise((resolve) => setTimeout(resolve, 800))
		return [
			{
				id: "1",
				title: "会议记录",
				content: "今天的会议讨论了...",
				createdAt: "2024-01-15",
				folderId: "work",
			},
			// ... 更多数据
		]
	},

	// 创建备忘录
	async createNote(data: { title: string; content: string; folderId: string }) {
		await new Promise((resolve) => setTimeout(resolve, 500))
		return {
			id: Date.now().toString(),
			...data,
			createdAt: new Date().toISOString(),
		}
	},

	// 更新备忘录
	async updateNote(id: string, data: Partial<any>) {
		await new Promise((resolve) => setTimeout(resolve, 500))
		return { id, ...data }
	},

	// 删除备忘录
	async deleteNote(id: string) {
		await new Promise((resolve) => setTimeout(resolve, 500))
		return { success: true }
	},
}
