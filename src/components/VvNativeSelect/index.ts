import type { PropType } from 'vue'
import {
	ValidProps,
	ErrorProps,
	HintProps,
	LoadingProps,
	DisabledProps,
	ReadonlyProps,
	ModifiersProps
} from '@/props'

export interface Option {
	[key: string]: unknown
	disabled?: boolean
}

export const VvNativeSelectProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...LoadingProps,
	...DisabledProps,
	...ReadonlyProps,
	...ModifiersProps,
	/**
	 * Input id
	 */
	id: String,
	/**
	 * Input name
	 */
	name: { type: String, required: true },
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
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-native-select--'
	 */
	modifiers: [String, Array]
}

export const VvNativeSelectEmits = ['update:modelValue']
