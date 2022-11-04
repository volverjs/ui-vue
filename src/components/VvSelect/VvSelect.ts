import type { PropType } from 'vue'
import {
	ValidProps,
	ErrorProps,
	HintProps,
	LoadingProps,
	DisabledProps,
	ReadonlyProps,
	ModifiersProps
} from '../../props'

export interface Option {
	[key: string]: any
}

export const VvSelectProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...LoadingProps,
	...DisabledProps,
	...ReadonlyProps,
	...ModifiersProps,
	/**
	 * modelValue can be an Object, a String or an Array of Object/String
	 */
	modelValue: {
		type: [String, Object],
		required: true
	},
	/**
	 * Select input label
	 */
	label: String,
	/**
	 * Select input placeholder
	 */
	placeholder: String,
	/**
	 * Select options, can be an Array of string or an array of objects
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
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-dropdown--'
	 */
	modifiers: [String, Array]
}
