import { ModifiersProps } from '@/props'

export type NavHeading = {
	title?: string
	items: Array<NavItem>
}

export type NavItem = {
	title?: string
	to?: string | { [key: string]: unknown }
	href?: string
	disabled?: boolean
	on: () => void
}

export const VvNavProps = {
	...ModifiersProps,
	items: {
		type: Array<NavHeading>,
		required: true,
		default: () => [],
	},
}
