import { DropdownProps, IdProps, ModifiersProps } from '@/props'
import type { PropType } from 'vue'

export const DROPDOWN_ROLES = ['listbox', 'menu'] as const
export const DROPDOWN_ITEM_ROLES = ['option', 'presentation'] as const

export type DropdownRole = (typeof DROPDOWN_ROLES)[number]
export type DropdownItemRole = (typeof DROPDOWN_ITEM_ROLES)[number]

export const VvDropdownProps = {
	...IdProps,
	...ModifiersProps,
	...DropdownProps,
	/**
	 * Show / hide dropdown programmatically
	 */
	modelValue: {
		type: Boolean,
		default: undefined,
	},
	/**
	 * Dropdown trigger element
	 */
	reference: {
		type: Object as PropType<HTMLElement | null>,
		default: null,
	},
	/**
	 * Dropdown role
	 */
	role: {
		type: String as PropType<DropdownRole>,
		default: DROPDOWN_ROLES[1],
		validate: (value: string) =>
			(DROPDOWN_ROLES as ReadonlyArray<string>).includes(value),
	},
}
