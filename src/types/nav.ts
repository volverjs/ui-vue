export type NavItem = {
	label: string
	ariaLabel?: string
	title?: string
	to?: string | Record<string, unknown>
	href?: string
	target?: string
	rel?: string
	disabled?: boolean
	current?: boolean
	class?: string | string[]
	on?: Record<'click' | string, () => void>
	data?: Record<string, unknown>
}

export type NavItemTab = NavItem & {
	tab?: string
}
