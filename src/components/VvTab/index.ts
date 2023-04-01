import { ModifiersProps } from '@/props'
import type { NavItem } from '../VvNav'

export const VvTabProps = {
	...ModifiersProps,
	items: {
		type: Array<NavItem>,
		required: true,
		default: () => [],
	},
}

export const VvTabEvents = ['click']
