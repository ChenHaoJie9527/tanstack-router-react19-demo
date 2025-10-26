import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/about")({
	component: AboutComponent,
})

function AboutComponent() {
	return (
		<div className="p-2">
			<h1 className="text-3xl font-bold">关于页面</h1>
			<p className="mt-4">这是关于页面的内容。</p>
		</div>
	)
}
