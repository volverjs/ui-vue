import { ModifiersProps } from '@/props'
import type { NavItemTab } from '@/types/nav'

export const VvTabProps = {
	...ModifiersProps,
	navModifiers: {
		type: [String, Array] as PropType<string | string[]>,
	},
	modelValue: {
		type: String,
		default: '',
	},
	items: {
		type: Array as PropType<NavItemTab[]>,
		default: () => [],
	},
}

export const VvTabEvents = ['update:modelValue']
