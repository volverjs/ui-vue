import type { PropType } from 'vue'
import type { Option } from '@/components/VvDropdown'
import {
	ValidProps,
	ErrorProps,
	HintProps,
	LoadingProps,
	DisabledProps,
	ReadonlyProps,
	ModifiersProps
} from '@/props'

export const VvSelectProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...LoadingProps,
	...DisabledProps,
	...ReadonlyProps,
	...ModifiersProps,
	/**
	 * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
	 */
	modelValue: {
		type: [String, Number, Boolean, Object, Array],
		required: true
	},
	/**
	 * Select input label
	 */
	label: String,
	/**
	 * Label of "no results" options
	 */
	labelNoResult: { type: String, default: 'No results' },
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
	 * the input search debounce time in ms
	 */
	debounceSearch: {
		type: [Number, String],
		default: 0
	},
	/**
	 * Select options, can be string[] or object[]
	 */
	options: {
		type: Array as PropType<Array<Option | string>>,
		required: true
	},
	/**
	 * Use objects as modelValue (object or object[])
	 */
	useObject: Boolean,
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
	 * Used when options are objects: key to use for option label
	 */
	labelKey: { type: String, default: 'label' },
	/**
	 * Used when options are objects: key to use for option label
	 */
	valueKey: { type: String, default: 'value' },
	/**
	 * Icon name of icon in left position
	 */
	iconLeft: String,
	/**
	 * Icon name of icon in right position
	 */
	iconRight: String,
	/**
	 * Icon name of icon in right position
	 */
	native: Boolean
}
