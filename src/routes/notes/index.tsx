import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/notes/")({
	component: NotesIndexComponent,
})

function NotesIndexComponent() {
	// 空组件，不显示任何内容
	return null
}
