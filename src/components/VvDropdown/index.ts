import {
	DisabledProps,
	IdNameProps,
	ModifiersProps,
	OptionsProps,
} from '@/props'

export const VvDropdownProps = {
	...IdNameProps,
	...OptionsProps,
	...DisabledProps,
	...ModifiersProps,
	/**
	 * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
	 */
	modelValue: {
		type: [String, Number, Boolean, Object, Array],
	},
	/**
	 * Label of "no results" options
	 */
	labelNoResults: { type: String, default: 'No results' },
	/**
	 * Manage modelValue as string[] or object[]
	 */
	multiple: Boolean,
	/**
	 * The max number of selected values
	 */
	maxValues: [Number, String],
	/**
	 * If true the input will be unselectable
	 */
	unselectable: { type: Boolean, default: true },
}
