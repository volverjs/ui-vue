import {
	ValidProps,
	InvalidProps,
	HintProps,
	LoadingProps,
	DisabledProps,
	ReadonlyProps,
	ModifiersProps,
	OptionsProps,
	IconProps,
	TabindexProps
} from '@/props'

export const VvComboboxEvents = ['update:modelValue', 'change:search']

export const VvComboboxProps = {
	...TabindexProps,
	...ValidProps,
	...InvalidProps,
	...HintProps,
	...LoadingProps,
	...DisabledProps,
	...ReadonlyProps,
	...ModifiersProps,
	...OptionsProps,
	...IconProps,
	/**
	 * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
	 */
	modelValue: {
		type: [String, Number, Boolean, Object, Array],
		default: undefined
	},
	/**
	 * Select input label
	 */
	label: String,
	/**
	 * Label of "no results" options
	 */
	labelNoResults: { type: String, default: 'No results' },
	/**
	 * Select input placeholder
	 */
	placeholder: String,
	/**
	 * Use input text to search on options
	 */
	searchable: Boolean,
	/**
	 * On searchable select is the input search placeholder
	 */
	searchPlaceholder: String,
	/**
	 * The input search debounce time in ms
	 */
	debounceSearch: {
		type: [Number, String],
		default: 0
	},
	/**
	 * Manage modelValue as string[] or object[]
	 */
	multiple: Boolean,
	/**
	 * The max number of selected values
	 */
	maxValues: [Number, String],
	/**
	 * The select label separator visible to the user
	 */
	separator: { type: String, default: ', ' },
	/**
	 * Show native select
	 */
	native: Boolean
}
