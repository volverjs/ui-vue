import type { PropType } from 'vue'
import {
	DropdownProps,
	IdProps,
	DisabledProps,
	ModifiersProps,
	SelectedProps,
	UnselectableProps,
} from '../../props'
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

export const VvDropdownItemProps = {
	focusOnHover: {
		type: Boolean,
		default: false,
	},
}

export const VvDropdownOptionProps = {
	...DisabledProps,
	...SelectedProps,
	...UnselectableProps,
	...ModifiersProps,
	deselectHintLabel: {
		type: String,
	},
	selectHintLabel: {
		type: String,
	},
	selectedHintLabel: {
		type: String,
	},
	focusOnHover: {
		type: Boolean,
		default: false,
	},
}
