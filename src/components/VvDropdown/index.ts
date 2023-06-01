import type { PropType } from 'vue'
import { DropdownProps, IdProps, ModifiersProps } from '../../props'
import { DropdownRole } from '../../constants'

export const VvDropdownProps = {
	...IdProps,
	...DropdownProps,
	...ModifiersProps,
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
