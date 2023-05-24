import type { PropType } from 'vue'
import { DropdownProps, IdProps } from '../../props'
import { DropdownRole } from '../../constants'

export const VvDropdownProps = {
	...IdProps,
	...DropdownProps,
	/**
	 * Component BEM modifiers
	 */
	modifiers: {
		type: [String, Array] as PropType<string | string[]>,
		default: 'mobile',
	},
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
		type: String as PropType<`${DropdownRole}`>,
		default: DropdownRole.menu,
		validator: (value: DropdownRole) =>
			Object.values(DropdownRole).includes(value),
	},
}
