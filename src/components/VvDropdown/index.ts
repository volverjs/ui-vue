import { DisabledProps, ModifiersProps, OptionsProps } from '@/props'

export const VvDropdownProps = {
	...OptionsProps,
	...DisabledProps,
	...ModifiersProps,
	/**
	 * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
	 */
	modelValue: {
		type: [String, Number, Boolean, Object, Array]
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
	maxValues: [Number, String]
}
