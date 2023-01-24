import { IdProps, ModifiersProps } from '@/props'
import type { flip, autoPlacement, shift, offset } from '@floating-ui/vue'
import type { PropType } from 'vue'

export const DROPDOWN_PLACEMENTS = [
	'top',
	'top-start',
	'top-end',
	'bottom',
	'bottom-start',
	'bottom-end',
	'left',
	'left-start',
	'left-end',
	'right',
	'right-start',
	'right-end',
] as const
export const DROPDOWN_ROLES = ['listbox', 'menu'] as const
export const DROPDOWN_ITEM_ROLES = ['option', 'presentation'] as const

export type AutoPlacementOptions = Parameters<typeof autoPlacement>[0]
export type FlipOptions = Parameters<typeof flip>[0]
export type ShiftOptions = Parameters<typeof shift>[0]
export type OffsetOptions = Parameters<typeof offset>[0]
export type DropdownPlacement = (typeof DROPDOWN_PLACEMENTS)[number]
export type DropdownRole = (typeof DROPDOWN_ROLES)[number]
export type DropdownItemRole = (typeof DROPDOWN_ITEM_ROLES)[number]

export const VvDropdownProps = {
	...IdProps,
	...ModifiersProps,
	/**
	 * Dropdown placement
	 */
	placement: {
		type: String as PropType<DropdownPlacement>,
		default: 'bottom',
		validate: (value: string) =>
			(DROPDOWN_PLACEMENTS as ReadonlyArray<string>).includes(value),
	},
	/**
	 * Dropdown show / hide transition name
	 */
	transitionName: {
		type: String,
	},
	/**
	 * Offset of the dropdown from the trigger
	 * @see https://floating-ui.com/docs/offset
	 */
	offset: {
		type: [Number, String, Object] as PropType<
			OffsetOptions | number | string
		>,
		default: 0,
	},
	/**
	 * Move dropdown to the side if there is no space in the default position
	 * @see https://floating-ui.com/docs/shift
	 */
	shift: {
		type: [Boolean, Object] as PropType<ShiftOptions | boolean>,
		default: true,
	},
	/**
	 * Flip dropdown position if there is no space in the default position
	 * @see https://floating-ui.com/docs/flip
	 */
	flip: {
		type: [Boolean, Object] as PropType<FlipOptions | boolean>,
		default: true,
	},
	/**
	 * Automatically change the position of the dropdown
	 * @see https://floating-ui.com/docs/autoPlacement
	 */
	autoPlacement: {
		type: [Boolean, Object] as PropType<AutoPlacementOptions | boolean>,
		default: false,
	},
	/**
	 * Add arrow to the dropdown
	 * @see https://floating-ui.com/docs/arrow
	 */
	arrow: {
		type: Boolean,
		default: false,
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
		type: String as PropType<DropdownRole>,
		default: DROPDOWN_ROLES[1],
		validate: (value: string) =>
			(DROPDOWN_ROLES as ReadonlyArray<string>).includes(value),
	},
	/**
	 * Close dropdown on click outside
	 */
	autoClose: {
		type: Boolean,
		default: true,
	},
	/**
	 * Autofocus first item on dropdown open
	 */
	autofocusFirst: {
		type: Boolean,
		default: true,
	},
	/**
	 * Set dropdown width to the same as the trigger
	 */
	triggerWidth: {
		type: Boolean,
	},
}
