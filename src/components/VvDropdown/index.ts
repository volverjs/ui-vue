import type { PropType } from 'vue'
import { DisabledProps, ModifiersProps } from '@/props'

export interface Option {
	[key: string]: unknown
	disabled?: boolean
}

export const VvDropdownProps = {
	...DisabledProps,
	...ModifiersProps,
	/**
	 * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
	 */
	modelValue: {
		type: [String, Number, Boolean, Object, Array],
		required: true
	},
	/**
	 * Label of "no results" options
	 */
	labelNoResult: { type: String, default: 'No results' },
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
	 * Used when options are objects: key to use for option label
	 */
	labelKey: { type: String, default: 'label' },
	/**
	 * Used when options are objects: key to use for option label
	 */
	valueKey: { type: String, default: 'value' }
}
