import type { PropType } from 'vue'
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
	TabindexProps,
	FloatingLabelProps,
	UnselectableProps,
	IdNameProps,
	DropdownProps,
} from '@/props'

export const VvComboboxEvents = [
	'update:modelValue',
	'change:search',
	'focus',
	'blur',
]

export const VvComboboxProps = {
	...IdNameProps,
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
	...FloatingLabelProps,
	...UnselectableProps,
	...DropdownProps,
	/**
	 * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
	 */
	modelValue: {
		type: [String, Number, Boolean, Object, Array],
		default: undefined,
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
		default: 0,
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
	native: Boolean,
	/**
	 * Set dropdown width to the same as the trigger
	 */
	triggerWidth: {
		...DropdownProps.triggerWidth,
		default: true,
	},
	/**
	 * Dropdown modifiers
	 */
	dropdownModifiers: {
		type: [String, Array] as PropType<string | Array<string>>,
	},
}
