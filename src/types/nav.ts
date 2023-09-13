import type { AnchorTarget } from '@/constants'

export type NavItem = {
	label: string
	ariaLabel?: string
	title?: string
	to?: string | Record<string, unknown>
	href?: string
	target?: `${AnchorTarget}`
	rel?: string
	disabled?: boolean
	current?: boolean
	class?: string | string[]
	on?: Record<'click' | string, () => void>
}

export type NavItemTab = NavItem & {
	tab?: string
}
