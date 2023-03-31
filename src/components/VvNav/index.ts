import { ModifiersProps } from '@/props'

export type NavItem = {
	id?: string
	title: string
	to?: string | { [key: string]: unknown }
	href?: string
	disabled?: boolean
	on: () => void
}

export const VvNavProps = {
	...ModifiersProps,
	items: {
		type: Array<NavItem>,
		required: true,
		default: () => [],
	},
}

export const VvNavEvents = ['click']
