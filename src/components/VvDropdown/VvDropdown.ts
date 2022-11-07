import type { PropType } from 'vue'
import { DisabledProps, ModifiersProps } from '../../props'

export interface Option {
	[key: string]: any
}

export const VvDropdownProps = {
	...DisabledProps,
	...ModifiersProps,
	/**
	 * modelValue can be an Object, a String or an Array of Object/String
	 */
	modelValue: [String, Array, Object],
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
	 * Manage modelValue as string[] or object[]
	 */
	multiple: Boolean,
	/**
	 * Used when options are objects: key to use for option label
	 */
	labelKey: { type: String, default: 'label' },
	/**
	 * Used when options are objects: key to use for option label
	 */
	valueKey: { type: String, default: 'value' }
}
